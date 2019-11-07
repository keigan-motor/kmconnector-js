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
const KMStructures=require('./KMStructures');

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
     * @param id UniqueID. デバイスID(serialPort.list().serialNumber)を指定してインスタンス化した場合は、connect()時、USBのポートが入れ替わっても、同じデバイスに接続される。
     * @param defaultMotorName string
     *
     */
    constructor(portName,id,defaultMotorName){
        super();
        if(typeof portName !=="string"){
            throw new Error('Type mismatch of string portName');
        }
        this._portName=portName;
        this._usbsport=new serialPort(this._portName, {
                autoOpen: false
                ,baudRate: 115200
                ,dataBits: 8
                ,parity: 'none'
                ,stopBits: 1
                ,rtscts:true
                //,flowControl: false
                //,parser: serialport.parsers.readline("\n")
            });
        this._usbSendingQue=Promise.resolve(true);
        //this._queCount=0;//info::debug
        this._deviceInfo.type="SERIAL";
        this._serialBuf=new Uint8Array();//on dataシリアル受信時のバッファー

        this._deviceInfo.id=id;
       //this._deviceInfo.name=motorName?motorName:this._portName;
        this._deviceInfo.name=defaultMotorName;
        this._getNameWhenConnectingLisner=null;//
        this._getNameWhenConnectingLisnerTid=0;
        /********************************************
         * イベント
         ********************************************/
        this._usbsport_closeLis=function(){
            //console.log('disconnect');
            this._statusChange_isConnect(false);
        };
        this._usbsport_errorLis=function(err){
            console.log('error'+err.message);
        };
        this._usbsport_dataLis=function(data){
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
        };

        this._usbsport.on('close',this._usbsport_closeLis.bind(this));
        this._usbsport.on('error',this._usbsport_errorLis.bind(this));
        this._usbsport.on('data', this._usbsport_dataLis.bind(this));
    }

    /**
     * USBシリアル接続を開始する
     * @desc インスタンス時の引数idにデバイスID(serialPort.list().serialNumber)を指定してた場合、USBのポートが入れ替わっても、同じデバイスに接続される。
     */
    connect(){
        let self=this;
        //info::USBポートの入れ替わり確認。入れ替わりの場合、同じモーターのUSBポートを探して再接続。無ければそのまま接続
        //　isChangePort:"dev/xxx" -USBポートの入れ替わりあり。
        //　isChangePort:null -入れ替わり無し
        // isSameID:null&&_deviceInfo.id:"id_xxx"で始まる -デバイスファイル名を指定した手動生成時
        // isSameID:null -デバイスが見つからない
        //info dev/by-idの固定接続はserialPort.list()で検出されない為、常にデバイスが見つからない
        serialPort.list().then((ports)=>{
            let isChangePort=null;//変更された場合、同じモーターのUSBポート
            let isSameID=null;
            //通常の接続時
            if(self._deviceInfo.id){
                for(let i=0;i<ports.length;i++){
                    if(self._deviceInfo.id===ports[i].serialNumber){
                        isSameID=true;
                        if(self._portName!==ports[i].comName){
                            isChangePort=ports[i].comName;
                        }
                    }
                }

                if(!isSameID && String(self._deviceInfo.id).indexOf("id_")!==0){// String(self._deviceInfo.id).indexOf("id_")===0:デバイスファイル名を固定した接続時
                    self._onConnectFailureHandler(self, "Motor Not found '"+self._deviceInfo.name+"'");
                    return;
                }
            }

            if(isChangePort){
                //シリアルポートの変更処理
                console.log("change port 「"+self._deviceInfo.name+"」:"+self._portName+" >> "+isChangePort);
                self._portName=isChangePort;
                self._usbsport=new serialPort(self._portName, {
                    autoOpen: false
                    ,baudRate: 115200
                    ,dataBits: 8
                    ,parity: 'none'
                    ,stopBits: 1
                    ,rtscts:true
                });

                self._usbsport.on('close',self._usbsport_closeLis.bind(self));
                self._usbsport.on('error',self._usbsport_errorLis.bind(self));
                self._usbsport.on('data', self._usbsport_dataLis.bind(self));
            }

            //info::インスタンス毎に並列で処理すると接続出来ない事がある為、キューに溜めて逐次処理
            _usbConnectSendingQue= _usbConnectSendingQue.then((res)=>{
                return new Promise((resolve,reject)=> {
                    if (self._usbsport&& self._usbsport.isOpen) {
                        resolve(true);return;
                    }
                    self._usbsport.open((error)=>{
                        if(error) {
                            self._onConnectFailureHandler(self, error.message);
                            resolve(error.message);
                        }else {
                            //info::notifyを取得する為、接続時にインターフェイス設定をUSBに変更
                            self._sendMotorCommand('MOTOR_RX',0x2E,new Uint8Array([0b10001000]).buffer);

                            let _compCB=()=> {
                                if(!self._isInit){
                                    self._statusChange_init(true);
                                }
                                self._statusChange_isConnect(true);//初回のみ(comp以前は発火しない為)
                                resolve(true);
                            };

                            //接続時のモーター名取得処理
                            clearTimeout(self._getNameWhenConnectingLisnerTid);
                            self._getNameWhenConnectingLisnerTid=setTimeout(_compCB,500);//todo::debug
                            self._getNameWhenConnectingLisner=(registerCmd,res)=>{
                                if(registerCmd===self._MOTOR_RX_READREGISTER_COMMAND.deviceName){
                                    self._deviceInfo.name=typeof res.deviceName==="string"?res.deviceName.split('#')[0]:null;
                                    clearTimeout(self._getNameWhenConnectingLisnerTid);
                                    self._getNameWhenConnectingLisner=null;
                                    _compCB();
                                }
                            };
                            setTimeout(()=>{
                                self._sendMotorCommand('MOTOR_SETTING',self._MOTOR_RX_READREGISTER_COMMAND.deviceName);//DeviceName
                            },100);
                        }
                    });
                });
            });
        }).catch((err)=>{
            console.log("ERR:serialPort.list() ",err);
        });

    }

    /**
     * 切断
     */
    disConnect(){
        //info::キューに溜まっているconnectは切断出来ない
        this._usbsport.close();
        clearTimeout(this._getNameWhenConnectingLisnerTid);
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
        //info::USBのみuint8ArrayにtxTypeが付加される（1byte多い）
        let dv=new DataView(uint8Array.buffer);
        //let txType=dv.getUint8(0);//レジスタ情報通知コマンドID 0xB4固定
        let position=dv.getFloat32(1,false);
        let velocity=dv.getFloat32(5,false);
        let torque=dv.getFloat32(9,false);
        this._onMotorMeasurementCB(new KMStructures.KMRotState(position,velocity,torque));
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
       // let txType=dv.getUint8(0);//レジスタ情報通知コマンドID 0xB5固定　
        let tempCalibration=-5.7;//温度校正値
        //単位を扱い易いように変換
        let accelX=dv.getInt16(1,false)*2/32767;
        let accelY=dv.getInt16(3,false)*2/32767;
        let accelZ=dv.getInt16(5,false)*2/32767;
        let temp=(dv.getInt16(7,false)) / 333.87 + 21.00+tempCalibration;
        let gyroX=dv.getInt16(9,false)*250/32767;
        let gyroY=dv.getInt16(11,false)*250/32767;
        let gyroZ=dv.getInt16(13,false)*250/32767;

        this._onImuMeasurementCB(new KMStructures.KMImuState(accelX,accelY,accelZ,temp,gyroX,gyroY,gyroZ));
    }
    /**
     * @#---------------------------------------------------------
     * モーターログ情報取得
     * @param {Uint8Array} uint8Array
     * @private
     * @#---------------------------------------------------------
     * Notify value
     * byte[0]	byte[1-2]	byte[3]	byte[4-7]	byte[8-11]	byte[12-13]
     * uint8_t:tx_type	uint16_t:id	uint8_t:command	uint32_t:errorCode	uint32_t:info	uint16_t:CRC
     */
    _onUsbMotorLog(uint8Array){
        //-------------
        //データのparse
        //-------------
        let dv=new DataView(uint8Array.buffer);
        let txType=dv.getUint8(0);//レジスタ情報通知コマンドID 0xBE固定
        if(txType!==0xBE){return;}
        let id=dv.getUint16(1,false);//送信ID
        let cmdID=dv.getUint8(3,false);
        let errCode=dv.getUint32(4,false);
        let info=dv.getUint32(8,false);
        //ログ取得
        this._onMotorLogCB(new KMStructures.KMMotorLog(id,null,cmdID,this._MOTOR_LOG_ERRORCODE[errCode].id,this._MOTOR_LOG_ERRORCODE[errCode].type,this._MOTOR_LOG_ERRORCODE[errCode].msg,info));
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
            case this._MOTOR_RX_READREGISTER_COMMAND.maxSpeed:
                res.maxSpeed=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.minSpeed:
                res.minSpeed=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.curveType:
                res.curveType=dv.getUint8(startOffset);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.acc:
                res.acc=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.dec:
                res.dec=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.maxTorque:
                res.maxTorque=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.teachingInterval:
                res.teachingInterval=dv.getUint32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.playbackInterval:
                res.playbackInterval=dv.getUint32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.qCurrentP:
                res.qCurrentP=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.qCurrentI:
                res.qCurrentI=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.qCurrentD:
                res.qCurrentD=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.speedP:
                res.speedP=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.speedI:
                res.speedI=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.speedD:
                res.speedD=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.positionP:
                res.positionP=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.motorMeasurementInterval:
                res.motorMeasurementInterval=dv.getUint8(startOffset);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.motorMeasurementByDefault:
                res.motorMeasurementByDefault=dv.getUint8(startOffset);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.interface:
                res.interface=dv.getUint8(startOffset);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.response:
                res.response=dv.getUint8(startOffset);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.ownColor:
                res.ownColor=('#000000' +Number(dv.getUint8(startOffset)<<16|dv.getUint8(startOffset+1)<<8|dv.getUint8(startOffset+2)).toString(16)).substr(-6);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.iMUMeasurementInterval:
                res.iMUMeasurementInterval=dv.getUint8(startOffset);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.iMUMeasurementByDefault:
                res.iMUMeasurementByDefault=dv.getUint8(startOffset);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.deviceName:
                res.deviceName=String.fromCharCode.apply("", uint8Array.slice(startOffset));//可変バイト文字
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.deviceInfo:
                res.deviceInfo=String.fromCharCode.apply("", uint8Array.slice(startOffset));//可変バイト文字
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.speed:
                res.speed=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.positionOffset:
                res.positionOffset=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.moveTo:
                res.moveTo=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.hold:
                res.hold=dv.getFloat32(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.status:
                res.status=dv.getUint8(startOffset);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.tasksetName:
                res.tasksetName=String.fromCharCode.apply("", uint8Array.slice(startOffset));//可変バイト文字
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.tasksetInfo:
                res.tasksetInfo=dv.getUint16(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.tasksetUsage:
                res.tasksetUsage=dv.getUint8(startOffset);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.motionName:
                res.motionName=String.fromCharCode.apply("", uint8Array.slice(startOffset));//可変バイト文字
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.motionInfo:
                res.motionInfo=dv.getUint16(startOffset,false);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.motionUsage:
                res.motionUsage=dv.getUint8(startOffset);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.i2CSlaveAddress:
                res.i2CSlaveAddress=dv.getUint8(startOffset);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.led:
                res.led={state:dv.getUint8(startOffset),r:dv.getUint8(startOffset+1),g:dv.getUint8(startOffset+2),b:dv.getUint8(startOffset+3)};
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.enableCheckSum:
                res.enableCheckSum=dv.getUint8(startOffset);
                break;
            case this._MOTOR_RX_READREGISTER_COMMAND.deviceSerial:
                res.deviceSerial=String.fromCharCode.apply("", uint8Array.slice(startOffset));//可変バイト文字
                break;
        }
        if(typeof this._getNameWhenConnectingLisner ==="function"){
            this._getNameWhenConnectingLisner(registerCmd,res);
        }
        this._onMotorSettingCB(registerCmd,res);
    }

    /**
     * コマンドの送信
     * @param commandCategory コマンド種別のString USBでは使用しない(BLE用の互換)
     * @param commandNum
     * @param arraybuffer
     * @param notifyPromis cmdReadRegister等のBLE呼び出し後にnotifyで取得する値をPromisで帰す必要のあるコマンド用
     * @param cid シーケンスID
     * @returns {number} cid シーケンスID
     * @private
     * @#---------------------------------------------------------
     */

    _sendMotorCommand(commandCategory, commandNum, arraybuffer=new ArrayBuffer(0), notifyPromis=null,cid=null){
        let self=this;
        let ab=new DataView(arraybuffer);
        let buffer = new ArrayBuffer(arraybuffer.byteLength+5);
        new DataView(buffer).setUint8(0,commandNum);
        cid=cid===null?this.createCommandID:cid;//シーケンスID(ユニーク値)
        new DataView(buffer).setUint16(1,cid);

       // let rr=KMUtl.CRC16(0,arraybuffer.byteLength-3,buffer);
        //データの書き込み
        for(let i=0;i<arraybuffer.byteLength;i++){
            new DataView(buffer).setUint8(3+i,ab.getUint8(i));
        }

        let crc=KMUtl.CreateCommandCheckSumCRC16(new Uint8Array(buffer.slice(0,buffer.byteLength-2)));
        new DataView(buffer).setUint16(arraybuffer.byteLength+3,crc);//info::CRC計算

        //queに追加
        //++this._queCount;//info::debug
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
            //info::失敗時　後続のコマンドは引き続き実行される
            // console.log("ERR _sendMotorCommand:"+res+" queCount:"+(--this._queCount));//info::debug
            if(notifyPromis){
                notifyPromis.callReject(res);
            }
        });
        return cid;
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