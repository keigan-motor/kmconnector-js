/***
 * KMComBLE.js
 * version 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
'use strict';
let KMUtl = require('./KMUtl');
let KMComBase = require('./KMComBase');
//let noble = require('noble');


/**
 * @classdesc node.js用BLE通信クラス(noble依存)
 * @ignore
 */
class KMComBLE extends KMComBase{
    /********************************************
     * 定数
     ********************************************/

    /**
     * サービスUUID
     * nobleはハイフン無しの文字列
     * @readonly
     * @type {string}
     * @ignore
     */
    static get MOTOR_BLE_SERVICE_UUID(){
        return 'f140ea3589364d35a0eddfcd795baa8c';
    }

    /**
     * キャラクタリスティクスUUID
     * @readonly
     * @enum {string}
     * @property {string} MOTOR_CONTROL モーターへの設定、制御命令を取り扱う
     * @property {string} MOTOR_MEASUREMENT モーターの位置・速度・トルク等測定値を取り扱う
     * @property {string} MOTOR_IMU_MEASUREMENT モーターの加速度・ジャイロセンサー（IMU）を取り扱う
     * @property {string} MOTOR_SETTING モーターの設定値を取り扱う
     * @ignore
     */
    static get MOTOR_BLE_CRS(){
        return {
            'MOTOR_CONTROL':'f140000189364d35a0eddfcd795baa8c',//
            //'MOTOR_LED':'f140000389364d35a0eddfcd795baa8c',//モーターのLEDを取り扱う info:: MOTOR_CONTROL::bleLedで代用
            'MOTOR_MEASUREMENT':'f140000489364d35a0eddfcd795baa8c',//
            'MOTOR_IMU_MEASUREMENT':'f140000589364d35a0eddfcd795baa8c',//
            'MOTOR_SETTING':'f140000689364d35a0eddfcd795baa8c'//
        };
    }

    /**
     * Device Information Service
     * @readonly
     * @enum {string}
     * @property {string} Service
     * @property {string} ManufacturerNameString
     * @property {string} HardwareRevisionString
     * @property {string} FirmwareRevisionString
     * @ignore
     */
    static get DEVICE_INFORMATION_SERVICE_UUIDS(){
        return {
            "Service":"180a"
            ,"ManufacturerNameString":"2a29"
            ,"HardwareRevisionString":"2a27"
            ,"FirmwareRevisionString":"2a26"
        };
    }


    /********************************************
     * section::公開メソッド
     ********************************************/
    /**
     * constructor　
     * @param {object} peripheral noble peripheral object
     *
     */
    constructor(peripheral){
        super();
        //todo::peripheral.constructor.name!=='‌Peripheral' 比較出来ない。常にtrue?
        if(!peripheral instanceof Object||!peripheral.uuid){
            throw new Error('Type mismatch of peripheral device');
        }
        this._peripheral=peripheral;
        this._characteristics={};
        this._bleSendingQue=Promise.resolve(true);
        //this._queCount=0;

        this._deviceInfo.type="BLE";
        this._deviceInfo.id=this._peripheral.id;
        this._deviceInfo.name=peripheral.advertisement?peripheral.advertisement.localName:null;

        /********************************************
         * イベント
         ********************************************/
        this._peripheral.removeAllListeners('connect');
        this._peripheral.removeAllListeners('disconnect');
        this._peripheral.removeAllListeners('servicesDiscover');

        this._peripheral.on('connect', function() {
            console.log('connect');
            this._statusChange_isConnect(true);
        }.bind(this));

        this._peripheral.on('disconnect',  function(){
            console.log('disconnect');
            this._statusChange_isConnect(false);

        }.bind(this));

    }

    /**
     * BLEでの接続を開始する
     *
     */
    connect(){
        if (this._peripheral&& this._peripheral.state==='connected') {
            return;
        }
        this._peripheral.connect(function(error){
            if(error){
                this._onConnectFailureHandler(this,error);
            }else {
                this._discoverServices().then(()=>{
                    if(!this._isInit){
                        this._statusChange_init(true);
                        this._statusChange_isConnect(true);//初回のみ(comp以前は発火しない為)
                    }
                }).catch(function(res){
                    console.log(res);
                });
            }
        }.bind(this));
    }

