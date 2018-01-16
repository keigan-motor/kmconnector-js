/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/***
 * KMStructures.js
 * var 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

let KMUtl = __webpack_require__(1);


/**
 * section::構造体の基本メソッド
 * EQ:同じ値を持つかの比較
 * Clone:複製
 * GetValObj:値の取得（Obj）
 * GetValArray:値の取得（配列）
 */
class KMStructureBase{
    constructor(){
    }
    //値の比較
    EQ (tar) {
        if(! tar ){return false;}
        if(this.constructor===tar.constructor){
            if(this.GetValArray){
                return this.GetValArray().toString()===tar.GetValArray().toString();
            }else if(this.GetValObj){
                return JSON.stringify(this.GetValObj())===JSON.stringify(tar.GetValObj());// bad::遅い
            }
        }
        return false;
    }
    //複製
    Clone () {
        return Object.assign(new this.constructor(),this);
    }
    //取得 Object
    GetValObj () {
        return Object.assign({},this);
    }
    GetValArray () {
        var k=Object.keys(this);
        var r=[];
        for(var i=0;i<k.length;i++){
            r.push(this[k[i]]);
        }
        return r;
    }
}

/**
 * section::XY座標
 */
class KMVector2 extends KMStructureBase {
    constructor (x, y) {
        super();
        this.x = x ? x : 0;
        this.y = y ? y : 0;
    }
    Move (dx, dy) {
        this.x += dx;
        this.y += dy;
    }
    //2点間の距離
    Distance (vector2) {
        if (!(vector2 instanceof KMVector2)) {return;}
        return Math.sqrt(Math.pow((this.x-vector2.x),2) + Math.pow((this.y-vector2.y),2));
    }
    //2点間の角度
    Radian (vector2) {
        if (!(vector2 instanceof KMVector2)) {return;}
        return Math.atan2(this.y-vector2.y,this.x-vector2.x);
    }
    //0,0からの距離
    DistanceFromZero() {
        return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
    }
    //0,0からの角度
    RadianFromZero() {
        return Math.atan2(this.y,this.x);
    }
}
/**
 * section::XYZ 3次元ベクトル
 */
class KMVector3 extends KMStructureBase {
    constructor(x,y,z) {
        super();
        this.x = x?x:0;
        this.y = y?y:0;
        this.z = z?z:0;
    }
    //移動
    Move (dx, dy, dz) {
        this.x += dx;
        this.y += dy;
        this.z += dz;
    }
    //2点間の距離
    Distance (vector3) {
        if (!(vector3 instanceof KMVector3)) {return;}
        return Math.sqrt(Math.pow((this.x-vector3.x),2) + Math.pow((this.y-vector3.y),2)+ Math.pow((this.z-vector3.z),2));
    }
    //2点間の角度(回転方向の情報なし)
    Radian (vector3) {
        if (!(vector3 instanceof KMVector3)) {return;}
        //todo::2点間の角度(回転方向の情報なし)
    }
    //0,0からの距離
    DistanceFromZero () {
        return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2)+ Math.pow(this.z,2));
    }
    //0,0,0からの角度
    RadianFromZero () {
        //todo::0,0,0からの角度
    }
}
/**
 * section::ジャイロセンサー値
 */
class KMImuState extends KMStructureBase {
    constructor (accelX, accelY, accelZ, temp, gyroX, gyroY, gyroZ ) {
        super();

        this.accelX= KMUtl.toNumber(accelX);
        this.accelY= KMUtl.toNumber(accelY);
        this.accelZ= KMUtl.toNumber(accelZ);
        this.temp= KMUtl.toNumber(temp);
        this.gyroX= KMUtl.toNumber(gyroX);
        this.gyroY= KMUtl.toNumber(gyroY);
        this.gyroZ= KMUtl.toNumber(gyroZ);
    }
}
/**
 * KEIGANモーターLED　点灯・色状態
 * State MOTOR_LED_STATE
 * colorR 0-255
 * colorG 0-255
 * colorB 0-255
 * */
class KMLedState extends KMStructureBase {
    static get MOTOR_LED_STATE(){
        return{
            "MOTOR_LED_STATE_OFF":0,//LED消灯
            "MOTOR_LED_STATE_ON_SOLID":1,//LED点灯（点灯しっぱなし）
            "MOTOR_LED_STATE_ON_FLASH":2,//LED点滅（一定間隔で点滅）
            "MOTOR_LED_STATE_ON_DIM":3  //LEDがゆっくり輝度変化する
        }
    }
    constructor(state,colorR,colorG,colorB) {
        super();
        this.state=KMUtl.toNumber(state);
        this.colorR=KMUtl.toNumber(colorR);
        this.colorG=KMUtl.toNumber(colorG);
        this.colorB=KMUtl.toNumber(colorB);
    }
}

/**
 * section::モーター回転情報
 */
class KMRotState extends KMStructureBase {

    static get MAX_TORQUE(){
        return 0.3;//0.3 N・m
    }
    static get MAX_SPEED_RPM(){
        return 300;//300rpm
    }
    static get MAX_SPEED_RADIAN(){
        return KMUtl.rpmToRadianSec(300);
    }
    static get MAX_POSITION(){
        return 3*Math.pow(10,38);//info::「return　3e+38」はminifyでエラー
        //return　3e+38;//radian 4byte float　1.175494 10-38  < 3.402823 10+38
    }
    constructor(position, velocity, torque) {
        //有効桁数 小数第3位
        super();
        this.position = Math.floor(KMUtl.toNumber(position)*100)/100;
        this.velocity = Math.floor(KMUtl.toNumber(velocity)*100)/100;
        this.torque = Math.floor(KMUtl.toNumber(torque)*10000)/10000;
    }
}

/**
 * section::デバイス情報
 */
class KMDeviceInfo extends KMStructureBase {
    constructor(type="",id="",name="",isConnect=false,manufacturerName=null,hardwareRevision=null,firmwareRevision=null) {
        super();
        this.type=type;
        this.id=id;
        this.name=name;
        this.isConnect=isConnect;
        this.manufacturerName=manufacturerName;
        this.hardwareRevision=hardwareRevision;
        this.firmwareRevision=firmwareRevision;
    }
}


module.exports = {
    KMStructureBase:KMStructureBase,
    KMVector2:KMVector2,
    KMVector3:KMVector3,
    KMImuState:KMImuState,
    KMLedState:KMLedState,
    KMRotState:KMRotState,
    KMDeviceInfo:KMDeviceInfo
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/***
 * KMUtl.js
 * version 0.1.0 alpha
 * CCreated by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

var KMUtl = (function () {
    function KMUtl() {
    }

    /**
     * 数値にキャストする関数 (C)　
     * 数値以外は0を返す
     * Infinityも0とする
     */
    KMUtl.toNumber=function toNumber(val, defaultval = 0) {
        var v = parseFloat(val, 10);
        return (isNaN(v) || val === Infinity ? defaultval : v);
    };
    /**
     * 単位変換　degree >> radian
     * @param degree
     * @returns {number}
     * @constructor
     */
        KMUtl.degreeToRadian= function degreeToRadian(degree) {
        return degree * 0.017453292519943295;
    };
    /**
     * 単位変換　radian >> degree
     * @param radian
     * @returns {number}
     * @constructor
     */
    KMUtl.radianToDegree= function radianToDegree(radian) {
        return radian / 0.017453292519943295;
    };
    /**
     * 速度 rpm ->radian/sec に変換
     * @param rpm
     * @returns {number}
     * @constructor
     */
    KMUtl.rpmToRadianSec= function rpmToRadianSec(rpm) {
        //速度 rpm ->radian/sec(Math.PI*2/60)
        return rpm * 0.10471975511965977;
    };
    /**
     * 2点間の距離と角度を求める
     * @param from_x,from_y,to_x,to_y
     * @returns {number}
     * @constructor
     */
    KMUtl.twoPointDistanceAngle= function twoPointDistanceAngle(from_x, from_y, to_x, to_y) {
        var distance = Math.sqrt(Math.pow(from_x - to_x, 2) + Math.pow(from_y - to_y, 2));
        var radian = Math.atan2(from_y - to_y, from_x - to_x);
        return {dist: distance, radi: radian, deg: KMUtl.radianToDegree(radian)};
    };


    /* utf.js - UTF-8 <=> UTF-16 convertion
     *
     * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
     * Version: 1.0
     * LastModified: Dec 25 1999
     * This library is free.  You can redistribute it and/or modify it.
     */
    KMUtl.Utf8ArrayToStr=function(array) {
        let out, i, len, c;
        let char2, char3;

        out = "";
        len = array.length;
        i = 0;
        while(i < len) {
            c = array[i++];
            switch(c >> 4)
            {
                case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
                case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    };

    return KMUtl;
}());

module.exports = KMUtl;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/***
 * KMComWebBLE.js
 * version 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

let KMUtl = __webpack_require__(1);
let KMComBase = __webpack_require__(6);

class KMComWebBLE extends KMComBase{
    /********************************************
     * 定数
     ********************************************/
    /**
     * constructor　
     * @param arg
     *
     */
    constructor(arg){
        super();
        this._deviceInfo.type="WEBBLE";
        this._characteristics={};
        this._bleSendingQue=Promise.resolve(true);
        this._queCount=0;
        
        //サービスUUID
        this._MOTOR_BLE_SERVICE_UUID='f140ea35-8936-4d35-a0ed-dfcd795baa8c';

        //キャラクタリスティクスUUID
        this._MOTOR_BLE_CRS={
            'MOTOR_CONTROL':'f1400001-8936-4d35-a0ed-dfcd795baa8c',//モーターへの設定、制御命令を取り扱う
            //'MOTOR_LED':'f1400003-8936-4d35-a0ed-dfcd795baa8c',//モーターのLEDを取り扱う info:: MOTOR_CONTROL::bleLedで代用
            'MOTOR_MEASUREMENT':'f1400004-8936-4d35-a0ed-dfcd795baa8c',//モーターの位置・速度・トルク等測定値を取り扱う
            'MOTOR_IMU_MEASUREMENT':'f1400005-8936-4d35-a0ed-dfcd795baa8c',//モーターの加速度・ジャイロセンサー（IMU）を取り扱う
            'MOTOR_SETTING':'f1400006-8936-4d35-a0ed-dfcd795baa8c'//モーターの設定値を取り扱う
        };
        this._DEVICE_INFORMATION_SERVICE_UUIDS={
            "Service":0x180a
            ,"ManufacturerNameString":0x2a29
            ,"HardwareRevisionString":0x2a27
            ,"FirmwareRevisionString":0x2a26
        };

        /**
         * BLE切断時
         * @param eve
         * @private
         */
       this._onBleConnectionLost=(eve)=>{
           this._deviceInfo.isConnect=false;
               this._peripheral=null;
               this._statusChange_isConnect(false);
       };
        /**
         * ---------------------------------------------------------
         * モーター回転情報受信
         * @param eve
         * @private
         * ---------------------------------------------------------
         * Notify したときの返り値
         * byte[0]-byte[3]	    byte[4]-byte[7]	        byte[8]-byte[11]
         * float * 		        float *                 float *
         * position:radians	    speed:radians/second	torque:N・m
         */
        this._onBleMotorMeasurement=(eve)=>{
            if(!eve||!eve.target){return;}
            let dv = eve.target.value;
            if(!(dv instanceof DataView)){return;}//info::web bluetoohのみ node.jsはinstanceof Buffer
            let res={position:dv.getFloat32(0,false),velocity:dv.getFloat32(4,false),torque:dv.getFloat32(8,false)};
            this._onMotorMeasurementCB(res);
        };
        /**
         * ---------------------------------------------------------
         * モーターIMU情報受信
         * @param eve
         * @private
         *
         * Notify したときの返り値)---------------------------------------------
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
        this._onBleImuMeasurement=(eve)=>{
            if(!eve||!eve.target){return;}
            let dv = eve.target.value;
            let tempCalibration=-5.7;//温度校正値
            if(!(dv instanceof DataView)){return;}//info::web bluetoohのみ node.jsはinstanceof Buffer
            //単位を扱い易いように変換
            let res={
                accelX:dv.getInt16(0,false)*2/32767,accelY:dv.getInt16(2,false)*2/32767,accelZ:dv.getInt16(4,false)*2/32767,
                temp:(dv.getInt16(6,false)) / 333.87 + 21.00+tempCalibration,
                gyroX:dv.getInt16(8,false)*250/32767,gyroY:dv.getInt16(10,false)*250/32767,gyroZ:dv.getInt16(12,false)*250/32767
            };

            // console.log(res);
            this._onImuMeasurementCB(res);
        };

        /**
         * ---------------------------------------------------------
         * モーター設定情報取得
         * @param eve
         * @private
         * ---------------------------------------------------------
         * Notify したときの返り値
         * byte[0]	byte[1]	byte[2]	byte[3] byte[4]以降	byte[n-2]	byte[n-1]
         * uint8_t:log_type	uint16_t:id	uint8_t:register	uint8_t:value	uint16_t:CRC
         * 0x40	uint16_t (2byte) 0～65535	レジスタコマンド	レジスタの値（コマンドによって変わる）	uint16_t (2byte) 0～65535
         */
        this._onBleMotorSetting=(eve)=>{
            if(!eve||!eve.target){return;}
            let dv = eve.target.value;//6+nバイト　データ仕様　https://docs.google.com/spreadsheets/d/1uxJu86Xe8KbIlxu5oPFv9KQdvHY33-NIy0cdSgInoUk/edit#gid=1000482383
            if(!(dv instanceof DataView)){return;}//info::web bluetoohのみ node.jsはinstanceof Buffer

            //-------------
            //データのparse
            //-------------
            let notifyBinLen=dv.byteLength;
            let notifyCmd=dv.getUint8(0);//レジスタ情報通知コマンドID 0x40固定

            if(notifyCmd!=0x40||notifyBinLen<=6){return;}//レジスタ情報を含まないデータの破棄

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

    }

    /********************************************
     * section::公開メソッド
     ********************************************/
    /**
     * BLEでの接続
     */
    connect(){
        if (this._peripheral&& this._peripheral.gatt&&this._peripheral.gatt.connected ) {return}
        let gat= (this._peripheral&& this._peripheral.gatt )?this._peripheral.gatt :undefined;//再接続用
        this._bleConnect(gat).then(obj=>{//info:: resolve({deviceID,deviceName,bleDevice,characteristics});
            this._peripheral=obj.bleDevice;
            this._deviceInfo.id=this._peripheral.id;
            this._deviceInfo.name=this._peripheral.name;
            this._deviceInfo.isConnect=this._peripheral.gatt.connected;
            this._deviceInfo.manufacturerName=obj.infomation.manufacturerName;
            this._deviceInfo.hardwareRevision=obj.infomation.hardwareRevision;
            this._deviceInfo.firmwareRevision=obj.infomation.firmwareRevision;
            //
            this._characteristics=obj.characteristics;

            if(!gat){
                this._peripheral.removeEventListener('gattserverdisconnected',this._onBleConnectionLost);
                this._peripheral.addEventListener('gattserverdisconnected', this._onBleConnectionLost);

                if(this._characteristics['MOTOR_MEASUREMENT']){
                    this._characteristics['MOTOR_MEASUREMENT'].removeEventListener('characteristicvaluechanged',this._onBleMotorMeasurement);
                    this._characteristics['MOTOR_MEASUREMENT'].addEventListener('characteristicvaluechanged',this._onBleMotorMeasurement);
                    this._characteristics['MOTOR_MEASUREMENT'].startNotifications().then(obj=>{
                       if(this._characteristics['MOTOR_IMU_MEASUREMENT']){
                           this._characteristics['MOTOR_IMU_MEASUREMENT'].removeEventListener('characteristicvaluechanged',this._onBleImuMeasurement);
                           this._characteristics['MOTOR_IMU_MEASUREMENT'].addEventListener('characteristicvaluechanged',this._onBleImuMeasurement);
                           return this._characteristics['MOTOR_IMU_MEASUREMENT'].startNotifications();
                       }
                   }).then(obj=>{
                        if(this._characteristics['MOTOR_SETTING']){
                            this._characteristics['MOTOR_SETTING'].removeEventListener('characteristicvaluechanged',this._onBleMotorSetting);
                            this._characteristics['MOTOR_SETTING'].addEventListener('characteristicvaluechanged',this._onBleMotorSetting);
                            return this._characteristics['MOTOR_SETTING'].startNotifications();
                        }
                   }).then(obj=>{
                        this._statusChange_init(true);
                        this._statusChange_isConnect(true);//初回のみ(comp以前は発火しない為)
                   })
                }
            }else {
                this._statusChange_isConnect(true);
            }
        }).catch(err=>{
            this._peripheral=null;
            this._onConnectFailureHandler(this,err);
        })
    }

    /**
     * BLEでの切断
     */
    disConnect(){
       if (!this._peripheral || !this._peripheral.gatt.connected){return;}
        this._peripheral.gatt.disconnect();
        this._peripheral=null;

    }

    /********************************************
     * 内部
     ********************************************/

    /**
     * BLE接続
     * @param gatt_obj ペアリング済みのGATTのデバイスに再接続用(ペアリングモーダルは出ない)
     * @returns {Promise}
     * @private
     */
    _bleConnect(gatt_obj) {
      //let self = this;
      return new Promise((resolve, reject)=> {
          // let bleDevice;
          // let deviceName;
          // let deviceID;
          if(!gatt_obj){
              let options = {
                  filters: [{services: [this._MOTOR_BLE_SERVICE_UUID]}],
                  optionalServices:[this._DEVICE_INFORMATION_SERVICE_UUIDS.Service]
              };
              navigator.bluetooth.requestDevice(options)
                  .then(device => {
                      this._bleGatconnect(device.gatt).then(res => {
                          resolve({
                              bleDevice: device,
                              deviceID: device.id,
                              deviceName: device.name,
                              characteristics:res.characteristics,
                              infomation:res.infomation

                          });
                      })
                      .catch(error => {
                          console.log(error);
                          reject(error);
                      });
                  })

          }else{
              this._bleGatconnect(gatt_obj)
                  .then(res => {
                      console.log("_bleGatconnect");
                      resolve({
                          deviceID: gatt_obj.device.id,
                          deviceName: gatt_obj.device.name,
                          bleDevice: gatt_obj.device,
                          characteristics:res.characteristics,
                          infomation:res.infomation

                      });
                  })
                  .catch(error => {
                      console.log(error);
                      reject(error);
                  });
          }
      });
    }

    //GATT接続用
    _bleGatconnect(gatt_obj){
            let characteristics = {};
            let infomation={};
            return new Promise((gresolve, greject)=> {
                gatt_obj.connect().then(server => {
                    // return server.getPrimaryServices(this._MOTOR_BLE_SERVICE_UUID);
                    let prs = [
                        server.getPrimaryService(this._MOTOR_BLE_SERVICE_UUID).then(service => {
                            let crs = [];
                            Object.keys(this._MOTOR_BLE_CRS).forEach((key) => {
                                crs.push(
                                    service.getCharacteristic(this._MOTOR_BLE_CRS[key])
                                        .then(chara => {
                                            characteristics[key] = chara;
                                        })
                                );
                            });
                            return Promise.all(crs);
                        }),
                        //ble_firmware_revisionのサービス取得
                        server.getPrimaryService(this._DEVICE_INFORMATION_SERVICE_UUIDS.Service).then((service) => {
                            let ifs = [];
                            ifs.push(
                                service.getCharacteristic(this._DEVICE_INFORMATION_SERVICE_UUIDS.ManufacturerNameString)
                                    .then(chara => {
                                        return chara.readValue();
                                    }).then(val => {
                                    infomation['manufacturerName'] = KMUtl.Utf8ArrayToStr(new Uint8Array(val.buffer));
                                })
                            );
                            ifs.push(
                                service.getCharacteristic(this._DEVICE_INFORMATION_SERVICE_UUIDS.FirmwareRevisionString)
                                    .then(chara => {
                                        return chara.readValue();
                                    }).then(val => {
                                    infomation['firmwareRevision'] = KMUtl.Utf8ArrayToStr(new Uint8Array(val.buffer));
                                })
                            );
                            ifs.push(
                                service.getCharacteristic(this._DEVICE_INFORMATION_SERVICE_UUIDS.HardwareRevisionString)
                                    .then(chara => {
                                        return chara.readValue();
                                    }).then(val => {
                                    infomation['hardwareRevision'] = KMUtl.Utf8ArrayToStr(new Uint8Array(val.buffer));
                                })
                            );
                            return Promise.all(ifs);
                        })
                    ];
                    return Promise.all(prs);
                }).then(() => {
                    gresolve({characteristics: characteristics, infomation: infomation});
                });
            });
    }



    /**
     * BLEコマンドの送信
     * @param commandTypeStr  'MOTOR_CONTROL','MOTOR_MEASUREMENT','MOTOR_IMU_MEASUREMENT','MOTOR_SETTING'
     * コマンド種別のString 主にBLEのキャラクタリスティクスで使用する
     * @param commandNum
     * @param arraybuffer
     * @param notifyPromis cmdReadRegister等のBLE呼び出し後にnotifyで取得する値をPromisで帰す必要のあるコマンド用
     * @private
     * ---------------------------------------------------------
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
          //  console.log("_sendMotorCommand queCount:"+(--this._queCount));
            if(notifyPromis){
                notifyPromis.startRejectTimeOutCount();
            }
            return characteristics.writeValue(buffer);
        }).catch(function(res){
            //失敗時　//info::後続のコマンドは引き続き実行される
          //  console.log("ERR _sendMotorCommand:"+res+" queCount:"+(--this._queCount));
            if(notifyPromis){
                notifyPromis.callReject(res);
            }
        });
    }


//////class//
}

module.exports =KMComWebBLE;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
/***
 *KMConnectorBrowser.js
 * version 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
global.KMUtl=__webpack_require__(1);
global.KMVector2=__webpack_require__(0).KMVector2;
global.KMVector3=__webpack_require__(0).KMVector3;
global.KMImuState=__webpack_require__(0).KMImuState;
global.KMLedState=__webpack_require__(0).KMLedState;
global.KMRotState=__webpack_require__(0).KMRotState;
global.KMDeviceInfo=__webpack_require__(0).KMDeviceInfo;
global.KMMotorOneWebBLE=__webpack_require__(5);



/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 4 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/***
 *KMMotorOneWebBLE.js
 * var 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */


let KMComWebBLE = __webpack_require__(2);
let KMMotorCommandKMOne=__webpack_require__(7);

class KMMotorOneWebBLE extends KMMotorCommandKMOne{
    /**
     * constructor
     * @param arg
     */
    constructor(){
        super(KMMotorCommandKMOne.KM_CONNECT_TYPE.WEBBLE,new KMComWebBLE());
    }

    connect(){
        this._KMCom.connect();
    }
    disConnect(){
        this._KMCom.disConnect();
    }
}

module.exports =KMMotorOneWebBLE;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/***
 * KMComBase.js
 * version 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

let KMUtl = __webpack_require__(1);
let KMStructures=__webpack_require__(0);

class KMComBase{
    /**********************
     * 定数
    **********************/
    /**
     * constructor　
     * @param arg
     *
     */
    constructor(arg){
        this._peripheral=null;
        this._commandCount=65530;
        this._deviceInfo=new KMStructures.KMDeviceInfo();

        this._motorMeasurement=new KMStructures.KMRotState();
        this._motorLed=new KMStructures.KMLedState();
        this._motorImuMeasurement=new KMStructures.KMImuState();
        //
        this._onInitHandler=function(connector){};
        this._onConnectHandler=function(connector){};
        this._onDisconnectHandler=function(connector){};
        this._onConnectFailureHandler=function(connector, msg){};

        this._onMotorMeasurementCB=function(){};
        this._onImuMeasurementCB=function(){};
        this._onMotorSettingCB=function(){};

        this._isInit=false;
        
        //_onBleMotorSettingのコマンド　モーター設定情報の通知受信時にパースする用
        this._MOTOR_SETTING_READREGISTER_COMMAND={
                "maxSpeed":0x02,
                "minSpeed":0x03,
                "curveType":0x05,
                "acc":0x07,
                "dec":0x08,
                "maxTorque":0x0E,
                "qCurrentP":0x18,
                "qCurrentI":0x19,
                "qCurrentD":0x1A,
                "speedP":0x1B,
                "speedI":0x1C,
                "speedD":0x1D,
                "positionP":0x1E,
                "ownColor":0x3A
        }
    }

    /**********************
     * プロパティ
     **********************/
    /**
     * デバイス情報
     * @returns {{name: string, id: string, info: null}}
     *
     */
    get deviceInfo(){
        return this._deviceInfo.Clone();
    }

    /**
     * 有効無効
     * @returns {*|boolean}
     */
    get isConnect(){
        return this._deviceInfo.isConnect;
    }

    /**
     * モーターコマンド順監視用連番の発行
     * @returns {number}
     */
    get createCommandID(){
        this._commandCount=(++this._commandCount)&0b1111111111111111;//65535でループ
    }

    /**
     * isConnectの設定変更(子クラスから使用)
     * @param bool
     * @private
     */
    _statusChange_isConnect(bool){
        this._deviceInfo.isConnect=bool;
        if(this._isInit){
            if(bool){
                this._onConnectHandler(this);
            }else{
                this._onDisconnectHandler(this);
            }
        }
    }

    /**
     * 初期化状態の設定(子クラスから使用)
     * @param bool
     * @private
     */
    _statusChange_init(bool){
        this._isInit=bool;
        if(this._isInit){
            this._onInitHandler(this);
        }
    }
    /**********************
     * callback
     **********************/
    /**
     * 初期化完了して利用できるようになった
     * @param handlerFunction
     * @constructor
     */
    set onInit(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onInitHandler=handlerFunction;
        }
    }
    /**
     * 応答・再接続に成功した
     * @param handlerFunction
     * @constructor
     */
    set onConnect(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onConnectHandler=handlerFunction;
        }
    }
    /**
     * 応答が無くなった・切断された
     * @param handlerFunction
     * @constructor
     */
    set onDisconnect(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onDisconnectHandler=handlerFunction;
        }
    }
    /**
     * 接続に失敗
     * @param handlerFunction
     * @constructor
     */
    set onConnectFailure(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onConnectFailureHandler=handlerFunction;
        }
    }

    /**
     * モーターの回転情報callback
     * @param func ({position,velocity,torque})
     */
    set onMotorMeasurement(func){
        if(typeof func==="function"){
            this._onMotorMeasurementCB=func;
        }
    }
    /**
     * モーターのジャイロ情報callback
     * @param func ({accelX,accelY,accelZ,temp,gyroX,gyroY,gyroZ})
     */
    set onImuMeasurement(func){
        if(typeof func==="function"){
            this._onImuMeasurementCB=func;
        }
    }

    /**
     * モーター設定情報取得callback
     * @param func (registerCmd,res)
     */
    set onMotorSetting(func){
        if(typeof func==="function"){
            this._onMotorSettingCB=func;
        }
    }
    

