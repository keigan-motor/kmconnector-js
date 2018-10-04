/***
 * KMComUSBSerial.js
 * version 0.1.0 alpha
 * Created by Harada Hiroshi on 2018/02/27.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
'use strict';
let KMUtl = require('./KMUtl');
let KMComBase = require('./KMComBase');
let serialPort = require('serialport');

let _usbConnectSendingQue=Promise.resolve(true);

/**
 * @classdesc node.js用USBシリアル通信クラス
 * @ignore
 */
class KMComUSBSerial extends KMComBase{
    /********************************************
     * 定数
     ********************************************/



    /********************************************
     * section::公開メソッド
     ********************************************/
    /**
     * constructor
     * @param portName portName string ex)'/dev/tty.usbserial-DM00LP55'
     * @param id Unique ID
     * @param motorName
     */
    constructor(portName,id,motorName=null){
        super();
        if(typeof portName !=="string"){
            throw new Error('Type mismatch of string portName');
        }
        this._usbsport=new serialPort(portName, {
                autoOpen: false
                ,baudRate: 115200
                ,dataBits: 8
                ,parity: 'none'
                ,stopBits: 1
                ,rtscts:true
            // ,flowControl: false
                //,parser: serialport.parsers.readline("\n")
            });
        this._usbSendingQue=Promise.resolve(true);

        this._queCount=0;//info::debug

        this._deviceInfo.type="SERIAL";
        this._serialBuf=new Uint8Array();//on dataシリアル受信時のバッファー

        this._deviceInfo.id=id;
        this._deviceInfo.name=motorName?motorName:portName;


        /********************************************
         * イベント
         ********************************************/
        this._usbsport.removeAllListeners('open');
        this._usbsport.removeAllListeners('close');
        this._usbsport.removeAllListeners('error');
        this._usbsport.removeAllListeners('data');

        this._usbsport.on('open', function() {
            console.log('connect');
            this._statusChange_isConnect(true);
        }.bind(this));

        this._usbsport.on('close',  function(){
            console.log('disconnect');
            this._statusChange_isConnect(false);
        }.bind(this));

        this._usbsport.on('error',  function(err){
            console.log('error'+err.message);
        }.bind(this));

        this._usbsport.on('data',  function(data){
            if(! data instanceof Buffer){return;}
            /**
             * ---------------------------------------------------------
             * シリアルデータのバッファ
             * データーは細切れで来るのでバッファーに溜めて、プリアンブル〜ポストアンブルを検出し、情報バイト、CRCを抽出する
             * ---------------------------------------------------------
             * データフォーマット
             * 開始を表す固定データ	     情報バイト               CRC              終端データ
             * byte[0]-byte[3]	        byte[4]-byte[n]	  byte[n+1]-byte[n+2]  byte[n+3]-byte[n+4]
             * [0x00][0x00][0xAA][0xAA]     ・・・             uint16              [0xD0][0x0A]
             */
            this._serialBuf=KMUtl.Uint8ArrayConcat(this._serialBuf,new Uint8Array(data));
            let sv=this._serialBuf;
            let sv_len=this._serialBuf.length;
            let is_pre=false;//プリアンブル検出したか
            if(sv_len<8){return;}
            //console.log("serialBuf len:"+sv_len);
            let slice_idx=sv_len;//抽出済みとしてバッファーから削除するインデックス
            for(let i=0;i<sv_len;i++){
                if(sv[i]===0x00&&sv[i+1]===0x00&&sv[i+2]===0xAA&&sv[i+3]===0xAA&&!is_pre){//プリアンブル検出
                    is_pre=true;
                    slice_idx=i;
                    for(let ie=i+4;ie<sv_len;ie++){
                        if(sv[ie+2]===0x0D&&sv[ie+3]===0x0A){//ポストアンブル検出
                            let crc=sv[ie]<<8 | sv[ie+1];//CRC uint16_t　// todo::CRCのチェック処理

                            let payload=sv.slice(i+4,ie);//情報バイト
                            this._serialdataParse(payload);
                            slice_idx=ie+4;
                            i=ie+3;
                            is_pre=false;
                            break;
                        }
                    }
                }
            }
            this._serialBuf=this._serialBuf.slice(slice_idx);
        }.bind(this));
    }

