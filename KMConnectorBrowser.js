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

    /**
     * 値の一括設定（Obj）
     * @param {object} propsObj 設定するプロパティ
     */
    SetValObj (propsObj) {
        if(typeof propsObj !=="object"){return;}
        let keys=Object.keys(propsObj);
        for(let k=0;k<keys.length;k++){
            let pn=keys[k];
            if(this.hasOwnProperty(pn)){
                this[pn]=propsObj[pn];
            }
        }
    }

}


/**
 * @classdesc XY座標の構造体オブジェクト
 * @ignore
 */
class KMVector2 extends KMStructureBase {
    /**
     * constructor
     * @extends KMStructureBase
     * @param {number} x
     * @param {number} y
     *
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



/**
 * @classdesc ジャイロセンサー値
 */
class KMImuState extends KMStructureBase {
    /**
     * constructor
     * @extends KMStructureBase
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
     * @extends KMStructureBase
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
     * @extends KMStructureBase
     * @param {number} position 座標
     * @param {number} velocity 速度
     * @param {number} torque トルク
     * @instance
     */
    constructor(position, velocity, torque) {
        //有効桁数 小数第4位
        super();
        this.position = Math.floor(KMUtl.toNumber(position)*10000)/10000;
        this.velocity = Math.floor(KMUtl.toNumber(velocity)*10000)/10000;
        this.torque = Math.floor(KMUtl.toNumber(torque)*10000)/10000;
    }
}


/**
 * @classdesc デバイス情報
 */
class KMDeviceInfo extends KMStructureBase {
    /**
     * constructor
     * @extends KMStructureBase
     * @param {KMMotorCommandKMOne.KM_CONNECT_TYPE} type 接続方式
     * @param {string} id デバイスUUID
     * @param {string} name モーター名(形式 ID LEDColor)
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
/**
 * @classdesc モーターログ情報
 */
class KMMotorLog extends KMStructureBase {
    /**
     * @param id {number} シーケンスID(ユニーク値)
     * @param cmdName {string} 実行コマンド名
     * @param cmdID {number} 実行コマンドID
     * @param errID {number} エラータイプ
     * @param errType {string} エラー種別
     * @param errMsg {string}　メッセージ内容
     * @param info {number}
     */
    constructor (id=0,cmdName="",cmdID=0,errID=0,errType="",errMsg="",info=0) {
        super();
        this.id= id;
        this.cmdName=cmdName;
        this.cmdID= cmdID;
        this.errID=errID;
        this.errType= errType;
        this.errMsg= errMsg;
        this.info= info;
    }
}


module.exports = {
    KMStructureBase:KMStructureBase,
    KMVector2:KMVector2,
    //KMVector3:KMVector3,
    KMImuState:KMImuState,
    KMLedState:KMLedState,
    KMRotState:KMRotState,
    KMDeviceInfo:KMDeviceInfo,
    KMMotorLog:KMMotorLog
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/***
 * KMUtl.js
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
        return (!isFinite(v) ? defaultval : v);
    };
    /**
     * 数値にキャストする関数 int固定
     * 数値以外は0を返す<br>
     * Infinityも0とする
     * @param {number} val
     * @param {number} defaultval valが数値に変換出来ない場合のデフォルト
     * @returns {number}
     */
    static toIntNumber(val, defaultval = 0) {
        let v = parseInt(val, 10);
        return (!isFinite(v) ? defaultval : v);
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
     * コマンドのチェックサムを計算
     * @ignore
     * @desc 右送り CRC-16-CCITT (x16 + x12 + x5 + 1) Start:0x0000 XOROut:0x0000 ByteOrder:Little-Endian
     * @param uint8arrayBuffer
     * @returns {number}
     * @constructor
     */
    static CreateCommandCheckSumCRC16(uint8arrayBuffer){
        const crc16table= __crc16table;
        let crc = 0;// Start:0x0000
        let len=uint8arrayBuffer.length;
        for (let i = 0; i < uint8arrayBuffer.length; i++) {
            let c = uint8arrayBuffer[i];
            crc = (crc >> 8) ^ crc16table[(crc ^ c) & 0x00ff];
        }
        crc=((crc>>8)&0xFF)|((crc<<8)&0xFF00);// ByteOrder:Little-Endian
        //crc=0xFFFF^crc;//XOROut:0x0000
        return crc;
    }

    /**
     * @# info:: KMComBLE.jsのDEVICE INFORMATION SERVICEのパースに使用
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

    /**
     * @# info:: デバッグ用
     * uint8Array => UTF-16 Strings convertion
     * @ignore
     * @param uint8Array
     * @returns {string}
     * @constructor
     */
    static Uint8ArrayToHexStr(uint8Array){
        if(!uint8Array instanceof Uint8Array){return;}
        let ar=[];
        for(let i=0;i<uint8Array.length;i++){
            ar.push(uint8Array[i].toString(16));
        }
        return ar.join(':');
    }

    /**
     * @# info::Uint8のConcat
     * Creates a new Uint8Array based on two different ArrayBuffers
     * @param {ArrayBuffers} u8Array1 The first buffer.
     * @param {ArrayBuffers} u8Array2 The second buffer.
     * @return {ArrayBuffers} The new ArrayBuffer created out of the two.
     * @ignore
     */
    static Uint8ArrayConcat(u8Array1, u8Array2) {
        let tmp = new Uint8Array(u8Array1.byteLength + u8Array2.byteLength);
        tmp.set(new Uint8Array(u8Array1), 0);
        tmp.set(new Uint8Array(u8Array2), u8Array1.byteLength);
        return tmp;
    }


}

/**
 * CreateCommandCheckSumCRC16用 CRCテーブル
 * @ignore
 * @type {Uint16Array}
 * @private
 */
const __crc16table=new Uint16Array([
    0 , 0x1189 , 0x2312 , 0x329b , 0x4624 , 0x57ad , 0x6536 , 0x74bf ,
    0x8c48 , 0x9dc1 , 0xaf5a , 0xbed3 , 0xca6c , 0xdbe5 , 0xe97e , 0xf8f7 ,
    0x1081 , 0x0108 , 0x3393 , 0x221a , 0x56a5 , 0x472c , 0x75b7 , 0x643e ,
    0x9cc9 , 0x8d40 , 0xbfdb , 0xae52 , 0xdaed , 0xcb64 , 0xf9ff , 0xe876 ,
    0x2102 , 0x308b , 0x0210 , 0x1399 , 0x6726 , 0x76af , 0x4434 , 0x55bd ,
    0xad4a , 0xbcc3 , 0x8e58 , 0x9fd1 , 0xeb6e , 0xfae7 , 0xc87c , 0xd9f5 ,
    0x3183 , 0x200a , 0x1291 , 0x0318 , 0x77a7 , 0x662e , 0x54b5 , 0x453c ,
    0xbdcb , 0xac42 , 0x9ed9 , 0x8f50 , 0xfbef , 0xea66 , 0xd8fd , 0xc974 ,

    0x4204 , 0x538d , 0x6116 , 0x709f , 0x0420 , 0x15a9 , 0x2732 , 0x36bb ,
    0xce4c , 0xdfc5 , 0xed5e , 0xfcd7 , 0x8868 , 0x99e1 , 0xab7a , 0xbaf3 ,
    0x5285 , 0x430c , 0x7197 , 0x601e , 0x14a1 , 0x0528 , 0x37b3 , 0x263a ,
    0xdecd , 0xcf44 , 0xfddf , 0xec56 , 0x98e9 , 0x8960 , 0xbbfb , 0xaa72 ,
    0x6306 , 0x728f , 0x4014 , 0x519d , 0x2522 , 0x34ab , 0x0630 , 0x17b9 ,
    0xef4e , 0xfec7 , 0xcc5c , 0xddd5 , 0xa96a , 0xb8e3 , 0x8a78 , 0x9bf1 ,
    0x7387 , 0x620e , 0x5095 , 0x411c , 0x35a3 , 0x242a , 0x16b1 , 0x0738 ,
    0xffcf , 0xee46 , 0xdcdd , 0xcd54 , 0xb9eb , 0xa862 , 0x9af9 , 0x8b70 ,

    0x8408 , 0x9581 , 0xa71a , 0xb693 , 0xc22c , 0xd3a5 , 0xe13e , 0xf0b7 ,
    0x0840 , 0x19c9 , 0x2b52 , 0x3adb , 0x4e64 , 0x5fed , 0x6d76 , 0x7cff ,
    0x9489 , 0x8500 , 0xb79b , 0xa612 , 0xd2ad , 0xc324 , 0xf1bf , 0xe036 ,
    0x18c1 , 0x0948 , 0x3bd3 , 0x2a5a , 0x5ee5 , 0x4f6c , 0x7df7 , 0x6c7e ,
    0xa50a , 0xb483 , 0x8618 , 0x9791 , 0xe32e , 0xf2a7 , 0xc03c , 0xd1b5 ,
    0x2942 , 0x38cb , 0x0a50 , 0x1bd9 , 0x6f66 , 0x7eef , 0x4c74 , 0x5dfd ,
    0xb58b , 0xa402 , 0x9699 , 0x8710 , 0xf3af , 0xe226 , 0xd0bd , 0xc134 ,
    0x39c3 , 0x284a , 0x1ad1 , 0x0b58 , 0x7fe7 , 0x6e6e , 0x5cf5 , 0x4d7c ,

    0xc60c , 0xd785 , 0xe51e , 0xf497 , 0x8028 , 0x91a1 , 0xa33a , 0xb2b3 ,
    0x4a44 , 0x5bcd , 0x6956 , 0x78df , 0x0c60 , 0x1de9 , 0x2f72 , 0x3efb ,
    0xd68d , 0xc704 , 0xf59f , 0xe416 , 0x90a9 , 0x8120 , 0xb3bb , 0xa232 ,
    0x5ac5 , 0x4b4c , 0x79d7 , 0x685e , 0x1ce1 , 0x0d68 , 0x3ff3 , 0x2e7a ,
    0xe70e , 0xf687 , 0xc41c , 0xd595 , 0xa12a , 0xb0a3 , 0x8238 , 0x93b1 ,
    0x6b46 , 0x7acf , 0x4854 , 0x59dd , 0x2d62 , 0x3ceb , 0x0e70 , 0x1ff9 ,
    0xf78f , 0xe606 , 0xd49d , 0xc514 , 0xb1ab , 0xa022 , 0x92b9 , 0x8330 ,
    0x7bc7 , 0x6a4e , 0x58d5 , 0x495c , 0x3de3 , 0x2c6a , 0x1ef1 , 0x0f78
]);

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

const KMUtl = __webpack_require__(1);
const KMComBase = __webpack_require__(6);
const KMStructures=__webpack_require__(0);

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
            'MOTOR_TX':'f1400001-8936-4d35-a0ed-dfcd795baa8c',//旧 MOTOR_CONTROL
            //'MOTOR_LED':'f1400003-8936-4d35-a0ed-dfcd795baa8c',//モーターのLEDを取り扱う info:: MOTOR_CONTROL::bleLedで代用
            'MOTOR_MEASUREMENT':'f1400004-8936-4d35-a0ed-dfcd795baa8c',
            'MOTOR_IMU_MEASUREMENT':'f1400005-8936-4d35-a0ed-dfcd795baa8c',
            'MOTOR_RX':'f1400006-8936-4d35-a0ed-dfcd795baa8c',//旧 MOTOR_SETTING
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
         * Notify Value
         *  byte[0]-byte[3]	    byte[4]-byte[7]	        byte[8]-byte[11]
         *  float * 		        float *                 float *
         *  position:radians	    speed:radians/second	torque:N・m
         */
        this._onBleMotorMeasurement=(eve)=>{
            if(!eve||!eve.target){return;}
            let dv = eve.target.value;
            if(!(dv instanceof DataView)){return;}//info::web bluetoohのみ node.jsはinstanceof Buffer
            let position=dv.getFloat32(0,false);
            let velocity=dv.getFloat32(4,false);
            let torque=dv.getFloat32(8,false);
            this._onMotorMeasurementCB(new KMStructures.KMRotState(position,velocity,torque));
        };
        /**
         * @#---------------------------------------------------------
         * モーターIMU情報受信
         * @param eve
         * @private
         * @#
         * -----------------------------------------------------------
         * Notify Value
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
            let accelX=dv.getInt16(0,false)*2/32767;
            let accelY=dv.getInt16(2,false)*2/32767;
            let accelZ=dv.getInt16(4,false)*2/32767;
            let temp=(dv.getInt16(6,false)) / 333.87 + 21.00+tempCalibration;
            let gyroX=dv.getInt16(8,false)*250/32767;
            let gyroY=dv.getInt16(10,false)*250/32767;
            let gyroZ=dv.getInt16(12,false)*250/32767;

            this._onImuMeasurementCB(new KMStructures.KMImuState(accelX,accelY,accelZ,temp,gyroX,gyroY,gyroZ));

        };

        /**
         * @#---------------------------------------------------------
         * モーターログ情報取得
         * @param {Buffer} data
         * @private
         * @#---------------------------------------------------------
         * Notify value
         * byte[0]	byte[1-2]	byte[3]	byte[4-7]	byte[8-11]	byte[12-13]
         * uint8_t:tx_type	uint16_t:id	uint8_t:command	uint32_t:errorCode	uint32_t:info	uint16_t:CRC
         */
        this._onBleMotorLog=(eve)=>{
            if(!eve||!eve.target){return;}
            let dv = eve.target.value;
            if(!(dv instanceof DataView)){return;}//info::web bluetoohのみ node.jsはinstanceof Buffer
            let txType=dv.getUint8(0);//エラーログタイプ:0xBE固定
            if(txType!==0xBE){return;}

            let id=dv.getUint16(1,false);//送信ID
            let cmdID=dv.getUint8(3,false);
            let errCode=dv.getUint32(4,false);
            let info=dv.getUint32(8,false);
            //ログ取得
            this._onMotorLogCB(new KMStructures.KMMotorLog(id,null,cmdID,this._MOTOR_LOG_ERRORCODE[errCode].id,this._MOTOR_LOG_ERRORCODE[errCode].type,this._MOTOR_LOG_ERRORCODE[errCode].msg,info));
        };
        /**
         * @#---------------------------------------------------------
         * モーター設定情報取得
         * @param eve
         * @private
         * @#---------------------------------------------------------
         * Notify value
         * byte[0]	byte[1]	byte[2]	byte[3] byte[4]以降	byte[n-2]	byte[n-1]
         * uint8_t:tx_type	uint16_t:id	uint8_t:register	uint8_t:value	uint16_t:CRC
         * 0x40	uint16_t (2byte) 0～65535	レジスタコマンド	レジスタの値（コマンドによって変わる）	uint16_t (2byte) 0～65535
         */
        this._onBleMotorSetting=(eve)=>{
            if(!eve||!eve.target){return;}
            let dv = eve.target.value;//5+nバイト　
            let uint8Array=new Uint8Array(dv.buffer);//info::一旦コピーする必要がある
            if(!(dv instanceof DataView)){return;}//info::web bluetoohのみ node.jsはinstanceof Buffer

            //-------------
            //データのparse
            //-------------
            let txLen=dv.byteLength;
            let txType=dv.getUint8(0);//レジスタ情報通知コマンドID 0x40固定
            if(txType!==0x40||txLen<5){return;}//レジスタ情報を含まないデータの破棄

            let id=dv.getUint16(1,false);//送信ID
            let registerCmd=dv.getUint8(3);//レジスタコマンド
            let crc=dv.getUint16(txLen-2,false);//CRCの値 最後から2dyte

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
                    res.deviceName=String.fromCharCode.apply("", uint8Array.slice(startOffset,-2));//可変バイト文字
                    break;
                case this._MOTOR_RX_READREGISTER_COMMAND.deviceInfo:
                    res.deviceInfo=String.fromCharCode.apply("", uint8Array.slice(startOffset,-2));//可変バイト文字
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
                    res.tasksetName=String.fromCharCode.apply("", uint8Array.slice(startOffset,-2));//可変バイト文字
                    break;
                case this._MOTOR_RX_READREGISTER_COMMAND.tasksetInfo:
                    res.tasksetInfo=dv.getUint16(startOffset,false);
                    break;
                case this._MOTOR_RX_READREGISTER_COMMAND.tasksetUsage:
                    res.tasksetUsage=dv.getUint8(startOffset);
                    break;
                case this._MOTOR_RX_READREGISTER_COMMAND.motionName:
                    res.motionName=String.fromCharCode.apply("", uint8Array.slice(startOffset,-2));//可変バイト文字
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
                    res.deviceSerial=String.fromCharCode.apply("", uint8Array.slice(startOffset,-2));//可変バイト文字
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
                        if(this._characteristics['MOTOR_RX']){
                            this._characteristics['MOTOR_RX'].removeEventListener('characteristicvaluechanged',this._onBleMotorSetting);
                            this._characteristics['MOTOR_RX'].removeEventListener('characteristicvaluechanged',this._onBleMotorLog);

                            this._characteristics['MOTOR_RX'].addEventListener('characteristicvaluechanged',this._onBleMotorSetting);
                            this._characteristics['MOTOR_RX'].addEventListener('characteristicvaluechanged',this._onBleMotorLog);

                            return this._characteristics['MOTOR_RX'].startNotifications();
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
     * @param commandTypeStr  'MOTOR_CONTROL','MOTOR_MEASUREMENT','MOTOR_IMU_MEASUREMENT','MOTOR_RX'
     * コマンド種別のString 主にBLEのキャラクタリスティクスで使用する
     * @param commandNum
     * @param arraybuffer
     * @param notifyPromis cmdReadRegister等のBLE呼び出し後にnotifyで取得する値をPromisで帰す必要のあるコマンド用
     * @param cid シーケンスID
     * @returns {number} cid シーケンスID
     * @private
     */
    _sendMotorCommand(commandCategory, commandNum, arraybuffer=new ArrayBuffer(0), notifyPromis=null,cid=null){
        let characteristics=this._characteristics[commandCategory];
        let ab=new DataView(arraybuffer);
        let buffer = new ArrayBuffer(arraybuffer.byteLength+5);
        new DataView(buffer).setUint8(0,commandNum);
        cid=cid===null?this.createCommandID:cid;//シーケンスID(ユニーク値)
        new DataView(buffer).setUint16(1,cid);
        //データの書き込み
        for(let i=0;i<arraybuffer.byteLength;i++){
            new DataView(buffer).setUint8(3+i,ab.getUint8(i));
        }
        let crc=KMUtl.CreateCommandCheckSumCRC16(new Uint8Array(buffer.slice(0,buffer.byteLength-2)));
        new DataView(buffer).setUint16(arraybuffer.byteLength+3,crc);//info::CRC計算

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
        return cid;
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
global.KMImuState=__webpack_require__(0).KMImuState;
global.KMLedState=__webpack_require__(0).KMLedState;
global.KMRotState=__webpack_require__(0).KMRotState;
global.KMDeviceInfo=__webpack_require__(0).KMDeviceInfo;
global.KMMotorLog=__webpack_require__(0).KMMotorLog;
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
     * KMMotorOneWebBLE
     * @constructor
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
        this._onMotorLogCB=function(){};
        this._isInit=false;

        /**
         * _onBleMotorSettingのコマンド　モーター設定情報の通知受信時にパースする用
         * @type {{maxSpeed: number, minSpeed: number, curveType: number, acc: number, dec: number, maxTorque: number, qCurrentP: number, qCurrentI: number, qCurrentD: number, speedP: number, speedI: number, speedD: number, positionP: number, ownColor: number}}
         * @ignore
         */
        this._MOTOR_RX_READREGISTER_COMMAND={
                "maxSpeed":0x02,
                "minSpeed":0x03,
                "curveType":0x05,
                "acc":0x07,
                "dec":0x08,
                "maxTorque":0x0E,
                "teachingInterval":0x16,
                "playbackInterval":0x17,
                "qCurrentP":0x18,
                "qCurrentI":0x19,
                "qCurrentD":0x1A,
                "speedP":0x1B,
                "speedI":0x1C,
                "speedD":0x1D,
                "positionP":0x1E,
                "positionI":0x1F,
                "positionD":0x20,
                "posControlThreshold":0x21,
                "notifyPosArrival":0x2B,
                "motorMeasurementInterval":0x2C,
                "motorMeasurementByDefault":0x2D,
                "interface":0x2E,
                "response":0x30,
                "ownColor":0x3A,
                "iMUMeasurementInterval":0x3C,
                "iMUMeasurementByDefault":0x3D,
                "deviceName":0x46,
                "deviceInfo":0x47,
                "speed":0x58,
                "positionOffset":0x5B,
                "moveTo":0x66,
                "hold":0x72,
                "status":0x9A,
                "tasksetName":0xA5,
                "tasksetInfo":0xA6,
                "tasksetUsage":0xA7,
                "motionName":0xAF,
                "motionInfo":0xB0,
                "motionUsage":0xB1,
                "i2CSlaveAddress":0xC0,
                "led":0xE0,
                "enableCheckSum":0xF3,
                "deviceSerial":0xFA
        };
        /**
         * モーターログ用エラーコード表
         * @type {{}}
         * @ignore
         */
        this._MOTOR_LOG_ERRORCODE={
            0:{id:0,type:"KM_SUCCESS",msg:"Successful command"},//成功時に返却する
            1:{id:1,type:"KM_ERROR_INTERNAL",msg:"Internal Error"},//内部エラー
            2:{id:2,type:"KM_ERROR_NO_MEM",msg:"No Memory for operation"},//メモリ不足
            3:{id:3,type:"KM_ERROR_NOT_FOUND",msg:"Not found"},//見つからない
            4:{id:4,type:"KM_ERROR_NOT_SUPPORTED",msg:"Not supported"},//サポート外
            5:{id:5,type:"KM_ERROR_INVALID_COMMAND",msg:"Invalid Command"},//不正なコマンド
            6:{id:6,type:"KM_ERROR_INVALID_PARAM",msg:"Invalid Parameter"},//不正な引数
            7:{id:7,type:"KM_ERROR_STORAGE_FULL",msg:"Storage is full"},//記録領域が一杯
            8:{id:8,type:"KM_ERROR_INVALID_FLASH_STATE",msg:"Invalid flash state, operation disallowed in this state"},//フラッシュの状態が不正
            9:{id:9,type:"KM_ERROR_INVALID_LENGTH",msg:"Invalid Length"},//不正な引数の長さ（サイズ）
            10:{id:10,type:"KM_ERROR_INVALID_CHECKSUM",msg:"Invalid Check Sum (Validation is failed)"},//不正なチェックサム
            13:{id:13,type:"KM_ERROR_TIMEOUT",msg:"Operation timed out"},//タイムアウト
            15:{id:15,type:"KM_ERROR_FORBIDDEN",msg:"Forbidden Operation"},//不許可な操作
            16:{id:16,type:"KM_ERROR_INVALID_ADDR",msg:"Bad Memory Address"},//不正なアドレス参照
            17:{id:17,type:"KM_ERROR_BUSY",msg:"Busy"},//ビジー
            18:{id:18,type:"KM_ERROR_RESOURCE",msg:"Not enough resources for operation"},//リソース不足
            20:{id:20,type:"KM_ERROR_MOTOR_DISABLED",msg:"Motor state is disabled"},//モーターが動作許可されていない
            60:{id:60,type:"KM_ERROR_DEVICE_DRIVER",msg:"KM_ERROR_DEVICE_DRIVER"},//内容未定義
            61:{id:61,type:"KM_ERROR_DEVICE_FLASH",msg:"KM_ERROR_DEVICE_FLASH"},//内容未定義
            62:{id:62,type:"KM_ERROR_DEVICE_LED",msg:"KM_ERROR_DEVICE_LED"},//内容未定義
            63:{id:63,type:"KM_ERROR_DEVICE_IMU",msg:"KM_ERROR_DEVICE_IMU"},//内容未定義
            70:{id:70,type:"KM_ERROR_NRF_DEVICE",msg:"Error related to BLE module (nRF52832)"},//BLEモジュールのエラー
            80:{id:80,type:"KM_ERROR_WDT_EVENT",msg:"Watch Dog Timer Event"},//ウォッチドッグタイマーイベントの発動（再起動直前）
            81:{id:81,type:"KM_ERROR_OVER_HEAT",msg:"Over Heat (over temperature)"},//温度異常（マイコン温度が2分以上60度を超過）
            100:{id:100,type:"KM_SUCCESS_ARRIVAL",msg:"Position Arrival Notification"}//位置制御時に指定位置に到達した場合の通知
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
    /**
     * モーターログ情報取得callback
     * @type {function(cmdID:number,res:errorlogObject)}
     */
    set onMotorLog(func){
        if(typeof func==="function"){
            this._onMotorLogCB=func;
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
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

const EventEmitter = __webpack_require__(8).EventEmitter;
const KMUtl = __webpack_require__(1);
const KMComWebBLE = __webpack_require__(2);
const KMStructures=__webpack_require__(0);


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

    /**
     * cmdMotorMeasurementIntervalのモーター測定値の取得間隔定数
     * @readonly
     * @enum {number}
     * @property {number} MOTOR_MEAS_INTERVAL_5MS - 0:5MS
     * @property {number} MOTOR_MEAS_INTERVAL_10MS - 1:10MS
     * @property {number} MOTOR_MEAS_INTERVAL_20MS - 2:20MS
     * @property {number} MOTOR_MEAS_INTERVAL_50MS - 3:50MS
     * @property {number} MOTOR_MEAS_INTERVAL_100MS - 4:100MS
     * @property {number} MOTOR_MEAS_INTERVAL_200MS - 5:200MS
     * @property {number} MOTOR_MEAS_INTERVAL_500MS - 6:500MS
     * @property {number} MOTOR_MEAS_INTERVAL_1000MS - 7:1000MS
     */
    static get cmdMotorMeasurementInterval_MOTOR_MEAS_INTERVAL(){
        return{
            'MOTOR_MEAS_INTERVAL_5MS': 0,
            'MOTOR_MEAS_INTERVAL_10MS':1,
            'MOTOR_MEAS_INTERVAL_20MS':2,
            'MOTOR_MEAS_INTERVAL_50MS':3,
            'MOTOR_MEAS_INTERVAL_100MS':4,
            'MOTOR_MEAS_INTERVAL_200MS':5,
            'MOTOR_MEAS_INTERVAL_500MS':6,
            'MOTOR_MEAS_INTERVAL_1000MS':7
        };
    }
    /**
     * cmdIMUMeasurementIntervalの加速度・ジャイロ測定値の取得間隔定数
     * @readonly
     * @enum {number}
     * @property {number} MOTOR_MEAS_INTERVAL_5MS - 0:5MS
     * @property {number} MOTOR_MEAS_INTERVAL_10MS - 1:10MS
     * @property {number} MOTOR_MEAS_INTERVAL_20MS - 2:20MS
     * @property {number} MOTOR_MEAS_INTERVAL_50MS - 3:50MS
     * @property {number} MOTOR_MEAS_INTERVAL_100MS - 4:100MS
     * @property {number} MOTOR_MEAS_INTERVAL_200MS - 5:200MS
     * @property {number} MOTOR_MEAS_INTERVAL_500MS - 6:500MS
     * @property {number} MOTOR_MEAS_INTERVAL_1000MS - 7:1000MS
     */
    static get cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL(){
        return{
            'IMU_MEAS_INTERVAL_5MS': 0,
            'IMU_MEAS_INTERVAL_10MS':1,
            'IMU_MEAS_INTERVAL_20MS':2,
            'IMU_MEAS_INTERVAL_50MS':3,
            'IMU_MEAS_INTERVAL_100MS':4,
            'IMU_MEAS_INTERVAL_200MS':5,
            'IMU_MEAS_INTERVAL_500MS':6,
            'IMU_MEAS_INTERVAL_1000MS':7
        };
    }
    /*
    * ReadRegisterで取得する時用のコマンド引数定数
    * @readonly
    * @enum {number}
    * @property {number} maxSpeed - 2:最大速さ
    * @property {number} minSpeed - 3:最小速さ
    * @property {number} curveType - 5:加減速曲線
    * @property {number} acc - 7:加速度
    * @property {number} dec - 8:減速度
    * @property {number} maxTorque - 14:最大トルク
    * @property {number} qCurrentP - 24:q軸電流PIDゲイン(P)
    * @property {number} qCurrentI - 25:q軸電流PIDゲイン(I)
    * @property {number} qCurrentD - 26:q軸電流PIDゲイン(D)
    * @property {number} speedP - 27:速度PIDゲイン(P)
    * @property {number} speedI - 28:速度PIDゲイン(I)
    * @property {number} speedD - 29:速度PIDゲイン(D)
    * @property {number} positionP - 30:位置PIDゲイン(P)
    * @property {number} positionI - 31:位置PIDゲイン(I)
    * @property {number} positionD - 32:位置PIDゲイン(D)
    * @property {number} posControlThreshold - 33:モーターの位置制御時、ID制御を有効にする偏差の絶対値
    * @property {number} interface - 46:モーター通信経路
    * @property {number} response - 48:コマンドを受信したときに通知するか
    * @property {number} ownColor - 58:デバイスLEDの固有色
    * @property {number} deviceName - 70:
    * @property {number} deviceInfo - 71:
    */
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
            "positionI":0x1F,
            "positionD":0x20,
            "posControlThreshold":0x21,
            "interface":0x2E,
            "response":0x30,
            "ownColor":0x3A,
            "deviceName":0x46,
            "deviceInfo":0x47
        };
    }
    /*
       * モーター制御手段（インターフェイス）の経路指定用定数
       * @readonly
       * @enum {number}
       * @property {number} BLE - 0x1:BLE
       * @property {number} USB - 0x1000:USB
       * @property {number} I2C - 0x10000:I2C
       * @property {number} HDDBTN - 0x10000000:物理ボタン
       */
    static get cmdInterface_INTERFACE_TYPE(){
        return{
            "BLE":0b1,
            "USB":0b1000,
            "I2C":0b10000,
            "HDDBTN":0b10000000
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
         * イベントタイプ定数
         * @readonly
         * @enum {string}
         */
        this.EVENT_TYPE={
            /** 初期化完了時<br>return:function({KMDeviceInfo}) */ init:"init",
            /** 接続時<br>return:function({KMDeviceInfo}) */ connect:"connect",
            /** 切断時<br>return:function({KMDeviceInfo}) */ disconnect:"disconnect",
            /** 接続に失敗時<br>return:function({KMDeviceInfo},{msg}) */ connectFailure:"connectFailure",
            /** モーター回転情報受信時<br>return:function({@link KMRotState}) */ motorMeasurement:"motorMeasurement",
            /** モーターIMU情報受信時<br>return:function({@link KMImuState}) */ imuMeasurement:"imuMeasurement",
            /** モーターログ情報受信時<br>return:function({cmdName},{errorlogObject}) */ motorLog:"motorLog",
        };
        Object.freeze(this.EVENT_TYPE);//info::後からフリーズしないとjsdocが生成されない。
        /**
         * モーターの全コマンド
         * @readonly
         * @enum {number}
         * @private
         * @ignore
         */
        this._MOTOR_COMMAND={
            /** 最大速さを設定する */ maxSpeed:0x02,
            /** 最小速さを設定する */ minSpeed:0x03,
            /** 加減速曲線を設定する */ curveType:0x05,
            /** 加速度を設定する */ acc:0x07,
            /** 減速度を設定する */ dec:0x08,
            /** 最大トルクを設定する */ maxTorque:0x0E,
            /** ティーチング間隔 */ teachingInterval:0x16,
            /** プレイバック間隔 */ playbackInterval:0x17,
            /** q軸電流PIDゲイン(P)を設定する */ qCurrentP:0x18,
            /** q軸電流PIDゲイン(I)を設定する */ qCurrentI:0x19,
            /** q軸電流PIDゲイン(D)を設定する */ qCurrentD:0x1A,
            /** 速度PIDゲイン(P)を設定する */ speedP:0x1B,
            /** 速度PIDゲイン(I)を設定する */ speedI:0x1C,
            /** 速度PIDゲイン(D)を設定する */ speedD:0x1D,
            /** 位置PIDゲイン(P)を設定する */ positionP:0x1E,
            /** 位置PIDゲイン(I)を設定する */ positionI:0x1F,
            /** 位置PIDゲイン(D)を設定する */ positionD:0x20,
            /** モーターの位置制御時、ID制御を有効にする偏差の絶対値を指定する */ posControlThreshold:0x21,

            /** PIDゲインをリセットする */ resetPID:0x22,
            /** 位置制御時、目標位置に到達時、判定条件を満たした場合通知を行う*/ notifyPosArrival:0x2B,
            /** モーター測定値の取得間隔(USB,I2Cのみ) */ motorMeasurementInterval:0x2C,
            /** モーター測定値の取得設定 */ motorMeasurementByDefault:0x2D,
            /** モーター制御手段（インターフェイス）の設定 */ interface:0x2E,
            /** コマンドを受信したときに成功通知（errorCode = 0）をするかどうか */ response:0x30,

            /** デバイスLEDの固有色を設定する */ ownColor:0x3A,
            /** IMU測定値通知間隔（有線のみ） */ iMUMeasurementInterval:0x3C,
            /** デフォルトでのIMU測定値通知ON/OFF */ iMUMeasurementByDefault:0x3D,

            /** 指定の設定値を取得する */ readRegister:0x40,
            /** 全ての設定値をフラッシュに保存する */ saveAllRegisters:0x41,

            /** デバイスネームの取得 */ readDeviceName:0x46,
            /** デバイス情報の取得 */ readDeviceInfo:0x47,
            /** 指定の設定値をリセットする */ resetRegister:0x4E,
            /** 全設定値をリセットする */ resetAllRegisters:0x4F,
            /** モーターの動作を不許可とする */ disable:0x50,
            /** モーター動作を許可する */ enable:0x51,
            /** 速度の大きさを設定する */ speed:0x58,
            /** 位置のプリセットを行う（原点設定） */ presetPosition:0x5A,
            /** 位置のプリセットに関するOFFSET量 */ readPositionOffset:0x5B,

            /** 正回転する（反時計回り） */ runForward:0x60,
            /** 逆回転する（時計回り） */ runReverse:0x61,
            /** モーターを指定速度で回転させる */ run:0x62,
            /** 絶対位置に移動する(速度あり) */ moveToPositionSpeed:0x65,
            /** 絶対位置に移動する */ moveToPosition:0x66,
            /** 相対位置に移動する(速度あり) */ moveByDistanceSpeed:0x67,
            /** 相対位置に移動する */ moveByDistance:0x68,
            /** モーターの励磁を停止する */ free:0x6C,
            /** 速度ゼロまで減速し停止する */ stop:0x6D,
            /** トルク制御を行う */ holdTorque:0x72,
            /** タスクセットを実行する */ startDoingTaskset:0x81,
            /** タスクセットを停止 */ stopDoingTaskset:0x82,
            /** モーションを再生（準備なし） */ startPlaybackMotion:0x85,
            /** モーション再生を停止する */ stopPlaybackMotion:0x88,
            /** キューを停止する */ pauseQueue:0x90,
            /** キューを再開する */ resumeQueue:0x91,
            /** キューを指定時間停止し再開する */ waitQueue:0x92,
            /** キューをリセットする */ resetQueue:0x95,
            /** モーターの状態 */ readStatus:0x9A,

            /** タスクセットの記録を開始する */ startRecordingTaskset:0xA0,
            /** タスクセットの記録を停止する */ stopRecordingTaskset:0xA2,
            /** 指定のタスクセットを削除する */ eraseTaskset:0xA3,
            /** タスクセットを全削除する */ eraseAllTaskset:0xA4,
            /** タスクセットの記録名設定 */ setTasksetName:0xA5,
            /** タスクセット内容把握 */ readTasksetInfo:0xA6,
            /** タスクセット使用状況把握 */ readTasksetUsage:0xA7,
            /** ダイレクトティーチング開始（準備なし） */ startTeachingMotion:0xA9,
            /** ティーチングを停止する */ stopTeachingMotion:0xAC,
            /** ティーチングで覚えた動作を削除する */ eraseMotion:0xAD,
            /** ティーチングで覚えた全動作を削除する */ eraseAllMotion:0xAE,
            /** I2Cスレーブアドレス */ setI2CSlaveAddress:0xC0,
            /** LEDの点灯状態をセットする */ led:0xE0,
            /** モーターの測定値取得（通知）を開始 */ enableMotorMeasurement:0xE6,
            /** モーターの測定値取得（通知）を開始 */ disableMotorMeasurement:0xE7,
            /** IMUの値取得(通知)を開始する */ enableIMUMeasurement:0xEA,
            /** IMUの値取得(通知)を停止する */ disableIMUMeasurement:0xEB,

            /** システムを再起動する */ reboot:0xF0,
            /** チェックサム（CRC16) 有効化 */ enableCheckSum:0xF3,
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
        this.cmdMotorMeasurementInterval_MOTOR_MEAS_INTERVAL=this.constructor.cmdMotorMeasurementInterval_MOTOR_MEAS_INTERVAL;
        this.cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL=this.constructor.cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL;
        this.cmdInterface_INTERFACE_TYPE=this.constructor.cmdInterface_INTERFACE_TYPE;
        this._PositionArrivalNotification=null;//KM_SUCCESS_ARRIVAL監視用
        this._PositionArrivalNotificationTimeOutId=0;
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
         * @param {KMRotState} rotState
         * @private
         */
        this._KMCom.onMotorMeasurement=(rotState)=>{
            //let rotState=new KMStructures.KMRotState(res.position,res.velocity,res.torque);
            this.emit(this.EVENT_TYPE.motorMeasurement,rotState);
        };
        /**
         * モーターIMU情報受信
         * @param {KMImuState} imuState
         * @private
         */
        this._KMCom.onImuMeasurement=(imuState)=>{
            //let imuState=new KMStructures.KMImuState(res.accelX,res.accelY,res.accelZ,res.temp,res.gyroX,res.gyroY,res.gyroZ);
            this.emit(this.EVENT_TYPE.imuMeasurement,imuState);
        };
        /**
         * モーターログ情報取得
         * @param {number} cmdID
         * @param {KMMotorLog} motorLog
         * @private
         */
        this._KMCom.onMotorLog=(motorLog)=>{
            //コマンドIDからコマンド名を取得追加
            let cmdName=this._REV_MOTOR_COMMAND[motorLog.cmdID]?this._REV_MOTOR_COMMAND[motorLog.cmdID]:motorLog.cmdID;
            motorLog.cmdName=cmdName;
            this.emit(this.EVENT_TYPE.motorLog,motorLog);

            //info::位置制御時、目標位置に到達時、判定条件を満たした場合通知を行う
            if(motorLog.errID===100){//KM_SUCCESS_ARRIVAL
               if(this._PositionArrivalNotification){
                   if(this._PositionArrivalNotification.tagName===motorLog.id){
                       this._PositionArrivalNotification.callResolve({id:this._PositionArrivalNotification.tagName,msg:'Position Arrival Notification',info:motorLog.info});
                   }
                   else{
                      // this._PositionArrivalNotification.callReject({id:this._PositionArrivalNotification.tagName,msg:'Instruction override:' +cmdName,overrideId:motorLog.id});
                   }
               }
            }
        };

        /**
         * モーター設定情報取得
         * @param {number} registerCmd
         * @param {number} res
         * @private
         */
        this._KMCom.onMotorSetting=(registerCmd, res)=>{
            _KMNotifyPromis.sendGroupNotifyResolve(this._notifyPromisList,registerCmd,res);
        };

    }
    /********************************************
     * プロパティ
     ********************************************/
    /**
     * モーターとの接続が有効か
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
     * モーター名
     * @readonly
     * @type {string}
     */
    get name(){
        return this._KMCom.deviceInfo?this._KMCom.deviceInfo.name:null;
    }


    /**
     * 接続コネクター
     * @private
     * @type {KMComBase}
     * @ignore
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
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.disable);
    }

    /**
     * @summary モーター動作を許可する（上位命令）
     * @desc 安全用：この命令を入れるとモーターは動作可能となる<br>
     * モーター起動時は disable 状態のため、本コマンドで動作を許可する必要があり<br>
     * コマンドはタスクセットに記録することは不可
     *
     */
    cmdEnable(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.enable);
    }
    /**
     * @summary 速度の大きさをセットする（単位系：RPM）
     * @param {number} speed_rpm float  [0-X rpm]　(正の数)
     */
    cmdSpeed_rpm(speed_rpm = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speed_rpm*0.10471975511965977,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.speed,buffer);
    }
    /**
     * @summary 速度の大きさをセットする（単位系：ラジアン）
     * @param {number} speed float 速度の大きさ 単位：角度（ラジアン）/秒 [0-X rps]　(正の数)
     */
    cmdSpeed(speed = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speed,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.speed,buffer);
    }

    /**
     * @summary 位置のプリセットを行う（原点設定）（単位系：ラジアン）
     * @param {number} position float 絶対角度：radians
     */
    cmdPresetPosition(position = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,parseFloat(KMUtl.toNumber(position),10));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.presetPosition,buffer);
    }
    /**
     * @summary 位置のプリセットに関するOFFSET量
     * @desc 位置のオフセット量（presetPositionで設定した値に対応）を読み取る
     * @returns {Promise<int|Array>}
     */
    cmdReadPositionOffset(){
        return this.cmdReadRegister(this._MOTOR_COMMAND.readPositionOffset);
    }

    /**
     * @summary 正回転する（反時計回り）
     * @desc cmdSpeed で保存された速度で、正回転
     */
    cmdRunForward(){
        let cid=this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.runForward);
        this._moveSyncInstructionOverrideReject(cid);//移動系のSyncコマンド実行時のCBのReject
    }

    /**
     * @summary 逆回転する（時計回り）
     * @desc cmdSpeed で保存された速度で、逆回転
     */
    cmdRunReverse(){
        let cid=this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.runReverse);
        this._moveSyncInstructionOverrideReject(cid);//移動系のSyncコマンド実行時のCBのReject
    }