//////class//
}

module.exports =KMComBase;




/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/***
 * KMMotorCommandKMOne.js
 * version 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

let EventEmitter = __webpack_require__(8).EventEmitter;
let KMUtl = __webpack_require__(1);
let KMComWebBLE = __webpack_require__(2);
let KMStructures=__webpack_require__(0);

class KMMotorCommandKMOne extends EventEmitter{
    /********************************************
     * 定数
     ********************************************/
    /**
     * 接続方式
     * @returns {{"UNSETTLED":0,"BLE":1,"SERIAL":2}}
     * @constructor
     */
    static get KM_CONNECT_TYPE(){
        return {"WEBBLE":1,"BLE":2,"SERIAL":3};
    }

    static get cmdPreparePlaybackMotion_START_POSITION(){
        return{
            'START_POSITION_ABS':0,//記憶された開始位置（絶対座標）からスタート
            'START_POSITION_CURRENT':1//現在の位置を開始位置としてスタート
        };
    }
    static get cmdLed_LED_STATE(){
        return{
            'LED_STATE_OFF':0,	// LED消灯
            'LED_STATE_ON_SOLID':1,	// LED点灯（点灯しっぱなし）
            'LED_STATE_ON_FLASH':2,	// LED点滅（一定間隔で点滅）
            'LED_STATE_ON_DIM':3	// LEDがゆっくり明滅する
        };
    }
    static get cmdCurveType_CURVE_TYPE(){
        return{
            'CURVE_TYPE_NONE': 0,	// モーションコントロール OFF
            'CURVE_TYPE_TRAPEZOID':1	// モーションコントロール ON （台形加減速）
        };
    }
    /*
    * ReadRegisterで取得する時用のコマンド引数
    * */
    static get cmdReadRegister_COMMAND(){
        return{
            "maxSpeed":0x02,
            "minSpeed":0x03,
            "curveType":0x05,
            "acc":0x07,
            "dec":0x08,
            "maxTorque":0x0E,
            "qCurrentP":0x18,
            "qCurrentI":0x19,
            "qCurrentD":0x1A,
            "speedP":0x1B,
            "speedI":0x1C,
            "speedD":0x1D,
            "positionP":0x1E,
            "ownColor":0x3A
        };
    }

    /**
     * constructor　
     *  @param connect_type 接続方式 KMMotorCommandKMOne.KM_CONNECT_TYPE
     * @param kmcom
     */
    constructor(connect_type,kmcom){
        super();
        //イベントハンドラタイプ
        this.EVENT_TYPE={"init":"init","connect":"connect","disconnect":"disconnect","connectFailure":"connectFailure","motorMeasurement":"motorMeasurement","imuMeasurement":"imuMeasurement"};
        //モーターの全コマンド
        this._MOTOR_COMMAND={
            "maxSpeed":0x02,//最大速さを設定する
            "minSpeed":0x03,//最小速さを設定する
            "curveType":0x05,//加減速曲線を設定する
            "acc":0x07,//加速度を設定する
            "dec":0x08,//減速度を設定する
            "maxTorque":0x0E,//最大トルクを設定する
            "qCurrentP":0x18,//q軸電流PIDゲイン(P)を設定する
            "qCurrentI":0x19,//q軸電流PIDゲイン(I)を設定する
            "qCurrentD":0x1A,//q軸電流PIDゲイン(D)を設定する
            "speedP":0x1B,//速度PIDゲイン(P)を設定する
            "speedI":0x1C,//速度PIDゲイン(I)を設定する
            "speedD":0x1D,//速度PIDゲイン(D)を設定する
            "positionP":0x1E,//位置PIDゲイン(P)を設定する
            "resetPID":0x22,//PIDゲインをリセットする
            "ownColor":0x3A,//デバイスLEDの固有色を設定する
            "readRegister":0x40,//指定の設定値を取得する
            "saveAllRegisters":0x41,//全ての設定値をフラッシュに保存する
            "resetRegister":0x4E,//指定の設定値をリセットする
            "resetAllRegisters":0x4F,//全設定値をリセットする
            "disable":0x50,//モーターの動作を不許可とする
            "enable":0x51,//モーター動作を許可する
            "speed":0x58,//速度の大きさを設定する
            "presetPosition":0x5A,//位置のプリセットを行う（原点設定）
            "runForward":0x60,//正回転する（反時計回り）
            "runReverse":0x61,//逆回転する（時計回り）
            "moveToPosition":0x66,//絶対位置に移動する
            "moveByDistance":0x68,//相対位置に移動する
            "free":0x6C,//モーターの励磁を停止する
            "stop":0x6D,//速度ゼロまで減速し停止する
            "holdTorque":0x72,//トルク制御を行う
            "doTaskset":0x81,//タスクセットを実行する
            "preparePlaybackMotion":0x86,//モーション再生の開始地点に移動する
            "startPlayback":0x87,//モーションを再生する
            "stopPlayback":0x88,//モーション再生を停止する
            "pause":0x90,//キューを停止する
            "resume":0x91,//キューを再開する
            "wait":0x92,//キューを指定時間停止し再開する
            "reset":0x95,//キューをリセットする
            "startRecordingTaskset":0xA0,//タスクセットの記録を開始する
            "stopRecordingTaskset":0xA2,//タスクセットの記録を停止する
            "eraseTaskset":0xA3,//指定のタスクセットを削除する
            "eraseAllTasksets":0xA4,//タスクセットを全削除する
            "prepareTeachingMotion":0xAA,//ティーチングの開始準備を行う
            "startTeachingMotion":0xAB,//ティーチングを開始する
            "stopTeachingMotion":0xAC,//ティーチングを停止する
            "eraseMotion":0xAD,//ティーチングで覚えた動作を削除する
            "eraseAllMotion":0xAE,//ティーチングで覚えた全動作を削除する
            "led":0xE0,//LEDの点灯状態をセットする
            "enableIMU":0xEA,//IMUの値取得(通知)を開始する
            "disableIMU":0xEB,//IMUの値取得(通知)を停止する
            "reboot":0xF0,//システムを再起動する
            "enterDeviceFirmwareUpdate":0xFD//ファームウェアアップデートモードに入る
        };
        //モーターの全コマンド（逆引用）
        this._REV_MOTOR_COMMAND={};
        Object.keys(this._MOTOR_COMMAND).forEach((k)=>{this._REV_MOTOR_COMMAND[this._MOTOR_COMMAND[k]]=k;});
        //SendNotifyPromisのリスト
        this._notifyPromisList=[];

        this.KM_CONNECT_TYPE=this.constructor.KM_CONNECT_TYPE;
        this.cmdPreparePlaybackMotion_START_POSITION=this.constructor.cmdPreparePlaybackMotion_START_POSITION;
        this.cmdLed_LED_STATE=this.constructor.cmdLed_LED_STATE;
        this.cmdCurveType_CURVE_TYPE=this.constructor.cmdCurveType_CURVE_TYPE;
        //--------------------------
        // section::entry point
        //--------------------------
        this._connectType=connect_type;
        this._KMCom=kmcom;

        //内部イベントバインド
        this._KMCom.onInit=(connector)=>{
            this.emit(this.EVENT_TYPE.init,connector.deviceInfo);//デバイス情報を返す
        };
        this._KMCom.onConnect=(connector)=>{
            this.emit(this.EVENT_TYPE.connect,connector.deviceInfo);
        };
        this._KMCom.onDisconnect=(connector)=>{
            this.emit(this.EVENT_TYPE.disconnect,connector.deviceInfo);
        };
        this._KMCom.onConnectFailure=(connector, err)=>{
            this.emit(this.EVENT_TYPE.connectFailure,connector.deviceInfo);
        };
        /**
         * モーター回転情報受信
         * @param res {position:dv.getFloat32(0,false),velocity:dv.getFloat32(4,false),torque:dv.getFloat32(8,false)}
         */
        this._KMCom.onMotorMeasurement=(res)=>{
            let rotState=new KMStructures.KMRotState(res.position,res.velocity,res.torque);
            this.emit(this.EVENT_TYPE.motorMeasurement,rotState);
        };
        /**
         * モーターIMU情報受信
         * @param res {accelX,accelY,accelZ,temp,gyroX,gyroY,gyroZ}
         */
        this._KMCom.onImuMeasurement=(res)=>{
            let imuState=new KMStructures.KMImuState(res.accelX,res.accelY,res.accelZ,res.temp,res.gyroX,res.gyroY,res.gyroZ);
            this.emit(this.EVENT_TYPE.imuMeasurement,imuState);
        };
        /**
         * モーター設定情報取得
         * @param registerCmd
         * @param res {maxSpeed,minSpeed・・・ownColor}
         * @private
         */
        this._KMCom._onMotorSettingCB=(registerCmd, res)=>{
            _KMNotifyPromis.sendGroupNotifyResolve(this._notifyPromisList,registerCmd,res);
        };
    }
    /********************************************
     * プロパティ
     ********************************************/
    /**
     * モーターのBLE接続が有効か
     * @returns {boolean}
     */
    get isConnect(){
        return this._KMCom.deviceInfo.isConnect;
    }
    /**
     * 接続方式
     * @returns {KMMotorCommandKMOne.KM_CONNECT_TYPE}
     */
    get connectType(){
        return this._connectType;
    }

    /**
     * デバイス情報
     * @returns {{name: string, id: string, info: null}}
     *
     * info::メーカーサービスデータ(info)はwebBluetoohでは実装が無い為、ファームversionは取得出来ない 2017/12/1時点
     */
    get deviceInfo(){
        return this._KMCom.deviceInfo;
    }
    get connector(){
        return  this._KMCom;
    }

    /********************************************
     * callback
     ********************************************/
    /**
     * 初期化完了して利用できるようになった
     * @param handlerFunction(KMDeviceInfo)
     * @constructor
     */
    set onInit(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onInitHandler=handlerFunction;
        }
    }
    /**
     * 応答・再接続に成功した
     * @param handlerFunction(KMDeviceInfo)
     * @constructor
     */
    set onConnect(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onConnectHandler=handlerFunction;
        }
    }
    /**
     * 応答が無くなった・切断された
     * @param handlerFunction(KMDeviceInfo)
     * @constructor
     */
    set onDisconnect(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onDisconnectHandler=handlerFunction;
        }
    }
    /**
     * 接続に失敗
     * @param handlerFunction(KMDeviceInfo,err)
     * @constructor
     */
    set onConnectFailure(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onConnectFailureHandler=handlerFunction;
        }
    }

    /**
     * モーターの回転情報callback
     * @param func ({position,velocity,torque})
     */
    set onMotorMeasurement(func){
        if(typeof func==="function"){
            this._onMotorMeasurementCB=func;
        }
    }
    /**
     * モーターのジャイロ情報callback
     * @param func ({accelX,accelY,accelZ,temp,gyroX,gyroY,gyroZ})
     */
    set onImuMeasurement(func){
        if(typeof func==="function"){
            this._onImuMeasurementCB=func;
        }
    }
    /********************************************
     * 内部ユーティリティ
     ********************************************/

    /********************************************
     * section::モーターコマンド https://document.keigan-motor.com/motor-control-command/motor_action.html
     ********************************************/
   

    /**
     * モーター動作を不許可とする（上位命令）
     * 安全用：この命令を入れるとモーターは動作しない
     * コマンドはタスクセットに記録することは不可
     */
    cmdDisable(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.disable);
    }

    /**
     * モーター動作を許可する（上位命令）
     * 安全用：この命令を入れるとモーターは動作可能となる
     * モーター起動時は disable 状態のため、本コマンドで動作を許可する必要があり
     * コマンドはタスクセットに記録することは不可
     */
    cmdEnable(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.enable);
    }
    /**
     * 速度の大きさをセットする（単位系：RPM）
     * @param speed:Float  [0-X rpm]　(正の数)
     */
    cmdSpeed_rpm(speed_rpm){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speed_rpm*0.10471975511965977,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.speed,buffer);
    }
    /**
     * 速度の大きさをセットする（単位系：ラジアン）
     * @param speed:Float 速度の大きさ 単位：角度（ラジアン）/秒 [0-X rps]　(正の数)
     */
    cmdSpeed(speed){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speed,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.speed,buffer);
    }

    /**
     * 位置のプリセットを行う（原点設定）（単位系：ラジアン）
     * @param position:Float 絶対角度：radians
     */
    cmdPresetPosition(position){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,parseFloat(KMUtl.toNumber(position),10));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.presetPosition,buffer);
    }

    /**
     *正回転する（反時計回り）
     * cmdSpeed で保存された速度で、正回転
     */
    cmdRunForward(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.runForward);
    }

    /**
     * 逆回転する（時計回り）
     * cmdSpeed で保存された速度で、逆回転
     */
    cmdRunReverse(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.runReverse);
    }

    /**
     * 絶対位置に移動する
     * 速さは cmdSpeed で保存された速度が採用される
     * @param position:Float 角度：radians
     */
    cmdMoveToPosition(position){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,parseFloat(position,10));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.moveToPosition,buffer);
    }

    /**
     * 相対位置に移動する
     * 速さは cmdSpeed で保存された速度が採用される
     * @param distance:Float 角度：radians[左:+radians 右:-radians]
     */
    cmdMoveByDistance(distance){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,parseFloat(distance,10));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.moveByDistance,buffer);
    }

    /**
     * モーターの励磁を停止する（感触は残ります）
     * 完全フリー状態を再現する場合は、 bleFree().cmdDisable() として下さい。
     */
    cmdFree(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.free);
    }

    /**
     * モーターを速度ゼロまで減速し停止する
     * rpm = 0 となる。※実質 bleRunAt(0)と同じ
     */
    cmdStop(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.stop);
    }


    /**
     * トルク制御を行う
     * @param torque:Float トルク 単位：N・m [-X ~ + X Nm] 推奨値 0.3-0.05
     * ---------------------------------------------------------
     * info::速度や位置を同時に制御する場合は、モーター設定の 0x0E: maxTorque と 0x60: runForward 等を併用して下さい。
     *
     */
    cmdHoldTorque(torque){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,parseFloat(torque,10));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.holdTorque,buffer);
    }

    /**
     * 0x81 記憶したタスク（命令）のセットを実行する
     * @param index:int タスクセット番号（0～65535）
     * @param repeating:int 繰り返し回数 0は無制限 todo::未実装
     * ---------------------------------------------------------
     * info:: KM-1 は index: 0~49 まで。（50個のメモリバンク 各8128 Byte まで制限あり）
     * タスクセットの記録は、コマンド（タスクセット）を参照下さい。 https://document.keigan-motor.com/motor-control-command/taskset.html
     */
    cmdDoTaskset(index,repeating){
        let buffer = new ArrayBuffer(6);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(repeating,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.doTaskset,buffer);
    };

    /**
     * 0x86 モーション再生の開始地点に移動する
     * @param index:int モーション番号（0～65535）
     * @param repeating:int 繰り返し回数 0は無制限　todo::未実装
     * @param cmdPreparePlaybackMotion_START_POSITION:int スタート位置の設定　todo::未実装
     *          START_POSITION_ABS = 0; // 記憶された開始位置（絶対座標）からスタート
     *          START_POSITION_CURRENT = 1; // 現在の位置を開始位置としてスタート
     * ---------------------------------------------------------
     * info::※ KM-1 は index: 0~9 まで。（10個のメモリバンク。）それぞれ 約2分記録可能。
     * ティーチング（動作の記録）は、コマンド（ティーチング）を参照下さい。https://document.keigan-motor.com/motor-control-command/teaching.html
     *          repeating, option についてはファームウェア未実装
     *          再生回数は１回固定であり、本コマンドを実行すると、記録した絶対位置の最初のポイントに移動する
     *
     */
    cmdPreparePlaybackMotion(index,repeating,cmdPreparePlaybackMotion_START_POSITION){
        let buffer = new ArrayBuffer(7);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(repeating,10)));
        new DataView(buffer).setUint8(6,Math.abs(parseInt(cmdPreparePlaybackMotion_START_POSITION,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.preparePlaybackMotion,buffer);
    }

    /**
     * モーションを再生する
     */
    cmdStartPlayback(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.startPlayback);
    }

    /**
     * モーション再生を停止する
     */
    cmdStopPlayback(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.stopPlayback);
    }

    //---------------------//
    // section::キュー操作
    //---------------------//
    /**
     * キューを一時停止する 0x90
     */
    cmdPause(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.pause);
    }

    /**
     *キューを再開する（蓄積されたタスクを再開）
     */
    cmdResume(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.resume);
    }

    /**
     *キューを指定時間停止し再開する
     * pause（キュー停止）を実行し、指定時間（ミリ秒）経過後、自動的に resume（キュー再開） を行います。
     * @param time 停止時間[msec]（ミリ秒）
     */
    cmdWait(time){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setUint32(0,Math.abs(parseInt(time,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.wait,buffer);
    }

    /**
     *キューをリセットする
     */
    cmdReset(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.reset);
    }

    //---------------------//
    // section::タスクセット
    //---------------------//

    /**
     * タスク（命令）のセットの記録を開始する 0xA0
     *  ・記憶するインデックスのメモリはコマンド：eraseTaskset により予め消去されている必要があり
     * @param index:int インデックス KM-1 の場合、インデックスの値は 0～49 （計50個記録）
     */
    cmdStartRecordingTaskSet(index){
        let buffer = new ArrayBuffer(2);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.startRecordingTaskset,buffer);
    }

    /**
     * タスクセットの記録を停止する 0xA2
     * ・startRecordingTaskset 実施中のみ有効
     */
    cmdStopRecordingTaskset(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.stopRecordingTaskset);
    }

    /**
     * 指定のインデックスのタスクセットを消去する 0xA3
     * @param index:int インデックス
     */
    cmdEraseTaskset(index){
        let buffer = new ArrayBuffer(2);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.eraseTaskset,buffer);
    }

    /**
     * 全てのタスクセットを消去する 0xA4
     */
    cmdEraseAllTaskset(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.eraseAllTasksets);
    }

    //---------------------//
    // section::ティーチング
    //---------------------//
    
    /**
     * 0xAA インデックスと記録時間[msec]を指定し、ティーチングの開始準備を行う。
     * @param index インデックス
     * @param time 記録時間（ミリ秒） [msec 0-65408]
     * ---------------------------------------------------------
     * info::KM-1 の場合、インデックスの値は 0～9 （計10個記録）となる。記録時間は 65408 [msec] を超えることはできない
     *          記憶するインデックスのメモリはbleEraseMotion により予め消去されている必要がある
     * ---------------------------------------------------------
     */
    cmdPrepareTeachingMotion(index,lengthRecordingTime){
        let buffer = new ArrayBuffer(6);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(lengthRecordingTime,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.prepareTeachingMotion,buffer);
    }

    /**
     * 0xAB 直前に行った prepareTeachingMotion の条件でティーチングを開始する。
     * blePrepareTeachingMotion を実行した直後のみ有効。
     */
    cmdStartTeachingMotion(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.startTeachingMotion);
    }

    /**
     * 0xAC 実行中のティーチングを停止する
     */
    cmdStopTeachingMotion(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.stopTeachingMotion);
    }

    /**
     * 0xAD 指定したインデックスのモーションを消去する
     * @param index:int インデックス
     * ---------------------------------------------------------
     * info:: KM-1 の場合、インデックスの値は 0～9 （計10個記録）となる
     * ---------------------------------------------------------
     */
    cmdEraseMotion(index){
        let buffer = new ArrayBuffer(2);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.eraseMotion,buffer);
    }

    /**
     * 0xAE 全てのモーションを消去する
     */
    cmdEraseAllMotion(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.eraseAllMotion);
    }

    //---------------------//
    // section::LED
    //---------------------//
    /**
     * 0xE0 LEDの点灯状態をセットする
     * 点灯状態（OFF, 点灯：SOLID, 点滅：FLASH, ゆっくり明滅：DIM）と、RGB各色の強度を指定し、LEDの点灯状態をセットする。
     * @param cmdLed_LED_STATE:int
     *          LED_STATE_OFF = 0,	// LED消灯
     *          LED_STATE_ON_SOLID = 1,	// LED点灯（点灯しっぱなし）
     *          LED_STATE_ON_FLASH = 2,	// LED点滅（一定間隔で点滅）
     *          LED_STATE_ON_DIM = 3	// LEDがゆっくり明滅する
     * @param red:int 0-255
     * @param green:int 0-255
     * @param blue:int 0-255
     */
    cmdLed(cmdLed_LED_STATE,red,green,blue){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setUint8(0,Math.abs(parseInt(cmdLed_LED_STATE,10)));
        new DataView(buffer).setUint8(1,Math.abs(parseInt(red,10)));
        new DataView(buffer).setUint8(2,Math.abs(parseInt(green,10)));
        new DataView(buffer).setUint8(3,Math.abs(parseInt(blue,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.led,buffer);
    }

    //---------------------//
    // IMU ジャイロ
    //---------------------//
    /**
     * 0xEA　IMUの値取得(通知)を開始する info::BLE専用コマンド
     * ---------------------------------------------------------
     * info::本コマンドを実行すると、IMUのデータはBLEのキャラクタリスティクスMOTOR_IMU_MEASUREMENTに通知される
     *        MOTOR_IMU_MEASUREMENTのnotifyは_onBleImuMeasurementで取得
     * ---------------------------------------------------------
     */
    cmdEnableIMU(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.enableIMU);
    }

    /**
     * 0xEB IMUの値取得(通知)を停止する
     */
    cmdDisableIMU(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.disableIMU);
    }

    //---------------------//
    // システム
    //---------------------//
    /**
     * 0xF0 システムを再起動する
     * info::BLEに接続していた場合、切断してから再起動
     */
    cmdReboot(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.reboot);
    }

    /**
     * 0xFD ファームウェアアップデートモードに入る
     * info::ファームウェアをアップデートするためのブートローダーモードに入る。（システムは再起動される。）
     */
    cmdEnterDeviceFirmwareUpdate(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.enterDeviceFirmwareUpdate);
    }

    //---------------------//
    // モーター設定　MOTOR_SETTING
    //---------------------//
    /**
     * 0x02 モーターの最大速さを設定する
     * @param maxSpeed:float 最大速さ [radian / second]（正の値）
     */
    cmdMaxSpeed(maxSpeed){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(maxSpeed,10)));//todo::NaNが返る可能性 parseFloat("aaa",10)===NaN
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.maxSpeed,buffer);
    }

    /**
     * 0x03 モーターの最小速さを設定する
     * @param maxSpeed:float 最小速さ [radian / second]（正の値）
     * info::minSpeed は、blePreparePlaybackMotion 実行の際、開始地点に移動する速さとして使用される。通常時運転では使用されない。
     */
    cmdMinSpeed(minSpeed){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(minSpeed,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.minSpeed,buffer);
    }

    /**
     * 0x05 加減速曲線を指定する（モーションコントロールの設定）
     * @param cmdCurveType_CURVE_TYPE:int
     *      CURVE_TYPE_NONE = 0,	// モーションコントロール OFF
     *      CURVE_TYPE_TRAPEZOID = 1,	// モーションコントロール ON （台形加減速）
     */
    cmdCurveType(cmdCurveType_CURVE_TYPE){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,Math.abs(parseInt(cmdCurveType_CURVE_TYPE,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.curveType,buffer);
    }

    /**
     * 0x07 モーターの加速度を設定する
     * @param acc:float 加速度 0-200 [radian / second^2]（正の値）
     * info::acc は、モーションコントロール ON の場合、加速時に使用されます。（加速時の直線の傾き）
     */
    cmdAcc(acc){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(acc,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.acc,buffer);
    }

    /**
     * 0x08 モーターの減速度を設定する
     * @param dec:float 減速度 0-200 [radian / second^2]（正の値）
     * info::dec は、モーションコントロール ON の場合、減速時に使用されます。（減速時の直線の傾き）
     */
    cmdDec(dec){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(dec,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.dec,buffer);
    }

    /**
     * 0x0E モーターの最大トルク（絶対値）を設定する
     * @param maxTorque:float 最大トルク [N*m]（正の値）
     * ---------------------------------------------------------
     * info::maxTorque を設定することにより、トルクの絶対値が maxTorque を超えないように運転します。
     * info:: maxTorque = 0.1 [N*m] の後に runForward （正回転）を行った場合、0.1 N*m を超えないようにその速度をなるだけ維持する。
     * info:: ただし、トルクの最大値制限により、システムによっては制御性（振動）が悪化する可能性がある。
     *
     */
    cmdMaxTorque(maxTorque){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(maxTorque,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.maxTorque,buffer);
    }

    /**
     * 0x18 モーターのq軸電流PIDコントローラのP（比例）ゲインを設定する
     * @param qCurrentP:float q電流Pゲイン（正の値）
     */
    cmdQCurrentP(qCurrentP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentP,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.qCurrentP,buffer);
    }

    /**
     * 0x19 モーターのq軸電流PIDコントローラのP（比例）ゲインを設定する
     * @param qCurrentI:float q電流Iゲイン（正の値）
     */
    cmdQCurrentI(qCurrentI){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentI,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.qCurrentI,buffer);
    }

    /**
     * 0x1A モーターのq軸電流PIDコントローラのD（微分）ゲインを設定する
     * @param qCurrentD:float q電流Dゲイン（正の値）
     */
    cmdQCurrentD(qCurrentD){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentD,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.qCurrentD,buffer);
    }

    /**
     * 0x1B モーターのq軸電流PIDコントローラのD（微分）ゲインを設定する
     * @param speedP:float 速度Pゲイン（正の値）
     */
    cmdSpeedP(speedP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedP,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.speedP,buffer);
    }

    /**
     * 0x1C モーターの速度PIDコントローラのI（積分）ゲインを設定する
     * @param speedI:float 速度Iゲイン（正の値）
     */
    cmdSpeedI(speedI){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedI,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.speedI,buffer);
    }

    /**
     * 0x1D モーターの速度PIDコントローラのD（微分）ゲインを設定する
     * @param speedD:float 速度Dゲイン（正の値）
     */
    cmdSpeedD(speedD){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedD,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.speedD,buffer);
    }

    /**
     * 0x1E モーターの位置PIDコントローラのP（比例）ゲインを設定する
     * @param positionP:float 位置Pゲイン（正の値）
     */
    cmdPositionP(positionP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(positionP,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.positionP,buffer);
    }

    /**
     * 0x22 全てのPIDパラメータをリセットしてファームウェアの初期設定に戻す
     * info::qCurrentP, qCurrentI,  qCurrentD, speedP, speedI, speedD, positionP をリセットします
     *
     */
    cmdResetPID(){
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.resetPID);
    }

    /**
     * 0x3A モーターの起動時固有LEDカラーを設定する
     * @param red:int 0-255
     * @param green:int 0-255
     * @param blue:int 0-255
     *
     * info::ownColor はアイドル時の固有LEDカラー。saveAllSettingsを実行し、再起動後に初めて反映される。
     * この設定値を変更した場合、BLEの Device Name の下3桁が変更される。
     */
    cmdOwnColor(red,green,blue){
        let buffer = new ArrayBuffer(3);
        new DataView(buffer).setUint8(0,Math.abs(parseInt(red,10)));
        new DataView(buffer).setUint8(1,Math.abs(parseInt(green,10)));
        new DataView(buffer).setUint8(2,Math.abs(parseInt(blue,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.ownColor,buffer);
    }


    /**
     * 0x40 指定した設定値を取得 info::BLE専用コマンド todo::分離作業
     * @param registers:mix int [] 取得するプロパティのコマンド(レジスタ番号)値
     * @returns {Promise} 取得した値 registersがint=レジスタ値のプリミティブ値。registersがarray=レジスタ値のオブジェクト。
     * ---------------------------------------------------------
     * info:: 取得する値はコマンド実行後にBLEのキャラクタリスティクスMOTOR_SETTINGに通知される。
     *          それを拾ってpromiseオブジェクトののresolveに返して処理を繋ぐ
     *          MOTOR_SETTINGのnotifyは_onBleMotorSettingで取得
     * ---------------------------------------------------------
     */
    cmdReadRegister(registers){
        if(registers instanceof Array){
            return new Promise((allresolve, allreject)=> {
                var promiseList=[];
                for(let i=0;i<registers.length;i++){
                    let register=registers[i];
                    promiseList.push( new Promise((resolve, reject)=> {
                        let ccp=new _KMNotifyPromis(register,this._REV_MOTOR_COMMAND[register],this._notifyPromisList,resolve,reject,1000);//notify経由のresultをPromisと紐付け
                        let buffer = new ArrayBuffer(1);
                        new DataView(buffer).setUint8(0, parseInt(register, 10));
                        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.readRegister, buffer,ccp);
                    }));
                }
                Promise.all(promiseList).then((resar)=>{
                    let t=[{}].concat(resar);
                    let rtobj=Object.assign.apply(null,t);
                    allresolve(rtobj);
                }).catch((msg)=>{
                    allreject(msg);
                });
            });
        }else{
            return new Promise((lastresolve, lastreject)=> {
                let register=registers;
                new Promise((resolve, reject)=> {
                    let ccp=new _KMNotifyPromis(register,this._REV_MOTOR_COMMAND[register],this._notifyPromisList,resolve,reject,1000);//notify経由のresultをPromisと紐付け
                    let buffer = new ArrayBuffer(1);
                    new DataView(buffer).setUint8(0, parseInt(register, 10));
                    this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.readRegister, buffer,ccp);
                }).then((res)=>{
                    lastresolve(res[Object.keys(res)[0]]);
                }).catch((msg)=>{
                    lastreject(msg);
                });
            });
        }
    }

    /**
     * モーターの全てのレジスタ値の取得
     */
    cmdReadAllRegister(){
       let cm= this.constructor.cmdReadRegister_COMMAND;
        let allcmds=[];
        Object.keys(cm).forEach((k)=>{allcmds.push(cm[k]);});

       return this.cmdReadRegister(allcmds);
    }
    //////保存
    /**
     * 0x41 全ての設定値をフラッシュメモリに保存する
     * info::本コマンドを実行しない限り、設定値はモーターに永久的に保存されない(再起動で消える)
     */
    cmdSaveAllRegisters(){
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.saveAllRegisters);
    }

    //////リセット
    /**
     * 0x4E 指定したレジスタをファームウェアの初期値にリセットする
     * @param register:KMMotorCommandKMOne.cmdReadRegister_COMMAND 初期値にリセットするコマンド(レジスタ)値
     */
    cmdResetRegister(register){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(register,10));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.resetRegister,buffer);
    }
    /**
     * 0x4F 全てのレジスタをファームウェアの初期値にリセットする
     * info::bleSaveAllRegistersを実行しない限り、リセット値はモーターに永久的に保存されない(再起動で消える)
     */
    cmdResetAllRegisters(){
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.resetAllRegisters);
    }

    /********************************************
     * 内部
     ********************************************/