    /**
     * USBシリアル接続を開始する
     *
     */
    connect(){
        //info::インスタンス毎に並列で処理すると接続出来ない事がある為、キューに溜めて逐次処理
        _usbConnectSendingQue= _usbConnectSendingQue.then((res)=>{
            return new Promise((resolve,reject)=> {
                if (this._usbsport&& this._usbsport.isOpen) {
                    resolve(true);return;
                }
                this._usbsport.open((error)=>{
                    if(error) {
                       this._onConnectFailureHandler(this, error.message);
                        resolve(error.message);
                    }else {
                        //todo::初期化時のモーター情報の取得と初期化イベントの発行
                        if(!this._isInit){
                            //todo::初期化時に行う情報の取得
                            this._statusChange_init(true);
                        }

                        this._statusChange_isConnect(true);//初回のみ(comp以前は発火しない為)
                        resolve(true);
                    }
                });

            });
        });
    }

    /**
     * 切断
     */
    disConnect(){
        //info::キューに溜まっているconnectは切断出来ない
        this._usbsport.close();
    }

    /********************************************
     * 内部
     ********************************************/
    /**
     * @#---------------------------------------------------------
     * @summary 情報データのparse
     * payloadを抽出し種類別に処理を分岐
     * @#---------------------------------------------------------
     * データフォーマット
     *  情報データのバイト数    データのタイプ    payload
     *  byte[0]               byte[1]	    byte[n]
     *  ・・・                 uint16          mix
     */
    _serialdataParse(uint8Array){
        let len=uint8Array.length;
        if(len<3||uint8Array[0]!==len){return ;}
        let tx_type=uint8Array[1];
        let payload= uint8Array.slice(1);//情報フィールドのデータ(情報バイトの長さ情報を除く)
        //受信データ種別による処理分岐
        switch (tx_type){
            case 0xB4:
                this._onUsbMotorMeasurement(payload);//モーター回転情報受信
                break;
            case 0xB5://モーターIMU情報受信
                this._onUsbImuMeasurement(payload);
                break;
            case 0x40://モーター設定情報取得
                this._onUsbMotorSetting(payload);
                break;
            // case 0x47://モーター設定情報取得
            //     this._onUsbMotorSetting(payload);
            //     break;
            case 0xBE://エラー情報取得
                this._onUsbMotorLog(payload);
                break;
            default:
                console.log("no _serialdataParse:"+tx_type+" payload:"+payload.length);

                break;
        }
    }

