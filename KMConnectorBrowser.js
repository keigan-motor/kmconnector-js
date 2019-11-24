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
                    res.teachingInterval=dv.getUint8(startOffset,false);//todo::バイト不足 Uint32->Uint8  2.24
                    break;
                case this._MOTOR_RX_READREGISTER_COMMAND.playbackInterval:
                    res.playbackInterval=dv.getUint8(startOffset,false);//todo::バイト不足 Uint32->Uint8  2.24
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
                case this._MOTOR_RX_READREGISTER_COMMAND.positionI:
                    res.positionI=dv.getFloat32(startOffset,false);
                    break;
                case this._MOTOR_RX_READREGISTER_COMMAND.positionD:
                    res.positionD=dv.getFloat32(startOffset,false);
                    break;
                case this._MOTOR_RX_READREGISTER_COMMAND.posControlThreshold:
                    res.posControlThreshold=dv.getFloat32(startOffset,false);
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
                case this._MOTOR_RX_READREGISTER_COMMAND.response://todo::値が取得出来ない 2.24
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
                case this._MOTOR_RX_READREGISTER_COMMAND.uartBaudRate:
                    res.uartBaudRate=dv.getUint8(startOffset);
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
                "uartBaudRate":0xC3,
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
            "maxSpeed":0x02,//
            "minSpeed":0x03,//
            "curveType":0x05,//
            "acc":0x07,//
            "dec":0x08,//
            "maxTorque":0x0E,//
            "teachingInterval":0x16,//
            "playbackInterval":0x17,//
            "qCurrentP":0x18,//
            "qCurrentI":0x19,//
            "qCurrentD":0x1A,//
            "speedP":0x1B,//
            "speedI":0x1C,//
            "speedD":0x1D,//
            "positionP":0x1E,//
            "positionI":0x1F,//
            "positionD":0x20,//
            "posControlThreshold":0x21,//
            //"notifyPosArrival":0x2B,
            "motorMeasurementInterval":0x2C,//
            "motorMeasurementByDefault":0x2D,//
            "interface":0x2E,//
            //"response":0x30,//todo::値が取得出来ない 2.24
            "ownColor":0x3A,//
            "iMUMeasurementInterval":0x3C,//
            "iMUMeasurementByDefault":0x3D,//
            "deviceName":0x46,//
            "deviceInfo":0x47,//
            "speed":0x58,//
            "positionOffset":0x5B,//
            "moveTo":0x66,//
            "hold":0x72,//
            "status":0x9A,//
            "i2CSlaveAddress":0xC0,//
            "uartBaudRate":0xC3,
            "led":0xE0,//
            "enableCheckSum":0xF3//
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
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(repeating)));
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
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(repeating)));
        new DataView(buffer).setUint8(6,Math.abs(parseInt(start_position)));
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
        new DataView(buffer).setUint32(0,Math.abs(parseInt(time)));
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
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index)));
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
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index)));
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
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(lengthRecordingTime)));
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
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index)));
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
        new DataView(buffer).setUint8(0,Math.abs(parseInt(cmdLed_LED_STATE)));
        new DataView(buffer).setUint8(1,Math.abs(parseInt(red)));
        new DataView(buffer).setUint8(2,Math.abs(parseInt(green)));
        new DataView(buffer).setUint8(3,Math.abs(parseInt(blue)));
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
        new DataView(buffer).setUint8(0,Math.abs(parseInt(cmdCurveType_CURVE_TYPE)));
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
        let _interval=Math.abs(parseInt(interval));
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
        let _interval=Math.abs(parseInt(interval));
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
        new DataView(buffer).setUint32(5,Math.abs(parseInt(settleTime)));
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
        new DataView(buffer).setUint8(0,parseInt(cmdMotorMeasurementInterval_MOTOR_MEAS_INTERVAL));
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
        new DataView(buffer).setUint8(0,parseInt(bitFlg));
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
        new DataView(buffer).setUint8(0,Math.abs(parseInt(red)));
        new DataView(buffer).setUint8(1,Math.abs(parseInt(green)));
        new DataView(buffer).setUint8(2,Math.abs(parseInt(blue)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.ownColor,buffer);
    }

    /**
     * @summary ６軸センサー（加速度・ジャイロ）測定値の取得間隔
     * @desc 有線（USB, I2C）のみ有効。BLEでは固定 100ms 間隔で通知される。
     * @param {KMMotorCommandKMOne.cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL} cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL enum 加速度・ジャイロ測定値の取得間隔
     */
    cmdIMUMeasurementInterval(cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL=4){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.iMUMeasurementInterval,buffer);
    }

    /**
     * @summary ６軸センサー（加速度・ジャイロ）の値の通知をデフォルトで開始する
     * @desc isEnabled = true の場合、enableIMU() を送信しなくても起動時に自動で通知が開始される
     * @param {number} isEnabled 0:Disbled, 1:Enabled
     */
    cmdIMUMeasurementByDefault(isEnabled){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(isEnabled));
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
                let register=parseInt(registers);
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
     * モーターの全てのレジスタ値の取得 (廃止予定1.3.2〜)
     * @returns {Promise.<array>}
     */
    cmdReadAllRegister(){
        //info::廃止予定1.3.2〜 MotorFarmのversionにより、取得出来ないレジスタが存在する為。
        // （存在しないレジスタが1つでもあるとプロパティが揃わずtimeoutになる）
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
        new DataView(buffer).setUint8(0,parseInt(register));
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
        new DataView(buffer).setUint8(0,parseInt(address));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgOGVlZjU3OTE3OWQyMmM4YTEyMTkiLCJ3ZWJwYWNrOi8vLy4vbGliL0tNU3RydWN0dXJlcy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01VdGwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0tNQ29tV2ViQkxFLmpzIiwid2VicGFjazovLy8uL2xpYi9LTUNvbm5lY3RvckJyb3dzZXJXUEsuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01Nb3Rvck9uZVdlYkJMRS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01Db21CYXNlLmpzIiwid2VicGFjazovLy8uL2xpYi9LTU1vdG9yQ29tbWFuZEtNT25lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7O1FBRUE7UUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhO0FBQ2IsWUFBWSxtQkFBTyxDQUFDLENBQVM7OztBQUc3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIs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OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUscUNBQXFDO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSw0Q0FBNEM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLE9BQU87QUFDdkIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxvRUFBb0U7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGdFQUFnRTtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGlCQUFpQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLHNDQUFzQyxRQUFRO0FBQzlDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLHlCQUF5QjtBQUNqQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiS01Db25uZWN0b3JCcm93c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgOGVlZjU3OTE3OWQyMmM4YTEyMTkiLCIvKioqXG4gKiBLTVN0cnVjdHVyZXMuanNcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmxldCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcblxuXG4vKipcbiAqIEBjbGFzc2Rlc2Mg5qeL6YCg5L2T44Gu5Z+65bqV44Kv44Op44K5XG4gKiBAaWdub3JlXG4gKi9cbmNsYXNzIEtNU3RydWN0dXJlQmFzZXtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDlkIzjgZjlgKTjgpLmjIHjgaTjgYvjga7mr5TovINcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdGFyIOavlOi8g+OBmeOCi+ani+mAoOS9k1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDntZDmnpxcbiAgICAgKi9cbiAgICBFUSAodGFyKSB7XG4gICAgICAgIGlmKCEgdGFyICl7cmV0dXJuIGZhbHNlO31cbiAgICAgICAgaWYodGhpcy5jb25zdHJ1Y3Rvcj09PXRhci5jb25zdHJ1Y3Rvcil7XG4gICAgICAgICAgICBpZih0aGlzLkdldFZhbEFycmF5KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5HZXRWYWxBcnJheSgpLnRvU3RyaW5nKCk9PT10YXIuR2V0VmFsQXJyYXkoKS50b1N0cmluZygpO1xuICAgICAgICAgICAgfWVsc2UgaWYodGhpcy5HZXRWYWxPYmope1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLkdldFZhbE9iaigpKT09PUpTT04uc3RyaW5naWZ5KHRhci5HZXRWYWxPYmooKSk7Ly8gYmFkOjrpgYXjgYRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6KSH6KO9XG4gICAgICogQHJldHVybnMge29iamVjdH0g6KSH6KO944GV44KM44Gf5qeL6YCg5L2TXG4gICAgICovXG4gICAgQ2xvbmUgKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgdGhpcy5jb25zdHJ1Y3RvcigpLHRoaXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDlgKTjga7lj5blvpfvvIhPYmrvvIlcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgICAqL1xuICAgIEdldFZhbE9iaiAoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWApOOBruWPluW+l++8iOmFjeWIl++8iVxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBHZXRWYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCBrPU9iamVjdC5rZXlzKHRoaXMpO1xuICAgICAgICBsZXQgcj1bXTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTxrLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgci5wdXNoKHRoaXNba1tpXV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWApOOBruS4gOaLrOioreWumu+8iE9iau+8iVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wc09iaiDoqK3lrprjgZnjgovjg5fjg63jg5Hjg4bjgqNcbiAgICAgKi9cbiAgICBTZXRWYWxPYmogKHByb3BzT2JqKSB7XG4gICAgICAgIGlmKHR5cGVvZiBwcm9wc09iaiAhPT1cIm9iamVjdFwiKXtyZXR1cm47fVxuICAgICAgICBsZXQga2V5cz1PYmplY3Qua2V5cyhwcm9wc09iaik7XG4gICAgICAgIGZvcihsZXQgaz0wO2s8a2V5cy5sZW5ndGg7aysrKXtcbiAgICAgICAgICAgIGxldCBwbj1rZXlzW2tdO1xuICAgICAgICAgICAgaWYodGhpcy5oYXNPd25Qcm9wZXJ0eShwbikpe1xuICAgICAgICAgICAgICAgIHRoaXNbcG5dPXByb3BzT2JqW3BuXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5cbi8qKlxuICogQGNsYXNzZGVzYyBYWeW6p+aomeOBruani+mAoOS9k+OCquODluOCuOOCp+OCr+ODiFxuICogQGlnbm9yZVxuICovXG5jbGFzcyBLTVZlY3RvcjIgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICogQGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxuICAgICAqXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHg9MCwgeT0wKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog55u45a++5L2N572u44G456e75YuVXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR5XG4gICAgICovXG4gICAgTW92ZSAoZHggPTAsIGR5ID0gMCkge1xuICAgICAgICB0aGlzLnggKz0gZHg7XG4gICAgICAgIHRoaXMueSArPSBkeTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMueCuemWk+OBrui3nembolxuICAgICAqIEBwYXJhbSB7S01WZWN0b3IyfSB2ZWN0b3IyXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBEaXN0YW5jZSAodmVjdG9yMikge1xuICAgICAgICBpZiAoISh2ZWN0b3IyIGluc3RhbmNlb2YgS01WZWN0b3IyKSkge3JldHVybjt9XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coKHRoaXMueC12ZWN0b3IyLngpLDIpICsgTWF0aC5wb3coKHRoaXMueS12ZWN0b3IyLnkpLDIpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMueCuemWk+OBruinkuW6plxuICAgICAqIEBwYXJhbSB7S01WZWN0b3IyfSB2ZWN0b3IyXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBSYWRpYW4gKHZlY3RvcjIpIHtcbiAgICAgICAgaWYgKCEodmVjdG9yMiBpbnN0YW5jZW9mIEtNVmVjdG9yMikpIHtyZXR1cm47fVxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnktdmVjdG9yMi55LHRoaXMueC12ZWN0b3IyLngpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAwLDDjgYvjgonjga7ot53pm6JcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIERpc3RhbmNlRnJvbVplcm8oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3codGhpcy54LDIpICsgTWF0aC5wb3codGhpcy55LDIpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMCww44GL44KJ44Gu6KeS5bqmXG4gICAgICogQHJldHVybnMge251bWJlcn0gcmFkaWFuXG4gICAgICovXG4gICAgUmFkaWFuRnJvbVplcm8oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueSx0aGlzLngpO1xuICAgIH1cbn1cblxuXG5cbi8qKlxuICogQGNsYXNzZGVzYyDjgrjjg6PjgqTjg63jgrvjg7PjgrXjg7zlgKRcbiAqL1xuY2xhc3MgS01JbXVTdGF0ZSBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWNjZWxYIOWKoOmAn+W6pih4KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWNjZWxZIOWKoOmAn+W6pih5KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWNjZWxaIOWKoOmAn+W6pih6KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGVtcCDmuKnluqYgQ1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBneXJvWCDop5LpgJ/luqYoeCkgW8KxIDFdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGd5cm9ZIOinkumAn+W6pih5KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZ3lyb1og6KeS6YCf5bqmKHopIFvCsSAxXVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChhY2NlbFgsIGFjY2VsWSwgYWNjZWxaLCB0ZW1wLCBneXJvWCwgZ3lyb1ksIGd5cm9aICkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuYWNjZWxYPSBLTVV0bC50b051bWJlcihhY2NlbFgpO1xuICAgICAgICB0aGlzLmFjY2VsWT0gS01VdGwudG9OdW1iZXIoYWNjZWxZKTtcbiAgICAgICAgdGhpcy5hY2NlbFo9IEtNVXRsLnRvTnVtYmVyKGFjY2VsWik7XG4gICAgICAgIHRoaXMudGVtcD0gS01VdGwudG9OdW1iZXIodGVtcCk7XG4gICAgICAgIHRoaXMuZ3lyb1g9IEtNVXRsLnRvTnVtYmVyKGd5cm9YKTtcbiAgICAgICAgdGhpcy5neXJvWT0gS01VdGwudG9OdW1iZXIoZ3lyb1kpO1xuICAgICAgICB0aGlzLmd5cm9aPSBLTVV0bC50b051bWJlcihneXJvWik7XG4gICAgfVxufVxuLyoqXG4gKiBLRUlHQU7jg6Ljg7zjgr/jg7xMRUTjgIDngrnnga/jg7voibLnirbmhYtcbiAqIFN0YXRlIE1PVE9SX0xFRF9TVEFURVxuICogY29sb3JSIDAtMjU1XG4gKiBjb2xvckcgMC0yNTVcbiAqIGNvbG9yQiAwLTI1NVxuICogKi9cbi8qKlxuICogQGNsYXNzZGVzYyDjg6Ljg7zjgr/jg7xMRUTjgIDngrnnga/jg7voibLnirbmhYtcbiAqL1xuY2xhc3MgS01MZWRTdGF0ZSBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844GuTEVE54q25oWLXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTEVEX1NUQVRFX09GRiAtIDA6TEVE5raI54GvXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX0xFRF9TVEFURV9PTl9TT0xJRCAtIDE6TEVE54K554GvXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX0xFRF9TVEFURV9PTl9GTEFTSCAtIDI6TEVE54K55ruF77yI5LiA5a6a6ZaT6ZqU44Gn54K55ruF77yJXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX0xFRF9TVEFURV9PTl9ESU0gLSAzOkxFROOBjOOChuOBo+OBj+OCiui8neW6puWkieWMluOBmeOCi1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgTU9UT1JfTEVEX1NUQVRFKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09GRlwiOjAsXG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PTl9TT0xJRFwiOjEsXG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PTl9GTEFTSFwiOjIsXG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PTl9ESU1cIjozXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBleHRlbmRzIEtNU3RydWN0dXJlQmFzZVxuICAgICAqIEBwYXJhbSB7S01MZWRTdGF0ZS5NT1RPUl9MRURfU1RBVEV9IHN0YXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbG9yUiBpbnQgWzAtMjU1XVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb2xvckcgaW50IFswLTI1NV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY29sb3JCIGludCBbMC0yNTVdXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc3RhdGUsY29sb3JSLGNvbG9yRyxjb2xvckIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zdGF0ZT1LTVV0bC50b051bWJlcihzdGF0ZSk7XG4gICAgICAgIHRoaXMuY29sb3JSPUtNVXRsLnRvTnVtYmVyKGNvbG9yUik7XG4gICAgICAgIHRoaXMuY29sb3JHPUtNVXRsLnRvTnVtYmVyKGNvbG9yRyk7XG4gICAgICAgIHRoaXMuY29sb3JCPUtNVXRsLnRvTnVtYmVyKGNvbG9yQik7XG4gICAgfVxufVxuXG4vKipcbiAqIEBjbGFzc2Rlc2Mg44Oi44O844K/44O85Zue6Lui5oOF5aCxXG4gKi9cbmNsYXNzIEtNUm90U3RhdGUgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuICAgIC8qKlxuICAgICAqIOacgOWkp+ODiOODq+OCr+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBNQVhfVE9SUVVFKCl7XG4gICAgICAgIHJldHVybiAwLjM7Ly8wLjMgTuODu21cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmnIDlpKfpgJ/luqblrprmlbAocnBtKVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBNQVhfU1BFRURfUlBNKCl7XG4gICAgICAgIHJldHVybiAzMDA7Ly8zMDBycG1cbiAgICB9XG4gICAgLyoqXG4gICAgICog5pyA5aSn6YCf5bqm5a6a5pWwKHJhZGlhbi9zZWMpXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE1BWF9TUEVFRF9SQURJQU4oKXtcbiAgICAgICAgcmV0dXJuIEtNVXRsLnJwbVRvUmFkaWFuU2VjKDMwMCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOacgOWkp+W6p+aomeWumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBNQVhfUE9TSVRJT04oKXtcbiAgICAgICAgcmV0dXJuIDMqTWF0aC5wb3coMTAsMzgpOy8vaW5mbzo644CMcmV0dXJu44CAM2UrMzjjgI3jga9taW5pZnnjgafjgqjjg6njg7xcbiAgICAgICAgLy9yZXR1cm7jgIAzZSszODsvL3JhZGlhbiA0Ynl0ZSBmbG9hdOOAgDEuMTc1NDk0IDEwLTM4ICA8IDMuNDAyODIzIDEwKzM4XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb24g5bqn5qiZXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZlbG9jaXR5IOmAn+W6plxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3JxdWUg44OI44Or44KvXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocG9zaXRpb24sIHZlbG9jaXR5LCB0b3JxdWUpIHtcbiAgICAgICAgLy/mnInlirnmoYHmlbAg5bCP5pWw56ysNOS9jVxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gTWF0aC5mbG9vcihLTVV0bC50b051bWJlcihwb3NpdGlvbikqMTAwMDApLzEwMDAwO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gTWF0aC5mbG9vcihLTVV0bC50b051bWJlcih2ZWxvY2l0eSkqMTAwMDApLzEwMDAwO1xuICAgICAgICB0aGlzLnRvcnF1ZSA9IE1hdGguZmxvb3IoS01VdGwudG9OdW1iZXIodG9ycXVlKSoxMDAwMCkvMTAwMDA7XG4gICAgfVxufVxuXG5cbi8qKlxuICogQGNsYXNzZGVzYyDjg4fjg5DjgqTjgrnmg4XloLFcbiAqL1xuY2xhc3MgS01EZXZpY2VJbmZvIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBleHRlbmRzIEtNU3RydWN0dXJlQmFzZVxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5LTV9DT05ORUNUX1RZUEV9IHR5cGUg5o6l57aa5pa55byPXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIOODh+ODkOOCpOOCuVVVSURcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSDjg6Ljg7zjgr/jg7zlkI0o5b2i5byPIElEIExFRENvbG9yKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNDb25uZWN0IOaOpee2mueKtuaFi1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtYW51ZmFjdHVyZXJOYW1lIOijvemAoOS8muekvuWQjVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBoYXJkd2FyZVJldmlzaW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpcm13YXJlUmV2aXNpb25cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0eXBlPTAsaWQ9XCJcIixuYW1lPVwiXCIsaXNDb25uZWN0PWZhbHNlLG1hbnVmYWN0dXJlck5hbWU9bnVsbCxoYXJkd2FyZVJldmlzaW9uPW51bGwsZmlybXdhcmVSZXZpc2lvbj1udWxsKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZT10eXBlO1xuICAgICAgICB0aGlzLmlkPWlkO1xuICAgICAgICB0aGlzLm5hbWU9bmFtZTtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3Q9aXNDb25uZWN0O1xuICAgICAgICB0aGlzLm1hbnVmYWN0dXJlck5hbWU9bWFudWZhY3R1cmVyTmFtZTtcbiAgICAgICAgdGhpcy5oYXJkd2FyZVJldmlzaW9uPWhhcmR3YXJlUmV2aXNpb247XG4gICAgICAgIHRoaXMuZmlybXdhcmVSZXZpc2lvbj1maXJtd2FyZVJldmlzaW9uO1xuXG4gICAgfVxufVxuLyoqXG4gKiBAY2xhc3NkZXNjIOODouODvOOCv+ODvOODreOCsOaDheWgsVxuICovXG5jbGFzcyBLTU1vdG9yTG9nIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gaWQge251bWJlcn0g44K344O844Kx44Oz44K5SUQo44Om44OL44O844Kv5YCkKVxuICAgICAqIEBwYXJhbSBjbWROYW1lIHtzdHJpbmd9IOWun+ihjOOCs+ODnuODs+ODieWQjVxuICAgICAqIEBwYXJhbSBjbWRJRCB7bnVtYmVyfSDlrp/ooYzjgrPjg57jg7Pjg4lJRFxuICAgICAqIEBwYXJhbSBlcnJJRCB7bnVtYmVyfSDjgqjjg6njg7zjgr/jgqTjg5dcbiAgICAgKiBAcGFyYW0gZXJyVHlwZSB7c3RyaW5nfSDjgqjjg6njg7znqK7liKVcbiAgICAgKiBAcGFyYW0gZXJyTXNnIHtzdHJpbmd944CA44Oh44OD44K744O844K45YaF5a65XG4gICAgICogQHBhcmFtIGluZm8ge251bWJlcn1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoaWQ9MCxjbWROYW1lPVwiXCIsY21kSUQ9MCxlcnJJRD0wLGVyclR5cGU9XCJcIixlcnJNc2c9XCJcIixpbmZvPTApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pZD0gaWQ7XG4gICAgICAgIHRoaXMuY21kTmFtZT1jbWROYW1lO1xuICAgICAgICB0aGlzLmNtZElEPSBjbWRJRDtcbiAgICAgICAgdGhpcy5lcnJJRD1lcnJJRDtcbiAgICAgICAgdGhpcy5lcnJUeXBlPSBlcnJUeXBlO1xuICAgICAgICB0aGlzLmVyck1zZz0gZXJyTXNnO1xuICAgICAgICB0aGlzLmluZm89IGluZm87XG4gICAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEtNU3RydWN0dXJlQmFzZTpLTVN0cnVjdHVyZUJhc2UsXG4gICAgS01WZWN0b3IyOktNVmVjdG9yMixcbiAgICAvL0tNVmVjdG9yMzpLTVZlY3RvcjMsXG4gICAgS01JbXVTdGF0ZTpLTUltdVN0YXRlLFxuICAgIEtNTGVkU3RhdGU6S01MZWRTdGF0ZSxcbiAgICBLTVJvdFN0YXRlOktNUm90U3RhdGUsXG4gICAgS01EZXZpY2VJbmZvOktNRGV2aWNlSW5mbyxcbiAgICBLTU1vdG9yTG9nOktNTW90b3JMb2dcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9LTVN0cnVjdHVyZXMuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKioqXG4gKiBLTVV0bC5qc1xuICogQ0NyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAY2xhc3NkZXNjIOODpuODvOODhuOCo+ODquODhuOCo1xuICovXG5jbGFzcyBLTVV0bHtcblxuICAgIC8qKlxuICAgICAqIOaVsOWApOOBq+OCreODo+OCueODiOOBmeOCi+mWouaVsFxuICAgICAqIOaVsOWApOS7peWkluOBrzDjgpLov5TjgZk8YnI+XG4gICAgICogSW5maW5pdHnjgoIw44Go44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWZhdWx0dmFsIHZhbOOBjOaVsOWApOOBq+WkieaPm+WHuuadpeOBquOBhOWgtOWQiOOBruODh+ODleOCqeODq+ODiFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIHRvTnVtYmVyKHZhbCwgZGVmYXVsdHZhbCA9IDApIHtcbiAgICAgICAgbGV0IHYgPSBwYXJzZUZsb2F0KHZhbCwgMTApO1xuICAgICAgICByZXR1cm4gKCFpc0Zpbml0ZSh2KSA/IGRlZmF1bHR2YWwgOiB2KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIOaVsOWApOOBq+OCreODo+OCueODiOOBmeOCi+mWouaVsCBpbnTlm7rlrppcbiAgICAgKiDmlbDlgKTku6XlpJbjga8w44KS6L+U44GZPGJyPlxuICAgICAqIEluZmluaXR544KCMOOBqOOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWxcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVmYXVsdHZhbCB2YWzjgYzmlbDlgKTjgavlpInmj5vlh7rmnaXjgarjgYTloLTlkIjjga7jg4fjg5Xjgqnjg6vjg4hcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyB0b0ludE51bWJlcih2YWwsIGRlZmF1bHR2YWwgPSAwKSB7XG4gICAgICAgIGxldCB2ID0gcGFyc2VJbnQodmFsLCAxMCk7XG4gICAgICAgIHJldHVybiAoIWlzRmluaXRlKHYpID8gZGVmYXVsdHZhbCA6IHYpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICog6KeS5bqm44Gu5Y2Y5L2N5aSJ5o+b44CAZGVncmVlID4+IHJhZGlhblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWdyZWUg5bqmXG4gICAgICogQHJldHVybnMge251bWJlcn0gcmFkaWFuXG4gICAgICovXG4gICAgc3RhdGljIGRlZ3JlZVRvUmFkaWFuKGRlZ3JlZSkge1xuICAgICAgICByZXR1cm4gZGVncmVlICogMC4wMTc0NTMyOTI1MTk5NDMyOTU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIOinkuW6puOBruWNmOS9jeWkieaPm+OAgHJhZGlhbiA+PiBkZWdyZWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkaWFuIHJhZGlhbuinklxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IOW6plxuICAgICAqL1xuICAgIHN0YXRpYyByYWRpYW5Ub0RlZ3JlZShyYWRpYW4pIHtcbiAgICAgICAgcmV0dXJuIHJhZGlhbiAvIDAuMDE3NDUzMjkyNTE5OTQzMjk1O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDpgJ/luqYgcnBtIC0+cmFkaWFuL3NlYyDjgavlpInmj5tcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcnBtXG4gICAgICogQHJldHVybnMge251bWJlcn0gcmFkaWFuL3NlY1xuICAgICAqL1xuICAgIHN0YXRpYyBycG1Ub1JhZGlhblNlYyhycG0pIHtcbiAgICAgICAgLy/pgJ/luqYgcnBtIC0+cmFkaWFuL3NlYyhNYXRoLlBJKjIvNjApXG4gICAgICAgIHJldHVybiBycG0gKiAwLjEwNDcxOTc1NTExOTY1OTc3O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogMueCuemWk+OBrui3nembouOBqOinkuW6puOCkuaxguOCgeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tX3hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbV95XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvX3hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9feVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIHR3b1BvaW50RGlzdGFuY2VBbmdsZShmcm9tX3gsIGZyb21feSwgdG9feCwgdG9feSkge1xuICAgICAgICBsZXQgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coZnJvbV94IC0gdG9feCwgMikgKyBNYXRoLnBvdyhmcm9tX3kgLSB0b195LCAyKSk7XG4gICAgICAgIGxldCByYWRpYW4gPSBNYXRoLmF0YW4yKGZyb21feSAtIHRvX3ksIGZyb21feCAtIHRvX3gpO1xuICAgICAgICByZXR1cm4ge2Rpc3Q6IGRpc3RhbmNlLCByYWRpOiByYWRpYW4sIGRlZzogS01VdGwucmFkaWFuVG9EZWdyZWUocmFkaWFuKX07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIOOCs+ODnuODs+ODieOBruODgeOCp+ODg+OCr+OCteODoOOCkuioiOeul1xuICAgICAqIEBpZ25vcmVcbiAgICAgKiBAZGVzYyDlj7PpgIHjgoogQ1JDLTE2LUNDSVRUICh4MTYgKyB4MTIgKyB4NSArIDEpIFN0YXJ0OjB4MDAwMCBYT1JPdXQ6MHgwMDAwIEJ5dGVPcmRlcjpMaXR0bGUtRW5kaWFuXG4gICAgICogQHBhcmFtIHVpbnQ4YXJyYXlCdWZmZXJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHN0YXRpYyBDcmVhdGVDb21tYW5kQ2hlY2tTdW1DUkMxNih1aW50OGFycmF5QnVmZmVyKXtcbiAgICAgICAgY29uc3QgY3JjMTZ0YWJsZT0gX19jcmMxNnRhYmxlO1xuICAgICAgICBsZXQgY3JjID0gMDsvLyBTdGFydDoweDAwMDBcbiAgICAgICAgbGV0IGxlbj11aW50OGFycmF5QnVmZmVyLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1aW50OGFycmF5QnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYyA9IHVpbnQ4YXJyYXlCdWZmZXJbaV07XG4gICAgICAgICAgICBjcmMgPSAoY3JjID4+IDgpIF4gY3JjMTZ0YWJsZVsoY3JjIF4gYykgJiAweDAwZmZdO1xuICAgICAgICB9XG4gICAgICAgIGNyYz0oKGNyYz4+OCkmMHhGRil8KChjcmM8PDgpJjB4RkYwMCk7Ly8gQnl0ZU9yZGVyOkxpdHRsZS1FbmRpYW5cbiAgICAgICAgLy9jcmM9MHhGRkZGXmNyYzsvL1hPUk91dDoweDAwMDBcbiAgICAgICAgcmV0dXJuIGNyYztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAIyBpbmZvOjogS01Db21CTEUuanPjga5ERVZJQ0UgSU5GT1JNQVRJT04gU0VSVklDReOBruODkeODvOOCueOBq+S9v+eUqFxuICAgICAqIHV0Zi5qcyAtIFVURi04IDw9PiBVVEYtMTYgY29udmVydGlvblxuICAgICAqXG4gICAgICogQGlnbm9yZVxuICAgICAqIEBwYXJhbSBhcnJheVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAZGVzY1xuICAgICAqIENvcHlyaWdodCAoQykgMTk5OSBNYXNhbmFvIEl6dW1vIDxpekBvbmljb3MuY28uanA+XG4gICAgICogVmVyc2lvbjogMS4wXG4gICAgICogTGFzdE1vZGlmaWVkOiBEZWMgMjUgMTk5OVxuICAgICAqIFRoaXMgbGlicmFyeSBpcyBmcmVlLiAgWW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdC5cbiAgICAgKi9cbiAgICBzdGF0aWMgVXRmOEFycmF5VG9TdHIoYXJyYXkpIHtcbiAgICAgICAgbGV0IG91dCwgaSwgbGVuLCBjO1xuICAgICAgICBsZXQgY2hhcjIsIGNoYXIzO1xuXG4gICAgICAgIG91dCA9IFwiXCI7XG4gICAgICAgIGxlbiA9IGFycmF5Lmxlbmd0aDtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIHdoaWxlKGkgPCBsZW4pIHtcbiAgICAgICAgICAgIGMgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgc3dpdGNoKGMgPj4gNClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogY2FzZSAyOiBjYXNlIDM6IGNhc2UgNDogY2FzZSA1OiBjYXNlIDY6IGNhc2UgNzpcbiAgICAgICAgICAgICAgICAvLyAweHh4eHh4eFxuICAgICAgICAgICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTI6IGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgLy8gMTEweCB4eHh4ICAgMTB4eCB4eHh4XG4gICAgICAgICAgICAgICAgY2hhcjIgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDB4MUYpIDw8IDYpIHwgKGNoYXIyICYgMHgzRikpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICAgICAgICAgIC8vIDExMTAgeHh4eCAgMTB4eCB4eHh4ICAxMHh4IHh4eHhcbiAgICAgICAgICAgICAgICAgICAgY2hhcjIgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgICAgICAgICBjaGFyMyA9IGFycmF5W2krK107XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDB4MEYpIDw8IDEyKSB8XG4gICAgICAgICAgICAgICAgICAgICAgICAoKGNoYXIyICYgMHgzRikgPDwgNikgfFxuICAgICAgICAgICAgICAgICAgICAgICAgKChjaGFyMyAmIDB4M0YpIDw8IDApKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQCMgaW5mbzo6IOODh+ODkOODg+OCsOeUqFxuICAgICAqIHVpbnQ4QXJyYXkgPT4gVVRGLTE2IFN0cmluZ3MgY29udmVydGlvblxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBAcGFyYW0gdWludDhBcnJheVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgc3RhdGljIFVpbnQ4QXJyYXlUb0hleFN0cih1aW50OEFycmF5KXtcbiAgICAgICAgaWYoIXVpbnQ4QXJyYXkgaW5zdGFuY2VvZiBVaW50OEFycmF5KXtyZXR1cm47fVxuICAgICAgICBsZXQgYXI9W107XG4gICAgICAgIGZvcihsZXQgaT0wO2k8dWludDhBcnJheS5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIGFyLnB1c2godWludDhBcnJheVtpXS50b1N0cmluZygxNikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhci5qb2luKCc6Jyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQCMgaW5mbzo6VWludDjjga5Db25jYXRcbiAgICAgKiBDcmVhdGVzIGEgbmV3IFVpbnQ4QXJyYXkgYmFzZWQgb24gdHdvIGRpZmZlcmVudCBBcnJheUJ1ZmZlcnNcbiAgICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyc30gdThBcnJheTEgVGhlIGZpcnN0IGJ1ZmZlci5cbiAgICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyc30gdThBcnJheTIgVGhlIHNlY29uZCBidWZmZXIuXG4gICAgICogQHJldHVybiB7QXJyYXlCdWZmZXJzfSBUaGUgbmV3IEFycmF5QnVmZmVyIGNyZWF0ZWQgb3V0IG9mIHRoZSB0d28uXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIHN0YXRpYyBVaW50OEFycmF5Q29uY2F0KHU4QXJyYXkxLCB1OEFycmF5Mikge1xuICAgICAgICBsZXQgdG1wID0gbmV3IFVpbnQ4QXJyYXkodThBcnJheTEuYnl0ZUxlbmd0aCArIHU4QXJyYXkyLmJ5dGVMZW5ndGgpO1xuICAgICAgICB0bXAuc2V0KG5ldyBVaW50OEFycmF5KHU4QXJyYXkxKSwgMCk7XG4gICAgICAgIHRtcC5zZXQobmV3IFVpbnQ4QXJyYXkodThBcnJheTIpLCB1OEFycmF5MS5ieXRlTGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIHRtcDtcbiAgICB9XG5cblxufVxuXG4vKipcbiAqIENyZWF0ZUNvbW1hbmRDaGVja1N1bUNSQzE255SoIENSQ+ODhuODvOODluODq1xuICogQGlnbm9yZVxuICogQHR5cGUge1VpbnQxNkFycmF5fVxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgX19jcmMxNnRhYmxlPW5ldyBVaW50MTZBcnJheShbXG4gICAgMCAsIDB4MTE4OSAsIDB4MjMxMiAsIDB4MzI5YiAsIDB4NDYyNCAsIDB4NTdhZCAsIDB4NjUzNiAsIDB4NzRiZiAsXG4gICAgMHg4YzQ4ICwgMHg5ZGMxICwgMHhhZjVhICwgMHhiZWQzICwgMHhjYTZjICwgMHhkYmU1ICwgMHhlOTdlICwgMHhmOGY3ICxcbiAgICAweDEwODEgLCAweDAxMDggLCAweDMzOTMgLCAweDIyMWEgLCAweDU2YTUgLCAweDQ3MmMgLCAweDc1YjcgLCAweDY0M2UgLFxuICAgIDB4OWNjOSAsIDB4OGQ0MCAsIDB4YmZkYiAsIDB4YWU1MiAsIDB4ZGFlZCAsIDB4Y2I2NCAsIDB4ZjlmZiAsIDB4ZTg3NiAsXG4gICAgMHgyMTAyICwgMHgzMDhiICwgMHgwMjEwICwgMHgxMzk5ICwgMHg2NzI2ICwgMHg3NmFmICwgMHg0NDM0ICwgMHg1NWJkICxcbiAgICAweGFkNGEgLCAweGJjYzMgLCAweDhlNTggLCAweDlmZDEgLCAweGViNmUgLCAweGZhZTcgLCAweGM4N2MgLCAweGQ5ZjUgLFxuICAgIDB4MzE4MyAsIDB4MjAwYSAsIDB4MTI5MSAsIDB4MDMxOCAsIDB4NzdhNyAsIDB4NjYyZSAsIDB4NTRiNSAsIDB4NDUzYyAsXG4gICAgMHhiZGNiICwgMHhhYzQyICwgMHg5ZWQ5ICwgMHg4ZjUwICwgMHhmYmVmICwgMHhlYTY2ICwgMHhkOGZkICwgMHhjOTc0ICxcblxuICAgIDB4NDIwNCAsIDB4NTM4ZCAsIDB4NjExNiAsIDB4NzA5ZiAsIDB4MDQyMCAsIDB4MTVhOSAsIDB4MjczMiAsIDB4MzZiYiAsXG4gICAgMHhjZTRjICwgMHhkZmM1ICwgMHhlZDVlICwgMHhmY2Q3ICwgMHg4ODY4ICwgMHg5OWUxICwgMHhhYjdhICwgMHhiYWYzICxcbiAgICAweDUyODUgLCAweDQzMGMgLCAweDcxOTcgLCAweDYwMWUgLCAweDE0YTEgLCAweDA1MjggLCAweDM3YjMgLCAweDI2M2EgLFxuICAgIDB4ZGVjZCAsIDB4Y2Y0NCAsIDB4ZmRkZiAsIDB4ZWM1NiAsIDB4OThlOSAsIDB4ODk2MCAsIDB4YmJmYiAsIDB4YWE3MiAsXG4gICAgMHg2MzA2ICwgMHg3MjhmICwgMHg0MDE0ICwgMHg1MTlkICwgMHgyNTIyICwgMHgzNGFiICwgMHgwNjMwICwgMHgxN2I5ICxcbiAgICAweGVmNGUgLCAweGZlYzcgLCAweGNjNWMgLCAweGRkZDUgLCAweGE5NmEgLCAweGI4ZTMgLCAweDhhNzggLCAweDliZjEgLFxuICAgIDB4NzM4NyAsIDB4NjIwZSAsIDB4NTA5NSAsIDB4NDExYyAsIDB4MzVhMyAsIDB4MjQyYSAsIDB4MTZiMSAsIDB4MDczOCAsXG4gICAgMHhmZmNmICwgMHhlZTQ2ICwgMHhkY2RkICwgMHhjZDU0ICwgMHhiOWViICwgMHhhODYyICwgMHg5YWY5ICwgMHg4YjcwICxcblxuICAgIDB4ODQwOCAsIDB4OTU4MSAsIDB4YTcxYSAsIDB4YjY5MyAsIDB4YzIyYyAsIDB4ZDNhNSAsIDB4ZTEzZSAsIDB4ZjBiNyAsXG4gICAgMHgwODQwICwgMHgxOWM5ICwgMHgyYjUyICwgMHgzYWRiICwgMHg0ZTY0ICwgMHg1ZmVkICwgMHg2ZDc2ICwgMHg3Y2ZmICxcbiAgICAweDk0ODkgLCAweDg1MDAgLCAweGI3OWIgLCAweGE2MTIgLCAweGQyYWQgLCAweGMzMjQgLCAweGYxYmYgLCAweGUwMzYgLFxuICAgIDB4MThjMSAsIDB4MDk0OCAsIDB4M2JkMyAsIDB4MmE1YSAsIDB4NWVlNSAsIDB4NGY2YyAsIDB4N2RmNyAsIDB4NmM3ZSAsXG4gICAgMHhhNTBhICwgMHhiNDgzICwgMHg4NjE4ICwgMHg5NzkxICwgMHhlMzJlICwgMHhmMmE3ICwgMHhjMDNjICwgMHhkMWI1ICxcbiAgICAweDI5NDIgLCAweDM4Y2IgLCAweDBhNTAgLCAweDFiZDkgLCAweDZmNjYgLCAweDdlZWYgLCAweDRjNzQgLCAweDVkZmQgLFxuICAgIDB4YjU4YiAsIDB4YTQwMiAsIDB4OTY5OSAsIDB4ODcxMCAsIDB4ZjNhZiAsIDB4ZTIyNiAsIDB4ZDBiZCAsIDB4YzEzNCAsXG4gICAgMHgzOWMzICwgMHgyODRhICwgMHgxYWQxICwgMHgwYjU4ICwgMHg3ZmU3ICwgMHg2ZTZlICwgMHg1Y2Y1ICwgMHg0ZDdjICxcblxuICAgIDB4YzYwYyAsIDB4ZDc4NSAsIDB4ZTUxZSAsIDB4ZjQ5NyAsIDB4ODAyOCAsIDB4OTFhMSAsIDB4YTMzYSAsIDB4YjJiMyAsXG4gICAgMHg0YTQ0ICwgMHg1YmNkICwgMHg2OTU2ICwgMHg3OGRmICwgMHgwYzYwICwgMHgxZGU5ICwgMHgyZjcyICwgMHgzZWZiICxcbiAgICAweGQ2OGQgLCAweGM3MDQgLCAweGY1OWYgLCAweGU0MTYgLCAweDkwYTkgLCAweDgxMjAgLCAweGIzYmIgLCAweGEyMzIgLFxuICAgIDB4NWFjNSAsIDB4NGI0YyAsIDB4NzlkNyAsIDB4Njg1ZSAsIDB4MWNlMSAsIDB4MGQ2OCAsIDB4M2ZmMyAsIDB4MmU3YSAsXG4gICAgMHhlNzBlICwgMHhmNjg3ICwgMHhjNDFjICwgMHhkNTk1ICwgMHhhMTJhICwgMHhiMGEzICwgMHg4MjM4ICwgMHg5M2IxICxcbiAgICAweDZiNDYgLCAweDdhY2YgLCAweDQ4NTQgLCAweDU5ZGQgLCAweDJkNjIgLCAweDNjZWIgLCAweDBlNzAgLCAweDFmZjkgLFxuICAgIDB4Zjc4ZiAsIDB4ZTYwNiAsIDB4ZDQ5ZCAsIDB4YzUxNCAsIDB4YjFhYiAsIDB4YTAyMiAsIDB4OTJiOSAsIDB4ODMzMCAsXG4gICAgMHg3YmM3ICwgMHg2YTRlICwgMHg1OGQ1ICwgMHg0OTVjICwgMHgzZGUzICwgMHgyYzZhICwgMHgxZWYxICwgMHgwZjc4XG5dKTtcblxubW9kdWxlLmV4cG9ydHMgPSBLTVV0bDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9LTVV0bC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKipcbiAqIEtNQ29tV2ViQkxFLmpzXG4gKiB2ZXJzaW9uIDAuMS4wIGFscGhhXG4gKiBDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4ndXNlIHN0cmljdCc7XG5jb25zdCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcbmNvbnN0IEtNQ29tQmFzZSA9IHJlcXVpcmUoJy4vS01Db21CYXNlJyk7XG5jb25zdCBLTVN0cnVjdHVyZXM9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMnKTtcblxuLyoqXG4gKiBAY2xhc3NkZXNjIOODluODqeOCpuOCtueUqFdlYkJsdWV0b29o6YCa5L+h44Kv44Op44K5KGNocm9tZeS+neWtmClcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01Db21XZWJCTEUgZXh0ZW5kcyBLTUNvbUJhc2V7XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5a6a5pWwXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLnR5cGU9XCJXRUJCTEVcIjtcbiAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzPXt9O1xuICAgICAgICB0aGlzLl9ibGVTZW5kaW5nUXVlPVByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgdGhpcy5fcXVlQ291bnQ9MDtcbiAgICAgICAgXG4gICAgICAgIC8v44K144O844OT44K5VVVJRFxuICAgICAgICB0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEPSdmMTQwZWEzNS04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnO1xuXG4gICAgICAgIC8v44Kt44Oj44Op44Kv44K/44Oq44K544OG44Kj44Kv44K5VVVJRFxuICAgICAgICB0aGlzLl9NT1RPUl9CTEVfQ1JTPXtcbiAgICAgICAgICAgICdNT1RPUl9UWCc6J2YxNDAwMDAxLTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4YycsLy/ml6cgTU9UT1JfQ09OVFJPTFxuICAgICAgICAgICAgLy8nTU9UT1JfTEVEJzonZjE0MDAwMDMtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJywvL+ODouODvOOCv+ODvOOBrkxFROOCkuWPluOCiuaJseOBhiBpbmZvOjogTU9UT1JfQ09OVFJPTDo6YmxlTGVk44Gn5Luj55SoXG4gICAgICAgICAgICAnTU9UT1JfTUVBU1VSRU1FTlQnOidmMTQwMDAwNC04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLFxuICAgICAgICAgICAgJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCc6J2YxNDAwMDA1LTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4YycsXG4gICAgICAgICAgICAnTU9UT1JfUlgnOidmMTQwMDAwNi04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLC8v5penIE1PVE9SX1NFVFRJTkdcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFM9e1xuICAgICAgICAgICAgXCJTZXJ2aWNlXCI6MHgxODBhXG4gICAgICAgICAgICAsXCJNYW51ZmFjdHVyZXJOYW1lU3RyaW5nXCI6MHgyYTI5XG4gICAgICAgICAgICAsXCJIYXJkd2FyZVJldmlzaW9uU3RyaW5nXCI6MHgyYTI3XG4gICAgICAgICAgICAsXCJGaXJtd2FyZVJldmlzaW9uU3RyaW5nXCI6MHgyYTI2XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJMReWIh+aWreaZglxuICAgICAgICAgKiBAcGFyYW0gZXZlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgIHRoaXMuX29uQmxlQ29ubmVjdGlvbkxvc3Q9KGV2ZSk9PntcbiAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q9ZmFsc2U7XG4gICAgICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW51bGw7XG4gICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaXNDb25uZWN0KGZhbHNlKTtcbiAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44Oi44O844K/44O85Zue6Lui5oOF5aCx5Y+X5L+hXG4gICAgICAgICAqIEBwYXJhbSBldmVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTm90aWZ5IFZhbHVlXG4gICAgICAgICAqICBieXRlWzBdLWJ5dGVbM11cdCAgICBieXRlWzRdLWJ5dGVbN11cdCAgICAgICAgYnl0ZVs4XS1ieXRlWzExXVxuICAgICAgICAgKiAgZmxvYXQgKiBcdFx0ICAgICAgICBmbG9hdCAqICAgICAgICAgICAgICAgICBmbG9hdCAqXG4gICAgICAgICAqICBwb3NpdGlvbjpyYWRpYW5zXHQgICAgc3BlZWQ6cmFkaWFucy9zZWNvbmRcdHRvcnF1ZTpO44O7bVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25CbGVNb3Rvck1lYXN1cmVtZW50PShldmUpPT57XG4gICAgICAgICAgICBpZighZXZlfHwhZXZlLnRhcmdldCl7cmV0dXJuO31cbiAgICAgICAgICAgIGxldCBkdiA9IGV2ZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICBpZighKGR2IGluc3RhbmNlb2YgRGF0YVZpZXcpKXtyZXR1cm47fS8vaW5mbzo6d2ViIGJsdWV0b29o44Gu44G/IG5vZGUuanPjga9pbnN0YW5jZW9mIEJ1ZmZlclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uPWR2LmdldEZsb2F0MzIoMCxmYWxzZSk7XG4gICAgICAgICAgICBsZXQgdmVsb2NpdHk9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgIGxldCB0b3JxdWU9ZHYuZ2V0RmxvYXQzMig4LGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JNZWFzdXJlbWVudENCKG5ldyBLTVN0cnVjdHVyZXMuS01Sb3RTdGF0ZShwb3NpdGlvbix2ZWxvY2l0eSx0b3JxdWUpKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIOODouODvOOCv+ODvElNVeaDheWgseWPl+S/oVxuICAgICAgICAgKiBAcGFyYW0gZXZlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEAjXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIE5vdGlmeSBWYWx1ZVxuICAgICAgICAgKiBhY2NlbF94LCBhY2NlbF95LCBhY2NlbF96LCB0ZW1wLCBneXJvX3gsIGd5cm9feSwgZ3lyb196IOOBjOWFqOOBpui/lOOBo+OBpuOBj+OCi+OAguWPluW+l+mWk+malOOBrzEwMG1zIOWbuuWumlxuICAgICAgICAgKiBieXRlKEJpZ0VuZGlhbikgIFswXVsxXSBbMl1bM10gIFs0XVs1XSAgIFs2XVs3XVx0ICAgIFs4XVs5XVx0WzEwXVsxMV0gICAgWzEyXVsxM11cbiAgICAgICAgICogICAgICAgICAgICAgICAgICBpbnQxNl90IGludDE2X3QgaW50MTZfdCBpbnQxNl90ICAgICBpbnQxNl90IGludDE2X3QgaW50MTZfdFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgIGFjY2VsLXggYWNjZWwteSBhY2NlbC16IHRlbXBcdCAgICBneXJvLXhcdGd5cm8teVx0Z3lyby16XG4gICAgICAgICAqXG4gICAgICAgICAqIGludDE2X3Q6LTMyLDc2OOOAnDMyLDc2OFxuICAgICAgICAgKiDmnLrjga7kuIrjgavjg6Ljg7zjgr/jg7zjgpLnva7jgYTjgZ/loLTlkIjjgIHliqDpgJ/luqbjgIB6ID0gMTYwMDAg56iL5bqm44Go44Gq44KL44CC77yI6YeN5Yqb5pa55ZCR44Gu44Gf44KB77yJXG4gICAgICAgICAqXG4gICAgICAgICAqIOWNmOS9jeWkieaPm++8iS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjgIDliqDpgJ/luqYgdmFsdWUgW0ddID0gcmF3X3ZhbHVlICogMiAvIDMyLDc2N1xuICAgICAgICAgKiDjgIDmuKnluqYgdmFsdWUgW+KEg10gPSByYXdfdmFsdWUgLyAzMzMuODcgKyAyMS4wMFxuICAgICAgICAgKiDjgIDop5LpgJ/luqZcbiAgICAgICAgICog44CA44CAdmFsdWUgW2RlZ3JlZS9zZWNvbmRdID0gcmF3X3ZhbHVlICogMjUwIC8gMzIsNzY3XG4gICAgICAgICAqIOOAgOOAgHZhbHVlIFtyYWRpYW5zL3NlY29uZF0gPSByYXdfdmFsdWUgKiAwLjAwMDEzMzE2MjExXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vbkJsZUltdU1lYXN1cmVtZW50PShldmUpPT57XG4gICAgICAgICAgICBpZighZXZlfHwhZXZlLnRhcmdldCl7cmV0dXJuO31cbiAgICAgICAgICAgIGxldCBkdiA9IGV2ZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICBsZXQgdGVtcENhbGlicmF0aW9uPS01Ljc7Ly/muKnluqbmoKHmraPlgKRcbiAgICAgICAgICAgIGlmKCEoZHYgaW5zdGFuY2VvZiBEYXRhVmlldykpe3JldHVybjt9Ly9pbmZvOjp3ZWIgYmx1ZXRvb2jjga7jgb8gbm9kZS5qc+OBr2luc3RhbmNlb2YgQnVmZmVyXG4gICAgICAgICAgICAvL+WNmOS9jeOCkuaJseOBhOaYk+OBhOOCiOOBhuOBq+WkieaPm1xuICAgICAgICAgICAgbGV0IGFjY2VsWD1kdi5nZXRJbnQxNigwLGZhbHNlKSoyLzMyNzY3O1xuICAgICAgICAgICAgbGV0IGFjY2VsWT1kdi5nZXRJbnQxNigyLGZhbHNlKSoyLzMyNzY3O1xuICAgICAgICAgICAgbGV0IGFjY2VsWj1kdi5nZXRJbnQxNig0LGZhbHNlKSoyLzMyNzY3O1xuICAgICAgICAgICAgbGV0IHRlbXA9KGR2LmdldEludDE2KDYsZmFsc2UpKSAvIDMzMy44NyArIDIxLjAwK3RlbXBDYWxpYnJhdGlvbjtcbiAgICAgICAgICAgIGxldCBneXJvWD1kdi5nZXRJbnQxNig4LGZhbHNlKSoyNTAvMzI3Njc7XG4gICAgICAgICAgICBsZXQgZ3lyb1k9ZHYuZ2V0SW50MTYoMTAsZmFsc2UpKjI1MC8zMjc2NztcbiAgICAgICAgICAgIGxldCBneXJvWj1kdi5nZXRJbnQxNigxMixmYWxzZSkqMjUwLzMyNzY3O1xuXG4gICAgICAgICAgICB0aGlzLl9vbkltdU1lYXN1cmVtZW50Q0IobmV3IEtNU3RydWN0dXJlcy5LTUltdVN0YXRlKGFjY2VsWCxhY2NlbFksYWNjZWxaLHRlbXAsZ3lyb1gsZ3lyb1ksZ3lyb1opKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zjg63jgrDmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIHtCdWZmZXJ9IGRhdGFcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTm90aWZ5IHZhbHVlXG4gICAgICAgICAqIGJ5dGVbMF1cdGJ5dGVbMS0yXVx0Ynl0ZVszXVx0Ynl0ZVs0LTddXHRieXRlWzgtMTFdXHRieXRlWzEyLTEzXVxuICAgICAgICAgKiB1aW50OF90OnR4X3R5cGVcdHVpbnQxNl90OmlkXHR1aW50OF90OmNvbW1hbmRcdHVpbnQzMl90OmVycm9yQ29kZVx0dWludDMyX3Q6aW5mb1x0dWludDE2X3Q6Q1JDXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vbkJsZU1vdG9yTG9nPShldmUpPT57XG4gICAgICAgICAgICBpZighZXZlfHwhZXZlLnRhcmdldCl7cmV0dXJuO31cbiAgICAgICAgICAgIGxldCBkdiA9IGV2ZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICBpZighKGR2IGluc3RhbmNlb2YgRGF0YVZpZXcpKXtyZXR1cm47fS8vaW5mbzo6d2ViIGJsdWV0b29o44Gu44G/IG5vZGUuanPjga9pbnN0YW5jZW9mIEJ1ZmZlclxuICAgICAgICAgICAgbGV0IHR4VHlwZT1kdi5nZXRVaW50OCgwKTsvL+OCqOODqeODvOODreOCsOOCv+OCpOODlzoweEJF5Zu65a6aXG4gICAgICAgICAgICBpZih0eFR5cGUhPT0weEJFKXtyZXR1cm47fVxuXG4gICAgICAgICAgICBsZXQgaWQ9ZHYuZ2V0VWludDE2KDEsZmFsc2UpOy8v6YCB5L+hSURcbiAgICAgICAgICAgIGxldCBjbWRJRD1kdi5nZXRVaW50OCgzLGZhbHNlKTtcbiAgICAgICAgICAgIGxldCBlcnJDb2RlPWR2LmdldFVpbnQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgIGxldCBpbmZvPWR2LmdldFVpbnQzMig4LGZhbHNlKTtcbiAgICAgICAgICAgIC8v44Ot44Kw5Y+W5b6XXG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yTG9nQ0IobmV3IEtNU3RydWN0dXJlcy5LTU1vdG9yTG9nKGlkLG51bGwsY21kSUQsdGhpcy5fTU9UT1JfTE9HX0VSUk9SQ09ERVtlcnJDb2RlXS5pZCx0aGlzLl9NT1RPUl9MT0dfRVJST1JDT0RFW2VyckNvZGVdLnR5cGUsdGhpcy5fTU9UT1JfTE9HX0VSUk9SQ09ERVtlcnJDb2RlXS5tc2csaW5mbykpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44Oi44O844K/44O86Kit5a6a5oOF5aCx5Y+W5b6XXG4gICAgICAgICAqIEBwYXJhbSBldmVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTm90aWZ5IHZhbHVlXG4gICAgICAgICAqIGJ5dGVbMF1cdGJ5dGVbMV1cdGJ5dGVbMl1cdGJ5dGVbM10gYnl0ZVs0XeS7pemZjVx0Ynl0ZVtuLTJdXHRieXRlW24tMV1cbiAgICAgICAgICogdWludDhfdDp0eF90eXBlXHR1aW50MTZfdDppZFx0dWludDhfdDpyZWdpc3Rlclx0dWludDhfdDp2YWx1ZVx0dWludDE2X3Q6Q1JDXG4gICAgICAgICAqIDB4NDBcdHVpbnQxNl90ICgyYnl0ZSkgMO+9njY1NTM1XHTjg6zjgrjjgrnjgr/jgrPjg57jg7Pjg4lcdOODrOOCuOOCueOCv+OBruWApO+8iOOCs+ODnuODs+ODieOBq+OCiOOBo+OBpuWkieOCj+OCi++8iVx0dWludDE2X3QgKDJieXRlKSAw772eNjU1MzVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29uQmxlTW90b3JTZXR0aW5nPShldmUpPT57XG4gICAgICAgICAgICBpZighZXZlfHwhZXZlLnRhcmdldCl7cmV0dXJuO31cbiAgICAgICAgICAgIGxldCBkdiA9IGV2ZS50YXJnZXQudmFsdWU7Ly81K27jg5DjgqTjg4jjgIBcbiAgICAgICAgICAgIGxldCB1aW50OEFycmF5PW5ldyBVaW50OEFycmF5KGR2LmJ1ZmZlcik7Ly9pbmZvOjrkuIDml6bjgrPjg5Tjg7zjgZnjgovlv4XopoHjgYzjgYLjgotcbiAgICAgICAgICAgIGlmKCEoZHYgaW5zdGFuY2VvZiBEYXRhVmlldykpe3JldHVybjt9Ly9pbmZvOjp3ZWIgYmx1ZXRvb2jjga7jgb8gbm9kZS5qc+OBr2luc3RhbmNlb2YgQnVmZmVyXG5cbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLy/jg4fjg7zjgr/jga5wYXJzZVxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBsZXQgdHhMZW49ZHYuYnl0ZUxlbmd0aDtcbiAgICAgICAgICAgIGxldCB0eFR5cGU9ZHYuZ2V0VWludDgoMCk7Ly/jg6zjgrjjgrnjgr/mg4XloLHpgJrnn6XjgrPjg57jg7Pjg4lJRCAweDQw5Zu65a6aXG4gICAgICAgICAgICBpZih0eFR5cGUhPT0weDQwfHx0eExlbjw1KXtyZXR1cm47fS8v44Os44K444K544K/5oOF5aCx44KS5ZCr44G+44Gq44GE44OH44O844K/44Gu56C05qOEXG5cbiAgICAgICAgICAgIGxldCBpZD1kdi5nZXRVaW50MTYoMSxmYWxzZSk7Ly/pgIHkv6FJRFxuICAgICAgICAgICAgbGV0IHJlZ2lzdGVyQ21kPWR2LmdldFVpbnQ4KDMpOy8v44Os44K444K544K/44Kz44Oe44Oz44OJXG4gICAgICAgICAgICBsZXQgY3JjPWR2LmdldFVpbnQxNih0eExlbi0yLGZhbHNlKTsvL0NSQ+OBruWApCDmnIDlvozjgYvjgokyZHl0ZVxuXG4gICAgICAgICAgICBsZXQgcmVzPXt9O1xuICAgICAgICAgICAgLy/jgrPjg57jg7Pjg4nliKXjgavjgojjgovjg6zjgrjjgrnjgr/jga7lgKTjga7lj5blvpdbNC1uIGJ5dGVdXG4gICAgICAgICAgICBsZXQgc3RhcnRPZmZzZXQ9NDtcblxuICAgICAgICAgICAgc3dpdGNoKHJlZ2lzdGVyQ21kKXtcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1heFNwZWVkOlxuICAgICAgICAgICAgICAgICAgICByZXMubWF4U3BlZWQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubWluU3BlZWQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5taW5TcGVlZD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5jdXJ2ZVR5cGU6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5jdXJ2ZVR5cGU9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmFjYzpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmFjYz1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5kZWM6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5kZWM9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubWF4VG9ycXVlOlxuICAgICAgICAgICAgICAgICAgICByZXMubWF4VG9ycXVlPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnRlYWNoaW5nSW50ZXJ2YWw6XG4gICAgICAgICAgICAgICAgICAgIHJlcy50ZWFjaGluZ0ludGVydmFsPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0LGZhbHNlKTsvL3RvZG86OuODkOOCpOODiOS4jei2syBVaW50MzItPlVpbnQ4ICAyLjI0XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucGxheWJhY2tJbnRlcnZhbDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnBsYXliYWNrSW50ZXJ2YWw9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQsZmFsc2UpOy8vdG9kbzo644OQ44Kk44OI5LiN6LazIFVpbnQzMi0+VWludDggIDIuMjRcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5xQ3VycmVudFA6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5xQ3VycmVudFA9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucUN1cnJlbnRJOlxuICAgICAgICAgICAgICAgICAgICByZXMucUN1cnJlbnRJPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnFDdXJyZW50RDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnFDdXJyZW50RD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5zcGVlZFA6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zcGVlZFA9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuc3BlZWRJOlxuICAgICAgICAgICAgICAgICAgICByZXMuc3BlZWRJPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnNwZWVkRDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNwZWVkRD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5wb3NpdGlvblA6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wb3NpdGlvblA9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucG9zaXRpb25JOlxuICAgICAgICAgICAgICAgICAgICByZXMucG9zaXRpb25JPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnBvc2l0aW9uRDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnBvc2l0aW9uRD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5wb3NDb250cm9sVGhyZXNob2xkOlxuICAgICAgICAgICAgICAgICAgICByZXMucG9zQ29udHJvbFRocmVzaG9sZD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWw6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWw9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1vdG9yTWVhc3VyZW1lbnRCeURlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0PWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5pbnRlcmZhY2U6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5pbnRlcmZhY2U9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnJlc3BvbnNlOi8vdG9kbzo65YCk44GM5Y+W5b6X5Ye65p2l44Gq44GEIDIuMjRcbiAgICAgICAgICAgICAgICAgICAgcmVzLnJlc3BvbnNlPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5vd25Db2xvcjpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm93bkNvbG9yPSgnIzAwMDAwMCcgK051bWJlcihkdi5nZXRVaW50OChzdGFydE9mZnNldCk8PDE2fGR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KzEpPDw4fGR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KzIpKS50b1N0cmluZygxNikpLnN1YnN0cigtNik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuaU1VTWVhc3VyZW1lbnRJbnRlcnZhbDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmlNVU1lYXN1cmVtZW50SW50ZXJ2YWw9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmlNVU1lYXN1cmVtZW50QnlEZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXMuaU1VTWVhc3VyZW1lbnRCeURlZmF1bHQ9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmRldmljZU5hbWU6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5kZXZpY2VOYW1lPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXCJcIiwgdWludDhBcnJheS5zbGljZShzdGFydE9mZnNldCwtMikpOy8v5Y+v5aSJ44OQ44Kk44OI5paH5a2XXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuZGV2aWNlSW5mbzpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmRldmljZUluZm89U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcIlwiLCB1aW50OEFycmF5LnNsaWNlKHN0YXJ0T2Zmc2V0LC0yKSk7Ly/lj6/lpInjg5DjgqTjg4jmloflrZdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5zcGVlZDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNwZWVkPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnBvc2l0aW9uT2Zmc2V0OlxuICAgICAgICAgICAgICAgICAgICByZXMucG9zaXRpb25PZmZzZXQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubW92ZVRvOlxuICAgICAgICAgICAgICAgICAgICByZXMubW92ZVRvPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmhvbGQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5ob2xkPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnN0YXR1czpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cz1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQudGFza3NldE5hbWU6XG4gICAgICAgICAgICAgICAgICAgIHJlcy50YXNrc2V0TmFtZT1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFwiXCIsIHVpbnQ4QXJyYXkuc2xpY2Uoc3RhcnRPZmZzZXQsLTIpKTsvL+WPr+WkieODkOOCpOODiOaWh+Wtl1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnRhc2tzZXRJbmZvOlxuICAgICAgICAgICAgICAgICAgICByZXMudGFza3NldEluZm89ZHYuZ2V0VWludDE2KHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC50YXNrc2V0VXNhZ2U6XG4gICAgICAgICAgICAgICAgICAgIHJlcy50YXNrc2V0VXNhZ2U9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1vdGlvbk5hbWU6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tb3Rpb25OYW1lPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXCJcIiwgdWludDhBcnJheS5zbGljZShzdGFydE9mZnNldCwtMikpOy8v5Y+v5aSJ44OQ44Kk44OI5paH5a2XXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubW90aW9uSW5mbzpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1vdGlvbkluZm89ZHYuZ2V0VWludDE2KHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tb3Rpb25Vc2FnZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1vdGlvblVzYWdlPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5pMkNTbGF2ZUFkZHJlc3M6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5pMkNTbGF2ZUFkZHJlc3M9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnVhcnRCYXVkUmF0ZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnVhcnRCYXVkUmF0ZT1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubGVkOlxuICAgICAgICAgICAgICAgICAgICByZXMubGVkPXtzdGF0ZTpkdi5nZXRVaW50OChzdGFydE9mZnNldCkscjpkdi5nZXRVaW50OChzdGFydE9mZnNldCsxKSxnOmR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KzIpLGI6ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQrMyl9O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmVuYWJsZUNoZWNrU3VtOlxuICAgICAgICAgICAgICAgICAgICByZXMuZW5hYmxlQ2hlY2tTdW09ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmRldmljZVNlcmlhbDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmRldmljZVNlcmlhbD1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFwiXCIsIHVpbnQ4QXJyYXkuc2xpY2Uoc3RhcnRPZmZzZXQsLTIpKTsvL+WPr+WkieODkOOCpOODiOaWh+Wtl1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzKTtcblxuICAgICAgICAgICAgdGhpcy5fb25Nb3RvclNldHRpbmdDQihyZWdpc3RlckNtZCxyZXMpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIHNlY3Rpb246OuWFrOmWi+ODoeOCveODg+ODiVxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiBXZWJCbHVldG9vaOOBp+OBruaOpee2muOCkumWi+Wni+OBmeOCi1xuICAgICAqL1xuICAgIGNvbm5lY3QoKXtcbiAgICAgICAgaWYgKHRoaXMuX3BlcmlwaGVyYWwmJiB0aGlzLl9wZXJpcGhlcmFsLmdhdHQmJnRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5jb25uZWN0ZWQgKSB7cmV0dXJufVxuICAgICAgICBsZXQgZ2F0PSAodGhpcy5fcGVyaXBoZXJhbCYmIHRoaXMuX3BlcmlwaGVyYWwuZ2F0dCApP3RoaXMuX3BlcmlwaGVyYWwuZ2F0dCA6dW5kZWZpbmVkOy8v5YaN5o6l57aa55SoXG4gICAgICAgIHRoaXMuX2JsZUNvbm5lY3QoZ2F0KS50aGVuKG9iaj0+ey8vaW5mbzo6IHJlc29sdmUoe2RldmljZUlELGRldmljZU5hbWUsYmxlRGV2aWNlLGNoYXJhY3RlcmlzdGljc30pO1xuICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbD1vYmouYmxlRGV2aWNlO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pZD10aGlzLl9wZXJpcGhlcmFsLmlkO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5uYW1lPXRoaXMuX3BlcmlwaGVyYWwubmFtZTtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uaXNDb25uZWN0PXRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5jb25uZWN0ZWQ7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLm1hbnVmYWN0dXJlck5hbWU9b2JqLmluZm9tYXRpb24ubWFudWZhY3R1cmVyTmFtZTtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uaGFyZHdhcmVSZXZpc2lvbj1vYmouaW5mb21hdGlvbi5oYXJkd2FyZVJldmlzaW9uO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5maXJtd2FyZVJldmlzaW9uPW9iai5pbmZvbWF0aW9uLmZpcm13YXJlUmV2aXNpb247XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzPW9iai5jaGFyYWN0ZXJpc3RpY3M7XG5cbiAgICAgICAgICAgIGlmKCFnYXQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZ2F0dHNlcnZlcmRpc2Nvbm5lY3RlZCcsdGhpcy5fb25CbGVDb25uZWN0aW9uTG9zdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbC5hZGRFdmVudExpc3RlbmVyKCdnYXR0c2VydmVyZGlzY29ubmVjdGVkJywgdGhpcy5fb25CbGVDb25uZWN0aW9uTG9zdCk7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX01FQVNVUkVNRU5UJ10pe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX01FQVNVUkVNRU5UJ10ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JNZWFzdXJlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfTUVBU1VSRU1FTlQnXS5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3Rvck1lYXN1cmVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9NRUFTVVJFTUVOVCddLnN0YXJ0Tm90aWZpY2F0aW9ucygpLnRoZW4ob2JqPT57XG4gICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfSU1VX01FQVNVUkVNRU5UJ10pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9JTVVfTUVBU1VSRU1FTlQnXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVJbXVNZWFzdXJlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCddLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZUltdU1lYXN1cmVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCddLnN0YXJ0Tm90aWZpY2F0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgfSkudGhlbihvYmo9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9SWCddLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yU2V0dGluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9SWCddLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yTG9nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXS5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3RvclNldHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXS5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3RvckxvZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9SWCddLnN0YXJ0Tm90aWZpY2F0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIH0pLnRoZW4ob2JqPT57XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaW5pdCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZV9pc0Nvbm5lY3QodHJ1ZSk7Ly/liJ3lm57jga7jgb8oY29tcOS7peWJjeOBr+eZuueBq+OBl+OBquOBhOeCuilcbiAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaXNDb25uZWN0KHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChlcnI9PntcbiAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9bnVsbDtcbiAgICAgICAgICAgIHRoaXMuX29uQ29ubmVjdEZhaWx1cmVIYW5kbGVyKHRoaXMsZXJyKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXZWJCbHVldG9vaOOBruWIh+aWrVxuICAgICAqL1xuICAgIGRpc0Nvbm5lY3QoKXtcbiAgICAgICBpZiAoIXRoaXMuX3BlcmlwaGVyYWwgfHwgIXRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5jb25uZWN0ZWQpe3JldHVybjt9XG4gICAgICAgIHRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5kaXNjb25uZWN0KCk7XG4gICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9bnVsbDtcblxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWGhemDqFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIEJMReaOpee2mlxuICAgICAqIEBwYXJhbSBnYXR0X29iaiDjg5rjgqLjg6rjg7PjgrDmuIjjgb/jga5HQVRU44Gu44OH44OQ44Kk44K544Gr5YaN5o6l57aa55SoKOODmuOCouODquODs+OCsOODouODvOODgOODq+OBr+WHuuOBquOBhClcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9ibGVDb25uZWN0KGdhdHRfb2JqKSB7XG4gICAgICAvL2xldCBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAvLyBsZXQgYmxlRGV2aWNlO1xuICAgICAgICAgIC8vIGxldCBkZXZpY2VOYW1lO1xuICAgICAgICAgIC8vIGxldCBkZXZpY2VJRDtcbiAgICAgICAgICBpZighZ2F0dF9vYmope1xuICAgICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgIGZpbHRlcnM6IFt7c2VydmljZXM6IFt0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEXX1dLFxuICAgICAgICAgICAgICAgICAgb3B0aW9uYWxTZXJ2aWNlczpbdGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuU2VydmljZV1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgbmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAudGhlbihkZXZpY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JsZUdhdGNvbm5lY3QoZGV2aWNlLmdhdHQpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGVEZXZpY2U6IGRldmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZUlEOiBkZXZpY2UuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VOYW1lOiBkZXZpY2UubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljczpyZXMuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvbjpyZXMuaW5mb21hdGlvblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICB0aGlzLl9ibGVHYXRjb25uZWN0KGdhdHRfb2JqKVxuICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9ibGVHYXRjb25uZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VJRDogZ2F0dF9vYmouZGV2aWNlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VOYW1lOiBnYXR0X29iai5kZXZpY2UubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmxlRGV2aWNlOiBnYXR0X29iai5kZXZpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljczpyZXMuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uOnJlcy5pbmZvbWF0aW9uXG5cbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9HQVRU5o6l57aa55SoXG4gICAgX2JsZUdhdGNvbm5lY3QoZ2F0dF9vYmope1xuICAgICAgICAgICAgbGV0IGNoYXJhY3RlcmlzdGljcyA9IHt9O1xuICAgICAgICAgICAgbGV0IGluZm9tYXRpb249e307XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGdyZXNvbHZlLCBncmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICBnYXR0X29iai5jb25uZWN0KCkudGhlbihzZXJ2ZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlcyh0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEKS50aGVuKHNlcnZpY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjcnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9NT1RPUl9CTEVfQ1JTKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuX01PVE9SX0JMRV9DUlNba2V5XSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjaGFyYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljc1trZXldID0gY2hhcmE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoY3JzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2JsZV9maXJtd2FyZV9yZXZpc2lvbuOBruOCteODvOODk+OCueWPluW+lyBpbmZvOjpBbmRyb2lkZOOBp+OBr+S4jeWuieWumuOBqueCuuWBnOatolxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoc3Jlc29sdmUsIHNyZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuU2VydmljZSkudGhlbigoc2VydmljZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLk1hbnVmYWN0dXJlck5hbWVTdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjaGFyYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoYXJhLnJlYWRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbih2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvblsnbWFudWZhY3R1cmVyTmFtZSddID0gS01VdGwuVXRmOEFycmF5VG9TdHIobmV3IFVpbnQ4QXJyYXkodmFsLmJ1ZmZlcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntyZWplY3QoZSk7fSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5GaXJtd2FyZVJldmlzaW9uU3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGFyYS5yZWFkVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb25bJ2Zpcm13YXJlUmV2aXNpb24nXSA9IEtNVXRsLlV0ZjhBcnJheVRvU3RyKG5ldyBVaW50OEFycmF5KHZhbC5idWZmZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGUpPT57cmVqZWN0KGUpO30pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuSGFyZHdhcmVSZXZpc2lvblN0cmluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNoYXJhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hhcmEucmVhZFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uWydoYXJkd2FyZVJldmlzaW9uJ10gPSBLTVV0bC5VdGY4QXJyYXlUb1N0cihuZXcgVWludDhBcnJheSh2YWwuYnVmZmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlKT0+e3JlamVjdChlKTt9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3Jlc29sdmUoe2NoYXJhY3RlcmlzdGljczogY2hhcmFjdGVyaXN0aWNzLCBpbmZvbWF0aW9uOiBpbmZvbWF0aW9ufSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCTEXjgrPjg57jg7Pjg4njga7pgIHkv6FcbiAgICAgKiBAcGFyYW0gY29tbWFuZFR5cGVTdHIgICdNT1RPUl9DT05UUk9MJywnTU9UT1JfTUVBU1VSRU1FTlQnLCdNT1RPUl9JTVVfTUVBU1VSRU1FTlQnLCdNT1RPUl9SWCdcbiAgICAgKiDjgrPjg57jg7Pjg4nnqK7liKXjga5TdHJpbmcg5Li744GrQkxF44Gu44Kt44Oj44Op44Kv44K/44Oq44K544OG44Kj44Kv44K544Gn5L2/55So44GZ44KLXG4gICAgICogQHBhcmFtIGNvbW1hbmROdW1cbiAgICAgKiBAcGFyYW0gYXJyYXlidWZmZXJcbiAgICAgKiBAcGFyYW0gbm90aWZ5UHJvbWlzIGNtZFJlYWRSZWdpc3RlcuetieOBrkJMReWRvOOBs+WHuuOBl+W+jOOBq25vdGlmeeOBp+WPluW+l+OBmeOCi+WApOOCklByb21pc+OBp+W4sOOBmeW/heimgeOBruOBguOCi+OCs+ODnuODs+ODieeUqFxuICAgICAqIEBwYXJhbSBjaWQg44K344O844Kx44Oz44K5SURcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBjaWQg44K344O844Kx44Oz44K5SURcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZW5kTW90b3JDb21tYW5kKGNvbW1hbmRDYXRlZ29yeSwgY29tbWFuZE51bSwgYXJyYXlidWZmZXI9bmV3IEFycmF5QnVmZmVyKDApLCBub3RpZnlQcm9taXM9bnVsbCxjaWQ9bnVsbCl7XG4gICAgICAgIGxldCBjaGFyYWN0ZXJpc3RpY3M9dGhpcy5fY2hhcmFjdGVyaXN0aWNzW2NvbW1hbmRDYXRlZ29yeV07XG4gICAgICAgIGxldCBhYj1uZXcgRGF0YVZpZXcoYXJyYXlidWZmZXIpO1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGFycmF5YnVmZmVyLmJ5dGVMZW5ndGgrNSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsY29tbWFuZE51bSk7XG4gICAgICAgIGNpZD1jaWQ9PT1udWxsP3RoaXMuY3JlYXRlQ29tbWFuZElEOmNpZDsvL+OCt+ODvOOCseODs+OCuUlEKOODpuODi+ODvOOCr+WApClcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDEsY2lkKTtcbiAgICAgICAgLy/jg4fjg7zjgr/jga7mm7jjgY3ovrzjgb9cbiAgICAgICAgZm9yKGxldCBpPTA7aTxhcnJheWJ1ZmZlci5ieXRlTGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgzK2ksYWIuZ2V0VWludDgoaSkpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjcmM9S01VdGwuQ3JlYXRlQ29tbWFuZENoZWNrU3VtQ1JDMTYobmV3IFVpbnQ4QXJyYXkoYnVmZmVyLnNsaWNlKDAsYnVmZmVyLmJ5dGVMZW5ndGgtMikpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KGFycmF5YnVmZmVyLmJ5dGVMZW5ndGgrMyxjcmMpOy8vaW5mbzo6Q1JD6KiI566XXG5cbiAgICAgICAgLy9xdWXjgavov73liqBcbiAgICAgICAvLyArK3RoaXMuX3F1ZUNvdW50O1xuICAgICAgICB0aGlzLl9ibGVTZW5kaW5nUXVlPSB0aGlzLl9ibGVTZW5kaW5nUXVlLnRoZW4oKHJlcyk9PntcbiAgICAgICAgICAvLyAgY29uc29sZS5sb2coXCJfc2VuZE1vdG9yQ29tbWFuZCBxdWVDb3VudDpcIisoLS10aGlzLl9xdWVDb3VudCkpO1xuICAgICAgICAgICAgaWYobm90aWZ5UHJvbWlzKXtcbiAgICAgICAgICAgICAgICBub3RpZnlQcm9taXMuc3RhcnRSZWplY3RUaW1lT3V0Q291bnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjaGFyYWN0ZXJpc3RpY3Mud3JpdGVWYWx1ZShidWZmZXIpO1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgLy/lpLHmlZfmmYLjgIAvL2luZm86OuW+jOe2muOBruOCs+ODnuODs+ODieOBr+W8leOBjee2muOBjeWun+ihjOOBleOCjOOCi1xuICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhcIkVSUiBfc2VuZE1vdG9yQ29tbWFuZDpcIityZXMrXCIgcXVlQ291bnQ6XCIrKC0tdGhpcy5fcXVlQ291bnQpKTtcbiAgICAgICAgICAgIGlmKG5vdGlmeVByb21pcyl7XG4gICAgICAgICAgICAgICAgbm90aWZ5UHJvbWlzLmNhbGxSZWplY3QocmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBjaWQ7XG4gICAgfVxuXG5cbi8vLy8vL2NsYXNzLy9cbn1cblxubW9kdWxlLmV4cG9ydHMgPUtNQ29tV2ViQkxFO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNQ29tV2ViQkxFLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiJ3VzZSBzdHJpY3QnO1xuLyoqKlxuICpLTUNvbm5lY3RvckJyb3dzZXIuanNcbiAqIHZlcnNpb24gMC4xLjAgYWxwaGFcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbmdsb2JhbC5LTVV0bD1yZXF1aXJlKCcuL0tNVXRsLmpzJyk7XG5nbG9iYWwuS01WZWN0b3IyPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01WZWN0b3IyO1xuZ2xvYmFsLktNSW11U3RhdGU9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTUltdVN0YXRlO1xuZ2xvYmFsLktNTGVkU3RhdGU9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTUxlZFN0YXRlO1xuZ2xvYmFsLktNUm90U3RhdGU9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTVJvdFN0YXRlO1xuZ2xvYmFsLktNRGV2aWNlSW5mbz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNRGV2aWNlSW5mbztcbmdsb2JhbC5LTU1vdG9yTG9nPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01Nb3RvckxvZztcbmdsb2JhbC5LTU1vdG9yT25lV2ViQkxFPXJlcXVpcmUoJy4vS01Nb3Rvck9uZVdlYkJMRS5qcycpO1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNQ29ubmVjdG9yQnJvd3NlcldQSy5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKipcbiAqS01Nb3Rvck9uZVdlYkJMRS5qc1xuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5sZXQgS01Db21XZWJCTEUgPSByZXF1aXJlKCcuL0tNQ29tV2ViQkxFJyk7XG5sZXQgS01Nb3RvckNvbW1hbmRLTU9uZT1yZXF1aXJlKCcuL0tNTW90b3JDb21tYW5kS01PbmUuanMnKTtcblxuLyoqXG4gKiBAY2xhc3NkZXNjIEtNLTHjga5XZWJCbHVldG9vaOaOpee2mueUqCDku67mg7Pjg4fjg5DjgqTjgrlcbiAqL1xuY2xhc3MgS01Nb3Rvck9uZVdlYkJMRSBleHRlbmRzIEtNTW90b3JDb21tYW5kS01PbmV7XG4gICAgLyoqXG4gICAgICogS01Nb3Rvck9uZVdlYkJMRVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqIEBleHRlbmRzIEtNTW90b3JDb21tYW5kS01PbmVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcihLTU1vdG9yQ29tbWFuZEtNT25lLktNX0NPTk5FQ1RfVFlQRS5XRUJCTEUsbmV3IEtNQ29tV2ViQkxFKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBqOaOpee2muOBmeOCi1xuICAgICAqL1xuICAgIGNvbm5lY3QoKXtcbiAgICAgICAgdGhpcy5fS01Db20uY29ubmVjdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBqOWIh+aWrVxuICAgICAqL1xuICAgIGRpc0Nvbm5lY3QoKXtcbiAgICAgICAgdGhpcy5fS01Db20uZGlzQ29ubmVjdCgpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPUtNTW90b3JPbmVXZWJCTEU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvS01Nb3Rvck9uZVdlYkJMRS5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKipcbiAqIEtNQ29tQmFzZS5qc1xuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xubGV0IEtNVXRsID0gcmVxdWlyZSgnLi9LTVV0bCcpO1xubGV0IEtNU3RydWN0dXJlcz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcycpO1xuLyoqXG4gKiBAY2xhc3NkZXNjIOmAmuS/oeOCr+ODqeOCueOBruWfuuW6lVxuICogQGlnbm9yZVxuICovXG5jbGFzcyBLTUNvbUJhc2V7XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlrprmlbBcbiAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9y44CAXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5fY29tbWFuZENvdW50PTA7XG4gICAgICAgIHRoaXMuX2RldmljZUluZm89bmV3IEtNU3RydWN0dXJlcy5LTURldmljZUluZm8oKTtcblxuICAgICAgICB0aGlzLl9tb3Rvck1lYXN1cmVtZW50PW5ldyBLTVN0cnVjdHVyZXMuS01Sb3RTdGF0ZSgpO1xuICAgICAgICB0aGlzLl9tb3RvckxlZD1uZXcgS01TdHJ1Y3R1cmVzLktNTGVkU3RhdGUoKTtcbiAgICAgICAgdGhpcy5fbW90b3JJbXVNZWFzdXJlbWVudD1uZXcgS01TdHJ1Y3R1cmVzLktNSW11U3RhdGUoKTtcblxuICAgICAgICB0aGlzLl9vbkluaXRIYW5kbGVyPWZ1bmN0aW9uKGNvbm5lY3Rvcil7fTtcbiAgICAgICAgdGhpcy5fb25Db25uZWN0SGFuZGxlcj1mdW5jdGlvbihjb25uZWN0b3Ipe307XG4gICAgICAgIHRoaXMuX29uRGlzY29ubmVjdEhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yKXt9O1xuICAgICAgICB0aGlzLl9vbkNvbm5lY3RGYWlsdXJlSGFuZGxlcj1mdW5jdGlvbihjb25uZWN0b3IsIG1zZyl7fTtcblxuICAgICAgICB0aGlzLl9vbk1vdG9yTWVhc3VyZW1lbnRDQj1mdW5jdGlvbigpe307XG4gICAgICAgIHRoaXMuX29uSW11TWVhc3VyZW1lbnRDQj1mdW5jdGlvbigpe307XG4gICAgICAgIHRoaXMuX29uTW90b3JTZXR0aW5nQ0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9vbk1vdG9yTG9nQ0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9pc0luaXQ9ZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIF9vbkJsZU1vdG9yU2V0dGluZ+OBruOCs+ODnuODs+ODieOAgOODouODvOOCv+ODvOioreWumuaDheWgseOBrumAmuefpeWPl+S/oeaZguOBq+ODkeODvOOCueOBmeOCi+eUqFxuICAgICAgICAgKiBAdHlwZSB7e21heFNwZWVkOiBudW1iZXIsIG1pblNwZWVkOiBudW1iZXIsIGN1cnZlVHlwZTogbnVtYmVyLCBhY2M6IG51bWJlciwgZGVjOiBudW1iZXIsIG1heFRvcnF1ZTogbnVtYmVyLCBxQ3VycmVudFA6IG51bWJlciwgcUN1cnJlbnRJOiBudW1iZXIsIHFDdXJyZW50RDogbnVtYmVyLCBzcGVlZFA6IG51bWJlciwgc3BlZWRJOiBudW1iZXIsIHNwZWVkRDogbnVtYmVyLCBwb3NpdGlvblA6IG51bWJlciwgb3duQ29sb3I6IG51bWJlcn19XG4gICAgICAgICAqIEBpZ25vcmVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5EPXtcbiAgICAgICAgICAgICAgICBcIm1heFNwZWVkXCI6MHgwMixcbiAgICAgICAgICAgICAgICBcIm1pblNwZWVkXCI6MHgwMyxcbiAgICAgICAgICAgICAgICBcImN1cnZlVHlwZVwiOjB4MDUsXG4gICAgICAgICAgICAgICAgXCJhY2NcIjoweDA3LFxuICAgICAgICAgICAgICAgIFwiZGVjXCI6MHgwOCxcbiAgICAgICAgICAgICAgICBcIm1heFRvcnF1ZVwiOjB4MEUsXG4gICAgICAgICAgICAgICAgXCJ0ZWFjaGluZ0ludGVydmFsXCI6MHgxNixcbiAgICAgICAgICAgICAgICBcInBsYXliYWNrSW50ZXJ2YWxcIjoweDE3LFxuICAgICAgICAgICAgICAgIFwicUN1cnJlbnRQXCI6MHgxOCxcbiAgICAgICAgICAgICAgICBcInFDdXJyZW50SVwiOjB4MTksXG4gICAgICAgICAgICAgICAgXCJxQ3VycmVudERcIjoweDFBLFxuICAgICAgICAgICAgICAgIFwic3BlZWRQXCI6MHgxQixcbiAgICAgICAgICAgICAgICBcInNwZWVkSVwiOjB4MUMsXG4gICAgICAgICAgICAgICAgXCJzcGVlZERcIjoweDFELFxuICAgICAgICAgICAgICAgIFwicG9zaXRpb25QXCI6MHgxRSxcbiAgICAgICAgICAgICAgICBcInBvc2l0aW9uSVwiOjB4MUYsXG4gICAgICAgICAgICAgICAgXCJwb3NpdGlvbkRcIjoweDIwLFxuICAgICAgICAgICAgICAgIFwicG9zQ29udHJvbFRocmVzaG9sZFwiOjB4MjEsXG5cbiAgICAgICAgICAgICAgICBcIm5vdGlmeVBvc0Fycml2YWxcIjoweDJCLFxuICAgICAgICAgICAgICAgIFwibW90b3JNZWFzdXJlbWVudEludGVydmFsXCI6MHgyQyxcbiAgICAgICAgICAgICAgICBcIm1vdG9yTWVhc3VyZW1lbnRCeURlZmF1bHRcIjoweDJELFxuICAgICAgICAgICAgICAgIFwiaW50ZXJmYWNlXCI6MHgyRSxcbiAgICAgICAgICAgICAgICBcInJlc3BvbnNlXCI6MHgzMCxcbiAgICAgICAgICAgICAgICBcIm93bkNvbG9yXCI6MHgzQSxcbiAgICAgICAgICAgICAgICBcImlNVU1lYXN1cmVtZW50SW50ZXJ2YWxcIjoweDNDLFxuICAgICAgICAgICAgICAgIFwiaU1VTWVhc3VyZW1lbnRCeURlZmF1bHRcIjoweDNELFxuICAgICAgICAgICAgICAgIFwiZGV2aWNlTmFtZVwiOjB4NDYsXG4gICAgICAgICAgICAgICAgXCJkZXZpY2VJbmZvXCI6MHg0NyxcbiAgICAgICAgICAgICAgICBcInNwZWVkXCI6MHg1OCxcbiAgICAgICAgICAgICAgICBcInBvc2l0aW9uT2Zmc2V0XCI6MHg1QixcbiAgICAgICAgICAgICAgICBcIm1vdmVUb1wiOjB4NjYsXG4gICAgICAgICAgICAgICAgXCJob2xkXCI6MHg3MixcbiAgICAgICAgICAgICAgICBcInN0YXR1c1wiOjB4OUEsXG4gICAgICAgICAgICAgICAgXCJ0YXNrc2V0TmFtZVwiOjB4QTUsXG4gICAgICAgICAgICAgICAgXCJ0YXNrc2V0SW5mb1wiOjB4QTYsXG4gICAgICAgICAgICAgICAgXCJ0YXNrc2V0VXNhZ2VcIjoweEE3LFxuICAgICAgICAgICAgICAgIFwibW90aW9uTmFtZVwiOjB4QUYsXG4gICAgICAgICAgICAgICAgXCJtb3Rpb25JbmZvXCI6MHhCMCxcbiAgICAgICAgICAgICAgICBcIm1vdGlvblVzYWdlXCI6MHhCMSxcbiAgICAgICAgICAgICAgICBcImkyQ1NsYXZlQWRkcmVzc1wiOjB4QzAsXG4gICAgICAgICAgICAgICAgXCJ1YXJ0QmF1ZFJhdGVcIjoweEMzLFxuICAgICAgICAgICAgICAgIFwibGVkXCI6MHhFMCxcbiAgICAgICAgICAgICAgICBcImVuYWJsZUNoZWNrU3VtXCI6MHhGMyxcbiAgICAgICAgICAgICAgICBcImRldmljZVNlcmlhbFwiOjB4RkFcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvOODreOCsOeUqOOCqOODqeODvOOCs+ODvOODieihqFxuICAgICAgICAgKiBAdHlwZSB7e319XG4gICAgICAgICAqIEBpZ25vcmVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX01PVE9SX0xPR19FUlJPUkNPREU9e1xuICAgICAgICAgICAgMDp7aWQ6MCx0eXBlOlwiS01fU1VDQ0VTU1wiLG1zZzpcIlN1Y2Nlc3NmdWwgY29tbWFuZFwifSwvL+aIkOWKn+aZguOBq+i/lOWNtOOBmeOCi1xuICAgICAgICAgICAgMTp7aWQ6MSx0eXBlOlwiS01fRVJST1JfSU5URVJOQUxcIixtc2c6XCJJbnRlcm5hbCBFcnJvclwifSwvL+WGhemDqOOCqOODqeODvFxuICAgICAgICAgICAgMjp7aWQ6Mix0eXBlOlwiS01fRVJST1JfTk9fTUVNXCIsbXNnOlwiTm8gTWVtb3J5IGZvciBvcGVyYXRpb25cIn0sLy/jg6Hjg6Ljg6rkuI3otrNcbiAgICAgICAgICAgIDM6e2lkOjMsdHlwZTpcIktNX0VSUk9SX05PVF9GT1VORFwiLG1zZzpcIk5vdCBmb3VuZFwifSwvL+imi+OBpOOBi+OCieOBquOBhFxuICAgICAgICAgICAgNDp7aWQ6NCx0eXBlOlwiS01fRVJST1JfTk9UX1NVUFBPUlRFRFwiLG1zZzpcIk5vdCBzdXBwb3J0ZWRcIn0sLy/jgrXjg53jg7zjg4jlpJZcbiAgICAgICAgICAgIDU6e2lkOjUsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfQ09NTUFORFwiLG1zZzpcIkludmFsaWQgQ29tbWFuZFwifSwvL+S4jeato+OBquOCs+ODnuODs+ODiVxuICAgICAgICAgICAgNjp7aWQ6Nix0eXBlOlwiS01fRVJST1JfSU5WQUxJRF9QQVJBTVwiLG1zZzpcIkludmFsaWQgUGFyYW1ldGVyXCJ9LC8v5LiN5q2j44Gq5byV5pWwXG4gICAgICAgICAgICA3OntpZDo3LHR5cGU6XCJLTV9FUlJPUl9TVE9SQUdFX0ZVTExcIixtc2c6XCJTdG9yYWdlIGlzIGZ1bGxcIn0sLy/oqJjpjLLpoJjln5/jgYzkuIDmna9cbiAgICAgICAgICAgIDg6e2lkOjgsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfRkxBU0hfU1RBVEVcIixtc2c6XCJJbnZhbGlkIGZsYXNoIHN0YXRlLCBvcGVyYXRpb24gZGlzYWxsb3dlZCBpbiB0aGlzIHN0YXRlXCJ9LC8v44OV44Op44OD44K344Ol44Gu54q25oWL44GM5LiN5q2jXG4gICAgICAgICAgICA5OntpZDo5LHR5cGU6XCJLTV9FUlJPUl9JTlZBTElEX0xFTkdUSFwiLG1zZzpcIkludmFsaWQgTGVuZ3RoXCJ9LC8v5LiN5q2j44Gq5byV5pWw44Gu6ZW344GV77yI44K144Kk44K677yJXG4gICAgICAgICAgICAxMDp7aWQ6MTAsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfQ0hFQ0tTVU1cIixtc2c6XCJJbnZhbGlkIENoZWNrIFN1bSAoVmFsaWRhdGlvbiBpcyBmYWlsZWQpXCJ9LC8v5LiN5q2j44Gq44OB44Kn44OD44Kv44K144OgXG4gICAgICAgICAgICAxMzp7aWQ6MTMsdHlwZTpcIktNX0VSUk9SX1RJTUVPVVRcIixtc2c6XCJPcGVyYXRpb24gdGltZWQgb3V0XCJ9LC8v44K/44Kk44Og44Ki44Km44OIXG4gICAgICAgICAgICAxNTp7aWQ6MTUsdHlwZTpcIktNX0VSUk9SX0ZPUkJJRERFTlwiLG1zZzpcIkZvcmJpZGRlbiBPcGVyYXRpb25cIn0sLy/kuI3oqLHlj6/jgarmk43kvZxcbiAgICAgICAgICAgIDE2OntpZDoxNix0eXBlOlwiS01fRVJST1JfSU5WQUxJRF9BRERSXCIsbXNnOlwiQmFkIE1lbW9yeSBBZGRyZXNzXCJ9LC8v5LiN5q2j44Gq44Ki44OJ44Os44K55Y+C54WnXG4gICAgICAgICAgICAxNzp7aWQ6MTcsdHlwZTpcIktNX0VSUk9SX0JVU1lcIixtc2c6XCJCdXN5XCJ9LC8v44OT44K444O8XG4gICAgICAgICAgICAxODp7aWQ6MTgsdHlwZTpcIktNX0VSUk9SX1JFU09VUkNFXCIsbXNnOlwiTm90IGVub3VnaCByZXNvdXJjZXMgZm9yIG9wZXJhdGlvblwifSwvL+ODquOCveODvOOCueS4jei2s1xuICAgICAgICAgICAgMjA6e2lkOjIwLHR5cGU6XCJLTV9FUlJPUl9NT1RPUl9ESVNBQkxFRFwiLG1zZzpcIk1vdG9yIHN0YXRlIGlzIGRpc2FibGVkXCJ9LC8v44Oi44O844K/44O844GM5YuV5L2c6Kix5Y+v44GV44KM44Gm44GE44Gq44GEXG4gICAgICAgICAgICA2MDp7aWQ6NjAsdHlwZTpcIktNX0VSUk9SX0RFVklDRV9EUklWRVJcIixtc2c6XCJLTV9FUlJPUl9ERVZJQ0VfRFJJVkVSXCJ9LC8v5YaF5a655pyq5a6a576pXG4gICAgICAgICAgICA2MTp7aWQ6NjEsdHlwZTpcIktNX0VSUk9SX0RFVklDRV9GTEFTSFwiLG1zZzpcIktNX0VSUk9SX0RFVklDRV9GTEFTSFwifSwvL+WGheWuueacquWumue+qVxuICAgICAgICAgICAgNjI6e2lkOjYyLHR5cGU6XCJLTV9FUlJPUl9ERVZJQ0VfTEVEXCIsbXNnOlwiS01fRVJST1JfREVWSUNFX0xFRFwifSwvL+WGheWuueacquWumue+qVxuICAgICAgICAgICAgNjM6e2lkOjYzLHR5cGU6XCJLTV9FUlJPUl9ERVZJQ0VfSU1VXCIsbXNnOlwiS01fRVJST1JfREVWSUNFX0lNVVwifSwvL+WGheWuueacquWumue+qVxuICAgICAgICAgICAgNzA6e2lkOjcwLHR5cGU6XCJLTV9FUlJPUl9OUkZfREVWSUNFXCIsbXNnOlwiRXJyb3IgcmVsYXRlZCB0byBCTEUgbW9kdWxlIChuUkY1MjgzMilcIn0sLy9CTEXjg6Ljgrjjg6Xjg7zjg6vjga7jgqjjg6njg7xcbiAgICAgICAgICAgIDgwOntpZDo4MCx0eXBlOlwiS01fRVJST1JfV0RUX0VWRU5UXCIsbXNnOlwiV2F0Y2ggRG9nIFRpbWVyIEV2ZW50XCJ9LC8v44Km44Kp44OD44OB44OJ44OD44Kw44K/44Kk44Oe44O844Kk44OZ44Oz44OI44Gu55m65YuV77yI5YaN6LW35YuV55u05YmN77yJXG4gICAgICAgICAgICA4MTp7aWQ6ODEsdHlwZTpcIktNX0VSUk9SX09WRVJfSEVBVFwiLG1zZzpcIk92ZXIgSGVhdCAob3ZlciB0ZW1wZXJhdHVyZSlcIn0sLy/muKnluqbnlbDluLjvvIjjg57jgqTjgrPjg7PmuKnluqbjgYwy5YiG5Lul5LiKNjDluqbjgpLotoXpgY7vvIlcbiAgICAgICAgICAgIDEwMDp7aWQ6MTAwLHR5cGU6XCJLTV9TVUNDRVNTX0FSUklWQUxcIixtc2c6XCJQb3NpdGlvbiBBcnJpdmFsIE5vdGlmaWNhdGlvblwifS8v5L2N572u5Yi25b6h5pmC44Gr5oyH5a6a5L2N572u44Gr5Yiw6YGU44GX44Gf5aC05ZCI44Gu6YCa55+lXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOODl+ODreODkeODhuOCo1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIOODh+ODkOOCpOOCueaDheWgsVxuICAgICAqIEB0eXBlIHtLTURldmljZUluZm99XG4gICAgICpcbiAgICAgKi9cbiAgICBnZXQgZGV2aWNlSW5mbygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZGV2aWNlSW5mby5DbG9uZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOacieWKueeEoeWKuVxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIGdldCBpc0Nvbm5lY3QoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RldmljZUluZm8uaXNDb25uZWN0O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOCs+ODnuODs+ODiemghuebo+imlueUqOmAo+eVquOBrueZuuihjFxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IGNyZWF0ZUNvbW1hbmRJRCgpe1xuICAgICAgIHJldHVybiB0aGlzLl9jb21tYW5kQ291bnQ9KCsrdGhpcy5fY29tbWFuZENvdW50KSYwYjExMTExMTExMTExMTExMTE7Ly82NTUzNeOBp+ODq+ODvOODl1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGlzQ29ubmVjdOOBruioreWumuWkieabtCjlrZDjgq/jg6njgrnjgYvjgonkvb/nlKgpXG4gICAgICogQHBhcmFtIHtib29sZWFufSBib29sXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIF9zdGF0dXNDaGFuZ2VfaXNDb25uZWN0KGJvb2wpe1xuICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmlzQ29ubmVjdD1ib29sO1xuICAgICAgICBpZih0aGlzLl9pc0luaXQpe1xuICAgICAgICAgICAgaWYoYm9vbCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25Db25uZWN0SGFuZGxlcih0aGlzKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHRoaXMuX29uRGlzY29ubmVjdEhhbmRsZXIodGhpcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDliJ3mnJ/ljJbnirbmhYvjga7oqK3lrpoo5a2Q44Kv44Op44K544GL44KJ5L2/55SoKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYm9vbFxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBfc3RhdHVzQ2hhbmdlX2luaXQoYm9vbCl7XG4gICAgICAgIHRoaXMuX2lzSW5pdD1ib29sO1xuICAgICAgICBpZih0aGlzLl9pc0luaXQpe1xuICAgICAgICAgICAgdGhpcy5fb25Jbml0SGFuZGxlcih0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIGNhbGxiYWNrXG4gICAgICoqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICog5Yid5pyf5YyW5a6M5LqG44GX44Gm5Yip55So44Gn44GN44KL44KI44GG44Gr44Gq44Gj44GfXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKEtNQ29tQmFzZSl9XG4gICAgICovXG4gICAgc2V0IG9uSW5pdChoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkluaXRIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDlv5znrZTjg7vlho3mjqXntprjgavmiJDlip/jgZfjgZ9cbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oS01Db21CYXNlKX1cbiAgICAgKi9cbiAgICBzZXQgb25Db25uZWN0KGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uQ29ubmVjdEhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOW/nOetlOOBjOeEoeOBj+OBquOBo+OBn+ODu+WIh+aWreOBleOCjOOBn1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihLTUNvbUJhc2UpfVxuICAgICAqL1xuICAgIHNldCBvbkRpc2Nvbm5lY3QoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25EaXNjb25uZWN0SGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog5o6l57aa44Gr5aSx5pWXXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKEtNQ29tQmFzZSxzdHJpbmcpfVxuICAgICAqL1xuICAgIHNldCBvbkNvbm5lY3RGYWlsdXJlKGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uQ29ubmVjdEZhaWx1cmVIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBruWbnui7ouaDheWgsWNhbGxiYWNrXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKHBvc2l0aW9uOm51bWJlcix2ZWxvY2l0eTpudW1iZXIsdG9ycXVlOm51bWJlcil9XG4gICAgICovXG4gICAgc2V0IG9uTW90b3JNZWFzdXJlbWVudChmdW5jKXtcbiAgICAgICAgaWYodHlwZW9mIGZ1bmM9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Nb3Rvck1lYXN1cmVtZW50Q0I9ZnVuYztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga7jgrjjg6PjgqTjg63mg4XloLFjYWxsYmFja1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbih7YWNjZWxYOm51bWJlcixhY2NlbFk6bnVtYmVyLGFjY2VsWjpudW1iZXIsdGVtcDpudW1iZXIsZ3lyb1g6bnVtYmVyLGd5cm9ZOm51bWJlcixneXJvWjpudW1iZXJ9KX1cbiAgICAgKi9cbiAgICBzZXQgb25JbXVNZWFzdXJlbWVudChmdW5jKXtcbiAgICAgICAgaWYodHlwZW9mIGZ1bmM9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25JbXVNZWFzdXJlbWVudENCPWZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHlj5blvpdjYWxsYmFja1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihyZWdpc3RlckNtZDpudW1iZXIscmVzOm51bWJlcil9XG4gICAgICovXG4gICAgc2V0IG9uTW90b3JTZXR0aW5nKGZ1bmMpe1xuICAgICAgICBpZih0eXBlb2YgZnVuYz09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yU2V0dGluZ0NCPWZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Ot44Kw5oOF5aCx5Y+W5b6XY2FsbGJhY2tcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oY21kSUQ6bnVtYmVyLHJlczplcnJvcmxvZ09iamVjdCl9XG4gICAgICovXG4gICAgc2V0IG9uTW90b3JMb2coZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JMb2dDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuXG4vLy8vLy9jbGFzcy8vXG59XG5cbm1vZHVsZS5leHBvcnRzID1LTUNvbUJhc2U7XG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvS01Db21CYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSA2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLyoqKlxuICogS01Nb3RvckNvbW1hbmRLTU9uZS5qc1xuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuY29uc3QgRXZlbnRFbWl0dGVyID0gcmVxdWlyZShcImV2ZW50c1wiKS5FdmVudEVtaXR0ZXI7XG5jb25zdCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcbmNvbnN0IEtNQ29tV2ViQkxFID0gcmVxdWlyZSgnLi9LTUNvbVdlYkJMRScpO1xuY29uc3QgS01TdHJ1Y3R1cmVzPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzJyk7XG5cblxuLyoqXG4gKiBAY2xhc3NkZXNjIEtNMeOCs+ODnuODs+ODiemAgeS/oeOCr+ODqeOCuVxuICogQGlnbm9yZVxuICovXG5jbGFzcyBLTU1vdG9yQ29tbWFuZEtNT25lIGV4dGVuZHMgRXZlbnRFbWl0dGVye1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWumuaVsFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDmjqXntprmlrnlvI/lrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBXRUJCTEUgLSAxOldFQkJMRVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBCTEUgLSAyOkJMRVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBTRVJJQUwgLSAzOlNFUklBTFxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgS01fQ09OTkVDVF9UWVBFKCl7XG4gICAgICAgIHJldHVybiB7XCJXRUJCTEVcIjoxLFwiQkxFXCI6MixcIlNFUklBTFwiOjN9O1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogY21kUHJlcGFyZVBsYXliYWNrTW90aW9u44Gu6ZaL5aeL5L2N572u44Kq44OX44K344On44Oz5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gU1RBUlRfUE9TSVRJT05fQUJTIC0gMDroqJjmhrbjgZXjgozjgZ/plovlp4vkvY3nva7vvIjntbblr77luqfmqJnvvInjgYvjgonjgrnjgr/jg7zjg4hcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gU1RBUlRfUE9TSVRJT05fQ1VSUkVOVCAtIDE654++5Zyo44Gu5L2N572u44KS6ZaL5aeL5L2N572u44Go44GX44Gm44K544K/44O844OIXG4gICAgICovXG4gICAgc3RhdGljIGdldCBjbWRQcmVwYXJlUGxheWJhY2tNb3Rpb25fU1RBUlRfUE9TSVRJT04oKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ1NUQVJUX1BPU0lUSU9OX0FCUyc6MCxcbiAgICAgICAgICAgICdTVEFSVF9QT1NJVElPTl9DVVJSRU5UJzoxXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNtZExlZOOBrkxFROOBrueCueeBr+eKtuaFi+OCquODl+OCt+ODp+ODs+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IExFRF9TVEFURV9PRkYgLSAwOua2iOeBr1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBMRURfU1RBVEVfT05fU09MSUQgLSAxOkxFROeCueeBr++8iOeCueeBr+OBl+OBo+OBseOBquOBl++8iVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBMRURfU1RBVEVfT05fRkxBU0ggLSAyOkxFROeCuea7he+8iOS4gOWumumWk+malOOBp+eCuea7he+8iVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBMRURfU1RBVEVfT05fRElNIC0gOjNMRUTjgYzjgobjgaPjgY/jgormmI7mu4XjgZnjgotcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZExlZF9MRURfU1RBVEUoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ0xFRF9TVEFURV9PRkYnOjAsXG4gICAgICAgICAgICAnTEVEX1NUQVRFX09OX1NPTElEJzoxLFxuICAgICAgICAgICAgJ0xFRF9TVEFURV9PTl9GTEFTSCc6MixcbiAgICAgICAgICAgICdMRURfU1RBVEVfT05fRElNJzozXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNtZEN1cnZlVHlwZeOBruWKoOa4m+mAn+OCq+ODvOODluOCquODl+OCt+ODp+ODs+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IENVUlZFX1RZUEVfTk9ORSAtIDA644Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9GRlxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBDVVJWRV9UWVBFX1RSQVBFWk9JRCAtIDE644Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9OIO+8iOWPsOW9ouWKoOa4m+mAn++8iVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ0NVUlZFX1RZUEVfTk9ORSc6IDAsXG4gICAgICAgICAgICAnQ1VSVkVfVFlQRV9UUkFQRVpPSUQnOjFcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWzjga7jg6Ljg7zjgr/jg7zmuKzlrprlgKTjga7lj5blvpfplpPpmpTlrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzVNUyAtIDA6NU1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTBNUyAtIDE6MTBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzIwTVMgLSAyOjIwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF81ME1TIC0gMzo1ME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTAwTVMgLSA0OjEwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMjAwTVMgLSA1OjIwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfNTAwTVMgLSA2OjUwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTAwME1TIC0gNzoxMDAwTVNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZE1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbF9NT1RPUl9NRUFTX0lOVEVSVkFMKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzVNUyc6IDAsXG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF8xME1TJzoxLFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfMjBNUyc6MixcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzUwTVMnOjMsXG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF8xMDBNUyc6NCxcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzIwME1TJzo1LFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfNTAwTVMnOjYsXG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF8xMDAwTVMnOjdcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbOOBruWKoOmAn+W6puODu+OCuOODo+OCpOODrea4rOWumuWApOOBruWPluW+l+mWk+malOWumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfNU1TIC0gMDo1TVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8xME1TIC0gMToxME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMjBNUyAtIDI6MjBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzUwTVMgLSAzOjUwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8xMDBNUyAtIDQ6MTAwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8yMDBNUyAtIDU6MjAwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF81MDBNUyAtIDY6NTAwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8xMDAwTVMgLSA3OjEwMDBNU1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbF9JTVVfTUVBU19JTlRFUlZBTCgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfNU1TJzogMCxcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF8xME1TJzoxLFxuICAgICAgICAgICAgJ0lNVV9NRUFTX0lOVEVSVkFMXzIwTVMnOjIsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfNTBNUyc6MyxcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF8xMDBNUyc6NCxcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF8yMDBNUyc6NSxcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF81MDBNUyc6NixcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF8xMDAwTVMnOjdcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLypcbiAgICAqIFJlYWRSZWdpc3RlcuOBp+WPluW+l+OBmeOCi+aZgueUqOOBruOCs+ODnuODs+ODieW8leaVsOWumuaVsFxuICAgICogQHJlYWRvbmx5XG4gICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IG1heFNwZWVkIC0gMjrmnIDlpKfpgJ/jgZVcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtaW5TcGVlZCAtIDM65pyA5bCP6YCf44GVXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gY3VydmVUeXBlIC0gNTrliqDmuJvpgJ/mm7Lnt5pcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBhY2MgLSA3OuWKoOmAn+W6plxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGRlYyAtIDg65rib6YCf5bqmXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gbWF4VG9ycXVlIC0gMTQ65pyA5aSn44OI44Or44KvXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcUN1cnJlbnRQIC0gMjQ6cei7uOmbu+a1gVBJROOCsuOCpOODsyhQKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHFDdXJyZW50SSAtIDI1OnHou7jpm7vmtYFQSUTjgrLjgqTjg7MoSSlcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBxQ3VycmVudEQgLSAyNjpx6Lu46Zu75rWBUElE44Ky44Kk44OzKEQpXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gc3BlZWRQIC0gMjc66YCf5bqmUElE44Ky44Kk44OzKFApXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gc3BlZWRJIC0gMjg66YCf5bqmUElE44Ky44Kk44OzKEkpXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gc3BlZWREIC0gMjk66YCf5bqmUElE44Ky44Kk44OzKEQpXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcG9zaXRpb25QIC0gMzA65L2N572uUElE44Ky44Kk44OzKFApXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcG9zaXRpb25JIC0gMzE65L2N572uUElE44Ky44Kk44OzKEkpXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcG9zaXRpb25EIC0gMzI65L2N572uUElE44Ky44Kk44OzKEQpXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcG9zQ29udHJvbFRocmVzaG9sZCAtIDMzOuODouODvOOCv+ODvOOBruS9jee9ruWItuW+oeaZguOAgUlE5Yi25b6h44KS5pyJ5Yq544Gr44GZ44KL5YGP5beu44Gu57W25a++5YCkXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gaW50ZXJmYWNlIC0gNDY644Oi44O844K/44O86YCa5L+h57WM6LevXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcmVzcG9uc2UgLSA0ODrjgrPjg57jg7Pjg4njgpLlj5fkv6HjgZfjgZ/jgajjgY3jgavpgJrnn6XjgZnjgovjgYtcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBvd25Db2xvciAtIDU4OuODh+ODkOOCpOOCuUxFROOBruWbuuacieiJslxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGRldmljZU5hbWUgLSA3MDpcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkZXZpY2VJbmZvIC0gNzE6XG4gICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZFJlYWRSZWdpc3Rlcl9DT01NQU5EKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgIFwibWF4U3BlZWRcIjoweDAyLC8vXG4gICAgICAgICAgICBcIm1pblNwZWVkXCI6MHgwMywvL1xuICAgICAgICAgICAgXCJjdXJ2ZVR5cGVcIjoweDA1LC8vXG4gICAgICAgICAgICBcImFjY1wiOjB4MDcsLy9cbiAgICAgICAgICAgIFwiZGVjXCI6MHgwOCwvL1xuICAgICAgICAgICAgXCJtYXhUb3JxdWVcIjoweDBFLC8vXG4gICAgICAgICAgICBcInRlYWNoaW5nSW50ZXJ2YWxcIjoweDE2LC8vXG4gICAgICAgICAgICBcInBsYXliYWNrSW50ZXJ2YWxcIjoweDE3LC8vXG4gICAgICAgICAgICBcInFDdXJyZW50UFwiOjB4MTgsLy9cbiAgICAgICAgICAgIFwicUN1cnJlbnRJXCI6MHgxOSwvL1xuICAgICAgICAgICAgXCJxQ3VycmVudERcIjoweDFBLC8vXG4gICAgICAgICAgICBcInNwZWVkUFwiOjB4MUIsLy9cbiAgICAgICAgICAgIFwic3BlZWRJXCI6MHgxQywvL1xuICAgICAgICAgICAgXCJzcGVlZERcIjoweDFELC8vXG4gICAgICAgICAgICBcInBvc2l0aW9uUFwiOjB4MUUsLy9cbiAgICAgICAgICAgIFwicG9zaXRpb25JXCI6MHgxRiwvL1xuICAgICAgICAgICAgXCJwb3NpdGlvbkRcIjoweDIwLC8vXG4gICAgICAgICAgICBcInBvc0NvbnRyb2xUaHJlc2hvbGRcIjoweDIxLC8vXG4gICAgICAgICAgICAvL1wibm90aWZ5UG9zQXJyaXZhbFwiOjB4MkIsXG4gICAgICAgICAgICBcIm1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbFwiOjB4MkMsLy9cbiAgICAgICAgICAgIFwibW90b3JNZWFzdXJlbWVudEJ5RGVmYXVsdFwiOjB4MkQsLy9cbiAgICAgICAgICAgIFwiaW50ZXJmYWNlXCI6MHgyRSwvL1xuICAgICAgICAgICAgLy9cInJlc3BvbnNlXCI6MHgzMCwvL3RvZG86OuWApOOBjOWPluW+l+WHuuadpeOBquOBhCAyLjI0XG4gICAgICAgICAgICBcIm93bkNvbG9yXCI6MHgzQSwvL1xuICAgICAgICAgICAgXCJpTVVNZWFzdXJlbWVudEludGVydmFsXCI6MHgzQywvL1xuICAgICAgICAgICAgXCJpTVVNZWFzdXJlbWVudEJ5RGVmYXVsdFwiOjB4M0QsLy9cbiAgICAgICAgICAgIFwiZGV2aWNlTmFtZVwiOjB4NDYsLy9cbiAgICAgICAgICAgIFwiZGV2aWNlSW5mb1wiOjB4NDcsLy9cbiAgICAgICAgICAgIFwic3BlZWRcIjoweDU4LC8vXG4gICAgICAgICAgICBcInBvc2l0aW9uT2Zmc2V0XCI6MHg1QiwvL1xuICAgICAgICAgICAgXCJtb3ZlVG9cIjoweDY2LC8vXG4gICAgICAgICAgICBcImhvbGRcIjoweDcyLC8vXG4gICAgICAgICAgICBcInN0YXR1c1wiOjB4OUEsLy9cbiAgICAgICAgICAgIFwiaTJDU2xhdmVBZGRyZXNzXCI6MHhDMCwvL1xuICAgICAgICAgICAgXCJ1YXJ0QmF1ZFJhdGVcIjoweEMzLFxuICAgICAgICAgICAgXCJsZWRcIjoweEUwLC8vXG4gICAgICAgICAgICBcImVuYWJsZUNoZWNrU3VtXCI6MHhGMy8vXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qXG4gICAgICAgKiDjg6Ljg7zjgr/jg7zliLblvqHmiYvmrrXvvIjjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnvvInjga7ntYzot6/mjIflrprnlKjlrprmlbBcbiAgICAgICAqIEByZWFkb25seVxuICAgICAgICogQGVudW0ge251bWJlcn1cbiAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBCTEUgLSAweDE6QkxFXG4gICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gVVNCIC0gMHgxMDAwOlVTQlxuICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IEkyQyAtIDB4MTAwMDA6STJDXG4gICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gSEREQlROIC0gMHgxMDAwMDAwMDrniannkIbjg5zjgr/jg7NcbiAgICAgICAqL1xuICAgIHN0YXRpYyBnZXQgY21kSW50ZXJmYWNlX0lOVEVSRkFDRV9UWVBFKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgIFwiQkxFXCI6MGIxLFxuICAgICAgICAgICAgXCJVU0JcIjowYjEwMDAsXG4gICAgICAgICAgICBcIkkyQ1wiOjBiMTAwMDAsXG4gICAgICAgICAgICBcIkhEREJUTlwiOjBiMTAwMDAwMDBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3LjgIBcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuS01fQ09OTkVDVF9UWVBFfSBjb25uZWN0X3R5cGUg5o6l57aa5pa55byPXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGttY29tIOmAmuS/oeOCquODluOCuOOCp+OCr+ODiCB7QGxpbmsgS01Db21CTEV9IHtAbGluayBLTUNvbVdlYkJMRX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbm5lY3RfdHlwZSxrbWNvbSl7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOOCpOODmeODs+ODiOOCv+OCpOODl+WumuaVsFxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICogQGVudW0ge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuRVZFTlRfVFlQRT17XG4gICAgICAgICAgICAvKiog5Yid5pyf5YyW5a6M5LqG5pmCPGJyPnJldHVybjpmdW5jdGlvbih7S01EZXZpY2VJbmZvfSkgKi8gaW5pdDpcImluaXRcIixcbiAgICAgICAgICAgIC8qKiDmjqXntprmmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtLTURldmljZUluZm99KSAqLyBjb25uZWN0OlwiY29ubmVjdFwiLFxuICAgICAgICAgICAgLyoqIOWIh+aWreaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0tNRGV2aWNlSW5mb30pICovIGRpc2Nvbm5lY3Q6XCJkaXNjb25uZWN0XCIsXG4gICAgICAgICAgICAvKiog5o6l57aa44Gr5aSx5pWX5pmCPGJyPnJldHVybjpmdW5jdGlvbih7S01EZXZpY2VJbmZvfSx7bXNnfSkgKi8gY29ubmVjdEZhaWx1cmU6XCJjb25uZWN0RmFpbHVyZVwiLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOWbnui7ouaDheWgseWPl+S/oeaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0BsaW5rIEtNUm90U3RhdGV9KSAqLyBtb3Rvck1lYXN1cmVtZW50OlwibW90b3JNZWFzdXJlbWVudFwiLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvElNVeaDheWgseWPl+S/oeaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0BsaW5rIEtNSW11U3RhdGV9KSAqLyBpbXVNZWFzdXJlbWVudDpcImltdU1lYXN1cmVtZW50XCIsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844Ot44Kw5oOF5aCx5Y+X5L+h5pmCPGJyPnJldHVybjpmdW5jdGlvbih7Y21kTmFtZX0se2Vycm9ybG9nT2JqZWN0fSkgKi8gbW90b3JMb2c6XCJtb3RvckxvZ1wiLFxuICAgICAgICB9O1xuICAgICAgICBPYmplY3QuZnJlZXplKHRoaXMuRVZFTlRfVFlQRSk7Ly9pbmZvOjrlvozjgYvjgonjg5Xjg6rjg7zjgrrjgZfjgarjgYTjgahqc2RvY+OBjOeUn+aIkOOBleOCjOOBquOBhOOAglxuICAgICAgICAvKipcbiAgICAgICAgICog44Oi44O844K/44O844Gu5YWo44Kz44Oe44Oz44OJXG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAaWdub3JlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9NT1RPUl9DT01NQU5EPXtcbiAgICAgICAgICAgIC8qKiDmnIDlpKfpgJ/jgZXjgpLoqK3lrprjgZnjgosgKi8gbWF4U3BlZWQ6MHgwMixcbiAgICAgICAgICAgIC8qKiDmnIDlsI/pgJ/jgZXjgpLoqK3lrprjgZnjgosgKi8gbWluU3BlZWQ6MHgwMyxcbiAgICAgICAgICAgIC8qKiDliqDmuJvpgJ/mm7Lnt5rjgpLoqK3lrprjgZnjgosgKi8gY3VydmVUeXBlOjB4MDUsXG4gICAgICAgICAgICAvKiog5Yqg6YCf5bqm44KS6Kit5a6a44GZ44KLICovIGFjYzoweDA3LFxuICAgICAgICAgICAgLyoqIOa4m+mAn+W6puOCkuioreWumuOBmeOCiyAqLyBkZWM6MHgwOCxcbiAgICAgICAgICAgIC8qKiDmnIDlpKfjg4jjg6vjgq/jgpLoqK3lrprjgZnjgosgKi8gbWF4VG9ycXVlOjB4MEUsXG4gICAgICAgICAgICAvKiog44OG44Kj44O844OB44Oz44Kw6ZaT6ZqUICovIHRlYWNoaW5nSW50ZXJ2YWw6MHgxNixcbiAgICAgICAgICAgIC8qKiDjg5fjg6zjgqTjg5Djg4Pjgq/plpPpmpQgKi8gcGxheWJhY2tJbnRlcnZhbDoweDE3LFxuICAgICAgICAgICAgLyoqIHHou7jpm7vmtYFQSUTjgrLjgqTjg7MoUCnjgpLoqK3lrprjgZnjgosgKi8gcUN1cnJlbnRQOjB4MTgsXG4gICAgICAgICAgICAvKiogcei7uOmbu+a1gVBJROOCsuOCpOODsyhJKeOCkuioreWumuOBmeOCiyAqLyBxQ3VycmVudEk6MHgxOSxcbiAgICAgICAgICAgIC8qKiBx6Lu46Zu75rWBUElE44Ky44Kk44OzKEQp44KS6Kit5a6a44GZ44KLICovIHFDdXJyZW50RDoweDFBLFxuICAgICAgICAgICAgLyoqIOmAn+W6plBJROOCsuOCpOODsyhQKeOCkuioreWumuOBmeOCiyAqLyBzcGVlZFA6MHgxQixcbiAgICAgICAgICAgIC8qKiDpgJ/luqZQSUTjgrLjgqTjg7MoSSnjgpLoqK3lrprjgZnjgosgKi8gc3BlZWRJOjB4MUMsXG4gICAgICAgICAgICAvKiog6YCf5bqmUElE44Ky44Kk44OzKEQp44KS6Kit5a6a44GZ44KLICovIHNwZWVkRDoweDFELFxuICAgICAgICAgICAgLyoqIOS9jee9rlBJROOCsuOCpOODsyhQKeOCkuioreWumuOBmeOCiyAqLyBwb3NpdGlvblA6MHgxRSxcbiAgICAgICAgICAgIC8qKiDkvY3nva5QSUTjgrLjgqTjg7MoSSnjgpLoqK3lrprjgZnjgosgKi8gcG9zaXRpb25JOjB4MUYsXG4gICAgICAgICAgICAvKiog5L2N572uUElE44Ky44Kk44OzKEQp44KS6Kit5a6a44GZ44KLICovIHBvc2l0aW9uRDoweDIwLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOBruS9jee9ruWItuW+oeaZguOAgUlE5Yi25b6h44KS5pyJ5Yq544Gr44GZ44KL5YGP5beu44Gu57W25a++5YCk44KS5oyH5a6a44GZ44KLICovIHBvc0NvbnRyb2xUaHJlc2hvbGQ6MHgyMSxcblxuICAgICAgICAgICAgLyoqIFBJROOCsuOCpOODs+OCkuODquOCu+ODg+ODiOOBmeOCiyAqLyByZXNldFBJRDoweDIyLFxuICAgICAgICAgICAgLyoqIOS9jee9ruWItuW+oeaZguOAgeebruaomeS9jee9ruOBq+WIsOmBlOaZguOAgeWIpOWumuadoeS7tuOCkua6gOOBn+OBl+OBn+WgtOWQiOmAmuefpeOCkuihjOOBhiovIG5vdGlmeVBvc0Fycml2YWw6MHgyQixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zmuKzlrprlgKTjga7lj5blvpfplpPpmpQoVVNCLEkyQ+OBruOBvykgKi8gbW90b3JNZWFzdXJlbWVudEludGVydmFsOjB4MkMsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O85ris5a6a5YCk44Gu5Y+W5b6X6Kit5a6aICovIG1vdG9yTWVhc3VyZW1lbnRCeURlZmF1bHQ6MHgyRCxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zliLblvqHmiYvmrrXvvIjjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnvvInjga7oqK3lrpogKi8gaW50ZXJmYWNlOjB4MkUsXG4gICAgICAgICAgICAvKiog44Kz44Oe44Oz44OJ44KS5Y+X5L+h44GX44Gf44Go44GN44Gr5oiQ5Yqf6YCa55+l77yIZXJyb3JDb2RlID0gMO+8ieOCkuOBmeOCi+OBi+OBqeOBhuOBiyAqLyByZXNwb25zZToweDMwLFxuXG4gICAgICAgICAgICAvKiog44OH44OQ44Kk44K5TEVE44Gu5Zu65pyJ6Imy44KS6Kit5a6a44GZ44KLICovIG93bkNvbG9yOjB4M0EsXG4gICAgICAgICAgICAvKiogSU1V5ris5a6a5YCk6YCa55+l6ZaT6ZqU77yI5pyJ57ea44Gu44G/77yJICovIGlNVU1lYXN1cmVtZW50SW50ZXJ2YWw6MHgzQyxcbiAgICAgICAgICAgIC8qKiDjg4fjg5Xjgqnjg6vjg4jjgafjga5JTVXmuKzlrprlgKTpgJrnn6VPTi9PRkYgKi8gaU1VTWVhc3VyZW1lbnRCeURlZmF1bHQ6MHgzRCxcblxuICAgICAgICAgICAgLyoqIOaMh+WumuOBruioreWumuWApOOCkuWPluW+l+OBmeOCiyAqLyByZWFkUmVnaXN0ZXI6MHg0MCxcbiAgICAgICAgICAgIC8qKiDlhajjgabjga7oqK3lrprlgKTjgpLjg5Xjg6njg4Pjgrfjg6Xjgavkv53lrZjjgZnjgosgKi8gc2F2ZUFsbFJlZ2lzdGVyczoweDQxLFxuXG4gICAgICAgICAgICAvKiog44OH44OQ44Kk44K544ON44O844Og44Gu5Y+W5b6XICovIHJlYWREZXZpY2VOYW1lOjB4NDYsXG4gICAgICAgICAgICAvKiog44OH44OQ44Kk44K55oOF5aCx44Gu5Y+W5b6XICovIHJlYWREZXZpY2VJbmZvOjB4NDcsXG4gICAgICAgICAgICAvKiog5oyH5a6a44Gu6Kit5a6a5YCk44KS44Oq44K744OD44OI44GZ44KLICovIHJlc2V0UmVnaXN0ZXI6MHg0RSxcbiAgICAgICAgICAgIC8qKiDlhajoqK3lrprlgKTjgpLjg6rjgrvjg4Pjg4jjgZnjgosgKi8gcmVzZXRBbGxSZWdpc3RlcnM6MHg0RixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zjga7li5XkvZzjgpLkuI3oqLHlj6/jgajjgZnjgosgKi8gZGlzYWJsZToweDUwLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOWLleS9nOOCkuioseWPr+OBmeOCiyAqLyBlbmFibGU6MHg1MSxcbiAgICAgICAgICAgIC8qKiDpgJ/luqbjga7lpKfjgY3jgZXjgpLoqK3lrprjgZnjgosgKi8gc3BlZWQ6MHg1OCxcbiAgICAgICAgICAgIC8qKiDkvY3nva7jga7jg5fjg6rjgrvjg4Pjg4jjgpLooYzjgYbvvIjljp/ngrnoqK3lrprvvIkgKi8gcHJlc2V0UG9zaXRpb246MHg1QSxcbiAgICAgICAgICAgIC8qKiDkvY3nva7jga7jg5fjg6rjgrvjg4Pjg4jjgavplqLjgZnjgotPRkZTRVTph48gKi8gcmVhZFBvc2l0aW9uT2Zmc2V0OjB4NUIsXG5cbiAgICAgICAgICAgIC8qKiDmraPlm57ou6LjgZnjgovvvIjlj43mmYLoqIjlm57jgorvvIkgKi8gcnVuRm9yd2FyZDoweDYwLFxuICAgICAgICAgICAgLyoqIOmAhuWbnui7ouOBmeOCi++8iOaZguioiOWbnuOCiu+8iSAqLyBydW5SZXZlcnNlOjB4NjEsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844KS5oyH5a6a6YCf5bqm44Gn5Zue6Lui44GV44Gb44KLICovIHJ1bjoweDYyLFxuICAgICAgICAgICAgLyoqIOe1tuWvvuS9jee9ruOBq+enu+WLleOBmeOCiyjpgJ/luqbjgYLjgoopICovIG1vdmVUb1Bvc2l0aW9uU3BlZWQ6MHg2NSxcbiAgICAgICAgICAgIC8qKiDntbblr77kvY3nva7jgavnp7vli5XjgZnjgosgKi8gbW92ZVRvUG9zaXRpb246MHg2NixcbiAgICAgICAgICAgIC8qKiDnm7jlr77kvY3nva7jgavnp7vli5XjgZnjgoso6YCf5bqm44GC44KKKSAqLyBtb3ZlQnlEaXN0YW5jZVNwZWVkOjB4NjcsXG4gICAgICAgICAgICAvKiog55u45a++5L2N572u44Gr56e75YuV44GZ44KLICovIG1vdmVCeURpc3RhbmNlOjB4NjgsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844Gu5Yqx56OB44KS5YGc5q2i44GZ44KLICovIGZyZWU6MHg2QyxcbiAgICAgICAgICAgIC8qKiDpgJ/luqbjgrzjg63jgb7jgafmuJvpgJ/jgZflgZzmraLjgZnjgosgKi8gc3RvcDoweDZELFxuICAgICAgICAgICAgLyoqIOODiOODq+OCr+WItuW+oeOCkuihjOOBhiAqLyBob2xkVG9ycXVlOjB4NzIsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44KS5a6f6KGM44GZ44KLICovIHN0YXJ0RG9pbmdUYXNrc2V0OjB4ODEsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44KS5YGc5q2iICovIHN0b3BEb2luZ1Rhc2tzZXQ6MHg4MixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgrfjg6fjg7PjgpLlho3nlJ/vvIjmupblgpnjgarjgZfvvIkgKi8gc3RhcnRQbGF5YmFja01vdGlvbjoweDg1LFxuICAgICAgICAgICAgLyoqIOODouODvOOCt+ODp+ODs+WGjeeUn+OCkuWBnOatouOBmeOCiyAqLyBzdG9wUGxheWJhY2tNb3Rpb246MHg4OCxcbiAgICAgICAgICAgIC8qKiDjgq3jg6Xjg7zjgpLlgZzmraLjgZnjgosgKi8gcGF1c2VRdWV1ZToweDkwLFxuICAgICAgICAgICAgLyoqIOOCreODpeODvOOCkuWGjemWi+OBmeOCiyAqLyByZXN1bWVRdWV1ZToweDkxLFxuICAgICAgICAgICAgLyoqIOOCreODpeODvOOCkuaMh+WumuaZgumWk+WBnOatouOBl+WGjemWi+OBmeOCiyAqLyB3YWl0UXVldWU6MHg5MixcbiAgICAgICAgICAgIC8qKiDjgq3jg6Xjg7zjgpLjg6rjgrvjg4Pjg4jjgZnjgosgKi8gcmVzZXRRdWV1ZToweDk1LFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOBrueKtuaFiyAqLyByZWFkU3RhdHVzOjB4OUEsXG5cbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLjgpLplovlp4vjgZnjgosgKi8gc3RhcnRSZWNvcmRpbmdUYXNrc2V0OjB4QTAsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44KS5YGc5q2i44GZ44KLICovIHN0b3BSZWNvcmRpbmdUYXNrc2V0OjB4QTIsXG4gICAgICAgICAgICAvKiog5oyH5a6a44Gu44K/44K544Kv44K744OD44OI44KS5YmK6Zmk44GZ44KLICovIGVyYXNlVGFza3NldDoweEEzLFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOCkuWFqOWJiumZpOOBmeOCiyAqLyBlcmFzZUFsbFRhc2tzZXQ6MHhBNCxcbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLlkI3oqK3lrpogKi8gc2V0VGFza3NldE5hbWU6MHhBNSxcbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jlhoXlrrnmiormj6EgKi8gcmVhZFRhc2tzZXRJbmZvOjB4QTYsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI5L2/55So54q25rOB5oqK5o+hICovIHJlYWRUYXNrc2V0VXNhZ2U6MHhBNyxcbiAgICAgICAgICAgIC8qKiDjg4DjgqTjg6zjgq/jg4jjg4bjgqPjg7zjg4Hjg7PjgrDplovlp4vvvIjmupblgpnjgarjgZfvvIkgKi8gc3RhcnRUZWFjaGluZ01vdGlvbjoweEE5LFxuICAgICAgICAgICAgLyoqIOODhuOCo+ODvOODgeODs+OCsOOCkuWBnOatouOBmeOCiyAqLyBzdG9wVGVhY2hpbmdNb3Rpb246MHhBQyxcbiAgICAgICAgICAgIC8qKiDjg4bjgqPjg7zjg4Hjg7PjgrDjgafopprjgYjjgZ/li5XkvZzjgpLliYrpmaTjgZnjgosgKi8gZXJhc2VNb3Rpb246MHhBRCxcbiAgICAgICAgICAgIC8qKiDjg4bjgqPjg7zjg4Hjg7PjgrDjgafopprjgYjjgZ/lhajli5XkvZzjgpLliYrpmaTjgZnjgosgKi8gZXJhc2VBbGxNb3Rpb246MHhBRSxcbiAgICAgICAgICAgIC8qKiBJMkPjgrnjg6zjg7zjg5bjgqLjg4njg6zjgrkgKi8gc2V0STJDU2xhdmVBZGRyZXNzOjB4QzAsXG4gICAgICAgICAgICAvKiogTEVE44Gu54K554Gv54q25oWL44KS44K744OD44OI44GZ44KLICovIGxlZDoweEUwLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOBrua4rOWumuWApOWPluW+l++8iOmAmuefpe+8ieOCkumWi+WniyAqLyBlbmFibGVNb3Rvck1lYXN1cmVtZW50OjB4RTYsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844Gu5ris5a6a5YCk5Y+W5b6X77yI6YCa55+l77yJ44KS6ZaL5aeLICovIGRpc2FibGVNb3Rvck1lYXN1cmVtZW50OjB4RTcsXG4gICAgICAgICAgICAvKiogSU1V44Gu5YCk5Y+W5b6XKOmAmuefpSnjgpLplovlp4vjgZnjgosgKi8gZW5hYmxlSU1VTWVhc3VyZW1lbnQ6MHhFQSxcbiAgICAgICAgICAgIC8qKiBJTVXjga7lgKTlj5blvpco6YCa55+lKeOCkuWBnOatouOBmeOCiyAqLyBkaXNhYmxlSU1VTWVhc3VyZW1lbnQ6MHhFQixcblxuICAgICAgICAgICAgLyoqIOOCt+OCueODhuODoOOCkuWGjei1t+WLleOBmeOCiyAqLyByZWJvb3Q6MHhGMCxcbiAgICAgICAgICAgIC8qKiDjg4Hjgqfjg4Pjgq/jgrXjg6DvvIhDUkMxNikg5pyJ5Yq55YyWICovIGVuYWJsZUNoZWNrU3VtOjB4RjMsXG4gICAgICAgICAgICAvKiog44OV44Kh44O844Og44Km44Kn44Ki44Ki44OD44OX44OH44O844OI44Oi44O844OJ44Gr5YWl44KLICovIGVudGVyRGV2aWNlRmlybXdhcmVVcGRhdGU6MHhGRFxuICAgICAgICB9O1xuICAgICAgICBPYmplY3QuZnJlZXplKHRoaXMuX01PVE9SX0NPTU1BTkQpOy8vaW5mbzo65b6M44GL44KJ44OV44Oq44O844K644GX44Gq44GE44GoanNkb2PjgYznlJ/miJDjgZXjgozjgarjgYTjgIJcblxuICAgICAgICAvL+ODouODvOOCv+ODvOOBruWFqOOCs+ODnuODs+ODie+8iOmAhuW8leeUqO+8iVxuICAgICAgICB0aGlzLl9SRVZfTU9UT1JfQ09NTUFORD17fTtcbiAgICAgICAgT2JqZWN0LmtleXModGhpcy5fTU9UT1JfQ09NTUFORCkuZm9yRWFjaCgoayk9Pnt0aGlzLl9SRVZfTU9UT1JfQ09NTUFORFt0aGlzLl9NT1RPUl9DT01NQU5EW2tdXT1rO30pO1xuICAgICAgICAvL1NlbmROb3RpZnlQcm9taXPjga7jg6rjgrnjg4hcbiAgICAgICAgdGhpcy5fbm90aWZ5UHJvbWlzTGlzdD1bXTtcbiAgICAgICAgdGhpcy5jbWRQcmVwYXJlUGxheWJhY2tNb3Rpb25fU1RBUlRfUE9TSVRJT049dGhpcy5jb25zdHJ1Y3Rvci5jbWRQcmVwYXJlUGxheWJhY2tNb3Rpb25fU1RBUlRfUE9TSVRJT047XG4gICAgICAgIHRoaXMuY21kTGVkX0xFRF9TVEFURT10aGlzLmNvbnN0cnVjdG9yLmNtZExlZF9MRURfU1RBVEU7XG4gICAgICAgIHRoaXMuY21kQ3VydmVUeXBlX0NVUlZFX1RZUEU9dGhpcy5jb25zdHJ1Y3Rvci5jbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRTtcbiAgICAgICAgdGhpcy5jbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxfTU9UT1JfTUVBU19JTlRFUlZBTD10aGlzLmNvbnN0cnVjdG9yLmNtZE1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbF9NT1RPUl9NRUFTX0lOVEVSVkFMO1xuICAgICAgICB0aGlzLmNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUw9dGhpcy5jb25zdHJ1Y3Rvci5jbWRJTVVNZWFzdXJlbWVudEludGVydmFsX0lNVV9NRUFTX0lOVEVSVkFMO1xuICAgICAgICB0aGlzLmNtZEludGVyZmFjZV9JTlRFUkZBQ0VfVFlQRT10aGlzLmNvbnN0cnVjdG9yLmNtZEludGVyZmFjZV9JTlRFUkZBQ0VfVFlQRTtcbiAgICAgICAgdGhpcy5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uPW51bGw7Ly9LTV9TVUNDRVNTX0FSUklWQUznm6PoppbnlKhcbiAgICAgICAgdGhpcy5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uVGltZU91dElkPTA7XG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gc2VjdGlvbjo6ZW50cnkgcG9pbnRcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICB0aGlzLl9jb25uZWN0VHlwZT1jb25uZWN0X3R5cGU7XG4gICAgICAgIHRoaXMuX0tNQ29tPWttY29tO1xuXG4gICAgICAgIC8v5YaF6YOo44Kk44OZ44Oz44OI44OQ44Kk44Oz44OJXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uSW5pdD0oY29ubmVjdG9yKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5pbml0LGNvbm5lY3Rvci5kZXZpY2VJbmZvKTsvL+ODh+ODkOOCpOOCueaDheWgseOCkui/lOOBmVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9LTUNvbS5vbkNvbm5lY3Q9KGNvbm5lY3Rvcik9PntcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUuY29ubmVjdCxjb25uZWN0b3IuZGV2aWNlSW5mbyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX0tNQ29tLm9uRGlzY29ubmVjdD0oY29ubmVjdG9yKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5kaXNjb25uZWN0LGNvbm5lY3Rvci5kZXZpY2VJbmZvKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fS01Db20ub25Db25uZWN0RmFpbHVyZT0oY29ubmVjdG9yLCBlcnIpPT57XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLmNvbm5lY3RGYWlsdXJlLGNvbm5lY3Rvci5kZXZpY2VJbmZvLGVycik7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zlm57ou6Lmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIHtLTVJvdFN0YXRlfSByb3RTdGF0ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fS01Db20ub25Nb3Rvck1lYXN1cmVtZW50PShyb3RTdGF0ZSk9PntcbiAgICAgICAgICAgIC8vbGV0IHJvdFN0YXRlPW5ldyBLTVN0cnVjdHVyZXMuS01Sb3RTdGF0ZShyZXMucG9zaXRpb24scmVzLnZlbG9jaXR5LHJlcy50b3JxdWUpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5tb3Rvck1lYXN1cmVtZW50LHJvdFN0YXRlKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvElNVeaDheWgseWPl+S/oVxuICAgICAgICAgKiBAcGFyYW0ge0tNSW11U3RhdGV9IGltdVN0YXRlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9LTUNvbS5vbkltdU1lYXN1cmVtZW50PShpbXVTdGF0ZSk9PntcbiAgICAgICAgICAgIC8vbGV0IGltdVN0YXRlPW5ldyBLTVN0cnVjdHVyZXMuS01JbXVTdGF0ZShyZXMuYWNjZWxYLHJlcy5hY2NlbFkscmVzLmFjY2VsWixyZXMudGVtcCxyZXMuZ3lyb1gscmVzLmd5cm9ZLHJlcy5neXJvWik7XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLmltdU1lYXN1cmVtZW50LGltdVN0YXRlKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvOODreOCsOaDheWgseWPluW+l1xuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gY21kSURcbiAgICAgICAgICogQHBhcmFtIHtLTU1vdG9yTG9nfSBtb3RvckxvZ1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fS01Db20ub25Nb3RvckxvZz0obW90b3JMb2cpPT57XG4gICAgICAgICAgICAvL+OCs+ODnuODs+ODiUlE44GL44KJ44Kz44Oe44Oz44OJ5ZCN44KS5Y+W5b6X6L+95YqgXG4gICAgICAgICAgICBsZXQgY21kTmFtZT10aGlzLl9SRVZfTU9UT1JfQ09NTUFORFttb3RvckxvZy5jbWRJRF0/dGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbbW90b3JMb2cuY21kSURdOm1vdG9yTG9nLmNtZElEO1xuICAgICAgICAgICAgbW90b3JMb2cuY21kTmFtZT1jbWROYW1lO1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5tb3RvckxvZyxtb3RvckxvZyk7XG5cbiAgICAgICAgICAgIC8vaW5mbzo65L2N572u5Yi25b6h5pmC44CB55uu5qiZ5L2N572u44Gr5Yiw6YGU5pmC44CB5Yik5a6a5p2h5Lu244KS5rqA44Gf44GX44Gf5aC05ZCI6YCa55+l44KS6KGM44GGXG4gICAgICAgICAgICBpZihtb3RvckxvZy5lcnJJRD09PTEwMCl7Ly9LTV9TVUNDRVNTX0FSUklWQUxcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24pe1xuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24udGFnTmFtZT09PW1vdG9yTG9nLmlkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi5jYWxsUmVzb2x2ZSh7aWQ6dGhpcy5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uLnRhZ05hbWUsbXNnOidQb3NpdGlvbiBBcnJpdmFsIE5vdGlmaWNhdGlvbicsaW5mbzptb3RvckxvZy5pbmZvfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi5jYWxsUmVqZWN0KHtpZDp0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24udGFnTmFtZSxtc2c6J0luc3RydWN0aW9uIG92ZXJyaWRlOicgK2NtZE5hbWUsb3ZlcnJpZGVJZDptb3RvckxvZy5pZH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHJlZ2lzdGVyQ21kXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZXNcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uTW90b3JTZXR0aW5nPShyZWdpc3RlckNtZCwgcmVzKT0+e1xuICAgICAgICAgICAgX0tNTm90aWZ5UHJvbWlzLnNlbmRHcm91cE5vdGlmeVJlc29sdmUodGhpcy5fbm90aWZ5UHJvbWlzTGlzdCxyZWdpc3RlckNtZCxyZXMpO1xuICAgICAgICB9O1xuXG4gICAgfVxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOODl+ODreODkeODhuOCo1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgajjga7mjqXntprjgYzmnInlirnjgYtcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBnZXQgaXNDb25uZWN0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9LTUNvbS5kZXZpY2VJbmZvLmlzQ29ubmVjdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICog5o6l57aa5pa55byPXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge0tNTW90b3JDb21tYW5kS01PbmUuS01fQ09OTkVDVF9UWVBFfVxuICAgICAqL1xuICAgIGdldCBjb25uZWN0VHlwZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fY29ubmVjdFR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44OH44OQ44Kk44K55oOF5aCxXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge0tNRGV2aWNlSW5mb31cbiAgICAgKi9cbiAgICBnZXQgZGV2aWNlSW5mbygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fS01Db20uZGV2aWNlSW5mbztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zlkI1cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7c3RyaW5nfVxuICAgICAqL1xuICAgIGdldCBuYW1lKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9LTUNvbS5kZXZpY2VJbmZvP3RoaXMuX0tNQ29tLmRldmljZUluZm8ubmFtZTpudWxsO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICog5o6l57aa44Kz44ON44Kv44K/44O8XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7S01Db21CYXNlfVxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBnZXQgY29ubmVjdG9yKCl7XG4gICAgICAgIHJldHVybiAgdGhpcy5fS01Db207XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogc2VjdGlvbjo644Oi44O844K/44O844Kz44Oe44Oz44OJIGh0dHBzOi8vZG9jdW1lbnQua2VpZ2FuLW1vdG9yLmNvbS9tb3Rvci1jb250cm9sLWNvbW1hbmQvbW90b3JfYWN0aW9uLmh0bWxcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zli5XkvZzjgpLkuI3oqLHlj6/jgajjgZnjgovvvIjkuIrkvY3lkb3ku6TvvIlcbiAgICAgKiBAZGVzYyDlronlhajnlKjvvJrjgZPjga7lkb3ku6TjgpLlhaXjgozjgovjgajjg6Ljg7zjgr/jg7zjga/li5XkvZzjgZfjgarjgYQ8YnI+XG4gICAgICog44Kz44Oe44Oz44OJ44Gv44K/44K544Kv44K744OD44OI44Gr6KiY6Yyy44GZ44KL44GT44Go44Gv5LiN5Y+vXG4gICAgICovXG4gICAgY21kRGlzYWJsZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZGlzYWJsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O85YuV5L2c44KS6Kix5Y+v44GZ44KL77yI5LiK5L2N5ZG95Luk77yJXG4gICAgICogQGRlc2Mg5a6J5YWo55So77ya44GT44Gu5ZG95Luk44KS5YWl44KM44KL44Go44Oi44O844K/44O844Gv5YuV5L2c5Y+v6IO944Go44Gq44KLPGJyPlxuICAgICAqIOODouODvOOCv+ODvOi1t+WLleaZguOBryBkaXNhYmxlIOeKtuaFi+OBruOBn+OCgeOAgeacrOOCs+ODnuODs+ODieOBp+WLleS9nOOCkuioseWPr+OBmeOCi+W/heimgeOBjOOBguOCijxicj5cbiAgICAgKiDjgrPjg57jg7Pjg4njga/jgr/jgrnjgq/jgrvjg4Pjg4jjgavoqJjpjLLjgZnjgovjgZPjgajjga/kuI3lj69cbiAgICAgKlxuICAgICAqL1xuICAgIGNtZEVuYWJsZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW5hYmxlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6YCf5bqm44Gu5aSn44GN44GV44KS44K744OD44OI44GZ44KL77yI5Y2Y5L2N57O777yaUlBN77yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkX3JwbSBmbG9hdCAgWzAtWCBycG1d44CAKOato+OBruaVsClcbiAgICAgKi9cbiAgICBjbWRTcGVlZF9ycG0oc3BlZWRfcnBtID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkX3JwbSowLjEwNDcxOTc1NTExOTY1OTc3LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWQsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6YCf5bqm44Gu5aSn44GN44GV44KS44K744OD44OI44GZ44KL77yI5Y2Y5L2N57O777ya44Op44K444Ki44Oz77yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIGZsb2F0IOmAn+W6puOBruWkp+OBjeOBlSDljZjkvY3vvJrop5LluqbvvIjjg6njgrjjgqLjg7PvvIkv56eSIFswLVggcnBzXeOAgCjmraPjga7mlbApXG4gICAgICovXG4gICAgY21kU3BlZWQoc3BlZWQgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOS9jee9ruOBruODl+ODquOCu+ODg+ODiOOCkuihjOOBhu+8iOWOn+eCueioreWumu+8ie+8iOWNmOS9jeezu++8muODqeOCuOOCouODs++8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBmbG9hdCDntbblr77op5LluqbvvJpyYWRpYW5zXG4gICAgICovXG4gICAgY21kUHJlc2V0UG9zaXRpb24ocG9zaXRpb24gPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoS01VdGwudG9OdW1iZXIocG9zaXRpb24pLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wcmVzZXRQb3NpdGlvbixidWZmZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDkvY3nva7jga7jg5fjg6rjgrvjg4Pjg4jjgavplqLjgZnjgotPRkZTRVTph49cbiAgICAgKiBAZGVzYyDkvY3nva7jga7jgqrjg5Xjgrvjg4Pjg4jph4/vvIhwcmVzZXRQb3NpdGlvbuOBp+ioreWumuOBl+OBn+WApOOBq+WvvuW/nO+8ieOCkuiqreOBv+WPluOCi1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGludHxBcnJheT59XG4gICAgICovXG4gICAgY21kUmVhZFBvc2l0aW9uT2Zmc2V0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZFJlYWRSZWdpc3Rlcih0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWRQb3NpdGlvbk9mZnNldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5q2j5Zue6Lui44GZ44KL77yI5Y+N5pmC6KiI5Zue44KK77yJXG4gICAgICogQGRlc2MgY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44Gn44CB5q2j5Zue6LuiXG4gICAgICovXG4gICAgY21kUnVuRm9yd2FyZCgpe1xuICAgICAgICBsZXQgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ydW5Gb3J3YXJkKTtcbiAgICAgICAgdGhpcy5fbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCk7Ly/np7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ5a6f6KGM5pmC44GuQ0Ljga5SZWplY3RcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDpgIblm57ou6LjgZnjgovvvIjmmYLoqIjlm57jgorvvIlcbiAgICAgKiBAZGVzYyBjbWRTcGVlZCDjgafkv53lrZjjgZXjgozjgZ/pgJ/luqbjgafjgIHpgIblm57ou6JcbiAgICAgKi9cbiAgICBjbWRSdW5SZXZlcnNlKCl7XG4gICAgICAgIGxldCBjaWQ9dGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJ1blJldmVyc2UpO1xuICAgICAgICB0aGlzLl9tb3ZlU3luY0luc3RydWN0aW9uT3ZlcnJpZGVSZWplY3QoY2lkKTsvL+enu+WLleezu+OBrlN5bmPjgrPjg57jg7Pjg4nlrp/ooYzmmYLjga5DQuOBrlJlamVjdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOCkuaMh+WumumAn+W6puOBp+Wbnui7ouOBleOBm+OCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCBmbG9hdCDpgJ/luqbjga7lpKfjgY3jgZUg5Y2Y5L2N77ya6KeS5bqm77yI44Op44K444Ki44Oz77yJL+enkiBbwrFYIHJwc11cbiAgICAgKi9cbiAgICBjbWRSdW4oc3BlZWQgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWQsMTApKSk7XG4gICAgICAgIGxldCBjaWQ9dGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJ1bixidWZmZXIpO1xuICAgICAgICB0aGlzLl9tb3ZlU3luY0luc3RydWN0aW9uT3ZlcnJpZGVSZWplY3QoY2lkKTsvL+enu+WLleezu+OBrlN5bmPjgrPjg57jg7Pjg4nlrp/ooYzmmYLjga5DQuOBrlJlamVjdFxuXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844KS5oyH5a6a6YCf5bqm44Gn5Zue6Lui44GV44Gb44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkX3JwbSBmbG9hdCBbwrFYIHJwbV1cbiAgICAgKi9cbiAgICBjbWRSdW5fcnBtKHNwZWVkX3JwbSA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChzcGVlZF9ycG0qMC4xMDQ3MTk3NTUxMTk2NTk3NywxMCkpO1xuICAgICAgICBsZXQgY2lkPSB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucnVuLGJ1ZmZlcik7XG4gICAgICAgIHRoaXMuX21vdmVTeW5jSW5zdHJ1Y3Rpb25PdmVycmlkZVJlamVjdChjaWQpOy8v56e75YuV57O744GuU3luY+OCs+ODnuODs+ODieWun+ihjOaZguOBrkNC44GuUmVqZWN0XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDntbblr77kvY3nva7jgavnp7vli5XjgZnjgotcbiAgICAgKiBAZGVzYyDpgJ/jgZXjga8gY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44GM5o6h55So44GV44KM44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIGZsb2F0IOinkuW6pu+8mnJhZGlhbnNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgZmxvYXQg6YCf5bqm44Gu5aSn44GN44GVIOWNmOS9je+8muinkuW6pu+8iOODqeOCuOOCouODs++8iS/np5IgWzAtWCBycHNd44CAXG4gICAgICovXG4gICAgY21kTW92ZVRvUG9zaXRpb24ocG9zaXRpb24sc3BlZWQ9bnVsbCl7XG4gICAgICAgIGlmKHBvc2l0aW9uPT09IHVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IGNpZD1udWxsO1xuICAgICAgICBpZihzcGVlZCE9PW51bGwpe1xuICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig4KTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KHBvc2l0aW9uLDEwKSk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDQscGFyc2VGbG9hdChzcGVlZCwxMCkpO1xuICAgICAgICAgICAgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlVG9Qb3NpdGlvblNwZWVkLGJ1ZmZlcik7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KHBvc2l0aW9uLDEwKSk7XG4gICAgICAgICAgICBjaWQ9dGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVUb1Bvc2l0aW9uLGJ1ZmZlcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tb3ZlU3luY0luc3RydWN0aW9uT3ZlcnJpZGVSZWplY3QoY2lkKTsvL+enu+WLleezu+OBrlN5bmPjgrPjg57jg7Pjg4nlrp/ooYzmmYLjga5DQuOBrlJlamVjdFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOe1tuWvvuS9jee9ruOBq+enu+WLleOBl+OAgeenu+WLleOBruaIkOWQpuOCkumAmuefpeOBmeOCiyAoTW90b3JGYXJtIFZlciA+PSAyLjIzKVxuICAgICAqIEBkZXNjIOmAn+OBleOBryBjbWRTcGVlZCDjgafkv53lrZjjgZXjgozjgZ/pgJ/luqbjgYzmjqHnlKjjgZXjgozjgotcbiAgICAgKiA8dWw+XG4gICAgICogICAgIDxsaT7jgZPjga7jgrPjg57jg7Pjg4nlrp/ooYzkuK3jgavliKXjga7np7vli5Xns7vjga7jgrPjg57jg7Pjg4njgpLlrp/ooYzjgZnjgovjgagnSW5zdHJ1Y3Rpb24gb3ZlcnJpZGUn44Go44GX44GmcmVqZWN044GV44KM44KLPC9saT5cbiAgICAgKiA8L3VsPlxuICAgICAqIEBleGFtcGxlXG4gICAgICogUHJvbWlzZS5yZXNvbHZlKCkudGhlbigocmVzb2x2ZSkgPT57XG4gICAgICogICAgICBrTU1vdG9yT25lLmNtZE5vdGlmeVBvc0Fycml2YWwoMSxLTVV0bC5kZWdyZWVUb1JhZGlhbigwLjUpKTsvL+WIsOmBlOOBqOWIpOWumuOBmeOCi+ebruaomeW6p+aomeOBruevhOWbsiArLTAuNeW6plxuICAgICAqICAgICAgLy/ljp/ngrnnp7vli5UgMzBycG0g44K/44Kk44Og44Ki44Km44OIIDVzXG4gICAgICogICAgICByZXR1cm4ga01Nb3Rvck9uZS5jbWRNb3ZlVG9Qb3NpdGlvblN5bmMoMCxLTUNvbm5lY3Rvci5LTVV0bC5ycG1Ub1JhZGlhblNlYygzMCksNTAwMCk7XG4gICAgICogfSkudGhlbigocmVzb2x2ZSkgPT57XG4gICAgICogICAgICAvL3Bvc2l0aW9uIEFycml2ZWRcbiAgICAgKiB9KS5jYXRjaCgoZSk9PntcbiAgICAgKiAgICAgIGNvbnNvbGUubG9nKGUpOy8vJ0luc3RydWN0aW9uIG92ZXJyaWRlJyBvciBUaW1lb3V0XG4gICAgICogfSk7XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIGZsb2F0IOinkuW6pu+8mnJhZGlhbnNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgZmxvYXQg6YCf5bqm44Gu5aSn44GN44GVIOWNmOS9je+8muinkuW6pu+8iOODqeOCuOOCouODs++8iS/np5IgWzAtWCBycHNd44CAXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXQgaW50IFswIC0geCBtc10g44OH44OV44Kp44Or44OIIDA644K/44Kk44Og44Ki44Km44OI54Sh44GXXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICAgKi9cbiAgICBjbWRNb3ZlVG9Qb3NpdGlvblN5bmMocG9zaXRpb24sc3BlZWQ9bnVsbCx0aW1lb3V0PTApe1xuICAgICAgICBpZihwb3NpdGlvbj09PSB1bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBzZWxmPXRoaXM7XG4gICAgICAgIGxldCBjaWQ9bnVsbDtcbiAgICAgICAgaWYoc3BlZWQhPT1udWxsKXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoOCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChwb3NpdGlvbiwxMCkpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMig0LHBhcnNlRmxvYXQoc3BlZWQsMTApKTtcbiAgICAgICAgICAgIGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZVRvUG9zaXRpb25TcGVlZCxidWZmZXIpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChwb3NpdGlvbiwxMCkpO1xuICAgICAgICAgICAgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlVG9Qb3NpdGlvbixidWZmZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCk7Ly/np7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ5a6f6KGM5pmC44GuQ0Ljga5SZWplY3RcblxuICAgICAgICAvL+aIkOWQpuOBruaNleaNiVxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICAgICAgICBsZXQgdG09IE1hdGguYWJzKHBhcnNlSW50KHRpbWVvdXQpKTtcbiAgICAgICAgICAgIHNlbGYuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbj1uZXcgX0tNTm90aWZ5UHJvbWlzKGNpZCxcImNtZE1vdmVUb1Bvc2l0aW9uU3luY1wiLG51bGwscmVzb2x2ZSxyZWplY3QsdG0pOy8vbm90aWZ557WM55Sx44GuS01fU1VDQ0VTU19BUlJJVkFM44KSUHJvbWlz44Go57SQ5LuY44GRXG4gICAgICAgICAgICBpZih0bSl7XG4gICAgICAgICAgICAgICAgc2VsZi5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uLnN0YXJ0UmVqZWN0VGltZU91dENvdW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOebuOWvvuS9jee9ruOBq+enu+WLleOBmeOCi1xuICAgICAqIEBkZXNjIOmAn+OBleOBryBjbWRTcGVlZCDjgafkv53lrZjjgZXjgozjgZ/pgJ/luqbjgYzmjqHnlKjjgZXjgozjgotcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGRpc3RhbmNlIGZsb2F0IOinkuW6pu+8mnJhZGlhbnNb5bemOityYWRpYW5zIOWPszotcmFkaWFuc11cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgZmxvYXQg6YCf5bqm44Gu5aSn44GN44GVIOWNmOS9je+8muinkuW6pu+8iOODqeOCuOOCouODs++8iS/np5IgWzAtWCBycHNd44CAKOato+OBruaVsClcbiAgICAgKi9cbiAgICBjbWRNb3ZlQnlEaXN0YW5jZShkaXN0YW5jZSA9IDAsc3BlZWQ9bnVsbCl7XG4gICAgICAgIGxldCBjaWQ9bnVsbDtcbiAgICAgICAgaWYoc3BlZWQhPT1udWxsKXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoOCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChkaXN0YW5jZSwxMCkpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMig0LHBhcnNlRmxvYXQoc3BlZWQsMTApKTtcbiAgICAgICAgICAgIGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZUJ5RGlzdGFuY2VTcGVlZCxidWZmZXIpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChkaXN0YW5jZSwxMCkpO1xuICAgICAgICAgICAgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlQnlEaXN0YW5jZSxidWZmZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCk7Ly/np7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ5a6f6KGM5pmC44GuQ0Ljga5SZWplY3RcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDnm7jlr77kvY3nva7jgavnp7vli5XjgZfjgIHnp7vli5Xjga7miJDlkKbjgpLpgJrnn6XjgZnjgosgKE1vdG9yRmFybSBWZXIgPj0gMi4yMylcbiAgICAgKiBAZGVzYyDpgJ/jgZXjga8gY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44GM5o6h55So44GV44KM44KLXG4gICAgICogPHVsPlxuICAgICAqICAgICA8bGk+44GT44Gu44Kz44Oe44Oz44OJ5a6f6KGM5Lit44Gr5Yil44Gu56e75YuV57O744Gu44Kz44Oe44Oz44OJ44KS5a6f6KGM44GZ44KL44GoJ0luc3RydWN0aW9uIG92ZXJyaWRlJ+OBqOOBl+OBpnJlamVjdOOBleOCjOOCizwvbGk+XG4gICAgICogPC91bD5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKHJlc29sdmUpID0+e1xuICAgICAqICAgICAga01Nb3Rvck9uZS5jbWROb3RpZnlQb3NBcnJpdmFsKDEsS01VdGwuZGVncmVlVG9SYWRpYW4oMC41KSk7Ly/liLDpgZTjgajliKTlrprjgZnjgovnm67mqJnluqfmqJnjga7nr4Tlm7IgKy0wLjXluqZcbiAgICAgKiAgICAgIC8vMzYw5bqm55u45a++56e75YuVIDMwcnBtIOOCv+OCpOODoOOCouOCpuODiOeEoeOBl1xuICAgICAqICAgICAgcmV0dXJuIGtNTW90b3JPbmUuY21kTW92ZUJ5RGlzdGFuY2VTeW5jKEtNQ29ubmVjdG9yLktNVXRsLmRlZ3JlZVRvUmFkaWFuKDM2MCksS01Db25uZWN0b3IuS01VdGwucnBtVG9SYWRpYW5TZWMoMzApKTtcbiAgICAgKiB9KS50aGVuKChyZXNvbHZlKSA9PntcbiAgICAgKiAgICAgIC8vcG9zaXRpb24gQXJyaXZlZFxuICAgICAqIH0pLmNhdGNoKChlKT0+e1xuICAgICAqICAgICAgY29uc29sZS5sb2coZSk7Ly8nSW5zdHJ1Y3Rpb24gb3ZlcnJpZGUnIG9yIFRpbWVvdXRcbiAgICAgKiB9KTtcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGRpc3RhbmNlIGZsb2F0IOinkuW6pu+8mnJhZGlhbnNb5bemOityYWRpYW5zIOWPszotcmFkaWFuc11cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgZmxvYXQg6YCf5bqm44Gu5aSn44GN44GVIOWNmOS9je+8muinkuW6pu+8iOODqeOCuOOCouODs++8iS/np5IgWzAtWCBycHNd44CAKOato+OBruaVsClcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZW91dCBpbnQgWzAgLSB4IG1zXSDjg4fjg5Xjgqnjg6vjg4ggMDrjgr/jgqTjg6DjgqLjgqbjg4jnhKHjgZdcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fVxuICAgICAqL1xuICAgIGNtZE1vdmVCeURpc3RhbmNlU3luYyhkaXN0YW5jZSA9IDAsc3BlZWQ9bnVsbCx0aW1lb3V0PTApe1xuICAgICAgICBsZXQgc2VsZj10aGlzO1xuICAgICAgICBsZXQgY2lkPW51bGw7XG4gICAgICAgIGlmKHNwZWVkIT09bnVsbCl7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDgpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoZGlzdGFuY2UsMTApKTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoNCxwYXJzZUZsb2F0KHNwZWVkLDEwKSk7XG4gICAgICAgICAgICBjaWQ9dGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVCeURpc3RhbmNlU3BlZWQsYnVmZmVyKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoZGlzdGFuY2UsMTApKTtcbiAgICAgICAgICAgIGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZUJ5RGlzdGFuY2UsYnVmZmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vdmVTeW5jSW5zdHJ1Y3Rpb25PdmVycmlkZVJlamVjdChjaWQpOy8v56e75YuV57O744GuU3luY+OCs+ODnuODs+ODieWun+ihjOaZguOBrkNC44GuUmVqZWN0XG5cbiAgICAgICAgLy/miJDlkKbjga7mjZXmjYlcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgbGV0IHRtPSBNYXRoLmFicyhwYXJzZUludCh0aW1lb3V0KSk7XG4gICAgICAgICAgICBzZWxmLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb249bmV3IF9LTU5vdGlmeVByb21pcyhjaWQsXCJjbWRNb3ZlQnlEaXN0YW5jZVN5bmNcIixudWxsLHJlc29sdmUscmVqZWN0LHRtKTtcbiAgICAgICAgICAgIGlmKHRtKXtcbiAgICAgICAgICAgICAgICBzZWxmLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24uc3RhcnRSZWplY3RUaW1lT3V0Q291bnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruWKseejgeOCkuWBnOatouOBmeOCi++8iOaEn+inpuOBr+aui+OCiuOBvuOBme+8iVxuICAgICAqIEBkZXNjIOWujOWFqOODleODquODvOeKtuaFi+OCkuWGjeePvuOBmeOCi+WgtOWQiOOBr+OAgSBjbWRGcmVlKCkuY21kRGlzYWJsZSgpIOOBqOOBl+OBpuS4i+OBleOBhOOAglxuICAgICAqL1xuICAgIGNtZEZyZWUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmZyZWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOCkumAn+W6puOCvOODreOBvuOBp+a4m+mAn+OBl+WBnOatouOBmeOCi1xuICAgICAqIEBkZXNjIHJwbSA9IDAg44Go44Gq44KL44CCXG4gICAgICovXG4gICAgY21kU3RvcCgpe1xuICAgICAgICBsZXQgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdG9wKTtcbiAgICAgICAgdGhpcy5fbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCk7Ly/np7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ5a6f6KGM5pmC44GuQ0Ljga5SZWplY3RcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg4jjg6vjgq/liLblvqHjgpLooYzjgYZcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9ycXVlIGZsb2F0IOODiOODq+OCryDljZjkvY3vvJpO44O7bSBbLVggfiArIFggTm1dIOaOqOWlqOWApCAwLjMtMC4wNVxuICAgICAqIEBkZXNjIOmAn+W6puOChOS9jee9ruOCkuWQjOaZguOBq+WItuW+oeOBmeOCi+WgtOWQiOOBr+OAgeODouODvOOCv+ODvOioreWumuOBriAweDBFOiBtYXhUb3JxdWUg44GoIDB4NjA6IHJ1bkZvcndhcmQg562J44KS5L2155So44GX44Gm5LiL44GV44GE44CCXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRIb2xkVG9ycXVlKHRvcnF1ZSl7XG4gICAgICAgIGlmKHRvcnF1ZT09PXVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQodG9ycXVlLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ob2xkVG9ycXVlLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6KiY5oa244GX44Gf44K/44K544Kv77yI5ZG95Luk77yJ44Gu44K744OD44OI44KS5a6f6KGM44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjgr/jgrnjgq/jgrvjg4Pjg4jnlarlj7fvvIgw772eNjU1MzXvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVwZWF0aW5nIGludCDnubDjgorov5TjgZflm57mlbAgMOOBr+eEoeWItumZkFxuICAgICAqXG4gICAgICogQGRlc2MgS00tMSDjga8gaW5kZXg6IDB+NDkg44G+44Gn44CC77yINTDlgIvjga7jg6Hjg6Ljg6rjg5Djg7Pjgq8g5ZCEODEyOCBCeXRlIOOBvuOBp+WItumZkOOBguOCiu+8iTxicj5cbiAgICAgKiDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLjga/jgIHjgrPjg57jg7Pjg4nvvIjjgr/jgrnjgq/jgrvjg4Pjg4jvvInjgpLlj4LnhafkuIvjgZXjgYTjgIIgaHR0cHM6Ly9kb2N1bWVudC5rZWlnYW4tbW90b3IuY29tL21vdG9yLWNvbnRyb2wtY29tbWFuZC90YXNrc2V0Lmh0bWxcbiAgICAgKi9cbiAgICBjbWRTdGFydERvaW5nVGFza3NldChpbmRleCA9IDAscmVwZWF0aW5nID0gMSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4KSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMixNYXRoLmFicyhwYXJzZUludChyZXBlYXRpbmcpKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdGFydERvaW5nVGFza3NldCxidWZmZXIpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgr/jgrnjgq/jgrvjg4Pjg4jjgpLlgZzmraJcbiAgICAgKiBAZGVzYyDjgr/jgrnjgq/jgrvjg4Pjg4jjga7lho3nlJ/jgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRTdG9wRG9pbmdUYXNrc2V0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdG9wRG9pbmdUYXNrc2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgrfjg6fjg7PjgpLlho3nlJ/vvIjmupblgpnjgarjgZfvvIlcbiAgICAgKiBAZGVzYyDjg6Ljg7zjgrfjg6fjg7Pjga7jg5fjg6zjgqTjg5Djg4Pjgq/jgpLvvIjmupblgpnjgarjgZfjgafvvInjg5fjg6zjgqTjg5Djg4Pjgq/plovlp4vjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOODouODvOOCt+ODp+ODs+eVquWPt++8iDDvvZ42NTUzNe+8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZXBlYXRpbmcgaW50IOe5sOOCiui/lOOBl+WbnuaVsCAw44Gv54Sh5Yi26ZmQXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLmNtZFByZXBhcmVQbGF5YmFja01vdGlvbl9TVEFSVF9QT1NJVElPTn0gc3RhcnRfcG9zaXRpb24gaW50IOOCueOCv+ODvOODiOS9jee9ruOBruioreWumjxicj5cbiAgICAgKiBTVEFSVF9QT1NJVElPTl9BQlM66KiY5oa244GV44KM44Gf6ZaL5aeL5L2N572u77yI57W25a++5bqn5qiZ77yJ44GL44KJ44K544K/44O844OIPGJyPlxuICAgICAqIFNUQVJUX1BPU0lUSU9OX0NVUlJFTlQ654++5Zyo44Gu5L2N572u44KS6ZaL5aeL5L2N572u44Go44GX44Gm44K544K/44O844OIXG4gICAgICovXG4gICAgY21kU3RhcnRQbGF5YmFja01vdGlvbihpbmRleCA9IDAscmVwZWF0aW5nID0gMCxzdGFydF9wb3NpdGlvbiA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDcpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDIsTWF0aC5hYnMocGFyc2VJbnQocmVwZWF0aW5nKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCg2LE1hdGguYWJzKHBhcnNlSW50KHN0YXJ0X3Bvc2l0aW9uKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnRQbGF5YmFja01vdGlvbixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCt+ODp+ODs+WGjeeUn+OCkuWBnOatouOBmeOCi1xuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBjbWRTdG9wUGxheWJhY2tNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3BQbGF5YmFja01vdGlvbik7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIHNlY3Rpb246OuOCreODpeODvOaTjeS9nFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgq3jg6Xjg7zjgpLkuIDmmYLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRQYXVzZVF1ZXVlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wYXVzZVF1ZXVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgq3jg6Xjg7zjgpLlho3plovjgZnjgovvvIjok4TnqY3jgZXjgozjgZ/jgr/jgrnjgq/jgpLlho3plovvvIlcbiAgICAgKi9cbiAgICBjbWRSZXN1bWVRdWV1ZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzdW1lUXVldWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCreODpeODvOOCkuaMh+WumuaZgumWk+WBnOatouOBl+WGjemWi+OBmeOCi1xuICAgICAqIEBkZXNjIGNtZFBhdXNl77yI44Kt44Ol44O85YGc5q2i77yJ44KS5a6f6KGM44GX44CB5oyH5a6a5pmC6ZaT77yI44Of44Oq56eS77yJ57WM6YGO5b6M44CB6Ieq5YuV55qE44GrIGNtZFJlc3VtZe+8iOOCreODpeODvOWGjemWi++8iSDjgpLooYzjgYTjgb7jgZnjgIJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZSDlgZzmraLmmYLplpNbbXNlY11cbiAgICAgKi9cbiAgICBjbWRXYWl0UXVldWUodGltZSA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMCxNYXRoLmFicyhwYXJzZUludCh0aW1lKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQud2FpdFF1ZXVlLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Kt44Ol44O844KS44Oq44K744OD44OI44GZ44KLXG4gICAgICovXG4gICAgY21kUmVzZXRRdWV1ZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzZXRRdWV1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu54q25oWL44KS6Kqt44G/5Y+W44KLIO+8iHJlYWTlsILnlKjvvIlcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxpbnR8QXJyYXk+fVxuICAgICAqL1xuICAgIGNtZFJlYWRTdGF0dXMoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kUmVhZFJlZ2lzdGVyKHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZFN0YXR1cyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIHNlY3Rpb246OuOCv+OCueOCr+OCu+ODg+ODiFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCv+OCueOCr++8iOWRveS7pO+8ieOBruOCu+ODg+ODiOOBruiomOmMsuOCkumWi+Wni+OBmeOCi1xuICAgICAqIEBkZXNjIOiomOaGtuOBmeOCi+OCpOODs+ODh+ODg+OCr+OCueOBruODoeODouODquOBr+OCs+ODnuODs+ODie+8mmVyYXNlVGFza3NldCDjgavjgojjgorkuojjgoHmtojljrvjgZXjgozjgabjgYTjgovlv4XopoHjgYzjgYLjgopcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuSBLTS0xIOOBruWgtOWQiOOAgeOCpOODs+ODh+ODg+OCr+OCueOBruWApOOBryAw772eNDkg77yI6KiINTDlgIvoqJjpjLLvvIlcbiAgICAgKi9cbiAgICBjbWRTdGFydFJlY29yZGluZ1Rhc2tTZXQoaW5kZXggPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgpKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdGFydFJlY29yZGluZ1Rhc2tzZXQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLjgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRTdG9wUmVjb3JkaW5nVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcFJlY29yZGluZ1Rhc2tzZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOaMh+WumuOBruOCpOODs+ODh+ODg+OCr+OCueOBruOCv+OCueOCr+OCu+ODg+ODiOOCkua2iOWOu+OBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBpbnQg44Kk44Oz44OH44OD44Kv44K5XG4gICAgICovXG4gICAgY21kRXJhc2VUYXNrc2V0KGluZGV4ID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4KSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZXJhc2VUYXNrc2V0LGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu44K/44K544Kv44K744OD44OI44KS5raI5Y6744GZ44KLXG4gICAgICovXG4gICAgY21kRXJhc2VBbGxUYXNrc2V0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZUFsbFRhc2tzZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuWQjeioreWumlxuICAgICAqIEBkZXNjIOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuWQjeOCkuioreWumuOBmeOCi+OAgu+8iOOBk+OCjOOBi+OCieiomOmMsuOBmeOCi+OCguOBruOBq+WvvuOBl+OBpu+8iVxuICAgICAqL1xuICAgIGNtZFNldFRhc2tzZXROYW1lKG5hbWUpe1xuICAgICAgICBsZXQgYnVmZmVyPSAobmV3IFVpbnQ4QXJyYXkoW10ubWFwLmNhbGwobmFtZSwgZnVuY3Rpb24oYykge1xuICAgICAgICAgICAgcmV0dXJuIGMuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgfSkpKS5idWZmZXI7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zZXRUYXNrc2V0TmFtZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBzZWN0aW9uOjrjg4bjgqPjg7zjg4Hjg7PjgrBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OA44Kk44Os44Kv44OI44OG44Kj44O844OB44Oz44Kw6ZaL5aeL77yI5rqW5YKZ44Gq44GX77yJXG4gICAgICogQGRlc2MgS00tMSDjga7loLTlkIjjgIHjgqTjg7Pjg4fjg4Pjgq/jgrnjga7lgKTjga8gMO+9njE5IO+8iOioiDIw5YCL6KiY6Yyy77yJ44Go44Gq44KL44CC6KiY6Yyy5pmC6ZaT44GvIDY1NDA4IFttc2VjXSDjgpLotoXjgYjjgovjgZPjgajjga/jgafjgY3jgarjgYRcbiAgICAgKiAgICAgICDoqJjmhrbjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjga7jg6Hjg6Ljg6rjga9ibGVFcmFzZU1vdGlvbiDjgavjgojjgorkuojjgoHmtojljrvjgZXjgozjgabjgYTjgovlv4XopoHjgYzjgYLjgotcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBpbnQg44Kk44Oz44OH44OD44Kv44K5IFswLTE5XVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lIGludCDoqJjpjLLmmYLplpMgW21zZWMgMC02NTQwOF1cbiAgICAgKi9cbiAgICBjbWRTdGFydFRlYWNoaW5nTW90aW9uKGluZGV4ID0gMCxsZW5ndGhSZWNvcmRpbmdUaW1lID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4KSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMixNYXRoLmFicyhwYXJzZUludChsZW5ndGhSZWNvcmRpbmdUaW1lKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnRUZWFjaGluZ01vdGlvbixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWun+ihjOS4reOBruODhuOCo+ODvOODgeODs+OCsOOCkuWBnOatouOBmeOCi1xuICAgICAqL1xuICAgIGNtZFN0b3BUZWFjaGluZ01vdGlvbigpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcFRlYWNoaW5nTW90aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjgZfjgZ/jgqTjg7Pjg4fjg4Pjgq/jgrnjga7jg6Ljg7zjgrfjg6fjg7PjgpLmtojljrvjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAqXG4gICAgICogQGRlc2MgS00tMSDjga7loLTlkIjjgIHjgqTjg7Pjg4fjg4Pjgq/jgrnjga7lgKTjga8gMO+9njE5IO+8iOioiDIw5YCL6KiY6Yyy77yJ44Go44Gq44KLXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRFcmFzZU1vdGlvbihpbmRleCA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlTW90aW9uLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu44Oi44O844K344On44Oz44KS5raI5Y6744GZ44KLXG4gICAgICovXG4gICAgY21kRXJhc2VBbGxNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlQWxsTW90aW9uKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo6TEVEXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IExFROOBrueCueeBr+eKtuaFi+OCkuOCu+ODg+ODiOOBmeOCi1xuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRMZWRfTEVEX1NUQVRFfSBjbWRMZWRfTEVEX1NUQVRFIGludCDngrnnga/nirbmhYs8YnI+XG4gICAgICogICBMRURfU1RBVEVfT0ZGOkxFROa2iOeBrzxicj5cbiAgICAgKiAgIExFRF9TVEFURV9PTl9TT0xJRDpMRUTngrnnga88YnI+XG4gICAgICogICBMRURfU1RBVEVfT05fRkxBU0g6TEVE54K55ruF77yI5LiA5a6a6ZaT6ZqU44Gn54K55ruF77yJPGJyPlxuICAgICAqICAgTEVEX1NUQVRFX09OX0RJTTpMRUTjgYzjgobjgaPjgY/jgormmI7mu4XjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVkIGludCAwLTI1NVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBncmVlbiBpbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmx1ZSBpbnQgMC0yNTVcbiAgICAgKi9cbiAgICBjbWRMZWQoY21kTGVkX0xFRF9TVEFURSxyZWQsZ3JlZW4sYmx1ZSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsTWF0aC5hYnMocGFyc2VJbnQoY21kTGVkX0xFRF9TVEFURSkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMSxNYXRoLmFicyhwYXJzZUludChyZWQpKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDIsTWF0aC5hYnMocGFyc2VJbnQoZ3JlZW4pKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDMsTWF0aC5hYnMocGFyc2VJbnQoYmx1ZSkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmxlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBJTVUg44K444Oj44Kk44OtXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSU1VKOOCuOODo+OCpOODrSnjga7lgKTlj5blvpco6YCa55+lKeOCkumWi+Wni+OBmeOCi1xuICAgICAqIEBkZXNjIOacrOOCs+ODnuODs+ODieOCkuWun+ihjOOBmeOCi+OBqOOAgUlNVeOBruODh+ODvOOCv+OBr0JMReOBruOCreODo+ODqeOCr+OCv+ODquOCueODhuOCo+OCr+OCuU1PVE9SX0lNVV9NRUFTVVJFTUVOVOOBq+mAmuefpeOBleOCjOOCizxicj5cbiAgICAgKiBNT1RPUl9JTVVfTUVBU1VSRU1FTlTjga5ub3RpZnnjga/jgqTjg5njg7Pjg4jjgr/jgqTjg5cgS01Nb3RvckNvbW1hbmRLTU9uZS5FVkVOVF9UWVBFLmltdU1lYXN1cmVtZW50IOOBq+mAmuefpVxuICAgICAqL1xuICAgIGNtZEVuYWJsZUlNVU1lYXN1cmVtZW50KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lbmFibGVJTVVNZWFzdXJlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSU1VKOOCuOODo+OCpOODrSnjga7lgKTlj5blvpco6YCa55+lKeOCkuWBnOatouOBmeOCi1xuICAgICAqL1xuICAgIGNtZERpc2FibGVJTVVNZWFzdXJlbWVudCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZGlzYWJsZUlNVU1lYXN1cmVtZW50KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gSU1VIOODouODvOOCv+ODvFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7muKzlrprlgKTvvIjkvY3nva7jg7vpgJ/luqbjg7vjg4jjg6vjgq/vvInlh7rlipvjgpLplovlp4vjgZnjgotcbiAgICAgKiBAZGVzYyDjg4fjg5Xjgqnjg6vjg4jjgafjga/jg6Ljg7zjgr/jg7zotbfli5XmmYJvbuOAgiBtb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0KCkg5Y+C54WnXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIGNtZEVuYWJsZU1vdG9yTWVhc3VyZW1lbnQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVuYWJsZU1vdG9yTWVhc3VyZW1lbnQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7muKzlrprlgKTvvIjkvY3nva7jg7vpgJ/luqbjg7vjg4jjg6vjgq/vvInlh7rlipvjgpLlgZzmraLjgZnjgotcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgY21kRGlzYWJsZU1vdG9yTWVhc3VyZW1lbnQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmRpc2FibGVNb3Rvck1lYXN1cmVtZW50KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8g44K344K544OG44OgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCt+OCueODhuODoOOCkuWGjei1t+WLleOBmeOCi1xuICAgICAqIEBkZXNjIEJMReOBq+aOpee2muOBl+OBpuOBhOOBn+WgtOWQiOOAgeWIh+aWreOBl+OBpuOBi+OCieWGjei1t+WLlVxuICAgICAqL1xuICAgIGNtZFJlYm9vdCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVib290KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OB44Kn44OD44Kv44K144Og77yIQ1JDMTYpIOacieWKueWMllxuICAgICAqIEBkZXNjIOOCs+ODnuODs+ODie+8iOOCv+OCueOCr++8ieOBruODgeOCp+ODg+OCr+OCteODoOOCkuacieWKueWMluOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpc0VuYWJsZWQgMDpEaXNibGVkLCAxOkVuYWJsZWRcbiAgICAgKi9cbiAgICBjbWRFbmFibGVDaGVja1N1bShpc0VuYWJsZWQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLGlzRW5hYmxlZD8xOjApO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW5hYmxlQ2hlY2tTdW0sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg5XjgqHjg7zjg6DjgqbjgqfjgqLjgqLjg4Pjg5fjg4fjg7zjg4jjg6Ljg7zjg4njgavlhaXjgotcbiAgICAgKiBAZGVzYyDjg5XjgqHjg7zjg6DjgqbjgqfjgqLjgpLjgqLjg4Pjg5fjg4fjg7zjg4jjgZnjgovjgZ/jgoHjga7jg5bjg7zjg4jjg63jg7zjg4Djg7zjg6Ljg7zjg4njgavlhaXjgovjgILvvIjjgrfjgrnjg4bjg6Djga/lho3otbfli5XjgZXjgozjgovjgILvvIlcbiAgICAgKi9cbiAgICBjbWRFbnRlckRldmljZUZpcm13YXJlVXBkYXRlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lbnRlckRldmljZUZpcm13YXJlVXBkYXRlKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8g44Oi44O844K/44O86Kit5a6a44CATU9UT1JfU0VUVElOR1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7mnIDlpKfpgJ/jgZXjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4U3BlZWQgZmxvYXQg5pyA5aSn6YCf44GVIFtyYWRpYW4gLyBzZWNvbmRd77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kTWF4U3BlZWQobWF4U3BlZWQpe1xuICAgICAgICBpZihtYXhTcGVlZD09PXVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQobWF4U3BlZWQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tYXhTcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruacgOWwj+mAn+OBleOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhTcGVlZCBmbG9hdCDmnIDlsI/pgJ/jgZUgW3JhZGlhbiAvIHNlY29uZF3vvIjmraPjga7lgKTvvIlcbiAgICAgKiBAZGVzYyBtaW5TcGVlZCDjga/jgIFibGVQcmVwYXJlUGxheWJhY2tNb3Rpb24g5a6f6KGM44Gu6Zqb44CB6ZaL5aeL5Zyw54K544Gr56e75YuV44GZ44KL6YCf44GV44Go44GX44Gm5L2/55So44GV44KM44KL44CC6YCa5bi45pmC6YGL6Lui44Gn44Gv5L2/55So44GV44KM44Gq44GE44CCXG4gICAgICovXG4gICAgY21kTWluU3BlZWQobWluU3BlZWQpe1xuICAgICAgICBpZihtaW5TcGVlZD09PXVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQobWluU3BlZWQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5taW5TcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWKoOa4m+mAn+absue3muOCkuaMh+WumuOBmeOCi++8iOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODq+OBruioreWumu+8iVxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRX0gY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUgaW50IOWKoOa4m+mAn+OCq+ODvOODluOCquODl+OCt+ODp+ODszxicj5cbiAgICAgKiAgICAgIENVUlZFX1RZUEVfTk9ORTowIOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPRkY8YnI+XG4gICAgICogICAgICBDVVJWRV9UWVBFX1RSQVBFWk9JRDoxIOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPTiDvvIjlj7DlvaLliqDmuJvpgJ/vvIlcbiAgICAgKi9cbiAgICBjbWRDdXJ2ZVR5cGUoY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxNYXRoLmFicyhwYXJzZUludChjbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRSkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmN1cnZlVHlwZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruWKoOmAn+W6puOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY2MgZmxvYXQg5Yqg6YCf5bqmIDAtMjAwIFtyYWRpYW4gLyBzZWNvbmReMl3vvIjmraPjga7lgKTvvIlcbiAgICAgKiBAZGVzYyBhY2Mg44Gv44CB44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9OIOOBruWgtOWQiOOAgeWKoOmAn+aZguOBq+S9v+eUqOOBleOCjOOBvuOBmeOAgu+8iOWKoOmAn+aZguOBruebtOe3muOBruWCvuOBje+8iVxuICAgICAqL1xuICAgIGNtZEFjYyhhY2MgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoYWNjLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuYWNjLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5rib6YCf5bqm44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlYyBmbG9hdCDmuJvpgJ/luqYgMC0yMDAgW3JhZGlhbiAvIHNlY29uZF4yXe+8iOato+OBruWApO+8iVxuICAgICAqIEBkZXNjIGRlYyDjga/jgIHjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT04g44Gu5aC05ZCI44CB5rib6YCf5pmC44Gr5L2/55So44GV44KM44G+44GZ44CC77yI5rib6YCf5pmC44Gu55u057ea44Gu5YK+44GN77yJXG4gICAgICovXG4gICAgY21kRGVjKGRlYyA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChkZWMsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5kZWMsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7mnIDlpKfjg4jjg6vjgq/vvIjntbblr77lgKTvvInjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4VG9ycXVlIGZsb2F0IOacgOWkp+ODiOODq+OCryBbTiptXe+8iOato+OBruWApO+8iVxuICAgICAqXG4gICAgICogQGRlc2MgbWF4VG9ycXVlIOOCkuioreWumuOBmeOCi+OBk+OBqOOBq+OCiOOCiuOAgeODiOODq+OCr+OBrue1tuWvvuWApOOBjCBtYXhUb3JxdWUg44KS6LaF44GI44Gq44GE44KI44GG44Gr6YGL6Lui44GX44G+44GZ44CCPGJyPlxuICAgICAqIG1heFRvcnF1ZSA9IDAuMSBbTiptXSDjga7lvozjgasgcnVuRm9yd2FyZCDvvIjmraPlm57ou6LvvInjgpLooYzjgaPjgZ/loLTlkIjjgIEwLjEgTiptIOOCkui2heOBiOOBquOBhOOCiOOBhuOBq+OBneOBrumAn+W6puOCkuOBquOCi+OBoOOBkee2reaMgeOBmeOCi+OAgjxicj5cbiAgICAgKiDjgZ/jgaDjgZfjgIHjg4jjg6vjgq/jga7mnIDlpKflgKTliLbpmZDjgavjgojjgorjgIHjgrfjgrnjg4bjg6DjgavjgojjgaPjgabjga/liLblvqHmgKfvvIjmjK/li5XvvInjgYzmgqrljJbjgZnjgovlj6/og73mgKfjgYzjgYLjgovjgIJcbiAgICAgKlxuICAgICAqL1xuICAgIGNtZE1heFRvcnF1ZShtYXhUb3JxdWUpe1xuICAgICAgICBpZihtYXhUb3JxdWU9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KG1heFRvcnF1ZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1heFRvcnF1ZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODgOOCpOODrOOCr+ODiOODhuOCo+ODvOODgeODs+OCsOOBruOCteODs+ODl+ODquODs+OCsOmWk+malFxuICAgICAqIEBkZXNjIOODhuOCo+ODvOODgeODs+OCsOODu+ODl+ODrOOCpOODkOODg+OCr+OBruWun+ihjOmWk+malFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbnRlcnZhbCBtc++8iDItMTAwMCAgMCwgMW1z44Gv44Ko44Op44O844Go44Gq44KL77yJXG4gICAgICovXG4gICAgY21kVGVhY2hpbmdJbnRlcnZhbChpbnRlcnZhbCl7XG4gICAgICAgIGlmKGludGVydmFsPT09dW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgX2ludGVydmFsPU1hdGguYWJzKHBhcnNlSW50KGludGVydmFsKSk7XG4gICAgICAgIF9pbnRlcnZhbD1faW50ZXJ2YWw8Mj8yOl9pbnRlcnZhbDtcbiAgICAgICAgX2ludGVydmFsPV9pbnRlcnZhbD4xMDAwPzEwMDA6X2ludGVydmFsO1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMCxfaW50ZXJ2YWwpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQudGVhY2hpbmdJbnRlcnZhbCxidWZmZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDoqJjmhrblho3nlJ/mmYLjga7lho3nlJ/plpPpmpRcbiAgICAgKiBAZGVzYyAg6KiY5oa25YaN55Sf5pmC44Gu5YaN55Sf6ZaT6ZqUXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGludGVydmFsIG1z77yIMi0xMDAwICAwLCAxbXPjga/jgqjjg6njg7zjgajjgarjgovvvIlcbiAgICAgKi9cbiAgICBjbWRQbGF5YmFja0ludGVydmFsKGludGVydmFsKXtcbiAgICAgICAgaWYoaW50ZXJ2YWw9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBfaW50ZXJ2YWw9TWF0aC5hYnMocGFyc2VJbnQoaW50ZXJ2YWwpKTtcbiAgICAgICAgX2ludGVydmFsPV9pbnRlcnZhbDwyPzI6X2ludGVydmFsO1xuICAgICAgICBfaW50ZXJ2YWw9X2ludGVydmFsPjEwMDA/MTAwMDpfaW50ZXJ2YWw7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQzMigwLF9pbnRlcnZhbCk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wbGF5YmFja0ludGVydmFsLGJ1ZmZlcik7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga5x6Lu46Zu75rWBUElE44Kz44Oz44OI44Ot44O844Op44GuUO+8iOavlOS+i++8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBxQ3VycmVudFAgZmxvYXQgcembu+a1gVDjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRRQ3VycmVudFAocUN1cnJlbnRQKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQocUN1cnJlbnRQLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucUN1cnJlbnRQLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrlDvvIjmr5TkvovvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcUN1cnJlbnRJIGZsb2F0IHHpm7vmtYFJ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUUN1cnJlbnRJKHFDdXJyZW50SSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHFDdXJyZW50SSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnFDdXJyZW50SSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5E77yI5b6u5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHFDdXJyZW50RCBmbG9hdCBx6Zu75rWBROOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFFDdXJyZW50RChxQ3VycmVudEQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChxQ3VycmVudEQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5xQ3VycmVudEQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga5x6Lu46Zu75rWBUElE44Kz44Oz44OI44Ot44O844Op44GuRO+8iOW+ruWIhu+8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZFAgZmxvYXQg6YCf5bqmUOOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFNwZWVkUChzcGVlZFApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChzcGVlZFAsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZFAsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7pgJ/luqZQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5J77yI56mN5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkSSBmbG9hdCDpgJ/luqZJ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kU3BlZWRJKHNwZWVkSSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkSSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNwZWVkSSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrumAn+W6plBJROOCs+ODs+ODiOODreODvOODqeOBrkTvvIjlvq7liIbvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWREIGZsb2F0IOmAn+W6pkTjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRTcGVlZEQoc3BlZWREKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWRELDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWRELGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5L2N572u5Yi25b6hUOODkeODqeODoeOCv+OCkuOCu+ODg+ODiFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvblAgZmxvYXQgWzEuMDAwMCAtIDIwLjAwMDBd77yI44OH44OV44Kp44Or44OIIDUuMO+8iVxuICAgICAqL1xuICAgIGNtZFBvc2l0aW9uUChwb3NpdGlvblApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChwb3NpdGlvblAsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wb3NpdGlvblAsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5L2N572u5Yi25b6hSeODkeODqeODoeOCv+OCkuOCu+ODg+ODiFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbkkgZmxvYXQgWzEuMDAwMCAtIDEwMC4wMDAwXe+8iOODh+ODleOCqeODq+ODiCAxMC4w77yJXG4gICAgICovXG4gICAgY21kUG9zaXRpb25JKHBvc2l0aW9uSSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHBvc2l0aW9uSSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnBvc2l0aW9uSSxidWZmZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7kvY3nva7liLblvqFE44OR44Op44Oh44K/44KS44K744OD44OIXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uRCBmbG9hdCBbMC4wMDAxIC0gMC4yXe+8iOODh+ODleOCqeODq+ODiCAwLjAx77yJXG4gICAgICovXG4gICAgY21kUG9zaXRpb25EKHBvc2l0aW9uRCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHBvc2l0aW9uRCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnBvc2l0aW9uRCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruS9jee9ruWItuW+oeaZguOAgUlE5Yi25b6h44KS5pyJ5Yq544Gr44GZ44KL5YGP5beu44Gu57W25a++5YCk44KS5oyH5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRocmVzaG9sZCBmbG9hdCBbMC4wIC0gbl3vvIjjg4fjg5Xjgqnjg6vjg4ggMC4wMTM5NjI2ZiAvLyAwLjhkZWfvvIlcbiAgICAgKi9cbiAgICBjbWRQb3NDb250cm9sVGhyZXNob2xkKHRocmVzaG9sZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHRocmVzaG9sZCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnBvc0NvbnRyb2xUaHJlc2hvbGQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDkvY3nva7liLblvqHmmYLjgIHnm67mqJnkvY3nva7jgavliLDpgZTmmYLjgIHliKTlrprmnaHku7bjgpLmuoDjgZ/jgZfjgZ/loLTlkIjpgJrnn6XjgpLooYzjgYbjgIJcbiAgICAgKiBAZGVzYyDliKTlrprmnaHku7bvvJogdG9sZXJhbmNlIOWGheOBq+S9jee9ruOBjOWFpeOBo+OBpuOBhOOCi+eKtuaFi+OBjOOAgXNldHRsZVRpbWUg6YCj57aa44Gn57aa44GP44Go44CB6YCa55+lKEtNX1NVQ0NFU1NfQVJSSVZBTCnjgYzkuIDlm57ooYzjgo/jgozjgovjgIJcbiAgICAgKiA8dWw+XG4gICAgICogICAgIDxsaT50b2xlcmFuY2XlhoXjgavkvY3nva7jgYzlhaXjgaPjgabjgYTjgovnirbmhYvjgYzjgIFzZXR0bGVUaW1l44Gu6ZaT6YCj57aa44Gn57aa44GP44Go6YCa55+l44GM44OI44Oq44Ks44O844GV44KM44KL44CCPC9saT5cbiAgICAgKiAgICAgPGxpPnRvbGVyYW5jZeOBq+S4gOeerOOBp+OCguWFpeOBo+OBpnNldHRsZVRpbWXmnKrmuoDjgaflh7rjgovjgajpgJrnn6Xjg4jjg6rjgqzjg7zjga/liYrpmaTjgZXjgozjgIHpgJrnn6Xjga/ooYzjgo/jgozjgarjgYTjgII8L2xpPlxuICAgICAqICAgICA8bGk+dG9sZXJhbmNl44Gr5LiA5bqm44KC5YWl44KJ44Gq44GE5aC05ZCI44CB6YCa55+l44OI44Oq44Ks44O844Gv5q6L44KK57aa44GR44KL44CCKOODiOODquOCrOODvOOBruaYjuekuueahOOBqua2iOWOu+OBryBjbWROb3RpZnlQb3NBcnJpdmFsKDAsMCwwKSApPC9saT5cbiAgICAgKiAgICAgPGxpPuWGjeW6pm5vdGlmeVBvc0Fycml2YWzjgafoqK3lrprjgpLooYzjgYbjgajjgIHku6XliY3jga7pgJrnn6Xjg4jjg6rjgqzjg7zjga/mtojjgYjjgovjgII8L2xpPlxuICAgICAqIDwvdWw+XG4gICAgICogQHBhcmFtICB7bnVtYmVyfSBpc0VuYWJsZWQgMDpEaXNibGVkLCAxOkVuYWJsZWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9sZXJhbmNlIGZsb2F0IFswLjAgLSBuXSDoqLHlrrnoqqTlt64gcmFkaWFuICjjg4fjg5Xjgqnjg6vjg4gg4omSIDAuMWRlZ++8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzZXR0bGVUaW1lIGludCBbMCAtIG5dIOWIpOWumuaZgumWkyDjg5/jg6rnp5IgKOODh+ODleOCqeODq+ODiCAyMDBtc++8iVxuICAgICAqXG4gICAgICovXG4gICAgY21kTm90aWZ5UG9zQXJyaXZhbChpc0VuYWJsZWQ9MCx0b2xlcmFuY2U9MC4wMDE3NDUzMyxzZXR0bGVUaW1lPTIwMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoOSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsaXNFbmFibGVkPzE6MCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMSxNYXRoLmFicyhwYXJzZUZsb2F0KHRvbGVyYW5jZSwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDUsTWF0aC5hYnMocGFyc2VJbnQoc2V0dGxlVGltZSkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm5vdGlmeVBvc0Fycml2YWwsYnVmZmVyKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBrlBJROODkeODqeODoeODvOOCv+OCkuODquOCu+ODg+ODiOOBl+OBpuODleOCoeODvOODoOOCpuOCp+OCouOBruWIneacn+ioreWumuOBq+aIu+OBmVxuICAgICAqIEBkZXNjIHFDdXJyZW50UCwgcUN1cnJlbnRJLCAgcUN1cnJlbnRELCBzcGVlZFAsIHNwZWVkSSwgc3BlZWRELCBwb3NpdGlvblAg44KS44Oq44K744OD44OI44GX44G+44GZXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRSZXNldFBJRCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzZXRQSUQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOa4rOWumuWApOOBruWPluW+l+mWk+malOioreWumlxuICAgICAqIEBkZXNjIOaciee3mu+8iFVTQiwgSTJD77yJ44Gu44G/5pyJ5Yq544CCQkxF44Gn44Gv5Zu65a6aIDEwMG1zIOmWk+malOOBp+mAmuefpeOBleOCjOOCi+OAglxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxfTU9UT1JfTUVBU19JTlRFUlZBTH0gY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUwgZW51bSDjg6Ljg7zjgr/jg7zmuKzlrprlgKTjga7lj5blvpfplpPpmpRcbiAgICAgKi9cbiAgICBjbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWwoY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUw9NCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQoY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUwpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOa4rOWumuWApOOBruWPluW+l+ioreWumlxuICAgICAqIEBkZXNjIGlzRW5hYmxlZCA9IDEg44Gu5aC05ZCI44CB77yI5L2N572u44O76YCf5bqm44O744OI44Or44Kv77yJ44Gu6YCa55+l44KS6KGM44GG77yI6LW35YuV5b6M44CBaW50ZXJmYWNlIOOBruioreWumuOBp+WEquWFiOOBleOCjOOCi+mAmuS/oee1jOi3r+OBq+OAgeiHquWLleeahOOBq+mAmuefpeOBjOmWi+Wni+OBleOCjOOCi++8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpc0VuYWJsZWQgMDpEaXNibGVkLCAxOkVuYWJsZWRcbiAgICAgKi9cbiAgICBjbWRNb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0KGlzRW5hYmxlZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsaXNFbmFibGVkPzE6MCk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0LGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O85Yi25b6h5omL5q6177yI44Kk44Oz44K/44O844OV44Kn44Kk44K577yJ44Gu6Kit5a6aXG4gICAgICogQGRlc2MgdWludDhfdCBmbGFncyDjg5Pjg4Pjg4jjgavjgojjgorjgIHlkKvjgb7jgozjgovjg5Hjg6njg6Hjg7zjgr/jgpLmjIflrprjgZnjgovvvIjvvJHjga7loLTlkIjlkKvjgoDjg7sw44Gu5aC05ZCI5ZCr44G+44Gq44GE77yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJpdEZsZ1xuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqIGJpdDcgICAgYml0NiAgICBiaXQ1ICAgIGJpdDQgICAgYml0MyAgICBiaXQyICAgIGJpdDEgICAgYml0MFxuICAgICAqIOeJqeeQhiAgICAgICAgICAgICAgICAgICAgIOaciee3miAgICAg5pyJ57eaICAgICAgICAgICAgICAgICAgICAgIOeEoee3mlxuICAgICAqIOODnOOCv+ODsyAgICDvvIogICAgICDvvIogICAgICBJMkMgICAgIFVTQiAgICAgICDvvIogICAgICDvvIogICAgIEJMRVxuICAgICAqIOODh+ODleOCqeODq+ODiFx0ICAgICAgICAgICAgIOODh+ODleOCqeODq+ODiCAg44OH44OV44Kp44Or44OIICAgICAgICAgICAgICDjg4fjg5Xjgqnjg6vjg4hcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKi9cbiAgICBjbWRJbnRlcmZhY2UoYml0RmxnKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxwYXJzZUludChiaXRGbGcpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmludGVyZmFjZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCs+ODnuODs+ODieOCkuWPl+S/oeOBl+OBn+OBqOOBjeOBq+aIkOWKn+mAmuefpe+8iGVycm9yQ29kZSA9IDDvvInjgpLjgZnjgovjgYvjganjgYbjgYtcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaXNFbmFibGVkIDA66YCa55+l44GX44Gq44GELCAxOumAmuefpeOBmeOCi1xuICAgICAqL1xuICAgIGNtZFJlc3BvbnNlKGlzRW5hYmxlZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsaXNFbmFibGVkPzE6MCk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZXNwb25zZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrui1t+WLleaZguWbuuaciUxFROOCq+ODqeODvOOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZWQgaW50IDAtMjU1XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGdyZWVuIGludCAwLTI1NVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBibHVlIGludCAwLTI1NVxuICAgICAqXG4gICAgICogQGRlc2Mgb3duQ29sb3Ig44Gv44Ki44Kk44OJ44Or5pmC44Gu5Zu65pyJTEVE44Kr44Op44O844CCPGJyPnNhdmVBbGxTZXR0aW5nc+OCkuWun+ihjOOBl+OAgeWGjei1t+WLleW+jOOBq+WIneOCgeOBpuWPjeaYoOOBleOCjOOCi+OAgjxicj5cbiAgICAgKiDjgZPjga7oqK3lrprlgKTjgpLlpInmm7TjgZfjgZ/loLTlkIjjgIFCTEXjga4gRGV2aWNlIE5hbWUg44Gu5LiLM+ahgeOBjOWkieabtOOBleOCjOOCi+OAglxuICAgICAqL1xuICAgIGNtZE93bkNvbG9yKHJlZCxncmVlbixibHVlKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigzKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxNYXRoLmFicyhwYXJzZUludChyZWQpKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDEsTWF0aC5hYnMocGFyc2VJbnQoZ3JlZW4pKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDIsTWF0aC5hYnMocGFyc2VJbnQoYmx1ZSkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm93bkNvbG9yLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg77yW6Lu444K744Oz44K144O877yI5Yqg6YCf5bqm44O744K444Oj44Kk44Ot77yJ5ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqUXG4gICAgICogQGRlc2Mg5pyJ57ea77yIVVNCLCBJMkPvvInjga7jgb/mnInlirnjgIJCTEXjgafjga/lm7rlrpogMTAwbXMg6ZaT6ZqU44Gn6YCa55+l44GV44KM44KL44CCXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLmNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUx9IGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUwgZW51bSDliqDpgJ/luqbjg7vjgrjjg6PjgqTjg63muKzlrprlgKTjga7lj5blvpfplpPpmpRcbiAgICAgKi9cbiAgICBjbWRJTVVNZWFzdXJlbWVudEludGVydmFsKGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUw9NCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQoY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbF9JTVVfTUVBU19JTlRFUlZBTCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuaU1VTWVhc3VyZW1lbnRJbnRlcnZhbCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IO+8lui7uOOCu+ODs+OCteODvO+8iOWKoOmAn+W6puODu+OCuOODo+OCpOODre+8ieOBruWApOOBrumAmuefpeOCkuODh+ODleOCqeODq+ODiOOBp+mWi+Wni+OBmeOCi1xuICAgICAqIEBkZXNjIGlzRW5hYmxlZCA9IHRydWUg44Gu5aC05ZCI44CBZW5hYmxlSU1VKCkg44KS6YCB5L+h44GX44Gq44GP44Gm44KC6LW35YuV5pmC44Gr6Ieq5YuV44Gn6YCa55+l44GM6ZaL5aeL44GV44KM44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGlzRW5hYmxlZCAwOkRpc2JsZWQsIDE6RW5hYmxlZFxuICAgICAqL1xuICAgIGNtZElNVU1lYXN1cmVtZW50QnlEZWZhdWx0KGlzRW5hYmxlZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQoaXNFbmFibGVkKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5pTVVNZWFzdXJlbWVudEJ5RGVmYXVsdCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOaMh+WumuOBl+OBn+ioreWumuWApOOCkuWPluW+l1xuICAgICAqIEBwYXJhbSB7bnVtYmVyIHwgYXJyYXl9IHJlZ2lzdGVycyA8aW50IHwgW10+IOWPluW+l+OBmeOCi+ODl+ODreODkeODhuOCo+OBruOCs+ODnuODs+ODiSjjg6zjgrjjgrnjgr/nlarlj7cp5YCkXG4gICAgICogQHJldHVybnMge1Byb21pc2UuPGludCB8IGFycmF5Pn0g5Y+W5b6X44GX44Gf5YCkIDxicj5yZWdpc3RlcnPjgYxpbnQ944Os44K444K544K/5YCk44Gu44OX44Oq44Of44OG44Kj44OW5YCkIDxicj5yZWdpc3RlcnPjgYxBcnJheT3jg6zjgrjjgrnjgr/lgKTjga7jgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKlxuICAgICAqIEBub25lIOWPluW+l+OBmeOCi+WApOOBr+OCs+ODnuODs+ODieWun+ihjOW+jOOBq0JMReOBruOCreODo+ODqeOCr+OCv+ODquOCueODhuOCo+OCr+OCuU1PVE9SX1NFVFRJTkfjgavpgJrnn6XjgZXjgozjgovjgII8YnI+XG4gICAgICogICAgICAg44Gd44KM44KS5ou+44Gj44GmcHJvbWlzZeOCquODluOCuOOCp+OCr+ODiOOBruOBrnJlc29sdmXjgavov5TjgZfjgablh6bnkIbjgpLnuYvjgZA8YnI+XG4gICAgICogICAgICAgTU9UT1JfU0VUVElOR+OBrm5vdGlmeeOBr19vbkJsZU1vdG9yU2V0dGluZ+OBp+WPluW+l1xuICAgICAqL1xuXG4gICAgY21kUmVhZFJlZ2lzdGVyKHJlZ2lzdGVycyl7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkocmVnaXN0ZXJzKSl7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGFsbHJlc29sdmUsIGFsbHJlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHByb21pc2VMaXN0PVtdO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgaT0wO2k8cmVnaXN0ZXJzLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcmVnaXN0ZXI9cGFyc2VJbnQocmVnaXN0ZXJzW2ldLDEwKTtcbiAgICAgICAgICAgICAgICAgICAgcHJvbWlzZUxpc3QucHVzaCggbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgY2NwPW5ldyBfS01Ob3RpZnlQcm9taXMocmVnaXN0ZXIsdGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbcmVnaXN0ZXJdLHRoaXMuX25vdGlmeVByb21pc0xpc3QscmVzb2x2ZSxyZWplY3QsNTAwMCk7Ly9ub3RpZnnntYznlLHjga5yZXN1bHTjgpJQcm9taXPjgajntJDku5jjgZFcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLCByZWdpc3Rlcik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZFJlZ2lzdGVyLCBidWZmZXIsY2NwKTtcbiAgICAgICAgICAgICAgICAgICAgfSkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBQcm9taXNlLmFsbChwcm9taXNlTGlzdCkudGhlbigocmVzYXIpPT57XG4gICAgICAgICAgICAgICAgICAgIGxldCB0PVt7fV0uY29uY2F0KHJlc2FyKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJ0b2JqPU9iamVjdC5hc3NpZ24uYXBwbHkobnVsbCx0KTtcbiAgICAgICAgICAgICAgICAgICAgYWxscmVzb2x2ZShydG9iaik7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKG1zZyk9PntcbiAgICAgICAgICAgICAgICAgICAgYWxscmVqZWN0KG1zZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGxhc3RyZXNvbHZlLCBsYXN0cmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcmVnaXN0ZXI9cGFyc2VJbnQocmVnaXN0ZXJzKTtcbiAgICAgICAgICAgICAgICBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGNjcD1uZXcgX0tNTm90aWZ5UHJvbWlzKHJlZ2lzdGVyLHRoaXMuX1JFVl9NT1RPUl9DT01NQU5EW3JlZ2lzdGVyXSx0aGlzLl9ub3RpZnlQcm9taXNMaXN0LHJlc29sdmUscmVqZWN0LDEwMDApOy8vbm90aWZ557WM55Sx44GucmVzdWx044KSUHJvbWlz44Go57SQ5LuY44GRXG4gICAgICAgICAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgICAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscmVnaXN0ZXIpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZFJlZ2lzdGVyLCBidWZmZXIsY2NwKTtcbiAgICAgICAgICAgICAgICB9KS50aGVuKChyZXMpPT57XG4gICAgICAgICAgICAgICAgICAgIGxhc3RyZXNvbHZlKHJlc1tPYmplY3Qua2V5cyhyZXMpWzBdXSk7XG4gICAgICAgICAgICAgICAgfSkuY2F0Y2goKG1zZyk9PntcbiAgICAgICAgICAgICAgICAgICAgbGFzdHJlamVjdChtc2cpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga7lhajjgabjga7jg6zjgrjjgrnjgr/lgKTjga7lj5blvpcgKOW7g+atouS6iOWumjEuMy4y44CcKVxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlLjxhcnJheT59XG4gICAgICovXG4gICAgY21kUmVhZEFsbFJlZ2lzdGVyKCl7XG4gICAgICAgIC8vaW5mbzo65buD5q2i5LqI5a6aMS4zLjLjgJwgTW90b3JGYXJt44GudmVyc2lvbuOBq+OCiOOCiuOAgeWPluW+l+WHuuadpeOBquOBhOODrOOCuOOCueOCv+OBjOWtmOWcqOOBmeOCi+eCuuOAglxuICAgICAgICAvLyDvvIjlrZjlnKjjgZfjgarjgYTjg6zjgrjjgrnjgr/jgYwx44Gk44Gn44KC44GC44KL44Go44OX44Ot44OR44OG44Kj44GM5o+D44KP44GadGltZW91dOOBq+OBquOCi++8iVxuICAgICAgICBsZXQgY209IHRoaXMuY29uc3RydWN0b3IuY21kUmVhZFJlZ2lzdGVyX0NPTU1BTkQ7XG4gICAgICAgIGxldCBhbGxjbWRzPVtdO1xuICAgICAgICBPYmplY3Qua2V5cyhjbSkuZm9yRWFjaCgoayk9PnthbGxjbWRzLnB1c2goY21ba10pO30pO1xuXG4gICAgICAgIHJldHVybiB0aGlzLmNtZFJlYWRSZWdpc3RlcihhbGxjbWRzKTtcbiAgICB9XG4gICAgLy8vLy8v5L+d5a2YXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu6Kit5a6a5YCk44KS44OV44Op44OD44K344Ol44Oh44Oi44Oq44Gr5L+d5a2Y44GZ44KLXG4gICAgICogQGRlc2Mg5pys44Kz44Oe44Oz44OJ44KS5a6f6KGM44GX44Gq44GE6ZmQ44KK44CB6Kit5a6a5YCk44Gv44Oi44O844K/44O844Gr5rC45LmF55qE44Gr5L+d5a2Y44GV44KM44Gq44GEKOWGjei1t+WLleOBp+a2iOOBiOOCiylcbiAgICAgKi9cbiAgICBjbWRTYXZlQWxsUmVnaXN0ZXJzKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zYXZlQWxsUmVnaXN0ZXJzKTtcbiAgICB9XG5cbiAgICAvLy8vLy/jg6rjgrvjg4Pjg4hcbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjgZfjgZ/jg6zjgrjjgrnjgr/jgpLjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuY21kUmVhZFJlZ2lzdGVyX0NPTU1BTkR9IHJlZ2lzdGVyIOWIneacn+WApOOBq+ODquOCu+ODg+ODiOOBmeOCi+OCs+ODnuODs+ODiSjjg6zjgrjjgrnjgr8p5YCkXG4gICAgICovXG4gICAgY21kUmVzZXRSZWdpc3RlcihyZWdpc3Rlcil7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQocmVnaXN0ZXIpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0UmVnaXN0ZXIsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu44Os44K444K544K/44KS44OV44Kh44O844Og44Km44Kn44Ki44Gu5Yid5pyf5YCk44Gr44Oq44K744OD44OI44GZ44KLXG4gICAgICogQGRlc2MgYmxlU2F2ZUFsbFJlZ2lzdGVyc+OCkuWun+ihjOOBl+OBquOBhOmZkOOCiuOAgeODquOCu+ODg+ODiOWApOOBr+ODouODvOOCv+ODvOOBq+awuOS5heeahOOBq+S/neWtmOOBleOCjOOBquOBhCjlho3otbfli5XjgafmtojjgYjjgospXG4gICAgICovXG4gICAgY21kUmVzZXRBbGxSZWdpc3RlcnMoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0QWxsUmVnaXN0ZXJzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OH44OQ44Kk44K544ON44O844Og44Gu5Y+W5b6XXG4gICAgICogQGRlc2Mg44OH44OQ44Kk44K544ON44O844Og44KS6Kqt44G/5Y+W44KLXG4gICAgICogQHJldHVybnMge1Byb21pc2U8aW50fEFycmF5Pn1cbiAgICAgKi9cbiAgICBjbWRSZWFkRGV2aWNlTmFtZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRSZWFkUmVnaXN0ZXIodGhpcy5fTU9UT1JfQ09NTUFORC5yZWFkRGV2aWNlTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OH44OQ44Kk44K55oOF5aCx44Gu5Y+W5b6XXG4gICAgICogQGRlc2Mg44OH44OQ44Kk44K544Kk44Oz44OV44Kp44Oh44O844K344On44Oz44KS6Kqt44G/5Y+W44KLXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICAgKi9cbiAgICBjbWRSZWFkRGV2aWNlSW5mbygpe1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRSZWFkUmVnaXN0ZXIodGhpcy5fTU9UT1JfQ09NTUFORC5yZWFkRGV2aWNlSW5mbyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSTJD44K544Os44O844OW44Ki44OJ44Os44K5XG4gICAgICogQGRlc2MgSTJD44GL44KJ5Yi25b6h44GZ44KL5aC05ZCI44Gu44K544Os44O844OW44Ki44OJ44Os44K577yIMHgwMC0weEZG77yJ44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFkZHJlc3Mg44Ki44OJ44Os44K5XG4gICAgICovXG4gICAgY21kU2V0STJDU2xhdmVBZGRyZXNzKGFkZHJlc3Mpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KGFkZHJlc3MpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNldEkyQ1NsYXZlQWRkcmVzcyxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWGhemDqFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICBfaXNJbnN0YW5jT2ZQcm9taXNlKGFueSl7XG4gICAgICAgIHJldHVybiBvYmogaW5zdGFuY2VvZiBQcm9taXNlIHx8IChvYmogJiYgdHlwZW9mIG9iai50aGVuID09PSAnZnVuY3Rpb24nKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDku5bjga7np7vli5Xns7vjga7jgrPjg57jg7Pjg4njgpLlrp/ooYzmmYLjgIHml6Ljgavnp7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ44GM5a6f6KGM44GV44KM44Gm44GE44KL5aC05ZCI44Gv44Gd44GuQ0LjgpJSZWplY3TjgZnjgotcbiAgICAgKiDnp7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ77yIY21kTW92ZUJ5RGlzdGFuY2VTeW5j44CBY21kTW92ZVRvUG9zaXRpb25TeW5j77yJ562JXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCl7XG4gICAgICAgIGlmKHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbil7XG4gICAgICAgICAgICB0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24uY2FsbFJlamVjdCh7aWQ6dGhpcy5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uLnRhZ05hbWUsbXNnOidJbnN0cnVjdGlvbiBvdmVycmlkZScsb3ZlcnJpZGVJZDpjaWR9KTtcbiAgICAgICAgICAgIHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbj1udWxsO1xuICAgICAgICB9XG4gICAgfVxuXG5cbi8vLy8vL2NsYXNzLy9cbn1cblxuXG4vKipcbiAqIFNlbmRCbGVOb3RpZnlQcm9taXNcbiAqIOOAgGNtZFJlYWRSZWdpc3RlcuetieOBrkJMReWRvOOBs+WHuuOBl+W+jOOBq1xuICog44CA44Kz44Oe44Oz44OJ57WQ5p6c44GMbm90aWZ544Gn6YCa55+l44GV44KM44KL44Kz44Oe44Oz44OJ44KSUHJvbWlz44Go57SQ5LuY44GR44KL54K644Gu44Kv44Op44K5XG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBfS01Ob3RpZnlQcm9taXN7XG4gICAgLy/miJDlip/pgJrnn6VcbiAgICBzdGF0aWMgc2VuZEdyb3VwTm90aWZ5UmVzb2x2ZShncm91cEFycmF5LHRhZ05hbWUsdmFsKXtcbiAgICAgICAgaWYoIUFycmF5LmlzQXJyYXkoZ3JvdXBBcnJheSkpe3JldHVybjt9XG4gICAgICAgIC8v6YCB5L+hSUTjga7pgJrnn6UgQ2FsbGJhY2tQcm9taXPjgaflkbzjgbPlh7rjgZflhYPjga7jg6Hjgr3jg4Pjg4njga5Qcm9taXPjgavov5TjgZlcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8Z3JvdXBBcnJheS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZiggZ3JvdXBBcnJheVtpXS50YWdOYW1lPT09dGFnTmFtZSApe1xuICAgICAgICAgICAgICAgIGdyb3VwQXJyYXlbaV0uY2FsbFJlc29sdmUodmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBjb25zdFxuICAgICAqIEBwYXJhbSB0YWdOYW1lXG4gICAgICogQHBhcmFtIGdyb3VwQXJyYXlcbiAgICAgKiBAcGFyYW0gcHJvbWlzUmVzb2x2ZU9ialxuICAgICAqIEBwYXJhbSBwcm9taXNSZWplY3RPYmpcbiAgICAgKiBAcGFyYW0gcmVqZWN0VGltZU91dFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHRhZ05hbWUsdGFnSW5mbz1udWxsLGdyb3VwQXJyYXk9W10scHJvbWlzUmVzb2x2ZU9iaiwgcHJvbWlzUmVqZWN0T2JqLHJlamVjdFRpbWVPdXQpe1xuICAgICAgICB0aGlzLnRpbWVvdXRJZD0wO1xuICAgICAgICB0aGlzLnRhZ05hbWU9dGFnTmFtZTtcbiAgICAgICAgdGhpcy50YWdJbmZvPXRhZ0luZm87XG4gICAgICAgIHRoaXMuZ3JvdXBBcnJheT1BcnJheS5pc0FycmF5KGdyb3VwQXJyYXkpP2dyb3VwQXJyYXk6W107XG4gICAgICAgIHRoaXMuZ3JvdXBBcnJheS5wdXNoKHRoaXMpO1xuICAgICAgICB0aGlzLnByb21pc1Jlc29sdmVPYmo9cHJvbWlzUmVzb2x2ZU9iajtcbiAgICAgICAgdGhpcy5wcm9taXNSZWplY3RPYmo9cHJvbWlzUmVqZWN0T2JqO1xuICAgICAgICB0aGlzLnJlamVjdFRpbWVPdXQ9cmVqZWN0VGltZU91dDtcbiAgICB9XG4gICAgLy/jgqvjgqbjg7Pjg4jjga7plovlp4sgY2hhcmFjdGVyaXN0aWNzLndyaXRlVmFsdWXlkbzjgbPlh7rjgZflvozjgavlrp/ooYxcbiAgICBzdGFydFJlamVjdFRpbWVPdXRDb3VudCgpe1xuICAgICAgICB0aGlzLnRpbWVvdXRJZD1zZXRUaW1lb3V0KCgpPT57XG4gICAgICAgICAgICB0aGlzLl9yZW1vdmVHcm91cCgpO1xuICAgICAgICAgICAgdGhpcy5wcm9taXNSZWplY3RPYmooe21zZzpcInRpbWVvdXQ6XCIsdGFnTmFtZTp0aGlzLnRhZ05hbWUsdGFnSW5mbzp0aGlzLnRhZ0luZm99KTtcbiAgICAgICAgfSwgdGhpcy5yZWplY3RUaW1lT3V0KTtcbiAgICB9XG4gICAgY2FsbFJlc29sdmUoYXJnKXtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElkKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlR3JvdXAoKTtcbiAgICAgICAgdGhpcy5wcm9taXNSZXNvbHZlT2JqKGFyZyk7XG4gICAgfVxuICAgIGNhbGxSZWplY3QobXNnKXtcbiAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElkKTtcbiAgICAgICAgdGhpcy5fcmVtb3ZlR3JvdXAoKTtcbiAgICAgICAgdGhpcy5wcm9taXNSZWplY3RPYmooe21zZzptc2d9KTtcbiAgICB9XG5cbiAgICBfcmVtb3ZlR3JvdXAoKXtcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8dGhpcy5ncm91cEFycmF5Lmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGlmKCB0aGlzLmdyb3VwQXJyYXlbaV09PT10aGlzKXtcbiAgICAgICAgICAgICAgICB0aGlzLmdyb3VwQXJyYXkuc3BsaWNlKGksMSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPUtNTW90b3JDb21tYW5kS01PbmU7XG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNTW90b3JDb21tYW5kS01PbmUuanNcbi8vIG1vZHVsZSBpZCA9IDdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUiA9IHR5cGVvZiBSZWZsZWN0ID09PSAnb2JqZWN0JyA/IFJlZmxlY3QgOiBudWxsXG52YXIgUmVmbGVjdEFwcGx5ID0gUiAmJiB0eXBlb2YgUi5hcHBseSA9PT0gJ2Z1bmN0aW9uJ1xuICA/IFIuYXBwbHlcbiAgOiBmdW5jdGlvbiBSZWZsZWN0QXBwbHkodGFyZ2V0LCByZWNlaXZlciwgYXJncykge1xuICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbCh0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKTtcbiAgfVxuXG52YXIgUmVmbGVjdE93bktleXNcbmlmIChSICYmIHR5cGVvZiBSLm93bktleXMgPT09ICdmdW5jdGlvbicpIHtcbiAgUmVmbGVjdE93bktleXMgPSBSLm93bktleXNcbn0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICBSZWZsZWN0T3duS2V5cyA9IGZ1bmN0aW9uIFJlZmxlY3RPd25LZXlzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpXG4gICAgICAuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSk7XG4gIH07XG59IGVsc2Uge1xuICBSZWZsZWN0T3duS2V5cyA9IGZ1bmN0aW9uIFJlZmxlY3RPd25LZXlzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBQcm9jZXNzRW1pdFdhcm5pbmcod2FybmluZykge1xuICBpZiAoY29uc29sZSAmJiBjb25zb2xlLndhcm4pIGNvbnNvbGUud2Fybih3YXJuaW5nKTtcbn1cblxudmFyIE51bWJlcklzTmFOID0gTnVtYmVyLmlzTmFOIHx8IGZ1bmN0aW9uIE51bWJlcklzTmFOKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgRXZlbnRFbWl0dGVyLmluaXQuY2FsbCh0aGlzKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50c0NvdW50ID0gMDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxudmFyIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KEV2ZW50RW1pdHRlciwgJ2RlZmF1bHRNYXhMaXN0ZW5lcnMnLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIGRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24oYXJnKSB7XG4gICAgaWYgKHR5cGVvZiBhcmcgIT09ICdudW1iZXInIHx8IGFyZyA8IDAgfHwgTnVtYmVySXNOYU4oYXJnKSkge1xuICAgICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcImRlZmF1bHRNYXhMaXN0ZW5lcnNcIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnICsgYXJnICsgJy4nKTtcbiAgICB9XG4gICAgZGVmYXVsdE1heExpc3RlbmVycyA9IGFyZztcbiAgfVxufSk7XG5cbkV2ZW50RW1pdHRlci5pbml0ID0gZnVuY3Rpb24oKSB7XG5cbiAgaWYgKHRoaXMuX2V2ZW50cyA9PT0gdW5kZWZpbmVkIHx8XG4gICAgICB0aGlzLl9ldmVudHMgPT09IE9iamVjdC5nZXRQcm90b3R5cGVPZih0aGlzKS5fZXZlbnRzKSB7XG4gICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gIH1cblxuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufTtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gc2V0TWF4TGlzdGVuZXJzKG4pIHtcbiAgaWYgKHR5cGVvZiBuICE9PSAnbnVtYmVyJyB8fCBuIDwgMCB8fCBOdW1iZXJJc05hTihuKSkge1xuICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgb2YgXCJuXCIgaXMgb3V0IG9mIHJhbmdlLiBJdCBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIG51bWJlci4gUmVjZWl2ZWQgJyArIG4gKyAnLicpO1xuICB9XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuZnVuY3Rpb24gJGdldE1heExpc3RlbmVycyh0aGF0KSB7XG4gIGlmICh0aGF0Ll9tYXhMaXN0ZW5lcnMgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gIHJldHVybiB0aGF0Ll9tYXhMaXN0ZW5lcnM7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZ2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24gZ2V0TWF4TGlzdGVuZXJzKCkge1xuICByZXR1cm4gJGdldE1heExpc3RlbmVycyh0aGlzKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZW1pdCA9IGZ1bmN0aW9uIGVtaXQodHlwZSkge1xuICB2YXIgYXJncyA9IFtdO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gIHZhciBkb0Vycm9yID0gKHR5cGUgPT09ICdlcnJvcicpO1xuXG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gIGlmIChldmVudHMgIT09IHVuZGVmaW5lZClcbiAgICBkb0Vycm9yID0gKGRvRXJyb3IgJiYgZXZlbnRzLmVycm9yID09PSB1bmRlZmluZWQpO1xuICBlbHNlIGlmICghZG9FcnJvcilcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAoZG9FcnJvcikge1xuICAgIHZhciBlcjtcbiAgICBpZiAoYXJncy5sZW5ndGggPiAwKVxuICAgICAgZXIgPSBhcmdzWzBdO1xuICAgIGlmIChlciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICAvLyBOb3RlOiBUaGUgY29tbWVudHMgb24gdGhlIGB0aHJvd2AgbGluZXMgYXJlIGludGVudGlvbmFsLCB0aGV5IHNob3dcbiAgICAgIC8vIHVwIGluIE5vZGUncyBvdXRwdXQgaWYgdGhpcyByZXN1bHRzIGluIGFuIHVuaGFuZGxlZCBleGNlcHRpb24uXG4gICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICB9XG4gICAgLy8gQXQgbGVhc3QgZ2l2ZSBzb21lIGtpbmQgb2YgY29udGV4dCB0byB0aGUgdXNlclxuICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuaGFuZGxlZCBlcnJvci4nICsgKGVyID8gJyAoJyArIGVyLm1lc3NhZ2UgKyAnKScgOiAnJykpO1xuICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgdGhyb3cgZXJyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICB9XG5cbiAgdmFyIGhhbmRsZXIgPSBldmVudHNbdHlwZV07XG5cbiAgaWYgKGhhbmRsZXIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKHR5cGVvZiBoYW5kbGVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgUmVmbGVjdEFwcGx5KGhhbmRsZXIsIHRoaXMsIGFyZ3MpO1xuICB9IGVsc2Uge1xuICAgIHZhciBsZW4gPSBoYW5kbGVyLmxlbmd0aDtcbiAgICB2YXIgbGlzdGVuZXJzID0gYXJyYXlDbG9uZShoYW5kbGVyLCBsZW4pO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyArK2kpXG4gICAgICBSZWZsZWN0QXBwbHkobGlzdGVuZXJzW2ldLCB0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuZnVuY3Rpb24gX2FkZExpc3RlbmVyKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIsIHByZXBlbmQpIHtcbiAgdmFyIG07XG4gIHZhciBldmVudHM7XG4gIHZhciBleGlzdGluZztcblxuICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRnVuY3Rpb24uIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBsaXN0ZW5lcik7XG4gIH1cblxuICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRhcmdldC5fZXZlbnRzQ291bnQgPSAwO1xuICB9IGVsc2Uge1xuICAgIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gICAgLy8gYWRkaW5nIGl0IHRvIHRoZSBsaXN0ZW5lcnMsIGZpcnN0IGVtaXQgXCJuZXdMaXN0ZW5lclwiLlxuICAgIGlmIChldmVudHMubmV3TGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGFyZ2V0LmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgICAgIGxpc3RlbmVyLmxpc3RlbmVyID8gbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgICAgIC8vIFJlLWFzc2lnbiBgZXZlbnRzYCBiZWNhdXNlIGEgbmV3TGlzdGVuZXIgaGFuZGxlciBjb3VsZCBoYXZlIGNhdXNlZCB0aGVcbiAgICAgIC8vIHRoaXMuX2V2ZW50cyB0byBiZSBhc3NpZ25lZCB0byBhIG5ldyBvYmplY3RcbiAgICAgIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICAgIH1cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXTtcbiAgfVxuXG4gIGlmIChleGlzdGluZyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgICArK3RhcmdldC5fZXZlbnRzQ291bnQ7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHR5cGVvZiBleGlzdGluZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9XG4gICAgICAgIHByZXBlbmQgPyBbbGlzdGVuZXIsIGV4aXN0aW5nXSA6IFtleGlzdGluZywgbGlzdGVuZXJdO1xuICAgICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIH0gZWxzZSBpZiAocHJlcGVuZCkge1xuICAgICAgZXhpc3RpbmcudW5zaGlmdChsaXN0ZW5lcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGV4aXN0aW5nLnB1c2gobGlzdGVuZXIpO1xuICAgIH1cblxuICAgIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gICAgbSA9ICRnZXRNYXhMaXN0ZW5lcnModGFyZ2V0KTtcbiAgICBpZiAobSA+IDAgJiYgZXhpc3RpbmcubGVuZ3RoID4gbSAmJiAhZXhpc3Rpbmcud2FybmVkKSB7XG4gICAgICBleGlzdGluZy53YXJuZWQgPSB0cnVlO1xuICAgICAgLy8gTm8gZXJyb3IgY29kZSBmb3IgdGhpcyBzaW5jZSBpdCBpcyBhIFdhcm5pbmdcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXN0cmljdGVkLXN5bnRheFxuICAgICAgdmFyIHcgPSBuZXcgRXJyb3IoJ1Bvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgbGVhayBkZXRlY3RlZC4gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nLmxlbmd0aCArICcgJyArIFN0cmluZyh0eXBlKSArICcgbGlzdGVuZXJzICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnYWRkZWQuIFVzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAnaW5jcmVhc2UgbGltaXQnKTtcbiAgICAgIHcubmFtZSA9ICdNYXhMaXN0ZW5lcnNFeGNlZWRlZFdhcm5pbmcnO1xuICAgICAgdy5lbWl0dGVyID0gdGFyZ2V0O1xuICAgICAgdy50eXBlID0gdHlwZTtcbiAgICAgIHcuY291bnQgPSBleGlzdGluZy5sZW5ndGg7XG4gICAgICBQcm9jZXNzRW1pdFdhcm5pbmcodyk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRhcmdldDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHJldHVybiBfYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIGZhbHNlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub24gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcHJlcGVuZExpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICByZXR1cm4gX2FkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCB0cnVlKTtcbiAgICB9O1xuXG5mdW5jdGlvbiBvbmNlV3JhcHBlcigpIHtcbiAgdmFyIGFyZ3MgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICBpZiAoIXRoaXMuZmlyZWQpIHtcbiAgICB0aGlzLnRhcmdldC5yZW1vdmVMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMud3JhcEZuKTtcbiAgICB0aGlzLmZpcmVkID0gdHJ1ZTtcbiAgICBSZWZsZWN0QXBwbHkodGhpcy5saXN0ZW5lciwgdGhpcy50YXJnZXQsIGFyZ3MpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9vbmNlV3JhcCh0YXJnZXQsIHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBzdGF0ZSA9IHsgZmlyZWQ6IGZhbHNlLCB3cmFwRm46IHVuZGVmaW5lZCwgdGFyZ2V0OiB0YXJnZXQsIHR5cGU6IHR5cGUsIGxpc3RlbmVyOiBsaXN0ZW5lciB9O1xuICB2YXIgd3JhcHBlZCA9IG9uY2VXcmFwcGVyLmJpbmQoc3RhdGUpO1xuICB3cmFwcGVkLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHN0YXRlLndyYXBGbiA9IHdyYXBwZWQ7XG4gIHJldHVybiB3cmFwcGVkO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJsaXN0ZW5lclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBGdW5jdGlvbi4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIGxpc3RlbmVyKTtcbiAgfVxuICB0aGlzLm9uKHR5cGUsIF9vbmNlV3JhcCh0aGlzLCB0eXBlLCBsaXN0ZW5lcikpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucHJlcGVuZE9uY2VMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcHJlcGVuZE9uY2VMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJsaXN0ZW5lclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBGdW5jdGlvbi4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIGxpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucHJlcGVuZExpc3RlbmVyKHR5cGUsIF9vbmNlV3JhcCh0aGlzLCB0eXBlLCBsaXN0ZW5lcikpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuLy8gRW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmIGFuZCBvbmx5IGlmIHRoZSBsaXN0ZW5lciB3YXMgcmVtb3ZlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICB2YXIgbGlzdCwgZXZlbnRzLCBwb3NpdGlvbiwgaSwgb3JpZ2luYWxMaXN0ZW5lcjtcblxuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJsaXN0ZW5lclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBGdW5jdGlvbi4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIGxpc3RlbmVyKTtcbiAgICAgIH1cblxuICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgbGlzdCA9IGV2ZW50c1t0eXBlXTtcbiAgICAgIGlmIChsaXN0ID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHwgbGlzdC5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3QubGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKHR5cGVvZiBsaXN0ICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHBvc2l0aW9uID0gLTE7XG5cbiAgICAgICAgZm9yIChpID0gbGlzdC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fCBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgb3JpZ2luYWxMaXN0ZW5lciA9IGxpc3RbaV0ubGlzdGVuZXI7XG4gICAgICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAgIGlmIChwb3NpdGlvbiA9PT0gMClcbiAgICAgICAgICBsaXN0LnNoaWZ0KCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIHNwbGljZU9uZShsaXN0LCBwb3NpdGlvbik7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpXG4gICAgICAgICAgZXZlbnRzW3R5cGVdID0gbGlzdFswXTtcblxuICAgICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIG9yaWdpbmFsTGlzdGVuZXIgfHwgbGlzdGVuZXIpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9mZiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlQWxsTGlzdGVuZXJzID1cbiAgICBmdW5jdGlvbiByZW1vdmVBbGxMaXN0ZW5lcnModHlwZSkge1xuICAgICAgdmFyIGxpc3RlbmVycywgZXZlbnRzLCBpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gICAgICBpZiAoZXZlbnRzLnJlbW92ZUxpc3RlbmVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgfSBlbHNlIGlmIChldmVudHNbdHlwZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKVxuICAgICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICBlbHNlXG4gICAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMoZXZlbnRzKTtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGtleXMubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICBrZXkgPSBrZXlzW2ldO1xuICAgICAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIGxpc3RlbmVycyA9IGV2ZW50c1t0eXBlXTtcblxuICAgICAgaWYgKHR5cGVvZiBsaXN0ZW5lcnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnMpO1xuICAgICAgfSBlbHNlIGlmIChsaXN0ZW5lcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAvLyBMSUZPIG9yZGVyXG4gICAgICAgIGZvciAoaSA9IGxpc3RlbmVycy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzW2ldKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5mdW5jdGlvbiBfbGlzdGVuZXJzKHRhcmdldCwgdHlwZSwgdW53cmFwKSB7XG4gIHZhciBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcblxuICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIFtdO1xuXG4gIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuICBpZiAoZXZsaXN0ZW5lciA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBbXTtcblxuICBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpXG4gICAgcmV0dXJuIHVud3JhcCA/IFtldmxpc3RlbmVyLmxpc3RlbmVyIHx8IGV2bGlzdGVuZXJdIDogW2V2bGlzdGVuZXJdO1xuXG4gIHJldHVybiB1bndyYXAgP1xuICAgIHVud3JhcExpc3RlbmVycyhldmxpc3RlbmVyKSA6IGFycmF5Q2xvbmUoZXZsaXN0ZW5lciwgZXZsaXN0ZW5lci5sZW5ndGgpO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uIGxpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIHRydWUpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yYXdMaXN0ZW5lcnMgPSBmdW5jdGlvbiByYXdMaXN0ZW5lcnModHlwZSkge1xuICByZXR1cm4gX2xpc3RlbmVycyh0aGlzLCB0eXBlLCBmYWxzZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgaWYgKHR5cGVvZiBlbWl0dGVyLmxpc3RlbmVyQ291bnQgPT09ICdmdW5jdGlvbicpIHtcbiAgICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBsaXN0ZW5lckNvdW50LmNhbGwoZW1pdHRlciwgdHlwZSk7XG4gIH1cbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJDb3VudCA9IGxpc3RlbmVyQ291bnQ7XG5mdW5jdGlvbiBsaXN0ZW5lckNvdW50KHR5cGUpIHtcbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcblxuICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcblxuICAgIGlmICh0eXBlb2YgZXZsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIDE7XG4gICAgfSBlbHNlIGlmIChldmxpc3RlbmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gMDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5ldmVudE5hbWVzID0gZnVuY3Rpb24gZXZlbnROYW1lcygpIHtcbiAgcmV0dXJuIHRoaXMuX2V2ZW50c0NvdW50ID4gMCA/IFJlZmxlY3RPd25LZXlzKHRoaXMuX2V2ZW50cykgOiBbXTtcbn07XG5cbmZ1bmN0aW9uIGFycmF5Q2xvbmUoYXJyLCBuKSB7XG4gIHZhciBjb3B5ID0gbmV3IEFycmF5KG4pO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IG47ICsraSlcbiAgICBjb3B5W2ldID0gYXJyW2ldO1xuICByZXR1cm4gY29weTtcbn1cblxuZnVuY3Rpb24gc3BsaWNlT25lKGxpc3QsIGluZGV4KSB7XG4gIGZvciAoOyBpbmRleCArIDEgPCBsaXN0Lmxlbmd0aDsgaW5kZXgrKylcbiAgICBsaXN0W2luZGV4XSA9IGxpc3RbaW5kZXggKyAxXTtcbiAgbGlzdC5wb3AoKTtcbn1cblxuZnVuY3Rpb24gdW53cmFwTGlzdGVuZXJzKGFycikge1xuICB2YXIgcmV0ID0gbmV3IEFycmF5KGFyci5sZW5ndGgpO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IHJldC5sZW5ndGg7ICsraSkge1xuICAgIHJldFtpXSA9IGFycltpXS5saXN0ZW5lciB8fCBhcnJbaV07XG4gIH1cbiAgcmV0dXJuIHJldDtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiXSwic291cmNlUm9vdCI6IiJ9