//////class//
}


/**
 * SendBleNotifyPromis
 * 　cmdReadRegister等のBLE呼び出し後に
 * 　コマンド結果がnotifyで通知されるコマンドをPromisと紐付ける為のクラス
 */
class _KMNotifyPromis{
    //成功通知
    static sendGroupNotifyResolve(groupArray,tagName,val){
        if(!groupArray instanceof Array){return;}
        //送信IDの通知 CallbackPromisで呼び出し元のメソッドのPromisに返す
        for(let i=0; i<groupArray.length; i++){
            if( groupArray[i].tagName===tagName ){
                groupArray[i].callResolve(val);
                groupArray.splice(i,1);
            }
        }
    }
    /**
     * const
     * @param tagName
     * @param groupArray
     * @param promisResolveObj
     * @param promisRejectObj
     * @param rejectTimeOut
     */
    constructor(tagName,tagInfo=null,groupArray=[],promisResolveObj, promisRejectObj,rejectTimeOut){
        this.timeoutId=0;
        this.tagName=tagName;
        this.tagInfo=tagInfo;
        this.groupArray=groupArray instanceof Array?groupArray:[];
        this.groupArray.push(this);
        this.promisResolveObj=promisResolveObj;
        this.promisRejectObj=promisRejectObj;
        this.rejectTimeOut=rejectTimeOut;
    }
    //カウントの開始 characteristics.writeValue呼び出し後に実行
    startRejectTimeOutCount(){
        this.timeoutId=setTimeout(()=>{
            this._removeGroup();
            this.promisRejectObj({msg:"timeout:",tagName:this.tagName,tagInfo:this.tagInfo});
        }, this.rejectTimeOut);
    }
    callResolve(arg){
        clearTimeout(this.timeoutId);
        this._removeGroup();
        this.promisResolveObj(arg);
    }
    callReject(msg){
        clearTimeout(this.timeoutId);
        this._removeGroup();
        this.promisRejectObj({msg:msg});
    }

    _removeGroup(){
        for(let i=0; i<this.groupArray.length; i++){
            if( this.groupArray===this){
                this.groupArray.splice(i,1);
                break;
            }
        }
    }

}

module.exports =KMMotorCommandKMOne;


