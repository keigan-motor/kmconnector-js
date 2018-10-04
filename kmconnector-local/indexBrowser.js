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
                        }).then(()=>{
                            //ble_firmware_revisionのサービス取得 info::Androiddでは不安定な為停止
                            return new Promise((sresolve, sreject)=> {
                                server.getPrimaryService(this._DEVICE_INFORMATION_SERVICE_UUIDS.Service).then((service) => {
                                    Promise.resolve().then(()=>{
                                        return new Promise((resolve, reject)=>{
                                            service.getCharacteristic(this._DEVICE_INFORMATION_SERVICE_UUIDS.ManufacturerNameString)
                                                .then(chara => {
                                                    return chara.readValue();
                                                }).then(val => {
                                                infomation['manufacturerName'] = KMUtl.Utf8ArrayToStr(new Uint8Array(val.buffer));
                                                resolve();
                                            }).catch((e)=>{reject(e);})
                                        });
                                    }).then(()=>{
                                        return new Promise((resolve, reject)=>{
                                            service.getCharacteristic(this._DEVICE_INFORMATION_SERVICE_UUIDS.FirmwareRevisionString)
                                                .then(chara => {
                                                    return chara.readValue();
                                                }).then(val => {
                                                infomation['firmwareRevision'] = KMUtl.Utf8ArrayToStr(new Uint8Array(val.buffer));
                                                resolve();
                                            }).catch((e)=>{reject(e);})
                                        });
                                    }).then(()=>{
                                        return new Promise((resolve, reject)=>{
                                            service.getCharacteristic(this._DEVICE_INFORMATION_SERVICE_UUIDS.HardwareRevisionString)
                                                .then(chara => {
                                                    return chara.readValue();
                                                }).then(val => {
                                                infomation['hardwareRevision'] = KMUtl.Utf8ArrayToStr(new Uint8Array(val.buffer));
                                                resolve();
                                            }).catch((e)=>{reject(e);})
                                        });
                                    }).then(()=>{
                                        sresolve();
                                    }).catch((e)=>{
                                        sreject(e);
                                    })
                                }).catch((e)=>{
                                    sreject(e);
                                })
                            });
                        }).then(() => {
                            gresolve({characteristics: characteristics, infomation: infomation});
                        }).catch((e)=>{
                            console.log(e);
                        })
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
     * @extends KMMotorCommandKMOne
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
            /** ティーチングを開始する */ startTeachingMotionFromPrep:0xAB,
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
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.startTeachingMotionFromPrep);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNTkyZjg5MTA5YTQ2ZWM5Njk4MjciLCJ3ZWJwYWNrOi8vLy4vc3JjL0tNU3RydWN0dXJlcy5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvS01VdGwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0tNQ29tV2ViQkxFLmpzIiwid2VicGFjazovLy8uL3NyYy9LTUNvbm5lY3RvckJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvS01Nb3Rvck9uZVdlYkJMRS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvS01Db21CYXNlLmpzIiwid2VicGFjazovLy8uL3NyYy9LTU1vdG9yQ29tbWFuZEtNT25lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGlCQUFpQixRQUFRO0FBQ3pCO0FB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LG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSwyRUFBMkU7QUFDM0U7O0FBRUE7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLFVBQVUsNkZBQTZGO0FBQ3JIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQ2xNQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixPQUFPO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLDREQUE0RDtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxQ0FBcUM7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQSw2RUFBNkU7QUFDN0U7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSw0Q0FBNEM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RC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S0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxHQUFHO0FBQ0gsb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiaW5kZXhCcm93c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNTkyZjg5MTA5YTQ2ZWM5Njk4MjciLCIvKioqXG4gKiBLTVN0cnVjdHVyZXMuanNcbiAqIHZhciAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xubGV0IEtNVXRsID0gcmVxdWlyZSgnLi9LTVV0bCcpO1xuXG5cbi8qKlxuICogQGNsYXNzZGVzYyDmp4vpgKDkvZPjga7ln7rlupXjgq/jg6njgrlcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01TdHJ1Y3R1cmVCYXNle1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOWQjOOBmOWApOOCkuaMgeOBpOOBi+OBruavlOi8g1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXIg5q+U6LyD44GZ44KL5qeL6YCg5L2TXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IOe1kOaenFxuICAgICAqL1xuICAgIEVRICh0YXIpIHtcbiAgICAgICAgaWYoISB0YXIgKXtyZXR1cm4gZmFsc2U7fVxuICAgICAgICBpZih0aGlzLmNvbnN0cnVjdG9yPT09dGFyLmNvbnN0cnVjdG9yKXtcbiAgICAgICAgICAgIGlmKHRoaXMuR2V0VmFsQXJyYXkpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLkdldFZhbEFycmF5KCkudG9TdHJpbmcoKT09PXRhci5HZXRWYWxBcnJheSgpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9ZWxzZSBpZih0aGlzLkdldFZhbE9iail7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuR2V0VmFsT2JqKCkpPT09SlNPTi5zdHJpbmdpZnkodGFyLkdldFZhbE9iaigpKTsvLyBiYWQ6OumBheOBhFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDopIfoo71cbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSDopIfoo73jgZXjgozjgZ/mp4vpgKDkvZNcbiAgICAgKi9cbiAgICBDbG9uZSAoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyB0aGlzLmNvbnN0cnVjdG9yKCksdGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOWApOOBruWPluW+l++8iE9iau+8iVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAgICovXG4gICAgR2V0VmFsT2JqICgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5YCk44Gu5Y+W5b6X77yI6YWN5YiX77yJXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIEdldFZhbEFycmF5ICgpIHtcbiAgICAgICAgbGV0IGs9T2JqZWN0LmtleXModGhpcyk7XG4gICAgICAgIGxldCByPVtdO1xuICAgICAgICBmb3IobGV0IGk9MDtpPGsubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICByLnB1c2godGhpc1trW2ldXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxufVxuXG5cbi8qKlxuICogQGNsYXNzZGVzYyBYWeW6p+aomeOBruani+mAoOS9k+OCquODluOCuOOCp+OCr+ODiFxuICogQGlnbm9yZVxuICovXG5jbGFzcyBLTVZlY3RvcjIgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICh4PTAsIHk9MCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOebuOWvvuS9jee9ruOBuOenu+WLlVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkeFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkeVxuICAgICAqL1xuICAgIE1vdmUgKGR4ID0wLCBkeSA9IDApIHtcbiAgICAgICAgdGhpcy54ICs9IGR4O1xuICAgICAgICB0aGlzLnkgKz0gZHk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIDLngrnplpPjga7ot53pm6JcbiAgICAgKiBAcGFyYW0ge0tNVmVjdG9yMn0gdmVjdG9yMlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgRGlzdGFuY2UgKHZlY3RvcjIpIHtcbiAgICAgICAgaWYgKCEodmVjdG9yMiBpbnN0YW5jZW9mIEtNVmVjdG9yMikpIHtyZXR1cm47fVxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KCh0aGlzLngtdmVjdG9yMi54KSwyKSArIE1hdGgucG93KCh0aGlzLnktdmVjdG9yMi55KSwyKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIDLngrnplpPjga7op5LluqZcbiAgICAgKiBAcGFyYW0ge0tNVmVjdG9yMn0gdmVjdG9yMlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgUmFkaWFuICh2ZWN0b3IyKSB7XG4gICAgICAgIGlmICghKHZlY3RvcjIgaW5zdGFuY2VvZiBLTVZlY3RvcjIpKSB7cmV0dXJuO31cbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy55LXZlY3RvcjIueSx0aGlzLngtdmVjdG9yMi54KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMCww44GL44KJ44Gu6Led6ZuiXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBEaXN0YW5jZUZyb21aZXJvKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMueCwyKSArIE1hdGgucG93KHRoaXMueSwyKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIDAsMOOBi+OCieOBruinkuW6plxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHJhZGlhblxuICAgICAqL1xuICAgIFJhZGlhbkZyb21aZXJvKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnksdGhpcy54KTtcbiAgICB9XG59XG5cbi8vIC8qKlxuLy8gICogQGNsYXNzZGVzYyBYWVogM+asoeWFg+ODmeOCr+ODiOODq1xuLy8gICovXG4vLyBjbGFzcyBLTVZlY3RvcjMgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuLy8gICAgIC8qKlxuLy8gICAgICAqXG4vLyAgICAgICogQHBhcmFtIHhcbi8vICAgICAgKiBAcGFyYW0geVxuLy8gICAgICAqIEBwYXJhbSB6XG4vLyAgICAgICovXG4vLyAgICAgY29uc3RydWN0b3IoeCx5LHopIHtcbi8vICAgICAgICAgc3VwZXIoKTtcbi8vICAgICAgICAgdGhpcy54ID0geD94OjA7XG4vLyAgICAgICAgIHRoaXMueSA9IHk/eTowO1xuLy8gICAgICAgICB0aGlzLnogPSB6P3o6MDtcbi8vICAgICB9XG4vLyAgICAgLyoqXG4vLyAgICAgICog55u45a++5L2N572u44G456e75YuVXG4vLyAgICAgICogQHBhcmFtIHtudW1iZXJ9IGR4XG4vLyAgICAgICogQHBhcmFtIHtudW1iZXJ9IGR5XG4vLyAgICAgICogQHBhcmFtIHtudW1iZXJ9IGR6XG4vLyAgICAgICogQGNvbnN0cnVjdG9yXG4vLyAgICAgICovXG4vLyAgICAgTW92ZSAoZHgsIGR5LCBkeikge1xuLy8gICAgICAgICB0aGlzLnggKz0gZHg7XG4vLyAgICAgICAgIHRoaXMueSArPSBkeTtcbi8vICAgICAgICAgdGhpcy56ICs9IGR6O1xuLy8gICAgIH1cbi8vICAgICAvKipcbi8vICAgICAgKiAy54K56ZaT44Gu6Led6ZuiXG4vLyAgICAgICogQHBhcmFtIHtLTVZlY3RvcjN9IHZlY3RvcjNcbi8vICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuLy8gICAgICAqIEBjb25zdHJ1Y3RvclxuLy8gICAgICAqL1xuLy8gICAgIERpc3RhbmNlICh2ZWN0b3IzKSB7XG4vLyAgICAgICAgIGlmICghKHZlY3RvcjMgaW5zdGFuY2VvZiBLTVZlY3RvcjMpKSB7cmV0dXJuO31cbi8vICAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdygodGhpcy54LXZlY3RvcjMueCksMikgKyBNYXRoLnBvdygodGhpcy55LXZlY3RvcjMueSksMikrIE1hdGgucG93KCh0aGlzLnotdmVjdG9yMy56KSwyKSk7XG4vLyAgICAgfVxuLy8gICAgIC8vIC8qKlxuLy8gICAgIC8vICAqIDLngrnplpPjga7op5LluqYo5Zue6Lui5pa55ZCR44Gu5oOF5aCx44Gq44GXKVxuLy8gICAgIC8vICAqICBAcGFyYW0ge0tNVmVjdG9yM30gdmVjdG9yM1xuLy8gICAgIC8vICAqIEByZXR1cm5zIHtudW1iZXJ9XG4vLyAgICAgLy8gICogQGNvbnN0cnVjdG9yXG4vLyAgICAgLy8gICovXG4vLyAgICAgLy8gUmFkaWFuICh2ZWN0b3IzKSB7XG4vLyAgICAgLy8gICAgIGlmICghKHZlY3RvcjMgaW5zdGFuY2VvZiBLTVZlY3RvcjMpKSB7cmV0dXJuO31cbi8vICAgICAvLyAgICAgLy90b2RvOjoy54K56ZaT44Gu6KeS5bqmKOWbnui7ouaWueWQkeOBruaDheWgseOBquOBlylcbi8vICAgICAvLyB9XG4vLyAgICAgLyoqXG4vLyAgICAgICogMCwwLDDjgYvjgonjga7ot53pm6Jcbi8vICAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuLy8gICAgICAqIEBjb25zdHJ1Y3RvclxuLy8gICAgICAqL1xuLy8gICAgIERpc3RhbmNlRnJvbVplcm8gKCkge1xuLy8gICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMueCwyKSArIE1hdGgucG93KHRoaXMueSwyKSsgTWF0aC5wb3codGhpcy56LDIpKTtcbi8vICAgICB9XG4vL1xuLy8gICAgIC8vIC8qKlxuLy8gICAgIC8vICAqIDAsMCww44GL44KJ44Gu6KeS5bqmXG4vLyAgICAgLy8gICogQHJldHVybnMge251bWJlcn0gcmFkaWFuXG4vLyAgICAgLy8gICogQGNvbnN0cnVjdG9yXG4vLyAgICAgLy8gICovXG4vLyAgICAgLy8gUmFkaWFuRnJvbVplcm8gKCkge1xuLy8gICAgIC8vICAgICAvL3RvZG86OjAsMCww44GL44KJ44Gu6KeS5bqmXG4vLyAgICAgLy8gfVxuLy8gfVxuXG5cbi8qKlxuICogQGNsYXNzZGVzYyDjgrjjg6PjgqTjg63jgrvjg7PjgrXjg7zlgKRcbiAqL1xuY2xhc3MgS01JbXVTdGF0ZSBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWNjZWxYIOWKoOmAn+W6pih4KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWNjZWxZIOWKoOmAn+W6pih5KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWNjZWxaIOWKoOmAn+W6pih6KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGVtcCDmuKnluqYgQ1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBneXJvWCDop5LpgJ/luqYoeCkgW8KxIDFdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGd5cm9ZIOinkumAn+W6pih5KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZ3lyb1og6KeS6YCf5bqmKHopIFvCsSAxXVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChhY2NlbFgsIGFjY2VsWSwgYWNjZWxaLCB0ZW1wLCBneXJvWCwgZ3lyb1ksIGd5cm9aICkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuYWNjZWxYPSBLTVV0bC50b051bWJlcihhY2NlbFgpO1xuICAgICAgICB0aGlzLmFjY2VsWT0gS01VdGwudG9OdW1iZXIoYWNjZWxZKTtcbiAgICAgICAgdGhpcy5hY2NlbFo9IEtNVXRsLnRvTnVtYmVyKGFjY2VsWik7XG4gICAgICAgIHRoaXMudGVtcD0gS01VdGwudG9OdW1iZXIodGVtcCk7XG4gICAgICAgIHRoaXMuZ3lyb1g9IEtNVXRsLnRvTnVtYmVyKGd5cm9YKTtcbiAgICAgICAgdGhpcy5neXJvWT0gS01VdGwudG9OdW1iZXIoZ3lyb1kpO1xuICAgICAgICB0aGlzLmd5cm9aPSBLTVV0bC50b051bWJlcihneXJvWik7XG4gICAgfVxufVxuLyoqXG4gKiBLRUlHQU7jg6Ljg7zjgr/jg7xMRUTjgIDngrnnga/jg7voibLnirbmhYtcbiAqIFN0YXRlIE1PVE9SX0xFRF9TVEFURVxuICogY29sb3JSIDAtMjU1XG4gKiBjb2xvckcgMC0yNTVcbiAqIGNvbG9yQiAwLTI1NVxuICogKi9cbi8qKlxuICogQGNsYXNzZGVzYyDjg6Ljg7zjgr/jg7xMRUTjgIDngrnnga/jg7voibLnirbmhYtcbiAqL1xuY2xhc3MgS01MZWRTdGF0ZSBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844GuTEVE54q25oWLXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTEVEX1NUQVRFX09GRiAtIDA6TEVE5raI54GvXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX0xFRF9TVEFURV9PTl9TT0xJRCAtIDE6TEVE54K554GvXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX0xFRF9TVEFURV9PTl9GTEFTSCAtIDI6TEVE54K55ruF77yI5LiA5a6a6ZaT6ZqU44Gn54K55ruF77yJXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX0xFRF9TVEFURV9PTl9ESU0gLSAzOkxFROOBjOOChuOBo+OBj+OCiui8neW6puWkieWMluOBmeOCi1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgTU9UT1JfTEVEX1NUQVRFKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09GRlwiOjAsXG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PTl9TT0xJRFwiOjEsXG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PTl9GTEFTSFwiOjIsXG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PTl9ESU1cIjozXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSB7S01MZWRTdGF0ZS5NT1RPUl9MRURfU1RBVEV9IHN0YXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbG9yUiBpbnQgWzAtMjU1XVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb2xvckcgaW50IFswLTI1NV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY29sb3JCIGludCBbMC0yNTVdXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc3RhdGUsY29sb3JSLGNvbG9yRyxjb2xvckIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zdGF0ZT1LTVV0bC50b051bWJlcihzdGF0ZSk7XG4gICAgICAgIHRoaXMuY29sb3JSPUtNVXRsLnRvTnVtYmVyKGNvbG9yUik7XG4gICAgICAgIHRoaXMuY29sb3JHPUtNVXRsLnRvTnVtYmVyKGNvbG9yRyk7XG4gICAgICAgIHRoaXMuY29sb3JCPUtNVXRsLnRvTnVtYmVyKGNvbG9yQik7XG4gICAgfVxufVxuXG4vKipcbiAqIEBjbGFzc2Rlc2Mg44Oi44O844K/44O85Zue6Lui5oOF5aCxXG4gKi9cbmNsYXNzIEtNUm90U3RhdGUgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuICAgIC8qKlxuICAgICAqIOacgOWkp+ODiOODq+OCr+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBNQVhfVE9SUVVFKCl7XG4gICAgICAgIHJldHVybiAwLjM7Ly8wLjMgTuODu21cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmnIDlpKfpgJ/luqblrprmlbAocnBtKVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBNQVhfU1BFRURfUlBNKCl7XG4gICAgICAgIHJldHVybiAzMDA7Ly8zMDBycG1cbiAgICB9XG4gICAgLyoqXG4gICAgICog5pyA5aSn6YCf5bqm5a6a5pWwKHJhZGlhbi9zZWMpXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE1BWF9TUEVFRF9SQURJQU4oKXtcbiAgICAgICAgcmV0dXJuIEtNVXRsLnJwbVRvUmFkaWFuU2VjKDMwMCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOacgOWkp+W6p+aomeWumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBNQVhfUE9TSVRJT04oKXtcbiAgICAgICAgcmV0dXJuIDMqTWF0aC5wb3coMTAsMzgpOy8vaW5mbzo644CMcmV0dXJu44CAM2UrMzjjgI3jga9taW5pZnnjgafjgqjjg6njg7xcbiAgICAgICAgLy9yZXR1cm7jgIAzZSszODsvL3JhZGlhbiA0Ynl0ZSBmbG9hdOOAgDEuMTc1NDk0IDEwLTM4ICA8IDMuNDAyODIzIDEwKzM4XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb24g5bqn5qiZXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZlbG9jaXR5IOmAn+W6plxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3JxdWUg44OI44Or44KvXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocG9zaXRpb24sIHZlbG9jaXR5LCB0b3JxdWUpIHtcbiAgICAgICAgLy/mnInlirnmoYHmlbAg5bCP5pWw56ysM+S9jVxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gTWF0aC5mbG9vcihLTVV0bC50b051bWJlcihwb3NpdGlvbikqMTAwKS8xMDA7XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBNYXRoLmZsb29yKEtNVXRsLnRvTnVtYmVyKHZlbG9jaXR5KSoxMDApLzEwMDtcbiAgICAgICAgdGhpcy50b3JxdWUgPSBNYXRoLmZsb29yKEtNVXRsLnRvTnVtYmVyKHRvcnF1ZSkqMTAwMDApLzEwMDAwO1xuICAgIH1cbn1cblxuXG4vKipcbiAqIEBjbGFzc2Rlc2Mg44OH44OQ44Kk44K55oOF5aCxXG4gKi9cbmNsYXNzIEtNRGV2aWNlSW5mbyBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuS01fQ09OTkVDVF9UWVBFfSB0eXBlIOaOpee2muaWueW8j1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCDjg4fjg5DjgqTjgrlVVUlEXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUg44Oi44O844K/44O85ZCNXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpc0Nvbm5lY3Qg5o6l57aa54q25oWLXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1hbnVmYWN0dXJlck5hbWUg6KO96YCg5Lya56S+5ZCNXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGhhcmR3YXJlUmV2aXNpb25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlybXdhcmVSZXZpc2lvblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHR5cGU9MCxpZD1cIlwiLG5hbWU9XCJcIixpc0Nvbm5lY3Q9ZmFsc2UsbWFudWZhY3R1cmVyTmFtZT1udWxsLGhhcmR3YXJlUmV2aXNpb249bnVsbCxmaXJtd2FyZVJldmlzaW9uPW51bGwpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlPXR5cGU7XG4gICAgICAgIHRoaXMuaWQ9aWQ7XG4gICAgICAgIHRoaXMubmFtZT1uYW1lO1xuICAgICAgICB0aGlzLmlzQ29ubmVjdD1pc0Nvbm5lY3Q7XG4gICAgICAgIHRoaXMubWFudWZhY3R1cmVyTmFtZT1tYW51ZmFjdHVyZXJOYW1lO1xuICAgICAgICB0aGlzLmhhcmR3YXJlUmV2aXNpb249aGFyZHdhcmVSZXZpc2lvbjtcbiAgICAgICAgdGhpcy5maXJtd2FyZVJldmlzaW9uPWZpcm13YXJlUmV2aXNpb247XG5cbiAgICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgS01TdHJ1Y3R1cmVCYXNlOktNU3RydWN0dXJlQmFzZSxcbiAgICBLTVZlY3RvcjI6S01WZWN0b3IyLFxuICAgIC8vS01WZWN0b3IzOktNVmVjdG9yMyxcbiAgICBLTUltdVN0YXRlOktNSW11U3RhdGUsXG4gICAgS01MZWRTdGF0ZTpLTUxlZFN0YXRlLFxuICAgIEtNUm90U3RhdGU6S01Sb3RTdGF0ZSxcbiAgICBLTURldmljZUluZm86S01EZXZpY2VJbmZvXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvS01TdHJ1Y3R1cmVzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKipcbiAqIEtNVXRsLmpzXG4gKiB2ZXJzaW9uIDAuMS4wIGFscGhhXG4gKiBDQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBjbGFzc2Rlc2Mg44Om44O844OG44Kj44Oq44OG44KjXG4gKi9cbmNsYXNzIEtNVXRse1xuXG4gICAgLyoqXG4gICAgICog5pWw5YCk44Gr44Kt44Oj44K544OI44GZ44KL6Zai5pWwXG4gICAgICog5pWw5YCk5Lul5aSW44GvMOOCkui/lOOBmTxicj5cbiAgICAgKiBJbmZpbml0eeOCgjDjgajjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlZmF1bHR2YWwgdmFs44GM5pWw5YCk44Gr5aSJ5o+b5Ye65p2l44Gq44GE5aC05ZCI44Gu44OH44OV44Kp44Or44OIXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgdG9OdW1iZXIodmFsLCBkZWZhdWx0dmFsID0gMCkge1xuICAgICAgICBsZXQgdiA9IHBhcnNlRmxvYXQodmFsLCAxMCk7XG4gICAgICAgIHJldHVybiAoaXNOYU4odikgfHwgdmFsID09PSBJbmZpbml0eSA/IGRlZmF1bHR2YWwgOiB2KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICog6KeS5bqm44Gu5Y2Y5L2N5aSJ5o+b44CAZGVncmVlID4+IHJhZGlhblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWdyZWUg5bqmXG4gICAgICogQHJldHVybnMge251bWJlcn0gcmFkaWFuXG4gICAgICovXG4gICAgc3RhdGljIGRlZ3JlZVRvUmFkaWFuKGRlZ3JlZSkge1xuICAgICAgICByZXR1cm4gZGVncmVlICogMC4wMTc0NTMyOTI1MTk5NDMyOTU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIOinkuW6puOBruWNmOS9jeWkieaPm+OAgHJhZGlhbiA+PiBkZWdyZWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkaWFuIHJhZGlhbuinklxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IOW6plxuICAgICAqL1xuICAgIHN0YXRpYyByYWRpYW5Ub0RlZ3JlZShyYWRpYW4pIHtcbiAgICAgICAgcmV0dXJuIHJhZGlhbiAvIDAuMDE3NDUzMjkyNTE5OTQzMjk1O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDpgJ/luqYgcnBtIC0+cmFkaWFuL3NlYyDjgavlpInmj5tcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcnBtXG4gICAgICogQHJldHVybnMge251bWJlcn0gcmFkaWFuL3NlY1xuICAgICAqL1xuICAgIHN0YXRpYyBycG1Ub1JhZGlhblNlYyhycG0pIHtcbiAgICAgICAgLy/pgJ/luqYgcnBtIC0+cmFkaWFuL3NlYyhNYXRoLlBJKjIvNjApXG4gICAgICAgIHJldHVybiBycG0gKiAwLjEwNDcxOTc1NTExOTY1OTc3O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogMueCuemWk+OBrui3nembouOBqOinkuW6puOCkuaxguOCgeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tX3hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbV95XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvX3hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9feVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIHR3b1BvaW50RGlzdGFuY2VBbmdsZShmcm9tX3gsIGZyb21feSwgdG9feCwgdG9feSkge1xuICAgICAgICBsZXQgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coZnJvbV94IC0gdG9feCwgMikgKyBNYXRoLnBvdyhmcm9tX3kgLSB0b195LCAyKSk7XG4gICAgICAgIGxldCByYWRpYW4gPSBNYXRoLmF0YW4yKGZyb21feSAtIHRvX3ksIGZyb21feCAtIHRvX3gpO1xuICAgICAgICByZXR1cm4ge2Rpc3Q6IGRpc3RhbmNlLCByYWRpOiByYWRpYW4sIGRlZzogS01VdGwucmFkaWFuVG9EZWdyZWUocmFkaWFuKX07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEAjIGluZm86OiBCTEXjga5ERVZJQ0UgSU5GT1JNQVRJT04gU0VSVklDReOBruODkeODvOOCueOBq0tNQ29tQkxFLmpz44Gn5Li744Gr5L2/55SoXG4gICAgICogdXRmLmpzIC0gVVRGLTggPD0+IFVURi0xNiBjb252ZXJ0aW9uXG4gICAgICpcbiAgICAgKiBAaWdub3JlXG4gICAgICogQHBhcmFtIGFycmF5XG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBkZXNjXG4gICAgICogQ29weXJpZ2h0IChDKSAxOTk5IE1hc2FuYW8gSXp1bW8gPGl6QG9uaWNvcy5jby5qcD5cbiAgICAgKiBWZXJzaW9uOiAxLjBcbiAgICAgKiBMYXN0TW9kaWZpZWQ6IERlYyAyNSAxOTk5XG4gICAgICogVGhpcyBsaWJyYXJ5IGlzIGZyZWUuICBZb3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0LlxuICAgICAqL1xuICAgIHN0YXRpYyBVdGY4QXJyYXlUb1N0cihhcnJheSkge1xuICAgICAgICBsZXQgb3V0LCBpLCBsZW4sIGM7XG4gICAgICAgIGxldCBjaGFyMiwgY2hhcjM7XG5cbiAgICAgICAgb3V0ID0gXCJcIjtcbiAgICAgICAgbGVuID0gYXJyYXkubGVuZ3RoO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgd2hpbGUoaSA8IGxlbikge1xuICAgICAgICAgICAgYyA9IGFycmF5W2krK107XG4gICAgICAgICAgICBzd2l0Y2goYyA+PiA0KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiBjYXNlIDI6IGNhc2UgMzogY2FzZSA0OiBjYXNlIDU6IGNhc2UgNjogY2FzZSA3OlxuICAgICAgICAgICAgICAgIC8vIDB4eHh4eHh4XG4gICAgICAgICAgICAgICAgb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAxMjogY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAvLyAxMTB4IHh4eHggICAxMHh4IHh4eHhcbiAgICAgICAgICAgICAgICBjaGFyMiA9IGFycmF5W2krK107XG4gICAgICAgICAgICAgICAgb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjICYgMHgxRikgPDwgNikgfCAoY2hhcjIgJiAweDNGKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAxNDpcbiAgICAgICAgICAgICAgICAgICAgLy8gMTExMCB4eHh4ICAxMHh4IHh4eHggIDEweHggeHh4eFxuICAgICAgICAgICAgICAgICAgICBjaGFyMiA9IGFycmF5W2krK107XG4gICAgICAgICAgICAgICAgICAgIGNoYXIzID0gYXJyYXlbaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjICYgMHgwRikgPDwgMTIpIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICgoY2hhcjIgJiAweDNGKSA8PCA2KSB8XG4gICAgICAgICAgICAgICAgICAgICAgICAoKGNoYXIzICYgMHgzRikgPDwgMCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gS01VdGw7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvS01VdGwuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqKlxuICogS01Db21XZWJCTEUuanNcbiAqIHZlcnNpb24gMC4xLjAgYWxwaGFcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmxldCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcbmxldCBLTUNvbUJhc2UgPSByZXF1aXJlKCcuL0tNQ29tQmFzZScpO1xuLyoqXG4gKiBAY2xhc3NkZXNjIOODluODqeOCpuOCtueUqFdlYkJsdWV0b29o6YCa5L+h44Kv44Op44K5KGNocm9tZeS+neWtmClcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01Db21XZWJCTEUgZXh0ZW5kcyBLTUNvbUJhc2V7XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5a6a5pWwXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLnR5cGU9XCJXRUJCTEVcIjtcbiAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzPXt9O1xuICAgICAgICB0aGlzLl9ibGVTZW5kaW5nUXVlPVByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgdGhpcy5fcXVlQ291bnQ9MDtcbiAgICAgICAgXG4gICAgICAgIC8v44K144O844OT44K5VVVJRFxuICAgICAgICB0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEPSdmMTQwZWEzNS04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnO1xuXG4gICAgICAgIC8v44Kt44Oj44Op44Kv44K/44Oq44K544OG44Kj44Kv44K5VVVJRFxuICAgICAgICB0aGlzLl9NT1RPUl9CTEVfQ1JTPXtcbiAgICAgICAgICAgICdNT1RPUl9DT05UUk9MJzonZjE0MDAwMDEtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJywvL+ODouODvOOCv+ODvOOBuOOBruioreWumuOAgeWItuW+oeWRveS7pOOCkuWPluOCiuaJseOBhlxuICAgICAgICAgICAgLy8nTU9UT1JfTEVEJzonZjE0MDAwMDMtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJywvL+ODouODvOOCv+ODvOOBrkxFROOCkuWPluOCiuaJseOBhiBpbmZvOjogTU9UT1JfQ09OVFJPTDo6YmxlTGVk44Gn5Luj55SoXG4gICAgICAgICAgICAnTU9UT1JfTUVBU1VSRU1FTlQnOidmMTQwMDAwNC04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLC8v44Oi44O844K/44O844Gu5L2N572u44O76YCf5bqm44O744OI44Or44Kv562J5ris5a6a5YCk44KS5Y+W44KK5omx44GGXG4gICAgICAgICAgICAnTU9UT1JfSU1VX01FQVNVUkVNRU5UJzonZjE0MDAwMDUtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJywvL+ODouODvOOCv+ODvOOBruWKoOmAn+W6puODu+OCuOODo+OCpOODreOCu+ODs+OCteODvO+8iElNVe+8ieOCkuWPluOCiuaJseOBhlxuICAgICAgICAgICAgJ01PVE9SX1NFVFRJTkcnOidmMTQwMDAwNi04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLy/jg6Ljg7zjgr/jg7zjga7oqK3lrprlgKTjgpLlj5bjgormibHjgYZcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFM9e1xuICAgICAgICAgICAgXCJTZXJ2aWNlXCI6MHgxODBhXG4gICAgICAgICAgICAsXCJNYW51ZmFjdHVyZXJOYW1lU3RyaW5nXCI6MHgyYTI5XG4gICAgICAgICAgICAsXCJIYXJkd2FyZVJldmlzaW9uU3RyaW5nXCI6MHgyYTI3XG4gICAgICAgICAgICAsXCJGaXJtd2FyZVJldmlzaW9uU3RyaW5nXCI6MHgyYTI2XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJMReWIh+aWreaZglxuICAgICAgICAgKiBAcGFyYW0gZXZlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgIHRoaXMuX29uQmxlQ29ubmVjdGlvbkxvc3Q9KGV2ZSk9PntcbiAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q9ZmFsc2U7XG4gICAgICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW51bGw7XG4gICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaXNDb25uZWN0KGZhbHNlKTtcbiAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44Oi44O844K/44O85Zue6Lui5oOF5aCx5Y+X5L+hXG4gICAgICAgICAqIEBwYXJhbSBldmVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTm90aWZ5IOOBl+OBn+OBqOOBjeOBrui/lOOCiuWApFxuICAgICAgICAgKiBieXRlWzBdLWJ5dGVbM11cdCAgICBieXRlWzRdLWJ5dGVbN11cdCAgICAgICAgYnl0ZVs4XS1ieXRlWzExXVxuICAgICAgICAgKiBmbG9hdCAqIFx0XHQgICAgICAgIGZsb2F0ICogICAgICAgICAgICAgICAgIGZsb2F0ICpcbiAgICAgICAgICogcG9zaXRpb246cmFkaWFuc1x0ICAgIHNwZWVkOnJhZGlhbnMvc2Vjb25kXHR0b3JxdWU6TuODu21cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29uQmxlTW90b3JNZWFzdXJlbWVudD0oZXZlKT0+e1xuICAgICAgICAgICAgaWYoIWV2ZXx8IWV2ZS50YXJnZXQpe3JldHVybjt9XG4gICAgICAgICAgICBsZXQgZHYgPSBldmUudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgaWYoIShkdiBpbnN0YW5jZW9mIERhdGFWaWV3KSl7cmV0dXJuO30vL2luZm86OndlYiBibHVldG9vaOOBruOBvyBub2RlLmpz44GvaW5zdGFuY2VvZiBCdWZmZXJcbiAgICAgICAgICAgIGxldCByZXM9e3Bvc2l0aW9uOmR2LmdldEZsb2F0MzIoMCxmYWxzZSksdmVsb2NpdHk6ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKSx0b3JxdWU6ZHYuZ2V0RmxvYXQzMig4LGZhbHNlKX07XG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yTWVhc3VyZW1lbnRDQihyZXMpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44Oi44O844K/44O8SU1V5oOF5aCx5Y+X5L+hXG4gICAgICAgICAqIEBwYXJhbSBldmVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICpcbiAgICAgICAgICogQCNOb3RpZnkg44GX44Gf44Go44GN44Gu6L+U44KK5YCkKS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKlxuICAgICAgICAgKiBhY2NlbF94LCBhY2NlbF95LCBhY2NlbF96LCB0ZW1wLCBneXJvX3gsIGd5cm9feSwgZ3lyb196IOOBjOWFqOOBpui/lOOBo+OBpuOBj+OCi+OAguWPluW+l+mWk+malOOBrzEwMG1zIOWbuuWumlxuICAgICAgICAgKiBieXRlKEJpZ0VuZGlhbikgIFswXVsxXSBbMl1bM10gIFs0XVs1XSAgIFs2XVs3XVx0ICAgIFs4XVs5XVx0WzEwXVsxMV0gICAgWzEyXVsxM11cbiAgICAgICAgICogICAgICAgICAgICAgICAgICBpbnQxNl90IGludDE2X3QgaW50MTZfdCBpbnQxNl90ICAgICBpbnQxNl90IGludDE2X3QgaW50MTZfdFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgIGFjY2VsLXggYWNjZWwteSBhY2NlbC16IHRlbXBcdCAgICBneXJvLXhcdGd5cm8teVx0Z3lyby16XG4gICAgICAgICAqXG4gICAgICAgICAqIGludDE2X3Q6LTMyLDc2OOOAnDMyLDc2OFxuICAgICAgICAgKiDmnLrjga7kuIrjgavjg6Ljg7zjgr/jg7zjgpLnva7jgYTjgZ/loLTlkIjjgIHliqDpgJ/luqbjgIB6ID0gMTYwMDAg56iL5bqm44Go44Gq44KL44CC77yI6YeN5Yqb5pa55ZCR44Gu44Gf44KB77yJXG4gICAgICAgICAqXG4gICAgICAgICAqIOWNmOS9jeWkieaPm++8iS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjgIDliqDpgJ/luqYgdmFsdWUgW0ddID0gcmF3X3ZhbHVlICogMiAvIDMyLDc2N1xuICAgICAgICAgKiDjgIDmuKnluqYgdmFsdWUgW+KEg10gPSByYXdfdmFsdWUgLyAzMzMuODcgKyAyMS4wMFxuICAgICAgICAgKiDjgIDop5LpgJ/luqZcbiAgICAgICAgICog44CA44CAdmFsdWUgW2RlZ3JlZS9zZWNvbmRdID0gcmF3X3ZhbHVlICogMjUwIC8gMzIsNzY3XG4gICAgICAgICAqIOOAgOOAgHZhbHVlIFtyYWRpYW5zL3NlY29uZF0gPSByYXdfdmFsdWUgKiAwLjAwMDEzMzE2MjExXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vbkJsZUltdU1lYXN1cmVtZW50PShldmUpPT57XG4gICAgICAgICAgICBpZighZXZlfHwhZXZlLnRhcmdldCl7cmV0dXJuO31cbiAgICAgICAgICAgIGxldCBkdiA9IGV2ZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICBsZXQgdGVtcENhbGlicmF0aW9uPS01Ljc7Ly/muKnluqbmoKHmraPlgKRcbiAgICAgICAgICAgIGlmKCEoZHYgaW5zdGFuY2VvZiBEYXRhVmlldykpe3JldHVybjt9Ly9pbmZvOjp3ZWIgYmx1ZXRvb2jjga7jgb8gbm9kZS5qc+OBr2luc3RhbmNlb2YgQnVmZmVyXG4gICAgICAgICAgICAvL+WNmOS9jeOCkuaJseOBhOaYk+OBhOOCiOOBhuOBq+WkieaPm1xuICAgICAgICAgICAgbGV0IHJlcz17XG4gICAgICAgICAgICAgICAgYWNjZWxYOmR2LmdldEludDE2KDAsZmFsc2UpKjIvMzI3NjcsYWNjZWxZOmR2LmdldEludDE2KDIsZmFsc2UpKjIvMzI3NjcsYWNjZWxaOmR2LmdldEludDE2KDQsZmFsc2UpKjIvMzI3NjcsXG4gICAgICAgICAgICAgICAgdGVtcDooZHYuZ2V0SW50MTYoNixmYWxzZSkpIC8gMzMzLjg3ICsgMjEuMDArdGVtcENhbGlicmF0aW9uLFxuICAgICAgICAgICAgICAgIGd5cm9YOmR2LmdldEludDE2KDgsZmFsc2UpKjI1MC8zMjc2NyxneXJvWTpkdi5nZXRJbnQxNigxMCxmYWxzZSkqMjUwLzMyNzY3LGd5cm9aOmR2LmdldEludDE2KDEyLGZhbHNlKSoyNTAvMzI3NjdcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcyk7XG4gICAgICAgICAgICB0aGlzLl9vbkltdU1lYXN1cmVtZW50Q0IocmVzKTtcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44Oi44O844K/44O86Kit5a6a5oOF5aCx5Y+W5b6XXG4gICAgICAgICAqIEBwYXJhbSBldmVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTm90aWZ5IOOBl+OBn+OBqOOBjeOBrui/lOOCiuWApFxuICAgICAgICAgKiBieXRlWzBdXHRieXRlWzFdXHRieXRlWzJdXHRieXRlWzNdIGJ5dGVbNF3ku6XpmY1cdGJ5dGVbbi0yXVx0Ynl0ZVtuLTFdXG4gICAgICAgICAqIHVpbnQ4X3Q6bG9nX3R5cGVcdHVpbnQxNl90OmlkXHR1aW50OF90OnJlZ2lzdGVyXHR1aW50OF90OnZhbHVlXHR1aW50MTZfdDpDUkNcbiAgICAgICAgICogMHg0MFx0dWludDE2X3QgKDJieXRlKSAw772eNjU1MzVcdOODrOOCuOOCueOCv+OCs+ODnuODs+ODiVx044Os44K444K544K/44Gu5YCk77yI44Kz44Oe44Oz44OJ44Gr44KI44Gj44Gm5aSJ44KP44KL77yJXHR1aW50MTZfdCAoMmJ5dGUpIDDvvZ42NTUzNVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25CbGVNb3RvclNldHRpbmc9KGV2ZSk9PntcbiAgICAgICAgICAgIGlmKCFldmV8fCFldmUudGFyZ2V0KXtyZXR1cm47fVxuICAgICAgICAgICAgbGV0IGR2ID0gZXZlLnRhcmdldC52YWx1ZTsvLzYrbuODkOOCpOODiOOAgOODh+ODvOOCv+S7leanmOOAgGh0dHBzOi8vZG9jcy5nb29nbGUuY29tL3NwcmVhZHNoZWV0cy9kLzF1eEp1ODZYZThLYklseHU1b1BGdjlLUWR2SFkzMy1OSXkwY2RTZ0lub1VrL2VkaXQjZ2lkPTEwMDA0ODIzODNcbiAgICAgICAgICAgIGlmKCEoZHYgaW5zdGFuY2VvZiBEYXRhVmlldykpe3JldHVybjt9Ly9pbmZvOjp3ZWIgYmx1ZXRvb2jjga7jgb8gbm9kZS5qc+OBr2luc3RhbmNlb2YgQnVmZmVyXG5cbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLy/jg4fjg7zjgr/jga5wYXJzZVxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBsZXQgbm90aWZ5QmluTGVuPWR2LmJ5dGVMZW5ndGg7XG4gICAgICAgICAgICBsZXQgbm90aWZ5Q21kPWR2LmdldFVpbnQ4KDApOy8v44Os44K444K544K/5oOF5aCx6YCa55+l44Kz44Oe44Oz44OJSUQgMHg0MOWbuuWumlxuXG4gICAgICAgICAgICBpZihub3RpZnlDbWQhPTB4NDB8fG5vdGlmeUJpbkxlbjw9Nil7cmV0dXJuO30vL+ODrOOCuOOCueOCv+aDheWgseOCkuWQq+OBvuOBquOBhOODh+ODvOOCv+OBruegtOajhFxuXG4gICAgICAgICAgICBsZXQgaWQ9ZHYuZ2V0VWludDE2KDEsZmFsc2UpOy8v6YCB5L+hSURcbiAgICAgICAgICAgIGxldCByZWdpc3RlckNtZD1kdi5nZXRVaW50OCgzKTsvL+ODrOOCuOOCueOCv+OCs+ODnuODs+ODiVxuICAgICAgICAgICAgbGV0IGNyYz1kdi5nZXRVaW50MTYobm90aWZ5QmluTGVuLTIsZmFsc2UpOy8vQ1JD44Gu5YCkIOacgOW+jOOBi+OCiTJkeXRlXG5cbiAgICAgICAgICAgIGxldCByZXM9e307XG4gICAgICAgICAgICAvL+OCs+ODnuODs+ODieWIpeOBq+OCiOOCi+ODrOOCuOOCueOCv+OBruWApOOBruWPluW+l1s0LW4gYnl0ZV1cbiAgICAgICAgICAgIHN3aXRjaChyZWdpc3RlckNtZCl7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELm1heFNwZWVkOlxuICAgICAgICAgICAgICAgICAgICByZXMubWF4U3BlZWQ9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELm1pblNwZWVkOlxuICAgICAgICAgICAgICAgICAgICByZXMubWluU3BlZWQ9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELmN1cnZlVHlwZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmN1cnZlVHlwZT1kdi5nZXRVaW50OCg0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELmFjYzpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmFjYz1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQuZGVjOlxuICAgICAgICAgICAgICAgICAgICByZXMuZGVjPWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORC5tYXhUb3JxdWU6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tYXhUb3JxdWU9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELnFDdXJyZW50UDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnFDdXJyZW50UD1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQucUN1cnJlbnRJOlxuICAgICAgICAgICAgICAgICAgICByZXMucUN1cnJlbnRJPWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORC5xQ3VycmVudEQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5xQ3VycmVudEQ9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELnNwZWVkUDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNwZWVkUD1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQuc3BlZWRJOlxuICAgICAgICAgICAgICAgICAgICByZXMuc3BlZWRJPWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfU0VUVElOR19SRUFEUkVHSVNURVJfQ09NTUFORC5zcGVlZEQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zcGVlZEQ9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9TRVRUSU5HX1JFQURSRUdJU1RFUl9DT01NQU5ELnBvc2l0aW9uUDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnBvc2l0aW9uUD1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQub3duQ29sb3I6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5vd25Db2xvcj0oJyMwMDAwMDAnICtOdW1iZXIoZHYuZ2V0VWludDgoNCk8PDE2fGR2LmdldFVpbnQ4KDUpPDw4fGR2LmdldFVpbnQ4KDYpKS50b1N0cmluZygxNikpLnN1YnN0cigtNik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXMpO1xuXG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yU2V0dGluZ0NCKHJlZ2lzdGVyQ21kLHJlcyk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogc2VjdGlvbjo65YWs6ZaL44Oh44K944OD44OJXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIFdlYkJsdWV0b29o44Gn44Gu5o6l57aa44KS6ZaL5aeL44GZ44KLXG4gICAgICovXG4gICAgY29ubmVjdCgpe1xuICAgICAgICBpZiAodGhpcy5fcGVyaXBoZXJhbCYmIHRoaXMuX3BlcmlwaGVyYWwuZ2F0dCYmdGhpcy5fcGVyaXBoZXJhbC5nYXR0LmNvbm5lY3RlZCApIHtyZXR1cm59XG4gICAgICAgIGxldCBnYXQ9ICh0aGlzLl9wZXJpcGhlcmFsJiYgdGhpcy5fcGVyaXBoZXJhbC5nYXR0ICk/dGhpcy5fcGVyaXBoZXJhbC5nYXR0IDp1bmRlZmluZWQ7Ly/lho3mjqXntprnlKhcbiAgICAgICAgdGhpcy5fYmxlQ29ubmVjdChnYXQpLnRoZW4ob2JqPT57Ly9pbmZvOjogcmVzb2x2ZSh7ZGV2aWNlSUQsZGV2aWNlTmFtZSxibGVEZXZpY2UsY2hhcmFjdGVyaXN0aWNzfSk7XG4gICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW9iai5ibGVEZXZpY2U7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmlkPXRoaXMuX3BlcmlwaGVyYWwuaWQ7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLm5hbWU9dGhpcy5fcGVyaXBoZXJhbC5uYW1lO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q9dGhpcy5fcGVyaXBoZXJhbC5nYXR0LmNvbm5lY3RlZDtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8ubWFudWZhY3R1cmVyTmFtZT1vYmouaW5mb21hdGlvbi5tYW51ZmFjdHVyZXJOYW1lO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5oYXJkd2FyZVJldmlzaW9uPW9iai5pbmZvbWF0aW9uLmhhcmR3YXJlUmV2aXNpb247XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmZpcm13YXJlUmV2aXNpb249b2JqLmluZm9tYXRpb24uZmlybXdhcmVSZXZpc2lvbjtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3M9b2JqLmNoYXJhY3RlcmlzdGljcztcblxuICAgICAgICAgICAgaWYoIWdhdCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdnYXR0c2VydmVyZGlzY29ubmVjdGVkJyx0aGlzLl9vbkJsZUNvbm5lY3Rpb25Mb3N0KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2dhdHRzZXJ2ZXJkaXNjb25uZWN0ZWQnLCB0aGlzLl9vbkJsZUNvbm5lY3Rpb25Mb3N0KTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfTUVBU1VSRU1FTlQnXSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfTUVBU1VSRU1FTlQnXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3Rvck1lYXN1cmVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9NRUFTVVJFTUVOVCddLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yTWVhc3VyZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX01FQVNVUkVNRU5UJ10uc3RhcnROb3RpZmljYXRpb25zKCkudGhlbihvYmo9PntcbiAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9JTVVfTUVBU1VSRU1FTlQnXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCddLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZUltdU1lYXN1cmVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfSU1VX01FQVNVUkVNRU5UJ10uYWRkRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlSW11TWVhc3VyZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfSU1VX01FQVNVUkVNRU5UJ10uc3RhcnROb3RpZmljYXRpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICB9KS50aGVuKG9iaj0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9TRVRUSU5HJ10pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfU0VUVElORyddLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yU2V0dGluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9TRVRUSU5HJ10uYWRkRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JTZXR0aW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9TRVRUSU5HJ10uc3RhcnROb3RpZmljYXRpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgfSkudGhlbihvYmo9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZV9pbml0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzQ2hhbmdlX2lzQ29ubmVjdCh0cnVlKTsvL+WIneWbnuOBruOBvyhjb21w5Lul5YmN44Gv55m654Gr44GX44Gq44GE54K6KVxuICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZV9pc0Nvbm5lY3QodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGVycj0+e1xuICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbD1udWxsO1xuICAgICAgICAgICAgdGhpcy5fb25Db25uZWN0RmFpbHVyZUhhbmRsZXIodGhpcyxlcnIpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdlYkJsdWV0b29o44Gu5YiH5patXG4gICAgICovXG4gICAgZGlzQ29ubmVjdCgpe1xuICAgICAgIGlmICghdGhpcy5fcGVyaXBoZXJhbCB8fCAhdGhpcy5fcGVyaXBoZXJhbC5nYXR0LmNvbm5lY3RlZCl7cmV0dXJuO31cbiAgICAgICAgdGhpcy5fcGVyaXBoZXJhbC5nYXR0LmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgdGhpcy5fcGVyaXBoZXJhbD1udWxsO1xuXG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5YaF6YOoXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQkxF5o6l57aaXG4gICAgICogQHBhcmFtIGdhdHRfb2JqIOODmuOCouODquODs+OCsOa4iOOBv+OBrkdBVFTjga7jg4fjg5DjgqTjgrnjgavlho3mjqXntprnlKgo44Oa44Ki44Oq44Oz44Kw44Oi44O844OA44Or44Gv5Ye644Gq44GEKVxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2JsZUNvbm5lY3QoZ2F0dF9vYmopIHtcbiAgICAgIC8vbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgIC8vIGxldCBibGVEZXZpY2U7XG4gICAgICAgICAgLy8gbGV0IGRldmljZU5hbWU7XG4gICAgICAgICAgLy8gbGV0IGRldmljZUlEO1xuICAgICAgICAgIGlmKCFnYXR0X29iail7XG4gICAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgZmlsdGVyczogW3tzZXJ2aWNlczogW3RoaXMuX01PVE9SX0JMRV9TRVJWSUNFX1VVSURdfV0sXG4gICAgICAgICAgICAgICAgICBvcHRpb25hbFNlcnZpY2VzOlt0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5TZXJ2aWNlXVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBuYXZpZ2F0b3IuYmx1ZXRvb3RoLnJlcXVlc3REZXZpY2Uob3B0aW9ucylcbiAgICAgICAgICAgICAgICAgIC50aGVuKGRldmljZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYmxlR2F0Y29ubmVjdChkZXZpY2UuZ2F0dCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsZURldmljZTogZGV2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlSUQ6IGRldmljZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZU5hbWU6IGRldmljZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNzOnJlcy5jaGFyYWN0ZXJpc3RpY3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uOnJlcy5pbmZvbWF0aW9uXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIHRoaXMuX2JsZUdhdGNvbm5lY3QoZ2F0dF9vYmopXG4gICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX2JsZUdhdGNvbm5lY3RcIik7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZUlEOiBnYXR0X29iai5kZXZpY2UuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZU5hbWU6IGdhdHRfb2JqLmRldmljZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBibGVEZXZpY2U6IGdhdHRfb2JqLmRldmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNzOnJlcy5jaGFyYWN0ZXJpc3RpY3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb246cmVzLmluZm9tYXRpb25cblxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvL0dBVFTmjqXntprnlKhcbiAgICBfYmxlR2F0Y29ubmVjdChnYXR0X29iail7XG4gICAgICAgICAgICBsZXQgY2hhcmFjdGVyaXN0aWNzID0ge307XG4gICAgICAgICAgICBsZXQgaW5mb21hdGlvbj17fTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoZ3Jlc29sdmUsIGdyZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgIGdhdHRfb2JqLmNvbm5lY3QoKS50aGVuKHNlcnZlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2VzKHRoaXMuX01PVE9SX0JMRV9TRVJWSUNFX1VVSUQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuX01PVE9SX0JMRV9TRVJWSUNFX1VVSUQpLnRoZW4oc2VydmljZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX01PVE9SX0JMRV9DUlMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5fTU9UT1JfQkxFX0NSU1trZXldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNoYXJhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNzW2tleV0gPSBjaGFyYTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChjcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vYmxlX2Zpcm13YXJlX3JldmlzaW9u44Gu44K144O844OT44K55Y+W5b6XIGluZm86OkFuZHJvaWRk44Gn44Gv5LiN5a6J5a6a44Gq54K65YGc5q2iXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChzcmVzb2x2ZSwgc3JlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5TZXJ2aWNlKS50aGVuKChzZXJ2aWNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuTWFudWZhY3R1cmVyTmFtZVN0cmluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNoYXJhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hhcmEucmVhZFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uWydtYW51ZmFjdHVyZXJOYW1lJ10gPSBLTVV0bC5VdGY4QXJyYXlUb1N0cihuZXcgVWludDhBcnJheSh2YWwuYnVmZmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlKT0+e3JlamVjdChlKTt9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLkZpcm13YXJlUmV2aXNpb25TdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjaGFyYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoYXJhLnJlYWRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbih2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvblsnZmlybXdhcmVSZXZpc2lvbiddID0gS01VdGwuVXRmOEFycmF5VG9TdHIobmV3IFVpbnQ4QXJyYXkodmFsLmJ1ZmZlcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntyZWplY3QoZSk7fSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5IYXJkd2FyZVJldmlzaW9uU3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGFyYS5yZWFkVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb25bJ2hhcmR3YXJlUmV2aXNpb24nXSA9IEtNVXRsLlV0ZjhBcnJheVRvU3RyKG5ldyBVaW50OEFycmF5KHZhbC5idWZmZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGUpPT57cmVqZWN0KGUpO30pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Jlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmVzb2x2ZSh7Y2hhcmFjdGVyaXN0aWNzOiBjaGFyYWN0ZXJpc3RpY3MsIGluZm9tYXRpb246IGluZm9tYXRpb259KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuXG5cbiAgICAvKipcbiAgICAgKiBCTEXjgrPjg57jg7Pjg4njga7pgIHkv6FcbiAgICAgKiBAcGFyYW0gY29tbWFuZFR5cGVTdHIgICdNT1RPUl9DT05UUk9MJywnTU9UT1JfTUVBU1VSRU1FTlQnLCdNT1RPUl9JTVVfTUVBU1VSRU1FTlQnLCdNT1RPUl9TRVRUSU5HJ1xuICAgICAqIOOCs+ODnuODs+ODieeoruWIpeOBrlN0cmluZyDkuLvjgatCTEXjga7jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrnjgafkvb/nlKjjgZnjgotcbiAgICAgKiBAcGFyYW0gY29tbWFuZE51bVxuICAgICAqIEBwYXJhbSBhcnJheWJ1ZmZlclxuICAgICAqIEBwYXJhbSBub3RpZnlQcm9taXMgY21kUmVhZFJlZ2lzdGVy562J44GuQkxF5ZG844Gz5Ye644GX5b6M44Grbm90aWZ544Gn5Y+W5b6X44GZ44KL5YCk44KSUHJvbWlz44Gn5biw44GZ5b+F6KaB44Gu44GC44KL44Kz44Oe44Oz44OJ55SoXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2VuZE1vdG9yQ29tbWFuZChjb21tYW5kQ2F0ZWdvcnksIGNvbW1hbmROdW0sIGFycmF5YnVmZmVyPW5ldyBBcnJheUJ1ZmZlcigwKSwgbm90aWZ5UHJvbWlzPW51bGwpe1xuICAgICAgICBsZXQgY2hhcmFjdGVyaXN0aWNzPXRoaXMuX2NoYXJhY3RlcmlzdGljc1tjb21tYW5kQ2F0ZWdvcnldO1xuICAgICAgICBsZXQgYWI9bmV3IERhdGFWaWV3KGFycmF5YnVmZmVyKTtcbiAgICAgICAgLy/jgrPjg57jg7Pjg4njg7tJROODu0NSQ+OBruS7mOWKoFxuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGFycmF5YnVmZmVyLmJ5dGVMZW5ndGgrNSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsY29tbWFuZE51bSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigxLHRoaXMuY3JlYXRlQ29tbWFuZElEKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KGFycmF5YnVmZmVyLmJ5dGVMZW5ndGgrMywwKTtcbiAgICAgICAgLy/jg4fjg7zjgr/jga7mm7jjgY3ovrzjgb9cbiAgICAgICAgZm9yKGxldCBpPTA7aTxhcnJheWJ1ZmZlci5ieXRlTGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgzK2ksYWIuZ2V0VWludDgoaSkpO1xuICAgICAgICB9XG4gICAgICAgIC8vcXVl44Gr6L+95YqgXG4gICAgICAgLy8gKyt0aGlzLl9xdWVDb3VudDtcbiAgICAgICAgdGhpcy5fYmxlU2VuZGluZ1F1ZT0gdGhpcy5fYmxlU2VuZGluZ1F1ZS50aGVuKChyZXMpPT57XG4gICAgICAgICAgLy8gIGNvbnNvbGUubG9nKFwiX3NlbmRNb3RvckNvbW1hbmQgcXVlQ291bnQ6XCIrKC0tdGhpcy5fcXVlQ291bnQpKTtcbiAgICAgICAgICAgIGlmKG5vdGlmeVByb21pcyl7XG4gICAgICAgICAgICAgICAgbm90aWZ5UHJvbWlzLnN0YXJ0UmVqZWN0VGltZU91dENvdW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2hhcmFjdGVyaXN0aWNzLndyaXRlVmFsdWUoYnVmZmVyKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIC8v5aSx5pWX5pmC44CALy9pbmZvOjrlvozntprjga7jgrPjg57jg7Pjg4njga/lvJXjgY3ntprjgY3lrp/ooYzjgZXjgozjgotcbiAgICAgICAgICAvLyAgY29uc29sZS5sb2coXCJFUlIgX3NlbmRNb3RvckNvbW1hbmQ6XCIrcmVzK1wiIHF1ZUNvdW50OlwiKygtLXRoaXMuX3F1ZUNvdW50KSk7XG4gICAgICAgICAgICBpZihub3RpZnlQcm9taXMpe1xuICAgICAgICAgICAgICAgIG5vdGlmeVByb21pcy5jYWxsUmVqZWN0KHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4vLy8vLy9jbGFzcy8vXG59XG5cbm1vZHVsZS5leHBvcnRzID1LTUNvbVdlYkJMRTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9LTUNvbVdlYkJMRS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIndXNlIHN0cmljdCc7XG4vKioqXG4gKktNQ29ubmVjdG9yQnJvd3Nlci5qc1xuICogdmVyc2lvbiAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuZ2xvYmFsLktNVXRsPXJlcXVpcmUoJy4vS01VdGwuanMnKTtcbmdsb2JhbC5LTVZlY3RvcjI9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTVZlY3RvcjI7XG4vL2dsb2JhbC5LTVZlY3RvcjM9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTVZlY3RvcjM7XG5nbG9iYWwuS01JbXVTdGF0ZT1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNSW11U3RhdGU7XG5nbG9iYWwuS01MZWRTdGF0ZT1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNTGVkU3RhdGU7XG5nbG9iYWwuS01Sb3RTdGF0ZT1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNUm90U3RhdGU7XG5nbG9iYWwuS01EZXZpY2VJbmZvPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01EZXZpY2VJbmZvO1xuZ2xvYmFsLktNTW90b3JPbmVXZWJCTEU9cmVxdWlyZSgnLi9LTU1vdG9yT25lV2ViQkxFLmpzJyk7XG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvS01Db25uZWN0b3JCcm93c2VyLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKioqXG4gKktNTW90b3JPbmVXZWJCTEUuanNcbiAqIHZhciAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5sZXQgS01Db21XZWJCTEUgPSByZXF1aXJlKCcuL0tNQ29tV2ViQkxFJyk7XG5sZXQgS01Nb3RvckNvbW1hbmRLTU9uZT1yZXF1aXJlKCcuL0tNTW90b3JDb21tYW5kS01PbmUuanMnKTtcblxuLyoqXG4gKiBAY2xhc3NkZXNjIEtNLTHjga5XZWJCbHVldG9vaOaOpee2mueUqCDku67mg7Pjg4fjg5DjgqTjgrlcbiAqL1xuY2xhc3MgS01Nb3Rvck9uZVdlYkJMRSBleHRlbmRzIEtNTW90b3JDb21tYW5kS01PbmV7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTU1vdG9yQ29tbWFuZEtNT25lXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoS01Nb3RvckNvbW1hbmRLTU9uZS5LTV9DT05ORUNUX1RZUEUuV0VCQkxFLG5ldyBLTUNvbVdlYkJMRSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgajmjqXntprjgZnjgotcbiAgICAgKi9cbiAgICBjb25uZWN0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLmNvbm5lY3QoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgajliIfmlq1cbiAgICAgKi9cbiAgICBkaXNDb25uZWN0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLmRpc0Nvbm5lY3QoKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID1LTU1vdG9yT25lV2ViQkxFO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL0tNTW90b3JPbmVXZWJCTEUuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLyoqKlxuICogS01Db21CYXNlLmpzXG4gKiB2ZXJzaW9uIDAuMS4wIGFscGhhXG4gKiBDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4ndXNlIHN0cmljdCc7XG5sZXQgS01VdGwgPSByZXF1aXJlKCcuL0tNVXRsJyk7XG5sZXQgS01TdHJ1Y3R1cmVzPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzJyk7XG4vKipcbiAqIEBjbGFzc2Rlc2Mg6YCa5L+h44Kv44Op44K544Gu5Z+65bqVXG4gKiBAaWdub3JlXG4gKi9cbmNsYXNzIEtNQ29tQmFzZXtcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWumuaVsFxuICAgICoqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3LjgIBcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW51bGw7XG4gICAgICAgIHRoaXMuX2NvbW1hbmRDb3VudD0wO1xuICAgICAgICB0aGlzLl9kZXZpY2VJbmZvPW5ldyBLTVN0cnVjdHVyZXMuS01EZXZpY2VJbmZvKCk7XG5cbiAgICAgICAgdGhpcy5fbW90b3JNZWFzdXJlbWVudD1uZXcgS01TdHJ1Y3R1cmVzLktNUm90U3RhdGUoKTtcbiAgICAgICAgdGhpcy5fbW90b3JMZWQ9bmV3IEtNU3RydWN0dXJlcy5LTUxlZFN0YXRlKCk7XG4gICAgICAgIHRoaXMuX21vdG9ySW11TWVhc3VyZW1lbnQ9bmV3IEtNU3RydWN0dXJlcy5LTUltdVN0YXRlKCk7XG5cbiAgICAgICAgdGhpcy5fb25Jbml0SGFuZGxlcj1mdW5jdGlvbihjb25uZWN0b3Ipe307XG4gICAgICAgIHRoaXMuX29uQ29ubmVjdEhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yKXt9O1xuICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyPWZ1bmN0aW9uKGNvbm5lY3Rvcil7fTtcbiAgICAgICAgdGhpcy5fb25Db25uZWN0RmFpbHVyZUhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yLCBtc2cpe307XG5cbiAgICAgICAgdGhpcy5fb25Nb3Rvck1lYXN1cmVtZW50Q0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9vbkltdU1lYXN1cmVtZW50Q0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9vbk1vdG9yU2V0dGluZ0NCPWZ1bmN0aW9uKCl7fTtcblxuICAgICAgICB0aGlzLl9pc0luaXQ9ZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIF9vbkJsZU1vdG9yU2V0dGluZ+OBruOCs+ODnuODs+ODieOAgOODouODvOOCv+ODvOioreWumuaDheWgseOBrumAmuefpeWPl+S/oeaZguOBq+ODkeODvOOCueOBmeOCi+eUqFxuICAgICAgICAgKiBAdHlwZSB7e21heFNwZWVkOiBudW1iZXIsIG1pblNwZWVkOiBudW1iZXIsIGN1cnZlVHlwZTogbnVtYmVyLCBhY2M6IG51bWJlciwgZGVjOiBudW1iZXIsIG1heFRvcnF1ZTogbnVtYmVyLCBxQ3VycmVudFA6IG51bWJlciwgcUN1cnJlbnRJOiBudW1iZXIsIHFDdXJyZW50RDogbnVtYmVyLCBzcGVlZFA6IG51bWJlciwgc3BlZWRJOiBudW1iZXIsIHNwZWVkRDogbnVtYmVyLCBwb3NpdGlvblA6IG51bWJlciwgb3duQ29sb3I6IG51bWJlcn19XG4gICAgICAgICAqIEBpZ25vcmVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX01PVE9SX1NFVFRJTkdfUkVBRFJFR0lTVEVSX0NPTU1BTkQ9e1xuICAgICAgICAgICAgICAgIFwibWF4U3BlZWRcIjoweDAyLFxuICAgICAgICAgICAgICAgIFwibWluU3BlZWRcIjoweDAzLFxuICAgICAgICAgICAgICAgIFwiY3VydmVUeXBlXCI6MHgwNSxcbiAgICAgICAgICAgICAgICBcImFjY1wiOjB4MDcsXG4gICAgICAgICAgICAgICAgXCJkZWNcIjoweDA4LFxuICAgICAgICAgICAgICAgIFwibWF4VG9ycXVlXCI6MHgwRSxcbiAgICAgICAgICAgICAgICBcInFDdXJyZW50UFwiOjB4MTgsXG4gICAgICAgICAgICAgICAgXCJxQ3VycmVudElcIjoweDE5LFxuICAgICAgICAgICAgICAgIFwicUN1cnJlbnREXCI6MHgxQSxcbiAgICAgICAgICAgICAgICBcInNwZWVkUFwiOjB4MUIsXG4gICAgICAgICAgICAgICAgXCJzcGVlZElcIjoweDFDLFxuICAgICAgICAgICAgICAgIFwic3BlZWREXCI6MHgxRCxcbiAgICAgICAgICAgICAgICBcInBvc2l0aW9uUFwiOjB4MUUsXG4gICAgICAgICAgICAgICAgXCJvd25Db2xvclwiOjB4M0FcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog44OX44Ot44OR44OG44KjXG4gICAgICoqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICog44OH44OQ44Kk44K55oOF5aCxXG4gICAgICogQHR5cGUge0tNRGV2aWNlSW5mb31cbiAgICAgKlxuICAgICAqL1xuICAgIGdldCBkZXZpY2VJbmZvKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZXZpY2VJbmZvLkNsb25lKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pyJ5Yq554Sh5Yq5XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgZ2V0IGlzQ29ubmVjdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Kz44Oe44Oz44OJ6aCG55uj6KaW55So6YCj55Wq44Gu55m66KGMXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQgY3JlYXRlQ29tbWFuZElEKCl7XG4gICAgICAgcmV0dXJuIHRoaXMuX2NvbW1hbmRDb3VudD0oKyt0aGlzLl9jb21tYW5kQ291bnQpJjBiMTExMTExMTExMTExMTExMTsvLzY1NTM144Gn44Or44O844OXXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaXNDb25uZWN044Gu6Kit5a6a5aSJ5pu0KOWtkOOCr+ODqeOCueOBi+OCieS9v+eUqClcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJvb2xcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgX3N0YXR1c0NoYW5nZV9pc0Nvbm5lY3QoYm9vbCl7XG4gICAgICAgIHRoaXMuX2RldmljZUluZm8uaXNDb25uZWN0PWJvb2w7XG4gICAgICAgIGlmKHRoaXMuX2lzSW5pdCl7XG4gICAgICAgICAgICBpZihib29sKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RIYW5kbGVyKHRoaXMpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25EaXNjb25uZWN0SGFuZGxlcih0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWIneacn+WMlueKtuaFi+OBruioreWumijlrZDjgq/jg6njgrnjgYvjgonkvb/nlKgpXG4gICAgICogQHBhcmFtIHtib29sZWFufSBib29sXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIF9zdGF0dXNDaGFuZ2VfaW5pdChib29sKXtcbiAgICAgICAgdGhpcy5faXNJbml0PWJvb2w7XG4gICAgICAgIGlmKHRoaXMuX2lzSW5pdCl7XG4gICAgICAgICAgICB0aGlzLl9vbkluaXRIYW5kbGVyKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogY2FsbGJhY2tcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDliJ3mnJ/ljJblrozkuobjgZfjgabliKnnlKjjgafjgY3jgovjgojjgYbjgavjgarjgaPjgZ9cbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oS01Db21CYXNlKX1cbiAgICAgKi9cbiAgICBzZXQgb25Jbml0KGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uSW5pdEhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOW/nOetlOODu+WGjeaOpee2muOBq+aIkOWKn+OBl+OBn1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihLTUNvbUJhc2UpfVxuICAgICAqL1xuICAgIHNldCBvbkNvbm5lY3QoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Db25uZWN0SGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog5b+c562U44GM54Sh44GP44Gq44Gj44Gf44O75YiH5pat44GV44KM44GfXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKEtNQ29tQmFzZSl9XG4gICAgICovXG4gICAgc2V0IG9uRGlzY29ubmVjdChoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDmjqXntprjgavlpLHmlZdcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oS01Db21CYXNlLHN0cmluZyl9XG4gICAgICovXG4gICAgc2V0IG9uQ29ubmVjdEZhaWx1cmUoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Db25uZWN0RmFpbHVyZUhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Gu5Zue6Lui5oOF5aCxY2FsbGJhY2tcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24ocG9zaXRpb246bnVtYmVyLHZlbG9jaXR5Om51bWJlcix0b3JxdWU6bnVtYmVyKX1cbiAgICAgKi9cbiAgICBzZXQgb25Nb3Rvck1lYXN1cmVtZW50KGZ1bmMpe1xuICAgICAgICBpZih0eXBlb2YgZnVuYz09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yTWVhc3VyZW1lbnRDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBruOCuOODo+OCpOODreaDheWgsWNhbGxiYWNrXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKHthY2NlbFg6bnVtYmVyLGFjY2VsWTpudW1iZXIsYWNjZWxaOm51bWJlcix0ZW1wOm51bWJlcixneXJvWDpudW1iZXIsZ3lyb1k6bnVtYmVyLGd5cm9aOm51bWJlcn0pfVxuICAgICAqL1xuICAgIHNldCBvbkltdU1lYXN1cmVtZW50KGZ1bmMpe1xuICAgICAgICBpZih0eXBlb2YgZnVuYz09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkltdU1lYXN1cmVtZW50Q0I9ZnVuYztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOioreWumuaDheWgseWPluW+l2NhbGxiYWNrXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKHJlZ2lzdGVyQ21kOm51bWJlcixyZXM6bnVtYmVyKX1cbiAgICAgKi9cbiAgICBzZXQgb25Nb3RvclNldHRpbmcoZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JTZXR0aW5nQ0I9ZnVuYztcbiAgICAgICAgfVxuICAgIH1cbiAgICBcblxuLy8vLy8vY2xhc3MvL1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9S01Db21CYXNlO1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL0tNQ29tQmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKioqXG4gKiBLTU1vdG9yQ29tbWFuZEtNT25lLmpzXG4gKiB2ZXJzaW9uIDAuMS4wIGFscGhhXG4gKiBDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4ndXNlIHN0cmljdCc7XG5sZXQgRXZlbnRFbWl0dGVyID0gcmVxdWlyZShcImV2ZW50c1wiKS5FdmVudEVtaXR0ZXI7XG5sZXQgS01VdGwgPSByZXF1aXJlKCcuL0tNVXRsJyk7XG5sZXQgS01Db21XZWJCTEUgPSByZXF1aXJlKCcuL0tNQ29tV2ViQkxFJyk7XG5sZXQgS01TdHJ1Y3R1cmVzPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzJyk7XG5cblxuLyoqXG4gKiBAY2xhc3NkZXNjIEtNMeOCs+ODnuODs+ODiemAgeS/oeOCr+ODqeOCuVxuICogQGlnbm9yZVxuICovXG5jbGFzcyBLTU1vdG9yQ29tbWFuZEtNT25lIGV4dGVuZHMgRXZlbnRFbWl0dGVye1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWumuaVsFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDmjqXntprmlrnlvI/lrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBXRUJCTEUgLSAxOldFQkJMRVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBCTEUgLSAyOkJMRVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBTRVJJQUwgLSAzOlNFUklBTFxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgS01fQ09OTkVDVF9UWVBFKCl7XG4gICAgICAgIHJldHVybiB7XCJXRUJCTEVcIjoxLFwiQkxFXCI6MixcIlNFUklBTFwiOjN9O1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogY21kUHJlcGFyZVBsYXliYWNrTW90aW9u44Gu6ZaL5aeL5L2N572u44Kq44OX44K344On44Oz5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gU1RBUlRfUE9TSVRJT05fQUJTIC0gMDroqJjmhrbjgZXjgozjgZ/plovlp4vkvY3nva7vvIjntbblr77luqfmqJnvvInjgYvjgonjgrnjgr/jg7zjg4hcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gU1RBUlRfUE9TSVRJT05fQ1VSUkVOVCAtIDE654++5Zyo44Gu5L2N572u44KS6ZaL5aeL5L2N572u44Go44GX44Gm44K544K/44O844OIXG4gICAgICovXG4gICAgc3RhdGljIGdldCBjbWRQcmVwYXJlUGxheWJhY2tNb3Rpb25fU1RBUlRfUE9TSVRJT04oKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ1NUQVJUX1BPU0lUSU9OX0FCUyc6MCxcbiAgICAgICAgICAgICdTVEFSVF9QT1NJVElPTl9DVVJSRU5UJzoxXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNtZExlZOOBrkxFROOBrueCueeBr+eKtuaFi+OCquODl+OCt+ODp+ODs+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IExFRF9TVEFURV9PRkYgLSAwOua2iOeBr1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBMRURfU1RBVEVfT05fU09MSUQgLSAxOkxFROeCueeBr++8iOeCueeBr+OBl+OBo+OBseOBquOBl++8iVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBMRURfU1RBVEVfT05fRkxBU0ggLSAyOkxFROeCuea7he+8iOS4gOWumumWk+malOOBp+eCuea7he+8iVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBMRURfU1RBVEVfT05fRElNIC0gOjNMRUTjgYzjgobjgaPjgY/jgormmI7mu4XjgZnjgotcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZExlZF9MRURfU1RBVEUoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ0xFRF9TVEFURV9PRkYnOjAsXG4gICAgICAgICAgICAnTEVEX1NUQVRFX09OX1NPTElEJzoxLFxuICAgICAgICAgICAgJ0xFRF9TVEFURV9PTl9GTEFTSCc6MixcbiAgICAgICAgICAgICdMRURfU1RBVEVfT05fRElNJzozXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNtZEN1cnZlVHlwZeOBruWKoOa4m+mAn+OCq+ODvOODluOCquODl+OCt+ODp+ODs+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IENVUlZFX1RZUEVfTk9ORSAtIDA644Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9GRlxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBDVVJWRV9UWVBFX1RSQVBFWk9JRCAtIDE644Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9OIO+8iOWPsOW9ouWKoOa4m+mAn++8iVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ0NVUlZFX1RZUEVfTk9ORSc6IDAsXG4gICAgICAgICAgICAnQ1VSVkVfVFlQRV9UUkFQRVpPSUQnOjFcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLypcbiAgICAqIFJlYWRSZWdpc3RlcuOBp+WPluW+l+OBmeOCi+aZgueUqOOBruOCs+ODnuODs+ODieW8leaVsOWumuaVsFxuICAgICogQHJlYWRvbmx5XG4gICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICogKi9cbiAgICBzdGF0aWMgZ2V0IGNtZFJlYWRSZWdpc3Rlcl9DT01NQU5EKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgIFwibWF4U3BlZWRcIjoweDAyLFxuICAgICAgICAgICAgXCJtaW5TcGVlZFwiOjB4MDMsXG4gICAgICAgICAgICBcImN1cnZlVHlwZVwiOjB4MDUsXG4gICAgICAgICAgICBcImFjY1wiOjB4MDcsXG4gICAgICAgICAgICBcImRlY1wiOjB4MDgsXG4gICAgICAgICAgICBcIm1heFRvcnF1ZVwiOjB4MEUsXG4gICAgICAgICAgICBcInFDdXJyZW50UFwiOjB4MTgsXG4gICAgICAgICAgICBcInFDdXJyZW50SVwiOjB4MTksXG4gICAgICAgICAgICBcInFDdXJyZW50RFwiOjB4MUEsXG4gICAgICAgICAgICBcInNwZWVkUFwiOjB4MUIsXG4gICAgICAgICAgICBcInNwZWVkSVwiOjB4MUMsXG4gICAgICAgICAgICBcInNwZWVkRFwiOjB4MUQsXG4gICAgICAgICAgICBcInBvc2l0aW9uUFwiOjB4MUUsXG4gICAgICAgICAgICBcIm93bkNvbG9yXCI6MHgzQVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9y44CAXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLktNX0NPTk5FQ1RfVFlQRX0gY29ubmVjdF90eXBlIOaOpee2muaWueW8j1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBrbWNvbSDpgJrkv6Hjgqrjg5bjgrjjgqfjgq/jg4gge0BsaW5rIEtNQ29tQkxFfSB7QGxpbmsgS01Db21XZWJCTEV9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihjb25uZWN0X3R5cGUsa21jb20pe1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjgqTjg5njg7Pjg4jjg4/jg7Pjg4njg6njgr/jgqTjg5flrprmlbBcbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqIEBlbnVtIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLkVWRU5UX1RZUEU9e1xuICAgICAgICAgICAgLyoqIOWIneacn+WMluWujOS6huaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0tNRGV2aWNlSW5mb30pICovIGluaXQ6XCJpbml0XCIsXG4gICAgICAgICAgICAvKiog5o6l57aa5pmCPGJyPnJldHVybjpmdW5jdGlvbih7S01EZXZpY2VJbmZvfSkgKi8gY29ubmVjdDpcImNvbm5lY3RcIixcbiAgICAgICAgICAgIC8qKiDliIfmlq3mmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtLTURldmljZUluZm99KSAqLyBkaXNjb25uZWN0OlwiZGlzY29ubmVjdFwiLFxuICAgICAgICAgICAgLyoqIOaOpee2muOBq+WkseaVl+aZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0tNRGV2aWNlSW5mb30se21zZ30pICovIGNvbm5lY3RGYWlsdXJlOlwiY29ubmVjdEZhaWx1cmVcIixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zlm57ou6Lmg4XloLHlj5fkv6HmmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtAbGluayBLTVJvdFN0YXRlfSkgKi8gbW90b3JNZWFzdXJlbWVudDpcIm1vdG9yTWVhc3VyZW1lbnRcIixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7xJTVXmg4XloLHlj5fkv6HmmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtAbGluayBLTUltdVN0YXRlfSkgKi8gaW11TWVhc3VyZW1lbnQ6XCJpbXVNZWFzdXJlbWVudFwiXG4gICAgICAgIH07XG4gICAgICAgIE9iamVjdC5mcmVlemUodGhpcy5FVkVOVF9UWVBFKTsvL2luZm86OuW+jOOBi+OCieODleODquODvOOCuuOBl+OBquOBhOOBqGpzZG9j44GM55Sf5oiQ44GV44KM44Gq44GE44CCXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zjga7lhajjgrPjg57jg7Pjg4lcbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9NT1RPUl9DT01NQU5EPXtcbiAgICAgICAgICAgIC8qKiDmnIDlpKfpgJ/jgZXjgpLoqK3lrprjgZnjgosgKi8gbWF4U3BlZWQ6MHgwMixcbiAgICAgICAgICAgIC8qKiDmnIDlsI/pgJ/jgZXjgpLoqK3lrprjgZnjgosgKi8gbWluU3BlZWQ6MHgwMyxcbiAgICAgICAgICAgIC8qKiDliqDmuJvpgJ/mm7Lnt5rjgpLoqK3lrprjgZnjgosgKi8gY3VydmVUeXBlOjB4MDUsXG4gICAgICAgICAgICAvKiog5Yqg6YCf5bqm44KS6Kit5a6a44GZ44KLICovIGFjYzoweDA3LFxuICAgICAgICAgICAgLyoqIOa4m+mAn+W6puOCkuioreWumuOBmeOCiyAqLyBkZWM6MHgwOCxcbiAgICAgICAgICAgIC8qKiDmnIDlpKfjg4jjg6vjgq/jgpLoqK3lrprjgZnjgosgKi8gbWF4VG9ycXVlOjB4MEUsXG4gICAgICAgICAgICAvKiogcei7uOmbu+a1gVBJROOCsuOCpOODsyhQKeOCkuioreWumuOBmeOCiyAqLyBxQ3VycmVudFA6MHgxOCxcbiAgICAgICAgICAgIC8qKiBx6Lu46Zu75rWBUElE44Ky44Kk44OzKEkp44KS6Kit5a6a44GZ44KLICovIHFDdXJyZW50SToweDE5LFxuICAgICAgICAgICAgLyoqIHHou7jpm7vmtYFQSUTjgrLjgqTjg7MoRCnjgpLoqK3lrprjgZnjgosgKi8gcUN1cnJlbnREOjB4MUEsXG4gICAgICAgICAgICAvKiog6YCf5bqmUElE44Ky44Kk44OzKFAp44KS6Kit5a6a44GZ44KLICovIHNwZWVkUDoweDFCLFxuICAgICAgICAgICAgLyoqIOmAn+W6plBJROOCsuOCpOODsyhJKeOCkuioreWumuOBmeOCiyAqLyBzcGVlZEk6MHgxQyxcbiAgICAgICAgICAgIC8qKiDpgJ/luqZQSUTjgrLjgqTjg7MoRCnjgpLoqK3lrprjgZnjgosgKi8gc3BlZWREOjB4MUQsXG4gICAgICAgICAgICAvKiog5L2N572uUElE44Ky44Kk44OzKFAp44KS6Kit5a6a44GZ44KLICovIHBvc2l0aW9uUDoweDFFLFxuICAgICAgICAgICAgLyoqIFBJROOCsuOCpOODs+OCkuODquOCu+ODg+ODiOOBmeOCiyAqLyByZXNldFBJRDoweDIyLFxuICAgICAgICAgICAgLyoqIOODh+ODkOOCpOOCuUxFROOBruWbuuacieiJsuOCkuioreWumuOBmeOCiyAqLyBvd25Db2xvcjoweDNBLFxuICAgICAgICAgICAgLyoqIOaMh+WumuOBruioreWumuWApOOCkuWPluW+l+OBmeOCiyAqLyByZWFkUmVnaXN0ZXI6MHg0MCxcbiAgICAgICAgICAgIC8qKiDlhajjgabjga7oqK3lrprlgKTjgpLjg5Xjg6njg4Pjgrfjg6Xjgavkv53lrZjjgZnjgosgKi8gc2F2ZUFsbFJlZ2lzdGVyczoweDQxLFxuICAgICAgICAgICAgLyoqIOaMh+WumuOBruioreWumuWApOOCkuODquOCu+ODg+ODiOOBmeOCiyAqLyByZXNldFJlZ2lzdGVyOjB4NEUsXG4gICAgICAgICAgICAvKiog5YWo6Kit5a6a5YCk44KS44Oq44K744OD44OI44GZ44KLICovIHJlc2V0QWxsUmVnaXN0ZXJzOjB4NEYsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844Gu5YuV5L2c44KS5LiN6Kix5Y+v44Go44GZ44KLICovIGRpc2FibGU6MHg1MCxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zli5XkvZzjgpLoqLHlj6/jgZnjgosgKi8gZW5hYmxlOjB4NTEsXG4gICAgICAgICAgICAvKiog6YCf5bqm44Gu5aSn44GN44GV44KS6Kit5a6a44GZ44KLICovIHNwZWVkOjB4NTgsXG4gICAgICAgICAgICAvKiog5L2N572u44Gu44OX44Oq44K744OD44OI44KS6KGM44GG77yI5Y6f54K56Kit5a6a77yJICovIHByZXNldFBvc2l0aW9uOjB4NUEsXG4gICAgICAgICAgICAvKiog5q2j5Zue6Lui44GZ44KL77yI5Y+N5pmC6KiI5Zue44KK77yJICovIHJ1bkZvcndhcmQ6MHg2MCxcbiAgICAgICAgICAgIC8qKiDpgIblm57ou6LjgZnjgovvvIjmmYLoqIjlm57jgorvvIkgKi8gcnVuUmV2ZXJzZToweDYxLFxuICAgICAgICAgICAgLyoqIOe1tuWvvuS9jee9ruOBq+enu+WLleOBmeOCiyAqLyBtb3ZlVG9Qb3NpdGlvbjoweDY2LFxuICAgICAgICAgICAgLyoqIOebuOWvvuS9jee9ruOBq+enu+WLleOBmeOCiyAqLyBtb3ZlQnlEaXN0YW5jZToweDY4LFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOBruWKseejgeOCkuWBnOatouOBmeOCiyAqLyBmcmVlOjB4NkMsXG4gICAgICAgICAgICAvKiog6YCf5bqm44K844Ot44G+44Gn5rib6YCf44GX5YGc5q2i44GZ44KLICovIHN0b3A6MHg2RCxcbiAgICAgICAgICAgIC8qKiDjg4jjg6vjgq/liLblvqHjgpLooYzjgYYgKi8gaG9sZFRvcnF1ZToweDcyLFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOCkuWun+ihjOOBmeOCiyAqLyBkb1Rhc2tzZXQ6MHg4MSxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/jga7plovlp4vlnLDngrnjgavnp7vli5XjgZnjgosgKi8gcHJlcGFyZVBsYXliYWNrTW90aW9uOjB4ODYsXG4gICAgICAgICAgICAvKiog44Oi44O844K344On44Oz44KS5YaN55Sf44GZ44KLICovIHN0YXJ0UGxheWJhY2s6MHg4NyxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/jgpLlgZzmraLjgZnjgosgKi8gc3RvcFBsYXliYWNrOjB4ODgsXG4gICAgICAgICAgICAvKiog44Kt44Ol44O844KS5YGc5q2i44GZ44KLICovIHBhdXNlOjB4OTAsXG4gICAgICAgICAgICAvKiog44Kt44Ol44O844KS5YaN6ZaL44GZ44KLICovIHJlc3VtZToweDkxLFxuICAgICAgICAgICAgLyoqIOOCreODpeODvOOCkuaMh+WumuaZgumWk+WBnOatouOBl+WGjemWi+OBmeOCiyAqLyB3YWl0OjB4OTIsXG4gICAgICAgICAgICAvKiog44Kt44Ol44O844KS44Oq44K744OD44OI44GZ44KLICovIHJlc2V0OjB4OTUsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44KS6ZaL5aeL44GZ44KLICovIHN0YXJ0UmVjb3JkaW5nVGFza3NldDoweEEwLFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuOCkuWBnOatouOBmeOCiyAqLyBzdG9wUmVjb3JkaW5nVGFza3NldDoweEEyLFxuICAgICAgICAgICAgLyoqIOaMh+WumuOBruOCv+OCueOCr+OCu+ODg+ODiOOCkuWJiumZpOOBmeOCiyAqLyBlcmFzZVRhc2tzZXQ6MHhBMyxcbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jjgpLlhajliYrpmaTjgZnjgosgKi8gZXJhc2VBbGxUYXNrc2V0czoweEE0LFxuICAgICAgICAgICAgLyoqIOODhuOCo+ODvOODgeODs+OCsOOBrumWi+Wni+a6luWCmeOCkuihjOOBhiAqLyBwcmVwYXJlVGVhY2hpbmdNb3Rpb246MHhBQSxcbiAgICAgICAgICAgIC8qKiDjg4bjgqPjg7zjg4Hjg7PjgrDjgpLplovlp4vjgZnjgosgKi8gc3RhcnRUZWFjaGluZ01vdGlvbjoweEFCLFxuICAgICAgICAgICAgLyoqIOODhuOCo+ODvOODgeODs+OCsOOCkuWBnOatouOBmeOCiyAqLyBzdG9wVGVhY2hpbmdNb3Rpb246MHhBQyxcbiAgICAgICAgICAgIC8qKiDjg4bjgqPjg7zjg4Hjg7PjgrDjgafopprjgYjjgZ/li5XkvZzjgpLliYrpmaTjgZnjgosgKi8gZXJhc2VNb3Rpb246MHhBRCxcbiAgICAgICAgICAgIC8qKiDjg4bjgqPjg7zjg4Hjg7PjgrDjgafopprjgYjjgZ/lhajli5XkvZzjgpLliYrpmaTjgZnjgosgKi8gZXJhc2VBbGxNb3Rpb246MHhBRSxcbiAgICAgICAgICAgIC8qKiBMRUTjga7ngrnnga/nirbmhYvjgpLjgrvjg4Pjg4jjgZnjgosgKi8gbGVkOjB4RTAsXG4gICAgICAgICAgICAvKiogSU1V44Gu5YCk5Y+W5b6XKOmAmuefpSnjgpLplovlp4vjgZnjgosgKi8gZW5hYmxlSU1VOjB4RUEsXG4gICAgICAgICAgICAvKiogSU1V44Gu5YCk5Y+W5b6XKOmAmuefpSnjgpLlgZzmraLjgZnjgosgKi8gZGlzYWJsZUlNVToweEVCLFxuICAgICAgICAgICAgLyoqIOOCt+OCueODhuODoOOCkuWGjei1t+WLleOBmeOCiyAqLyByZWJvb3Q6MHhGMCxcbiAgICAgICAgICAgIC8qKiDjg5XjgqHjg7zjg6DjgqbjgqfjgqLjgqLjg4Pjg5fjg4fjg7zjg4jjg6Ljg7zjg4njgavlhaXjgosgKi8gZW50ZXJEZXZpY2VGaXJtd2FyZVVwZGF0ZToweEZEXG4gICAgICAgIH07XG4gICAgICAgIE9iamVjdC5mcmVlemUodGhpcy5fTU9UT1JfQ09NTUFORCk7Ly9pbmZvOjrlvozjgYvjgonjg5Xjg6rjg7zjgrrjgZfjgarjgYTjgahqc2RvY+OBjOeUn+aIkOOBleOCjOOBquOBhOOAglxuXG4gICAgICAgIC8v44Oi44O844K/44O844Gu5YWo44Kz44Oe44Oz44OJ77yI6YCG5byV55So77yJXG4gICAgICAgIHRoaXMuX1JFVl9NT1RPUl9DT01NQU5EPXt9O1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9NT1RPUl9DT01NQU5EKS5mb3JFYWNoKChrKT0+e3RoaXMuX1JFVl9NT1RPUl9DT01NQU5EW3RoaXMuX01PVE9SX0NPTU1BTkRba11dPWs7fSk7XG4gICAgICAgIC8vU2VuZE5vdGlmeVByb21pc+OBruODquOCueODiFxuICAgICAgICB0aGlzLl9ub3RpZnlQcm9taXNMaXN0PVtdO1xuICAgICAgICB0aGlzLmNtZFByZXBhcmVQbGF5YmFja01vdGlvbl9TVEFSVF9QT1NJVElPTj10aGlzLmNvbnN0cnVjdG9yLmNtZFByZXBhcmVQbGF5YmFja01vdGlvbl9TVEFSVF9QT1NJVElPTjtcbiAgICAgICAgdGhpcy5jbWRMZWRfTEVEX1NUQVRFPXRoaXMuY29uc3RydWN0b3IuY21kTGVkX0xFRF9TVEFURTtcbiAgICAgICAgdGhpcy5jbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRT10aGlzLmNvbnN0cnVjdG9yLmNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFO1xuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIHNlY3Rpb246OmVudHJ5IHBvaW50XG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgdGhpcy5fY29ubmVjdFR5cGU9Y29ubmVjdF90eXBlO1xuICAgICAgICB0aGlzLl9LTUNvbT1rbWNvbTtcblxuICAgICAgICAvL+WGhemDqOOCpOODmeODs+ODiOODkOOCpOODs+ODiVxuICAgICAgICB0aGlzLl9LTUNvbS5vbkluaXQ9KGNvbm5lY3Rvcik9PntcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUuaW5pdCxjb25uZWN0b3IuZGV2aWNlSW5mbyk7Ly/jg4fjg5DjgqTjgrnmg4XloLHjgpLov5TjgZlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fS01Db20ub25Db25uZWN0PShjb25uZWN0b3IpPT57XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLmNvbm5lY3QsY29ubmVjdG9yLmRldmljZUluZm8pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9LTUNvbS5vbkRpc2Nvbm5lY3Q9KGNvbm5lY3Rvcik9PntcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUuZGlzY29ubmVjdCxjb25uZWN0b3IuZGV2aWNlSW5mbyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX0tNQ29tLm9uQ29ubmVjdEZhaWx1cmU9KGNvbm5lY3RvciwgZXJyKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5jb25uZWN0RmFpbHVyZSxjb25uZWN0b3IuZGV2aWNlSW5mbyxlcnIpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICog44Oi44O844K/44O85Zue6Lui5oOF5aCx5Y+X5L+hXG4gICAgICAgICAqIEBwYXJhbSB7e3Bvc2l0aW9uOm51bWJlcix2ZWxvY2l0eTpudW1iZXIsdG9ycXVlOm51bWJlcn19IHJlc1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fS01Db20ub25Nb3Rvck1lYXN1cmVtZW50PShyZXMpPT57XG4gICAgICAgICAgICBsZXQgcm90U3RhdGU9bmV3IEtNU3RydWN0dXJlcy5LTVJvdFN0YXRlKHJlcy5wb3NpdGlvbixyZXMudmVsb2NpdHkscmVzLnRvcnF1ZSk7XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLm1vdG9yTWVhc3VyZW1lbnQscm90U3RhdGUpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICog44Oi44O844K/44O8SU1V5oOF5aCx5Y+X5L+hXG4gICAgICAgICAqIEBwYXJhbSB7ZnVuY3Rpb24oe2FjY2VsWDpudW1iZXIsYWNjZWxZOm51bWJlcixhY2NlbFo6bnVtYmVyLHRlbXA6bnVtYmVyLGd5cm9YOm51bWJlcixneXJvWTpudW1iZXIsZ3lyb1o6bnVtYmVyfSl9IHJlc1xuICAgICAgICAgKiAgQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uSW11TWVhc3VyZW1lbnQ9KHJlcyk9PntcbiAgICAgICAgICAgIGxldCBpbXVTdGF0ZT1uZXcgS01TdHJ1Y3R1cmVzLktNSW11U3RhdGUocmVzLmFjY2VsWCxyZXMuYWNjZWxZLHJlcy5hY2NlbFoscmVzLnRlbXAscmVzLmd5cm9YLHJlcy5neXJvWSxyZXMuZ3lyb1opO1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5pbXVNZWFzdXJlbWVudCxpbXVTdGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHJlZ2lzdGVyQ21kXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZXNcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX0tNQ29tLl9vbk1vdG9yU2V0dGluZ0NCPShyZWdpc3RlckNtZCwgcmVzKT0+e1xuICAgICAgICAgICAgX0tNTm90aWZ5UHJvbWlzLnNlbmRHcm91cE5vdGlmeVJlc29sdmUodGhpcy5fbm90aWZ5UHJvbWlzTGlzdCxyZWdpc3RlckNtZCxyZXMpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDjg5fjg63jg5Hjg4bjgqNcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Go44GuQkxF5o6l57aa44GM5pyJ5Yq544GLXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgZ2V0IGlzQ29ubmVjdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fS01Db20uZGV2aWNlSW5mby5pc0Nvbm5lY3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOaOpee2muaWueW8j1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtLTU1vdG9yQ29tbWFuZEtNT25lLktNX0NPTk5FQ1RfVFlQRX1cbiAgICAgKi9cbiAgICBnZXQgY29ubmVjdFR5cGUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3RUeXBlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODh+ODkOOCpOOCueaDheWgsVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtLTURldmljZUluZm99XG4gICAgICovXG4gICAgZ2V0IGRldmljZUluZm8oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0tNQ29tLmRldmljZUluZm87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5o6l57aa44Kz44ON44Kv44K/44O8XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7S01Db21CTEV9XG4gICAgICovXG4gICAgZ2V0IGNvbm5lY3Rvcigpe1xuICAgICAgICByZXR1cm4gIHRoaXMuX0tNQ29tO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIHNlY3Rpb246OuODouODvOOCv+ODvOOCs+ODnuODs+ODiSBodHRwczovL2RvY3VtZW50LmtlaWdhbi1tb3Rvci5jb20vbW90b3ItY29udHJvbC1jb21tYW5kL21vdG9yX2FjdGlvbi5odG1sXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O85YuV5L2c44KS5LiN6Kix5Y+v44Go44GZ44KL77yI5LiK5L2N5ZG95Luk77yJXG4gICAgICogQGRlc2Mg5a6J5YWo55So77ya44GT44Gu5ZG95Luk44KS5YWl44KM44KL44Go44Oi44O844K/44O844Gv5YuV5L2c44GX44Gq44GEPGJyPlxuICAgICAqIOOCs+ODnuODs+ODieOBr+OCv+OCueOCr+OCu+ODg+ODiOOBq+iomOmMsuOBmeOCi+OBk+OBqOOBr+S4jeWPr1xuICAgICAqL1xuICAgIGNtZERpc2FibGUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuZGlzYWJsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O85YuV5L2c44KS6Kix5Y+v44GZ44KL77yI5LiK5L2N5ZG95Luk77yJXG4gICAgICogQGRlc2Mg5a6J5YWo55So77ya44GT44Gu5ZG95Luk44KS5YWl44KM44KL44Go44Oi44O844K/44O844Gv5YuV5L2c5Y+v6IO944Go44Gq44KLPGJyPlxuICAgICAqIOODouODvOOCv+ODvOi1t+WLleaZguOBryBkaXNhYmxlIOeKtuaFi+OBruOBn+OCgeOAgeacrOOCs+ODnuODs+ODieOBp+WLleS9nOOCkuioseWPr+OBmeOCi+W/heimgeOBjOOBguOCijxicj5cbiAgICAgKiDjgrPjg57jg7Pjg4njga/jgr/jgrnjgq/jgrvjg4Pjg4jjgavoqJjpjLLjgZnjgovjgZPjgajjga/kuI3lj69cbiAgICAgKlxuICAgICAqL1xuICAgIGNtZEVuYWJsZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lbmFibGUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDpgJ/luqbjga7lpKfjgY3jgZXjgpLjgrvjg4Pjg4jjgZnjgovvvIjljZjkvY3ns7vvvJpSUE3vvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWRfcnBtIGZsb2F0ICBbMC1YIHJwbV3jgIAo5q2j44Gu5pWwKVxuICAgICAqL1xuICAgIGNtZFNwZWVkX3JwbShzcGVlZF9ycG0gPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWRfcnBtKjAuMTA0NzE5NzU1MTE5NjU5NzcsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNwZWVkLGJ1ZmZlcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOmAn+W6puOBruWkp+OBjeOBleOCkuOCu+ODg+ODiOOBmeOCi++8iOWNmOS9jeezu++8muODqeOCuOOCouODs++8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCBmbG9hdCDpgJ/luqbjga7lpKfjgY3jgZUg5Y2Y5L2N77ya6KeS5bqm77yI44Op44K444Ki44Oz77yJL+enkiBbMC1YIHJwc13jgIAo5q2j44Gu5pWwKVxuICAgICAqL1xuICAgIGNtZFNwZWVkKHNwZWVkID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOS9jee9ruOBruODl+ODquOCu+ODg+ODiOOCkuihjOOBhu+8iOWOn+eCueioreWumu+8ie+8iOWNmOS9jeezu++8muODqeOCuOOCouODs++8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBmbG9hdCDntbblr77op5LluqbvvJpyYWRpYW5zXG4gICAgICovXG4gICAgY21kUHJlc2V0UG9zaXRpb24ocG9zaXRpb24gPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoS01VdGwudG9OdW1iZXIocG9zaXRpb24pLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnByZXNldFBvc2l0aW9uLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5q2j5Zue6Lui44GZ44KL77yI5Y+N5pmC6KiI5Zue44KK77yJXG4gICAgICogQGRlc2MgY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44Gn44CB5q2j5Zue6LuiXG4gICAgICovXG4gICAgY21kUnVuRm9yd2FyZCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ydW5Gb3J3YXJkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDpgIblm57ou6LjgZnjgovvvIjmmYLoqIjlm57jgorvvIlcbiAgICAgKiBAZGVzYyBjbWRTcGVlZCDjgafkv53lrZjjgZXjgozjgZ/pgJ/luqbjgafjgIHpgIblm57ou6JcbiAgICAgKi9cbiAgICBjbWRSdW5SZXZlcnNlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJ1blJldmVyc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOe1tuWvvuS9jee9ruOBq+enu+WLleOBmeOCi1xuICAgICAqIEBkZXNjIOmAn+OBleOBryBjbWRTcGVlZCDjgafkv53lrZjjgZXjgozjgZ/pgJ/luqbjgYzmjqHnlKjjgZXjgozjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb24gZmxvYXQg6KeS5bqm77yacmFkaWFuc1xuICAgICAqL1xuICAgIGNtZE1vdmVUb1Bvc2l0aW9uKHBvc2l0aW9uKXtcbiAgICAgICAgaWYocG9zaXRpb249PT0gdW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChwb3NpdGlvbiwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlVG9Qb3NpdGlvbixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOebuOWvvuS9jee9ruOBq+enu+WLleOBmeOCi1xuICAgICAqIEBkZXNjIOmAn+OBleOBryBjbWRTcGVlZCDjgafkv53lrZjjgZXjgozjgZ/pgJ/luqbjgYzmjqHnlKjjgZXjgozjgotcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGRpc3RhbmNlIGZsb2F0IOinkuW6pu+8mnJhZGlhbnNb5bemOityYWRpYW5zIOWPszotcmFkaWFuc11cbiAgICAgKi9cbiAgICBjbWRNb3ZlQnlEaXN0YW5jZShkaXN0YW5jZSA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChkaXN0YW5jZSwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlQnlEaXN0YW5jZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruWKseejgeOCkuWBnOatouOBmeOCi++8iOaEn+inpuOBr+aui+OCiuOBvuOBme+8iVxuICAgICAqIEBkZXNjIOWujOWFqOODleODquODvOeKtuaFi+OCkuWGjeePvuOBmeOCi+WgtOWQiOOBr+OAgSBjbWRGcmVlKCkuY21kRGlzYWJsZSgpIOOBqOOBl+OBpuS4i+OBleOBhOOAglxuICAgICAqL1xuICAgIGNtZEZyZWUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuZnJlZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844KS6YCf5bqm44K844Ot44G+44Gn5rib6YCf44GX5YGc5q2i44GZ44KLXG4gICAgICogQGRlc2MgcnBtID0gMCDjgajjgarjgovjgIJcbiAgICAgKi9cbiAgICBjbWRTdG9wKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3ApO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OI44Or44Kv5Yi25b6h44KS6KGM44GGXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvcnF1ZSBmbG9hdCDjg4jjg6vjgq8g5Y2Y5L2N77yaTuODu20gWy1YIH4gKyBYIE5tXSDmjqjlpajlgKQgMC4zLTAuMDVcbiAgICAgKiBAZGVzYyDpgJ/luqbjgoTkvY3nva7jgpLlkIzmmYLjgavliLblvqHjgZnjgovloLTlkIjjga/jgIHjg6Ljg7zjgr/jg7zoqK3lrprjga4gMHgwRTogbWF4VG9ycXVlIOOBqCAweDYwOiBydW5Gb3J3YXJkIOetieOCkuS9teeUqOOBl+OBpuS4i+OBleOBhOOAglxuICAgICAqXG4gICAgICovXG4gICAgY21kSG9sZFRvcnF1ZSh0b3JxdWUpe1xuICAgICAgICBpZih0b3JxdWU9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KHRvcnF1ZSwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ob2xkVG9ycXVlLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6KiY5oa244GX44Gf44K/44K544Kv77yI5ZG95Luk77yJ44Gu44K744OD44OI44KS5a6f6KGM44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjgr/jgrnjgq/jgrvjg4Pjg4jnlarlj7fvvIgw772eNjU1MzXvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVwZWF0aW5nIGludCDnubDjgorov5TjgZflm57mlbAgMOOBr+eEoeWItumZkFxuICAgICAqXG4gICAgICogQGRlc2MgS00tMSDjga8gaW5kZXg6IDB+NDkg44G+44Gn44CC77yINTDlgIvjga7jg6Hjg6Ljg6rjg5Djg7Pjgq8g5ZCEODEyOCBCeXRlIOOBvuOBp+WItumZkOOBguOCiu+8iTxicj5cbiAgICAgKiDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLjga/jgIHjgrPjg57jg7Pjg4nvvIjjgr/jgrnjgq/jgrvjg4Pjg4jvvInjgpLlj4LnhafkuIvjgZXjgYTjgIIgaHR0cHM6Ly9kb2N1bWVudC5rZWlnYW4tbW90b3IuY29tL21vdG9yLWNvbnRyb2wtY29tbWFuZC90YXNrc2V0Lmh0bWxcbiAgICAgKi9cbiAgICBjbWREb1Rhc2tzZXQoaW5kZXggPSAwLHJlcGVhdGluZyA9IDEpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDYpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDIsTWF0aC5hYnMocGFyc2VJbnQocmVwZWF0aW5nLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5kb1Rhc2tzZXQsYnVmZmVyKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K344On44Oz5YaN55Sf44Gu6ZaL5aeL5Zyw54K544Gr56e75YuV44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjg6Ljg7zjgrfjg6fjg7Pnlarlj7fvvIgw772eNjU1MzXvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVwZWF0aW5nIGludCDnubDjgorov5TjgZflm57mlbAgMOOBr+eEoeWItumZkFxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRQcmVwYXJlUGxheWJhY2tNb3Rpb25fU1RBUlRfUE9TSVRJT059IHN0YXJ0X3Bvc2l0aW9uIGludCDjgrnjgr/jg7zjg4jkvY3nva7jga7oqK3lrpo8YnI+XG4gICAgICogU1RBUlRfUE9TSVRJT05fQUJTOuiomOaGtuOBleOCjOOBn+mWi+Wni+S9jee9ru+8iOe1tuWvvuW6p+aome+8ieOBi+OCieOCueOCv+ODvOODiDxicj5cbiAgICAgKiBTVEFSVF9QT1NJVElPTl9DVVJSRU5UOuePvuWcqOOBruS9jee9ruOCkumWi+Wni+S9jee9ruOBqOOBl+OBpuOCueOCv+ODvOODiFxuICAgICAqXG4gICAgICpcbiAgICAgKiBAZGVzYyBLTS0xIOOBryBpbmRleDogMH45IOOBvuOBp+OAgu+8iDEw5YCL44Gu44Oh44Oi44Oq44OQ44Oz44Kv44CC77yJ44Gd44KM44Ge44KMIOe0hDLliIboqJjpjLLlj6/og73jgII8YnI+XG4gICAgICog44OG44Kj44O844OB44Oz44Kw77yI5YuV5L2c44Gu6KiY6Yyy77yJ44Gv44CB44Kz44Oe44Oz44OJ77yI44OG44Kj44O844OB44Oz44Kw77yJ44KS5Y+C54Wn5LiL44GV44GE44CCPGJyPmh0dHBzOi8vZG9jdW1lbnQua2VpZ2FuLW1vdG9yLmNvbS9tb3Rvci1jb250cm9sLWNvbW1hbmQvdGVhY2hpbmcuaHRtbDxicj5cbiAgICAgKlxuICAgICAqIEB0b2RvIHJlcGVhdGluZywgb3B0aW9uIOOBq+OBpOOBhOOBpuOBr+ODleOCoeODvOODoOOCpuOCp+OCouacquWun+ijhSAyMDE3LjEwLjEwPGJyPlxuICAgICAqICDlho3nlJ/lm57mlbDjga/vvJHlm57lm7rlrprjgafjgYLjgorjgIHmnKzjgrPjg57jg7Pjg4njgpLlrp/ooYzjgZnjgovjgajjgIHoqJjpjLLjgZfjgZ/ntbblr77kvY3nva7jga7mnIDliJ3jga7jg53jgqTjg7Pjg4jjgavnp7vli5XjgZnjgotcbiAgICAgKi9cbiAgICBjbWRQcmVwYXJlUGxheWJhY2tNb3Rpb24oaW5kZXggPSAwLHJlcGVhdGluZyA9IDAsc3RhcnRfcG9zaXRpb24gPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig3KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQzMigyLE1hdGguYWJzKHBhcnNlSW50KHJlcGVhdGluZywxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoNixNYXRoLmFicyhwYXJzZUludChzdGFydF9wb3NpdGlvbiwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQucHJlcGFyZVBsYXliYWNrTW90aW9uLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K344On44Oz44KS5YaN55Sf44GZ44KLXG4gICAgICovXG4gICAgY21kU3RhcnRQbGF5YmFjaygpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdGFydFBsYXliYWNrKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/jgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRTdG9wUGxheWJhY2soKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcFBsYXliYWNrKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo644Kt44Ol44O85pON5L2cXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCreODpeODvOOCkuS4gOaZguWBnOatouOBmeOCi1xuICAgICAqL1xuICAgIGNtZFBhdXNlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnBhdXNlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgq3jg6Xjg7zjgpLlho3plovjgZnjgovvvIjok4TnqY3jgZXjgozjgZ/jgr/jgrnjgq/jgpLlho3plovvvIlcbiAgICAgKi9cbiAgICBjbWRSZXN1bWUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzdW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgq3jg6Xjg7zjgpLmjIflrprmmYLplpPlgZzmraLjgZflho3plovjgZnjgotcbiAgICAgKiBAZGVzYyBjbWRQYXVzZe+8iOOCreODpeODvOWBnOatou+8ieOCkuWun+ihjOOBl+OAgeaMh+WumuaZgumWk++8iOODn+ODquenku+8iee1jOmBjuW+jOOAgeiHquWLleeahOOBqyBjbWRSZXN1bWXvvIjjgq3jg6Xjg7zlho3plovvvIkg44KS6KGM44GE44G+44GZ44CCXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWUg5YGc5q2i5pmC6ZaTW21zZWNdXG4gICAgICovXG4gICAgY21kV2FpdCh0aW1lID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQzMigwLE1hdGguYWJzKHBhcnNlSW50KHRpbWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELndhaXQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgq3jg6Xjg7zjgpLjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICAgKi9cbiAgICBjbWRSZXNldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZXNldCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIHNlY3Rpb246OuOCv+OCueOCr+OCu+ODg+ODiFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCv+OCueOCr++8iOWRveS7pO+8ieOBruOCu+ODg+ODiOOBruiomOmMsuOCkumWi+Wni+OBmeOCi1xuICAgICAqIEBkZXNjIOiomOaGtuOBmeOCi+OCpOODs+ODh+ODg+OCr+OCueOBruODoeODouODquOBr+OCs+ODnuODs+ODie+8mmVyYXNlVGFza3NldCDjgavjgojjgorkuojjgoHmtojljrvjgZXjgozjgabjgYTjgovlv4XopoHjgYzjgYLjgopcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuSBLTS0xIOOBruWgtOWQiOOAgeOCpOODs+ODh+ODg+OCr+OCueOBruWApOOBryAw772eNDkg77yI6KiINTDlgIvoqJjpjLLvvIlcbiAgICAgKi9cbiAgICBjbWRTdGFydFJlY29yZGluZ1Rhc2tTZXQoaW5kZXggPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0YXJ0UmVjb3JkaW5nVGFza3NldCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuOCkuWBnOatouOBmeOCi1xuICAgICAqIEBkZXNjIHN0YXJ0UmVjb3JkaW5nVGFza3NldCDlrp/mlr3kuK3jga7jgb/mnInlirlcbiAgICAgKi9cbiAgICBjbWRTdG9wUmVjb3JkaW5nVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdG9wUmVjb3JkaW5nVGFza3NldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5oyH5a6a44Gu44Kk44Oz44OH44OD44Kv44K544Gu44K/44K544Kv44K744OD44OI44KS5raI5Y6744GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjgqTjg7Pjg4fjg4Pjgq/jgrlcbiAgICAgKi9cbiAgICBjbWRFcmFzZVRhc2tzZXQoaW5kZXggPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlVGFza3NldCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBruOCv+OCueOCr+OCu+ODg+ODiOOCkua2iOWOu+OBmeOCi1xuICAgICAqL1xuICAgIGNtZEVyYXNlQWxsVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZUFsbFRhc2tzZXRzKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo644OG44Kj44O844OB44Oz44KwXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIFxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCpOODs+ODh+ODg+OCr+OCueOBqOiomOmMsuaZgumWk1ttc2VjXeOCkuaMh+WumuOBl+OAgeODhuOCo+ODvOODgeODs+OCsOOBrumWi+Wni+a6luWCmeOCkuihjOOBhuOAglxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBpbnQg44Kk44Oz44OH44OD44Kv44K5XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWUgaW50IOiomOmMsuaZgumWkyBbbXNlYyAwLTY1NDA4XVxuICAgICAqXG4gICAgICogQGRlc2MgS00tMSDjga7loLTlkIjjgIHjgqTjg7Pjg4fjg4Pjgq/jgrnjga7lgKTjga8gMO+9njkg77yI6KiIMTDlgIvoqJjpjLLvvInjgajjgarjgovjgILoqJjpjLLmmYLplpPjga8gNjU0MDggW21zZWNdIOOCkui2heOBiOOCi+OBk+OBqOOBr+OBp+OBjeOBquOBhFxuICAgICAqICAgICAgIOiomOaGtuOBmeOCi+OCpOODs+ODh+ODg+OCr+OCueOBruODoeODouODquOBr2JsZUVyYXNlTW90aW9uIOOBq+OCiOOCiuS6iOOCgea2iOWOu+OBleOCjOOBpuOBhOOCi+W/heimgeOBjOOBguOCi1xuICAgICAqXG4gICAgICovXG4gICAgY21kUHJlcGFyZVRlYWNoaW5nTW90aW9uKGluZGV4ID0gMCxsZW5ndGhSZWNvcmRpbmdUaW1lID0gMzAwMDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDYpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDIsTWF0aC5hYnMocGFyc2VJbnQobGVuZ3RoUmVjb3JkaW5nVGltZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQucHJlcGFyZVRlYWNoaW5nTW90aW9uLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg55u05YmN44Gr6KGM44Gj44GfIHByZXBhcmVUZWFjaGluZ01vdGlvbiDjga7mnaHku7bjgafjg4bjgqPjg7zjg4Hjg7PjgrDjgpLplovlp4vjgZnjgovjgIJcbiAgICAgKiBibGVQcmVwYXJlVGVhY2hpbmdNb3Rpb24g44KS5a6f6KGM44GX44Gf55u05b6M44Gu44G/5pyJ5Yq544CCXG4gICAgICovXG4gICAgY21kU3RhcnRUZWFjaGluZ01vdGlvbigpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdGFydFRlYWNoaW5nTW90aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDlrp/ooYzkuK3jga7jg4bjgqPjg7zjg4Hjg7PjgrDjgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRTdG9wVGVhY2hpbmdNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcFRlYWNoaW5nTW90aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjgZfjgZ/jgqTjg7Pjg4fjg4Pjgq/jgrnjga7jg6Ljg7zjgrfjg6fjg7PjgpLmtojljrvjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAqXG4gICAgICogQGRlc2MgS00tMSDjga7loLTlkIjjgIHjgqTjg7Pjg4fjg4Pjgq/jgrnjga7lgKTjga8gMO+9njkg77yI6KiIMTDlgIvoqJjpjLLvvInjgajjgarjgotcbiAgICAgKlxuICAgICAqL1xuICAgIGNtZEVyYXNlTW90aW9uKGluZGV4ID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfQ09OVFJPTCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZU1vdGlvbixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBruODouODvOOCt+ODp+ODs+OCkua2iOWOu+OBmeOCi1xuICAgICAqL1xuICAgIGNtZEVyYXNlQWxsTW90aW9uKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlQWxsTW90aW9uKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo6TEVEXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IExFROOBrueCueeBr+eKtuaFi+OCkuOCu+ODg+ODiOOBmeOCi1xuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRMZWRfTEVEX1NUQVRFfSBjbWRMZWRfTEVEX1NUQVRFIGludCDngrnnga/nirbmhYs8YnI+XG4gICAgICogICBMRURfU1RBVEVfT0ZGOkxFROa2iOeBrzxicj5cbiAgICAgKiAgIExFRF9TVEFURV9PTl9TT0xJRDpMRUTngrnnga88YnI+XG4gICAgICogICBMRURfU1RBVEVfT05fRkxBU0g6TEVE54K55ruF77yI5LiA5a6a6ZaT6ZqU44Gn54K55ruF77yJPGJyPlxuICAgICAqICAgTEVEX1NUQVRFX09OX0RJTTpMRUTjgYzjgobjgaPjgY/jgormmI7mu4XjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVkIGludCAwLTI1NVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBncmVlbiBpbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmx1ZSBpbnQgMC0yNTVcbiAgICAgKi9cbiAgICBjbWRMZWQoY21kTGVkX0xFRF9TVEFURSxyZWQsZ3JlZW4sYmx1ZSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsTWF0aC5hYnMocGFyc2VJbnQoY21kTGVkX0xFRF9TVEFURSwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMSxNYXRoLmFicyhwYXJzZUludChyZWQsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDIsTWF0aC5hYnMocGFyc2VJbnQoZ3JlZW4sMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDMsTWF0aC5hYnMocGFyc2VJbnQoYmx1ZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQubGVkLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIElNVSDjgrjjg6PjgqTjg61cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSU1VKOOCuOODo+OCpOODrSnjga7lgKTlj5blvpco6YCa55+lKeOCkumWi+Wni+OBmeOCiyAoQkxF5bCC55So44Kz44Oe44Oz44OJKVxuICAgICAqXG4gICAgICogQGRlc2Mg5pys44Kz44Oe44Oz44OJ44KS5a6f6KGM44GZ44KL44Go44CBSU1V44Gu44OH44O844K/44GvQkxF44Gu44Kt44Oj44Op44Kv44K/44Oq44K544OG44Kj44Kv44K5TU9UT1JfSU1VX01FQVNVUkVNRU5U44Gr6YCa55+l44GV44KM44KLPGJyPlxuICAgICAqIE1PVE9SX0lNVV9NRUFTVVJFTUVOVOOBrm5vdGlmeeOBr+OCpOODmeODs+ODiOOCv+OCpOODlyBLTU1vdG9yQ29tbWFuZEtNT25lLkVWRU5UX1RZUEUuaW11TWVhc3VyZW1lbnQg44Gr6YCa55+lXG4gICAgICovXG4gICAgY21kRW5hYmxlSU1VKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVuYWJsZUlNVSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSU1VKOOCuOODo+OCpOODrSnjga7lgKTlj5blvpco6YCa55+lKeOCkuWBnOatouOBmeOCi1xuICAgICAqL1xuICAgIGNtZERpc2FibGVJTVUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQuZGlzYWJsZUlNVSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIOOCt+OCueODhuODoFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgrfjgrnjg4bjg6DjgpLlho3otbfli5XjgZnjgotcbiAgICAgKiBAZGVzYyBCTEXjgavmjqXntprjgZfjgabjgYTjgZ/loLTlkIjjgIHliIfmlq3jgZfjgabjgYvjgonlho3otbfli5VcbiAgICAgKi9cbiAgICBjbWRSZWJvb3QoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX0NPTlRST0wnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVib290KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg5XjgqHjg7zjg6DjgqbjgqfjgqLjgqLjg4Pjg5fjg4fjg7zjg4jjg6Ljg7zjg4njgavlhaXjgotcbiAgICAgKiBAZGVzYyDjg5XjgqHjg7zjg6DjgqbjgqfjgqLjgpLjgqLjg4Pjg5fjg4fjg7zjg4jjgZnjgovjgZ/jgoHjga7jg5bjg7zjg4jjg63jg7zjg4Djg7zjg6Ljg7zjg4njgavlhaXjgovjgILvvIjjgrfjgrnjg4bjg6Djga/lho3otbfli5XjgZXjgozjgovjgILvvIlcbiAgICAgKi9cbiAgICBjbWRFbnRlckRldmljZUZpcm13YXJlVXBkYXRlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9DT05UUk9MJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVudGVyRGV2aWNlRmlybXdhcmVVcGRhdGUpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyDjg6Ljg7zjgr/jg7zoqK3lrprjgIBNT1RPUl9TRVRUSU5HXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruacgOWkp+mAn+OBleOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhTcGVlZCBmbG9hdCDmnIDlpKfpgJ/jgZUgW3JhZGlhbiAvIHNlY29uZF3vvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRNYXhTcGVlZChtYXhTcGVlZCl7XG4gICAgICAgIGlmKG1heFNwZWVkPT09dW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChtYXhTcGVlZCwxMCkpKTsvL3RvZG86Ok5hTuOBjOi/lOOCi+WPr+iDveaApyBwYXJzZUZsb2F0KFwiYWFhXCIsMTApPT09TmFOXG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1heFNwZWVkLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5pyA5bCP6YCf44GV44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heFNwZWVkIGZsb2F0IOacgOWwj+mAn+OBlSBbcmFkaWFuIC8gc2Vjb25kXe+8iOato+OBruWApO+8iVxuICAgICAqIEBkZXNjIG1pblNwZWVkIOOBr+OAgWJsZVByZXBhcmVQbGF5YmFja01vdGlvbiDlrp/ooYzjga7pmpvjgIHplovlp4vlnLDngrnjgavnp7vli5XjgZnjgovpgJ/jgZXjgajjgZfjgabkvb/nlKjjgZXjgozjgovjgILpgJrluLjmmYLpgYvou6Ljgafjga/kvb/nlKjjgZXjgozjgarjgYTjgIJcbiAgICAgKi9cbiAgICBjbWRNaW5TcGVlZChtaW5TcGVlZCl7XG4gICAgICAgIGlmKG1pblNwZWVkPT09dW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChtaW5TcGVlZCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQubWluU3BlZWQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDliqDmuJvpgJ/mm7Lnt5rjgpLmjIflrprjgZnjgovvvIjjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6vjga7oqK3lrprvvIlcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuY21kQ3VydmVUeXBlX0NVUlZFX1RZUEV9IGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFIGludCDliqDmuJvpgJ/jgqvjg7zjg5bjgqrjg5fjgrfjg6fjg7M8YnI+XG4gICAgICogICAgICBDVVJWRV9UWVBFX05PTkU6MCDjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT0ZGPGJyPlxuICAgICAqICAgICAgQ1VSVkVfVFlQRV9UUkFQRVpPSUQ6MSDjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT04g77yI5Y+w5b2i5Yqg5rib6YCf77yJXG4gICAgICovXG4gICAgY21kQ3VydmVUeXBlKGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsTWF0aC5hYnMocGFyc2VJbnQoY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELmN1cnZlVHlwZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruWKoOmAn+W6puOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY2MgZmxvYXQg5Yqg6YCf5bqmIDAtMjAwIFtyYWRpYW4gLyBzZWNvbmReMl3vvIjmraPjga7lgKTvvIlcbiAgICAgKiBAZGVzYyBhY2Mg44Gv44CB44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9OIOOBruWgtOWQiOOAgeWKoOmAn+aZguOBq+S9v+eUqOOBleOCjOOBvuOBmeOAgu+8iOWKoOmAn+aZguOBruebtOe3muOBruWCvuOBje+8iVxuICAgICAqL1xuICAgIGNtZEFjYyhhY2MgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoYWNjLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5hY2MsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7muJvpgJ/luqbjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVjIGZsb2F0IOa4m+mAn+W6piAwLTIwMCBbcmFkaWFuIC8gc2Vjb25kXjJd77yI5q2j44Gu5YCk77yJXG4gICAgICogQGRlc2MgZGVjIOOBr+OAgeODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPTiDjga7loLTlkIjjgIHmuJvpgJ/mmYLjgavkvb/nlKjjgZXjgozjgb7jgZnjgILvvIjmuJvpgJ/mmYLjga7nm7Tnt5rjga7lgr7jgY3vvIlcbiAgICAgKi9cbiAgICBjbWREZWMoZGVjID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KGRlYywxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuZGVjLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5pyA5aSn44OI44Or44Kv77yI57W25a++5YCk77yJ44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heFRvcnF1ZSBmbG9hdCDmnIDlpKfjg4jjg6vjgq8gW04qbV3vvIjmraPjga7lgKTvvIlcbiAgICAgKlxuICAgICAqIEBkZXNjIG1heFRvcnF1ZSDjgpLoqK3lrprjgZnjgovjgZPjgajjgavjgojjgorjgIHjg4jjg6vjgq/jga7ntbblr77lgKTjgYwgbWF4VG9ycXVlIOOCkui2heOBiOOBquOBhOOCiOOBhuOBq+mBi+i7ouOBl+OBvuOBmeOAgjxicj5cbiAgICAgKiBtYXhUb3JxdWUgPSAwLjEgW04qbV0g44Gu5b6M44GrIHJ1bkZvcndhcmQg77yI5q2j5Zue6Lui77yJ44KS6KGM44Gj44Gf5aC05ZCI44CBMC4xIE4qbSDjgpLotoXjgYjjgarjgYTjgojjgYbjgavjgZ3jga7pgJ/luqbjgpLjgarjgovjgaDjgZHntq3mjIHjgZnjgovjgII8YnI+XG4gICAgICog44Gf44Gg44GX44CB44OI44Or44Kv44Gu5pyA5aSn5YCk5Yi26ZmQ44Gr44KI44KK44CB44K344K544OG44Og44Gr44KI44Gj44Gm44Gv5Yi25b6h5oCn77yI5oyv5YuV77yJ44GM5oKq5YyW44GZ44KL5Y+v6IO95oCn44GM44GC44KL44CCXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRNYXhUb3JxdWUobWF4VG9ycXVlKXtcbiAgICAgICAgaWYobWF4VG9ycXVlPT09dW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChtYXhUb3JxdWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1heFRvcnF1ZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5Q77yI5q+U5L6L77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHFDdXJyZW50UCBmbG9hdCBx6Zu75rWBUOOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFFDdXJyZW50UChxQ3VycmVudFApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChxQ3VycmVudFAsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELnFDdXJyZW50UCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5Q77yI5q+U5L6L77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHFDdXJyZW50SSBmbG9hdCBx6Zu75rWBSeOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFFDdXJyZW50SShxQ3VycmVudEkpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChxQ3VycmVudEksMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELnFDdXJyZW50SSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5E77yI5b6u5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHFDdXJyZW50RCBmbG9hdCBx6Zu75rWBROOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFFDdXJyZW50RChxQ3VycmVudEQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChxQ3VycmVudEQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELnFDdXJyZW50RCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5E77yI5b6u5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkUCBmbG9hdCDpgJ/luqZQ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kU3BlZWRQKHNwZWVkUCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkUCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWRQLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu6YCf5bqmUElE44Kz44Oz44OI44Ot44O844Op44GuSe+8iOepjeWIhu+8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZEkgZmxvYXQg6YCf5bqmSeOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFNwZWVkSShzcGVlZEkpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChzcGVlZEksMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNwZWVkSSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrumAn+W6plBJROOCs+ODs+ODiOODreODvOODqeOBrkTvvIjlvq7liIbvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWREIGZsb2F0IOmAn+W6pkTjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRTcGVlZEQoc3BlZWREKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWRELDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfU0VUVElORycsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZEQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7kvY3nva5QSUTjgrPjg7Pjg4jjg63jg7zjg6njga5Q77yI5q+U5L6L77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uUCBmbG9hdCDkvY3nva5Q44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUG9zaXRpb25QKHBvc2l0aW9uUCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHBvc2l0aW9uUCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucG9zaXRpb25QLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44GuUElE44OR44Op44Oh44O844K/44KS44Oq44K744OD44OI44GX44Gm44OV44Kh44O844Og44Km44Kn44Ki44Gu5Yid5pyf6Kit5a6a44Gr5oi744GZXG4gICAgICogQGRlc2MgcUN1cnJlbnRQLCBxQ3VycmVudEksICBxQ3VycmVudEQsIHNwZWVkUCwgc3BlZWRJLCBzcGVlZEQsIHBvc2l0aW9uUCDjgpLjg6rjgrvjg4Pjg4jjgZfjgb7jgZlcbiAgICAgKlxuICAgICAqL1xuICAgIGNtZFJlc2V0UElEKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0UElEKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7otbfli5XmmYLlm7rmnIlMRUTjgqvjg6njg7zjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVkIGludCAwLTI1NVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBncmVlbiBpbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmx1ZSBpbnQgMC0yNTVcbiAgICAgKlxuICAgICAqIEBkZXNjIG93bkNvbG9yIOOBr+OCouOCpOODieODq+aZguOBruWbuuaciUxFROOCq+ODqeODvOOAgjxicj5zYXZlQWxsU2V0dGluZ3PjgpLlrp/ooYzjgZfjgIHlho3otbfli5XlvozjgavliJ3jgoHjgablj43mmKDjgZXjgozjgovjgII8YnI+XG4gICAgICog44GT44Gu6Kit5a6a5YCk44KS5aSJ5pu044GX44Gf5aC05ZCI44CBQkxF44GuIERldmljZSBOYW1lIOOBruS4izPmoYHjgYzlpInmm7TjgZXjgozjgovjgIJcbiAgICAgKi9cbiAgICBjbWRPd25Db2xvcihyZWQsZ3JlZW4sYmx1ZSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMyk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsTWF0aC5hYnMocGFyc2VJbnQocmVkLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgxLE1hdGguYWJzKHBhcnNlSW50KGdyZWVuLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgyLE1hdGguYWJzKHBhcnNlSW50KGJsdWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELm93bkNvbG9yLGJ1ZmZlcik7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjgZfjgZ/oqK3lrprlgKTjgpLlj5blvpcgKEJMReWwgueUqOOCs+ODnuODs+ODiSlcbiAgICAgKiBAcGFyYW0ge251bWJlciB8IGFycmF5fSByZWdpc3RlcnMgPGludCB8IFtdPiDlj5blvpfjgZnjgovjg5fjg63jg5Hjg4bjgqPjga7jgrPjg57jg7Pjg4ko44Os44K444K544K/55Wq5Y+3KeWApFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlLjxpbnQgfCBhcnJheT59IOWPluW+l+OBl+OBn+WApCA8YnI+cmVnaXN0ZXJz44GMaW50PeODrOOCuOOCueOCv+WApOOBruODl+ODquODn+ODhuOCo+ODluWApCA8YnI+cmVnaXN0ZXJz44GMQXJyYXk944Os44K444K544K/5YCk44Gu44Kq44OW44K444Kn44Kv44OIXG4gICAgICpcbiAgICAgKiBAbm9uZSDlj5blvpfjgZnjgovlgKTjga/jgrPjg57jg7Pjg4nlrp/ooYzlvozjgatCTEXjga7jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrlNT1RPUl9TRVRUSU5H44Gr6YCa55+l44GV44KM44KL44CCPGJyPlxuICAgICAqICAgICAgIOOBneOCjOOCkuaLvuOBo+OBpnByb21pc2Xjgqrjg5bjgrjjgqfjgq/jg4jjga7jga5yZXNvbHZl44Gr6L+U44GX44Gm5Yem55CG44KS57mL44GQPGJyPlxuICAgICAqICAgICAgIE1PVE9SX1NFVFRJTkfjga5ub3RpZnnjga9fb25CbGVNb3RvclNldHRpbmfjgaflj5blvpdcbiAgICAgKi9cblxuICAgIGNtZFJlYWRSZWdpc3RlcihyZWdpc3RlcnMpe1xuICAgICAgICBpZihyZWdpc3RlcnMgaW5zdGFuY2VvZiBBcnJheSl7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGFsbHJlc29sdmUsIGFsbHJlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgdmFyIHByb21pc2VMaXN0PVtdO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8cmVnaXN0ZXJzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVnaXN0ZXI9cmVnaXN0ZXJzW2ldO1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlTGlzdC5wdXNoKCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjY3A9bmV3IF9LTU5vdGlmeVByb21pcyhyZWdpc3Rlcix0aGlzLl9SRVZfTU9UT1JfQ09NTUFORFtyZWdpc3Rlcl0sdGhpcy5fbm90aWZ5UHJvbWlzTGlzdCxyZXNvbHZlLHJlamVjdCwxMDAwKTsvL25vdGlmeee1jOeUseOBrnJlc3VsdOOCklByb21pc+OBqOe0kOS7mOOBkVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsIHBhcnNlSW50KHJlZ2lzdGVyLCAxMCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZFJlZ2lzdGVyLCBidWZmZXIsY2NwKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlTGlzdCkudGhlbigocmVzYXIpPT57XG4gICAgICAgICAgICAgICAgICAgIGxldCB0PVt7fV0uY29uY2F0KHJlc2FyKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJ0b2JqPU9iamVjdC5hc3NpZ24uYXBwbHkobnVsbCx0KTtcbiAgICAgICAgICAgICAgICAgICAgYWxscmVzb2x2ZShydG9iaik7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKG1zZyk9PntcbiAgICAgICAgICAgICAgICAgICAgYWxscmVqZWN0KG1zZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGxhc3RyZXNvbHZlLCBsYXN0cmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVnaXN0ZXI9cmVnaXN0ZXJzO1xuICAgICAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2NwPW5ldyBfS01Ob3RpZnlQcm9taXMocmVnaXN0ZXIsdGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbcmVnaXN0ZXJdLHRoaXMuX25vdGlmeVByb21pc0xpc3QscmVzb2x2ZSxyZWplY3QsMTAwMCk7Ly9ub3RpZnnntYznlLHjga5yZXN1bHTjgpJQcm9taXPjgajntJDku5jjgZFcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCwgcGFyc2VJbnQocmVnaXN0ZXIsIDEwKSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWRSZWdpc3RlciwgYnVmZmVyLGNjcCk7XG4gICAgICAgICAgICAgICAgfSkudGhlbigocmVzKT0+e1xuICAgICAgICAgICAgICAgICAgICBsYXN0cmVzb2x2ZShyZXNbT2JqZWN0LmtleXMocmVzKVswXV0pO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChtc2cpPT57XG4gICAgICAgICAgICAgICAgICAgIGxhc3RyZWplY3QobXNnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Gu5YWo44Gm44Gu44Os44K444K544K/5YCk44Gu5Y+W5b6XXG4gICAgICogQHJldHVybnMge1Byb21pc2UuPGFycmF5Pn1cbiAgICAgKi9cbiAgICBjbWRSZWFkQWxsUmVnaXN0ZXIoKXtcbiAgICAgICBsZXQgY209IHRoaXMuY29uc3RydWN0b3IuY21kUmVhZFJlZ2lzdGVyX0NPTU1BTkQ7XG4gICAgICAgIGxldCBhbGxjbWRzPVtdO1xuICAgICAgICBPYmplY3Qua2V5cyhjbSkuZm9yRWFjaCgoayk9PnthbGxjbWRzLnB1c2goY21ba10pO30pO1xuXG4gICAgICAgcmV0dXJuIHRoaXMuY21kUmVhZFJlZ2lzdGVyKGFsbGNtZHMpO1xuICAgIH1cbiAgICAvLy8vLy/kv53lrZhcbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDlhajjgabjga7oqK3lrprlgKTjgpLjg5Xjg6njg4Pjgrfjg6Xjg6Hjg6Ljg6rjgavkv53lrZjjgZnjgotcbiAgICAgKiBAZGVzYyDmnKzjgrPjg57jg7Pjg4njgpLlrp/ooYzjgZfjgarjgYTpmZDjgorjgIHoqK3lrprlgKTjga/jg6Ljg7zjgr/jg7zjgavmsLjkuYXnmoTjgavkv53lrZjjgZXjgozjgarjgYQo5YaN6LW35YuV44Gn5raI44GI44KLKVxuICAgICAqL1xuICAgIGNtZFNhdmVBbGxSZWdpc3RlcnMoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQuc2F2ZUFsbFJlZ2lzdGVycyk7XG4gICAgfVxuXG4gICAgLy8vLy8v44Oq44K744OD44OIXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5oyH5a6a44GX44Gf44Os44K444K544K/44KS44OV44Kh44O844Og44Km44Kn44Ki44Gu5Yid5pyf5YCk44Gr44Oq44K744OD44OI44GZ44KLXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLmNtZFJlYWRSZWdpc3Rlcl9DT01NQU5EfSByZWdpc3RlciDliJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgovjgrPjg57jg7Pjg4ko44Os44K444K544K/KeWApFxuICAgICAqL1xuICAgIGNtZFJlc2V0UmVnaXN0ZXIocmVnaXN0ZXIpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KHJlZ2lzdGVyLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9TRVRUSU5HJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0UmVnaXN0ZXIsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu44Os44K444K544K/44KS44OV44Kh44O844Og44Km44Kn44Ki44Gu5Yid5pyf5YCk44Gr44Oq44K744OD44OI44GZ44KLXG4gICAgICogQGRlc2MgYmxlU2F2ZUFsbFJlZ2lzdGVyc+OCkuWun+ihjOOBl+OBquOBhOmZkOOCiuOAgeODquOCu+ODg+ODiOWApOOBr+ODouODvOOCv+ODvOOBq+awuOS5heeahOOBq+S/neWtmOOBleOCjOOBquOBhCjlho3otbfli5XjgafmtojjgYjjgospXG4gICAgICovXG4gICAgY21kUmVzZXRBbGxSZWdpc3RlcnMoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1NFVFRJTkcnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzZXRBbGxSZWdpc3RlcnMpO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWGhemDqFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4vLy8vLy9jbGFzcy8vXG59XG5cblxuLyoqXG4gKiBTZW5kQmxlTm90aWZ5UHJvbWlzXG4gKiDjgIBjbWRSZWFkUmVnaXN0ZXLnrYnjga5CTEXlkbzjgbPlh7rjgZflvozjgatcbiAqIOOAgOOCs+ODnuODs+ODiee1kOaenOOBjG5vdGlmeeOBp+mAmuefpeOBleOCjOOCi+OCs+ODnuODs+ODieOCklByb21pc+OBqOe0kOS7mOOBkeOCi+eCuuOBruOCr+ODqeOCuVxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX0tNTm90aWZ5UHJvbWlze1xuICAgIC8v5oiQ5Yqf6YCa55+lXG4gICAgc3RhdGljIHNlbmRHcm91cE5vdGlmeVJlc29sdmUoZ3JvdXBBcnJheSx0YWdOYW1lLHZhbCl7XG4gICAgICAgIGlmKCFncm91cEFycmF5IGluc3RhbmNlb2YgQXJyYXkpe3JldHVybjt9XG4gICAgICAgIC8v6YCB5L+hSUTjga7pgJrnn6UgQ2FsbGJhY2tQcm9taXPjgaflkbzjgbPlh7rjgZflhYPjga7jg6Hjgr3jg4Pjg4njga5Qcm9taXPjgavov5TjgZlcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8Z3JvdXBBcnJheS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZiggZ3JvdXBBcnJheVtpXS50YWdOYW1lPT09dGFnTmFtZSApe1xuICAgICAgICAgICAgICAgIGdyb3VwQXJyYXlbaV0uY2FsbFJlc29sdmUodmFsKTtcbiAgICAgICAgICAgICAgICBncm91cEFycmF5LnNwbGljZShpLDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNvbnN0XG4gICAgICogQHBhcmFtIHRhZ05hbWVcbiAgICAgKiBAcGFyYW0gZ3JvdXBBcnJheVxuICAgICAqIEBwYXJhbSBwcm9taXNSZXNvbHZlT2JqXG4gICAgICogQHBhcmFtIHByb21pc1JlamVjdE9ialxuICAgICAqIEBwYXJhbSByZWplY3RUaW1lT3V0XG4gICAgICovXG4gICAgY29uc3RydWN0b3IodGFnTmFtZSx0YWdJbmZvPW51bGwsZ3JvdXBBcnJheT1bXSxwcm9taXNSZXNvbHZlT2JqLCBwcm9taXNSZWplY3RPYmoscmVqZWN0VGltZU91dCl7XG4gICAgICAgIHRoaXMudGltZW91dElkPTA7XG4gICAgICAgIHRoaXMudGFnTmFtZT10YWdOYW1lO1xuICAgICAgICB0aGlzLnRhZ0luZm89dGFnSW5mbztcbiAgICAgICAgdGhpcy5ncm91cEFycmF5PWdyb3VwQXJyYXkgaW5zdGFuY2VvZiBBcnJheT9ncm91cEFycmF5OltdO1xuICAgICAgICB0aGlzLmdyb3VwQXJyYXkucHVzaCh0aGlzKTtcbiAgICAgICAgdGhpcy5wcm9taXNSZXNvbHZlT2JqPXByb21pc1Jlc29sdmVPYmo7XG4gICAgICAgIHRoaXMucHJvbWlzUmVqZWN0T2JqPXByb21pc1JlamVjdE9iajtcbiAgICAgICAgdGhpcy5yZWplY3RUaW1lT3V0PXJlamVjdFRpbWVPdXQ7XG4gICAgfVxuICAgIC8v44Kr44Km44Oz44OI44Gu6ZaL5aeLIGNoYXJhY3RlcmlzdGljcy53cml0ZVZhbHVl5ZG844Gz5Ye644GX5b6M44Gr5a6f6KGMXG4gICAgc3RhcnRSZWplY3RUaW1lT3V0Q291bnQoKXtcbiAgICAgICAgdGhpcy50aW1lb3V0SWQ9c2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlR3JvdXAoKTtcbiAgICAgICAgICAgIHRoaXMucHJvbWlzUmVqZWN0T2JqKHttc2c6XCJ0aW1lb3V0OlwiLHRhZ05hbWU6dGhpcy50YWdOYW1lLHRhZ0luZm86dGhpcy50YWdJbmZvfSk7XG4gICAgICAgIH0sIHRoaXMucmVqZWN0VGltZU91dCk7XG4gICAgfVxuICAgIGNhbGxSZXNvbHZlKGFyZyl7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUdyb3VwKCk7XG4gICAgICAgIHRoaXMucHJvbWlzUmVzb2x2ZU9iaihhcmcpO1xuICAgIH1cbiAgICBjYWxsUmVqZWN0KG1zZyl7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUdyb3VwKCk7XG4gICAgICAgIHRoaXMucHJvbWlzUmVqZWN0T2JqKHttc2c6bXNnfSk7XG4gICAgfVxuXG4gICAgX3JlbW92ZUdyb3VwKCl7XG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMuZ3JvdXBBcnJheS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZiggdGhpcy5ncm91cEFycmF5PT09dGhpcyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cEFycmF5LnNwbGljZShpLDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID1LTU1vdG9yQ29tbWFuZEtNT25lO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvS01Nb3RvckNvbW1hbmRLTU9uZS5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICB0aGlzLl9ldmVudHMgPSB0aGlzLl9ldmVudHMgfHwge307XG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbkV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uKG4pIHtcbiAgaWYgKCFpc051bWJlcihuKSB8fCBuIDwgMCB8fCBpc05hTihuKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ24gbXVzdCBiZSBhIHBvc2l0aXZlIG51bWJlcicpO1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGVyLCBoYW5kbGVyLCBsZW4sIGFyZ3MsIGksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmICh0eXBlID09PSAnZXJyb3InKSB7XG4gICAgaWYgKCF0aGlzLl9ldmVudHMuZXJyb3IgfHxcbiAgICAgICAgKGlzT2JqZWN0KHRoaXMuX2V2ZW50cy5lcnJvcikgJiYgIXRoaXMuX2V2ZW50cy5lcnJvci5sZW5ndGgpKSB7XG4gICAgICBlciA9IGFyZ3VtZW50c1sxXTtcbiAgICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgICAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmNhdWdodCwgdW5zcGVjaWZpZWQgXCJlcnJvclwiIGV2ZW50LiAoJyArIGVyICsgJyknKTtcbiAgICAgICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICAgICAgdGhyb3cgZXJyO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGhhbmRsZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzVW5kZWZpbmVkKGhhbmRsZXIpKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAoaXNGdW5jdGlvbihoYW5kbGVyKSkge1xuICAgIHN3aXRjaCAoYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgLy8gZmFzdCBjYXNlc1xuICAgICAgY2FzZSAxOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcyk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAyOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDM6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0sIGFyZ3VtZW50c1syXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgLy8gc2xvd2VyXG4gICAgICBkZWZhdWx0OlxuICAgICAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICAgICAgaGFuZGxlci5hcHBseSh0aGlzLCBhcmdzKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaXNPYmplY3QoaGFuZGxlcikpIHtcbiAgICBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKTtcbiAgICBsaXN0ZW5lcnMgPSBoYW5kbGVyLnNsaWNlKCk7XG4gICAgbGVuID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICBsaXN0ZW5lcnNbaV0uYXBwbHkodGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICBpZiAodGhpcy5fZXZlbnRzLm5ld0xpc3RlbmVyKVxuICAgIHRoaXMuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICBpc0Z1bmN0aW9uKGxpc3RlbmVyLmxpc3RlbmVyKSA/XG4gICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICBlbHNlIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0ucHVzaChsaXN0ZW5lcik7XG4gIGVsc2VcbiAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBbdGhpcy5fZXZlbnRzW3R5cGVdLCBsaXN0ZW5lcl07XG5cbiAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkgJiYgIXRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQpIHtcbiAgICBpZiAoIWlzVW5kZWZpbmVkKHRoaXMuX21heExpc3RlbmVycykpIHtcbiAgICAgIG0gPSB0aGlzLl9tYXhMaXN0ZW5lcnM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgICB9XG5cbiAgICBpZiAobSAmJiBtID4gMCAmJiB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoID4gbSkge1xuICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCA9IHRydWU7XG4gICAgICBjb25zb2xlLmVycm9yKCcobm9kZSkgd2FybmluZzogcG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSAnICtcbiAgICAgICAgICAgICAgICAgICAgJ2xlYWsgZGV0ZWN0ZWQuICVkIGxpc3RlbmVycyBhZGRlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICdVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byBpbmNyZWFzZSBsaW1pdC4nLFxuICAgICAgICAgICAgICAgICAgICB0aGlzLl9ldmVudHNbdHlwZV0ubGVuZ3RoKTtcbiAgICAgIGlmICh0eXBlb2YgY29uc29sZS50cmFjZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAvLyBub3Qgc3VwcG9ydGVkIGluIElFIDEwXG4gICAgICAgIGNvbnNvbGUudHJhY2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgdmFyIGZpcmVkID0gZmFsc2U7XG5cbiAgZnVuY3Rpb24gZygpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGcpO1xuXG4gICAgaWYgKCFmaXJlZCkge1xuICAgICAgZmlyZWQgPSB0cnVlO1xuICAgICAgbGlzdGVuZXIuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gIH1cblxuICBnLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHRoaXMub24odHlwZSwgZyk7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vLyBlbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWZmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZFxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBsaXN0LCBwb3NpdGlvbiwgbGVuZ3RoLCBpO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIGxpc3QgPSB0aGlzLl9ldmVudHNbdHlwZV07XG4gIGxlbmd0aCA9IGxpc3QubGVuZ3RoO1xuICBwb3NpdGlvbiA9IC0xO1xuXG4gIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fFxuICAgICAgKGlzRnVuY3Rpb24obGlzdC5saXN0ZW5lcikgJiYgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcblxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGxpc3QpKSB7XG4gICAgZm9yIChpID0gbGVuZ3RoOyBpLS0gPiAwOykge1xuICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8XG4gICAgICAgICAgKGxpc3RbaV0ubGlzdGVuZXIgJiYgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpKSB7XG4gICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgICBsaXN0Lmxlbmd0aCA9IDA7XG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0LnNwbGljZShwb3NpdGlvbiwgMSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG4gIH1cblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIga2V5LCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICBpZiAoIXRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcikge1xuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKVxuICAgICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgZWxzZSBpZiAodGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgIGZvciAoa2V5IGluIHRoaXMuX2V2ZW50cykge1xuICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgIH1cbiAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIGxpc3RlbmVycyA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNGdW5jdGlvbihsaXN0ZW5lcnMpKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICB9IGVsc2UgaWYgKGxpc3RlbmVycykge1xuICAgIC8vIExJRk8gb3JkZXJcbiAgICB3aGlsZSAobGlzdGVuZXJzLmxlbmd0aClcbiAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2xpc3RlbmVycy5sZW5ndGggLSAxXSk7XG4gIH1cbiAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgcmV0O1xuICBpZiAoIXRoaXMuX2V2ZW50cyB8fCAhdGhpcy5fZXZlbnRzW3R5cGVdKVxuICAgIHJldCA9IFtdO1xuICBlbHNlIGlmIChpc0Z1bmN0aW9uKHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgcmV0ID0gW3RoaXMuX2V2ZW50c1t0eXBlXV07XG4gIGVsc2VcbiAgICByZXQgPSB0aGlzLl9ldmVudHNbdHlwZV0uc2xpY2UoKTtcbiAgcmV0dXJuIHJldDtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgaWYgKHRoaXMuX2V2ZW50cykge1xuICAgIHZhciBldmxpc3RlbmVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKGlzRnVuY3Rpb24oZXZsaXN0ZW5lcikpXG4gICAgICByZXR1cm4gMTtcbiAgICBlbHNlIGlmIChldmxpc3RlbmVyKVxuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICB9XG4gIHJldHVybiAwO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG59O1xuXG5mdW5jdGlvbiBpc0Z1bmN0aW9uKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ2Z1bmN0aW9uJztcbn1cblxuZnVuY3Rpb24gaXNOdW1iZXIoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnbnVtYmVyJztcbn1cblxuZnVuY3Rpb24gaXNPYmplY3QoYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnb2JqZWN0JyAmJiBhcmcgIT09IG51bGw7XG59XG5cbmZ1bmN0aW9uIGlzVW5kZWZpbmVkKGFyZykge1xuICByZXR1cm4gYXJnID09PSB2b2lkIDA7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=