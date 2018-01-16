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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjI3ZDUzZTMzMTU2ZWQzYTljZGYiLCJ3ZWJwYWNrOi8vLy4vc3JjL0tNU3RydWN0dXJlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvS01VdGwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0tNQ29tV2ViQkxFLmpzIiwid2VicGFjazovLy8uL3NyYy9LTUNvbm5lY3RvckJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvS01Nb3Rvck9uZVdlYkJMRS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvS01Db21CYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9LTU1vdG9yQ29tbWFuZEtNT25lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYiwwRkFBMEY7QUFDMUY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IsV0FBVztBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBLDhDQUE4QztBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQyx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7OztBQ3JOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLENBQUM7O0FBRUQsdUI7Ozs7Ozs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQSwwQ0FBMEMsUUFBUTtBQUNsRCxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0EscUNBQXFDO0FBQ3JDLDBDQUEwQyxRQUFRO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDLHNDQUFzQztBQUN0QywwQ0FBMEMsUUFBUTs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7O0FBRXpDLGlEQUFpRCxRQUFROztBQUV6RCx5Q0FBeUM7QUFDekMsMkNBQTJDO0FBQzNDLHVEQUF1RDs7QUFFdkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlGQUF5RjtBQUN6Riw4RkFBOEY7QUFDOUYseUNBQXlDLGtCQUFrQiw4Q0FBOEM7QUFDekc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBLDJEQUEyRDtBQUMzRCxvQkFBb0I7QUFDcEI7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0EsU0FBUztBQUNUOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0VBQWtFO0FBQ2xFO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZCQUE2Qix5Q0FBeUM7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSwyQkFBMkI7QUFDM0IsdUJBQXVCO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QixtQkFBbUI7O0FBRW5CLFdBQVc7QUFDWDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsdUJBQXVCO0FBQ3ZCLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQztBQUNyQztBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsOEJBQThCLHlEQUF5RDtBQUN2RixpQkFBaUI7QUFDakIsYUFBYTtBQUNiOzs7O0FBSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0IseUJBQXlCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7OztBQUdBO0FBQ0E7O0FBRUEsNEI7Ozs7Ozs7OENDdGFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ2pCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsNENBQTRDOztBQUU1Qzs7Ozs7Ozs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLGlDOzs7Ozs7O0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EscUVBQXFFO0FBQ3JFOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLHlCQUF5QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDRDQUE0QztBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBOzs7Ozs7Ozs7O0FDak1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdURBQXVELG1EQUFtRDtBQUMxRztBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlFQUFpRTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EscUJBQXFCLHlCQUF5QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLDRDQUE0QztBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkMsMkNBQTJDO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDZFQUE2RTtBQUM3RTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFFBQVE7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsbUJBQW1CO0FBQy9DO0FBQ0E7QUFDQSwySUFBMkk7QUFDM0k7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLHVJQUF1STtBQUN2STtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0NBQXNDLHFCQUFxQjs7QUFFM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUM7QUFDekM7QUFDQSxvQkFBb0IscUJBQXFCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDLHlEQUF5RDtBQUMzRixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLFFBQVE7QUFDdEM7O0FBRUE7QUFDQSxvQkFBb0IsMEJBQTBCO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7Ozs7OztBQy84QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0gsb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiaW5kZXhCcm93c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNjI3ZDUzZTMzMTU2ZWQzYTljZGYiLCIvKioqXG4gKiBLTVN0cnVjdHVyZXMuanNcbiAqIHZhciAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xubGV0IEtNVXRsID0gcmVxdWlyZSgnLi9LTVV0bCcpO1xuXG5cbi8qKlxuICogc2VjdGlvbjo65qeL6YCg5L2T44Gu5Z+65pys44Oh44K944OD44OJXG4gKiBFUTrlkIzjgZjlgKTjgpLmjIHjgaTjgYvjga7mr5TovINcbiAqIENsb25lOuikh+ijvVxuICogR2V0VmFsT2JqOuWApOOBruWPluW+l++8iE9iau+8iVxuICogR2V0VmFsQXJyYXk65YCk44Gu5Y+W5b6X77yI6YWN5YiX77yJXG4gKi9cbmNsYXNzIEtNU3RydWN0dXJlQmFzZXtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgIH1cbiAgICAvL+WApOOBruavlOi8g1xuICAgIEVRICh0YXIpIHtcbiAgICAgICAgaWYoISB0YXIgKXtyZXR1cm4gZmFsc2U7fVxuICAgICAgICBpZih0aGlzLmNvbnN0cnVjdG9yPT09dGFyLmNvbnN0cnVjdG9yKXtcbiAgICAgICAgICAgIGlmKHRoaXMuR2V0VmFsQXJyYXkpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLkdldFZhbEFycmF5KCkudG9TdHJpbmcoKT09PXRhci5HZXRWYWxBcnJheSgpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9ZWxzZSBpZih0aGlzLkdldFZhbE9iail7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuR2V0VmFsT2JqKCkpPT09SlNPTi5zdHJpbmdpZnkodGFyLkdldFZhbE9iaigpKTsvLyBiYWQ6OumBheOBhFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgLy/opIfoo71cbiAgICBDbG9uZSAoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyB0aGlzLmNvbnN0cnVjdG9yKCksdGhpcyk7XG4gICAgfVxuICAgIC8v5Y+W5b6XIE9iamVjdFxuICAgIEdldFZhbE9iaiAoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LHRoaXMpO1xuICAgIH1cbiAgICBHZXRWYWxBcnJheSAoKSB7XG4gICAgICAgIHZhciBrPU9iamVjdC5rZXlzKHRoaXMpO1xuICAgICAgICB2YXIgcj1bXTtcbiAgICAgICAgZm9yKHZhciBpPTA7aTxrLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgci5wdXNoKHRoaXNba1tpXV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cbn1cblxuLyoqXG4gKiBzZWN0aW9uOjpYWeW6p+aomVxuICovXG5jbGFzcyBLTVZlY3RvcjIgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yICh4LCB5KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMueCA9IHggPyB4IDogMDtcbiAgICAgICAgdGhpcy55ID0geSA/IHkgOiAwO1xuICAgIH1cbiAgICBNb3ZlIChkeCwgZHkpIHtcbiAgICAgICAgdGhpcy54ICs9IGR4O1xuICAgICAgICB0aGlzLnkgKz0gZHk7XG4gICAgfVxuICAgIC8vMueCuemWk+OBrui3nembolxuICAgIERpc3RhbmNlICh2ZWN0b3IyKSB7XG4gICAgICAgIGlmICghKHZlY3RvcjIgaW5zdGFuY2VvZiBLTVZlY3RvcjIpKSB7cmV0dXJuO31cbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdygodGhpcy54LXZlY3RvcjIueCksMikgKyBNYXRoLnBvdygodGhpcy55LXZlY3RvcjIueSksMikpO1xuICAgIH1cbiAgICAvLzLngrnplpPjga7op5LluqZcbiAgICBSYWRpYW4gKHZlY3RvcjIpIHtcbiAgICAgICAgaWYgKCEodmVjdG9yMiBpbnN0YW5jZW9mIEtNVmVjdG9yMikpIHtyZXR1cm47fVxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnktdmVjdG9yMi55LHRoaXMueC12ZWN0b3IyLngpO1xuICAgIH1cbiAgICAvLzAsMOOBi+OCieOBrui3nembolxuICAgIERpc3RhbmNlRnJvbVplcm8oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3codGhpcy54LDIpICsgTWF0aC5wb3codGhpcy55LDIpKTtcbiAgICB9XG4gICAgLy8wLDDjgYvjgonjga7op5LluqZcbiAgICBSYWRpYW5Gcm9tWmVybygpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy55LHRoaXMueCk7XG4gICAgfVxufVxuLyoqXG4gKiBzZWN0aW9uOjpYWVogM+asoeWFg+ODmeOCr+ODiOODq1xuICovXG5jbGFzcyBLTVZlY3RvcjMgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuICAgIGNvbnN0cnVjdG9yKHgseSx6KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMueCA9IHg/eDowO1xuICAgICAgICB0aGlzLnkgPSB5P3k6MDtcbiAgICAgICAgdGhpcy56ID0gej96OjA7XG4gICAgfVxuICAgIC8v56e75YuVXG4gICAgTW92ZSAoZHgsIGR5LCBkeikge1xuICAgICAgICB0aGlzLnggKz0gZHg7XG4gICAgICAgIHRoaXMueSArPSBkeTtcbiAgICAgICAgdGhpcy56ICs9IGR6O1xuICAgIH1cbiAgICAvLzLngrnplpPjga7ot53pm6JcbiAgICBEaXN0YW5jZSAodmVjdG9yMykge1xuICAgICAgICBpZiAoISh2ZWN0b3IzIGluc3RhbmNlb2YgS01WZWN0b3IzKSkge3JldHVybjt9XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coKHRoaXMueC12ZWN0b3IzLngpLDIpICsgTWF0aC5wb3coKHRoaXMueS12ZWN0b3IzLnkpLDIpKyBNYXRoLnBvdygodGhpcy56LXZlY3RvcjMueiksMikpO1xuICAgIH1cbiAgICAvLzLngrnplpPjga7op5LluqYo5Zue6Lui5pa55ZCR44Gu5oOF5aCx44Gq44GXKVxuICAgIFJhZGlhbiAodmVjdG9yMykge1xuICAgICAgICBpZiAoISh2ZWN0b3IzIGluc3RhbmNlb2YgS01WZWN0b3IzKSkge3JldHVybjt9XG4gICAgICAgIC8vdG9kbzo6MueCuemWk+OBruinkuW6pijlm57ou6LmlrnlkJHjga7mg4XloLHjgarjgZcpXG4gICAgfVxuICAgIC8vMCww44GL44KJ44Gu6Led6ZuiXG4gICAgRGlzdGFuY2VGcm9tWmVybyAoKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3codGhpcy54LDIpICsgTWF0aC5wb3codGhpcy55LDIpKyBNYXRoLnBvdyh0aGlzLnosMikpO1xuICAgIH1cbiAgICAvLzAsMCww44GL44KJ44Gu6KeS5bqmXG4gICAgUmFkaWFuRnJvbVplcm8gKCkge1xuICAgICAgICAvL3RvZG86OjAsMCww44GL44KJ44Gu6KeS5bqmXG4gICAgfVxufVxuLyoqXG4gKiBzZWN0aW9uOjrjgrjjg6PjgqTjg63jgrvjg7PjgrXjg7zlgKRcbiAqL1xuY2xhc3MgS01JbXVTdGF0ZSBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgY29uc3RydWN0b3IgKGFjY2VsWCwgYWNjZWxZLCBhY2NlbFosIHRlbXAsIGd5cm9YLCBneXJvWSwgZ3lyb1ogKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5hY2NlbFg9IEtNVXRsLnRvTnVtYmVyKGFjY2VsWCk7XG4gICAgICAgIHRoaXMuYWNjZWxZPSBLTVV0bC50b051bWJlcihhY2NlbFkpO1xuICAgICAgICB0aGlzLmFjY2VsWj0gS01VdGwudG9OdW1iZXIoYWNjZWxaKTtcbiAgICAgICAgdGhpcy50ZW1wPSBLTVV0bC50b051bWJlcih0ZW1wKTtcbiAgICAgICAgdGhpcy5neXJvWD0gS01VdGwudG9OdW1iZXIoZ3lyb1gpO1xuICAgICAgICB0aGlzLmd5cm9ZPSBLTVV0bC50b051bWJlcihneXJvWSk7XG4gICAgICAgIHRoaXMuZ3lyb1o9IEtNVXRsLnRvTnVtYmVyKGd5cm9aKTtcbiAgICB9XG59XG4vKipcbiAqIEtFSUdBTuODouODvOOCv+ODvExFROOAgOeCueeBr+ODu+iJsueKtuaFi1xuICogU3RhdGUgTU9UT1JfTEVEX1NUQVRFXG4gKiBjb2xvclIgMC0yNTVcbiAqIGNvbG9yRyAwLTI1NVxuICogY29sb3JCIDAtMjU1XG4gKiAqL1xuY2xhc3MgS01MZWRTdGF0ZSBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgc3RhdGljIGdldCBNT1RPUl9MRURfU1RBVEUoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgXCJNT1RPUl9MRURfU1RBVEVfT0ZGXCI6MCwvL0xFROa2iOeBr1xuICAgICAgICAgICAgXCJNT1RPUl9MRURfU1RBVEVfT05fU09MSURcIjoxLC8vTEVE54K554Gv77yI54K554Gv44GX44Gj44Gx44Gq44GX77yJXG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PTl9GTEFTSFwiOjIsLy9MRUTngrnmu4XvvIjkuIDlrprplpPpmpTjgafngrnmu4XvvIlcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09OX0RJTVwiOjMgIC8vTEVE44GM44KG44Gj44GP44KK6Lyd5bqm5aSJ5YyW44GZ44KLXG4gICAgICAgIH1cbiAgICB9XG4gICAgY29uc3RydWN0b3Ioc3RhdGUsY29sb3JSLGNvbG9yRyxjb2xvckIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zdGF0ZT1LTVV0bC50b051bWJlcihzdGF0ZSk7XG4gICAgICAgIHRoaXMuY29sb3JSPUtNVXRsLnRvTnVtYmVyKGNvbG9yUik7XG4gICAgICAgIHRoaXMuY29sb3JHPUtNVXRsLnRvTnVtYmVyKGNvbG9yRyk7XG4gICAgICAgIHRoaXMuY29sb3JCPUtNVXRsLnRvTnVtYmVyKGNvbG9yQik7XG4gICAgfVxufVxuXG4vKipcbiAqIHNlY3Rpb246OuODouODvOOCv+ODvOWbnui7ouaDheWgsVxuICovXG5jbGFzcyBLTVJvdFN0YXRlIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcblxuICAgIHN0YXRpYyBnZXQgTUFYX1RPUlFVRSgpe1xuICAgICAgICByZXR1cm4gMC4zOy8vMC4zIE7jg7ttXG4gICAgfVxuICAgIHN0YXRpYyBnZXQgTUFYX1NQRUVEX1JQTSgpe1xuICAgICAgICByZXR1cm4gMzAwOy8vMzAwcnBtXG4gICAgfVxuICAgIHN0YXRpYyBnZXQgTUFYX1NQRUVEX1JBRElBTigpe1xuICAgICAgICByZXR1cm4gS01VdGwucnBtVG9SYWRpYW5TZWMoMzAwKTtcbiAgICB9XG4gICAgc3RhdGljIGdldCBNQVhfUE9TSVRJT04oKXtcbiAgICAgICAgcmV0dXJuIDMqTWF0aC5wb3coMTAsMzgpOy8vaW5mbzo644CMcmV0dXJu44CAM2UrMzjjgI3jga9taW5pZnnjgafjgqjjg6njg7xcbiAgICAgICAgLy9yZXR1cm7jgIAzZSszODsvL3JhZGlhbiA0Ynl0ZSBmbG9hdOOAgDEuMTc1NDk0IDEwLTM4ICA8IDMuNDAyODIzIDEwKzM4XG4gICAgfVxuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uLCB2ZWxvY2l0eSwgdG9ycXVlKSB7XG4gICAgICAgIC8v5pyJ5Yq55qGB5pWwIOWwj+aVsOesrDPkvY1cbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IE1hdGguZmxvb3IoS01VdGwudG9OdW1iZXIocG9zaXRpb24pKjEwMCkvMTAwO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gTWF0aC5mbG9vcihLTVV0bC50b051bWJlcih2ZWxvY2l0eSkqMTAwKS8xMDA7XG4gICAgICAgIHRoaXMudG9ycXVlID0gTWF0aC5mbG9vcihLTVV0bC50b051bWJlcih0b3JxdWUpKjEwMDAwKS8xMDAwMDtcbiAgICB9XG59XG5cbi8qKlxuICogc2VjdGlvbjo644OH44OQ44Kk44K55oOF5aCxXG4gKi9cbmNsYXNzIEtNRGV2aWNlSW5mbyBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgY29uc3RydWN0b3IodHlwZT1cIlwiLGlkPVwiXCIsbmFtZT1cIlwiLGlzQ29ubmVjdD1mYWxzZSxtYW51ZmFjdHVyZXJOYW1lPW51bGwsaGFyZHdhcmVSZXZpc2lvbj1udWxsLGZpcm13YXJlUmV2aXNpb249bnVsbCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGU9dHlwZTtcbiAgICAgICAgdGhpcy5pZD1pZDtcbiAgICAgICAgdGhpcy5uYW1lPW5hbWU7XG4gICAgICAgIHRoaXMuaXNDb25uZWN0PWlzQ29ubmVjdDtcbiAgICAgICAgdGhpcy5tYW51ZmFjdHVyZXJOYW1lPW1hbnVmYWN0dXJlck5hbWU7XG4gICAgICAgIHRoaXMuaGFyZHdhcmVSZXZpc2lvbj1oYXJkd2FyZVJldmlzaW9uO1xuICAgICAgICB0aGlzLmZpcm13YXJlUmV2aXNpb249ZmlybXdhcmVSZXZpc2lvbjtcbiAgICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgS01TdHJ1Y3R1cmVCYXNlOktNU3RydWN0dXJlQmFzZSxcbiAgICBLTVZlY3RvcjI6S01WZWN0b3IyLFxuICAgIEtNVmVjdG9yMzpLTVZlY3RvcjMsXG4gICAgS01JbXVTdGF0ZTpLTUltdVN0YXRlLFxuICAgIEtNTGVkU3RhdGU6S01MZWRTdGF0ZSxcbiAgICBLTVJvdFN0YXRlOktNUm90U3RhdGUsXG4gICAgS01EZXZpY2VJbmZvOktNRGV2aWNlSW5mb1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL0tNU3RydWN0dXJlcy5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKioqXG4gKiBLTVV0bC5qc1xuICogdmVyc2lvbiAwLjEuMCBhbHBoYVxuICogQ0NyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbnZhciBLTVV0bCA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gS01VdGwoKSB7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pWw5YCk44Gr44Kt44Oj44K544OI44GZ44KL6Zai5pWwIChDKeOAgFxuICAgICAqIOaVsOWApOS7peWkluOBrzDjgpLov5TjgZlcbiAgICAgKiBJbmZpbml0eeOCgjDjgajjgZnjgotcbiAgICAgKi9cbiAgICBLTVV0bC50b051bWJlcj1mdW5jdGlvbiB0b051bWJlcih2YWwsIGRlZmF1bHR2YWwgPSAwKSB7XG4gICAgICAgIHZhciB2ID0gcGFyc2VGbG9hdCh2YWwsIDEwKTtcbiAgICAgICAgcmV0dXJuIChpc05hTih2KSB8fCB2YWwgPT09IEluZmluaXR5ID8gZGVmYXVsdHZhbCA6IHYpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICog5Y2Y5L2N5aSJ5o+b44CAZGVncmVlID4+IHJhZGlhblxuICAgICAqIEBwYXJhbSBkZWdyZWVcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgICAgICBLTVV0bC5kZWdyZWVUb1JhZGlhbj0gZnVuY3Rpb24gZGVncmVlVG9SYWRpYW4oZGVncmVlKSB7XG4gICAgICAgIHJldHVybiBkZWdyZWUgKiAwLjAxNzQ1MzI5MjUxOTk0MzI5NTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIOWNmOS9jeWkieaPm+OAgHJhZGlhbiA+PiBkZWdyZWVcbiAgICAgKiBAcGFyYW0gcmFkaWFuXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBLTVV0bC5yYWRpYW5Ub0RlZ3JlZT0gZnVuY3Rpb24gcmFkaWFuVG9EZWdyZWUocmFkaWFuKSB7XG4gICAgICAgIHJldHVybiByYWRpYW4gLyAwLjAxNzQ1MzI5MjUxOTk0MzI5NTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIOmAn+W6piBycG0gLT5yYWRpYW4vc2VjIOOBq+WkieaPm1xuICAgICAqIEBwYXJhbSBycG1cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIEtNVXRsLnJwbVRvUmFkaWFuU2VjPSBmdW5jdGlvbiBycG1Ub1JhZGlhblNlYyhycG0pIHtcbiAgICAgICAgLy/pgJ/luqYgcnBtIC0+cmFkaWFuL3NlYyhNYXRoLlBJKjIvNjApXG4gICAgICAgIHJldHVybiBycG0gKiAwLjEwNDcxOTc1NTExOTY1OTc3O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogMueCuemWk+OBrui3nembouOBqOinkuW6puOCkuaxguOCgeOCi1xuICAgICAqIEBwYXJhbSBmcm9tX3gsZnJvbV95LHRvX3gsdG9feVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgS01VdGwudHdvUG9pbnREaXN0YW5jZUFuZ2xlPSBmdW5jdGlvbiB0d29Qb2ludERpc3RhbmNlQW5nbGUoZnJvbV94LCBmcm9tX3ksIHRvX3gsIHRvX3kpIHtcbiAgICAgICAgdmFyIGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KGZyb21feCAtIHRvX3gsIDIpICsgTWF0aC5wb3coZnJvbV95IC0gdG9feSwgMikpO1xuICAgICAgICB2YXIgcmFkaWFuID0gTWF0aC5hdGFuMihmcm9tX3kgLSB0b195LCBmcm9tX3ggLSB0b194KTtcbiAgICAgICAgcmV0dXJuIHtkaXN0OiBkaXN0YW5jZSwgcmFkaTogcmFkaWFuLCBkZWc6IEtNVXRsLnJhZGlhblRvRGVncmVlKHJhZGlhbil9O1xuICAgIH07XG5cblxuICAgIC8qIHV0Zi5qcyAtIFVURi04IDw9PiBVVEYtMTYgY29udmVydGlvblxuICAgICAqXG4gICAgICogQ29weXJpZ2h0IChDKSAxOTk5IE1hc2FuYW8gSXp1bW8gPGl6QG9uaWNvcy5jby5qcD5cbiAgICAgKiBWZXJzaW9uOiAxLjBcbiAgICAgKiBMYXN0TW9kaWZpZWQ6IERlYyAyNSAxOTk5XG4gICAgICogVGhpcyBsaWJyYXJ5IGlzIGZyZWUuICBZb3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0LlxuICAgICAqL1xuICAgIEtNVXRsLlV0ZjhBcnJheVRvU3RyPWZ1bmN0aW9uKGFycmF5KSB7XG4gICAgICAgIGxldCBvdXQsIGksIGxlbiwgYztcbiAgICAgICAgbGV0IGNoYXIyLCBjaGFyMztcblxuICAgICAgICBvdXQgPSBcIlwiO1xuICAgICAgICBsZW4gPSBhcnJheS5sZW5ndGg7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICB3aGlsZShpIDwgbGVuKSB7XG4gICAgICAgICAgICBjID0gYXJyYXlbaSsrXTtcbiAgICAgICAgICAgIHN3aXRjaChjID4+IDQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IGNhc2UgMjogY2FzZSAzOiBjYXNlIDQ6IGNhc2UgNTogY2FzZSA2OiBjYXNlIDc6XG4gICAgICAgICAgICAgICAgLy8gMHh4eHh4eHhcbiAgICAgICAgICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDEyOiBjYXNlIDEzOlxuICAgICAgICAgICAgICAgIC8vIDExMHggeHh4eCAgIDEweHggeHh4eFxuICAgICAgICAgICAgICAgIGNoYXIyID0gYXJyYXlbaSsrXTtcbiAgICAgICAgICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAweDFGKSA8PCA2KSB8IChjaGFyMiAmIDB4M0YpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgICAgICAgICAvLyAxMTEwIHh4eHggIDEweHggeHh4eCAgMTB4eCB4eHh4XG4gICAgICAgICAgICAgICAgICAgIGNoYXIyID0gYXJyYXlbaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcjMgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAweDBGKSA8PCAxMikgfFxuICAgICAgICAgICAgICAgICAgICAgICAgKChjaGFyMiAmIDB4M0YpIDw8IDYpIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICgoY2hhcjMgJiAweDNGKSA8PCAwKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfTtcblxuICAgIHJldHVybiBLTVV0bDtcbn0oKSk7XG5cbm1vZHVsZS5leHBvcnRzID0gS01VdGw7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvS01VdGwuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqKlxuICogS01Db21XZWJCTEUuanNcbiAqIHZlcnNpb24gMC4xLjAgYWxwaGFcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmxldCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcbmxldCBLTUNvbUJhc2UgPSByZXF1aXJlKCcuL0tNQ29tQmFzZScpO1xuXG5jbGFzcyBLTUNvbVdlYkJMRSBleHRlbmRzIEtNQ29tQmFzZXtcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlrprmlbBcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3LjgIBcbiAgICAgKiBAcGFyYW0gYXJnXG4gICAgICpcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihhcmcpe1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLnR5cGU9XCJXRUJCTEVcIjtcbiAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzPXt9O1xuICAgICAgICB0aGlzLl9ibGVTZW5kaW5nUXVlPVByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgdGhpcy5fcXVlQ291bnQ9MDtcbiAgICAgICAgXG4gICAgICAgIC8v44K144O844OT44K5VVVJRFxuICAgICAgICB0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEPSdmMTQwZWEzNS04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnO1xuXG4gICAgICAgIC8v44Kt44Oj44Op44Kv44K/44Oq44K544OG44Kj44Kv44K5VVVJRFxuICAgICAgICB0aGlzLl9NT1RPUl9CTEVfQ1JTPXtcbiAgICAgICAgICAgICdNT1RPUl9DT05UUk9MJzonZjE0MDAwMDEtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJywvL+ODouODvOOCv+ODvOOBuOOBruioreWumuOAgeWItuW+oeWRveS7pOOCkuWPluOCiuaJseOBhlxuICAgICAgICAgICAgLy8nTU9UT1JfTEVEJzonZjE0MDAwMDMtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJywvL+ODouODvOOCv+ODvOOBrkxFROOCkuWPluOCiuaJseOBhiBpbmZvOjogTU9UT1JfQ09OVFJPTDo6YmxlTGVk44Gn5Luj55SoXG4gICAgICAgICAgICAnTU9UT1JfTUVBU1VSRU1FTlQnOidmMTQwMDAwNC04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLC8v44Oi44O844K/44O844Gu5L2N572u44O76YCf5bqm44O744OI44Or44Kv562J5ris5a6a5YCk44KS5Y+W44KK5omx44GGXG4gICAgICAgICAgICAnTU9UT1JfSU1VX01FQVNVUkVNRU5UJzonZjE0MDAwMDUtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJywvL+ODouODvOOCv+ODvOOBruWKoOmAn+W6puODu+OCuOODo+OCpOODreOCu+ODs+OCteODvO+8iElNVe+8ieOCkuWPluOCiuaJseOBhlxuICAgICAgICAgICAgJ01PVE9SX1NFVFRJTkcnOidmMTQwMDAwNi04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLy/jg6Ljg7zjgr/jg7zjga7oqK3lrprlgKTjgpLlj5bjgormibHjgYZcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFM9e1xuICAgICAgICAgICAgXCJTZXJ2aWNlXCI6MHgxODBhXG4gICAgICAgICAgICAsXCJNYW51ZmFjdHVyZXJOYW1lU3RyaW5nXCI6MHgyYTI5XG4gICAgICAgICAgICAsXCJIYXJkd2FyZVJldmlzaW9uU3RyaW5nXCI6MHgyYTI3XG4gICAgICAgICAgICAsXCJGaXJtd2FyZVJldmlzaW9uU3RyaW5nXCI6MHgyYTI2XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJMReWIh+aWreaZglxuICAgICAgICAgKiBAcGFyYW0gZXZlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgIHRoaXMuX29uQmxlQ29ubmVjdGlvbkxvc3Q9KGV2ZSk9PntcbiAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q9ZmFsc2U7XG4gICAgICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW51bGw7XG4gICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaXNDb25uZWN0KGZhbHNlKTtcbiAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIOODouODvOOCv+ODvOWbnui7ouaDheWgseWPl+S/oVxuICAgICAgICAgKiBAcGFyYW0gZXZlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBOb3RpZnkg44GX44Gf44Go44GN44Gu6L+U44KK5YCkXG4gICAgICAgICAqIGJ5dGVbMF0tYnl0ZVszXVx0ICAgIGJ5dGVbNF0tYnl0ZVs3XVx0ICAgICAgICBieXRlWzhdLWJ5dGVbMTFdXG4gICAgICAgICAqIGZsb2F0ICogXHRcdCAgICAgICAgZmxvYXQgKiAgICAgICAgICAgICAgICAgZmxvYXQgKlxuICAgICAgICAgKiBwb3NpdGlvbjpyYWRpYW5zXHQgICAgc3BlZWQ6cmFkaWFucy9zZWNvbmRcdHRvcnF1ZTpO44O7bVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25CbGVNb3Rvck1lYXN1cmVtZW50PShldmUpPT57XG4gICAgICAgICAgICBpZighZXZlfHwhZXZlLnRhcmdldCl7cmV0dXJuO31cbiAgICAgICAgICAgIGxldCBkdiA9IGV2ZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICBpZighKGR2IGluc3RhbmNlb2YgRGF0YVZpZXcpKXtyZXR1cm47fS8vaW5mbzo6d2ViIGJsdWV0b29o44Gu44G/IG5vZGUuanPjga9pbnN0YW5jZW9mIEJ1ZmZlclxuICAgICAgICAgICAgbGV0IHJlcz17cG9zaXRpb246ZHYuZ2V0RmxvYXQzMigwLGZhbHNlKSx2ZWxvY2l0eTpkdi5nZXRGbG9hdDMyKDQsZmFsc2UpLHRvcnF1ZTpkdi5nZXRGbG9hdDMyKDgsZmFsc2UpfTtcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JNZWFzdXJlbWVudENCKHJlcyk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44Oi44O844K/44O8SU1V5oOF5aCx5Y+X5L+hXG4gICAgICAgICAqIEBwYXJhbSBldmVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICpcbiAgICAgICAgICogTm90aWZ5IOOBl+OBn+OBqOOBjeOBrui/lOOCiuWApCktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICpcbiAgICAgICAgICogYWNjZWxfeCwgYWNjZWxfeSwgYWNjZWxfeiwgdGVtcCwgZ3lyb194LCBneXJvX3ksIGd5cm9feiDjgYzlhajjgabov5TjgaPjgabjgY/jgovjgILlj5blvpfplpPpmpTjga8xMDBtcyDlm7rlrppcbiAgICAgICAgICogYnl0ZShCaWdFbmRpYW4pICBbMF1bMV0gWzJdWzNdICBbNF1bNV0gICBbNl1bN11cdCAgICBbOF1bOV1cdFsxMF1bMTFdICAgIFsxMl1bMTNdXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgaW50MTZfdCBpbnQxNl90IGludDE2X3QgaW50MTZfdCAgICAgaW50MTZfdCBpbnQxNl90IGludDE2X3RcbiAgICAgICAgICogICAgICAgICAgICAgICAgICBhY2NlbC14IGFjY2VsLXkgYWNjZWwteiB0ZW1wXHQgICAgZ3lyby14XHRneXJvLXlcdGd5cm8telxuICAgICAgICAgKlxuICAgICAgICAgKiBpbnQxNl90Oi0zMiw3NjjjgJwzMiw3NjhcbiAgICAgICAgICog5py644Gu5LiK44Gr44Oi44O844K/44O844KS572u44GE44Gf5aC05ZCI44CB5Yqg6YCf5bqm44CAeiA9IDE2MDAwIOeoi+W6puOBqOOBquOCi+OAgu+8iOmHjeWKm+aWueWQkeOBruOBn+OCge+8iVxuICAgICAgICAgKlxuICAgICAgICAgKiDljZjkvY3lpInmj5vvvIktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44CA5Yqg6YCf5bqmIHZhbHVlIFtHXSA9IHJhd192YWx1ZSAqIDIgLyAzMiw3NjdcbiAgICAgICAgICog44CA5rip5bqmIHZhbHVlIFvihINdID0gcmF3X3ZhbHVlIC8gMzMzLjg3ICsgMjEuMDBcbiAgICAgICAgICog44CA6KeS6YCf5bqmXG4gICAgICAgICAqIOOAgOOAgHZhbHVlIFtkZWdyZWUvc2Vjb25kXSA9IHJhd192YWx1ZSAqIDI1MCAvIDMyLDc2N1xuICAgICAgICAgKiDjgIDjgIB2YWx1ZSBbcmFkaWFucy9zZWNvbmRdID0gcmF3X3ZhbHVlICogMC4wMDAxMzMxNjIxMVxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25CbGVJbXVNZWFzdXJlbWVudD0oZXZlKT0+e1xuICAgICAgICAgICAgaWYoIWV2ZXx8IWV2ZS50YXJnZXQpe3JldHVybjt9XG4gICAgICAgICAgICBsZXQgZHYgPSBldmUudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgbGV0IHRlbXBDYWxpYnJhdGlvbj0tNS43Oy8v5rip5bqm5qCh5q2j5YCkXG4gICAgICAgICAgICBpZighKGR2IGluc3RhbmNlb2YgRGF0YVZpZXcpKXtyZXR1cm47fS8vaW5mbzo6d2ViIGJsdWV0b29o44Gu44G/IG5vZGUuanPjga9pbnN0YW5jZW9mIEJ1ZmZlclxuICAgICAgICAgICAgLy/ljZjkvY3jgpLmibHjgYTmmJPjgYTjgojjgYbjgavlpInmj5tcbiAgICAgICAgICAgIGxldCByZXM9e1xuICAgICAgICAgICAgICAgIGFjY2VsWDpkdi5nZXRJbnQxNigwLGZhbHNlKSoyLzMyNzY3LGFjY2VsWTpkdi5nZXRJbnQxNigyLGZhbHNlKSoyLzMyNzY3LGFjY2VsWjpkdi5nZXRJbnQxNig0LGZhbHNlKSoyLzMyNzY3LFxuICAgICAgICAgICAgICAgIHRlbXA6KGR2LmdldEludDE2KDYsZmFsc2UpKSAvIDMzMy44NyArIDIxLjAwK3RlbXBDYWxpYnJhdGlvbixcbiAgICAgICAgICAgICAgICBneXJvWDpkdi5nZXRJbnQxNig4LGZhbHNlKSoyNTAvMzI3NjcsZ3lyb1k6ZHYuZ2V0SW50MTYoMTAsZmFsc2UpKjI1MC8zMjc2NyxneXJvWjpkdi5nZXRJbnQxNigxMixmYWxzZSkqMjUwLzMyNzY3XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgdGhpcy5fb25JbXVNZWFzdXJlbWVudENCKHJlcyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIGV2ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTm90aWZ5IOOBl+OBn+OBqOOBjeOBrui/lOOCiuWApFxuICAgICAgICAgKiBieXRlWzBdXHRieXRlWzFdXHRieXRlWzJdXHRieXRlWzNdIGJ5dGVbNF3ku6XpmY1cdGJ5dGVbbi0yXVx0Ynl0ZVtuLTFdXG4gICAgICAgICAqIHVpbnQ4X3Q6bG9nX3R5cGVcdHVpbnQxNl90OmlkXHR1aW50OF90OnJlZ2lzdGVyXHR1aW50OF90OnZhbHVlXHR1aW50MTZfdDpDUkNcbiAgICAgICAgICogMHg0MFx0dWludDE2X3QgKDJieXRlKSAw772eNjU1MzVcdOODrOOCuOOCueOCv+OCs+ODnuODs+ODiVx044Os44K444K544K/44Gu5YCk77yI44Kz44Oe44Oz44OJ44Gr44KI44Gj44Gm5aSJ44KP44KL77yJXHR1aW50MTZfdCAoMmJ5dGUpIDDvvZ42NTUzNVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25CbGVNb3RvclNldHRpbmc9KGV2ZSk9PntcbiAgICAgICAgICAgIGlmKCFldmV8fCFldmUudGFyZ2V0KXtyZXR1cm47fVxuICAgICAgICAgICAgbGV0IGR2ID0gZXZlLnRhcmdldC52YWx1ZTsvLzYrbuODkOOCpOODiOOAgOODh+ODvOOCv+S7leanmOOAgGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL3NwcmVhZHNoZWV0cy9kLzF1eEp1ODZYZThLYklseHU1b1BGdjlLUWR2SFkzMy1OSXkwY2RTZ0lub1VrL2VkaXQjZ2lkPTEwMDA0ODIzODNcbiAgICAgICAgICAgIGlmKCEoZHYgaW5zdGFuY2VvZiBEYXRhVmlldykpe3JldHVybjt9Ly9pbmZvOjp3ZWIgYmx1ZXRvb2jjga7jgb8gbm9kZS5qc+OBr2luc3RhbmNlb2YgQnVmZmVyXG5cbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLy/jg4fjg7zjgr/jga5wYXJzZVxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBsZXQgbm90aWZ5QmluTGVuPWR2LmJ5dGVMZW5ndGg7XG4gICAgICAgICAgICBsZXQgbm90aWZ5Q21kPWR2LmdldFVpbnQ4KDApOy8v44Os44K444K544K/5oOF5aCx6YCa55+l44Kz44Oe44Oz44OJSUQgMHg0MOWbuuWumlxuXG4gICAgICAgICAgICBpZihub3RpZnlDbWQhPTB4NDB8fG5vdGlmeUJpbkxlbjw9Nil7cmV0dXJuO30vL+ODrOOCuOOCueOCv+aDheWgseOCkuWQq+OBvuOBquOBhOODh+ODvOOCv+OBruegtOajhFxuXG4gICAgICAgICAgICBsZXQgaWQ9ZHYuZ2V0VWludDE2KDEsZmFsc2UpOy8v6YCB5L+hSURcbiAgICAgICAgICAgIGxldCByZWdpc3RlckNtZD1kdi5nZXRVaW50OCgzKTsvL+ODrOOCuOOCueOCv+OCs+ODnuODs+ODiVxuICAgICAgICAgICAgbGV0IGNyYz1kdi5nZXRVaW50MTYobm90aWZ5QmluTGVuLTIsZmFsc2UpOy8vQ1JD44Gu5YCkIOacgOW+jOOBi+OCiTJkeXRlXG5cbiAgICAgICAgICAgIGxldCByZXM9e307XG4gICAgICAgICAgICAvL+OCs+ODnuODs+ODieWIpeOBq+OCiOOCi+ODrOOCuOOCueOCv+OBruWApOOBruWPluW+l1s0LW4gYnl0ZV1cbiAgICAgICAgICAgIHN3aXRjaChyZWdpc3RlckNtZCl7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELm1heFNwZWVkOlxuICAgICAgICAgICAgICAgICAgICByZXMubWF4U3BlZWQ9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELm1pblNwZWVkOlxuICAgICAgICAgICAgICAgICAgICByZXMubWluU3BlZWQ9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELmN1cnZlVHlwZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmN1cnZlVHlwZT1kdi5nZXRVaW50OCg0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELmFjYzpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmFjYz1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQuZGVjOlxuICAgICAgICAgICAgICAgICAgICByZXMuZGVjPWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORC5tYXhUb3JxdWU6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tYXhUb3JxdWU9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELnFDdXJyZW50UDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnFDdXJyZW50UD1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQucUN1cnJlbnRJOlxuICAgICAgICAgICAgICAgICAgICByZXMucUN1cnJlbnRJPWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORC5xQ3VycmVudEQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5xQ3VycmVudEQ9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELnNwZWVkUDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNwZWVkUD1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQuc3BlZWRJOlxuICAgICAgICAgICAgICAgICAgICByZXMuc3BlZWRJPWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORC5zcGVlZEQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zcGVlZEQ9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELnBvc2l0aW9uUDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnBvc2l0aW9uUD1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQub3duQ29sb3I6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5vd25Db2xvcj0oJyMwMDAwMDAnICtOdW1iZXIoZHYuZ2V0VWludDgoNCk8PDE2fGR2LmdldFVpbnQ4KDUpPDw4fGR2LmdldFVpbnQ4KDYpKS50b1N0cmluZygxNikpLnN1YnN0cigtNik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXMpO1xuXG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yU2V0dGluZ0NCKHJlZ2lzdGVyQ21kLHJlcyk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogc2VjdGlvbjo65YWs6ZaL44Oh44K944OD44OJXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIEJMReOBp+OBruaOpee2mlxuICAgICAqL1xuICAgIGNvbm5lY3QoKXtcbiAgICAgICAgaWYgKHRoaXMuX3BlcmlwaGVyYWwmJiB0aGlzLl9wZXJpcGhlcmFsLmdhdHQmJnRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5jb25uZWN0ZWQgKSB7cmV0dXJufVxuICAgICAgICBsZXQgZ2F0PSAodGhpcy5fcGVyaXBoZXJhbCYmIHRoaXMuX3BlcmlwaGVyYWwuZ2F0dCApP3RoaXMuX3BlcmlwaGVyYWwuZ2F0dCA6dW5kZWZpbmVkOy8v5YaN5o6l57aa55SoXG4gICAgICAgIHRoaXMuX2JsZUNvbm5lY3QoZ2F0KS50aGVuKG9iaj0+ey8vaW5mbzo6IHJlc29sdmUoe2RldmljZUlELGRldmljZU5hbWUsYmxlRGV2aWNlLGNoYXJhY3RlcmlzdGljc30pO1xuICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbD1vYmouYmxlRGV2aWNlO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pZD10aGlzLl9wZXJpcGhlcmFsLmlkO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5uYW1lPXRoaXMuX3BlcmlwaGVyYWwubmFtZTtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uaXNDb25uZWN0PXRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5jb25uZWN0ZWQ7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLm1hbnVmYWN0dXJlck5hbWU9b2JqLmluZm9tYXRpb24ubWFudWZhY3R1cmVyTmFtZTtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uaGFyZHdhcmVSZXZpc2lvbj1vYmouaW5mb21hdGlvbi5oYXJkd2FyZVJldmlzaW9uO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5maXJtd2FyZVJldmlzaW9uPW9iai5pbmZvbWF0aW9uLmZpcm13YXJlUmV2aXNpb247XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzPW9iai5jaGFyYWN0ZXJpc3RpY3M7XG5cbiAgICAgICAgICAgIGlmKCFnYXQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZ2F0dHNlcnZlcmRpc2Nvbm5lY3RlZCcsdGhpcy5fb25CbGVDb25uZWN0aW9uTG9zdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbC5hZGRFdmVudExpc3RlbmVyKCdnYXR0c2VydmVyZGlzY29ubmVjdGVkJywgdGhpcy5fb25CbGVDb25uZWN0aW9uTG9zdCk7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX01FQVNVUkVNRU5UJ10pe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX01FQVNVUkVNRU5UJ10ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JNZWFzdXJlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfTUVBU1VSRU1FTlQnXS5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3Rvck1lYXN1cmVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9NRUFTVVJFTUVOVCddLnN0YXJ0Tm90aWZpY2F0aW9ucygpLnRoZW4ob2JqPT57XG4gICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfSU1VX01FQVNVUkVNRU5UJ10pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9JTVVfTUVBU1VSRU1FTlQnXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVJbXVNZWFzdXJlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCddLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZUltdU1lYXN1cmVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCddLnN0YXJ0Tm90aWZpY2F0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgfSkudGhlbihvYmo9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfU0VUVElORyddKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX1NFVFRJTkcnXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3RvclNldHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfU0VUVElORyddLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yU2V0dGluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfU0VUVElORyddLnN0YXJ0Tm90aWZpY2F0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIH0pLnRoZW4ob2JqPT57XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaW5pdCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZV9pc0Nvbm5lY3QodHJ1ZSk7Ly/liJ3lm57jga7jgb8oY29tcOS7peWJjeOBr+eZuueBq+OBl+OBquOBhOeCuilcbiAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaXNDb25uZWN0KHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChlcnI9PntcbiAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9bnVsbDtcbiAgICAgICAgICAgIHRoaXMuX29uQ29ubmVjdEZhaWx1cmVIYW5kbGVyKHRoaXMsZXJyKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCTEXjgafjga7liIfmlq1cbiAgICAgKi9cbiAgICBkaXNDb25uZWN0KCl7XG4gICAgICAgaWYgKCF0aGlzLl9wZXJpcGhlcmFsIHx8ICF0aGlzLl9wZXJpcGhlcmFsLmdhdHQuY29ubmVjdGVkKXtyZXR1cm47fVxuICAgICAgICB0aGlzLl9wZXJpcGhlcmFsLmdhdHQuZGlzY29ubmVjdCgpO1xuICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW51bGw7XG5cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlhoXpg6hcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBCTEXmjqXntppcbiAgICAgKiBAcGFyYW0gZ2F0dF9vYmog44Oa44Ki44Oq44Oz44Kw5riI44G/44GuR0FUVOOBruODh+ODkOOCpOOCueOBq+WGjeaOpee2mueUqCjjg5rjgqLjg6rjg7PjgrDjg6Ljg7zjg4Djg6vjga/lh7rjgarjgYQpXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYmxlQ29ubmVjdChnYXR0X29iaikge1xuICAgICAgLy9sZXQgc2VsZiA9IHRoaXM7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgLy8gbGV0IGJsZURldmljZTtcbiAgICAgICAgICAvLyBsZXQgZGV2aWNlTmFtZTtcbiAgICAgICAgICAvLyBsZXQgZGV2aWNlSUQ7XG4gICAgICAgICAgaWYoIWdhdHRfb2JqKXtcbiAgICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICBmaWx0ZXJzOiBbe3NlcnZpY2VzOiBbdGhpcy5fTU9UT1JfQkxFX1NFUlZJQ0VfVVVJRF19XSxcbiAgICAgICAgICAgICAgICAgIG9wdGlvbmFsU2VydmljZXM6W3RoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLlNlcnZpY2VdXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIG5hdmlnYXRvci5ibHVldG9vdGgucmVxdWVzdERldmljZShvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oZGV2aWNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ibGVHYXRjb25uZWN0KGRldmljZS5nYXR0KS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxlRGV2aWNlOiBkZXZpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VJRDogZGV2aWNlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlTmFtZTogZGV2aWNlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3M6cmVzLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb246cmVzLmluZm9tYXRpb25cblxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgdGhpcy5fYmxlR2F0Y29ubmVjdChnYXR0X29iailcbiAgICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJfYmxlR2F0Y29ubmVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlSUQ6IGdhdHRfb2JqLmRldmljZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlTmFtZTogZ2F0dF9vYmouZGV2aWNlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJsZURldmljZTogZ2F0dF9vYmouZGV2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3M6cmVzLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvbjpyZXMuaW5mb21hdGlvblxuXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vR0FUVOaOpee2mueUqFxuICAgIF9ibGVHYXRjb25uZWN0KGdhdHRfb2JqKXtcbiAgICAgICAgICAgIGxldCBjaGFyYWN0ZXJpc3RpY3MgPSB7fTtcbiAgICAgICAgICAgIGxldCBpbmZvbWF0aW9uPXt9O1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChncmVzb2x2ZSwgZ3JlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgZ2F0dF9vYmouY29ubmVjdCgpLnRoZW4oc2VydmVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZXModGhpcy5fTU9UT1JfQkxFX1NFUlZJQ0VfVVVJRCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwcnMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5fTU9UT1JfQkxFX1NFUlZJQ0VfVVVJRCkudGhlbihzZXJ2aWNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY3JzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fTU9UT1JfQkxFX0NSUykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNycy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLl9NT1RPUl9CTEVfQ1JTW2tleV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3Nba2V5XSA9IGNoYXJhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGNycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYmxlX2Zpcm13YXJlX3JldmlzaW9u44Gu44K144O844OT44K55Y+W5b6XXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuU2VydmljZSkudGhlbigoc2VydmljZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpZnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5NYW51ZmFjdHVyZXJOYW1lU3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGFyYS5yZWFkVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb25bJ21hbnVmYWN0dXJlck5hbWUnXSA9IEtNVXRsLlV0ZjhBcnJheVRvU3RyKG5ldyBVaW50OEFycmF5KHZhbC5idWZmZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLkZpcm13YXJlUmV2aXNpb25TdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjaGFyYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoYXJhLnJlYWRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbih2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvblsnZmlybXdhcmVSZXZpc2lvbiddID0gS01VdGwuVXRmOEFycmF5VG9TdHIobmV3IFVpbnQ4QXJyYXkodmFsLmJ1ZmZlcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWZzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuSGFyZHdhcmVSZXZpc2lvblN0cmluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNoYXJhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hhcmEucmVhZFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uWydoYXJkd2FyZVJldmlzaW9uJ10gPSBLTVV0bC5VdGY4QXJyYXlUb1N0cihuZXcgVWludDhBcnJheSh2YWwuYnVmZmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoaWZzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcnMpO1xuICAgICAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBncmVzb2x2ZSh7Y2hhcmFjdGVyaXN0aWNzOiBjaGFyYWN0ZXJpc3RpY3MsIGluZm9tYXRpb246IGluZm9tYXRpb259KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBCTEXjgrPjg57jg7Pjg4njga7pgIHkv6FcbiAgICAgKiBAcGFyYW0gY29tbWFuZFR5cGVTdHIgICdNT1RPUl9DT05UUk9MJywnTU9UT1JfTUVBU1VSRU1FTlQnLCdNT1RPUl9JTVVfTUVBU1VSRU1FTlQnLCdNT1RPUl9TRVRUSU5HJ1xuICAgICAqIOOCs+ODnuODs+ODieeoruWIpeOBrlN0cmluZyDkuLvjgatCTEXjga7jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrnjgafkvb/nlKjjgZnjgotcbiAgICAgKiBAcGFyYW0gY29tbWFuZE51bVxuICAgICAqIEBwYXJhbSBhcnJheWJ1ZmZlclxuICAgICAqIEBwYXJhbSBub3RpZnlQcm9taXMgY21kUmVhZFJlZ2lzdGVy562J44GuQkxF5ZG844Gz5Ye644GX5b6M44Grbm90aWZ544Gn5Y+W5b6X44GZ44KL5YCk44KSUHJvbWlz44Gn5biw44GZ5b+F6KaB44Gu44GC44KL44Kz44Oe44Oz44OJ55SoXG4gICAgICogQHByaXZhdGVcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKi9cbiAgICBfc2VuZE1vdG9yQ29tbWFuZChjb21tYW5kQ2F0ZWdvcnksIGNvbW1hbmROdW0sIGFycmF5YnVmZmVyPW5ldyBBcnJheUJ1ZmZlcigwKSwgbm90aWZ5UHJvbWlzPW51bGwpe1xuICAgICAgICBsZXQgY2hhcmFjdGVyaXN0aWNzPXRoaXMuX2NoYXJhY3RlcmlzdGljc1tjb21tYW5kQ2F0ZWdvcnldO1xuICAgICAgICBsZXQgYWI9bmV3IERhdGFWaWV3KGFycmF5YnVmZmVyKTtcbiAgICAgICAgLy/jgrPjg57jg7Pjg4njg7tJROODu0NSQ+OBruS7mOWKoFxuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGFycmF5YnVmZmVyLmJ5dGVMZW5ndGgrNSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsY29tbWFuZE51bSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigxLHRoaXMuY3JlYXRlQ29tbWFuZElEKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KGFycmF5YnVmZmVyLmJ5dGVMZW5ndGgrMywwKTtcbiAgICAgICAgLy/jg4fjg7zjgr/jga7mm7jjgY3ovrzjgb9cbiAgICAgICAgZm9yKGxldCBpPTA7aTxhcnJheWJ1ZmZlci5ieXRlTGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgzK2ksYWIuZ2V0VWludDgoaSkpO1xuICAgICAgICB9XG4gICAgICAgIC8vcXVl44Gr6L+95YqgXG4gICAgICAgLy8gKyt0aGlzLl9xdWVDb3VudDtcbiAgICAgICAgdGhpcy5fYmxlU2VuZGluZ1F1ZT0gdGhpcy5fYmxlU2VuZGluZ1F1ZS50aGVuKChyZXMpPT57XG4gICAgICAgICAgLy8gIGNvbnNvbGUubG9nKFwiX3NlbmRNb3RvckNvbW1hbmQgcXVlQ291bnQ6XCIrKC0tdGhpcy5fcXVlQ291bnQpKTtcbiAgICAgICAgICAgIGlmKG5vdGlmeVByb21pcyl7XG4gICAgICAgICAgICAgICAgbm90aWZ5UHJvbWlzLnN0YXJ0UmVqZWN0VGltZU91dENvdW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2hhcmFjdGVyaXN0aWNzLndyaXRlVmFsdWUoYnVmZmVyKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIC8v5aSx5pWX5pmC44CALy9pbmZvOjrlvozntprjga7jgrPjg57jg7Pjg4njga/lvJXjgY3ntprjgY3lrp/ooYzjgZXjgozjgotcbiAgICAgICAgICAvLyAgY29uc29sZS5sb2coXCJFUlIgX3NlbmRNb3RvckNvbW1hbmQ6XCIrcmVzK1wiIHF1ZUNvdW50OlwiKygtLXRoaXMuX3F1ZUNvdW50KSk7XG4gICAgICAgICAgICBpZihub3RpZnlQcm9taXMpe1xuICAgICAgICAgICAgICAgIG5vdGlmeVByb21pcy5jYWxsUmVqZWN0KHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4vLy8vLy9jbGFzcy8vXG59XG5cbm1vZHVsZS5leHBvcnRzID1LTUNvbVdlYkJMRTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9LTUNvbVdlYkJMRS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG4vKioqXG4gKktNQ29ubmVjdG9yQnJvd3Nlci5qc1xuICogdmVyc2lvbiAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuZ2xvYmFsLktNVXRsPXJlcXVpcmUoJy4vS01VdGwuanMnKTtcbmdsb2JhbC5LTVZlY3RvcjI9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTVZlY3RvcjI7XG5nbG9iYWwuS01WZWN0b3IzPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01WZWN0b3IzO1xuZ2xvYmFsLktNSW11U3RhdGU9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTUltdVN0YXRlO1xuZ2xvYmFsLktNTGVkU3RhdGU9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTUxlZFN0YXRlO1xuZ2xvYmFsLktNUm90U3RhdGU9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTVJvdFN0YXRlO1xuZ2xvYmFsLktNRGV2aWNlSW5mbz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNRGV2aWNlSW5mbztcbmdsb2JhbC5LTU1vdG9yT25lV2ViQkxFPXJlcXVpcmUoJy4vS01Nb3Rvck9uZVdlYkJMRS5qcycpO1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL0tNQ29ubmVjdG9yQnJvd3Nlci5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqKlxuICpLTU1vdG9yT25lV2ViQkxFLmpzXG4gKiB2YXIgMC4xLjAgYWxwaGFcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcblxubGV0IEtNQ29tV2ViQkxFID0gcmVxdWlyZSgnLi9LTUNvbVdlYkJMRScpO1xubGV0IEtNTW90b3JDb21tYW5kS01PbmU9cmVxdWlyZSgnLi9LTU1vdG9yQ29tbWFuZEtNT25lLmpzJyk7XG5cbmNsYXNzIEtNTW90b3JPbmVXZWJCTEUgZXh0ZW5kcyBLTU1vdG9yQ29tbWFuZEtNT25le1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIGFyZ1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHN1cGVyKEtNTW90b3JDb21tYW5kS01PbmUuS01fQ09OTkVDVF9UWVBFLldFQkJMRSxuZXcgS01Db21XZWJCTEUoKSk7XG4gICAgfVxuXG4gICAgY29ubmVjdCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5jb25uZWN0KCk7XG4gICAgfVxuICAgIGRpc0Nvbm5lY3QoKXtcbiAgICAgICAgdGhpcy5fS01Db20uZGlzQ29ubmVjdCgpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPUtNTW90b3JPbmVXZWJCTEU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvS01Nb3Rvck9uZVdlYkJMRS5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKioqXG4gKiBLTUNvbUJhc2UuanNcbiAqIHZlcnNpb24gMC4xLjAgYWxwaGFcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmxldCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcbmxldCBLTVN0cnVjdHVyZXM9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMnKTtcblxuY2xhc3MgS01Db21CYXNle1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5a6a5pWwXG4gICAgKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvcuOAgFxuICAgICAqIEBwYXJhbSBhcmdcbiAgICAgKlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGFyZyl7XG4gICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9bnVsbDtcbiAgICAgICAgdGhpcy5fY29tbWFuZENvdW50PTY1NTMwO1xuICAgICAgICB0aGlzLl9kZXZpY2VJbmZvPW5ldyBLTVN0cnVjdHVyZXMuS01EZXZpY2VJbmZvKCk7XG5cbiAgICAgICAgdGhpcy5fbW90b3JNZWFzdXJlbWVudD1uZXcgS01TdHJ1Y3R1cmVzLktNUm90U3RhdGUoKTtcbiAgICAgICAgdGhpcy5fbW90b3JMZWQ9bmV3IEtNU3RydWN0dXJlcy5LTUxlZFN0YXRlKCk7XG4gICAgICAgIHRoaXMuX21vdG9ySW11TWVhc3VyZW1lbnQ9bmV3IEtNU3RydWN0dXJlcy5LTUltdVN0YXRlKCk7XG4gICAgICAgIC8vXG4gICAgICAgIHRoaXMuX29uSW5pdEhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yKXt9O1xuICAgICAgICB0aGlzLl9vbkNvbm5lY3RIYW5kbGVyPWZ1bmN0aW9uKGNvbm5lY3Rvcil7fTtcbiAgICAgICAgdGhpcy5fb25EaXNjb25uZWN0SGFuZGxlcj1mdW5jdGlvbihjb25uZWN0b3Ipe307XG4gICAgICAgIHRoaXMuX29uQ29ubmVjdEZhaWx1cmVIYW5kbGVyPWZ1bmN0aW9uKGNvbm5lY3RvciwgbXNnKXt9O1xuXG4gICAgICAgIHRoaXMuX29uTW90b3JNZWFzdXJlbWVudENCPWZ1bmN0aW9uKCl7fTtcbiAgICAgICAgdGhpcy5fb25JbXVNZWFzdXJlbWVudENCPWZ1bmN0aW9uKCl7fTtcbiAgICAgICAgdGhpcy5fb25Nb3RvclNldHRpbmdDQj1mdW5jdGlvbigpe307XG5cbiAgICAgICAgdGhpcy5faXNJbml0PWZhbHNlO1xuICAgICAgICBcbiAgICAgICAgLy9fb25CbGVNb3RvclNldHRpbmfjga7jgrPjg57jg7Pjg4njgIDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHjga7pgJrnn6Xlj5fkv6HmmYLjgavjg5Hjg7zjgrnjgZnjgovnlKhcbiAgICAgICAgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORD17XG4gICAgICAgICAgICAgICAgXCJtYXhTcGVlZFwiOjB4MDIsXG4gICAgICAgICAgICAgICAgXCJtaW5TcGVlZFwiOjB4MDMsXG4gICAgICAgICAgICAgICAgXCJjdXJ2ZVR5cGVcIjoweDA1LFxuICAgICAgICAgICAgICAgIFwiYWNjXCI6MHgwNyxcbiAgICAgICAgICAgICAgICBcImRlY1wiOjB4MDgsXG4gICAgICAgICAgICAgICAgXCJtYXhUb3JxdWVcIjoweDBFLFxuICAgICAgICAgICAgICAgIFwicUN1cnJlbnRQXCI6MHgxOCxcbiAgICAgICAgICAgICAgICBcInFDdXJyZW50SVwiOjB4MTksXG4gICAgICAgICAgICAgICAgXCJxQ3VycmVudERcIjoweDFBLFxuICAgICAgICAgICAgICAgIFwic3BlZWRQXCI6MHgxQixcbiAgICAgICAgICAgICAgICBcInNwZWVkSVwiOjB4MUMsXG4gICAgICAgICAgICAgICAgXCJzcGVlZERcIjoweDFELFxuICAgICAgICAgICAgICAgIFwicG9zaXRpb25QXCI6MHgxRSxcbiAgICAgICAgICAgICAgICBcIm93bkNvbG9yXCI6MHgzQVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDjg5fjg63jg5Hjg4bjgqNcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDjg4fjg5DjgqTjgrnmg4XloLFcbiAgICAgKiBAcmV0dXJucyB7e25hbWU6IHN0cmluZywgaWQ6IHN0cmluZywgaW5mbzogbnVsbH19XG4gICAgICpcbiAgICAgKi9cbiAgICBnZXQgZGV2aWNlSW5mbygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZGV2aWNlSW5mby5DbG9uZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOacieWKueeEoeWKuVxuICAgICAqIEByZXR1cm5zIHsqfGJvb2xlYW59XG4gICAgICovXG4gICAgZ2V0IGlzQ29ubmVjdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Kz44Oe44Oz44OJ6aCG55uj6KaW55So6YCj55Wq44Gu55m66KGMXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQgY3JlYXRlQ29tbWFuZElEKCl7XG4gICAgICAgIHRoaXMuX2NvbW1hbmRDb3VudD0oKyt0aGlzLl9jb21tYW5kQ291bnQpJjBiMTExMTExMTExMTExMTExMTsvLzY1NTM144Gn44Or44O844OXXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaXNDb25uZWN044Gu6Kit5a6a5aSJ5pu0KOWtkOOCr+ODqeOCueOBi+OCieS9v+eUqClcbiAgICAgKiBAcGFyYW0gYm9vbFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3N0YXR1c0NoYW5nZV9pc0Nvbm5lY3QoYm9vbCl7XG4gICAgICAgIHRoaXMuX2RldmljZUluZm8uaXNDb25uZWN0PWJvb2w7XG4gICAgICAgIGlmKHRoaXMuX2lzSW5pdCl7XG4gICAgICAgICAgICBpZihib29sKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RIYW5kbGVyKHRoaXMpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25EaXNjb25uZWN0SGFuZGxlcih0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWIneacn+WMlueKtuaFi+OBruioreWumijlrZDjgq/jg6njgrnjgYvjgonkvb/nlKgpXG4gICAgICogQHBhcmFtIGJvb2xcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zdGF0dXNDaGFuZ2VfaW5pdChib29sKXtcbiAgICAgICAgdGhpcy5faXNJbml0PWJvb2w7XG4gICAgICAgIGlmKHRoaXMuX2lzSW5pdCl7XG4gICAgICAgICAgICB0aGlzLl9vbkluaXRIYW5kbGVyKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogY2FsbGJhY2tcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDliJ3mnJ/ljJblrozkuobjgZfjgabliKnnlKjjgafjgY3jgovjgojjgYbjgavjgarjgaPjgZ9cbiAgICAgKiBAcGFyYW0gaGFuZGxlckZ1bmN0aW9uXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgc2V0IG9uSW5pdChoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkluaXRIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDlv5znrZTjg7vlho3mjqXntprjgavmiJDlip/jgZfjgZ9cbiAgICAgKiBAcGFyYW0gaGFuZGxlckZ1bmN0aW9uXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgc2V0IG9uQ29ubmVjdChoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDlv5znrZTjgYznhKHjgY/jgarjgaPjgZ/jg7vliIfmlq3jgZXjgozjgZ9cbiAgICAgKiBAcGFyYW0gaGFuZGxlckZ1bmN0aW9uXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgc2V0IG9uRGlzY29ubmVjdChoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDmjqXntprjgavlpLHmlZdcbiAgICAgKiBAcGFyYW0gaGFuZGxlckZ1bmN0aW9uXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgc2V0IG9uQ29ubmVjdEZhaWx1cmUoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Db25uZWN0RmFpbHVyZUhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Gu5Zue6Lui5oOF5aCxY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0gZnVuYyAoe3Bvc2l0aW9uLHZlbG9jaXR5LHRvcnF1ZX0pXG4gICAgICovXG4gICAgc2V0IG9uTW90b3JNZWFzdXJlbWVudChmdW5jKXtcbiAgICAgICAgaWYodHlwZW9mIGZ1bmM9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Nb3Rvck1lYXN1cmVtZW50Q0I9ZnVuYztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga7jgrjjg6PjgqTjg63mg4XloLFjYWxsYmFja1xuICAgICAqIEBwYXJhbSBmdW5jICh7YWNjZWxYLGFjY2VsWSxhY2NlbFosdGVtcCxneXJvWCxneXJvWSxneXJvWn0pXG4gICAgICovXG4gICAgc2V0IG9uSW11TWVhc3VyZW1lbnQoZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uSW11TWVhc3VyZW1lbnRDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O86Kit5a6a5oOF5aCx5Y+W5b6XY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0gZnVuYyAocmVnaXN0ZXJDbWQscmVzKVxuICAgICAqL1xuICAgIHNldCBvbk1vdG9yU2V0dGluZyhmdW5jKXtcbiAgICAgICAgaWYodHlwZW9mIGZ1bmM9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Nb3RvclNldHRpbmdDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuXG4vLy8vLy9jbGFzcy8vXG59XG5cbm1vZHVsZS5leHBvcnRzID1LTUNvbUJhc2U7XG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvS01Db21CYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKipcbiAqIEtNTW90b3JDb21tYW5kS01PbmUuanNcbiAqIHZlcnNpb24gMC4xLjAgYWxwaGFcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmxldCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKFwiZXZlbnRzXCIpLkV2ZW50RW1pdHRlcjtcbmxldCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcbmxldCBLTUNvbVdlYkJMRSA9IHJlcXVpcmUoJy4vS01Db21XZWJCTEUnKTtcbmxldCBLTVN0cnVjdHVyZXM9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMnKTtcblxuY2xhc3MgS01Nb3RvckNvbW1hbmRLTU9uZSBleHRlbmRzIEV2ZW50RW1pdHRlcntcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlrprmlbBcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICog5o6l57aa5pa55byPXG4gICAgICogQHJldHVybnMge3tcIlVOU0VUVExFRFwiOjAsXCJCTEVcIjoxLFwiU0VSSUFMXCI6Mn19XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgc3RhdGljIGdldCBLTV9DT05ORUNUX1RZUEUoKXtcbiAgICAgICAgcmV0dXJuIHtcIldFQkJMRVwiOjEsXCJCTEVcIjoyLFwiU0VSSUFMXCI6M307XG4gICAgfVxuXG4gICAgc3RhdGljIGdldCBjbWRQcmVwYXJlUGxheWJhY2tNb3Rpb25fU1RBUlRfUE9TSVRJT04oKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ1NUQVJUX1BPU0lUSU9OX0FCUyc6MCwvL+iomOaGtuOBleOCjOOBn+mWi+Wni+S9jee9ru+8iOe1tuWvvuW6p+aome+8ieOBi+OCieOCueOCv+ODvOODiFxuICAgICAgICAgICAgJ1NUQVJUX1BPU0lUSU9OX0NVUlJFTlQnOjEvL+ePvuWcqOOBruS9jee9ruOCkumWi+Wni+S9jee9ruOBqOOBl+OBpuOCueOCv+ODvOODiFxuICAgICAgICB9O1xuICAgIH1cbiAgICBzdGF0aWMgZ2V0IGNtZExlZF9MRURfU1RBVEUoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ0xFRF9TVEFURV9PRkYnOjAsXHQvLyBMRUTmtojnga9cbiAgICAgICAgICAgICdMRURfU1RBVEVfT05fU09MSUQnOjEsXHQvLyBMRUTngrnnga/vvIjngrnnga/jgZfjgaPjgbHjgarjgZfvvIlcbiAgICAgICAgICAgICdMRURfU1RBVEVfT05fRkxBU0gnOjIsXHQvLyBMRUTngrnmu4XvvIjkuIDlrprplpPpmpTjgafngrnmu4XvvIlcbiAgICAgICAgICAgICdMRURfU1RBVEVfT05fRElNJzozXHQvLyBMRUTjgYzjgobjgaPjgY/jgormmI7mu4XjgZnjgotcbiAgICAgICAgfTtcbiAgICB9XG4gICAgc3RhdGljIGdldCBjbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRSgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnQ1VSVkVfVFlQRV9OT05FJzogMCxcdC8vIOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPRkZcbiAgICAgICAgICAgICdDVVJWRV9UWVBFX1RSQVBFWk9JRCc6MVx0Ly8g44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9OIO+8iOWPsOW9ouWKoOa4m+mAn++8iVxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKlxuICAgICogUmVhZFJlZ2lzdGVy44Gn5Y+W5b6X44GZ44KL5pmC55So44Gu44Kz44Oe44Oz44OJ5byV5pWwXG4gICAgKiAqL1xuICAgIHN0YXRpYyBnZXQgY21kUmVhZFJlZ2lzdGVyX0NPTU1BTkQoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgXCJtYXhTcGVlZFwiOjB4MDIsXG4gICAgICAgICAgICBcIm1pblNwZWVkXCI6MHgwMyxcbiAgICAgICAgICAgIFwiY3VydmVUeXBlXCI6MHgwNSxcbiAgICAgICAgICAgIFwiYWNjXCI6MHgwNyxcbiAgICAgICAgICAgIFwiZGVjXCI6MHgwOCxcbiAgICAgICAgICAgIFwibWF4VG9ycXVlXCI6MHgwRSxcbiAgICAgICAgICAgIFwicUN1cnJlbnRQXCI6MHgxOCxcbiAgICAgICAgICAgIFwicUN1cnJlbnRJXCI6MHgxOSxcbiAgICAgICAgICAgIFwicUN1cnJlbnREXCI6MHgxQSxcbiAgICAgICAgICAgIFwic3BlZWRQXCI6MHgxQixcbiAgICAgICAgICAgIFwic3BlZWRJXCI6MHgxQyxcbiAgICAgICAgICAgIFwic3BlZWREXCI6MHgxRCxcbiAgICAgICAgICAgIFwicG9zaXRpb25QXCI6MHgxRSxcbiAgICAgICAgICAgIFwib3duQ29sb3JcIjoweDNBXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3LjgIBcbiAgICAgKiAgQHBhcmFtIGNvbm5lY3RfdHlwZSDmjqXntprmlrnlvI8gS01Nb3RvckNvbW1hbmRLTU9uZS5LTV9DT05ORUNUX1RZUEVcbiAgICAgKiBAcGFyYW0ga21jb21cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihjb25uZWN0X3R5cGUsa21jb20pe1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICAvL+OCpOODmeODs+ODiOODj+ODs+ODieODqeOCv+OCpOODl1xuICAgICAgICB0aGlzLkVWRU5UX1RZUEU9e1wiaW5pdFwiOlwiaW5pdFwiLFwiY29ubmVjdFwiOlwiY29ubmVjdFwiLFwiZGlzY29ubmVjdFwiOlwiZGlzY29ubmVjdFwiLFwiY29ubmVjdEZhaWx1cmVcIjpcImNvbm5lY3RGYWlsdXJlXCIsXCJtb3Rvck1lYXN1cmVtZW50XCI6XCJtb3Rvck1lYXN1cmVtZW50XCIsXCJpbXVNZWFzdXJlbWVudFwiOlwiaW11TWVhc3VyZW1lbnRcIn07XG4gICAgICAgIC8v44Oi44O844K/44O844Gu5YWo44Kz44Oe44Oz44OJXG4gICAgICAgIHRoaXMuX01PVE9SX0NPTU1BTkQ9e1xuICAgICAgICAgICAgXCJtYXhTcGVlZFwiOjB4MDIsLy/mnIDlpKfpgJ/jgZXjgpLoqK3lrprjgZnjgotcbiAgICAgICAgICAgIFwibWluU3BlZWRcIjoweDAzLC8v5pyA5bCP6YCf44GV44KS6Kit5a6a44GZ44KLXG4gICAgICAgICAgICBcImN1cnZlVHlwZVwiOjB4MDUsLy/liqDmuJvpgJ/mm7Lnt5rjgpLoqK3lrprjgZnjgotcbiAgICAgICAgICAgIFwiYWNjXCI6MHgwNywvL+WKoOmAn+W6puOCkuioreWumuOBmeOCi1xuICAgICAgICAgICAgXCJkZWNcIjoweDA4LC8v5rib6YCf5bqm44KS6Kit5a6a44GZ44KLXG4gICAgICAgICAgICBcIm1heFRvcnF1ZVwiOjB4MEUsLy/mnIDlpKfjg4jjg6vjgq/jgpLoqK3lrprjgZnjgotcbiAgICAgICAgICAgIFwicUN1cnJlbnRQXCI6MHgxOCwvL3Hou7jpm7vmtYFQSUTjgrLjgqTjg7MoUCnjgpLoqK3lrprjgZnjgotcbiAgICAgICAgICAgIFwicUN1cnJlbnRJXCI6MHgxOSwvL3Hou7jpm7vmtYFQSUTjgrLjgqTjg7MoSSnjgpLoqK3lrprjgZnjgotcbiAgICAgICAgICAgIFwicUN1cnJlbnREXCI6MHgxQSwvL3Hou7jpm7vmtYFQSUTjgrLjgqTjg7MoRCnjgpLoqK3lrprjgZnjgotcbiAgICAgICAgICAgIFwic3BlZWRQXCI6MHgxQiwvL+mAn+W6plBJROOCsuOCpOODsyhQKeOCkuioreWumuOBmeOCi1xuICAgICAgICAgICAgXCJzcGVlZElcIjoweDFDLC8v6YCf5bqmUElE44Ky44Kk44OzKEkp44KS6Kit5a6a44GZ44KLXG4gICAgICAgICAgICBcInNwZWVkRFwiOjB4MUQsLy/pgJ/luqZQSUTjgrLjgqTjg7MoRCnjgpLoqK3lrprjgZnjgotcbiAgICAgICAgICAgIFwicG9zaXRpb25QXCI6MHgxRSwvL+S9jee9rlBJROOCsuOCpOODsyhQKeOCkuioreWumuOBmeOCi1xuICAgICAgICAgICAgXCJyZXNldFBJRFwiOjB4MjIsLy9QSUTjgrLjgqTjg7PjgpLjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICAgICAgICAgIFwib3duQ29sb3JcIjoweDNBLC8v44OH44OQ44Kk44K5TEVE44Gu5Zu65pyJ6Imy44KS6Kit5a6a44GZ44KLXG4gICAgICAgICAgICBcInJlYWRSZWdpc3RlclwiOjB4NDAsLy/mjIflrprjga7oqK3lrprlgKTjgpLlj5blvpfjgZnjgotcbiAgICAgICAgICAgIFwic2F2ZUFsbFJlZ2lzdGVyc1wiOjB4NDEsLy/lhajjgabjga7oqK3lrprlgKTjgpLjg5Xjg6njg4Pjgrfjg6Xjgavkv53lrZjjgZnjgotcbiAgICAgICAgICAgIFwicmVzZXRSZWdpc3RlclwiOjB4NEUsLy/mjIflrprjga7oqK3lrprlgKTjgpLjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICAgICAgICAgIFwicmVzZXRBbGxSZWdpc3RlcnNcIjoweDRGLC8v5YWo6Kit5a6a5YCk44KS44Oq44K744OD44OI44GZ44KLXG4gICAgICAgICAgICBcImRpc2FibGVcIjoweDUwLC8v44Oi44O844K/44O844Gu5YuV5L2c44KS5LiN6Kix5Y+v44Go44GZ44KLXG4gICAgICAgICAgICBcImVuYWJsZVwiOjB4NTEsLy/jg6Ljg7zjgr/jg7zli5XkvZzjgpLoqLHlj6/jgZnjgotcbiAgICAgICAgICAgIFwic3BlZWRcIjoweDU4LC8v6YCf5bqm44Gu5aSn44GN44GV44KS6Kit5a6a44GZ44KLXG4gICAgICAgICAgICBcInByZXNldFBvc2l0aW9uXCI6MHg1QSwvL+S9jee9ruOBruODl+ODquOCu+ODg+ODiOOCkuihjOOBhu+8iOWOn+eCueioreWumu+8iVxuICAgICAgICAgICAgXCJydW5Gb3J3YXJkXCI6MHg2MCwvL+ato+Wbnui7ouOBmeOCi++8iOWPjeaZguioiOWbnuOCiu+8iVxuICAgICAgICAgICAgXCJydW5SZXZlcnNlXCI6MHg2MSwvL+mAhuWbnui7ouOBmeOCi++8iOaZguioiOWbnuOCiu+8iVxuICAgICAgICAgICAgXCJtb3ZlVG9Qb3NpdGlvblwiOjB4NjYsLy/ntbblr77kvY3nva7jgavnp7vli5XjgZnjgotcbiAgICAgICAgICAgIFwibW92ZUJ5RGlzdGFuY2VcIjoweDY4LC8v55u45a++5L2N572u44Gr56e75YuV44GZ44KLXG4gICAgICAgICAgICBcImZyZWVcIjoweDZDLC8v44Oi44O844K/44O844Gu5Yqx56OB44KS5YGc5q2i44GZ44KLXG4gICAgICAgICAgICBcInN0b3BcIjoweDZELC8v6YCf5bqm44K844Ot44G+44Gn5rib6YCf44GX5YGc5q2i44GZ44KLXG4gICAgICAgICAgICBcImhvbGRUb3JxdWVcIjoweDcyLC8v44OI44Or44Kv5Yi25b6h44KS6KGM44GGXG4gICAgICAgICAgICBcImRvVGFza3NldFwiOjB4ODEsLy/jgr/jgrnjgq/jgrvjg4Pjg4jjgpLlrp/ooYzjgZnjgotcbiAgICAgICAgICAgIFwicHJlcGFyZVBsYXliYWNrTW90aW9uXCI6MHg4NiwvL+ODouODvOOCt+ODp+ODs+WGjeeUn+OBrumWi+Wni+WcsOeCueOBq+enu+WLleOBmeOCi1xuICAgICAgICAgICAgXCJzdGFydFBsYXliYWNrXCI6MHg4NywvL+ODouODvOOCt+ODp+ODs+OCkuWGjeeUn+OBmeOCi1xuICAgICAgICAgICAgXCJzdG9wUGxheWJhY2tcIjoweDg4LC8v44Oi44O844K344On44Oz5YaN55Sf44KS5YGc5q2i44GZ44KLXG4gICAgICAgICAgICBcInBhdXNlXCI6MHg5MCwvL+OCreODpeODvOOCkuWBnOatouOBmeOCi1xuICAgICAgICAgICAgXCJyZXN1bWVcIjoweDkxLC8v44Kt44Ol44O844KS5YaN6ZaL44GZ44KLXG4gICAgICAgICAgICBcIndhaXRcIjoweDkyLC8v44Kt44Ol44O844KS5oyH5a6a5pmC6ZaT5YGc5q2i44GX5YaN6ZaL44GZ44KLXG4gICAgICAgICAgICBcInJlc2V0XCI6MHg5NSwvL+OCreODpeODvOOCkuODquOCu+ODg+ODiOOBmeOCi1xuICAgICAgICAgICAgXCJzdGFydFJlY29yZGluZ1Rhc2tzZXRcIjoweEEwLC8v44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44KS6ZaL5aeL44GZ44KLXG4gICAgICAgICAgICBcInN0b3BSZWNvcmRpbmdUYXNrc2V0XCI6MHhBMiwvL+OCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuOCkuWBnOatouOBmeOCi1xuICAgICAgICAgICAgXCJlcmFzZVRhc2tzZXRcIjoweEEzLC8v5oyH5a6a44Gu44K/44K544Kv44K744OD44OI44KS5YmK6Zmk44GZ44KLXG4gICAgICAgICAgICBcImVyYXNlQWxsVGFza3NldHNcIjoweEE0LC8v44K/44K544Kv44K744OD44OI44KS5YWo5YmK6Zmk44GZ44KLXG4gICAgICAgICAgICBcInByZXBhcmVUZWFjaGluZ01vdGlvblwiOjB4QUEsLy/jg4bjgqPjg7zjg4Hjg7PjgrDjga7plovlp4vmupblgpnjgpLooYzjgYZcbiAgICAgICAgICAgIFwic3RhcnRUZWFjaGluZ01vdGlvblwiOjB4QUIsLy/jg4bjgqPjg7zjg4Hjg7PjgrDjgpLplovlp4vjgZnjgotcbiAgICAgICAgICAgIFwic3RvcFRlYWNoaW5nTW90aW9uXCI6MHhBQywvL+ODhuOCo+ODvOODgeODs+OCsOOCkuWBnOatouOBmeOCi1xuICAgICAgICAgICAgXCJlcmFzZU1vdGlvblwiOjB4QUQsLy/jg4bjgqPjg7zjg4Hjg7PjgrDjgafopprjgYjjgZ/li5XkvZzjgpLliYrpmaTjgZnjgotcbiAgICAgICAgICAgIFwiZXJhc2VBbGxNb3Rpb25cIjoweEFFLC8v44OG44Kj44O844OB44Oz44Kw44Gn6Kaa44GI44Gf5YWo5YuV5L2c44KS5YmK6Zmk44GZ44KLXG4gICAgICAgICAgICBcImxlZFwiOjB4RTAsLy9MRUTjga7ngrnnga/nirbmhYvjgpLjgrvjg4Pjg4jjgZnjgotcbiAgICAgICAgICAgIFwiZW5hYmxlSU1VXCI6MHhFQSwvL0lNVeOBruWApOWPluW+lyjpgJrnn6Up44KS6ZaL5aeL44GZ44KLXG4gICAgICAgICAgICBcImRpc2FibGVJTVVcIjoweEVCLC8vSU1V44Gu5YCk5Y+W5b6XKOmAmuefpSnjgpLlgZzmraLjgZnjgotcbiAgICAgICAgICAgIFwicmVib290XCI6MHhGMCwvL+OCt+OCueODhuODoOOCkuWGjei1t+WLleOBmeOCi1xuICAgICAgICAgICAgXCJlbnRlckRldmljZUZpcm13YXJlVXBkYXRlXCI6MHhGRC8v44OV44Kh44O844Og44Km44Kn44Ki44Ki44OD44OX44OH44O844OI44Oi44O844OJ44Gr5YWl44KLXG4gICAgICAgIH07XG4gICAgICAgIC8v44Oi44O844K/44O844Gu5YWo44Kz44Oe44Oz44OJ77yI6YCG5byV55So77yJXG4gICAgICAgIHRoaXMuX1JFVl9NT1RPUl9DT01NQU5EPXt9O1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9NT1RPUl9DT01NQU5EKS5mb3JFYWNoKChrKT0+e3RoaXMuX1JFVl9NT1RPUl9DT01NQU5EW3RoaXMuX01PVE9SX0NPTU1BTkRba11dPWs7fSk7XG4gICAgICAgIC8vU2VuZE5vdGlmeVByb21pc+OBruODquOCueODiFxuICAgICAgICB0aGlzLl9ub3RpZnlQcm9taXNMaXN0PVtdO1xuXG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gc2VjdGlvbjo6ZW50cnkgcG9pbnRcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICB0aGlzLl9jb25uZWN0VHlwZT1jb25uZWN0X3R5cGU7XG4gICAgICAgIHRoaXMuX0tNQ29tPWttY29tO1xuXG4gICAgICAgIC8v5YaF6YOo44Kk44OZ44Oz44OI44OQ44Kk44Oz44OJXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uSW5pdD0oY29ubmVjdG9yKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5pbml0LGNvbm5lY3Rvci5kZXZpY2VJbmZvKTsvL+ODh+ODkOOCpOOCueaDheWgseOCkui/lOOBmVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9LTUNvbS5vbkNvbm5lY3Q9KGNvbm5lY3Rvcik9PntcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUuY29ubmVjdCxjb25uZWN0b3IuZGV2aWNlSW5mbyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX0tNQ29tLm9uRGlzY29ubmVjdD0oY29ubmVjdG9yKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5kaXNjb25uZWN0LGNvbm5lY3Rvci5kZXZpY2VJbmZvKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fS01Db20ub25Db25uZWN0RmFpbHVyZT0oY29ubmVjdG9yLCBlcnIpPT57XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLmNvbm5lY3RGYWlsdXJlLGNvbm5lY3Rvci5kZXZpY2VJbmZvKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvOWbnui7ouaDheWgseWPl+S/oVxuICAgICAgICAgKiBAcGFyYW0gcmVzIHtwb3NpdGlvbjpkdi5nZXRGbG9hdDMyKDAsZmFsc2UpLHZlbG9jaXR5OmR2LmdldEZsb2F0MzIoNCxmYWxzZSksdG9ycXVlOmR2LmdldEZsb2F0MzIoOCxmYWxzZSl9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9LTUNvbS5vbk1vdG9yTWVhc3VyZW1lbnQ9KHJlcyk9PntcbiAgICAgICAgICAgIGxldCByb3RTdGF0ZT1uZXcgS01TdHJ1Y3R1cmVzLktNUm90U3RhdGUocmVzLnBvc2l0aW9uLHJlcy52ZWxvY2l0eSxyZXMudG9ycXVlKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUubW90b3JNZWFzdXJlbWVudCxyb3RTdGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7xJTVXmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIHJlcyB7YWNjZWxYLGFjY2VsWSxhY2NlbFosdGVtcCxneXJvWCxneXJvWSxneXJvWn1cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uSW11TWVhc3VyZW1lbnQ9KHJlcyk9PntcbiAgICAgICAgICAgIGxldCBpbXVTdGF0ZT1uZXcgS01TdHJ1Y3R1cmVzLktNSW11U3RhdGUocmVzLmFjY2VsWCxyZXMuYWNjZWxZLHJlcy5hY2NlbFoscmVzLnRlbXAscmVzLmd5cm9YLHJlcy5neXJvWSxyZXMuZ3lyb1opO1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5pbXVNZWFzdXJlbWVudCxpbXVTdGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIHJlZ2lzdGVyQ21kXG4gICAgICAgICAqIEBwYXJhbSByZXMge21heFNwZWVkLG1pblNwZWVk44O744O744O7b3duQ29sb3J9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9LTUNvbS5fb25Nb3RvclNldHRpbmdDQj0ocmVnaXN0ZXJDbWQsIHJlcyk9PntcbiAgICAgICAgICAgIF9LTU5vdGlmeVByb21pcy5zZW5kR3JvdXBOb3RpZnlSZXNvbHZlKHRoaXMuX25vdGlmeVByb21pc0xpc3QscmVnaXN0ZXJDbWQscmVzKTtcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog44OX44Ot44OR44OG44KjXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBrkJMReaOpee2muOBjOacieWKueOBi1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufVxuICAgICAqL1xuICAgIGdldCBpc0Nvbm5lY3QoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0tNQ29tLmRldmljZUluZm8uaXNDb25uZWN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDmjqXntprmlrnlvI9cbiAgICAgKiBAcmV0dXJucyB7S01Nb3RvckNvbW1hbmRLTU9uZS5LTV9DT05ORUNUX1RZUEV9XG4gICAgICovXG4gICAgZ2V0IGNvbm5lY3RUeXBlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb25uZWN0VHlwZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg4fjg5DjgqTjgrnmg4XloLFcbiAgICAgKiBAcmV0dXJucyB7e25hbWU6IHN0cmluZywgaWQ6IHN0cmluZywgaW5mbzogbnVsbH19XG4gICAgICpcbiAgICAgKiBpbmZvOjrjg6Hjg7zjgqvjg7zjgrXjg7zjg5Pjgrnjg4fjg7zjgr8oaW5mbynjga93ZWJCbHVldG9vaOOBp+OBr+Wun+ijheOBjOeEoeOBhOeCuuOAgeODleOCoeODvOODoHZlcnNpb27jga/lj5blvpflh7rmnaXjgarjgYQgMjAxNy8xMi8x5pmC54K5XG4gICAgICovXG4gICAgZ2V0IGRldmljZUluZm8oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0tNQ29tLmRldmljZUluZm87XG4gICAgfVxuICAgIGdldCBjb25uZWN0b3IoKXtcbiAgICAgICAgcmV0dXJuICB0aGlzLl9LTUNvbTtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBjYWxsYmFja1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDliJ3mnJ/ljJblrozkuobjgZfjgabliKnnlKjjgafjgY3jgovjgojjgYbjgavjgarjgaPjgZ9cbiAgICAgKiBAcGFyYW0gaGFuZGxlckZ1bmN0aW9uKEtNRGV2aWNlSW5mbylcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBzZXQgb25Jbml0KGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uSW5pdEhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOW/nOetlOODu+WGjeaOpee2muOBq+aIkOWKn+OBl+OBn1xuICAgICAqIEBwYXJhbSBoYW5kbGVyRnVuY3Rpb24oS01EZXZpY2VJbmZvKVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHNldCBvbkNvbm5lY3QoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Db25uZWN0SGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog5b+c562U44GM54Sh44GP44Gq44Gj44Gf44O75YiH5pat44GV44KM44GfXG4gICAgICogQHBhcmFtIGhhbmRsZXJGdW5jdGlvbihLTURldmljZUluZm8pXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgc2V0IG9uRGlzY29ubmVjdChoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDmjqXntprjgavlpLHmlZdcbiAgICAgKiBAcGFyYW0gaGFuZGxlckZ1bmN0aW9uKEtNRGV2aWNlSW5mbyxlcnIpXG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgc2V0IG9uQ29ubmVjdEZhaWx1cmUoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Db25uZWN0RmFpbHVyZUhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Gu5Zue6Lui5oOF5aCxY2FsbGJhY2tcbiAgICAgKiBAcGFyYW0gZnVuYyAoe3Bvc2l0aW9uLHZlbG9jaXR5LHRvcnF1ZX0pXG4gICAgICovXG4gICAgc2V0IG9uTW90b3JNZWFzdXJlbWVudChmdW5jKXtcbiAgICAgICAgaWYodHlwZW9mIGZ1bmM9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Nb3Rvck1lYXN1cmVtZW50Q0I9ZnVuYztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga7jgrjjg6PjgqTjg63mg4XloLFjYWxsYmFja1xuICAgICAqIEBwYXJhbSBmdW5jICh7YWNjZWxYLGFjY2VsWSxhY2NlbFosdGVtcCxneXJvWCxneXJvWSxneXJvWn0pXG4gICAgICovXG4gICAgc2V0IG9uSW11TWVhc3VyZW1lbnQoZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uSW11TWVhc3VyZW1lbnRDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWGhemDqOODpuODvOODhuOCo+ODquODhuOCo1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIHNlY3Rpb246OuODouODvOOCv+ODvOOCs+ODnuODs+ODiSBodHRwczovL2RvY3VtZW50LmtlaWdhbi1tb3Rvci5jb20vbW90b3ItY29udHJvbC1jb21tYW5kL21vdG9yX2FjdGlvbi5odG1sXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgXG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zli5XkvZzjgpLkuI3oqLHlj6/jgajjgZnjgovvvIjkuIrkvY3lkb3ku6TvvIlcbiAgICAgKiDlronlhajnlKjvvJrjgZPjga7lkb3ku6TjgpLlhaXjgozjgovjgajjg6Ljg7zjgr/jg7zjga/li5XkvZzjgZfjgarjgYRcbiAgICAgKiDjgrPjg57jg7Pjg4njga/jgr/jgrnjgq/jgrvjg4Pjg4jjgavoqJjpjLLjgZnjgovjgZPjgajjga/kuI3lj69cbiAgICAgKi9cbiAgICBjbWREaXNhYmxlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmRpc2FibGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOWLleS9nOOCkuioseWPr+OBmeOCi++8iOS4iuS9jeWRveS7pO+8iVxuICAgICAqIOWuieWFqOeUqO+8muOBk+OBruWRveS7pOOCkuWFpeOCjOOCi+OBqOODouODvOOCv+ODvOOBr+WLleS9nOWPr+iDveOBqOOBquOCi1xuICAgICAqIOODouODvOOCv+ODvOi1t+WLleaZguOBryBkaXNhYmxlIOeKtuaFi+OBruOBn+OCgeOAgeacrOOCs+ODnuODs+ODieOBp+WLleS9nOOCkuioseWPr+OBmeOCi+W/heimgeOBjOOBguOCilxuICAgICAqIOOCs+ODnuODs+ODieOBr+OCv+OCueOCr+OCu+ODg+ODiOOBq+iomOmMsuOBmeOCi+OBk+OBqOOBr+S4jeWPr1xuICAgICAqL1xuICAgIGNtZEVuYWJsZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lbmFibGUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDpgJ/luqbjga7lpKfjgY3jgZXjgpLjgrvjg4Pjg4jjgZnjgovvvIjljZjkvY3ns7vvvJpSUE3vvIlcbiAgICAgKiBAcGFyYW0gc3BlZWQ6RmxvYXQgIFswLVggcnBtXeOAgCjmraPjga7mlbApXG4gICAgICovXG4gICAgY21kU3BlZWRfcnBtKHNwZWVkX3JwbSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkX3JwbSowLjEwNDcxOTc1NTExOTY1OTc3LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZCxidWZmZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDpgJ/luqbjga7lpKfjgY3jgZXjgpLjgrvjg4Pjg4jjgZnjgovvvIjljZjkvY3ns7vvvJrjg6njgrjjgqLjg7PvvIlcbiAgICAgKiBAcGFyYW0gc3BlZWQ6RmxvYXQg6YCf5bqm44Gu5aSn44GN44GVIOWNmOS9je+8muinkuW6pu+8iOODqeOCuOOCouODs++8iS/np5IgWzAtWCBycHNd44CAKOato+OBruaVsClcbiAgICAgKi9cbiAgICBjbWRTcGVlZChzcGVlZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS9jee9ruOBruODl+ODquOCu+ODg+ODiOOCkuihjOOBhu+8iOWOn+eCueioreWumu+8ie+8iOWNmOS9jeezu++8muODqeOCuOOCouODs++8iVxuICAgICAqIEBwYXJhbSBwb3NpdGlvbjpGbG9hdCDntbblr77op5LluqbvvJpyYWRpYW5zXG4gICAgICovXG4gICAgY21kUHJlc2V0UG9zaXRpb24ocG9zaXRpb24pe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChLTVV0bC50b051bWJlcihwb3NpdGlvbiksMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQucHJlc2V0UG9zaXRpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKuato+Wbnui7ouOBmeOCi++8iOWPjeaZguioiOWbnuOCiu+8iVxuICAgICAqIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBp+OAgeato+Wbnui7olxuICAgICAqL1xuICAgIGNtZFJ1bkZvcndhcmQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQucnVuRm9yd2FyZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6YCG5Zue6Lui44GZ44KL77yI5pmC6KiI5Zue44KK77yJXG4gICAgICogY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44Gn44CB6YCG5Zue6LuiXG4gICAgICovXG4gICAgY21kUnVuUmV2ZXJzZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ydW5SZXZlcnNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDntbblr77kvY3nva7jgavnp7vli5XjgZnjgotcbiAgICAgKiDpgJ/jgZXjga8gY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44GM5o6h55So44GV44KM44KLXG4gICAgICogQHBhcmFtIHBvc2l0aW9uOkZsb2F0IOinkuW6pu+8mnJhZGlhbnNcbiAgICAgKi9cbiAgICBjbWRNb3ZlVG9Qb3NpdGlvbihwb3NpdGlvbil7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KHBvc2l0aW9uLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVUb1Bvc2l0aW9uLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog55u45a++5L2N572u44Gr56e75YuV44GZ44KLXG4gICAgICog6YCf44GV44GvIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBjOaOoeeUqOOBleOCjOOCi1xuICAgICAqIEBwYXJhbSBkaXN0YW5jZTpGbG9hdCDop5LluqbvvJpyYWRpYW5zW+W3pjorcmFkaWFucyDlj7M6LXJhZGlhbnNdXG4gICAgICovXG4gICAgY21kTW92ZUJ5RGlzdGFuY2UoZGlzdGFuY2Upe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChkaXN0YW5jZSwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlQnlEaXN0YW5jZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBruWKseejgeOCkuWBnOatouOBmeOCi++8iOaEn+inpuOBr+aui+OCiuOBvuOBme+8iVxuICAgICAqIOWujOWFqOODleODquODvOeKtuaFi+OCkuWGjeePvuOBmeOCi+WgtOWQiOOBr+OAgSBibGVGcmVlKCkuY21kRGlzYWJsZSgpIOOBqOOBl+OBpuS4i+OBleOBhOOAglxuICAgICAqL1xuICAgIGNtZEZyZWUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuZnJlZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844KS6YCf5bqm44K844Ot44G+44Gn5rib6YCf44GX5YGc5q2i44GZ44KLXG4gICAgICogcnBtID0gMCDjgajjgarjgovjgILigLvlrp/os6ogYmxlUnVuQXQoMCnjgajlkIzjgZhcbiAgICAgKi9cbiAgICBjbWRTdG9wKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3ApO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICog44OI44Or44Kv5Yi25b6h44KS6KGM44GGXG4gICAgICogQHBhcmFtIHRvcnF1ZTpGbG9hdCDjg4jjg6vjgq8g5Y2Y5L2N77yaTuODu20gWy1YIH4gKyBYIE5tXSDmjqjlpajlgKQgMC4zLTAuMDVcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBpbmZvOjrpgJ/luqbjgoTkvY3nva7jgpLlkIzmmYLjgavliLblvqHjgZnjgovloLTlkIjjga/jgIHjg6Ljg7zjgr/jg7zoqK3lrprjga4gMHgwRTogbWF4VG9ycXVlIOOBqCAweDYwOiBydW5Gb3J3YXJkIOetieOCkuS9teeUqOOBl+OBpuS4i+OBleOBhOOAglxuICAgICAqXG4gICAgICovXG4gICAgY21kSG9sZFRvcnF1ZSh0b3JxdWUpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdCh0b3JxdWUsMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuaG9sZFRvcnF1ZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIDB4ODEg6KiY5oa244GX44Gf44K/44K544Kv77yI5ZG95Luk77yJ44Gu44K744OD44OI44KS5a6f6KGM44GZ44KLXG4gICAgICogQHBhcmFtIGluZGV4OmludCDjgr/jgrnjgq/jgrvjg4Pjg4jnlarlj7fvvIgw772eNjU1MzXvvIlcbiAgICAgKiBAcGFyYW0gcmVwZWF0aW5nOmludCDnubDjgorov5TjgZflm57mlbAgMOOBr+eEoeWItumZkCB0b2RvOjrmnKrlrp/oo4VcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBpbmZvOjogS00tMSDjga8gaW5kZXg6IDB+NDkg44G+44Gn44CC77yINTDlgIvjga7jg6Hjg6Ljg6rjg5Djg7Pjgq8g5ZCEODEyOCBCeXRlIOOBvuOBp+WItumZkOOBguOCiu+8iVxuICAgICAqIOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuOBr+OAgeOCs+ODnuODs+ODie+8iOOCv+OCueOCr+OCu+ODg+ODiO+8ieOCkuWPgueFp+S4i+OBleOBhOOAgiBodHRwczovL2RvY3VtZW50LmtlaWdhbi1tb3Rvci5jb20vbW90b3ItY29udHJvbC1jb21tYW5kL3Rhc2tzZXQuaHRtbFxuICAgICAqL1xuICAgIGNtZERvVGFza3NldChpbmRleCxyZXBlYXRpbmcpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDYpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDIsTWF0aC5hYnMocGFyc2VJbnQocmVwZWF0aW5nLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5kb1Rhc2tzZXQsYnVmZmVyKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogMHg4NiDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/jga7plovlp4vlnLDngrnjgavnp7vli5XjgZnjgotcbiAgICAgKiBAcGFyYW0gaW5kZXg6aW50IOODouODvOOCt+ODp+ODs+eVquWPt++8iDDvvZ42NTUzNe+8iVxuICAgICAqIEBwYXJhbSByZXBlYXRpbmc6aW50IOe5sOOCiui/lOOBl+WbnuaVsCAw44Gv54Sh5Yi26ZmQ44CAdG9kbzo65pyq5a6f6KOFXG4gICAgICogQHBhcmFtIGNtZFByZXBhcmVQbGF5YmFja01vdGlvbl9TVEFSVF9QT1NJVElPTjppbnQg44K544K/44O844OI5L2N572u44Gu6Kit5a6a44CAdG9kbzo65pyq5a6f6KOFXG4gICAgICogICAgICAgICAgU1RBUlRfUE9TSVRJT05fQUJTID0gMDsgLy8g6KiY5oa244GV44KM44Gf6ZaL5aeL5L2N572u77yI57W25a++5bqn5qiZ77yJ44GL44KJ44K544K/44O844OIXG4gICAgICogICAgICAgICAgU1RBUlRfUE9TSVRJT05fQ1VSUkVOVCA9IDE7IC8vIOePvuWcqOOBruS9jee9ruOCkumWi+Wni+S9jee9ruOBqOOBl+OBpuOCueOCv+ODvOODiFxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqIGluZm86OuKAuyBLTS0xIOOBryBpbmRleDogMH45IOOBvuOBp+OAgu+8iDEw5YCL44Gu44Oh44Oi44Oq44OQ44Oz44Kv44CC77yJ44Gd44KM44Ge44KMIOe0hDLliIboqJjpjLLlj6/og73jgIJcbiAgICAgKiDjg4bjgqPjg7zjg4Hjg7PjgrDvvIjli5XkvZzjga7oqJjpjLLvvInjga/jgIHjgrPjg57jg7Pjg4nvvIjjg4bjgqPjg7zjg4Hjg7PjgrDvvInjgpLlj4LnhafkuIvjgZXjgYTjgIJodHRwczovL2RvY3VtZW50LmtlaWdhbi1tb3Rvci5jb20vbW90b3ItY29udHJvbC1jb21tYW5kL3RlYWNoaW5nLmh0bWxcbiAgICAgKiAgICAgICAgICByZXBlYXRpbmcsIG9wdGlvbiDjgavjgaTjgYTjgabjga/jg5XjgqHjg7zjg6DjgqbjgqfjgqLmnKrlrp/oo4VcbiAgICAgKiAgICAgICAgICDlho3nlJ/lm57mlbDjga/vvJHlm57lm7rlrprjgafjgYLjgorjgIHmnKzjgrPjg57jg7Pjg4njgpLlrp/ooYzjgZnjgovjgajjgIHoqJjpjLLjgZfjgZ/ntbblr77kvY3nva7jga7mnIDliJ3jga7jg53jgqTjg7Pjg4jjgavnp7vli5XjgZnjgotcbiAgICAgKlxuICAgICAqL1xuICAgIGNtZFByZXBhcmVQbGF5YmFja01vdGlvbihpbmRleCxyZXBlYXRpbmcsY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig3KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQzMigyLE1hdGguYWJzKHBhcnNlSW50KHJlcGVhdGluZywxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoNixNYXRoLmFicyhwYXJzZUludChjbWRQcmVwYXJlUGxheWJhY2tNb3Rpb25fU1RBUlRfUE9TSVRJT04sMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnByZXBhcmVQbGF5YmFja01vdGlvbixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCt+ODp+ODs+OCkuWGjeeUn+OBmeOCi1xuICAgICAqL1xuICAgIGNtZFN0YXJ0UGxheWJhY2soKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnRQbGF5YmFjayk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K344On44Oz5YaN55Sf44KS5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kU3RvcFBsYXliYWNrKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3BQbGF5YmFjayk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIHNlY3Rpb246OuOCreODpeODvOaTjeS9nFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiDjgq3jg6Xjg7zjgpLkuIDmmYLlgZzmraLjgZnjgosgMHg5MFxuICAgICAqL1xuICAgIGNtZFBhdXNlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnBhdXNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKuOCreODpeODvOOCkuWGjemWi+OBmeOCi++8iOiThOepjeOBleOCjOOBn+OCv+OCueOCr+OCkuWGjemWi++8iVxuICAgICAqL1xuICAgIGNtZFJlc3VtZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZXN1bWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAq44Kt44Ol44O844KS5oyH5a6a5pmC6ZaT5YGc5q2i44GX5YaN6ZaL44GZ44KLXG4gICAgICogcGF1c2XvvIjjgq3jg6Xjg7zlgZzmraLvvInjgpLlrp/ooYzjgZfjgIHmjIflrprmmYLplpPvvIjjg5/jg6rnp5LvvInntYzpgY7lvozjgIHoh6rli5XnmoTjgasgcmVzdW1l77yI44Kt44Ol44O85YaN6ZaL77yJIOOCkuihjOOBhOOBvuOBmeOAglxuICAgICAqIEBwYXJhbSB0aW1lIOWBnOatouaZgumWk1ttc2VjXe+8iOODn+ODquenku+8iVxuICAgICAqL1xuICAgIGNtZFdhaXQodGltZSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQzMigwLE1hdGguYWJzKHBhcnNlSW50KHRpbWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELndhaXQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKuOCreODpeODvOOCkuODquOCu+ODg+ODiOOBmeOCi1xuICAgICAqL1xuICAgIGNtZFJlc2V0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo644K/44K544Kv44K744OD44OIXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXG4gICAgLyoqXG4gICAgICog44K/44K544Kv77yI5ZG95Luk77yJ44Gu44K744OD44OI44Gu6KiY6Yyy44KS6ZaL5aeL44GZ44KLIDB4QTBcbiAgICAgKiAg44O76KiY5oa244GZ44KL44Kk44Oz44OH44OD44Kv44K544Gu44Oh44Oi44Oq44Gv44Kz44Oe44Oz44OJ77yaZXJhc2VUYXNrc2V0IOOBq+OCiOOCiuS6iOOCgea2iOWOu+OBleOCjOOBpuOBhOOCi+W/heimgeOBjOOBguOCilxuICAgICAqIEBwYXJhbSBpbmRleDppbnQg44Kk44Oz44OH44OD44Kv44K5IEtNLTEg44Gu5aC05ZCI44CB44Kk44Oz44OH44OD44Kv44K544Gu5YCk44GvIDDvvZ40OSDvvIjoqIg1MOWAi+iomOmMsu+8iVxuICAgICAqL1xuICAgIGNtZFN0YXJ0UmVjb3JkaW5nVGFza1NldChpbmRleCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdGFydFJlY29yZGluZ1Rhc2tzZXQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLjgpLlgZzmraLjgZnjgosgMHhBMlxuICAgICAqIOODu3N0YXJ0UmVjb3JkaW5nVGFza3NldCDlrp/mlr3kuK3jga7jgb/mnInlirlcbiAgICAgKi9cbiAgICBjbWRTdG9wUmVjb3JkaW5nVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdG9wUmVjb3JkaW5nVGFza3NldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5oyH5a6a44Gu44Kk44Oz44OH44OD44Kv44K544Gu44K/44K544Kv44K744OD44OI44KS5raI5Y6744GZ44KLIDB4QTNcbiAgICAgKiBAcGFyYW0gaW5kZXg6aW50IOOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAqL1xuICAgIGNtZEVyYXNlVGFza3NldChpbmRleCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZVRhc2tzZXQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlhajjgabjga7jgr/jgrnjgq/jgrvjg4Pjg4jjgpLmtojljrvjgZnjgosgMHhBNFxuICAgICAqL1xuICAgIGNtZEVyYXNlQWxsVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZUFsbFRhc2tzZXRzKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo644OG44Kj44O844OB44Oz44KwXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIFxuICAgIC8qKlxuICAgICAqIDB4QUEg44Kk44Oz44OH44OD44Kv44K544Go6KiY6Yyy5pmC6ZaTW21zZWNd44KS5oyH5a6a44GX44CB44OG44Kj44O844OB44Oz44Kw44Gu6ZaL5aeL5rqW5YKZ44KS6KGM44GG44CCXG4gICAgICogQHBhcmFtIGluZGV4IOOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAqIEBwYXJhbSB0aW1lIOiomOmMsuaZgumWk++8iOODn+ODquenku+8iSBbbXNlYyAwLTY1NDA4XVxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqIGluZm86OktNLTEg44Gu5aC05ZCI44CB44Kk44Oz44OH44OD44Kv44K544Gu5YCk44GvIDDvvZ45IO+8iOioiDEw5YCL6KiY6Yyy77yJ44Go44Gq44KL44CC6KiY6Yyy5pmC6ZaT44GvIDY1NDA4IFttc2VjXSDjgpLotoXjgYjjgovjgZPjgajjga/jgafjgY3jgarjgYRcbiAgICAgKiAgICAgICAgICDoqJjmhrbjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjga7jg6Hjg6Ljg6rjga9ibGVFcmFzZU1vdGlvbiDjgavjgojjgorkuojjgoHmtojljrvjgZXjgozjgabjgYTjgovlv4XopoHjgYzjgYLjgotcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKi9cbiAgICBjbWRQcmVwYXJlVGVhY2hpbmdNb3Rpb24oaW5kZXgsbGVuZ3RoUmVjb3JkaW5nVGltZSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMixNYXRoLmFicyhwYXJzZUludChsZW5ndGhSZWNvcmRpbmdUaW1lLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wcmVwYXJlVGVhY2hpbmdNb3Rpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAweEFCIOebtOWJjeOBq+ihjOOBo+OBnyBwcmVwYXJlVGVhY2hpbmdNb3Rpb24g44Gu5p2h5Lu244Gn44OG44Kj44O844OB44Oz44Kw44KS6ZaL5aeL44GZ44KL44CCXG4gICAgICogYmxlUHJlcGFyZVRlYWNoaW5nTW90aW9uIOOCkuWun+ihjOOBl+OBn+ebtOW+jOOBruOBv+acieWKueOAglxuICAgICAqL1xuICAgIGNtZFN0YXJ0VGVhY2hpbmdNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnRUZWFjaGluZ01vdGlvbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHhBQyDlrp/ooYzkuK3jga7jg4bjgqPjg7zjg4Hjg7PjgrDjgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRTdG9wVGVhY2hpbmdNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcFRlYWNoaW5nTW90aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAweEFEIOaMh+WumuOBl+OBn+OCpOODs+ODh+ODg+OCr+OCueOBruODouODvOOCt+ODp+ODs+OCkua2iOWOu+OBmeOCi1xuICAgICAqIEBwYXJhbSBpbmRleDppbnQg44Kk44Oz44OH44OD44Kv44K5XG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICogaW5mbzo6IEtNLTEg44Gu5aC05ZCI44CB44Kk44Oz44OH44OD44Kv44K544Gu5YCk44GvIDDvvZ45IO+8iOioiDEw5YCL6KiY6Yyy77yJ44Go44Gq44KLXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICovXG4gICAgY21kRXJhc2VNb3Rpb24oaW5kZXgpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuZXJhc2VNb3Rpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAweEFFIOWFqOOBpuOBruODouODvOOCt+ODp+ODs+OCkua2iOWOu+OBmeOCi1xuICAgICAqL1xuICAgIGNtZEVyYXNlQWxsTW90aW9uKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlQWxsTW90aW9uKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo6TEVEXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIDB4RTAgTEVE44Gu54K554Gv54q25oWL44KS44K744OD44OI44GZ44KLXG4gICAgICog54K554Gv54q25oWL77yIT0ZGLCDngrnnga/vvJpTT0xJRCwg54K55ruF77yaRkxBU0gsIOOChuOBo+OBj+OCiuaYjua7he+8mkRJTe+8ieOBqOOAgVJHQuWQhOiJsuOBruW8t+W6puOCkuaMh+WumuOBl+OAgUxFROOBrueCueeBr+eKtuaFi+OCkuOCu+ODg+ODiOOBmeOCi+OAglxuICAgICAqIEBwYXJhbSBjbWRMZWRfTEVEX1NUQVRFOmludFxuICAgICAqICAgICAgICAgIExFRF9TVEFURV9PRkYgPSAwLFx0Ly8gTEVE5raI54GvXG4gICAgICogICAgICAgICAgTEVEX1NUQVRFX09OX1NPTElEID0gMSxcdC8vIExFROeCueeBr++8iOeCueeBr+OBl+OBo+OBseOBquOBl++8iVxuICAgICAqICAgICAgICAgIExFRF9TVEFURV9PTl9GTEFTSCA9IDIsXHQvLyBMRUTngrnmu4XvvIjkuIDlrprplpPpmpTjgafngrnmu4XvvIlcbiAgICAgKiAgICAgICAgICBMRURfU1RBVEVfT05fRElNID0gM1x0Ly8gTEVE44GM44KG44Gj44GP44KK5piO5ruF44GZ44KLXG4gICAgICogQHBhcmFtIHJlZDppbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0gZ3JlZW46aW50IDAtMjU1XG4gICAgICogQHBhcmFtIGJsdWU6aW50IDAtMjU1XG4gICAgICovXG4gICAgY21kTGVkKGNtZExlZF9MRURfU1RBVEUscmVkLGdyZWVuLGJsdWUpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLE1hdGguYWJzKHBhcnNlSW50KGNtZExlZF9MRURfU1RBVEUsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDEsTWF0aC5hYnMocGFyc2VJbnQocmVkLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgyLE1hdGguYWJzKHBhcnNlSW50KGdyZWVuLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgzLE1hdGguYWJzKHBhcnNlSW50KGJsdWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmxlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBJTVUg44K444Oj44Kk44OtXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIDB4RUHjgIBJTVXjga7lgKTlj5blvpco6YCa55+lKeOCkumWi+Wni+OBmeOCiyBpbmZvOjpCTEXlsILnlKjjgrPjg57jg7Pjg4lcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBpbmZvOjrmnKzjgrPjg57jg7Pjg4njgpLlrp/ooYzjgZnjgovjgajjgIFJTVXjga7jg4fjg7zjgr/jga9CTEXjga7jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrlNT1RPUl9JTVVfTUVBU1VSRU1FTlTjgavpgJrnn6XjgZXjgozjgotcbiAgICAgKiAgICAgICAgTU9UT1JfSU1VX01FQVNVUkVNRU5U44Gubm90aWZ544GvX29uQmxlSW11TWVhc3VyZW1lbnTjgaflj5blvpdcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKi9cbiAgICBjbWRFbmFibGVJTVUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW5hYmxlSU1VKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAweEVCIElNVeOBruWApOWPluW+lyjpgJrnn6Up44KS5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kRGlzYWJsZUlNVSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5kaXNhYmxlSU1VKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8g44K344K544OG44OgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIDB4RjAg44K344K544OG44Og44KS5YaN6LW35YuV44GZ44KLXG4gICAgICogaW5mbzo6QkxF44Gr5o6l57aa44GX44Gm44GE44Gf5aC05ZCI44CB5YiH5pat44GX44Gm44GL44KJ5YaN6LW35YuVXG4gICAgICovXG4gICAgY21kUmVib290KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlYm9vdCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHhGRCDjg5XjgqHjg7zjg6DjgqbjgqfjgqLjgqLjg4Pjg5fjg4fjg7zjg4jjg6Ljg7zjg4njgavlhaXjgotcbiAgICAgKiBpbmZvOjrjg5XjgqHjg7zjg6DjgqbjgqfjgqLjgpLjgqLjg4Pjg5fjg4fjg7zjg4jjgZnjgovjgZ/jgoHjga7jg5bjg7zjg4jjg63jg7zjg4Djg7zjg6Ljg7zjg4njgavlhaXjgovjgILvvIjjgrfjgrnjg4bjg6Djga/lho3otbfli5XjgZXjgozjgovjgILvvIlcbiAgICAgKi9cbiAgICBjbWRFbnRlckRldmljZUZpcm13YXJlVXBkYXRlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVudGVyRGV2aWNlRmlybXdhcmVVcGRhdGUpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyDjg6Ljg7zjgr/jg7zoqK3lrprjgIBNT1RPUl9TRVRUSU5HXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIDB4MDIg44Oi44O844K/44O844Gu5pyA5aSn6YCf44GV44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIG1heFNwZWVkOmZsb2F0IOacgOWkp+mAn+OBlSBbcmFkaWFuIC8gc2Vjb25kXe+8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZE1heFNwZWVkKG1heFNwZWVkKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQobWF4U3BlZWQsMTApKSk7Ly90b2RvOjpOYU7jgYzov5Tjgovlj6/og73mgKcgcGFyc2VGbG9hdChcImFhYVwiLDEwKT09PU5hTlxuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5tYXhTcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIDB4MDMg44Oi44O844K/44O844Gu5pyA5bCP6YCf44GV44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIG1heFNwZWVkOmZsb2F0IOacgOWwj+mAn+OBlSBbcmFkaWFuIC8gc2Vjb25kXe+8iOato+OBruWApO+8iVxuICAgICAqIGluZm86Om1pblNwZWVkIOOBr+OAgWJsZVByZXBhcmVQbGF5YmFja01vdGlvbiDlrp/ooYzjga7pmpvjgIHplovlp4vlnLDngrnjgavnp7vli5XjgZnjgovpgJ/jgZXjgajjgZfjgabkvb/nlKjjgZXjgozjgovjgILpgJrluLjmmYLpgYvou6Ljgafjga/kvb/nlKjjgZXjgozjgarjgYTjgIJcbiAgICAgKi9cbiAgICBjbWRNaW5TcGVlZChtaW5TcGVlZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KG1pblNwZWVkLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5taW5TcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIDB4MDUg5Yqg5rib6YCf5puy57ea44KS5oyH5a6a44GZ44KL77yI44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844Or44Gu6Kit5a6a77yJXG4gICAgICogQHBhcmFtIGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFOmludFxuICAgICAqICAgICAgQ1VSVkVfVFlQRV9OT05FID0gMCxcdC8vIOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPRkZcbiAgICAgKiAgICAgIENVUlZFX1RZUEVfVFJBUEVaT0lEID0gMSxcdC8vIOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPTiDvvIjlj7DlvaLliqDmuJvpgJ/vvIlcbiAgICAgKi9cbiAgICBjbWRDdXJ2ZVR5cGUoY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLE1hdGguYWJzKHBhcnNlSW50KGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5jdXJ2ZVR5cGUsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAweDA3IOODouODvOOCv+ODvOOBruWKoOmAn+W6puOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSBhY2M6ZmxvYXQg5Yqg6YCf5bqmIDAtMjAwIFtyYWRpYW4gLyBzZWNvbmReMl3vvIjmraPjga7lgKTvvIlcbiAgICAgKiBpbmZvOjphY2Mg44Gv44CB44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9OIOOBruWgtOWQiOOAgeWKoOmAn+aZguOBq+S9v+eUqOOBleOCjOOBvuOBmeOAgu+8iOWKoOmAn+aZguOBruebtOe3muOBruWCvuOBje+8iVxuICAgICAqL1xuICAgIGNtZEFjYyhhY2Mpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChhY2MsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELmFjYyxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIDB4MDgg44Oi44O844K/44O844Gu5rib6YCf5bqm44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIGRlYzpmbG9hdCDmuJvpgJ/luqYgMC0yMDAgW3JhZGlhbiAvIHNlY29uZF4yXe+8iOato+OBruWApO+8iVxuICAgICAqIGluZm86OmRlYyDjga/jgIHjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT04g44Gu5aC05ZCI44CB5rib6YCf5pmC44Gr5L2/55So44GV44KM44G+44GZ44CC77yI5rib6YCf5pmC44Gu55u057ea44Gu5YK+44GN77yJXG4gICAgICovXG4gICAgY21kRGVjKGRlYyl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KGRlYywxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuZGVjLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHgwRSDjg6Ljg7zjgr/jg7zjga7mnIDlpKfjg4jjg6vjgq/vvIjntbblr77lgKTvvInjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0gbWF4VG9ycXVlOmZsb2F0IOacgOWkp+ODiOODq+OCryBbTiptXe+8iOato+OBruWApO+8iVxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqIGluZm86Om1heFRvcnF1ZSDjgpLoqK3lrprjgZnjgovjgZPjgajjgavjgojjgorjgIHjg4jjg6vjgq/jga7ntbblr77lgKTjgYwgbWF4VG9ycXVlIOOCkui2heOBiOOBquOBhOOCiOOBhuOBq+mBi+i7ouOBl+OBvuOBmeOAglxuICAgICAqIGluZm86OiBtYXhUb3JxdWUgPSAwLjEgW04qbV0g44Gu5b6M44GrIHJ1bkZvcndhcmQg77yI5q2j5Zue6Lui77yJ44KS6KGM44Gj44Gf5aC05ZCI44CBMC4xIE4qbSDjgpLotoXjgYjjgarjgYTjgojjgYbjgavjgZ3jga7pgJ/luqbjgpLjgarjgovjgaDjgZHntq3mjIHjgZnjgovjgIJcbiAgICAgKiBpbmZvOjog44Gf44Gg44GX44CB44OI44Or44Kv44Gu5pyA5aSn5YCk5Yi26ZmQ44Gr44KI44KK44CB44K344K544OG44Og44Gr44KI44Gj44Gm44Gv5Yi25b6h5oCn77yI5oyv5YuV77yJ44GM5oKq5YyW44GZ44KL5Y+v6IO95oCn44GM44GC44KL44CCXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRNYXhUb3JxdWUobWF4VG9ycXVlKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQobWF4VG9ycXVlLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5tYXhUb3JxdWUsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAweDE4IOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5Q77yI5q+U5L6L77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHFDdXJyZW50UDpmbG9hdCBx6Zu75rWBUOOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFFDdXJyZW50UChxQ3VycmVudFApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChxQ3VycmVudFAsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELnFDdXJyZW50UCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIDB4MTkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrlDvvIjmr5TkvovvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0gcUN1cnJlbnRJOmZsb2F0IHHpm7vmtYFJ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUUN1cnJlbnRJKHFDdXJyZW50SSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHFDdXJyZW50SSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucUN1cnJlbnRJLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHgxQSDjg6Ljg7zjgr/jg7zjga5x6Lu46Zu75rWBUElE44Kz44Oz44OI44Ot44O844Op44GuRO+8iOW+ruWIhu+8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSBxQ3VycmVudEQ6ZmxvYXQgcembu+a1gUTjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRRQ3VycmVudEQocUN1cnJlbnREKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQocUN1cnJlbnRELDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5xQ3VycmVudEQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAweDFCIOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5E77yI5b6u5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHNwZWVkUDpmbG9hdCDpgJ/luqZQ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kU3BlZWRQKHNwZWVkUCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkUCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWRQLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHgxQyDjg6Ljg7zjgr/jg7zjga7pgJ/luqZQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5J77yI56mN5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHNwZWVkSTpmbG9hdCDpgJ/luqZJ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kU3BlZWRJKHNwZWVkSSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkSSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWRJLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHgxRCDjg6Ljg7zjgr/jg7zjga7pgJ/luqZQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5E77yI5b6u5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHNwZWVkRDpmbG9hdCDpgJ/luqZE44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kU3BlZWREKHNwZWVkRCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkRCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWRELGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHgxRSDjg6Ljg7zjgr/jg7zjga7kvY3nva5QSUTjgrPjg7Pjg4jjg63jg7zjg6njga5Q77yI5q+U5L6L77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHBvc2l0aW9uUDpmbG9hdCDkvY3nva5Q44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUG9zaXRpb25QKHBvc2l0aW9uUCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHBvc2l0aW9uUCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucG9zaXRpb25QLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogMHgyMiDlhajjgabjga5QSUTjg5Hjg6njg6Hjg7zjgr/jgpLjg6rjgrvjg4Pjg4jjgZfjgabjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/oqK3lrprjgavmiLvjgZlcbiAgICAgKiBpbmZvOjpxQ3VycmVudFAsIHFDdXJyZW50SSwgIHFDdXJyZW50RCwgc3BlZWRQLCBzcGVlZEksIHNwZWVkRCwgcG9zaXRpb25QIOOCkuODquOCu+ODg+ODiOOBl+OBvuOBmVxuICAgICAqXG4gICAgICovXG4gICAgY21kUmVzZXRQSUQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzZXRQSUQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIDB4M0Eg44Oi44O844K/44O844Gu6LW35YuV5pmC5Zu65pyJTEVE44Kr44Op44O844KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHJlZDppbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0gZ3JlZW46aW50IDAtMjU1XG4gICAgICogQHBhcmFtIGJsdWU6aW50IDAtMjU1XG4gICAgICpcbiAgICAgKiBpbmZvOjpvd25Db2xvciDjga/jgqLjgqTjg4njg6vmmYLjga7lm7rmnIlMRUTjgqvjg6njg7zjgIJzYXZlQWxsU2V0dGluZ3PjgpLlrp/ooYzjgZfjgIHlho3otbfli5XlvozjgavliJ3jgoHjgablj43mmKDjgZXjgozjgovjgIJcbiAgICAgKiDjgZPjga7oqK3lrprlgKTjgpLlpInmm7TjgZfjgZ/loLTlkIjjgIFCTEXjga4gRGV2aWNlIE5hbWUg44Gu5LiLM+ahgeOBjOWkieabtOOBleOCjOOCi+OAglxuICAgICAqL1xuICAgIGNtZE93bkNvbG9yKHJlZCxncmVlbixibHVlKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigzKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxNYXRoLmFicyhwYXJzZUludChyZWQsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDEsTWF0aC5hYnMocGFyc2VJbnQoZ3JlZW4sMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDIsTWF0aC5hYnMocGFyc2VJbnQoYmx1ZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQub3duQ29sb3IsYnVmZmVyKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIDB4NDAg5oyH5a6a44GX44Gf6Kit5a6a5YCk44KS5Y+W5b6XIGluZm86OkJMReWwgueUqOOCs+ODnuODs+ODiSB0b2RvOjrliIbpm6LkvZzmpa1cbiAgICAgKiBAcGFyYW0gcmVnaXN0ZXJzOm1peCBpbnQgW10g5Y+W5b6X44GZ44KL44OX44Ot44OR44OG44Kj44Gu44Kz44Oe44Oz44OJKOODrOOCuOOCueOCv+eVquWPtynlgKRcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX0g5Y+W5b6X44GX44Gf5YCkIHJlZ2lzdGVyc+OBjGludD3jg6zjgrjjgrnjgr/lgKTjga7jg5fjg6rjg5/jg4bjgqPjg5blgKTjgIJyZWdpc3RlcnPjgYxhcnJheT3jg6zjgrjjgrnjgr/lgKTjga7jgqrjg5bjgrjjgqfjgq/jg4jjgIJcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBpbmZvOjog5Y+W5b6X44GZ44KL5YCk44Gv44Kz44Oe44Oz44OJ5a6f6KGM5b6M44GrQkxF44Gu44Kt44Oj44Op44Kv44K/44Oq44K544OG44Kj44Kv44K5TU9UT1JfU0VUVElOR+OBq+mAmuefpeOBleOCjOOCi+OAglxuICAgICAqICAgICAgICAgIOOBneOCjOOCkuaLvuOBo+OBpnByb21pc2Xjgqrjg5bjgrjjgqfjgq/jg4jjga7jga5yZXNvbHZl44Gr6L+U44GX44Gm5Yem55CG44KS57mL44GQXG4gICAgICogICAgICAgICAgTU9UT1JfU0VUVElOR+OBrm5vdGlmeeOBr19vbkJsZU1vdG9yU2V0dGluZ+OBp+WPluW+l1xuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqL1xuICAgIGNtZFJlYWRSZWdpc3RlcihyZWdpc3RlcnMpe1xuICAgICAgICBpZihyZWdpc3RlcnMgaW5zdGFuY2VvZiBBcnJheSl7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGFsbHJlc29sdmUsIGFsbHJlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2VMaXN0PVtdO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8cmVnaXN0ZXJzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVnaXN0ZXI9cmVnaXN0ZXJzW2ldO1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlTGlzdC5wdXNoKCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjY3A9bmV3IF9LTU5vdGlmeVByb21pcyhyZWdpc3Rlcix0aGlzLl9SRVZfTU9UT1JfQ09NTUFORFtyZWdpc3Rlcl0sdGhpcy5fbm90aWZ5UHJvbWlzTGlzdCxyZXNvbHZlLHJlamVjdCwxMDAwKTsvL25vdGlmeee1jOeUseOBrnJlc3VsdOOCklByb21pc+OBqOe0kOS7mOOBkVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsIHBhcnNlSW50KHJlZ2lzdGVyLCAxMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZFJlZ2lzdGVyLCBidWZmZXIsY2NwKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlTGlzdCkudGhlbigocmVzYXIpPT57XG4gICAgICAgICAgICAgICAgICAgIGxldCB0PVt7fV0uY29uY2F0KHJlc2FyKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJ0b2JqPU9iamVjdC5hc3NpZ24uYXBwbHkobnVsbCx0KTtcbiAgICAgICAgICAgICAgICAgICAgYWxscmVzb2x2ZShydG9iaik7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKG1zZyk9PntcbiAgICAgICAgICAgICAgICAgICAgYWxscmVqZWN0KG1zZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGxhc3RyZXNvbHZlLCBsYXN0cmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVnaXN0ZXI9cmVnaXN0ZXJzO1xuICAgICAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2NwPW5ldyBfS01Ob3RpZnlQcm9taXMocmVnaXN0ZXIsdGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbcmVnaXN0ZXJdLHRoaXMuX25vdGlmeVByb21pc0xpc3QscmVzb2x2ZSxyZWplY3QsMTAwMCk7Ly9ub3RpZnnntYznlLHjga5yZXN1bHTjgpJQcm9taXPjgajntJDku5jjgZFcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCwgcGFyc2VJbnQocmVnaXN0ZXIsIDEwKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWRSZWdpc3RlciwgYnVmZmVyLGNjcCk7XG4gICAgICAgICAgICAgICAgfSkudGhlbigocmVzKT0+e1xuICAgICAgICAgICAgICAgICAgICBsYXN0cmVzb2x2ZShyZXNbT2JqZWN0LmtleXMocmVzKVswXV0pO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChtc2cpPT57XG4gICAgICAgICAgICAgICAgICAgIGxhc3RyZWplY3QobXNnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Gu5YWo44Gm44Gu44Os44K444K544K/5YCk44Gu5Y+W5b6XXG4gICAgICovXG4gICAgY21kUmVhZEFsbFJlZ2lzdGVyKCl7XG4gICAgICAgbGV0IGNtPSB0aGlzLmNvbnN0cnVjdG9yLmNtZFJlYWRSZWdpc3Rlcl9DT01NQU5EO1xuICAgICAgICBsZXQgYWxsY21kcz1bXTtcbiAgICAgICAgT2JqZWN0LmtleXMoY20pLmZvckVhY2goKGspPT57YWxsY21kcy5wdXNoKGNtW2tdKTt9KTtcblxuICAgICAgIHJldHVybiB0aGlzLmNtZFJlYWRSZWdpc3RlcihhbGxjbWRzKTtcbiAgICB9XG4gICAgLy8vLy8v5L+d5a2YXG4gICAgLyoqXG4gICAgICogMHg0MSDlhajjgabjga7oqK3lrprlgKTjgpLjg5Xjg6njg4Pjgrfjg6Xjg6Hjg6Ljg6rjgavkv53lrZjjgZnjgotcbiAgICAgKiBpbmZvOjrmnKzjgrPjg57jg7Pjg4njgpLlrp/ooYzjgZfjgarjgYTpmZDjgorjgIHoqK3lrprlgKTjga/jg6Ljg7zjgr/jg7zjgavmsLjkuYXnmoTjgavkv53lrZjjgZXjgozjgarjgYQo5YaN6LW35YuV44Gn5raI44GI44KLKVxuICAgICAqL1xuICAgIGNtZFNhdmVBbGxSZWdpc3RlcnMoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuc2F2ZUFsbFJlZ2lzdGVycyk7XG4gICAgfVxuXG4gICAgLy8vLy8v44Oq44K744OD44OIXG4gICAgLyoqXG4gICAgICogMHg0RSDmjIflrprjgZfjgZ/jg6zjgrjjgrnjgr/jgpLjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICAgKiBAcGFyYW0gcmVnaXN0ZXI6S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRSZWFkUmVnaXN0ZXJfQ09NTUFORCDliJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgovjgrPjg57jg7Pjg4ko44Os44K444K544K/KeWApFxuICAgICAqL1xuICAgIGNtZFJlc2V0UmVnaXN0ZXIocmVnaXN0ZXIpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KHJlZ2lzdGVyLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0UmVnaXN0ZXIsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMHg0RiDlhajjgabjga7jg6zjgrjjgrnjgr/jgpLjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICAgKiBpbmZvOjpibGVTYXZlQWxsUmVnaXN0ZXJz44KS5a6f6KGM44GX44Gq44GE6ZmQ44KK44CB44Oq44K744OD44OI5YCk44Gv44Oi44O844K/44O844Gr5rC45LmF55qE44Gr5L+d5a2Y44GV44KM44Gq44GEKOWGjei1t+WLleOBp+a2iOOBiOOCiylcbiAgICAgKi9cbiAgICBjbWRSZXNldEFsbFJlZ2lzdGVycygpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5yZXNldEFsbFJlZ2lzdGVycyk7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5YaF6YOoXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbi8vLy8vL2NsYXNzLy9cbn1cblxuXG4vKipcbiAqIFNlbmRCbGVOb3RpZnlQcm9taXNcbiAqIOOAgGNtZFJlYWRSZWdpc3RlcuetieOBrkJMReWRvOOBs+WHuuOBl+W+jOOBq1xuICog44CA44Kz44Oe44Oz44OJ57WQ5p6c44GMbm90aWZ544Gn6YCa55+l44GV44KM44KL44Kz44Oe44Oz44OJ44KSUHJvbWlz44Go57SQ5LuY44GR44KL54K644Gu44Kv44Op44K5XG4gKi9cbmNsYXNzIF9LTU5vdGlmeVByb21pc3tcbiAgICAvL+aIkOWKn+mAmuefpVxuICAgIHN0YXRpYyBzZW5kR3JvdXBOb3RpZnlSZXNvbHZlKGdyb3VwQXJyYXksdGFnTmFtZSx2YWwpe1xuICAgICAgICBpZighZ3JvdXBBcnJheSBpbnN0YW5jZW9mIEFycmF5KXtyZXR1cm47fVxuICAgICAgICAvL+mAgeS/oUlE44Gu6YCa55+lIENhbGxiYWNrUHJvbWlz44Gn5ZG844Gz5Ye644GX5YWD44Gu44Oh44K944OD44OJ44GuUHJvbWlz44Gr6L+U44GZXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPGdyb3VwQXJyYXkubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYoIGdyb3VwQXJyYXlbaV0udGFnTmFtZT09PXRhZ05hbWUgKXtcbiAgICAgICAgICAgICAgICBncm91cEFycmF5W2ldLmNhbGxSZXNvbHZlKHZhbCk7XG4gICAgICAgICAgICAgICAgZ3JvdXBBcnJheS5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBjb25zdFxuICAgICAqIEBwYXJhbSB0YWdOYW1lXG4gICAgICogQHBhcmFtIGdyb3VwQXJyYXlcbiAgICAgKiBAcGFyYW0gcHJvbWlzUmVzb2x2ZU9ialxuICAgICAqIEBwYXJhbSBwcm9taXNSZWplY3RPYmpcbiAgICAgKiBAcGFyYW0gcmVqZWN0VGltZU91dFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHRhZ05hbWUsdGFnSW5mbz1udWxsLGdyb3VwQXJyYXk9W10scHJvbWlzUmVzb2x2ZU9iaiwgcHJvbWlzUmVqZWN0T2JqLHJlamVjdFRpbWVPdXQpe1xuICAgICAgICB0aGlzLnRpbWVvdXRJZD0wO1xuICAgICAgICB0aGlzLnRhZ05hbWU9dGFnTmFtZTtcbiAgICAgICAgdGhpcy50YWdJbmZvPXRhZ0luZm87XG4gICAgICAgIHRoaXMuZ3JvdXBBcnJheT1ncm91cEFycmF5IGluc3RhbmNlb2YgQXJyYXk/Z3JvdXBBcnJheTpbXTtcbiAgICAgICAgdGhpcy5ncm91cEFycmF5LnB1c2godGhpcyk7XG4gICAgICAgIHRoaXMucHJvbWlzUmVzb2x2ZU9iaj1wcm9taXNSZXNvbHZlT2JqO1xuICAgICAgICB0aGlzLnByb21pc1JlamVjdE9iaj1wcm9taXNSZWplY3RPYmo7XG4gICAgICAgIHRoaXMucmVqZWN0VGltZU91dD1yZWplY3RUaW1lT3V0O1xuICAgIH1cbiAgICAvL+OCq+OCpuODs+ODiOOBrumWi+WniyBjaGFyYWN0ZXJpc3RpY3Mud3JpdGVWYWx1ZeWRvOOBs+WHuuOBl+W+jOOBq+Wun+ihjFxuICAgIHN0YXJ0UmVqZWN0VGltZU91dENvdW50KCl7XG4gICAgICAgIHRoaXMudGltZW91dElkPXNldFRpbWVvdXQoKCk9PntcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUdyb3VwKCk7XG4gICAgICAgICAgICB0aGlzLnByb21pc1JlamVjdE9iaih7bXNnOlwidGltZW91dDpcIix0YWdOYW1lOnRoaXMudGFnTmFtZSx0YWdJbmZvOnRoaXMudGFnSW5mb30pO1xuICAgICAgICB9LCB0aGlzLnJlamVjdFRpbWVPdXQpO1xuICAgIH1cbiAgICBjYWxsUmVzb2x2ZShhcmcpe1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xuICAgICAgICB0aGlzLl9yZW1vdmVHcm91cCgpO1xuICAgICAgICB0aGlzLnByb21pc1Jlc29sdmVPYmooYXJnKTtcbiAgICB9XG4gICAgY2FsbFJlamVjdChtc2cpe1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xuICAgICAgICB0aGlzLl9yZW1vdmVHcm91cCgpO1xuICAgICAgICB0aGlzLnByb21pc1JlamVjdE9iaih7bXNnOm1zZ30pO1xuICAgIH1cblxuICAgIF9yZW1vdmVHcm91cCgpe1xuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLmdyb3VwQXJyYXkubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYoIHRoaXMuZ3JvdXBBcnJheT09PXRoaXMpe1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBBcnJheS5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9S01Nb3RvckNvbW1hbmRLTU9uZTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL0tNTW90b3JDb21tYW5kS01PbmUuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9