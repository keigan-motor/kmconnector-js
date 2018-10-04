# -*- coding: utf-8 -*-

"""
Record audio from 4 mic array, and then search the keyword "snowboy".
After finding the keyword, Direction Of Arrival (DOA) is estimated.

The hardware is respeaker 4 mic array:
    https://www.seeedstudio.com/ReSpeaker-4-Mic-Array-for-Raspberry-Pi-p-2941.html
"""

import sys
import time
import math
import os
from threading import Timer


#from pykeigan_motor import KMControllers
import pykeigan_motor.KMControllers
from voice_engine.source import Source
from voice_engine.channel_picker import ChannelPicker
from voice_engine.kws import KWS
from voice_engine.doa_respeaker_4mic_array import DOA
from ReSpeakerV2api import ReSpeakerV2api

import warnings
warnings.filterwarnings('ignore')
pending_flg=False
mt_position=0
dev=None
reSpeakerV2api=ReSpeakerV2api()
def main():
    src = Source(rate=16000, channels=4, frames_size=320)
    ch1 = ChannelPicker(channels=4, pick=1)
    kws = KWS()
    doa = DOA(rate=16000)
    pending_flg=False
    mt_position=0#モーターの位置情報 posion
    respaker_top_offset_deg=-90 #respkearとの向き補正(degree) 上面を0とする
    src.link(ch1)
    ch1.link(kws)
    src.link(doa)


    # KM USBデバイスの取得 決め打ち 最初に見つかったUSBシリアルデバイス
    def get_kmSerialDev():
        # checkDev = (1027, 24597) #keigan Motor USB srial chip
        # usblist = [b.devices for b in usb.busses()]
        # usblist = [e for ilist in usblist for e in ilist]
        # usblist = [(b.idVendor, b.idProduct) for b in usblist]

        kmSerialDev = False
        for path in os.listdir('/dev/'):
            if ('ttyUSB' in path):
                kmSerialDev = '/dev/' + path

        if not kmSerialDev:
            sys.stderr.write('Not motor attached\n')
            # sys.exit("Error Not motor attached")


        # if checkDev in usblist:
        #     print(checkDev)

        # context = pyudev.Context()
        # a=pyudev.Devices.from_name(context, 'devices','usb1')
        # for device in context.list_devices():
        #     print(device)
        return kmSerialDev

    # ------------------------------#
    #   モーター制御 初期化
    # ------------------------------#
    def on_motor_measurement_cb(measurement):#モーターの座標CB on_motor_measurement_cb({'position':self.position,'velocity':self.velocity,'torque':self.torque})
        global mt_position
        mt_position=measurement['position']
        #print('mt_position {} '.format(mt_position))

    # USB切断等のエラー
    def on_motor_connection_error_cb(e):
        global dev
        dev=None
        print e
        connection_USBController_loop() #todo::メインスレッドへの委譲 現在サブスレッドから呼ばれている


    #USB接続
    def connection_USBController(kmSerialDev):
        global dev
        global mt_position

        print "connection_USBController"
        mt_position=0
        #global dev
        dev = pykeigan_motor.KMControllers.USBController(kmSerialDev)
        #起動後5秒間フリーで手動で位置合わせ->点滅->5s->低速回転
        dev.led(1, 100, 100,100)
        dev.disable()
        #dev.wait(5000)
        time.sleep(5)
        dev.led(2,0,200,0)#青
        #dev.wait(5000)
        time.sleep(5)
        dev.led(1, 0, 200, 100)
        dev.presetPosition(0)
        dev.wait(300)
        dev.enable()

        # dev.speed(1.0)
        # dev.runForward()

        dev.on_motor_measurement_cb = on_motor_measurement_cb
        dev.on_motor_connection_error_cb=on_motor_connection_error_cb

    #USB接続するまでLOOPする
    def connection_USBController_loop():
        while True:
            time.sleep(2000 / 1000)  # 2000ms
            kmSerialDev = get_kmSerialDev()
            if(kmSerialDev):
                connection_USBController(kmSerialDev)
                break


    # ------------------------------#
    #   キーワード検出時 モーター制御
    # ------------------------------#
    def pending_flg_clear():
        global pending_flg
        pending_flg=False

    def set_pending(timesec):
        global pending_flg
        pending_flg = True
        timer = Timer(timesec, pending_flg_clear)  # n秒間他のコマンドを受けつけない
        timer.start()

    #2点間の最小距離を返す
    def cal_between_two_points_short(from_rad,to_rad):
        r_rad=0
        cal=to_rad-from_rad
        if cal>math.pi:
            r_rad=to_rad-(math.pi*2)
        elif cal < -math.pi:
            r_rad = to_rad + (math.pi * 2)
        else:
            r_rad=to_rad
        return r_rad

    def on_detected(idx,keyword):

        global dev
        global mt_position
        global pending_flg

        if pending_flg or not dev:
            print('pending_flg:return')
            return

        position=reSpeakerV2api.get_direction()
        #pos_pespker_p_abs=(math.fabs(position-360)+respaker_top_offset_deg)%360
        pos_pespker_p_abs=(position+respaker_top_offset_deg)%360 #respkerのoffsetを360度のスケールでローテーションさせる
        pos_pespker_radi_abs = pos_pespker_p_abs * (math.pi / 180)  # 検出時のRESPKERの絶対座標 rad

        correction = (math.pi/180)  # 360度周辺でのfloatの揺らぎによる補正用(+1度)
        motor_radi_zero=math.floor((mt_position+correction)/(math.pi*2))*(math.pi*2)#モーターの360単位の0点座標 rad

        rad_sec_to_rpm=0.10471975511965977 # rpm ->rad/sec 変換定数
        dev.speed(30*rad_sec_to_rpm)
        #print('np/ps {}=>{} {} at direction:{} mtPos:{}  target pos:{}'.format(position,ps, keyword, pos_pespker_p_abs, mt_position,(motor_radi_zero +pos_pespker_radi_abs)))

        print('AGCONOFF {} AGCDESIREDLEVEL {}'.format(reSpeakerV2api.get_setting('AGCONOFF'),reSpeakerV2api.get_setting('AGCDESIREDLEVEL')))

        #回転処理
        if (keyword == "Alexa.pmdl"):
            set_pending(5)

            pos = cal_between_two_points_short(mt_position, motor_radi_zero + pos_pespker_radi_abs)
            dev.moveTo(pos)
            print(' direction:{} from/to {}=>{} '.format(keyword, mt_position, pos))

            dev.wait(500)
            dev.preparePlaybackMotion(0,1,1)
            dev.startPlaybackMotion()
            #dev.stopPlaybackMotion()

            #dev.startPlaybackMotionV2()
            # dev.speed(100*rad_sec_to_rpm)
            # sp = (math.pi / 180) * 40
            # dev.moveTo(motor_radi_zero+pos_pespker_radi_abs)
            # dev.wait(500)
            # dev.moveBy(sp)
            # dev.wait(500)
            # dev.moveBy(sp*-1)
            # dev.wait(500)
            # dev.moveTo(motor_radi_zero+pos_pespker_radi_abs)

        elif(keyword=="billikensan.pmdl"):
            set_pending(2)
            pos=cal_between_two_points_short(mt_position,motor_radi_zero + pos_pespker_radi_abs)
            dev.moveTo(pos)
            print(' direction:{} from/to {}=>{} '.format(keyword,mt_position,pos))

        elif (keyword == "nandeyanen.pmdl"):
            set_pending(2)
            pos = cal_between_two_points_short(mt_position, motor_radi_zero + pos_pespker_radi_abs)
            dev.moveTo(pos)
            print(' direction:{} from/to {}=>{} '.format(keyword, mt_position, pos))

        elif(keyword == "ohayougozaimasu.pmdl"):
            set_pending(2)
            pos = cal_between_two_points_short(mt_position, motor_radi_zero + pos_pespker_radi_abs)
            dev.moveTo(pos)
            print(' direction:{} from/to {}=>{} '.format(keyword, mt_position, pos))

        elif (keyword == "sokocyau.pmdl"):
            set_pending(2)
            pos = cal_between_two_points_short(mt_position, motor_radi_zero + pos_pespker_radi_abs)
            dev.moveTo(pos)
            print(' direction:{} from/to {}=>{} '.format(keyword, mt_position, pos))

        elif (keyword == "sokoya.pmdl"):
            set_pending(2)
            pos = cal_between_two_points_short(mt_position, motor_radi_zero + pos_pespker_radi_abs)
            dev.moveTo(pos)
            print(' direction:{} from/to {}=>{} '.format(keyword, mt_position, pos))

        elif (keyword == "yaho.pmdl"):
            set_pending(2)
            # pos = cal_between_two_points_short(mt_position, motor_radi_zero + pos_pespker_radi_abs)
            pos = motor_radi_zero+(math.pi*6)+pos_pespker_radi_abs
            dev.speed(100 * rad_sec_to_rpm)
            dev.moveTo(pos)
            print(' direction:{} from/to {}=>{} '.format(keyword, mt_position, pos))

            #set_pending(4)
            # print(motor_radi_zero)
            # dev.speed(100 * rad_sec_to_rpm)
            # dev.moveTo(motor_radi_zero+(math.pi*6)+pos_pespker_radi_abs)

    kws.set_callback(on_detected)
    src.recursive_start()
    connection_USBController_loop()

    while True:
        #ipt=raw_input('input')
        #if ipt:
        #    if ipt=="q":
        #        break
        #    #on_detected(0,"billikensan.pmdl")

        try:
            time.sleep(1)
        except KeyboardInterrupt:
            break

    src.recursive_stop()


if __name__ == '__main__':
    main()