    /**
     * @summary モーターを指定速度で回転させる
     * @param {number} speed float 速度の大きさ 単位：角度（ラジアン）/秒 [±X rps]
     */
    cmdRun(speed = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speed,10)));
        let cid=this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.run,buffer);
        this._moveSyncInstructionOverrideReject(cid);//移動系のSyncコマンド実行時のCBのReject

    }

    /**
     * @summary モーターを指定速度で回転させる
     * @param {number} speed_rpm float [±X rpm]
     */
    cmdRun_rpm(speed_rpm = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,parseFloat(speed_rpm*0.10471975511965977,10));
        let cid= this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.run,buffer);
        this._moveSyncInstructionOverrideReject(cid);//移動系のSyncコマンド実行時のCBのReject
    }


    /**
     * @summary 絶対位置に移動する
     * @desc 速さは cmdSpeed で保存された速度が採用される
     * @param {number} position float 角度：radians
     * @param {number} speed float 速度の大きさ 単位：角度（ラジアン）/秒 [0-X rps]　
     */
    cmdMoveToPosition(position,speed=null){
        if(position=== undefined){return;}
        let cid=null;
        if(speed!==null){
            let buffer = new ArrayBuffer(8);
            new DataView(buffer).setFloat32(0,parseFloat(position,10));
            new DataView(buffer).setFloat32(4,parseFloat(speed,10));
            cid=this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.moveToPositionSpeed,buffer);
        }else{
            let buffer = new ArrayBuffer(4);
            new DataView(buffer).setFloat32(0,parseFloat(position,10));
            cid=this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.moveToPosition,buffer);
        }

        this._moveSyncInstructionOverrideReject(cid);//移動系のSyncコマンド実行時のCBのReject
    }

    /**
     * @summary 絶対位置に移動し、移動の成否を通知する (MotorFarm Ver >= 2.23)
     * @desc 速さは cmdSpeed で保存された速度が採用される
     * <ul>
     *     <li>このコマンド実行中に別の移動系のコマンドを実行すると'Instruction override'としてrejectされる</li>
     * </ul>
     * @example
     * Promise.resolve().then((resolve) =>{
     *      kMMotorOne.cmdNotifyPosArrival(1,KMUtl.degreeToRadian(0.5));//到達と判定する目標座標の範囲 +-0.5度
     *      //原点移動 30rpm タイムアウト 5s
     *      return kMMotorOne.cmdMoveToPositionSync(0,KMConnector.KMUtl.rpmToRadianSec(30),5000);
     * }).then((resolve) =>{
     *      //position Arrived
     * }).catch((e)=>{
     *      console.log(e);//'Instruction override' or Timeout
     * });
     * @param {number} position float 角度：radians
     * @param {number} speed float 速度の大きさ 単位：角度（ラジアン）/秒 [0-X rps]　
     * @param {number} timeout int [0 - x ms] デフォルト 0:タイムアウト無し
     * @returns {Promise<any>}
     */
    cmdMoveToPositionSync(position,speed=null,timeout=0){
        if(position=== undefined){return;}
        let self=this;
        let cid=null;
        if(speed!==null){
            let buffer = new ArrayBuffer(8);
            new DataView(buffer).setFloat32(0,parseFloat(position,10));
            new DataView(buffer).setFloat32(4,parseFloat(speed,10));
            cid=this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.moveToPositionSpeed,buffer);
        }else{
            let buffer = new ArrayBuffer(4);
            new DataView(buffer).setFloat32(0,parseFloat(position,10));
            cid=this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.moveToPosition,buffer);
        }

        this._moveSyncInstructionOverrideReject(cid);//移動系のSyncコマンド実行時のCBのReject

        //成否の捕捉
        return new Promise(function(resolve, reject) {
            let tm= Math.abs(parseInt(timeout));
            self._PositionArrivalNotification=new _KMNotifyPromis(cid,"cmdMoveToPositionSync",null,resolve,reject,tm);//notify経由のKM_SUCCESS_ARRIVALをPromisと紐付け
            if(tm){
                self._PositionArrivalNotification.startRejectTimeOutCount();
            }
        });
    }

    /**
     * @summary 相対位置に移動する
     * @desc 速さは cmdSpeed で保存された速度が採用される
     * @param  {number} distance float 角度：radians[左:+radians 右:-radians]
     * @param {number} speed float 速度の大きさ 単位：角度（ラジアン）/秒 [0-X rps]　(正の数)
     */
    cmdMoveByDistance(distance = 0,speed=null){
        let cid=null;
        if(speed!==null){
            let buffer = new ArrayBuffer(8);
            new DataView(buffer).setFloat32(0,parseFloat(distance,10));
            new DataView(buffer).setFloat32(4,parseFloat(speed,10));
            cid=this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.moveByDistanceSpeed,buffer);
        }else{
            let buffer = new ArrayBuffer(4);
            new DataView(buffer).setFloat32(0,parseFloat(distance,10));
            cid=this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.moveByDistance,buffer);
        }

        this._moveSyncInstructionOverrideReject(cid);//移動系のSyncコマンド実行時のCBのReject
    }

    /**
     * @summary 相対位置に移動し、移動の成否を通知する (MotorFarm Ver >= 2.23)
     * @desc 速さは cmdSpeed で保存された速度が採用される
     * <ul>
     *     <li>このコマンド実行中に別の移動系のコマンドを実行すると'Instruction override'としてrejectされる</li>
     * </ul>
     * @example
     * Promise.resolve().then((resolve) =>{
     *      kMMotorOne.cmdNotifyPosArrival(1,KMUtl.degreeToRadian(0.5));//到達と判定する目標座標の範囲 +-0.5度
     *      //360度相対移動 30rpm タイムアウト無し
     *      return kMMotorOne.cmdMoveByDistanceSync(KMConnector.KMUtl.degreeToRadian(360),KMConnector.KMUtl.rpmToRadianSec(30));
     * }).then((resolve) =>{
     *      //position Arrived
     * }).catch((e)=>{
     *      console.log(e);//'Instruction override' or Timeout
     * });
     * @param  {number} distance float 角度：radians[左:+radians 右:-radians]
     * @param {number} speed float 速度の大きさ 単位：角度（ラジアン）/秒 [0-X rps]　(正の数)
     * @param {number} timeout int [0 - x ms] デフォルト 0:タイムアウト無し
     * @returns {Promise<any>}
     */
    cmdMoveByDistanceSync(distance = 0,speed=null,timeout=0){
        let self=this;
        let cid=null;
        if(speed!==null){
            let buffer = new ArrayBuffer(8);
            new DataView(buffer).setFloat32(0,parseFloat(distance,10));
            new DataView(buffer).setFloat32(4,parseFloat(speed,10));
            cid=this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.moveByDistanceSpeed,buffer);
        }else{
            let buffer = new ArrayBuffer(4);
            new DataView(buffer).setFloat32(0,parseFloat(distance,10));
            cid=this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.moveByDistance,buffer);
        }

        this._moveSyncInstructionOverrideReject(cid);//移動系のSyncコマンド実行時のCBのReject

        //成否の捕捉
        return new Promise(function(resolve, reject) {
            let tm= Math.abs(parseInt(timeout));
            self._PositionArrivalNotification=new _KMNotifyPromis(cid,"cmdMoveByDistanceSync",null,resolve,reject,tm);
            if(tm){
                self._PositionArrivalNotification.startRejectTimeOutCount();
            }
        });
    }
    /**
     * @summary モーターの励磁を停止する（感触は残ります）
     * @desc 完全フリー状態を再現する場合は、 cmdFree().cmdDisable() として下さい。
     */
    cmdFree(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.free);
    }

    /**
     * @summary モーターを速度ゼロまで減速し停止する
     * @desc rpm = 0 となる。
     */
    cmdStop(){
        let cid=this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.stop);
        this._moveSyncInstructionOverrideReject(cid);//移動系のSyncコマンド実行時のCBのReject
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
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.holdTorque,buffer);
    }

    /**
     * @summary 記憶したタスク（命令）のセットを実行する
     * @param {number} index int タスクセット番号（0～65535）
     * @param {number} repeating int 繰り返し回数 0は無制限
     *
     * @desc KM-1 は index: 0~49 まで。（50個のメモリバンク 各8128 Byte まで制限あり）<br>
     * タスクセットの記録は、コマンド（タスクセット）を参照下さい。 https://document.keigan-motor.com/motor-control-command/taskset.html
     */
    cmdStartDoingTaskset(index = 0,repeating = 1){
        let buffer = new ArrayBuffer(6);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(repeating,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.startDoingTaskset,buffer);
    };

    /**
     * @summary タスクセットを停止
     * @desc タスクセットの再生を停止する
     */
    cmdStopDoingTaskset(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.stopDoingTaskset);
    }

    /**
     * @summary モーションを再生（準備なし）
     * @desc モーションのプレイバックを（準備なしで）プレイバック開始する
     * @param {number} index int モーション番号（0～65535）
     * @param {number} repeating int 繰り返し回数 0は無制限
     * @param {KMMotorCommandKMOne.cmdPreparePlaybackMotion_START_POSITION} start_position int スタート位置の設定<br>
     * START_POSITION_ABS:記憶された開始位置（絶対座標）からスタート<br>
     * START_POSITION_CURRENT:現在の位置を開始位置としてスタート
     */
    cmdStartPlaybackMotion(index = 0,repeating = 0,start_position = 0){
        let buffer = new ArrayBuffer(7);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(repeating,10)));
        new DataView(buffer).setUint8(6,Math.abs(parseInt(start_position,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.startPlaybackMotion,buffer);
    }

    /**
     * @summary モーション再生を停止する
     * @ignore
     */
    cmdStopPlaybackMotion(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.stopPlaybackMotion);
    }

    //---------------------//
    // section::キュー操作
    //---------------------//
    /**
     * @summary キューを一時停止する
     */
    cmdPauseQueue(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.pauseQueue);
    }

    /**
     * @summary キューを再開する（蓄積されたタスクを再開）
     */
    cmdResumeQueue(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.resumeQueue);
    }

    /**
     * @summary キューを指定時間停止し再開する
     * @desc cmdPause（キュー停止）を実行し、指定時間（ミリ秒）経過後、自動的に cmdResume（キュー再開） を行います。
     * @param {number} time 停止時間[msec]
     */
    cmdWaitQueue(time = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setUint32(0,Math.abs(parseInt(time,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.waitQueue,buffer);
    }

    /**
     * @summary キューをリセットする
     */
    cmdResetQueue(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.resetQueue);
    }

    /**
     * @summary モーターの状態を読み取る （read専用）
     * @returns {Promise<int|Array>}
     */
    cmdReadStatus(){
        return this.cmdReadRegister(this._MOTOR_COMMAND.readStatus);
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
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.startRecordingTaskset,buffer);
    }

    /**
     * @summary タスクセットの記録を停止する
     */
    cmdStopRecordingTaskset(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.stopRecordingTaskset);
    }

    /**
     * @summary 指定のインデックスのタスクセットを消去する
     * @param {number} index int インデックス
     */
    cmdEraseTaskset(index = 0){
        let buffer = new ArrayBuffer(2);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.eraseTaskset,buffer);
    }

    /**
     * @summary 全てのタスクセットを消去する
     */
    cmdEraseAllTaskset(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.eraseAllTaskset);
    }

    /**
     * @summary タスクセットの記録名設定
     * @desc タスクセットの記録名を設定する。（これから記録するものに対して）
     */
    cmdSetTasksetName(name){
        let buffer= (new Uint8Array([].map.call(name, function(c) {
            return c.charCodeAt(0);
        }))).buffer;
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.setTasksetName,buffer);
    }

    //---------------------//
    // section::ティーチング
    //---------------------//
    /**
     * @summary ダイレクトティーチング開始（準備なし）
     * @desc KM-1 の場合、インデックスの値は 0～19 （計20個記録）となる。記録時間は 65408 [msec] を超えることはできない
     *       記憶するインデックスのメモリはbleEraseMotion により予め消去されている必要がある
     *
     * @param {number} index int インデックス [0-19]
     * @param {number} time int 記録時間 [msec 0-65408]
     */
    cmdStartTeachingMotion(index = 0,lengthRecordingTime = 0){
        let buffer = new ArrayBuffer(6);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(lengthRecordingTime,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.startTeachingMotion,buffer);
    }

    /**
     * @summary 実行中のティーチングを停止する
     */
    cmdStopTeachingMotion(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.stopTeachingMotion);
    }

    /**
     * @summary 指定したインデックスのモーションを消去する
     * @param {number} index int インデックス
     *
     * @desc KM-1 の場合、インデックスの値は 0～19 （計20個記録）となる
     *
     */
    cmdEraseMotion(index = 0){
        let buffer = new ArrayBuffer(2);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.eraseMotion,buffer);
    }

    /**
     * @summary 全てのモーションを消去する
     */
    cmdEraseAllMotion(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.eraseAllMotion);
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
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.led,buffer);
    }

    //---------------------//
    // IMU ジャイロ
    //---------------------//

    /**
     * @summary IMU(ジャイロ)の値取得(通知)を開始する
     * @desc 本コマンドを実行すると、IMUのデータはBLEのキャラクタリスティクスMOTOR_IMU_MEASUREMENTに通知される<br>
     * MOTOR_IMU_MEASUREMENTのnotifyはイベントタイプ KMMotorCommandKMOne.EVENT_TYPE.imuMeasurement に通知
     */
    cmdEnableIMUMeasurement(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.enableIMUMeasurement);
    }

    /**
     * @summary IMU(ジャイロ)の値取得(通知)を停止する
     */
    cmdDisableIMUMeasurement(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.disableIMUMeasurement);
    }

    //---------------------//
    // IMU モーター
    //---------------------//
    /**
     * @summary モーターの測定値（位置・速度・トルク）出力を開始する
     * @desc デフォルトではモーター起動時on。 motorMeasurementByDefault() 参照
     * @ignore
     */
    cmdEnableMotorMeasurement(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.enableMotorMeasurement);
    }
    /**
     * @summary モーターの測定値（位置・速度・トルク）出力を停止する
     * @ignore
     */
    cmdDisableMotorMeasurement(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.disableMotorMeasurement);
    }

    //---------------------//
    // システム
    //---------------------//
    /**
     * @summary システムを再起動する
     * @desc BLEに接続していた場合、切断してから再起動
     */
    cmdReboot(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.reboot);
    }
    /**
     * @summary チェックサム（CRC16) 有効化
     * @desc コマンド（タスク）のチェックサムを有効化する
     * @param {number} isEnabled 0:Disbled, 1:Enabled
     */
    cmdEnableCheckSum(isEnabled){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,isEnabled?1:0);
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.enableCheckSum,buffer);
    }

    /**
     * @summary ファームウェアアップデートモードに入る
     * @desc ファームウェアをアップデートするためのブートローダーモードに入る。（システムは再起動される。）
     */
    cmdEnterDeviceFirmwareUpdate(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.enterDeviceFirmwareUpdate);
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
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(maxSpeed,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.maxSpeed,buffer);
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
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.minSpeed,buffer);
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
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.curveType,buffer);
    }

    /**
     * @summary モーターの加速度を設定する
     * @param {number} acc float 加速度 0-200 [radian / second^2]（正の値）
     * @desc acc は、モーションコントロール ON の場合、加速時に使用されます。（加速時の直線の傾き）
     */
    cmdAcc(acc = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(acc,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.acc,buffer);
    }

    /**
     * @summary モーターの減速度を設定する
     * @param {number} dec float 減速度 0-200 [radian / second^2]（正の値）
     * @desc dec は、モーションコントロール ON の場合、減速時に使用されます。（減速時の直線の傾き）
     */
    cmdDec(dec = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(dec,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.dec,buffer);
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
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.maxTorque,buffer);
    }

    /**
     * @summary ダイレクトティーチングのサンプリング間隔
     * @desc ティーチング・プレイバックの実行間隔
     * @param {number} interval ms（2-1000  0, 1msはエラーとなる）
     */
    cmdTeachingInterval(interval){
        if(interval===undefined){return;}
        let _interval=Math.abs(parseInt(interval,10));
        _interval=_interval<2?2:_interval;
        _interval=_interval>1000?1000:_interval;
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setUint32(0,_interval);
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.teachingInterval,buffer);
    }
    /**
     * @summary 記憶再生時の再生間隔
     * @desc  記憶再生時の再生間隔
     * @param {number} interval ms（2-1000  0, 1msはエラーとなる）
     */
    cmdPlaybackInterval(interval){
        if(interval===undefined){return;}
        let _interval=Math.abs(parseInt(interval,10));
        _interval=_interval<2?2:_interval;
        _interval=_interval>1000?1000:_interval;
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setUint32(0,_interval);
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.playbackInterval,buffer);
    }


    /**
     * @summary モーターのq軸電流PIDコントローラのP（比例）ゲインを設定する
     * @param {number} qCurrentP float q電流Pゲイン（正の値）
     */
    cmdQCurrentP(qCurrentP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentP,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.qCurrentP,buffer);
    }

    /**
     * @summary モーターのq軸電流PIDコントローラのP（比例）ゲインを設定する
     * @param {number} qCurrentI float q電流Iゲイン（正の値）
     */
    cmdQCurrentI(qCurrentI){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentI,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.qCurrentI,buffer);
    }

    /**
     * @summary モーターのq軸電流PIDコントローラのD（微分）ゲインを設定する
     * @param {number} qCurrentD float q電流Dゲイン（正の値）
     */
    cmdQCurrentD(qCurrentD){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentD,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.qCurrentD,buffer);
    }

    /**
     * @summary モーターのq軸電流PIDコントローラのD（微分）ゲインを設定する
     * @param {number} speedP float 速度Pゲイン（正の値）
     */
    cmdSpeedP(speedP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedP,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.speedP,buffer);
    }

    /**
     * @summary モーターの速度PIDコントローラのI（積分）ゲインを設定する
     * @param {number} speedI float 速度Iゲイン（正の値）
     */
    cmdSpeedI(speedI){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedI,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.speedI,buffer);
    }

    /**
     * @summary モーターの速度PIDコントローラのD（微分）ゲインを設定する
     * @param {number} speedD float 速度Dゲイン（正の値）
     */
    cmdSpeedD(speedD){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedD,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.speedD,buffer);
    }

    /**
     * @summary モーターの位置制御Pパラメタをセット
     * @param {number} positionP float [1.0000 - 20.0000]（デフォルト 5.0）
     */
    cmdPositionP(positionP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(positionP,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.positionP,buffer);
    }
    /**
     * @summary モーターの位置制御Iパラメタをセット
     * @param {number} positionI float [1.0000 - 100.0000]（デフォルト 10.0）
     */
    cmdPositionI(positionI){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(positionI,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.positionI,buffer);
    }
    /**
     * @summary モーターの位置制御Dパラメタをセット
     * @param {number} positionD float [0.0001 - 0.2]（デフォルト 0.01）
     */
    cmdPositionD(positionD){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(positionD,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.positionD,buffer);
    }

    /**
     * @summary モーターの位置制御時、ID制御を有効にする偏差の絶対値を指定する
     * @param {number} threshold float [0.0 - n]（デフォルト 0.0139626f // 0.8deg）
     */
    cmdPosControlThreshold(threshold){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(threshold,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.posControlThreshold,buffer);
    }

    /**
     * @summary 位置制御時、目標位置に到達時、判定条件を満たした場合通知を行う。
     * @desc 判定条件： tolerance 内に位置が入っている状態が、settleTime 連続で続くと、通知(KM_SUCCESS_ARRIVAL)が一回行われる。
     * <ul>
     *     <li>tolerance内に位置が入っている状態が、settleTimeの間連続で続くと通知がトリガーされる。</li>
     *     <li>toleranceに一瞬でも入ってsettleTime未満で出ると通知トリガーは削除され、通知は行われない。</li>
     *     <li>toleranceに一度も入らない場合、通知トリガーは残り続ける。(トリガーの明示的な消去は cmdNotifyPosArrival(0,0,0) )</li>
     *     <li>再度notifyPosArrivalで設定を行うと、以前の通知トリガーは消える。</li>
     * </ul>
     * @param  {number} isEnabled 0:Disbled, 1:Enabled
     * @param {number} tolerance float [0.0 - n] 許容誤差 radian (デフォルト ≒ 0.1deg）
     * @param {number} settleTime int [0 - n] 判定時間 ミリ秒 (デフォルト 200ms）
     *
     */
    cmdNotifyPosArrival(isEnabled=0,tolerance=0.00174533,settleTime=200){
        let buffer = new ArrayBuffer(9);
        new DataView(buffer).setUint8(0,isEnabled?1:0);
        new DataView(buffer).setFloat32(1,Math.abs(parseFloat(tolerance,10)));
        new DataView(buffer).setUint32(5,Math.abs(parseInt(settleTime,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.notifyPosArrival,buffer);
    }


    /**
     * @summary 全てのPIDパラメータをリセットしてファームウェアの初期設定に戻す
     * @desc qCurrentP, qCurrentI,  qCurrentD, speedP, speedI, speedD, positionP をリセットします
     *
     */
    cmdResetPID(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.resetPID);
    }

    /**
     * @summary モーター測定値の取得間隔設定
     * @desc 有線（USB, I2C）のみ有効。BLEでは固定 100ms 間隔で通知される。
     * @param {KMMotorCommandKMOne.cmdMotorMeasurementInterval_MOTOR_MEAS_INTERVAL} cmdMotorMeasurementInterval_MOTOR_MEAS_INTERVAL enum モーター測定値の取得間隔
     */
    cmdMotorMeasurementInterval(cmdMotorMeasurementInterval_MOTOR_MEAS_INTERVAL=4){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(cmdMotorMeasurementInterval_MOTOR_MEAS_INTERVAL,10));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.motorMeasurementInterval,buffer);
    }

    /**
     * @summary モーター測定値の取得設定
     * @desc isEnabled = 1 の場合、（位置・速度・トルク）の通知を行う（起動後、interface の設定で優先される通信経路に、自動的に通知が開始される）
     * @param {number} isEnabled 0:Disbled, 1:Enabled
     */
    cmdMotorMeasurementByDefault(isEnabled){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,isEnabled?1:0);
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.motorMeasurementByDefault,buffer);
    }

    /**
     * @summary モーター制御手段（インターフェイス）の設定
     * @desc uint8_t flags ビットにより、含まれるパラメータを指定する（１の場合含む・0の場合含まない）
     * @param {number} bitFlg
     * ---------------------------------------------------------------
     * bit7    bit6    bit5    bit4    bit3    bit2    bit1    bit0
     * 物理                     有線     有線                      無線
     * ボタン    ＊      ＊      I2C     USB       ＊      ＊     BLE
     * デフォルト	             デフォルト  デフォルト              デフォルト
     * ---------------------------------------------------------------
     */
    cmdInterface(bitFlg){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(bitFlg,10));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.interface,buffer);
    }

    /**
     * @summary コマンドを受信したときに成功通知（errorCode = 0）をするかどうか
     * @param {number} isEnabled 0:通知しない, 1:通知する
     */
    cmdResponse(isEnabled){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,isEnabled?1:0);
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.response,buffer);
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
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.ownColor,buffer);
    }

    /**
     * @summary ６軸センサー（加速度・ジャイロ）測定値の取得間隔
     * @desc 有線（USB, I2C）のみ有効。BLEでは固定 100ms 間隔で通知される。
     * @param {KMMotorCommandKMOne.cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL} cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL enum 加速度・ジャイロ測定値の取得間隔
     */
    cmdIMUMeasurementInterval(cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL=4){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL,10));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.iMUMeasurementInterval,buffer);
    }

    /**
     * @summary ６軸センサー（加速度・ジャイロ）の値の通知をデフォルトで開始する
     * @desc isEnabled = true の場合、enableIMU() を送信しなくても起動時に自動で通知が開始される
     * @param {number} isEnabled 0:Disbled, 1:Enabled
     */
    cmdIMUMeasurementByDefault(isEnabled){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(isEnabled,10));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.iMUMeasurementByDefault,buffer);
    }

    /**
     * @summary 指定した設定値を取得
     * @param {number | array} registers <int | []> 取得するプロパティのコマンド(レジスタ番号)値
     * @returns {Promise.<int | array>} 取得した値 <br>registersがint=レジスタ値のプリミティブ値 <br>registersがArray=レジスタ値のオブジェクト
     *
     * @none 取得する値はコマンド実行後にBLEのキャラクタリスティクスMOTOR_SETTINGに通知される。<br>
     *       それを拾ってpromiseオブジェクトののresolveに返して処理を繋ぐ<br>
     *       MOTOR_SETTINGのnotifyは_onBleMotorSettingで取得
     */

    cmdReadRegister(registers){
        if(Array.isArray(registers)){
            return new Promise((allresolve, allreject)=> {
                let promiseList=[];
                for(let i=0;i<registers.length;i++){
                    let register=parseInt(registers[i],10);
                    promiseList.push( new Promise((resolve, reject)=> {
                        let ccp=new _KMNotifyPromis(register,this._REV_MOTOR_COMMAND[register],this._notifyPromisList,resolve,reject,5000);//notify経由のresultをPromisと紐付け
                        let buffer = new ArrayBuffer(1);
                        new DataView(buffer).setUint8(0, register);
                        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.readRegister, buffer,ccp);
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
                let register=parseInt(registers,10);
                new Promise((resolve, reject)=> {
                    let ccp=new _KMNotifyPromis(register,this._REV_MOTOR_COMMAND[register],this._notifyPromisList,resolve,reject,1000);//notify経由のresultをPromisと紐付け
                    let buffer = new ArrayBuffer(1);
                    new DataView(buffer).setUint8(0,register);
                    this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.readRegister, buffer,ccp);
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
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.saveAllRegisters);
    }

    //////リセット
    /**
     * @summary 指定したレジスタをファームウェアの初期値にリセットする
     * @param {KMMotorCommandKMOne.cmdReadRegister_COMMAND} register 初期値にリセットするコマンド(レジスタ)値
     */
    cmdResetRegister(register){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(register,10));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.resetRegister,buffer);
    }
    /**
     * @summary 全てのレジスタをファームウェアの初期値にリセットする
     * @desc bleSaveAllRegistersを実行しない限り、リセット値はモーターに永久的に保存されない(再起動で消える)
     */
    cmdResetAllRegisters(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.resetAllRegisters);
    }
    /**
     * @summary デバイスネームの取得
     * @desc デバイスネームを読み取る
     * @returns {Promise<int|Array>}
     */
    cmdReadDeviceName(){
        return this.cmdReadRegister(this._MOTOR_COMMAND.readDeviceName);
    }

    /**
     * @summary デバイス情報の取得
     * @desc デバイスインフォメーションを読み取る
     * @returns {Promise<any>}
     */
    cmdReadDeviceInfo(){
        return this.cmdReadRegister(this._MOTOR_COMMAND.readDeviceInfo);
    }

    /**
     * @summary I2Cスレーブアドレス
     * @desc I2Cから制御する場合のスレーブアドレス（0x00-0xFF）を設定する
     * @param {number} address アドレス
     */
    cmdSetI2CSlaveAddress(address){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(address,10));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.setI2CSlaveAddress,buffer);
    }

    /********************************************
     * 内部
     ********************************************/
    _isInstancOfPromise(any){
        return obj instanceof Promise || (obj && typeof obj.then === 'function');
    }

    /**
     * 他の移動系のコマンドを実行時、既に移動系のSyncコマンドが実行されている場合はそのCBをRejectする
     * 移動系のSyncコマンド（cmdMoveByDistanceSync、cmdMoveToPositionSync）等
     * @private
     */
    _moveSyncInstructionOverrideReject(cid){
        if(this._PositionArrivalNotification){
            this._PositionArrivalNotification.callReject({id:this._PositionArrivalNotification.tagName,msg:'Instruction override',overrideId:cid});
            this._PositionArrivalNotification=null;
        }
    }


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
        if(!Array.isArray(groupArray)){return;}
        //送信IDの通知 CallbackPromisで呼び出し元のメソッドのPromisに返す
        for(let i=0; i<groupArray.length; i++){
            if( groupArray[i].tagName===tagName ){
                groupArray[i].callResolve(val);
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
        this.groupArray=Array.isArray(groupArray)?groupArray:[];
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
            if( this.groupArray[i]===this){
                this.groupArray.splice(i,1);
                break;
            }
        }
    }

}

module.exports =KMMotorCommandKMOne;