    /**
     * @#---------------------------------------------------------
     * @summary モーター回転情報受信
     * @param {Uint8Array} uint8Array
     * @private
     * @#
     * ---------------------------------------------------------
     * Notify したときの返り値
     * byte[0] byte[1]-byte[4]	    byte[5]-byte[8]	        byte[9]-byte[12]
     * 0xB4     float * 		        float *                 float *
     *          position:radians	    speed:radians/second	torque:N・m
     */
    _onUsbMotorMeasurement(uint8Array){
        let dv=new DataView(uint8Array.buffer);
        let txType=dv.getUint8(0);//レジスタ情報通知コマンドID 0xB4固定
        let res={position:dv.getFloat32(1,false),velocity:dv.getFloat32(5,false),torque:dv.getFloat32(9,false)};
        this._onMotorMeasurementCB(res);
    }
    /**
     * @#---------------------------------------------------------
     * @summary モーターIMU情報受信
     * @param {Uint8Array} uint8Array
     * @private
     *
     * @# Notify したときの返り値)---------------------------------------------
     *
     *                  accel_x, accel_y, accel_z, temp, gyro_x, gyro_y, gyro_z が全て返ってくる。取得間隔は100ms 固定
     * byte(BigEndian)  [0] [1][2]  [3][4]  [5][6]  [7][8]  [9][10]  [11][12]  [13][14]
     *                 0xB5  int16_t int16_t int16_t int16_t int16_t int16_t  int16_t
     *                      accel-x accel-y accel-z temp   gyro-x	gyro-y	gyro-z
     *
     * int16_t:-32,768〜32,768
     * 机の上にモーターを置いた場合、加速度　z = 16000 程度となる。（重力方向のため）
     *
     * 単位変換）---------------------------------------------------------
     * 　加速度 value [G] = raw_value * 2 / 32,767
     * 　温度 value [℃] = raw_value / 333.87 + 21.00
     * 　角速度
     * 　　value [degree/second] = raw_value * 250 / 32,767
     * 　　value [radians/second] = raw_value * 0.00013316211
     *
     */
    _onUsbImuMeasurement(uint8Array){
        let dv=new DataView(uint8Array.buffer);
        let txType=dv.getUint8(0);//レジスタ情報通知コマンドID 0xB5固定
        let tempCalibration=-5.7;//温度校正値
        //単位を扱い易いように変換
        let res={
            accelX:dv.getInt16(1,false)*2/32767,accelY:dv.getInt16(3,false)*2/32767,accelZ:dv.getInt16(5,false)*2/32767,
            temp:(dv.getInt16(7,false)) / 333.87 + 21.00+tempCalibration,
            gyroX:dv.getInt16(9,false)*250/32767,gyroY:dv.getInt16(11,false)*250/32767,gyroZ:dv.getInt16(13,false)*250/32767
        };

        this._onImuMeasurementCB(res);
    }
    /**
     * @#---------------------------------------------------------
     * モーターログ情報取得
     * @param {Uint8Array} uint8Array
     * @private
     * @#---------------------------------------------------------
     */
    _onUsbMotorLog(uint8Array){
        //-------------
        //データのparse
        //-------------
        let dv=new DataView(uint8Array.buffer);
        let txType=dv.getUint8(0);//レジスタ情報通知コマンドID 0xBE固定
        let id=dv.getUint16(1,false);//送信ID
        let cmdID=dv.getUint8(3,false);
        let errCode=dv.getUint32(4,false);
        let info=dv.getUint32(8,false);

        //ログ取得
        let res={id:id,cmdID:cmdID,errID:this._MOTOR_LOG_ERRORCODE[errCode].id,errType:this._MOTOR_LOG_ERRORCODE[errCode].type,errMsg:this._MOTOR_LOG_ERRORCODE[errCode].msg,info:info};
        this._onMotorLogCB(cmdID,res);
    }
    /**
     * @#---------------------------------------------------------
     * モーター設定情報取得
     * @param {Uint8Array} uint8Array
     * @private
     * @#---------------------------------------------------------
     * Notify したときの返り値
     * byte[0]	byte[1]	byte[2]	byte[3] byte[4]以降	byte[n-2]	byte[n-1]
     * uint8_t:log_type	uint16_t:id	uint8_t:register	uint8_t:value	uint16_t:CRC
     * 0x40	uint16_t (2byte) 0～65535	レジスタコマンド	レジスタの値（コマンドによって変わる）	uint16_t (2byte) 0～65535
     */
    _onUsbMotorSetting(uint8Array){
        //USBの受信データフォーマットに変更
        let dv=new DataView(uint8Array.buffer);//5+nバイト　データ仕様　https://docs.google.com/spreadsheets/d/1uxJu86Xe8KbIlxu5oPFv9KQdvHY33-NIy0cdSgInoUk/edit#gid=23355161

        //-------------
        //データのparse
        //-------------
        let txLen=dv.byteLength;
        let txType=dv.getUint8(0);//レジスタ情報通知コマンドID 0x40固定
        if(txType!==0x40||txLen<5){return;}//レジスタ情報を含まないデータの破棄

        let id=dv.getUint16(1,false);//送信ID
        let registerCmd=dv.getUint8(3);//レジスタコマンド
        let res={};
        //コマンド別によるレジスタの値の取得[4-n byte]
        let startOffset=4;

        switch(registerCmd){
            case this._MOTOR_SETTING_READREGISTER_COMMAND.maxSpeed:
                res.maxSpeed=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.minSpeed:
                res.minSpeed=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.curveType:
                res.curveType=dv.getUint8(startOffset);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.acc:
                res.acc=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.dec:
                res.dec=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.maxTorque:
                res.maxTorque=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.teachingInterval:
                res.teachingInterval=dv.getUint32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.playbackInterval:
                res.playbackInterval=dv.getUint32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.qCurrentP:
                res.qCurrentP=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.qCurrentI:
                res.qCurrentI=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.qCurrentD:
                res.qCurrentD=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.speedP:
                res.speedP=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.speedI:
                res.speedI=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.speedD:
                res.speedD=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.positionP:
                res.positionP=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.motorMeasurementInterval:
                res.motorMeasurementInterval=dv.getUint8(startOffset);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.motorMeasurementByDefault:
                res.motorMeasurementByDefault=dv.getUint8(startOffset);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.interface:
                res.interface=dv.getUint8(startOffset);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.response:
                res.response=dv.getUint8(startOffset);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.ownColor:
                res.ownColor=('#000000' +Number(dv.getUint8(startOffset)<<16|dv.getUint8(startOffset+1)<<8|dv.getUint8(startOffset+2)).toString(16)).substr(-6);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.iMUMeasurementInterval:
                res.iMUMeasurementInterval=dv.getUint8(startOffset);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.iMUMeasurementByDefault:
                res.iMUMeasurementByDefault=dv.getUint8(startOffset);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.deviceName:
                res.deviceName=String.fromCharCode.apply("", uint8Array.slice(startOffset));//可変バイト文字
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.deviceInfo:
                res.deviceInfo=String.fromCharCode.apply("", uint8Array.slice(startOffset));//可変バイト文字
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.speed:
                res.speed=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.positionOffset:
                res.positionOffset=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.moveTo:
                res.moveTo=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.hold:
                res.hold=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.status:
                res.status=dv.getUint8(startOffset);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.tasksetName:
                res.tasksetName=String.fromCharCode.apply("", uint8Array.slice(startOffset));//可変バイト文字
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.tasksetInfo:
                res.tasksetInfo=dv.getUint16(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.tasksetUsage:
                res.tasksetUsage=dv.getUint8(startOffset);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.motionName:
                res.motionName=String.fromCharCode.apply("", uint8Array.slice(startOffset));//可変バイト文字
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.motionInfo:
                res.motionInfo=dv.getUint16(startOffset,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.motionUsage:
                res.motionUsage=dv.getUint8(startOffset);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.i2CSlaveAddress:
                res.i2CSlaveAddress=dv.getUint8(startOffset);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.led:
                res.led={state:dv.getUint8(startOffset),r:dv.getUint8(startOffset+1),g:dv.getUint8(startOffset+2),b:dv.getUint8(startOffset+3)};
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.enableCheckSum:
                res.enableCheckSum=dv.getUint8(startOffset);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.deviceSerial:
                res.deviceSerial=String.fromCharCode.apply("", uint8Array.slice(startOffset));//可変バイト文字
                break;
        }
        this._onMotorSettingCB(registerCmd,res);
    }

    /**
     * コマンドの送信
     * @param commandCategory コマンド種別のString USBでは使用しない(BLE用の互換)
     * @param commandNum
     * @param arraybuffer
     * @param notifyPromis cmdReadRegister等のBLE呼び出し後にnotifyで取得する値をPromisで帰す必要のあるコマンド用
     * @private
     * @#---------------------------------------------------------
     */
    _sendMotorCommand(commandCategory, commandNum, arraybuffer=new ArrayBuffer(0), notifyPromis=null){
        let self=this;
        let ab=new DataView(arraybuffer);
        //コマンド・ID・CRCの付加
        let buffer = new ArrayBuffer(arraybuffer.byteLength+5);
        new DataView(buffer).setUint8(0,commandNum);
        new DataView(buffer).setUint16(1,this.createCommandID);
        new DataView(buffer).setUint16(arraybuffer.byteLength+3,0);
        //データの書き込み
        for(let i=0;i<arraybuffer.byteLength;i++){
            new DataView(buffer).setUint8(3+i,ab.getUint8(i));
        }
        //queに追加
        ++this._queCount;//info::debug
        this._usbSendingQue= this._usbSendingQue.then((res)=>{
         //console.log("_sendMotorCommand queCount:"+(--this._queCount));//info::debug
            if(notifyPromis){
                notifyPromis.startRejectTimeOutCount();
            }
            return new Promise((resolve,reject)=> {
                //console.log("send >>>>>>> commandNum:"+commandNum.toString(16));
                self._usbsport.write(this._toBuffer(buffer),function(error){
                        if(!error){
                            resolve(true);
                        }else{
                            reject("ERR:Serial.write");
                        }
                });
            })
        }).catch(function(res){
            //失敗時　//info::後続のコマンドは引き続き実行される
          console.log("ERR _sendMotorCommand:"+res+" queCount:"+(--this._queCount));//info::debug
            if(notifyPromis){
                notifyPromis.callReject(res);
            }
        });
    }

    /**
     * ArrayBuffer to Buffer
     * @param ab
     * @returns {Buffer}
     * @private
     */
    _toBuffer(ab) {
        let buf = new Buffer(ab.byteLength);
        let view = new Uint8Array(ab);
        for (let i = 0; i < buf.length; ++i) {
            buf[i] = view[i];
        }
        return buf;
    }


//////class//
}

module.exports =KMComUSBSerial;