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
 * @classdesc 構造体の基底クラス
 * @ignore
 */
class KMStructureBase{
    constructor(){
    }
    /**
     * 同じ値を持つかの比較
     * @param {object} tar 比較する構造体
     * @returns {boolean} 結果
     */
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

    /**
     * 複製
     * @returns {object} 複製された構造体
     */
    Clone () {
        return Object.assign(new this.constructor(),this);
    }
    /**
     * 値の取得（Obj）
     * @returns {object}
     */
    GetValObj () {
        return Object.assign({},this);
    }

    /**
     * 値の取得（配列）
     * @returns {Array}
     */
    GetValArray () {
        let k=Object.keys(this);
        let r=[];
        for(let i=0;i<k.length;i++){
            r.push(this[k[i]]);
        }
        return r;
    }
}


/**
 * @classdesc XY座標の構造体オブジェクト
 * @ignore
 */
class KMVector2 extends KMStructureBase {
    /**
     * constructor
     * @param {number} x
     * @param {number} y
     * @instance
     */
    constructor (x=0, y=0) {
        super();
        this.x = x;
        this.y = y;
    }

    /**
     * 相対位置へ移動
     * @param {number} dx
     * @param {number} dy
     */
    Move (dx =0, dy = 0) {
        this.x += dx;
        this.y += dy;
    }
    /**
     * 2点間の距離
     * @param {KMVector2} vector2
     * @returns {number}
     */
    Distance (vector2) {
        if (!(vector2 instanceof KMVector2)) {return;}
        return Math.sqrt(Math.pow((this.x-vector2.x),2) + Math.pow((this.y-vector2.y),2));
    }
    /**
     * 2点間の角度
     * @param {KMVector2} vector2
     * @returns {number}
     */
    Radian (vector2) {
        if (!(vector2 instanceof KMVector2)) {return;}
        return Math.atan2(this.y-vector2.y,this.x-vector2.x);
    }
    /**
     * 0,0からの距離
     * @returns {number}
     */
    DistanceFromZero() {
        return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2));
    }
    /**
     * 0,0からの角度
     * @returns {number} radian
     */
    RadianFromZero() {
        return Math.atan2(this.y,this.x);
    }
}

// /**
//  * @classdesc XYZ 3次元ベクトル
//  */
// class KMVector3 extends KMStructureBase {
//     /**
//      *
//      * @param x
//      * @param y
//      * @param z
//      */
//     constructor(x,y,z) {
//         super();
//         this.x = x?x:0;
//         this.y = y?y:0;
//         this.z = z?z:0;
//     }
//     /**
//      * 相対位置へ移動
//      * @param {number} dx
//      * @param {number} dy
//      * @param {number} dz
//      * @constructor
//      */
//     Move (dx, dy, dz) {
//         this.x += dx;
//         this.y += dy;
//         this.z += dz;
//     }
//     /**
//      * 2点間の距離
//      * @param {KMVector3} vector3
//      * @returns {number}
//      * @constructor
//      */
//     Distance (vector3) {
//         if (!(vector3 instanceof KMVector3)) {return;}
//         return Math.sqrt(Math.pow((this.x-vector3.x),2) + Math.pow((this.y-vector3.y),2)+ Math.pow((this.z-vector3.z),2));
//     }
//     // /**
//     //  * 2点間の角度(回転方向の情報なし)
//     //  *  @param {KMVector3} vector3
//     //  * @returns {number}
//     //  * @constructor
//     //  */
//     // Radian (vector3) {
//     //     if (!(vector3 instanceof KMVector3)) {return;}
//     //     //todo::2点間の角度(回転方向の情報なし)
//     // }
//     /**
//      * 0,0,0からの距離
//      * @returns {number}
//      * @constructor
//      */
//     DistanceFromZero () {
//         return Math.sqrt(Math.pow(this.x,2) + Math.pow(this.y,2)+ Math.pow(this.z,2));
//     }
//
//     // /**
//     //  * 0,0,0からの角度
//     //  * @returns {number} radian
//     //  * @constructor
//     //  */
//     // RadianFromZero () {
//     //     //todo::0,0,0からの角度
//     // }
// }


/**
 * @classdesc ジャイロセンサー値
 */
class KMImuState extends KMStructureBase {
    /**
     * constructor
     * @param {number} accelX 加速度(x) [± 1]
     * @param {number} accelY 加速度(y) [± 1]
     * @param {number} accelZ 加速度(z) [± 1]
     * @param {number} temp 温度 C
     * @param {number} gyroX 角速度(x) [± 1]
     * @param {number} gyroY 角速度(y) [± 1]
     * @param {number} gyroZ 角速度(z) [± 1]
     * @instance
     */
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
/**
 * @classdesc モーターLED　点灯・色状態
 */
class KMLedState extends KMStructureBase {
    /**
     * モーターのLED状態
     * @readonly
     * @enum {number}
     * @property {number} MOTOR_LED_STATE_OFF - 0:LED消灯
     * @property {number} MOTOR_LED_STATE_ON_SOLID - 1:LED点灯
     * @property {number} MOTOR_LED_STATE_ON_FLASH - 2:LED点滅（一定間隔で点滅）
     * @property {number} MOTOR_LED_STATE_ON_DIM - 3:LEDがゆっくり輝度変化する
     */
    static get MOTOR_LED_STATE(){
        return{
            "MOTOR_LED_STATE_OFF":0,
            "MOTOR_LED_STATE_ON_SOLID":1,
            "MOTOR_LED_STATE_ON_FLASH":2,
            "MOTOR_LED_STATE_ON_DIM":3
        }
    }

    /**
     * constructor
     * @param {KMLedState.MOTOR_LED_STATE} state
     * @param {number} colorR int [0-255]
     * @param {number} colorG int [0-255]
     * @param {number} colorB int [0-255]
     * @instance
     */
    constructor(state,colorR,colorG,colorB) {
        super();
        this.state=KMUtl.toNumber(state);
        this.colorR=KMUtl.toNumber(colorR);
        this.colorG=KMUtl.toNumber(colorG);
        this.colorB=KMUtl.toNumber(colorB);
    }
}

/**
 * @classdesc モーター回転情報
 */
class KMRotState extends KMStructureBase {
    /**
     * 最大トルク定数
     * @readonly
     * @type {number}
     */
    static get MAX_TORQUE(){
        return 0.3;//0.3 N・m
    }

    /**
     * 最大速度定数(rpm)
     * @readonly
     * @type {number}
     */
    static get MAX_SPEED_RPM(){
        return 300;//300rpm
    }
    /**
     * 最大速度定数(radian/sec)
     * @readonly
     * @type {number}
     */
    static get MAX_SPEED_RADIAN(){
        return KMUtl.rpmToRadianSec(300);
    }
    /**
     * 最大座標定数
     * @readonly
     * @type {number}
     */
    static get MAX_POSITION(){
        return 3*Math.pow(10,38);//info::「return　3e+38」はminifyでエラー
        //return　3e+38;//radian 4byte float　1.175494 10-38  < 3.402823 10+38
    }

    /**
     * constructor
     * @param {number} position 座標
     * @param {number} velocity 速度
     * @param {number} torque トルク
     * @instance
     */
    constructor(position, velocity, torque) {
        //有効桁数 小数第3位
        super();
        this.position = Math.floor(KMUtl.toNumber(position)*100)/100;
        this.velocity = Math.floor(KMUtl.toNumber(velocity)*100)/100;
        this.torque = Math.floor(KMUtl.toNumber(torque)*10000)/10000;
    }
}


/**
 * @classdesc デバイス情報
 */
class KMDeviceInfo extends KMStructureBase {
    /**
     *
     * @param {KMMotorCommandKMOne.KM_CONNECT_TYPE} type 接続方式
     * @param {string} id デバイスUUID
     * @param {string} name モーター名
     * @param {boolean} isConnect 接続状態
     * @param {string} manufacturerName 製造会社名
     * @param {string} hardwareRevision
     * @param {string} firmwareRevision
     * @instance
     */
    constructor(type=0,id="",name="",isConnect=false,manufacturerName=null,hardwareRevision=null,firmwareRevision=null) {
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
    //KMVector3:KMVector3,
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


/**
 * @classdesc ユーティリティ
 */
class KMUtl{

    /**
     * 数値にキャストする関数
     * 数値以外は0を返す<br>
     * Infinityも0とする
     * @param {number} val
     * @param {number} defaultval valが数値に変換出来ない場合のデフォルト
     * @returns {number}
     */
    static toNumber(val, defaultval = 0) {
        let v = parseFloat(val, 10);
        return (isNaN(v) || val === Infinity ? defaultval : v);
    };

    /**
     * 角度の単位変換　degree >> radian
     * @param {number} degree 度
     * @returns {number} radian
     */
    static degreeToRadian(degree) {
        return degree * 0.017453292519943295;
    };

    /**
     * 角度の単位変換　radian >> degree
     * @param {number} radian radian角
     * @returns {number} 度
     */
    static radianToDegree(radian) {
        return radian / 0.017453292519943295;
    };

    /**
     * 速度 rpm ->radian/sec に変換
     * @param {number} rpm
     * @returns {number} radian/sec
     */
    static rpmToRadianSec(rpm) {
        //速度 rpm ->radian/sec(Math.PI*2/60)
        return rpm * 0.10471975511965977;
    };
    /**
     * 2点間の距離と角度を求める
     * @param {number} from_x
     * @param {number} from_y
     * @param {number} to_x
     * @param {number} to_y
     * @returns {number}
     */
    static twoPointDistanceAngle(from_x, from_y, to_x, to_y) {
        let distance = Math.sqrt(Math.pow(from_x - to_x, 2) + Math.pow(from_y - to_y, 2));
        let radian = Math.atan2(from_y - to_y, from_x - to_x);
        return {dist: distance, radi: radian, deg: KMUtl.radianToDegree(radian)};
    };

    /**
     * @# info:: BLEのDEVICE INFORMATION SERVICEのパースにKMComBLE.jsで主に使用
     * utf.js - UTF-8 <=> UTF-16 convertion
     *
     * @ignore
     * @param array
     * @returns {string}
     * @constructor
     *
     * @desc
     * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
     * Version: 1.0
     * LastModified: Dec 25 1999
     * This library is free.  You can redistribute it and/or modify it.
     */
    static Utf8ArrayToStr(array) {
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
}

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
/**
 * @classdesc ブラウザ用WebBluetooh通信クラス(chrome依存)
 * @ignore
 */
class KMComWebBLE extends KMComBase{
    /********************************************
     * 定数
     ********************************************/

    /**
     * constructor
     */
    constructor(){
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
         * @#---------------------------------------------------------
         * モーター回転情報受信
         * @param eve
         * @private
         * @#---------------------------------------------------------
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
         * @#---------------------------------------------------------
         * モーターIMU情報受信
         * @param eve
         * @private
         *
         * @#Notify したときの返り値)---------------------------------------------
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
         * @#---------------------------------------------------------
         * モーター設定情報取得
         * @param eve
         * @private
         * @#---------------------------------------------------------
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
     * WebBluetoohでの接続を開始する
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
     * WebBluetoohの切断
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
//global.KMVector3=require('./KMStructures.js').KMVector3;
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

/**
 * @classdesc KM-1のWebBluetooh接続用 仮想デバイス
 */
class KMMotorOneWebBLE extends KMMotorCommandKMOne{
    /**
     * constructor
     */
    constructor(){
        super(KMMotorCommandKMOne.KM_CONNECT_TYPE.WEBBLE,new KMComWebBLE());
    }

    /**
     * モーターと接続する
     */
    connect(){
        this._KMCom.connect();
    }

    /**
     * モーターと切断
     */
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
/**
 * @classdesc 通信クラスの基底
 * @ignore
 */
class KMComBase{
    /**********************
     * 定数
    **********************/
    /**
     * constructor　
     */
    constructor(){
        this._peripheral=null;
        this._commandCount=0;
        this._deviceInfo=new KMStructures.KMDeviceInfo();

        this._motorMeasurement=new KMStructures.KMRotState();
        this._motorLed=new KMStructures.KMLedState();
        this._motorImuMeasurement=new KMStructures.KMImuState();

        this._onInitHandler=function(connector){};
        this._onConnectHandler=function(connector){};
        this._onDisconnectHandler=function(connector){};
        this._onConnectFailureHandler=function(connector, msg){};

        this._onMotorMeasurementCB=function(){};
        this._onImuMeasurementCB=function(){};
        this._onMotorSettingCB=function(){};

        this._isInit=false;

        /**
         * _onBleMotorSettingのコマンド　モーター設定情報の通知受信時にパースする用
         * @type {{maxSpeed: number, minSpeed: number, curveType: number, acc: number, dec: number, maxTorque: number, qCurrentP: number, qCurrentI: number, qCurrentD: number, speedP: number, speedI: number, speedD: number, positionP: number, ownColor: number}}
         * @ignore
         */
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
     * @type {KMDeviceInfo}
     *
     */
    get deviceInfo(){
        return this._deviceInfo.Clone();
    }

    /**
     * 有効無効
     * @type {boolean}
     */
    get isConnect(){
        return this._deviceInfo.isConnect;
    }

    /**
     * モーターコマンド順監視用連番の発行
     * @type {number}
     */
    get createCommandID(){
       return this._commandCount=(++this._commandCount)&0b1111111111111111;//65535でループ
    }

    /**
     * isConnectの設定変更(子クラスから使用)
     * @param {boolean} bool
     * @ignore
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
     * @param {boolean} bool
     * @ignore
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
     * @type {function(KMComBase)}
     */
    set onInit(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onInitHandler=handlerFunction;
        }
    }
    /**
     * 応答・再接続に成功した
     * @type {function(KMComBase)}
     */
    set onConnect(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onConnectHandler=handlerFunction;
        }
    }
    /**
     * 応答が無くなった・切断された
     * @type {function(KMComBase)}
     */
    set onDisconnect(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onDisconnectHandler=handlerFunction;
        }
    }
    /**
     * 接続に失敗
     * @type {function(KMComBase,string)}
     */
    set onConnectFailure(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onConnectFailureHandler=handlerFunction;
        }
    }

    /**
     * モーターの回転情報callback
     * @type {function(position:number,velocity:number,torque:number)}
     */
    set onMotorMeasurement(func){
        if(typeof func==="function"){
            this._onMotorMeasurementCB=func;
        }
    }
    /**
     * モーターのジャイロ情報callback
     * @type {function({accelX:number,accelY:number,accelZ:number,temp:number,gyroX:number,gyroY:number,gyroZ:number})}
     */
    set onImuMeasurement(func){
        if(typeof func==="function"){
            this._onImuMeasurementCB=func;
        }
    }

    /**
     * モーター設定情報取得callback
     * @type {function(registerCmd:number,res:number)}
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


/**
 * @classdesc KM1コマンド送信クラス
 * @ignore
 */
class KMMotorCommandKMOne extends EventEmitter{
    /********************************************
     * 定数
     ********************************************/
    /**
     * 接続方式定数
     * @readonly
     * @enum {number}
     * @property {number} WEBBLE - 1:WEBBLE
     * @property {number} BLE - 2:BLE
     * @property {number} SERIAL - 3:SERIAL
     */
    static get KM_CONNECT_TYPE(){
        return {"WEBBLE":1,"BLE":2,"SERIAL":3};
    }


    /**
     * cmdPreparePlaybackMotionの開始位置オプション定数
     * @readonly
     * @enum {number}
     * @property {number} START_POSITION_ABS - 0:記憶された開始位置（絶対座標）からスタート
     * @property {number} START_POSITION_CURRENT - 1:現在の位置を開始位置としてスタート
     */
    static get cmdPreparePlaybackMotion_START_POSITION(){
        return{
            'START_POSITION_ABS':0,
            'START_POSITION_CURRENT':1
        };
    }
    /**
     * cmdLedのLEDの点灯状態オプション定数
     * @readonly
     * @enum {number}
     * @property {number} LED_STATE_OFF - 0:消灯
     * @property {number} LED_STATE_ON_SOLID - 1:LED点灯（点灯しっぱなし）
     * @property {number} LED_STATE_ON_FLASH - 2:LED点滅（一定間隔で点滅）
     * @property {number} LED_STATE_ON_DIM - :3LEDがゆっくり明滅する
     */
    static get cmdLed_LED_STATE(){
        return{
            'LED_STATE_OFF':0,
            'LED_STATE_ON_SOLID':1,
            'LED_STATE_ON_FLASH':2,
            'LED_STATE_ON_DIM':3
        };
    }
    /**
     * cmdCurveTypeの加減速カーブオプション定数
     * @readonly
     * @enum {number}
     * @property {number} CURVE_TYPE_NONE - 0:モーションコントロール OFF
     * @property {number} CURVE_TYPE_TRAPEZOID - 1:モーションコントロール ON （台形加減速）
     */
    static get cmdCurveType_CURVE_TYPE(){
        return{
            'CURVE_TYPE_NONE': 0,
            'CURVE_TYPE_TRAPEZOID':1
        };
    }
    /*
    * ReadRegisterで取得する時用のコマンド引数定数
    * @readonly
    * @enum {number}
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
     * @param {KMMotorCommandKMOne.KM_CONNECT_TYPE} connect_type 接続方式
     * @param {object} kmcom 通信オブジェクト {@link KMComBLE} {@link KMComWebBLE}
     * @private
     */
    constructor(connect_type,kmcom){
        super();

        /**
         * イベントハンドラタイプ定数
         * @readonly
         * @enum {string}
         */
        this.EVENT_TYPE={
            /** 初期化完了時<br>return:function({KMDeviceInfo}) */ init:"init",
            /** 接続時<br>return:function({KMDeviceInfo}) */ connect:"connect",
            /** 切断時<br>return:function({KMDeviceInfo}) */ disconnect:"disconnect",
            /** 接続に失敗時<br>return:function({KMDeviceInfo},{msg}) */ connectFailure:"connectFailure",
            /** モーター回転情報受信時<br>return:function({@link KMRotState}) */ motorMeasurement:"motorMeasurement",
            /** モーターIMU情報受信時<br>return:function({@link KMImuState}) */ imuMeasurement:"imuMeasurement"
        };
        Object.freeze(this.EVENT_TYPE);//info::後からフリーズしないとjsdocが生成されない。
        /**
         * モーターの全コマンド
         * @readonly
         * @enum {number}
         * @private
         */
        this._MOTOR_COMMAND={
            /** 最大速さを設定する */ maxSpeed:0x02,
            /** 最小速さを設定する */ minSpeed:0x03,
            /** 加減速曲線を設定する */ curveType:0x05,
            /** 加速度を設定する */ acc:0x07,
            /** 減速度を設定する */ dec:0x08,
            /** 最大トルクを設定する */ maxTorque:0x0E,
            /** q軸電流PIDゲイン(P)を設定する */ qCurrentP:0x18,
            /** q軸電流PIDゲイン(I)を設定する */ qCurrentI:0x19,
            /** q軸電流PIDゲイン(D)を設定する */ qCurrentD:0x1A,
            /** 速度PIDゲイン(P)を設定する */ speedP:0x1B,
            /** 速度PIDゲイン(I)を設定する */ speedI:0x1C,
            /** 速度PIDゲイン(D)を設定する */ speedD:0x1D,
            /** 位置PIDゲイン(P)を設定する */ positionP:0x1E,
            /** PIDゲインをリセットする */ resetPID:0x22,
            /** デバイスLEDの固有色を設定する */ ownColor:0x3A,
            /** 指定の設定値を取得する */ readRegister:0x40,
            /** 全ての設定値をフラッシュに保存する */ saveAllRegisters:0x41,
            /** 指定の設定値をリセットする */ resetRegister:0x4E,
            /** 全設定値をリセットする */ resetAllRegisters:0x4F,
            /** モーターの動作を不許可とする */ disable:0x50,
            /** モーター動作を許可する */ enable:0x51,
            /** 速度の大きさを設定する */ speed:0x58,
            /** 位置のプリセットを行う（原点設定） */ presetPosition:0x5A,
            /** 正回転する（反時計回り） */ runForward:0x60,
            /** 逆回転する（時計回り） */ runReverse:0x61,
            /** 絶対位置に移動する */ moveToPosition:0x66,
            /** 相対位置に移動する */ moveByDistance:0x68,
            /** モーターの励磁を停止する */ free:0x6C,
            /** 速度ゼロまで減速し停止する */ stop:0x6D,
            /** トルク制御を行う */ holdTorque:0x72,
            /** タスクセットを実行する */ doTaskset:0x81,
            /** モーション再生の開始地点に移動する */ preparePlaybackMotion:0x86,
            /** モーションを再生する */ startPlayback:0x87,
            /** モーション再生を停止する */ stopPlayback:0x88,
            /** キューを停止する */ pause:0x90,
            /** キューを再開する */ resume:0x91,
            /** キューを指定時間停止し再開する */ wait:0x92,
            /** キューをリセットする */ reset:0x95,
            /** タスクセットの記録を開始する */ startRecordingTaskset:0xA0,
            /** タスクセットの記録を停止する */ stopRecordingTaskset:0xA2,
            /** 指定のタスクセットを削除する */ eraseTaskset:0xA3,
            /** タスクセットを全削除する */ eraseAllTasksets:0xA4,
            /** ティーチングの開始準備を行う */ prepareTeachingMotion:0xAA,
            /** ティーチングを開始する */ startTeachingMotion:0xAB,
            /** ティーチングを停止する */ stopTeachingMotion:0xAC,
            /** ティーチングで覚えた動作を削除する */ eraseMotion:0xAD,
            /** ティーチングで覚えた全動作を削除する */ eraseAllMotion:0xAE,
            /** LEDの点灯状態をセットする */ led:0xE0,
            /** IMUの値取得(通知)を開始する */ enableIMU:0xEA,
            /** IMUの値取得(通知)を停止する */ disableIMU:0xEB,
            /** システムを再起動する */ reboot:0xF0,
            /** ファームウェアアップデートモードに入る */ enterDeviceFirmwareUpdate:0xFD
        };
        Object.freeze(this._MOTOR_COMMAND);//info::後からフリーズしないとjsdocが生成されない。

        //モーターの全コマンド（逆引用）
        this._REV_MOTOR_COMMAND={};
        Object.keys(this._MOTOR_COMMAND).forEach((k)=>{this._REV_MOTOR_COMMAND[this._MOTOR_COMMAND[k]]=k;});
        //SendNotifyPromisのリスト
        this._notifyPromisList=[];
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
            this.emit(this.EVENT_TYPE.connectFailure,connector.deviceInfo,err);
        };
        /**
         * モーター回転情報受信
         * @param {{position:number,velocity:number,torque:number}} res
         * @private
         */
        this._KMCom.onMotorMeasurement=(res)=>{
            let rotState=new KMStructures.KMRotState(res.position,res.velocity,res.torque);
            this.emit(this.EVENT_TYPE.motorMeasurement,rotState);
        };
        /**
         * モーターIMU情報受信
         * @param {function({accelX:number,accelY:number,accelZ:number,temp:number,gyroX:number,gyroY:number,gyroZ:number})} res
         *  @private
         */
        this._KMCom.onImuMeasurement=(res)=>{
            let imuState=new KMStructures.KMImuState(res.accelX,res.accelY,res.accelZ,res.temp,res.gyroX,res.gyroY,res.gyroZ);
            this.emit(this.EVENT_TYPE.imuMeasurement,imuState);
        };
        /**
         * モーター設定情報取得
         * @param {number} registerCmd
         * @param {number} res
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
     * モーターとのBLE接続が有効か
     * @readonly
     * @type {boolean}
     */
    get isConnect(){
        return this._KMCom.deviceInfo.isConnect;
    }
    /**
     * 接続方式
     * @readonly
     * @type {KMMotorCommandKMOne.KM_CONNECT_TYPE}
     */
    get connectType(){
        return this._connectType;
    }

    /**
     * デバイス情報
     * @readonly
     * @type {KMDeviceInfo}
     */
    get deviceInfo(){
        return this._KMCom.deviceInfo;
    }

    /**
     * 接続コネクター
     * @private
     * @type {KMComBLE}
     */
    get connector(){
        return  this._KMCom;
    }

    /********************************************
     * section::モーターコマンド https://document.keigan-motor.com/motor-control-command/motor_action.html
     ********************************************/

    /**
     * @summary モーター動作を不許可とする（上位命令）
     * @desc 安全用：この命令を入れるとモーターは動作しない<br>
     * コマンドはタスクセットに記録することは不可
     */
    cmdDisable(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.disable);
    }

    /**
     * @summary モーター動作を許可する（上位命令）
     * @desc 安全用：この命令を入れるとモーターは動作可能となる<br>
     * モーター起動時は disable 状態のため、本コマンドで動作を許可する必要があり<br>
     * コマンドはタスクセットに記録することは不可
     *
     */
    cmdEnable(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.enable);
    }
    /**
     * @summary 速度の大きさをセットする（単位系：RPM）
     * @param {number} speed_rpm float  [0-X rpm]　(正の数)
     */
    cmdSpeed_rpm(speed_rpm = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speed_rpm*0.10471975511965977,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.speed,buffer);
    }
    /**
     * @summary 速度の大きさをセットする（単位系：ラジアン）
     * @param {number} speed float 速度の大きさ 単位：角度（ラジアン）/秒 [0-X rps]　(正の数)
     */
    cmdSpeed(speed = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speed,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.speed,buffer);
    }