    /**
     * BLEでの切断
     */
    disConnect(){
        this._peripheral.disconnect();
    }

    /********************************************
     * 内部
     ********************************************/
    _discoverServices(){
        return new Promise((d_resolve,d_reject)=> {
            this._peripheral.discoverServices([this.constructor.MOTOR_BLE_SERVICE_UUID,this.constructor.DEVICE_INFORMATION_SERVICE_UUIDS.Service],
                (error,services)=>{
                    if(error){
                        d_reject(error);return;
                    }
                    console.log('servicesDiscover');
                    let discMotorServiceFlg=false;
                    Promise.all(services.map((service)=>{
                        return new Promise((svresolve, svreject) => {
                            if (service['uuid'] === this.constructor.MOTOR_BLE_SERVICE_UUID) {
                                discMotorServiceFlg = true;
                                service.discoverCharacteristics([],(err,characteristics) =>{
                                    if(err){
                                        svreject(errmsg);return;
                                    }
                                    let crs = {};
                                    Object.keys(this.constructor.MOTOR_BLE_CRS).forEach((key) => {
                                        for (let j = 0; j < characteristics.length; j++) {
                                            if (characteristics[j].uuid === this.constructor.MOTOR_BLE_CRS[key]) {
                                                crs[key] = characteristics[j];
                                                break;
                                            }
                                        }
                                    });
                                    this._characteristics = crs;
                                    //start notify
                                    new Promise((resolve, reject) => {
                                        if (this._characteristics['MOTOR_MEASUREMENT']) {
                                            this._characteristics['MOTOR_MEASUREMENT'].removeAllListeners('data');
                                            this._characteristics['MOTOR_MEASUREMENT'].on('data', this._onBleMotorMeasurement.bind(this));
                                            this._characteristics['MOTOR_MEASUREMENT'].subscribe((error) => {
                                                if (error) {
                                                    let errmsg = 'err:MOTOR_MEASUREMENT subscribe -> :' + error;
                                                    console.log(errmsg);
                                                    reject(errmsg);
                                                } else {
                                                    resolve();
                                                }
                                            });
                                        }
                                    }).then(() => {
                                        return new Promise((resolve, reject) => {
                                            if (this._characteristics['MOTOR_IMU_MEASUREMENT']) {
                                                this._characteristics['MOTOR_IMU_MEASUREMENT'].removeAllListeners('data');
                                                this._characteristics['MOTOR_IMU_MEASUREMENT'].on('data', this._onBleImuMeasurement.bind(this));
                                                this._characteristics['MOTOR_IMU_MEASUREMENT'].subscribe((error) => {
                                                    if (error) {
                                                        let errmsg = 'err:MOTOR_IMU_MEASUREMENT subscribe -> :' + error;
                                                        console.log(errmsg);
                                                        reject(errmsg);
                                                    } else {
                                                        resolve();
                                                    }
                                                });
                                            }
                                        });
                                    }).then(() => {
                                        return new Promise((resolve, reject) => {
                                            if (this._characteristics['MOTOR_SETTING']) {
                                                this._characteristics['MOTOR_SETTING'].removeAllListeners('data');
                                                this._characteristics['MOTOR_SETTING'].on('data', this._onBleMotorSetting.bind(this));
                                                this._characteristics['MOTOR_SETTING'].subscribe((error) => {
                                                    if (error) {
                                                        let errmsg = 'err:MOTOR_SETTING subscribe -> :' + error;
                                                        console.log(errmsg);
                                                        reject(errmsg);
                                                    } else {
                                                        resolve();
                                                    }
                                                });
                                            }
                                        });
                                    }).then(() => {
                                        svresolve(true);
                                    }).catch((errmsg) => {
                                        console.log(errmsg);
                                        svreject(errmsg);
                                    });
                                });
                            }
                            else if (service['uuid'] === this.constructor.DEVICE_INFORMATION_SERVICE_UUIDS.Service) {
                                service.discoverCharacteristics([], (err,characteristics) =>{
                                    if(err){
                                        svreject(errmsg);return;
                                    }
                                    Promise.all(characteristics.map((characteristic)=>{
                                        return new Promise((resolve, reject)=>{
                                            switch (characteristic.uuid) {
                                                case this.constructor.DEVICE_INFORMATION_SERVICE_UUIDS.ManufacturerNameString:
                                                    characteristic.read((error, data) => {
                                                        this._deviceInfo.manufacturerName = KMUtl.Utf8ArrayToStr(data);
                                                        resolve(true);
                                                    });
                                                    break;
                                                case this.constructor.DEVICE_INFORMATION_SERVICE_UUIDS.HardwareRevisionString:
                                                    characteristic.read((error, data) => {
                                                        this._deviceInfo.hardwareRevision = KMUtl.Utf8ArrayToStr(data);
                                                        resolve(true);
                                                    });
                                                    break;
                                                case this.constructor.DEVICE_INFORMATION_SERVICE_UUIDS.FirmwareRevisionString:
                                                    characteristic.read((error, data) => {
                                                        this._deviceInfo.firmwareRevision = KMUtl.Utf8ArrayToStr(data);
                                                        resolve(true);
                                                    });
                                                    break;
                                                default:
                                                    resolve(true);
                                                    break;
                                            }
                                        });
                                    })).then(()=>{
                                        svresolve(true);
                                    }).catch((errmsg)=>{
                                        svreject(errmsg);
                                    });
                                });
                            }else{
                                svresolve(true);
                            }
                        });
                    })).then(()=>{
                        if(!discMotorServiceFlg){
                            console.log('Type mismatch of motor peripheral device:'+this._deviceInfo.name);
                            this._peripheral.disconnect();
                        }else{
                            // this._statusChange_init(true);
                            // this._statusChange_isConnect(true);//初回のみ(comp以前は発火しない為)
                            d_resolve(true);
                        }
                    }).catch((errmsg)=>{
                        console.log('Err servicesDiscover:'+errmsg);
                        d_resolve(true);
                    });
             });
        });
    }