/***/ }),
/* 8 */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMDM1YTZlOTliODI4NWViZjEwOTMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0tNU3RydWN0dXJlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvS01VdGwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0tNQ29tV2ViQkxFLmpzIiwid2VicGFjazovLy8uL3NyYy9LTUNvbm5lY3RvckJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvS01Nb3Rvck9uZVdlYkJMRS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvS01Db21CYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9LTU1vdG9yQ29tbWFuZEtNT25lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYiwwRkFBMEY7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsV0FBVztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQyx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQsdUI7Ozs7Ozs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQSwwQ0FBMEMsUUFBUTtBQUNsRCxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0EscUNBQXFDO0FBQ3JDLDBDQUEwQyxRQUFRO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDLHNDQUFzQztBQUN0QywwQ0FBMEMsUUFBUTs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7O0FBRXpDLGlEQUFpRCxRQUFROztBQUV6RCx5Q0FBeUM7QUFDekMsMkNBQTJDO0FBQzNDLHVEQUF1RDs7QUFFdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlGQUF5RjtBQUN6Riw4RkFBOEY7QUFDOUYseUNBQXlDLGtCQUFrQiw4Q0FBOEM7QUFDekc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBLDJEQUEyRDtBQUMzRCxvQkFBb0I7QUFDcEI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFO0FBQ2xFO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qix5Q0FBeUM7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0IsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QixtQkFBbUI7O0FBRW5CLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCO0FBQ3ZCLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsOEJBQThCLHlEQUF5RDtBQUN2RixpQkFBaUI7QUFDakIsYUFBYTtBQUNiOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IseUJBQXlCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7OztBQUdBO0FBQ0E7O0FBRUEsNEI7Ozs7Ozs7OENDdGFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ2pCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDOzs7Ozs7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EscUVBQXFFO0FBQ3JFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLHlCQUF5QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDRDQUE0QztBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBOzs7Ozs7Ozs7O0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELG1EQUFtRDtBQUMxRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUVBQWlFO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxxQkFBcUIseUJBQXlCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsNENBQTRDO0FBQ2pFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QztBQUN2QywyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkVBQTZFO0FBQzdFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsUUFBUTtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixtQkFBbUI7QUFDL0M7QUFDQTtBQUNBLDJJQUEySTtBQUMzSTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLDZCQUE2QjtBQUM3QjtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0EsdUlBQXVJO0FBQ3ZJO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2I7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MscUJBQXFCOztBQUUzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBLG9CQUFvQixxQkFBcUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MseURBQXlEO0FBQzNGLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsUUFBUTtBQUN0Qzs7QUFFQTtBQUNBLG9CQUFvQiwwQkFBMEI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7O0FDbjlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSCxvQkFBb0IsU0FBUztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiJpbmRleEJyb3dzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAwMzVhNmU5OWI4Mjg1ZWJmMTA5MyIsIi8qKipcbiAqIEtNU3RydWN0dXJlcy5qc1xuICogdmFyIDAuMS4wIGFscGhhXG4gKiBDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4ndXNlIHN0cmljdCc7XG5sZXQgS01VdGwgPSByZXF1aXJlKCcuL0tNVXRsJyk7XG5cblxuLyoqXG4gKiBzZWN0aW9uOjrmp4vpgKDkvZPjga7ln7rmnKzjg6Hjgr3jg4Pjg4lcbiAqIEVROuWQjOOBmOWApOOCkuaMgeOBpOOBi+OBruavlOi8g1xuICogQ2xvbmU66KSH6KO9XG4gKiBHZXRWYWxPYmo65YCk44Gu5Y+W5b6X77yIT2Jq77yJXG4gKiBHZXRWYWxBcnJheTrlgKTjga7lj5blvpfvvIjphY3liJfvvIlcbiAqL1xuY2xhc3MgS01TdHJ1Y3R1cmVCYXNle1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgfVxuICAgIC8v5YCk44Gu5q+U6LyDXG4gICAgRVEgKHRhcikge1xuICAgICAgICBpZighIHRhciApe3JldHVybiBmYWxzZTt9XG4gICAgICAgIGlmKHRoaXMuY29uc3RydWN0b3I9PT10YXIuY29uc3RydWN0b3Ipe1xuICAgICAgICAgICAgaWYodGhpcy5HZXRWYWxBcnJheSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuR2V0VmFsQXJyYXkoKS50b1N0cmluZygpPT09dGFyLkdldFZhbEFycmF5KCkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHRoaXMuR2V0VmFsT2JqKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5HZXRWYWxPYmooKSk9PT1KU09OLnN0cmluZ2lmeSh0YXIuR2V0VmFsT2JqKCkpOy8vIGJhZDo66YGF44GEXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICAvL+ikh+ijvVxuICAgIENsb25lICgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IHRoaXMuY29uc3RydWN0b3IoKSx0aGlzKTtcbiAgICB9XG4gICAgLy/lj5blvpcgT2JqZWN0XG4gICAgR2V0VmFsT2JqICgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sdGhpcyk7XG4gICAgfVxuICAgIEdldFZhbEFycmF5ICgpIHtcbiAgICAgICAgdmFyIGs9T2JqZWN0LmtleXModGhpcyk7XG4gICAgICAgIHZhciByPVtdO1xuICAgICAgICBmb3IodmFyIGk9MDtpPGsubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICByLnB1c2godGhpc1trW2ldXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxufVxuXG4vKipcbiAqIHNlY3Rpb246OlhZ5bqn5qiZXG4gKi9cbmNsYXNzIEtNVmVjdG9yMiBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKHgsIHkpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy54ID0geCA/IHggOiAwO1xuICAgICAgICB0aGlzLnkgPSB5ID8geSA6IDA7XG4gICAgfVxuICAgIE1vdmUgKGR4LCBkeSkge1xuICAgICAgICB0aGlzLnggKz0gZHg7XG4gICAgICAgIHRoaXMueSArPSBkeTtcbiAgICB9XG4gICAgLy8y54K56ZaT44Gu6Led6ZuiXG4gICAgRGlzdGFuY2UgKHZlY3RvcjIpIHtcbiAgICAgICAgaWYgKCEodmVjdG9yMiBpbnN0YW5jZW9mIEtNVmVjdG9yMikpIHtyZXR1cm47fVxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KCh0aGlzLngtdmVjdG9yMi54KSwyKSArIE1hdGgucG93KCh0aGlzLnktdmVjdG9yMi55KSwyKSk7XG4gICAgfVxuICAgIC8vMueCuemWk+OBruinkuW6plxuICAgIFJhZGlhbiAodmVjdG9yMikge1xuICAgICAgICBpZiAoISh2ZWN0b3IyIGluc3RhbmNlb2YgS01WZWN0b3IyKSkge3JldHVybjt9XG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueS12ZWN0b3IyLnksdGhpcy54LXZlY3RvcjIueCk7XG4gICAgfVxuICAgIC8vMCww44GL44KJ44Gu6Led6ZuiXG4gICAgRGlzdGFuY2VGcm9tWmVybygpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh0aGlzLngsMikgKyBNYXRoLnBvdyh0aGlzLnksMikpO1xuICAgIH1cbiAgICAvLzAsMOOBi+OCieOBruinkuW6plxuICAgIFJhZGlhbkZyb21aZXJvKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnksdGhpcy54KTtcbiAgICB9XG59XG4vKipcbiAqIHNlY3Rpb246OlhZWiAz5qyh5YWD44OZ44Kv44OI44OrXG4gKi9cbmNsYXNzIEtNVmVjdG9yMyBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgY29uc3RydWN0b3IoeCx5LHopIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy54ID0geD94OjA7XG4gICAgICAgIHRoaXMueSA9IHk/eTowO1xuICAgICAgICB0aGlzLnogPSB6P3o6MDtcbiAgICB9XG4gICAgLy/np7vli5VcbiAgICBNb3ZlIChkeCwgZHksIGR6KSB7XG4gICAgICAgIHRoaXMueCArPSBkeDtcbiAgICAgICAgdGhpcy55ICs9IGR5O1xuICAgICAgICB0aGlzLnogKz0gZHo7XG4gICAgfVxuICAgIC8vMueCuemWk+OBrui3nembolxuICAgIERpc3RhbmNlICh2ZWN0b3IzKSB7XG4gICAgICAgIGlmICghKHZlY3RvcjMgaW5zdGFuY2VvZiBLTVZlY3RvcjMpKSB7cmV0dXJuO31cbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdygodGhpcy54LXZlY3RvcjMueCksMikgKyBNYXRoLnBvdygodGhpcy55LXZlY3RvcjMueSksMikrIE1hdGgucG93KCh0aGlzLnotdmVjdG9yMy56KSwyKSk7XG4gICAgfVxuICAgIC8vMueCuemWk+OBruinkuW6pijlm57ou6LmlrnlkJHjga7mg4XloLHjgarjgZcpXG4gICAgUmFkaWFuICh2ZWN0b3IzKSB7XG4gICAgICAgIGlmICghKHZlY3RvcjMgaW5zdGFuY2VvZiBLTVZlY3RvcjMpKSB7cmV0dXJuO31cbiAgICAgICAgLy90b2RvOjoy54K56ZaT44Gu6KeS5bqmKOWbnui7ouaWueWQkeOBruaDheWgseOBquOBlylcbiAgICB9XG4gICAgLy8wLDDjgYvjgonjga7ot53pm6JcbiAgICBEaXN0YW5jZUZyb21aZXJvICgpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh0aGlzLngsMikgKyBNYXRoLnBvdyh0aGlzLnksMikrIE1hdGgucG93KHRoaXMueiwyKSk7XG4gICAgfVxuICAgIC8vMCwwLDDjgYvjgonjga7op5LluqZcbiAgICBSYWRpYW5Gcm9tWmVybyAoKSB7XG4gICAgICAgIC8vdG9kbzo6MCwwLDDjgYvjgonjga7op5LluqZcbiAgICB9XG59XG4vKipcbiAqIHNlY3Rpb246OuOCuOODo+OCpOODreOCu+ODs+OCteODvOWApFxuICovXG5jbGFzcyBLTUltdVN0YXRlIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICBjb25zdHJ1Y3RvciAoYWNjZWxYLCBhY2NlbFksIGFjY2VsWiwgdGVtcCwgZ3lyb1gsIGd5cm9ZLCBneXJvWiApIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmFjY2VsWD0gS01VdGwudG9OdW1iZXIoYWNjZWxYKTtcbiAgICAgICAgdGhpcy5hY2NlbFk9IEtNVXRsLnRvTnVtYmVyKGFjY2VsWSk7XG4gICAgICAgIHRoaXMuYWNjZWxaPSBLTVV0bC50b051bWJlcihhY2NlbFopO1xuICAgICAgICB0aGlzLnRlbXA9IEtNVXRsLnRvTnVtYmVyKHRlbXApO1xuICAgICAgICB0aGlzLmd5cm9YPSBLTVV0bC50b051bWJlcihneXJvWCk7XG4gICAgICAgIHRoaXMuZ3lyb1k9IEtNVXRsLnRvTnVtYmVyKGd5cm9ZKTtcbiAgICAgICAgdGhpcy5neXJvWj0gS01VdGwudG9OdW1iZXIoZ3lyb1opO1xuICAgIH1cbn1cbi8qKlxuICogS0VJR0FO44Oi44O844K/44O8TEVE44CA54K554Gv44O76Imy54q25oWLXG4gKiBTdGF0ZSBNT1RPUl9MRURfU1RBVEVcbiAqIGNvbG9yUiAwLTI1NVxuICogY29sb3JHIDAtMjU1XG4gKiBjb2xvckIgMC0yNTVcbiAqICovXG5jbGFzcyBLTUxlZFN0YXRlIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICBzdGF0aWMgZ2V0IE1PVE9SX0xFRF9TVEFURSgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PRkZcIjowLC8vTEVE5raI54GvXG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PTl9TT0xJRFwiOjEsLy9MRUTngrnnga/vvIjngrnnga/jgZfjgaPjgbHjgarjgZfvvIlcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09OX0ZMQVNIXCI6MiwvL0xFROeCuea7he+8iOS4gOWumumWk+malOOBp+eCuea7he+8iVxuICAgICAgICAgICAgXCJNT1RPUl9MRURfU1RBVEVfT05fRElNXCI6MyAgLy9MRUTjgYzjgobjgaPjgY/jgorovJ3luqblpInljJbjgZnjgotcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdHJ1Y3RvcihzdGF0ZSxjb2xvclIsY29sb3JHLGNvbG9yQikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnN0YXRlPUtNVXRsLnRvTnVtYmVyKHN0YXRlKTtcbiAgICAgICAgdGhpcy5jb2xvclI9S01VdGwudG9OdW1iZXIoY29sb3JSKTtcbiAgICAgICAgdGhpcy5jb2xvckc9S01VdGwudG9OdW1iZXIoY29sb3JHKTtcbiAgICAgICAgdGhpcy5jb2xvckI9S01VdGwudG9OdW1iZXIoY29sb3JCKTtcbiAgICB9XG59XG5cbi8qKlxuICogc2VjdGlvbjo644Oi44O844K/44O85Zue6Lui5oOF5aCxXG4gKi9cbmNsYXNzIEtNUm90U3RhdGUgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuXG4gICAgc3RhdGljIGdldCBNQVhfVE9SUVVFKCl7XG4gICAgICAgIHJldHVybiAwLjM7Ly8wLjMgTuODu21cbiAgICB9XG4gICAgc3RhdGljIGdldCBNQVhfU1BFRURfUlBNKCl7XG4gICAgICAgIHJldHVybiAzMDA7Ly8zMDBycG1cbiAgICB9XG4gICAgc3RhdGljIGdldCBNQVhfU1BFRURfUkFESUFOKCl7XG4gICAgICAgIHJldHVybiBLTVV0bC5ycG1Ub1JhZGlhblNlYygzMDApO1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0IE1BWF9QT1NJVElPTigpe1xuICAgICAgICByZXR1cm4gMypNYXRoLnBvdygxMCwzOCk7Ly9pbmZvOjrjgIxyZXR1cm7jgIAzZSszOOOAjeOBr21pbmlmeeOBp+OCqOODqeODvFxuICAgICAgICAvL3JldHVybuOAgDNlKzM4Oy8vcmFkaWFuIDRieXRlIGZsb2F044CAMS4xNzU0OTQgMTAtMzggIDwgMy40MDI4MjMgMTArMzhcbiAgICB9XG4gICAgY29uc3RydWN0b3IocG9zaXRpb24sIHZlbG9jaXR5LCB0b3JxdWUpIHtcbiAgICAgICAgLy/mnInlirnmoYHmlbAg5bCP5pWw56ysM+S9jVxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gTWF0aC5mbG9vcihLTVV0bC50b051bWJlcihwb3NpdGlvbikqMTAwKS8xMDA7XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBNYXRoLmZsb29yKEtNVXRsLnRvTnVtYmVyKHZlbG9jaXR5KSoxMDApLzEwMDtcbiAgICAgICAgdGhpcy50b3JxdWUgPSBNYXRoLmZsb29yKEtNVXRsLnRvTnVtYmVyKHRvcnF1ZSkqMTAwMDApLzEwMDAwO1xuICAgIH1cbn1cblxuLyoqXG4gKiBzZWN0aW9uOjrjg4fjg5DjgqTjgrnmg4XloLFcbiAqL1xuY2xhc3MgS01EZXZpY2VJbmZvIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICBjb25zdHJ1Y3Rvcih0eXBlPVwiXCIsaWQ9XCJcIixuYW1lPVwiXCIsaXNDb25uZWN0PWZhbHNlLG1hbnVmYWN0dXJlck5hbWU9bnVsbCxoYXJkd2FyZVJldmlzaW9uPW51bGwsZmlybXdhcmVSZXZpc2lvbj1udWxsKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZT10eXBlO1xuICAgICAgICB0aGlzLmlkPWlkO1xuICAgICAgICB0aGlzLm5hbWU9bmFtZTtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3Q9aXNDb25uZWN0O1xuICAgICAgICB0aGlzLm1hbnVmYWN0dXJlck5hbWU9bWFudWZhY3R1cmVyTmFtZTtcbiAgICAgICAgdGhpcy5oYXJkd2FyZVJldmlzaW9uPWhhcmR3YXJlUmV2aXNpb247XG4gICAgICAgIHRoaXMuZmlybXdhcmVSZXZpc2lvbj1maXJtd2FyZVJldmlzaW9uO1xuICAgIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBLTVN0cnVjdHVyZUJhc2U6S01TdHJ1Y3R1cmVCYXNlLFxuICAgIEtNVmVjdG9yMjpLTVZlY3RvcjIsXG4gICAgS01WZWN0b3IzOktNVmVjdG9yMyxcbiAgICBLTUltdVN0YXRlOktNSW11U3RhdGUsXG4gICAgS01MZWRTdGF0ZTpLTUxlZFN0YXRlLFxuICAgIEtNUm90U3RhdGU6S01Sb3RTdGF0ZSxcbiAgICBLTURldmljZUluZm86S01EZXZpY2VJbmZvXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvS01TdHJ1Y3R1cmVzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKipcbiAqIEtNVXRsLmpzXG4gKiB2ZXJzaW9uIDAuMS4wIGFscGhhXG4gKiBDQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xudmFyIEtNVXRsID0gKGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiBLTVV0bCgpIHtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmlbDlgKTjgavjgq3jg6Pjgrnjg4jjgZnjgovplqLmlbAgKEMp44CAXG4gICAgICog5pWw5YCk5Lul5aSW44GvMOOCkui/lOOBmVxuICAgICAqIEluZmluaXR544KCMOOBqOOBmeOCi1xuICAgICAqL1xuICAgIEtNVXRsLnRvTnVtYmVyPWZ1bmN0aW9uIHRvTnVtYmVyKHZhbCwgZGVmYXVsdHZhbCA9IDApIHtcbiAgICAgICAgdmFyIHYgPSBwYXJzZUZsb2F0KHZhbCwgMTApO1xuICAgICAgICByZXR1cm4gKGlzTmFOKHYpIHx8IHZhbCA9PT0gSW5maW5pdHkgPyBkZWZhdWx0dmFsIDogdik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiDljZjkvY3lpInmj5vjgIBkZWdyZWUgPj4gcmFkaWFuXG4gICAgICogQHBhcmFtIGRlZ3JlZVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgICAgIEtNVXRsLmRlZ3JlZVRvUmFkaWFuPSBmdW5jdGlvbiBkZWdyZWVUb1JhZGlhbihkZWdyZWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZ3JlZSAqIDAuMDE3NDUzMjkyNTE5OTQzMjk1O1xuICAgIH07XG4gICAgLyoqXG4gICAgICog5Y2Y5L2N5aSJ5o+b44CAcmFkaWFuID4+IGRlZ3JlZVxuICAgICAqIEBwYXJhbSByYWRpYW5cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIEtNVXRsLnJhZGlhblRvRGVncmVlPSBmdW5jdGlvbiByYWRpYW5Ub0RlZ3JlZShyYWRpYW4pIHtcbiAgICAgICAgcmV0dXJuIHJhZGlhbiAvIDAuMDE3NDUzMjkyNTE5OTQzMjk1O1xuICAgIH07XG4gICAgLyoqXG4gICAgICog6YCf5bqmIHJwbSAtPnJhZGlhbi9zZWMg44Gr5aSJ5o+bXG4gICAgICogQHBhcmFtIHJwbVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgS01VdGwucnBtVG9SYWRpYW5TZWM9IGZ1bmN0aW9uIHJwbVRvUmFkaWFuU2VjKHJwbSkge1xuICAgICAgICAvL+mAn+W6piBycG0gLT5yYWRpYW4vc2VjKE1hdGguUEkqMi82MClcbiAgICAgICAgcmV0dXJuIHJwbSAqIDAuMTA0NzE5NzU1MTE5NjU5Nzc7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiAy54K56ZaT44Gu6Led6Zui44Go6KeS5bqm44KS5rGC44KB44KLXG4gICAgICogQHBhcmFtIGZyb21feCxmcm9tX3ksdG9feCx0b195XG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBLTVV0bC50d29Qb2ludERpc3RhbmNlQW5nbGU9IGZ1bmN0aW9uIHR3b1BvaW50RGlzdGFuY2VBbmdsZShmcm9tX3gsIGZyb21feSwgdG9feCwgdG9feSkge1xuICAgICAgICB2YXIgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coZnJvbV94IC0gdG9feCwgMikgKyBNYXRoLnBvdyhmcm9tX3kgLSB0b195LCAyKSk7XG4gICAgICAgIHZhciByYWRpYW4gPSBNYXRoLmF0YW4yKGZyb21feSAtIHRvX3ksIGZyb21feCAtIHRvX3gpO1xuICAgICAgICByZXR1cm4ge2Rpc3Q6IGRpc3RhbmNlLCByYWRpOiByYWRpYW4sIGRlZzogS01VdGwucmFkaWFuVG9EZWdyZWUocmFkaWFuKX07XG4gICAgfTtcblxuXG4gICAgLyogdXRmLmpzIC0gVVRGLTggPD0+IFVURi0xNiBjb252ZXJ0aW9uXG4gICAgICpcbiAgICAgKiBDb3B5cmlnaHQgKEMpIDE5OTkgTWFzYW5hbyBJenVtbyA8aXpAb25pY29zLmNvLmpwPlxuICAgICAqIFZlcnNpb246IDEuMFxuICAgICAqIExhc3RNb2RpZmllZDogRGVjIDI1IDE5OTlcbiAgICAgKiBUaGlzIGxpYnJhcnkgaXMgZnJlZS4gIFlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQuXG4gICAgICovXG4gICAgS01VdGwuVXRmOEFycmF5VG9TdHI9ZnVuY3Rpb24oYXJyYXkpIHtcbiAgICAgICAgbGV0IG91dCwgaSwgbGVuLCBjO1xuICAgICAgICBsZXQgY2hhcjIsIGNoYXIzO1xuXG4gICAgICAgIG91dCA9IFwiXCI7XG4gICAgICAgIGxlbiA9IGFycmF5Lmxlbmd0aDtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIHdoaWxlKGkgPCBsZW4pIHtcbiAgICAgICAgICAgIGMgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgc3dpdGNoKGMgPj4gNClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogY2FzZSAyOiBjYXNlIDM6IGNhc2UgNDogY2FzZSA1OiBjYXNlIDY6IGNhc2UgNzpcbiAgICAgICAgICAgICAgICAvLyAweHh4eHh4eFxuICAgICAgICAgICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTI6IGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgLy8gMTEweCB4eHh4ICAgMTB4eCB4eHh4XG4gICAgICAgICAgICAgICAgY2hhcjIgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDB4MUYpIDw8IDYpIHwgKGNoYXIyICYgMHgzRikpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICAgICAgICAgIC8vIDExMTAgeHh4eCAgMTB4eCB4eHh4ICAxMHh4IHh4eHhcbiAgICAgICAgICAgICAgICAgICAgY2hhcjIgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgICAgICAgICBjaGFyMyA9IGFycmF5W2krK107XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDB4MEYpIDw8IDEyKSB8XG4gICAgICAgICAgICAgICAgICAgICAgICAoKGNoYXIyICYgMHgzRikgPDwgNikgfFxuICAgICAgICAgICAgICAgICAgICAgICAgKChjaGFyMyAmIDB4M0YpIDw8IDApKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9O1xuXG4gICAgcmV0dXJuIEtNVXRsO1xufSgpKTtcblxubW9kdWxlLmV4cG9ydHMgPSBLTVV0bDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9LTVV0bC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKioqXG4gKiBLTUNvbVdlYkJMRS5qc1xuICogdmVyc2lvbiAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xubGV0IEtNVXRsID0gcmVxdWlyZSgnLi9LTVV0bCcpO1xubGV0IEtNQ29tQmFzZSA9IHJlcXVpcmUoJy4vS01Db21CYXNlJyk7XG5cbmNsYXNzIEtNQ29tV2ViQkxFIGV4dGVuZHMgS01Db21CYXNle1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWumuaVsFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvcuOAgFxuICAgICAqIEBwYXJhbSBhcmdcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGFyZyl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2RldmljZUluZm8udHlwZT1cIldFQkJMRVwiO1xuICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3M9e307XG4gICAgICAgIHRoaXMuX2JsZVNlbmRpbmdRdWU9UHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgICB0aGlzLl9xdWVDb3VudD0wO1xuICAgICAgICBcbiAgICAgICAgLy/jgrXjg7zjg5PjgrlVVUlEXG4gICAgICAgIHRoaXMuX01PVE9SX0JMRV9TRVJWSUNFX1VVSUQ9J2YxNDBlYTM1LTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4Yyc7XG5cbiAgICAgICAgLy/jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrlVVUlEXG4gICAgICAgIHRoaXMuX01PVE9SX0JMRV9DUlM9e1xuICAgICAgICAgICAgJ01PVE9SX0NPTlRST0wnOidmMTQwMDAwMS04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLC8v44Oi44O844K/44O844G444Gu6Kit5a6a44CB5Yi25b6h5ZG95Luk44KS5Y+W44KK5omx44GGXG4gICAgICAgICAgICAvLydNT1RPUl9MRUQnOidmMTQwMDAwMy04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLC8v44Oi44O844K/44O844GuTEVE44KS5Y+W44KK5omx44GGIGluZm86OiBNT1RPUl9DT05UUk9MOjpibGVMZWTjgafku6PnlKhcbiAgICAgICAgICAgICdNT1RPUl9NRUFTVVJFTUVOVCc6J2YxNDAwMDA0LTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4YycsLy/jg6Ljg7zjgr/jg7zjga7kvY3nva7jg7vpgJ/luqbjg7vjg4jjg6vjgq/nrYnmuKzlrprlgKTjgpLlj5bjgormibHjgYZcbiAgICAgICAgICAgICdNT1RPUl9JTVVfTUVBU1VSRU1FTlQnOidmMTQwMDAwNS04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLC8v44Oi44O844K/44O844Gu5Yqg6YCf5bqm44O744K444Oj44Kk44Ot44K744Oz44K144O877yISU1V77yJ44KS5Y+W44KK5omx44GGXG4gICAgICAgICAgICAnTU9UT1JfU0VUVElORyc6J2YxNDAwMDA2LTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4YycvL+ODouODvOOCv+ODvOOBruioreWumuWApOOCkuWPluOCiuaJseOBhlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUz17XG4gICAgICAgICAgICBcIlNlcnZpY2VcIjoweDE4MGFcbiAgICAgICAgICAgICxcIk1hbnVmYWN0dXJlck5hbWVTdHJpbmdcIjoweDJhMjlcbiAgICAgICAgICAgICxcIkhhcmR3YXJlUmV2aXNpb25TdHJpbmdcIjoweDJhMjdcbiAgICAgICAgICAgICxcIkZpcm13YXJlUmV2aXNpb25TdHJpbmdcIjoweDJhMjZcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQkxF5YiH5pat5pmCXG4gICAgICAgICAqIEBwYXJhbSBldmVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgdGhpcy5fb25CbGVDb25uZWN0aW9uTG9zdD0oZXZlKT0+e1xuICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmlzQ29ubmVjdD1mYWxzZTtcbiAgICAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9bnVsbDtcbiAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZV9pc0Nvbm5lY3QoZmFsc2UpO1xuICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44Oi44O844K/44O85Zue6Lui5oOF5aCx5Y+X5L+hXG4gICAgICAgICAqIEBwYXJhbSBldmVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIE5vdGlmeSDjgZfjgZ/jgajjgY3jga7ov5TjgorlgKRcbiAgICAgICAgICogYnl0ZVswXS1ieXRlWzNdXHQgICAgYnl0ZVs0XS1ieXRlWzddXHQgICAgICAgIGJ5dGVbOF0tYnl0ZVsxMV1cbiAgICAgICAgICogZmxvYXQgKiBcdFx0ICAgICAgICBmbG9hdCAqICAgICAgICAgICAgICAgICBmbG9hdCAqXG4gICAgICAgICAqIHBvc2l0aW9uOnJhZGlhbnNcdCAgICBzcGVlZDpyYWRpYW5zL3NlY29uZFx0dG9ycXVlOk7jg7ttXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vbkJsZU1vdG9yTWVhc3VyZW1lbnQ9KGV2ZSk9PntcbiAgICAgICAgICAgIGlmKCFldmV8fCFldmUudGFyZ2V0KXtyZXR1cm47fVxuICAgICAgICAgICAgbGV0IGR2ID0gZXZlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgIGlmKCEoZHYgaW5zdGFuY2VvZiBEYXRhVmlldykpe3JldHVybjt9Ly9pbmZvOjp3ZWIgYmx1ZXRvb2jjga7jgb8gbm9kZS5qc+OBr2luc3RhbmNlb2YgQnVmZmVyXG4gICAgICAgICAgICBsZXQgcmVzPXtwb3NpdGlvbjpkdi5nZXRGbG9hdDMyKDAsZmFsc2UpLHZlbG9jaXR5OmR2LmdldEZsb2F0MzIoNCxmYWxzZSksdG9ycXVlOmR2LmdldEZsb2F0MzIoOCxmYWxzZSl9O1xuICAgICAgICAgICAgdGhpcy5fb25Nb3Rvck1lYXN1cmVtZW50Q0IocmVzKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7xJTVXmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIGV2ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKlxuICAgICAgICAgKiBOb3RpZnkg44GX44Gf44Go44GN44Gu6L+U44KK5YCkKS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKlxuICAgICAgICAgKiBhY2NlbF94LCBhY2NlbF95LCBhY2NlbF96LCB0ZW1wLCBneXJvX3gsIGd5cm9feSwgZ3lyb196IOOBjOWFqOOBpui/lOOBo+OBpuOBj+OCi+OAguWPluW+l+mWk+malOOBrzEwMG1zIOWbuuWumlxuICAgICAgICAgKiBieXRlKEJpZ0VuZGlhbikgIFswXVsxXSBbMl1bM10gIFs0XVs1XSAgIFs2XVs3XVx0ICAgIFs4XVs5XVx0WzEwXVsxMV0gICAgWzEyXVsxM11cbiAgICAgICAgICogICAgICAgICAgICAgICAgICBpbnQxNl90IGludDE2X3QgaW50MTZfdCBpbnQxNl90ICAgICBpbnQxNl90IGludDE2X3QgaW50MTZfdFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgIGFjY2VsLXggYWNjZWwteSBhY2NlbC16IHRlbXBcdCAgICBneXJvLXhcdGd5cm8teVx0Z3lyby16XG4gICAgICAgICAqXG4gICAgICAgICAqIGludDE2X3Q6LTMyLDc2OOOAnDMyLDc2OFxuICAgICAgICAgKiDmnLrjga7kuIrjgavjg6Ljg7zjgr/jg7zjgpLnva7jgYTjgZ/loLTlkIjjgIHliqDpgJ/luqbjgIB6ID0gMTYwMDAg56iL5bqm44Go44Gq44KL44CC77yI6YeN5Yqb5pa55ZCR44Gu44Gf44KB77yJXG4gICAgICAgICAqXG4gICAgICAgICAqIOWNmOS9jeWkieaPm++8iS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjgIDliqDpgJ/luqYgdmFsdWUgW0ddID0gcmF3X3ZhbHVlICogMiAvIDMyLDc2N1xuICAgICAgICAgKiDjgIDmuKnluqYgdmFsdWUgW+KEg10gPSByYXdfdmFsdWUgLyAzMzMuODcgKyAyMS4wMFxuICAgICAgICAgKiDjgIDop5LpgJ/luqZcbiAgICAgICAgICog44CA44CAdmFsdWUgW2RlZ3JlZS9zZWNvbmRdID0gcmF3X3ZhbHVlICogMjUwIC8gMzIsNzY3XG4gICAgICAgICAqIOOAgOOAgHZhbHVlIFtyYWRpYW5zL3NlY29uZF0gPSByYXdfdmFsdWUgKiAwLjAwMDEzMzE2MjExXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vbkJsZUltdU1lYXN1cmVtZW50PShldmUpPT57XG4gICAgICAgICAgICBpZighZXZlfHwhZXZlLnRhcmdldCl7cmV0dXJuO31cbiAgICAgICAgICAgIGxldCBkdiA9IGV2ZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICBsZXQgdGVtcENhbGlicmF0aW9uPS01Ljc7Ly/muKnluqbmoKHmraPlgKRcbiAgICAgICAgICAgIGlmKCEoZHYgaW5zdGFuY2VvZiBEYXRhVmlldykpe3JldHVybjt9Ly9pbmZvOjp3ZWIgYmx1ZXRvb2jjga7jgb8gbm9kZS5qc+OBr2luc3RhbmNlb2YgQnVmZmVyXG4gICAgICAgICAgICAvL+WNmOS9jeOCkuaJseOBhOaYk+OBhOOCiOOBhuOBq+WkieaPm1xuICAgICAgICAgICAgbGV0IHJlcz17XG4gICAgICAgICAgICAgICAgYWNjZWxYOmR2LmdldEludDE2KDAsZmFsc2UpKjIvMzI3NjcsYWNjZWxZOmR2LmdldEludDE2KDIsZmFsc2UpKjIvMzI3NjcsYWNjZWxaOmR2LmdldEludDE2KDQsZmFsc2UpKjIvMzI3NjcsXG4gICAgICAgICAgICAgICAgdGVtcDooZHYuZ2V0SW50MTYoNixmYWxzZSkpIC8gMzMzLjg3ICsgMjEuMDArdGVtcENhbGlicmF0aW9uLFxuICAgICAgICAgICAgICAgIGd5cm9YOmR2LmdldEludDE2KDgsZmFsc2UpKjI1MC8zMjc2NyxneXJvWTpkdi5nZXRJbnQxNigxMCxmYWxzZSkqMjUwLzMyNzY3LGd5cm9aOmR2LmdldEludDE2KDEyLGZhbHNlKSoyNTAvMzI3NjdcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICB0aGlzLl9vbkltdU1lYXN1cmVtZW50Q0IocmVzKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIOODouODvOOCv+ODvOioreWumuaDheWgseWPluW+l1xuICAgICAgICAgKiBAcGFyYW0gZXZlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBOb3RpZnkg44GX44Gf44Go44GN44Gu6L+U44KK5YCkXG4gICAgICAgICAqIGJ5dGVbMF1cdGJ5dGVbMV1cdGJ5dGVbMl1cdGJ5dGVbM10gYnl0ZVs0XeS7pemZjVx0Ynl0ZVtuLTJdXHRieXRlW24tMV1cbiAgICAgICAgICogdWludDhfdDpsb2dfdHlwZVx0dWludDE2X3Q6aWRcdHVpbnQ4X3Q6cmVnaXN0ZXJcdHVpbnQ4X3Q6dmFsdWVcdHVpbnQxNl90OkNSQ1xuICAgICAgICAgKiAweDQwXHR1aW50MTZfdCAoMmJ5dGUpIDDvvZ42NTUzNVx044Os44K444K544K/44Kz44Oe44Oz44OJXHTjg6zjgrjjgrnjgr/jga7lgKTvvIjjgrPjg57jg7Pjg4njgavjgojjgaPjgablpInjgo/jgovvvIlcdHVpbnQxNl90ICgyYnl0ZSkgMO+9njY1NTM1XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vbkJsZU1vdG9yU2V0dGluZz0oZXZlKT0+e1xuICAgICAgICAgICAgaWYoIWV2ZXx8IWV2ZS50YXJnZXQpe3JldHVybjt9XG4gICAgICAgICAgICBsZXQgZHYgPSBldmUudGFyZ2V0LnZhbHVlOy8vNitu44OQ44Kk44OI44CA44OH44O844K/5LuV5qeY44CAaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMXV4SnU4NlhlOEtiSWx4dTVvUEZ2OUtRZHZIWTMzLU5JeTBjZFNnSW5vVWsvZWRpdCNnaWQ9MTAwMDQ4MjM4M1xuICAgICAgICAgICAgaWYoIShkdiBpbnN0YW5jZW9mIERhdGFWaWV3KSl7cmV0dXJuO30vL2luZm86OndlYiBibHVldG9vaOOBruOBvyBub2RlLmpz44GvaW5zdGFuY2VvZiBCdWZmZXJcblxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvL+ODh+ODvOOCv+OBrnBhcnNlXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGxldCBub3RpZnlCaW5MZW49ZHYuYnl0ZUxlbmd0aDtcbiAgICAgICAgICAgIGxldCBub3RpZnlDbWQ9ZHYuZ2V0VWludDgoMCk7Ly/jg6zjgrjjgrnjgr/mg4XloLHpgJrnn6XjgrPjg57jg7Pjg4lJRCAweDQw5Zu65a6aXG5cbiAgICAgICAgICAgIGlmKG5vdGlmeUNtZCE9MHg0MHx8bm90aWZ5QmluTGVuPD02KXtyZXR1cm47fS8v44Os44K444K544K/5oOF5aCx44KS5ZCr44G+44Gq44GE44OH44O844K/44Gu56C05qOEXG5cbiAgICAgICAgICAgIGxldCBpZD1kdi5nZXRVaW50MTYoMSxmYWxzZSk7Ly/pgIHkv6FJRFxuICAgICAgICAgICAgbGV0IHJlZ2lzdGVyQ21kPWR2LmdldFVpbnQ4KDMpOy8v44Os44K444K544K/44Kz44Oe44Oz44OJXG4gICAgICAgICAgICBsZXQgY3JjPWR2LmdldFVpbnQxNihub3RpZnlCaW5MZW4tMixmYWxzZSk7Ly9DUkPjga7lgKQg5pyA5b6M44GL44KJMmR5dGVcblxuICAgICAgICAgICAgbGV0IHJlcz17fTtcbiAgICAgICAgICAgIC8v44Kz44Oe44Oz44OJ5Yil44Gr44KI44KL44Os44K444K544K/44Gu5YCk44Gu5Y+W5b6XWzQtbiBieXRlXVxuICAgICAgICAgICAgc3dpdGNoKHJlZ2lzdGVyQ21kKXtcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQubWF4U3BlZWQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tYXhTcGVlZD1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQubWluU3BlZWQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5taW5TcGVlZD1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQuY3VydmVUeXBlOlxuICAgICAgICAgICAgICAgICAgICByZXMuY3VydmVUeXBlPWR2LmdldFVpbnQ4KDQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQuYWNjOlxuICAgICAgICAgICAgICAgICAgICByZXMuYWNjPWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORC5kZWM6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5kZWM9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELm1heFRvcnF1ZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1heFRvcnF1ZT1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQucUN1cnJlbnRQOlxuICAgICAgICAgICAgICAgICAgICByZXMucUN1cnJlbnRQPWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORC5xQ3VycmVudEk6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5xQ3VycmVudEk9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELnFDdXJyZW50RDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnFDdXJyZW50RD1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQuc3BlZWRQOlxuICAgICAgICAgICAgICAgICAgICByZXMuc3BlZWRQPWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORC5zcGVlZEk6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zcGVlZEk9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELnNwZWVkRDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNwZWVkRD1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQucG9zaXRpb25QOlxuICAgICAgICAgICAgICAgICAgICByZXMucG9zaXRpb25QPWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORC5vd25Db2xvcjpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm93bkNvbG9yPSgnIzAwMDAwMCcgK051bWJlcihkdi5nZXRVaW50OCg0KTw8MTZ8ZHYuZ2V0VWludDgoNSk8PDh8ZHYuZ2V0VWludDgoNikpLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC02KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlcyk7XG5cbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JTZXR0aW5nQ0IocmVnaXN0ZXJDbWQscmVzKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBzZWN0aW9uOjrlhazplovjg6Hjgr3jg4Pjg4lcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICogQkxF44Gn44Gu5o6l57aaXG4gICAgICovXG4gICAgY29ubmVjdCgpe1xuICAgICAgICBpZiAodGhpcy5fcGVyaXBoZXJhbCYmIHRoaXMuX3BlcmlwaGVyYWwuZ2F0dCYmdGhpcy5fcGVyaXBoZXJhbC5nYXR0LmNvbm5lY3RlZCApIHtyZXR1cm59XG4gICAgICAgIGxldCBnYXQ9ICh0aGlzLl9wZXJpcGhlcmFsJiYgdGhpcy5fcGVyaXBoZXJhbC5nYXR0ICk/dGhpcy5fcGVyaXBoZXJhbC5nYXR0IDp1bmRlZmluZWQ7Ly/lho3mjqXntprnlKhcbiAgICAgICAgdGhpcy5fYmxlQ29ubmVjdChnYXQpLnRoZW4ob2JqPT57Ly9pbmZvOjogcmVzb2x2ZSh7ZGV2aWNlSUQsZGV2aWNlTmFtZSxibGVEZXZpY2UsY2hhcmFjdGVyaXN0aWNzfSk7XG4gICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW9iai5ibGVEZXZpY2U7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmlkPXRoaXMuX3BlcmlwaGVyYWwuaWQ7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLm5hbWU9dGhpcy5fcGVyaXBoZXJhbC5uYW1lO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q9dGhpcy5fcGVyaXBoZXJhbC5nYXR0LmNvbm5lY3RlZDtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8ubWFudWZhY3R1cmVyTmFtZT1vYmouaW5mb21hdGlvbi5tYW51ZmFjdHVyZXJOYW1lO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5oYXJkd2FyZVJldmlzaW9uPW9iai5pbmZvbWF0aW9uLmhhcmR3YXJlUmV2aXNpb247XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmZpcm13YXJlUmV2aXNpb249b2JqLmluZm9tYXRpb24uZmlybXdhcmVSZXZpc2lvbjtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3M9b2JqLmNoYXJhY3RlcmlzdGljcztcblxuICAgICAgICAgICAgaWYoIWdhdCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdnYXR0c2VydmVyZGlzY29ubmVjdGVkJyx0aGlzLl9vbkJsZUNvbm5lY3Rpb25Mb3N0KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2dhdHRzZXJ2ZXJkaXNjb25uZWN0ZWQnLCB0aGlzLl9vbkJsZUNvbm5lY3Rpb25Mb3N0KTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfTUVBU1VSRU1FTlQnXSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfTUVBU1VSRU1FTlQnXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3Rvck1lYXN1cmVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9NRUFTVVJFTUVOVCddLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yTWVhc3VyZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX01FQVNVUkVNRU5UJ10uc3RhcnROb3RpZmljYXRpb25zKCkudGhlbihvYmo9PntcbiAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9JTVVfTUVBU1VSRU1FTlQnXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCddLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZUltdU1lYXN1cmVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfSU1VX01FQVNVUkVNRU5UJ10uYWRkRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlSW11TWVhc3VyZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfSU1VX01FQVNVUkVNRU5UJ10uc3RhcnROb3RpZmljYXRpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICB9KS50aGVuKG9iaj0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9TRVRUSU5HJ10pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfU0VUVElORyddLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yU2V0dGluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9TRVRUSU5HJ10uYWRkRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JTZXR0aW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9TRVRUSU5HJ10uc3RhcnROb3RpZmljYXRpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgfSkudGhlbihvYmo9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZV9pbml0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzQ2hhbmdlX2lzQ29ubmVjdCh0cnVlKTsvL+WIneWbnuOBruOBvyhjb21w5Lul5YmN44Gv55m654Gr44GX44Gq44GE54K6KVxuICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZV9pc0Nvbm5lY3QodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGVycj0+e1xuICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbD1udWxsO1xuICAgICAgICAgICAgdGhpcy5fb25Db25uZWN0RmFpbHVyZUhhbmRsZXIodGhpcyxlcnIpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJMReOBp+OBruWIh+aWrVxuICAgICAqL1xuICAgIGRpc0Nvbm5lY3QoKXtcbiAgICAgICBpZiAoIXRoaXMuX3BlcmlwaGVyYWwgfHwgIXRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5jb25uZWN0ZWQpe3JldHVybjt9XG4gICAgICAgIHRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5kaXNjb25uZWN0KCk7XG4gICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9bnVsbDtcblxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWGhemDqFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIEJMReaOpee2mlxuICAgICAqIEBwYXJhbSBnYXR0X29iaiDjg5rjgqLjg6rjg7PjgrDmuIjjgb/jga5HQVRU44Gu44OH44OQ44Kk44K544Gr5YaN5o6l57aa55SoKOODmuOCouODquODs+OCsOODouODvOODgOODq+OBr+WHuuOBquOBhClcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9ibGVDb25uZWN0KGdhdHRfb2JqKSB7XG4gICAgICAvL2xldCBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAvLyBsZXQgYmxlRGV2aWNlO1xuICAgICAgICAgIC8vIGxldCBkZXZpY2VOYW1lO1xuICAgICAgICAgIC8vIGxldCBkZXZpY2VJRDtcbiAgICAgICAgICBpZighZ2F0dF9vYmope1xuICAgICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgIGZpbHRlcnM6IFt7c2VydmljZXM6IFt0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEXX1dLFxuICAgICAgICAgICAgICAgICAgb3B0aW9uYWxTZXJ2aWNlczpbdGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuU2VydmljZV1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgbmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAudGhlbihkZXZpY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JsZUdhdGNvbm5lY3QoZGV2aWNlLmdhdHQpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGVEZXZpY2U6IGRldmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZUlEOiBkZXZpY2UuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VOYW1lOiBkZXZpY2UubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljczpyZXMuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvbjpyZXMuaW5mb21hdGlvblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICB0aGlzLl9ibGVHYXRjb25uZWN0KGdhdHRfb2JqKVxuICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9ibGVHYXRjb25uZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VJRDogZ2F0dF9vYmouZGV2aWNlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VOYW1lOiBnYXR0X29iai5kZXZpY2UubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmxlRGV2aWNlOiBnYXR0X29iai5kZXZpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljczpyZXMuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uOnJlcy5pbmZvbWF0aW9uXG5cbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9HQVRU5o6l57aa55SoXG4gICAgX2JsZUdhdGNvbm5lY3QoZ2F0dF9vYmope1xuICAgICAgICAgICAgbGV0IGNoYXJhY3RlcmlzdGljcyA9IHt9O1xuICAgICAgICAgICAgbGV0IGluZm9tYXRpb249e307XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGdyZXNvbHZlLCBncmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICBnYXR0X29iai5jb25uZWN0KCkudGhlbihzZXJ2ZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlcyh0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHBycyA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEKS50aGVuKHNlcnZpY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjcnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9NT1RPUl9CTEVfQ1JTKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuX01PVE9SX0JMRV9DUlNba2V5XSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjaGFyYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljc1trZXldID0gY2hhcmE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoY3JzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy9ibGVfZmlybXdhcmVfcmV2aXNpb27jga7jgrXjg7zjg5Pjgrnlj5blvpdcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5TZXJ2aWNlKS50aGVuKChzZXJ2aWNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGlmcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLk1hbnVmYWN0dXJlck5hbWVTdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjaGFyYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoYXJhLnJlYWRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbih2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvblsnbWFudWZhY3R1cmVyTmFtZSddID0gS01VdGwuVXRmOEFycmF5VG9TdHIobmV3IFVpbnQ4QXJyYXkodmFsLmJ1ZmZlcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWZzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuRmlybXdhcmVSZXZpc2lvblN0cmluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNoYXJhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hhcmEucmVhZFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uWydmaXJtd2FyZVJldmlzaW9uJ10gPSBLTVV0bC5VdGY4QXJyYXlUb1N0cihuZXcgVWludDhBcnJheSh2YWwuYnVmZmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5IYXJkd2FyZVJldmlzaW9uU3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGFyYS5yZWFkVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb25bJ2hhcmR3YXJlUmV2aXNpb24nXSA9IEtNVXRsLlV0ZjhBcnJheVRvU3RyKG5ldyBVaW50OEFycmF5KHZhbC5idWZmZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChpZnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgXTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHBycyk7XG4gICAgICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGdyZXNvbHZlKHtjaGFyYWN0ZXJpc3RpY3M6IGNoYXJhY3RlcmlzdGljcywgaW5mb21hdGlvbjogaW5mb21hdGlvbn0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG5cblxuICAgIC8qKlxuICAgICAqIEJMReOCs+ODnuODs+ODieOBrumAgeS/oVxuICAgICAqIEBwYXJhbSBjb21tYW5kVHlwZVN0ciAgJ01PVE9SX0NPTlRST0wnLCdNT1RPUl9NRUFTVVJFTUVOVCcsJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCcsJ01PVE9SX1NFVFRJTkcnXG4gICAgICog44Kz44Oe44Oz44OJ56iu5Yil44GuU3RyaW5nIOS4u+OBq0JMReOBruOCreODo+ODqeOCr+OCv+ODquOCueODhuOCo+OCr+OCueOBp+S9v+eUqOOBmeOCi1xuICAgICAqIEBwYXJhbSBjb21tYW5kTnVtXG4gICAgICogQHBhcmFtIGFycmF5YnVmZmVyXG4gICAgICogQHBhcmFtIG5vdGlmeVByb21pcyBjbWRSZWFkUmVnaXN0ZXLnrYnjga5CTEXlkbzjgbPlh7rjgZflvozjgatub3RpZnnjgaflj5blvpfjgZnjgovlgKTjgpJQcm9taXPjgafluLDjgZnlv4XopoHjga7jgYLjgovjgrPjg57jg7Pjg4nnlKhcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqL1xuICAgIF9zZW5kTW90b3JDb21tYW5kKGNvbW1hbmRDYXRlZ29yeSwgY29tbWFuZE51bSwgYXJyYXlidWZmZXI9bmV3IEFycmF5QnVmZmVyKDApLCBub3RpZnlQcm9taXM9bnVsbCl7XG4gICAgICAgIGxldCBjaGFyYWN0ZXJpc3RpY3M9dGhpcy5fY2hhcmFjdGVyaXN0aWNzW2NvbW1hbmRDYXRlZ29yeV07XG4gICAgICAgIGxldCBhYj1uZXcgRGF0YVZpZXcoYXJyYXlidWZmZXIpO1xuICAgICAgICAvL+OCs+ODnuODs+ODieODu0lE44O7Q1JD44Gu5LuY5YqgXG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoYXJyYXlidWZmZXIuYnl0ZUxlbmd0aCs1KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxjb21tYW5kTnVtKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDEsdGhpcy5jcmVhdGVDb21tYW5kSUQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoYXJyYXlidWZmZXIuYnl0ZUxlbmd0aCszLDApO1xuICAgICAgICAvL+ODh+ODvOOCv+OBruabuOOBjei+vOOBv1xuICAgICAgICBmb3IobGV0IGk9MDtpPGFycmF5YnVmZmVyLmJ5dGVMZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDMraSxhYi5nZXRVaW50OChpKSk7XG4gICAgICAgIH1cbiAgICAgICAgLy9xdWXjgavov73liqBcbiAgICAgICAvLyArK3RoaXMuX3F1ZUNvdW50O1xuICAgICAgICB0aGlzLl9ibGVTZW5kaW5nUXVlPSB0aGlzLl9ibGVTZW5kaW5nUXVlLnRoZW4oKHJlcyk9PntcbiAgICAgICAgICAvLyAgY29uc29sZS5sb2coXCJfc2VuZE1vdG9yQ29tbWFuZCBxdWVDb3VudDpcIisoLS10aGlzLl9xdWVDb3VudCkpO1xuICAgICAgICAgICAgaWYobm90aWZ5UHJvbWlzKXtcbiAgICAgICAgICAgICAgICBub3RpZnlQcm9taXMuc3RhcnRSZWplY3RUaW1lT3V0Q291bnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjaGFyYWN0ZXJpc3RpY3Mud3JpdGVWYWx1ZShidWZmZXIpO1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgLy/lpLHmlZfmmYLjgIAvL2luZm86OuW+jOe2muOBruOCs+ODnuODs+ODieOBr+W8leOBjee2muOBjeWun+ihjOOBleOCjOOCi1xuICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhcIkVSUiBfc2VuZE1vdG9yQ29tbWFuZDpcIityZXMrXCIgcXVlQ291bnQ6XCIrKC0tdGhpcy5fcXVlQ291bnQpKTtcbiAgICAgICAgICAgIGlmKG5vdGlmeVByb21pcyl7XG4gICAgICAgICAgICAgICAgbm90aWZ5UHJvbWlzLmNhbGxSZWplY3QocmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbi8vLy8vL2NsYXNzLy9cbn1cblxubW9kdWxlLmV4cG9ydHMgPUtNQ29tV2ViQkxFO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL0tNQ29tV2ViQkxFLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIid1c2Ugc3RyaWN0Jztcbi8qKipcbiAqS01Db25uZWN0b3JCcm93c2VyLmpzXG4gKiB2ZXJzaW9uIDAuMS4wIGFscGhhXG4gKiBDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG5nbG9iYWwuS01VdGw9cmVxdWlyZSgnLi9LTVV0bC5qcycpO1xuZ2xvYmFsLktNVmVjdG9yMj1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNVmVjdG9yMjtcbmdsb2JhbC5LTVZlY3RvcjM9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTVZlY3RvcjM7XG5nbG9iYWwuS01JbXVTdGF0ZT1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNSW11U3RhdGU7XG5nbG9iYWwuS01MZWRTdGF0ZT1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNTGVkU3RhdGU7XG5nbG9iYWwuS01Sb3RTdGF0ZT1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNUm90U3RhdGU7XG5nbG9iYWwuS01EZXZpY2VJbmZvPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01EZXZpY2VJbmZvO1xuZ2xvYmFsLktNTW90b3JPbmVXZWJCTEU9cmVxdWlyZSgnLi9LTU1vdG9yT25lV2ViQkxFLmpzJyk7XG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvS01Db25uZWN0b3JCcm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKioqXG4gKktNTW90b3JPbmVXZWJCTEUuanNcbiAqIHZhciAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5sZXQgS01Db21XZWJCTEUgPSByZXF1aXJlKCcuL0tNQ29tV2ViQkxFJyk7XG5sZXQgS01Nb3RvckNvbW1hbmRLTU9uZT1yZXF1aXJlKCcuL0tNTW90b3JDb21tYW5kS01PbmUuanMnKTtcblxuY2xhc3MgS01Nb3Rvck9uZVdlYkJMRSBleHRlbmRzIEtNTW90b3JDb21tYW5kS01PbmV7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0gYXJnXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoS01Nb3RvckNvbW1hbmRLTU9uZS5LTV9DT05ORUNUX1RZUEUuV0VCQkxFLG5ldyBLTUNvbVdlYkJMRSgpKTtcbiAgICB9XG5cbiAgICBjb25uZWN0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLmNvbm5lY3QoKTtcbiAgICB9XG4gICAgZGlzQ29ubmVjdCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5kaXNDb25uZWN0KCk7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9S01Nb3Rvck9uZVdlYkJMRTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9LTU1vdG9yT25lV2ViQkxFLmpzXG4vLyBtb2R1bGUgaWQgPSA1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKipcbiAqIEtNQ29tQmFzZS5qc1xuICogdmVyc2lvbiAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xubGV0IEtNVXRsID0gcmVxdWlyZSgnLi9LTVV0bCcpO1xubGV0IEtNU3RydWN0dXJlcz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcycpO1xuXG5jbGFzcyBLTUNvbUJhc2V7XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlrprmlbBcbiAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9y44CAXG4gICAgICogQHBhcmFtIGFyZ1xuICAgICAqXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoYXJnKXtcbiAgICAgICAgdGhpcy5fcGVyaXBoZXJhbD1udWxsO1xuICAgICAgICB0aGlzLl9jb21tYW5kQ291bnQ9NjU1MzA7XG4gICAgICAgIHRoaXMuX2RldmljZUluZm89bmV3IEtNU3RydWN0dXJlcy5LTURldmljZUluZm8oKTtcblxuICAgICAgICB0aGlzLl9tb3Rvck1lYXN1cmVtZW50PW5ldyBLTVN0cnVjdHVyZXMuS01Sb3RTdGF0ZSgpO1xuICAgICAgICB0aGlzLl9tb3RvckxlZD1uZXcgS01TdHJ1Y3R1cmVzLktNTGVkU3RhdGUoKTtcbiAgICAgICAgdGhpcy5fbW90b3JJbXVNZWFzdXJlbWVudD1uZXcgS01TdHJ1Y3R1cmVzLktNSW11U3RhdGUoKTtcbiAgICAgICAgLy9cbiAgICAgICAgdGhpcy5fb25Jbml0SGFuZGxlcj1mdW5jdGlvbihjb25uZWN0b3Ipe307XG4gICAgICAgIHRoaXMuX29uQ29ubmVjdEhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yKXt9O1xuICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyPWZ1bmN0aW9uKGNvbm5lY3Rvcil7fTtcbiAgICAgICAgdGhpcy5fb25Db25uZWN0RmFpbHVyZUhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yLCBtc2cpe307XG5cbiAgICAgICAgdGhpcy5fb25Nb3Rvck1lYXN1cmVtZW50Q0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9vbkltdU1lYXN1cmVtZW50Q0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9vbk1vdG9yU2V0dGluZ0NCPWZ1bmN0aW9uKCl7fTtcblxuICAgICAgICB0aGlzLl9pc0luaXQ9ZmFsc2U7XG4gICAgICAgIFxuICAgICAgICAvL19vbkJsZU1vdG9yU2V0dGluZ+OBruOCs+ODnuODs+ODieOAgOODouODvOOCv+ODvOioreWumuaDheWgseOBrumAmuefpeWPl+S/oeaZguOBq+ODkeODvOOCueOBmeOCi+eUqFxuICAgICAgICB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5EPXtcbiAgICAgICAgICAgICAgICBcIm1heFNwZWVkXCI6MHgwMixcbiAgICAgICAgICAgICAgICBcIm1pblNwZWVkXCI6MHgwMyxcbiAgICAgICAgICAgICAgICBcImN1cnZlVHlwZVwiOjB4MDUsXG4gICAgICAgICAgICAgICAgXCJhY2NcIjoweDA3LFxuICAgICAgICAgICAgICAgIFwiZGVjXCI6MHgwOCxcbiAgICAgICAgICAgICAgICBcIm1heFRvcnF1ZVwiOjB4MEUsXG4gICAgICAgICAgICAgICAgXCJxQ3VycmVudFBcIjoweDE4LFxuICAgICAgICAgICAgICAgIFwicUN1cnJlbnRJXCI6MHgxOSxcbiAgICAgICAgICAgICAgICBcInFDdXJyZW50RFwiOjB4MUEsXG4gICAgICAgICAgICAgICAgXCJzcGVlZFBcIjoweDFCLFxuICAgICAgICAgICAgICAgIFwic3BlZWRJXCI6MHgxQyxcbiAgICAgICAgICAgICAgICBcInNwZWVkRFwiOjB4MUQsXG4gICAgICAgICAgICAgICAgXCJwb3NpdGlvblBcIjoweDFFLFxuICAgICAgICAgICAgICAgIFwib3duQ29sb3JcIjoweDNBXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOODl+ODreODkeODhuOCo1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIOODh+ODkOOCpOOCueaDheWgsVxuICAgICAqIEByZXR1cm5zIHt7bmFtZTogc3RyaW5nLCBpZDogc3RyaW5nLCBpbmZvOiBudWxsfX1cbiAgICAgKlxuICAgICAqL1xuICAgIGdldCBkZXZpY2VJbmZvKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZXZpY2VJbmZvLkNsb25lKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pyJ5Yq554Sh5Yq5XG4gICAgICogQHJldHVybnMgeyp8Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBnZXQgaXNDb25uZWN0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZXZpY2VJbmZvLmlzQ29ubmVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgrPjg57jg7Pjg4npoIbnm6PoppbnlKjpgKPnlarjga7nmbrooYxcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBjcmVhdGVDb21tYW5kSUQoKXtcbiAgICAgICAgdGhpcy5fY29tbWFuZENvdW50PSgrK3RoaXMuX2NvbW1hbmRDb3VudCkmMGIxMTExMTExMTExMTExMTExOy8vNjU1MzXjgafjg6vjg7zjg5dcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpc0Nvbm5lY3Tjga7oqK3lrprlpInmm7Qo5a2Q44Kv44Op44K544GL44KJ5L2/55SoKVxuICAgICAqIEBwYXJhbSBib29sXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc3RhdHVzQ2hhbmdlX2lzQ29ubmVjdChib29sKXtcbiAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q9Ym9vbDtcbiAgICAgICAgaWYodGhpcy5faXNJbml0KXtcbiAgICAgICAgICAgIGlmKGJvb2wpe1xuICAgICAgICAgICAgICAgIHRoaXMuX29uQ29ubmVjdEhhbmRsZXIodGhpcyk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yid5pyf5YyW54q25oWL44Gu6Kit5a6aKOWtkOOCr+ODqeOCueOBi+OCieS9v+eUqClcbiAgICAgKiBAcGFyYW0gYm9vbFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3N0YXR1c0NoYW5nZV9pbml0KGJvb2wpe1xuICAgICAgICB0aGlzLl9pc0luaXQ9Ym9vbDtcbiAgICAgICAgaWYodGhpcy5faXNJbml0KXtcbiAgICAgICAgICAgIHRoaXMuX29uSW5pdEhhbmRsZXIodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBjYWxsYmFja1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIOWIneacn+WMluWujOS6huOBl+OBpuWIqeeUqOOBp+OBjeOCi+OCiOOBhuOBq+OBquOBo+OBn1xuICAgICAqIEBwYXJhbSBoYW5kbGVyRnVuY3Rpb25cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBzZXQgb25Jbml0KGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uSW5pdEhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOW/nOetlOODu+WGjeaOpee2muOBq+aIkOWKn+OBl+OBn1xuICAgICAqIEBwYXJhbSBoYW5kbGVyRnVuY3Rpb25cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBzZXQgb25Db25uZWN0KGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uQ29ubmVjdEhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOW/nOetlOOBjOeEoeOBj+OBquOBo+OBn+ODu+WIh+aWreOBleOCjOOBn1xuICAgICAqIEBwYXJhbSBoYW5kbGVyRnVuY3Rpb25cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBzZXQgb25EaXNjb25uZWN0KGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uRGlzY29ubmVjdEhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOaOpee2muOBq+WkseaVl1xuICAgICAqIEBwYXJhbSBoYW5kbGVyRnVuY3Rpb25cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBzZXQgb25Db25uZWN0RmFpbHVyZShoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RGYWlsdXJlSGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga7lm57ou6Lmg4XloLFjYWxsYmFja1xuICAgICAqIEBwYXJhbSBmdW5jICh7cG9zaXRpb24sdmVsb2NpdHksdG9ycXVlfSlcbiAgICAgKi9cbiAgICBzZXQgb25Nb3Rvck1lYXN1cmVtZW50KGZ1bmMpe1xuICAgICAgICBpZih0eXBlb2YgZnVuYz09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yTWVhc3VyZW1lbnRDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBruOCuOODo+OCpOODreaDheWgsWNhbGxiYWNrXG4gICAgICogQHBhcmFtIGZ1bmMgKHthY2NlbFgsYWNjZWxZLGFjY2VsWix0ZW1wLGd5cm9YLGd5cm9ZLGd5cm9afSlcbiAgICAgKi9cbiAgICBzZXQgb25JbXVNZWFzdXJlbWVudChmdW5jKXtcbiAgICAgICAgaWYodHlwZW9mIGZ1bmM9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25JbXVNZWFzdXJlbWVudENCPWZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHlj5blvpdjYWxsYmFja1xuICAgICAqIEBwYXJhbSBmdW5jIChyZWdpc3RlckNtZCxyZXMpXG4gICAgICovXG4gICAgc2V0IG9uTW90b3JTZXR0aW5nKGZ1bmMpe1xuICAgICAgICBpZih0eXBlb2YgZnVuYz09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yU2V0dGluZ0NCPWZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXG5cbi8vLy8vL2NsYXNzLy9cbn1cblxubW9kdWxlLmV4cG9ydHMgPUtNQ29tQmFzZTtcblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9LTUNvbUJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqKlxuICogS01Nb3RvckNvbW1hbmRLTU9uZS5qc1xuICogdmVyc2lvbiAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xubGV0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoXCJldmVudHNcIikuRXZlbnRFbWl0dGVyO1xubGV0IEtNVXRsID0gcmVxdWlyZSgnLi9LTVV0bCcpO1xubGV0IEtNQ29tV2ViQkxFID0gcmVxdWlyZSgnLi9LTUNvbVdlYkJMRScpO1xubGV0IEtNU3RydWN0dXJlcz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcycpO1xuXG5jbGFzcyBLTU1vdG9yQ29tbWFuZEtNT25lIGV4dGVuZHMgRXZlbnRFbWl0dGVye1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWumuaVsFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDmjqXntprmlrnlvI9cbiAgICAgKiBAcmV0dXJucyB7e1wiVU5TRVRUTEVEXCI6MCxcIkJMRVwiOjEsXCJTRVJJQUxcIjoyfX1cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IEtNX0NPTk5FQ1RfVFlQRSgpe1xuICAgICAgICByZXR1cm4ge1wiV0VCQkxFXCI6MSxcIkJMRVwiOjIsXCJTRVJJQUxcIjozfTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZ2V0IGNtZFByZXBhcmVQbGF5YmFja01vdGlvbl9TVEFSVF9QT1NJVElPTigpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnU1RBUlRfUE9TSVRJT05fQUJTJzowLC8v6KiY5oa244GV44KM44Gf6ZaL5aeL5L2N572u77yI57W25a++5bqn5qiZ77yJ44GL44KJ44K544K/44O844OIXG4gICAgICAgICAgICAnU1RBUlRfUE9TSVRJT05fQ1VSUkVOVCc6MS8v54++5Zyo44Gu5L2N572u44KS6ZaL5aeL5L2N572u44Go44GX44Gm44K544K/44O844OIXG4gICAgICAgIH07XG4gICAgfVxuICAgIHN0YXRpYyBnZXQgY21kTGVkX0xFRF9TVEFURSgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnTEVEX1NUQVRFX09GRic6MCxcdC8vIExFROa2iOeBr1xuICAgICAgICAgICAgJ0xFRF9TVEFURV9PTl9TT0xJRCc6MSxcdC8vIExFROeCueeBr++8iOeCueeBr+OBl+OBo+OBseOBquOBl++8iVxuICAgICAgICAgICAgJ0xFRF9TVEFURV9PTl9GTEFTSCc6MixcdC8vIExFROeCuea7he+8iOS4gOWumumWk+malOOBp+eCuea7he+8iVxuICAgICAgICAgICAgJ0xFRF9TVEFURV9PTl9ESU0nOjNcdC8vIExFROOBjOOChuOBo+OBj+OCiuaYjua7heOBmeOCi1xuICAgICAgICB9O1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0IGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdDVVJWRV9UWVBFX05PTkUnOiAwLFx0Ly8g44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9GRlxuICAgICAgICAgICAgJ0NVUlZFX1RZUEVfVFJBUEVaT0lEJzoxXHQvLyDjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT04g77yI5Y+w5b2i5Yqg5rib6YCf77yJXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qXG4gICAgKiBSZWFkUmVnaXN0ZXLjgaflj5blvpfjgZnjgovmmYLnlKjjga7jgrPjg57jg7Pjg4nlvJXmlbBcbiAgICAqICovXG4gICAgc3RhdGljIGdldCBjbWRSZWFkUmVnaXN0ZXJfQ09NTUFORCgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICBcIm1heFNwZWVkXCI6MHgwMixcbiAgICAgICAgICAgIFwibWluU3BlZWRcIjoweDAzLFxuICAgICAgICAgICAgXCJjdXJ2ZVR5cGVcIjoweDA1LFxuICAgICAgICAgICAgXCJhY2NcIjoweDA3LFxuICAgICAgICAgICAgXCJkZWNcIjoweDA4LFxuICAgICAgICAgICAgXCJtYXhUb3JxdWVcIjoweDBFLFxuICAgICAgICAgICAgXCJxQ3VycmVudFBcIjoweDE4LFxuICAgICAgICAgICAgXCJxQ3VycmVudElcIjoweDE5LFxuICAgICAgICAgICAgXCJxQ3VycmVudERcIjoweDFBLFxuICAgICAgICAgICAgXCJzcGVlZFBcIjoweDFCLFxuICAgICAgICAgICAgXCJzcGVlZElcIjoweDFDLFxuICAgICAgICAgICAgXCJzcGVlZERcIjoweDFELFxuICAgICAgICAgICAgXCJwb3NpdGlvblBcIjoweDFFLFxuICAgICAgICAgICAgXCJvd25Db2xvclwiOjB4M0FcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvcuOAgFxuICAgICAqICBAcGFyYW0gY29ubmVjdF90eXBlIOaOpee2muaWueW8jyBLTU1vdG9yQ29tbWFuZEtNT25lLktNX0NPTk5FQ1RfVFlQRVxuICAgICAqIEBwYXJhbSBrbWNvbVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbm5lY3RfdHlwZSxrbWNvbSl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIC8v44Kk44OZ44Oz44OI44OP44Oz44OJ44Op44K/44Kk44OXXG4gICAgICAgIHRoaXMuRVZFTlRfVFlQRT17XCJpbml0XCI6XCJpbml0XCIsXCJjb25uZWN0XCI6XCJjb25uZWN0XCIsXCJkaXNjb25uZWN0XCI6XCJkaXNjb25uZWN0XCIsXCJjb25uZWN0RmFpbHVyZVwiOlwiY29ubmVjdEZhaWx1cmVcIixcIm1vdG9yTWVhc3VyZW1lbnRcIjpcIm1vdG9yTWVhc3VyZW1lbnRcIixcImltdU1lYXN1cmVtZW50XCI6XCJpbXVNZWFzdXJlbWVudFwifTtcbiAgICAgICAgLy/jg6Ljg7zjgr/jg7zjga7lhajjgrPjg57jg7Pjg4lcbiAgICAgICAgdGhpcy5fTU9UT1JfQ09NTUFORD17XG4gICAgICAgICAgICBcIm1heFNwZWVkXCI6MHgwMiwvL+acgOWkp+mAn+OBleOCkuioreWumuOBmeOCi1xuICAgICAgICAgICAgXCJtaW5TcGVlZFwiOjB4MDMsLy/mnIDlsI/pgJ/jgZXjgpLoqK3lrprjgZnjgotcbiAgICAgICAgICAgIFwiY3VydmVUeXBlXCI6MHgwNSwvL+WKoOa4m+mAn+absue3muOCkuioreWumuOBmeOCi1xuICAgICAgICAgICAgXCJhY2NcIjoweDA3LC8v5Yqg6YCf5bqm44KS6Kit5a6a44GZ44KLXG4gICAgICAgICAgICBcImRlY1wiOjB4MDgsLy/muJvpgJ/luqbjgpLoqK3lrprjgZnjgotcbiAgICAgICAgICAgIFwibWF4VG9ycXVlXCI6MHgwRSwvL+acgOWkp+ODiOODq+OCr+OCkuioreWumuOBmeOCi1xuICAgICAgICAgICAgXCJxQ3VycmVudFBcIjoweDE4LC8vcei7uOmbu+a1gVBJROOCsuOCpOODsyhQKeOCkuioreWumuOBmeOCi1xuICAgICAgICAgICAgXCJxQ3VycmVudElcIjoweDE5LC8vcei7uOmbu+a1gVBJROOCsuOCpOODsyhJKeOCkuioreWumuOBmeOCi1xuICAgICAgICAgICAgXCJxQ3VycmVudERcIjoweDFBLC8vcei7uOmbu+a1gVBJROOCsuOCpOODsyhEKeOCkuioreWumuOBmeOCi1xuICAgICAgICAgICAgXCJzcGVlZFBcIjoweDFCLC8v6YCf5bqmUElE44Ky44Kk44OzKFAp44KS6Kit5a6a44GZ44KLXG4gICAgICAgICAgICBcInNwZWVkSVwiOjB4MUMsLy/pgJ/luqZQSUTjgrLjgqTjg7MoSSnjgpLoqK3lrprjgZnjgotcbiAgICAgICAgICAgIFwic3BlZWREXCI6MHgxRCwvL+mAn+W6plBJROOCsuOCpOODsyhEKeOCkuioreWumuOBmeOCi1xuICAgICAgICAgICAgXCJwb3NpdGlvblBcIjoweDFFLC8v5L2N572uUElE44Ky44Kk44OzKFAp44KS6Kit5a6a44GZ44KLXG4gICAgICAgICAgICBcInJlc2V0UElEXCI6MHgyMiwvL1BJROOCsuOCpOODs+OCkuODquOCu+ODg+ODiOOBmeOCi1xuICAgICAgICAgICAgXCJvd25Db2xvclwiOjB4M0EsLy/jg4fjg5DjgqTjgrlMRUTjga7lm7rmnInoibLjgpLoqK3lrprjgZnjgotcbiAgICAgICAgICAgIFwicmVhZFJlZ2lzdGVyXCI6MHg0MCwvL+aMh+WumuOBruioreWumuWApOOCkuWPluW+l+OBmeOCi1xuICAgICAgICAgICAgXCJzYXZlQWxsUmVnaXN0ZXJzXCI6MHg0MSwvL+WFqOOBpuOBruioreWumuWApOOCkuODleODqeODg+OCt+ODpeOBq+S/neWtmOOBmeOCi1xuICAgICAgICAgICAgXCJyZXNldFJlZ2lzdGVyXCI6MHg0RSwvL+aMh+WumuOBruioreWumuWApOOCkuODquOCu+ODg+ODiOOBmeOCi1xuICAgICAgICAgICAgXCJyZXNldEFsbFJlZ2lzdGVyc1wiOjB4NEYsLy/lhajoqK3lrprlgKTjgpLjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICAgICAgICAgIFwiZGlzYWJsZVwiOjB4NTAsLy/jg6Ljg7zjgr/jg7zjga7li5XkvZzjgpLkuI3oqLHlj6/jgajjgZnjgotcbiAgICAgICAgICAgIFwiZW5hYmxlXCI6MHg1MSwvL+ODouODvOOCv+ODvOWLleS9nOOCkuioseWPr+OBmeOCi1xuICAgICAgICAgICAgXCJzcGVlZFwiOjB4NTgsLy/pgJ/luqbjga7lpKfjgY3jgZXjgpLoqK3lrprjgZnjgotcbiAgICAgICAgICAgIFwicHJlc2V0UG9zaXRpb25cIjoweDVBLC8v5L2N572u44Gu44OX44Oq44K744OD44OI44KS6KGM44GG77yI5Y6f54K56Kit5a6a77yJXG4gICAgICAgICAgICBcInJ1bkZvcndhcmRcIjoweDYwLC8v5q2j5Zue6Lui44GZ44KL77yI5Y+N5pmC6KiI5Zue44KK77yJXG4gICAgICAgICAgICBcInJ1blJldmVyc2VcIjoweDYxLC8v6YCG5Zue6Lui44GZ44KL77yI5pmC6KiI5Zue44KK77yJXG4gICAgICAgICAgICBcIm1vdmVUb1Bvc2l0aW9uXCI6MHg2NiwvL+e1tuWvvuS9jee9ruOBq+enu+WLleOBmeOCi1xuICAgICAgICAgICAgXCJtb3ZlQnlEaXN0YW5jZVwiOjB4NjgsLy/nm7jlr77kvY3nva7jgavnp7vli5XjgZnjgotcbiAgICAgICAgICAgIFwiZnJlZVwiOjB4NkMsLy/jg6Ljg7zjgr/jg7zjga7lirHno4HjgpLlgZzmraLjgZnjgotcbiAgICAgICAgICAgIFwic3RvcFwiOjB4NkQsLy/pgJ/luqbjgrzjg63jgb7jgafmuJvpgJ/jgZflgZzmraLjgZnjgotcbiAgICAgICAgICAgIFwiaG9sZFRvcnF1ZVwiOjB4NzIsLy/jg4jjg6vjgq/liLblvqHjgpLooYzjgYZcbiAgICAgICAgICAgIFwiZG9UYXNrc2V0XCI6MHg4MSwvL+OCv+OCueOCr+OCu+ODg+ODiOOCkuWun+ihjOOBmeOCi1xuICAgICAgICAgICAgXCJwcmVwYXJlUGxheWJhY2tNb3Rpb25cIjoweDg2LC8v44Oi44O844K344On44Oz5YaN55Sf44Gu6ZaL5aeL5Zyw54K544Gr56e75YuV44GZ44KLXG4gICAgICAgICAgICBcInN0YXJ0UGxheWJhY2tcIjoweDg3LC8v44Oi44O844K344On44Oz44KS5YaN55Sf44GZ44KLXG4gICAgICAgICAgICBcInN0b3BQbGF5YmFja1wiOjB4ODgsLy/jg6Ljg7zjgrfjg6fjg7Plho3nlJ/jgpLlgZzmraLjgZnjgotcbiAgICAgICAgICAgIFwicGF1c2VcIjoweDkwLC8v44Kt44Ol44O844KS5YGc5q2i44GZ44KLXG4gICAgICAgICAgICBcInJlc3VtZVwiOjB4OTEsLy/jgq3jg6Xjg7zjgpLlho3plovjgZnjgotcbiAgICAgICAgICAgIFwid2FpdFwiOjB4OTIsLy/jgq3jg6Xjg7zjgpLmjIflrprmmYLplpPlgZzmraLjgZflho3plovjgZnjgotcbiAgICAgICAgICAgIFwicmVzZXRcIjoweDk1LC8v44Kt44Ol44O844KS44Oq44K744OD44OI44GZ44KLXG4gICAgICAgICAgICBcInN0YXJ0UmVjb3JkaW5nVGFza3NldFwiOjB4QTAsLy/jgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLjgpLplovlp4vjgZnjgotcbiAgICAgICAgICAgIFwic3RvcFJlY29yZGluZ1Rhc2tzZXRcIjoweEEyLC8v44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44KS5YGc5q2i44GZ44KLXG4gICAgICAgICAgICBcImVyYXNlVGFza3NldFwiOjB4QTMsLy/mjIflrprjga7jgr/jgrnjgq/jgrvjg4Pjg4jjgpLliYrpmaTjgZnjgotcbiAgICAgICAgICAgIFwiZXJhc2VBbGxUYXNrc2V0c1wiOjB4QTQsLy/jgr/jgrnjgq/jgrvjg4Pjg4jjgpLlhajliYrpmaTjgZnjgotcbiAgICAgICAgICAgIFwicHJlcGFyZVRlYWNoaW5nTW90aW9uXCI6MHhBQSwvL+ODhuOCo+ODvOODgeODs+OCsOOBrumWi+Wni+a6luWCmeOCkuihjOOBhlxuICAgICAgICAgICAgXCJzdGFydFRlYWNoaW5nTW90aW9uXCI6MHhBQiwvL+ODhuOCo+ODvOODgeODs+OCsOOCkumWi+Wni+OBmeOCi1xuICAgICAgICAgICAgXCJzdG9wVGVhY2hpbmdNb3Rpb25cIjoweEFDLC8v44OG44Kj44O844OB44Oz44Kw44KS5YGc5q2i44GZ44KLXG4gICAgICAgICAgICBcImVyYXNlTW90aW9uXCI6MHhBRCwvL+ODhuOCo+ODvOODgeODs+OCsOOBp+immuOBiOOBn+WLleS9nOOCkuWJiumZpOOBmeOCi1xuICAgICAgICAgICAgXCJlcmFzZUFsbE1vdGlvblwiOjB4QUUsLy/jg4bjgqPjg7zjg4Hjg7PjgrDjgafopprjgYjjgZ/lhajli5XkvZzjgpLliYrpmaTjgZnjgotcbiAgICAgICAgICAgIFwibGVkXCI6MHhFMCwvL0xFROOBrueCueeBr+eKtuaFi+OCkuOCu+ODg+ODiOOBmeOCi1xuICAgICAgICAgICAgXCJlbmFibGVJTVVcIjoweEVBLC8vSU1V44Gu5YCk5Y+W5b6XKOmAmuefpSnjgpLplovlp4vjgZnjgotcbiAgICAgICAgICAgIFwiZGlzYWJsZUlNVVwiOjB4RUIsLy9JTVXjga7lgKTlj5blvpco6YCa55+lKeOCkuWBnOatouOBmeOCi1xuICAgICAgICAgICAgXCJyZWJvb3RcIjoweEYwLC8v44K344K544OG44Og44KS5YaN6LW35YuV44GZ44KLXG4gICAgICAgICAgICBcImVudGVyRGV2aWNlRmlybXdhcmVVcGRhdGVcIjoweEZELy/jg5XjgqHjg7zjg6DjgqbjgqfjgqLjgqLjg4Pjg5fjg4fjg7zjg4jjg6Ljg7zjg4njgavlhaXjgotcbiAgICAgICAgfTtcbiAgICAgICAgLy/jg6Ljg7zjgr/jg7zjga7lhajjgrPjg57jg7Pjg4nvvIjpgIblvJXnlKjvvIlcbiAgICAgICAgdGhpcy5fUkVWX01PVE9SX0NPTU1BTkQ9e307XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX01PVE9SX0NPTU1BTkQpLmZvckVhY2goKGspPT57dGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbdGhpcy5fTU9UT1JfQ09NTUFORFtrXV09azt9KTtcbiAgICAgICAgLy9TZW5kTm90aWZ5UHJvbWlz44Gu44Oq44K544OIXG4gICAgICAgIHRoaXMuX25vdGlmeVByb21pc0xpc3Q9W107XG5cbiAgICAgICAgdGhpcy5LTV9DT05ORUNUX1RZUEU9dGhpcy5jb25zdHJ1Y3Rvci5LTV9DT05ORUNUX1RZUEU7XG4gICAgICAgIHRoaXMuY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OPXRoaXMuY29uc3RydWN0b3IuY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OO1xuICAgICAgICB0aGlzLmNtZExlZF9MRURfU1RBVEU9dGhpcy5jb25zdHJ1Y3Rvci5jbWRMZWRfTEVEX1NUQVRFO1xuICAgICAgICB0aGlzLmNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFPXRoaXMuY29uc3RydWN0b3IuY21kQ3VydmVUeXBlX0NVUlZFX1RZUEU7XG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gc2VjdGlvbjo6ZW50cnkgcG9pbnRcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICB0aGlzLl9jb25uZWN0VHlwZT1jb25uZWN0X3R5cGU7XG4gICAgICAgIHRoaXMuX0tNQ29tPWttY29tO1xuXG4gICAgICAgIC8v5YaF6YOo44Kk44OZ44Oz44OI44OQ44Kk44Oz44OJXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uSW5pdD0oY29ubmVjdG9yKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5pbml0LGNvbm5lY3Rvci5kZXZpY2VJbmZvKTsvL+ODh+ODkOOCpOOCueaDheWgseOCkui/lOOBmVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9LTUNvbS5vbkNvbm5lY3Q9KGNvbm5lY3Rvcik9PntcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUuY29ubmVjdCxjb25uZWN0b3IuZGV2aWNlSW5mbyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX0tNQ29tLm9uRGlzY29ubmVjdD0oY29ubmVjdG9yKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5kaXNjb25uZWN0LGNvbm5lY3Rvci5kZXZpY2VJbmZvKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fS01Db20ub25Db25uZWN0RmFpbHVyZT0oY29ubmVjdG9yLCBlcnIpPT57XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLmNvbm5lY3RGYWlsdXJlLGNvbm5lY3Rvci5kZXZpY2VJbmZvKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvOWbnui7ouaDheWgseWPl+S/oVxuICAgICAgICAgKiBAcGFyYW0gcmVzIHtwb3NpdGlvbjpkdi5nZXRGbG9hdDMyKDAsZmFsc2UpLHZlbG9jaXR5OmR2LmdldEZsb2F0MzIoNCxmYWxzZSksdG9ycXVlOmR2LmdldEZsb2F0MzIoOCxmYWxzZSl9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9LTUNvbS5vbk1vdG9yTWVhc3VyZW1lbnQ9KHJlcyk9PntcbiAgICAgICAgICAgIGxldCByb3RTdGF0ZT1uZXcgS01TdHJ1Y3R1cmVzLktNUm90U3RhdGUocmVzLnBvc2l0aW9uLHJlcy52ZWxvY2l0eSxyZXMudG9ycXVlKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUubW90b3JNZWFzdXJlbWVudCxyb3RTdGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7xJTVXmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIHJlcyB7YWNjZWxYLGFjY2VsWSxhY2NlbFosdGVtcCxneXJvWCxneXJvWSxneXJvWn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uSW11TWVhc3VyZW1lbnQ9KHJlcyk9PntcbiAgICAgICAgICAgIGxldCBpbXVTdGF0ZT1uZXcgS01TdHJ1Y3R1cmVzLktNSW11U3RhdGUocmVzLmFjY2VsWCxyZXMuYWNjZWxZLHJlcy5hY2NlbFoscmVzLnRlbXAscmVzLmd5cm9YLHJlcy5neXJvWSxyZXMuZ3lyb1opO1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5pbXVNZWFzdXJlbWVudCxpbXVTdGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIHJlZ2lzdGVyQ21kXG4gICAgICAgICAqIEBwYXJhbSByZXMge21heFNwZWVkLG1pblNwZWVk44O744O744O7b3duQ29sb3J9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9LTUNvbS5fb25Nb3RvclNldHRpbmdDQj0ocmVnaXN0ZXJDbWQsIHJlcyk9PntcbiAgICAgICAgICAgIF9LTU5vdGlmeVByb21pcy5zZW5kR3JvdXBOb3RpZnlSZXNvbHZlKHRoaXMuX25vdGlmeVByb21pc0xpc3QscmVnaXN0ZXJDbWQscmVzKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog44OX44Ot44OR44OG44KjXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBrkJMReaOpee2muOBjOacieWKueOBi1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGdldCBpc0Nvbm5lY3QoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0tNQ29tLmRldmljZUluZm8uaXNDb25uZWN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDmjqXntprmlrnlvI9cbiAgICAgKiBAcmV0dXJucyB7S01Nb3RvckNvbW1hbmRLTU9uZS5LTV9DT05ORUNUX1RZUEV9XG4gICAgICovXG4gICAgZ2V0IGNvbm5lY3RUeXBlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb25uZWN0VHlwZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg4fjg5DjgqTjgrnmg4XloLFcbiAgICAgKiBAcmV0dXJucyB7e25hbWU6IHN0cmluZywgaWQ6IHN0cmluZywgaW5mbzogbnVsbH19XG4gICAgICpcbiAgICAgKiBpbmZvOjrjg6Hjg7zjgqvjg7zjgrXjg7zjg5Pjgrnjg4fjg7zjgr8oaW5mbynjga93ZWJCbHVldG9vaOOBp+OBr+Wun+ijheOBjOeEoeOBhOeCuuOAgeODleOCoeODvOODoHZlcnNpb27jga/lj5blvpflh7rmnaXjgarjgYQgMjAxNy8xMi8x5pmC54K5XG4gICAgICovXG4gICAgZ2V0IGRldmljZUluZm8oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0tNQ29tLmRldmljZUluZm87XG4gICAgfVxuICAgIGdldCBjb25uZWN0b3IoKXtcbiAgICAgICAgcmV0dXJuICB0aGlzLl9LTUNvbTtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBjYWxsYmFja1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDliJ3mnJ/ljJblrozkuobjgZfjgabliKnnlKjjgafjgY3jgovjgojjgYbjgavjgarjgaPjgZ9cbiAgICAgKiBAcGFyYW0gaGFuZGxlckZ1bmN0aW9uKEtNRGV2aWNlSW5mbylcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBzZXQgb25Jbml0KGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uSW5pdEhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOW/nOetlOODu+WGjeaOpee2muOBq+aIkOWKn+OBl+OBn1xuICAgICAqIEBwYXJhbSBoYW5kbGVyRnVuY3Rpb24oS01EZXZpY2VJbmZvKVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHNldCBvbkNvbm5lY3QoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Db25uZWN0SGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog5b+c562U44GM54Sh44GP44Gq44Gj44Gf44O75YiH5pat44GV44KM44GfXG4gICAgICogQHBhcmFtIGhhbmRsZXJGdW5jdGlvbihLTURldmljZUluZm8pXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgc2V0IG9uRGlzY29ubmVjdChoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDmjqXntprjgavlpLHmlZdcbiAgICAgKiBAcGFyYW0gaGFuZGxlckZ1bmN0aW9uKEtNRGV2aWNlSW5mbyxlcnIpXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgc2V0IG9uQ29ubmVjdEZhaWx1cmUoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Db25uZWN0RmFpbHVyZUhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Gu5Zue6Lui5oOF5aCxY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0gZnVuYyAoe3Bvc2l0aW9uLHZlbG9jaXR5LHRvcnF1ZX0pXG4gICAgICovXG4gICAgc2V0IG9uTW90b3JNZWFzdXJlbWVudChmdW5jKXtcbiAgICAgICAgaWYodHlwZW9mIGZ1bmM9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Nb3Rvck1lYXN1cmVtZW50Q0I9ZnVuYztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga7jgrjjg6PjgqTjg63mg4XloLFjYWxsYmFja1xuICAgICAqIEBwYXJhbSBmdW5jICh7YWNjZWxYLGFjY2VsWSxhY2NlbFosdGVtcCxneXJvWCxneXJvWSxneXJvWn0pXG4gICAgICovXG4gICAgc2V0IG9uSW11TWVhc3VyZW1lbnQoZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uSW11TWVhc3VyZW1lbnRDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWGhemDqOODpuODvOODhuOCo+ODquODhuOCo1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIHNlY3Rpb246OuODouODvOOCv+ODvOOCs+ODnuODs+ODiSBodHRwczovL2RvY3VtZW50LmtlaWdhbi1tb3Rvci5jb20vbW90b3ItY29udHJvbC1jb21tYW5kL21vdG9yX2FjdGlvbi5odG1sXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgXG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zli5XkvZzjgpLkuI3oqLHlj6/jgajjgZnjgovvvIjkuIrkvY3lkb3ku6TvvIlcbiAgICAgKiDlronlhajnlKjvvJrjgZPjga7lkb3ku6TjgpLlhaXjgozjgovjgajjg6Ljg7zjgr/jg7zjga/li5XkvZzjgZfjgarjgYRcbiAgICAgKiDjgrPjg57jg7Pjg4njga/jgr/jgrnjgq/jgrvjg4Pjg4jjgavoqJjpjLLjgZnjgovjgZPjgajjga/kuI3lj69cbiAgICAgKi9cbiAgICBjbWREaXNhYmxlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmRpc2FibGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOWLleS9nOOCkuioseWPr+OBmeOCi++8iOS4iuS9jeWRveS7pO+8iVxuICAgICAqIOWuieWFqOeUqO+8muOBk+OBruWRveS7pOOCkuWFpeOCjOOCi+OBqOODouODvOOCv+ODvOOBr+WLleS9nOWPr+iDveOBqOOBquOCi1xuICAgICAqIOODouODvOOCv+ODvOi1t+WLleaZguOBryBkaXNhYmxlIOeKtuaFi+OBruOBn+OCgeOAgeacrOOCs+ODnuODs+ODieOBp+WLleS9nOOCkuioseWPr+OBmeOCi+W/heimgeOBjOOBguOCilxuICAgICAqIOOCs+ODnuODs+ODieOBr+OCv+OCueOCr+OCu+ODg+ODiOOBq+iomOmMsuOBmeOCi+OBk+OBqOOBr+S4jeWPr1xuICAgICAqL1xuICAgIGNtZEVuYWJsZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lbmFibGUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDpgJ/luqbjga7lpKfjgY3jgZXjgpLjgrvjg4Pjg4jjgZnjgovvvIjljZjkvY3ns7vvvJpSUE3vvIlcbiAgICAgKiBAcGFyYW0gc3BlZWQ6RmxvYXQgIFswLVggcnBtXeOAgCjmraPjga7mlbApXG4gICAgICovXG4gICAgY21kU3BlZWRfcnBtKHNwZWVkX3JwbSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkX3JwbSowLjEwNDcxOTc1NTExOTY1OTc3LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZCxidWZmZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDpgJ/luqbjga7lpKfjgY3jgZXjgpLjgrvjg4Pjg4jjgZnjgovvvIjljZjkvY3ns7vvvJrjg6njgrjjgqLjg7PvvIlcbiAgICAgKiBAcGFyYW0gc3BlZWQ6RmxvYXQg6YCf5bqm44Gu5aSn44GN44GVIOWNmOS9je+8muinkuW6pu+8iOODqeOCuOOCouODs++8iS/np5IgWzAtWCBycHNd44CAKOato+OBruaVsClcbiAgICAgKi9cbiAgICBjbWRTcGVlZChzcGVlZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS9jee9ruOBruODl+ODquOCu+ODg+ODiOOCkuihjOOBhu+8iOWOn+eCueioreWumu+8ie+8iOWNmOS9jeezu++8muODqeOCuOOCouODs++8iVxuICAgICAqIEBwYXJhbSBwb3NpdGlvbjpGbG9hdCDntbblr77op5LluqbvvJpyYWRpYW5zXG4gICAgICovXG4gICAgY21kUHJlc2V0UG9zaXRpb24ocG9zaXRpb24pe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChLTVV0bC50b051bWJlcihwb3NpdGlvbiksMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQucHJlc2V0UG9zaXRpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKuato+Wbnui7ouOBmeOCi++8iOWPjeaZguioiOWbnuOCiu+8iVxuICAgICAqIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBp+OAgeato+Wbnui7olxuICAgICAqL1xuICAgIGNtZFJ1bkZvcndhcmQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQucnVuRm9yd2FyZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6YCG5Zue6Lui44GZ44KL77yI5pmC6KiI5Zue44KK77yJXG4gICAgICogY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44Gn44CB6YCG5Zue6LuiXG4gICAgICovXG4gICAgY21kUnVuUmV2ZXJzZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ydW5SZXZlcnNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDntbblr77kvY3nva7jgavnp7vli5XjgZnjgotcbiAgICAgKiDpgJ/jgZXjga8gY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44GM5o6h55So44GV44KM44KLXG4gICAgICogQHBhcmFtIHBvc2l0aW9uOkZsb2F0IOinkuW6pu+8mnJhZGlhbnNcbiAgICAgKi9cbiAgICBjbWRNb3ZlVG9Qb3NpdGlvbihwb3NpdGlvbil7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KHBvc2l0aW9uLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVUb1Bvc2l0aW9uLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog55u45a++5L2N572u44Gr56e75YuV44GZ44KLXG4gICAgICog6YCf44GV44GvIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBjOaOoeeUqOOBleOCjOOCi1xuICAgICAqIEBwYXJhbSBkaXN0YW5jZTpGbG9hdCDop5LluqbvvJpyYWRpYW5zW+W3pjorcmFkaWFucyDlj7M6LXJhZGlhbnNdXG4gICAgICovXG4gICAgY21kTW92ZUJ5RGlzdGFuY2UoZGlzdGFuY2Upe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChkaXN0YW5jZSwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlQnlEaXN0YW5jZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBruWKseejgeOCkuWBnOatouOBmeOCi++8iOaEn+inpuOBr+aui+OCiuOBvuOBme+8iVxuICAgICAqIOWujOWFqOODleODquODvOeKtuaFi+OCkuWGjeePvuOBmeOCi+WgtOWQiOOBr+OAgSBibGVGcmVlKCkuY21kRGlzYWJsZSgpIOOBqOOBl+OBpuS4i+OBleOBhOOAglxuICAgICAqL1xuICAgIGNtZEZyZWUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuZnJlZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844KS6YCf5bqm44K844Ot44G+44Gn5rib6YCf44GX5YGc5q2i44GZ44KLXG4gICAgICogcnBtID0gMCDjgajjgarjgovjgILigLvlrp/os6ogYmxlUnVuQXQoMCnjgajlkIzjgZhcbiAgICAgKi9cbiAgICBjbWRTdG9wKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3ApO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICog44OI44Or44Kv5Yi25b6h44KS6KGM44GGXG4gICAgICogQHBhcmFtIHRvcnF1ZTpGbG9hdCDjg4jjg6vjgq8g5Y2Y5L2N77yaTuODu20gWy1YIH4gKyBYIE5tXSDmjqjlpajlgKQgMC4zLTAuMDVcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBpbmZvOjrpgJ/luqbjgoTkvY3nva7jgpLlkIzmmYLjgavliLblvqHjgZnjgovloLTlkIjjga/jgIHjg6Ljg7zjgr/jg7zoqK3lrprjga4gMHgwRTogbWF4VG9ycXVlIOOBqCAweDYwOiBydW5Gb3J3YXJkIOetieOCkuS9teeUqOOBl+OBpuS4i+OBleOBhOOAglxuICAgICAqXG4gICAgICovXG4gICAgY21kSG9sZFRvcnF1ZSh0b3JxdWUpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdCh0b3JxdWUsMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuaG9sZFRvcnF1ZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIDB4ODEg6KiY5oa244GX44Gf44K/44K544Kv77yI5ZG95Luk77yJ44Gu44K744OD44OI44KS5a6f6KGM44GZ44KLXG4gICAgICogQHBhcmFtIGluZGV4OmludCDjgr/jgrnjgq/jgrvjg4Pjg4jnlarlj7fvvIgw772eNjU1MzXvvIlcbiAgICAgKiBAcGFyYW0gcmVwZWF0aW5nOmludCDnubDjgorov5TjgZflm57mlbAgMOOBr+eEoeWItumZkCB0b2RvOjrmnKrlrp/oo4VcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBpbmZvOjogS00tMSDjga8gaW5kZXg6IDB+NDkg44G+44Gn44CC77yINTDlgIvjga7jg6Hjg6Ljg6rjg5Djg7Pjgq8g5ZCEODEyOCBCeXRlIOOBvuOBp+WItumZkOOBguOCiu+8iVxuICAgICAqIOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuOBr+OAgeOCs+ODnuODs+ODie+8iOOCv+OCueOCr+OCu+ODg+ODiO+8ieOCkuWPgueFp+S4i+OBleOBhOOAgiBodHRwczovL2RvY3VtZW50LmtlaWdhbi1tb3Rvci5jb20vbW90b3ItY29udHJvbC1jb21tYW5kL3Rhc2tzZXQuaHRtbFxuICAgICAqL1xuICAgIGNtZERvVGFza3NldChpbmRleCxyZXBlYXRpbmcpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDYpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDIsTWF0aC5hYnMocGFyc2VJbnQocmVwZWF0aW5nLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5kb1Rhc2tzZXQsYnVmZmVyKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogMHg4NiDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/jga7plovlp4vlnLDngrnjgavnp7vli5XjgZnjgotcbiAgICAgKiBAcGFyYW0gaW5kZXg6aW50IOODouODvOOCt+ODp+ODs+eVquWPt++8iDDvvZ42NTUzNe+8iVxuICAgICAqIEBwYXJhbSByZXBlYXRpbmc6aW50IOe5sOOCiui/lOOBl+WbnuaVsCAw44Gv54Sh5Yi26ZmQ44CAdG9kbzo65pyq5a6f6KOFXG4gICAgICogQHBhcmFtIGNtZFByZXBhcmVQbGF5YmFja01vdGlvbl9TVEFSVF9QT1NJVElPTjppbnQg44K544K/44O844OI5L2N572u44Gu6Kit5a6a44CAdG9kbzo65pyq5a6f6KOFXG4gICAgICogICAgICAgICAgU1RBUlRfUE9TSVRJT05fQUJTID0gMDsgLy8g6KiY5oa244GV44KM44Gf6ZaL5aeL5L2N572u77yI57W25a++5bqn5qiZ77yJ44GL44KJ44K544K/44O844OIXG4gICAgICogICAgICAgICAgU1RBUlRfUE9TSVRJT05fQ1VSUkVOVCA9IDE7IC8vIOePvuWcqOOBruS9jee9ruOCkumWi+Wni+S9jee9ruOBqOOBl+OBpuOCueOCv+ODvOODiFxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqIGluZm86OuKAuyBLTS0xIOOBryBpbmRleDogMH45IOOBvuOBp+OAgu+8iDEw5YCL44Gu44Oh44Oi44Oq44OQ44Oz44Kv44CC77yJ44Gd44KM44Ge44KMIOe0hDLliIboqJjpjLLlj6/og73jgIJcbiAgICAgKiDjg4bjgqPjg7zjg4Hjg7PjgrDvvIjli5XkvZzjga7oqJjpjLLvvInjga/jgIHjgrPjg57jg7Pjg4nvvIjjg4bjgqPjg7zjg4Hjg7PjgrDvvInjgpLlj4LnhafkuIvjgZXjgYTjgIJodHRwczovL2RvY3VtZW50LmtlaWdhbi1tb3Rvci5jb20vbW90b3ItY29udHJvbC1jb21tYW5kL3RlYWNoaW5nLmh0bWxcbiAgICAgKiAgICAgICAgICByZXBlYXRpbmcsIG9wdGlvbiDjgavjgaTjgYTjgabjga/jg5XjgqHjg7zjg6DjgqbjgqfjgqLmnKrlrp/oo4VcbiAgICAgKiAgICAgICAgICDlho3nlJ/lm57mlbDjga/vvJHlm57lm7rlrprjgafjgYLjgorjgIHmnKzjgrPjg57jg7Pjg4njgpLlrp/ooYzjgZnjgovjgajjgIHoqJjpjLLjgZfjgZ/ntbblr77kvY3nva7jga7mnIDliJ3jga7jg53jgqTjg7Pjg4jjgavnp7vli5XjgZnjgotcbiAgICAgKlxuICAgICAqL1xuICAgIGNtZFByZXBhcmVQbGF5YmFja01vdGlvbihpbmRleCxyZXBlYXRpbmcsY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig3KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQzMigyLE1hdGguYWJzKHBhcnNlSW50KHJlcGVhdGluZywxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoNixNYXRoLmFicyhwYXJzZUludChjbWRQcmVwYXJlUGxheWJhY2tNb3Rpb25fU1RBUlRfUE9TSVRJT04sMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnByZXBhcmVQbGF5YmFja01vdGlvbixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCt+ODp+ODs+OCkuWGjeeUn+OBmeOCi1xuICAgICAqL1xuICAgIGNtZFN0YXJ0UGxheWJhY2soKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnRQbGF5YmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K344On44Oz5YaN55Sf44KS5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kU3RvcFBsYXliYWNrKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3BQbGF5YmFjayk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIHNlY3Rpb246OuOCreODpeODvOaTjeS9nFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiDjgq3jg6Xjg7zjgpLkuIDmmYLlgZzmraLjgZnjgosgMHg5MFxuICAgICAqL1xuICAgIGNtZFBhdXNlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnBhdXNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKuOCreODpeODvOOCkuWGjemWi+OBmeOCi++8iOiThOepjeOBleOCjOOBn+OCv+OCueOCr+OCkuWGjemWi++8iVxuICAgICAqL1xuICAgIGNtZFJlc3VtZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZXN1bWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAq44Kt44Ol44O844KS5oyH5a6a5pmC6ZaT5YGc5q2i44GX5YaN6ZaL44GZ44KLXG4gICAgICogcGF1c2XvvIjjgq3jg6Xjg7zlgZzmraLvvInjgpLlrp/ooYzjgZfjgIHmjIflrprmmYLplpPvvIjjg5/jg6rnp5LvvInntYzpgY7lvozjgIHoh6rli5XnmoTjgasgcmVzdW1l77yI44Kt44Ol44O85YaN6ZaL77yJIOOCkuihjOOBhOOBvuOBmeOAglxuICAgICAqIEBwYXJhbSB0aW1lIOWBnOatouaZgumWk1ttc2VjXe+8iOODn+ODquenku+8iVxuICAgICAqL1xuICAgIGNtZFdhaXQodGltZSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQzMigwLE1hdGguYWJzKHBhcnNlSW50KHRpbWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELndhaXQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKuOCreODpeODvOOCkuODquOCu+ODg+ODiOOBmeOCi1xuICAgICAqL1xuICAgIGNtZFJlc2V0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo644K/44K544Kv44K744OD44OIXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXG4gICAgLyoqXG4gICAgICog44K/44K544Kv77yI5ZG95Luk77yJ44Gu44K744OD44OI44Gu6KiY6Yyy44KS6ZaL5aeL44GZ44KLIDB4QTBcbiAgICAgKiAg44O76KiY5oa244GZ44KL44Kk44Oz44OH44OD44Kv44K544Gu44Oh44Oi44Oq44Gv44Kz44Oe44Oz44OJ77yaZXJhc2VUYXNrc2V0IOOBq+OCiOOCiuS6iOOCgea2iOWOu+OBleOCjOOBpuOBhOOCi+W/heimgeOBjOOBguOCilxuICAgICAqIEBwYXJhbSBpbmRleDppbnQg44Kk44Oz44OH44OD44Kv44K5IEtNLTEg44Gu5aC05ZCI44CB44Kk44Oz44OH44OD44Kv44K544Gu5YCk44GvIDDvvZ40OSDvvIjoqIg1MOWAi+iomOmMsu+8iVxuICAgICAqL1xuICAgIGNtZFN0YXJ0UmVjb3JkaW5nVGFza1NldChpbmRleCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdGFydFJlY29yZGluZ1Rhc2tzZXQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLjgpLlgZzmraLjgZnjgosgMHhBMlxuICAgICAqIOODu3N0YXJ0UmVjb3JkaW5nVGFza3NldCDlrp/mlr3kuK3jga7jgb/mnInlirlcbiAgICAgKi9cbiAgICBjbWRTdG9wUmVjb3JkaW5nVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdG9wUmVjb3JkaW5nVGFza3NldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5oyH5a6a44Gu44Kk44Oz44OH44OD44Kv44K544Gu44K/44K544Kv44K744OD44OI44KS5raI5Y6744GZ44KLIDB4QTNcbiAgICAgKiBAcGFyYW0gaW5kZXg6aW50IOOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAqL1xuICAgIGNtZEVyYXNlVGFza3NldChpbmRleCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZVRhc2tzZXQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlhajjgabjga7jgr/jgrnjgq/jgrvjg4Pjg4jjgpLmtojljrvjgZnjgosgMHhBNFxuICAgICAqL1xuICAgIGNtZEVyYXNlQWxsVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZUFsbFRhc2tzZXRzKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo644OG44Kj44O844OB44Oz44KwXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIFxuICAgIC8qKlxuICAgICAqIDB4QUEg44Kk44Oz44OH44OD44Kv44K544Go6KiY6Yyy5pmC6ZaTW21zZWNd44KS5oyH5a6a44GX44CB44OG44Kj44O844OB44Oz44Kw44Gu6ZaL5aeL5rqW5YKZ44KS6KGM44GG44CCXG4gICAgICogQHBhcmFtIGluZGV4IOOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAqIEBwYXJhbSB0aW1lIOiomOmMsuaZgumWk++8iOODn+ODquenku+8iSBbbXNlYyAwLTY1NDA4XVxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqIGluZm86OktNLTEg44Gu5aC05ZCI44CB44Kk44Oz44OH44OD44Kv44K544Gu5YCk44GvIDDvvZ45IO+8iOioiDEw5YCL6KiY6Yyy77yJ44Go44Gq44KL44CC6KiY6Yyy5pmC6ZaT44GvIDY1NDA4IFttc2VjXSDjgpLotoXjgYjjgovjgZPjgajjga/jgafjgY3jgarjgYRcbiAgICAgKiAgICAgICAgICDoqJjmhrbjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjga7jg6Hjg6Ljg6rjga9ibGVFcmFzZU1vdGlvbiDjgavjgojjgorkuojjgoHmtojljrvjgZXjgozjgabjgYTjgovlv4XopoHjgYzjgYLjgotcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKi9cbiAgICBjbWRQcmVwYXJlVGVhY2hpbmdNb3Rpb24oaW5kZXgsbGVuZ3RoUmVjb3JkaW5nVGltZSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMixNYXRoLmFicyhwYXJzZUludChsZW5ndGhSZWNvcmRpbmdUaW1lLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wcmVwYXJlVGVhY2hpbmdNb3Rpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAweEFCIOebtOWJjeOBq+ihjOOBo+OBnyBwcmVwYXJlVGVhY2hpbmdNb3Rpb24g44Gu5p2h5Lu244Gn44OG44Kj44O844OB44Oz44Kw44KS6ZaL5aeL44GZ44KL44CCXG4gICAgICogYmxlUHJlcGFyZVRlYWNoaW5nTW90aW9uIOOCkuWun+ihjOOBl+OBn+ebtOW+jOOBruOBv+acieWKueOAglxuICAgICAqL1xuICAgIGNtZFN0YXJ0VGVhY2hpbmdNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnRUZWFjaGluZ01vdGlvbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHhBQyDlrp/ooYzkuK3jga7jg4bjgqPjg7zjg4Hjg7PjgrDjgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRTdG9wVGVhY2hpbmdNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcFRlYWNoaW5nTW90aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAweEFEIOaMh+WumuOBl+OBn+OCpOODs+ODh+ODg+OCr+OCueOBruODouODvOOCt+ODp+ODs+OCkua2iOWOu+OBmeOCi1xuICAgICAqIEBwYXJhbSBpbmRleDppbnQg44Kk44Oz44OH44OD44Kv44K5XG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICogaW5mbzo6IEtNLTEg44Gu5aC05ZCI44CB44Kk44Oz44OH44OD44Kv44K544Gu5YCk44GvIDDvvZ45IO+8iOioiDEw5YCL6KiY6Yyy77yJ44Go44Gq44KLXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICovXG4gICAgY21kRXJhc2VNb3Rpb24oaW5kZXgpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuZXJhc2VNb3Rpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAweEFFIOWFqOOBpuOBruODouODvOOCt+ODp+ODs+OCkua2iOWOu+OBmeOCi1xuICAgICAqL1xuICAgIGNtZEVyYXNlQWxsTW90aW9uKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlQWxsTW90aW9uKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo6TEVEXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIDB4RTAgTEVE44Gu54K554Gv54q25oWL44KS44K744OD44OI44GZ44KLXG4gICAgICog54K554Gv54q25oWL77yIT0ZGLCDngrnnga/vvJpTT0xJRCwg54K55ruF77yaRkxBU0gsIOOChuOBo+OBj+OCiuaYjua7he+8mkRJTe+8ieOBqOOAgVJHQuWQhOiJsuOBruW8t+W6puOCkuaMh+WumuOBl+OAgUxFROOBrueCueeBr+eKtuaFi+OCkuOCu+ODg+ODiOOBmeOCi+OAglxuICAgICAqIEBwYXJhbSBjbWRMZWRfTEVEX1NUQVRFOmludFxuICAgICAqICAgICAgICAgIExFRF9TVEFURV9PRkYgPSAwLFx0Ly8gTEVE5raI54GvXG4gICAgICogICAgICAgICAgTEVEX1NUQVRFX09OX1NPTElEID0gMSxcdC8vIExFROeCueeBr++8iOeCueeBr+OBl+OBo+OBseOBquOBl++8iVxuICAgICAqICAgICAgICAgIExFRF9TVEFURV9PTl9GTEFTSCA9IDIsXHQvLyBMRUTngrnmu4XvvIjkuIDlrprplpPpmpTjgafngrnmu4XvvIlcbiAgICAgKiAgICAgICAgICBMRURfU1RBVEVfT05fRElNID0gM1x0Ly8gTEVE44GM44KG44Gj44GP44KK5piO5ruF44GZ44KLXG4gICAgICogQHBhcmFtIHJlZDppbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0gZ3JlZW46aW50IDAtMjU1XG4gICAgICogQHBhcmFtIGJsdWU6aW50IDAtMjU1XG4gICAgICovXG4gICAgY21kTGVkKGNtZExlZF9MRURfU1RBVEUscmVkLGdyZWVuLGJsdWUpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLE1hdGguYWJzKHBhcnNlSW50KGNtZExlZF9MRURfU1RBVEUsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDEsTWF0aC5hYnMocGFyc2VJbnQocmVkLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgyLE1hdGguYWJzKHBhcnNlSW50KGdyZWVuLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgzLE1hdGguYWJzKHBhcnNlSW50KGJsdWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmxlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBJTVUg44K444Oj44Kk44OtXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIDB4RUHjgIBJTVXjga7lgKTlj5blvpco6YCa55+lKeOCkumWi+Wni+OBmeOCiyBpbmZvOjpCTEXlsILnlKjjgrPjg57jg7Pjg4lcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBpbmZvOjrmnKzjgrPjg57jg7Pjg4njgpLlrp/ooYzjgZnjgovjgajjgIFJTVXjga7jg4fjg7zjgr/jga9CTEXjga7jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrlNT1RPUl9JTVVfTUVBU1VSRU1FTlTjgavpgJrnn6XjgZXjgozjgotcbiAgICAgKiAgICAgICAgTU9UT1JfSU1VX01FQVNVUkVNRU5U44Gubm90aWZ544GvX29uQmxlSW11TWVhc3VyZW1lbnTjgaflj5blvpdcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKi9cbiAgICBjbWRFbmFibGVJTVUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW5hYmxlSU1VKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAweEVCIElNVeOBruWApOWPluW+lyjpgJrnn6Up44KS5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kRGlzYWJsZUlNVSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5kaXNhYmxlSU1VKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8g44K344K544OG44OgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIDB4RjAg44K344K544OG44Og44KS5YaN6LW35YuV44GZ44KLXG4gICAgICogaW5mbzo6QkxF44Gr5o6l57aa44GX44Gm44GE44Gf5aC05ZCI44CB5YiH5pat44GX44Gm44GL44KJ5YaN6LW35YuVXG4gICAgICovXG4gICAgY21kUmVib290KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlYm9vdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHhGRCDjg5XjgqHjg7zjg6DjgqbjgqfjgqLjgqLjg4Pjg5fjg4fjg7zjg4jjg6Ljg7zjg4njgavlhaXjgotcbiAgICAgKiBpbmZvOjrjg5XjgqHjg7zjg6DjgqbjgqfjgqLjgpLjgqLjg4Pjg5fjg4fjg7zjg4jjgZnjgovjgZ/jgoHjga7jg5bjg7zjg4jjg63jg7zjg4Djg7zjg6Ljg7zjg4njgavlhaXjgovjgILvvIjjgrfjgrnjg4bjg6Djga/lho3otbfli5XjgZXjgozjgovjgILvvIlcbiAgICAgKi9cbiAgICBjbWRFbnRlckRldmljZUZpcm13YXJlVXBkYXRlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVudGVyRGV2aWNlRmlybXdhcmVVcGRhdGUpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyDjg6Ljg7zjgr/jg7zoqK3lrprjgIBNT1RPUl9TRVRUSU5HXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIDB4MDIg44Oi44O844K/44O844Gu5pyA5aSn6YCf44GV44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIG1heFNwZWVkOmZsb2F0IOacgOWkp+mAn+OBlSBbcmFkaWFuIC8gc2Vjb25kXe+8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZE1heFNwZWVkKG1heFNwZWVkKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQobWF4U3BlZWQsMTApKSk7Ly90b2RvOjpOYU7jgYzov5Tjgovlj6/og73mgKcgcGFyc2VGbG9hdChcImFhYVwiLDEwKT09PU5hTlxuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5tYXhTcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIDB4MDMg44Oi44O844K/44O844Gu5pyA5bCP6YCf44GV44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIG1heFNwZWVkOmZsb2F0IOacgOWwj+mAn+OBlSBbcmFkaWFuIC8gc2Vjb25kXe+8iOato+OBruWApO+8iVxuICAgICAqIGluZm86Om1pblNwZWVkIOOBr+OAgWJsZVByZXBhcmVQbGF5YmFja01vdGlvbiDlrp/ooYzjga7pmpvjgIHplovlp4vlnLDngrnjgavnp7vli5XjgZnjgovpgJ/jgZXjgajjgZfjgabkvb/nlKjjgZXjgozjgovjgILpgJrluLjmmYLpgYvou6Ljgafjga/kvb/nlKjjgZXjgozjgarjgYTjgIJcbiAgICAgKi9cbiAgICBjbWRNaW5TcGVlZChtaW5TcGVlZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KG1pblNwZWVkLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5taW5TcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIDB4MDUg5Yqg5rib6YCf5puy57ea44KS5oyH5a6a44GZ44KL77yI44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844Or44Gu6Kit5a6a77yJXG4gICAgICogQHBhcmFtIGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFOmludFxuICAgICAqICAgICAgQ1VSVkVfVFlQRV9OT05FID0gMCxcdC8vIOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPRkZcbiAgICAgKiAgICAgIENVUlZFX1RZUEVfVFJBUEVaT0lEID0gMSxcdC8vIOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPTiDvvIjlj7DlvaLliqDmuJvpgJ/vvIlcbiAgICAgKi9cbiAgICBjbWRDdXJ2ZVR5cGUoY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLE1hdGguYWJzKHBhcnNlSW50KGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5jdXJ2ZVR5cGUsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAweDA3IOODouODvOOCv+ODvOOBruWKoOmAn+W6puOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSBhY2M6ZmxvYXQg5Yqg6YCf5bqmIDAtMjAwIFtyYWRpYW4gLyBzZWNvbmReMl3vvIjmraPjga7lgKTvvIlcbiAgICAgKiBpbmZvOjphY2Mg44Gv44CB44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9OIOOBruWgtOWQiOOAgeWKoOmAn+aZguOBq+S9v+eUqOOBleOCjOOBvuOBmeOAgu+8iOWKoOmAn+aZguOBruebtOe3muOBruWCvuOBje+8iVxuICAgICAqL1xuICAgIGNtZEFjYyhhY2Mpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChhY2MsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELmFjYyxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIDB4MDgg44Oi44O844K/44O844Gu5rib6YCf5bqm44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIGRlYzpmbG9hdCDmuJvpgJ/luqYgMC0yMDAgW3JhZGlhbiAvIHNlY29uZF4yXe+8iOato+OBruWApO+8iVxuICAgICAqIGluZm86OmRlYyDjga/jgIHjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT04g44Gu5aC05ZCI44CB5rib6YCf5pmC44Gr5L2/55So44GV44KM44G+44GZ44CC77yI5rib6YCf5pmC44Gu55u057ea44Gu5YK+44GN77yJXG4gICAgICovXG4gICAgY21kRGVjKGRlYyl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KGRlYywxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuZGVjLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHgwRSDjg6Ljg7zjgr/jg7zjga7mnIDlpKfjg4jjg6vjgq/vvIjntbblr77lgKTvvInjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0gbWF4VG9ycXVlOmZsb2F0IOacgOWkp+ODiOODq+OCryBbTiptXe+8iOato+OBruWApO+8iVxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqIGluZm86Om1heFRvcnF1ZSDjgpLoqK3lrprjgZnjgovjgZPjgajjgavjgojjgorjgIHjg4jjg6vjgq/jga7ntbblr77lgKTjgYwgbWF4VG9ycXVlIOOCkui2heOBiOOBquOBhOOCiOOBhuOBq+mBi+i7ouOBl+OBvuOBmeOAglxuICAgICAqIGluZm86OiBtYXhUb3JxdWUgPSAwLjEgW04qbV0g44Gu5b6M44GrIHJ1bkZvcndhcmQg77yI5q2j5Zue6Lui77yJ44KS6KGM44Gj44Gf5aC05ZCI44CBMC4xIE4qbSDjgpLotoXjgYjjgarjgYTjgojjgYbjgavjgZ3jga7pgJ/luqbjgpLjgarjgovjgaDjgZHntq3mjIHjgZnjgovjgIJcbiAgICAgKiBpbmZvOjog44Gf44Gg44GX44CB44OI44Or44Kv44Gu5pyA5aSn5YCk5Yi26ZmQ44Gr44KI44KK44CB44K344K544OG44Og44Gr44KI44Gj44Gm44Gv5Yi25b6h5oCn77yI5oyv5YuV77yJ44GM5oKq5YyW44GZ44KL5Y+v6IO95oCn44GM44GC44KL44CCXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRNYXhUb3JxdWUobWF4VG9ycXVlKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQobWF4VG9ycXVlLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5tYXhUb3JxdWUsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAweDE4IOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5Q77yI5q+U5L6L77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHFDdXJyZW50UDpmbG9hdCBx6Zu75rWBUOOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFFDdXJyZW50UChxQ3VycmVudFApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChxQ3VycmVudFAsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELnFDdXJyZW50UCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIDB4MTkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrlDvvIjmr5TkvovvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0gcUN1cnJlbnRJOmZsb2F0IHHpm7vmtYFJ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUUN1cnJlbnRJKHFDdXJyZW50SSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHFDdXJyZW50SSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucUN1cnJlbnRJLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHgxQSDjg6Ljg7zjgr/jg7zjga5x6Lu46Zu75rWBUElE44Kz44Oz44OI44Ot44O844Op44GuRO+8iOW+ruWIhu+8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSBxQ3VycmVudEQ6ZmxvYXQgcembu+a1gUTjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRRQ3VycmVudEQocUN1cnJlbnREKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQocUN1cnJlbnRELDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5xQ3VycmVudEQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAweDFCIOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5E77yI5b6u5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHNwZWVkUDpmbG9hdCDpgJ/luqZQ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kU3BlZWRQKHNwZWVkUCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkUCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWRQLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHgxQyDjg6Ljg7zjgr/jg7zjga7pgJ/luqZQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5J77yI56mN5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHNwZWVkSTpmbG9hdCDpgJ/luqZJ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kU3BlZWRJKHNwZWVkSSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkSSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWRJLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHgxRCDjg6Ljg7zjgr/jg7zjga7pgJ/luqZQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5E77yI5b6u5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHNwZWVkRDpmbG9hdCDpgJ/luqZE44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kU3BlZWREKHNwZWVkRCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkRCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWRELGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHgxRSDjg6Ljg7zjgr/jg7zjga7kvY3nva5QSUTjgrPjg7Pjg4jjg63jg7zjg6njga5Q77yI5q+U5L6L77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHBvc2l0aW9uUDpmbG9hdCDkvY3nva5Q44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUG9zaXRpb25QKHBvc2l0aW9uUCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHBvc2l0aW9uUCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucG9zaXRpb25QLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHgyMiDlhajjgabjga5QSUTjg5Hjg6njg6Hjg7zjgr/jgpLjg6rjgrvjg4Pjg4jjgZfjgabjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/oqK3lrprjgavmiLvjgZlcbiAgICAgKiBpbmZvOjpxQ3VycmVudFAsIHFDdXJyZW50SSwgIHFDdXJyZW50RCwgc3BlZWRQLCBzcGVlZEksIHNwZWVkRCwgcG9zaXRpb25QIOOCkuODquOCu+ODg+ODiOOBl+OBvuOBmVxuICAgICAqXG4gICAgICovXG4gICAgY21kUmVzZXRQSUQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzZXRQSUQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIDB4M0Eg44Oi44O844K/44O844Gu6LW35YuV5pmC5Zu65pyJTEVE44Kr44Op44O844KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHJlZDppbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0gZ3JlZW46aW50IDAtMjU1XG4gICAgICogQHBhcmFtIGJsdWU6aW50IDAtMjU1XG4gICAgICpcbiAgICAgKiBpbmZvOjpvd25Db2xvciDjga/jgqLjgqTjg4njg6vmmYLjga7lm7rmnIlMRUTjgqvjg6njg7zjgIJzYXZlQWxsU2V0dGluZ3PjgpLlrp/ooYzjgZfjgIHlho3otbfli5XlvozjgavliJ3jgoHjgablj43mmKDjgZXjgozjgovjgIJcbiAgICAgKiDjgZPjga7oqK3lrprlgKTjgpLlpInmm7TjgZfjgZ/loLTlkIjjgIFCTEXjga4gRGV2aWNlIE5hbWUg44Gu5LiLM+ahgeOBjOWkieabtOOBleOCjOOCi+OAglxuICAgICAqL1xuICAgIGNtZE93bkNvbG9yKHJlZCxncmVlbixibHVlKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigzKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxNYXRoLmFicyhwYXJzZUludChyZWQsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDEsTWF0aC5hYnMocGFyc2VJbnQoZ3JlZW4sMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDIsTWF0aC5hYnMocGFyc2VJbnQoYmx1ZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQub3duQ29sb3IsYnVmZmVyKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIDB4NDAg5oyH5a6a44GX44Gf6Kit5a6a5YCk44KS5Y+W5b6XIGluZm86OkJMReWwgueUqOOCs+ODnuODs+ODiSB0b2RvOjrliIbpm6LkvZzmpa1cbiAgICAgKiBAcGFyYW0gcmVnaXN0ZXJzOm1peCBpbnQgW10g5Y+W5b6X44GZ44KL44OX44Ot44OR44OG44Kj44Gu44Kz44Oe44Oz44OJKOODrOOCuOOCueOCv+eVquWPtynlgKRcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0g5Y+W5b6X44GX44Gf5YCkIHJlZ2lzdGVyc+OBjGludD3jg6zjgrjjgrnjgr/lgKTjga7jg5fjg6rjg5/jg4bjgqPjg5blgKTjgIJyZWdpc3RlcnPjgYxhcnJheT3jg6zjgrjjgrnjgr/lgKTjga7jgqrjg5bjgrjjgqfjgq/jg4jjgIJcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBpbmZvOjog5Y+W5b6X44GZ44KL5YCk44Gv44Kz44Oe44Oz44OJ5a6f6KGM5b6M44GrQkxF44Gu44Kt44Oj44Op44Kv44K/44Oq44K544OG44Kj44Kv44K5TU9UT1JfU0VUVElOR+OBq+mAmuefpeOBleOCjOOCi+OAglxuICAgICAqICAgICAgICAgIOOBneOCjOOCkuaLvuOBo+OBpnByb21pc2Xjgqrjg5bjgrjjgqfjgq/jg4jjga7jga5yZXNvbHZl44Gr6L+U44GX44Gm5Yem55CG44KS57mL44GQXG4gICAgICogICAgICAgICAgTU9UT1JfU0VUVElOR+OBrm5vdGlmeeOBr19vbkJsZU1vdG9yU2V0dGluZ+OBp+WPluW+l1xuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqL1xuICAgIGNtZFJlYWRSZWdpc3RlcihyZWdpc3RlcnMpe1xuICAgICAgICBpZihyZWdpc3RlcnMgaW5zdGFuY2VvZiBBcnJheSl7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGFsbHJlc29sdmUsIGFsbHJlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2VMaXN0PVtdO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8cmVnaXN0ZXJzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVnaXN0ZXI9cmVnaXN0ZXJzW2ldO1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlTGlzdC5wdXNoKCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjY3A9bmV3IF9LTU5vdGlmeVByb21pcyhyZWdpc3Rlcix0aGlzLl9SRVZfTU9UT1JfQ09NTUFORFtyZWdpc3Rlcl0sdGhpcy5fbm90aWZ5UHJvbWlzTGlzdCxyZXNvbHZlLHJlamVjdCwxMDAwKTsvL25vdGlmeee1jOeUseOBrnJlc3VsdOOCklByb21pc+OBqOe0kOS7mOOBkVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsIHBhcnNlSW50KHJlZ2lzdGVyLCAxMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZFJlZ2lzdGVyLCBidWZmZXIsY2NwKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlTGlzdCkudGhlbigocmVzYXIpPT57XG4gICAgICAgICAgICAgICAgICAgIGxldCB0PVt7fV0uY29uY2F0KHJlc2FyKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJ0b2JqPU9iamVjdC5hc3NpZ24uYXBwbHkobnVsbCx0KTtcbiAgICAgICAgICAgICAgICAgICAgYWxscmVzb2x2ZShydG9iaik7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKG1zZyk9PntcbiAgICAgICAgICAgICAgICAgICAgYWxscmVqZWN0KG1zZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGxhc3RyZXNvbHZlLCBsYXN0cmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVnaXN0ZXI9cmVnaXN0ZXJzO1xuICAgICAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2NwPW5ldyBfS01Ob3RpZnlQcm9taXMocmVnaXN0ZXIsdGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbcmVnaXN0ZXJdLHRoaXMuX25vdGlmeVByb21pc0xpc3QscmVzb2x2ZSxyZWplY3QsMTAwMCk7Ly9ub3RpZnnntYznlLHjga5yZXN1bHTjgpJQcm9taXPjgajntJDku5jjgZFcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCwgcGFyc2VJbnQocmVnaXN0ZXIsIDEwKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWRSZWdpc3RlciwgYnVmZmVyLGNjcCk7XG4gICAgICAgICAgICAgICAgfSkudGhlbigocmVzKT0+e1xuICAgICAgICAgICAgICAgICAgICBsYXN0cmVzb2x2ZShyZXNbT2JqZWN0LmtleXMocmVzKVswXV0pO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChtc2cpPT57XG4gICAgICAgICAgICAgICAgICAgIGxhc3RyZWplY3QobXNnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Gu5YWo44Gm44Gu44Os44K444K544K/5YCk44Gu5Y+W5b6XXG4gICAgICovXG4gICAgY21kUmVhZEFsbFJlZ2lzdGVyKCl7XG4gICAgICAgbGV0IGNtPSB0aGlzLmNvbnN0cnVjdG9yLmNtZFJlYWRSZWdpc3Rlcl9DT01NQU5EO1xuICAgICAgICBsZXQgYWxsY21kcz1bXTtcbiAgICAgICAgT2JqZWN0LmtleXMoY20pLmZvckVhY2goKGspPT57YWxsY21kcy5wdXNoKGNtW2tdKTt9KTtcblxuICAgICAgIHJldHVybiB0aGlzLmNtZFJlYWRSZWdpc3RlcihhbGxjbWRzKTtcbiAgICB9XG4gICAgLy8vLy8v5L+d5a2YXG4gICAgLyoqXG4gICAgICogMHg0MSDlhajjgabjga7oqK3lrprlgKTjgpLjg5Xjg6njg4Pjgrfjg6Xjg6Hjg6Ljg6rjgavkv53lrZjjgZnjgotcbiAgICAgKiBpbmZvOjrmnKzjgrPjg57jg7Pjg4njgpLlrp/ooYzjgZfjgarjgYTpmZDjgorjgIHoqK3lrprlgKTjga/jg6Ljg7zjgr/jg7zjgavmsLjkuYXnmoTjgavkv53lrZjjgZXjgozjgarjgYQo5YaN6LW35YuV44Gn5raI44GI44KLKVxuICAgICAqL1xuICAgIGNtZFNhdmVBbGxSZWdpc3RlcnMoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuc2F2ZUFsbFJlZ2lzdGVycyk7XG4gICAgfVxuXG4gICAgLy8vLy8v44Oq44K744OD44OIXG4gICAgLyoqXG4gICAgICogMHg0RSDmjIflrprjgZfjgZ/jg6zjgrjjgrnjgr/jgpLjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICAgKiBAcGFyYW0gcmVnaXN0ZXI6S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRSZWFkUmVnaXN0ZXJfQ09NTUFORCDliJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgovjgrPjg57jg7Pjg4ko44Os44K444K544K/KeWApFxuICAgICAqL1xuICAgIGNtZFJlc2V0UmVnaXN0ZXIocmVnaXN0ZXIpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KHJlZ2lzdGVyLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0UmVnaXN0ZXIsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMHg0RiDlhajjgabjga7jg6zjgrjjgrnjgr/jgpLjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICAgKiBpbmZvOjpibGVTYXZlQWxsUmVnaXN0ZXJz44KS5a6f6KGM44GX44Gq44GE6ZmQ44KK44CB44Oq44K744OD44OI5YCk44Gv44Oi44O844K/44O844Gr5rC45LmF55qE44Gr5L+d5a2Y44GV44KM44Gq44GEKOWGjei1t+WLleOBp+a2iOOBiOOCiylcbiAgICAgKi9cbiAgICBjbWRSZXNldEFsbFJlZ2lzdGVycygpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5yZXNldEFsbFJlZ2lzdGVycyk7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5YaF6YOoXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbi8vLy8vL2NsYXNzLy9cbn1cblxuXG4vKipcbiAqIFNlbmRCbGVOb3RpZnlQcm9taXNcbiAqIOOAgGNtZFJlYWRSZWdpc3RlcuetieOBrkJMReWRvOOBs+WHuuOBl+W+jOOBq1xuICog44CA44Kz44Oe44Oz44OJ57WQ5p6c44GMbm90aWZ544Gn6YCa55+l44GV44KM44KL44Kz44Oe44Oz44OJ44KSUHJvbWlz44Go57SQ5LuY44GR44KL54K644Gu44Kv44Op44K5XG4gKi9cbmNsYXNzIF9LTU5vdGlmeVByb21pc3tcbiAgICAvL+aIkOWKn+mAmuefpVxuICAgIHN0YXRpYyBzZW5kR3JvdXBOb3RpZnlSZXNvbHZlKGdyb3VwQXJyYXksdGFnTmFtZSx2YWwpe1xuICAgICAgICBpZighZ3JvdXBBcnJheSBpbnN0YW5jZW9mIEFycmF5KXtyZXR1cm47fVxuICAgICAgICAvL+mAgeS/oUlE44Gu6YCa55+lIENhbGxiYWNrUHJvbWlz44Gn5ZG844Gz5Ye644GX5YWD44Gu44Oh44K944OD44OJ44GuUHJvbWlz44Gr6L+U44GZXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPGdyb3VwQXJyYXkubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYoIGdyb3VwQXJyYXlbaV0udGFnTmFtZT09PXRhZ05hbWUgKXtcbiAgICAgICAgICAgICAgICBncm91cEFycmF5W2ldLmNhbGxSZXNvbHZlKHZhbCk7XG4gICAgICAgICAgICAgICAgZ3JvdXBBcnJheS5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBjb25zdFxuICAgICAqIEBwYXJhbSB0YWdOYW1lXG4gICAgICogQHBhcmFtIGdyb3VwQXJyYXlcbiAgICAgKiBAcGFyYW0gcHJvbWlzUmVzb2x2ZU9ialxuICAgICAqIEBwYXJhbSBwcm9taXNSZWplY3RPYmpcbiAgICAgKiBAcGFyYW0gcmVqZWN0VGltZU91dFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHRhZ05hbWUsdGFnSW5mbz1udWxsLGdyb3VwQXJyYXk9W10scHJvbWlzUmVzb2x2ZU9iaiwgcHJvbWlzUmVqZWN0T2JqLHJlamVjdFRpbWVPdXQpe1xuICAgICAgICB0aGlzLnRpbWVvdXRJZD0wO1xuICAgICAgICB0aGlzLnRhZ05hbWU9dGFnTmFtZTtcbiAgICAgICAgdGhpcy50YWdJbmZvPXRhZ0luZm87XG4gICAgICAgIHRoaXMuZ3JvdXBBcnJheT1ncm91cEFycmF5IGluc3RhbmNlb2YgQXJyYXk/Z3JvdXBBcnJheTpbXTtcbiAgICAgICAgdGhpcy5ncm91cEFycmF5LnB1c2godGhpcyk7XG4gICAgICAgIHRoaXMucHJvbWlzUmVzb2x2ZU9iaj1wcm9taXNSZXNvbHZlT2JqO1xuICAgICAgICB0aGlzLnByb21pc1JlamVjdE9iaj1wcm9taXNSZWplY3RPYmo7XG4gICAgICAgIHRoaXMucmVqZWN0VGltZU91dD1yZWplY3RUaW1lT3V0O1xuICAgIH1cbiAgICAvL+OCq+OCpuODs+ODiOOBrumWi+WniyBjaGFyYWN0ZXJpc3RpY3Mud3JpdGVWYWx1ZeWRvOOBs+WHuuOBl+W+jOOBq+Wun+ihjFxuICAgIHN0YXJ0UmVqZWN0VGltZU91dENvdW50KCl7XG4gICAgICAgIHRoaXMudGltZW91dElkPXNldFRpbWVvdXQoKCk9PntcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUdyb3VwKCk7XG4gICAgICAgICAgICB0aGlzLnByb21pc1JlamVjdE9iaih7bXNnOlwidGltZW91dDpcIix0YWdOYW1lOnRoaXMudGFnTmFtZSx0YWdJbmZvOnRoaXMudGFnSW5mb30pO1xuICAgICAgICB9LCB0aGlzLnJlamVjdFRpbWVPdXQpO1xuICAgIH1cbiAgICBjYWxsUmVzb2x2ZShhcmcpe1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xuICAgICAgICB0aGlzLl9yZW1vdmVHcm91cCgpO1xuICAgICAgICB0aGlzLnByb21pc1Jlc29sdmVPYmooYXJnKTtcbiAgICB9XG4gICAgY2FsbFJlamVjdChtc2cpe1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xuICAgICAgICB0aGlzLl9yZW1vdmVHcm91cCgpO1xuICAgICAgICB0aGlzLnByb21pc1JlamVjdE9iaih7bXNnOm1zZ30pO1xuICAgIH1cblxuICAgIF9yZW1vdmVHcm91cCgpe1xuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLmdyb3VwQXJyYXkubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYoIHRoaXMuZ3JvdXBBcnJheT09PXRoaXMpe1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBBcnJheS5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9S01Nb3RvckNvbW1hbmRLTU9uZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL0tNTW90b3JDb21tYW5kS01PbmUuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9