    /**
     * @summary 位置のプリセットを行う（原点設定）（単位系：ラジアン）
     * @param {number} position float 絶対角度：radians
     */
    cmdPresetPosition(position = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,parseFloat(KMUtl.toNumber(position),10));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.presetPosition,buffer);
    }

    /**
     * @summary 正回転する（反時計回り）
     * @desc cmdSpeed で保存された速度で、正回転
     */
    cmdRunForward(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.runForward);
    }

    /**
     * @summary 逆回転する（時計回り）
     * @desc cmdSpeed で保存された速度で、逆回転
     */
    cmdRunReverse(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.runReverse);
    }

    /**
     * @summary 絶対位置に移動する
     * @desc 速さは cmdSpeed で保存された速度が採用される
     * @param {number} position float 角度：radians
     */
    cmdMoveToPosition(position){
        if(position=== undefined){return;}
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,parseFloat(position,10));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.moveToPosition,buffer);
    }

    /**
     * @summary 相対位置に移動する
     * @desc 速さは cmdSpeed で保存された速度が採用される
     * @param  {number} distance float 角度：radians[左:+radians 右:-radians]
     */
    cmdMoveByDistance(distance = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,parseFloat(distance,10));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.moveByDistance,buffer);
    }

    /**
     * @summary モーターの励磁を停止する（感触は残ります）
     * @desc 完全フリー状態を再現する場合は、 cmdFree().cmdDisable() として下さい。
     */
    cmdFree(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.free);
    }

    /**
     * @summary モーターを速度ゼロまで減速し停止する
     * @desc rpm = 0 となる。
     */
    cmdStop(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.stop);
    }


    /**
     * @summary トルク制御を行う
     * @param {number} torque float トルク 単位：N・m [-X ~ + X Nm] 推奨値 0.3-0.05
     * @desc 速度や位置を同時に制御する場合は、モーター設定の 0x0E: maxTorque と 0x60: runForward 等を併用して下さい。
     *
     */
    cmdHoldTorque(torque){
        if(torque===undefined){return;}
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,parseFloat(torque,10));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.holdTorque,buffer);
    }

    /**
     * @summary 記憶したタスク（命令）のセットを実行する
     * @param {number} index int タスクセット番号（0～65535）
     * @param {number} repeating int 繰り返し回数 0は無制限
     *
     * @desc KM-1 は index: 0~49 まで。（50個のメモリバンク 各8128 Byte まで制限あり）<br>
     * タスクセットの記録は、コマンド（タスクセット）を参照下さい。 https://document.keigan-motor.com/motor-control-command/taskset.html
     */
    cmdDoTaskset(index = 0,repeating = 1){
        let buffer = new ArrayBuffer(6);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(repeating,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.doTaskset,buffer);
    };

    /**
     * @summary モーション再生の開始地点に移動する
     * @param {number} index int モーション番号（0～65535）
     * @param {number} repeating int 繰り返し回数 0は無制限
     * @param {KMMotorCommandKMOne.cmdPreparePlaybackMotion_START_POSITION} start_position int スタート位置の設定<br>
     * START_POSITION_ABS:記憶された開始位置（絶対座標）からスタート<br>
     * START_POSITION_CURRENT:現在の位置を開始位置としてスタート
     *
     *
     * @desc KM-1 は index: 0~9 まで。（10個のメモリバンク。）それぞれ 約2分記録可能。<br>
     * ティーチング（動作の記録）は、コマンド（ティーチング）を参照下さい。<br>https://document.keigan-motor.com/motor-control-command/teaching.html<br>
     *
     * @todo repeating, option についてはファームウェア未実装 2017.10.10<br>
     *  再生回数は１回固定であり、本コマンドを実行すると、記録した絶対位置の最初のポイントに移動する
     */
    cmdPreparePlaybackMotion(index = 0,repeating = 0,start_position = 0){
        let buffer = new ArrayBuffer(7);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(repeating,10)));
        new DataView(buffer).setUint8(6,Math.abs(parseInt(start_position,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.preparePlaybackMotion,buffer);
    }

    /**
     * @summary モーションを再生する
     */
    cmdStartPlayback(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.startPlayback);
    }

    /**
     * @summary モーション再生を停止する
     */
    cmdStopPlayback(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.stopPlayback);
    }

    //---------------------//
    // section::キュー操作
    //---------------------//
    /**
     * @summary キューを一時停止する
     */
    cmdPause(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.pause);
    }

    /**
     * @summary キューを再開する（蓄積されたタスクを再開）
     */
    cmdResume(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.resume);
    }

    /**
     * @summary キューを指定時間停止し再開する
     * @desc cmdPause（キュー停止）を実行し、指定時間（ミリ秒）経過後、自動的に cmdResume（キュー再開） を行います。
     * @param {number} time 停止時間[msec]
     */
    cmdWait(time = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setUint32(0,Math.abs(parseInt(time,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.wait,buffer);
    }

    /**
     * @summary キューをリセットする
     */
    cmdReset(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.reset);
    }

    //---------------------//
    // section::タスクセット
    //---------------------//

    /**
     * @summary タスク（命令）のセットの記録を開始する
     * @desc 記憶するインデックスのメモリはコマンド：eraseTaskset により予め消去されている必要があり
     * @param {number} index int インデックス KM-1 の場合、インデックスの値は 0～49 （計50個記録）
     */
    cmdStartRecordingTaskSet(index = 0){
        let buffer = new ArrayBuffer(2);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.startRecordingTaskset,buffer);
    }

    /**
     * @summary タスクセットの記録を停止する
     * @desc startRecordingTaskset 実施中のみ有効
     */
    cmdStopRecordingTaskset(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.stopRecordingTaskset);
    }

    /**
     * @summary 指定のインデックスのタスクセットを消去する
     * @param {number} index int インデックス
     */
    cmdEraseTaskset(index = 0){
        let buffer = new ArrayBuffer(2);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.eraseTaskset,buffer);
    }

    /**
     * @summary 全てのタスクセットを消去する
     */
    cmdEraseAllTaskset(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.eraseAllTasksets);
    }

    //---------------------//
    // section::ティーチング
    //---------------------//
    
    /**
     * @summary インデックスと記録時間[msec]を指定し、ティーチングの開始準備を行う。
     * @param {number} index int インデックス
     * @param {number} time int 記録時間 [msec 0-65408]
     *
     * @desc KM-1 の場合、インデックスの値は 0～9 （計10個記録）となる。記録時間は 65408 [msec] を超えることはできない
     *       記憶するインデックスのメモリはbleEraseMotion により予め消去されている必要がある
     *
     */
    cmdPrepareTeachingMotion(index = 0,lengthRecordingTime = 30000){
        let buffer = new ArrayBuffer(6);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(lengthRecordingTime,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.prepareTeachingMotion,buffer);
    }

    /**
     * @summary 直前に行った prepareTeachingMotion の条件でティーチングを開始する。
     * blePrepareTeachingMotion を実行した直後のみ有効。
     */
    cmdStartTeachingMotion(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.startTeachingMotion);
    }

    /**
     * @summary 実行中のティーチングを停止する
     */
    cmdStopTeachingMotion(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.stopTeachingMotion);
    }

    /**
     * @summary 指定したインデックスのモーションを消去する
     * @param {number} index int インデックス
     *
     * @desc KM-1 の場合、インデックスの値は 0～9 （計10個記録）となる
     *
     */
    cmdEraseMotion(index = 0){
        let buffer = new ArrayBuffer(2);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.eraseMotion,buffer);
    }

    /**
     * @summary 全てのモーションを消去する
     */
    cmdEraseAllMotion(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.eraseAllMotion);
    }

    //---------------------//
    // section::LED
    //---------------------//
    /**
     * @summary LEDの点灯状態をセットする
     * @param {KMMotorCommandKMOne.cmdLed_LED_STATE} cmdLed_LED_STATE int 点灯状態<br>
     *   LED_STATE_OFF:LED消灯<br>
     *   LED_STATE_ON_SOLID:LED点灯<br>
     *   LED_STATE_ON_FLASH:LED点滅（一定間隔で点滅）<br>
     *   LED_STATE_ON_DIM:LEDがゆっくり明滅する
     * @param {number} red int 0-255
     * @param {number} green int 0-255
     * @param {number} blue int 0-255
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
     * @summary IMU(ジャイロ)の値取得(通知)を開始する (BLE専用コマンド)
     *
     * @desc 本コマンドを実行すると、IMUのデータはBLEのキャラクタリスティクスMOTOR_IMU_MEASUREMENTに通知される<br>
     * MOTOR_IMU_MEASUREMENTのnotifyはイベントタイプ KMMotorCommandKMOne.EVENT_TYPE.imuMeasurement に通知
     */
    cmdEnableIMU(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.enableIMU);
    }

    /**
     * @summary IMU(ジャイロ)の値取得(通知)を停止する
     */
    cmdDisableIMU(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.disableIMU);
    }

    //---------------------//
    // システム
    //---------------------//
    /**
     * @summary システムを再起動する
     * @desc BLEに接続していた場合、切断してから再起動
     */
    cmdReboot(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.reboot);
    }

    /**
     * @summary ファームウェアアップデートモードに入る
     * @desc ファームウェアをアップデートするためのブートローダーモードに入る。（システムは再起動される。）
     */
    cmdEnterDeviceFirmwareUpdate(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.enterDeviceFirmwareUpdate);
    }

    //---------------------//
    // モーター設定　MOTOR_SETTING
    //---------------------//
    /**
     * @summary モーターの最大速さを設定する
     * @param {number} maxSpeed float 最大速さ [radian / second]（正の値）
     */
    cmdMaxSpeed(maxSpeed){
        if(maxSpeed===undefined){return;}
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(maxSpeed,10)));//todo::NaNが返る可能性 parseFloat("aaa",10)===NaN
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.maxSpeed,buffer);
    }

    /**
     * @summary モーターの最小速さを設定する
     * @param {number} maxSpeed float 最小速さ [radian / second]（正の値）
     * @desc minSpeed は、blePreparePlaybackMotion 実行の際、開始地点に移動する速さとして使用される。通常時運転では使用されない。
     */
    cmdMinSpeed(minSpeed){
        if(minSpeed===undefined){return;}
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(minSpeed,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.minSpeed,buffer);
    }

    /**
     * @summary 加減速曲線を指定する（モーションコントロールの設定）
     * @param {KMMotorCommandKMOne.cmdCurveType_CURVE_TYPE} cmdCurveType_CURVE_TYPE int 加減速カーブオプション<br>
     *      CURVE_TYPE_NONE:0 モーションコントロール OFF<br>
     *      CURVE_TYPE_TRAPEZOID:1 モーションコントロール ON （台形加減速）
     */
    cmdCurveType(cmdCurveType_CURVE_TYPE = 0){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,Math.abs(parseInt(cmdCurveType_CURVE_TYPE,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.curveType,buffer);
    }

    /**
     * @summary モーターの加速度を設定する
     * @param {number} acc float 加速度 0-200 [radian / second^2]（正の値）
     * @desc acc は、モーションコントロール ON の場合、加速時に使用されます。（加速時の直線の傾き）
     */
    cmdAcc(acc = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(acc,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.acc,buffer);
    }

    /**
     * @summary モーターの減速度を設定する
     * @param {number} dec float 減速度 0-200 [radian / second^2]（正の値）
     * @desc dec は、モーションコントロール ON の場合、減速時に使用されます。（減速時の直線の傾き）
     */
    cmdDec(dec = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(dec,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.dec,buffer);
    }

    /**
     * @summary モーターの最大トルク（絶対値）を設定する
     * @param {number} maxTorque float 最大トルク [N*m]（正の値）
     *
     * @desc maxTorque を設定することにより、トルクの絶対値が maxTorque を超えないように運転します。<br>
     * maxTorque = 0.1 [N*m] の後に runForward （正回転）を行った場合、0.1 N*m を超えないようにその速度をなるだけ維持する。<br>
     * ただし、トルクの最大値制限により、システムによっては制御性（振動）が悪化する可能性がある。
     *
     */
    cmdMaxTorque(maxTorque){
        if(maxTorque===undefined){return;}
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(maxTorque,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.maxTorque,buffer);
    }

    /**
     * @summary モーターのq軸電流PIDコントローラのP（比例）ゲインを設定する
     * @param {number} qCurrentP float q電流Pゲイン（正の値）
     */
    cmdQCurrentP(qCurrentP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentP,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.qCurrentP,buffer);
    }

    /**
     * @summary モーターのq軸電流PIDコントローラのP（比例）ゲインを設定する
     * @param {number} qCurrentI float q電流Iゲイン（正の値）
     */
    cmdQCurrentI(qCurrentI){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentI,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.qCurrentI,buffer);
    }

    /**
     * @summary モーターのq軸電流PIDコントローラのD（微分）ゲインを設定する
     * @param {number} qCurrentD float q電流Dゲイン（正の値）
     */
    cmdQCurrentD(qCurrentD){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentD,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.qCurrentD,buffer);
    }

    /**
     * @summary モーターのq軸電流PIDコントローラのD（微分）ゲインを設定する
     * @param {number} speedP float 速度Pゲイン（正の値）
     */
    cmdSpeedP(speedP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedP,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.speedP,buffer);
    }

    /**
     * @summary モーターの速度PIDコントローラのI（積分）ゲインを設定する
     * @param {number} speedI float 速度Iゲイン（正の値）
     */
    cmdSpeedI(speedI){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedI,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.speedI,buffer);
    }

    /**
     * @summary モーターの速度PIDコントローラのD（微分）ゲインを設定する
     * @param {number} speedD float 速度Dゲイン（正の値）
     */
    cmdSpeedD(speedD){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedD,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.speedD,buffer);
    }

    /**
     * @summary モーターの位置PIDコントローラのP（比例）ゲインを設定する
     * @param {number} positionP float 位置Pゲイン（正の値）
     */
    cmdPositionP(positionP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(positionP,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.positionP,buffer);
    }

    /**
     * @summary 全てのPIDパラメータをリセットしてファームウェアの初期設定に戻す
     * @desc qCurrentP, qCurrentI,  qCurrentD, speedP, speedI, speedD, positionP をリセットします
     *
     */
    cmdResetPID(){
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.resetPID);
    }

    /**
     * @summary モーターの起動時固有LEDカラーを設定する
     * @param {number} red int 0-255
     * @param {number} green int 0-255
     * @param {number} blue int 0-255
     *
     * @desc ownColor はアイドル時の固有LEDカラー。<br>saveAllSettingsを実行し、再起動後に初めて反映される。<br>
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
     * @summary 指定した設定値を取得 (BLE専用コマンド)
     * @param {number | array} registers <int | []> 取得するプロパティのコマンド(レジスタ番号)値
     * @returns {Promise.<int | array>} 取得した値 <br>registersがint=レジスタ値のプリミティブ値 <br>registersがArray=レジスタ値のオブジェクト
     *
     * @none 取得する値はコマンド実行後にBLEのキャラクタリスティクスMOTOR_SETTINGに通知される。<br>
     *       それを拾ってpromiseオブジェクトののresolveに返して処理を繋ぐ<br>
     *       MOTOR_SETTINGのnotifyは_onBleMotorSettingで取得
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
     * @returns {Promise.<array>}
     */
    cmdReadAllRegister(){
       let cm= this.constructor.cmdReadRegister_COMMAND;
        let allcmds=[];
        Object.keys(cm).forEach((k)=>{allcmds.push(cm[k]);});

       return this.cmdReadRegister(allcmds);
    }
    //////保存
    /**
     * @summary 全ての設定値をフラッシュメモリに保存する
     * @desc 本コマンドを実行しない限り、設定値はモーターに永久的に保存されない(再起動で消える)
     */
    cmdSaveAllRegisters(){
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.saveAllRegisters);
    }

    //////リセット
    /**
     * @summary 指定したレジスタをファームウェアの初期値にリセットする
     * @param {KMMotorCommandKMOne.cmdReadRegister_COMMAND} register 初期値にリセットするコマンド(レジスタ)値
     */
    cmdResetRegister(register){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(register,10));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.resetRegister,buffer);
    }
    /**
     * @summary 全てのレジスタをファームウェアの初期値にリセットする
     * @desc bleSaveAllRegistersを実行しない限り、リセット値はモーターに永久的に保存されない(再起動で消える)
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
 * @private
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMTJlZTUxNGNkYWRmYmEyNzVlYzIiLCJ3ZWJwYWNrOi8vLy4vc3JjL0tNU3RydWN0dXJlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvS01VdGwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0tNQ29tV2ViQkxFLmpzIiwid2VicGFjazovLy8uL3NyYy9LTUNvbm5lY3RvckJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvS01Nb3Rvck9uZVdlYkJMRS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvS01Db21CYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9LTU1vdG9yQ29tbWFuZEtNT25lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGlCQUFpQixRQUFRO0FBQ3pCO0FB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O0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDs7O0FBR0E7QUFDQTs7QUFFQSw0Qjs7Ozs7Ozs4Q0N2YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDakJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7O0FBRTVDOzs7Ozs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQzs7Ozs7OztBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7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QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLHFDQUFxQztBQUNwRDtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBLDZFQUE2RTtBQUM3RTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLDRDQUE0QztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQSxlQUFlLGVBQWU7QUFDOUIsaUJBQWlCLHNCQUFzQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCLG1CQUFtQjtBQUMvQztBQUNBO0FBQ0EsMklBQTJJO0FBQzNJO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSx1SUFBdUk7QUFDdkk7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0EsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MscUJBQXFCOztBQUUzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDRDQUE0QztBQUMzRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHlDQUF5QztBQUN6QztBQUNBLG9CQUFvQixxQkFBcUI7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0MseURBQXlEO0FBQzNGLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4QkFBOEIsUUFBUTtBQUN0Qzs7QUFFQTtBQUNBLG9CQUFvQiwwQkFBMEI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOzs7Ozs7O0FDcDlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSCxvQkFBb0IsU0FBUztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiJpbmRleEJyb3dzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAxMmVlNTE0Y2RhZGZiYTI3NWVjMiIsIi8qKipcbiAqIEtNU3RydWN0dXJlcy5qc1xuICogdmFyIDAuMS4wIGFscGhhXG4gKiBDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4ndXNlIHN0cmljdCc7XG5sZXQgS01VdGwgPSByZXF1aXJlKCcuL0tNVXRsJyk7XG5cblxuLyoqXG4gKiBAY2xhc3NkZXNjIOani+mAoOS9k+OBruWfuuW6leOCr+ODqeOCuVxuICogQGlnbm9yZVxuICovXG5jbGFzcyBLTVN0cnVjdHVyZUJhc2V7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICB9XG4gICAgLyoqXG4gICAgICog5ZCM44GY5YCk44KS5oyB44Gk44GL44Gu5q+U6LyDXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHRhciDmr5TovIPjgZnjgovmp4vpgKDkvZNcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g57WQ5p6cXG4gICAgICovXG4gICAgRVEgKHRhcikge1xuICAgICAgICBpZighIHRhciApe3JldHVybiBmYWxzZTt9XG4gICAgICAgIGlmKHRoaXMuY29uc3RydWN0b3I9PT10YXIuY29uc3RydWN0b3Ipe1xuICAgICAgICAgICAgaWYodGhpcy5HZXRWYWxBcnJheSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuR2V0VmFsQXJyYXkoKS50b1N0cmluZygpPT09dGFyLkdldFZhbEFycmF5KCkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHRoaXMuR2V0VmFsT2JqKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5HZXRWYWxPYmooKSk9PT1KU09OLnN0cmluZ2lmeSh0YXIuR2V0VmFsT2JqKCkpOy8vIGJhZDo66YGF44GEXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOikh+ijvVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IOikh+ijveOBleOCjOOBn+ani+mAoOS9k1xuICAgICAqL1xuICAgIENsb25lICgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IHRoaXMuY29uc3RydWN0b3IoKSx0aGlzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICog5YCk44Gu5Y+W5b6X77yIT2Jq77yJXG4gICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgKi9cbiAgICBHZXRWYWxPYmogKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSx0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlgKTjga7lj5blvpfvvIjphY3liJfvvIlcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgR2V0VmFsQXJyYXkgKCkge1xuICAgICAgICBsZXQgaz1PYmplY3Qua2V5cyh0aGlzKTtcbiAgICAgICAgbGV0IHI9W107XG4gICAgICAgIGZvcihsZXQgaT0wO2k8ay5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIHIucHVzaCh0aGlzW2tbaV1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG59XG5cblxuLyoqXG4gKiBAY2xhc3NkZXNjIFhZ5bqn5qiZ44Gu5qeL6YCg5L2T44Kq44OW44K444Kn44Kv44OIXG4gKiBAaWdub3JlXG4gKi9cbmNsYXNzIEtNVmVjdG9yMiBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHg9MCwgeT0wKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog55u45a++5L2N572u44G456e75YuVXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR5XG4gICAgICovXG4gICAgTW92ZSAoZHggPTAsIGR5ID0gMCkge1xuICAgICAgICB0aGlzLnggKz0gZHg7XG4gICAgICAgIHRoaXMueSArPSBkeTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMueCuemWk+OBrui3nembolxuICAgICAqIEBwYXJhbSB7S01WZWN0b3IyfSB2ZWN0b3IyXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBEaXN0YW5jZSAodmVjdG9yMikge1xuICAgICAgICBpZiAoISh2ZWN0b3IyIGluc3RhbmNlb2YgS01WZWN0b3IyKSkge3JldHVybjt9XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coKHRoaXMueC12ZWN0b3IyLngpLDIpICsgTWF0aC5wb3coKHRoaXMueS12ZWN0b3IyLnkpLDIpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMueCuemWk+OBruinkuW6plxuICAgICAqIEBwYXJhbSB7S01WZWN0b3IyfSB2ZWN0b3IyXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBSYWRpYW4gKHZlY3RvcjIpIHtcbiAgICAgICAgaWYgKCEodmVjdG9yMiBpbnN0YW5jZW9mIEtNVmVjdG9yMikpIHtyZXR1cm47fVxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnktdmVjdG9yMi55LHRoaXMueC12ZWN0b3IyLngpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAwLDDjgYvjgonjga7ot53pm6JcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIERpc3RhbmNlRnJvbVplcm8oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3codGhpcy54LDIpICsgTWF0aC5wb3codGhpcy55LDIpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMCww44GL44KJ44Gu6KeS5bqmXG4gICAgICogQHJldHVybnMge251bWJlcn0gcmFkaWFuXG4gICAgICovXG4gICAgUmFkaWFuRnJvbVplcm8oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueSx0aGlzLngpO1xuICAgIH1cbn1cblxuLy8gLyoqXG4vLyAgKiBAY2xhc3NkZXNjIFhZWiAz5qyh5YWD44OZ44Kv44OI44OrXG4vLyAgKi9cbi8vIGNsYXNzIEtNVmVjdG9yMyBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4vLyAgICAgLyoqXG4vLyAgICAgICpcbi8vICAgICAgKiBAcGFyYW0geFxuLy8gICAgICAqIEBwYXJhbSB5XG4vLyAgICAgICogQHBhcmFtIHpcbi8vICAgICAgKi9cbi8vICAgICBjb25zdHJ1Y3Rvcih4LHkseikge1xuLy8gICAgICAgICBzdXBlcigpO1xuLy8gICAgICAgICB0aGlzLnggPSB4P3g6MDtcbi8vICAgICAgICAgdGhpcy55ID0geT95OjA7XG4vLyAgICAgICAgIHRoaXMueiA9IHo/ejowO1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiDnm7jlr77kvY3nva7jgbjnp7vli5Vcbi8vICAgICAgKiBAcGFyYW0ge251bWJlcn0gZHhcbi8vICAgICAgKiBAcGFyYW0ge251bWJlcn0gZHlcbi8vICAgICAgKiBAcGFyYW0ge251bWJlcn0gZHpcbi8vICAgICAgKiBAY29uc3RydWN0b3Jcbi8vICAgICAgKi9cbi8vICAgICBNb3ZlIChkeCwgZHksIGR6KSB7XG4vLyAgICAgICAgIHRoaXMueCArPSBkeDtcbi8vICAgICAgICAgdGhpcy55ICs9IGR5O1xuLy8gICAgICAgICB0aGlzLnogKz0gZHo7XG4vLyAgICAgfVxuLy8gICAgIC8qKlxuLy8gICAgICAqIDLngrnplpPjga7ot53pm6Jcbi8vICAgICAgKiBAcGFyYW0ge0tNVmVjdG9yM30gdmVjdG9yM1xuLy8gICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4vLyAgICAgICogQGNvbnN0cnVjdG9yXG4vLyAgICAgICovXG4vLyAgICAgRGlzdGFuY2UgKHZlY3RvcjMpIHtcbi8vICAgICAgICAgaWYgKCEodmVjdG9yMyBpbnN0YW5jZW9mIEtNVmVjdG9yMykpIHtyZXR1cm47fVxuLy8gICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KCh0aGlzLngtdmVjdG9yMy54KSwyKSArIE1hdGgucG93KCh0aGlzLnktdmVjdG9yMy55KSwyKSsgTWF0aC5wb3coKHRoaXMuei12ZWN0b3IzLnopLDIpKTtcbi8vICAgICB9XG4vLyAgICAgLy8gLyoqXG4vLyAgICAgLy8gICogMueCuemWk+OBruinkuW6pijlm57ou6LmlrnlkJHjga7mg4XloLHjgarjgZcpXG4vLyAgICAgLy8gICogIEBwYXJhbSB7S01WZWN0b3IzfSB2ZWN0b3IzXG4vLyAgICAgLy8gICogQHJldHVybnMge251bWJlcn1cbi8vICAgICAvLyAgKiBAY29uc3RydWN0b3Jcbi8vICAgICAvLyAgKi9cbi8vICAgICAvLyBSYWRpYW4gKHZlY3RvcjMpIHtcbi8vICAgICAvLyAgICAgaWYgKCEodmVjdG9yMyBpbnN0YW5jZW9mIEtNVmVjdG9yMykpIHtyZXR1cm47fVxuLy8gICAgIC8vICAgICAvL3RvZG86OjLngrnplpPjga7op5LluqYo5Zue6Lui5pa55ZCR44Gu5oOF5aCx44Gq44GXKVxuLy8gICAgIC8vIH1cbi8vICAgICAvKipcbi8vICAgICAgKiAwLDAsMOOBi+OCieOBrui3nembolxuLy8gICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4vLyAgICAgICogQGNvbnN0cnVjdG9yXG4vLyAgICAgICovXG4vLyAgICAgRGlzdGFuY2VGcm9tWmVybyAoKSB7XG4vLyAgICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3codGhpcy54LDIpICsgTWF0aC5wb3codGhpcy55LDIpKyBNYXRoLnBvdyh0aGlzLnosMikpO1xuLy8gICAgIH1cbi8vXG4vLyAgICAgLy8gLyoqXG4vLyAgICAgLy8gICogMCwwLDDjgYvjgonjga7op5LluqZcbi8vICAgICAvLyAgKiBAcmV0dXJucyB7bnVtYmVyfSByYWRpYW5cbi8vICAgICAvLyAgKiBAY29uc3RydWN0b3Jcbi8vICAgICAvLyAgKi9cbi8vICAgICAvLyBSYWRpYW5Gcm9tWmVybyAoKSB7XG4vLyAgICAgLy8gICAgIC8vdG9kbzo6MCwwLDDjgYvjgonjga7op5LluqZcbi8vICAgICAvLyB9XG4vLyB9XG5cblxuLyoqXG4gKiBAY2xhc3NkZXNjIOOCuOODo+OCpOODreOCu+ODs+OCteODvOWApFxuICovXG5jbGFzcyBLTUltdVN0YXRlIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY2NlbFgg5Yqg6YCf5bqmKHgpIFvCsSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY2NlbFkg5Yqg6YCf5bqmKHkpIFvCsSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY2NlbFog5Yqg6YCf5bqmKHopIFvCsSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0ZW1wIOa4qeW6piBDXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGd5cm9YIOinkumAn+W6pih4KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZ3lyb1kg6KeS6YCf5bqmKHkpIFvCsSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBneXJvWiDop5LpgJ/luqYoeikgW8KxIDFdXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKGFjY2VsWCwgYWNjZWxZLCBhY2NlbFosIHRlbXAsIGd5cm9YLCBneXJvWSwgZ3lyb1ogKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5hY2NlbFg9IEtNVXRsLnRvTnVtYmVyKGFjY2VsWCk7XG4gICAgICAgIHRoaXMuYWNjZWxZPSBLTVV0bC50b051bWJlcihhY2NlbFkpO1xuICAgICAgICB0aGlzLmFjY2VsWj0gS01VdGwudG9OdW1iZXIoYWNjZWxaKTtcbiAgICAgICAgdGhpcy50ZW1wPSBLTVV0bC50b051bWJlcih0ZW1wKTtcbiAgICAgICAgdGhpcy5neXJvWD0gS01VdGwudG9OdW1iZXIoZ3lyb1gpO1xuICAgICAgICB0aGlzLmd5cm9ZPSBLTVV0bC50b051bWJlcihneXJvWSk7XG4gICAgICAgIHRoaXMuZ3lyb1o9IEtNVXRsLnRvTnVtYmVyKGd5cm9aKTtcbiAgICB9XG59XG4vKipcbiAqIEtFSUdBTuODouODvOOCv+ODvExFROOAgOeCueeBr+ODu+iJsueKtuaFi1xuICogU3RhdGUgTU9UT1JfTEVEX1NUQVRFXG4gKiBjb2xvclIgMC0yNTVcbiAqIGNvbG9yRyAwLTI1NVxuICogY29sb3JCIDAtMjU1XG4gKiAqL1xuLyoqXG4gKiBAY2xhc3NkZXNjIOODouODvOOCv+ODvExFROOAgOeCueeBr+ODu+iJsueKtuaFi1xuICovXG5jbGFzcyBLTUxlZFN0YXRlIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga5MRUTnirbmhYtcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9MRURfU1RBVEVfT0ZGIC0gMDpMRUTmtojnga9cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTEVEX1NUQVRFX09OX1NPTElEIC0gMTpMRUTngrnnga9cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTEVEX1NUQVRFX09OX0ZMQVNIIC0gMjpMRUTngrnmu4XvvIjkuIDlrprplpPpmpTjgafngrnmu4XvvIlcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTEVEX1NUQVRFX09OX0RJTSAtIDM6TEVE44GM44KG44Gj44GP44KK6Lyd5bqm5aSJ5YyW44GZ44KLXG4gICAgICovXG4gICAgc3RhdGljIGdldCBNT1RPUl9MRURfU1RBVEUoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgXCJNT1RPUl9MRURfU1RBVEVfT0ZGXCI6MCxcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09OX1NPTElEXCI6MSxcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09OX0ZMQVNIXCI6MixcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09OX0RJTVwiOjNcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtLTUxlZFN0YXRlLk1PVE9SX0xFRF9TVEFURX0gc3RhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY29sb3JSIGludCBbMC0yNTVdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbG9yRyBpbnQgWzAtMjU1XVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb2xvckIgaW50IFswLTI1NV1cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdGF0ZSxjb2xvclIsY29sb3JHLGNvbG9yQikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnN0YXRlPUtNVXRsLnRvTnVtYmVyKHN0YXRlKTtcbiAgICAgICAgdGhpcy5jb2xvclI9S01VdGwudG9OdW1iZXIoY29sb3JSKTtcbiAgICAgICAgdGhpcy5jb2xvckc9S01VdGwudG9OdW1iZXIoY29sb3JHKTtcbiAgICAgICAgdGhpcy5jb2xvckI9S01VdGwudG9OdW1iZXIoY29sb3JCKTtcbiAgICB9XG59XG5cbi8qKlxuICogQGNsYXNzZGVzYyDjg6Ljg7zjgr/jg7zlm57ou6Lmg4XloLFcbiAqL1xuY2xhc3MgS01Sb3RTdGF0ZSBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICog5pyA5aSn44OI44Or44Kv5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE1BWF9UT1JRVUUoKXtcbiAgICAgICAgcmV0dXJuIDAuMzsvLzAuMyBO44O7bVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOacgOWkp+mAn+W6puWumuaVsChycG0pXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE1BWF9TUEVFRF9SUE0oKXtcbiAgICAgICAgcmV0dXJuIDMwMDsvLzMwMHJwbVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDmnIDlpKfpgJ/luqblrprmlbAocmFkaWFuL3NlYylcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgTUFYX1NQRUVEX1JBRElBTigpe1xuICAgICAgICByZXR1cm4gS01VdGwucnBtVG9SYWRpYW5TZWMoMzAwKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICog5pyA5aSn5bqn5qiZ5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE1BWF9QT1NJVElPTigpe1xuICAgICAgICByZXR1cm4gMypNYXRoLnBvdygxMCwzOCk7Ly9pbmZvOjrjgIxyZXR1cm7jgIAzZSszOOOAjeOBr21pbmlmeeOBp+OCqOODqeODvFxuICAgICAgICAvL3JldHVybuOAgDNlKzM4Oy8vcmFkaWFuIDRieXRlIGZsb2F044CAMS4xNzU0OTQgMTAtMzggIDwgMy40MDI4MjMgMTArMzhcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiDluqfmqJlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmVsb2NpdHkg6YCf5bqmXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvcnF1ZSDjg4jjg6vjgq9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbiwgdmVsb2NpdHksIHRvcnF1ZSkge1xuICAgICAgICAvL+acieWKueahgeaVsCDlsI/mlbDnrKwz5L2NXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBNYXRoLmZsb29yKEtNVXRsLnRvTnVtYmVyKHBvc2l0aW9uKSoxMDApLzEwMDtcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IE1hdGguZmxvb3IoS01VdGwudG9OdW1iZXIodmVsb2NpdHkpKjEwMCkvMTAwO1xuICAgICAgICB0aGlzLnRvcnF1ZSA9IE1hdGguZmxvb3IoS01VdGwudG9OdW1iZXIodG9ycXVlKSoxMDAwMCkvMTAwMDA7XG4gICAgfVxufVxuXG5cbi8qKlxuICogQGNsYXNzZGVzYyDjg4fjg5DjgqTjgrnmg4XloLFcbiAqL1xuY2xhc3MgS01EZXZpY2VJbmZvIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5LTV9DT05ORUNUX1RZUEV9IHR5cGUg5o6l57aa5pa55byPXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIOODh+ODkOOCpOOCuVVVSURcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSDjg6Ljg7zjgr/jg7zlkI1cbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzQ29ubmVjdCDmjqXntprnirbmhYtcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWFudWZhY3R1cmVyTmFtZSDoo73pgKDkvJrnpL7lkI1cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaGFyZHdhcmVSZXZpc2lvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaXJtd2FyZVJldmlzaW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IodHlwZT0wLGlkPVwiXCIsbmFtZT1cIlwiLGlzQ29ubmVjdD1mYWxzZSxtYW51ZmFjdHVyZXJOYW1lPW51bGwsaGFyZHdhcmVSZXZpc2lvbj1udWxsLGZpcm13YXJlUmV2aXNpb249bnVsbCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGU9dHlwZTtcbiAgICAgICAgdGhpcy5pZD1pZDtcbiAgICAgICAgdGhpcy5uYW1lPW5hbWU7XG4gICAgICAgIHRoaXMuaXNDb25uZWN0PWlzQ29ubmVjdDtcbiAgICAgICAgdGhpcy5tYW51ZmFjdHVyZXJOYW1lPW1hbnVmYWN0dXJlck5hbWU7XG4gICAgICAgIHRoaXMuaGFyZHdhcmVSZXZpc2lvbj1oYXJkd2FyZVJldmlzaW9uO1xuICAgICAgICB0aGlzLmZpcm13YXJlUmV2aXNpb249ZmlybXdhcmVSZXZpc2lvbjtcblxuICAgIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBLTVN0cnVjdHVyZUJhc2U6S01TdHJ1Y3R1cmVCYXNlLFxuICAgIEtNVmVjdG9yMjpLTVZlY3RvcjIsXG4gICAgLy9LTVZlY3RvcjM6S01WZWN0b3IzLFxuICAgIEtNSW11U3RhdGU6S01JbXVTdGF0ZSxcbiAgICBLTUxlZFN0YXRlOktNTGVkU3RhdGUsXG4gICAgS01Sb3RTdGF0ZTpLTVJvdFN0YXRlLFxuICAgIEtNRGV2aWNlSW5mbzpLTURldmljZUluZm9cbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9LTVN0cnVjdHVyZXMuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqKlxuICogS01VdGwuanNcbiAqIHZlcnNpb24gMC4xLjAgYWxwaGFcbiAqIENDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQGNsYXNzZGVzYyDjg6bjg7zjg4bjgqPjg6rjg4bjgqNcbiAqL1xuY2xhc3MgS01VdGx7XG5cbiAgICAvKipcbiAgICAgKiDmlbDlgKTjgavjgq3jg6Pjgrnjg4jjgZnjgovplqLmlbBcbiAgICAgKiDmlbDlgKTku6XlpJbjga8w44KS6L+U44GZPGJyPlxuICAgICAqIEluZmluaXR544KCMOOBqOOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWxcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVmYXVsdHZhbCB2YWzjgYzmlbDlgKTjgavlpInmj5vlh7rmnaXjgarjgYTloLTlkIjjga7jg4fjg5Xjgqnjg6vjg4hcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyB0b051bWJlcih2YWwsIGRlZmF1bHR2YWwgPSAwKSB7XG4gICAgICAgIGxldCB2ID0gcGFyc2VGbG9hdCh2YWwsIDEwKTtcbiAgICAgICAgcmV0dXJuIChpc05hTih2KSB8fCB2YWwgPT09IEluZmluaXR5ID8gZGVmYXVsdHZhbCA6IHYpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDop5Lluqbjga7ljZjkvY3lpInmj5vjgIBkZWdyZWUgPj4gcmFkaWFuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlZ3JlZSDluqZcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSByYWRpYW5cbiAgICAgKi9cbiAgICBzdGF0aWMgZGVncmVlVG9SYWRpYW4oZGVncmVlKSB7XG4gICAgICAgIHJldHVybiBkZWdyZWUgKiAwLjAxNzQ1MzI5MjUxOTk0MzI5NTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICog6KeS5bqm44Gu5Y2Y5L2N5aSJ5o+b44CAcmFkaWFuID4+IGRlZ3JlZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpYW4gcmFkaWFu6KeSXG4gICAgICogQHJldHVybnMge251bWJlcn0g5bqmXG4gICAgICovXG4gICAgc3RhdGljIHJhZGlhblRvRGVncmVlKHJhZGlhbikge1xuICAgICAgICByZXR1cm4gcmFkaWFuIC8gMC4wMTc0NTMyOTI1MTk5NDMyOTU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIOmAn+W6piBycG0gLT5yYWRpYW4vc2VjIOOBq+WkieaPm1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBycG1cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSByYWRpYW4vc2VjXG4gICAgICovXG4gICAgc3RhdGljIHJwbVRvUmFkaWFuU2VjKHJwbSkge1xuICAgICAgICAvL+mAn+W6piBycG0gLT5yYWRpYW4vc2VjKE1hdGguUEkqMi82MClcbiAgICAgICAgcmV0dXJuIHJwbSAqIDAuMTA0NzE5NzU1MTE5NjU5Nzc7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiAy54K56ZaT44Gu6Led6Zui44Go6KeS5bqm44KS5rGC44KB44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZyb21feFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tX3lcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9feFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b195XG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgdHdvUG9pbnREaXN0YW5jZUFuZ2xlKGZyb21feCwgZnJvbV95LCB0b194LCB0b195KSB7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhmcm9tX3ggLSB0b194LCAyKSArIE1hdGgucG93KGZyb21feSAtIHRvX3ksIDIpKTtcbiAgICAgICAgbGV0IHJhZGlhbiA9IE1hdGguYXRhbjIoZnJvbV95IC0gdG9feSwgZnJvbV94IC0gdG9feCk7XG4gICAgICAgIHJldHVybiB7ZGlzdDogZGlzdGFuY2UsIHJhZGk6IHJhZGlhbiwgZGVnOiBLTVV0bC5yYWRpYW5Ub0RlZ3JlZShyYWRpYW4pfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQCMgaW5mbzo6IEJMReOBrkRFVklDRSBJTkZPUk1BVElPTiBTRVJWSUNF44Gu44OR44O844K544GrS01Db21CTEUuanPjgafkuLvjgavkvb/nlKhcbiAgICAgKiB1dGYuanMgLSBVVEYtOCA8PT4gVVRGLTE2IGNvbnZlcnRpb25cbiAgICAgKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBAcGFyYW0gYXJyYXlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQGRlc2NcbiAgICAgKiBDb3B5cmlnaHQgKEMpIDE5OTkgTWFzYW5hbyBJenVtbyA8aXpAb25pY29zLmNvLmpwPlxuICAgICAqIFZlcnNpb246IDEuMFxuICAgICAqIExhc3RNb2RpZmllZDogRGVjIDI1IDE5OTlcbiAgICAgKiBUaGlzIGxpYnJhcnkgaXMgZnJlZS4gIFlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQuXG4gICAgICovXG4gICAgc3RhdGljIFV0ZjhBcnJheVRvU3RyKGFycmF5KSB7XG4gICAgICAgIGxldCBvdXQsIGksIGxlbiwgYztcbiAgICAgICAgbGV0IGNoYXIyLCBjaGFyMztcblxuICAgICAgICBvdXQgPSBcIlwiO1xuICAgICAgICBsZW4gPSBhcnJheS5sZW5ndGg7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICB3aGlsZShpIDwgbGVuKSB7XG4gICAgICAgICAgICBjID0gYXJyYXlbaSsrXTtcbiAgICAgICAgICAgIHN3aXRjaChjID4+IDQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IGNhc2UgMjogY2FzZSAzOiBjYXNlIDQ6IGNhc2UgNTogY2FzZSA2OiBjYXNlIDc6XG4gICAgICAgICAgICAgICAgLy8gMHh4eHh4eHhcbiAgICAgICAgICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDEyOiBjYXNlIDEzOlxuICAgICAgICAgICAgICAgIC8vIDExMHggeHh4eCAgIDEweHggeHh4eFxuICAgICAgICAgICAgICAgIGNoYXIyID0gYXJyYXlbaSsrXTtcbiAgICAgICAgICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAweDFGKSA8PCA2KSB8IChjaGFyMiAmIDB4M0YpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgICAgICAgICAvLyAxMTEwIHh4eHggIDEweHggeHh4eCAgMTB4eCB4eHh4XG4gICAgICAgICAgICAgICAgICAgIGNoYXIyID0gYXJyYXlbaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcjMgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAweDBGKSA8PCAxMikgfFxuICAgICAgICAgICAgICAgICAgICAgICAgKChjaGFyMiAmIDB4M0YpIDw8IDYpIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICgoY2hhcjMgJiAweDNGKSA8PCAwKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBLTVV0bDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9LTVV0bC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKioqXG4gKiBLTUNvbVdlYkJMRS5qc1xuICogdmVyc2lvbiAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xubGV0IEtNVXRsID0gcmVxdWlyZSgnLi9LTVV0bCcpO1xubGV0IEtNQ29tQmFzZSA9IHJlcXVpcmUoJy4vS01Db21CYXNlJyk7XG4vKipcbiAqIEBjbGFzc2Rlc2Mg44OW44Op44Km44K255SoV2ViQmx1ZXRvb2jpgJrkv6Hjgq/jg6njgrkoY2hyb21l5L6d5a2YKVxuICogQGlnbm9yZVxuICovXG5jbGFzcyBLTUNvbVdlYkJMRSBleHRlbmRzIEtNQ29tQmFzZXtcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlrprmlbBcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2RldmljZUluZm8udHlwZT1cIldFQkJMRVwiO1xuICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3M9e307XG4gICAgICAgIHRoaXMuX2JsZVNlbmRpbmdRdWU9UHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgICB0aGlzLl9xdWVDb3VudD0wO1xuICAgICAgICBcbiAgICAgICAgLy/jgrXjg7zjg5PjgrlVVUlEXG4gICAgICAgIHRoaXMuX01PVE9SX0JMRV9TRVJWSUNFX1VVSUQ9J2YxNDBlYTM1LTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4Yyc7XG5cbiAgICAgICAgLy/jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrlVVUlEXG4gICAgICAgIHRoaXMuX01PVE9SX0JMRV9DUlM9e1xuICAgICAgICAgICAgJ01PVE9SX0NPTlRST0wnOidmMTQwMDAwMS04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLC8v44Oi44O844K/44O844G444Gu6Kit5a6a44CB5Yi25b6h5ZG95Luk44KS5Y+W44KK5omx44GGXG4gICAgICAgICAgICAvLydNT1RPUl9MRUQnOidmMTQwMDAwMy04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLC8v44Oi44O844K/44O844GuTEVE44KS5Y+W44KK5omx44GGIGluZm86OiBNT1RPUl9DT05UUk9MOjpibGVMZWTjgafku6PnlKhcbiAgICAgICAgICAgICdNT1RPUl9NRUFTVVJFTUVOVCc6J2YxNDAwMDA0LTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4YycsLy/jg6Ljg7zjgr/jg7zjga7kvY3nva7jg7vpgJ/luqbjg7vjg4jjg6vjgq/nrYnmuKzlrprlgKTjgpLlj5bjgormibHjgYZcbiAgICAgICAgICAgICdNT1RPUl9JTVVfTUVBU1VSRU1FTlQnOidmMTQwMDAwNS04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLC8v44Oi44O844K/44O844Gu5Yqg6YCf5bqm44O744K444Oj44Kk44Ot44K744Oz44K144O877yISU1V77yJ44KS5Y+W44KK5omx44GGXG4gICAgICAgICAgICAnTU9UT1JfU0VUVElORyc6J2YxNDAwMDA2LTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4YycvL+ODouODvOOCv+ODvOOBruioreWumuWApOOCkuWPluOCiuaJseOBhlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUz17XG4gICAgICAgICAgICBcIlNlcnZpY2VcIjoweDE4MGFcbiAgICAgICAgICAgICxcIk1hbnVmYWN0dXJlck5hbWVTdHJpbmdcIjoweDJhMjlcbiAgICAgICAgICAgICxcIkhhcmR3YXJlUmV2aXNpb25TdHJpbmdcIjoweDJhMjdcbiAgICAgICAgICAgICxcIkZpcm13YXJlUmV2aXNpb25TdHJpbmdcIjoweDJhMjZcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQkxF5YiH5pat5pmCXG4gICAgICAgICAqIEBwYXJhbSBldmVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgdGhpcy5fb25CbGVDb25uZWN0aW9uTG9zdD0oZXZlKT0+e1xuICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmlzQ29ubmVjdD1mYWxzZTtcbiAgICAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9bnVsbDtcbiAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZV9pc0Nvbm5lY3QoZmFsc2UpO1xuICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zlm57ou6Lmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIGV2ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBOb3RpZnkg44GX44Gf44Go44GN44Gu6L+U44KK5YCkXG4gICAgICAgICAqIGJ5dGVbMF0tYnl0ZVszXVx0ICAgIGJ5dGVbNF0tYnl0ZVs3XVx0ICAgICAgICBieXRlWzhdLWJ5dGVbMTFdXG4gICAgICAgICAqIGZsb2F0ICogXHRcdCAgICAgICAgZmxvYXQgKiAgICAgICAgICAgICAgICAgZmxvYXQgKlxuICAgICAgICAgKiBwb3NpdGlvbjpyYWRpYW5zXHQgICAgc3BlZWQ6cmFkaWFucy9zZWNvbmRcdHRvcnF1ZTpO44O7bVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25CbGVNb3Rvck1lYXN1cmVtZW50PShldmUpPT57XG4gICAgICAgICAgICBpZighZXZlfHwhZXZlLnRhcmdldCl7cmV0dXJuO31cbiAgICAgICAgICAgIGxldCBkdiA9IGV2ZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICBpZighKGR2IGluc3RhbmNlb2YgRGF0YVZpZXcpKXtyZXR1cm47fS8vaW5mbzo6d2ViIGJsdWV0b29o44Gu44G/IG5vZGUuanPjga9pbnN0YW5jZW9mIEJ1ZmZlclxuICAgICAgICAgICAgbGV0IHJlcz17cG9zaXRpb246ZHYuZ2V0RmxvYXQzMigwLGZhbHNlKSx2ZWxvY2l0eTpkdi5nZXRGbG9hdDMyKDQsZmFsc2UpLHRvcnF1ZTpkdi5nZXRGbG9hdDMyKDgsZmFsc2UpfTtcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JNZWFzdXJlbWVudENCKHJlcyk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7xJTVXmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIGV2ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAI05vdGlmeSDjgZfjgZ/jgajjgY3jga7ov5TjgorlgKQpLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqXG4gICAgICAgICAqIGFjY2VsX3gsIGFjY2VsX3ksIGFjY2VsX3osIHRlbXAsIGd5cm9feCwgZ3lyb195LCBneXJvX3og44GM5YWo44Gm6L+U44Gj44Gm44GP44KL44CC5Y+W5b6X6ZaT6ZqU44GvMTAwbXMg5Zu65a6aXG4gICAgICAgICAqIGJ5dGUoQmlnRW5kaWFuKSAgWzBdWzFdIFsyXVszXSAgWzRdWzVdICAgWzZdWzddXHQgICAgWzhdWzldXHRbMTBdWzExXSAgICBbMTJdWzEzXVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgIGludDE2X3QgaW50MTZfdCBpbnQxNl90IGludDE2X3QgICAgIGludDE2X3QgaW50MTZfdCBpbnQxNl90XG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgYWNjZWwteCBhY2NlbC15IGFjY2VsLXogdGVtcFx0ICAgIGd5cm8teFx0Z3lyby15XHRneXJvLXpcbiAgICAgICAgICpcbiAgICAgICAgICogaW50MTZfdDotMzIsNzY444CcMzIsNzY4XG4gICAgICAgICAqIOacuuOBruS4iuOBq+ODouODvOOCv+ODvOOCkue9ruOBhOOBn+WgtOWQiOOAgeWKoOmAn+W6puOAgHogPSAxNjAwMCDnqIvluqbjgajjgarjgovjgILvvIjph43lipvmlrnlkJHjga7jgZ/jgoHvvIlcbiAgICAgICAgICpcbiAgICAgICAgICog5Y2Y5L2N5aSJ5o+b77yJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIOOAgOWKoOmAn+W6piB2YWx1ZSBbR10gPSByYXdfdmFsdWUgKiAyIC8gMzIsNzY3XG4gICAgICAgICAqIOOAgOa4qeW6piB2YWx1ZSBb4oSDXSA9IHJhd192YWx1ZSAvIDMzMy44NyArIDIxLjAwXG4gICAgICAgICAqIOOAgOinkumAn+W6plxuICAgICAgICAgKiDjgIDjgIB2YWx1ZSBbZGVncmVlL3NlY29uZF0gPSByYXdfdmFsdWUgKiAyNTAgLyAzMiw3NjdcbiAgICAgICAgICog44CA44CAdmFsdWUgW3JhZGlhbnMvc2Vjb25kXSA9IHJhd192YWx1ZSAqIDAuMDAwMTMzMTYyMTFcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29uQmxlSW11TWVhc3VyZW1lbnQ9KGV2ZSk9PntcbiAgICAgICAgICAgIGlmKCFldmV8fCFldmUudGFyZ2V0KXtyZXR1cm47fVxuICAgICAgICAgICAgbGV0IGR2ID0gZXZlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgIGxldCB0ZW1wQ2FsaWJyYXRpb249LTUuNzsvL+a4qeW6puagoeato+WApFxuICAgICAgICAgICAgaWYoIShkdiBpbnN0YW5jZW9mIERhdGFWaWV3KSl7cmV0dXJuO30vL2luZm86OndlYiBibHVldG9vaOOBruOBvyBub2RlLmpz44GvaW5zdGFuY2VvZiBCdWZmZXJcbiAgICAgICAgICAgIC8v5Y2Y5L2N44KS5omx44GE5piT44GE44KI44GG44Gr5aSJ5o+bXG4gICAgICAgICAgICBsZXQgcmVzPXtcbiAgICAgICAgICAgICAgICBhY2NlbFg6ZHYuZ2V0SW50MTYoMCxmYWxzZSkqMi8zMjc2NyxhY2NlbFk6ZHYuZ2V0SW50MTYoMixmYWxzZSkqMi8zMjc2NyxhY2NlbFo6ZHYuZ2V0SW50MTYoNCxmYWxzZSkqMi8zMjc2NyxcbiAgICAgICAgICAgICAgICB0ZW1wOihkdi5nZXRJbnQxNig2LGZhbHNlKSkgLyAzMzMuODcgKyAyMS4wMCt0ZW1wQ2FsaWJyYXRpb24sXG4gICAgICAgICAgICAgICAgZ3lyb1g6ZHYuZ2V0SW50MTYoOCxmYWxzZSkqMjUwLzMyNzY3LGd5cm9ZOmR2LmdldEludDE2KDEwLGZhbHNlKSoyNTAvMzI3NjcsZ3lyb1o6ZHYuZ2V0SW50MTYoMTIsZmFsc2UpKjI1MC8zMjc2N1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgIHRoaXMuX29uSW11TWVhc3VyZW1lbnRDQihyZXMpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIGV2ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBOb3RpZnkg44GX44Gf44Go44GN44Gu6L+U44KK5YCkXG4gICAgICAgICAqIGJ5dGVbMF1cdGJ5dGVbMV1cdGJ5dGVbMl1cdGJ5dGVbM10gYnl0ZVs0XeS7pemZjVx0Ynl0ZVtuLTJdXHRieXRlW24tMV1cbiAgICAgICAgICogdWludDhfdDpsb2dfdHlwZVx0dWludDE2X3Q6aWRcdHVpbnQ4X3Q6cmVnaXN0ZXJcdHVpbnQ4X3Q6dmFsdWVcdHVpbnQxNl90OkNSQ1xuICAgICAgICAgKiAweDQwXHR1aW50MTZfdCAoMmJ5dGUpIDDvvZ42NTUzNVx044Os44K444K544K/44Kz44Oe44Oz44OJXHTjg6zjgrjjgrnjgr/jga7lgKTvvIjjgrPjg57jg7Pjg4njgavjgojjgaPjgablpInjgo/jgovvvIlcdHVpbnQxNl90ICgyYnl0ZSkgMO+9njY1NTM1XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vbkJsZU1vdG9yU2V0dGluZz0oZXZlKT0+e1xuICAgICAgICAgICAgaWYoIWV2ZXx8IWV2ZS50YXJnZXQpe3JldHVybjt9XG4gICAgICAgICAgICBsZXQgZHYgPSBldmUudGFyZ2V0LnZhbHVlOy8vNitu44OQ44Kk44OI44CA44OH44O844K/5LuV5qeY44CAaHR0cHM6Ly9kb2NzLmdvb2dsZS5jb20vc3ByZWFkc2hlZXRzL2QvMXV4SnU4NlhlOEtiSWx4dTVvUEZ2OUtRZHZIWTMzLU5JeTBjZFNnSW5vVWsvZWRpdCNnaWQ9MTAwMDQ4MjM4M1xuICAgICAgICAgICAgaWYoIShkdiBpbnN0YW5jZW9mIERhdGFWaWV3KSl7cmV0dXJuO30vL2luZm86OndlYiBibHVldG9vaOOBruOBvyBub2RlLmpz44GvaW5zdGFuY2VvZiBCdWZmZXJcblxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvL+ODh+ODvOOCv+OBrnBhcnNlXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGxldCBub3RpZnlCaW5MZW49ZHYuYnl0ZUxlbmd0aDtcbiAgICAgICAgICAgIGxldCBub3RpZnlDbWQ9ZHYuZ2V0VWludDgoMCk7Ly/jg6zjgrjjgrnjgr/mg4XloLHpgJrnn6XjgrPjg57jg7Pjg4lJRCAweDQw5Zu65a6aXG5cbiAgICAgICAgICAgIGlmKG5vdGlmeUNtZCE9MHg0MHx8bm90aWZ5QmluTGVuPD02KXtyZXR1cm47fS8v44Os44K444K544K/5oOF5aCx44KS5ZCr44G+44Gq44GE44OH44O844K/44Gu56C05qOEXG5cbiAgICAgICAgICAgIGxldCBpZD1kdi5nZXRVaW50MTYoMSxmYWxzZSk7Ly/pgIHkv6FJRFxuICAgICAgICAgICAgbGV0IHJlZ2lzdGVyQ21kPWR2LmdldFVpbnQ4KDMpOy8v44Os44K444K544K/44Kz44Oe44Oz44OJXG4gICAgICAgICAgICBsZXQgY3JjPWR2LmdldFVpbnQxNihub3RpZnlCaW5MZW4tMixmYWxzZSk7Ly9DUkPjga7lgKQg5pyA5b6M44GL44KJMmR5dGVcblxuICAgICAgICAgICAgbGV0IHJlcz17fTtcbiAgICAgICAgICAgIC8v44Kz44Oe44Oz44OJ5Yil44Gr44KI44KL44Os44K444K544K/44Gu5YCk44Gu5Y+W5b6XWzQtbiBieXRlXVxuICAgICAgICAgICAgc3dpdGNoKHJlZ2lzdGVyQ21kKXtcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQubWF4U3BlZWQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tYXhTcGVlZD1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQubWluU3BlZWQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5taW5TcGVlZD1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQuY3VydmVUeXBlOlxuICAgICAgICAgICAgICAgICAgICByZXMuY3VydmVUeXBlPWR2LmdldFVpbnQ4KDQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQuYWNjOlxuICAgICAgICAgICAgICAgICAgICByZXMuYWNjPWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORC5kZWM6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5kZWM9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELm1heFRvcnF1ZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1heFRvcnF1ZT1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQucUN1cnJlbnRQOlxuICAgICAgICAgICAgICAgICAgICByZXMucUN1cnJlbnRQPWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORC5xQ3VycmVudEk6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5xQ3VycmVudEk9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELnFDdXJyZW50RDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnFDdXJyZW50RD1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQuc3BlZWRQOlxuICAgICAgICAgICAgICAgICAgICByZXMuc3BlZWRQPWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORC5zcGVlZEk6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zcGVlZEk9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELnNwZWVkRDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNwZWVkRD1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQucG9zaXRpb25QOlxuICAgICAgICAgICAgICAgICAgICByZXMucG9zaXRpb25QPWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORC5vd25Db2xvcjpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm93bkNvbG9yPSgnIzAwMDAwMCcgK051bWJlcihkdi5nZXRVaW50OCg0KTw8MTZ8ZHYuZ2V0VWludDgoNSk8PDh8ZHYuZ2V0VWludDgoNikpLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC02KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlcyk7XG5cbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JTZXR0aW5nQ0IocmVnaXN0ZXJDbWQscmVzKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBzZWN0aW9uOjrlhazplovjg6Hjgr3jg4Pjg4lcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICogV2ViQmx1ZXRvb2jjgafjga7mjqXntprjgpLplovlp4vjgZnjgotcbiAgICAgKi9cbiAgICBjb25uZWN0KCl7XG4gICAgICAgIGlmICh0aGlzLl9wZXJpcGhlcmFsJiYgdGhpcy5fcGVyaXBoZXJhbC5nYXR0JiZ0aGlzLl9wZXJpcGhlcmFsLmdhdHQuY29ubmVjdGVkICkge3JldHVybn1cbiAgICAgICAgbGV0IGdhdD0gKHRoaXMuX3BlcmlwaGVyYWwmJiB0aGlzLl9wZXJpcGhlcmFsLmdhdHQgKT90aGlzLl9wZXJpcGhlcmFsLmdhdHQgOnVuZGVmaW5lZDsvL+WGjeaOpee2mueUqFxuICAgICAgICB0aGlzLl9ibGVDb25uZWN0KGdhdCkudGhlbihvYmo9PnsvL2luZm86OiByZXNvbHZlKHtkZXZpY2VJRCxkZXZpY2VOYW1lLGJsZURldmljZSxjaGFyYWN0ZXJpc3RpY3N9KTtcbiAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9b2JqLmJsZURldmljZTtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uaWQ9dGhpcy5fcGVyaXBoZXJhbC5pZDtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8ubmFtZT10aGlzLl9wZXJpcGhlcmFsLm5hbWU7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmlzQ29ubmVjdD10aGlzLl9wZXJpcGhlcmFsLmdhdHQuY29ubmVjdGVkO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5tYW51ZmFjdHVyZXJOYW1lPW9iai5pbmZvbWF0aW9uLm1hbnVmYWN0dXJlck5hbWU7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmhhcmR3YXJlUmV2aXNpb249b2JqLmluZm9tYXRpb24uaGFyZHdhcmVSZXZpc2lvbjtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uZmlybXdhcmVSZXZpc2lvbj1vYmouaW5mb21hdGlvbi5maXJtd2FyZVJldmlzaW9uO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljcz1vYmouY2hhcmFjdGVyaXN0aWNzO1xuXG4gICAgICAgICAgICBpZighZ2F0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2dhdHRzZXJ2ZXJkaXNjb25uZWN0ZWQnLHRoaXMuX29uQmxlQ29ubmVjdGlvbkxvc3QpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWwuYWRkRXZlbnRMaXN0ZW5lcignZ2F0dHNlcnZlcmRpc2Nvbm5lY3RlZCcsIHRoaXMuX29uQmxlQ29ubmVjdGlvbkxvc3QpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9NRUFTVVJFTUVOVCddKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9NRUFTVVJFTUVOVCddLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yTWVhc3VyZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX01FQVNVUkVNRU5UJ10uYWRkRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JNZWFzdXJlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfTUVBU1VSRU1FTlQnXS5zdGFydE5vdGlmaWNhdGlvbnMoKS50aGVuKG9iaj0+e1xuICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCddKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfSU1VX01FQVNVUkVNRU5UJ10ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlSW11TWVhc3VyZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9JTVVfTUVBU1VSRU1FTlQnXS5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVJbXVNZWFzdXJlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9JTVVfTUVBU1VSRU1FTlQnXS5zdGFydE5vdGlmaWNhdGlvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIH0pLnRoZW4ob2JqPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX1NFVFRJTkcnXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9TRVRUSU5HJ10ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JTZXR0aW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX1NFVFRJTkcnXS5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3RvclNldHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX1NFVFRJTkcnXS5zdGFydE5vdGlmaWNhdGlvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICB9KS50aGVuKG9iaj0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzQ2hhbmdlX2luaXQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaXNDb25uZWN0KHRydWUpOy8v5Yid5Zue44Gu44G/KGNvbXDku6XliY3jga/nmbrngavjgZfjgarjgYTngropXG4gICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzQ2hhbmdlX2lzQ29ubmVjdCh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goZXJyPT57XG4gICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW51bGw7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RGYWlsdXJlSGFuZGxlcih0aGlzLGVycik7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2ViQmx1ZXRvb2jjga7liIfmlq1cbiAgICAgKi9cbiAgICBkaXNDb25uZWN0KCl7XG4gICAgICAgaWYgKCF0aGlzLl9wZXJpcGhlcmFsIHx8ICF0aGlzLl9wZXJpcGhlcmFsLmdhdHQuY29ubmVjdGVkKXtyZXR1cm47fVxuICAgICAgICB0aGlzLl9wZXJpcGhlcmFsLmdhdHQuZGlzY29ubmVjdCgpO1xuICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW51bGw7XG5cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlhoXpg6hcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBCTEXmjqXntppcbiAgICAgKiBAcGFyYW0gZ2F0dF9vYmog44Oa44Ki44Oq44Oz44Kw5riI44G/44GuR0FUVOOBruODh+ODkOOCpOOCueOBq+WGjeaOpee2mueUqCjjg5rjgqLjg6rjg7PjgrDjg6Ljg7zjg4Djg6vjga/lh7rjgarjgYQpXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYmxlQ29ubmVjdChnYXR0X29iaikge1xuICAgICAgLy9sZXQgc2VsZiA9IHRoaXM7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgLy8gbGV0IGJsZURldmljZTtcbiAgICAgICAgICAvLyBsZXQgZGV2aWNlTmFtZTtcbiAgICAgICAgICAvLyBsZXQgZGV2aWNlSUQ7XG4gICAgICAgICAgaWYoIWdhdHRfb2JqKXtcbiAgICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICBmaWx0ZXJzOiBbe3NlcnZpY2VzOiBbdGhpcy5fTU9UT1JfQkxFX1NFUlZJQ0VfVVVJRF19XSxcbiAgICAgICAgICAgICAgICAgIG9wdGlvbmFsU2VydmljZXM6W3RoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLlNlcnZpY2VdXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIG5hdmlnYXRvci5ibHVldG9vdGgucmVxdWVzdERldmljZShvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oZGV2aWNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ibGVHYXRjb25uZWN0KGRldmljZS5nYXR0KS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxlRGV2aWNlOiBkZXZpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VJRDogZGV2aWNlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlTmFtZTogZGV2aWNlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3M6cmVzLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb246cmVzLmluZm9tYXRpb25cblxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgdGhpcy5fYmxlR2F0Y29ubmVjdChnYXR0X29iailcbiAgICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJfYmxlR2F0Y29ubmVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlSUQ6IGdhdHRfb2JqLmRldmljZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlTmFtZTogZ2F0dF9vYmouZGV2aWNlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJsZURldmljZTogZ2F0dF9vYmouZGV2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3M6cmVzLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvbjpyZXMuaW5mb21hdGlvblxuXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vR0FUVOaOpee2mueUqFxuICAgIF9ibGVHYXRjb25uZWN0KGdhdHRfb2JqKXtcbiAgICAgICAgICAgIGxldCBjaGFyYWN0ZXJpc3RpY3MgPSB7fTtcbiAgICAgICAgICAgIGxldCBpbmZvbWF0aW9uPXt9O1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChncmVzb2x2ZSwgZ3JlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgZ2F0dF9vYmouY29ubmVjdCgpLnRoZW4oc2VydmVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZXModGhpcy5fTU9UT1JfQkxFX1NFUlZJQ0VfVVVJRCk7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwcnMgPSBbXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5fTU9UT1JfQkxFX1NFUlZJQ0VfVVVJRCkudGhlbihzZXJ2aWNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY3JzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fTU9UT1JfQkxFX0NSUykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNycy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLl9NT1RPUl9CTEVfQ1JTW2tleV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3Nba2V5XSA9IGNoYXJhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGNycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vYmxlX2Zpcm13YXJlX3JldmlzaW9u44Gu44K144O844OT44K55Y+W5b6XXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuU2VydmljZSkudGhlbigoc2VydmljZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpZnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5NYW51ZmFjdHVyZXJOYW1lU3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGFyYS5yZWFkVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb25bJ21hbnVmYWN0dXJlck5hbWUnXSA9IEtNVXRsLlV0ZjhBcnJheVRvU3RyKG5ldyBVaW50OEFycmF5KHZhbC5idWZmZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmcy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLkZpcm13YXJlUmV2aXNpb25TdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjaGFyYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoYXJhLnJlYWRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbih2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvblsnZmlybXdhcmVSZXZpc2lvbiddID0gS01VdGwuVXRmOEFycmF5VG9TdHIobmV3IFVpbnQ4QXJyYXkodmFsLmJ1ZmZlcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWZzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuSGFyZHdhcmVSZXZpc2lvblN0cmluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNoYXJhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hhcmEucmVhZFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uWydoYXJkd2FyZVJldmlzaW9uJ10gPSBLTVV0bC5VdGY4QXJyYXlUb1N0cihuZXcgVWludDhBcnJheSh2YWwuYnVmZmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoaWZzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgIF07XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChwcnMpO1xuICAgICAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBncmVzb2x2ZSh7Y2hhcmFjdGVyaXN0aWNzOiBjaGFyYWN0ZXJpc3RpY3MsIGluZm9tYXRpb246IGluZm9tYXRpb259KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBCTEXjgrPjg57jg7Pjg4njga7pgIHkv6FcbiAgICAgKiBAcGFyYW0gY29tbWFuZFR5cGVTdHIgICdNT1RPUl9DT05UUk9MJywnTU9UT1JfTUVBU1VSRU1FTlQnLCdNT1RPUl9JTVVfTUVBU1VSRU1FTlQnLCdNT1RPUl9TRVRUSU5HJ1xuICAgICAqIOOCs+ODnuODs+ODieeoruWIpeOBrlN0cmluZyDkuLvjgatCTEXjga7jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrnjgafkvb/nlKjjgZnjgotcbiAgICAgKiBAcGFyYW0gY29tbWFuZE51bVxuICAgICAqIEBwYXJhbSBhcnJheWJ1ZmZlclxuICAgICAqIEBwYXJhbSBub3RpZnlQcm9taXMgY21kUmVhZFJlZ2lzdGVy562J44GuQkxF5ZG844Gz5Ye644GX5b6M44Grbm90aWZ544Gn5Y+W5b6X44GZ44KL5YCk44KSUHJvbWlz44Gn5biw44GZ5b+F6KaB44Gu44GC44KL44Kz44Oe44Oz44OJ55SoXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2VuZE1vdG9yQ29tbWFuZChjb21tYW5kQ2F0ZWdvcnksIGNvbW1hbmROdW0sIGFycmF5YnVmZmVyPW5ldyBBcnJheUJ1ZmZlcigwKSwgbm90aWZ5UHJvbWlzPW51bGwpe1xuICAgICAgICBsZXQgY2hhcmFjdGVyaXN0aWNzPXRoaXMuX2NoYXJhY3RlcmlzdGljc1tjb21tYW5kQ2F0ZWdvcnldO1xuICAgICAgICBsZXQgYWI9bmV3IERhdGFWaWV3KGFycmF5YnVmZmVyKTtcbiAgICAgICAgLy/jgrPjg57jg7Pjg4njg7tJROODu0NSQ+OBruS7mOWKoFxuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGFycmF5YnVmZmVyLmJ5dGVMZW5ndGgrNSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsY29tbWFuZE51bSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigxLHRoaXMuY3JlYXRlQ29tbWFuZElEKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KGFycmF5YnVmZmVyLmJ5dGVMZW5ndGgrMywwKTtcbiAgICAgICAgLy/jg4fjg7zjgr/jga7mm7jjgY3ovrzjgb9cbiAgICAgICAgZm9yKGxldCBpPTA7aTxhcnJheWJ1ZmZlci5ieXRlTGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgzK2ksYWIuZ2V0VWludDgoaSkpO1xuICAgICAgICB9XG4gICAgICAgIC8vcXVl44Gr6L+95YqgXG4gICAgICAgLy8gKyt0aGlzLl9xdWVDb3VudDtcbiAgICAgICAgdGhpcy5fYmxlU2VuZGluZ1F1ZT0gdGhpcy5fYmxlU2VuZGluZ1F1ZS50aGVuKChyZXMpPT57XG4gICAgICAgICAgLy8gIGNvbnNvbGUubG9nKFwiX3NlbmRNb3RvckNvbW1hbmQgcXVlQ291bnQ6XCIrKC0tdGhpcy5fcXVlQ291bnQpKTtcbiAgICAgICAgICAgIGlmKG5vdGlmeVByb21pcyl7XG4gICAgICAgICAgICAgICAgbm90aWZ5UHJvbWlzLnN0YXJ0UmVqZWN0VGltZU91dENvdW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2hhcmFjdGVyaXN0aWNzLndyaXRlVmFsdWUoYnVmZmVyKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIC8v5aSx5pWX5pmC44CALy9pbmZvOjrlvozntprjga7jgrPjg57jg7Pjg4njga/lvJXjgY3ntprjgY3lrp/ooYzjgZXjgozjgotcbiAgICAgICAgICAvLyAgY29uc29sZS5sb2coXCJFUlIgX3NlbmRNb3RvckNvbW1hbmQ6XCIrcmVzK1wiIHF1ZUNvdW50OlwiKygtLXRoaXMuX3F1ZUNvdW50KSk7XG4gICAgICAgICAgICBpZihub3RpZnlQcm9taXMpe1xuICAgICAgICAgICAgICAgIG5vdGlmeVByb21pcy5jYWxsUmVqZWN0KHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4vLy8vLy9jbGFzcy8vXG59XG5cbm1vZHVsZS5leHBvcnRzID1LTUNvbVdlYkJMRTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9LTUNvbVdlYkJMRS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG4vKioqXG4gKktNQ29ubmVjdG9yQnJvd3Nlci5qc1xuICogdmVyc2lvbiAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuZ2xvYmFsLktNVXRsPXJlcXVpcmUoJy4vS01VdGwuanMnKTtcbmdsb2JhbC5LTVZlY3RvcjI9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTVZlY3RvcjI7XG4vL2dsb2JhbC5LTVZlY3RvcjM9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTVZlY3RvcjM7XG5nbG9iYWwuS01JbXVTdGF0ZT1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNSW11U3RhdGU7XG5nbG9iYWwuS01MZWRTdGF0ZT1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNTGVkU3RhdGU7XG5nbG9iYWwuS01Sb3RTdGF0ZT1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNUm90U3RhdGU7XG5nbG9iYWwuS01EZXZpY2VJbmZvPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01EZXZpY2VJbmZvO1xuZ2xvYmFsLktNTW90b3JPbmVXZWJCTEU9cmVxdWlyZSgnLi9LTU1vdG9yT25lV2ViQkxFLmpzJyk7XG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvS01Db25uZWN0b3JCcm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKioqXG4gKktNTW90b3JPbmVXZWJCTEUuanNcbiAqIHZhciAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5sZXQgS01Db21XZWJCTEUgPSByZXF1aXJlKCcuL0tNQ29tV2ViQkxFJyk7XG5sZXQgS01Nb3RvckNvbW1hbmRLTU9uZT1yZXF1aXJlKCcuL0tNTW90b3JDb21tYW5kS01PbmUuanMnKTtcblxuLyoqXG4gKiBAY2xhc3NkZXNjIEtNLTHjga5XZWJCbHVldG9vaOaOpee2mueUqCDku67mg7Pjg4fjg5DjgqTjgrlcbiAqL1xuY2xhc3MgS01Nb3Rvck9uZVdlYkJMRSBleHRlbmRzIEtNTW90b3JDb21tYW5kS01PbmV7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcihLTU1vdG9yQ29tbWFuZEtNT25lLktNX0NPTk5FQ1RfVFlQRS5XRUJCTEUsbmV3IEtNQ29tV2ViQkxFKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBqOaOpee2muOBmeOCi1xuICAgICAqL1xuICAgIGNvbm5lY3QoKXtcbiAgICAgICAgdGhpcy5fS01Db20uY29ubmVjdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBqOWIh+aWrVxuICAgICAqL1xuICAgIGRpc0Nvbm5lY3QoKXtcbiAgICAgICAgdGhpcy5fS01Db20uZGlzQ29ubmVjdCgpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPUtNTW90b3JPbmVXZWJCTEU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvS01Nb3Rvck9uZVdlYkJMRS5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKioqXG4gKiBLTUNvbUJhc2UuanNcbiAqIHZlcnNpb24gMC4xLjAgYWxwaGFcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmxldCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcbmxldCBLTVN0cnVjdHVyZXM9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMnKTtcbi8qKlxuICogQGNsYXNzZGVzYyDpgJrkv6Hjgq/jg6njgrnjga7ln7rlupVcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01Db21CYXNle1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5a6a5pWwXG4gICAgKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvcuOAgFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9bnVsbDtcbiAgICAgICAgdGhpcy5fY29tbWFuZENvdW50PTA7XG4gICAgICAgIHRoaXMuX2RldmljZUluZm89bmV3IEtNU3RydWN0dXJlcy5LTURldmljZUluZm8oKTtcblxuICAgICAgICB0aGlzLl9tb3Rvck1lYXN1cmVtZW50PW5ldyBLTVN0cnVjdHVyZXMuS01Sb3RTdGF0ZSgpO1xuICAgICAgICB0aGlzLl9tb3RvckxlZD1uZXcgS01TdHJ1Y3R1cmVzLktNTGVkU3RhdGUoKTtcbiAgICAgICAgdGhpcy5fbW90b3JJbXVNZWFzdXJlbWVudD1uZXcgS01TdHJ1Y3R1cmVzLktNSW11U3RhdGUoKTtcblxuICAgICAgICB0aGlzLl9vbkluaXRIYW5kbGVyPWZ1bmN0aW9uKGNvbm5lY3Rvcil7fTtcbiAgICAgICAgdGhpcy5fb25Db25uZWN0SGFuZGxlcj1mdW5jdGlvbihjb25uZWN0b3Ipe307XG4gICAgICAgIHRoaXMuX29uRGlzY29ubmVjdEhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yKXt9O1xuICAgICAgICB0aGlzLl9vbkNvbm5lY3RGYWlsdXJlSGFuZGxlcj1mdW5jdGlvbihjb25uZWN0b3IsIG1zZyl7fTtcblxuICAgICAgICB0aGlzLl9vbk1vdG9yTWVhc3VyZW1lbnRDQj1mdW5jdGlvbigpe307XG4gICAgICAgIHRoaXMuX29uSW11TWVhc3VyZW1lbnRDQj1mdW5jdGlvbigpe307XG4gICAgICAgIHRoaXMuX29uTW90b3JTZXR0aW5nQ0I9ZnVuY3Rpb24oKXt9O1xuXG4gICAgICAgIHRoaXMuX2lzSW5pdD1mYWxzZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogX29uQmxlTW90b3JTZXR0aW5n44Gu44Kz44Oe44Oz44OJ44CA44Oi44O844K/44O86Kit5a6a5oOF5aCx44Gu6YCa55+l5Y+X5L+h5pmC44Gr44OR44O844K544GZ44KL55SoXG4gICAgICAgICAqIEB0eXBlIHt7bWF4U3BlZWQ6IG51bWJlciwgbWluU3BlZWQ6IG51bWJlciwgY3VydmVUeXBlOiBudW1iZXIsIGFjYzogbnVtYmVyLCBkZWM6IG51bWJlciwgbWF4VG9ycXVlOiBudW1iZXIsIHFDdXJyZW50UDogbnVtYmVyLCBxQ3VycmVudEk6IG51bWJlciwgcUN1cnJlbnREOiBudW1iZXIsIHNwZWVkUDogbnVtYmVyLCBzcGVlZEk6IG51bWJlciwgc3BlZWREOiBudW1iZXIsIHBvc2l0aW9uUDogbnVtYmVyLCBvd25Db2xvcjogbnVtYmVyfX1cbiAgICAgICAgICogQGlnbm9yZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORD17XG4gICAgICAgICAgICAgICAgXCJtYXhTcGVlZFwiOjB4MDIsXG4gICAgICAgICAgICAgICAgXCJtaW5TcGVlZFwiOjB4MDMsXG4gICAgICAgICAgICAgICAgXCJjdXJ2ZVR5cGVcIjoweDA1LFxuICAgICAgICAgICAgICAgIFwiYWNjXCI6MHgwNyxcbiAgICAgICAgICAgICAgICBcImRlY1wiOjB4MDgsXG4gICAgICAgICAgICAgICAgXCJtYXhUb3JxdWVcIjoweDBFLFxuICAgICAgICAgICAgICAgIFwicUN1cnJlbnRQXCI6MHgxOCxcbiAgICAgICAgICAgICAgICBcInFDdXJyZW50SVwiOjB4MTksXG4gICAgICAgICAgICAgICAgXCJxQ3VycmVudERcIjoweDFBLFxuICAgICAgICAgICAgICAgIFwic3BlZWRQXCI6MHgxQixcbiAgICAgICAgICAgICAgICBcInNwZWVkSVwiOjB4MUMsXG4gICAgICAgICAgICAgICAgXCJzcGVlZERcIjoweDFELFxuICAgICAgICAgICAgICAgIFwicG9zaXRpb25QXCI6MHgxRSxcbiAgICAgICAgICAgICAgICBcIm93bkNvbG9yXCI6MHgzQVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDjg5fjg63jg5Hjg4bjgqNcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDjg4fjg5DjgqTjgrnmg4XloLFcbiAgICAgKiBAdHlwZSB7S01EZXZpY2VJbmZvfVxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IGRldmljZUluZm8oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RldmljZUluZm8uQ2xvbmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmnInlirnnhKHlirlcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBnZXQgaXNDb25uZWN0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZXZpY2VJbmZvLmlzQ29ubmVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgrPjg57jg7Pjg4npoIbnm6PoppbnlKjpgKPnlarjga7nmbrooYxcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBjcmVhdGVDb21tYW5kSUQoKXtcbiAgICAgICByZXR1cm4gdGhpcy5fY29tbWFuZENvdW50PSgrK3RoaXMuX2NvbW1hbmRDb3VudCkmMGIxMTExMTExMTExMTExMTExOy8vNjU1MzXjgafjg6vjg7zjg5dcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpc0Nvbm5lY3Tjga7oqK3lrprlpInmm7Qo5a2Q44Kv44Op44K544GL44KJ5L2/55SoKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYm9vbFxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBfc3RhdHVzQ2hhbmdlX2lzQ29ubmVjdChib29sKXtcbiAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q9Ym9vbDtcbiAgICAgICAgaWYodGhpcy5faXNJbml0KXtcbiAgICAgICAgICAgIGlmKGJvb2wpe1xuICAgICAgICAgICAgICAgIHRoaXMuX29uQ29ubmVjdEhhbmRsZXIodGhpcyk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yid5pyf5YyW54q25oWL44Gu6Kit5a6aKOWtkOOCr+ODqeOCueOBi+OCieS9v+eUqClcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJvb2xcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgX3N0YXR1c0NoYW5nZV9pbml0KGJvb2wpe1xuICAgICAgICB0aGlzLl9pc0luaXQ9Ym9vbDtcbiAgICAgICAgaWYodGhpcy5faXNJbml0KXtcbiAgICAgICAgICAgIHRoaXMuX29uSW5pdEhhbmRsZXIodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBjYWxsYmFja1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIOWIneacn+WMluWujOS6huOBl+OBpuWIqeeUqOOBp+OBjeOCi+OCiOOBhuOBq+OBquOBo+OBn1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihLTUNvbUJhc2UpfVxuICAgICAqL1xuICAgIHNldCBvbkluaXQoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Jbml0SGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog5b+c562U44O75YaN5o6l57aa44Gr5oiQ5Yqf44GX44GfXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKEtNQ29tQmFzZSl9XG4gICAgICovXG4gICAgc2V0IG9uQ29ubmVjdChoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDlv5znrZTjgYznhKHjgY/jgarjgaPjgZ/jg7vliIfmlq3jgZXjgozjgZ9cbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oS01Db21CYXNlKX1cbiAgICAgKi9cbiAgICBzZXQgb25EaXNjb25uZWN0KGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uRGlzY29ubmVjdEhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOaOpee2muOBq+WkseaVl1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihLTUNvbUJhc2Usc3RyaW5nKX1cbiAgICAgKi9cbiAgICBzZXQgb25Db25uZWN0RmFpbHVyZShoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RGYWlsdXJlSGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga7lm57ou6Lmg4XloLFjYWxsYmFja1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihwb3NpdGlvbjpudW1iZXIsdmVsb2NpdHk6bnVtYmVyLHRvcnF1ZTpudW1iZXIpfVxuICAgICAqL1xuICAgIHNldCBvbk1vdG9yTWVhc3VyZW1lbnQoZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JNZWFzdXJlbWVudENCPWZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Gu44K444Oj44Kk44Ot5oOF5aCxY2FsbGJhY2tcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oe2FjY2VsWDpudW1iZXIsYWNjZWxZOm51bWJlcixhY2NlbFo6bnVtYmVyLHRlbXA6bnVtYmVyLGd5cm9YOm51bWJlcixneXJvWTpudW1iZXIsZ3lyb1o6bnVtYmVyfSl9XG4gICAgICovXG4gICAgc2V0IG9uSW11TWVhc3VyZW1lbnQoZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uSW11TWVhc3VyZW1lbnRDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O86Kit5a6a5oOF5aCx5Y+W5b6XY2FsbGJhY2tcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24ocmVnaXN0ZXJDbWQ6bnVtYmVyLHJlczpudW1iZXIpfVxuICAgICAqL1xuICAgIHNldCBvbk1vdG9yU2V0dGluZyhmdW5jKXtcbiAgICAgICAgaWYodHlwZW9mIGZ1bmM9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Nb3RvclNldHRpbmdDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuICAgIFxuXG4vLy8vLy9jbGFzcy8vXG59XG5cbm1vZHVsZS5leHBvcnRzID1LTUNvbUJhc2U7XG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvS01Db21CYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKipcbiAqIEtNTW90b3JDb21tYW5kS01PbmUuanNcbiAqIHZlcnNpb24gMC4xLjAgYWxwaGFcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmxldCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKFwiZXZlbnRzXCIpLkV2ZW50RW1pdHRlcjtcbmxldCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcbmxldCBLTUNvbVdlYkJMRSA9IHJlcXVpcmUoJy4vS01Db21XZWJCTEUnKTtcbmxldCBLTVN0cnVjdHVyZXM9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMnKTtcblxuXG4vKipcbiAqIEBjbGFzc2Rlc2MgS00x44Kz44Oe44Oz44OJ6YCB5L+h44Kv44Op44K5XG4gKiBAaWdub3JlXG4gKi9cbmNsYXNzIEtNTW90b3JDb21tYW5kS01PbmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXJ7XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5a6a5pWwXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIOaOpee2muaWueW8j+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFdFQkJMRSAtIDE6V0VCQkxFXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IEJMRSAtIDI6QkxFXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFNFUklBTCAtIDM6U0VSSUFMXG4gICAgICovXG4gICAgc3RhdGljIGdldCBLTV9DT05ORUNUX1RZUEUoKXtcbiAgICAgICAgcmV0dXJuIHtcIldFQkJMRVwiOjEsXCJCTEVcIjoyLFwiU0VSSUFMXCI6M307XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBjbWRQcmVwYXJlUGxheWJhY2tNb3Rpb27jga7plovlp4vkvY3nva7jgqrjg5fjgrfjg6fjg7PlrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBTVEFSVF9QT1NJVElPTl9BQlMgLSAwOuiomOaGtuOBleOCjOOBn+mWi+Wni+S9jee9ru+8iOe1tuWvvuW6p+aome+8ieOBi+OCieOCueOCv+ODvOODiFxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBTVEFSVF9QT1NJVElPTl9DVVJSRU5UIC0gMTrnj77lnKjjga7kvY3nva7jgpLplovlp4vkvY3nva7jgajjgZfjgabjgrnjgr/jg7zjg4hcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZFByZXBhcmVQbGF5YmFja01vdGlvbl9TVEFSVF9QT1NJVElPTigpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnU1RBUlRfUE9TSVRJT05fQUJTJzowLFxuICAgICAgICAgICAgJ1NUQVJUX1BPU0lUSU9OX0NVUlJFTlQnOjFcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogY21kTGVk44GuTEVE44Gu54K554Gv54q25oWL44Kq44OX44K344On44Oz5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTEVEX1NUQVRFX09GRiAtIDA65raI54GvXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IExFRF9TVEFURV9PTl9TT0xJRCAtIDE6TEVE54K554Gv77yI54K554Gv44GX44Gj44Gx44Gq44GX77yJXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IExFRF9TVEFURV9PTl9GTEFTSCAtIDI6TEVE54K55ruF77yI5LiA5a6a6ZaT6ZqU44Gn54K55ruF77yJXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IExFRF9TVEFURV9PTl9ESU0gLSA6M0xFROOBjOOChuOBo+OBj+OCiuaYjua7heOBmeOCi1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgY21kTGVkX0xFRF9TVEFURSgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnTEVEX1NUQVRFX09GRic6MCxcbiAgICAgICAgICAgICdMRURfU1RBVEVfT05fU09MSUQnOjEsXG4gICAgICAgICAgICAnTEVEX1NUQVRFX09OX0ZMQVNIJzoyLFxuICAgICAgICAgICAgJ0xFRF9TVEFURV9PTl9ESU0nOjNcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogY21kQ3VydmVUeXBl44Gu5Yqg5rib6YCf44Kr44O844OW44Kq44OX44K344On44Oz5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gQ1VSVkVfVFlQRV9OT05FIC0gMDrjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT0ZGXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IENVUlZFX1RZUEVfVFJBUEVaT0lEIC0gMTrjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT04g77yI5Y+w5b2i5Yqg5rib6YCf77yJXG4gICAgICovXG4gICAgc3RhdGljIGdldCBjbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRSgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnQ1VSVkVfVFlQRV9OT05FJzogMCxcbiAgICAgICAgICAgICdDVVJWRV9UWVBFX1RSQVBFWk9JRCc6MVxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKlxuICAgICogUmVhZFJlZ2lzdGVy44Gn5Y+W5b6X44GZ44KL5pmC55So44Gu44Kz44Oe44Oz44OJ5byV5pWw5a6a5pWwXG4gICAgKiBAcmVhZG9ubHlcbiAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgKiAqL1xuICAgIHN0YXRpYyBnZXQgY21kUmVhZFJlZ2lzdGVyX0NPTU1BTkQoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgXCJtYXhTcGVlZFwiOjB4MDIsXG4gICAgICAgICAgICBcIm1pblNwZWVkXCI6MHgwMyxcbiAgICAgICAgICAgIFwiY3VydmVUeXBlXCI6MHgwNSxcbiAgICAgICAgICAgIFwiYWNjXCI6MHgwNyxcbiAgICAgICAgICAgIFwiZGVjXCI6MHgwOCxcbiAgICAgICAgICAgIFwibWF4VG9ycXVlXCI6MHgwRSxcbiAgICAgICAgICAgIFwicUN1cnJlbnRQXCI6MHgxOCxcbiAgICAgICAgICAgIFwicUN1cnJlbnRJXCI6MHgxOSxcbiAgICAgICAgICAgIFwicUN1cnJlbnREXCI6MHgxQSxcbiAgICAgICAgICAgIFwic3BlZWRQXCI6MHgxQixcbiAgICAgICAgICAgIFwic3BlZWRJXCI6MHgxQyxcbiAgICAgICAgICAgIFwic3BlZWREXCI6MHgxRCxcbiAgICAgICAgICAgIFwicG9zaXRpb25QXCI6MHgxRSxcbiAgICAgICAgICAgIFwib3duQ29sb3JcIjoweDNBXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3LjgIBcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuS01fQ09OTkVDVF9UWVBFfSBjb25uZWN0X3R5cGUg5o6l57aa5pa55byPXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGttY29tIOmAmuS/oeOCquODluOCuOOCp+OCr+ODiCB7QGxpbmsgS01Db21CTEV9IHtAbGluayBLTUNvbVdlYkJMRX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbm5lY3RfdHlwZSxrbWNvbSl7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOOCpOODmeODs+ODiOODj+ODs+ODieODqeOCv+OCpOODl+WumuaVsFxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICogQGVudW0ge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuRVZFTlRfVFlQRT17XG4gICAgICAgICAgICAvKiog5Yid5pyf5YyW5a6M5LqG5pmCPGJyPnJldHVybjpmdW5jdGlvbih7S01EZXZpY2VJbmZvfSkgKi8gaW5pdDpcImluaXRcIixcbiAgICAgICAgICAgIC8qKiDmjqXntprmmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtLTURldmljZUluZm99KSAqLyBjb25uZWN0OlwiY29ubmVjdFwiLFxuICAgICAgICAgICAgLyoqIOWIh+aWreaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0tNRGV2aWNlSW5mb30pICovIGRpc2Nvbm5lY3Q6XCJkaXNjb25uZWN0XCIsXG4gICAgICAgICAgICAvKiog5o6l57aa44Gr5aSx5pWX5pmCPGJyPnJldHVybjpmdW5jdGlvbih7S01EZXZpY2VJbmZvfSx7bXNnfSkgKi8gY29ubmVjdEZhaWx1cmU6XCJjb25uZWN0RmFpbHVyZVwiLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOWbnui7ouaDheWgseWPl+S/oeaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0BsaW5rIEtNUm90U3RhdGV9KSAqLyBtb3Rvck1lYXN1cmVtZW50OlwibW90b3JNZWFzdXJlbWVudFwiLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvElNVeaDheWgseWPl+S/oeaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0BsaW5rIEtNSW11U3RhdGV9KSAqLyBpbXVNZWFzdXJlbWVudDpcImltdU1lYXN1cmVtZW50XCJcbiAgICAgICAgfTtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh0aGlzLkVWRU5UX1RZUEUpOy8vaW5mbzo65b6M44GL44KJ44OV44Oq44O844K644GX44Gq44GE44GoanNkb2PjgYznlJ/miJDjgZXjgozjgarjgYTjgIJcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvOOBruWFqOOCs+ODnuODs+ODiVxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICogQGVudW0ge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX01PVE9SX0NPTU1BTkQ9e1xuICAgICAgICAgICAgLyoqIOacgOWkp+mAn+OBleOCkuioreWumuOBmeOCiyAqLyBtYXhTcGVlZDoweDAyLFxuICAgICAgICAgICAgLyoqIOacgOWwj+mAn+OBleOCkuioreWumuOBmeOCiyAqLyBtaW5TcGVlZDoweDAzLFxuICAgICAgICAgICAgLyoqIOWKoOa4m+mAn+absue3muOCkuioreWumuOBmeOCiyAqLyBjdXJ2ZVR5cGU6MHgwNSxcbiAgICAgICAgICAgIC8qKiDliqDpgJ/luqbjgpLoqK3lrprjgZnjgosgKi8gYWNjOjB4MDcsXG4gICAgICAgICAgICAvKiog5rib6YCf5bqm44KS6Kit5a6a44GZ44KLICovIGRlYzoweDA4LFxuICAgICAgICAgICAgLyoqIOacgOWkp+ODiOODq+OCr+OCkuioreWumuOBmeOCiyAqLyBtYXhUb3JxdWU6MHgwRSxcbiAgICAgICAgICAgIC8qKiBx6Lu46Zu75rWBUElE44Ky44Kk44OzKFAp44KS6Kit5a6a44GZ44KLICovIHFDdXJyZW50UDoweDE4LFxuICAgICAgICAgICAgLyoqIHHou7jpm7vmtYFQSUTjgrLjgqTjg7MoSSnjgpLoqK3lrprjgZnjgosgKi8gcUN1cnJlbnRJOjB4MTksXG4gICAgICAgICAgICAvKiogcei7uOmbu+a1gVBJROOCsuOCpOODsyhEKeOCkuioreWumuOBmeOCiyAqLyBxQ3VycmVudEQ6MHgxQSxcbiAgICAgICAgICAgIC8qKiDpgJ/luqZQSUTjgrLjgqTjg7MoUCnjgpLoqK3lrprjgZnjgosgKi8gc3BlZWRQOjB4MUIsXG4gICAgICAgICAgICAvKiog6YCf5bqmUElE44Ky44Kk44OzKEkp44KS6Kit5a6a44GZ44KLICovIHNwZWVkSToweDFDLFxuICAgICAgICAgICAgLyoqIOmAn+W6plBJROOCsuOCpOODsyhEKeOCkuioreWumuOBmeOCiyAqLyBzcGVlZEQ6MHgxRCxcbiAgICAgICAgICAgIC8qKiDkvY3nva5QSUTjgrLjgqTjg7MoUCnjgpLoqK3lrprjgZnjgosgKi8gcG9zaXRpb25QOjB4MUUsXG4gICAgICAgICAgICAvKiogUElE44Ky44Kk44Oz44KS44Oq44K744OD44OI44GZ44KLICovIHJlc2V0UElEOjB4MjIsXG4gICAgICAgICAgICAvKiog44OH44OQ44Kk44K5TEVE44Gu5Zu65pyJ6Imy44KS6Kit5a6a44GZ44KLICovIG93bkNvbG9yOjB4M0EsXG4gICAgICAgICAgICAvKiog5oyH5a6a44Gu6Kit5a6a5YCk44KS5Y+W5b6X44GZ44KLICovIHJlYWRSZWdpc3RlcjoweDQwLFxuICAgICAgICAgICAgLyoqIOWFqOOBpuOBruioreWumuWApOOCkuODleODqeODg+OCt+ODpeOBq+S/neWtmOOBmeOCiyAqLyBzYXZlQWxsUmVnaXN0ZXJzOjB4NDEsXG4gICAgICAgICAgICAvKiog5oyH5a6a44Gu6Kit5a6a5YCk44KS44Oq44K744OD44OI44GZ44KLICovIHJlc2V0UmVnaXN0ZXI6MHg0RSxcbiAgICAgICAgICAgIC8qKiDlhajoqK3lrprlgKTjgpLjg6rjgrvjg4Pjg4jjgZnjgosgKi8gcmVzZXRBbGxSZWdpc3RlcnM6MHg0RixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zjga7li5XkvZzjgpLkuI3oqLHlj6/jgajjgZnjgosgKi8gZGlzYWJsZToweDUwLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOWLleS9nOOCkuioseWPr+OBmeOCiyAqLyBlbmFibGU6MHg1MSxcbiAgICAgICAgICAgIC8qKiDpgJ/luqbjga7lpKfjgY3jgZXjgpLoqK3lrprjgZnjgosgKi8gc3BlZWQ6MHg1OCxcbiAgICAgICAgICAgIC8qKiDkvY3nva7jga7jg5fjg6rjgrvjg4Pjg4jjgpLooYzjgYbvvIjljp/ngrnoqK3lrprvvIkgKi8gcHJlc2V0UG9zaXRpb246MHg1QSxcbiAgICAgICAgICAgIC8qKiDmraPlm57ou6LjgZnjgovvvIjlj43mmYLoqIjlm57jgorvvIkgKi8gcnVuRm9yd2FyZDoweDYwLFxuICAgICAgICAgICAgLyoqIOmAhuWbnui7ouOBmeOCi++8iOaZguioiOWbnuOCiu+8iSAqLyBydW5SZXZlcnNlOjB4NjEsXG4gICAgICAgICAgICAvKiog57W25a++5L2N572u44Gr56e75YuV44GZ44KLICovIG1vdmVUb1Bvc2l0aW9uOjB4NjYsXG4gICAgICAgICAgICAvKiog55u45a++5L2N572u44Gr56e75YuV44GZ44KLICovIG1vdmVCeURpc3RhbmNlOjB4NjgsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844Gu5Yqx56OB44KS5YGc5q2i44GZ44KLICovIGZyZWU6MHg2QyxcbiAgICAgICAgICAgIC8qKiDpgJ/luqbjgrzjg63jgb7jgafmuJvpgJ/jgZflgZzmraLjgZnjgosgKi8gc3RvcDoweDZELFxuICAgICAgICAgICAgLyoqIOODiOODq+OCr+WItuW+oeOCkuihjOOBhiAqLyBob2xkVG9ycXVlOjB4NzIsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44KS5a6f6KGM44GZ44KLICovIGRvVGFza3NldDoweDgxLFxuICAgICAgICAgICAgLyoqIOODouODvOOCt+ODp+ODs+WGjeeUn+OBrumWi+Wni+WcsOeCueOBq+enu+WLleOBmeOCiyAqLyBwcmVwYXJlUGxheWJhY2tNb3Rpb246MHg4NixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgrfjg6fjg7PjgpLlho3nlJ/jgZnjgosgKi8gc3RhcnRQbGF5YmFjazoweDg3LFxuICAgICAgICAgICAgLyoqIOODouODvOOCt+ODp+ODs+WGjeeUn+OCkuWBnOatouOBmeOCiyAqLyBzdG9wUGxheWJhY2s6MHg4OCxcbiAgICAgICAgICAgIC8qKiDjgq3jg6Xjg7zjgpLlgZzmraLjgZnjgosgKi8gcGF1c2U6MHg5MCxcbiAgICAgICAgICAgIC8qKiDjgq3jg6Xjg7zjgpLlho3plovjgZnjgosgKi8gcmVzdW1lOjB4OTEsXG4gICAgICAgICAgICAvKiog44Kt44Ol44O844KS5oyH5a6a5pmC6ZaT5YGc5q2i44GX5YaN6ZaL44GZ44KLICovIHdhaXQ6MHg5MixcbiAgICAgICAgICAgIC8qKiDjgq3jg6Xjg7zjgpLjg6rjgrvjg4Pjg4jjgZnjgosgKi8gcmVzZXQ6MHg5NSxcbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLjgpLplovlp4vjgZnjgosgKi8gc3RhcnRSZWNvcmRpbmdUYXNrc2V0OjB4QTAsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44KS5YGc5q2i44GZ44KLICovIHN0b3BSZWNvcmRpbmdUYXNrc2V0OjB4QTIsXG4gICAgICAgICAgICAvKiog5oyH5a6a44Gu44K/44K544Kv44K744OD44OI44KS5YmK6Zmk44GZ44KLICovIGVyYXNlVGFza3NldDoweEEzLFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOCkuWFqOWJiumZpOOBmeOCiyAqLyBlcmFzZUFsbFRhc2tzZXRzOjB4QTQsXG4gICAgICAgICAgICAvKiog44OG44Kj44O844OB44Oz44Kw44Gu6ZaL5aeL5rqW5YKZ44KS6KGM44GGICovIHByZXBhcmVUZWFjaGluZ01vdGlvbjoweEFBLFxuICAgICAgICAgICAgLyoqIOODhuOCo+ODvOODgeODs+OCsOOCkumWi+Wni+OBmeOCiyAqLyBzdGFydFRlYWNoaW5nTW90aW9uOjB4QUIsXG4gICAgICAgICAgICAvKiog44OG44Kj44O844OB44Oz44Kw44KS5YGc5q2i44GZ44KLICovIHN0b3BUZWFjaGluZ01vdGlvbjoweEFDLFxuICAgICAgICAgICAgLyoqIOODhuOCo+ODvOODgeODs+OCsOOBp+immuOBiOOBn+WLleS9nOOCkuWJiumZpOOBmeOCiyAqLyBlcmFzZU1vdGlvbjoweEFELFxuICAgICAgICAgICAgLyoqIOODhuOCo+ODvOODgeODs+OCsOOBp+immuOBiOOBn+WFqOWLleS9nOOCkuWJiumZpOOBmeOCiyAqLyBlcmFzZUFsbE1vdGlvbjoweEFFLFxuICAgICAgICAgICAgLyoqIExFROOBrueCueeBr+eKtuaFi+OCkuOCu+ODg+ODiOOBmeOCiyAqLyBsZWQ6MHhFMCxcbiAgICAgICAgICAgIC8qKiBJTVXjga7lgKTlj5blvpco6YCa55+lKeOCkumWi+Wni+OBmeOCiyAqLyBlbmFibGVJTVU6MHhFQSxcbiAgICAgICAgICAgIC8qKiBJTVXjga7lgKTlj5blvpco6YCa55+lKeOCkuWBnOatouOBmeOCiyAqLyBkaXNhYmxlSU1VOjB4RUIsXG4gICAgICAgICAgICAvKiog44K344K544OG44Og44KS5YaN6LW35YuV44GZ44KLICovIHJlYm9vdDoweEYwLFxuICAgICAgICAgICAgLyoqIOODleOCoeODvOODoOOCpuOCp+OCouOCouODg+ODl+ODh+ODvOODiOODouODvOODieOBq+WFpeOCiyAqLyBlbnRlckRldmljZUZpcm13YXJlVXBkYXRlOjB4RkRcbiAgICAgICAgfTtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh0aGlzLl9NT1RPUl9DT01NQU5EKTsvL2luZm86OuW+jOOBi+OCieODleODquODvOOCuuOBl+OBquOBhOOBqGpzZG9j44GM55Sf5oiQ44GV44KM44Gq44GE44CCXG5cbiAgICAgICAgLy/jg6Ljg7zjgr/jg7zjga7lhajjgrPjg57jg7Pjg4nvvIjpgIblvJXnlKjvvIlcbiAgICAgICAgdGhpcy5fUkVWX01PVE9SX0NPTU1BTkQ9e307XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX01PVE9SX0NPTU1BTkQpLmZvckVhY2goKGspPT57dGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbdGhpcy5fTU9UT1JfQ09NTUFORFtrXV09azt9KTtcbiAgICAgICAgLy9TZW5kTm90aWZ5UHJvbWlz44Gu44Oq44K544OIXG4gICAgICAgIHRoaXMuX25vdGlmeVByb21pc0xpc3Q9W107XG4gICAgICAgIHRoaXMuY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OPXRoaXMuY29uc3RydWN0b3IuY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OO1xuICAgICAgICB0aGlzLmNtZExlZF9MRURfU1RBVEU9dGhpcy5jb25zdHJ1Y3Rvci5jbWRMZWRfTEVEX1NUQVRFO1xuICAgICAgICB0aGlzLmNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFPXRoaXMuY29uc3RydWN0b3IuY21kQ3VydmVUeXBlX0NVUlZFX1RZUEU7XG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gc2VjdGlvbjo6ZW50cnkgcG9pbnRcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICB0aGlzLl9jb25uZWN0VHlwZT1jb25uZWN0X3R5cGU7XG4gICAgICAgIHRoaXMuX0tNQ29tPWttY29tO1xuXG4gICAgICAgIC8v5YaF6YOo44Kk44OZ44Oz44OI44OQ44Kk44Oz44OJXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uSW5pdD0oY29ubmVjdG9yKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5pbml0LGNvbm5lY3Rvci5kZXZpY2VJbmZvKTsvL+ODh+ODkOOCpOOCueaDheWgseOCkui/lOOBmVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9LTUNvbS5vbkNvbm5lY3Q9KGNvbm5lY3Rvcik9PntcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUuY29ubmVjdCxjb25uZWN0b3IuZGV2aWNlSW5mbyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX0tNQ29tLm9uRGlzY29ubmVjdD0oY29ubmVjdG9yKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5kaXNjb25uZWN0LGNvbm5lY3Rvci5kZXZpY2VJbmZvKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fS01Db20ub25Db25uZWN0RmFpbHVyZT0oY29ubmVjdG9yLCBlcnIpPT57XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLmNvbm5lY3RGYWlsdXJlLGNvbm5lY3Rvci5kZXZpY2VJbmZvLGVycik7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zlm57ou6Lmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIHt7cG9zaXRpb246bnVtYmVyLHZlbG9jaXR5Om51bWJlcix0b3JxdWU6bnVtYmVyfX0gcmVzXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9LTUNvbS5vbk1vdG9yTWVhc3VyZW1lbnQ9KHJlcyk9PntcbiAgICAgICAgICAgIGxldCByb3RTdGF0ZT1uZXcgS01TdHJ1Y3R1cmVzLktNUm90U3RhdGUocmVzLnBvc2l0aW9uLHJlcy52ZWxvY2l0eSxyZXMudG9ycXVlKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUubW90b3JNZWFzdXJlbWVudCxyb3RTdGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7xJTVXmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIHtmdW5jdGlvbih7YWNjZWxYOm51bWJlcixhY2NlbFk6bnVtYmVyLGFjY2VsWjpudW1iZXIsdGVtcDpudW1iZXIsZ3lyb1g6bnVtYmVyLGd5cm9ZOm51bWJlcixneXJvWjpudW1iZXJ9KX0gcmVzXG4gICAgICAgICAqICBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fS01Db20ub25JbXVNZWFzdXJlbWVudD0ocmVzKT0+e1xuICAgICAgICAgICAgbGV0IGltdVN0YXRlPW5ldyBLTVN0cnVjdHVyZXMuS01JbXVTdGF0ZShyZXMuYWNjZWxYLHJlcy5hY2NlbFkscmVzLmFjY2VsWixyZXMudGVtcCxyZXMuZ3lyb1gscmVzLmd5cm9ZLHJlcy5neXJvWik7XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLmltdU1lYXN1cmVtZW50LGltdVN0YXRlKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvOioreWumuaDheWgseWPluW+l1xuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVnaXN0ZXJDbWRcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHJlc1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fS01Db20uX29uTW90b3JTZXR0aW5nQ0I9KHJlZ2lzdGVyQ21kLCByZXMpPT57XG4gICAgICAgICAgICBfS01Ob3RpZnlQcm9taXMuc2VuZEdyb3VwTm90aWZ5UmVzb2x2ZSh0aGlzLl9ub3RpZnlQcm9taXNMaXN0LHJlZ2lzdGVyQ21kLHJlcyk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOODl+ODreODkeODhuOCo1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgajjga5CTEXmjqXntprjgYzmnInlirnjgYtcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBnZXQgaXNDb25uZWN0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9LTUNvbS5kZXZpY2VJbmZvLmlzQ29ubmVjdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICog5o6l57aa5pa55byPXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge0tNTW90b3JDb21tYW5kS01PbmUuS01fQ09OTkVDVF9UWVBFfVxuICAgICAqL1xuICAgIGdldCBjb25uZWN0VHlwZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fY29ubmVjdFR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44OH44OQ44Kk44K55oOF5aCxXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge0tNRGV2aWNlSW5mb31cbiAgICAgKi9cbiAgICBnZXQgZGV2aWNlSW5mbygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fS01Db20uZGV2aWNlSW5mbztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmjqXntprjgrPjg43jgq/jgr/jg7xcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqIEB0eXBlIHtLTUNvbUJMRX1cbiAgICAgKi9cbiAgICBnZXQgY29ubmVjdG9yKCl7XG4gICAgICAgIHJldHVybiAgdGhpcy5fS01Db207XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogc2VjdGlvbjo644Oi44O844K/44O844Kz44Oe44Oz44OJIGh0dHBzOi8vZG9jdW1lbnQua2VpZ2FuLW1vdG9yLmNvbS9tb3Rvci1jb250cm9sLWNvbW1hbmQvbW90b3JfYWN0aW9uLmh0bWxcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zli5XkvZzjgpLkuI3oqLHlj6/jgajjgZnjgovvvIjkuIrkvY3lkb3ku6TvvIlcbiAgICAgKiBAZGVzYyDlronlhajnlKjvvJrjgZPjga7lkb3ku6TjgpLlhaXjgozjgovjgajjg6Ljg7zjgr/jg7zjga/li5XkvZzjgZfjgarjgYQ8YnI+XG4gICAgICog44Kz44Oe44Oz44OJ44Gv44K/44K544Kv44K744OD44OI44Gr6KiY6Yyy44GZ44KL44GT44Go44Gv5LiN5Y+vXG4gICAgICovXG4gICAgY21kRGlzYWJsZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5kaXNhYmxlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zli5XkvZzjgpLoqLHlj6/jgZnjgovvvIjkuIrkvY3lkb3ku6TvvIlcbiAgICAgKiBAZGVzYyDlronlhajnlKjvvJrjgZPjga7lkb3ku6TjgpLlhaXjgozjgovjgajjg6Ljg7zjgr/jg7zjga/li5XkvZzlj6/og73jgajjgarjgos8YnI+XG4gICAgICog44Oi44O844K/44O86LW35YuV5pmC44GvIGRpc2FibGUg54q25oWL44Gu44Gf44KB44CB5pys44Kz44Oe44Oz44OJ44Gn5YuV5L2c44KS6Kix5Y+v44GZ44KL5b+F6KaB44GM44GC44KKPGJyPlxuICAgICAqIOOCs+ODnuODs+ODieOBr+OCv+OCueOCr+OCu+ODg+ODiOOBq+iomOmMsuOBmeOCi+OBk+OBqOOBr+S4jeWPr1xuICAgICAqXG4gICAgICovXG4gICAgY21kRW5hYmxlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVuYWJsZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOmAn+W6puOBruWkp+OBjeOBleOCkuOCu+ODg+ODiOOBmeOCi++8iOWNmOS9jeezu++8mlJQTe+8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZF9ycG0gZmxvYXQgIFswLVggcnBtXeOAgCjmraPjga7mlbApXG4gICAgICovXG4gICAgY21kU3BlZWRfcnBtKHNwZWVkX3JwbSA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChzcGVlZF9ycG0qMC4xMDQ3MTk3NTUxMTk2NTk3NywxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWQsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6YCf5bqm44Gu5aSn44GN44GV44KS44K744OD44OI44GZ44KL77yI5Y2Y5L2N57O777ya44Op44K444Ki44Oz77yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIGZsb2F0IOmAn+W6puOBruWkp+OBjeOBlSDljZjkvY3vvJrop5LluqbvvIjjg6njgrjjgqLjg7PvvIkv56eSIFswLVggcnBzXeOAgCjmraPjga7mlbApXG4gICAgICovXG4gICAgY21kU3BlZWQoc3BlZWQgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNwZWVkLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5L2N572u44Gu44OX44Oq44K744OD44OI44KS6KGM44GG77yI5Y6f54K56Kit5a6a77yJ77yI5Y2Y5L2N57O777ya44Op44K444Ki44Oz77yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIGZsb2F0IOe1tuWvvuinkuW6pu+8mnJhZGlhbnNcbiAgICAgKi9cbiAgICBjbWRQcmVzZXRQb3NpdGlvbihwb3NpdGlvbiA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChLTVV0bC50b051bWJlcihwb3NpdGlvbiksMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQucHJlc2V0UG9zaXRpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmraPlm57ou6LjgZnjgovvvIjlj43mmYLoqIjlm57jgorvvIlcbiAgICAgKiBAZGVzYyBjbWRTcGVlZCDjgafkv53lrZjjgZXjgozjgZ/pgJ/luqbjgafjgIHmraPlm57ou6JcbiAgICAgKi9cbiAgICBjbWRSdW5Gb3J3YXJkKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJ1bkZvcndhcmQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOmAhuWbnui7ouOBmeOCi++8iOaZguioiOWbnuOCiu+8iVxuICAgICAqIEBkZXNjIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBp+OAgemAhuWbnui7olxuICAgICAqL1xuICAgIGNtZFJ1blJldmVyc2UoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQucnVuUmV2ZXJzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg57W25a++5L2N572u44Gr56e75YuV44GZ44KLXG4gICAgICogQGRlc2Mg6YCf44GV44GvIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBjOaOoeeUqOOBleOCjOOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBmbG9hdCDop5LluqbvvJpyYWRpYW5zXG4gICAgICovXG4gICAgY21kTW92ZVRvUG9zaXRpb24ocG9zaXRpb24pe1xuICAgICAgICBpZihwb3NpdGlvbj09PSB1bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KHBvc2l0aW9uLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVUb1Bvc2l0aW9uLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg55u45a++5L2N572u44Gr56e75YuV44GZ44KLXG4gICAgICogQGRlc2Mg6YCf44GV44GvIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBjOaOoeeUqOOBleOCjOOCi1xuICAgICAqIEBwYXJhbSAge251bWJlcn0gZGlzdGFuY2UgZmxvYXQg6KeS5bqm77yacmFkaWFuc1vlt6Y6K3JhZGlhbnMg5Y+zOi1yYWRpYW5zXVxuICAgICAqL1xuICAgIGNtZE1vdmVCeURpc3RhbmNlKGRpc3RhbmNlID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KGRpc3RhbmNlLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVCeURpc3RhbmNlLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5Yqx56OB44KS5YGc5q2i44GZ44KL77yI5oSf6Kem44Gv5q6L44KK44G+44GZ77yJXG4gICAgICogQGRlc2Mg5a6M5YWo44OV44Oq44O854q25oWL44KS5YaN54++44GZ44KL5aC05ZCI44Gv44CBIGNtZEZyZWUoKS5jbWREaXNhYmxlKCkg44Go44GX44Gm5LiL44GV44GE44CCXG4gICAgICovXG4gICAgY21kRnJlZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5mcmVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjgpLpgJ/luqbjgrzjg63jgb7jgafmuJvpgJ/jgZflgZzmraLjgZnjgotcbiAgICAgKiBAZGVzYyBycG0gPSAwIOOBqOOBquOCi+OAglxuICAgICAqL1xuICAgIGNtZFN0b3AoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg4jjg6vjgq/liLblvqHjgpLooYzjgYZcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9ycXVlIGZsb2F0IOODiOODq+OCryDljZjkvY3vvJpO44O7bSBbLVggfiArIFggTm1dIOaOqOWlqOWApCAwLjMtMC4wNVxuICAgICAqIEBkZXNjIOmAn+W6puOChOS9jee9ruOCkuWQjOaZguOBq+WItuW+oeOBmeOCi+WgtOWQiOOBr+OAgeODouODvOOCv+ODvOioreWumuOBriAweDBFOiBtYXhUb3JxdWUg44GoIDB4NjA6IHJ1bkZvcndhcmQg562J44KS5L2155So44GX44Gm5LiL44GV44GE44CCXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRIb2xkVG9ycXVlKHRvcnF1ZSl7XG4gICAgICAgIGlmKHRvcnF1ZT09PXVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQodG9ycXVlLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmhvbGRUb3JxdWUsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDoqJjmhrbjgZfjgZ/jgr/jgrnjgq/vvIjlkb3ku6TvvInjga7jgrvjg4Pjg4jjgpLlrp/ooYzjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCv+OCueOCr+OCu+ODg+ODiOeVquWPt++8iDDvvZ42NTUzNe+8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZXBlYXRpbmcgaW50IOe5sOOCiui/lOOBl+WbnuaVsCAw44Gv54Sh5Yi26ZmQXG4gICAgICpcbiAgICAgKiBAZGVzYyBLTS0xIOOBryBpbmRleDogMH40OSDjgb7jgafjgILvvIg1MOWAi+OBruODoeODouODquODkOODs+OCryDlkIQ4MTI4IEJ5dGUg44G+44Gn5Yi26ZmQ44GC44KK77yJPGJyPlxuICAgICAqIOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuOBr+OAgeOCs+ODnuODs+ODie+8iOOCv+OCueOCr+OCu+ODg+ODiO+8ieOCkuWPgueFp+S4i+OBleOBhOOAgiBodHRwczovL2RvY3VtZW50LmtlaWdhbi1tb3Rvci5jb20vbW90b3ItY29udHJvbC1jb21tYW5kL3Rhc2tzZXQuaHRtbFxuICAgICAqL1xuICAgIGNtZERvVGFza3NldChpbmRleCA9IDAscmVwZWF0aW5nID0gMSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMixNYXRoLmFicyhwYXJzZUludChyZXBlYXRpbmcsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmRvVGFza3NldCxidWZmZXIpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/jga7plovlp4vlnLDngrnjgavnp7vli5XjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOODouODvOOCt+ODp+ODs+eVquWPt++8iDDvvZ42NTUzNe+8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZXBlYXRpbmcgaW50IOe5sOOCiui/lOOBl+WbnuaVsCAw44Gv54Sh5Yi26ZmQXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLmNtZFByZXBhcmVQbGF5YmFja01vdGlvbl9TVEFSVF9QT1NJVElPTn0gc3RhcnRfcG9zaXRpb24gaW50IOOCueOCv+ODvOODiOS9jee9ruOBruioreWumjxicj5cbiAgICAgKiBTVEFSVF9QT1NJVElPTl9BQlM66KiY5oa244GV44KM44Gf6ZaL5aeL5L2N572u77yI57W25a++5bqn5qiZ77yJ44GL44KJ44K544K/44O844OIPGJyPlxuICAgICAqIFNUQVJUX1BPU0lUSU9OX0NVUlJFTlQ654++5Zyo44Gu5L2N572u44KS6ZaL5aeL5L2N572u44Go44GX44Gm44K544K/44O844OIXG4gICAgICpcbiAgICAgKlxuICAgICAqIEBkZXNjIEtNLTEg44GvIGluZGV4OiAwfjkg44G+44Gn44CC77yIMTDlgIvjga7jg6Hjg6Ljg6rjg5Djg7Pjgq/jgILvvInjgZ3jgozjgZ7jgowg57SEMuWIhuiomOmMsuWPr+iDveOAgjxicj5cbiAgICAgKiDjg4bjgqPjg7zjg4Hjg7PjgrDvvIjli5XkvZzjga7oqJjpjLLvvInjga/jgIHjgrPjg57jg7Pjg4nvvIjjg4bjgqPjg7zjg4Hjg7PjgrDvvInjgpLlj4LnhafkuIvjgZXjgYTjgII8YnI+aHR0cHM6Ly9kb2N1bWVudC5rZWlnYW4tbW90b3IuY29tL21vdG9yLWNvbnRyb2wtY29tbWFuZC90ZWFjaGluZy5odG1sPGJyPlxuICAgICAqXG4gICAgICogQHRvZG8gcmVwZWF0aW5nLCBvcHRpb24g44Gr44Gk44GE44Gm44Gv44OV44Kh44O844Og44Km44Kn44Ki5pyq5a6f6KOFIDIwMTcuMTAuMTA8YnI+XG4gICAgICogIOWGjeeUn+WbnuaVsOOBr++8keWbnuWbuuWumuOBp+OBguOCiuOAgeacrOOCs+ODnuODs+ODieOCkuWun+ihjOOBmeOCi+OBqOOAgeiomOmMsuOBl+OBn+e1tuWvvuS9jee9ruOBruacgOWIneOBruODneOCpOODs+ODiOOBq+enu+WLleOBmeOCi1xuICAgICAqL1xuICAgIGNtZFByZXBhcmVQbGF5YmFja01vdGlvbihpbmRleCA9IDAscmVwZWF0aW5nID0gMCxzdGFydF9wb3NpdGlvbiA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDcpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDIsTWF0aC5hYnMocGFyc2VJbnQocmVwZWF0aW5nLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCg2LE1hdGguYWJzKHBhcnNlSW50KHN0YXJ0X3Bvc2l0aW9uLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wcmVwYXJlUGxheWJhY2tNb3Rpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgrfjg6fjg7PjgpLlho3nlJ/jgZnjgotcbiAgICAgKi9cbiAgICBjbWRTdGFydFBsYXliYWNrKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0YXJ0UGxheWJhY2spO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCt+ODp+ODs+WGjeeUn+OCkuWBnOatouOBmeOCi1xuICAgICAqL1xuICAgIGNtZFN0b3BQbGF5YmFjaygpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdG9wUGxheWJhY2spO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBzZWN0aW9uOjrjgq3jg6Xjg7zmk43kvZxcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Kt44Ol44O844KS5LiA5pmC5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kUGF1c2UoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQucGF1c2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCreODpeODvOOCkuWGjemWi+OBmeOCi++8iOiThOepjeOBleOCjOOBn+OCv+OCueOCr+OCkuWGjemWi++8iVxuICAgICAqL1xuICAgIGNtZFJlc3VtZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZXN1bWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCreODpeODvOOCkuaMh+WumuaZgumWk+WBnOatouOBl+WGjemWi+OBmeOCi1xuICAgICAqIEBkZXNjIGNtZFBhdXNl77yI44Kt44Ol44O85YGc5q2i77yJ44KS5a6f6KGM44GX44CB5oyH5a6a5pmC6ZaT77yI44Of44Oq56eS77yJ57WM6YGO5b6M44CB6Ieq5YuV55qE44GrIGNtZFJlc3VtZe+8iOOCreODpeODvOWGjemWi++8iSDjgpLooYzjgYTjgb7jgZnjgIJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZSDlgZzmraLmmYLplpNbbXNlY11cbiAgICAgKi9cbiAgICBjbWRXYWl0KHRpbWUgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDAsTWF0aC5hYnMocGFyc2VJbnQodGltZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQud2FpdCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCreODpeODvOOCkuODquOCu+ODg+ODiOOBmeOCi1xuICAgICAqL1xuICAgIGNtZFJlc2V0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo644K/44K544Kv44K744OD44OIXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44K/44K544Kv77yI5ZG95Luk77yJ44Gu44K744OD44OI44Gu6KiY6Yyy44KS6ZaL5aeL44GZ44KLXG4gICAgICogQGRlc2Mg6KiY5oa244GZ44KL44Kk44Oz44OH44OD44Kv44K544Gu44Oh44Oi44Oq44Gv44Kz44Oe44Oz44OJ77yaZXJhc2VUYXNrc2V0IOOBq+OCiOOCiuS6iOOCgea2iOWOu+OBleOCjOOBpuOBhOOCi+W/heimgeOBjOOBguOCilxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBpbnQg44Kk44Oz44OH44OD44Kv44K5IEtNLTEg44Gu5aC05ZCI44CB44Kk44Oz44OH44OD44Kv44K544Gu5YCk44GvIDDvvZ40OSDvvIjoqIg1MOWAi+iomOmMsu+8iVxuICAgICAqL1xuICAgIGNtZFN0YXJ0UmVjb3JkaW5nVGFza1NldChpbmRleCA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnRSZWNvcmRpbmdUYXNrc2V0LGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44KS5YGc5q2i44GZ44KLXG4gICAgICogQGRlc2Mgc3RhcnRSZWNvcmRpbmdUYXNrc2V0IOWun+aWveS4reOBruOBv+acieWKuVxuICAgICAqL1xuICAgIGNtZFN0b3BSZWNvcmRpbmdUYXNrc2V0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3BSZWNvcmRpbmdUYXNrc2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjga7jgqTjg7Pjg4fjg4Pjgq/jgrnjga7jgr/jgrnjgq/jgrvjg4Pjg4jjgpLmtojljrvjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAqL1xuICAgIGNtZEVyYXNlVGFza3NldChpbmRleCA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuZXJhc2VUYXNrc2V0LGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu44K/44K544Kv44K744OD44OI44KS5raI5Y6744GZ44KLXG4gICAgICovXG4gICAgY21kRXJhc2VBbGxUYXNrc2V0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlQWxsVGFza3NldHMpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBzZWN0aW9uOjrjg4bjgqPjg7zjg4Hjg7PjgrBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Kk44Oz44OH44OD44Kv44K544Go6KiY6Yyy5pmC6ZaTW21zZWNd44KS5oyH5a6a44GX44CB44OG44Kj44O844OB44Oz44Kw44Gu6ZaL5aeL5rqW5YKZ44KS6KGM44GG44CCXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjgqTjg7Pjg4fjg4Pjgq/jgrlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZSBpbnQg6KiY6Yyy5pmC6ZaTIFttc2VjIDAtNjU0MDhdXG4gICAgICpcbiAgICAgKiBAZGVzYyBLTS0xIOOBruWgtOWQiOOAgeOCpOODs+ODh+ODg+OCr+OCueOBruWApOOBryAw772eOSDvvIjoqIgxMOWAi+iomOmMsu+8ieOBqOOBquOCi+OAguiomOmMsuaZgumWk+OBryA2NTQwOCBbbXNlY10g44KS6LaF44GI44KL44GT44Go44Gv44Gn44GN44Gq44GEXG4gICAgICogICAgICAg6KiY5oa244GZ44KL44Kk44Oz44OH44OD44Kv44K544Gu44Oh44Oi44Oq44GvYmxlRXJhc2VNb3Rpb24g44Gr44KI44KK5LqI44KB5raI5Y6744GV44KM44Gm44GE44KL5b+F6KaB44GM44GC44KLXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRQcmVwYXJlVGVhY2hpbmdNb3Rpb24oaW5kZXggPSAwLGxlbmd0aFJlY29yZGluZ1RpbWUgPSAzMDAwMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMixNYXRoLmFicyhwYXJzZUludChsZW5ndGhSZWNvcmRpbmdUaW1lLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wcmVwYXJlVGVhY2hpbmdNb3Rpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDnm7TliY3jgavooYzjgaPjgZ8gcHJlcGFyZVRlYWNoaW5nTW90aW9uIOOBruadoeS7tuOBp+ODhuOCo+ODvOODgeODs+OCsOOCkumWi+Wni+OBmeOCi+OAglxuICAgICAqIGJsZVByZXBhcmVUZWFjaGluZ01vdGlvbiDjgpLlrp/ooYzjgZfjgZ/nm7Tlvozjga7jgb/mnInlirnjgIJcbiAgICAgKi9cbiAgICBjbWRTdGFydFRlYWNoaW5nTW90aW9uKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0YXJ0VGVhY2hpbmdNb3Rpb24pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWun+ihjOS4reOBruODhuOCo+ODvOODgeODs+OCsOOCkuWBnOatouOBmeOCi1xuICAgICAqL1xuICAgIGNtZFN0b3BUZWFjaGluZ01vdGlvbigpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdG9wVGVhY2hpbmdNb3Rpb24pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOaMh+WumuOBl+OBn+OCpOODs+ODh+ODg+OCr+OCueOBruODouODvOOCt+ODp+ODs+OCkua2iOWOu+OBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBpbnQg44Kk44Oz44OH44OD44Kv44K5XG4gICAgICpcbiAgICAgKiBAZGVzYyBLTS0xIOOBruWgtOWQiOOAgeOCpOODs+ODh+ODg+OCr+OCueOBruWApOOBryAw772eOSDvvIjoqIgxMOWAi+iomOmMsu+8ieOBqOOBquOCi1xuICAgICAqXG4gICAgICovXG4gICAgY21kRXJhc2VNb3Rpb24oaW5kZXggPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlTW90aW9uLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu44Oi44O844K344On44Oz44KS5raI5Y6744GZ44KLXG4gICAgICovXG4gICAgY21kRXJhc2VBbGxNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuZXJhc2VBbGxNb3Rpb24pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBzZWN0aW9uOjpMRURcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgTEVE44Gu54K554Gv54q25oWL44KS44K744OD44OI44GZ44KLXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLmNtZExlZF9MRURfU1RBVEV9IGNtZExlZF9MRURfU1RBVEUgaW50IOeCueeBr+eKtuaFizxicj5cbiAgICAgKiAgIExFRF9TVEFURV9PRkY6TEVE5raI54GvPGJyPlxuICAgICAqICAgTEVEX1NUQVRFX09OX1NPTElEOkxFROeCueeBrzxicj5cbiAgICAgKiAgIExFRF9TVEFURV9PTl9GTEFTSDpMRUTngrnmu4XvvIjkuIDlrprplpPpmpTjgafngrnmu4XvvIk8YnI+XG4gICAgICogICBMRURfU1RBVEVfT05fRElNOkxFROOBjOOChuOBo+OBj+OCiuaYjua7heOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZWQgaW50IDAtMjU1XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGdyZWVuIGludCAwLTI1NVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBibHVlIGludCAwLTI1NVxuICAgICAqL1xuICAgIGNtZExlZChjbWRMZWRfTEVEX1NUQVRFLHJlZCxncmVlbixibHVlKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxNYXRoLmFicyhwYXJzZUludChjbWRMZWRfTEVEX1NUQVRFLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgxLE1hdGguYWJzKHBhcnNlSW50KHJlZCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMixNYXRoLmFicyhwYXJzZUludChncmVlbiwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMyxNYXRoLmFicyhwYXJzZUludChibHVlLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5sZWQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gSU1VIOOCuOODo+OCpOODrVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBJTVUo44K444Oj44Kk44OtKeOBruWApOWPluW+lyjpgJrnn6Up44KS6ZaL5aeL44GZ44KLIChCTEXlsILnlKjjgrPjg57jg7Pjg4kpXG4gICAgICpcbiAgICAgKiBAZGVzYyDmnKzjgrPjg57jg7Pjg4njgpLlrp/ooYzjgZnjgovjgajjgIFJTVXjga7jg4fjg7zjgr/jga9CTEXjga7jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrlNT1RPUl9JTVVfTUVBU1VSRU1FTlTjgavpgJrnn6XjgZXjgozjgos8YnI+XG4gICAgICogTU9UT1JfSU1VX01FQVNVUkVNRU5U44Gubm90aWZ544Gv44Kk44OZ44Oz44OI44K/44Kk44OXIEtNTW90b3JDb21tYW5kS01PbmUuRVZFTlRfVFlQRS5pbXVNZWFzdXJlbWVudCDjgavpgJrnn6VcbiAgICAgKi9cbiAgICBjbWRFbmFibGVJTVUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW5hYmxlSU1VKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBJTVUo44K444Oj44Kk44OtKeOBruWApOWPluW+lyjpgJrnn6Up44KS5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kRGlzYWJsZUlNVSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5kaXNhYmxlSU1VKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8g44K344K544OG44OgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCt+OCueODhuODoOOCkuWGjei1t+WLleOBmeOCi1xuICAgICAqIEBkZXNjIEJMReOBq+aOpee2muOBl+OBpuOBhOOBn+WgtOWQiOOAgeWIh+aWreOBl+OBpuOBi+OCieWGjei1t+WLlVxuICAgICAqL1xuICAgIGNtZFJlYm9vdCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZWJvb3QpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODleOCoeODvOODoOOCpuOCp+OCouOCouODg+ODl+ODh+ODvOODiOODouODvOODieOBq+WFpeOCi1xuICAgICAqIEBkZXNjIOODleOCoeODvOODoOOCpuOCp+OCouOCkuOCouODg+ODl+ODh+ODvOODiOOBmeOCi+OBn+OCgeOBruODluODvOODiOODreODvOODgOODvOODouODvOODieOBq+WFpeOCi+OAgu+8iOOCt+OCueODhuODoOOBr+WGjei1t+WLleOBleOCjOOCi+OAgu+8iVxuICAgICAqL1xuICAgIGNtZEVudGVyRGV2aWNlRmlybXdhcmVVcGRhdGUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW50ZXJEZXZpY2VGaXJtd2FyZVVwZGF0ZSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIOODouODvOOCv+ODvOioreWumuOAgE1PVE9SX1NFVFRJTkdcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5pyA5aSn6YCf44GV44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heFNwZWVkIGZsb2F0IOacgOWkp+mAn+OBlSBbcmFkaWFuIC8gc2Vjb25kXe+8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZE1heFNwZWVkKG1heFNwZWVkKXtcbiAgICAgICAgaWYobWF4U3BlZWQ9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KG1heFNwZWVkLDEwKSkpOy8vdG9kbzo6TmFO44GM6L+U44KL5Y+v6IO95oCnIHBhcnNlRmxvYXQoXCJhYWFcIiwxMCk9PT1OYU5cbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQubWF4U3BlZWQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7mnIDlsI/pgJ/jgZXjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4U3BlZWQgZmxvYXQg5pyA5bCP6YCf44GVIFtyYWRpYW4gLyBzZWNvbmRd77yI5q2j44Gu5YCk77yJXG4gICAgICogQGRlc2MgbWluU3BlZWQg44Gv44CBYmxlUHJlcGFyZVBsYXliYWNrTW90aW9uIOWun+ihjOOBrumam+OAgemWi+Wni+WcsOeCueOBq+enu+WLleOBmeOCi+mAn+OBleOBqOOBl+OBpuS9v+eUqOOBleOCjOOCi+OAgumAmuW4uOaZgumBi+i7ouOBp+OBr+S9v+eUqOOBleOCjOOBquOBhOOAglxuICAgICAqL1xuICAgIGNtZE1pblNwZWVkKG1pblNwZWVkKXtcbiAgICAgICAgaWYobWluU3BlZWQ9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KG1pblNwZWVkLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5taW5TcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWKoOa4m+mAn+absue3muOCkuaMh+WumuOBmeOCi++8iOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODq+OBruioreWumu+8iVxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRX0gY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUgaW50IOWKoOa4m+mAn+OCq+ODvOODluOCquODl+OCt+ODp+ODszxicj5cbiAgICAgKiAgICAgIENVUlZFX1RZUEVfTk9ORTowIOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPRkY8YnI+XG4gICAgICogICAgICBDVVJWRV9UWVBFX1RSQVBFWk9JRDoxIOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPTiDvvIjlj7DlvaLliqDmuJvpgJ/vvIlcbiAgICAgKi9cbiAgICBjbWRDdXJ2ZVR5cGUoY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxNYXRoLmFicyhwYXJzZUludChjbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuY3VydmVUeXBlLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5Yqg6YCf5bqm44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFjYyBmbG9hdCDliqDpgJ/luqYgMC0yMDAgW3JhZGlhbiAvIHNlY29uZF4yXe+8iOato+OBruWApO+8iVxuICAgICAqIEBkZXNjIGFjYyDjga/jgIHjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT04g44Gu5aC05ZCI44CB5Yqg6YCf5pmC44Gr5L2/55So44GV44KM44G+44GZ44CC77yI5Yqg6YCf5pmC44Gu55u057ea44Gu5YK+44GN77yJXG4gICAgICovXG4gICAgY21kQWNjKGFjYyA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChhY2MsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELmFjYyxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrua4m+mAn+W6puOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWMgZmxvYXQg5rib6YCf5bqmIDAtMjAwIFtyYWRpYW4gLyBzZWNvbmReMl3vvIjmraPjga7lgKTvvIlcbiAgICAgKiBAZGVzYyBkZWMg44Gv44CB44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9OIOOBruWgtOWQiOOAgea4m+mAn+aZguOBq+S9v+eUqOOBleOCjOOBvuOBmeOAgu+8iOa4m+mAn+aZguOBruebtOe3muOBruWCvuOBje+8iVxuICAgICAqL1xuICAgIGNtZERlYyhkZWMgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoZGVjLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5kZWMsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7mnIDlpKfjg4jjg6vjgq/vvIjntbblr77lgKTvvInjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4VG9ycXVlIGZsb2F0IOacgOWkp+ODiOODq+OCryBbTiptXe+8iOato+OBruWApO+8iVxuICAgICAqXG4gICAgICogQGRlc2MgbWF4VG9ycXVlIOOCkuioreWumuOBmeOCi+OBk+OBqOOBq+OCiOOCiuOAgeODiOODq+OCr+OBrue1tuWvvuWApOOBjCBtYXhUb3JxdWUg44KS6LaF44GI44Gq44GE44KI44GG44Gr6YGL6Lui44GX44G+44GZ44CCPGJyPlxuICAgICAqIG1heFRvcnF1ZSA9IDAuMSBbTiptXSDjga7lvozjgasgcnVuRm9yd2FyZCDvvIjmraPlm57ou6LvvInjgpLooYzjgaPjgZ/loLTlkIjjgIEwLjEgTiptIOOCkui2heOBiOOBquOBhOOCiOOBhuOBq+OBneOBrumAn+W6puOCkuOBquOCi+OBoOOBkee2reaMgeOBmeOCi+OAgjxicj5cbiAgICAgKiDjgZ/jgaDjgZfjgIHjg4jjg6vjgq/jga7mnIDlpKflgKTliLbpmZDjgavjgojjgorjgIHjgrfjgrnjg4bjg6DjgavjgojjgaPjgabjga/liLblvqHmgKfvvIjmjK/li5XvvInjgYzmgqrljJbjgZnjgovlj6/og73mgKfjgYzjgYLjgovjgIJcbiAgICAgKlxuICAgICAqL1xuICAgIGNtZE1heFRvcnF1ZShtYXhUb3JxdWUpe1xuICAgICAgICBpZihtYXhUb3JxdWU9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KG1heFRvcnF1ZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQubWF4VG9ycXVlLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrlDvvIjmr5TkvovvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcUN1cnJlbnRQIGZsb2F0IHHpm7vmtYFQ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUUN1cnJlbnRQKHFDdXJyZW50UCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHFDdXJyZW50UCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucUN1cnJlbnRQLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrlDvvIjmr5TkvovvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcUN1cnJlbnRJIGZsb2F0IHHpm7vmtYFJ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUUN1cnJlbnRJKHFDdXJyZW50SSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHFDdXJyZW50SSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucUN1cnJlbnRJLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrkTvvIjlvq7liIbvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcUN1cnJlbnREIGZsb2F0IHHpm7vmtYFE44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUUN1cnJlbnREKHFDdXJyZW50RCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHFDdXJyZW50RCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucUN1cnJlbnRELGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrkTvvIjlvq7liIbvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWRQIGZsb2F0IOmAn+W6plDjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRTcGVlZFAoc3BlZWRQKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWRQLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZFAsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7pgJ/luqZQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5J77yI56mN5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkSSBmbG9hdCDpgJ/luqZJ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kU3BlZWRJKHNwZWVkSSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkSSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWRJLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu6YCf5bqmUElE44Kz44Oz44OI44Ot44O844Op44GuRO+8iOW+ruWIhu+8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZEQgZmxvYXQg6YCf5bqmROOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFNwZWVkRChzcGVlZEQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChzcGVlZEQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNwZWVkRCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruS9jee9rlBJROOCs+ODs+ODiOODreODvOODqeOBrlDvvIjmr5TkvovvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb25QIGZsb2F0IOS9jee9rlDjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRQb3NpdGlvblAocG9zaXRpb25QKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQocG9zaXRpb25QLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5wb3NpdGlvblAsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDlhajjgabjga5QSUTjg5Hjg6njg6Hjg7zjgr/jgpLjg6rjgrvjg4Pjg4jjgZfjgabjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/oqK3lrprjgavmiLvjgZlcbiAgICAgKiBAZGVzYyBxQ3VycmVudFAsIHFDdXJyZW50SSwgIHFDdXJyZW50RCwgc3BlZWRQLCBzcGVlZEksIHNwZWVkRCwgcG9zaXRpb25QIOOCkuODquOCu+ODg+ODiOOBl+OBvuOBmVxuICAgICAqXG4gICAgICovXG4gICAgY21kUmVzZXRQSUQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzZXRQSUQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrui1t+WLleaZguWbuuaciUxFROOCq+ODqeODvOOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZWQgaW50IDAtMjU1XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGdyZWVuIGludCAwLTI1NVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBibHVlIGludCAwLTI1NVxuICAgICAqXG4gICAgICogQGRlc2Mgb3duQ29sb3Ig44Gv44Ki44Kk44OJ44Or5pmC44Gu5Zu65pyJTEVE44Kr44Op44O844CCPGJyPnNhdmVBbGxTZXR0aW5nc+OCkuWun+ihjOOBl+OAgeWGjei1t+WLleW+jOOBq+WIneOCgeOBpuWPjeaYoOOBleOCjOOCi+OAgjxicj5cbiAgICAgKiDjgZPjga7oqK3lrprlgKTjgpLlpInmm7TjgZfjgZ/loLTlkIjjgIFCTEXjga4gRGV2aWNlIE5hbWUg44Gu5LiLM+ahgeOBjOWkieabtOOBleOCjOOCi+OAglxuICAgICAqL1xuICAgIGNtZE93bkNvbG9yKHJlZCxncmVlbixibHVlKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigzKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxNYXRoLmFicyhwYXJzZUludChyZWQsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDEsTWF0aC5hYnMocGFyc2VJbnQoZ3JlZW4sMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDIsTWF0aC5hYnMocGFyc2VJbnQoYmx1ZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQub3duQ29sb3IsYnVmZmVyKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOaMh+WumuOBl+OBn+ioreWumuWApOOCkuWPluW+lyAoQkxF5bCC55So44Kz44Oe44Oz44OJKVxuICAgICAqIEBwYXJhbSB7bnVtYmVyIHwgYXJyYXl9IHJlZ2lzdGVycyA8aW50IHwgW10+IOWPluW+l+OBmeOCi+ODl+ODreODkeODhuOCo+OBruOCs+ODnuODs+ODiSjjg6zjgrjjgrnjgr/nlarlj7cp5YCkXG4gICAgICogQHJldHVybnMge1Byb21pc2UuPGludCB8IGFycmF5Pn0g5Y+W5b6X44GX44Gf5YCkIDxicj5yZWdpc3RlcnPjgYxpbnQ944Os44K444K544K/5YCk44Gu44OX44Oq44Of44OG44Kj44OW5YCkIDxicj5yZWdpc3RlcnPjgYxBcnJheT3jg6zjgrjjgrnjgr/lgKTjga7jgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKlxuICAgICAqIEBub25lIOWPluW+l+OBmeOCi+WApOOBr+OCs+ODnuODs+ODieWun+ihjOW+jOOBq0JMReOBruOCreODo+ODqeOCr+OCv+ODquOCueODhuOCo+OCr+OCuU1PVE9SX1NFVFRJTkfjgavpgJrnn6XjgZXjgozjgovjgII8YnI+XG4gICAgICogICAgICAg44Gd44KM44KS5ou+44Gj44GmcHJvbWlzZeOCquODluOCuOOCp+OCr+ODiOOBruOBrnJlc29sdmXjgavov5TjgZfjgablh6bnkIbjgpLnuYvjgZA8YnI+XG4gICAgICogICAgICAgTU9UT1JfU0VUVElOR+OBrm5vdGlmeeOBr19vbkJsZU1vdG9yU2V0dGluZ+OBp+WPluW+l1xuICAgICAqL1xuXG4gICAgY21kUmVhZFJlZ2lzdGVyKHJlZ2lzdGVycyl7XG4gICAgICAgIGlmKHJlZ2lzdGVycyBpbnN0YW5jZW9mIEFycmF5KXtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoYWxscmVzb2x2ZSwgYWxscmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZUxpc3Q9W107XG4gICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7aTxyZWdpc3RlcnMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZWdpc3Rlcj1yZWdpc3RlcnNbaV07XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VMaXN0LnB1c2goIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNjcD1uZXcgX0tNTm90aWZ5UHJvbWlzKHJlZ2lzdGVyLHRoaXMuX1JFVl9NT1RPUl9DT01NQU5EW3JlZ2lzdGVyXSx0aGlzLl9ub3RpZnlQcm9taXNMaXN0LHJlc29sdmUscmVqZWN0LDEwMDApOy8vbm90aWZ557WM55Sx44GucmVzdWx044KSUHJvbWlz44Go57SQ5LuY44GRXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCwgcGFyc2VJbnQocmVnaXN0ZXIsIDEwKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5yZWFkUmVnaXN0ZXIsIGJ1ZmZlcixjY3ApO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKHByb21pc2VMaXN0KS50aGVuKChyZXNhcik9PntcbiAgICAgICAgICAgICAgICAgICAgbGV0IHQ9W3t9XS5jb25jYXQocmVzYXIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcnRvYmo9T2JqZWN0LmFzc2lnbi5hcHBseShudWxsLHQpO1xuICAgICAgICAgICAgICAgICAgICBhbGxyZXNvbHZlKHJ0b2JqKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgobXNnKT0+e1xuICAgICAgICAgICAgICAgICAgICBhbGxyZWplY3QobXNnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgobGFzdHJlc29sdmUsIGxhc3RyZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZWdpc3Rlcj1yZWdpc3RlcnM7XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjY3A9bmV3IF9LTU5vdGlmeVByb21pcyhyZWdpc3Rlcix0aGlzLl9SRVZfTU9UT1JfQ09NTUFORFtyZWdpc3Rlcl0sdGhpcy5fbm90aWZ5UHJvbWlzTGlzdCxyZXNvbHZlLHJlamVjdCwxMDAwKTsvL25vdGlmeee1jOeUseOBrnJlc3VsdOOCklByb21pc+OBqOe0kOS7mOOBkVxuICAgICAgICAgICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICAgICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLCBwYXJzZUludChyZWdpc3RlciwgMTApKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZFJlZ2lzdGVyLCBidWZmZXIsY2NwKTtcbiAgICAgICAgICAgICAgICB9KS50aGVuKChyZXMpPT57XG4gICAgICAgICAgICAgICAgICAgIGxhc3RyZXNvbHZlKHJlc1tPYmplY3Qua2V5cyhyZXMpWzBdXSk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKG1zZyk9PntcbiAgICAgICAgICAgICAgICAgICAgbGFzdHJlamVjdChtc2cpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga7lhajjgabjga7jg6zjgrjjgrnjgr/lgKTjga7lj5blvpdcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZS48YXJyYXk+fVxuICAgICAqL1xuICAgIGNtZFJlYWRBbGxSZWdpc3Rlcigpe1xuICAgICAgIGxldCBjbT0gdGhpcy5jb25zdHJ1Y3Rvci5jbWRSZWFkUmVnaXN0ZXJfQ09NTUFORDtcbiAgICAgICAgbGV0IGFsbGNtZHM9W107XG4gICAgICAgIE9iamVjdC5rZXlzKGNtKS5mb3JFYWNoKChrKT0+e2FsbGNtZHMucHVzaChjbVtrXSk7fSk7XG5cbiAgICAgICByZXR1cm4gdGhpcy5jbWRSZWFkUmVnaXN0ZXIoYWxsY21kcyk7XG4gICAgfVxuICAgIC8vLy8vL+S/neWtmFxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBruioreWumuWApOOCkuODleODqeODg+OCt+ODpeODoeODouODquOBq+S/neWtmOOBmeOCi1xuICAgICAqIEBkZXNjIOacrOOCs+ODnuODs+ODieOCkuWun+ihjOOBl+OBquOBhOmZkOOCiuOAgeioreWumuWApOOBr+ODouODvOOCv+ODvOOBq+awuOS5heeahOOBq+S/neWtmOOBleOCjOOBquOBhCjlho3otbfli5XjgafmtojjgYjjgospXG4gICAgICovXG4gICAgY21kU2F2ZUFsbFJlZ2lzdGVycygpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5zYXZlQWxsUmVnaXN0ZXJzKTtcbiAgICB9XG5cbiAgICAvLy8vLy/jg6rjgrvjg4Pjg4hcbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjgZfjgZ/jg6zjgrjjgrnjgr/jgpLjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuY21kUmVhZFJlZ2lzdGVyX0NPTU1BTkR9IHJlZ2lzdGVyIOWIneacn+WApOOBq+ODquOCu+ODg+ODiOOBmeOCi+OCs+ODnuODs+ODiSjjg6zjgrjjgrnjgr8p5YCkXG4gICAgICovXG4gICAgY21kUmVzZXRSZWdpc3RlcihyZWdpc3Rlcil7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQocmVnaXN0ZXIsMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzZXRSZWdpc3RlcixidWZmZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDlhajjgabjga7jg6zjgrjjgrnjgr/jgpLjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICAgKiBAZGVzYyBibGVTYXZlQWxsUmVnaXN0ZXJz44KS5a6f6KGM44GX44Gq44GE6ZmQ44KK44CB44Oq44K744OD44OI5YCk44Gv44Oi44O844K/44O844Gr5rC45LmF55qE44Gr5L+d5a2Y44GV44KM44Gq44GEKOWGjei1t+WLleOBp+a2iOOBiOOCiylcbiAgICAgKi9cbiAgICBjbWRSZXNldEFsbFJlZ2lzdGVycygpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5yZXNldEFsbFJlZ2lzdGVycyk7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5YaF6YOoXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG5cbi8vLy8vL2NsYXNzLy9cbn1cblxuXG4vKipcbiAqIFNlbmRCbGVOb3RpZnlQcm9taXNcbiAqIOOAgGNtZFJlYWRSZWdpc3RlcuetieOBrkJMReWRvOOBs+WHuuOBl+W+jOOBq1xuICog44CA44Kz44Oe44Oz44OJ57WQ5p6c44GMbm90aWZ544Gn6YCa55+l44GV44KM44KL44Kz44Oe44Oz44OJ44KSUHJvbWlz44Go57SQ5LuY44GR44KL54K644Gu44Kv44Op44K5XG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfS01Ob3RpZnlQcm9taXN7XG4gICAgLy/miJDlip/pgJrnn6VcbiAgICBzdGF0aWMgc2VuZEdyb3VwTm90aWZ5UmVzb2x2ZShncm91cEFycmF5LHRhZ05hbWUsdmFsKXtcbiAgICAgICAgaWYoIWdyb3VwQXJyYXkgaW5zdGFuY2VvZiBBcnJheSl7cmV0dXJuO31cbiAgICAgICAgLy/pgIHkv6FJROOBrumAmuefpSBDYWxsYmFja1Byb21pc+OBp+WRvOOBs+WHuuOBl+WFg+OBruODoeOCveODg+ODieOBrlByb21pc+OBq+i/lOOBmVxuICAgICAgICBmb3IobGV0IGk9MDsgaTxncm91cEFycmF5Lmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGlmKCBncm91cEFycmF5W2ldLnRhZ05hbWU9PT10YWdOYW1lICl7XG4gICAgICAgICAgICAgICAgZ3JvdXBBcnJheVtpXS5jYWxsUmVzb2x2ZSh2YWwpO1xuICAgICAgICAgICAgICAgIGdyb3VwQXJyYXkuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogY29uc3RcbiAgICAgKiBAcGFyYW0gdGFnTmFtZVxuICAgICAqIEBwYXJhbSBncm91cEFycmF5XG4gICAgICogQHBhcmFtIHByb21pc1Jlc29sdmVPYmpcbiAgICAgKiBAcGFyYW0gcHJvbWlzUmVqZWN0T2JqXG4gICAgICogQHBhcmFtIHJlamVjdFRpbWVPdXRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0YWdOYW1lLHRhZ0luZm89bnVsbCxncm91cEFycmF5PVtdLHByb21pc1Jlc29sdmVPYmosIHByb21pc1JlamVjdE9iaixyZWplY3RUaW1lT3V0KXtcbiAgICAgICAgdGhpcy50aW1lb3V0SWQ9MDtcbiAgICAgICAgdGhpcy50YWdOYW1lPXRhZ05hbWU7XG4gICAgICAgIHRoaXMudGFnSW5mbz10YWdJbmZvO1xuICAgICAgICB0aGlzLmdyb3VwQXJyYXk9Z3JvdXBBcnJheSBpbnN0YW5jZW9mIEFycmF5P2dyb3VwQXJyYXk6W107XG4gICAgICAgIHRoaXMuZ3JvdXBBcnJheS5wdXNoKHRoaXMpO1xuICAgICAgICB0aGlzLnByb21pc1Jlc29sdmVPYmo9cHJvbWlzUmVzb2x2ZU9iajtcbiAgICAgICAgdGhpcy5wcm9taXNSZWplY3RPYmo9cHJvbWlzUmVqZWN0T2JqO1xuICAgICAgICB0aGlzLnJlamVjdFRpbWVPdXQ9cmVqZWN0VGltZU91dDtcbiAgICB9XG4gICAgLy/jgqvjgqbjg7Pjg4jjga7plovlp4sgY2hhcmFjdGVyaXN0aWNzLndyaXRlVmFsdWXlkbzjgbPlh7rjgZflvozjgavlrp/ooYxcbiAgICBzdGFydFJlamVjdFRpbWVPdXRDb3VudCgpe1xuICAgICAgICB0aGlzLnRpbWVvdXRJZD1zZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVHcm91cCgpO1xuICAgICAgICAgICAgdGhpcy5wcm9taXNSZWplY3RPYmooe21zZzpcInRpbWVvdXQ6XCIsdGFnTmFtZTp0aGlzLnRhZ05hbWUsdGFnSW5mbzp0aGlzLnRhZ0luZm99KTtcbiAgICAgICAgfSwgdGhpcy5yZWplY3RUaW1lT3V0KTtcbiAgICB9XG4gICAgY2FsbFJlc29sdmUoYXJnKXtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElkKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlR3JvdXAoKTtcbiAgICAgICAgdGhpcy5wcm9taXNSZXNvbHZlT2JqKGFyZyk7XG4gICAgfVxuICAgIGNhbGxSZWplY3QobXNnKXtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElkKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlR3JvdXAoKTtcbiAgICAgICAgdGhpcy5wcm9taXNSZWplY3RPYmooe21zZzptc2d9KTtcbiAgICB9XG5cbiAgICBfcmVtb3ZlR3JvdXAoKXtcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5ncm91cEFycmF5Lmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGlmKCB0aGlzLmdyb3VwQXJyYXk9PT10aGlzKXtcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwQXJyYXkuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPUtNTW90b3JDb21tYW5kS01PbmU7XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9LTU1vdG9yQ29tbWFuZEtNT25lLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==