    /**
     * @#---------------------------------------------------------
     * @summary モーター回転情報受信
     * @param {Buffer} data
     * @private
     * @#
     * ---------------------------------------------------------
     * Notify したときの返り値
     * byte[0]-byte[3]	    byte[4]-byte[7]	        byte[8]-byte[11]
     * float * 		        float *                 float *
     * position:radians	    speed:radians/second	torque:N・m
     */
    _onBleMotorMeasurement(data){
        if(! data instanceof Buffer){return;}
        let u8=new Uint8Array(data);//info::一旦コピーする必要がある https://stackoverflow.com/questions/37794803/node-js-buffer-to-typed-array
        let dv=new DataView(u8.buffer);
        let res={position:dv.getFloat32(0,false),velocity:dv.getFloat32(4,false),torque:dv.getFloat32(8,false)};
        this._onMotorMeasurementCB(res);
    }
    /**
     * @#---------------------------------------------------------
     * @summary モーターIMU情報受信
     * @param {Buffer} data
     * @private
     *
     * @# Notify したときの返り値)---------------------------------------------
     *
     * accel_x, accel_y, accel_z, temp, gyro_x, gyro_y, gyro_z が全て返ってくる。取得間隔は100ms 固定
     * byte(BigEndian)  [0][1] [2][3]  [4][5]   [6][7]	    [8][9]	[10][11]    [12][13]
     *                  int16_t int16_t int16_t int16_t     int16_t int16_t int16_t
     *                  accel-x accel-y accel-z temp	    gyro-x	gyro-y	gyro-z
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
    _onBleImuMeasurement(data){
        if(! data instanceof Buffer){return;}
        let u8=new Uint8Array(data);//info::一旦コピーする必要がある
        let dv=new DataView(u8.buffer);
        let tempCalibration=-5.7;//温度校正値
        //単位を扱い易いように変換
        let res={
            accelX:dv.getInt16(0,false)*2/32767,accelY:dv.getInt16(2,false)*2/32767,accelZ:dv.getInt16(4,false)*2/32767,
            temp:(dv.getInt16(6,false)) / 333.87 + 21.00+tempCalibration,
            gyroX:dv.getInt16(8,false)*250/32767,gyroY:dv.getInt16(10,false)*250/32767,gyroZ:dv.getInt16(12,false)*250/32767
        };

       // console.log(res);
        this._onImuMeasurementCB(res);
    }

    /**
     * @#---------------------------------------------------------
     * モーター設定情報取得
     * @param {Buffer} data
     * @private
     * @#---------------------------------------------------------
     * Notify したときの返り値
     * byte[0]	byte[1]	byte[2]	byte[3] byte[4]以降	byte[n-2]	byte[n-1]
     * uint8_t:log_type	uint16_t:id	uint8_t:register	uint8_t:value	uint16_t:CRC
     * 0x40	uint16_t (2byte) 0～65535	レジスタコマンド	レジスタの値（コマンドによって変わる）	uint16_t (2byte) 0～65535
     */
    _onBleMotorSetting(data){
        if(! data instanceof Buffer){return;}
        let u8=new Uint8Array(data);//info::一旦コピーする必要がある
        let dv=new DataView(u8.buffer);//6+nバイト　データ仕様　https://docs.google.com/spreadsheets/d/1uxJu86Xe8KbIlxu5oPFv9KQdvHY33-NIy0cdSgInoUk/edit#gid=1000482383

        //-------------
        //データのparse
        //-------------
        let notifyBinLen=dv.byteLength;
        let notifyCmd=dv.getUint8(0);//レジスタ情報通知コマンドID 0x40固定

        if(notifyCmd!==0x40||notifyBinLen<=6){return;}//レジスタ情報を含まないデータの破棄

        let id=dv.getUint16(1,false);//送信ID
        let registerCmd=dv.getUint8(3);//レジスタコマンド
        let crc=dv.getUint16(notifyBinLen-2,false);//CRCの値 最後から2dyte

        let res={};
        //コマンド別によるレジスタの値の取得[4-n byte]
        switch(registerCmd){
            case this._MOTOR_SETTING_READREGISTER_COMMAND.maxSpeed:
                res.maxSpeed=dv.getFloat32(4,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.minSpeed:
                res.minSpeed=dv.getFloat32(4,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.curveType:
                res.curveType=dv.getUint8(4);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.acc:
                res.acc=dv.getFloat32(4,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.dec:
                res.dec=dv.getFloat32(4,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.maxTorque:
                res.maxTorque=dv.getFloat32(4,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.qCurrentP:
                res.qCurrentP=dv.getFloat32(4,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.qCurrentI:
                res.qCurrentI=dv.getFloat32(4,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.qCurrentD:
                res.qCurrentD=dv.getFloat32(4,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.speedP:
                res.speedP=dv.getFloat32(4,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.speedI:
                res.speedI=dv.getFloat32(4,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.speedD:
                res.speedD=dv.getFloat32(4,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.positionP:
                res.positionP=dv.getFloat32(4,false);
                break;
            case this._MOTOR_SETTING_READREGISTER_COMMAND.ownColor:
                res.ownColor=('#000000' +Number(dv.getUint8(4)<<16|dv.getUint8(5)<<8|dv.getUint8(6)).toString(16)).substr(-6);
                break;
        }
        //console.log(res);

        this._onMotorSettingCB(registerCmd,res);

    }

    /**
     * BLEコマンドの送信
     * @param commandCategory コマンド種別のString 主にBLEのキャラクタリスティクスで使用する
     * @param commandNum
     * @param arraybuffer
     * @param notifyPromis cmdReadRegister等のBLE呼び出し後にnotifyで取得する値をPromisで帰す必要のあるコマンド用
     * @private
     * @#---------------------------------------------------------
     */
    _sendMotorCommand(commandCategory, commandNum, arraybuffer=new ArrayBuffer(0), notifyPromis=null){
        let characteristics=this._characteristics[commandCategory];
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
      // ++this._queCount;
        this._bleSendingQue= this._bleSendingQue.then((res)=>{
         // console.log("_sendMotorCommand queCount:"+(--this._queCount));
            if(notifyPromis){
                notifyPromis.startRejectTimeOutCount();
            }
            return new Promise((resolve,reject)=> {
                characteristics.write(this._toBuffer(buffer),
                    true,//withoutResponseFlg
                    function(error){
                        if(!error){
                            resolve(true);
                        }else{
                            reject("ERR:characteristics.write");
                        }
                });
            })
        }).catch(function(res){
            //失敗時　//info::後続のコマンドは引き続き実行される
          //console.log("ERR _sendMotorCommand:"+res+" queCount:"+(--this._queCount));
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

module.exports =KMComBLE;