/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
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



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function $getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return $getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = $getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  var args = [];
  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    ReflectApply(this.listener, this.target, args);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      if (typeof listener !== 'function') {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzE0ZjFiYjRmOTM0NmZkMDJjMGMiLCJ3ZWJwYWNrOi8vLy4vbGliL0tNU3RydWN0dXJlcy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01VdGwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0tNQ29tV2ViQkxFLmpzIiwid2VicGFjazovLy8uL2xpYi9LTUNvbm5lY3RvckJyb3dzZXJXUEsuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01Nb3Rvck9uZVdlYkJMRS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01Db21CYXNlLmpzIiwid2VicGFjazovLy8uL2xpYi9LTU1vdG9yQ29tbWFuZEtNT25lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7O1FBRUE7UUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhO0FBQ2IsWUFBWSxtQkFBTyxDQUFDLENBQVM7OztBQUc3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIs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QkFBa0IsT0FBTztBQUN6QixrQkFBa0IsT0FBTztBQUN6QixrQkFBa0IsT0FBTztBQUN6QixrQkFBa0IsT0FBTztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Qsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEIsb0JBQW9CLE9BQU87QUFDM0Isb0JBQW9CLE9BQU87QUFDM0Isb0JBQW9CLE9BQU87QUFDM0Isb0JBQW9CLE9BQU87QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsb0NBQW9DO0FBQ25ELGVBQWUsT0FBTyxpQkFBaUIsZUFBZSxFQUFFO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0EsMkNBQTJDLGFBQWE7QUFDeEQsd0NBQXdDLGFBQWE7QUFDckQsd0NBQXdDLGFBQWE7QUFDckQsMkNBQTJDLGFBQWEsRUFBRSxJQUFJO0FBQzlELGdEQUFnRCxpQkFBaUI7QUFDakUsaURBQWlELGlCQUFpQjtBQUNsRSxnREFBZ0QsUUFBUSxFQUFFLGVBQWU7QUFDekU7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQzs7QUFFM0M7QUFDQTtBQUNBLHVEQUF1RCxtREFBbUQ7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtDQUErQztBQUMvQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlFQUFpRTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFdBQVc7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCLG1CQUFtQixXQUFXO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQSxzRUFBc0Usb0dBQW9HO0FBQzFLO0FBQ0E7QUFDQSx1RUFBdUUseUdBQXlHO0FBQ2hMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxtQkFBbUIsT0FBTztBQUMxQixtQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxREFBcUQ7QUFDckQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDs7QUFFckQ7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBLHFEQUFxRDtBQUNyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0VBQXdFO0FBQ3hFO0FBQ0E7QUFDQSxRQUFRO0FBQ1I7QUFDQSxRQUFRO0FBQ1IsMkJBQTJCO0FBQzNCLFFBQVE7QUFDUixlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixpQkFBaUI7QUFDakI7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxREFBcUQ7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBLHNIQUFzSDtBQUN0SDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLE9BQU87QUFDdkIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscURBQXFEO0FBQ3JEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3RUFBd0U7QUFDeEU7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBLFFBQVE7QUFDUiwyQkFBMkI7QUFDM0IsUUFBUTtBQUNSLGdCQUFnQixPQUFPO0FBQ3ZCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEIsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxxREFBcUQ7O0FBRXJEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscURBQXFEO0FBQ3JEOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLDREQUE0RDtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUscUNBQXFDO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSw0Q0FBNEM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFD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LG1CQUFtQixTQUFTO0FBQzVCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixzQkFBc0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBLGlDQUFpQyxRQUFRO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0Esc0NBQXNDLFFBQVE7QUFDOUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEseUJBQXlCO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLGdCQUFnQjtBQUNqQztBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJLTUNvbm5lY3RvckJyb3dzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCAzMTRmMWJiNGY5MzQ2ZmQwMmMwYyIsIi8qKipcbiAqIEtNU3RydWN0dXJlcy5qc1xuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xubGV0IEtNVXRsID0gcmVxdWlyZSgnLi9LTVV0bCcpO1xuXG5cbi8qKlxuICogQGNsYXNzZGVzYyDmp4vpgKDkvZPjga7ln7rlupXjgq/jg6njgrlcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01TdHJ1Y3R1cmVCYXNle1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOWQjOOBmOWApOOCkuaMgeOBpOOBi+OBruavlOi8g1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXIg5q+U6LyD44GZ44KL5qeL6YCg5L2TXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IOe1kOaenFxuICAgICAqL1xuICAgIEVRICh0YXIpIHtcbiAgICAgICAgaWYoISB0YXIgKXtyZXR1cm4gZmFsc2U7fVxuICAgICAgICBpZih0aGlzLmNvbnN0cnVjdG9yPT09dGFyLmNvbnN0cnVjdG9yKXtcbiAgICAgICAgICAgIGlmKHRoaXMuR2V0VmFsQXJyYXkpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLkdldFZhbEFycmF5KCkudG9TdHJpbmcoKT09PXRhci5HZXRWYWxBcnJheSgpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9ZWxzZSBpZih0aGlzLkdldFZhbE9iail7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuR2V0VmFsT2JqKCkpPT09SlNPTi5zdHJpbmdpZnkodGFyLkdldFZhbE9iaigpKTsvLyBiYWQ6OumBheOBhFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDopIfoo71cbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSDopIfoo73jgZXjgozjgZ/mp4vpgKDkvZNcbiAgICAgKi9cbiAgICBDbG9uZSAoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyB0aGlzLmNvbnN0cnVjdG9yKCksdGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOWApOOBruWPluW+l++8iE9iau+8iVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAgICovXG4gICAgR2V0VmFsT2JqICgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5YCk44Gu5Y+W5b6X77yI6YWN5YiX77yJXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIEdldFZhbEFycmF5ICgpIHtcbiAgICAgICAgbGV0IGs9T2JqZWN0LmtleXModGhpcyk7XG4gICAgICAgIGxldCByPVtdO1xuICAgICAgICBmb3IobGV0IGk9MDtpPGsubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICByLnB1c2godGhpc1trW2ldXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5YCk44Gu5LiA5ous6Kit5a6a77yIT2Jq77yJXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHByb3BzT2JqIOioreWumuOBmeOCi+ODl+ODreODkeODhuOCo1xuICAgICAqL1xuICAgIFNldFZhbE9iaiAocHJvcHNPYmopIHtcbiAgICAgICAgaWYodHlwZW9mIHByb3BzT2JqICE9PVwib2JqZWN0XCIpe3JldHVybjt9XG4gICAgICAgIGxldCBrZXlzPU9iamVjdC5rZXlzKHByb3BzT2JqKTtcbiAgICAgICAgZm9yKGxldCBrPTA7azxrZXlzLmxlbmd0aDtrKyspe1xuICAgICAgICAgICAgbGV0IHBuPWtleXNba107XG4gICAgICAgICAgICBpZih0aGlzLmhhc093blByb3BlcnR5KHBuKSl7XG4gICAgICAgICAgICAgICAgdGhpc1twbl09cHJvcHNPYmpbcG5dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59XG5cblxuLyoqXG4gKiBAY2xhc3NkZXNjIFhZ5bqn5qiZ44Gu5qeL6YCg5L2T44Kq44OW44K444Kn44Kv44OIXG4gKiBAaWdub3JlXG4gKi9cbmNsYXNzIEtNVmVjdG9yMiBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICAgICpcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoeD0wLCB5PTApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDnm7jlr77kvY3nva7jgbjnp7vli5VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHlcbiAgICAgKi9cbiAgICBNb3ZlIChkeCA9MCwgZHkgPSAwKSB7XG4gICAgICAgIHRoaXMueCArPSBkeDtcbiAgICAgICAgdGhpcy55ICs9IGR5O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAy54K56ZaT44Gu6Led6ZuiXG4gICAgICogQHBhcmFtIHtLTVZlY3RvcjJ9IHZlY3RvcjJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIERpc3RhbmNlICh2ZWN0b3IyKSB7XG4gICAgICAgIGlmICghKHZlY3RvcjIgaW5zdGFuY2VvZiBLTVZlY3RvcjIpKSB7cmV0dXJuO31cbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdygodGhpcy54LXZlY3RvcjIueCksMikgKyBNYXRoLnBvdygodGhpcy55LXZlY3RvcjIueSksMikpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAy54K56ZaT44Gu6KeS5bqmXG4gICAgICogQHBhcmFtIHtLTVZlY3RvcjJ9IHZlY3RvcjJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIFJhZGlhbiAodmVjdG9yMikge1xuICAgICAgICBpZiAoISh2ZWN0b3IyIGluc3RhbmNlb2YgS01WZWN0b3IyKSkge3JldHVybjt9XG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueS12ZWN0b3IyLnksdGhpcy54LXZlY3RvcjIueCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIDAsMOOBi+OCieOBrui3nembolxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgRGlzdGFuY2VGcm9tWmVybygpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh0aGlzLngsMikgKyBNYXRoLnBvdyh0aGlzLnksMikpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAwLDDjgYvjgonjga7op5LluqZcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSByYWRpYW5cbiAgICAgKi9cbiAgICBSYWRpYW5Gcm9tWmVybygpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy55LHRoaXMueCk7XG4gICAgfVxufVxuXG5cblxuLyoqXG4gKiBAY2xhc3NkZXNjIOOCuOODo+OCpOODreOCu+ODs+OCteODvOWApFxuICovXG5jbGFzcyBLTUltdVN0YXRlIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBleHRlbmRzIEtNU3RydWN0dXJlQmFzZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY2NlbFgg5Yqg6YCf5bqmKHgpIFvCsSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY2NlbFkg5Yqg6YCf5bqmKHkpIFvCsSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY2NlbFog5Yqg6YCf5bqmKHopIFvCsSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0ZW1wIOa4qeW6piBDXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGd5cm9YIOinkumAn+W6pih4KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZ3lyb1kg6KeS6YCf5bqmKHkpIFvCsSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBneXJvWiDop5LpgJ/luqYoeikgW8KxIDFdXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKGFjY2VsWCwgYWNjZWxZLCBhY2NlbFosIHRlbXAsIGd5cm9YLCBneXJvWSwgZ3lyb1ogKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5hY2NlbFg9IEtNVXRsLnRvTnVtYmVyKGFjY2VsWCk7XG4gICAgICAgIHRoaXMuYWNjZWxZPSBLTVV0bC50b051bWJlcihhY2NlbFkpO1xuICAgICAgICB0aGlzLmFjY2VsWj0gS01VdGwudG9OdW1iZXIoYWNjZWxaKTtcbiAgICAgICAgdGhpcy50ZW1wPSBLTVV0bC50b051bWJlcih0ZW1wKTtcbiAgICAgICAgdGhpcy5neXJvWD0gS01VdGwudG9OdW1iZXIoZ3lyb1gpO1xuICAgICAgICB0aGlzLmd5cm9ZPSBLTVV0bC50b051bWJlcihneXJvWSk7XG4gICAgICAgIHRoaXMuZ3lyb1o9IEtNVXRsLnRvTnVtYmVyKGd5cm9aKTtcbiAgICB9XG59XG4vKipcbiAqIEtFSUdBTuODouODvOOCv+ODvExFROOAgOeCueeBr+ODu+iJsueKtuaFi1xuICogU3RhdGUgTU9UT1JfTEVEX1NUQVRFXG4gKiBjb2xvclIgMC0yNTVcbiAqIGNvbG9yRyAwLTI1NVxuICogY29sb3JCIDAtMjU1XG4gKiAqL1xuLyoqXG4gKiBAY2xhc3NkZXNjIOODouODvOOCv+ODvExFROOAgOeCueeBr+ODu+iJsueKtuaFi1xuICovXG5jbGFzcyBLTUxlZFN0YXRlIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga5MRUTnirbmhYtcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9MRURfU1RBVEVfT0ZGIC0gMDpMRUTmtojnga9cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTEVEX1NUQVRFX09OX1NPTElEIC0gMTpMRUTngrnnga9cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTEVEX1NUQVRFX09OX0ZMQVNIIC0gMjpMRUTngrnmu4XvvIjkuIDlrprplpPpmpTjgafngrnmu4XvvIlcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTEVEX1NUQVRFX09OX0RJTSAtIDM6TEVE44GM44KG44Gj44GP44KK6Lyd5bqm5aSJ5YyW44GZ44KLXG4gICAgICovXG4gICAgc3RhdGljIGdldCBNT1RPUl9MRURfU1RBVEUoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgXCJNT1RPUl9MRURfU1RBVEVfT0ZGXCI6MCxcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09OX1NPTElEXCI6MSxcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09OX0ZMQVNIXCI6MixcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09OX0RJTVwiOjNcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICogQGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlXG4gICAgICogQHBhcmFtIHtLTUxlZFN0YXRlLk1PVE9SX0xFRF9TVEFURX0gc3RhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY29sb3JSIGludCBbMC0yNTVdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbG9yRyBpbnQgWzAtMjU1XVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb2xvckIgaW50IFswLTI1NV1cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdGF0ZSxjb2xvclIsY29sb3JHLGNvbG9yQikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnN0YXRlPUtNVXRsLnRvTnVtYmVyKHN0YXRlKTtcbiAgICAgICAgdGhpcy5jb2xvclI9S01VdGwudG9OdW1iZXIoY29sb3JSKTtcbiAgICAgICAgdGhpcy5jb2xvckc9S01VdGwudG9OdW1iZXIoY29sb3JHKTtcbiAgICAgICAgdGhpcy5jb2xvckI9S01VdGwudG9OdW1iZXIoY29sb3JCKTtcbiAgICB9XG59XG5cbi8qKlxuICogQGNsYXNzZGVzYyDjg6Ljg7zjgr/jg7zlm57ou6Lmg4XloLFcbiAqL1xuY2xhc3MgS01Sb3RTdGF0ZSBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICog5pyA5aSn44OI44Or44Kv5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE1BWF9UT1JRVUUoKXtcbiAgICAgICAgcmV0dXJuIDAuMzsvLzAuMyBO44O7bVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOacgOWkp+mAn+W6puWumuaVsChycG0pXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE1BWF9TUEVFRF9SUE0oKXtcbiAgICAgICAgcmV0dXJuIDMwMDsvLzMwMHJwbVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDmnIDlpKfpgJ/luqblrprmlbAocmFkaWFuL3NlYylcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgTUFYX1NQRUVEX1JBRElBTigpe1xuICAgICAgICByZXR1cm4gS01VdGwucnBtVG9SYWRpYW5TZWMoMzAwKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICog5pyA5aSn5bqn5qiZ5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE1BWF9QT1NJVElPTigpe1xuICAgICAgICByZXR1cm4gMypNYXRoLnBvdygxMCwzOCk7Ly9pbmZvOjrjgIxyZXR1cm7jgIAzZSszOOOAjeOBr21pbmlmeeOBp+OCqOODqeODvFxuICAgICAgICAvL3JldHVybuOAgDNlKzM4Oy8vcmFkaWFuIDRieXRlIGZsb2F044CAMS4xNzU0OTQgMTAtMzggIDwgMy40MDI4MjMgMTArMzhcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBleHRlbmRzIEtNU3RydWN0dXJlQmFzZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiDluqfmqJlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmVsb2NpdHkg6YCf5bqmXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvcnF1ZSDjg4jjg6vjgq9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbiwgdmVsb2NpdHksIHRvcnF1ZSkge1xuICAgICAgICAvL+acieWKueahgeaVsCDlsI/mlbDnrKw05L2NXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBNYXRoLmZsb29yKEtNVXRsLnRvTnVtYmVyKHBvc2l0aW9uKSoxMDAwMCkvMTAwMDA7XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBNYXRoLmZsb29yKEtNVXRsLnRvTnVtYmVyKHZlbG9jaXR5KSoxMDAwMCkvMTAwMDA7XG4gICAgICAgIHRoaXMudG9ycXVlID0gTWF0aC5mbG9vcihLTVV0bC50b051bWJlcih0b3JxdWUpKjEwMDAwKS8xMDAwMDtcbiAgICB9XG59XG5cblxuLyoqXG4gKiBAY2xhc3NkZXNjIOODh+ODkOOCpOOCueaDheWgsVxuICovXG5jbGFzcyBLTURldmljZUluZm8gZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICogQGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLktNX0NPTk5FQ1RfVFlQRX0gdHlwZSDmjqXntprmlrnlvI9cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaWQg44OH44OQ44Kk44K5VVVJRFxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIOODouODvOOCv+ODvOWQjSjlvaLlvI8gSUQgTEVEQ29sb3IpXG4gICAgICogQHBhcmFtIHtib29sZWFufSBpc0Nvbm5lY3Qg5o6l57aa54q25oWLXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG1hbnVmYWN0dXJlck5hbWUg6KO96YCg5Lya56S+5ZCNXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGhhcmR3YXJlUmV2aXNpb25cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmlybXdhcmVSZXZpc2lvblxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHR5cGU9MCxpZD1cIlwiLG5hbWU9XCJcIixpc0Nvbm5lY3Q9ZmFsc2UsbWFudWZhY3R1cmVyTmFtZT1udWxsLGhhcmR3YXJlUmV2aXNpb249bnVsbCxmaXJtd2FyZVJldmlzaW9uPW51bGwpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy50eXBlPXR5cGU7XG4gICAgICAgIHRoaXMuaWQ9aWQ7XG4gICAgICAgIHRoaXMubmFtZT1uYW1lO1xuICAgICAgICB0aGlzLmlzQ29ubmVjdD1pc0Nvbm5lY3Q7XG4gICAgICAgIHRoaXMubWFudWZhY3R1cmVyTmFtZT1tYW51ZmFjdHVyZXJOYW1lO1xuICAgICAgICB0aGlzLmhhcmR3YXJlUmV2aXNpb249aGFyZHdhcmVSZXZpc2lvbjtcbiAgICAgICAgdGhpcy5maXJtd2FyZVJldmlzaW9uPWZpcm13YXJlUmV2aXNpb247XG5cbiAgICB9XG59XG4vKipcbiAqIEBjbGFzc2Rlc2Mg44Oi44O844K/44O844Ot44Kw5oOF5aCxXG4gKi9cbmNsYXNzIEtNTW90b3JMb2cgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSBpZCB7bnVtYmVyfSDjgrfjg7zjgrHjg7PjgrlJRCjjg6bjg4vjg7zjgq/lgKQpXG4gICAgICogQHBhcmFtIGNtZE5hbWUge3N0cmluZ30g5a6f6KGM44Kz44Oe44Oz44OJ5ZCNXG4gICAgICogQHBhcmFtIGNtZElEIHtudW1iZXJ9IOWun+ihjOOCs+ODnuODs+ODiUlEXG4gICAgICogQHBhcmFtIGVycklEIHtudW1iZXJ9IOOCqOODqeODvOOCv+OCpOODl1xuICAgICAqIEBwYXJhbSBlcnJUeXBlIHtzdHJpbmd9IOOCqOODqeODvOeoruWIpVxuICAgICAqIEBwYXJhbSBlcnJNc2cge3N0cmluZ33jgIDjg6Hjg4Pjgrvjg7zjgrjlhoXlrrlcbiAgICAgKiBAcGFyYW0gaW5mbyB7bnVtYmVyfVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChpZD0wLGNtZE5hbWU9XCJcIixjbWRJRD0wLGVycklEPTAsZXJyVHlwZT1cIlwiLGVyck1zZz1cIlwiLGluZm89MCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLmlkPSBpZDtcbiAgICAgICAgdGhpcy5jbWROYW1lPWNtZE5hbWU7XG4gICAgICAgIHRoaXMuY21kSUQ9IGNtZElEO1xuICAgICAgICB0aGlzLmVycklEPWVycklEO1xuICAgICAgICB0aGlzLmVyclR5cGU9IGVyclR5cGU7XG4gICAgICAgIHRoaXMuZXJyTXNnPSBlcnJNc2c7XG4gICAgICAgIHRoaXMuaW5mbz0gaW5mbztcbiAgICB9XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgS01TdHJ1Y3R1cmVCYXNlOktNU3RydWN0dXJlQmFzZSxcbiAgICBLTVZlY3RvcjI6S01WZWN0b3IyLFxuICAgIC8vS01WZWN0b3IzOktNVmVjdG9yMyxcbiAgICBLTUltdVN0YXRlOktNSW11U3RhdGUsXG4gICAgS01MZWRTdGF0ZTpLTUxlZFN0YXRlLFxuICAgIEtNUm90U3RhdGU6S01Sb3RTdGF0ZSxcbiAgICBLTURldmljZUluZm86S01EZXZpY2VJbmZvLFxuICAgIEtNTW90b3JMb2c6S01Nb3RvckxvZ1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNU3RydWN0dXJlcy5qc1xuLy8gbW9kdWxlIGlkID0gMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKipcbiAqIEtNVXRsLmpzXG4gKiBDQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEBjbGFzc2Rlc2Mg44Om44O844OG44Kj44Oq44OG44KjXG4gKi9cbmNsYXNzIEtNVXRse1xuXG4gICAgLyoqXG4gICAgICog5pWw5YCk44Gr44Kt44Oj44K544OI44GZ44KL6Zai5pWwXG4gICAgICog5pWw5YCk5Lul5aSW44GvMOOCkui/lOOBmTxicj5cbiAgICAgKiBJbmZpbml0eeOCgjDjgajjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlZmF1bHR2YWwgdmFs44GM5pWw5YCk44Gr5aSJ5o+b5Ye65p2l44Gq44GE5aC05ZCI44Gu44OH44OV44Kp44Or44OIXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgdG9OdW1iZXIodmFsLCBkZWZhdWx0dmFsID0gMCkge1xuICAgICAgICBsZXQgdiA9IHBhcnNlRmxvYXQodmFsLCAxMCk7XG4gICAgICAgIHJldHVybiAoIWlzRmluaXRlKHYpID8gZGVmYXVsdHZhbCA6IHYpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICog5pWw5YCk44Gr44Kt44Oj44K544OI44GZ44KL6Zai5pWwIGludOWbuuWumlxuICAgICAqIOaVsOWApOS7peWkluOBrzDjgpLov5TjgZk8YnI+XG4gICAgICogSW5maW5pdHnjgoIw44Go44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWZhdWx0dmFsIHZhbOOBjOaVsOWApOOBq+WkieaPm+WHuuadpeOBquOBhOWgtOWQiOOBruODh+ODleOCqeODq+ODiFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIHRvSW50TnVtYmVyKHZhbCwgZGVmYXVsdHZhbCA9IDApIHtcbiAgICAgICAgbGV0IHYgPSBwYXJzZUludCh2YWwsIDEwKTtcbiAgICAgICAgcmV0dXJuICghaXNGaW5pdGUodikgPyBkZWZhdWx0dmFsIDogdik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiDop5Lluqbjga7ljZjkvY3lpInmj5vjgIBkZWdyZWUgPj4gcmFkaWFuXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlZ3JlZSDluqZcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSByYWRpYW5cbiAgICAgKi9cbiAgICBzdGF0aWMgZGVncmVlVG9SYWRpYW4oZGVncmVlKSB7XG4gICAgICAgIHJldHVybiBkZWdyZWUgKiAwLjAxNzQ1MzI5MjUxOTk0MzI5NTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICog6KeS5bqm44Gu5Y2Y5L2N5aSJ5o+b44CAcmFkaWFuID4+IGRlZ3JlZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByYWRpYW4gcmFkaWFu6KeSXG4gICAgICogQHJldHVybnMge251bWJlcn0g5bqmXG4gICAgICovXG4gICAgc3RhdGljIHJhZGlhblRvRGVncmVlKHJhZGlhbikge1xuICAgICAgICByZXR1cm4gcmFkaWFuIC8gMC4wMTc0NTMyOTI1MTk5NDMyOTU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIOmAn+W6piBycG0gLT5yYWRpYW4vc2VjIOOBq+WkieaPm1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBycG1cbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSByYWRpYW4vc2VjXG4gICAgICovXG4gICAgc3RhdGljIHJwbVRvUmFkaWFuU2VjKHJwbSkge1xuICAgICAgICAvL+mAn+W6piBycG0gLT5yYWRpYW4vc2VjKE1hdGguUEkqMi82MClcbiAgICAgICAgcmV0dXJuIHJwbSAqIDAuMTA0NzE5NzU1MTE5NjU5Nzc7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiAy54K56ZaT44Gu6Led6Zui44Go6KeS5bqm44KS5rGC44KB44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZyb21feFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tX3lcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9feFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b195XG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgdHdvUG9pbnREaXN0YW5jZUFuZ2xlKGZyb21feCwgZnJvbV95LCB0b194LCB0b195KSB7XG4gICAgICAgIGxldCBkaXN0YW5jZSA9IE1hdGguc3FydChNYXRoLnBvdyhmcm9tX3ggLSB0b194LCAyKSArIE1hdGgucG93KGZyb21feSAtIHRvX3ksIDIpKTtcbiAgICAgICAgbGV0IHJhZGlhbiA9IE1hdGguYXRhbjIoZnJvbV95IC0gdG9feSwgZnJvbV94IC0gdG9feCk7XG4gICAgICAgIHJldHVybiB7ZGlzdDogZGlzdGFuY2UsIHJhZGk6IHJhZGlhbiwgZGVnOiBLTVV0bC5yYWRpYW5Ub0RlZ3JlZShyYWRpYW4pfTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICog44Kz44Oe44Oz44OJ44Gu44OB44Kn44OD44Kv44K144Og44KS6KiI566XXG4gICAgICogQGlnbm9yZVxuICAgICAqIEBkZXNjIOWPs+mAgeOCiiBDUkMtMTYtQ0NJVFQgKHgxNiArIHgxMiArIHg1ICsgMSkgU3RhcnQ6MHgwMDAwIFhPUk91dDoweDAwMDAgQnl0ZU9yZGVyOkxpdHRsZS1FbmRpYW5cbiAgICAgKiBAcGFyYW0gdWludDhhcnJheUJ1ZmZlclxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgc3RhdGljIENyZWF0ZUNvbW1hbmRDaGVja1N1bUNSQzE2KHVpbnQ4YXJyYXlCdWZmZXIpe1xuICAgICAgICBjb25zdCBjcmMxNnRhYmxlPSBfX2NyYzE2dGFibGU7XG4gICAgICAgIGxldCBjcmMgPSAwOy8vIFN0YXJ0OjB4MDAwMFxuICAgICAgICBsZXQgbGVuPXVpbnQ4YXJyYXlCdWZmZXIubGVuZ3RoO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHVpbnQ4YXJyYXlCdWZmZXIubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBjID0gdWludDhhcnJheUJ1ZmZlcltpXTtcbiAgICAgICAgICAgIGNyYyA9IChjcmMgPj4gOCkgXiBjcmMxNnRhYmxlWyhjcmMgXiBjKSAmIDB4MDBmZl07XG4gICAgICAgIH1cbiAgICAgICAgY3JjPSgoY3JjPj44KSYweEZGKXwoKGNyYzw8OCkmMHhGRjAwKTsvLyBCeXRlT3JkZXI6TGl0dGxlLUVuZGlhblxuICAgICAgICAvL2NyYz0weEZGRkZeY3JjOy8vWE9ST3V0OjB4MDAwMFxuICAgICAgICByZXR1cm4gY3JjO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEAjIGluZm86OiBLTUNvbUJMRS5qc+OBrkRFVklDRSBJTkZPUk1BVElPTiBTRVJWSUNF44Gu44OR44O844K544Gr5L2/55SoXG4gICAgICogdXRmLmpzIC0gVVRGLTggPD0+IFVURi0xNiBjb252ZXJ0aW9uXG4gICAgICpcbiAgICAgKiBAaWdub3JlXG4gICAgICogQHBhcmFtIGFycmF5XG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBkZXNjXG4gICAgICogQ29weXJpZ2h0IChDKSAxOTk5IE1hc2FuYW8gSXp1bW8gPGl6QG9uaWNvcy5jby5qcD5cbiAgICAgKiBWZXJzaW9uOiAxLjBcbiAgICAgKiBMYXN0TW9kaWZpZWQ6IERlYyAyNSAxOTk5XG4gICAgICogVGhpcyBsaWJyYXJ5IGlzIGZyZWUuICBZb3UgY2FuIHJlZGlzdHJpYnV0ZSBpdCBhbmQvb3IgbW9kaWZ5IGl0LlxuICAgICAqL1xuICAgIHN0YXRpYyBVdGY4QXJyYXlUb1N0cihhcnJheSkge1xuICAgICAgICBsZXQgb3V0LCBpLCBsZW4sIGM7XG4gICAgICAgIGxldCBjaGFyMiwgY2hhcjM7XG5cbiAgICAgICAgb3V0ID0gXCJcIjtcbiAgICAgICAgbGVuID0gYXJyYXkubGVuZ3RoO1xuICAgICAgICBpID0gMDtcbiAgICAgICAgd2hpbGUoaSA8IGxlbikge1xuICAgICAgICAgICAgYyA9IGFycmF5W2krK107XG4gICAgICAgICAgICBzd2l0Y2goYyA+PiA0KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGNhc2UgMDogY2FzZSAxOiBjYXNlIDI6IGNhc2UgMzogY2FzZSA0OiBjYXNlIDU6IGNhc2UgNjogY2FzZSA3OlxuICAgICAgICAgICAgICAgIC8vIDB4eHh4eHh4XG4gICAgICAgICAgICAgICAgb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYyk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAxMjogY2FzZSAxMzpcbiAgICAgICAgICAgICAgICAvLyAxMTB4IHh4eHggICAxMHh4IHh4eHhcbiAgICAgICAgICAgICAgICBjaGFyMiA9IGFycmF5W2krK107XG4gICAgICAgICAgICAgICAgb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjICYgMHgxRikgPDwgNikgfCAoY2hhcjIgJiAweDNGKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAxNDpcbiAgICAgICAgICAgICAgICAgICAgLy8gMTExMCB4eHh4ICAxMHh4IHh4eHggIDEweHggeHh4eFxuICAgICAgICAgICAgICAgICAgICBjaGFyMiA9IGFycmF5W2krK107XG4gICAgICAgICAgICAgICAgICAgIGNoYXIzID0gYXJyYXlbaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgb3V0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoKChjICYgMHgwRikgPDwgMTIpIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICgoY2hhcjIgJiAweDNGKSA8PCA2KSB8XG4gICAgICAgICAgICAgICAgICAgICAgICAoKGNoYXIzICYgMHgzRikgPDwgMCkpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAIyBpbmZvOjog44OH44OQ44OD44Kw55SoXG4gICAgICogdWludDhBcnJheSA9PiBVVEYtMTYgU3RyaW5ncyBjb252ZXJ0aW9uXG4gICAgICogQGlnbm9yZVxuICAgICAqIEBwYXJhbSB1aW50OEFycmF5XG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBzdGF0aWMgVWludDhBcnJheVRvSGV4U3RyKHVpbnQ4QXJyYXkpe1xuICAgICAgICBpZighdWludDhBcnJheSBpbnN0YW5jZW9mIFVpbnQ4QXJyYXkpe3JldHVybjt9XG4gICAgICAgIGxldCBhcj1bXTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTx1aW50OEFycmF5Lmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgYXIucHVzaCh1aW50OEFycmF5W2ldLnRvU3RyaW5nKDE2KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFyLmpvaW4oJzonKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAIyBpbmZvOjpVaW50OOOBrkNvbmNhdFxuICAgICAqIENyZWF0ZXMgYSBuZXcgVWludDhBcnJheSBiYXNlZCBvbiB0d28gZGlmZmVyZW50IEFycmF5QnVmZmVyc1xuICAgICAqIEBwYXJhbSB7QXJyYXlCdWZmZXJzfSB1OEFycmF5MSBUaGUgZmlyc3QgYnVmZmVyLlxuICAgICAqIEBwYXJhbSB7QXJyYXlCdWZmZXJzfSB1OEFycmF5MiBUaGUgc2Vjb25kIGJ1ZmZlci5cbiAgICAgKiBAcmV0dXJuIHtBcnJheUJ1ZmZlcnN9IFRoZSBuZXcgQXJyYXlCdWZmZXIgY3JlYXRlZCBvdXQgb2YgdGhlIHR3by5cbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgc3RhdGljIFVpbnQ4QXJyYXlDb25jYXQodThBcnJheTEsIHU4QXJyYXkyKSB7XG4gICAgICAgIGxldCB0bXAgPSBuZXcgVWludDhBcnJheSh1OEFycmF5MS5ieXRlTGVuZ3RoICsgdThBcnJheTIuYnl0ZUxlbmd0aCk7XG4gICAgICAgIHRtcC5zZXQobmV3IFVpbnQ4QXJyYXkodThBcnJheTEpLCAwKTtcbiAgICAgICAgdG1wLnNldChuZXcgVWludDhBcnJheSh1OEFycmF5MiksIHU4QXJyYXkxLmJ5dGVMZW5ndGgpO1xuICAgICAgICByZXR1cm4gdG1wO1xuICAgIH1cblxuXG59XG5cbi8qKlxuICogQ3JlYXRlQ29tbWFuZENoZWNrU3VtQ1JDMTbnlKggQ1JD44OG44O844OW44OrXG4gKiBAaWdub3JlXG4gKiBAdHlwZSB7VWludDE2QXJyYXl9XG4gKiBAcHJpdmF0ZVxuICovXG5jb25zdCBfX2NyYzE2dGFibGU9bmV3IFVpbnQxNkFycmF5KFtcbiAgICAwICwgMHgxMTg5ICwgMHgyMzEyICwgMHgzMjliICwgMHg0NjI0ICwgMHg1N2FkICwgMHg2NTM2ICwgMHg3NGJmICxcbiAgICAweDhjNDggLCAweDlkYzEgLCAweGFmNWEgLCAweGJlZDMgLCAweGNhNmMgLCAweGRiZTUgLCAweGU5N2UgLCAweGY4ZjcgLFxuICAgIDB4MTA4MSAsIDB4MDEwOCAsIDB4MzM5MyAsIDB4MjIxYSAsIDB4NTZhNSAsIDB4NDcyYyAsIDB4NzViNyAsIDB4NjQzZSAsXG4gICAgMHg5Y2M5ICwgMHg4ZDQwICwgMHhiZmRiICwgMHhhZTUyICwgMHhkYWVkICwgMHhjYjY0ICwgMHhmOWZmICwgMHhlODc2ICxcbiAgICAweDIxMDIgLCAweDMwOGIgLCAweDAyMTAgLCAweDEzOTkgLCAweDY3MjYgLCAweDc2YWYgLCAweDQ0MzQgLCAweDU1YmQgLFxuICAgIDB4YWQ0YSAsIDB4YmNjMyAsIDB4OGU1OCAsIDB4OWZkMSAsIDB4ZWI2ZSAsIDB4ZmFlNyAsIDB4Yzg3YyAsIDB4ZDlmNSAsXG4gICAgMHgzMTgzICwgMHgyMDBhICwgMHgxMjkxICwgMHgwMzE4ICwgMHg3N2E3ICwgMHg2NjJlICwgMHg1NGI1ICwgMHg0NTNjICxcbiAgICAweGJkY2IgLCAweGFjNDIgLCAweDllZDkgLCAweDhmNTAgLCAweGZiZWYgLCAweGVhNjYgLCAweGQ4ZmQgLCAweGM5NzQgLFxuXG4gICAgMHg0MjA0ICwgMHg1MzhkICwgMHg2MTE2ICwgMHg3MDlmICwgMHgwNDIwICwgMHgxNWE5ICwgMHgyNzMyICwgMHgzNmJiICxcbiAgICAweGNlNGMgLCAweGRmYzUgLCAweGVkNWUgLCAweGZjZDcgLCAweDg4NjggLCAweDk5ZTEgLCAweGFiN2EgLCAweGJhZjMgLFxuICAgIDB4NTI4NSAsIDB4NDMwYyAsIDB4NzE5NyAsIDB4NjAxZSAsIDB4MTRhMSAsIDB4MDUyOCAsIDB4MzdiMyAsIDB4MjYzYSAsXG4gICAgMHhkZWNkICwgMHhjZjQ0ICwgMHhmZGRmICwgMHhlYzU2ICwgMHg5OGU5ICwgMHg4OTYwICwgMHhiYmZiICwgMHhhYTcyICxcbiAgICAweDYzMDYgLCAweDcyOGYgLCAweDQwMTQgLCAweDUxOWQgLCAweDI1MjIgLCAweDM0YWIgLCAweDA2MzAgLCAweDE3YjkgLFxuICAgIDB4ZWY0ZSAsIDB4ZmVjNyAsIDB4Y2M1YyAsIDB4ZGRkNSAsIDB4YTk2YSAsIDB4YjhlMyAsIDB4OGE3OCAsIDB4OWJmMSAsXG4gICAgMHg3Mzg3ICwgMHg2MjBlICwgMHg1MDk1ICwgMHg0MTFjICwgMHgzNWEzICwgMHgyNDJhICwgMHgxNmIxICwgMHgwNzM4ICxcbiAgICAweGZmY2YgLCAweGVlNDYgLCAweGRjZGQgLCAweGNkNTQgLCAweGI5ZWIgLCAweGE4NjIgLCAweDlhZjkgLCAweDhiNzAgLFxuXG4gICAgMHg4NDA4ICwgMHg5NTgxICwgMHhhNzFhICwgMHhiNjkzICwgMHhjMjJjICwgMHhkM2E1ICwgMHhlMTNlICwgMHhmMGI3ICxcbiAgICAweDA4NDAgLCAweDE5YzkgLCAweDJiNTIgLCAweDNhZGIgLCAweDRlNjQgLCAweDVmZWQgLCAweDZkNzYgLCAweDdjZmYgLFxuICAgIDB4OTQ4OSAsIDB4ODUwMCAsIDB4Yjc5YiAsIDB4YTYxMiAsIDB4ZDJhZCAsIDB4YzMyNCAsIDB4ZjFiZiAsIDB4ZTAzNiAsXG4gICAgMHgxOGMxICwgMHgwOTQ4ICwgMHgzYmQzICwgMHgyYTVhICwgMHg1ZWU1ICwgMHg0ZjZjICwgMHg3ZGY3ICwgMHg2YzdlICxcbiAgICAweGE1MGEgLCAweGI0ODMgLCAweDg2MTggLCAweDk3OTEgLCAweGUzMmUgLCAweGYyYTcgLCAweGMwM2MgLCAweGQxYjUgLFxuICAgIDB4Mjk0MiAsIDB4MzhjYiAsIDB4MGE1MCAsIDB4MWJkOSAsIDB4NmY2NiAsIDB4N2VlZiAsIDB4NGM3NCAsIDB4NWRmZCAsXG4gICAgMHhiNThiICwgMHhhNDAyICwgMHg5Njk5ICwgMHg4NzEwICwgMHhmM2FmICwgMHhlMjI2ICwgMHhkMGJkICwgMHhjMTM0ICxcbiAgICAweDM5YzMgLCAweDI4NGEgLCAweDFhZDEgLCAweDBiNTggLCAweDdmZTcgLCAweDZlNmUgLCAweDVjZjUgLCAweDRkN2MgLFxuXG4gICAgMHhjNjBjICwgMHhkNzg1ICwgMHhlNTFlICwgMHhmNDk3ICwgMHg4MDI4ICwgMHg5MWExICwgMHhhMzNhICwgMHhiMmIzICxcbiAgICAweDRhNDQgLCAweDViY2QgLCAweDY5NTYgLCAweDc4ZGYgLCAweDBjNjAgLCAweDFkZTkgLCAweDJmNzIgLCAweDNlZmIgLFxuICAgIDB4ZDY4ZCAsIDB4YzcwNCAsIDB4ZjU5ZiAsIDB4ZTQxNiAsIDB4OTBhOSAsIDB4ODEyMCAsIDB4YjNiYiAsIDB4YTIzMiAsXG4gICAgMHg1YWM1ICwgMHg0YjRjICwgMHg3OWQ3ICwgMHg2ODVlICwgMHgxY2UxICwgMHgwZDY4ICwgMHgzZmYzICwgMHgyZTdhICxcbiAgICAweGU3MGUgLCAweGY2ODcgLCAweGM0MWMgLCAweGQ1OTUgLCAweGExMmEgLCAweGIwYTMgLCAweDgyMzggLCAweDkzYjEgLFxuICAgIDB4NmI0NiAsIDB4N2FjZiAsIDB4NDg1NCAsIDB4NTlkZCAsIDB4MmQ2MiAsIDB4M2NlYiAsIDB4MGU3MCAsIDB4MWZmOSAsXG4gICAgMHhmNzhmICwgMHhlNjA2ICwgMHhkNDlkICwgMHhjNTE0ICwgMHhiMWFiICwgMHhhMDIyICwgMHg5MmI5ICwgMHg4MzMwICxcbiAgICAweDdiYzcgLCAweDZhNGUgLCAweDU4ZDUgLCAweDQ5NWMgLCAweDNkZTMgLCAweDJjNmEgLCAweDFlZjEgLCAweDBmNzhcbl0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtNVXRsO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNVXRsLmpzXG4vLyBtb2R1bGUgaWQgPSAxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLyoqKlxuICogS01Db21XZWJCTEUuanNcbiAqIHZlcnNpb24gMC4xLjAgYWxwaGFcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmNvbnN0IEtNVXRsID0gcmVxdWlyZSgnLi9LTVV0bCcpO1xuY29uc3QgS01Db21CYXNlID0gcmVxdWlyZSgnLi9LTUNvbUJhc2UnKTtcbmNvbnN0IEtNU3RydWN0dXJlcz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcycpO1xuXG4vKipcbiAqIEBjbGFzc2Rlc2Mg44OW44Op44Km44K255SoV2ViQmx1ZXRvb2jpgJrkv6Hjgq/jg6njgrkoY2hyb21l5L6d5a2YKVxuICogQGlnbm9yZVxuICovXG5jbGFzcyBLTUNvbVdlYkJMRSBleHRlbmRzIEtNQ29tQmFzZXtcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlrprmlbBcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2RldmljZUluZm8udHlwZT1cIldFQkJMRVwiO1xuICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3M9e307XG4gICAgICAgIHRoaXMuX2JsZVNlbmRpbmdRdWU9UHJvbWlzZS5yZXNvbHZlKHRydWUpO1xuICAgICAgICB0aGlzLl9xdWVDb3VudD0wO1xuICAgICAgICBcbiAgICAgICAgLy/jgrXjg7zjg5PjgrlVVUlEXG4gICAgICAgIHRoaXMuX01PVE9SX0JMRV9TRVJWSUNFX1VVSUQ9J2YxNDBlYTM1LTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4Yyc7XG5cbiAgICAgICAgLy/jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrlVVUlEXG4gICAgICAgIHRoaXMuX01PVE9SX0JMRV9DUlM9e1xuICAgICAgICAgICAgJ01PVE9SX1RYJzonZjE0MDAwMDEtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJywvL+aXpyBNT1RPUl9DT05UUk9MXG4gICAgICAgICAgICAvLydNT1RPUl9MRUQnOidmMTQwMDAwMy04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLC8v44Oi44O844K/44O844GuTEVE44KS5Y+W44KK5omx44GGIGluZm86OiBNT1RPUl9DT05UUk9MOjpibGVMZWTjgafku6PnlKhcbiAgICAgICAgICAgICdNT1RPUl9NRUFTVVJFTUVOVCc6J2YxNDAwMDA0LTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4YycsXG4gICAgICAgICAgICAnTU9UT1JfSU1VX01FQVNVUkVNRU5UJzonZjE0MDAwMDUtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJyxcbiAgICAgICAgICAgICdNT1RPUl9SWCc6J2YxNDAwMDA2LTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4YycsLy/ml6cgTU9UT1JfU0VUVElOR1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUz17XG4gICAgICAgICAgICBcIlNlcnZpY2VcIjoweDE4MGFcbiAgICAgICAgICAgICxcIk1hbnVmYWN0dXJlck5hbWVTdHJpbmdcIjoweDJhMjlcbiAgICAgICAgICAgICxcIkhhcmR3YXJlUmV2aXNpb25TdHJpbmdcIjoweDJhMjdcbiAgICAgICAgICAgICxcIkZpcm13YXJlUmV2aXNpb25TdHJpbmdcIjoweDJhMjZcbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQkxF5YiH5pat5pmCXG4gICAgICAgICAqIEBwYXJhbSBldmVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgdGhpcy5fb25CbGVDb25uZWN0aW9uTG9zdD0oZXZlKT0+e1xuICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmlzQ29ubmVjdD1mYWxzZTtcbiAgICAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9bnVsbDtcbiAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZV9pc0Nvbm5lY3QoZmFsc2UpO1xuICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zlm57ou6Lmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIGV2ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBOb3RpZnkgVmFsdWVcbiAgICAgICAgICogIGJ5dGVbMF0tYnl0ZVszXVx0ICAgIGJ5dGVbNF0tYnl0ZVs3XVx0ICAgICAgICBieXRlWzhdLWJ5dGVbMTFdXG4gICAgICAgICAqICBmbG9hdCAqIFx0XHQgICAgICAgIGZsb2F0ICogICAgICAgICAgICAgICAgIGZsb2F0ICpcbiAgICAgICAgICogIHBvc2l0aW9uOnJhZGlhbnNcdCAgICBzcGVlZDpyYWRpYW5zL3NlY29uZFx0dG9ycXVlOk7jg7ttXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vbkJsZU1vdG9yTWVhc3VyZW1lbnQ9KGV2ZSk9PntcbiAgICAgICAgICAgIGlmKCFldmV8fCFldmUudGFyZ2V0KXtyZXR1cm47fVxuICAgICAgICAgICAgbGV0IGR2ID0gZXZlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgIGlmKCEoZHYgaW5zdGFuY2VvZiBEYXRhVmlldykpe3JldHVybjt9Ly9pbmZvOjp3ZWIgYmx1ZXRvb2jjga7jgb8gbm9kZS5qc+OBr2luc3RhbmNlb2YgQnVmZmVyXG4gICAgICAgICAgICBsZXQgcG9zaXRpb249ZHYuZ2V0RmxvYXQzMigwLGZhbHNlKTtcbiAgICAgICAgICAgIGxldCB2ZWxvY2l0eT1kdi5nZXRGbG9hdDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgbGV0IHRvcnF1ZT1kdi5nZXRGbG9hdDMyKDgsZmFsc2UpO1xuICAgICAgICAgICAgdGhpcy5fb25Nb3Rvck1lYXN1cmVtZW50Q0IobmV3IEtNU3RydWN0dXJlcy5LTVJvdFN0YXRlKHBvc2l0aW9uLHZlbG9jaXR5LHRvcnF1ZSkpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44Oi44O844K/44O8SU1V5oOF5aCx5Y+X5L+hXG4gICAgICAgICAqIEBwYXJhbSBldmVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQCNcbiAgICAgICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTm90aWZ5IFZhbHVlXG4gICAgICAgICAqIGFjY2VsX3gsIGFjY2VsX3ksIGFjY2VsX3osIHRlbXAsIGd5cm9feCwgZ3lyb195LCBneXJvX3og44GM5YWo44Gm6L+U44Gj44Gm44GP44KL44CC5Y+W5b6X6ZaT6ZqU44GvMTAwbXMg5Zu65a6aXG4gICAgICAgICAqIGJ5dGUoQmlnRW5kaWFuKSAgWzBdWzFdIFsyXVszXSAgWzRdWzVdICAgWzZdWzddXHQgICAgWzhdWzldXHRbMTBdWzExXSAgICBbMTJdWzEzXVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgIGludDE2X3QgaW50MTZfdCBpbnQxNl90IGludDE2X3QgICAgIGludDE2X3QgaW50MTZfdCBpbnQxNl90XG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgYWNjZWwteCBhY2NlbC15IGFjY2VsLXogdGVtcFx0ICAgIGd5cm8teFx0Z3lyby15XHRneXJvLXpcbiAgICAgICAgICpcbiAgICAgICAgICogaW50MTZfdDotMzIsNzY444CcMzIsNzY4XG4gICAgICAgICAqIOacuuOBruS4iuOBq+ODouODvOOCv+ODvOOCkue9ruOBhOOBn+WgtOWQiOOAgeWKoOmAn+W6puOAgHogPSAxNjAwMCDnqIvluqbjgajjgarjgovjgILvvIjph43lipvmlrnlkJHjga7jgZ/jgoHvvIlcbiAgICAgICAgICpcbiAgICAgICAgICog5Y2Y5L2N5aSJ5o+b77yJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIOOAgOWKoOmAn+W6piB2YWx1ZSBbR10gPSByYXdfdmFsdWUgKiAyIC8gMzIsNzY3XG4gICAgICAgICAqIOOAgOa4qeW6piB2YWx1ZSBb4oSDXSA9IHJhd192YWx1ZSAvIDMzMy44NyArIDIxLjAwXG4gICAgICAgICAqIOOAgOinkumAn+W6plxuICAgICAgICAgKiDjgIDjgIB2YWx1ZSBbZGVncmVlL3NlY29uZF0gPSByYXdfdmFsdWUgKiAyNTAgLyAzMiw3NjdcbiAgICAgICAgICog44CA44CAdmFsdWUgW3JhZGlhbnMvc2Vjb25kXSA9IHJhd192YWx1ZSAqIDAuMDAwMTMzMTYyMTFcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29uQmxlSW11TWVhc3VyZW1lbnQ9KGV2ZSk9PntcbiAgICAgICAgICAgIGlmKCFldmV8fCFldmUudGFyZ2V0KXtyZXR1cm47fVxuICAgICAgICAgICAgbGV0IGR2ID0gZXZlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgIGxldCB0ZW1wQ2FsaWJyYXRpb249LTUuNzsvL+a4qeW6puagoeato+WApFxuICAgICAgICAgICAgaWYoIShkdiBpbnN0YW5jZW9mIERhdGFWaWV3KSl7cmV0dXJuO30vL2luZm86OndlYiBibHVldG9vaOOBruOBvyBub2RlLmpz44GvaW5zdGFuY2VvZiBCdWZmZXJcbiAgICAgICAgICAgIC8v5Y2Y5L2N44KS5omx44GE5piT44GE44KI44GG44Gr5aSJ5o+bXG4gICAgICAgICAgICBsZXQgYWNjZWxYPWR2LmdldEludDE2KDAsZmFsc2UpKjIvMzI3Njc7XG4gICAgICAgICAgICBsZXQgYWNjZWxZPWR2LmdldEludDE2KDIsZmFsc2UpKjIvMzI3Njc7XG4gICAgICAgICAgICBsZXQgYWNjZWxaPWR2LmdldEludDE2KDQsZmFsc2UpKjIvMzI3Njc7XG4gICAgICAgICAgICBsZXQgdGVtcD0oZHYuZ2V0SW50MTYoNixmYWxzZSkpIC8gMzMzLjg3ICsgMjEuMDArdGVtcENhbGlicmF0aW9uO1xuICAgICAgICAgICAgbGV0IGd5cm9YPWR2LmdldEludDE2KDgsZmFsc2UpKjI1MC8zMjc2NztcbiAgICAgICAgICAgIGxldCBneXJvWT1kdi5nZXRJbnQxNigxMCxmYWxzZSkqMjUwLzMyNzY3O1xuICAgICAgICAgICAgbGV0IGd5cm9aPWR2LmdldEludDE2KDEyLGZhbHNlKSoyNTAvMzI3Njc7XG5cbiAgICAgICAgICAgIHRoaXMuX29uSW11TWVhc3VyZW1lbnRDQihuZXcgS01TdHJ1Y3R1cmVzLktNSW11U3RhdGUoYWNjZWxYLGFjY2VsWSxhY2NlbFosdGVtcCxneXJvWCxneXJvWSxneXJvWikpO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIOODouODvOOCv+ODvOODreOCsOaDheWgseWPluW+l1xuICAgICAgICAgKiBAcGFyYW0ge0J1ZmZlcn0gZGF0YVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBOb3RpZnkgdmFsdWVcbiAgICAgICAgICogYnl0ZVswXVx0Ynl0ZVsxLTJdXHRieXRlWzNdXHRieXRlWzQtN11cdGJ5dGVbOC0xMV1cdGJ5dGVbMTItMTNdXG4gICAgICAgICAqIHVpbnQ4X3Q6dHhfdHlwZVx0dWludDE2X3Q6aWRcdHVpbnQ4X3Q6Y29tbWFuZFx0dWludDMyX3Q6ZXJyb3JDb2RlXHR1aW50MzJfdDppbmZvXHR1aW50MTZfdDpDUkNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29uQmxlTW90b3JMb2c9KGV2ZSk9PntcbiAgICAgICAgICAgIGlmKCFldmV8fCFldmUudGFyZ2V0KXtyZXR1cm47fVxuICAgICAgICAgICAgbGV0IGR2ID0gZXZlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgIGlmKCEoZHYgaW5zdGFuY2VvZiBEYXRhVmlldykpe3JldHVybjt9Ly9pbmZvOjp3ZWIgYmx1ZXRvb2jjga7jgb8gbm9kZS5qc+OBr2luc3RhbmNlb2YgQnVmZmVyXG4gICAgICAgICAgICBsZXQgdHhUeXBlPWR2LmdldFVpbnQ4KDApOy8v44Ko44Op44O844Ot44Kw44K/44Kk44OXOjB4QkXlm7rlrppcbiAgICAgICAgICAgIGlmKHR4VHlwZSE9PTB4QkUpe3JldHVybjt9XG5cbiAgICAgICAgICAgIGxldCBpZD1kdi5nZXRVaW50MTYoMSxmYWxzZSk7Ly/pgIHkv6FJRFxuICAgICAgICAgICAgbGV0IGNtZElEPWR2LmdldFVpbnQ4KDMsZmFsc2UpO1xuICAgICAgICAgICAgbGV0IGVyckNvZGU9ZHYuZ2V0VWludDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgbGV0IGluZm89ZHYuZ2V0VWludDMyKDgsZmFsc2UpO1xuICAgICAgICAgICAgLy/jg63jgrDlj5blvpdcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JMb2dDQihuZXcgS01TdHJ1Y3R1cmVzLktNTW90b3JMb2coaWQsbnVsbCxjbWRJRCx0aGlzLl9NT1RPUl9MT0dfRVJST1JDT0RFW2VyckNvZGVdLmlkLHRoaXMuX01PVE9SX0xPR19FUlJPUkNPREVbZXJyQ29kZV0udHlwZSx0aGlzLl9NT1RPUl9MT0dfRVJST1JDT0RFW2VyckNvZGVdLm1zZyxpbmZvKSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIGV2ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBOb3RpZnkgdmFsdWVcbiAgICAgICAgICogYnl0ZVswXVx0Ynl0ZVsxXVx0Ynl0ZVsyXVx0Ynl0ZVszXSBieXRlWzRd5Lul6ZmNXHRieXRlW24tMl1cdGJ5dGVbbi0xXVxuICAgICAgICAgKiB1aW50OF90OnR4X3R5cGVcdHVpbnQxNl90OmlkXHR1aW50OF90OnJlZ2lzdGVyXHR1aW50OF90OnZhbHVlXHR1aW50MTZfdDpDUkNcbiAgICAgICAgICogMHg0MFx0dWludDE2X3QgKDJieXRlKSAw772eNjU1MzVcdOODrOOCuOOCueOCv+OCs+ODnuODs+ODiVx044Os44K444K544K/44Gu5YCk77yI44Kz44Oe44Oz44OJ44Gr44KI44Gj44Gm5aSJ44KP44KL77yJXHR1aW50MTZfdCAoMmJ5dGUpIDDvvZ42NTUzNVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25CbGVNb3RvclNldHRpbmc9KGV2ZSk9PntcbiAgICAgICAgICAgIGlmKCFldmV8fCFldmUudGFyZ2V0KXtyZXR1cm47fVxuICAgICAgICAgICAgbGV0IGR2ID0gZXZlLnRhcmdldC52YWx1ZTsvLzUrbuODkOOCpOODiOOAgFxuICAgICAgICAgICAgbGV0IHVpbnQ4QXJyYXk9bmV3IFVpbnQ4QXJyYXkoZHYuYnVmZmVyKTsvL2luZm86OuS4gOaXpuOCs+ODlOODvOOBmeOCi+W/heimgeOBjOOBguOCi1xuICAgICAgICAgICAgaWYoIShkdiBpbnN0YW5jZW9mIERhdGFWaWV3KSl7cmV0dXJuO30vL2luZm86OndlYiBibHVldG9vaOOBruOBvyBub2RlLmpz44GvaW5zdGFuY2VvZiBCdWZmZXJcblxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvL+ODh+ODvOOCv+OBrnBhcnNlXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGxldCB0eExlbj1kdi5ieXRlTGVuZ3RoO1xuICAgICAgICAgICAgbGV0IHR4VHlwZT1kdi5nZXRVaW50OCgwKTsvL+ODrOOCuOOCueOCv+aDheWgsemAmuefpeOCs+ODnuODs+ODiUlEIDB4NDDlm7rlrppcbiAgICAgICAgICAgIGlmKHR4VHlwZSE9PTB4NDB8fHR4TGVuPDUpe3JldHVybjt9Ly/jg6zjgrjjgrnjgr/mg4XloLHjgpLlkKvjgb7jgarjgYTjg4fjg7zjgr/jga7noLTmo4RcblxuICAgICAgICAgICAgbGV0IGlkPWR2LmdldFVpbnQxNigxLGZhbHNlKTsvL+mAgeS/oUlEXG4gICAgICAgICAgICBsZXQgcmVnaXN0ZXJDbWQ9ZHYuZ2V0VWludDgoMyk7Ly/jg6zjgrjjgrnjgr/jgrPjg57jg7Pjg4lcbiAgICAgICAgICAgIGxldCBjcmM9ZHYuZ2V0VWludDE2KHR4TGVuLTIsZmFsc2UpOy8vQ1JD44Gu5YCkIOacgOW+jOOBi+OCiTJkeXRlXG5cbiAgICAgICAgICAgIGxldCByZXM9e307XG4gICAgICAgICAgICAvL+OCs+ODnuODs+ODieWIpeOBq+OCiOOCi+ODrOOCuOOCueOCv+OBruWApOOBruWPluW+l1s0LW4gYnl0ZV1cbiAgICAgICAgICAgIGxldCBzdGFydE9mZnNldD00O1xuXG4gICAgICAgICAgICBzd2l0Y2gocmVnaXN0ZXJDbWQpe1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubWF4U3BlZWQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tYXhTcGVlZD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5taW5TcGVlZDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1pblNwZWVkPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmN1cnZlVHlwZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmN1cnZlVHlwZT1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuYWNjOlxuICAgICAgICAgICAgICAgICAgICByZXMuYWNjPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmRlYzpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmRlYz1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tYXhUb3JxdWU6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tYXhUb3JxdWU9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQudGVhY2hpbmdJbnRlcnZhbDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnRlYWNoaW5nSW50ZXJ2YWw9ZHYuZ2V0VWludDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5wbGF5YmFja0ludGVydmFsOlxuICAgICAgICAgICAgICAgICAgICByZXMucGxheWJhY2tJbnRlcnZhbD1kdi5nZXRVaW50MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnFDdXJyZW50UDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnFDdXJyZW50UD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5xQ3VycmVudEk6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5xQ3VycmVudEk9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucUN1cnJlbnREOlxuICAgICAgICAgICAgICAgICAgICByZXMucUN1cnJlbnREPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnNwZWVkUDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNwZWVkUD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5zcGVlZEk6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zcGVlZEk9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuc3BlZWREOlxuICAgICAgICAgICAgICAgICAgICByZXMuc3BlZWREPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnBvc2l0aW9uUDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnBvc2l0aW9uUD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWw6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWw9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1vdG9yTWVhc3VyZW1lbnRCeURlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0PWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5pbnRlcmZhY2U6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5pbnRlcmZhY2U9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnJlc3BvbnNlOlxuICAgICAgICAgICAgICAgICAgICByZXMucmVzcG9uc2U9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm93bkNvbG9yOlxuICAgICAgICAgICAgICAgICAgICByZXMub3duQ29sb3I9KCcjMDAwMDAwJyArTnVtYmVyKGR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTw8MTZ8ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQrMSk8PDh8ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQrMikpLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC02KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5pTVVNZWFzdXJlbWVudEludGVydmFsOlxuICAgICAgICAgICAgICAgICAgICByZXMuaU1VTWVhc3VyZW1lbnRJbnRlcnZhbD1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuaU1VTWVhc3VyZW1lbnRCeURlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5pTVVNZWFzdXJlbWVudEJ5RGVmYXVsdD1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuZGV2aWNlTmFtZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmRldmljZU5hbWU9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcIlwiLCB1aW50OEFycmF5LnNsaWNlKHN0YXJ0T2Zmc2V0LC0yKSk7Ly/lj6/lpInjg5DjgqTjg4jmloflrZdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5kZXZpY2VJbmZvOlxuICAgICAgICAgICAgICAgICAgICByZXMuZGV2aWNlSW5mbz1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFwiXCIsIHVpbnQ4QXJyYXkuc2xpY2Uoc3RhcnRPZmZzZXQsLTIpKTsvL+WPr+WkieODkOOCpOODiOaWh+Wtl1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnNwZWVkOlxuICAgICAgICAgICAgICAgICAgICByZXMuc3BlZWQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucG9zaXRpb25PZmZzZXQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wb3NpdGlvbk9mZnNldD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tb3ZlVG86XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tb3ZlVG89ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuaG9sZDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmhvbGQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuc3RhdHVzOlxuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC50YXNrc2V0TmFtZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnRhc2tzZXROYW1lPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXCJcIiwgdWludDhBcnJheS5zbGljZShzdGFydE9mZnNldCwtMikpOy8v5Y+v5aSJ44OQ44Kk44OI5paH5a2XXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQudGFza3NldEluZm86XG4gICAgICAgICAgICAgICAgICAgIHJlcy50YXNrc2V0SW5mbz1kdi5nZXRVaW50MTYoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnRhc2tzZXRVc2FnZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnRhc2tzZXRVc2FnZT1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubW90aW9uTmFtZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1vdGlvbk5hbWU9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcIlwiLCB1aW50OEFycmF5LnNsaWNlKHN0YXJ0T2Zmc2V0LC0yKSk7Ly/lj6/lpInjg5DjgqTjg4jmloflrZdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tb3Rpb25JbmZvOlxuICAgICAgICAgICAgICAgICAgICByZXMubW90aW9uSW5mbz1kdi5nZXRVaW50MTYoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1vdGlvblVzYWdlOlxuICAgICAgICAgICAgICAgICAgICByZXMubW90aW9uVXNhZ2U9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmkyQ1NsYXZlQWRkcmVzczpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmkyQ1NsYXZlQWRkcmVzcz1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubGVkOlxuICAgICAgICAgICAgICAgICAgICByZXMubGVkPXtzdGF0ZTpkdi5nZXRVaW50OChzdGFydE9mZnNldCkscjpkdi5nZXRVaW50OChzdGFydE9mZnNldCsxKSxnOmR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KzIpLGI6ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQrMyl9O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmVuYWJsZUNoZWNrU3VtOlxuICAgICAgICAgICAgICAgICAgICByZXMuZW5hYmxlQ2hlY2tTdW09ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmRldmljZVNlcmlhbDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmRldmljZVNlcmlhbD1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFwiXCIsIHVpbnQ4QXJyYXkuc2xpY2Uoc3RhcnRPZmZzZXQsLTIpKTsvL+WPr+WkieODkOOCpOODiOaWh+Wtl1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzKTtcblxuICAgICAgICAgICAgdGhpcy5fb25Nb3RvclNldHRpbmdDQihyZWdpc3RlckNtZCxyZXMpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIHNlY3Rpb246OuWFrOmWi+ODoeOCveODg+ODiVxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiBXZWJCbHVldG9vaOOBp+OBruaOpee2muOCkumWi+Wni+OBmeOCi1xuICAgICAqL1xuICAgIGNvbm5lY3QoKXtcbiAgICAgICAgaWYgKHRoaXMuX3BlcmlwaGVyYWwmJiB0aGlzLl9wZXJpcGhlcmFsLmdhdHQmJnRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5jb25uZWN0ZWQgKSB7cmV0dXJufVxuICAgICAgICBsZXQgZ2F0PSAodGhpcy5fcGVyaXBoZXJhbCYmIHRoaXMuX3BlcmlwaGVyYWwuZ2F0dCApP3RoaXMuX3BlcmlwaGVyYWwuZ2F0dCA6dW5kZWZpbmVkOy8v5YaN5o6l57aa55SoXG4gICAgICAgIHRoaXMuX2JsZUNvbm5lY3QoZ2F0KS50aGVuKG9iaj0+ey8vaW5mbzo6IHJlc29sdmUoe2RldmljZUlELGRldmljZU5hbWUsYmxlRGV2aWNlLGNoYXJhY3RlcmlzdGljc30pO1xuICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbD1vYmouYmxlRGV2aWNlO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pZD10aGlzLl9wZXJpcGhlcmFsLmlkO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5uYW1lPXRoaXMuX3BlcmlwaGVyYWwubmFtZTtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uaXNDb25uZWN0PXRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5jb25uZWN0ZWQ7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLm1hbnVmYWN0dXJlck5hbWU9b2JqLmluZm9tYXRpb24ubWFudWZhY3R1cmVyTmFtZTtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uaGFyZHdhcmVSZXZpc2lvbj1vYmouaW5mb21hdGlvbi5oYXJkd2FyZVJldmlzaW9uO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5maXJtd2FyZVJldmlzaW9uPW9iai5pbmZvbWF0aW9uLmZpcm13YXJlUmV2aXNpb247XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzPW9iai5jaGFyYWN0ZXJpc3RpY3M7XG5cbiAgICAgICAgICAgIGlmKCFnYXQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZ2F0dHNlcnZlcmRpc2Nvbm5lY3RlZCcsdGhpcy5fb25CbGVDb25uZWN0aW9uTG9zdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbC5hZGRFdmVudExpc3RlbmVyKCdnYXR0c2VydmVyZGlzY29ubmVjdGVkJywgdGhpcy5fb25CbGVDb25uZWN0aW9uTG9zdCk7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX01FQVNVUkVNRU5UJ10pe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX01FQVNVUkVNRU5UJ10ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JNZWFzdXJlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfTUVBU1VSRU1FTlQnXS5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3Rvck1lYXN1cmVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9NRUFTVVJFTUVOVCddLnN0YXJ0Tm90aWZpY2F0aW9ucygpLnRoZW4ob2JqPT57XG4gICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfSU1VX01FQVNVUkVNRU5UJ10pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9JTVVfTUVBU1VSRU1FTlQnXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVJbXVNZWFzdXJlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCddLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZUltdU1lYXN1cmVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCddLnN0YXJ0Tm90aWZpY2F0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgfSkudGhlbihvYmo9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9SWCddLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yU2V0dGluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9SWCddLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yTG9nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXS5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3RvclNldHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXS5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3RvckxvZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9SWCddLnN0YXJ0Tm90aWZpY2F0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIH0pLnRoZW4ob2JqPT57XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaW5pdCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZV9pc0Nvbm5lY3QodHJ1ZSk7Ly/liJ3lm57jga7jgb8oY29tcOS7peWJjeOBr+eZuueBq+OBl+OBquOBhOeCuilcbiAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaXNDb25uZWN0KHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChlcnI9PntcbiAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9bnVsbDtcbiAgICAgICAgICAgIHRoaXMuX29uQ29ubmVjdEZhaWx1cmVIYW5kbGVyKHRoaXMsZXJyKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXZWJCbHVldG9vaOOBruWIh+aWrVxuICAgICAqL1xuICAgIGRpc0Nvbm5lY3QoKXtcbiAgICAgICBpZiAoIXRoaXMuX3BlcmlwaGVyYWwgfHwgIXRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5jb25uZWN0ZWQpe3JldHVybjt9XG4gICAgICAgIHRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5kaXNjb25uZWN0KCk7XG4gICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9bnVsbDtcblxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWGhemDqFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIEJMReaOpee2mlxuICAgICAqIEBwYXJhbSBnYXR0X29iaiDjg5rjgqLjg6rjg7PjgrDmuIjjgb/jga5HQVRU44Gu44OH44OQ44Kk44K544Gr5YaN5o6l57aa55SoKOODmuOCouODquODs+OCsOODouODvOODgOODq+OBr+WHuuOBquOBhClcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9ibGVDb25uZWN0KGdhdHRfb2JqKSB7XG4gICAgICAvL2xldCBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAvLyBsZXQgYmxlRGV2aWNlO1xuICAgICAgICAgIC8vIGxldCBkZXZpY2VOYW1lO1xuICAgICAgICAgIC8vIGxldCBkZXZpY2VJRDtcbiAgICAgICAgICBpZighZ2F0dF9vYmope1xuICAgICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgIGZpbHRlcnM6IFt7c2VydmljZXM6IFt0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEXX1dLFxuICAgICAgICAgICAgICAgICAgb3B0aW9uYWxTZXJ2aWNlczpbdGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuU2VydmljZV1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgbmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAudGhlbihkZXZpY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JsZUdhdGNvbm5lY3QoZGV2aWNlLmdhdHQpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGVEZXZpY2U6IGRldmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZUlEOiBkZXZpY2UuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VOYW1lOiBkZXZpY2UubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljczpyZXMuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvbjpyZXMuaW5mb21hdGlvblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICB0aGlzLl9ibGVHYXRjb25uZWN0KGdhdHRfb2JqKVxuICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9ibGVHYXRjb25uZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VJRDogZ2F0dF9vYmouZGV2aWNlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VOYW1lOiBnYXR0X29iai5kZXZpY2UubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmxlRGV2aWNlOiBnYXR0X29iai5kZXZpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljczpyZXMuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uOnJlcy5pbmZvbWF0aW9uXG5cbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9HQVRU5o6l57aa55SoXG4gICAgX2JsZUdhdGNvbm5lY3QoZ2F0dF9vYmope1xuICAgICAgICAgICAgbGV0IGNoYXJhY3RlcmlzdGljcyA9IHt9O1xuICAgICAgICAgICAgbGV0IGluZm9tYXRpb249e307XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGdyZXNvbHZlLCBncmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICBnYXR0X29iai5jb25uZWN0KCkudGhlbihzZXJ2ZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlcyh0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEKS50aGVuKHNlcnZpY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjcnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9NT1RPUl9CTEVfQ1JTKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuX01PVE9SX0JMRV9DUlNba2V5XSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjaGFyYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljc1trZXldID0gY2hhcmE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoY3JzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2JsZV9maXJtd2FyZV9yZXZpc2lvbuOBruOCteODvOODk+OCueWPluW+lyBpbmZvOjpBbmRyb2lkZOOBp+OBr+S4jeWuieWumuOBqueCuuWBnOatolxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoc3Jlc29sdmUsIHNyZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuU2VydmljZSkudGhlbigoc2VydmljZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLk1hbnVmYWN0dXJlck5hbWVTdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjaGFyYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoYXJhLnJlYWRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbih2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvblsnbWFudWZhY3R1cmVyTmFtZSddID0gS01VdGwuVXRmOEFycmF5VG9TdHIobmV3IFVpbnQ4QXJyYXkodmFsLmJ1ZmZlcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntyZWplY3QoZSk7fSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5GaXJtd2FyZVJldmlzaW9uU3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGFyYS5yZWFkVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb25bJ2Zpcm13YXJlUmV2aXNpb24nXSA9IEtNVXRsLlV0ZjhBcnJheVRvU3RyKG5ldyBVaW50OEFycmF5KHZhbC5idWZmZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGUpPT57cmVqZWN0KGUpO30pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuSGFyZHdhcmVSZXZpc2lvblN0cmluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNoYXJhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hhcmEucmVhZFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uWydoYXJkd2FyZVJldmlzaW9uJ10gPSBLTVV0bC5VdGY4QXJyYXlUb1N0cihuZXcgVWludDhBcnJheSh2YWwuYnVmZmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlKT0+e3JlamVjdChlKTt9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3Jlc29sdmUoe2NoYXJhY3RlcmlzdGljczogY2hhcmFjdGVyaXN0aWNzLCBpbmZvbWF0aW9uOiBpbmZvbWF0aW9ufSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCTEXjgrPjg57jg7Pjg4njga7pgIHkv6FcbiAgICAgKiBAcGFyYW0gY29tbWFuZFR5cGVTdHIgICdNT1RPUl9DT05UUk9MJywnTU9UT1JfTUVBU1VSRU1FTlQnLCdNT1RPUl9JTVVfTUVBU1VSRU1FTlQnLCdNT1RPUl9SWCdcbiAgICAgKiDjgrPjg57jg7Pjg4nnqK7liKXjga5TdHJpbmcg5Li744GrQkxF44Gu44Kt44Oj44Op44Kv44K/44Oq44K544OG44Kj44Kv44K544Gn5L2/55So44GZ44KLXG4gICAgICogQHBhcmFtIGNvbW1hbmROdW1cbiAgICAgKiBAcGFyYW0gYXJyYXlidWZmZXJcbiAgICAgKiBAcGFyYW0gbm90aWZ5UHJvbWlzIGNtZFJlYWRSZWdpc3RlcuetieOBrkJMReWRvOOBs+WHuuOBl+W+jOOBq25vdGlmeeOBp+WPluW+l+OBmeOCi+WApOOCklByb21pc+OBp+W4sOOBmeW/heimgeOBruOBguOCi+OCs+ODnuODs+ODieeUqFxuICAgICAqIEBwYXJhbSBjaWQg44K344O844Kx44Oz44K5SURcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjaWQg44K344O844Kx44Oz44K5SURcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZW5kTW90b3JDb21tYW5kKGNvbW1hbmRDYXRlZ29yeSwgY29tbWFuZE51bSwgYXJyYXlidWZmZXI9bmV3IEFycmF5QnVmZmVyKDApLCBub3RpZnlQcm9taXM9bnVsbCxjaWQ9bnVsbCl7XG4gICAgICAgIGxldCBjaGFyYWN0ZXJpc3RpY3M9dGhpcy5fY2hhcmFjdGVyaXN0aWNzW2NvbW1hbmRDYXRlZ29yeV07XG4gICAgICAgIGxldCBhYj1uZXcgRGF0YVZpZXcoYXJyYXlidWZmZXIpO1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGFycmF5YnVmZmVyLmJ5dGVMZW5ndGgrNSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsY29tbWFuZE51bSk7XG4gICAgICAgIGNpZD1jaWQ9PT1udWxsP3RoaXMuY3JlYXRlQ29tbWFuZElEOmNpZDsvL+OCt+ODvOOCseODs+OCuUlEKOODpuODi+ODvOOCr+WApClcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDEsY2lkKTtcbiAgICAgICAgLy/jg4fjg7zjgr/jga7mm7jjgY3ovrzjgb9cbiAgICAgICAgZm9yKGxldCBpPTA7aTxhcnJheWJ1ZmZlci5ieXRlTGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgzK2ksYWIuZ2V0VWludDgoaSkpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjcmM9S01VdGwuQ3JlYXRlQ29tbWFuZENoZWNrU3VtQ1JDMTYobmV3IFVpbnQ4QXJyYXkoYnVmZmVyLnNsaWNlKDAsYnVmZmVyLmJ5dGVMZW5ndGgtMikpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KGFycmF5YnVmZmVyLmJ5dGVMZW5ndGgrMyxjcmMpOy8vaW5mbzo6Q1JD6KiI566XXG5cbiAgICAgICAgLy9xdWXjgavov73liqBcbiAgICAgICAvLyArK3RoaXMuX3F1ZUNvdW50O1xuICAgICAgICB0aGlzLl9ibGVTZW5kaW5nUXVlPSB0aGlzLl9ibGVTZW5kaW5nUXVlLnRoZW4oKHJlcyk9PntcbiAgICAgICAgICAvLyAgY29uc29sZS5sb2coXCJfc2VuZE1vdG9yQ29tbWFuZCBxdWVDb3VudDpcIisoLS10aGlzLl9xdWVDb3VudCkpO1xuICAgICAgICAgICAgaWYobm90aWZ5UHJvbWlzKXtcbiAgICAgICAgICAgICAgICBub3RpZnlQcm9taXMuc3RhcnRSZWplY3RUaW1lT3V0Q291bnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjaGFyYWN0ZXJpc3RpY3Mud3JpdGVWYWx1ZShidWZmZXIpO1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgLy/lpLHmlZfmmYLjgIAvL2luZm86OuW+jOe2muOBruOCs+ODnuODs+ODieOBr+W8leOBjee2muOBjeWun+ihjOOBleOCjOOCi1xuICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhcIkVSUiBfc2VuZE1vdG9yQ29tbWFuZDpcIityZXMrXCIgcXVlQ291bnQ6XCIrKC0tdGhpcy5fcXVlQ291bnQpKTtcbiAgICAgICAgICAgIGlmKG5vdGlmeVByb21pcyl7XG4gICAgICAgICAgICAgICAgbm90aWZ5UHJvbWlzLmNhbGxSZWplY3QocmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjaWQ7XG4gICAgfVxuXG5cbi8vLy8vL2NsYXNzLy9cbn1cblxubW9kdWxlLmV4cG9ydHMgPUtNQ29tV2ViQkxFO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNQ29tV2ViQkxFLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiJ3VzZSBzdHJpY3QnO1xuLyoqKlxuICpLTUNvbm5lY3RvckJyb3dzZXIuanNcbiAqIHZlcnNpb24gMC4xLjAgYWxwaGFcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbmdsb2JhbC5LTVV0bD1yZXF1aXJlKCcuL0tNVXRsLmpzJyk7XG5nbG9iYWwuS01WZWN0b3IyPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01WZWN0b3IyO1xuZ2xvYmFsLktNSW11U3RhdGU9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTUltdVN0YXRlO1xuZ2xvYmFsLktNTGVkU3RhdGU9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTUxlZFN0YXRlO1xuZ2xvYmFsLktNUm90U3RhdGU9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTVJvdFN0YXRlO1xuZ2xvYmFsLktNRGV2aWNlSW5mbz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNRGV2aWNlSW5mbztcbmdsb2JhbC5LTU1vdG9yTG9nPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01Nb3RvckxvZztcbmdsb2JhbC5LTU1vdG9yT25lV2ViQkxFPXJlcXVpcmUoJy4vS01Nb3Rvck9uZVdlYkJMRS5qcycpO1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNQ29ubmVjdG9yQnJvd3NlcldQSy5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKipcbiAqS01Nb3Rvck9uZVdlYkJMRS5qc1xuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5sZXQgS01Db21XZWJCTEUgPSByZXF1aXJlKCcuL0tNQ29tV2ViQkxFJyk7XG5sZXQgS01Nb3RvckNvbW1hbmRLTU9uZT1yZXF1aXJlKCcuL0tNTW90b3JDb21tYW5kS01PbmUuanMnKTtcblxuLyoqXG4gKiBAY2xhc3NkZXNjIEtNLTHjga5XZWJCbHVldG9vaOaOpee2mueUqCDku67mg7Pjg4fjg5DjgqTjgrlcbiAqL1xuY2xhc3MgS01Nb3Rvck9uZVdlYkJMRSBleHRlbmRzIEtNTW90b3JDb21tYW5kS01PbmV7XG4gICAgLyoqXG4gICAgICogS01Nb3Rvck9uZVdlYkJMRVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBleHRlbmRzIEtNTW90b3JDb21tYW5kS01PbmVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcihLTU1vdG9yQ29tbWFuZEtNT25lLktNX0NPTk5FQ1RfVFlQRS5XRUJCTEUsbmV3IEtNQ29tV2ViQkxFKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBqOaOpee2muOBmeOCi1xuICAgICAqL1xuICAgIGNvbm5lY3QoKXtcbiAgICAgICAgdGhpcy5fS01Db20uY29ubmVjdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBqOWIh+aWrVxuICAgICAqL1xuICAgIGRpc0Nvbm5lY3QoKXtcbiAgICAgICAgdGhpcy5fS01Db20uZGlzQ29ubmVjdCgpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPUtNTW90b3JPbmVXZWJCTEU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvS01Nb3Rvck9uZVdlYkJMRS5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKipcbiAqIEtNQ29tQmFzZS5qc1xuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xubGV0IEtNVXRsID0gcmVxdWlyZSgnLi9LTVV0bCcpO1xubGV0IEtNU3RydWN0dXJlcz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcycpO1xuLyoqXG4gKiBAY2xhc3NkZXNjIOmAmuS/oeOCr+ODqeOCueOBruWfuuW6lVxuICogQGlnbm9yZVxuICovXG5jbGFzcyBLTUNvbUJhc2V7XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlrprmlbBcbiAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9y44CAXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5fY29tbWFuZENvdW50PTA7XG4gICAgICAgIHRoaXMuX2RldmljZUluZm89bmV3IEtNU3RydWN0dXJlcy5LTURldmljZUluZm8oKTtcblxuICAgICAgICB0aGlzLl9tb3Rvck1lYXN1cmVtZW50PW5ldyBLTVN0cnVjdHVyZXMuS01Sb3RTdGF0ZSgpO1xuICAgICAgICB0aGlzLl9tb3RvckxlZD1uZXcgS01TdHJ1Y3R1cmVzLktNTGVkU3RhdGUoKTtcbiAgICAgICAgdGhpcy5fbW90b3JJbXVNZWFzdXJlbWVudD1uZXcgS01TdHJ1Y3R1cmVzLktNSW11U3RhdGUoKTtcblxuICAgICAgICB0aGlzLl9vbkluaXRIYW5kbGVyPWZ1bmN0aW9uKGNvbm5lY3Rvcil7fTtcbiAgICAgICAgdGhpcy5fb25Db25uZWN0SGFuZGxlcj1mdW5jdGlvbihjb25uZWN0b3Ipe307XG4gICAgICAgIHRoaXMuX29uRGlzY29ubmVjdEhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yKXt9O1xuICAgICAgICB0aGlzLl9vbkNvbm5lY3RGYWlsdXJlSGFuZGxlcj1mdW5jdGlvbihjb25uZWN0b3IsIG1zZyl7fTtcblxuICAgICAgICB0aGlzLl9vbk1vdG9yTWVhc3VyZW1lbnRDQj1mdW5jdGlvbigpe307XG4gICAgICAgIHRoaXMuX29uSW11TWVhc3VyZW1lbnRDQj1mdW5jdGlvbigpe307XG4gICAgICAgIHRoaXMuX29uTW90b3JTZXR0aW5nQ0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9vbk1vdG9yTG9nQ0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9pc0luaXQ9ZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIF9vbkJsZU1vdG9yU2V0dGluZ+OBruOCs+ODnuODs+ODieOAgOODouODvOOCv+ODvOioreWumuaDheWgseOBrumAmuefpeWPl+S/oeaZguOBq+ODkeODvOOCueOBmeOCi+eUqFxuICAgICAgICAgKiBAdHlwZSB7e21heFNwZWVkOiBudW1iZXIsIG1pblNwZWVkOiBudW1iZXIsIGN1cnZlVHlwZTogbnVtYmVyLCBhY2M6IG51bWJlciwgZGVjOiBudW1iZXIsIG1heFRvcnF1ZTogbnVtYmVyLCBxQ3VycmVudFA6IG51bWJlciwgcUN1cnJlbnRJOiBudW1iZXIsIHFDdXJyZW50RDogbnVtYmVyLCBzcGVlZFA6IG51bWJlciwgc3BlZWRJOiBudW1iZXIsIHNwZWVkRDogbnVtYmVyLCBwb3NpdGlvblA6IG51bWJlciwgb3duQ29sb3I6IG51bWJlcn19XG4gICAgICAgICAqIEBpZ25vcmVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5EPXtcbiAgICAgICAgICAgICAgICBcIm1heFNwZWVkXCI6MHgwMixcbiAgICAgICAgICAgICAgICBcIm1pblNwZWVkXCI6MHgwMyxcbiAgICAgICAgICAgICAgICBcImN1cnZlVHlwZVwiOjB4MDUsXG4gICAgICAgICAgICAgICAgXCJhY2NcIjoweDA3LFxuICAgICAgICAgICAgICAgIFwiZGVjXCI6MHgwOCxcbiAgICAgICAgICAgICAgICBcIm1heFRvcnF1ZVwiOjB4MEUsXG4gICAgICAgICAgICAgICAgXCJ0ZWFjaGluZ0ludGVydmFsXCI6MHgxNixcbiAgICAgICAgICAgICAgICBcInBsYXliYWNrSW50ZXJ2YWxcIjoweDE3LFxuICAgICAgICAgICAgICAgIFwicUN1cnJlbnRQXCI6MHgxOCxcbiAgICAgICAgICAgICAgICBcInFDdXJyZW50SVwiOjB4MTksXG4gICAgICAgICAgICAgICAgXCJxQ3VycmVudERcIjoweDFBLFxuICAgICAgICAgICAgICAgIFwic3BlZWRQXCI6MHgxQixcbiAgICAgICAgICAgICAgICBcInNwZWVkSVwiOjB4MUMsXG4gICAgICAgICAgICAgICAgXCJzcGVlZERcIjoweDFELFxuICAgICAgICAgICAgICAgIFwicG9zaXRpb25QXCI6MHgxRSxcbiAgICAgICAgICAgICAgICBcInBvc2l0aW9uSVwiOjB4MUYsXG4gICAgICAgICAgICAgICAgXCJwb3NpdGlvbkRcIjoweDIwLFxuICAgICAgICAgICAgICAgIFwicG9zQ29udHJvbFRocmVzaG9sZFwiOjB4MjEsXG4gICAgICAgICAgICAgICAgXCJub3RpZnlQb3NBcnJpdmFsXCI6MHgyQixcbiAgICAgICAgICAgICAgICBcIm1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbFwiOjB4MkMsXG4gICAgICAgICAgICAgICAgXCJtb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0XCI6MHgyRCxcbiAgICAgICAgICAgICAgICBcImludGVyZmFjZVwiOjB4MkUsXG4gICAgICAgICAgICAgICAgXCJyZXNwb25zZVwiOjB4MzAsXG4gICAgICAgICAgICAgICAgXCJvd25Db2xvclwiOjB4M0EsXG4gICAgICAgICAgICAgICAgXCJpTVVNZWFzdXJlbWVudEludGVydmFsXCI6MHgzQyxcbiAgICAgICAgICAgICAgICBcImlNVU1lYXN1cmVtZW50QnlEZWZhdWx0XCI6MHgzRCxcbiAgICAgICAgICAgICAgICBcImRldmljZU5hbWVcIjoweDQ2LFxuICAgICAgICAgICAgICAgIFwiZGV2aWNlSW5mb1wiOjB4NDcsXG4gICAgICAgICAgICAgICAgXCJzcGVlZFwiOjB4NTgsXG4gICAgICAgICAgICAgICAgXCJwb3NpdGlvbk9mZnNldFwiOjB4NUIsXG4gICAgICAgICAgICAgICAgXCJtb3ZlVG9cIjoweDY2LFxuICAgICAgICAgICAgICAgIFwiaG9sZFwiOjB4NzIsXG4gICAgICAgICAgICAgICAgXCJzdGF0dXNcIjoweDlBLFxuICAgICAgICAgICAgICAgIFwidGFza3NldE5hbWVcIjoweEE1LFxuICAgICAgICAgICAgICAgIFwidGFza3NldEluZm9cIjoweEE2LFxuICAgICAgICAgICAgICAgIFwidGFza3NldFVzYWdlXCI6MHhBNyxcbiAgICAgICAgICAgICAgICBcIm1vdGlvbk5hbWVcIjoweEFGLFxuICAgICAgICAgICAgICAgIFwibW90aW9uSW5mb1wiOjB4QjAsXG4gICAgICAgICAgICAgICAgXCJtb3Rpb25Vc2FnZVwiOjB4QjEsXG4gICAgICAgICAgICAgICAgXCJpMkNTbGF2ZUFkZHJlc3NcIjoweEMwLFxuICAgICAgICAgICAgICAgIFwibGVkXCI6MHhFMCxcbiAgICAgICAgICAgICAgICBcImVuYWJsZUNoZWNrU3VtXCI6MHhGMyxcbiAgICAgICAgICAgICAgICBcImRldmljZVNlcmlhbFwiOjB4RkFcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvOODreOCsOeUqOOCqOODqeODvOOCs+ODvOODieihqFxuICAgICAgICAgKiBAdHlwZSB7e319XG4gICAgICAgICAqIEBpZ25vcmVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX01PVE9SX0xPR19FUlJPUkNPREU9e1xuICAgICAgICAgICAgMDp7aWQ6MCx0eXBlOlwiS01fU1VDQ0VTU1wiLG1zZzpcIlN1Y2Nlc3NmdWwgY29tbWFuZFwifSwvL+aIkOWKn+aZguOBq+i/lOWNtOOBmeOCi1xuICAgICAgICAgICAgMTp7aWQ6MSx0eXBlOlwiS01fRVJST1JfSU5URVJOQUxcIixtc2c6XCJJbnRlcm5hbCBFcnJvclwifSwvL+WGhemDqOOCqOODqeODvFxuICAgICAgICAgICAgMjp7aWQ6Mix0eXBlOlwiS01fRVJST1JfTk9fTUVNXCIsbXNnOlwiTm8gTWVtb3J5IGZvciBvcGVyYXRpb25cIn0sLy/jg6Hjg6Ljg6rkuI3otrNcbiAgICAgICAgICAgIDM6e2lkOjMsdHlwZTpcIktNX0VSUk9SX05PVF9GT1VORFwiLG1zZzpcIk5vdCBmb3VuZFwifSwvL+imi+OBpOOBi+OCieOBquOBhFxuICAgICAgICAgICAgNDp7aWQ6NCx0eXBlOlwiS01fRVJST1JfTk9UX1NVUFBPUlRFRFwiLG1zZzpcIk5vdCBzdXBwb3J0ZWRcIn0sLy/jgrXjg53jg7zjg4jlpJZcbiAgICAgICAgICAgIDU6e2lkOjUsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfQ09NTUFORFwiLG1zZzpcIkludmFsaWQgQ29tbWFuZFwifSwvL+S4jeato+OBquOCs+ODnuODs+ODiVxuICAgICAgICAgICAgNjp7aWQ6Nix0eXBlOlwiS01fRVJST1JfSU5WQUxJRF9QQVJBTVwiLG1zZzpcIkludmFsaWQgUGFyYW1ldGVyXCJ9LC8v5LiN5q2j44Gq5byV5pWwXG4gICAgICAgICAgICA3OntpZDo3LHR5cGU6XCJLTV9FUlJPUl9TVE9SQUdFX0ZVTExcIixtc2c6XCJTdG9yYWdlIGlzIGZ1bGxcIn0sLy/oqJjpjLLpoJjln5/jgYzkuIDmna9cbiAgICAgICAgICAgIDg6e2lkOjgsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfRkxBU0hfU1RBVEVcIixtc2c6XCJJbnZhbGlkIGZsYXNoIHN0YXRlLCBvcGVyYXRpb24gZGlzYWxsb3dlZCBpbiB0aGlzIHN0YXRlXCJ9LC8v44OV44Op44OD44K344Ol44Gu54q25oWL44GM5LiN5q2jXG4gICAgICAgICAgICA5OntpZDo5LHR5cGU6XCJLTV9FUlJPUl9JTlZBTElEX0xFTkdUSFwiLG1zZzpcIkludmFsaWQgTGVuZ3RoXCJ9LC8v5LiN5q2j44Gq5byV5pWw44Gu6ZW344GV77yI44K144Kk44K677yJXG4gICAgICAgICAgICAxMDp7aWQ6MTAsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfQ0hFQ0tTVU1cIixtc2c6XCJJbnZhbGlkIENoZWNrIFN1bSAoVmFsaWRhdGlvbiBpcyBmYWlsZWQpXCJ9LC8v5LiN5q2j44Gq44OB44Kn44OD44Kv44K144OgXG4gICAgICAgICAgICAxMzp7aWQ6MTMsdHlwZTpcIktNX0VSUk9SX1RJTUVPVVRcIixtc2c6XCJPcGVyYXRpb24gdGltZWQgb3V0XCJ9LC8v44K/44Kk44Og44Ki44Km44OIXG4gICAgICAgICAgICAxNTp7aWQ6MTUsdHlwZTpcIktNX0VSUk9SX0ZPUkJJRERFTlwiLG1zZzpcIkZvcmJpZGRlbiBPcGVyYXRpb25cIn0sLy/kuI3oqLHlj6/jgarmk43kvZxcbiAgICAgICAgICAgIDE2OntpZDoxNix0eXBlOlwiS01fRVJST1JfSU5WQUxJRF9BRERSXCIsbXNnOlwiQmFkIE1lbW9yeSBBZGRyZXNzXCJ9LC8v5LiN5q2j44Gq44Ki44OJ44Os44K55Y+C54WnXG4gICAgICAgICAgICAxNzp7aWQ6MTcsdHlwZTpcIktNX0VSUk9SX0JVU1lcIixtc2c6XCJCdXN5XCJ9LC8v44OT44K444O8XG4gICAgICAgICAgICAxODp7aWQ6MTgsdHlwZTpcIktNX0VSUk9SX1JFU09VUkNFXCIsbXNnOlwiTm90IGVub3VnaCByZXNvdXJjZXMgZm9yIG9wZXJhdGlvblwifSwvL+ODquOCveODvOOCueS4jei2s1xuICAgICAgICAgICAgMjA6e2lkOjIwLHR5cGU6XCJLTV9FUlJPUl9NT1RPUl9ESVNBQkxFRFwiLG1zZzpcIk1vdG9yIHN0YXRlIGlzIGRpc2FibGVkXCJ9LC8v44Oi44O844K/44O844GM5YuV5L2c6Kix5Y+v44GV44KM44Gm44GE44Gq44GEXG4gICAgICAgICAgICA2MDp7aWQ6NjAsdHlwZTpcIktNX0VSUk9SX0RFVklDRV9EUklWRVJcIixtc2c6XCJLTV9FUlJPUl9ERVZJQ0VfRFJJVkVSXCJ9LC8v5YaF5a655pyq5a6a576pXG4gICAgICAgICAgICA2MTp7aWQ6NjEsdHlwZTpcIktNX0VSUk9SX0RFVklDRV9GTEFTSFwiLG1zZzpcIktNX0VSUk9SX0RFVklDRV9GTEFTSFwifSwvL+WGheWuueacquWumue+qVxuICAgICAgICAgICAgNjI6e2lkOjYyLHR5cGU6XCJLTV9FUlJPUl9ERVZJQ0VfTEVEXCIsbXNnOlwiS01fRVJST1JfREVWSUNFX0xFRFwifSwvL+WGheWuueacquWumue+qVxuICAgICAgICAgICAgNjM6e2lkOjYzLHR5cGU6XCJLTV9FUlJPUl9ERVZJQ0VfSU1VXCIsbXNnOlwiS01fRVJST1JfREVWSUNFX0lNVVwifSwvL+WGheWuueacquWumue+qVxuICAgICAgICAgICAgNzA6e2lkOjcwLHR5cGU6XCJLTV9FUlJPUl9OUkZfREVWSUNFXCIsbXNnOlwiRXJyb3IgcmVsYXRlZCB0byBCTEUgbW9kdWxlIChuUkY1MjgzMilcIn0sLy9CTEXjg6Ljgrjjg6Xjg7zjg6vjga7jgqjjg6njg7xcbiAgICAgICAgICAgIDgwOntpZDo4MCx0eXBlOlwiS01fRVJST1JfV0RUX0VWRU5UXCIsbXNnOlwiV2F0Y2ggRG9nIFRpbWVyIEV2ZW50XCJ9LC8v44Km44Kp44OD44OB44OJ44OD44Kw44K/44Kk44Oe44O844Kk44OZ44Oz44OI44Gu55m65YuV77yI5YaN6LW35YuV55u05YmN77yJXG4gICAgICAgICAgICA4MTp7aWQ6ODEsdHlwZTpcIktNX0VSUk9SX09WRVJfSEVBVFwiLG1zZzpcIk92ZXIgSGVhdCAob3ZlciB0ZW1wZXJhdHVyZSlcIn0sLy/muKnluqbnlbDluLjvvIjjg57jgqTjgrPjg7PmuKnluqbjgYwy5YiG5Lul5LiKNjDluqbjgpLotoXpgY7vvIlcbiAgICAgICAgICAgIDEwMDp7aWQ6MTAwLHR5cGU6XCJLTV9TVUNDRVNTX0FSUklWQUxcIixtc2c6XCJQb3NpdGlvbiBBcnJpdmFsIE5vdGlmaWNhdGlvblwifS8v5L2N572u5Yi25b6h5pmC44Gr5oyH5a6a5L2N572u44Gr5Yiw6YGU44GX44Gf5aC05ZCI44Gu6YCa55+lXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOODl+ODreODkeODhuOCo1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIOODh+ODkOOCpOOCueaDheWgsVxuICAgICAqIEB0eXBlIHtLTURldmljZUluZm99XG4gICAgICpcbiAgICAgKi9cbiAgICBnZXQgZGV2aWNlSW5mbygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZGV2aWNlSW5mby5DbG9uZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOacieWKueeEoeWKuVxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIGdldCBpc0Nvbm5lY3QoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RldmljZUluZm8uaXNDb25uZWN0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOCs+ODnuODs+ODiemghuebo+imlueUqOmAo+eVquOBrueZuuihjFxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IGNyZWF0ZUNvbW1hbmRJRCgpe1xuICAgICAgIHJldHVybiB0aGlzLl9jb21tYW5kQ291bnQ9KCsrdGhpcy5fY29tbWFuZENvdW50KSYwYjExMTExMTExMTExMTExMTE7Ly82NTUzNeOBp+ODq+ODvOODl1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGlzQ29ubmVjdOOBruioreWumuWkieabtCjlrZDjgq/jg6njgrnjgYvjgonkvb/nlKgpXG4gICAgICogQHBhcmFtIHtib29sZWFufSBib29sXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIF9zdGF0dXNDaGFuZ2VfaXNDb25uZWN0KGJvb2wpe1xuICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmlzQ29ubmVjdD1ib29sO1xuICAgICAgICBpZih0aGlzLl9pc0luaXQpe1xuICAgICAgICAgICAgaWYoYm9vbCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25Db25uZWN0SGFuZGxlcih0aGlzKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX29uRGlzY29ubmVjdEhhbmRsZXIodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDliJ3mnJ/ljJbnirbmhYvjga7oqK3lrpoo5a2Q44Kv44Op44K544GL44KJ5L2/55SoKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYm9vbFxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBfc3RhdHVzQ2hhbmdlX2luaXQoYm9vbCl7XG4gICAgICAgIHRoaXMuX2lzSW5pdD1ib29sO1xuICAgICAgICBpZih0aGlzLl9pc0luaXQpe1xuICAgICAgICAgICAgdGhpcy5fb25Jbml0SGFuZGxlcih0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIGNhbGxiYWNrXG4gICAgICoqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICog5Yid5pyf5YyW5a6M5LqG44GX44Gm5Yip55So44Gn44GN44KL44KI44GG44Gr44Gq44Gj44GfXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKEtNQ29tQmFzZSl9XG4gICAgICovXG4gICAgc2V0IG9uSW5pdChoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkluaXRIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDlv5znrZTjg7vlho3mjqXntprjgavmiJDlip/jgZfjgZ9cbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oS01Db21CYXNlKX1cbiAgICAgKi9cbiAgICBzZXQgb25Db25uZWN0KGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uQ29ubmVjdEhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOW/nOetlOOBjOeEoeOBj+OBquOBo+OBn+ODu+WIh+aWreOBleOCjOOBn1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihLTUNvbUJhc2UpfVxuICAgICAqL1xuICAgIHNldCBvbkRpc2Nvbm5lY3QoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25EaXNjb25uZWN0SGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog5o6l57aa44Gr5aSx5pWXXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKEtNQ29tQmFzZSxzdHJpbmcpfVxuICAgICAqL1xuICAgIHNldCBvbkNvbm5lY3RGYWlsdXJlKGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uQ29ubmVjdEZhaWx1cmVIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBruWbnui7ouaDheWgsWNhbGxiYWNrXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKHBvc2l0aW9uOm51bWJlcix2ZWxvY2l0eTpudW1iZXIsdG9ycXVlOm51bWJlcil9XG4gICAgICovXG4gICAgc2V0IG9uTW90b3JNZWFzdXJlbWVudChmdW5jKXtcbiAgICAgICAgaWYodHlwZW9mIGZ1bmM9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Nb3Rvck1lYXN1cmVtZW50Q0I9ZnVuYztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga7jgrjjg6PjgqTjg63mg4XloLFjYWxsYmFja1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbih7YWNjZWxYOm51bWJlcixhY2NlbFk6bnVtYmVyLGFjY2VsWjpudW1iZXIsdGVtcDpudW1iZXIsZ3lyb1g6bnVtYmVyLGd5cm9ZOm51bWJlcixneXJvWjpudW1iZXJ9KX1cbiAgICAgKi9cbiAgICBzZXQgb25JbXVNZWFzdXJlbWVudChmdW5jKXtcbiAgICAgICAgaWYodHlwZW9mIGZ1bmM9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25JbXVNZWFzdXJlbWVudENCPWZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHlj5blvpdjYWxsYmFja1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihyZWdpc3RlckNtZDpudW1iZXIscmVzOm51bWJlcil9XG4gICAgICovXG4gICAgc2V0IG9uTW90b3JTZXR0aW5nKGZ1bmMpe1xuICAgICAgICBpZih0eXBlb2YgZnVuYz09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yU2V0dGluZ0NCPWZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Ot44Kw5oOF5aCx5Y+W5b6XY2FsbGJhY2tcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oY21kSUQ6bnVtYmVyLHJlczplcnJvcmxvZ09iamVjdCl9XG4gICAgICovXG4gICAgc2V0IG9uTW90b3JMb2coZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JMb2dDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuXG4vLy8vLy9jbGFzcy8vXG59XG5cbm1vZHVsZS5leHBvcnRzID1LTUNvbUJhc2U7XG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvS01Db21CYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLyoqKlxuICogS01Nb3RvckNvbW1hbmRLTU9uZS5qc1xuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZShcImV2ZW50c1wiKS5FdmVudEVtaXR0ZXI7XG5jb25zdCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcbmNvbnN0IEtNQ29tV2ViQkxFID0gcmVxdWlyZSgnLi9LTUNvbVdlYkJMRScpO1xuY29uc3QgS01TdHJ1Y3R1cmVzPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzJyk7XG5cblxuLyoqXG4gKiBAY2xhc3NkZXNjIEtNMeOCs+ODnuODs+ODiemAgeS/oeOCr+ODqeOCuVxuICogQGlnbm9yZVxuICovXG5jbGFzcyBLTU1vdG9yQ29tbWFuZEtNT25lIGV4dGVuZHMgRXZlbnRFbWl0dGVye1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWumuaVsFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDmjqXntprmlrnlvI/lrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBXRUJCTEUgLSAxOldFQkJMRVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBCTEUgLSAyOkJMRVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBTRVJJQUwgLSAzOlNFUklBTFxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgS01fQ09OTkVDVF9UWVBFKCl7XG4gICAgICAgIHJldHVybiB7XCJXRUJCTEVcIjoxLFwiQkxFXCI6MixcIlNFUklBTFwiOjN9O1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogY21kUHJlcGFyZVBsYXliYWNrTW90aW9u44Gu6ZaL5aeL5L2N572u44Kq44OX44K344On44Oz5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gU1RBUlRfUE9TSVRJT05fQUJTIC0gMDroqJjmhrbjgZXjgozjgZ/plovlp4vkvY3nva7vvIjntbblr77luqfmqJnvvInjgYvjgonjgrnjgr/jg7zjg4hcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gU1RBUlRfUE9TSVRJT05fQ1VSUkVOVCAtIDE654++5Zyo44Gu5L2N572u44KS6ZaL5aeL5L2N572u44Go44GX44Gm44K544K/44O844OIXG4gICAgICovXG4gICAgc3RhdGljIGdldCBjbWRQcmVwYXJlUGxheWJhY2tNb3Rpb25fU1RBUlRfUE9TSVRJT04oKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ1NUQVJUX1BPU0lUSU9OX0FCUyc6MCxcbiAgICAgICAgICAgICdTVEFSVF9QT1NJVElPTl9DVVJSRU5UJzoxXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNtZExlZOOBrkxFROOBrueCueeBr+eKtuaFi+OCquODl+OCt+ODp+ODs+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IExFRF9TVEFURV9PRkYgLSAwOua2iOeBr1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBMRURfU1RBVEVfT05fU09MSUQgLSAxOkxFROeCueeBr++8iOeCueeBr+OBl+OBo+OBseOBquOBl++8iVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBMRURfU1RBVEVfT05fRkxBU0ggLSAyOkxFROeCuea7he+8iOS4gOWumumWk+malOOBp+eCuea7he+8iVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBMRURfU1RBVEVfT05fRElNIC0gOjNMRUTjgYzjgobjgaPjgY/jgormmI7mu4XjgZnjgotcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZExlZF9MRURfU1RBVEUoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ0xFRF9TVEFURV9PRkYnOjAsXG4gICAgICAgICAgICAnTEVEX1NUQVRFX09OX1NPTElEJzoxLFxuICAgICAgICAgICAgJ0xFRF9TVEFURV9PTl9GTEFTSCc6MixcbiAgICAgICAgICAgICdMRURfU1RBVEVfT05fRElNJzozXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNtZEN1cnZlVHlwZeOBruWKoOa4m+mAn+OCq+ODvOODluOCquODl+OCt+ODp+ODs+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IENVUlZFX1RZUEVfTk9ORSAtIDA644Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9GRlxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBDVVJWRV9UWVBFX1RSQVBFWk9JRCAtIDE644Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9OIO+8iOWPsOW9ouWKoOa4m+mAn++8iVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ0NVUlZFX1RZUEVfTk9ORSc6IDAsXG4gICAgICAgICAgICAnQ1VSVkVfVFlQRV9UUkFQRVpPSUQnOjFcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWzjga7jg6Ljg7zjgr/jg7zmuKzlrprlgKTjga7lj5blvpfplpPpmpTlrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzVNUyAtIDA6NU1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTBNUyAtIDE6MTBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzIwTVMgLSAyOjIwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF81ME1TIC0gMzo1ME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTAwTVMgLSA0OjEwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMjAwTVMgLSA1OjIwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfNTAwTVMgLSA2OjUwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTAwME1TIC0gNzoxMDAwTVNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZE1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbF9NT1RPUl9NRUFTX0lOVEVSVkFMKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzVNUyc6IDAsXG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF8xME1TJzoxLFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfMjBNUyc6MixcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzUwTVMnOjMsXG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF8xMDBNUyc6NCxcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzIwME1TJzo1LFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfNTAwTVMnOjYsXG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF8xMDAwTVMnOjdcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbOOBruWKoOmAn+W6puODu+OCuOODo+OCpOODrea4rOWumuWApOOBruWPluW+l+mWk+malOWumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfNU1TIC0gMDo1TVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8xME1TIC0gMToxME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMjBNUyAtIDI6MjBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzUwTVMgLSAzOjUwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8xMDBNUyAtIDQ6MTAwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8yMDBNUyAtIDU6MjAwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF81MDBNUyAtIDY6NTAwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8xMDAwTVMgLSA3OjEwMDBNU1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbF9JTVVfTUVBU19JTlRFUlZBTCgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfNU1TJzogMCxcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF8xME1TJzoxLFxuICAgICAgICAgICAgJ0lNVV9NRUFTX0lOVEVSVkFMXzIwTVMnOjIsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfNTBNUyc6MyxcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF8xMDBNUyc6NCxcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF8yMDBNUyc6NSxcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF81MDBNUyc6NixcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF8xMDAwTVMnOjdcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLypcbiAgICAqIFJlYWRSZWdpc3RlcuOBp+WPluW+l+OBmeOCi+aZgueUqOOBruOCs+ODnuODs+ODieW8leaVsOWumuaVsFxuICAgICogQHJlYWRvbmx5XG4gICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IG1heFNwZWVkIC0gMjrmnIDlpKfpgJ/jgZVcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtaW5TcGVlZCAtIDM65pyA5bCP6YCf44GVXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gY3VydmVUeXBlIC0gNTrliqDmuJvpgJ/mm7Lnt5pcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBhY2MgLSA3OuWKoOmAn+W6plxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGRlYyAtIDg65rib6YCf5bqmXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gbWF4VG9ycXVlIC0gMTQ65pyA5aSn44OI44Or44KvXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcUN1cnJlbnRQIC0gMjQ6cei7uOmbu+a1gVBJROOCsuOCpOODsyhQKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHFDdXJyZW50SSAtIDI1OnHou7jpm7vmtYFQSUTjgrLjgqTjg7MoSSlcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBxQ3VycmVudEQgLSAyNjpx6Lu46Zu75rWBUElE44Ky44Kk44OzKEQpXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gc3BlZWRQIC0gMjc66YCf5bqmUElE44Ky44Kk44OzKFApXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gc3BlZWRJIC0gMjg66YCf5bqmUElE44Ky44Kk44OzKEkpXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gc3BlZWREIC0gMjk66YCf5bqmUElE44Ky44Kk44OzKEQpXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcG9zaXRpb25QIC0gMzA65L2N572uUElE44Ky44Kk44OzKFApXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcG9zaXRpb25JIC0gMzE65L2N572uUElE44Ky44Kk44OzKEkpXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcG9zaXRpb25EIC0gMzI65L2N572uUElE44Ky44Kk44OzKEQpXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcG9zQ29udHJvbFRocmVzaG9sZCAtIDMzOuODouODvOOCv+ODvOOBruS9jee9ruWItuW+oeaZguOAgUlE5Yi25b6h44KS5pyJ5Yq544Gr44GZ44KL5YGP5beu44Gu57W25a++5YCkXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gaW50ZXJmYWNlIC0gNDY644Oi44O844K/44O86YCa5L+h57WM6LevXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcmVzcG9uc2UgLSA0ODrjgrPjg57jg7Pjg4njgpLlj5fkv6HjgZfjgZ/jgajjgY3jgavpgJrnn6XjgZnjgovjgYtcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBvd25Db2xvciAtIDU4OuODh+ODkOOCpOOCuUxFROOBruWbuuacieiJslxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGRldmljZU5hbWUgLSA3MDpcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkZXZpY2VJbmZvIC0gNzE6XG4gICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZFJlYWRSZWdpc3Rlcl9DT01NQU5EKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgIFwibWF4U3BlZWRcIjoweDAyLFxuICAgICAgICAgICAgXCJtaW5TcGVlZFwiOjB4MDMsXG4gICAgICAgICAgICBcImN1cnZlVHlwZVwiOjB4MDUsXG4gICAgICAgICAgICBcImFjY1wiOjB4MDcsXG4gICAgICAgICAgICBcImRlY1wiOjB4MDgsXG4gICAgICAgICAgICBcIm1heFRvcnF1ZVwiOjB4MEUsXG4gICAgICAgICAgICBcInFDdXJyZW50UFwiOjB4MTgsXG4gICAgICAgICAgICBcInFDdXJyZW50SVwiOjB4MTksXG4gICAgICAgICAgICBcInFDdXJyZW50RFwiOjB4MUEsXG4gICAgICAgICAgICBcInNwZWVkUFwiOjB4MUIsXG4gICAgICAgICAgICBcInNwZWVkSVwiOjB4MUMsXG4gICAgICAgICAgICBcInNwZWVkRFwiOjB4MUQsXG4gICAgICAgICAgICBcInBvc2l0aW9uUFwiOjB4MUUsXG4gICAgICAgICAgICBcInBvc2l0aW9uSVwiOjB4MUYsXG4gICAgICAgICAgICBcInBvc2l0aW9uRFwiOjB4MjAsXG4gICAgICAgICAgICBcInBvc0NvbnRyb2xUaHJlc2hvbGRcIjoweDIxLFxuICAgICAgICAgICAgXCJpbnRlcmZhY2VcIjoweDJFLFxuICAgICAgICAgICAgXCJyZXNwb25zZVwiOjB4MzAsXG4gICAgICAgICAgICBcIm93bkNvbG9yXCI6MHgzQSxcbiAgICAgICAgICAgIFwiZGV2aWNlTmFtZVwiOjB4NDYsXG4gICAgICAgICAgICBcImRldmljZUluZm9cIjoweDQ3XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qXG4gICAgICAgKiDjg6Ljg7zjgr/jg7zliLblvqHmiYvmrrXvvIjjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnvvInjga7ntYzot6/mjIflrprnlKjlrprmlbBcbiAgICAgICAqIEByZWFkb25seVxuICAgICAgICogQGVudW0ge251bWJlcn1cbiAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBCTEUgLSAweDE6QkxFXG4gICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gVVNCIC0gMHgxMDAwOlVTQlxuICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IEkyQyAtIDB4MTAwMDA6STJDXG4gICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gSEREQlROIC0gMHgxMDAwMDAwMDrniannkIbjg5zjgr/jg7NcbiAgICAgICAqL1xuICAgIHN0YXRpYyBnZXQgY21kSW50ZXJmYWNlX0lOVEVSRkFDRV9UWVBFKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgIFwiQkxFXCI6MGIxLFxuICAgICAgICAgICAgXCJVU0JcIjowYjEwMDAsXG4gICAgICAgICAgICBcIkkyQ1wiOjBiMTAwMDAsXG4gICAgICAgICAgICBcIkhEREJUTlwiOjBiMTAwMDAwMDBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3LjgIBcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuS01fQ09OTkVDVF9UWVBFfSBjb25uZWN0X3R5cGUg5o6l57aa5pa55byPXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGttY29tIOmAmuS/oeOCquODluOCuOOCp+OCr+ODiCB7QGxpbmsgS01Db21CTEV9IHtAbGluayBLTUNvbVdlYkJMRX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbm5lY3RfdHlwZSxrbWNvbSl7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOOCpOODmeODs+ODiOOCv+OCpOODl+WumuaVsFxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICogQGVudW0ge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuRVZFTlRfVFlQRT17XG4gICAgICAgICAgICAvKiog5Yid5pyf5YyW5a6M5LqG5pmCPGJyPnJldHVybjpmdW5jdGlvbih7S01EZXZpY2VJbmZvfSkgKi8gaW5pdDpcImluaXRcIixcbiAgICAgICAgICAgIC8qKiDmjqXntprmmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtLTURldmljZUluZm99KSAqLyBjb25uZWN0OlwiY29ubmVjdFwiLFxuICAgICAgICAgICAgLyoqIOWIh+aWreaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0tNRGV2aWNlSW5mb30pICovIGRpc2Nvbm5lY3Q6XCJkaXNjb25uZWN0XCIsXG4gICAgICAgICAgICAvKiog5o6l57aa44Gr5aSx5pWX5pmCPGJyPnJldHVybjpmdW5jdGlvbih7S01EZXZpY2VJbmZvfSx7bXNnfSkgKi8gY29ubmVjdEZhaWx1cmU6XCJjb25uZWN0RmFpbHVyZVwiLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOWbnui7ouaDheWgseWPl+S/oeaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0BsaW5rIEtNUm90U3RhdGV9KSAqLyBtb3Rvck1lYXN1cmVtZW50OlwibW90b3JNZWFzdXJlbWVudFwiLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvElNVeaDheWgseWPl+S/oeaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0BsaW5rIEtNSW11U3RhdGV9KSAqLyBpbXVNZWFzdXJlbWVudDpcImltdU1lYXN1cmVtZW50XCIsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844Ot44Kw5oOF5aCx5Y+X5L+h5pmCPGJyPnJldHVybjpmdW5jdGlvbih7Y21kTmFtZX0se2Vycm9ybG9nT2JqZWN0fSkgKi8gbW90b3JMb2c6XCJtb3RvckxvZ1wiLFxuICAgICAgICB9O1xuICAgICAgICBPYmplY3QuZnJlZXplKHRoaXMuRVZFTlRfVFlQRSk7Ly9pbmZvOjrlvozjgYvjgonjg5Xjg6rjg7zjgrrjgZfjgarjgYTjgahqc2RvY+OBjOeUn+aIkOOBleOCjOOBquOBhOOAglxuICAgICAgICAvKipcbiAgICAgICAgICog44Oi44O844K/44O844Gu5YWo44Kz44Oe44Oz44OJXG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAaWdub3JlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9NT1RPUl9DT01NQU5EPXtcbiAgICAgICAgICAgIC8qKiDmnIDlpKfpgJ/jgZXjgpLoqK3lrprjgZnjgosgKi8gbWF4U3BlZWQ6MHgwMixcbiAgICAgICAgICAgIC8qKiDmnIDlsI/pgJ/jgZXjgpLoqK3lrprjgZnjgosgKi8gbWluU3BlZWQ6MHgwMyxcbiAgICAgICAgICAgIC8qKiDliqDmuJvpgJ/mm7Lnt5rjgpLoqK3lrprjgZnjgosgKi8gY3VydmVUeXBlOjB4MDUsXG4gICAgICAgICAgICAvKiog5Yqg6YCf5bqm44KS6Kit5a6a44GZ44KLICovIGFjYzoweDA3LFxuICAgICAgICAgICAgLyoqIOa4m+mAn+W6puOCkuioreWumuOBmeOCiyAqLyBkZWM6MHgwOCxcbiAgICAgICAgICAgIC8qKiDmnIDlpKfjg4jjg6vjgq/jgpLoqK3lrprjgZnjgosgKi8gbWF4VG9ycXVlOjB4MEUsXG4gICAgICAgICAgICAvKiog44OG44Kj44O844OB44Oz44Kw6ZaT6ZqUICovIHRlYWNoaW5nSW50ZXJ2YWw6MHgxNixcbiAgICAgICAgICAgIC8qKiDjg5fjg6zjgqTjg5Djg4Pjgq/plpPpmpQgKi8gcGxheWJhY2tJbnRlcnZhbDoweDE3LFxuICAgICAgICAgICAgLyoqIHHou7jpm7vmtYFQSUTjgrLjgqTjg7MoUCnjgpLoqK3lrprjgZnjgosgKi8gcUN1cnJlbnRQOjB4MTgsXG4gICAgICAgICAgICAvKiogcei7uOmbu+a1gVBJROOCsuOCpOODsyhJKeOCkuioreWumuOBmeOCiyAqLyBxQ3VycmVudEk6MHgxOSxcbiAgICAgICAgICAgIC8qKiBx6Lu46Zu75rWBUElE44Ky44Kk44OzKEQp44KS6Kit5a6a44GZ44KLICovIHFDdXJyZW50RDoweDFBLFxuICAgICAgICAgICAgLyoqIOmAn+W6plBJROOCsuOCpOODsyhQKeOCkuioreWumuOBmeOCiyAqLyBzcGVlZFA6MHgxQixcbiAgICAgICAgICAgIC8qKiDpgJ/luqZQSUTjgrLjgqTjg7MoSSnjgpLoqK3lrprjgZnjgosgKi8gc3BlZWRJOjB4MUMsXG4gICAgICAgICAgICAvKiog6YCf5bqmUElE44Ky44Kk44OzKEQp44KS6Kit5a6a44GZ44KLICovIHNwZWVkRDoweDFELFxuICAgICAgICAgICAgLyoqIOS9jee9rlBJROOCsuOCpOODsyhQKeOCkuioreWumuOBmeOCiyAqLyBwb3NpdGlvblA6MHgxRSxcbiAgICAgICAgICAgIC8qKiDkvY3nva5QSUTjgrLjgqTjg7MoSSnjgpLoqK3lrprjgZnjgosgKi8gcG9zaXRpb25JOjB4MUYsXG4gICAgICAgICAgICAvKiog5L2N572uUElE44Ky44Kk44OzKEQp44KS6Kit5a6a44GZ44KLICovIHBvc2l0aW9uRDoweDIwLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOBruS9jee9ruWItuW+oeaZguOAgUlE5Yi25b6h44KS5pyJ5Yq544Gr44GZ44KL5YGP5beu44Gu57W25a++5YCk44KS5oyH5a6a44GZ44KLICovIHBvc0NvbnRyb2xUaHJlc2hvbGQ6MHgyMSxcblxuICAgICAgICAgICAgLyoqIFBJROOCsuOCpOODs+OCkuODquOCu+ODg+ODiOOBmeOCiyAqLyByZXNldFBJRDoweDIyLFxuICAgICAgICAgICAgLyoqIOS9jee9ruWItuW+oeaZguOAgeebruaomeS9jee9ruOBq+WIsOmBlOaZguOAgeWIpOWumuadoeS7tuOCkua6gOOBn+OBl+OBn+WgtOWQiOmAmuefpeOCkuihjOOBhiovIG5vdGlmeVBvc0Fycml2YWw6MHgyQixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zmuKzlrprlgKTjga7lj5blvpfplpPpmpQoVVNCLEkyQ+OBruOBvykgKi8gbW90b3JNZWFzdXJlbWVudEludGVydmFsOjB4MkMsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O85ris5a6a5YCk44Gu5Y+W5b6X6Kit5a6aICovIG1vdG9yTWVhc3VyZW1lbnRCeURlZmF1bHQ6MHgyRCxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zliLblvqHmiYvmrrXvvIjjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnvvInjga7oqK3lrpogKi8gaW50ZXJmYWNlOjB4MkUsXG4gICAgICAgICAgICAvKiog44Kz44Oe44Oz44OJ44KS5Y+X5L+h44GX44Gf44Go44GN44Gr5oiQ5Yqf6YCa55+l77yIZXJyb3JDb2RlID0gMO+8ieOCkuOBmeOCi+OBi+OBqeOBhuOBiyAqLyByZXNwb25zZToweDMwLFxuXG4gICAgICAgICAgICAvKiog44OH44OQ44Kk44K5TEVE44Gu5Zu65pyJ6Imy44KS6Kit5a6a44GZ44KLICovIG93bkNvbG9yOjB4M0EsXG4gICAgICAgICAgICAvKiogSU1V5ris5a6a5YCk6YCa55+l6ZaT6ZqU77yI5pyJ57ea44Gu44G/77yJICovIGlNVU1lYXN1cmVtZW50SW50ZXJ2YWw6MHgzQyxcbiAgICAgICAgICAgIC8qKiDjg4fjg5Xjgqnjg6vjg4jjgafjga5JTVXmuKzlrprlgKTpgJrnn6VPTi9PRkYgKi8gaU1VTWVhc3VyZW1lbnRCeURlZmF1bHQ6MHgzRCxcblxuICAgICAgICAgICAgLyoqIOaMh+WumuOBruioreWumuWApOOCkuWPluW+l+OBmeOCiyAqLyByZWFkUmVnaXN0ZXI6MHg0MCxcbiAgICAgICAgICAgIC8qKiDlhajjgabjga7oqK3lrprlgKTjgpLjg5Xjg6njg4Pjgrfjg6Xjgavkv53lrZjjgZnjgosgKi8gc2F2ZUFsbFJlZ2lzdGVyczoweDQxLFxuXG4gICAgICAgICAgICAvKiog44OH44OQ44Kk44K544ON44O844Og44Gu5Y+W5b6XICovIHJlYWREZXZpY2VOYW1lOjB4NDYsXG4gICAgICAgICAgICAvKiog44OH44OQ44Kk44K55oOF5aCx44Gu5Y+W5b6XICovIHJlYWREZXZpY2VJbmZvOjB4NDcsXG4gICAgICAgICAgICAvKiog5oyH5a6a44Gu6Kit5a6a5YCk44KS44Oq44K744OD44OI44GZ44KLICovIHJlc2V0UmVnaXN0ZXI6MHg0RSxcbiAgICAgICAgICAgIC8qKiDlhajoqK3lrprlgKTjgpLjg6rjgrvjg4Pjg4jjgZnjgosgKi8gcmVzZXRBbGxSZWdpc3RlcnM6MHg0RixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zjga7li5XkvZzjgpLkuI3oqLHlj6/jgajjgZnjgosgKi8gZGlzYWJsZToweDUwLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOWLleS9nOOCkuioseWPr+OBmeOCiyAqLyBlbmFibGU6MHg1MSxcbiAgICAgICAgICAgIC8qKiDpgJ/luqbjga7lpKfjgY3jgZXjgpLoqK3lrprjgZnjgosgKi8gc3BlZWQ6MHg1OCxcbiAgICAgICAgICAgIC8qKiDkvY3nva7jga7jg5fjg6rjgrvjg4Pjg4jjgpLooYzjgYbvvIjljp/ngrnoqK3lrprvvIkgKi8gcHJlc2V0UG9zaXRpb246MHg1QSxcbiAgICAgICAgICAgIC8qKiDkvY3nva7jga7jg5fjg6rjgrvjg4Pjg4jjgavplqLjgZnjgotPRkZTRVTph48gKi8gcmVhZFBvc2l0aW9uT2Zmc2V0OjB4NUIsXG5cbiAgICAgICAgICAgIC8qKiDmraPlm57ou6LjgZnjgovvvIjlj43mmYLoqIjlm57jgorvvIkgKi8gcnVuRm9yd2FyZDoweDYwLFxuICAgICAgICAgICAgLyoqIOmAhuWbnui7ouOBmeOCi++8iOaZguioiOWbnuOCiu+8iSAqLyBydW5SZXZlcnNlOjB4NjEsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844KS5oyH5a6a6YCf5bqm44Gn5Zue6Lui44GV44Gb44KLICovIHJ1bjoweDYyLFxuICAgICAgICAgICAgLyoqIOe1tuWvvuS9jee9ruOBq+enu+WLleOBmeOCiyjpgJ/luqbjgYLjgoopICovIG1vdmVUb1Bvc2l0aW9uU3BlZWQ6MHg2NSxcbiAgICAgICAgICAgIC8qKiDntbblr77kvY3nva7jgavnp7vli5XjgZnjgosgKi8gbW92ZVRvUG9zaXRpb246MHg2NixcbiAgICAgICAgICAgIC8qKiDnm7jlr77kvY3nva7jgavnp7vli5XjgZnjgoso6YCf5bqm44GC44KKKSAqLyBtb3ZlQnlEaXN0YW5jZVNwZWVkOjB4NjcsXG4gICAgICAgICAgICAvKiog55u45a++5L2N572u44Gr56e75YuV44GZ44KLICovIG1vdmVCeURpc3RhbmNlOjB4NjgsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844Gu5Yqx56OB44KS5YGc5q2i44GZ44KLICovIGZyZWU6MHg2QyxcbiAgICAgICAgICAgIC8qKiDpgJ/luqbjgrzjg63jgb7jgafmuJvpgJ/jgZflgZzmraLjgZnjgosgKi8gc3RvcDoweDZELFxuICAgICAgICAgICAgLyoqIOODiOODq+OCr+WItuW+oeOCkuihjOOBhiAqLyBob2xkVG9ycXVlOjB4NzIsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44KS5a6f6KGM44GZ44KLICovIHN0YXJ0RG9pbmdUYXNrc2V0OjB4ODEsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44KS5YGc5q2iICovIHN0b3BEb2luZ1Rhc2tzZXQ6MHg4MixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgrfjg6fjg7PjgpLlho3nlJ/vvIjmupblgpnjgarjgZfvvIkgKi8gc3RhcnRQbGF5YmFja01vdGlvbjoweDg1LFxuICAgICAgICAgICAgLyoqIOODouODvOOCt+ODp+ODs+WGjeeUn+OCkuWBnOatouOBmeOCiyAqLyBzdG9wUGxheWJhY2tNb3Rpb246MHg4OCxcbiAgICAgICAgICAgIC8qKiDjgq3jg6Xjg7zjgpLlgZzmraLjgZnjgosgKi8gcGF1c2VRdWV1ZToweDkwLFxuICAgICAgICAgICAgLyoqIOOCreODpeODvOOCkuWGjemWi+OBmeOCiyAqLyByZXN1bWVRdWV1ZToweDkxLFxuICAgICAgICAgICAgLyoqIOOCreODpeODvOOCkuaMh+WumuaZgumWk+WBnOatouOBl+WGjemWi+OBmeOCiyAqLyB3YWl0UXVldWU6MHg5MixcbiAgICAgICAgICAgIC8qKiDjgq3jg6Xjg7zjgpLjg6rjgrvjg4Pjg4jjgZnjgosgKi8gcmVzZXRRdWV1ZToweDk1LFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOBrueKtuaFiyAqLyByZWFkU3RhdHVzOjB4OUEsXG5cbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLjgpLplovlp4vjgZnjgosgKi8gc3RhcnRSZWNvcmRpbmdUYXNrc2V0OjB4QTAsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44KS5YGc5q2i44GZ44KLICovIHN0b3BSZWNvcmRpbmdUYXNrc2V0OjB4QTIsXG4gICAgICAgICAgICAvKiog5oyH5a6a44Gu44K/44K544Kv44K744OD44OI44KS5YmK6Zmk44GZ44KLICovIGVyYXNlVGFza3NldDoweEEzLFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOCkuWFqOWJiumZpOOBmeOCiyAqLyBlcmFzZUFsbFRhc2tzZXQ6MHhBNCxcbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLlkI3oqK3lrpogKi8gc2V0VGFza3NldE5hbWU6MHhBNSxcbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jlhoXlrrnmiormj6EgKi8gcmVhZFRhc2tzZXRJbmZvOjB4QTYsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI5L2/55So54q25rOB5oqK5o+hICovIHJlYWRUYXNrc2V0VXNhZ2U6MHhBNyxcbiAgICAgICAgICAgIC8qKiDjg4DjgqTjg6zjgq/jg4jjg4bjgqPjg7zjg4Hjg7PjgrDplovlp4vvvIjmupblgpnjgarjgZfvvIkgKi8gc3RhcnRUZWFjaGluZ01vdGlvbjoweEE5LFxuICAgICAgICAgICAgLyoqIOODhuOCo+ODvOODgeODs+OCsOOCkuWBnOatouOBmeOCiyAqLyBzdG9wVGVhY2hpbmdNb3Rpb246MHhBQyxcbiAgICAgICAgICAgIC8qKiDjg4bjgqPjg7zjg4Hjg7PjgrDjgafopprjgYjjgZ/li5XkvZzjgpLliYrpmaTjgZnjgosgKi8gZXJhc2VNb3Rpb246MHhBRCxcbiAgICAgICAgICAgIC8qKiDjg4bjgqPjg7zjg4Hjg7PjgrDjgafopprjgYjjgZ/lhajli5XkvZzjgpLliYrpmaTjgZnjgosgKi8gZXJhc2VBbGxNb3Rpb246MHhBRSxcbiAgICAgICAgICAgIC8qKiBJMkPjgrnjg6zjg7zjg5bjgqLjg4njg6zjgrkgKi8gc2V0STJDU2xhdmVBZGRyZXNzOjB4QzAsXG4gICAgICAgICAgICAvKiogTEVE44Gu54K554Gv54q25oWL44KS44K744OD44OI44GZ44KLICovIGxlZDoweEUwLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOBrua4rOWumuWApOWPluW+l++8iOmAmuefpe+8ieOCkumWi+WniyAqLyBlbmFibGVNb3Rvck1lYXN1cmVtZW50OjB4RTYsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844Gu5ris5a6a5YCk5Y+W5b6X77yI6YCa55+l77yJ44KS6ZaL5aeLICovIGRpc2FibGVNb3Rvck1lYXN1cmVtZW50OjB4RTcsXG4gICAgICAgICAgICAvKiogSU1V44Gu5YCk5Y+W5b6XKOmAmuefpSnjgpLplovlp4vjgZnjgosgKi8gZW5hYmxlSU1VTWVhc3VyZW1lbnQ6MHhFQSxcbiAgICAgICAgICAgIC8qKiBJTVXjga7lgKTlj5blvpco6YCa55+lKeOCkuWBnOatouOBmeOCiyAqLyBkaXNhYmxlSU1VTWVhc3VyZW1lbnQ6MHhFQixcblxuICAgICAgICAgICAgLyoqIOOCt+OCueODhuODoOOCkuWGjei1t+WLleOBmeOCiyAqLyByZWJvb3Q6MHhGMCxcbiAgICAgICAgICAgIC8qKiDjg4Hjgqfjg4Pjgq/jgrXjg6DvvIhDUkMxNikg5pyJ5Yq55YyWICovIGVuYWJsZUNoZWNrU3VtOjB4RjMsXG4gICAgICAgICAgICAvKiog44OV44Kh44O844Og44Km44Kn44Ki44Ki44OD44OX44OH44O844OI44Oi44O844OJ44Gr5YWl44KLICovIGVudGVyRGV2aWNlRmlybXdhcmVVcGRhdGU6MHhGRFxuICAgICAgICB9O1xuICAgICAgICBPYmplY3QuZnJlZXplKHRoaXMuX01PVE9SX0NPTU1BTkQpOy8vaW5mbzo65b6M44GL44KJ44OV44Oq44O844K644GX44Gq44GE44GoanNkb2PjgYznlJ/miJDjgZXjgozjgarjgYTjgIJcblxuICAgICAgICAvL+ODouODvOOCv+ODvOOBruWFqOOCs+ODnuODs+ODie+8iOmAhuW8leeUqO+8iVxuICAgICAgICB0aGlzLl9SRVZfTU9UT1JfQ09NTUFORD17fTtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5fTU9UT1JfQ09NTUFORCkuZm9yRWFjaCgoayk9Pnt0aGlzLl9SRVZfTU9UT1JfQ09NTUFORFt0aGlzLl9NT1RPUl9DT01NQU5EW2tdXT1rO30pO1xuICAgICAgICAvL1NlbmROb3RpZnlQcm9taXPjga7jg6rjgrnjg4hcbiAgICAgICAgdGhpcy5fbm90aWZ5UHJvbWlzTGlzdD1bXTtcbiAgICAgICAgdGhpcy5jbWRQcmVwYXJlUGxheWJhY2tNb3Rpb25fU1RBUlRfUE9TSVRJT049dGhpcy5jb25zdHJ1Y3Rvci5jbWRQcmVwYXJlUGxheWJhY2tNb3Rpb25fU1RBUlRfUE9TSVRJT047XG4gICAgICAgIHRoaXMuY21kTGVkX0xFRF9TVEFURT10aGlzLmNvbnN0cnVjdG9yLmNtZExlZF9MRURfU1RBVEU7XG4gICAgICAgIHRoaXMuY21kQ3VydmVUeXBlX0NVUlZFX1RZUEU9dGhpcy5jb25zdHJ1Y3Rvci5jbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRTtcbiAgICAgICAgdGhpcy5jbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxfTU9UT1JfTUVBU19JTlRFUlZBTD10aGlzLmNvbnN0cnVjdG9yLmNtZE1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbF9NT1RPUl9NRUFTX0lOVEVSVkFMO1xuICAgICAgICB0aGlzLmNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUw9dGhpcy5jb25zdHJ1Y3Rvci5jbWRJTVVNZWFzdXJlbWVudEludGVydmFsX0lNVV9NRUFTX0lOVEVSVkFMO1xuICAgICAgICB0aGlzLmNtZEludGVyZmFjZV9JTlRFUkZBQ0VfVFlQRT10aGlzLmNvbnN0cnVjdG9yLmNtZEludGVyZmFjZV9JTlRFUkZBQ0VfVFlQRTtcbiAgICAgICAgdGhpcy5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uPW51bGw7Ly9LTV9TVUNDRVNTX0FSUklWQUznm6PoppbnlKhcbiAgICAgICAgdGhpcy5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uVGltZU91dElkPTA7XG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gc2VjdGlvbjo6ZW50cnkgcG9pbnRcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICB0aGlzLl9jb25uZWN0VHlwZT1jb25uZWN0X3R5cGU7XG4gICAgICAgIHRoaXMuX0tNQ29tPWttY29tO1xuXG4gICAgICAgIC8v5YaF6YOo44Kk44OZ44Oz44OI44OQ44Kk44Oz44OJXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uSW5pdD0oY29ubmVjdG9yKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5pbml0LGNvbm5lY3Rvci5kZXZpY2VJbmZvKTsvL+ODh+ODkOOCpOOCueaDheWgseOCkui/lOOBmVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9LTUNvbS5vbkNvbm5lY3Q9KGNvbm5lY3Rvcik9PntcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUuY29ubmVjdCxjb25uZWN0b3IuZGV2aWNlSW5mbyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX0tNQ29tLm9uRGlzY29ubmVjdD0oY29ubmVjdG9yKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5kaXNjb25uZWN0LGNvbm5lY3Rvci5kZXZpY2VJbmZvKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fS01Db20ub25Db25uZWN0RmFpbHVyZT0oY29ubmVjdG9yLCBlcnIpPT57XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLmNvbm5lY3RGYWlsdXJlLGNvbm5lY3Rvci5kZXZpY2VJbmZvLGVycik7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zlm57ou6Lmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIHtLTVJvdFN0YXRlfSByb3RTdGF0ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fS01Db20ub25Nb3Rvck1lYXN1cmVtZW50PShyb3RTdGF0ZSk9PntcbiAgICAgICAgICAgIC8vbGV0IHJvdFN0YXRlPW5ldyBLTVN0cnVjdHVyZXMuS01Sb3RTdGF0ZShyZXMucG9zaXRpb24scmVzLnZlbG9jaXR5LHJlcy50b3JxdWUpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5tb3Rvck1lYXN1cmVtZW50LHJvdFN0YXRlKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvElNVeaDheWgseWPl+S/oVxuICAgICAgICAgKiBAcGFyYW0ge0tNSW11U3RhdGV9IGltdVN0YXRlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9LTUNvbS5vbkltdU1lYXN1cmVtZW50PShpbXVTdGF0ZSk9PntcbiAgICAgICAgICAgIC8vbGV0IGltdVN0YXRlPW5ldyBLTVN0cnVjdHVyZXMuS01JbXVTdGF0ZShyZXMuYWNjZWxYLHJlcy5hY2NlbFkscmVzLmFjY2VsWixyZXMudGVtcCxyZXMuZ3lyb1gscmVzLmd5cm9ZLHJlcy5neXJvWik7XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLmltdU1lYXN1cmVtZW50LGltdVN0YXRlKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvOODreOCsOaDheWgseWPluW+l1xuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gY21kSURcbiAgICAgICAgICogQHBhcmFtIHtLTU1vdG9yTG9nfSBtb3RvckxvZ1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fS01Db20ub25Nb3RvckxvZz0obW90b3JMb2cpPT57XG4gICAgICAgICAgICAvL+OCs+ODnuODs+ODiUlE44GL44KJ44Kz44Oe44Oz44OJ5ZCN44KS5Y+W5b6X6L+95YqgXG4gICAgICAgICAgICBsZXQgY21kTmFtZT10aGlzLl9SRVZfTU9UT1JfQ09NTUFORFttb3RvckxvZy5jbWRJRF0/dGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbbW90b3JMb2cuY21kSURdOm1vdG9yTG9nLmNtZElEO1xuICAgICAgICAgICAgbW90b3JMb2cuY21kTmFtZT1jbWROYW1lO1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5tb3RvckxvZyxtb3RvckxvZyk7XG5cbiAgICAgICAgICAgIC8vaW5mbzo65L2N572u5Yi25b6h5pmC44CB55uu5qiZ5L2N572u44Gr5Yiw6YGU5pmC44CB5Yik5a6a5p2h5Lu244KS5rqA44Gf44GX44Gf5aC05ZCI6YCa55+l44KS6KGM44GGXG4gICAgICAgICAgICBpZihtb3RvckxvZy5lcnJJRD09PTEwMCl7Ly9LTV9TVUNDRVNTX0FSUklWQUxcbiAgICAgICAgICAgICAgIGlmKHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbil7XG4gICAgICAgICAgICAgICAgICAgaWYodGhpcy5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uLnRhZ05hbWU9PT1tb3RvckxvZy5pZCl7XG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi5jYWxsUmVzb2x2ZSh7aWQ6dGhpcy5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uLnRhZ05hbWUsbXNnOidQb3NpdGlvbiBBcnJpdmFsIE5vdGlmaWNhdGlvbicsaW5mbzptb3RvckxvZy5pbmZvfSk7XG4gICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgLy8gdGhpcy5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uLmNhbGxSZWplY3Qoe2lkOnRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi50YWdOYW1lLG1zZzonSW5zdHJ1Y3Rpb24gb3ZlcnJpZGU6JyArY21kTmFtZSxvdmVycmlkZUlkOm1vdG9yTG9nLmlkfSk7XG4gICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHJlZ2lzdGVyQ21kXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZXNcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uTW90b3JTZXR0aW5nPShyZWdpc3RlckNtZCwgcmVzKT0+e1xuICAgICAgICAgICAgX0tNTm90aWZ5UHJvbWlzLnNlbmRHcm91cE5vdGlmeVJlc29sdmUodGhpcy5fbm90aWZ5UHJvbWlzTGlzdCxyZWdpc3RlckNtZCxyZXMpO1xuICAgICAgICB9O1xuXG4gICAgfVxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOODl+ODreODkeODhuOCo1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgajjga7mjqXntprjgYzmnInlirnjgYtcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBnZXQgaXNDb25uZWN0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9LTUNvbS5kZXZpY2VJbmZvLmlzQ29ubmVjdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICog5o6l57aa5pa55byPXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge0tNTW90b3JDb21tYW5kS01PbmUuS01fQ09OTkVDVF9UWVBFfVxuICAgICAqL1xuICAgIGdldCBjb25uZWN0VHlwZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fY29ubmVjdFR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44OH44OQ44Kk44K55oOF5aCxXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge0tNRGV2aWNlSW5mb31cbiAgICAgKi9cbiAgICBnZXQgZGV2aWNlSW5mbygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fS01Db20uZGV2aWNlSW5mbztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zlkI1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCBuYW1lKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9LTUNvbS5kZXZpY2VJbmZvP3RoaXMuX0tNQ29tLmRldmljZUluZm8ubmFtZTpudWxsO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICog5o6l57aa44Kz44ON44Kv44K/44O8XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7S01Db21CYXNlfVxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBnZXQgY29ubmVjdG9yKCl7XG4gICAgICAgIHJldHVybiAgdGhpcy5fS01Db207XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogc2VjdGlvbjo644Oi44O844K/44O844Kz44Oe44Oz44OJIGh0dHBzOi8vZG9jdW1lbnQua2VpZ2FuLW1vdG9yLmNvbS9tb3Rvci1jb250cm9sLWNvbW1hbmQvbW90b3JfYWN0aW9uLmh0bWxcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zli5XkvZzjgpLkuI3oqLHlj6/jgajjgZnjgovvvIjkuIrkvY3lkb3ku6TvvIlcbiAgICAgKiBAZGVzYyDlronlhajnlKjvvJrjgZPjga7lkb3ku6TjgpLlhaXjgozjgovjgajjg6Ljg7zjgr/jg7zjga/li5XkvZzjgZfjgarjgYQ8YnI+XG4gICAgICog44Kz44Oe44Oz44OJ44Gv44K/44K544Kv44K744OD44OI44Gr6KiY6Yyy44GZ44KL44GT44Go44Gv5LiN5Y+vXG4gICAgICovXG4gICAgY21kRGlzYWJsZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZGlzYWJsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O85YuV5L2c44KS6Kix5Y+v44GZ44KL77yI5LiK5L2N5ZG95Luk77yJXG4gICAgICogQGRlc2Mg5a6J5YWo55So77ya44GT44Gu5ZG95Luk44KS5YWl44KM44KL44Go44Oi44O844K/44O844Gv5YuV5L2c5Y+v6IO944Go44Gq44KLPGJyPlxuICAgICAqIOODouODvOOCv+ODvOi1t+WLleaZguOBryBkaXNhYmxlIOeKtuaFi+OBruOBn+OCgeOAgeacrOOCs+ODnuODs+ODieOBp+WLleS9nOOCkuioseWPr+OBmeOCi+W/heimgeOBjOOBguOCijxicj5cbiAgICAgKiDjgrPjg57jg7Pjg4njga/jgr/jgrnjgq/jgrvjg4Pjg4jjgavoqJjpjLLjgZnjgovjgZPjgajjga/kuI3lj69cbiAgICAgKlxuICAgICAqL1xuICAgIGNtZEVuYWJsZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW5hYmxlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6YCf5bqm44Gu5aSn44GN44GV44KS44K744OD44OI44GZ44KL77yI5Y2Y5L2N57O777yaUlBN77yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkX3JwbSBmbG9hdCAgWzAtWCBycG1d44CAKOato+OBruaVsClcbiAgICAgKi9cbiAgICBjbWRTcGVlZF9ycG0oc3BlZWRfcnBtID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkX3JwbSowLjEwNDcxOTc1NTExOTY1OTc3LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWQsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6YCf5bqm44Gu5aSn44GN44GV44KS44K744OD44OI44GZ44KL77yI5Y2Y5L2N57O777ya44Op44K444Ki44Oz77yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIGZsb2F0IOmAn+W6puOBruWkp+OBjeOBlSDljZjkvY3vvJrop5LluqbvvIjjg6njgrjjgqLjg7PvvIkv56eSIFswLVggcnBzXeOAgCjmraPjga7mlbApXG4gICAgICovXG4gICAgY21kU3BlZWQoc3BlZWQgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOS9jee9ruOBruODl+ODquOCu+ODg+ODiOOCkuihjOOBhu+8iOWOn+eCueioreWumu+8ie+8iOWNmOS9jeezu++8muODqeOCuOOCouODs++8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBmbG9hdCDntbblr77op5LluqbvvJpyYWRpYW5zXG4gICAgICovXG4gICAgY21kUHJlc2V0UG9zaXRpb24ocG9zaXRpb24gPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoS01VdGwudG9OdW1iZXIocG9zaXRpb24pLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wcmVzZXRQb3NpdGlvbixidWZmZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDkvY3nva7jga7jg5fjg6rjgrvjg4Pjg4jjgavplqLjgZnjgotPRkZTRVTph49cbiAgICAgKiBAZGVzYyDkvY3nva7jga7jgqrjg5Xjgrvjg4Pjg4jph4/vvIhwcmVzZXRQb3NpdGlvbuOBp+ioreWumuOBl+OBn+WApOOBq+WvvuW/nO+8ieOCkuiqreOBv+WPluOCi1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGludHxBcnJheT59XG4gICAgICovXG4gICAgY21kUmVhZFBvc2l0aW9uT2Zmc2V0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZFJlYWRSZWdpc3Rlcih0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWRQb3NpdGlvbk9mZnNldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5q2j5Zue6Lui44GZ44KL77yI5Y+N5pmC6KiI5Zue44KK77yJXG4gICAgICogQGRlc2MgY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44Gn44CB5q2j5Zue6LuiXG4gICAgICovXG4gICAgY21kUnVuRm9yd2FyZCgpe1xuICAgICAgICBsZXQgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ydW5Gb3J3YXJkKTtcbiAgICAgICAgdGhpcy5fbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCk7Ly/np7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ5a6f6KGM5pmC44GuQ0Ljga5SZWplY3RcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDpgIblm57ou6LjgZnjgovvvIjmmYLoqIjlm57jgorvvIlcbiAgICAgKiBAZGVzYyBjbWRTcGVlZCDjgafkv53lrZjjgZXjgozjgZ/pgJ/luqbjgafjgIHpgIblm57ou6JcbiAgICAgKi9cbiAgICBjbWRSdW5SZXZlcnNlKCl7XG4gICAgICAgIGxldCBjaWQ9dGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJ1blJldmVyc2UpO1xuICAgICAgICB0aGlzLl9tb3ZlU3luY0luc3RydWN0aW9uT3ZlcnJpZGVSZWplY3QoY2lkKTsvL+enu+WLleezu+OBrlN5bmPjgrPjg57jg7Pjg4nlrp/ooYzmmYLjga5DQuOBrlJlamVjdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOCkuaMh+WumumAn+W6puOBp+Wbnui7ouOBleOBm+OCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCBmbG9hdCDpgJ/luqbjga7lpKfjgY3jgZUg5Y2Y5L2N77ya6KeS5bqm77yI44Op44K444Ki44Oz77yJL+enkiBbwrFYIHJwc11cbiAgICAgKi9cbiAgICBjbWRSdW4oc3BlZWQgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWQsMTApKSk7XG4gICAgICAgIGxldCBjaWQ9dGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJ1bixidWZmZXIpO1xuICAgICAgICB0aGlzLl9tb3ZlU3luY0luc3RydWN0aW9uT3ZlcnJpZGVSZWplY3QoY2lkKTsvL+enu+WLleezu+OBrlN5bmPjgrPjg57jg7Pjg4nlrp/ooYzmmYLjga5DQuOBrlJlamVjdFxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844KS5oyH5a6a6YCf5bqm44Gn5Zue6Lui44GV44Gb44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkX3JwbSBmbG9hdCBbwrFYIHJwbV1cbiAgICAgKi9cbiAgICBjbWRSdW5fcnBtKHNwZWVkX3JwbSA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChzcGVlZF9ycG0qMC4xMDQ3MTk3NTUxMTk2NTk3NywxMCkpO1xuICAgICAgICBsZXQgY2lkPSB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucnVuLGJ1ZmZlcik7XG4gICAgICAgIHRoaXMuX21vdmVTeW5jSW5zdHJ1Y3Rpb25PdmVycmlkZVJlamVjdChjaWQpOy8v56e75YuV57O744GuU3luY+OCs+ODnuODs+ODieWun+ihjOaZguOBrkNC44GuUmVqZWN0XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDntbblr77kvY3nva7jgavnp7vli5XjgZnjgotcbiAgICAgKiBAZGVzYyDpgJ/jgZXjga8gY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44GM5o6h55So44GV44KM44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIGZsb2F0IOinkuW6pu+8mnJhZGlhbnNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgZmxvYXQg6YCf5bqm44Gu5aSn44GN44GVIOWNmOS9je+8muinkuW6pu+8iOODqeOCuOOCouODs++8iS/np5IgWzAtWCBycHNd44CAXG4gICAgICovXG4gICAgY21kTW92ZVRvUG9zaXRpb24ocG9zaXRpb24sc3BlZWQ9bnVsbCl7XG4gICAgICAgIGlmKHBvc2l0aW9uPT09IHVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IGNpZD1udWxsO1xuICAgICAgICBpZihzcGVlZCE9PW51bGwpe1xuICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig4KTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KHBvc2l0aW9uLDEwKSk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDQscGFyc2VGbG9hdChzcGVlZCwxMCkpO1xuICAgICAgICAgICAgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlVG9Qb3NpdGlvblNwZWVkLGJ1ZmZlcik7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KHBvc2l0aW9uLDEwKSk7XG4gICAgICAgICAgICBjaWQ9dGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVUb1Bvc2l0aW9uLGJ1ZmZlcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tb3ZlU3luY0luc3RydWN0aW9uT3ZlcnJpZGVSZWplY3QoY2lkKTsvL+enu+WLleezu+OBrlN5bmPjgrPjg57jg7Pjg4nlrp/ooYzmmYLjga5DQuOBrlJlamVjdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOe1tuWvvuS9jee9ruOBq+enu+WLleOBl+OAgeenu+WLleOBruaIkOWQpuOCkumAmuefpeOBmeOCiyAoTW90b3JGYXJtIFZlciA+PSAyLjIzKVxuICAgICAqIEBkZXNjIOmAn+OBleOBryBjbWRTcGVlZCDjgafkv53lrZjjgZXjgozjgZ/pgJ/luqbjgYzmjqHnlKjjgZXjgozjgotcbiAgICAgKiA8dWw+XG4gICAgICogICAgIDxsaT7jgZPjga7jgrPjg57jg7Pjg4nlrp/ooYzkuK3jgavliKXjga7np7vli5Xns7vjga7jgrPjg57jg7Pjg4njgpLlrp/ooYzjgZnjgovjgagnSW5zdHJ1Y3Rpb24gb3ZlcnJpZGUn44Go44GX44GmcmVqZWN044GV44KM44KLPC9saT5cbiAgICAgKiA8L3VsPlxuICAgICAqIEBleGFtcGxlXG4gICAgICogUHJvbWlzZS5yZXNvbHZlKCkudGhlbigocmVzb2x2ZSkgPT57XG4gICAgICogICAgICBrTU1vdG9yT25lLmNtZE5vdGlmeVBvc0Fycml2YWwoMSxLTVV0bC5kZWdyZWVUb1JhZGlhbigwLjUpKTsvL+WIsOmBlOOBqOWIpOWumuOBmeOCi+ebruaomeW6p+aomeOBruevhOWbsiArLTAuNeW6plxuICAgICAqICAgICAgLy/ljp/ngrnnp7vli5UgMzBycG0g44K/44Kk44Og44Ki44Km44OIIDVzXG4gICAgICogICAgICByZXR1cm4ga01Nb3Rvck9uZS5jbWRNb3ZlVG9Qb3NpdGlvblN5bmMoMCxLTUNvbm5lY3Rvci5LTVV0bC5ycG1Ub1JhZGlhblNlYygzMCksNTAwMCk7XG4gICAgICogfSkudGhlbigocmVzb2x2ZSkgPT57XG4gICAgICogICAgICAvL3Bvc2l0aW9uIEFycml2ZWRcbiAgICAgKiB9KS5jYXRjaCgoZSk9PntcbiAgICAgKiAgICAgIGNvbnNvbGUubG9nKGUpOy8vJ0luc3RydWN0aW9uIG92ZXJyaWRlJyBvciBUaW1lb3V0XG4gICAgICogfSk7XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIGZsb2F0IOinkuW6pu+8mnJhZGlhbnNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgZmxvYXQg6YCf5bqm44Gu5aSn44GN44GVIOWNmOS9je+8muinkuW6pu+8iOODqeOCuOOCouODs++8iS/np5IgWzAtWCBycHNd44CAXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXQgaW50IFswIC0geCBtc10g44OH44OV44Kp44Or44OIIDA644K/44Kk44Og44Ki44Km44OI54Sh44GXXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICAgKi9cbiAgICBjbWRNb3ZlVG9Qb3NpdGlvblN5bmMocG9zaXRpb24sc3BlZWQ9bnVsbCx0aW1lb3V0PTApe1xuICAgICAgICBpZihwb3NpdGlvbj09PSB1bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBzZWxmPXRoaXM7XG4gICAgICAgIGxldCBjaWQ9bnVsbDtcbiAgICAgICAgaWYoc3BlZWQhPT1udWxsKXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoOCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChwb3NpdGlvbiwxMCkpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMig0LHBhcnNlRmxvYXQoc3BlZWQsMTApKTtcbiAgICAgICAgICAgIGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZVRvUG9zaXRpb25TcGVlZCxidWZmZXIpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChwb3NpdGlvbiwxMCkpO1xuICAgICAgICAgICAgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlVG9Qb3NpdGlvbixidWZmZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCk7Ly/np7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ5a6f6KGM5pmC44GuQ0Ljga5SZWplY3RcblxuICAgICAgICAvL+aIkOWQpuOBruaNleaNiVxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBsZXQgdG09IE1hdGguYWJzKHBhcnNlSW50KHRpbWVvdXQpKTtcbiAgICAgICAgICAgIHNlbGYuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbj1uZXcgX0tNTm90aWZ5UHJvbWlzKGNpZCxcImNtZE1vdmVUb1Bvc2l0aW9uU3luY1wiLG51bGwscmVzb2x2ZSxyZWplY3QsdG0pOy8vbm90aWZ557WM55Sx44GuS01fU1VDQ0VTU19BUlJJVkFM44KSUHJvbWlz44Go57SQ5LuY44GRXG4gICAgICAgICAgICBpZih0bSl7XG4gICAgICAgICAgICAgICAgc2VsZi5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uLnN0YXJ0UmVqZWN0VGltZU91dENvdW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOebuOWvvuS9jee9ruOBq+enu+WLleOBmeOCi1xuICAgICAqIEBkZXNjIOmAn+OBleOBryBjbWRTcGVlZCDjgafkv53lrZjjgZXjgozjgZ/pgJ/luqbjgYzmjqHnlKjjgZXjgozjgotcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGRpc3RhbmNlIGZsb2F0IOinkuW6pu+8mnJhZGlhbnNb5bemOityYWRpYW5zIOWPszotcmFkaWFuc11cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgZmxvYXQg6YCf5bqm44Gu5aSn44GN44GVIOWNmOS9je+8muinkuW6pu+8iOODqeOCuOOCouODs++8iS/np5IgWzAtWCBycHNd44CAKOato+OBruaVsClcbiAgICAgKi9cbiAgICBjbWRNb3ZlQnlEaXN0YW5jZShkaXN0YW5jZSA9IDAsc3BlZWQ9bnVsbCl7XG4gICAgICAgIGxldCBjaWQ9bnVsbDtcbiAgICAgICAgaWYoc3BlZWQhPT1udWxsKXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoOCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChkaXN0YW5jZSwxMCkpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMig0LHBhcnNlRmxvYXQoc3BlZWQsMTApKTtcbiAgICAgICAgICAgIGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZUJ5RGlzdGFuY2VTcGVlZCxidWZmZXIpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChkaXN0YW5jZSwxMCkpO1xuICAgICAgICAgICAgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlQnlEaXN0YW5jZSxidWZmZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCk7Ly/np7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ5a6f6KGM5pmC44GuQ0Ljga5SZWplY3RcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDnm7jlr77kvY3nva7jgavnp7vli5XjgZfjgIHnp7vli5Xjga7miJDlkKbjgpLpgJrnn6XjgZnjgosgKE1vdG9yRmFybSBWZXIgPj0gMi4yMylcbiAgICAgKiBAZGVzYyDpgJ/jgZXjga8gY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44GM5o6h55So44GV44KM44KLXG4gICAgICogPHVsPlxuICAgICAqICAgICA8bGk+44GT44Gu44Kz44Oe44Oz44OJ5a6f6KGM5Lit44Gr5Yil44Gu56e75YuV57O744Gu44Kz44Oe44Oz44OJ44KS5a6f6KGM44GZ44KL44GoJ0luc3RydWN0aW9uIG92ZXJyaWRlJ+OBqOOBl+OBpnJlamVjdOOBleOCjOOCizwvbGk+XG4gICAgICogPC91bD5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKHJlc29sdmUpID0+e1xuICAgICAqICAgICAga01Nb3Rvck9uZS5jbWROb3RpZnlQb3NBcnJpdmFsKDEsS01VdGwuZGVncmVlVG9SYWRpYW4oMC41KSk7Ly/liLDpgZTjgajliKTlrprjgZnjgovnm67mqJnluqfmqJnjga7nr4Tlm7IgKy0wLjXluqZcbiAgICAgKiAgICAgIC8vMzYw5bqm55u45a++56e75YuVIDMwcnBtIOOCv+OCpOODoOOCouOCpuODiOeEoeOBl1xuICAgICAqICAgICAgcmV0dXJuIGtNTW90b3JPbmUuY21kTW92ZUJ5RGlzdGFuY2VTeW5jKEtNQ29ubmVjdG9yLktNVXRsLmRlZ3JlZVRvUmFkaWFuKDM2MCksS01Db25uZWN0b3IuS01VdGwucnBtVG9SYWRpYW5TZWMoMzApKTtcbiAgICAgKiB9KS50aGVuKChyZXNvbHZlKSA9PntcbiAgICAgKiAgICAgIC8vcG9zaXRpb24gQXJyaXZlZFxuICAgICAqIH0pLmNhdGNoKChlKT0+e1xuICAgICAqICAgICAgY29uc29sZS5sb2coZSk7Ly8nSW5zdHJ1Y3Rpb24gb3ZlcnJpZGUnIG9yIFRpbWVvdXRcbiAgICAgKiB9KTtcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGRpc3RhbmNlIGZsb2F0IOinkuW6pu+8mnJhZGlhbnNb5bemOityYWRpYW5zIOWPszotcmFkaWFuc11cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgZmxvYXQg6YCf5bqm44Gu5aSn44GN44GVIOWNmOS9je+8muinkuW6pu+8iOODqeOCuOOCouODs++8iS/np5IgWzAtWCBycHNd44CAKOato+OBruaVsClcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZW91dCBpbnQgWzAgLSB4IG1zXSDjg4fjg5Xjgqnjg6vjg4ggMDrjgr/jgqTjg6DjgqLjgqbjg4jnhKHjgZdcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fVxuICAgICAqL1xuICAgIGNtZE1vdmVCeURpc3RhbmNlU3luYyhkaXN0YW5jZSA9IDAsc3BlZWQ9bnVsbCx0aW1lb3V0PTApe1xuICAgICAgICBsZXQgc2VsZj10aGlzO1xuICAgICAgICBsZXQgY2lkPW51bGw7XG4gICAgICAgIGlmKHNwZWVkIT09bnVsbCl7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDgpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoZGlzdGFuY2UsMTApKTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoNCxwYXJzZUZsb2F0KHNwZWVkLDEwKSk7XG4gICAgICAgICAgICBjaWQ9dGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVCeURpc3RhbmNlU3BlZWQsYnVmZmVyKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoZGlzdGFuY2UsMTApKTtcbiAgICAgICAgICAgIGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZUJ5RGlzdGFuY2UsYnVmZmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vdmVTeW5jSW5zdHJ1Y3Rpb25PdmVycmlkZVJlamVjdChjaWQpOy8v56e75YuV57O744GuU3luY+OCs+ODnuODs+ODieWun+ihjOaZguOBrkNC44GuUmVqZWN0XG5cbiAgICAgICAgLy/miJDlkKbjga7mjZXmjYlcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgbGV0IHRtPSBNYXRoLmFicyhwYXJzZUludCh0aW1lb3V0KSk7XG4gICAgICAgICAgICBzZWxmLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb249bmV3IF9LTU5vdGlmeVByb21pcyhjaWQsXCJjbWRNb3ZlQnlEaXN0YW5jZVN5bmNcIixudWxsLHJlc29sdmUscmVqZWN0LHRtKTtcbiAgICAgICAgICAgIGlmKHRtKXtcbiAgICAgICAgICAgICAgICBzZWxmLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24uc3RhcnRSZWplY3RUaW1lT3V0Q291bnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruWKseejgeOCkuWBnOatouOBmeOCi++8iOaEn+inpuOBr+aui+OCiuOBvuOBme+8iVxuICAgICAqIEBkZXNjIOWujOWFqOODleODquODvOeKtuaFi+OCkuWGjeePvuOBmeOCi+WgtOWQiOOBr+OAgSBjbWRGcmVlKCkuY21kRGlzYWJsZSgpIOOBqOOBl+OBpuS4i+OBleOBhOOAglxuICAgICAqL1xuICAgIGNtZEZyZWUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmZyZWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOCkumAn+W6puOCvOODreOBvuOBp+a4m+mAn+OBl+WBnOatouOBmeOCi1xuICAgICAqIEBkZXNjIHJwbSA9IDAg44Go44Gq44KL44CCXG4gICAgICovXG4gICAgY21kU3RvcCgpe1xuICAgICAgICBsZXQgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdG9wKTtcbiAgICAgICAgdGhpcy5fbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCk7Ly/np7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ5a6f6KGM5pmC44GuQ0Ljga5SZWplY3RcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg4jjg6vjgq/liLblvqHjgpLooYzjgYZcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9ycXVlIGZsb2F0IOODiOODq+OCryDljZjkvY3vvJpO44O7bSBbLVggfiArIFggTm1dIOaOqOWlqOWApCAwLjMtMC4wNVxuICAgICAqIEBkZXNjIOmAn+W6puOChOS9jee9ruOCkuWQjOaZguOBq+WItuW+oeOBmeOCi+WgtOWQiOOBr+OAgeODouODvOOCv+ODvOioreWumuOBriAweDBFOiBtYXhUb3JxdWUg44GoIDB4NjA6IHJ1bkZvcndhcmQg562J44KS5L2155So44GX44Gm5LiL44GV44GE44CCXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRIb2xkVG9ycXVlKHRvcnF1ZSl7XG4gICAgICAgIGlmKHRvcnF1ZT09PXVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQodG9ycXVlLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ob2xkVG9ycXVlLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6KiY5oa244GX44Gf44K/44K544Kv77yI5ZG95Luk77yJ44Gu44K744OD44OI44KS5a6f6KGM44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjgr/jgrnjgq/jgrvjg4Pjg4jnlarlj7fvvIgw772eNjU1MzXvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVwZWF0aW5nIGludCDnubDjgorov5TjgZflm57mlbAgMOOBr+eEoeWItumZkFxuICAgICAqXG4gICAgICogQGRlc2MgS00tMSDjga8gaW5kZXg6IDB+NDkg44G+44Gn44CC77yINTDlgIvjga7jg6Hjg6Ljg6rjg5Djg7Pjgq8g5ZCEODEyOCBCeXRlIOOBvuOBp+WItumZkOOBguOCiu+8iTxicj5cbiAgICAgKiDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLjga/jgIHjgrPjg57jg7Pjg4nvvIjjgr/jgrnjgq/jgrvjg4Pjg4jvvInjgpLlj4LnhafkuIvjgZXjgYTjgIIgaHR0cHM6Ly9kb2N1bWVudC5rZWlnYW4tbW90b3IuY29tL21vdG9yLWNvbnRyb2wtY29tbWFuZC90YXNrc2V0Lmh0bWxcbiAgICAgKi9cbiAgICBjbWRTdGFydERvaW5nVGFza3NldChpbmRleCA9IDAscmVwZWF0aW5nID0gMSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMixNYXRoLmFicyhwYXJzZUludChyZXBlYXRpbmcsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdGFydERvaW5nVGFza3NldCxidWZmZXIpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgr/jgrnjgq/jgrvjg4Pjg4jjgpLlgZzmraJcbiAgICAgKiBAZGVzYyDjgr/jgrnjgq/jgrvjg4Pjg4jjga7lho3nlJ/jgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRTdG9wRG9pbmdUYXNrc2V0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdG9wRG9pbmdUYXNrc2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgrfjg6fjg7PjgpLlho3nlJ/vvIjmupblgpnjgarjgZfvvIlcbiAgICAgKiBAZGVzYyDjg6Ljg7zjgrfjg6fjg7Pjga7jg5fjg6zjgqTjg5Djg4Pjgq/jgpLvvIjmupblgpnjgarjgZfjgafvvInjg5fjg6zjgqTjg5Djg4Pjgq/plovlp4vjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOODouODvOOCt+ODp+ODs+eVquWPt++8iDDvvZ42NTUzNe+8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZXBlYXRpbmcgaW50IOe5sOOCiui/lOOBl+WbnuaVsCAw44Gv54Sh5Yi26ZmQXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLmNtZFByZXBhcmVQbGF5YmFja01vdGlvbl9TVEFSVF9QT1NJVElPTn0gc3RhcnRfcG9zaXRpb24gaW50IOOCueOCv+ODvOODiOS9jee9ruOBruioreWumjxicj5cbiAgICAgKiBTVEFSVF9QT1NJVElPTl9BQlM66KiY5oa244GV44KM44Gf6ZaL5aeL5L2N572u77yI57W25a++5bqn5qiZ77yJ44GL44KJ44K544K/44O844OIPGJyPlxuICAgICAqIFNUQVJUX1BPU0lUSU9OX0NVUlJFTlQ654++5Zyo44Gu5L2N572u44KS6ZaL5aeL5L2N572u44Go44GX44Gm44K544K/44O844OIXG4gICAgICovXG4gICAgY21kU3RhcnRQbGF5YmFja01vdGlvbihpbmRleCA9IDAscmVwZWF0aW5nID0gMCxzdGFydF9wb3NpdGlvbiA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDcpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDIsTWF0aC5hYnMocGFyc2VJbnQocmVwZWF0aW5nLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCg2LE1hdGguYWJzKHBhcnNlSW50KHN0YXJ0X3Bvc2l0aW9uLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnRQbGF5YmFja01vdGlvbixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCt+ODp+ODs+WGjeeUn+OCkuWBnOatouOBmeOCi1xuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBjbWRTdG9wUGxheWJhY2tNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3BQbGF5YmFja01vdGlvbik7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIHNlY3Rpb246OuOCreODpeODvOaTjeS9nFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgq3jg6Xjg7zjgpLkuIDmmYLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRQYXVzZVF1ZXVlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wYXVzZVF1ZXVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgq3jg6Xjg7zjgpLlho3plovjgZnjgovvvIjok4TnqY3jgZXjgozjgZ/jgr/jgrnjgq/jgpLlho3plovvvIlcbiAgICAgKi9cbiAgICBjbWRSZXN1bWVRdWV1ZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzdW1lUXVldWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCreODpeODvOOCkuaMh+WumuaZgumWk+WBnOatouOBl+WGjemWi+OBmeOCi1xuICAgICAqIEBkZXNjIGNtZFBhdXNl77yI44Kt44Ol44O85YGc5q2i77yJ44KS5a6f6KGM44GX44CB5oyH5a6a5pmC6ZaT77yI44Of44Oq56eS77yJ57WM6YGO5b6M44CB6Ieq5YuV55qE44GrIGNtZFJlc3VtZe+8iOOCreODpeODvOWGjemWi++8iSDjgpLooYzjgYTjgb7jgZnjgIJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZSDlgZzmraLmmYLplpNbbXNlY11cbiAgICAgKi9cbiAgICBjbWRXYWl0UXVldWUodGltZSA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMCxNYXRoLmFicyhwYXJzZUludCh0aW1lLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQud2FpdFF1ZXVlLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Kt44Ol44O844KS44Oq44K744OD44OI44GZ44KLXG4gICAgICovXG4gICAgY21kUmVzZXRRdWV1ZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzZXRRdWV1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu54q25oWL44KS6Kqt44G/5Y+W44KLIO+8iHJlYWTlsILnlKjvvIlcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxpbnR8QXJyYXk+fVxuICAgICAqL1xuICAgIGNtZFJlYWRTdGF0dXMoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kUmVhZFJlZ2lzdGVyKHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZFN0YXR1cyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIHNlY3Rpb246OuOCv+OCueOCr+OCu+ODg+ODiFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCv+OCueOCr++8iOWRveS7pO+8ieOBruOCu+ODg+ODiOOBruiomOmMsuOCkumWi+Wni+OBmeOCi1xuICAgICAqIEBkZXNjIOiomOaGtuOBmeOCi+OCpOODs+ODh+ODg+OCr+OCueOBruODoeODouODquOBr+OCs+ODnuODs+ODie+8mmVyYXNlVGFza3NldCDjgavjgojjgorkuojjgoHmtojljrvjgZXjgozjgabjgYTjgovlv4XopoHjgYzjgYLjgopcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuSBLTS0xIOOBruWgtOWQiOOAgeOCpOODs+ODh+ODg+OCr+OCueOBruWApOOBryAw772eNDkg77yI6KiINTDlgIvoqJjpjLLvvIlcbiAgICAgKi9cbiAgICBjbWRTdGFydFJlY29yZGluZ1Rhc2tTZXQoaW5kZXggPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdGFydFJlY29yZGluZ1Rhc2tzZXQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLjgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRTdG9wUmVjb3JkaW5nVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcFJlY29yZGluZ1Rhc2tzZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOaMh+WumuOBruOCpOODs+ODh+ODg+OCr+OCueOBruOCv+OCueOCr+OCu+ODg+ODiOOCkua2iOWOu+OBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBpbnQg44Kk44Oz44OH44OD44Kv44K5XG4gICAgICovXG4gICAgY21kRXJhc2VUYXNrc2V0KGluZGV4ID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZXJhc2VUYXNrc2V0LGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu44K/44K544Kv44K744OD44OI44KS5raI5Y6744GZ44KLXG4gICAgICovXG4gICAgY21kRXJhc2VBbGxUYXNrc2V0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZUFsbFRhc2tzZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuWQjeioreWumlxuICAgICAqIEBkZXNjIOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuWQjeOCkuioreWumuOBmeOCi+OAgu+8iOOBk+OCjOOBi+OCieiomOmMsuOBmeOCi+OCguOBruOBq+WvvuOBl+OBpu+8iVxuICAgICAqL1xuICAgIGNtZFNldFRhc2tzZXROYW1lKG5hbWUpe1xuICAgICAgICBsZXQgYnVmZmVyPSAobmV3IFVpbnQ4QXJyYXkoW10ubWFwLmNhbGwobmFtZSwgZnVuY3Rpb24oYykge1xuICAgICAgICAgICAgcmV0dXJuIGMuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgfSkpKS5idWZmZXI7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zZXRUYXNrc2V0TmFtZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBzZWN0aW9uOjrjg4bjgqPjg7zjg4Hjg7PjgrBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OA44Kk44Os44Kv44OI44OG44Kj44O844OB44Oz44Kw6ZaL5aeL77yI5rqW5YKZ44Gq44GX77yJXG4gICAgICogQGRlc2MgS00tMSDjga7loLTlkIjjgIHjgqTjg7Pjg4fjg4Pjgq/jgrnjga7lgKTjga8gMO+9njE5IO+8iOioiDIw5YCL6KiY6Yyy77yJ44Go44Gq44KL44CC6KiY6Yyy5pmC6ZaT44GvIDY1NDA4IFttc2VjXSDjgpLotoXjgYjjgovjgZPjgajjga/jgafjgY3jgarjgYRcbiAgICAgKiAgICAgICDoqJjmhrbjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjga7jg6Hjg6Ljg6rjga9ibGVFcmFzZU1vdGlvbiDjgavjgojjgorkuojjgoHmtojljrvjgZXjgozjgabjgYTjgovlv4XopoHjgYzjgYLjgotcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBpbnQg44Kk44Oz44OH44OD44Kv44K5IFswLTE5XVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lIGludCDoqJjpjLLmmYLplpMgW21zZWMgMC02NTQwOF1cbiAgICAgKi9cbiAgICBjbWRTdGFydFRlYWNoaW5nTW90aW9uKGluZGV4ID0gMCxsZW5ndGhSZWNvcmRpbmdUaW1lID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMixNYXRoLmFicyhwYXJzZUludChsZW5ndGhSZWNvcmRpbmdUaW1lLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnRUZWFjaGluZ01vdGlvbixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWun+ihjOS4reOBruODhuOCo+ODvOODgeODs+OCsOOCkuWBnOatouOBmeOCi1xuICAgICAqL1xuICAgIGNtZFN0b3BUZWFjaGluZ01vdGlvbigpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcFRlYWNoaW5nTW90aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjgZfjgZ/jgqTjg7Pjg4fjg4Pjgq/jgrnjga7jg6Ljg7zjgrfjg6fjg7PjgpLmtojljrvjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAqXG4gICAgICogQGRlc2MgS00tMSDjga7loLTlkIjjgIHjgqTjg7Pjg4fjg4Pjgq/jgrnjga7lgKTjga8gMO+9njE5IO+8iOioiDIw5YCL6KiY6Yyy77yJ44Go44Gq44KLXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRFcmFzZU1vdGlvbihpbmRleCA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlTW90aW9uLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu44Oi44O844K344On44Oz44KS5raI5Y6744GZ44KLXG4gICAgICovXG4gICAgY21kRXJhc2VBbGxNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlQWxsTW90aW9uKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo6TEVEXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IExFROOBrueCueeBr+eKtuaFi+OCkuOCu+ODg+ODiOOBmeOCi1xuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRMZWRfTEVEX1NUQVRFfSBjbWRMZWRfTEVEX1NUQVRFIGludCDngrnnga/nirbmhYs8YnI+XG4gICAgICogICBMRURfU1RBVEVfT0ZGOkxFROa2iOeBrzxicj5cbiAgICAgKiAgIExFRF9TVEFURV9PTl9TT0xJRDpMRUTngrnnga88YnI+XG4gICAgICogICBMRURfU1RBVEVfT05fRkxBU0g6TEVE54K55ruF77yI5LiA5a6a6ZaT6ZqU44Gn54K55ruF77yJPGJyPlxuICAgICAqICAgTEVEX1NUQVRFX09OX0RJTTpMRUTjgYzjgobjgaPjgY/jgormmI7mu4XjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVkIGludCAwLTI1NVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBncmVlbiBpbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmx1ZSBpbnQgMC0yNTVcbiAgICAgKi9cbiAgICBjbWRMZWQoY21kTGVkX0xFRF9TVEFURSxyZWQsZ3JlZW4sYmx1ZSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsTWF0aC5hYnMocGFyc2VJbnQoY21kTGVkX0xFRF9TVEFURSwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMSxNYXRoLmFicyhwYXJzZUludChyZWQsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDIsTWF0aC5hYnMocGFyc2VJbnQoZ3JlZW4sMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDMsTWF0aC5hYnMocGFyc2VJbnQoYmx1ZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmxlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBJTVUg44K444Oj44Kk44OtXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSU1VKOOCuOODo+OCpOODrSnjga7lgKTlj5blvpco6YCa55+lKeOCkumWi+Wni+OBmeOCi1xuICAgICAqIEBkZXNjIOacrOOCs+ODnuODs+ODieOCkuWun+ihjOOBmeOCi+OBqOOAgUlNVeOBruODh+ODvOOCv+OBr0JMReOBruOCreODo+ODqeOCr+OCv+ODquOCueODhuOCo+OCr+OCuU1PVE9SX0lNVV9NRUFTVVJFTUVOVOOBq+mAmuefpeOBleOCjOOCizxicj5cbiAgICAgKiBNT1RPUl9JTVVfTUVBU1VSRU1FTlTjga5ub3RpZnnjga/jgqTjg5njg7Pjg4jjgr/jgqTjg5cgS01Nb3RvckNvbW1hbmRLTU9uZS5FVkVOVF9UWVBFLmltdU1lYXN1cmVtZW50IOOBq+mAmuefpVxuICAgICAqL1xuICAgIGNtZEVuYWJsZUlNVU1lYXN1cmVtZW50KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lbmFibGVJTVVNZWFzdXJlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSU1VKOOCuOODo+OCpOODrSnjga7lgKTlj5blvpco6YCa55+lKeOCkuWBnOatouOBmeOCi1xuICAgICAqL1xuICAgIGNtZERpc2FibGVJTVVNZWFzdXJlbWVudCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZGlzYWJsZUlNVU1lYXN1cmVtZW50KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gSU1VIOODouODvOOCv+ODvFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7muKzlrprlgKTvvIjkvY3nva7jg7vpgJ/luqbjg7vjg4jjg6vjgq/vvInlh7rlipvjgpLplovlp4vjgZnjgotcbiAgICAgKiBAZGVzYyDjg4fjg5Xjgqnjg6vjg4jjgafjga/jg6Ljg7zjgr/jg7zotbfli5XmmYJvbuOAgiBtb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0KCkg5Y+C54WnXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIGNtZEVuYWJsZU1vdG9yTWVhc3VyZW1lbnQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVuYWJsZU1vdG9yTWVhc3VyZW1lbnQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7muKzlrprlgKTvvIjkvY3nva7jg7vpgJ/luqbjg7vjg4jjg6vjgq/vvInlh7rlipvjgpLlgZzmraLjgZnjgotcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgY21kRGlzYWJsZU1vdG9yTWVhc3VyZW1lbnQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmRpc2FibGVNb3Rvck1lYXN1cmVtZW50KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8g44K344K544OG44OgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCt+OCueODhuODoOOCkuWGjei1t+WLleOBmeOCi1xuICAgICAqIEBkZXNjIEJMReOBq+aOpee2muOBl+OBpuOBhOOBn+WgtOWQiOOAgeWIh+aWreOBl+OBpuOBi+OCieWGjei1t+WLlVxuICAgICAqL1xuICAgIGNtZFJlYm9vdCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVib290KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OB44Kn44OD44Kv44K144Og77yIQ1JDMTYpIOacieWKueWMllxuICAgICAqIEBkZXNjIOOCs+ODnuODs+ODie+8iOOCv+OCueOCr++8ieOBruODgeOCp+ODg+OCr+OCteODoOOCkuacieWKueWMluOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpc0VuYWJsZWQgMDpEaXNibGVkLCAxOkVuYWJsZWRcbiAgICAgKi9cbiAgICBjbWRFbmFibGVDaGVja1N1bShpc0VuYWJsZWQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLGlzRW5hYmxlZD8xOjApO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW5hYmxlQ2hlY2tTdW0sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg5XjgqHjg7zjg6DjgqbjgqfjgqLjgqLjg4Pjg5fjg4fjg7zjg4jjg6Ljg7zjg4njgavlhaXjgotcbiAgICAgKiBAZGVzYyDjg5XjgqHjg7zjg6DjgqbjgqfjgqLjgpLjgqLjg4Pjg5fjg4fjg7zjg4jjgZnjgovjgZ/jgoHjga7jg5bjg7zjg4jjg63jg7zjg4Djg7zjg6Ljg7zjg4njgavlhaXjgovjgILvvIjjgrfjgrnjg4bjg6Djga/lho3otbfli5XjgZXjgozjgovjgILvvIlcbiAgICAgKi9cbiAgICBjbWRFbnRlckRldmljZUZpcm13YXJlVXBkYXRlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lbnRlckRldmljZUZpcm13YXJlVXBkYXRlKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8g44Oi44O844K/44O86Kit5a6a44CATU9UT1JfU0VUVElOR1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7mnIDlpKfpgJ/jgZXjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4U3BlZWQgZmxvYXQg5pyA5aSn6YCf44GVIFtyYWRpYW4gLyBzZWNvbmRd77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kTWF4U3BlZWQobWF4U3BlZWQpe1xuICAgICAgICBpZihtYXhTcGVlZD09PXVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQobWF4U3BlZWQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tYXhTcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruacgOWwj+mAn+OBleOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhTcGVlZCBmbG9hdCDmnIDlsI/pgJ/jgZUgW3JhZGlhbiAvIHNlY29uZF3vvIjmraPjga7lgKTvvIlcbiAgICAgKiBAZGVzYyBtaW5TcGVlZCDjga/jgIFibGVQcmVwYXJlUGxheWJhY2tNb3Rpb24g5a6f6KGM44Gu6Zqb44CB6ZaL5aeL5Zyw54K544Gr56e75YuV44GZ44KL6YCf44GV44Go44GX44Gm5L2/55So44GV44KM44KL44CC6YCa5bi45pmC6YGL6Lui44Gn44Gv5L2/55So44GV44KM44Gq44GE44CCXG4gICAgICovXG4gICAgY21kTWluU3BlZWQobWluU3BlZWQpe1xuICAgICAgICBpZihtaW5TcGVlZD09PXVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQobWluU3BlZWQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5taW5TcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWKoOa4m+mAn+absue3muOCkuaMh+WumuOBmeOCi++8iOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODq+OBruioreWumu+8iVxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRX0gY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUgaW50IOWKoOa4m+mAn+OCq+ODvOODluOCquODl+OCt+ODp+ODszxicj5cbiAgICAgKiAgICAgIENVUlZFX1RZUEVfTk9ORTowIOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPRkY8YnI+XG4gICAgICogICAgICBDVVJWRV9UWVBFX1RSQVBFWk9JRDoxIOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPTiDvvIjlj7DlvaLliqDmuJvpgJ/vvIlcbiAgICAgKi9cbiAgICBjbWRDdXJ2ZVR5cGUoY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxNYXRoLmFicyhwYXJzZUludChjbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmN1cnZlVHlwZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruWKoOmAn+W6puOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY2MgZmxvYXQg5Yqg6YCf5bqmIDAtMjAwIFtyYWRpYW4gLyBzZWNvbmReMl3vvIjmraPjga7lgKTvvIlcbiAgICAgKiBAZGVzYyBhY2Mg44Gv44CB44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9OIOOBruWgtOWQiOOAgeWKoOmAn+aZguOBq+S9v+eUqOOBleOCjOOBvuOBmeOAgu+8iOWKoOmAn+aZguOBruebtOe3muOBruWCvuOBje+8iVxuICAgICAqL1xuICAgIGNtZEFjYyhhY2MgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoYWNjLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuYWNjLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5rib6YCf5bqm44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlYyBmbG9hdCDmuJvpgJ/luqYgMC0yMDAgW3JhZGlhbiAvIHNlY29uZF4yXe+8iOato+OBruWApO+8iVxuICAgICAqIEBkZXNjIGRlYyDjga/jgIHjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT04g44Gu5aC05ZCI44CB5rib6YCf5pmC44Gr5L2/55So44GV44KM44G+44GZ44CC77yI5rib6YCf5pmC44Gu55u057ea44Gu5YK+44GN77yJXG4gICAgICovXG4gICAgY21kRGVjKGRlYyA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChkZWMsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5kZWMsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7mnIDlpKfjg4jjg6vjgq/vvIjntbblr77lgKTvvInjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4VG9ycXVlIGZsb2F0IOacgOWkp+ODiOODq+OCryBbTiptXe+8iOato+OBruWApO+8iVxuICAgICAqXG4gICAgICogQGRlc2MgbWF4VG9ycXVlIOOCkuioreWumuOBmeOCi+OBk+OBqOOBq+OCiOOCiuOAgeODiOODq+OCr+OBrue1tuWvvuWApOOBjCBtYXhUb3JxdWUg44KS6LaF44GI44Gq44GE44KI44GG44Gr6YGL6Lui44GX44G+44GZ44CCPGJyPlxuICAgICAqIG1heFRvcnF1ZSA9IDAuMSBbTiptXSDjga7lvozjgasgcnVuRm9yd2FyZCDvvIjmraPlm57ou6LvvInjgpLooYzjgaPjgZ/loLTlkIjjgIEwLjEgTiptIOOCkui2heOBiOOBquOBhOOCiOOBhuOBq+OBneOBrumAn+W6puOCkuOBquOCi+OBoOOBkee2reaMgeOBmeOCi+OAgjxicj5cbiAgICAgKiDjgZ/jgaDjgZfjgIHjg4jjg6vjgq/jga7mnIDlpKflgKTliLbpmZDjgavjgojjgorjgIHjgrfjgrnjg4bjg6DjgavjgojjgaPjgabjga/liLblvqHmgKfvvIjmjK/li5XvvInjgYzmgqrljJbjgZnjgovlj6/og73mgKfjgYzjgYLjgovjgIJcbiAgICAgKlxuICAgICAqL1xuICAgIGNtZE1heFRvcnF1ZShtYXhUb3JxdWUpe1xuICAgICAgICBpZihtYXhUb3JxdWU9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KG1heFRvcnF1ZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1heFRvcnF1ZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODgOOCpOODrOOCr+ODiOODhuOCo+ODvOODgeODs+OCsOOBruOCteODs+ODl+ODquODs+OCsOmWk+malFxuICAgICAqIEBkZXNjIOODhuOCo+ODvOODgeODs+OCsOODu+ODl+ODrOOCpOODkOODg+OCr+OBruWun+ihjOmWk+malFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbnRlcnZhbCBtc++8iDItMTAwMCAgMCwgMW1z44Gv44Ko44Op44O844Go44Gq44KL77yJXG4gICAgICovXG4gICAgY21kVGVhY2hpbmdJbnRlcnZhbChpbnRlcnZhbCl7XG4gICAgICAgIGlmKGludGVydmFsPT09dW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgX2ludGVydmFsPU1hdGguYWJzKHBhcnNlSW50KGludGVydmFsLDEwKSk7XG4gICAgICAgIF9pbnRlcnZhbD1faW50ZXJ2YWw8Mj8yOl9pbnRlcnZhbDtcbiAgICAgICAgX2ludGVydmFsPV9pbnRlcnZhbD4xMDAwPzEwMDA6X2ludGVydmFsO1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMCxfaW50ZXJ2YWwpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQudGVhY2hpbmdJbnRlcnZhbCxidWZmZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDoqJjmhrblho3nlJ/mmYLjga7lho3nlJ/plpPpmpRcbiAgICAgKiBAZGVzYyAg6KiY5oa25YaN55Sf5pmC44Gu5YaN55Sf6ZaT6ZqUXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGludGVydmFsIG1z77yIMi0xMDAwICAwLCAxbXPjga/jgqjjg6njg7zjgajjgarjgovvvIlcbiAgICAgKi9cbiAgICBjbWRQbGF5YmFja0ludGVydmFsKGludGVydmFsKXtcbiAgICAgICAgaWYoaW50ZXJ2YWw9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBfaW50ZXJ2YWw9TWF0aC5hYnMocGFyc2VJbnQoaW50ZXJ2YWwsMTApKTtcbiAgICAgICAgX2ludGVydmFsPV9pbnRlcnZhbDwyPzI6X2ludGVydmFsO1xuICAgICAgICBfaW50ZXJ2YWw9X2ludGVydmFsPjEwMDA/MTAwMDpfaW50ZXJ2YWw7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQzMigwLF9pbnRlcnZhbCk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wbGF5YmFja0ludGVydmFsLGJ1ZmZlcik7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga5x6Lu46Zu75rWBUElE44Kz44Oz44OI44Ot44O844Op44GuUO+8iOavlOS+i++8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBxQ3VycmVudFAgZmxvYXQgcembu+a1gVDjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRRQ3VycmVudFAocUN1cnJlbnRQKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQocUN1cnJlbnRQLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucUN1cnJlbnRQLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrlDvvIjmr5TkvovvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcUN1cnJlbnRJIGZsb2F0IHHpm7vmtYFJ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUUN1cnJlbnRJKHFDdXJyZW50SSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHFDdXJyZW50SSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnFDdXJyZW50SSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5E77yI5b6u5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHFDdXJyZW50RCBmbG9hdCBx6Zu75rWBROOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFFDdXJyZW50RChxQ3VycmVudEQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChxQ3VycmVudEQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5xQ3VycmVudEQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga5x6Lu46Zu75rWBUElE44Kz44Oz44OI44Ot44O844Op44GuRO+8iOW+ruWIhu+8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZFAgZmxvYXQg6YCf5bqmUOOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFNwZWVkUChzcGVlZFApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChzcGVlZFAsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZFAsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7pgJ/luqZQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5J77yI56mN5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkSSBmbG9hdCDpgJ/luqZJ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kU3BlZWRJKHNwZWVkSSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkSSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNwZWVkSSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrumAn+W6plBJROOCs+ODs+ODiOODreODvOODqeOBrkTvvIjlvq7liIbvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWREIGZsb2F0IOmAn+W6pkTjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRTcGVlZEQoc3BlZWREKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWRELDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWRELGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5L2N572u5Yi25b6hUOODkeODqeODoeOCv+OCkuOCu+ODg+ODiFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvblAgZmxvYXQgWzEuMDAwMCAtIDIwLjAwMDBd77yI44OH44OV44Kp44Or44OIIDUuMO+8iVxuICAgICAqL1xuICAgIGNtZFBvc2l0aW9uUChwb3NpdGlvblApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChwb3NpdGlvblAsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wb3NpdGlvblAsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5L2N572u5Yi25b6hSeODkeODqeODoeOCv+OCkuOCu+ODg+ODiFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbkkgZmxvYXQgWzEuMDAwMCAtIDEwMC4wMDAwXe+8iOODh+ODleOCqeODq+ODiCAxMC4w77yJXG4gICAgICovXG4gICAgY21kUG9zaXRpb25JKHBvc2l0aW9uSSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHBvc2l0aW9uSSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnBvc2l0aW9uSSxidWZmZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7kvY3nva7liLblvqFE44OR44Op44Oh44K/44KS44K744OD44OIXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uRCBmbG9hdCBbMC4wMDAxIC0gMC4yXe+8iOODh+ODleOCqeODq+ODiCAwLjAx77yJXG4gICAgICovXG4gICAgY21kUG9zaXRpb25EKHBvc2l0aW9uRCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHBvc2l0aW9uRCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnBvc2l0aW9uRCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruS9jee9ruWItuW+oeaZguOAgUlE5Yi25b6h44KS5pyJ5Yq544Gr44GZ44KL5YGP5beu44Gu57W25a++5YCk44KS5oyH5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRocmVzaG9sZCBmbG9hdCBbMC4wIC0gbl3vvIjjg4fjg5Xjgqnjg6vjg4ggMC4wMTM5NjI2ZiAvLyAwLjhkZWfvvIlcbiAgICAgKi9cbiAgICBjbWRQb3NDb250cm9sVGhyZXNob2xkKHRocmVzaG9sZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHRocmVzaG9sZCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnBvc0NvbnRyb2xUaHJlc2hvbGQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDkvY3nva7liLblvqHmmYLjgIHnm67mqJnkvY3nva7jgavliLDpgZTmmYLjgIHliKTlrprmnaHku7bjgpLmuoDjgZ/jgZfjgZ/loLTlkIjpgJrnn6XjgpLooYzjgYbjgIJcbiAgICAgKiBAZGVzYyDliKTlrprmnaHku7bvvJogdG9sZXJhbmNlIOWGheOBq+S9jee9ruOBjOWFpeOBo+OBpuOBhOOCi+eKtuaFi+OBjOOAgXNldHRsZVRpbWUg6YCj57aa44Gn57aa44GP44Go44CB6YCa55+lKEtNX1NVQ0NFU1NfQVJSSVZBTCnjgYzkuIDlm57ooYzjgo/jgozjgovjgIJcbiAgICAgKiA8dWw+XG4gICAgICogICAgIDxsaT50b2xlcmFuY2XlhoXjgavkvY3nva7jgYzlhaXjgaPjgabjgYTjgovnirbmhYvjgYzjgIFzZXR0bGVUaW1l44Gu6ZaT6YCj57aa44Gn57aa44GP44Go6YCa55+l44GM44OI44Oq44Ks44O844GV44KM44KL44CCPC9saT5cbiAgICAgKiAgICAgPGxpPnRvbGVyYW5jZeOBq+S4gOeerOOBp+OCguWFpeOBo+OBpnNldHRsZVRpbWXmnKrmuoDjgaflh7rjgovjgajpgJrnn6Xjg4jjg6rjgqzjg7zjga/liYrpmaTjgZXjgozjgIHpgJrnn6Xjga/ooYzjgo/jgozjgarjgYTjgII8L2xpPlxuICAgICAqICAgICA8bGk+dG9sZXJhbmNl44Gr5LiA5bqm44KC5YWl44KJ44Gq44GE5aC05ZCI44CB6YCa55+l44OI44Oq44Ks44O844Gv5q6L44KK57aa44GR44KL44CCKOODiOODquOCrOODvOOBruaYjuekuueahOOBqua2iOWOu+OBryBjbWROb3RpZnlQb3NBcnJpdmFsKDAsMCwwKSApPC9saT5cbiAgICAgKiAgICAgPGxpPuWGjeW6pm5vdGlmeVBvc0Fycml2YWzjgafoqK3lrprjgpLooYzjgYbjgajjgIHku6XliY3jga7pgJrnn6Xjg4jjg6rjgqzjg7zjga/mtojjgYjjgovjgII8L2xpPlxuICAgICAqIDwvdWw+XG4gICAgICogQHBhcmFtICB7bnVtYmVyfSBpc0VuYWJsZWQgMDpEaXNibGVkLCAxOkVuYWJsZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9sZXJhbmNlIGZsb2F0IFswLjAgLSBuXSDoqLHlrrnoqqTlt64gcmFkaWFuICjjg4fjg5Xjgqnjg6vjg4gg4omSIDAuMWRlZ++8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzZXR0bGVUaW1lIGludCBbMCAtIG5dIOWIpOWumuaZgumWkyDjg5/jg6rnp5IgKOODh+ODleOCqeODq+ODiCAyMDBtc++8iVxuICAgICAqXG4gICAgICovXG4gICAgY21kTm90aWZ5UG9zQXJyaXZhbChpc0VuYWJsZWQ9MCx0b2xlcmFuY2U9MC4wMDE3NDUzMyxzZXR0bGVUaW1lPTIwMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoOSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsaXNFbmFibGVkPzE6MCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMSxNYXRoLmFicyhwYXJzZUZsb2F0KHRvbGVyYW5jZSwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDUsTWF0aC5hYnMocGFyc2VJbnQoc2V0dGxlVGltZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm5vdGlmeVBvc0Fycml2YWwsYnVmZmVyKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBrlBJROODkeODqeODoeODvOOCv+OCkuODquOCu+ODg+ODiOOBl+OBpuODleOCoeODvOODoOOCpuOCp+OCouOBruWIneacn+ioreWumuOBq+aIu+OBmVxuICAgICAqIEBkZXNjIHFDdXJyZW50UCwgcUN1cnJlbnRJLCAgcUN1cnJlbnRELCBzcGVlZFAsIHNwZWVkSSwgc3BlZWRELCBwb3NpdGlvblAg44KS44Oq44K744OD44OI44GX44G+44GZXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRSZXNldFBJRCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzZXRQSUQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOa4rOWumuWApOOBruWPluW+l+mWk+malOioreWumlxuICAgICAqIEBkZXNjIOaciee3mu+8iFVTQiwgSTJD77yJ44Gu44G/5pyJ5Yq544CCQkxF44Gn44Gv5Zu65a6aIDEwMG1zIOmWk+malOOBp+mAmuefpeOBleOCjOOCi+OAglxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxfTU9UT1JfTUVBU19JTlRFUlZBTH0gY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUwgZW51bSDjg6Ljg7zjgr/jg7zmuKzlrprlgKTjga7lj5blvpfplpPpmpRcbiAgICAgKi9cbiAgICBjbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWwoY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUw9NCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQoY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUwsMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOa4rOWumuWApOOBruWPluW+l+ioreWumlxuICAgICAqIEBkZXNjIGlzRW5hYmxlZCA9IDEg44Gu5aC05ZCI44CB77yI5L2N572u44O76YCf5bqm44O744OI44Or44Kv77yJ44Gu6YCa55+l44KS6KGM44GG77yI6LW35YuV5b6M44CBaW50ZXJmYWNlIOOBruioreWumuOBp+WEquWFiOOBleOCjOOCi+mAmuS/oee1jOi3r+OBq+OAgeiHquWLleeahOOBq+mAmuefpeOBjOmWi+Wni+OBleOCjOOCi++8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpc0VuYWJsZWQgMDpEaXNibGVkLCAxOkVuYWJsZWRcbiAgICAgKi9cbiAgICBjbWRNb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0KGlzRW5hYmxlZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsaXNFbmFibGVkPzE6MCk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0LGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O85Yi25b6h5omL5q6177yI44Kk44Oz44K/44O844OV44Kn44Kk44K577yJ44Gu6Kit5a6aXG4gICAgICogQGRlc2MgdWludDhfdCBmbGFncyDjg5Pjg4Pjg4jjgavjgojjgorjgIHlkKvjgb7jgozjgovjg5Hjg6njg6Hjg7zjgr/jgpLmjIflrprjgZnjgovvvIjvvJHjga7loLTlkIjlkKvjgoDjg7sw44Gu5aC05ZCI5ZCr44G+44Gq44GE77yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJpdEZsZ1xuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqIGJpdDcgICAgYml0NiAgICBiaXQ1ICAgIGJpdDQgICAgYml0MyAgICBiaXQyICAgIGJpdDEgICAgYml0MFxuICAgICAqIOeJqeeQhiAgICAgICAgICAgICAgICAgICAgIOaciee3miAgICAg5pyJ57eaICAgICAgICAgICAgICAgICAgICAgIOeEoee3mlxuICAgICAqIOODnOOCv+ODsyAgICDvvIogICAgICDvvIogICAgICBJMkMgICAgIFVTQiAgICAgICDvvIogICAgICDvvIogICAgIEJMRVxuICAgICAqIOODh+ODleOCqeODq+ODiFx0ICAgICAgICAgICAgIOODh+ODleOCqeODq+ODiCAg44OH44OV44Kp44Or44OIICAgICAgICAgICAgICDjg4fjg5Xjgqnjg6vjg4hcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKi9cbiAgICBjbWRJbnRlcmZhY2UoYml0RmxnKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxwYXJzZUludChiaXRGbGcsMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmludGVyZmFjZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCs+ODnuODs+ODieOCkuWPl+S/oeOBl+OBn+OBqOOBjeOBq+aIkOWKn+mAmuefpe+8iGVycm9yQ29kZSA9IDDvvInjgpLjgZnjgovjgYvjganjgYbjgYtcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaXNFbmFibGVkIDA66YCa55+l44GX44Gq44GELCAxOumAmuefpeOBmeOCi1xuICAgICAqL1xuICAgIGNtZFJlc3BvbnNlKGlzRW5hYmxlZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsaXNFbmFibGVkPzE6MCk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZXNwb25zZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrui1t+WLleaZguWbuuaciUxFROOCq+ODqeODvOOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZWQgaW50IDAtMjU1XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGdyZWVuIGludCAwLTI1NVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBibHVlIGludCAwLTI1NVxuICAgICAqXG4gICAgICogQGRlc2Mgb3duQ29sb3Ig44Gv44Ki44Kk44OJ44Or5pmC44Gu5Zu65pyJTEVE44Kr44Op44O844CCPGJyPnNhdmVBbGxTZXR0aW5nc+OCkuWun+ihjOOBl+OAgeWGjei1t+WLleW+jOOBq+WIneOCgeOBpuWPjeaYoOOBleOCjOOCi+OAgjxicj5cbiAgICAgKiDjgZPjga7oqK3lrprlgKTjgpLlpInmm7TjgZfjgZ/loLTlkIjjgIFCTEXjga4gRGV2aWNlIE5hbWUg44Gu5LiLM+ahgeOBjOWkieabtOOBleOCjOOCi+OAglxuICAgICAqL1xuICAgIGNtZE93bkNvbG9yKHJlZCxncmVlbixibHVlKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigzKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxNYXRoLmFicyhwYXJzZUludChyZWQsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDEsTWF0aC5hYnMocGFyc2VJbnQoZ3JlZW4sMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDIsTWF0aC5hYnMocGFyc2VJbnQoYmx1ZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm93bkNvbG9yLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg77yW6Lu444K744Oz44K144O877yI5Yqg6YCf5bqm44O744K444Oj44Kk44Ot77yJ5ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqUXG4gICAgICogQGRlc2Mg5pyJ57ea77yIVVNCLCBJMkPvvInjga7jgb/mnInlirnjgIJCTEXjgafjga/lm7rlrpogMTAwbXMg6ZaT6ZqU44Gn6YCa55+l44GV44KM44KL44CCXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLmNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUx9IGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUwgZW51bSDliqDpgJ/luqbjg7vjgrjjg6PjgqTjg63muKzlrprlgKTjga7lj5blvpfplpPpmpRcbiAgICAgKi9cbiAgICBjbWRJTVVNZWFzdXJlbWVudEludGVydmFsKGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUw9NCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQoY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbF9JTVVfTUVBU19JTlRFUlZBTCwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuaU1VTWVhc3VyZW1lbnRJbnRlcnZhbCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IO+8lui7uOOCu+ODs+OCteODvO+8iOWKoOmAn+W6puODu+OCuOODo+OCpOODre+8ieOBruWApOOBrumAmuefpeOCkuODh+ODleOCqeODq+ODiOOBp+mWi+Wni+OBmeOCi1xuICAgICAqIEBkZXNjIGlzRW5hYmxlZCA9IHRydWUg44Gu5aC05ZCI44CBZW5hYmxlSU1VKCkg44KS6YCB5L+h44GX44Gq44GP44Gm44KC6LW35YuV5pmC44Gr6Ieq5YuV44Gn6YCa55+l44GM6ZaL5aeL44GV44KM44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGlzRW5hYmxlZCAwOkRpc2JsZWQsIDE6RW5hYmxlZFxuICAgICAqL1xuICAgIGNtZElNVU1lYXN1cmVtZW50QnlEZWZhdWx0KGlzRW5hYmxlZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQoaXNFbmFibGVkLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5pTVVNZWFzdXJlbWVudEJ5RGVmYXVsdCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOaMh+WumuOBl+OBn+ioreWumuWApOOCkuWPluW+l1xuICAgICAqIEBwYXJhbSB7bnVtYmVyIHwgYXJyYXl9IHJlZ2lzdGVycyA8aW50IHwgW10+IOWPluW+l+OBmeOCi+ODl+ODreODkeODhuOCo+OBruOCs+ODnuODs+ODiSjjg6zjgrjjgrnjgr/nlarlj7cp5YCkXG4gICAgICogQHJldHVybnMge1Byb21pc2UuPGludCB8IGFycmF5Pn0g5Y+W5b6X44GX44Gf5YCkIDxicj5yZWdpc3RlcnPjgYxpbnQ944Os44K444K544K/5YCk44Gu44OX44Oq44Of44OG44Kj44OW5YCkIDxicj5yZWdpc3RlcnPjgYxBcnJheT3jg6zjgrjjgrnjgr/lgKTjga7jgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKlxuICAgICAqIEBub25lIOWPluW+l+OBmeOCi+WApOOBr+OCs+ODnuODs+ODieWun+ihjOW+jOOBq0JMReOBruOCreODo+ODqeOCr+OCv+ODquOCueODhuOCo+OCr+OCuU1PVE9SX1NFVFRJTkfjgavpgJrnn6XjgZXjgozjgovjgII8YnI+XG4gICAgICogICAgICAg44Gd44KM44KS5ou+44Gj44GmcHJvbWlzZeOCquODluOCuOOCp+OCr+ODiOOBruOBrnJlc29sdmXjgavov5TjgZfjgablh6bnkIbjgpLnuYvjgZA8YnI+XG4gICAgICogICAgICAgTU9UT1JfU0VUVElOR+OBrm5vdGlmeeOBr19vbkJsZU1vdG9yU2V0dGluZ+OBp+WPluW+l1xuICAgICAqL1xuXG4gICAgY21kUmVhZFJlZ2lzdGVyKHJlZ2lzdGVycyl7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkocmVnaXN0ZXJzKSl7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGFsbHJlc29sdmUsIGFsbHJlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHByb21pc2VMaXN0PVtdO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8cmVnaXN0ZXJzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVnaXN0ZXI9cGFyc2VJbnQocmVnaXN0ZXJzW2ldLDEwKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZUxpc3QucHVzaCggbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2NwPW5ldyBfS01Ob3RpZnlQcm9taXMocmVnaXN0ZXIsdGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbcmVnaXN0ZXJdLHRoaXMuX25vdGlmeVByb21pc0xpc3QscmVzb2x2ZSxyZWplY3QsNTAwMCk7Ly9ub3RpZnnntYznlLHjga5yZXN1bHTjgpJQcm9taXPjgajntJDku5jjgZFcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLCByZWdpc3Rlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZFJlZ2lzdGVyLCBidWZmZXIsY2NwKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlTGlzdCkudGhlbigocmVzYXIpPT57XG4gICAgICAgICAgICAgICAgICAgIGxldCB0PVt7fV0uY29uY2F0KHJlc2FyKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJ0b2JqPU9iamVjdC5hc3NpZ24uYXBwbHkobnVsbCx0KTtcbiAgICAgICAgICAgICAgICAgICAgYWxscmVzb2x2ZShydG9iaik7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKG1zZyk9PntcbiAgICAgICAgICAgICAgICAgICAgYWxscmVqZWN0KG1zZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGxhc3RyZXNvbHZlLCBsYXN0cmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVnaXN0ZXI9cGFyc2VJbnQocmVnaXN0ZXJzLDEwKTtcbiAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNjcD1uZXcgX0tNTm90aWZ5UHJvbWlzKHJlZ2lzdGVyLHRoaXMuX1JFVl9NT1RPUl9DT01NQU5EW3JlZ2lzdGVyXSx0aGlzLl9ub3RpZnlQcm9taXNMaXN0LHJlc29sdmUscmVqZWN0LDEwMDApOy8vbm90aWZ557WM55Sx44GucmVzdWx044KSUHJvbWlz44Go57SQ5LuY44GRXG4gICAgICAgICAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgICAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscmVnaXN0ZXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZFJlZ2lzdGVyLCBidWZmZXIsY2NwKTtcbiAgICAgICAgICAgICAgICB9KS50aGVuKChyZXMpPT57XG4gICAgICAgICAgICAgICAgICAgIGxhc3RyZXNvbHZlKHJlc1tPYmplY3Qua2V5cyhyZXMpWzBdXSk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKG1zZyk9PntcbiAgICAgICAgICAgICAgICAgICAgbGFzdHJlamVjdChtc2cpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga7lhajjgabjga7jg6zjgrjjgrnjgr/lgKTjga7lj5blvpdcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZS48YXJyYXk+fVxuICAgICAqL1xuICAgIGNtZFJlYWRBbGxSZWdpc3Rlcigpe1xuICAgICAgIGxldCBjbT0gdGhpcy5jb25zdHJ1Y3Rvci5jbWRSZWFkUmVnaXN0ZXJfQ09NTUFORDtcbiAgICAgICAgbGV0IGFsbGNtZHM9W107XG4gICAgICAgIE9iamVjdC5rZXlzKGNtKS5mb3JFYWNoKChrKT0+e2FsbGNtZHMucHVzaChjbVtrXSk7fSk7XG5cbiAgICAgICByZXR1cm4gdGhpcy5jbWRSZWFkUmVnaXN0ZXIoYWxsY21kcyk7XG4gICAgfVxuICAgIC8vLy8vL+S/neWtmFxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBruioreWumuWApOOCkuODleODqeODg+OCt+ODpeODoeODouODquOBq+S/neWtmOOBmeOCi1xuICAgICAqIEBkZXNjIOacrOOCs+ODnuODs+ODieOCkuWun+ihjOOBl+OBquOBhOmZkOOCiuOAgeioreWumuWApOOBr+ODouODvOOCv+ODvOOBq+awuOS5heeahOOBq+S/neWtmOOBleOCjOOBquOBhCjlho3otbfli5XjgafmtojjgYjjgospXG4gICAgICovXG4gICAgY21kU2F2ZUFsbFJlZ2lzdGVycygpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc2F2ZUFsbFJlZ2lzdGVycyk7XG4gICAgfVxuXG4gICAgLy8vLy8v44Oq44K744OD44OIXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5oyH5a6a44GX44Gf44Os44K444K544K/44KS44OV44Kh44O844Og44Km44Kn44Ki44Gu5Yid5pyf5YCk44Gr44Oq44K744OD44OI44GZ44KLXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLmNtZFJlYWRSZWdpc3Rlcl9DT01NQU5EfSByZWdpc3RlciDliJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgovjgrPjg57jg7Pjg4ko44Os44K444K544K/KeWApFxuICAgICAqL1xuICAgIGNtZFJlc2V0UmVnaXN0ZXIocmVnaXN0ZXIpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KHJlZ2lzdGVyLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZXNldFJlZ2lzdGVyLGJ1ZmZlcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBruODrOOCuOOCueOCv+OCkuODleOCoeODvOODoOOCpuOCp+OCouOBruWIneacn+WApOOBq+ODquOCu+ODg+ODiOOBmeOCi1xuICAgICAqIEBkZXNjIGJsZVNhdmVBbGxSZWdpc3RlcnPjgpLlrp/ooYzjgZfjgarjgYTpmZDjgorjgIHjg6rjgrvjg4Pjg4jlgKTjga/jg6Ljg7zjgr/jg7zjgavmsLjkuYXnmoTjgavkv53lrZjjgZXjgozjgarjgYQo5YaN6LW35YuV44Gn5raI44GI44KLKVxuICAgICAqL1xuICAgIGNtZFJlc2V0QWxsUmVnaXN0ZXJzKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZXNldEFsbFJlZ2lzdGVycyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODh+ODkOOCpOOCueODjeODvOODoOOBruWPluW+l1xuICAgICAqIEBkZXNjIOODh+ODkOOCpOOCueODjeODvOODoOOCkuiqreOBv+WPluOCi1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGludHxBcnJheT59XG4gICAgICovXG4gICAgY21kUmVhZERldmljZU5hbWUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kUmVhZFJlZ2lzdGVyKHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZERldmljZU5hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODh+ODkOOCpOOCueaDheWgseOBruWPluW+l1xuICAgICAqIEBkZXNjIOODh+ODkOOCpOOCueOCpOODs+ODleOCqeODoeODvOOCt+ODp+ODs+OCkuiqreOBv+WPluOCi1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4gICAgICovXG4gICAgY21kUmVhZERldmljZUluZm8oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kUmVhZFJlZ2lzdGVyKHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZERldmljZUluZm8pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEkyQ+OCueODrOODvOODluOCouODieODrOOCuVxuICAgICAqIEBkZXNjIEkyQ+OBi+OCieWItuW+oeOBmeOCi+WgtOWQiOOBruOCueODrOODvOODluOCouODieODrOOCue+8iDB4MDAtMHhGRu+8ieOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhZGRyZXNzIOOCouODieODrOOCuVxuICAgICAqL1xuICAgIGNtZFNldEkyQ1NsYXZlQWRkcmVzcyhhZGRyZXNzKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxwYXJzZUludChhZGRyZXNzLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zZXRJMkNTbGF2ZUFkZHJlc3MsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlhoXpg6hcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgX2lzSW5zdGFuY09mUHJvbWlzZShhbnkpe1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgUHJvbWlzZSB8fCAob2JqICYmIHR5cGVvZiBvYmoudGhlbiA9PT0gJ2Z1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5LuW44Gu56e75YuV57O744Gu44Kz44Oe44Oz44OJ44KS5a6f6KGM5pmC44CB5pei44Gr56e75YuV57O744GuU3luY+OCs+ODnuODs+ODieOBjOWun+ihjOOBleOCjOOBpuOBhOOCi+WgtOWQiOOBr+OBneOBrkNC44KSUmVqZWN044GZ44KLXG4gICAgICog56e75YuV57O744GuU3luY+OCs+ODnuODs+ODie+8iGNtZE1vdmVCeURpc3RhbmNlU3luY+OAgWNtZE1vdmVUb1Bvc2l0aW9uU3luY++8ieetiVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX21vdmVTeW5jSW5zdHJ1Y3Rpb25PdmVycmlkZVJlamVjdChjaWQpe1xuICAgICAgICBpZih0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24pe1xuICAgICAgICAgICAgdGhpcy5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uLmNhbGxSZWplY3Qoe2lkOnRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi50YWdOYW1lLG1zZzonSW5zdHJ1Y3Rpb24gb3ZlcnJpZGUnLG92ZXJyaWRlSWQ6Y2lkfSk7XG4gICAgICAgICAgICB0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb249bnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuXG4vLy8vLy9jbGFzcy8vXG59XG5cblxuLyoqXG4gKiBTZW5kQmxlTm90aWZ5UHJvbWlzXG4gKiDjgIBjbWRSZWFkUmVnaXN0ZXLnrYnjga5CTEXlkbzjgbPlh7rjgZflvozjgatcbiAqIOOAgOOCs+ODnuODs+ODiee1kOaenOOBjG5vdGlmeeOBp+mAmuefpeOBleOCjOOCi+OCs+ODnuODs+ODieOCklByb21pc+OBqOe0kOS7mOOBkeOCi+eCuuOBruOCr+ODqeOCuVxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX0tNTm90aWZ5UHJvbWlze1xuICAgIC8v5oiQ5Yqf6YCa55+lXG4gICAgc3RhdGljIHNlbmRHcm91cE5vdGlmeVJlc29sdmUoZ3JvdXBBcnJheSx0YWdOYW1lLHZhbCl7XG4gICAgICAgIGlmKCFBcnJheS5pc0FycmF5KGdyb3VwQXJyYXkpKXtyZXR1cm47fVxuICAgICAgICAvL+mAgeS/oUlE44Gu6YCa55+lIENhbGxiYWNrUHJvbWlz44Gn5ZG844Gz5Ye644GX5YWD44Gu44Oh44K944OD44OJ44GuUHJvbWlz44Gr6L+U44GZXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPGdyb3VwQXJyYXkubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYoIGdyb3VwQXJyYXlbaV0udGFnTmFtZT09PXRhZ05hbWUgKXtcbiAgICAgICAgICAgICAgICBncm91cEFycmF5W2ldLmNhbGxSZXNvbHZlKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogY29uc3RcbiAgICAgKiBAcGFyYW0gdGFnTmFtZVxuICAgICAqIEBwYXJhbSBncm91cEFycmF5XG4gICAgICogQHBhcmFtIHByb21pc1Jlc29sdmVPYmpcbiAgICAgKiBAcGFyYW0gcHJvbWlzUmVqZWN0T2JqXG4gICAgICogQHBhcmFtIHJlamVjdFRpbWVPdXRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0YWdOYW1lLHRhZ0luZm89bnVsbCxncm91cEFycmF5PVtdLHByb21pc1Jlc29sdmVPYmosIHByb21pc1JlamVjdE9iaixyZWplY3RUaW1lT3V0KXtcbiAgICAgICAgdGhpcy50aW1lb3V0SWQ9MDtcbiAgICAgICAgdGhpcy50YWdOYW1lPXRhZ05hbWU7XG4gICAgICAgIHRoaXMudGFnSW5mbz10YWdJbmZvO1xuICAgICAgICB0aGlzLmdyb3VwQXJyYXk9QXJyYXkuaXNBcnJheShncm91cEFycmF5KT9ncm91cEFycmF5OltdO1xuICAgICAgICB0aGlzLmdyb3VwQXJyYXkucHVzaCh0aGlzKTtcbiAgICAgICAgdGhpcy5wcm9taXNSZXNvbHZlT2JqPXByb21pc1Jlc29sdmVPYmo7XG4gICAgICAgIHRoaXMucHJvbWlzUmVqZWN0T2JqPXByb21pc1JlamVjdE9iajtcbiAgICAgICAgdGhpcy5yZWplY3RUaW1lT3V0PXJlamVjdFRpbWVPdXQ7XG4gICAgfVxuICAgIC8v44Kr44Km44Oz44OI44Gu6ZaL5aeLIGNoYXJhY3RlcmlzdGljcy53cml0ZVZhbHVl5ZG844Gz5Ye644GX5b6M44Gr5a6f6KGMXG4gICAgc3RhcnRSZWplY3RUaW1lT3V0Q291bnQoKXtcbiAgICAgICAgdGhpcy50aW1lb3V0SWQ9c2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlR3JvdXAoKTtcbiAgICAgICAgICAgIHRoaXMucHJvbWlzUmVqZWN0T2JqKHttc2c6XCJ0aW1lb3V0OlwiLHRhZ05hbWU6dGhpcy50YWdOYW1lLHRhZ0luZm86dGhpcy50YWdJbmZvfSk7XG4gICAgICAgIH0sIHRoaXMucmVqZWN0VGltZU91dCk7XG4gICAgfVxuICAgIGNhbGxSZXNvbHZlKGFyZyl7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUdyb3VwKCk7XG4gICAgICAgIHRoaXMucHJvbWlzUmVzb2x2ZU9iaihhcmcpO1xuICAgIH1cbiAgICBjYWxsUmVqZWN0KG1zZyl7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUdyb3VwKCk7XG4gICAgICAgIHRoaXMucHJvbWlzUmVqZWN0T2JqKHttc2c6bXNnfSk7XG4gICAgfVxuXG4gICAgX3JlbW92ZUdyb3VwKCl7XG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMuZ3JvdXBBcnJheS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZiggdGhpcy5ncm91cEFycmF5W2ldPT09dGhpcyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cEFycmF5LnNwbGljZShpLDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID1LTU1vdG9yQ29tbWFuZEtNT25lO1xuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9LTU1vdG9yQ29tbWFuZEtNT25lLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFIgPSB0eXBlb2YgUmVmbGVjdCA9PT0gJ29iamVjdCcgPyBSZWZsZWN0IDogbnVsbFxudmFyIFJlZmxlY3RBcHBseSA9IFIgJiYgdHlwZW9mIFIuYXBwbHkgPT09ICdmdW5jdGlvbidcbiAgPyBSLmFwcGx5XG4gIDogZnVuY3Rpb24gUmVmbGVjdEFwcGx5KHRhcmdldCwgcmVjZWl2ZXIsIGFyZ3MpIHtcbiAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwodGFyZ2V0LCByZWNlaXZlciwgYXJncyk7XG4gIH1cblxudmFyIFJlZmxlY3RPd25LZXlzXG5pZiAoUiAmJiB0eXBlb2YgUi5vd25LZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gIFJlZmxlY3RPd25LZXlzID0gUi5vd25LZXlzXG59IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KVxuICAgICAgLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkpO1xuICB9O1xufSBlbHNlIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gUHJvY2Vzc0VtaXRXYXJuaW5nKHdhcm5pbmcpIHtcbiAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKSBjb25zb2xlLndhcm4od2FybmluZyk7XG59XG5cbnZhciBOdW1iZXJJc05hTiA9IE51bWJlci5pc05hTiB8fCBmdW5jdGlvbiBOdW1iZXJJc05hTih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIEV2ZW50RW1pdHRlci5pbml0LmNhbGwodGhpcyk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHNDb3VudCA9IDA7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbnZhciBkZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIsICdkZWZhdWx0TWF4TGlzdGVuZXJzJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkZWZhdWx0TWF4TGlzdGVuZXJzO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uKGFyZykge1xuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnbnVtYmVyJyB8fCBhcmcgPCAwIHx8IE51bWJlcklzTmFOKGFyZykpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgb2YgXCJkZWZhdWx0TWF4TGlzdGVuZXJzXCIgaXMgb3V0IG9mIHJhbmdlLiBJdCBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIG51bWJlci4gUmVjZWl2ZWQgJyArIGFyZyArICcuJyk7XG4gICAgfVxuICAgIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSBhcmc7XG4gIH1cbn0pO1xuXG5FdmVudEVtaXR0ZXIuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG4gIGlmICh0aGlzLl9ldmVudHMgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgdGhpcy5fZXZlbnRzID09PSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcykuX2V2ZW50cykge1xuICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICB9XG5cbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn07XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIHNldE1heExpc3RlbmVycyhuKSB7XG4gIGlmICh0eXBlb2YgbiAhPT0gJ251bWJlcicgfHwgbiA8IDAgfHwgTnVtYmVySXNOYU4obikpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIG9mIFwiblwiIGlzIG91dCBvZiByYW5nZS4gSXQgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXIuIFJlY2VpdmVkICcgKyBuICsgJy4nKTtcbiAgfVxuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbmZ1bmN0aW9uICRnZXRNYXhMaXN0ZW5lcnModGhhdCkge1xuICBpZiAodGhhdC5fbWF4TGlzdGVuZXJzID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICByZXR1cm4gdGhhdC5fbWF4TGlzdGVuZXJzO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmdldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIGdldE1heExpc3RlbmVycygpIHtcbiAgcmV0dXJuICRnZXRNYXhMaXN0ZW5lcnModGhpcyk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KHR5cGUpIHtcbiAgdmFyIGFyZ3MgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICB2YXIgZG9FcnJvciA9ICh0eXBlID09PSAnZXJyb3InKTtcblxuICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpXG4gICAgZG9FcnJvciA9IChkb0Vycm9yICYmIGV2ZW50cy5lcnJvciA9PT0gdW5kZWZpbmVkKTtcbiAgZWxzZSBpZiAoIWRvRXJyb3IpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKGRvRXJyb3IpIHtcbiAgICB2YXIgZXI7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gMClcbiAgICAgIGVyID0gYXJnc1swXTtcbiAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgLy8gTm90ZTogVGhlIGNvbW1lbnRzIG9uIHRoZSBgdGhyb3dgIGxpbmVzIGFyZSBpbnRlbnRpb25hbCwgdGhleSBzaG93XG4gICAgICAvLyB1cCBpbiBOb2RlJ3Mgb3V0cHV0IGlmIHRoaXMgcmVzdWx0cyBpbiBhbiB1bmhhbmRsZWQgZXhjZXB0aW9uLlxuICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgfVxuICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmhhbmRsZWQgZXJyb3IuJyArIChlciA/ICcgKCcgKyBlci5tZXNzYWdlICsgJyknIDogJycpKTtcbiAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgIHRocm93IGVycjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgfVxuXG4gIHZhciBoYW5kbGVyID0gZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChoYW5kbGVyID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFJlZmxlY3RBcHBseShoYW5kbGVyLCB0aGlzLCBhcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbGVuID0gaGFuZGxlci5sZW5ndGg7XG4gICAgdmFyIGxpc3RlbmVycyA9IGFycmF5Q2xvbmUoaGFuZGxlciwgbGVuKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKVxuICAgICAgUmVmbGVjdEFwcGx5KGxpc3RlbmVyc1tpXSwgdGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmZ1bmN0aW9uIF9hZGRMaXN0ZW5lcih0YXJnZXQsIHR5cGUsIGxpc3RlbmVyLCBwcmVwZW5kKSB7XG4gIHZhciBtO1xuICB2YXIgZXZlbnRzO1xuICB2YXIgZXhpc3Rpbmc7XG5cbiAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImxpc3RlbmVyXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIEZ1bmN0aW9uLiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgbGlzdGVuZXIpO1xuICB9XG5cbiAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG4gIGlmIChldmVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0YXJnZXQuX2V2ZW50c0NvdW50ID0gMDtcbiAgfSBlbHNlIHtcbiAgICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAgIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgICBpZiAoZXZlbnRzLm5ld0xpc3RlbmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRhcmdldC5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA/IGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gICAgICAvLyBSZS1hc3NpZ24gYGV2ZW50c2AgYmVjYXVzZSBhIG5ld0xpc3RlbmVyIGhhbmRsZXIgY291bGQgaGF2ZSBjYXVzZWQgdGhlXG4gICAgICAvLyB0aGlzLl9ldmVudHMgdG8gYmUgYXNzaWduZWQgdG8gYSBuZXcgb2JqZWN0XG4gICAgICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcbiAgICB9XG4gICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV07XG4gIH1cblxuICBpZiAoZXhpc3RpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gICAgKyt0YXJnZXQuX2V2ZW50c0NvdW50O1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2YgZXhpc3RpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV0gPVxuICAgICAgICBwcmVwZW5kID8gW2xpc3RlbmVyLCBleGlzdGluZ10gOiBbZXhpc3RpbmcsIGxpc3RlbmVyXTtcbiAgICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB9IGVsc2UgaWYgKHByZXBlbmQpIHtcbiAgICAgIGV4aXN0aW5nLnVuc2hpZnQobGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleGlzdGluZy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICAgIG0gPSAkZ2V0TWF4TGlzdGVuZXJzKHRhcmdldCk7XG4gICAgaWYgKG0gPiAwICYmIGV4aXN0aW5nLmxlbmd0aCA+IG0gJiYgIWV4aXN0aW5nLndhcm5lZCkge1xuICAgICAgZXhpc3Rpbmcud2FybmVkID0gdHJ1ZTtcbiAgICAgIC8vIE5vIGVycm9yIGNvZGUgZm9yIHRoaXMgc2luY2UgaXQgaXMgYSBXYXJuaW5nXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgICAgIHZhciB3ID0gbmV3IEVycm9yKCdQb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5IGxlYWsgZGV0ZWN0ZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBleGlzdGluZy5sZW5ndGggKyAnICcgKyBTdHJpbmcodHlwZSkgKyAnIGxpc3RlbmVycyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FkZGVkLiBVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2luY3JlYXNlIGxpbWl0Jyk7XG4gICAgICB3Lm5hbWUgPSAnTWF4TGlzdGVuZXJzRXhjZWVkZWRXYXJuaW5nJztcbiAgICAgIHcuZW1pdHRlciA9IHRhcmdldDtcbiAgICAgIHcudHlwZSA9IHR5cGU7XG4gICAgICB3LmNvdW50ID0gZXhpc3RpbmcubGVuZ3RoO1xuICAgICAgUHJvY2Vzc0VtaXRXYXJuaW5nKHcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICByZXR1cm4gX2FkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCBmYWxzZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5wcmVwZW5kTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgdHJ1ZSk7XG4gICAgfTtcblxuZnVuY3Rpb24gb25jZVdyYXBwZXIoKSB7XG4gIHZhciBhcmdzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgaWYgKCF0aGlzLmZpcmVkKSB7XG4gICAgdGhpcy50YXJnZXQucmVtb3ZlTGlzdGVuZXIodGhpcy50eXBlLCB0aGlzLndyYXBGbik7XG4gICAgdGhpcy5maXJlZCA9IHRydWU7XG4gICAgUmVmbGVjdEFwcGx5KHRoaXMubGlzdGVuZXIsIHRoaXMudGFyZ2V0LCBhcmdzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfb25jZVdyYXAodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc3RhdGUgPSB7IGZpcmVkOiBmYWxzZSwgd3JhcEZuOiB1bmRlZmluZWQsIHRhcmdldDogdGFyZ2V0LCB0eXBlOiB0eXBlLCBsaXN0ZW5lcjogbGlzdGVuZXIgfTtcbiAgdmFyIHdyYXBwZWQgPSBvbmNlV3JhcHBlci5iaW5kKHN0YXRlKTtcbiAgd3JhcHBlZC5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICBzdGF0ZS53cmFwRm4gPSB3cmFwcGVkO1xuICByZXR1cm4gd3JhcHBlZDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZSh0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRnVuY3Rpb24uIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBsaXN0ZW5lcik7XG4gIH1cbiAgdGhpcy5vbih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRPbmNlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRPbmNlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRnVuY3Rpb24uIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgICB0aGlzLnByZXBlbmRMaXN0ZW5lcih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbi8vIEVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZiBhbmQgb25seSBpZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbiAgICBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgdmFyIGxpc3QsIGV2ZW50cywgcG9zaXRpb24sIGksIG9yaWdpbmFsTGlzdGVuZXI7XG5cbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRnVuY3Rpb24uIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBsaXN0ZW5lcik7XG4gICAgICB9XG5cbiAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIGxpc3QgPSBldmVudHNbdHlwZV07XG4gICAgICBpZiAobGlzdCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8IGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKVxuICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0Lmxpc3RlbmVyIHx8IGxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbGlzdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwb3NpdGlvbiA9IC0xO1xuXG4gICAgICAgIGZvciAoaSA9IGxpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHwgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsTGlzdGVuZXIgPSBsaXN0W2ldLmxpc3RlbmVyO1xuICAgICAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICBpZiAocG9zaXRpb24gPT09IDApXG4gICAgICAgICAgbGlzdC5zaGlmdCgpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBzcGxpY2VPbmUobGlzdCwgcG9zaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKVxuICAgICAgICAgIGV2ZW50c1t0eXBlXSA9IGxpc3RbMF07XG5cbiAgICAgICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBvcmlnaW5hbExpc3RlbmVyIHx8IGxpc3RlbmVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG4gICAgZnVuY3Rpb24gcmVtb3ZlQWxsTGlzdGVuZXJzKHR5cGUpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMsIGV2ZW50cywgaTtcblxuICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICAgICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnRzW3R5cGVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMClcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGV2ZW50cyk7XG4gICAgICAgIHZhciBrZXk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lcnMgPSBldmVudHNbdHlwZV07XG5cbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXJzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgICAgIH0gZWxzZSBpZiAobGlzdGVuZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gTElGTyBvcmRlclxuICAgICAgICBmb3IgKGkgPSBsaXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuZnVuY3Rpb24gX2xpc3RlbmVycyh0YXJnZXQsIHR5cGUsIHVud3JhcCkge1xuICB2YXIgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG5cbiAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBbXTtcblxuICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcbiAgaWYgKGV2bGlzdGVuZXIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gW107XG5cbiAgaWYgKHR5cGVvZiBldmxpc3RlbmVyID09PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB1bndyYXAgPyBbZXZsaXN0ZW5lci5saXN0ZW5lciB8fCBldmxpc3RlbmVyXSA6IFtldmxpc3RlbmVyXTtcblxuICByZXR1cm4gdW53cmFwID9cbiAgICB1bndyYXBMaXN0ZW5lcnMoZXZsaXN0ZW5lcikgOiBhcnJheUNsb25lKGV2bGlzdGVuZXIsIGV2bGlzdGVuZXIubGVuZ3RoKTtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiBsaXN0ZW5lcnModHlwZSkge1xuICByZXR1cm4gX2xpc3RlbmVycyh0aGlzLCB0eXBlLCB0cnVlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmF3TGlzdGVuZXJzID0gZnVuY3Rpb24gcmF3TGlzdGVuZXJzKHR5cGUpIHtcbiAgcmV0dXJuIF9saXN0ZW5lcnModGhpcywgdHlwZSwgZmFsc2UpO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIGlmICh0eXBlb2YgZW1pdHRlci5saXN0ZW5lckNvdW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbGlzdGVuZXJDb3VudC5jYWxsKGVtaXR0ZXIsIHR5cGUpO1xuICB9XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBsaXN0ZW5lckNvdW50O1xuZnVuY3Rpb24gbGlzdGVuZXJDb3VudCh0eXBlKSB7XG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XG5cbiAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSBldmVudHNbdHlwZV07XG5cbiAgICBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSBpZiAoZXZsaXN0ZW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIDA7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZXZlbnROYW1lcyA9IGZ1bmN0aW9uIGV2ZW50TmFtZXMoKSB7XG4gIHJldHVybiB0aGlzLl9ldmVudHNDb3VudCA+IDAgPyBSZWZsZWN0T3duS2V5cyh0aGlzLl9ldmVudHMpIDogW107XG59O1xuXG5mdW5jdGlvbiBhcnJheUNsb25lKGFyciwgbikge1xuICB2YXIgY29weSA9IG5ldyBBcnJheShuKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyArK2kpXG4gICAgY29weVtpXSA9IGFycltpXTtcbiAgcmV0dXJuIGNvcHk7XG59XG5cbmZ1bmN0aW9uIHNwbGljZU9uZShsaXN0LCBpbmRleCkge1xuICBmb3IgKDsgaW5kZXggKyAxIDwgbGlzdC5sZW5ndGg7IGluZGV4KyspXG4gICAgbGlzdFtpbmRleF0gPSBsaXN0W2luZGV4ICsgMV07XG4gIGxpc3QucG9wKCk7XG59XG5cbmZ1bmN0aW9uIHVud3JhcExpc3RlbmVycyhhcnIpIHtcbiAgdmFyIHJldCA9IG5ldyBBcnJheShhcnIubGVuZ3RoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXQubGVuZ3RoOyArK2kpIHtcbiAgICByZXRbaV0gPSBhcnJbaV0ubGlzdGVuZXIgfHwgYXJyW2ldO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIl0sInNvdXJjZVJvb3QiOiIifQ==