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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMzE0ZjFiYjRmOTM0NmZkMDJjMGMiLCJ3ZWJwYWNrOi8vLy4vbGliL0tNU3RydWN0dXJlcy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01VdGwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0tNQ29tV2ViQkxFLmpzIiwid2VicGFjazovLy8uL2xpYi9LTUNvbm5lY3RvckJyb3dzZXJXUEsuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01Nb3Rvck9uZVdlYkJMRS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01Db21CYXNlLmpzIiwid2VicGFjazovLy8uL2xpYi9LTU1vdG9yQ29tbWFuZEtNT25lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7O1FBRUE7UUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhO0FBQ2IsWUFBWSxtQkFBTyxDQUFDLENBQVM7OztBQUc3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIs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QkFBa0IsT0FBTztBQUN6QixrQkFBa0IsT0FBTztBQUN6QixrQkFBa0IsT0FBTztBQUN6QixrQkFBa0IsT0FBTztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Qsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FBQ3hCLGlCQUFpQixPQUFPO0FB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QUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0I7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLDREQUE0RDtBQUMzRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUscUNBQXFDO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSw0Q0FBNEM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFD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LG1CQUFtQixTQUFTO0FBQzVCO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixzQkFBc0I7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsZUFBZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQOztBQUVBLGlDQUFpQyxRQUFRO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0Esc0NBQXNDLFFBQVE7QUFDOUM7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFFBQVEseUJBQXlCO0FBQ2pDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCLGdCQUFnQjtBQUNqQztBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJleGFtcGxlcy9icm93c2VyX3dlYmJsdWV0b29oL2xpYnJhcnkvS01Db25uZWN0b3JCcm93c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMzE0ZjFiYjRmOTM0NmZkMDJjMGMiLCIvKioqXG4gKiBLTVN0cnVjdHVyZXMuanNcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmxldCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcblxuXG4vKipcbiAqIEBjbGFzc2Rlc2Mg5qeL6YCg5L2T44Gu5Z+65bqV44Kv44Op44K5XG4gKiBAaWdub3JlXG4gKi9cbmNsYXNzIEtNU3RydWN0dXJlQmFzZXtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDlkIzjgZjlgKTjgpLmjIHjgaTjgYvjga7mr5TovINcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdGFyIOavlOi8g+OBmeOCi+ani+mAoOS9k1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDntZDmnpxcbiAgICAgKi9cbiAgICBFUSAodGFyKSB7XG4gICAgICAgIGlmKCEgdGFyICl7cmV0dXJuIGZhbHNlO31cbiAgICAgICAgaWYodGhpcy5jb25zdHJ1Y3Rvcj09PXRhci5jb25zdHJ1Y3Rvcil7XG4gICAgICAgICAgICBpZih0aGlzLkdldFZhbEFycmF5KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5HZXRWYWxBcnJheSgpLnRvU3RyaW5nKCk9PT10YXIuR2V0VmFsQXJyYXkoKS50b1N0cmluZygpO1xuICAgICAgICAgICAgfWVsc2UgaWYodGhpcy5HZXRWYWxPYmope1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLkdldFZhbE9iaigpKT09PUpTT04uc3RyaW5naWZ5KHRhci5HZXRWYWxPYmooKSk7Ly8gYmFkOjrpgYXjgYRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6KSH6KO9XG4gICAgICogQHJldHVybnMge29iamVjdH0g6KSH6KO944GV44KM44Gf5qeL6YCg5L2TXG4gICAgICovXG4gICAgQ2xvbmUgKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgdGhpcy5jb25zdHJ1Y3RvcigpLHRoaXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDlgKTjga7lj5blvpfvvIhPYmrvvIlcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgICAqL1xuICAgIEdldFZhbE9iaiAoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWApOOBruWPluW+l++8iOmFjeWIl++8iVxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBHZXRWYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCBrPU9iamVjdC5rZXlzKHRoaXMpO1xuICAgICAgICBsZXQgcj1bXTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTxrLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgci5wdXNoKHRoaXNba1tpXV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWApOOBruS4gOaLrOioreWumu+8iE9iau+8iVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wc09iaiDoqK3lrprjgZnjgovjg5fjg63jg5Hjg4bjgqNcbiAgICAgKi9cbiAgICBTZXRWYWxPYmogKHByb3BzT2JqKSB7XG4gICAgICAgIGlmKHR5cGVvZiBwcm9wc09iaiAhPT1cIm9iamVjdFwiKXtyZXR1cm47fVxuICAgICAgICBsZXQga2V5cz1PYmplY3Qua2V5cyhwcm9wc09iaik7XG4gICAgICAgIGZvcihsZXQgaz0wO2s8a2V5cy5sZW5ndGg7aysrKXtcbiAgICAgICAgICAgIGxldCBwbj1rZXlzW2tdO1xuICAgICAgICAgICAgaWYodGhpcy5oYXNPd25Qcm9wZXJ0eShwbikpe1xuICAgICAgICAgICAgICAgIHRoaXNbcG5dPXByb3BzT2JqW3BuXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5cbi8qKlxuICogQGNsYXNzZGVzYyBYWeW6p+aomeOBruani+mAoOS9k+OCquODluOCuOOCp+OCr+ODiFxuICogQGlnbm9yZVxuICovXG5jbGFzcyBLTVZlY3RvcjIgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICogQGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxuICAgICAqXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHg9MCwgeT0wKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog55u45a++5L2N572u44G456e75YuVXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR5XG4gICAgICovXG4gICAgTW92ZSAoZHggPTAsIGR5ID0gMCkge1xuICAgICAgICB0aGlzLnggKz0gZHg7XG4gICAgICAgIHRoaXMueSArPSBkeTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMueCuemWk+OBrui3nembolxuICAgICAqIEBwYXJhbSB7S01WZWN0b3IyfSB2ZWN0b3IyXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBEaXN0YW5jZSAodmVjdG9yMikge1xuICAgICAgICBpZiAoISh2ZWN0b3IyIGluc3RhbmNlb2YgS01WZWN0b3IyKSkge3JldHVybjt9XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coKHRoaXMueC12ZWN0b3IyLngpLDIpICsgTWF0aC5wb3coKHRoaXMueS12ZWN0b3IyLnkpLDIpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMueCuemWk+OBruinkuW6plxuICAgICAqIEBwYXJhbSB7S01WZWN0b3IyfSB2ZWN0b3IyXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBSYWRpYW4gKHZlY3RvcjIpIHtcbiAgICAgICAgaWYgKCEodmVjdG9yMiBpbnN0YW5jZW9mIEtNVmVjdG9yMikpIHtyZXR1cm47fVxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnktdmVjdG9yMi55LHRoaXMueC12ZWN0b3IyLngpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAwLDDjgYvjgonjga7ot53pm6JcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIERpc3RhbmNlRnJvbVplcm8oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3codGhpcy54LDIpICsgTWF0aC5wb3codGhpcy55LDIpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMCww44GL44KJ44Gu6KeS5bqmXG4gICAgICogQHJldHVybnMge251bWJlcn0gcmFkaWFuXG4gICAgICovXG4gICAgUmFkaWFuRnJvbVplcm8oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueSx0aGlzLngpO1xuICAgIH1cbn1cblxuXG5cbi8qKlxuICogQGNsYXNzZGVzYyDjgrjjg6PjgqTjg63jgrvjg7PjgrXjg7zlgKRcbiAqL1xuY2xhc3MgS01JbXVTdGF0ZSBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWNjZWxYIOWKoOmAn+W6pih4KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWNjZWxZIOWKoOmAn+W6pih5KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWNjZWxaIOWKoOmAn+W6pih6KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGVtcCDmuKnluqYgQ1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBneXJvWCDop5LpgJ/luqYoeCkgW8KxIDFdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGd5cm9ZIOinkumAn+W6pih5KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZ3lyb1og6KeS6YCf5bqmKHopIFvCsSAxXVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChhY2NlbFgsIGFjY2VsWSwgYWNjZWxaLCB0ZW1wLCBneXJvWCwgZ3lyb1ksIGd5cm9aICkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuYWNjZWxYPSBLTVV0bC50b051bWJlcihhY2NlbFgpO1xuICAgICAgICB0aGlzLmFjY2VsWT0gS01VdGwudG9OdW1iZXIoYWNjZWxZKTtcbiAgICAgICAgdGhpcy5hY2NlbFo9IEtNVXRsLnRvTnVtYmVyKGFjY2VsWik7XG4gICAgICAgIHRoaXMudGVtcD0gS01VdGwudG9OdW1iZXIodGVtcCk7XG4gICAgICAgIHRoaXMuZ3lyb1g9IEtNVXRsLnRvTnVtYmVyKGd5cm9YKTtcbiAgICAgICAgdGhpcy5neXJvWT0gS01VdGwudG9OdW1iZXIoZ3lyb1kpO1xuICAgICAgICB0aGlzLmd5cm9aPSBLTVV0bC50b051bWJlcihneXJvWik7XG4gICAgfVxufVxuLyoqXG4gKiBLRUlHQU7jg6Ljg7zjgr/jg7xMRUTjgIDngrnnga/jg7voibLnirbmhYtcbiAqIFN0YXRlIE1PVE9SX0xFRF9TVEFURVxuICogY29sb3JSIDAtMjU1XG4gKiBjb2xvckcgMC0yNTVcbiAqIGNvbG9yQiAwLTI1NVxuICogKi9cbi8qKlxuICogQGNsYXNzZGVzYyDjg6Ljg7zjgr/jg7xMRUTjgIDngrnnga/jg7voibLnirbmhYtcbiAqL1xuY2xhc3MgS01MZWRTdGF0ZSBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844GuTEVE54q25oWLXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTEVEX1NUQVRFX09GRiAtIDA6TEVE5raI54GvXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX0xFRF9TVEFURV9PTl9TT0xJRCAtIDE6TEVE54K554GvXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX0xFRF9TVEFURV9PTl9GTEFTSCAtIDI6TEVE54K55ruF77yI5LiA5a6a6ZaT6ZqU44Gn54K55ruF77yJXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX0xFRF9TVEFURV9PTl9ESU0gLSAzOkxFROOBjOOChuOBo+OBj+OCiui8neW6puWkieWMluOBmeOCi1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgTU9UT1JfTEVEX1NUQVRFKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09GRlwiOjAsXG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PTl9TT0xJRFwiOjEsXG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PTl9GTEFTSFwiOjIsXG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PTl9ESU1cIjozXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBleHRlbmRzIEtNU3RydWN0dXJlQmFzZVxuICAgICAqIEBwYXJhbSB7S01MZWRTdGF0ZS5NT1RPUl9MRURfU1RBVEV9IHN0YXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbG9yUiBpbnQgWzAtMjU1XVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb2xvckcgaW50IFswLTI1NV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY29sb3JCIGludCBbMC0yNTVdXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc3RhdGUsY29sb3JSLGNvbG9yRyxjb2xvckIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zdGF0ZT1LTVV0bC50b051bWJlcihzdGF0ZSk7XG4gICAgICAgIHRoaXMuY29sb3JSPUtNVXRsLnRvTnVtYmVyKGNvbG9yUik7XG4gICAgICAgIHRoaXMuY29sb3JHPUtNVXRsLnRvTnVtYmVyKGNvbG9yRyk7XG4gICAgICAgIHRoaXMuY29sb3JCPUtNVXRsLnRvTnVtYmVyKGNvbG9yQik7XG4gICAgfVxufVxuXG4vKipcbiAqIEBjbGFzc2Rlc2Mg44Oi44O844K/44O85Zue6Lui5oOF5aCxXG4gKi9cbmNsYXNzIEtNUm90U3RhdGUgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuICAgIC8qKlxuICAgICAqIOacgOWkp+ODiOODq+OCr+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBNQVhfVE9SUVVFKCl7XG4gICAgICAgIHJldHVybiAwLjM7Ly8wLjMgTuODu21cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmnIDlpKfpgJ/luqblrprmlbAocnBtKVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBNQVhfU1BFRURfUlBNKCl7XG4gICAgICAgIHJldHVybiAzMDA7Ly8zMDBycG1cbiAgICB9XG4gICAgLyoqXG4gICAgICog5pyA5aSn6YCf5bqm5a6a5pWwKHJhZGlhbi9zZWMpXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE1BWF9TUEVFRF9SQURJQU4oKXtcbiAgICAgICAgcmV0dXJuIEtNVXRsLnJwbVRvUmFkaWFuU2VjKDMwMCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOacgOWkp+W6p+aomeWumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBNQVhfUE9TSVRJT04oKXtcbiAgICAgICAgcmV0dXJuIDMqTWF0aC5wb3coMTAsMzgpOy8vaW5mbzo644CMcmV0dXJu44CAM2UrMzjjgI3jga9taW5pZnnjgafjgqjjg6njg7xcbiAgICAgICAgLy9yZXR1cm7jgIAzZSszODsvL3JhZGlhbiA0Ynl0ZSBmbG9hdOOAgDEuMTc1NDk0IDEwLTM4ICA8IDMuNDAyODIzIDEwKzM4XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb24g5bqn5qiZXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZlbG9jaXR5IOmAn+W6plxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3JxdWUg44OI44Or44KvXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocG9zaXRpb24sIHZlbG9jaXR5LCB0b3JxdWUpIHtcbiAgICAgICAgLy/mnInlirnmoYHmlbAg5bCP5pWw56ysNOS9jVxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gTWF0aC5mbG9vcihLTVV0bC50b051bWJlcihwb3NpdGlvbikqMTAwMDApLzEwMDAwO1xuICAgICAgICB0aGlzLnZlbG9jaXR5ID0gTWF0aC5mbG9vcihLTVV0bC50b051bWJlcih2ZWxvY2l0eSkqMTAwMDApLzEwMDAwO1xuICAgICAgICB0aGlzLnRvcnF1ZSA9IE1hdGguZmxvb3IoS01VdGwudG9OdW1iZXIodG9ycXVlKSoxMDAwMCkvMTAwMDA7XG4gICAgfVxufVxuXG5cbi8qKlxuICogQGNsYXNzZGVzYyDjg4fjg5DjgqTjgrnmg4XloLFcbiAqL1xuY2xhc3MgS01EZXZpY2VJbmZvIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBleHRlbmRzIEtNU3RydWN0dXJlQmFzZVxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5LTV9DT05ORUNUX1RZUEV9IHR5cGUg5o6l57aa5pa55byPXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIOODh+ODkOOCpOOCuVVVSURcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSDjg6Ljg7zjgr/jg7zlkI0o5b2i5byPIElEIExFRENvbG9yKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNDb25uZWN0IOaOpee2mueKtuaFi1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtYW51ZmFjdHVyZXJOYW1lIOijvemAoOS8muekvuWQjVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBoYXJkd2FyZVJldmlzaW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpcm13YXJlUmV2aXNpb25cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0eXBlPTAsaWQ9XCJcIixuYW1lPVwiXCIsaXNDb25uZWN0PWZhbHNlLG1hbnVmYWN0dXJlck5hbWU9bnVsbCxoYXJkd2FyZVJldmlzaW9uPW51bGwsZmlybXdhcmVSZXZpc2lvbj1udWxsKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZT10eXBlO1xuICAgICAgICB0aGlzLmlkPWlkO1xuICAgICAgICB0aGlzLm5hbWU9bmFtZTtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3Q9aXNDb25uZWN0O1xuICAgICAgICB0aGlzLm1hbnVmYWN0dXJlck5hbWU9bWFudWZhY3R1cmVyTmFtZTtcbiAgICAgICAgdGhpcy5oYXJkd2FyZVJldmlzaW9uPWhhcmR3YXJlUmV2aXNpb247XG4gICAgICAgIHRoaXMuZmlybXdhcmVSZXZpc2lvbj1maXJtd2FyZVJldmlzaW9uO1xuXG4gICAgfVxufVxuLyoqXG4gKiBAY2xhc3NkZXNjIOODouODvOOCv+ODvOODreOCsOaDheWgsVxuICovXG5jbGFzcyBLTU1vdG9yTG9nIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gaWQge251bWJlcn0g44K344O844Kx44Oz44K5SUQo44Om44OL44O844Kv5YCkKVxuICAgICAqIEBwYXJhbSBjbWROYW1lIHtzdHJpbmd9IOWun+ihjOOCs+ODnuODs+ODieWQjVxuICAgICAqIEBwYXJhbSBjbWRJRCB7bnVtYmVyfSDlrp/ooYzjgrPjg57jg7Pjg4lJRFxuICAgICAqIEBwYXJhbSBlcnJJRCB7bnVtYmVyfSDjgqjjg6njg7zjgr/jgqTjg5dcbiAgICAgKiBAcGFyYW0gZXJyVHlwZSB7c3RyaW5nfSDjgqjjg6njg7znqK7liKVcbiAgICAgKiBAcGFyYW0gZXJyTXNnIHtzdHJpbmd944CA44Oh44OD44K744O844K45YaF5a65XG4gICAgICogQHBhcmFtIGluZm8ge251bWJlcn1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoaWQ9MCxjbWROYW1lPVwiXCIsY21kSUQ9MCxlcnJJRD0wLGVyclR5cGU9XCJcIixlcnJNc2c9XCJcIixpbmZvPTApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pZD0gaWQ7XG4gICAgICAgIHRoaXMuY21kTmFtZT1jbWROYW1lO1xuICAgICAgICB0aGlzLmNtZElEPSBjbWRJRDtcbiAgICAgICAgdGhpcy5lcnJJRD1lcnJJRDtcbiAgICAgICAgdGhpcy5lcnJUeXBlPSBlcnJUeXBlO1xuICAgICAgICB0aGlzLmVyck1zZz0gZXJyTXNnO1xuICAgICAgICB0aGlzLmluZm89IGluZm87XG4gICAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEtNU3RydWN0dXJlQmFzZTpLTVN0cnVjdHVyZUJhc2UsXG4gICAgS01WZWN0b3IyOktNVmVjdG9yMixcbiAgICAvL0tNVmVjdG9yMzpLTVZlY3RvcjMsXG4gICAgS01JbXVTdGF0ZTpLTUltdVN0YXRlLFxuICAgIEtNTGVkU3RhdGU6S01MZWRTdGF0ZSxcbiAgICBLTVJvdFN0YXRlOktNUm90U3RhdGUsXG4gICAgS01EZXZpY2VJbmZvOktNRGV2aWNlSW5mbyxcbiAgICBLTU1vdG9yTG9nOktNTW90b3JMb2dcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9LTVN0cnVjdHVyZXMuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKioqXG4gKiBLTVV0bC5qc1xuICogQ0NyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAY2xhc3NkZXNjIOODpuODvOODhuOCo+ODquODhuOCo1xuICovXG5jbGFzcyBLTVV0bHtcblxuICAgIC8qKlxuICAgICAqIOaVsOWApOOBq+OCreODo+OCueODiOOBmeOCi+mWouaVsFxuICAgICAqIOaVsOWApOS7peWkluOBrzDjgpLov5TjgZk8YnI+XG4gICAgICogSW5maW5pdHnjgoIw44Go44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWZhdWx0dmFsIHZhbOOBjOaVsOWApOOBq+WkieaPm+WHuuadpeOBquOBhOWgtOWQiOOBruODh+ODleOCqeODq+ODiFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIHRvTnVtYmVyKHZhbCwgZGVmYXVsdHZhbCA9IDApIHtcbiAgICAgICAgbGV0IHYgPSBwYXJzZUZsb2F0KHZhbCwgMTApO1xuICAgICAgICByZXR1cm4gKCFpc0Zpbml0ZSh2KSA/IGRlZmF1bHR2YWwgOiB2KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIOaVsOWApOOBq+OCreODo+OCueODiOOBmeOCi+mWouaVsCBpbnTlm7rlrppcbiAgICAgKiDmlbDlgKTku6XlpJbjga8w44KS6L+U44GZPGJyPlxuICAgICAqIEluZmluaXR544KCMOOBqOOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWxcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVmYXVsdHZhbCB2YWzjgYzmlbDlgKTjgavlpInmj5vlh7rmnaXjgarjgYTloLTlkIjjga7jg4fjg5Xjgqnjg6vjg4hcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyB0b0ludE51bWJlcih2YWwsIGRlZmF1bHR2YWwgPSAwKSB7XG4gICAgICAgIGxldCB2ID0gcGFyc2VJbnQodmFsLCAxMCk7XG4gICAgICAgIHJldHVybiAoIWlzRmluaXRlKHYpID8gZGVmYXVsdHZhbCA6IHYpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICog6KeS5bqm44Gu5Y2Y5L2N5aSJ5o+b44CAZGVncmVlID4+IHJhZGlhblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWdyZWUg5bqmXG4gICAgICogQHJldHVybnMge251bWJlcn0gcmFkaWFuXG4gICAgICovXG4gICAgc3RhdGljIGRlZ3JlZVRvUmFkaWFuKGRlZ3JlZSkge1xuICAgICAgICByZXR1cm4gZGVncmVlICogMC4wMTc0NTMyOTI1MTk5NDMyOTU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIOinkuW6puOBruWNmOS9jeWkieaPm+OAgHJhZGlhbiA+PiBkZWdyZWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkaWFuIHJhZGlhbuinklxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IOW6plxuICAgICAqL1xuICAgIHN0YXRpYyByYWRpYW5Ub0RlZ3JlZShyYWRpYW4pIHtcbiAgICAgICAgcmV0dXJuIHJhZGlhbiAvIDAuMDE3NDUzMjkyNTE5OTQzMjk1O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDpgJ/luqYgcnBtIC0+cmFkaWFuL3NlYyDjgavlpInmj5tcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcnBtXG4gICAgICogQHJldHVybnMge251bWJlcn0gcmFkaWFuL3NlY1xuICAgICAqL1xuICAgIHN0YXRpYyBycG1Ub1JhZGlhblNlYyhycG0pIHtcbiAgICAgICAgLy/pgJ/luqYgcnBtIC0+cmFkaWFuL3NlYyhNYXRoLlBJKjIvNjApXG4gICAgICAgIHJldHVybiBycG0gKiAwLjEwNDcxOTc1NTExOTY1OTc3O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogMueCuemWk+OBrui3nembouOBqOinkuW6puOCkuaxguOCgeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tX3hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbV95XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvX3hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9feVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIHR3b1BvaW50RGlzdGFuY2VBbmdsZShmcm9tX3gsIGZyb21feSwgdG9feCwgdG9feSkge1xuICAgICAgICBsZXQgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coZnJvbV94IC0gdG9feCwgMikgKyBNYXRoLnBvdyhmcm9tX3kgLSB0b195LCAyKSk7XG4gICAgICAgIGxldCByYWRpYW4gPSBNYXRoLmF0YW4yKGZyb21feSAtIHRvX3ksIGZyb21feCAtIHRvX3gpO1xuICAgICAgICByZXR1cm4ge2Rpc3Q6IGRpc3RhbmNlLCByYWRpOiByYWRpYW4sIGRlZzogS01VdGwucmFkaWFuVG9EZWdyZWUocmFkaWFuKX07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIOOCs+ODnuODs+ODieOBruODgeOCp+ODg+OCr+OCteODoOOCkuioiOeul1xuICAgICAqIEBpZ25vcmVcbiAgICAgKiBAZGVzYyDlj7PpgIHjgoogQ1JDLTE2LUNDSVRUICh4MTYgKyB4MTIgKyB4NSArIDEpIFN0YXJ0OjB4MDAwMCBYT1JPdXQ6MHgwMDAwIEJ5dGVPcmRlcjpMaXR0bGUtRW5kaWFuXG4gICAgICogQHBhcmFtIHVpbnQ4YXJyYXlCdWZmZXJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHN0YXRpYyBDcmVhdGVDb21tYW5kQ2hlY2tTdW1DUkMxNih1aW50OGFycmF5QnVmZmVyKXtcbiAgICAgICAgY29uc3QgY3JjMTZ0YWJsZT0gX19jcmMxNnRhYmxlO1xuICAgICAgICBsZXQgY3JjID0gMDsvLyBTdGFydDoweDAwMDBcbiAgICAgICAgbGV0IGxlbj11aW50OGFycmF5QnVmZmVyLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1aW50OGFycmF5QnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYyA9IHVpbnQ4YXJyYXlCdWZmZXJbaV07XG4gICAgICAgICAgICBjcmMgPSAoY3JjID4+IDgpIF4gY3JjMTZ0YWJsZVsoY3JjIF4gYykgJiAweDAwZmZdO1xuICAgICAgICB9XG4gICAgICAgIGNyYz0oKGNyYz4+OCkmMHhGRil8KChjcmM8PDgpJjB4RkYwMCk7Ly8gQnl0ZU9yZGVyOkxpdHRsZS1FbmRpYW5cbiAgICAgICAgLy9jcmM9MHhGRkZGXmNyYzsvL1hPUk91dDoweDAwMDBcbiAgICAgICAgcmV0dXJuIGNyYztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAIyBpbmZvOjogS01Db21CTEUuanPjga5ERVZJQ0UgSU5GT1JNQVRJT04gU0VSVklDReOBruODkeODvOOCueOBq+S9v+eUqFxuICAgICAqIHV0Zi5qcyAtIFVURi04IDw9PiBVVEYtMTYgY29udmVydGlvblxuICAgICAqXG4gICAgICogQGlnbm9yZVxuICAgICAqIEBwYXJhbSBhcnJheVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAZGVzY1xuICAgICAqIENvcHlyaWdodCAoQykgMTk5OSBNYXNhbmFvIEl6dW1vIDxpekBvbmljb3MuY28uanA+XG4gICAgICogVmVyc2lvbjogMS4wXG4gICAgICogTGFzdE1vZGlmaWVkOiBEZWMgMjUgMTk5OVxuICAgICAqIFRoaXMgbGlicmFyeSBpcyBmcmVlLiAgWW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdC5cbiAgICAgKi9cbiAgICBzdGF0aWMgVXRmOEFycmF5VG9TdHIoYXJyYXkpIHtcbiAgICAgICAgbGV0IG91dCwgaSwgbGVuLCBjO1xuICAgICAgICBsZXQgY2hhcjIsIGNoYXIzO1xuXG4gICAgICAgIG91dCA9IFwiXCI7XG4gICAgICAgIGxlbiA9IGFycmF5Lmxlbmd0aDtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIHdoaWxlKGkgPCBsZW4pIHtcbiAgICAgICAgICAgIGMgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgc3dpdGNoKGMgPj4gNClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogY2FzZSAyOiBjYXNlIDM6IGNhc2UgNDogY2FzZSA1OiBjYXNlIDY6IGNhc2UgNzpcbiAgICAgICAgICAgICAgICAvLyAweHh4eHh4eFxuICAgICAgICAgICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTI6IGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgLy8gMTEweCB4eHh4ICAgMTB4eCB4eHh4XG4gICAgICAgICAgICAgICAgY2hhcjIgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDB4MUYpIDw8IDYpIHwgKGNoYXIyICYgMHgzRikpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICAgICAgICAgIC8vIDExMTAgeHh4eCAgMTB4eCB4eHh4ICAxMHh4IHh4eHhcbiAgICAgICAgICAgICAgICAgICAgY2hhcjIgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgICAgICAgICBjaGFyMyA9IGFycmF5W2krK107XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDB4MEYpIDw8IDEyKSB8XG4gICAgICAgICAgICAgICAgICAgICAgICAoKGNoYXIyICYgMHgzRikgPDwgNikgfFxuICAgICAgICAgICAgICAgICAgICAgICAgKChjaGFyMyAmIDB4M0YpIDw8IDApKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQCMgaW5mbzo6IOODh+ODkOODg+OCsOeUqFxuICAgICAqIHVpbnQ4QXJyYXkgPT4gVVRGLTE2IFN0cmluZ3MgY29udmVydGlvblxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBAcGFyYW0gdWludDhBcnJheVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgc3RhdGljIFVpbnQ4QXJyYXlUb0hleFN0cih1aW50OEFycmF5KXtcbiAgICAgICAgaWYoIXVpbnQ4QXJyYXkgaW5zdGFuY2VvZiBVaW50OEFycmF5KXtyZXR1cm47fVxuICAgICAgICBsZXQgYXI9W107XG4gICAgICAgIGZvcihsZXQgaT0wO2k8dWludDhBcnJheS5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIGFyLnB1c2godWludDhBcnJheVtpXS50b1N0cmluZygxNikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhci5qb2luKCc6Jyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQCMgaW5mbzo6VWludDjjga5Db25jYXRcbiAgICAgKiBDcmVhdGVzIGEgbmV3IFVpbnQ4QXJyYXkgYmFzZWQgb24gdHdvIGRpZmZlcmVudCBBcnJheUJ1ZmZlcnNcbiAgICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyc30gdThBcnJheTEgVGhlIGZpcnN0IGJ1ZmZlci5cbiAgICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyc30gdThBcnJheTIgVGhlIHNlY29uZCBidWZmZXIuXG4gICAgICogQHJldHVybiB7QXJyYXlCdWZmZXJzfSBUaGUgbmV3IEFycmF5QnVmZmVyIGNyZWF0ZWQgb3V0IG9mIHRoZSB0d28uXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIHN0YXRpYyBVaW50OEFycmF5Q29uY2F0KHU4QXJyYXkxLCB1OEFycmF5Mikge1xuICAgICAgICBsZXQgdG1wID0gbmV3IFVpbnQ4QXJyYXkodThBcnJheTEuYnl0ZUxlbmd0aCArIHU4QXJyYXkyLmJ5dGVMZW5ndGgpO1xuICAgICAgICB0bXAuc2V0KG5ldyBVaW50OEFycmF5KHU4QXJyYXkxKSwgMCk7XG4gICAgICAgIHRtcC5zZXQobmV3IFVpbnQ4QXJyYXkodThBcnJheTIpLCB1OEFycmF5MS5ieXRlTGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIHRtcDtcbiAgICB9XG5cblxufVxuXG4vKipcbiAqIENyZWF0ZUNvbW1hbmRDaGVja1N1bUNSQzE255SoIENSQ+ODhuODvOODluODq1xuICogQGlnbm9yZVxuICogQHR5cGUge1VpbnQxNkFycmF5fVxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgX19jcmMxNnRhYmxlPW5ldyBVaW50MTZBcnJheShbXG4gICAgMCAsIDB4MTE4OSAsIDB4MjMxMiAsIDB4MzI5YiAsIDB4NDYyNCAsIDB4NTdhZCAsIDB4NjUzNiAsIDB4NzRiZiAsXG4gICAgMHg4YzQ4ICwgMHg5ZGMxICwgMHhhZjVhICwgMHhiZWQzICwgMHhjYTZjICwgMHhkYmU1ICwgMHhlOTdlICwgMHhmOGY3ICxcbiAgICAweDEwODEgLCAweDAxMDggLCAweDMzOTMgLCAweDIyMWEgLCAweDU2YTUgLCAweDQ3MmMgLCAweDc1YjcgLCAweDY0M2UgLFxuICAgIDB4OWNjOSAsIDB4OGQ0MCAsIDB4YmZkYiAsIDB4YWU1MiAsIDB4ZGFlZCAsIDB4Y2I2NCAsIDB4ZjlmZiAsIDB4ZTg3NiAsXG4gICAgMHgyMTAyICwgMHgzMDhiICwgMHgwMjEwICwgMHgxMzk5ICwgMHg2NzI2ICwgMHg3NmFmICwgMHg0NDM0ICwgMHg1NWJkICxcbiAgICAweGFkNGEgLCAweGJjYzMgLCAweDhlNTggLCAweDlmZDEgLCAweGViNmUgLCAweGZhZTcgLCAweGM4N2MgLCAweGQ5ZjUgLFxuICAgIDB4MzE4MyAsIDB4MjAwYSAsIDB4MTI5MSAsIDB4MDMxOCAsIDB4NzdhNyAsIDB4NjYyZSAsIDB4NTRiNSAsIDB4NDUzYyAsXG4gICAgMHhiZGNiICwgMHhhYzQyICwgMHg5ZWQ5ICwgMHg4ZjUwICwgMHhmYmVmICwgMHhlYTY2ICwgMHhkOGZkICwgMHhjOTc0ICxcblxuICAgIDB4NDIwNCAsIDB4NTM4ZCAsIDB4NjExNiAsIDB4NzA5ZiAsIDB4MDQyMCAsIDB4MTVhOSAsIDB4MjczMiAsIDB4MzZiYiAsXG4gICAgMHhjZTRjICwgMHhkZmM1ICwgMHhlZDVlICwgMHhmY2Q3ICwgMHg4ODY4ICwgMHg5OWUxICwgMHhhYjdhICwgMHhiYWYzICxcbiAgICAweDUyODUgLCAweDQzMGMgLCAweDcxOTcgLCAweDYwMWUgLCAweDE0YTEgLCAweDA1MjggLCAweDM3YjMgLCAweDI2M2EgLFxuICAgIDB4ZGVjZCAsIDB4Y2Y0NCAsIDB4ZmRkZiAsIDB4ZWM1NiAsIDB4OThlOSAsIDB4ODk2MCAsIDB4YmJmYiAsIDB4YWE3MiAsXG4gICAgMHg2MzA2ICwgMHg3MjhmICwgMHg0MDE0ICwgMHg1MTlkICwgMHgyNTIyICwgMHgzNGFiICwgMHgwNjMwICwgMHgxN2I5ICxcbiAgICAweGVmNGUgLCAweGZlYzcgLCAweGNjNWMgLCAweGRkZDUgLCAweGE5NmEgLCAweGI4ZTMgLCAweDhhNzggLCAweDliZjEgLFxuICAgIDB4NzM4NyAsIDB4NjIwZSAsIDB4NTA5NSAsIDB4NDExYyAsIDB4MzVhMyAsIDB4MjQyYSAsIDB4MTZiMSAsIDB4MDczOCAsXG4gICAgMHhmZmNmICwgMHhlZTQ2ICwgMHhkY2RkICwgMHhjZDU0ICwgMHhiOWViICwgMHhhODYyICwgMHg5YWY5ICwgMHg4YjcwICxcblxuICAgIDB4ODQwOCAsIDB4OTU4MSAsIDB4YTcxYSAsIDB4YjY5MyAsIDB4YzIyYyAsIDB4ZDNhNSAsIDB4ZTEzZSAsIDB4ZjBiNyAsXG4gICAgMHgwODQwICwgMHgxOWM5ICwgMHgyYjUyICwgMHgzYWRiICwgMHg0ZTY0ICwgMHg1ZmVkICwgMHg2ZDc2ICwgMHg3Y2ZmICxcbiAgICAweDk0ODkgLCAweDg1MDAgLCAweGI3OWIgLCAweGE2MTIgLCAweGQyYWQgLCAweGMzMjQgLCAweGYxYmYgLCAweGUwMzYgLFxuICAgIDB4MThjMSAsIDB4MDk0OCAsIDB4M2JkMyAsIDB4MmE1YSAsIDB4NWVlNSAsIDB4NGY2YyAsIDB4N2RmNyAsIDB4NmM3ZSAsXG4gICAgMHhhNTBhICwgMHhiNDgzICwgMHg4NjE4ICwgMHg5NzkxICwgMHhlMzJlICwgMHhmMmE3ICwgMHhjMDNjICwgMHhkMWI1ICxcbiAgICAweDI5NDIgLCAweDM4Y2IgLCAweDBhNTAgLCAweDFiZDkgLCAweDZmNjYgLCAweDdlZWYgLCAweDRjNzQgLCAweDVkZmQgLFxuICAgIDB4YjU4YiAsIDB4YTQwMiAsIDB4OTY5OSAsIDB4ODcxMCAsIDB4ZjNhZiAsIDB4ZTIyNiAsIDB4ZDBiZCAsIDB4YzEzNCAsXG4gICAgMHgzOWMzICwgMHgyODRhICwgMHgxYWQxICwgMHgwYjU4ICwgMHg3ZmU3ICwgMHg2ZTZlICwgMHg1Y2Y1ICwgMHg0ZDdjICxcblxuICAgIDB4YzYwYyAsIDB4ZDc4NSAsIDB4ZTUxZSAsIDB4ZjQ5NyAsIDB4ODAyOCAsIDB4OTFhMSAsIDB4YTMzYSAsIDB4YjJiMyAsXG4gICAgMHg0YTQ0ICwgMHg1YmNkICwgMHg2OTU2ICwgMHg3OGRmICwgMHgwYzYwICwgMHgxZGU5ICwgMHgyZjcyICwgMHgzZWZiICxcbiAgICAweGQ2OGQgLCAweGM3MDQgLCAweGY1OWYgLCAweGU0MTYgLCAweDkwYTkgLCAweDgxMjAgLCAweGIzYmIgLCAweGEyMzIgLFxuICAgIDB4NWFjNSAsIDB4NGI0YyAsIDB4NzlkNyAsIDB4Njg1ZSAsIDB4MWNlMSAsIDB4MGQ2OCAsIDB4M2ZmMyAsIDB4MmU3YSAsXG4gICAgMHhlNzBlICwgMHhmNjg3ICwgMHhjNDFjICwgMHhkNTk1ICwgMHhhMTJhICwgMHhiMGEzICwgMHg4MjM4ICwgMHg5M2IxICxcbiAgICAweDZiNDYgLCAweDdhY2YgLCAweDQ4NTQgLCAweDU5ZGQgLCAweDJkNjIgLCAweDNjZWIgLCAweDBlNzAgLCAweDFmZjkgLFxuICAgIDB4Zjc4ZiAsIDB4ZTYwNiAsIDB4ZDQ5ZCAsIDB4YzUxNCAsIDB4YjFhYiAsIDB4YTAyMiAsIDB4OTJiOSAsIDB4ODMzMCAsXG4gICAgMHg3YmM3ICwgMHg2YTRlICwgMHg1OGQ1ICwgMHg0OTVjICwgMHgzZGUzICwgMHgyYzZhICwgMHgxZWYxICwgMHgwZjc4XG5dKTtcblxubW9kdWxlLmV4cG9ydHMgPSBLTVV0bDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9LTVV0bC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKipcbiAqIEtNQ29tV2ViQkxFLmpzXG4gKiB2ZXJzaW9uIDAuMS4wIGFscGhhXG4gKiBDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4ndXNlIHN0cmljdCc7XG5jb25zdCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcbmNvbnN0IEtNQ29tQmFzZSA9IHJlcXVpcmUoJy4vS01Db21CYXNlJyk7XG5jb25zdCBLTVN0cnVjdHVyZXM9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMnKTtcblxuLyoqXG4gKiBAY2xhc3NkZXNjIOODluODqeOCpuOCtueUqFdlYkJsdWV0b29o6YCa5L+h44Kv44Op44K5KGNocm9tZeS+neWtmClcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01Db21XZWJCTEUgZXh0ZW5kcyBLTUNvbUJhc2V7XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5a6a5pWwXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLnR5cGU9XCJXRUJCTEVcIjtcbiAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzPXt9O1xuICAgICAgICB0aGlzLl9ibGVTZW5kaW5nUXVlPVByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgdGhpcy5fcXVlQ291bnQ9MDtcbiAgICAgICAgXG4gICAgICAgIC8v44K144O844OT44K5VVVJRFxuICAgICAgICB0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEPSdmMTQwZWEzNS04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnO1xuXG4gICAgICAgIC8v44Kt44Oj44Op44Kv44K/44Oq44K544OG44Kj44Kv44K5VVVJRFxuICAgICAgICB0aGlzLl9NT1RPUl9CTEVfQ1JTPXtcbiAgICAgICAgICAgICdNT1RPUl9UWCc6J2YxNDAwMDAxLTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4YycsLy/ml6cgTU9UT1JfQ09OVFJPTFxuICAgICAgICAgICAgLy8nTU9UT1JfTEVEJzonZjE0MDAwMDMtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJywvL+ODouODvOOCv+ODvOOBrkxFROOCkuWPluOCiuaJseOBhiBpbmZvOjogTU9UT1JfQ09OVFJPTDo6YmxlTGVk44Gn5Luj55SoXG4gICAgICAgICAgICAnTU9UT1JfTUVBU1VSRU1FTlQnOidmMTQwMDAwNC04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLFxuICAgICAgICAgICAgJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCc6J2YxNDAwMDA1LTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4YycsXG4gICAgICAgICAgICAnTU9UT1JfUlgnOidmMTQwMDAwNi04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLC8v5penIE1PVE9SX1NFVFRJTkdcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFM9e1xuICAgICAgICAgICAgXCJTZXJ2aWNlXCI6MHgxODBhXG4gICAgICAgICAgICAsXCJNYW51ZmFjdHVyZXJOYW1lU3RyaW5nXCI6MHgyYTI5XG4gICAgICAgICAgICAsXCJIYXJkd2FyZVJldmlzaW9uU3RyaW5nXCI6MHgyYTI3XG4gICAgICAgICAgICAsXCJGaXJtd2FyZVJldmlzaW9uU3RyaW5nXCI6MHgyYTI2XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJMReWIh+aWreaZglxuICAgICAgICAgKiBAcGFyYW0gZXZlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgIHRoaXMuX29uQmxlQ29ubmVjdGlvbkxvc3Q9KGV2ZSk9PntcbiAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q9ZmFsc2U7XG4gICAgICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW51bGw7XG4gICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaXNDb25uZWN0KGZhbHNlKTtcbiAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44Oi44O844K/44O85Zue6Lui5oOF5aCx5Y+X5L+hXG4gICAgICAgICAqIEBwYXJhbSBldmVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTm90aWZ5IFZhbHVlXG4gICAgICAgICAqICBieXRlWzBdLWJ5dGVbM11cdCAgICBieXRlWzRdLWJ5dGVbN11cdCAgICAgICAgYnl0ZVs4XS1ieXRlWzExXVxuICAgICAgICAgKiAgZmxvYXQgKiBcdFx0ICAgICAgICBmbG9hdCAqICAgICAgICAgICAgICAgICBmbG9hdCAqXG4gICAgICAgICAqICBwb3NpdGlvbjpyYWRpYW5zXHQgICAgc3BlZWQ6cmFkaWFucy9zZWNvbmRcdHRvcnF1ZTpO44O7bVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25CbGVNb3Rvck1lYXN1cmVtZW50PShldmUpPT57XG4gICAgICAgICAgICBpZighZXZlfHwhZXZlLnRhcmdldCl7cmV0dXJuO31cbiAgICAgICAgICAgIGxldCBkdiA9IGV2ZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICBpZighKGR2IGluc3RhbmNlb2YgRGF0YVZpZXcpKXtyZXR1cm47fS8vaW5mbzo6d2ViIGJsdWV0b29o44Gu44G/IG5vZGUuanPjga9pbnN0YW5jZW9mIEJ1ZmZlclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uPWR2LmdldEZsb2F0MzIoMCxmYWxzZSk7XG4gICAgICAgICAgICBsZXQgdmVsb2NpdHk9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgIGxldCB0b3JxdWU9ZHYuZ2V0RmxvYXQzMig4LGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JNZWFzdXJlbWVudENCKG5ldyBLTVN0cnVjdHVyZXMuS01Sb3RTdGF0ZShwb3NpdGlvbix2ZWxvY2l0eSx0b3JxdWUpKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIOODouODvOOCv+ODvElNVeaDheWgseWPl+S/oVxuICAgICAgICAgKiBAcGFyYW0gZXZlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEAjXG4gICAgICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIE5vdGlmeSBWYWx1ZVxuICAgICAgICAgKiBhY2NlbF94LCBhY2NlbF95LCBhY2NlbF96LCB0ZW1wLCBneXJvX3gsIGd5cm9feSwgZ3lyb196IOOBjOWFqOOBpui/lOOBo+OBpuOBj+OCi+OAguWPluW+l+mWk+malOOBrzEwMG1zIOWbuuWumlxuICAgICAgICAgKiBieXRlKEJpZ0VuZGlhbikgIFswXVsxXSBbMl1bM10gIFs0XVs1XSAgIFs2XVs3XVx0ICAgIFs4XVs5XVx0WzEwXVsxMV0gICAgWzEyXVsxM11cbiAgICAgICAgICogICAgICAgICAgICAgICAgICBpbnQxNl90IGludDE2X3QgaW50MTZfdCBpbnQxNl90ICAgICBpbnQxNl90IGludDE2X3QgaW50MTZfdFxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgIGFjY2VsLXggYWNjZWwteSBhY2NlbC16IHRlbXBcdCAgICBneXJvLXhcdGd5cm8teVx0Z3lyby16XG4gICAgICAgICAqXG4gICAgICAgICAqIGludDE2X3Q6LTMyLDc2OOOAnDMyLDc2OFxuICAgICAgICAgKiDmnLrjga7kuIrjgavjg6Ljg7zjgr/jg7zjgpLnva7jgYTjgZ/loLTlkIjjgIHliqDpgJ/luqbjgIB6ID0gMTYwMDAg56iL5bqm44Go44Gq44KL44CC77yI6YeN5Yqb5pa55ZCR44Gu44Gf44KB77yJXG4gICAgICAgICAqXG4gICAgICAgICAqIOWNmOS9jeWkieaPm++8iS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjgIDliqDpgJ/luqYgdmFsdWUgW0ddID0gcmF3X3ZhbHVlICogMiAvIDMyLDc2N1xuICAgICAgICAgKiDjgIDmuKnluqYgdmFsdWUgW+KEg10gPSByYXdfdmFsdWUgLyAzMzMuODcgKyAyMS4wMFxuICAgICAgICAgKiDjgIDop5LpgJ/luqZcbiAgICAgICAgICog44CA44CAdmFsdWUgW2RlZ3JlZS9zZWNvbmRdID0gcmF3X3ZhbHVlICogMjUwIC8gMzIsNzY3XG4gICAgICAgICAqIOOAgOOAgHZhbHVlIFtyYWRpYW5zL3NlY29uZF0gPSByYXdfdmFsdWUgKiAwLjAwMDEzMzE2MjExXG4gICAgICAgICAqXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vbkJsZUltdU1lYXN1cmVtZW50PShldmUpPT57XG4gICAgICAgICAgICBpZighZXZlfHwhZXZlLnRhcmdldCl7cmV0dXJuO31cbiAgICAgICAgICAgIGxldCBkdiA9IGV2ZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICBsZXQgdGVtcENhbGlicmF0aW9uPS01Ljc7Ly/muKnluqbmoKHmraPlgKRcbiAgICAgICAgICAgIGlmKCEoZHYgaW5zdGFuY2VvZiBEYXRhVmlldykpe3JldHVybjt9Ly9pbmZvOjp3ZWIgYmx1ZXRvb2jjga7jgb8gbm9kZS5qc+OBr2luc3RhbmNlb2YgQnVmZmVyXG4gICAgICAgICAgICAvL+WNmOS9jeOCkuaJseOBhOaYk+OBhOOCiOOBhuOBq+WkieaPm1xuICAgICAgICAgICAgbGV0IGFjY2VsWD1kdi5nZXRJbnQxNigwLGZhbHNlKSoyLzMyNzY3O1xuICAgICAgICAgICAgbGV0IGFjY2VsWT1kdi5nZXRJbnQxNigyLGZhbHNlKSoyLzMyNzY3O1xuICAgICAgICAgICAgbGV0IGFjY2VsWj1kdi5nZXRJbnQxNig0LGZhbHNlKSoyLzMyNzY3O1xuICAgICAgICAgICAgbGV0IHRlbXA9KGR2LmdldEludDE2KDYsZmFsc2UpKSAvIDMzMy44NyArIDIxLjAwK3RlbXBDYWxpYnJhdGlvbjtcbiAgICAgICAgICAgIGxldCBneXJvWD1kdi5nZXRJbnQxNig4LGZhbHNlKSoyNTAvMzI3Njc7XG4gICAgICAgICAgICBsZXQgZ3lyb1k9ZHYuZ2V0SW50MTYoMTAsZmFsc2UpKjI1MC8zMjc2NztcbiAgICAgICAgICAgIGxldCBneXJvWj1kdi5nZXRJbnQxNigxMixmYWxzZSkqMjUwLzMyNzY3O1xuXG4gICAgICAgICAgICB0aGlzLl9vbkltdU1lYXN1cmVtZW50Q0IobmV3IEtNU3RydWN0dXJlcy5LTUltdVN0YXRlKGFjY2VsWCxhY2NlbFksYWNjZWxaLHRlbXAsZ3lyb1gsZ3lyb1ksZ3lyb1opKTtcblxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zjg63jgrDmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIHtCdWZmZXJ9IGRhdGFcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTm90aWZ5IHZhbHVlXG4gICAgICAgICAqIGJ5dGVbMF1cdGJ5dGVbMS0yXVx0Ynl0ZVszXVx0Ynl0ZVs0LTddXHRieXRlWzgtMTFdXHRieXRlWzEyLTEzXVxuICAgICAgICAgKiB1aW50OF90OnR4X3R5cGVcdHVpbnQxNl90OmlkXHR1aW50OF90OmNvbW1hbmRcdHVpbnQzMl90OmVycm9yQ29kZVx0dWludDMyX3Q6aW5mb1x0dWludDE2X3Q6Q1JDXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vbkJsZU1vdG9yTG9nPShldmUpPT57XG4gICAgICAgICAgICBpZighZXZlfHwhZXZlLnRhcmdldCl7cmV0dXJuO31cbiAgICAgICAgICAgIGxldCBkdiA9IGV2ZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICBpZighKGR2IGluc3RhbmNlb2YgRGF0YVZpZXcpKXtyZXR1cm47fS8vaW5mbzo6d2ViIGJsdWV0b29o44Gu44G/IG5vZGUuanPjga9pbnN0YW5jZW9mIEJ1ZmZlclxuICAgICAgICAgICAgbGV0IHR4VHlwZT1kdi5nZXRVaW50OCgwKTsvL+OCqOODqeODvOODreOCsOOCv+OCpOODlzoweEJF5Zu65a6aXG4gICAgICAgICAgICBpZih0eFR5cGUhPT0weEJFKXtyZXR1cm47fVxuXG4gICAgICAgICAgICBsZXQgaWQ9ZHYuZ2V0VWludDE2KDEsZmFsc2UpOy8v6YCB5L+hSURcbiAgICAgICAgICAgIGxldCBjbWRJRD1kdi5nZXRVaW50OCgzLGZhbHNlKTtcbiAgICAgICAgICAgIGxldCBlcnJDb2RlPWR2LmdldFVpbnQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgIGxldCBpbmZvPWR2LmdldFVpbnQzMig4LGZhbHNlKTtcbiAgICAgICAgICAgIC8v44Ot44Kw5Y+W5b6XXG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yTG9nQ0IobmV3IEtNU3RydWN0dXJlcy5LTU1vdG9yTG9nKGlkLG51bGwsY21kSUQsdGhpcy5fTU9UT1JfTE9HX0VSUk9SQ09ERVtlcnJDb2RlXS5pZCx0aGlzLl9NT1RPUl9MT0dfRVJST1JDT0RFW2VyckNvZGVdLnR5cGUsdGhpcy5fTU9UT1JfTE9HX0VSUk9SQ09ERVtlcnJDb2RlXS5tc2csaW5mbykpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44Oi44O844K/44O86Kit5a6a5oOF5aCx5Y+W5b6XXG4gICAgICAgICAqIEBwYXJhbSBldmVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTm90aWZ5IHZhbHVlXG4gICAgICAgICAqIGJ5dGVbMF1cdGJ5dGVbMV1cdGJ5dGVbMl1cdGJ5dGVbM10gYnl0ZVs0XeS7pemZjVx0Ynl0ZVtuLTJdXHRieXRlW24tMV1cbiAgICAgICAgICogdWludDhfdDp0eF90eXBlXHR1aW50MTZfdDppZFx0dWludDhfdDpyZWdpc3Rlclx0dWludDhfdDp2YWx1ZVx0dWludDE2X3Q6Q1JDXG4gICAgICAgICAqIDB4NDBcdHVpbnQxNl90ICgyYnl0ZSkgMO+9njY1NTM1XHTjg6zjgrjjgrnjgr/jgrPjg57jg7Pjg4lcdOODrOOCuOOCueOCv+OBruWApO+8iOOCs+ODnuODs+ODieOBq+OCiOOBo+OBpuWkieOCj+OCi++8iVx0dWludDE2X3QgKDJieXRlKSAw772eNjU1MzVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29uQmxlTW90b3JTZXR0aW5nPShldmUpPT57XG4gICAgICAgICAgICBpZighZXZlfHwhZXZlLnRhcmdldCl7cmV0dXJuO31cbiAgICAgICAgICAgIGxldCBkdiA9IGV2ZS50YXJnZXQudmFsdWU7Ly81K27jg5DjgqTjg4jjgIBcbiAgICAgICAgICAgIGxldCB1aW50OEFycmF5PW5ldyBVaW50OEFycmF5KGR2LmJ1ZmZlcik7Ly9pbmZvOjrkuIDml6bjgrPjg5Tjg7zjgZnjgovlv4XopoHjgYzjgYLjgotcbiAgICAgICAgICAgIGlmKCEoZHYgaW5zdGFuY2VvZiBEYXRhVmlldykpe3JldHVybjt9Ly9pbmZvOjp3ZWIgYmx1ZXRvb2jjga7jgb8gbm9kZS5qc+OBr2luc3RhbmNlb2YgQnVmZmVyXG5cbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgLy/jg4fjg7zjgr/jga5wYXJzZVxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICBsZXQgdHhMZW49ZHYuYnl0ZUxlbmd0aDtcbiAgICAgICAgICAgIGxldCB0eFR5cGU9ZHYuZ2V0VWludDgoMCk7Ly/jg6zjgrjjgrnjgr/mg4XloLHpgJrnn6XjgrPjg57jg7Pjg4lJRCAweDQw5Zu65a6aXG4gICAgICAgICAgICBpZih0eFR5cGUhPT0weDQwfHx0eExlbjw1KXtyZXR1cm47fS8v44Os44K444K544K/5oOF5aCx44KS5ZCr44G+44Gq44GE44OH44O844K/44Gu56C05qOEXG5cbiAgICAgICAgICAgIGxldCBpZD1kdi5nZXRVaW50MTYoMSxmYWxzZSk7Ly/pgIHkv6FJRFxuICAgICAgICAgICAgbGV0IHJlZ2lzdGVyQ21kPWR2LmdldFVpbnQ4KDMpOy8v44Os44K444K544K/44Kz44Oe44Oz44OJXG4gICAgICAgICAgICBsZXQgY3JjPWR2LmdldFVpbnQxNih0eExlbi0yLGZhbHNlKTsvL0NSQ+OBruWApCDmnIDlvozjgYvjgokyZHl0ZVxuXG4gICAgICAgICAgICBsZXQgcmVzPXt9O1xuICAgICAgICAgICAgLy/jgrPjg57jg7Pjg4nliKXjgavjgojjgovjg6zjgrjjgrnjgr/jga7lgKTjga7lj5blvpdbNC1uIGJ5dGVdXG4gICAgICAgICAgICBsZXQgc3RhcnRPZmZzZXQ9NDtcblxuICAgICAgICAgICAgc3dpdGNoKHJlZ2lzdGVyQ21kKXtcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1heFNwZWVkOlxuICAgICAgICAgICAgICAgICAgICByZXMubWF4U3BlZWQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubWluU3BlZWQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5taW5TcGVlZD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5jdXJ2ZVR5cGU6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5jdXJ2ZVR5cGU9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmFjYzpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmFjYz1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5kZWM6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5kZWM9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubWF4VG9ycXVlOlxuICAgICAgICAgICAgICAgICAgICByZXMubWF4VG9ycXVlPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnRlYWNoaW5nSW50ZXJ2YWw6XG4gICAgICAgICAgICAgICAgICAgIHJlcy50ZWFjaGluZ0ludGVydmFsPWR2LmdldFVpbnQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucGxheWJhY2tJbnRlcnZhbDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnBsYXliYWNrSW50ZXJ2YWw9ZHYuZ2V0VWludDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5xQ3VycmVudFA6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5xQ3VycmVudFA9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucUN1cnJlbnRJOlxuICAgICAgICAgICAgICAgICAgICByZXMucUN1cnJlbnRJPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnFDdXJyZW50RDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnFDdXJyZW50RD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5zcGVlZFA6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zcGVlZFA9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuc3BlZWRJOlxuICAgICAgICAgICAgICAgICAgICByZXMuc3BlZWRJPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnNwZWVkRDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNwZWVkRD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5wb3NpdGlvblA6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wb3NpdGlvblA9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubW90b3JNZWFzdXJlbWVudEludGVydmFsOlxuICAgICAgICAgICAgICAgICAgICByZXMubW90b3JNZWFzdXJlbWVudEludGVydmFsPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXMubW90b3JNZWFzdXJlbWVudEJ5RGVmYXVsdD1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuaW50ZXJmYWNlOlxuICAgICAgICAgICAgICAgICAgICByZXMuaW50ZXJmYWNlPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5yZXNwb25zZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnJlc3BvbnNlPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5vd25Db2xvcjpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm93bkNvbG9yPSgnIzAwMDAwMCcgK051bWJlcihkdi5nZXRVaW50OChzdGFydE9mZnNldCk8PDE2fGR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KzEpPDw4fGR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KzIpKS50b1N0cmluZygxNikpLnN1YnN0cigtNik7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuaU1VTWVhc3VyZW1lbnRJbnRlcnZhbDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmlNVU1lYXN1cmVtZW50SW50ZXJ2YWw9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmlNVU1lYXN1cmVtZW50QnlEZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXMuaU1VTWVhc3VyZW1lbnRCeURlZmF1bHQ9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmRldmljZU5hbWU6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5kZXZpY2VOYW1lPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXCJcIiwgdWludDhBcnJheS5zbGljZShzdGFydE9mZnNldCwtMikpOy8v5Y+v5aSJ44OQ44Kk44OI5paH5a2XXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuZGV2aWNlSW5mbzpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmRldmljZUluZm89U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcIlwiLCB1aW50OEFycmF5LnNsaWNlKHN0YXJ0T2Zmc2V0LC0yKSk7Ly/lj6/lpInjg5DjgqTjg4jmloflrZdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5zcGVlZDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNwZWVkPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnBvc2l0aW9uT2Zmc2V0OlxuICAgICAgICAgICAgICAgICAgICByZXMucG9zaXRpb25PZmZzZXQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubW92ZVRvOlxuICAgICAgICAgICAgICAgICAgICByZXMubW92ZVRvPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmhvbGQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5ob2xkPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnN0YXR1czpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnN0YXR1cz1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQudGFza3NldE5hbWU6XG4gICAgICAgICAgICAgICAgICAgIHJlcy50YXNrc2V0TmFtZT1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFwiXCIsIHVpbnQ4QXJyYXkuc2xpY2Uoc3RhcnRPZmZzZXQsLTIpKTsvL+WPr+WkieODkOOCpOODiOaWh+Wtl1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnRhc2tzZXRJbmZvOlxuICAgICAgICAgICAgICAgICAgICByZXMudGFza3NldEluZm89ZHYuZ2V0VWludDE2KHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC50YXNrc2V0VXNhZ2U6XG4gICAgICAgICAgICAgICAgICAgIHJlcy50YXNrc2V0VXNhZ2U9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1vdGlvbk5hbWU6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tb3Rpb25OYW1lPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXCJcIiwgdWludDhBcnJheS5zbGljZShzdGFydE9mZnNldCwtMikpOy8v5Y+v5aSJ44OQ44Kk44OI5paH5a2XXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubW90aW9uSW5mbzpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1vdGlvbkluZm89ZHYuZ2V0VWludDE2KHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tb3Rpb25Vc2FnZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1vdGlvblVzYWdlPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5pMkNTbGF2ZUFkZHJlc3M6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5pMkNTbGF2ZUFkZHJlc3M9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmxlZDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmxlZD17c3RhdGU6ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpLHI6ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQrMSksZzpkdi5nZXRVaW50OChzdGFydE9mZnNldCsyKSxiOmR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KzMpfTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5lbmFibGVDaGVja1N1bTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmVuYWJsZUNoZWNrU3VtPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5kZXZpY2VTZXJpYWw6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5kZXZpY2VTZXJpYWw9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcIlwiLCB1aW50OEFycmF5LnNsaWNlKHN0YXJ0T2Zmc2V0LC0yKSk7Ly/lj6/lpInjg5DjgqTjg4jmloflrZdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlcyk7XG5cbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JTZXR0aW5nQ0IocmVnaXN0ZXJDbWQscmVzKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBzZWN0aW9uOjrlhazplovjg6Hjgr3jg4Pjg4lcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICogV2ViQmx1ZXRvb2jjgafjga7mjqXntprjgpLplovlp4vjgZnjgotcbiAgICAgKi9cbiAgICBjb25uZWN0KCl7XG4gICAgICAgIGlmICh0aGlzLl9wZXJpcGhlcmFsJiYgdGhpcy5fcGVyaXBoZXJhbC5nYXR0JiZ0aGlzLl9wZXJpcGhlcmFsLmdhdHQuY29ubmVjdGVkICkge3JldHVybn1cbiAgICAgICAgbGV0IGdhdD0gKHRoaXMuX3BlcmlwaGVyYWwmJiB0aGlzLl9wZXJpcGhlcmFsLmdhdHQgKT90aGlzLl9wZXJpcGhlcmFsLmdhdHQgOnVuZGVmaW5lZDsvL+WGjeaOpee2mueUqFxuICAgICAgICB0aGlzLl9ibGVDb25uZWN0KGdhdCkudGhlbihvYmo9PnsvL2luZm86OiByZXNvbHZlKHtkZXZpY2VJRCxkZXZpY2VOYW1lLGJsZURldmljZSxjaGFyYWN0ZXJpc3RpY3N9KTtcbiAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9b2JqLmJsZURldmljZTtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uaWQ9dGhpcy5fcGVyaXBoZXJhbC5pZDtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8ubmFtZT10aGlzLl9wZXJpcGhlcmFsLm5hbWU7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmlzQ29ubmVjdD10aGlzLl9wZXJpcGhlcmFsLmdhdHQuY29ubmVjdGVkO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5tYW51ZmFjdHVyZXJOYW1lPW9iai5pbmZvbWF0aW9uLm1hbnVmYWN0dXJlck5hbWU7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmhhcmR3YXJlUmV2aXNpb249b2JqLmluZm9tYXRpb24uaGFyZHdhcmVSZXZpc2lvbjtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uZmlybXdhcmVSZXZpc2lvbj1vYmouaW5mb21hdGlvbi5maXJtd2FyZVJldmlzaW9uO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljcz1vYmouY2hhcmFjdGVyaXN0aWNzO1xuXG4gICAgICAgICAgICBpZighZ2F0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2dhdHRzZXJ2ZXJkaXNjb25uZWN0ZWQnLHRoaXMuX29uQmxlQ29ubmVjdGlvbkxvc3QpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWwuYWRkRXZlbnRMaXN0ZW5lcignZ2F0dHNlcnZlcmRpc2Nvbm5lY3RlZCcsIHRoaXMuX29uQmxlQ29ubmVjdGlvbkxvc3QpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9NRUFTVVJFTUVOVCddKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9NRUFTVVJFTUVOVCddLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yTWVhc3VyZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX01FQVNVUkVNRU5UJ10uYWRkRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JNZWFzdXJlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfTUVBU1VSRU1FTlQnXS5zdGFydE5vdGlmaWNhdGlvbnMoKS50aGVuKG9iaj0+e1xuICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCddKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfSU1VX01FQVNVUkVNRU5UJ10ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlSW11TWVhc3VyZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9JTVVfTUVBU1VSRU1FTlQnXS5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVJbXVNZWFzdXJlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9JTVVfTUVBU1VSRU1FTlQnXS5zdGFydE5vdGlmaWNhdGlvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIH0pLnRoZW4ob2JqPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX1JYJ10pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3RvclNldHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3RvckxvZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX1JYJ10uYWRkRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JTZXR0aW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX1JYJ10uYWRkRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JMb2cpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXS5zdGFydE5vdGlmaWNhdGlvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICB9KS50aGVuKG9iaj0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzQ2hhbmdlX2luaXQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaXNDb25uZWN0KHRydWUpOy8v5Yid5Zue44Gu44G/KGNvbXDku6XliY3jga/nmbrngavjgZfjgarjgYTngropXG4gICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzQ2hhbmdlX2lzQ29ubmVjdCh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goZXJyPT57XG4gICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW51bGw7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RGYWlsdXJlSGFuZGxlcih0aGlzLGVycik7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2ViQmx1ZXRvb2jjga7liIfmlq1cbiAgICAgKi9cbiAgICBkaXNDb25uZWN0KCl7XG4gICAgICAgaWYgKCF0aGlzLl9wZXJpcGhlcmFsIHx8ICF0aGlzLl9wZXJpcGhlcmFsLmdhdHQuY29ubmVjdGVkKXtyZXR1cm47fVxuICAgICAgICB0aGlzLl9wZXJpcGhlcmFsLmdhdHQuZGlzY29ubmVjdCgpO1xuICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW51bGw7XG5cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlhoXpg6hcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBCTEXmjqXntppcbiAgICAgKiBAcGFyYW0gZ2F0dF9vYmog44Oa44Ki44Oq44Oz44Kw5riI44G/44GuR0FUVOOBruODh+ODkOOCpOOCueOBq+WGjeaOpee2mueUqCjjg5rjgqLjg6rjg7PjgrDjg6Ljg7zjg4Djg6vjga/lh7rjgarjgYQpXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYmxlQ29ubmVjdChnYXR0X29iaikge1xuICAgICAgLy9sZXQgc2VsZiA9IHRoaXM7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgLy8gbGV0IGJsZURldmljZTtcbiAgICAgICAgICAvLyBsZXQgZGV2aWNlTmFtZTtcbiAgICAgICAgICAvLyBsZXQgZGV2aWNlSUQ7XG4gICAgICAgICAgaWYoIWdhdHRfb2JqKXtcbiAgICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICBmaWx0ZXJzOiBbe3NlcnZpY2VzOiBbdGhpcy5fTU9UT1JfQkxFX1NFUlZJQ0VfVVVJRF19XSxcbiAgICAgICAgICAgICAgICAgIG9wdGlvbmFsU2VydmljZXM6W3RoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLlNlcnZpY2VdXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIG5hdmlnYXRvci5ibHVldG9vdGgucmVxdWVzdERldmljZShvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oZGV2aWNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ibGVHYXRjb25uZWN0KGRldmljZS5nYXR0KS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxlRGV2aWNlOiBkZXZpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VJRDogZGV2aWNlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlTmFtZTogZGV2aWNlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3M6cmVzLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb246cmVzLmluZm9tYXRpb25cblxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgdGhpcy5fYmxlR2F0Y29ubmVjdChnYXR0X29iailcbiAgICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJfYmxlR2F0Y29ubmVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlSUQ6IGdhdHRfb2JqLmRldmljZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlTmFtZTogZ2F0dF9vYmouZGV2aWNlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJsZURldmljZTogZ2F0dF9vYmouZGV2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3M6cmVzLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvbjpyZXMuaW5mb21hdGlvblxuXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vR0FUVOaOpee2mueUqFxuICAgIF9ibGVHYXRjb25uZWN0KGdhdHRfb2JqKXtcbiAgICAgICAgICAgIGxldCBjaGFyYWN0ZXJpc3RpY3MgPSB7fTtcbiAgICAgICAgICAgIGxldCBpbmZvbWF0aW9uPXt9O1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChncmVzb2x2ZSwgZ3JlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgZ2F0dF9vYmouY29ubmVjdCgpLnRoZW4oc2VydmVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZXModGhpcy5fTU9UT1JfQkxFX1NFUlZJQ0VfVVVJRCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5fTU9UT1JfQkxFX1NFUlZJQ0VfVVVJRCkudGhlbihzZXJ2aWNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY3JzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fTU9UT1JfQkxFX0NSUykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNycy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLl9NT1RPUl9CTEVfQ1JTW2tleV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3Nba2V5XSA9IGNoYXJhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGNycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9ibGVfZmlybXdhcmVfcmV2aXNpb27jga7jgrXjg7zjg5Pjgrnlj5blvpcgaW5mbzo6QW5kcm9pZGTjgafjga/kuI3lronlrprjgarngrrlgZzmraJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHNyZXNvbHZlLCBzcmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLlNlcnZpY2UpLnRoZW4oKHNlcnZpY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5NYW51ZmFjdHVyZXJOYW1lU3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGFyYS5yZWFkVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb25bJ21hbnVmYWN0dXJlck5hbWUnXSA9IEtNVXRsLlV0ZjhBcnJheVRvU3RyKG5ldyBVaW50OEFycmF5KHZhbC5idWZmZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGUpPT57cmVqZWN0KGUpO30pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuRmlybXdhcmVSZXZpc2lvblN0cmluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNoYXJhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hhcmEucmVhZFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uWydmaXJtd2FyZVJldmlzaW9uJ10gPSBLTVV0bC5VdGY4QXJyYXlUb1N0cihuZXcgVWludDhBcnJheSh2YWwuYnVmZmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlKT0+e3JlamVjdChlKTt9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLkhhcmR3YXJlUmV2aXNpb25TdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjaGFyYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoYXJhLnJlYWRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbih2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvblsnaGFyZHdhcmVSZXZpc2lvbiddID0gS01VdGwuVXRmOEFycmF5VG9TdHIobmV3IFVpbnQ4QXJyYXkodmFsLmJ1ZmZlcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntyZWplY3QoZSk7fSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyZXNvbHZlKHtjaGFyYWN0ZXJpc3RpY3M6IGNoYXJhY3RlcmlzdGljcywgaW5mb21hdGlvbjogaW5mb21hdGlvbn0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQkxF44Kz44Oe44Oz44OJ44Gu6YCB5L+hXG4gICAgICogQHBhcmFtIGNvbW1hbmRUeXBlU3RyICAnTU9UT1JfQ09OVFJPTCcsJ01PVE9SX01FQVNVUkVNRU5UJywnTU9UT1JfSU1VX01FQVNVUkVNRU5UJywnTU9UT1JfUlgnXG4gICAgICog44Kz44Oe44Oz44OJ56iu5Yil44GuU3RyaW5nIOS4u+OBq0JMReOBruOCreODo+ODqeOCr+OCv+ODquOCueODhuOCo+OCr+OCueOBp+S9v+eUqOOBmeOCi1xuICAgICAqIEBwYXJhbSBjb21tYW5kTnVtXG4gICAgICogQHBhcmFtIGFycmF5YnVmZmVyXG4gICAgICogQHBhcmFtIG5vdGlmeVByb21pcyBjbWRSZWFkUmVnaXN0ZXLnrYnjga5CTEXlkbzjgbPlh7rjgZflvozjgatub3RpZnnjgaflj5blvpfjgZnjgovlgKTjgpJQcm9taXPjgafluLDjgZnlv4XopoHjga7jgYLjgovjgrPjg57jg7Pjg4nnlKhcbiAgICAgKiBAcGFyYW0gY2lkIOOCt+ODvOOCseODs+OCuUlEXG4gICAgICogQHJldHVybnMge251bWJlcn0gY2lkIOOCt+ODvOOCseODs+OCuUlEXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2VuZE1vdG9yQ29tbWFuZChjb21tYW5kQ2F0ZWdvcnksIGNvbW1hbmROdW0sIGFycmF5YnVmZmVyPW5ldyBBcnJheUJ1ZmZlcigwKSwgbm90aWZ5UHJvbWlzPW51bGwsY2lkPW51bGwpe1xuICAgICAgICBsZXQgY2hhcmFjdGVyaXN0aWNzPXRoaXMuX2NoYXJhY3RlcmlzdGljc1tjb21tYW5kQ2F0ZWdvcnldO1xuICAgICAgICBsZXQgYWI9bmV3IERhdGFWaWV3KGFycmF5YnVmZmVyKTtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihhcnJheWJ1ZmZlci5ieXRlTGVuZ3RoKzUpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLGNvbW1hbmROdW0pO1xuICAgICAgICBjaWQ9Y2lkPT09bnVsbD90aGlzLmNyZWF0ZUNvbW1hbmRJRDpjaWQ7Ly/jgrfjg7zjgrHjg7PjgrlJRCjjg6bjg4vjg7zjgq/lgKQpXG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigxLGNpZCk7XG4gICAgICAgIC8v44OH44O844K/44Gu5pu444GN6L6844G/XG4gICAgICAgIGZvcihsZXQgaT0wO2k8YXJyYXlidWZmZXIuYnl0ZUxlbmd0aDtpKyspe1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMytpLGFiLmdldFVpbnQ4KGkpKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3JjPUtNVXRsLkNyZWF0ZUNvbW1hbmRDaGVja1N1bUNSQzE2KG5ldyBVaW50OEFycmF5KGJ1ZmZlci5zbGljZSgwLGJ1ZmZlci5ieXRlTGVuZ3RoLTIpKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNihhcnJheWJ1ZmZlci5ieXRlTGVuZ3RoKzMsY3JjKTsvL2luZm86OkNSQ+ioiOeul1xuXG4gICAgICAgIC8vcXVl44Gr6L+95YqgXG4gICAgICAgLy8gKyt0aGlzLl9xdWVDb3VudDtcbiAgICAgICAgdGhpcy5fYmxlU2VuZGluZ1F1ZT0gdGhpcy5fYmxlU2VuZGluZ1F1ZS50aGVuKChyZXMpPT57XG4gICAgICAgICAgLy8gIGNvbnNvbGUubG9nKFwiX3NlbmRNb3RvckNvbW1hbmQgcXVlQ291bnQ6XCIrKC0tdGhpcy5fcXVlQ291bnQpKTtcbiAgICAgICAgICAgIGlmKG5vdGlmeVByb21pcyl7XG4gICAgICAgICAgICAgICAgbm90aWZ5UHJvbWlzLnN0YXJ0UmVqZWN0VGltZU91dENvdW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2hhcmFjdGVyaXN0aWNzLndyaXRlVmFsdWUoYnVmZmVyKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIC8v5aSx5pWX5pmC44CALy9pbmZvOjrlvozntprjga7jgrPjg57jg7Pjg4njga/lvJXjgY3ntprjgY3lrp/ooYzjgZXjgozjgotcbiAgICAgICAgICAvLyAgY29uc29sZS5sb2coXCJFUlIgX3NlbmRNb3RvckNvbW1hbmQ6XCIrcmVzK1wiIHF1ZUNvdW50OlwiKygtLXRoaXMuX3F1ZUNvdW50KSk7XG4gICAgICAgICAgICBpZihub3RpZnlQcm9taXMpe1xuICAgICAgICAgICAgICAgIG5vdGlmeVByb21pcy5jYWxsUmVqZWN0KHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2lkO1xuICAgIH1cblxuXG4vLy8vLy9jbGFzcy8vXG59XG5cbm1vZHVsZS5leHBvcnRzID1LTUNvbVdlYkJMRTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9LTUNvbVdlYkJMRS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIid1c2Ugc3RyaWN0Jztcbi8qKipcbiAqS01Db25uZWN0b3JCcm93c2VyLmpzXG4gKiB2ZXJzaW9uIDAuMS4wIGFscGhhXG4gKiBDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG5nbG9iYWwuS01VdGw9cmVxdWlyZSgnLi9LTVV0bC5qcycpO1xuZ2xvYmFsLktNVmVjdG9yMj1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNVmVjdG9yMjtcbmdsb2JhbC5LTUltdVN0YXRlPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01JbXVTdGF0ZTtcbmdsb2JhbC5LTUxlZFN0YXRlPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01MZWRTdGF0ZTtcbmdsb2JhbC5LTVJvdFN0YXRlPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01Sb3RTdGF0ZTtcbmdsb2JhbC5LTURldmljZUluZm89cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTURldmljZUluZm87XG5nbG9iYWwuS01Nb3RvckxvZz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNTW90b3JMb2c7XG5nbG9iYWwuS01Nb3Rvck9uZVdlYkJMRT1yZXF1aXJlKCcuL0tNTW90b3JPbmVXZWJCTEUuanMnKTtcblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9LTUNvbm5lY3RvckJyb3dzZXJXUEsuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKioqXG4gKktNTW90b3JPbmVXZWJCTEUuanNcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcblxubGV0IEtNQ29tV2ViQkxFID0gcmVxdWlyZSgnLi9LTUNvbVdlYkJMRScpO1xubGV0IEtNTW90b3JDb21tYW5kS01PbmU9cmVxdWlyZSgnLi9LTU1vdG9yQ29tbWFuZEtNT25lLmpzJyk7XG5cbi8qKlxuICogQGNsYXNzZGVzYyBLTS0x44GuV2ViQmx1ZXRvb2jmjqXntprnlKgg5Luu5oOz44OH44OQ44Kk44K5XG4gKi9cbmNsYXNzIEtNTW90b3JPbmVXZWJCTEUgZXh0ZW5kcyBLTU1vdG9yQ29tbWFuZEtNT25le1xuICAgIC8qKlxuICAgICAqIEtNTW90b3JPbmVXZWJCTEVcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTU1vdG9yQ29tbWFuZEtNT25lXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoS01Nb3RvckNvbW1hbmRLTU9uZS5LTV9DT05ORUNUX1RZUEUuV0VCQkxFLG5ldyBLTUNvbVdlYkJMRSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgajmjqXntprjgZnjgotcbiAgICAgKi9cbiAgICBjb25uZWN0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLmNvbm5lY3QoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgajliIfmlq1cbiAgICAgKi9cbiAgICBkaXNDb25uZWN0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLmRpc0Nvbm5lY3QoKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID1LTU1vdG9yT25lV2ViQkxFO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNTW90b3JPbmVXZWJCTEUuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKioqXG4gKiBLTUNvbUJhc2UuanNcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmxldCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcbmxldCBLTVN0cnVjdHVyZXM9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMnKTtcbi8qKlxuICogQGNsYXNzZGVzYyDpgJrkv6Hjgq/jg6njgrnjga7ln7rlupVcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01Db21CYXNle1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5a6a5pWwXG4gICAgKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvcuOAgFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuX2NvbW1hbmRDb3VudD0wO1xuICAgICAgICB0aGlzLl9kZXZpY2VJbmZvPW5ldyBLTVN0cnVjdHVyZXMuS01EZXZpY2VJbmZvKCk7XG5cbiAgICAgICAgdGhpcy5fbW90b3JNZWFzdXJlbWVudD1uZXcgS01TdHJ1Y3R1cmVzLktNUm90U3RhdGUoKTtcbiAgICAgICAgdGhpcy5fbW90b3JMZWQ9bmV3IEtNU3RydWN0dXJlcy5LTUxlZFN0YXRlKCk7XG4gICAgICAgIHRoaXMuX21vdG9ySW11TWVhc3VyZW1lbnQ9bmV3IEtNU3RydWN0dXJlcy5LTUltdVN0YXRlKCk7XG5cbiAgICAgICAgdGhpcy5fb25Jbml0SGFuZGxlcj1mdW5jdGlvbihjb25uZWN0b3Ipe307XG4gICAgICAgIHRoaXMuX29uQ29ubmVjdEhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yKXt9O1xuICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyPWZ1bmN0aW9uKGNvbm5lY3Rvcil7fTtcbiAgICAgICAgdGhpcy5fb25Db25uZWN0RmFpbHVyZUhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yLCBtc2cpe307XG5cbiAgICAgICAgdGhpcy5fb25Nb3Rvck1lYXN1cmVtZW50Q0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9vbkltdU1lYXN1cmVtZW50Q0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9vbk1vdG9yU2V0dGluZ0NCPWZ1bmN0aW9uKCl7fTtcbiAgICAgICAgdGhpcy5fb25Nb3RvckxvZ0NCPWZ1bmN0aW9uKCl7fTtcbiAgICAgICAgdGhpcy5faXNJbml0PWZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBfb25CbGVNb3RvclNldHRpbmfjga7jgrPjg57jg7Pjg4njgIDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHjga7pgJrnn6Xlj5fkv6HmmYLjgavjg5Hjg7zjgrnjgZnjgovnlKhcbiAgICAgICAgICogQHR5cGUge3ttYXhTcGVlZDogbnVtYmVyLCBtaW5TcGVlZDogbnVtYmVyLCBjdXJ2ZVR5cGU6IG51bWJlciwgYWNjOiBudW1iZXIsIGRlYzogbnVtYmVyLCBtYXhUb3JxdWU6IG51bWJlciwgcUN1cnJlbnRQOiBudW1iZXIsIHFDdXJyZW50STogbnVtYmVyLCBxQ3VycmVudEQ6IG51bWJlciwgc3BlZWRQOiBudW1iZXIsIHNwZWVkSTogbnVtYmVyLCBzcGVlZEQ6IG51bWJlciwgcG9zaXRpb25QOiBudW1iZXIsIG93bkNvbG9yOiBudW1iZXJ9fVxuICAgICAgICAgKiBAaWdub3JlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORD17XG4gICAgICAgICAgICAgICAgXCJtYXhTcGVlZFwiOjB4MDIsXG4gICAgICAgICAgICAgICAgXCJtaW5TcGVlZFwiOjB4MDMsXG4gICAgICAgICAgICAgICAgXCJjdXJ2ZVR5cGVcIjoweDA1LFxuICAgICAgICAgICAgICAgIFwiYWNjXCI6MHgwNyxcbiAgICAgICAgICAgICAgICBcImRlY1wiOjB4MDgsXG4gICAgICAgICAgICAgICAgXCJtYXhUb3JxdWVcIjoweDBFLFxuICAgICAgICAgICAgICAgIFwidGVhY2hpbmdJbnRlcnZhbFwiOjB4MTYsXG4gICAgICAgICAgICAgICAgXCJwbGF5YmFja0ludGVydmFsXCI6MHgxNyxcbiAgICAgICAgICAgICAgICBcInFDdXJyZW50UFwiOjB4MTgsXG4gICAgICAgICAgICAgICAgXCJxQ3VycmVudElcIjoweDE5LFxuICAgICAgICAgICAgICAgIFwicUN1cnJlbnREXCI6MHgxQSxcbiAgICAgICAgICAgICAgICBcInNwZWVkUFwiOjB4MUIsXG4gICAgICAgICAgICAgICAgXCJzcGVlZElcIjoweDFDLFxuICAgICAgICAgICAgICAgIFwic3BlZWREXCI6MHgxRCxcbiAgICAgICAgICAgICAgICBcInBvc2l0aW9uUFwiOjB4MUUsXG4gICAgICAgICAgICAgICAgXCJwb3NpdGlvbklcIjoweDFGLFxuICAgICAgICAgICAgICAgIFwicG9zaXRpb25EXCI6MHgyMCxcbiAgICAgICAgICAgICAgICBcInBvc0NvbnRyb2xUaHJlc2hvbGRcIjoweDIxLFxuICAgICAgICAgICAgICAgIFwibm90aWZ5UG9zQXJyaXZhbFwiOjB4MkIsXG4gICAgICAgICAgICAgICAgXCJtb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxcIjoweDJDLFxuICAgICAgICAgICAgICAgIFwibW90b3JNZWFzdXJlbWVudEJ5RGVmYXVsdFwiOjB4MkQsXG4gICAgICAgICAgICAgICAgXCJpbnRlcmZhY2VcIjoweDJFLFxuICAgICAgICAgICAgICAgIFwicmVzcG9uc2VcIjoweDMwLFxuICAgICAgICAgICAgICAgIFwib3duQ29sb3JcIjoweDNBLFxuICAgICAgICAgICAgICAgIFwiaU1VTWVhc3VyZW1lbnRJbnRlcnZhbFwiOjB4M0MsXG4gICAgICAgICAgICAgICAgXCJpTVVNZWFzdXJlbWVudEJ5RGVmYXVsdFwiOjB4M0QsXG4gICAgICAgICAgICAgICAgXCJkZXZpY2VOYW1lXCI6MHg0NixcbiAgICAgICAgICAgICAgICBcImRldmljZUluZm9cIjoweDQ3LFxuICAgICAgICAgICAgICAgIFwic3BlZWRcIjoweDU4LFxuICAgICAgICAgICAgICAgIFwicG9zaXRpb25PZmZzZXRcIjoweDVCLFxuICAgICAgICAgICAgICAgIFwibW92ZVRvXCI6MHg2NixcbiAgICAgICAgICAgICAgICBcImhvbGRcIjoweDcyLFxuICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6MHg5QSxcbiAgICAgICAgICAgICAgICBcInRhc2tzZXROYW1lXCI6MHhBNSxcbiAgICAgICAgICAgICAgICBcInRhc2tzZXRJbmZvXCI6MHhBNixcbiAgICAgICAgICAgICAgICBcInRhc2tzZXRVc2FnZVwiOjB4QTcsXG4gICAgICAgICAgICAgICAgXCJtb3Rpb25OYW1lXCI6MHhBRixcbiAgICAgICAgICAgICAgICBcIm1vdGlvbkluZm9cIjoweEIwLFxuICAgICAgICAgICAgICAgIFwibW90aW9uVXNhZ2VcIjoweEIxLFxuICAgICAgICAgICAgICAgIFwiaTJDU2xhdmVBZGRyZXNzXCI6MHhDMCxcbiAgICAgICAgICAgICAgICBcImxlZFwiOjB4RTAsXG4gICAgICAgICAgICAgICAgXCJlbmFibGVDaGVja1N1bVwiOjB4RjMsXG4gICAgICAgICAgICAgICAgXCJkZXZpY2VTZXJpYWxcIjoweEZBXG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zjg63jgrDnlKjjgqjjg6njg7zjgrPjg7zjg4nooahcbiAgICAgICAgICogQHR5cGUge3t9fVxuICAgICAgICAgKiBAaWdub3JlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9NT1RPUl9MT0dfRVJST1JDT0RFPXtcbiAgICAgICAgICAgIDA6e2lkOjAsdHlwZTpcIktNX1NVQ0NFU1NcIixtc2c6XCJTdWNjZXNzZnVsIGNvbW1hbmRcIn0sLy/miJDlip/mmYLjgavov5TljbTjgZnjgotcbiAgICAgICAgICAgIDE6e2lkOjEsdHlwZTpcIktNX0VSUk9SX0lOVEVSTkFMXCIsbXNnOlwiSW50ZXJuYWwgRXJyb3JcIn0sLy/lhoXpg6jjgqjjg6njg7xcbiAgICAgICAgICAgIDI6e2lkOjIsdHlwZTpcIktNX0VSUk9SX05PX01FTVwiLG1zZzpcIk5vIE1lbW9yeSBmb3Igb3BlcmF0aW9uXCJ9LC8v44Oh44Oi44Oq5LiN6LazXG4gICAgICAgICAgICAzOntpZDozLHR5cGU6XCJLTV9FUlJPUl9OT1RfRk9VTkRcIixtc2c6XCJOb3QgZm91bmRcIn0sLy/opovjgaTjgYvjgonjgarjgYRcbiAgICAgICAgICAgIDQ6e2lkOjQsdHlwZTpcIktNX0VSUk9SX05PVF9TVVBQT1JURURcIixtc2c6XCJOb3Qgc3VwcG9ydGVkXCJ9LC8v44K144Od44O844OI5aSWXG4gICAgICAgICAgICA1OntpZDo1LHR5cGU6XCJLTV9FUlJPUl9JTlZBTElEX0NPTU1BTkRcIixtc2c6XCJJbnZhbGlkIENvbW1hbmRcIn0sLy/kuI3mraPjgarjgrPjg57jg7Pjg4lcbiAgICAgICAgICAgIDY6e2lkOjYsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfUEFSQU1cIixtc2c6XCJJbnZhbGlkIFBhcmFtZXRlclwifSwvL+S4jeato+OBquW8leaVsFxuICAgICAgICAgICAgNzp7aWQ6Nyx0eXBlOlwiS01fRVJST1JfU1RPUkFHRV9GVUxMXCIsbXNnOlwiU3RvcmFnZSBpcyBmdWxsXCJ9LC8v6KiY6Yyy6aCY5Z+f44GM5LiA5p2vXG4gICAgICAgICAgICA4OntpZDo4LHR5cGU6XCJLTV9FUlJPUl9JTlZBTElEX0ZMQVNIX1NUQVRFXCIsbXNnOlwiSW52YWxpZCBmbGFzaCBzdGF0ZSwgb3BlcmF0aW9uIGRpc2FsbG93ZWQgaW4gdGhpcyBzdGF0ZVwifSwvL+ODleODqeODg+OCt+ODpeOBrueKtuaFi+OBjOS4jeato1xuICAgICAgICAgICAgOTp7aWQ6OSx0eXBlOlwiS01fRVJST1JfSU5WQUxJRF9MRU5HVEhcIixtc2c6XCJJbnZhbGlkIExlbmd0aFwifSwvL+S4jeato+OBquW8leaVsOOBrumVt+OBle+8iOOCteOCpOOCuu+8iVxuICAgICAgICAgICAgMTA6e2lkOjEwLHR5cGU6XCJLTV9FUlJPUl9JTlZBTElEX0NIRUNLU1VNXCIsbXNnOlwiSW52YWxpZCBDaGVjayBTdW0gKFZhbGlkYXRpb24gaXMgZmFpbGVkKVwifSwvL+S4jeato+OBquODgeOCp+ODg+OCr+OCteODoFxuICAgICAgICAgICAgMTM6e2lkOjEzLHR5cGU6XCJLTV9FUlJPUl9USU1FT1VUXCIsbXNnOlwiT3BlcmF0aW9uIHRpbWVkIG91dFwifSwvL+OCv+OCpOODoOOCouOCpuODiFxuICAgICAgICAgICAgMTU6e2lkOjE1LHR5cGU6XCJLTV9FUlJPUl9GT1JCSURERU5cIixtc2c6XCJGb3JiaWRkZW4gT3BlcmF0aW9uXCJ9LC8v5LiN6Kix5Y+v44Gq5pON5L2cXG4gICAgICAgICAgICAxNjp7aWQ6MTYsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfQUREUlwiLG1zZzpcIkJhZCBNZW1vcnkgQWRkcmVzc1wifSwvL+S4jeato+OBquOCouODieODrOOCueWPgueFp1xuICAgICAgICAgICAgMTc6e2lkOjE3LHR5cGU6XCJLTV9FUlJPUl9CVVNZXCIsbXNnOlwiQnVzeVwifSwvL+ODk+OCuOODvFxuICAgICAgICAgICAgMTg6e2lkOjE4LHR5cGU6XCJLTV9FUlJPUl9SRVNPVVJDRVwiLG1zZzpcIk5vdCBlbm91Z2ggcmVzb3VyY2VzIGZvciBvcGVyYXRpb25cIn0sLy/jg6rjgr3jg7zjgrnkuI3otrNcbiAgICAgICAgICAgIDIwOntpZDoyMCx0eXBlOlwiS01fRVJST1JfTU9UT1JfRElTQUJMRURcIixtc2c6XCJNb3RvciBzdGF0ZSBpcyBkaXNhYmxlZFwifSwvL+ODouODvOOCv+ODvOOBjOWLleS9nOioseWPr+OBleOCjOOBpuOBhOOBquOBhFxuICAgICAgICAgICAgNjA6e2lkOjYwLHR5cGU6XCJLTV9FUlJPUl9ERVZJQ0VfRFJJVkVSXCIsbXNnOlwiS01fRVJST1JfREVWSUNFX0RSSVZFUlwifSwvL+WGheWuueacquWumue+qVxuICAgICAgICAgICAgNjE6e2lkOjYxLHR5cGU6XCJLTV9FUlJPUl9ERVZJQ0VfRkxBU0hcIixtc2c6XCJLTV9FUlJPUl9ERVZJQ0VfRkxBU0hcIn0sLy/lhoXlrrnmnKrlrprnvqlcbiAgICAgICAgICAgIDYyOntpZDo2Mix0eXBlOlwiS01fRVJST1JfREVWSUNFX0xFRFwiLG1zZzpcIktNX0VSUk9SX0RFVklDRV9MRURcIn0sLy/lhoXlrrnmnKrlrprnvqlcbiAgICAgICAgICAgIDYzOntpZDo2Myx0eXBlOlwiS01fRVJST1JfREVWSUNFX0lNVVwiLG1zZzpcIktNX0VSUk9SX0RFVklDRV9JTVVcIn0sLy/lhoXlrrnmnKrlrprnvqlcbiAgICAgICAgICAgIDcwOntpZDo3MCx0eXBlOlwiS01fRVJST1JfTlJGX0RFVklDRVwiLG1zZzpcIkVycm9yIHJlbGF0ZWQgdG8gQkxFIG1vZHVsZSAoblJGNTI4MzIpXCJ9LC8vQkxF44Oi44K444Ol44O844Or44Gu44Ko44Op44O8XG4gICAgICAgICAgICA4MDp7aWQ6ODAsdHlwZTpcIktNX0VSUk9SX1dEVF9FVkVOVFwiLG1zZzpcIldhdGNoIERvZyBUaW1lciBFdmVudFwifSwvL+OCpuOCqeODg+ODgeODieODg+OCsOOCv+OCpOODnuODvOOCpOODmeODs+ODiOOBrueZuuWLle+8iOWGjei1t+WLleebtOWJje+8iVxuICAgICAgICAgICAgODE6e2lkOjgxLHR5cGU6XCJLTV9FUlJPUl9PVkVSX0hFQVRcIixtc2c6XCJPdmVyIEhlYXQgKG92ZXIgdGVtcGVyYXR1cmUpXCJ9LC8v5rip5bqm55Ww5bi477yI44Oe44Kk44Kz44Oz5rip5bqm44GMMuWIhuS7peS4ijYw5bqm44KS6LaF6YGO77yJXG4gICAgICAgICAgICAxMDA6e2lkOjEwMCx0eXBlOlwiS01fU1VDQ0VTU19BUlJJVkFMXCIsbXNnOlwiUG9zaXRpb24gQXJyaXZhbCBOb3RpZmljYXRpb25cIn0vL+S9jee9ruWItuW+oeaZguOBq+aMh+WumuS9jee9ruOBq+WIsOmBlOOBl+OBn+WgtOWQiOOBrumAmuefpVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDjg5fjg63jg5Hjg4bjgqNcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDjg4fjg5DjgqTjgrnmg4XloLFcbiAgICAgKiBAdHlwZSB7S01EZXZpY2VJbmZvfVxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IGRldmljZUluZm8oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RldmljZUluZm8uQ2xvbmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmnInlirnnhKHlirlcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBnZXQgaXNDb25uZWN0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZXZpY2VJbmZvLmlzQ29ubmVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgrPjg57jg7Pjg4npoIbnm6PoppbnlKjpgKPnlarjga7nmbrooYxcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBjcmVhdGVDb21tYW5kSUQoKXtcbiAgICAgICByZXR1cm4gdGhpcy5fY29tbWFuZENvdW50PSgrK3RoaXMuX2NvbW1hbmRDb3VudCkmMGIxMTExMTExMTExMTExMTExOy8vNjU1MzXjgafjg6vjg7zjg5dcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpc0Nvbm5lY3Tjga7oqK3lrprlpInmm7Qo5a2Q44Kv44Op44K544GL44KJ5L2/55SoKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYm9vbFxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBfc3RhdHVzQ2hhbmdlX2lzQ29ubmVjdChib29sKXtcbiAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q9Ym9vbDtcbiAgICAgICAgaWYodGhpcy5faXNJbml0KXtcbiAgICAgICAgICAgIGlmKGJvb2wpe1xuICAgICAgICAgICAgICAgIHRoaXMuX29uQ29ubmVjdEhhbmRsZXIodGhpcyk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yid5pyf5YyW54q25oWL44Gu6Kit5a6aKOWtkOOCr+ODqeOCueOBi+OCieS9v+eUqClcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJvb2xcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgX3N0YXR1c0NoYW5nZV9pbml0KGJvb2wpe1xuICAgICAgICB0aGlzLl9pc0luaXQ9Ym9vbDtcbiAgICAgICAgaWYodGhpcy5faXNJbml0KXtcbiAgICAgICAgICAgIHRoaXMuX29uSW5pdEhhbmRsZXIodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBjYWxsYmFja1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIOWIneacn+WMluWujOS6huOBl+OBpuWIqeeUqOOBp+OBjeOCi+OCiOOBhuOBq+OBquOBo+OBn1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihLTUNvbUJhc2UpfVxuICAgICAqL1xuICAgIHNldCBvbkluaXQoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Jbml0SGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog5b+c562U44O75YaN5o6l57aa44Gr5oiQ5Yqf44GX44GfXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKEtNQ29tQmFzZSl9XG4gICAgICovXG4gICAgc2V0IG9uQ29ubmVjdChoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDlv5znrZTjgYznhKHjgY/jgarjgaPjgZ/jg7vliIfmlq3jgZXjgozjgZ9cbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oS01Db21CYXNlKX1cbiAgICAgKi9cbiAgICBzZXQgb25EaXNjb25uZWN0KGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uRGlzY29ubmVjdEhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOaOpee2muOBq+WkseaVl1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihLTUNvbUJhc2Usc3RyaW5nKX1cbiAgICAgKi9cbiAgICBzZXQgb25Db25uZWN0RmFpbHVyZShoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RGYWlsdXJlSGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga7lm57ou6Lmg4XloLFjYWxsYmFja1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihwb3NpdGlvbjpudW1iZXIsdmVsb2NpdHk6bnVtYmVyLHRvcnF1ZTpudW1iZXIpfVxuICAgICAqL1xuICAgIHNldCBvbk1vdG9yTWVhc3VyZW1lbnQoZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JNZWFzdXJlbWVudENCPWZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Gu44K444Oj44Kk44Ot5oOF5aCxY2FsbGJhY2tcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oe2FjY2VsWDpudW1iZXIsYWNjZWxZOm51bWJlcixhY2NlbFo6bnVtYmVyLHRlbXA6bnVtYmVyLGd5cm9YOm51bWJlcixneXJvWTpudW1iZXIsZ3lyb1o6bnVtYmVyfSl9XG4gICAgICovXG4gICAgc2V0IG9uSW11TWVhc3VyZW1lbnQoZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uSW11TWVhc3VyZW1lbnRDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O86Kit5a6a5oOF5aCx5Y+W5b6XY2FsbGJhY2tcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24ocmVnaXN0ZXJDbWQ6bnVtYmVyLHJlczpudW1iZXIpfVxuICAgICAqL1xuICAgIHNldCBvbk1vdG9yU2V0dGluZyhmdW5jKXtcbiAgICAgICAgaWYodHlwZW9mIGZ1bmM9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Nb3RvclNldHRpbmdDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOODreOCsOaDheWgseWPluW+l2NhbGxiYWNrXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKGNtZElEOm51bWJlcixyZXM6ZXJyb3Jsb2dPYmplY3QpfVxuICAgICAqL1xuICAgIHNldCBvbk1vdG9yTG9nKGZ1bmMpe1xuICAgICAgICBpZih0eXBlb2YgZnVuYz09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yTG9nQ0I9ZnVuYztcbiAgICAgICAgfVxuICAgIH1cblxuLy8vLy8vY2xhc3MvL1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9S01Db21CYXNlO1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNQ29tQmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKipcbiAqIEtNTW90b3JDb21tYW5kS01PbmUuanNcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoXCJldmVudHNcIikuRXZlbnRFbWl0dGVyO1xuY29uc3QgS01VdGwgPSByZXF1aXJlKCcuL0tNVXRsJyk7XG5jb25zdCBLTUNvbVdlYkJMRSA9IHJlcXVpcmUoJy4vS01Db21XZWJCTEUnKTtcbmNvbnN0IEtNU3RydWN0dXJlcz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcycpO1xuXG5cbi8qKlxuICogQGNsYXNzZGVzYyBLTTHjgrPjg57jg7Pjg4npgIHkv6Hjgq/jg6njgrlcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01Nb3RvckNvbW1hbmRLTU9uZSBleHRlbmRzIEV2ZW50RW1pdHRlcntcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlrprmlbBcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICog5o6l57aa5pa55byP5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gV0VCQkxFIC0gMTpXRUJCTEVcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gQkxFIC0gMjpCTEVcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gU0VSSUFMIC0gMzpTRVJJQUxcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IEtNX0NPTk5FQ1RfVFlQRSgpe1xuICAgICAgICByZXR1cm4ge1wiV0VCQkxFXCI6MSxcIkJMRVwiOjIsXCJTRVJJQUxcIjozfTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIGNtZFByZXBhcmVQbGF5YmFja01vdGlvbuOBrumWi+Wni+S9jee9ruOCquODl+OCt+ODp+ODs+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFNUQVJUX1BPU0lUSU9OX0FCUyAtIDA66KiY5oa244GV44KM44Gf6ZaL5aeL5L2N572u77yI57W25a++5bqn5qiZ77yJ44GL44KJ44K544K/44O844OIXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFNUQVJUX1BPU0lUSU9OX0NVUlJFTlQgLSAxOuePvuWcqOOBruS9jee9ruOCkumWi+Wni+S9jee9ruOBqOOBl+OBpuOCueOCv+ODvOODiFxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdTVEFSVF9QT1NJVElPTl9BQlMnOjAsXG4gICAgICAgICAgICAnU1RBUlRfUE9TSVRJT05fQ1VSUkVOVCc6MVxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjbWRMZWTjga5MRUTjga7ngrnnga/nirbmhYvjgqrjg5fjgrfjg6fjg7PlrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBMRURfU1RBVEVfT0ZGIC0gMDrmtojnga9cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTEVEX1NUQVRFX09OX1NPTElEIC0gMTpMRUTngrnnga/vvIjngrnnga/jgZfjgaPjgbHjgarjgZfvvIlcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTEVEX1NUQVRFX09OX0ZMQVNIIC0gMjpMRUTngrnmu4XvvIjkuIDlrprplpPpmpTjgafngrnmu4XvvIlcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTEVEX1NUQVRFX09OX0RJTSAtIDozTEVE44GM44KG44Gj44GP44KK5piO5ruF44GZ44KLXG4gICAgICovXG4gICAgc3RhdGljIGdldCBjbWRMZWRfTEVEX1NUQVRFKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdMRURfU1RBVEVfT0ZGJzowLFxuICAgICAgICAgICAgJ0xFRF9TVEFURV9PTl9TT0xJRCc6MSxcbiAgICAgICAgICAgICdMRURfU1RBVEVfT05fRkxBU0gnOjIsXG4gICAgICAgICAgICAnTEVEX1NUQVRFX09OX0RJTSc6M1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjbWRDdXJ2ZVR5cGXjga7liqDmuJvpgJ/jgqvjg7zjg5bjgqrjg5fjgrfjg6fjg7PlrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBDVVJWRV9UWVBFX05PTkUgLSAwOuODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPRkZcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gQ1VSVkVfVFlQRV9UUkFQRVpPSUQgLSAxOuODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPTiDvvIjlj7DlvaLliqDmuJvpgJ/vvIlcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdDVVJWRV9UWVBFX05PTkUnOiAwLFxuICAgICAgICAgICAgJ0NVUlZFX1RZUEVfVFJBUEVaT0lEJzoxXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY21kTW90b3JNZWFzdXJlbWVudEludGVydmFs44Gu44Oi44O844K/44O85ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqU5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF81TVMgLSAwOjVNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzEwTVMgLSAxOjEwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8yME1TIC0gMjoyME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfNTBNUyAtIDM6NTBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzEwME1TIC0gNDoxMDBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzIwME1TIC0gNToyMDBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzUwME1TIC0gNjo1MDBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzEwMDBNUyAtIDc6MTAwME1TXG4gICAgICovXG4gICAgc3RhdGljIGdldCBjbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxfTU9UT1JfTUVBU19JTlRFUlZBTCgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF81TVMnOiAwLFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfMTBNUyc6MSxcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzIwTVMnOjIsXG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF81ME1TJzozLFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfMTAwTVMnOjQsXG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF8yMDBNUyc6NSxcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzUwME1TJzo2LFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfMTAwME1TJzo3XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWzjga7liqDpgJ/luqbjg7vjgrjjg6PjgqTjg63muKzlrprlgKTjga7lj5blvpfplpPpmpTlrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzVNUyAtIDA6NU1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTBNUyAtIDE6MTBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzIwTVMgLSAyOjIwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF81ME1TIC0gMzo1ME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTAwTVMgLSA0OjEwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMjAwTVMgLSA1OjIwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfNTAwTVMgLSA2OjUwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTAwME1TIC0gNzoxMDAwTVNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUwoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ0lNVV9NRUFTX0lOVEVSVkFMXzVNUyc6IDAsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfMTBNUyc6MSxcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF8yME1TJzoyLFxuICAgICAgICAgICAgJ0lNVV9NRUFTX0lOVEVSVkFMXzUwTVMnOjMsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfMTAwTVMnOjQsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfMjAwTVMnOjUsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfNTAwTVMnOjYsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfMTAwME1TJzo3XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qXG4gICAgKiBSZWFkUmVnaXN0ZXLjgaflj5blvpfjgZnjgovmmYLnlKjjga7jgrPjg57jg7Pjg4nlvJXmlbDlrprmlbBcbiAgICAqIEByZWFkb25seVxuICAgICogQGVudW0ge251bWJlcn1cbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtYXhTcGVlZCAtIDI65pyA5aSn6YCf44GVXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gbWluU3BlZWQgLSAzOuacgOWwj+mAn+OBlVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGN1cnZlVHlwZSAtIDU65Yqg5rib6YCf5puy57eaXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gYWNjIC0gNzrliqDpgJ/luqZcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkZWMgLSA4Oua4m+mAn+W6plxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IG1heFRvcnF1ZSAtIDE0OuacgOWkp+ODiOODq+OCr1xuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHFDdXJyZW50UCAtIDI0OnHou7jpm7vmtYFQSUTjgrLjgqTjg7MoUClcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBxQ3VycmVudEkgLSAyNTpx6Lu46Zu75rWBUElE44Ky44Kk44OzKEkpXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcUN1cnJlbnREIC0gMjY6cei7uOmbu+a1gVBJROOCsuOCpOODsyhEKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHNwZWVkUCAtIDI3OumAn+W6plBJROOCsuOCpOODsyhQKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHNwZWVkSSAtIDI4OumAn+W6plBJROOCsuOCpOODsyhJKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHNwZWVkRCAtIDI5OumAn+W6plBJROOCsuOCpOODsyhEKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHBvc2l0aW9uUCAtIDMwOuS9jee9rlBJROOCsuOCpOODsyhQKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHBvc2l0aW9uSSAtIDMxOuS9jee9rlBJROOCsuOCpOODsyhJKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHBvc2l0aW9uRCAtIDMyOuS9jee9rlBJROOCsuOCpOODsyhEKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHBvc0NvbnRyb2xUaHJlc2hvbGQgLSAzMzrjg6Ljg7zjgr/jg7zjga7kvY3nva7liLblvqHmmYLjgIFJROWItuW+oeOCkuacieWKueOBq+OBmeOCi+WBj+W3ruOBrue1tuWvvuWApFxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGludGVyZmFjZSAtIDQ2OuODouODvOOCv+ODvOmAmuS/oee1jOi3r1xuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHJlc3BvbnNlIC0gNDg644Kz44Oe44Oz44OJ44KS5Y+X5L+h44GX44Gf44Go44GN44Gr6YCa55+l44GZ44KL44GLXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gb3duQ29sb3IgLSA1ODrjg4fjg5DjgqTjgrlMRUTjga7lm7rmnInoibJcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkZXZpY2VOYW1lIC0gNzA6XG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gZGV2aWNlSW5mbyAtIDcxOlxuICAgICovXG4gICAgc3RhdGljIGdldCBjbWRSZWFkUmVnaXN0ZXJfQ09NTUFORCgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICBcIm1heFNwZWVkXCI6MHgwMixcbiAgICAgICAgICAgIFwibWluU3BlZWRcIjoweDAzLFxuICAgICAgICAgICAgXCJjdXJ2ZVR5cGVcIjoweDA1LFxuICAgICAgICAgICAgXCJhY2NcIjoweDA3LFxuICAgICAgICAgICAgXCJkZWNcIjoweDA4LFxuICAgICAgICAgICAgXCJtYXhUb3JxdWVcIjoweDBFLFxuICAgICAgICAgICAgXCJxQ3VycmVudFBcIjoweDE4LFxuICAgICAgICAgICAgXCJxQ3VycmVudElcIjoweDE5LFxuICAgICAgICAgICAgXCJxQ3VycmVudERcIjoweDFBLFxuICAgICAgICAgICAgXCJzcGVlZFBcIjoweDFCLFxuICAgICAgICAgICAgXCJzcGVlZElcIjoweDFDLFxuICAgICAgICAgICAgXCJzcGVlZERcIjoweDFELFxuICAgICAgICAgICAgXCJwb3NpdGlvblBcIjoweDFFLFxuICAgICAgICAgICAgXCJwb3NpdGlvbklcIjoweDFGLFxuICAgICAgICAgICAgXCJwb3NpdGlvbkRcIjoweDIwLFxuICAgICAgICAgICAgXCJwb3NDb250cm9sVGhyZXNob2xkXCI6MHgyMSxcbiAgICAgICAgICAgIFwiaW50ZXJmYWNlXCI6MHgyRSxcbiAgICAgICAgICAgIFwicmVzcG9uc2VcIjoweDMwLFxuICAgICAgICAgICAgXCJvd25Db2xvclwiOjB4M0EsXG4gICAgICAgICAgICBcImRldmljZU5hbWVcIjoweDQ2LFxuICAgICAgICAgICAgXCJkZXZpY2VJbmZvXCI6MHg0N1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKlxuICAgICAgICog44Oi44O844K/44O85Yi25b6h5omL5q6177yI44Kk44Oz44K/44O844OV44Kn44Kk44K577yJ44Gu57WM6Lev5oyH5a6a55So5a6a5pWwXG4gICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gQkxFIC0gMHgxOkJMRVxuICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFVTQiAtIDB4MTAwMDpVU0JcbiAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBJMkMgLSAweDEwMDAwOkkyQ1xuICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IEhEREJUTiAtIDB4MTAwMDAwMDA654mp55CG44Oc44K/44OzXG4gICAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZEludGVyZmFjZV9JTlRFUkZBQ0VfVFlQRSgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICBcIkJMRVwiOjBiMSxcbiAgICAgICAgICAgIFwiVVNCXCI6MGIxMDAwLFxuICAgICAgICAgICAgXCJJMkNcIjowYjEwMDAwLFxuICAgICAgICAgICAgXCJIRERCVE5cIjowYjEwMDAwMDAwXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9y44CAXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLktNX0NPTk5FQ1RfVFlQRX0gY29ubmVjdF90eXBlIOaOpee2muaWueW8j1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBrbWNvbSDpgJrkv6Hjgqrjg5bjgrjjgqfjgq/jg4gge0BsaW5rIEtNQ29tQkxFfSB7QGxpbmsgS01Db21XZWJCTEV9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihjb25uZWN0X3R5cGUsa21jb20pe1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjgqTjg5njg7Pjg4jjgr/jgqTjg5flrprmlbBcbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqIEBlbnVtIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLkVWRU5UX1RZUEU9e1xuICAgICAgICAgICAgLyoqIOWIneacn+WMluWujOS6huaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0tNRGV2aWNlSW5mb30pICovIGluaXQ6XCJpbml0XCIsXG4gICAgICAgICAgICAvKiog5o6l57aa5pmCPGJyPnJldHVybjpmdW5jdGlvbih7S01EZXZpY2VJbmZvfSkgKi8gY29ubmVjdDpcImNvbm5lY3RcIixcbiAgICAgICAgICAgIC8qKiDliIfmlq3mmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtLTURldmljZUluZm99KSAqLyBkaXNjb25uZWN0OlwiZGlzY29ubmVjdFwiLFxuICAgICAgICAgICAgLyoqIOaOpee2muOBq+WkseaVl+aZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0tNRGV2aWNlSW5mb30se21zZ30pICovIGNvbm5lY3RGYWlsdXJlOlwiY29ubmVjdEZhaWx1cmVcIixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zlm57ou6Lmg4XloLHlj5fkv6HmmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtAbGluayBLTVJvdFN0YXRlfSkgKi8gbW90b3JNZWFzdXJlbWVudDpcIm1vdG9yTWVhc3VyZW1lbnRcIixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7xJTVXmg4XloLHlj5fkv6HmmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtAbGluayBLTUltdVN0YXRlfSkgKi8gaW11TWVhc3VyZW1lbnQ6XCJpbXVNZWFzdXJlbWVudFwiLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOODreOCsOaDheWgseWPl+S/oeaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe2NtZE5hbWV9LHtlcnJvcmxvZ09iamVjdH0pICovIG1vdG9yTG9nOlwibW90b3JMb2dcIixcbiAgICAgICAgfTtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh0aGlzLkVWRU5UX1RZUEUpOy8vaW5mbzo65b6M44GL44KJ44OV44Oq44O844K644GX44Gq44GE44GoanNkb2PjgYznlJ/miJDjgZXjgozjgarjgYTjgIJcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvOOBruWFqOOCs+ODnuODs+ODiVxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICogQGVudW0ge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQGlnbm9yZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fTU9UT1JfQ09NTUFORD17XG4gICAgICAgICAgICAvKiog5pyA5aSn6YCf44GV44KS6Kit5a6a44GZ44KLICovIG1heFNwZWVkOjB4MDIsXG4gICAgICAgICAgICAvKiog5pyA5bCP6YCf44GV44KS6Kit5a6a44GZ44KLICovIG1pblNwZWVkOjB4MDMsXG4gICAgICAgICAgICAvKiog5Yqg5rib6YCf5puy57ea44KS6Kit5a6a44GZ44KLICovIGN1cnZlVHlwZToweDA1LFxuICAgICAgICAgICAgLyoqIOWKoOmAn+W6puOCkuioreWumuOBmeOCiyAqLyBhY2M6MHgwNyxcbiAgICAgICAgICAgIC8qKiDmuJvpgJ/luqbjgpLoqK3lrprjgZnjgosgKi8gZGVjOjB4MDgsXG4gICAgICAgICAgICAvKiog5pyA5aSn44OI44Or44Kv44KS6Kit5a6a44GZ44KLICovIG1heFRvcnF1ZToweDBFLFxuICAgICAgICAgICAgLyoqIOODhuOCo+ODvOODgeODs+OCsOmWk+malCAqLyB0ZWFjaGluZ0ludGVydmFsOjB4MTYsXG4gICAgICAgICAgICAvKiog44OX44Os44Kk44OQ44OD44Kv6ZaT6ZqUICovIHBsYXliYWNrSW50ZXJ2YWw6MHgxNyxcbiAgICAgICAgICAgIC8qKiBx6Lu46Zu75rWBUElE44Ky44Kk44OzKFAp44KS6Kit5a6a44GZ44KLICovIHFDdXJyZW50UDoweDE4LFxuICAgICAgICAgICAgLyoqIHHou7jpm7vmtYFQSUTjgrLjgqTjg7MoSSnjgpLoqK3lrprjgZnjgosgKi8gcUN1cnJlbnRJOjB4MTksXG4gICAgICAgICAgICAvKiogcei7uOmbu+a1gVBJROOCsuOCpOODsyhEKeOCkuioreWumuOBmeOCiyAqLyBxQ3VycmVudEQ6MHgxQSxcbiAgICAgICAgICAgIC8qKiDpgJ/luqZQSUTjgrLjgqTjg7MoUCnjgpLoqK3lrprjgZnjgosgKi8gc3BlZWRQOjB4MUIsXG4gICAgICAgICAgICAvKiog6YCf5bqmUElE44Ky44Kk44OzKEkp44KS6Kit5a6a44GZ44KLICovIHNwZWVkSToweDFDLFxuICAgICAgICAgICAgLyoqIOmAn+W6plBJROOCsuOCpOODsyhEKeOCkuioreWumuOBmeOCiyAqLyBzcGVlZEQ6MHgxRCxcbiAgICAgICAgICAgIC8qKiDkvY3nva5QSUTjgrLjgqTjg7MoUCnjgpLoqK3lrprjgZnjgosgKi8gcG9zaXRpb25QOjB4MUUsXG4gICAgICAgICAgICAvKiog5L2N572uUElE44Ky44Kk44OzKEkp44KS6Kit5a6a44GZ44KLICovIHBvc2l0aW9uSToweDFGLFxuICAgICAgICAgICAgLyoqIOS9jee9rlBJROOCsuOCpOODsyhEKeOCkuioreWumuOBmeOCiyAqLyBwb3NpdGlvbkQ6MHgyMCxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zjga7kvY3nva7liLblvqHmmYLjgIFJROWItuW+oeOCkuacieWKueOBq+OBmeOCi+WBj+W3ruOBrue1tuWvvuWApOOCkuaMh+WumuOBmeOCiyAqLyBwb3NDb250cm9sVGhyZXNob2xkOjB4MjEsXG5cbiAgICAgICAgICAgIC8qKiBQSUTjgrLjgqTjg7PjgpLjg6rjgrvjg4Pjg4jjgZnjgosgKi8gcmVzZXRQSUQ6MHgyMixcbiAgICAgICAgICAgIC8qKiDkvY3nva7liLblvqHmmYLjgIHnm67mqJnkvY3nva7jgavliLDpgZTmmYLjgIHliKTlrprmnaHku7bjgpLmuoDjgZ/jgZfjgZ/loLTlkIjpgJrnn6XjgpLooYzjgYYqLyBub3RpZnlQb3NBcnJpdmFsOjB4MkIsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O85ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqUKFVTQixJMkPjga7jgb8pICovIG1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbDoweDJDLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOa4rOWumuWApOOBruWPluW+l+ioreWumiAqLyBtb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0OjB4MkQsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O85Yi25b6h5omL5q6177yI44Kk44Oz44K/44O844OV44Kn44Kk44K577yJ44Gu6Kit5a6aICovIGludGVyZmFjZToweDJFLFxuICAgICAgICAgICAgLyoqIOOCs+ODnuODs+ODieOCkuWPl+S/oeOBl+OBn+OBqOOBjeOBq+aIkOWKn+mAmuefpe+8iGVycm9yQ29kZSA9IDDvvInjgpLjgZnjgovjgYvjganjgYbjgYsgKi8gcmVzcG9uc2U6MHgzMCxcblxuICAgICAgICAgICAgLyoqIOODh+ODkOOCpOOCuUxFROOBruWbuuacieiJsuOCkuioreWumuOBmeOCiyAqLyBvd25Db2xvcjoweDNBLFxuICAgICAgICAgICAgLyoqIElNVea4rOWumuWApOmAmuefpemWk+malO+8iOaciee3muOBruOBv++8iSAqLyBpTVVNZWFzdXJlbWVudEludGVydmFsOjB4M0MsXG4gICAgICAgICAgICAvKiog44OH44OV44Kp44Or44OI44Gn44GuSU1V5ris5a6a5YCk6YCa55+lT04vT0ZGICovIGlNVU1lYXN1cmVtZW50QnlEZWZhdWx0OjB4M0QsXG5cbiAgICAgICAgICAgIC8qKiDmjIflrprjga7oqK3lrprlgKTjgpLlj5blvpfjgZnjgosgKi8gcmVhZFJlZ2lzdGVyOjB4NDAsXG4gICAgICAgICAgICAvKiog5YWo44Gm44Gu6Kit5a6a5YCk44KS44OV44Op44OD44K344Ol44Gr5L+d5a2Y44GZ44KLICovIHNhdmVBbGxSZWdpc3RlcnM6MHg0MSxcblxuICAgICAgICAgICAgLyoqIOODh+ODkOOCpOOCueODjeODvOODoOOBruWPluW+lyAqLyByZWFkRGV2aWNlTmFtZToweDQ2LFxuICAgICAgICAgICAgLyoqIOODh+ODkOOCpOOCueaDheWgseOBruWPluW+lyAqLyByZWFkRGV2aWNlSW5mbzoweDQ3LFxuICAgICAgICAgICAgLyoqIOaMh+WumuOBruioreWumuWApOOCkuODquOCu+ODg+ODiOOBmeOCiyAqLyByZXNldFJlZ2lzdGVyOjB4NEUsXG4gICAgICAgICAgICAvKiog5YWo6Kit5a6a5YCk44KS44Oq44K744OD44OI44GZ44KLICovIHJlc2V0QWxsUmVnaXN0ZXJzOjB4NEYsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844Gu5YuV5L2c44KS5LiN6Kix5Y+v44Go44GZ44KLICovIGRpc2FibGU6MHg1MCxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zli5XkvZzjgpLoqLHlj6/jgZnjgosgKi8gZW5hYmxlOjB4NTEsXG4gICAgICAgICAgICAvKiog6YCf5bqm44Gu5aSn44GN44GV44KS6Kit5a6a44GZ44KLICovIHNwZWVkOjB4NTgsXG4gICAgICAgICAgICAvKiog5L2N572u44Gu44OX44Oq44K744OD44OI44KS6KGM44GG77yI5Y6f54K56Kit5a6a77yJICovIHByZXNldFBvc2l0aW9uOjB4NUEsXG4gICAgICAgICAgICAvKiog5L2N572u44Gu44OX44Oq44K744OD44OI44Gr6Zai44GZ44KLT0ZGU0VU6YePICovIHJlYWRQb3NpdGlvbk9mZnNldDoweDVCLFxuXG4gICAgICAgICAgICAvKiog5q2j5Zue6Lui44GZ44KL77yI5Y+N5pmC6KiI5Zue44KK77yJICovIHJ1bkZvcndhcmQ6MHg2MCxcbiAgICAgICAgICAgIC8qKiDpgIblm57ou6LjgZnjgovvvIjmmYLoqIjlm57jgorvvIkgKi8gcnVuUmV2ZXJzZToweDYxLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOCkuaMh+WumumAn+W6puOBp+Wbnui7ouOBleOBm+OCiyAqLyBydW46MHg2MixcbiAgICAgICAgICAgIC8qKiDntbblr77kvY3nva7jgavnp7vli5XjgZnjgoso6YCf5bqm44GC44KKKSAqLyBtb3ZlVG9Qb3NpdGlvblNwZWVkOjB4NjUsXG4gICAgICAgICAgICAvKiog57W25a++5L2N572u44Gr56e75YuV44GZ44KLICovIG1vdmVUb1Bvc2l0aW9uOjB4NjYsXG4gICAgICAgICAgICAvKiog55u45a++5L2N572u44Gr56e75YuV44GZ44KLKOmAn+W6puOBguOCiikgKi8gbW92ZUJ5RGlzdGFuY2VTcGVlZDoweDY3LFxuICAgICAgICAgICAgLyoqIOebuOWvvuS9jee9ruOBq+enu+WLleOBmeOCiyAqLyBtb3ZlQnlEaXN0YW5jZToweDY4LFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOBruWKseejgeOCkuWBnOatouOBmeOCiyAqLyBmcmVlOjB4NkMsXG4gICAgICAgICAgICAvKiog6YCf5bqm44K844Ot44G+44Gn5rib6YCf44GX5YGc5q2i44GZ44KLICovIHN0b3A6MHg2RCxcbiAgICAgICAgICAgIC8qKiDjg4jjg6vjgq/liLblvqHjgpLooYzjgYYgKi8gaG9sZFRvcnF1ZToweDcyLFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOCkuWun+ihjOOBmeOCiyAqLyBzdGFydERvaW5nVGFza3NldDoweDgxLFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOCkuWBnOatoiAqLyBzdG9wRG9pbmdUYXNrc2V0OjB4ODIsXG4gICAgICAgICAgICAvKiog44Oi44O844K344On44Oz44KS5YaN55Sf77yI5rqW5YKZ44Gq44GX77yJICovIHN0YXJ0UGxheWJhY2tNb3Rpb246MHg4NSxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/jgpLlgZzmraLjgZnjgosgKi8gc3RvcFBsYXliYWNrTW90aW9uOjB4ODgsXG4gICAgICAgICAgICAvKiog44Kt44Ol44O844KS5YGc5q2i44GZ44KLICovIHBhdXNlUXVldWU6MHg5MCxcbiAgICAgICAgICAgIC8qKiDjgq3jg6Xjg7zjgpLlho3plovjgZnjgosgKi8gcmVzdW1lUXVldWU6MHg5MSxcbiAgICAgICAgICAgIC8qKiDjgq3jg6Xjg7zjgpLmjIflrprmmYLplpPlgZzmraLjgZflho3plovjgZnjgosgKi8gd2FpdFF1ZXVlOjB4OTIsXG4gICAgICAgICAgICAvKiog44Kt44Ol44O844KS44Oq44K744OD44OI44GZ44KLICovIHJlc2V0UXVldWU6MHg5NSxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zjga7nirbmhYsgKi8gcmVhZFN0YXR1czoweDlBLFxuXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44KS6ZaL5aeL44GZ44KLICovIHN0YXJ0UmVjb3JkaW5nVGFza3NldDoweEEwLFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuOCkuWBnOatouOBmeOCiyAqLyBzdG9wUmVjb3JkaW5nVGFza3NldDoweEEyLFxuICAgICAgICAgICAgLyoqIOaMh+WumuOBruOCv+OCueOCr+OCu+ODg+ODiOOCkuWJiumZpOOBmeOCiyAqLyBlcmFzZVRhc2tzZXQ6MHhBMyxcbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jjgpLlhajliYrpmaTjgZnjgosgKi8gZXJhc2VBbGxUYXNrc2V0OjB4QTQsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy5ZCN6Kit5a6aICovIHNldFRhc2tzZXROYW1lOjB4QTUsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI5YaF5a655oqK5o+hICovIHJlYWRUYXNrc2V0SW5mbzoweEE2LFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOS9v+eUqOeKtuazgeaKiuaPoSAqLyByZWFkVGFza3NldFVzYWdlOjB4QTcsXG4gICAgICAgICAgICAvKiog44OA44Kk44Os44Kv44OI44OG44Kj44O844OB44Oz44Kw6ZaL5aeL77yI5rqW5YKZ44Gq44GX77yJICovIHN0YXJ0VGVhY2hpbmdNb3Rpb246MHhBOSxcbiAgICAgICAgICAgIC8qKiDjg4bjgqPjg7zjg4Hjg7PjgrDjgpLlgZzmraLjgZnjgosgKi8gc3RvcFRlYWNoaW5nTW90aW9uOjB4QUMsXG4gICAgICAgICAgICAvKiog44OG44Kj44O844OB44Oz44Kw44Gn6Kaa44GI44Gf5YuV5L2c44KS5YmK6Zmk44GZ44KLICovIGVyYXNlTW90aW9uOjB4QUQsXG4gICAgICAgICAgICAvKiog44OG44Kj44O844OB44Oz44Kw44Gn6Kaa44GI44Gf5YWo5YuV5L2c44KS5YmK6Zmk44GZ44KLICovIGVyYXNlQWxsTW90aW9uOjB4QUUsXG4gICAgICAgICAgICAvKiogSTJD44K544Os44O844OW44Ki44OJ44Os44K5ICovIHNldEkyQ1NsYXZlQWRkcmVzczoweEMwLFxuICAgICAgICAgICAgLyoqIExFROOBrueCueeBr+eKtuaFi+OCkuOCu+ODg+ODiOOBmeOCiyAqLyBsZWQ6MHhFMCxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zjga7muKzlrprlgKTlj5blvpfvvIjpgJrnn6XvvInjgpLplovlp4sgKi8gZW5hYmxlTW90b3JNZWFzdXJlbWVudDoweEU2LFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOBrua4rOWumuWApOWPluW+l++8iOmAmuefpe+8ieOCkumWi+WniyAqLyBkaXNhYmxlTW90b3JNZWFzdXJlbWVudDoweEU3LFxuICAgICAgICAgICAgLyoqIElNVeOBruWApOWPluW+lyjpgJrnn6Up44KS6ZaL5aeL44GZ44KLICovIGVuYWJsZUlNVU1lYXN1cmVtZW50OjB4RUEsXG4gICAgICAgICAgICAvKiogSU1V44Gu5YCk5Y+W5b6XKOmAmuefpSnjgpLlgZzmraLjgZnjgosgKi8gZGlzYWJsZUlNVU1lYXN1cmVtZW50OjB4RUIsXG5cbiAgICAgICAgICAgIC8qKiDjgrfjgrnjg4bjg6DjgpLlho3otbfli5XjgZnjgosgKi8gcmVib290OjB4RjAsXG4gICAgICAgICAgICAvKiog44OB44Kn44OD44Kv44K144Og77yIQ1JDMTYpIOacieWKueWMliAqLyBlbmFibGVDaGVja1N1bToweEYzLFxuICAgICAgICAgICAgLyoqIOODleOCoeODvOODoOOCpuOCp+OCouOCouODg+ODl+ODh+ODvOODiOODouODvOODieOBq+WFpeOCiyAqLyBlbnRlckRldmljZUZpcm13YXJlVXBkYXRlOjB4RkRcbiAgICAgICAgfTtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh0aGlzLl9NT1RPUl9DT01NQU5EKTsvL2luZm86OuW+jOOBi+OCieODleODquODvOOCuuOBl+OBquOBhOOBqGpzZG9j44GM55Sf5oiQ44GV44KM44Gq44GE44CCXG5cbiAgICAgICAgLy/jg6Ljg7zjgr/jg7zjga7lhajjgrPjg57jg7Pjg4nvvIjpgIblvJXnlKjvvIlcbiAgICAgICAgdGhpcy5fUkVWX01PVE9SX0NPTU1BTkQ9e307XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX01PVE9SX0NPTU1BTkQpLmZvckVhY2goKGspPT57dGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbdGhpcy5fTU9UT1JfQ09NTUFORFtrXV09azt9KTtcbiAgICAgICAgLy9TZW5kTm90aWZ5UHJvbWlz44Gu44Oq44K544OIXG4gICAgICAgIHRoaXMuX25vdGlmeVByb21pc0xpc3Q9W107XG4gICAgICAgIHRoaXMuY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OPXRoaXMuY29uc3RydWN0b3IuY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OO1xuICAgICAgICB0aGlzLmNtZExlZF9MRURfU1RBVEU9dGhpcy5jb25zdHJ1Y3Rvci5jbWRMZWRfTEVEX1NUQVRFO1xuICAgICAgICB0aGlzLmNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFPXRoaXMuY29uc3RydWN0b3IuY21kQ3VydmVUeXBlX0NVUlZFX1RZUEU7XG4gICAgICAgIHRoaXMuY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUw9dGhpcy5jb25zdHJ1Y3Rvci5jbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxfTU9UT1JfTUVBU19JTlRFUlZBTDtcbiAgICAgICAgdGhpcy5jbWRJTVVNZWFzdXJlbWVudEludGVydmFsX0lNVV9NRUFTX0lOVEVSVkFMPXRoaXMuY29uc3RydWN0b3IuY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbF9JTVVfTUVBU19JTlRFUlZBTDtcbiAgICAgICAgdGhpcy5jbWRJbnRlcmZhY2VfSU5URVJGQUNFX1RZUEU9dGhpcy5jb25zdHJ1Y3Rvci5jbWRJbnRlcmZhY2VfSU5URVJGQUNFX1RZUEU7XG4gICAgICAgIHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbj1udWxsOy8vS01fU1VDQ0VTU19BUlJJVkFM55uj6KaW55SoXG4gICAgICAgIHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvblRpbWVPdXRJZD0wO1xuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIHNlY3Rpb246OmVudHJ5IHBvaW50XG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgdGhpcy5fY29ubmVjdFR5cGU9Y29ubmVjdF90eXBlO1xuICAgICAgICB0aGlzLl9LTUNvbT1rbWNvbTtcblxuICAgICAgICAvL+WGhemDqOOCpOODmeODs+ODiOODkOOCpOODs+ODiVxuICAgICAgICB0aGlzLl9LTUNvbS5vbkluaXQ9KGNvbm5lY3Rvcik9PntcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUuaW5pdCxjb25uZWN0b3IuZGV2aWNlSW5mbyk7Ly/jg4fjg5DjgqTjgrnmg4XloLHjgpLov5TjgZlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fS01Db20ub25Db25uZWN0PShjb25uZWN0b3IpPT57XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLmNvbm5lY3QsY29ubmVjdG9yLmRldmljZUluZm8pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9LTUNvbS5vbkRpc2Nvbm5lY3Q9KGNvbm5lY3Rvcik9PntcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUuZGlzY29ubmVjdCxjb25uZWN0b3IuZGV2aWNlSW5mbyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX0tNQ29tLm9uQ29ubmVjdEZhaWx1cmU9KGNvbm5lY3RvciwgZXJyKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5jb25uZWN0RmFpbHVyZSxjb25uZWN0b3IuZGV2aWNlSW5mbyxlcnIpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICog44Oi44O844K/44O85Zue6Lui5oOF5aCx5Y+X5L+hXG4gICAgICAgICAqIEBwYXJhbSB7S01Sb3RTdGF0ZX0gcm90U3RhdGVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uTW90b3JNZWFzdXJlbWVudD0ocm90U3RhdGUpPT57XG4gICAgICAgICAgICAvL2xldCByb3RTdGF0ZT1uZXcgS01TdHJ1Y3R1cmVzLktNUm90U3RhdGUocmVzLnBvc2l0aW9uLHJlcy52ZWxvY2l0eSxyZXMudG9ycXVlKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUubW90b3JNZWFzdXJlbWVudCxyb3RTdGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7xJTVXmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIHtLTUltdVN0YXRlfSBpbXVTdGF0ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fS01Db20ub25JbXVNZWFzdXJlbWVudD0oaW11U3RhdGUpPT57XG4gICAgICAgICAgICAvL2xldCBpbXVTdGF0ZT1uZXcgS01TdHJ1Y3R1cmVzLktNSW11U3RhdGUocmVzLmFjY2VsWCxyZXMuYWNjZWxZLHJlcy5hY2NlbFoscmVzLnRlbXAscmVzLmd5cm9YLHJlcy5neXJvWSxyZXMuZ3lyb1opO1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5pbXVNZWFzdXJlbWVudCxpbXVTdGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zjg63jgrDmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGNtZElEXG4gICAgICAgICAqIEBwYXJhbSB7S01Nb3RvckxvZ30gbW90b3JMb2dcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uTW90b3JMb2c9KG1vdG9yTG9nKT0+e1xuICAgICAgICAgICAgLy/jgrPjg57jg7Pjg4lJROOBi+OCieOCs+ODnuODs+ODieWQjeOCkuWPluW+l+i/veWKoFxuICAgICAgICAgICAgbGV0IGNtZE5hbWU9dGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbbW90b3JMb2cuY21kSURdP3RoaXMuX1JFVl9NT1RPUl9DT01NQU5EW21vdG9yTG9nLmNtZElEXTptb3RvckxvZy5jbWRJRDtcbiAgICAgICAgICAgIG1vdG9yTG9nLmNtZE5hbWU9Y21kTmFtZTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUubW90b3JMb2csbW90b3JMb2cpO1xuXG4gICAgICAgICAgICAvL2luZm86OuS9jee9ruWItuW+oeaZguOAgeebruaomeS9jee9ruOBq+WIsOmBlOaZguOAgeWIpOWumuadoeS7tuOCkua6gOOBn+OBl+OBn+WgtOWQiOmAmuefpeOCkuihjOOBhlxuICAgICAgICAgICAgaWYobW90b3JMb2cuZXJySUQ9PT0xMDApey8vS01fU1VDQ0VTU19BUlJJVkFMXG4gICAgICAgICAgICAgICBpZih0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24pe1xuICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi50YWdOYW1lPT09bW90b3JMb2cuaWQpe1xuICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24uY2FsbFJlc29sdmUoe2lkOnRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi50YWdOYW1lLG1zZzonUG9zaXRpb24gQXJyaXZhbCBOb3RpZmljYXRpb24nLGluZm86bW90b3JMb2cuaW5mb30pO1xuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi5jYWxsUmVqZWN0KHtpZDp0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24udGFnTmFtZSxtc2c6J0luc3RydWN0aW9uIG92ZXJyaWRlOicgK2NtZE5hbWUsb3ZlcnJpZGVJZDptb3RvckxvZy5pZH0pO1xuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog44Oi44O844K/44O86Kit5a6a5oOF5aCx5Y+W5b6XXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZWdpc3RlckNtZFxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVzXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9LTUNvbS5vbk1vdG9yU2V0dGluZz0ocmVnaXN0ZXJDbWQsIHJlcyk9PntcbiAgICAgICAgICAgIF9LTU5vdGlmeVByb21pcy5zZW5kR3JvdXBOb3RpZnlSZXNvbHZlKHRoaXMuX25vdGlmeVByb21pc0xpc3QscmVnaXN0ZXJDbWQscmVzKTtcbiAgICAgICAgfTtcblxuICAgIH1cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDjg5fjg63jg5Hjg4bjgqNcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Go44Gu5o6l57aa44GM5pyJ5Yq544GLXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgZ2V0IGlzQ29ubmVjdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fS01Db20uZGV2aWNlSW5mby5pc0Nvbm5lY3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOaOpee2muaWueW8j1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtLTU1vdG9yQ29tbWFuZEtNT25lLktNX0NPTk5FQ1RfVFlQRX1cbiAgICAgKi9cbiAgICBnZXQgY29ubmVjdFR5cGUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3RUeXBlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODh+ODkOOCpOOCueaDheWgsVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtLTURldmljZUluZm99XG4gICAgICovXG4gICAgZ2V0IGRldmljZUluZm8oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0tNQ29tLmRldmljZUluZm87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O85ZCNXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXQgbmFtZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fS01Db20uZGV2aWNlSW5mbz90aGlzLl9LTUNvbS5kZXZpY2VJbmZvLm5hbWU6bnVsbDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIOaOpee2muOCs+ODjeOCr+OCv+ODvFxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge0tNQ29tQmFzZX1cbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgZ2V0IGNvbm5lY3Rvcigpe1xuICAgICAgICByZXR1cm4gIHRoaXMuX0tNQ29tO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIHNlY3Rpb246OuODouODvOOCv+ODvOOCs+ODnuODs+ODiSBodHRwczovL2RvY3VtZW50LmtlaWdhbi1tb3Rvci5jb20vbW90b3ItY29udHJvbC1jb21tYW5kL21vdG9yX2FjdGlvbi5odG1sXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O85YuV5L2c44KS5LiN6Kix5Y+v44Go44GZ44KL77yI5LiK5L2N5ZG95Luk77yJXG4gICAgICogQGRlc2Mg5a6J5YWo55So77ya44GT44Gu5ZG95Luk44KS5YWl44KM44KL44Go44Oi44O844K/44O844Gv5YuV5L2c44GX44Gq44GEPGJyPlxuICAgICAqIOOCs+ODnuODs+ODieOBr+OCv+OCueOCr+OCu+ODg+ODiOOBq+iomOmMsuOBmeOCi+OBk+OBqOOBr+S4jeWPr1xuICAgICAqL1xuICAgIGNtZERpc2FibGUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmRpc2FibGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOWLleS9nOOCkuioseWPr+OBmeOCi++8iOS4iuS9jeWRveS7pO+8iVxuICAgICAqIEBkZXNjIOWuieWFqOeUqO+8muOBk+OBruWRveS7pOOCkuWFpeOCjOOCi+OBqOODouODvOOCv+ODvOOBr+WLleS9nOWPr+iDveOBqOOBquOCizxicj5cbiAgICAgKiDjg6Ljg7zjgr/jg7zotbfli5XmmYLjga8gZGlzYWJsZSDnirbmhYvjga7jgZ/jgoHjgIHmnKzjgrPjg57jg7Pjg4njgafli5XkvZzjgpLoqLHlj6/jgZnjgovlv4XopoHjgYzjgYLjgoo8YnI+XG4gICAgICog44Kz44Oe44Oz44OJ44Gv44K/44K544Kv44K744OD44OI44Gr6KiY6Yyy44GZ44KL44GT44Go44Gv5LiN5Y+vXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRFbmFibGUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVuYWJsZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOmAn+W6puOBruWkp+OBjeOBleOCkuOCu+ODg+ODiOOBmeOCi++8iOWNmOS9jeezu++8mlJQTe+8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZF9ycG0gZmxvYXQgIFswLVggcnBtXeOAgCjmraPjga7mlbApXG4gICAgICovXG4gICAgY21kU3BlZWRfcnBtKHNwZWVkX3JwbSA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChzcGVlZF9ycG0qMC4xMDQ3MTk3NTUxMTk2NTk3NywxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNwZWVkLGJ1ZmZlcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOmAn+W6puOBruWkp+OBjeOBleOCkuOCu+ODg+ODiOOBmeOCi++8iOWNmOS9jeezu++8muODqeOCuOOCouODs++8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCBmbG9hdCDpgJ/luqbjga7lpKfjgY3jgZUg5Y2Y5L2N77ya6KeS5bqm77yI44Op44K444Ki44Oz77yJL+enkiBbMC1YIHJwc13jgIAo5q2j44Gu5pWwKVxuICAgICAqL1xuICAgIGNtZFNwZWVkKHNwZWVkID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDkvY3nva7jga7jg5fjg6rjgrvjg4Pjg4jjgpLooYzjgYbvvIjljp/ngrnoqK3lrprvvInvvIjljZjkvY3ns7vvvJrjg6njgrjjgqLjg7PvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb24gZmxvYXQg57W25a++6KeS5bqm77yacmFkaWFuc1xuICAgICAqL1xuICAgIGNtZFByZXNldFBvc2l0aW9uKHBvc2l0aW9uID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KEtNVXRsLnRvTnVtYmVyKHBvc2l0aW9uKSwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucHJlc2V0UG9zaXRpb24sYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5L2N572u44Gu44OX44Oq44K744OD44OI44Gr6Zai44GZ44KLT0ZGU0VU6YePXG4gICAgICogQGRlc2Mg5L2N572u44Gu44Kq44OV44K744OD44OI6YeP77yIcHJlc2V0UG9zaXRpb27jgafoqK3lrprjgZfjgZ/lgKTjgavlr77lv5zvvInjgpLoqq3jgb/lj5bjgotcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxpbnR8QXJyYXk+fVxuICAgICAqL1xuICAgIGNtZFJlYWRQb3NpdGlvbk9mZnNldCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRSZWFkUmVnaXN0ZXIodGhpcy5fTU9UT1JfQ09NTUFORC5yZWFkUG9zaXRpb25PZmZzZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOato+Wbnui7ouOBmeOCi++8iOWPjeaZguioiOWbnuOCiu+8iVxuICAgICAqIEBkZXNjIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBp+OAgeato+Wbnui7olxuICAgICAqL1xuICAgIGNtZFJ1bkZvcndhcmQoKXtcbiAgICAgICAgbGV0IGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucnVuRm9yd2FyZCk7XG4gICAgICAgIHRoaXMuX21vdmVTeW5jSW5zdHJ1Y3Rpb25PdmVycmlkZVJlamVjdChjaWQpOy8v56e75YuV57O744GuU3luY+OCs+ODnuODs+ODieWun+ihjOaZguOBrkNC44GuUmVqZWN0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6YCG5Zue6Lui44GZ44KL77yI5pmC6KiI5Zue44KK77yJXG4gICAgICogQGRlc2MgY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44Gn44CB6YCG5Zue6LuiXG4gICAgICovXG4gICAgY21kUnVuUmV2ZXJzZSgpe1xuICAgICAgICBsZXQgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ydW5SZXZlcnNlKTtcbiAgICAgICAgdGhpcy5fbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCk7Ly/np7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ5a6f6KGM5pmC44GuQ0Ljga5SZWplY3RcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjgpLmjIflrprpgJ/luqbjgaflm57ou6LjgZXjgZvjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgZmxvYXQg6YCf5bqm44Gu5aSn44GN44GVIOWNmOS9je+8muinkuW6pu+8iOODqeOCuOOCouODs++8iS/np5IgW8KxWCBycHNdXG4gICAgICovXG4gICAgY21kUnVuKHNwZWVkID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkLDEwKSkpO1xuICAgICAgICBsZXQgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ydW4sYnVmZmVyKTtcbiAgICAgICAgdGhpcy5fbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCk7Ly/np7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ5a6f6KGM5pmC44GuQ0Ljga5SZWplY3RcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOCkuaMh+WumumAn+W6puOBp+Wbnui7ouOBleOBm+OCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZF9ycG0gZmxvYXQgW8KxWCBycG1dXG4gICAgICovXG4gICAgY21kUnVuX3JwbShzcGVlZF9ycG0gPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoc3BlZWRfcnBtKjAuMTA0NzE5NzU1MTE5NjU5NzcsMTApKTtcbiAgICAgICAgbGV0IGNpZD0gdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJ1bixidWZmZXIpO1xuICAgICAgICB0aGlzLl9tb3ZlU3luY0luc3RydWN0aW9uT3ZlcnJpZGVSZWplY3QoY2lkKTsvL+enu+WLleezu+OBrlN5bmPjgrPjg57jg7Pjg4nlrp/ooYzmmYLjga5DQuOBrlJlamVjdFxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg57W25a++5L2N572u44Gr56e75YuV44GZ44KLXG4gICAgICogQGRlc2Mg6YCf44GV44GvIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBjOaOoeeUqOOBleOCjOOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBmbG9hdCDop5LluqbvvJpyYWRpYW5zXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIGZsb2F0IOmAn+W6puOBruWkp+OBjeOBlSDljZjkvY3vvJrop5LluqbvvIjjg6njgrjjgqLjg7PvvIkv56eSIFswLVggcnBzXeOAgFxuICAgICAqL1xuICAgIGNtZE1vdmVUb1Bvc2l0aW9uKHBvc2l0aW9uLHNwZWVkPW51bGwpe1xuICAgICAgICBpZihwb3NpdGlvbj09PSB1bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBjaWQ9bnVsbDtcbiAgICAgICAgaWYoc3BlZWQhPT1udWxsKXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoOCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChwb3NpdGlvbiwxMCkpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMig0LHBhcnNlRmxvYXQoc3BlZWQsMTApKTtcbiAgICAgICAgICAgIGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZVRvUG9zaXRpb25TcGVlZCxidWZmZXIpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChwb3NpdGlvbiwxMCkpO1xuICAgICAgICAgICAgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlVG9Qb3NpdGlvbixidWZmZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCk7Ly/np7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ5a6f6KGM5pmC44GuQ0Ljga5SZWplY3RcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDntbblr77kvY3nva7jgavnp7vli5XjgZfjgIHnp7vli5Xjga7miJDlkKbjgpLpgJrnn6XjgZnjgosgKE1vdG9yRmFybSBWZXIgPj0gMi4yMylcbiAgICAgKiBAZGVzYyDpgJ/jgZXjga8gY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44GM5o6h55So44GV44KM44KLXG4gICAgICogPHVsPlxuICAgICAqICAgICA8bGk+44GT44Gu44Kz44Oe44Oz44OJ5a6f6KGM5Lit44Gr5Yil44Gu56e75YuV57O744Gu44Kz44Oe44Oz44OJ44KS5a6f6KGM44GZ44KL44GoJ0luc3RydWN0aW9uIG92ZXJyaWRlJ+OBqOOBl+OBpnJlamVjdOOBleOCjOOCizwvbGk+XG4gICAgICogPC91bD5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKHJlc29sdmUpID0+e1xuICAgICAqICAgICAga01Nb3Rvck9uZS5jbWROb3RpZnlQb3NBcnJpdmFsKDEsS01VdGwuZGVncmVlVG9SYWRpYW4oMC41KSk7Ly/liLDpgZTjgajliKTlrprjgZnjgovnm67mqJnluqfmqJnjga7nr4Tlm7IgKy0wLjXluqZcbiAgICAgKiAgICAgIC8v5Y6f54K556e75YuVIDMwcnBtIOOCv+OCpOODoOOCouOCpuODiCA1c1xuICAgICAqICAgICAgcmV0dXJuIGtNTW90b3JPbmUuY21kTW92ZVRvUG9zaXRpb25TeW5jKDAsS01Db25uZWN0b3IuS01VdGwucnBtVG9SYWRpYW5TZWMoMzApLDUwMDApO1xuICAgICAqIH0pLnRoZW4oKHJlc29sdmUpID0+e1xuICAgICAqICAgICAgLy9wb3NpdGlvbiBBcnJpdmVkXG4gICAgICogfSkuY2F0Y2goKGUpPT57XG4gICAgICogICAgICBjb25zb2xlLmxvZyhlKTsvLydJbnN0cnVjdGlvbiBvdmVycmlkZScgb3IgVGltZW91dFxuICAgICAqIH0pO1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBmbG9hdCDop5LluqbvvJpyYWRpYW5zXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIGZsb2F0IOmAn+W6puOBruWkp+OBjeOBlSDljZjkvY3vvJrop5LluqbvvIjjg6njgrjjgqLjg7PvvIkv56eSIFswLVggcnBzXeOAgFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0IGludCBbMCAtIHggbXNdIOODh+ODleOCqeODq+ODiCAwOuOCv+OCpOODoOOCouOCpuODiOeEoeOBl1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4gICAgICovXG4gICAgY21kTW92ZVRvUG9zaXRpb25TeW5jKHBvc2l0aW9uLHNwZWVkPW51bGwsdGltZW91dD0wKXtcbiAgICAgICAgaWYocG9zaXRpb249PT0gdW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgc2VsZj10aGlzO1xuICAgICAgICBsZXQgY2lkPW51bGw7XG4gICAgICAgIGlmKHNwZWVkIT09bnVsbCl7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDgpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQocG9zaXRpb24sMTApKTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoNCxwYXJzZUZsb2F0KHNwZWVkLDEwKSk7XG4gICAgICAgICAgICBjaWQ9dGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVUb1Bvc2l0aW9uU3BlZWQsYnVmZmVyKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQocG9zaXRpb24sMTApKTtcbiAgICAgICAgICAgIGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZVRvUG9zaXRpb24sYnVmZmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vdmVTeW5jSW5zdHJ1Y3Rpb25PdmVycmlkZVJlamVjdChjaWQpOy8v56e75YuV57O744GuU3luY+OCs+ODnuODs+ODieWun+ihjOaZguOBrkNC44GuUmVqZWN0XG5cbiAgICAgICAgLy/miJDlkKbjga7mjZXmjYlcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgbGV0IHRtPSBNYXRoLmFicyhwYXJzZUludCh0aW1lb3V0KSk7XG4gICAgICAgICAgICBzZWxmLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb249bmV3IF9LTU5vdGlmeVByb21pcyhjaWQsXCJjbWRNb3ZlVG9Qb3NpdGlvblN5bmNcIixudWxsLHJlc29sdmUscmVqZWN0LHRtKTsvL25vdGlmeee1jOeUseOBrktNX1NVQ0NFU1NfQVJSSVZBTOOCklByb21pc+OBqOe0kOS7mOOBkVxuICAgICAgICAgICAgaWYodG0pe1xuICAgICAgICAgICAgICAgIHNlbGYuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi5zdGFydFJlamVjdFRpbWVPdXRDb3VudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDnm7jlr77kvY3nva7jgavnp7vli5XjgZnjgotcbiAgICAgKiBAZGVzYyDpgJ/jgZXjga8gY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44GM5o6h55So44GV44KM44KLXG4gICAgICogQHBhcmFtICB7bnVtYmVyfSBkaXN0YW5jZSBmbG9hdCDop5LluqbvvJpyYWRpYW5zW+W3pjorcmFkaWFucyDlj7M6LXJhZGlhbnNdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIGZsb2F0IOmAn+W6puOBruWkp+OBjeOBlSDljZjkvY3vvJrop5LluqbvvIjjg6njgrjjgqLjg7PvvIkv56eSIFswLVggcnBzXeOAgCjmraPjga7mlbApXG4gICAgICovXG4gICAgY21kTW92ZUJ5RGlzdGFuY2UoZGlzdGFuY2UgPSAwLHNwZWVkPW51bGwpe1xuICAgICAgICBsZXQgY2lkPW51bGw7XG4gICAgICAgIGlmKHNwZWVkIT09bnVsbCl7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDgpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoZGlzdGFuY2UsMTApKTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoNCxwYXJzZUZsb2F0KHNwZWVkLDEwKSk7XG4gICAgICAgICAgICBjaWQ9dGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVCeURpc3RhbmNlU3BlZWQsYnVmZmVyKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoZGlzdGFuY2UsMTApKTtcbiAgICAgICAgICAgIGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZUJ5RGlzdGFuY2UsYnVmZmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vdmVTeW5jSW5zdHJ1Y3Rpb25PdmVycmlkZVJlamVjdChjaWQpOy8v56e75YuV57O744GuU3luY+OCs+ODnuODs+ODieWun+ihjOaZguOBrkNC44GuUmVqZWN0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg55u45a++5L2N572u44Gr56e75YuV44GX44CB56e75YuV44Gu5oiQ5ZCm44KS6YCa55+l44GZ44KLIChNb3RvckZhcm0gVmVyID49IDIuMjMpXG4gICAgICogQGRlc2Mg6YCf44GV44GvIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBjOaOoeeUqOOBleOCjOOCi1xuICAgICAqIDx1bD5cbiAgICAgKiAgICAgPGxpPuOBk+OBruOCs+ODnuODs+ODieWun+ihjOS4reOBq+WIpeOBruenu+WLleezu+OBruOCs+ODnuODs+ODieOCkuWun+ihjOOBmeOCi+OBqCdJbnN0cnVjdGlvbiBvdmVycmlkZSfjgajjgZfjgaZyZWplY3TjgZXjgozjgos8L2xpPlxuICAgICAqIDwvdWw+XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBQcm9taXNlLnJlc29sdmUoKS50aGVuKChyZXNvbHZlKSA9PntcbiAgICAgKiAgICAgIGtNTW90b3JPbmUuY21kTm90aWZ5UG9zQXJyaXZhbCgxLEtNVXRsLmRlZ3JlZVRvUmFkaWFuKDAuNSkpOy8v5Yiw6YGU44Go5Yik5a6a44GZ44KL55uu5qiZ5bqn5qiZ44Gu56+E5ZuyICstMC415bqmXG4gICAgICogICAgICAvLzM2MOW6puebuOWvvuenu+WLlSAzMHJwbSDjgr/jgqTjg6DjgqLjgqbjg4jnhKHjgZdcbiAgICAgKiAgICAgIHJldHVybiBrTU1vdG9yT25lLmNtZE1vdmVCeURpc3RhbmNlU3luYyhLTUNvbm5lY3Rvci5LTVV0bC5kZWdyZWVUb1JhZGlhbigzNjApLEtNQ29ubmVjdG9yLktNVXRsLnJwbVRvUmFkaWFuU2VjKDMwKSk7XG4gICAgICogfSkudGhlbigocmVzb2x2ZSkgPT57XG4gICAgICogICAgICAvL3Bvc2l0aW9uIEFycml2ZWRcbiAgICAgKiB9KS5jYXRjaCgoZSk9PntcbiAgICAgKiAgICAgIGNvbnNvbGUubG9nKGUpOy8vJ0luc3RydWN0aW9uIG92ZXJyaWRlJyBvciBUaW1lb3V0XG4gICAgICogfSk7XG4gICAgICogQHBhcmFtICB7bnVtYmVyfSBkaXN0YW5jZSBmbG9hdCDop5LluqbvvJpyYWRpYW5zW+W3pjorcmFkaWFucyDlj7M6LXJhZGlhbnNdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIGZsb2F0IOmAn+W6puOBruWkp+OBjeOBlSDljZjkvY3vvJrop5LluqbvvIjjg6njgrjjgqLjg7PvvIkv56eSIFswLVggcnBzXeOAgCjmraPjga7mlbApXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXQgaW50IFswIC0geCBtc10g44OH44OV44Kp44Or44OIIDA644K/44Kk44Og44Ki44Km44OI54Sh44GXXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICAgKi9cbiAgICBjbWRNb3ZlQnlEaXN0YW5jZVN5bmMoZGlzdGFuY2UgPSAwLHNwZWVkPW51bGwsdGltZW91dD0wKXtcbiAgICAgICAgbGV0IHNlbGY9dGhpcztcbiAgICAgICAgbGV0IGNpZD1udWxsO1xuICAgICAgICBpZihzcGVlZCE9PW51bGwpe1xuICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig4KTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KGRpc3RhbmNlLDEwKSk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDQscGFyc2VGbG9hdChzcGVlZCwxMCkpO1xuICAgICAgICAgICAgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlQnlEaXN0YW5jZVNwZWVkLGJ1ZmZlcik7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KGRpc3RhbmNlLDEwKSk7XG4gICAgICAgICAgICBjaWQ9dGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVCeURpc3RhbmNlLGJ1ZmZlcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tb3ZlU3luY0luc3RydWN0aW9uT3ZlcnJpZGVSZWplY3QoY2lkKTsvL+enu+WLleezu+OBrlN5bmPjgrPjg57jg7Pjg4nlrp/ooYzmmYLjga5DQuOBrlJlamVjdFxuXG4gICAgICAgIC8v5oiQ5ZCm44Gu5o2V5o2JXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGxldCB0bT0gTWF0aC5hYnMocGFyc2VJbnQodGltZW91dCkpO1xuICAgICAgICAgICAgc2VsZi5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uPW5ldyBfS01Ob3RpZnlQcm9taXMoY2lkLFwiY21kTW92ZUJ5RGlzdGFuY2VTeW5jXCIsbnVsbCxyZXNvbHZlLHJlamVjdCx0bSk7XG4gICAgICAgICAgICBpZih0bSl7XG4gICAgICAgICAgICAgICAgc2VsZi5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uLnN0YXJ0UmVqZWN0VGltZU91dENvdW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7lirHno4HjgpLlgZzmraLjgZnjgovvvIjmhJ/op6bjga/mrovjgorjgb7jgZnvvIlcbiAgICAgKiBAZGVzYyDlrozlhajjg5Xjg6rjg7znirbmhYvjgpLlho3nj77jgZnjgovloLTlkIjjga/jgIEgY21kRnJlZSgpLmNtZERpc2FibGUoKSDjgajjgZfjgabkuIvjgZXjgYTjgIJcbiAgICAgKi9cbiAgICBjbWRGcmVlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5mcmVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjgpLpgJ/luqbjgrzjg63jgb7jgafmuJvpgJ/jgZflgZzmraLjgZnjgotcbiAgICAgKiBAZGVzYyBycG0gPSAwIOOBqOOBquOCi+OAglxuICAgICAqL1xuICAgIGNtZFN0b3AoKXtcbiAgICAgICAgbGV0IGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcCk7XG4gICAgICAgIHRoaXMuX21vdmVTeW5jSW5zdHJ1Y3Rpb25PdmVycmlkZVJlamVjdChjaWQpOy8v56e75YuV57O744GuU3luY+OCs+ODnuODs+ODieWun+ihjOaZguOBrkNC44GuUmVqZWN0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OI44Or44Kv5Yi25b6h44KS6KGM44GGXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvcnF1ZSBmbG9hdCDjg4jjg6vjgq8g5Y2Y5L2N77yaTuODu20gWy1YIH4gKyBYIE5tXSDmjqjlpajlgKQgMC4zLTAuMDVcbiAgICAgKiBAZGVzYyDpgJ/luqbjgoTkvY3nva7jgpLlkIzmmYLjgavliLblvqHjgZnjgovloLTlkIjjga/jgIHjg6Ljg7zjgr/jg7zoqK3lrprjga4gMHgwRTogbWF4VG9ycXVlIOOBqCAweDYwOiBydW5Gb3J3YXJkIOetieOCkuS9teeUqOOBl+OBpuS4i+OBleOBhOOAglxuICAgICAqXG4gICAgICovXG4gICAgY21kSG9sZFRvcnF1ZSh0b3JxdWUpe1xuICAgICAgICBpZih0b3JxdWU9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KHRvcnF1ZSwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuaG9sZFRvcnF1ZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOiomOaGtuOBl+OBn+OCv+OCueOCr++8iOWRveS7pO+8ieOBruOCu+ODg+ODiOOCkuWun+ihjOOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBpbnQg44K/44K544Kv44K744OD44OI55Wq5Y+377yIMO+9njY1NTM177yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJlcGVhdGluZyBpbnQg57mw44KK6L+U44GX5Zue5pWwIDDjga/nhKHliLbpmZBcbiAgICAgKlxuICAgICAqIEBkZXNjIEtNLTEg44GvIGluZGV4OiAwfjQ5IOOBvuOBp+OAgu+8iDUw5YCL44Gu44Oh44Oi44Oq44OQ44Oz44KvIOWQhDgxMjggQnl0ZSDjgb7jgafliLbpmZDjgYLjgorvvIk8YnI+XG4gICAgICog44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44Gv44CB44Kz44Oe44Oz44OJ77yI44K/44K544Kv44K744OD44OI77yJ44KS5Y+C54Wn5LiL44GV44GE44CCIGh0dHBzOi8vZG9jdW1lbnQua2VpZ2FuLW1vdG9yLmNvbS9tb3Rvci1jb250cm9sLWNvbW1hbmQvdGFza3NldC5odG1sXG4gICAgICovXG4gICAgY21kU3RhcnREb2luZ1Rhc2tzZXQoaW5kZXggPSAwLHJlcGVhdGluZyA9IDEpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDYpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDIsTWF0aC5hYnMocGFyc2VJbnQocmVwZWF0aW5nLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnREb2luZ1Rhc2tzZXQsYnVmZmVyKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44K/44K544Kv44K744OD44OI44KS5YGc5q2iXG4gICAgICogQGRlc2Mg44K/44K544Kv44K744OD44OI44Gu5YaN55Sf44KS5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kU3RvcERvaW5nVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcERvaW5nVGFza3NldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K344On44Oz44KS5YaN55Sf77yI5rqW5YKZ44Gq44GX77yJXG4gICAgICogQGRlc2Mg44Oi44O844K344On44Oz44Gu44OX44Os44Kk44OQ44OD44Kv44KS77yI5rqW5YKZ44Gq44GX44Gn77yJ44OX44Os44Kk44OQ44OD44Kv6ZaL5aeL44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjg6Ljg7zjgrfjg6fjg7Pnlarlj7fvvIgw772eNjU1MzXvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVwZWF0aW5nIGludCDnubDjgorov5TjgZflm57mlbAgMOOBr+eEoeWItumZkFxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRQcmVwYXJlUGxheWJhY2tNb3Rpb25fU1RBUlRfUE9TSVRJT059IHN0YXJ0X3Bvc2l0aW9uIGludCDjgrnjgr/jg7zjg4jkvY3nva7jga7oqK3lrpo8YnI+XG4gICAgICogU1RBUlRfUE9TSVRJT05fQUJTOuiomOaGtuOBleOCjOOBn+mWi+Wni+S9jee9ru+8iOe1tuWvvuW6p+aome+8ieOBi+OCieOCueOCv+ODvOODiDxicj5cbiAgICAgKiBTVEFSVF9QT1NJVElPTl9DVVJSRU5UOuePvuWcqOOBruS9jee9ruOCkumWi+Wni+S9jee9ruOBqOOBl+OBpuOCueOCv+ODvOODiFxuICAgICAqL1xuICAgIGNtZFN0YXJ0UGxheWJhY2tNb3Rpb24oaW5kZXggPSAwLHJlcGVhdGluZyA9IDAsc3RhcnRfcG9zaXRpb24gPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig3KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQzMigyLE1hdGguYWJzKHBhcnNlSW50KHJlcGVhdGluZywxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoNixNYXRoLmFicyhwYXJzZUludChzdGFydF9wb3NpdGlvbiwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0YXJ0UGxheWJhY2tNb3Rpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/jgpLlgZzmraLjgZnjgotcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgY21kU3RvcFBsYXliYWNrTW90aW9uKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdG9wUGxheWJhY2tNb3Rpb24pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBzZWN0aW9uOjrjgq3jg6Xjg7zmk43kvZxcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Kt44Ol44O844KS5LiA5pmC5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kUGF1c2VRdWV1ZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucGF1c2VRdWV1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Kt44Ol44O844KS5YaN6ZaL44GZ44KL77yI6JOE56mN44GV44KM44Gf44K/44K544Kv44KS5YaN6ZaL77yJXG4gICAgICovXG4gICAgY21kUmVzdW1lUXVldWUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc3VtZVF1ZXVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgq3jg6Xjg7zjgpLmjIflrprmmYLplpPlgZzmraLjgZflho3plovjgZnjgotcbiAgICAgKiBAZGVzYyBjbWRQYXVzZe+8iOOCreODpeODvOWBnOatou+8ieOCkuWun+ihjOOBl+OAgeaMh+WumuaZgumWk++8iOODn+ODquenku+8iee1jOmBjuW+jOOAgeiHquWLleeahOOBqyBjbWRSZXN1bWXvvIjjgq3jg6Xjg7zlho3plovvvIkg44KS6KGM44GE44G+44GZ44CCXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWUg5YGc5q2i5pmC6ZaTW21zZWNdXG4gICAgICovXG4gICAgY21kV2FpdFF1ZXVlKHRpbWUgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDAsTWF0aC5hYnMocGFyc2VJbnQodGltZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELndhaXRRdWV1ZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCreODpeODvOOCkuODquOCu+ODg+ODiOOBmeOCi1xuICAgICAqL1xuICAgIGNtZFJlc2V0UXVldWUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0UXVldWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrueKtuaFi+OCkuiqreOBv+WPluOCiyDvvIhyZWFk5bCC55So77yJXG4gICAgICogQHJldHVybnMge1Byb21pc2U8aW50fEFycmF5Pn1cbiAgICAgKi9cbiAgICBjbWRSZWFkU3RhdHVzKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZFJlYWRSZWdpc3Rlcih0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWRTdGF0dXMpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBzZWN0aW9uOjrjgr/jgrnjgq/jgrvjg4Pjg4hcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgr/jgrnjgq/vvIjlkb3ku6TvvInjga7jgrvjg4Pjg4jjga7oqJjpjLLjgpLplovlp4vjgZnjgotcbiAgICAgKiBAZGVzYyDoqJjmhrbjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjga7jg6Hjg6Ljg6rjga/jgrPjg57jg7Pjg4nvvJplcmFzZVRhc2tzZXQg44Gr44KI44KK5LqI44KB5raI5Y6744GV44KM44Gm44GE44KL5b+F6KaB44GM44GC44KKXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjgqTjg7Pjg4fjg4Pjgq/jgrkgS00tMSDjga7loLTlkIjjgIHjgqTjg7Pjg4fjg4Pjgq/jgrnjga7lgKTjga8gMO+9njQ5IO+8iOioiDUw5YCL6KiY6Yyy77yJXG4gICAgICovXG4gICAgY21kU3RhcnRSZWNvcmRpbmdUYXNrU2V0KGluZGV4ID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnRSZWNvcmRpbmdUYXNrc2V0LGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44KS5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kU3RvcFJlY29yZGluZ1Rhc2tzZXQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3BSZWNvcmRpbmdUYXNrc2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjga7jgqTjg7Pjg4fjg4Pjgq/jgrnjga7jgr/jgrnjgq/jgrvjg4Pjg4jjgpLmtojljrvjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAqL1xuICAgIGNtZEVyYXNlVGFza3NldChpbmRleCA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlVGFza3NldCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBruOCv+OCueOCr+OCu+ODg+ODiOOCkua2iOWOu+OBmeOCi1xuICAgICAqL1xuICAgIGNtZEVyYXNlQWxsVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZXJhc2VBbGxUYXNrc2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLlkI3oqK3lrppcbiAgICAgKiBAZGVzYyDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLlkI3jgpLoqK3lrprjgZnjgovjgILvvIjjgZPjgozjgYvjgonoqJjpjLLjgZnjgovjgoLjga7jgavlr77jgZfjgabvvIlcbiAgICAgKi9cbiAgICBjbWRTZXRUYXNrc2V0TmFtZShuYW1lKXtcbiAgICAgICAgbGV0IGJ1ZmZlcj0gKG5ldyBVaW50OEFycmF5KFtdLm1hcC5jYWxsKG5hbWUsIGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgICAgIHJldHVybiBjLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIH0pKSkuYnVmZmVyO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc2V0VGFza3NldE5hbWUsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo644OG44Kj44O844OB44Oz44KwXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODgOOCpOODrOOCr+ODiOODhuOCo+ODvOODgeODs+OCsOmWi+Wni++8iOa6luWCmeOBquOBl++8iVxuICAgICAqIEBkZXNjIEtNLTEg44Gu5aC05ZCI44CB44Kk44Oz44OH44OD44Kv44K544Gu5YCk44GvIDDvvZ4xOSDvvIjoqIgyMOWAi+iomOmMsu+8ieOBqOOBquOCi+OAguiomOmMsuaZgumWk+OBryA2NTQwOCBbbXNlY10g44KS6LaF44GI44KL44GT44Go44Gv44Gn44GN44Gq44GEXG4gICAgICogICAgICAg6KiY5oa244GZ44KL44Kk44Oz44OH44OD44Kv44K544Gu44Oh44Oi44Oq44GvYmxlRXJhc2VNb3Rpb24g44Gr44KI44KK5LqI44KB5raI5Y6744GV44KM44Gm44GE44KL5b+F6KaB44GM44GC44KLXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuSBbMC0xOV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZSBpbnQg6KiY6Yyy5pmC6ZaTIFttc2VjIDAtNjU0MDhdXG4gICAgICovXG4gICAgY21kU3RhcnRUZWFjaGluZ01vdGlvbihpbmRleCA9IDAsbGVuZ3RoUmVjb3JkaW5nVGltZSA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDYpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDIsTWF0aC5hYnMocGFyc2VJbnQobGVuZ3RoUmVjb3JkaW5nVGltZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0YXJ0VGVhY2hpbmdNb3Rpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDlrp/ooYzkuK3jga7jg4bjgqPjg7zjg4Hjg7PjgrDjgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRTdG9wVGVhY2hpbmdNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3BUZWFjaGluZ01vdGlvbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5oyH5a6a44GX44Gf44Kk44Oz44OH44OD44Kv44K544Gu44Oi44O844K344On44Oz44KS5raI5Y6744GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjgqTjg7Pjg4fjg4Pjgq/jgrlcbiAgICAgKlxuICAgICAqIEBkZXNjIEtNLTEg44Gu5aC05ZCI44CB44Kk44Oz44OH44OD44Kv44K544Gu5YCk44GvIDDvvZ4xOSDvvIjoqIgyMOWAi+iomOmMsu+8ieOBqOOBquOCi1xuICAgICAqXG4gICAgICovXG4gICAgY21kRXJhc2VNb3Rpb24oaW5kZXggPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZU1vdGlvbixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBruODouODvOOCt+ODp+ODs+OCkua2iOWOu+OBmeOCi1xuICAgICAqL1xuICAgIGNtZEVyYXNlQWxsTW90aW9uKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZUFsbE1vdGlvbik7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIHNlY3Rpb246OkxFRFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBMRUTjga7ngrnnga/nirbmhYvjgpLjgrvjg4Pjg4jjgZnjgotcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuY21kTGVkX0xFRF9TVEFURX0gY21kTGVkX0xFRF9TVEFURSBpbnQg54K554Gv54q25oWLPGJyPlxuICAgICAqICAgTEVEX1NUQVRFX09GRjpMRUTmtojnga88YnI+XG4gICAgICogICBMRURfU1RBVEVfT05fU09MSUQ6TEVE54K554GvPGJyPlxuICAgICAqICAgTEVEX1NUQVRFX09OX0ZMQVNIOkxFROeCuea7he+8iOS4gOWumumWk+malOOBp+eCuea7he+8iTxicj5cbiAgICAgKiAgIExFRF9TVEFURV9PTl9ESU06TEVE44GM44KG44Gj44GP44KK5piO5ruF44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJlZCBpbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZ3JlZW4gaW50IDAtMjU1XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJsdWUgaW50IDAtMjU1XG4gICAgICovXG4gICAgY21kTGVkKGNtZExlZF9MRURfU1RBVEUscmVkLGdyZWVuLGJsdWUpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLE1hdGguYWJzKHBhcnNlSW50KGNtZExlZF9MRURfU1RBVEUsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDEsTWF0aC5hYnMocGFyc2VJbnQocmVkLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgyLE1hdGguYWJzKHBhcnNlSW50KGdyZWVuLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgzLE1hdGguYWJzKHBhcnNlSW50KGJsdWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5sZWQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gSU1VIOOCuOODo+OCpOODrVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IElNVSjjgrjjg6PjgqTjg60p44Gu5YCk5Y+W5b6XKOmAmuefpSnjgpLplovlp4vjgZnjgotcbiAgICAgKiBAZGVzYyDmnKzjgrPjg57jg7Pjg4njgpLlrp/ooYzjgZnjgovjgajjgIFJTVXjga7jg4fjg7zjgr/jga9CTEXjga7jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrlNT1RPUl9JTVVfTUVBU1VSRU1FTlTjgavpgJrnn6XjgZXjgozjgos8YnI+XG4gICAgICogTU9UT1JfSU1VX01FQVNVUkVNRU5U44Gubm90aWZ544Gv44Kk44OZ44Oz44OI44K/44Kk44OXIEtNTW90b3JDb21tYW5kS01PbmUuRVZFTlRfVFlQRS5pbXVNZWFzdXJlbWVudCDjgavpgJrnn6VcbiAgICAgKi9cbiAgICBjbWRFbmFibGVJTVVNZWFzdXJlbWVudCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW5hYmxlSU1VTWVhc3VyZW1lbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IElNVSjjgrjjg6PjgqTjg60p44Gu5YCk5Y+W5b6XKOmAmuefpSnjgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWREaXNhYmxlSU1VTWVhc3VyZW1lbnQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmRpc2FibGVJTVVNZWFzdXJlbWVudCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIElNVSDjg6Ljg7zjgr/jg7xcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5ris5a6a5YCk77yI5L2N572u44O76YCf5bqm44O744OI44Or44Kv77yJ5Ye65Yqb44KS6ZaL5aeL44GZ44KLXG4gICAgICogQGRlc2Mg44OH44OV44Kp44Or44OI44Gn44Gv44Oi44O844K/44O86LW35YuV5pmCb27jgIIgbW90b3JNZWFzdXJlbWVudEJ5RGVmYXVsdCgpIOWPgueFp1xuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBjbWRFbmFibGVNb3Rvck1lYXN1cmVtZW50KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lbmFibGVNb3Rvck1lYXN1cmVtZW50KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5ris5a6a5YCk77yI5L2N572u44O76YCf5bqm44O744OI44Or44Kv77yJ5Ye65Yqb44KS5YGc5q2i44GZ44KLXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIGNtZERpc2FibGVNb3Rvck1lYXN1cmVtZW50KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5kaXNhYmxlTW90b3JNZWFzdXJlbWVudCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIOOCt+OCueODhuODoFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgrfjgrnjg4bjg6DjgpLlho3otbfli5XjgZnjgotcbiAgICAgKiBAZGVzYyBCTEXjgavmjqXntprjgZfjgabjgYTjgZ/loLTlkIjjgIHliIfmlq3jgZfjgabjgYvjgonlho3otbfli5VcbiAgICAgKi9cbiAgICBjbWRSZWJvb3QoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlYm9vdCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODgeOCp+ODg+OCr+OCteODoO+8iENSQzE2KSDmnInlirnljJZcbiAgICAgKiBAZGVzYyDjgrPjg57jg7Pjg4nvvIjjgr/jgrnjgq/vvInjga7jg4Hjgqfjg4Pjgq/jgrXjg6DjgpLmnInlirnljJbjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaXNFbmFibGVkIDA6RGlzYmxlZCwgMTpFbmFibGVkXG4gICAgICovXG4gICAgY21kRW5hYmxlQ2hlY2tTdW0oaXNFbmFibGVkKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxpc0VuYWJsZWQ/MTowKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVuYWJsZUNoZWNrU3VtLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OV44Kh44O844Og44Km44Kn44Ki44Ki44OD44OX44OH44O844OI44Oi44O844OJ44Gr5YWl44KLXG4gICAgICogQGRlc2Mg44OV44Kh44O844Og44Km44Kn44Ki44KS44Ki44OD44OX44OH44O844OI44GZ44KL44Gf44KB44Gu44OW44O844OI44Ot44O844OA44O844Oi44O844OJ44Gr5YWl44KL44CC77yI44K344K544OG44Og44Gv5YaN6LW35YuV44GV44KM44KL44CC77yJXG4gICAgICovXG4gICAgY21kRW50ZXJEZXZpY2VGaXJtd2FyZVVwZGF0ZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW50ZXJEZXZpY2VGaXJtd2FyZVVwZGF0ZSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIOODouODvOOCv+ODvOioreWumuOAgE1PVE9SX1NFVFRJTkdcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5pyA5aSn6YCf44GV44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heFNwZWVkIGZsb2F0IOacgOWkp+mAn+OBlSBbcmFkaWFuIC8gc2Vjb25kXe+8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZE1heFNwZWVkKG1heFNwZWVkKXtcbiAgICAgICAgaWYobWF4U3BlZWQ9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KG1heFNwZWVkLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubWF4U3BlZWQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7mnIDlsI/pgJ/jgZXjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4U3BlZWQgZmxvYXQg5pyA5bCP6YCf44GVIFtyYWRpYW4gLyBzZWNvbmRd77yI5q2j44Gu5YCk77yJXG4gICAgICogQGRlc2MgbWluU3BlZWQg44Gv44CBYmxlUHJlcGFyZVBsYXliYWNrTW90aW9uIOWun+ihjOOBrumam+OAgemWi+Wni+WcsOeCueOBq+enu+WLleOBmeOCi+mAn+OBleOBqOOBl+OBpuS9v+eUqOOBleOCjOOCi+OAgumAmuW4uOaZgumBi+i7ouOBp+OBr+S9v+eUqOOBleOCjOOBquOBhOOAglxuICAgICAqL1xuICAgIGNtZE1pblNwZWVkKG1pblNwZWVkKXtcbiAgICAgICAgaWYobWluU3BlZWQ9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KG1pblNwZWVkLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubWluU3BlZWQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDliqDmuJvpgJ/mm7Lnt5rjgpLmjIflrprjgZnjgovvvIjjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6vjga7oqK3lrprvvIlcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuY21kQ3VydmVUeXBlX0NVUlZFX1RZUEV9IGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFIGludCDliqDmuJvpgJ/jgqvjg7zjg5bjgqrjg5fjgrfjg6fjg7M8YnI+XG4gICAgICogICAgICBDVVJWRV9UWVBFX05PTkU6MCDjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT0ZGPGJyPlxuICAgICAqICAgICAgQ1VSVkVfVFlQRV9UUkFQRVpPSUQ6MSDjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT04g77yI5Y+w5b2i5Yqg5rib6YCf77yJXG4gICAgICovXG4gICAgY21kQ3VydmVUeXBlKGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsTWF0aC5hYnMocGFyc2VJbnQoY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5jdXJ2ZVR5cGUsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7liqDpgJ/luqbjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWNjIGZsb2F0IOWKoOmAn+W6piAwLTIwMCBbcmFkaWFuIC8gc2Vjb25kXjJd77yI5q2j44Gu5YCk77yJXG4gICAgICogQGRlc2MgYWNjIOOBr+OAgeODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPTiDjga7loLTlkIjjgIHliqDpgJ/mmYLjgavkvb/nlKjjgZXjgozjgb7jgZnjgILvvIjliqDpgJ/mmYLjga7nm7Tnt5rjga7lgr7jgY3vvIlcbiAgICAgKi9cbiAgICBjbWRBY2MoYWNjID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KGFjYywxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmFjYyxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrua4m+mAn+W6puOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWMgZmxvYXQg5rib6YCf5bqmIDAtMjAwIFtyYWRpYW4gLyBzZWNvbmReMl3vvIjmraPjga7lgKTvvIlcbiAgICAgKiBAZGVzYyBkZWMg44Gv44CB44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9OIOOBruWgtOWQiOOAgea4m+mAn+aZguOBq+S9v+eUqOOBleOCjOOBvuOBmeOAgu+8iOa4m+mAn+aZguOBruebtOe3muOBruWCvuOBje+8iVxuICAgICAqL1xuICAgIGNtZERlYyhkZWMgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoZGVjLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZGVjLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5pyA5aSn44OI44Or44Kv77yI57W25a++5YCk77yJ44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heFRvcnF1ZSBmbG9hdCDmnIDlpKfjg4jjg6vjgq8gW04qbV3vvIjmraPjga7lgKTvvIlcbiAgICAgKlxuICAgICAqIEBkZXNjIG1heFRvcnF1ZSDjgpLoqK3lrprjgZnjgovjgZPjgajjgavjgojjgorjgIHjg4jjg6vjgq/jga7ntbblr77lgKTjgYwgbWF4VG9ycXVlIOOCkui2heOBiOOBquOBhOOCiOOBhuOBq+mBi+i7ouOBl+OBvuOBmeOAgjxicj5cbiAgICAgKiBtYXhUb3JxdWUgPSAwLjEgW04qbV0g44Gu5b6M44GrIHJ1bkZvcndhcmQg77yI5q2j5Zue6Lui77yJ44KS6KGM44Gj44Gf5aC05ZCI44CBMC4xIE4qbSDjgpLotoXjgYjjgarjgYTjgojjgYbjgavjgZ3jga7pgJ/luqbjgpLjgarjgovjgaDjgZHntq3mjIHjgZnjgovjgII8YnI+XG4gICAgICog44Gf44Gg44GX44CB44OI44Or44Kv44Gu5pyA5aSn5YCk5Yi26ZmQ44Gr44KI44KK44CB44K344K544OG44Og44Gr44KI44Gj44Gm44Gv5Yi25b6h5oCn77yI5oyv5YuV77yJ44GM5oKq5YyW44GZ44KL5Y+v6IO95oCn44GM44GC44KL44CCXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRNYXhUb3JxdWUobWF4VG9ycXVlKXtcbiAgICAgICAgaWYobWF4VG9ycXVlPT09dW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChtYXhUb3JxdWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tYXhUb3JxdWUsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg4DjgqTjg6zjgq/jg4jjg4bjgqPjg7zjg4Hjg7PjgrDjga7jgrXjg7Pjg5fjg6rjg7PjgrDplpPpmpRcbiAgICAgKiBAZGVzYyDjg4bjgqPjg7zjg4Hjg7PjgrDjg7vjg5fjg6zjgqTjg5Djg4Pjgq/jga7lrp/ooYzplpPpmpRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW50ZXJ2YWwgbXPvvIgyLTEwMDAgIDAsIDFtc+OBr+OCqOODqeODvOOBqOOBquOCi++8iVxuICAgICAqL1xuICAgIGNtZFRlYWNoaW5nSW50ZXJ2YWwoaW50ZXJ2YWwpe1xuICAgICAgICBpZihpbnRlcnZhbD09PXVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IF9pbnRlcnZhbD1NYXRoLmFicyhwYXJzZUludChpbnRlcnZhbCwxMCkpO1xuICAgICAgICBfaW50ZXJ2YWw9X2ludGVydmFsPDI/MjpfaW50ZXJ2YWw7XG4gICAgICAgIF9pbnRlcnZhbD1faW50ZXJ2YWw+MTAwMD8xMDAwOl9pbnRlcnZhbDtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDAsX2ludGVydmFsKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnRlYWNoaW5nSW50ZXJ2YWwsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6KiY5oa25YaN55Sf5pmC44Gu5YaN55Sf6ZaT6ZqUXG4gICAgICogQGRlc2MgIOiomOaGtuWGjeeUn+aZguOBruWGjeeUn+mWk+malFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbnRlcnZhbCBtc++8iDItMTAwMCAgMCwgMW1z44Gv44Ko44Op44O844Go44Gq44KL77yJXG4gICAgICovXG4gICAgY21kUGxheWJhY2tJbnRlcnZhbChpbnRlcnZhbCl7XG4gICAgICAgIGlmKGludGVydmFsPT09dW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgX2ludGVydmFsPU1hdGguYWJzKHBhcnNlSW50KGludGVydmFsLDEwKSk7XG4gICAgICAgIF9pbnRlcnZhbD1faW50ZXJ2YWw8Mj8yOl9pbnRlcnZhbDtcbiAgICAgICAgX2ludGVydmFsPV9pbnRlcnZhbD4xMDAwPzEwMDA6X2ludGVydmFsO1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMCxfaW50ZXJ2YWwpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucGxheWJhY2tJbnRlcnZhbCxidWZmZXIpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrlDvvIjmr5TkvovvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcUN1cnJlbnRQIGZsb2F0IHHpm7vmtYFQ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUUN1cnJlbnRQKHFDdXJyZW50UCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHFDdXJyZW50UCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnFDdXJyZW50UCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5Q77yI5q+U5L6L77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHFDdXJyZW50SSBmbG9hdCBx6Zu75rWBSeOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFFDdXJyZW50SShxQ3VycmVudEkpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChxQ3VycmVudEksMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5xQ3VycmVudEksYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga5x6Lu46Zu75rWBUElE44Kz44Oz44OI44Ot44O844Op44GuRO+8iOW+ruWIhu+8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBxQ3VycmVudEQgZmxvYXQgcembu+a1gUTjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRRQ3VycmVudEQocUN1cnJlbnREKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQocUN1cnJlbnRELDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucUN1cnJlbnRELGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrkTvvIjlvq7liIbvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWRQIGZsb2F0IOmAn+W6plDjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRTcGVlZFAoc3BlZWRQKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWRQLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWRQLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu6YCf5bqmUElE44Kz44Oz44OI44Ot44O844Op44GuSe+8iOepjeWIhu+8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZEkgZmxvYXQg6YCf5bqmSeOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFNwZWVkSShzcGVlZEkpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChzcGVlZEksMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZEksYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7pgJ/luqZQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5E77yI5b6u5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkRCBmbG9hdCDpgJ/luqZE44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kU3BlZWREKHNwZWVkRCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkRCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNwZWVkRCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruS9jee9ruWItuW+oVDjg5Hjg6njg6Hjgr/jgpLjgrvjg4Pjg4hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb25QIGZsb2F0IFsxLjAwMDAgLSAyMC4wMDAwXe+8iOODh+ODleOCqeODq+ODiCA1LjDvvIlcbiAgICAgKi9cbiAgICBjbWRQb3NpdGlvblAocG9zaXRpb25QKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQocG9zaXRpb25QLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucG9zaXRpb25QLGJ1ZmZlcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruS9jee9ruWItuW+oUnjg5Hjg6njg6Hjgr/jgpLjgrvjg4Pjg4hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb25JIGZsb2F0IFsxLjAwMDAgLSAxMDAuMDAwMF3vvIjjg4fjg5Xjgqnjg6vjg4ggMTAuMO+8iVxuICAgICAqL1xuICAgIGNtZFBvc2l0aW9uSShwb3NpdGlvbkkpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChwb3NpdGlvbkksMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wb3NpdGlvbkksYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5L2N572u5Yi25b6hROODkeODqeODoeOCv+OCkuOCu+ODg+ODiFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbkQgZmxvYXQgWzAuMDAwMSAtIDAuMl3vvIjjg4fjg5Xjgqnjg6vjg4ggMC4wMe+8iVxuICAgICAqL1xuICAgIGNtZFBvc2l0aW9uRChwb3NpdGlvbkQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChwb3NpdGlvbkQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wb3NpdGlvbkQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7kvY3nva7liLblvqHmmYLjgIFJROWItuW+oeOCkuacieWKueOBq+OBmeOCi+WBj+W3ruOBrue1tuWvvuWApOOCkuaMh+WumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aHJlc2hvbGQgZmxvYXQgWzAuMCAtIG5d77yI44OH44OV44Kp44Or44OIIDAuMDEzOTYyNmYgLy8gMC44ZGVn77yJXG4gICAgICovXG4gICAgY21kUG9zQ29udHJvbFRocmVzaG9sZCh0aHJlc2hvbGQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdCh0aHJlc2hvbGQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wb3NDb250cm9sVGhyZXNob2xkLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5L2N572u5Yi25b6h5pmC44CB55uu5qiZ5L2N572u44Gr5Yiw6YGU5pmC44CB5Yik5a6a5p2h5Lu244KS5rqA44Gf44GX44Gf5aC05ZCI6YCa55+l44KS6KGM44GG44CCXG4gICAgICogQGRlc2Mg5Yik5a6a5p2h5Lu277yaIHRvbGVyYW5jZSDlhoXjgavkvY3nva7jgYzlhaXjgaPjgabjgYTjgovnirbmhYvjgYzjgIFzZXR0bGVUaW1lIOmAo+e2muOBp+e2muOBj+OBqOOAgemAmuefpShLTV9TVUNDRVNTX0FSUklWQUwp44GM5LiA5Zue6KGM44KP44KM44KL44CCXG4gICAgICogPHVsPlxuICAgICAqICAgICA8bGk+dG9sZXJhbmNl5YaF44Gr5L2N572u44GM5YWl44Gj44Gm44GE44KL54q25oWL44GM44CBc2V0dGxlVGltZeOBrumWk+mAo+e2muOBp+e2muOBj+OBqOmAmuefpeOBjOODiOODquOCrOODvOOBleOCjOOCi+OAgjwvbGk+XG4gICAgICogICAgIDxsaT50b2xlcmFuY2XjgavkuIDnnqzjgafjgoLlhaXjgaPjgaZzZXR0bGVUaW1l5pyq5rqA44Gn5Ye644KL44Go6YCa55+l44OI44Oq44Ks44O844Gv5YmK6Zmk44GV44KM44CB6YCa55+l44Gv6KGM44KP44KM44Gq44GE44CCPC9saT5cbiAgICAgKiAgICAgPGxpPnRvbGVyYW5jZeOBq+S4gOW6puOCguWFpeOCieOBquOBhOWgtOWQiOOAgemAmuefpeODiOODquOCrOODvOOBr+aui+OCiue2muOBkeOCi+OAgijjg4jjg6rjgqzjg7zjga7mmI7npLrnmoTjgarmtojljrvjga8gY21kTm90aWZ5UG9zQXJyaXZhbCgwLDAsMCkgKTwvbGk+XG4gICAgICogICAgIDxsaT7lho3luqZub3RpZnlQb3NBcnJpdmFs44Gn6Kit5a6a44KS6KGM44GG44Go44CB5Lul5YmN44Gu6YCa55+l44OI44Oq44Ks44O844Gv5raI44GI44KL44CCPC9saT5cbiAgICAgKiA8L3VsPlxuICAgICAqIEBwYXJhbSAge251bWJlcn0gaXNFbmFibGVkIDA6RGlzYmxlZCwgMTpFbmFibGVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvbGVyYW5jZSBmbG9hdCBbMC4wIC0gbl0g6Kix5a656Kqk5beuIHJhZGlhbiAo44OH44OV44Kp44Or44OIIOKJkiAwLjFkZWfvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2V0dGxlVGltZSBpbnQgWzAgLSBuXSDliKTlrprmmYLplpMg44Of44Oq56eSICjjg4fjg5Xjgqnjg6vjg4ggMjAwbXPvvIlcbiAgICAgKlxuICAgICAqL1xuICAgIGNtZE5vdGlmeVBvc0Fycml2YWwoaXNFbmFibGVkPTAsdG9sZXJhbmNlPTAuMDAxNzQ1MzMsc2V0dGxlVGltZT0yMDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLGlzRW5hYmxlZD8xOjApO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDEsTWF0aC5hYnMocGFyc2VGbG9hdCh0b2xlcmFuY2UsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQzMig1LE1hdGguYWJzKHBhcnNlSW50KHNldHRsZVRpbWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ub3RpZnlQb3NBcnJpdmFsLGJ1ZmZlcik7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDlhajjgabjga5QSUTjg5Hjg6njg6Hjg7zjgr/jgpLjg6rjgrvjg4Pjg4jjgZfjgabjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/oqK3lrprjgavmiLvjgZlcbiAgICAgKiBAZGVzYyBxQ3VycmVudFAsIHFDdXJyZW50SSwgIHFDdXJyZW50RCwgc3BlZWRQLCBzcGVlZEksIHNwZWVkRCwgcG9zaXRpb25QIOOCkuODquOCu+ODg+ODiOOBl+OBvuOBmVxuICAgICAqXG4gICAgICovXG4gICAgY21kUmVzZXRQSUQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0UElEKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zmuKzlrprlgKTjga7lj5blvpfplpPpmpToqK3lrppcbiAgICAgKiBAZGVzYyDmnInnt5rvvIhVU0IsIEkyQ++8ieOBruOBv+acieWKueOAgkJMReOBp+OBr+WbuuWumiAxMDBtcyDplpPpmpTjgafpgJrnn6XjgZXjgozjgovjgIJcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUx9IGNtZE1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbF9NT1RPUl9NRUFTX0lOVEVSVkFMIGVudW0g44Oi44O844K/44O85ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqUXG4gICAgICovXG4gICAgY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsKGNtZE1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbF9NT1RPUl9NRUFTX0lOVEVSVkFMPTQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KGNtZE1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbF9NT1RPUl9NRUFTX0lOVEVSVkFMLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWwsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zmuKzlrprlgKTjga7lj5blvpfoqK3lrppcbiAgICAgKiBAZGVzYyBpc0VuYWJsZWQgPSAxIOOBruWgtOWQiOOAge+8iOS9jee9ruODu+mAn+W6puODu+ODiOODq+OCr++8ieOBrumAmuefpeOCkuihjOOBhu+8iOi1t+WLleW+jOOAgWludGVyZmFjZSDjga7oqK3lrprjgaflhKrlhYjjgZXjgozjgovpgJrkv6HntYzot6/jgavjgIHoh6rli5XnmoTjgavpgJrnn6XjgYzplovlp4vjgZXjgozjgovvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaXNFbmFibGVkIDA6RGlzYmxlZCwgMTpFbmFibGVkXG4gICAgICovXG4gICAgY21kTW90b3JNZWFzdXJlbWVudEJ5RGVmYXVsdChpc0VuYWJsZWQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLGlzRW5hYmxlZD8xOjApO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW90b3JNZWFzdXJlbWVudEJ5RGVmYXVsdCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOWItuW+oeaJi+aute+8iOOCpOODs+OCv+ODvOODleOCp+OCpOOCue+8ieOBruioreWumlxuICAgICAqIEBkZXNjIHVpbnQ4X3QgZmxhZ3Mg44OT44OD44OI44Gr44KI44KK44CB5ZCr44G+44KM44KL44OR44Op44Oh44O844K/44KS5oyH5a6a44GZ44KL77yI77yR44Gu5aC05ZCI5ZCr44KA44O7MOOBruWgtOWQiOWQq+OBvuOBquOBhO+8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaXRGbGdcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBiaXQ3ICAgIGJpdDYgICAgYml0NSAgICBiaXQ0ICAgIGJpdDMgICAgYml0MiAgICBiaXQxICAgIGJpdDBcbiAgICAgKiDniannkIYgICAgICAgICAgICAgICAgICAgICDmnInnt5ogICAgIOaciee3miAgICAgICAgICAgICAgICAgICAgICDnhKHnt5pcbiAgICAgKiDjg5zjgr/jg7MgICAg77yKICAgICAg77yKICAgICAgSTJDICAgICBVU0IgICAgICAg77yKICAgICAg77yKICAgICBCTEVcbiAgICAgKiDjg4fjg5Xjgqnjg6vjg4hcdCAgICAgICAgICAgICDjg4fjg5Xjgqnjg6vjg4ggIOODh+ODleOCqeODq+ODiCAgICAgICAgICAgICAg44OH44OV44Kp44Or44OIXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICovXG4gICAgY21kSW50ZXJmYWNlKGJpdEZsZyl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQoYml0RmxnLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5pbnRlcmZhY2UsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgrPjg57jg7Pjg4njgpLlj5fkv6HjgZfjgZ/jgajjgY3jgavmiJDlip/pgJrnn6XvvIhlcnJvckNvZGUgPSAw77yJ44KS44GZ44KL44GL44Gp44GG44GLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGlzRW5hYmxlZCAwOumAmuefpeOBl+OBquOBhCwgMTrpgJrnn6XjgZnjgotcbiAgICAgKi9cbiAgICBjbWRSZXNwb25zZShpc0VuYWJsZWQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLGlzRW5hYmxlZD8xOjApO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzcG9uc2UsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7otbfli5XmmYLlm7rmnIlMRUTjgqvjg6njg7zjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVkIGludCAwLTI1NVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBncmVlbiBpbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmx1ZSBpbnQgMC0yNTVcbiAgICAgKlxuICAgICAqIEBkZXNjIG93bkNvbG9yIOOBr+OCouOCpOODieODq+aZguOBruWbuuaciUxFROOCq+ODqeODvOOAgjxicj5zYXZlQWxsU2V0dGluZ3PjgpLlrp/ooYzjgZfjgIHlho3otbfli5XlvozjgavliJ3jgoHjgablj43mmKDjgZXjgozjgovjgII8YnI+XG4gICAgICog44GT44Gu6Kit5a6a5YCk44KS5aSJ5pu044GX44Gf5aC05ZCI44CBQkxF44GuIERldmljZSBOYW1lIOOBruS4izPmoYHjgYzlpInmm7TjgZXjgozjgovjgIJcbiAgICAgKi9cbiAgICBjbWRPd25Db2xvcihyZWQsZ3JlZW4sYmx1ZSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMyk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsTWF0aC5hYnMocGFyc2VJbnQocmVkLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgxLE1hdGguYWJzKHBhcnNlSW50KGdyZWVuLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgyLE1hdGguYWJzKHBhcnNlSW50KGJsdWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5vd25Db2xvcixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IO+8lui7uOOCu+ODs+OCteODvO+8iOWKoOmAn+W6puODu+OCuOODo+OCpOODre+8iea4rOWumuWApOOBruWPluW+l+mWk+malFxuICAgICAqIEBkZXNjIOaciee3mu+8iFVTQiwgSTJD77yJ44Gu44G/5pyJ5Yq544CCQkxF44Gn44Gv5Zu65a6aIDEwMG1zIOmWk+malOOBp+mAmuefpeOBleOCjOOCi+OAglxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRJTVVNZWFzdXJlbWVudEludGVydmFsX0lNVV9NRUFTX0lOVEVSVkFMfSBjbWRJTVVNZWFzdXJlbWVudEludGVydmFsX0lNVV9NRUFTX0lOVEVSVkFMIGVudW0g5Yqg6YCf5bqm44O744K444Oj44Kk44Ot5ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqUXG4gICAgICovXG4gICAgY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbChjbWRJTVVNZWFzdXJlbWVudEludGVydmFsX0lNVV9NRUFTX0lOVEVSVkFMPTQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUwsMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmlNVU1lYXN1cmVtZW50SW50ZXJ2YWwsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDvvJbou7jjgrvjg7PjgrXjg7zvvIjliqDpgJ/luqbjg7vjgrjjg6PjgqTjg63vvInjga7lgKTjga7pgJrnn6XjgpLjg4fjg5Xjgqnjg6vjg4jjgafplovlp4vjgZnjgotcbiAgICAgKiBAZGVzYyBpc0VuYWJsZWQgPSB0cnVlIOOBruWgtOWQiOOAgWVuYWJsZUlNVSgpIOOCkumAgeS/oeOBl+OBquOBj+OBpuOCgui1t+WLleaZguOBq+iHquWLleOBp+mAmuefpeOBjOmWi+Wni+OBleOCjOOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpc0VuYWJsZWQgMDpEaXNibGVkLCAxOkVuYWJsZWRcbiAgICAgKi9cbiAgICBjbWRJTVVNZWFzdXJlbWVudEJ5RGVmYXVsdChpc0VuYWJsZWQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KGlzRW5hYmxlZCwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuaU1VTWVhc3VyZW1lbnRCeURlZmF1bHQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjgZfjgZ/oqK3lrprlgKTjgpLlj5blvpdcbiAgICAgKiBAcGFyYW0ge251bWJlciB8IGFycmF5fSByZWdpc3RlcnMgPGludCB8IFtdPiDlj5blvpfjgZnjgovjg5fjg63jg5Hjg4bjgqPjga7jgrPjg57jg7Pjg4ko44Os44K444K544K/55Wq5Y+3KeWApFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlLjxpbnQgfCBhcnJheT59IOWPluW+l+OBl+OBn+WApCA8YnI+cmVnaXN0ZXJz44GMaW50PeODrOOCuOOCueOCv+WApOOBruODl+ODquODn+ODhuOCo+ODluWApCA8YnI+cmVnaXN0ZXJz44GMQXJyYXk944Os44K444K544K/5YCk44Gu44Kq44OW44K444Kn44Kv44OIXG4gICAgICpcbiAgICAgKiBAbm9uZSDlj5blvpfjgZnjgovlgKTjga/jgrPjg57jg7Pjg4nlrp/ooYzlvozjgatCTEXjga7jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrlNT1RPUl9TRVRUSU5H44Gr6YCa55+l44GV44KM44KL44CCPGJyPlxuICAgICAqICAgICAgIOOBneOCjOOCkuaLvuOBo+OBpnByb21pc2Xjgqrjg5bjgrjjgqfjgq/jg4jjga7jga5yZXNvbHZl44Gr6L+U44GX44Gm5Yem55CG44KS57mL44GQPGJyPlxuICAgICAqICAgICAgIE1PVE9SX1NFVFRJTkfjga5ub3RpZnnjga9fb25CbGVNb3RvclNldHRpbmfjgaflj5blvpdcbiAgICAgKi9cblxuICAgIGNtZFJlYWRSZWdpc3RlcihyZWdpc3RlcnMpe1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KHJlZ2lzdGVycykpe1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChhbGxyZXNvbHZlLCBhbGxyZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwcm9taXNlTGlzdD1bXTtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPHJlZ2lzdGVycy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlZ2lzdGVyPXBhcnNlSW50KHJlZ2lzdGVyc1tpXSwxMCk7XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VMaXN0LnB1c2goIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNjcD1uZXcgX0tNTm90aWZ5UHJvbWlzKHJlZ2lzdGVyLHRoaXMuX1JFVl9NT1RPUl9DT01NQU5EW3JlZ2lzdGVyXSx0aGlzLl9ub3RpZnlQcm9taXNMaXN0LHJlc29sdmUscmVqZWN0LDUwMDApOy8vbm90aWZ557WM55Sx44GucmVzdWx044KSUHJvbWlz44Go57SQ5LuY44GRXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCwgcmVnaXN0ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWRSZWdpc3RlciwgYnVmZmVyLGNjcCk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZUxpc3QpLnRoZW4oKHJlc2FyKT0+e1xuICAgICAgICAgICAgICAgICAgICBsZXQgdD1be31dLmNvbmNhdChyZXNhcik7XG4gICAgICAgICAgICAgICAgICAgIGxldCBydG9iaj1PYmplY3QuYXNzaWduLmFwcGx5KG51bGwsdCk7XG4gICAgICAgICAgICAgICAgICAgIGFsbHJlc29sdmUocnRvYmopO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChtc2cpPT57XG4gICAgICAgICAgICAgICAgICAgIGFsbHJlamVjdChtc2cpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChsYXN0cmVzb2x2ZSwgbGFzdHJlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlZ2lzdGVyPXBhcnNlSW50KHJlZ2lzdGVycywxMCk7XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjY3A9bmV3IF9LTU5vdGlmeVByb21pcyhyZWdpc3Rlcix0aGlzLl9SRVZfTU9UT1JfQ09NTUFORFtyZWdpc3Rlcl0sdGhpcy5fbm90aWZ5UHJvbWlzTGlzdCxyZXNvbHZlLHJlamVjdCwxMDAwKTsvL25vdGlmeee1jOeUseOBrnJlc3VsdOOCklByb21pc+OBqOe0kOS7mOOBkVxuICAgICAgICAgICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICAgICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHJlZ2lzdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWRSZWdpc3RlciwgYnVmZmVyLGNjcCk7XG4gICAgICAgICAgICAgICAgfSkudGhlbigocmVzKT0+e1xuICAgICAgICAgICAgICAgICAgICBsYXN0cmVzb2x2ZShyZXNbT2JqZWN0LmtleXMocmVzKVswXV0pO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChtc2cpPT57XG4gICAgICAgICAgICAgICAgICAgIGxhc3RyZWplY3QobXNnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Gu5YWo44Gm44Gu44Os44K444K544K/5YCk44Gu5Y+W5b6XXG4gICAgICogQHJldHVybnMge1Byb21pc2UuPGFycmF5Pn1cbiAgICAgKi9cbiAgICBjbWRSZWFkQWxsUmVnaXN0ZXIoKXtcbiAgICAgICBsZXQgY209IHRoaXMuY29uc3RydWN0b3IuY21kUmVhZFJlZ2lzdGVyX0NPTU1BTkQ7XG4gICAgICAgIGxldCBhbGxjbWRzPVtdO1xuICAgICAgICBPYmplY3Qua2V5cyhjbSkuZm9yRWFjaCgoayk9PnthbGxjbWRzLnB1c2goY21ba10pO30pO1xuXG4gICAgICAgcmV0dXJuIHRoaXMuY21kUmVhZFJlZ2lzdGVyKGFsbGNtZHMpO1xuICAgIH1cbiAgICAvLy8vLy/kv53lrZhcbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDlhajjgabjga7oqK3lrprlgKTjgpLjg5Xjg6njg4Pjgrfjg6Xjg6Hjg6Ljg6rjgavkv53lrZjjgZnjgotcbiAgICAgKiBAZGVzYyDmnKzjgrPjg57jg7Pjg4njgpLlrp/ooYzjgZfjgarjgYTpmZDjgorjgIHoqK3lrprlgKTjga/jg6Ljg7zjgr/jg7zjgavmsLjkuYXnmoTjgavkv53lrZjjgZXjgozjgarjgYQo5YaN6LW35YuV44Gn5raI44GI44KLKVxuICAgICAqL1xuICAgIGNtZFNhdmVBbGxSZWdpc3RlcnMoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNhdmVBbGxSZWdpc3RlcnMpO1xuICAgIH1cblxuICAgIC8vLy8vL+ODquOCu+ODg+ODiFxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOaMh+WumuOBl+OBn+ODrOOCuOOCueOCv+OCkuODleOCoeODvOODoOOCpuOCp+OCouOBruWIneacn+WApOOBq+ODquOCu+ODg+ODiOOBmeOCi1xuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRSZWFkUmVnaXN0ZXJfQ09NTUFORH0gcmVnaXN0ZXIg5Yid5pyf5YCk44Gr44Oq44K744OD44OI44GZ44KL44Kz44Oe44Oz44OJKOODrOOCuOOCueOCvynlgKRcbiAgICAgKi9cbiAgICBjbWRSZXNldFJlZ2lzdGVyKHJlZ2lzdGVyKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxwYXJzZUludChyZWdpc3RlciwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzZXRSZWdpc3RlcixidWZmZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDlhajjgabjga7jg6zjgrjjgrnjgr/jgpLjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICAgKiBAZGVzYyBibGVTYXZlQWxsUmVnaXN0ZXJz44KS5a6f6KGM44GX44Gq44GE6ZmQ44KK44CB44Oq44K744OD44OI5YCk44Gv44Oi44O844K/44O844Gr5rC45LmF55qE44Gr5L+d5a2Y44GV44KM44Gq44GEKOWGjei1t+WLleOBp+a2iOOBiOOCiylcbiAgICAgKi9cbiAgICBjbWRSZXNldEFsbFJlZ2lzdGVycygpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzZXRBbGxSZWdpc3RlcnMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg4fjg5DjgqTjgrnjg43jg7zjg6Djga7lj5blvpdcbiAgICAgKiBAZGVzYyDjg4fjg5DjgqTjgrnjg43jg7zjg6DjgpLoqq3jgb/lj5bjgotcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxpbnR8QXJyYXk+fVxuICAgICAqL1xuICAgIGNtZFJlYWREZXZpY2VOYW1lKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZFJlYWRSZWdpc3Rlcih0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWREZXZpY2VOYW1lKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg4fjg5DjgqTjgrnmg4XloLHjga7lj5blvpdcbiAgICAgKiBAZGVzYyDjg4fjg5DjgqTjgrnjgqTjg7Pjg5Xjgqnjg6Hjg7zjgrfjg6fjg7PjgpLoqq3jgb/lj5bjgotcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxhbnk+fVxuICAgICAqL1xuICAgIGNtZFJlYWREZXZpY2VJbmZvKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZFJlYWRSZWdpc3Rlcih0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWREZXZpY2VJbmZvKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBJMkPjgrnjg6zjg7zjg5bjgqLjg4njg6zjgrlcbiAgICAgKiBAZGVzYyBJMkPjgYvjgonliLblvqHjgZnjgovloLTlkIjjga7jgrnjg6zjg7zjg5bjgqLjg4njg6zjgrnvvIgweDAwLTB4RkbvvInjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWRkcmVzcyDjgqLjg4njg6zjgrlcbiAgICAgKi9cbiAgICBjbWRTZXRJMkNTbGF2ZUFkZHJlc3MoYWRkcmVzcyl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQoYWRkcmVzcywxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc2V0STJDU2xhdmVBZGRyZXNzLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5YaF6YOoXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIF9pc0luc3RhbmNPZlByb21pc2UoYW55KXtcbiAgICAgICAgcmV0dXJuIG9iaiBpbnN0YW5jZW9mIFByb21pc2UgfHwgKG9iaiAmJiB0eXBlb2Ygb2JqLnRoZW4gPT09ICdmdW5jdGlvbicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOS7luOBruenu+WLleezu+OBruOCs+ODnuODs+ODieOCkuWun+ihjOaZguOAgeaXouOBq+enu+WLleezu+OBrlN5bmPjgrPjg57jg7Pjg4njgYzlrp/ooYzjgZXjgozjgabjgYTjgovloLTlkIjjga/jgZ3jga5DQuOCklJlamVjdOOBmeOCi1xuICAgICAqIOenu+WLleezu+OBrlN5bmPjgrPjg57jg7Pjg4nvvIhjbWRNb3ZlQnlEaXN0YW5jZVN5bmPjgIFjbWRNb3ZlVG9Qb3NpdGlvblN5bmPvvInnrYlcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9tb3ZlU3luY0luc3RydWN0aW9uT3ZlcnJpZGVSZWplY3QoY2lkKXtcbiAgICAgICAgaWYodGhpcy5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uKXtcbiAgICAgICAgICAgIHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi5jYWxsUmVqZWN0KHtpZDp0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24udGFnTmFtZSxtc2c6J0luc3RydWN0aW9uIG92ZXJyaWRlJyxvdmVycmlkZUlkOmNpZH0pO1xuICAgICAgICAgICAgdGhpcy5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uPW51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cblxuLy8vLy8vY2xhc3MvL1xufVxuXG5cbi8qKlxuICogU2VuZEJsZU5vdGlmeVByb21pc1xuICog44CAY21kUmVhZFJlZ2lzdGVy562J44GuQkxF5ZG844Gz5Ye644GX5b6M44GrXG4gKiDjgIDjgrPjg57jg7Pjg4nntZDmnpzjgYxub3RpZnnjgafpgJrnn6XjgZXjgozjgovjgrPjg57jg7Pjg4njgpJQcm9taXPjgajntJDku5jjgZHjgovngrrjga7jgq/jg6njgrlcbiAqIEBwcml2YXRlXG4gKi9cbmNsYXNzIF9LTU5vdGlmeVByb21pc3tcbiAgICAvL+aIkOWKn+mAmuefpVxuICAgIHN0YXRpYyBzZW5kR3JvdXBOb3RpZnlSZXNvbHZlKGdyb3VwQXJyYXksdGFnTmFtZSx2YWwpe1xuICAgICAgICBpZighQXJyYXkuaXNBcnJheShncm91cEFycmF5KSl7cmV0dXJuO31cbiAgICAgICAgLy/pgIHkv6FJROOBrumAmuefpSBDYWxsYmFja1Byb21pc+OBp+WRvOOBs+WHuuOBl+WFg+OBruODoeOCveODg+ODieOBrlByb21pc+OBq+i/lOOBmVxuICAgICAgICBmb3IobGV0IGk9MDsgaTxncm91cEFycmF5Lmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgIGlmKCBncm91cEFycmF5W2ldLnRhZ05hbWU9PT10YWdOYW1lICl7XG4gICAgICAgICAgICAgICAgZ3JvdXBBcnJheVtpXS5jYWxsUmVzb2x2ZSh2YWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNvbnN0XG4gICAgICogQHBhcmFtIHRhZ05hbWVcbiAgICAgKiBAcGFyYW0gZ3JvdXBBcnJheVxuICAgICAqIEBwYXJhbSBwcm9taXNSZXNvbHZlT2JqXG4gICAgICogQHBhcmFtIHByb21pc1JlamVjdE9ialxuICAgICAqIEBwYXJhbSByZWplY3RUaW1lT3V0XG4gICAgICovXG4gICAgY29uc3RydWN0b3IodGFnTmFtZSx0YWdJbmZvPW51bGwsZ3JvdXBBcnJheT1bXSxwcm9taXNSZXNvbHZlT2JqLCBwcm9taXNSZWplY3RPYmoscmVqZWN0VGltZU91dCl7XG4gICAgICAgIHRoaXMudGltZW91dElkPTA7XG4gICAgICAgIHRoaXMudGFnTmFtZT10YWdOYW1lO1xuICAgICAgICB0aGlzLnRhZ0luZm89dGFnSW5mbztcbiAgICAgICAgdGhpcy5ncm91cEFycmF5PUFycmF5LmlzQXJyYXkoZ3JvdXBBcnJheSk/Z3JvdXBBcnJheTpbXTtcbiAgICAgICAgdGhpcy5ncm91cEFycmF5LnB1c2godGhpcyk7XG4gICAgICAgIHRoaXMucHJvbWlzUmVzb2x2ZU9iaj1wcm9taXNSZXNvbHZlT2JqO1xuICAgICAgICB0aGlzLnByb21pc1JlamVjdE9iaj1wcm9taXNSZWplY3RPYmo7XG4gICAgICAgIHRoaXMucmVqZWN0VGltZU91dD1yZWplY3RUaW1lT3V0O1xuICAgIH1cbiAgICAvL+OCq+OCpuODs+ODiOOBrumWi+WniyBjaGFyYWN0ZXJpc3RpY3Mud3JpdGVWYWx1ZeWRvOOBs+WHuuOBl+W+jOOBq+Wun+ihjFxuICAgIHN0YXJ0UmVqZWN0VGltZU91dENvdW50KCl7XG4gICAgICAgIHRoaXMudGltZW91dElkPXNldFRpbWVvdXQoKCk9PntcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUdyb3VwKCk7XG4gICAgICAgICAgICB0aGlzLnByb21pc1JlamVjdE9iaih7bXNnOlwidGltZW91dDpcIix0YWdOYW1lOnRoaXMudGFnTmFtZSx0YWdJbmZvOnRoaXMudGFnSW5mb30pO1xuICAgICAgICB9LCB0aGlzLnJlamVjdFRpbWVPdXQpO1xuICAgIH1cbiAgICBjYWxsUmVzb2x2ZShhcmcpe1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xuICAgICAgICB0aGlzLl9yZW1vdmVHcm91cCgpO1xuICAgICAgICB0aGlzLnByb21pc1Jlc29sdmVPYmooYXJnKTtcbiAgICB9XG4gICAgY2FsbFJlamVjdChtc2cpe1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xuICAgICAgICB0aGlzLl9yZW1vdmVHcm91cCgpO1xuICAgICAgICB0aGlzLnByb21pc1JlamVjdE9iaih7bXNnOm1zZ30pO1xuICAgIH1cblxuICAgIF9yZW1vdmVHcm91cCgpe1xuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLmdyb3VwQXJyYXkubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYoIHRoaXMuZ3JvdXBBcnJheVtpXT09PXRoaXMpe1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBBcnJheS5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9S01Nb3RvckNvbW1hbmRLTU9uZTtcblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvS01Nb3RvckNvbW1hbmRLTU9uZS5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSID0gdHlwZW9mIFJlZmxlY3QgPT09ICdvYmplY3QnID8gUmVmbGVjdCA6IG51bGxcbnZhciBSZWZsZWN0QXBwbHkgPSBSICYmIHR5cGVvZiBSLmFwcGx5ID09PSAnZnVuY3Rpb24nXG4gID8gUi5hcHBseVxuICA6IGZ1bmN0aW9uIFJlZmxlY3RBcHBseSh0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKSB7XG4gICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5jYWxsKHRhcmdldCwgcmVjZWl2ZXIsIGFyZ3MpO1xuICB9XG5cbnZhciBSZWZsZWN0T3duS2V5c1xuaWYgKFIgJiYgdHlwZW9mIFIub3duS2V5cyA9PT0gJ2Z1bmN0aW9uJykge1xuICBSZWZsZWN0T3duS2V5cyA9IFIub3duS2V5c1xufSBlbHNlIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gIFJlZmxlY3RPd25LZXlzID0gZnVuY3Rpb24gUmVmbGVjdE93bktleXModGFyZ2V0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldClcbiAgICAgIC5jb25jYXQoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyh0YXJnZXQpKTtcbiAgfTtcbn0gZWxzZSB7XG4gIFJlZmxlY3RPd25LZXlzID0gZnVuY3Rpb24gUmVmbGVjdE93bktleXModGFyZ2V0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRhcmdldCk7XG4gIH07XG59XG5cbmZ1bmN0aW9uIFByb2Nlc3NFbWl0V2FybmluZyh3YXJuaW5nKSB7XG4gIGlmIChjb25zb2xlICYmIGNvbnNvbGUud2FybikgY29uc29sZS53YXJuKHdhcm5pbmcpO1xufVxuXG52YXIgTnVtYmVySXNOYU4gPSBOdW1iZXIuaXNOYU4gfHwgZnVuY3Rpb24gTnVtYmVySXNOYU4odmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICE9PSB2YWx1ZTtcbn1cblxuZnVuY3Rpb24gRXZlbnRFbWl0dGVyKCkge1xuICBFdmVudEVtaXR0ZXIuaW5pdC5jYWxsKHRoaXMpO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzQ291bnQgPSAwO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG52YXIgZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLCAnZGVmYXVsdE1heExpc3RlbmVycycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGVmYXVsdE1heExpc3RlbmVycztcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicgfHwgYXJnIDwgMCB8fCBOdW1iZXJJc05hTihhcmcpKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIG9mIFwiZGVmYXVsdE1heExpc3RlbmVyc1wiIGlzIG91dCBvZiByYW5nZS4gSXQgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXIuIFJlY2VpdmVkICcgKyBhcmcgKyAnLicpO1xuICAgIH1cbiAgICBkZWZhdWx0TWF4TGlzdGVuZXJzID0gYXJnO1xuICB9XG59KTtcblxuRXZlbnRFbWl0dGVyLmluaXQgPSBmdW5jdGlvbigpIHtcblxuICBpZiAodGhpcy5fZXZlbnRzID09PSB1bmRlZmluZWQgfHxcbiAgICAgIHRoaXMuX2V2ZW50cyA9PT0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpLl9ldmVudHMpIHtcbiAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgfVxuXG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59O1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMobikge1xuICBpZiAodHlwZW9mIG4gIT09ICdudW1iZXInIHx8IG4gPCAwIHx8IE51bWJlcklzTmFOKG4pKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcIm5cIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnICsgbiArICcuJyk7XG4gIH1cbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiAkZ2V0TWF4TGlzdGVuZXJzKHRoYXQpIHtcbiAgaWYgKHRoYXQuX21heExpc3RlbmVycyA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgcmV0dXJuIHRoYXQuX21heExpc3RlbmVycztcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5nZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBnZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiAkZ2V0TWF4TGlzdGVuZXJzKHRoaXMpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlKSB7XG4gIHZhciBhcmdzID0gW107XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgdmFyIGRvRXJyb3IgPSAodHlwZSA9PT0gJ2Vycm9yJyk7XG5cbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKVxuICAgIGRvRXJyb3IgPSAoZG9FcnJvciAmJiBldmVudHMuZXJyb3IgPT09IHVuZGVmaW5lZCk7XG4gIGVsc2UgaWYgKCFkb0Vycm9yKVxuICAgIHJldHVybiBmYWxzZTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmIChkb0Vycm9yKSB7XG4gICAgdmFyIGVyO1xuICAgIGlmIChhcmdzLmxlbmd0aCA+IDApXG4gICAgICBlciA9IGFyZ3NbMF07XG4gICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIC8vIE5vdGU6IFRoZSBjb21tZW50cyBvbiB0aGUgYHRocm93YCBsaW5lcyBhcmUgaW50ZW50aW9uYWwsIHRoZXkgc2hvd1xuICAgICAgLy8gdXAgaW4gTm9kZSdzIG91dHB1dCBpZiB0aGlzIHJlc3VsdHMgaW4gYW4gdW5oYW5kbGVkIGV4Y2VwdGlvbi5cbiAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgIH1cbiAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5oYW5kbGVkIGVycm9yLicgKyAoZXIgPyAnICgnICsgZXIubWVzc2FnZSArICcpJyA6ICcnKSk7XG4gICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICB0aHJvdyBlcnI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gIH1cblxuICB2YXIgaGFuZGxlciA9IGV2ZW50c1t0eXBlXTtcblxuICBpZiAoaGFuZGxlciA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBSZWZsZWN0QXBwbHkoaGFuZGxlciwgdGhpcywgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbiA9IGhhbmRsZXIubGVuZ3RoO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBhcnJheUNsb25lKGhhbmRsZXIsIGxlbik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSlcbiAgICAgIFJlZmxlY3RBcHBseShsaXN0ZW5lcnNbaV0sIHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5mdW5jdGlvbiBfYWRkTGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgcHJlcGVuZCkge1xuICB2YXIgbTtcbiAgdmFyIGV2ZW50cztcbiAgdmFyIGV4aXN0aW5nO1xuXG4gIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJsaXN0ZW5lclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBGdW5jdGlvbi4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIGxpc3RlbmVyKTtcbiAgfVxuXG4gIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdGFyZ2V0Ll9ldmVudHNDb3VudCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gICAgaWYgKGV2ZW50cy5uZXdMaXN0ZW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0YXJnZXQuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgPyBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICAgICAgLy8gUmUtYXNzaWduIGBldmVudHNgIGJlY2F1c2UgYSBuZXdMaXN0ZW5lciBoYW5kbGVyIGNvdWxkIGhhdmUgY2F1c2VkIHRoZVxuICAgICAgLy8gdGhpcy5fZXZlbnRzIHRvIGJlIGFzc2lnbmVkIHRvIGEgbmV3IG9iamVjdFxuICAgICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG4gICAgfVxuICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgaWYgKGV4aXN0aW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICAgICsrdGFyZ2V0Ll9ldmVudHNDb3VudDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIGV4aXN0aW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdID1cbiAgICAgICAgcHJlcGVuZCA/IFtsaXN0ZW5lciwgZXhpc3RpbmddIDogW2V4aXN0aW5nLCBsaXN0ZW5lcl07XG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgfSBlbHNlIGlmIChwcmVwZW5kKSB7XG4gICAgICBleGlzdGluZy51bnNoaWZ0KGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhpc3RpbmcucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgICBtID0gJGdldE1heExpc3RlbmVycyh0YXJnZXQpO1xuICAgIGlmIChtID4gMCAmJiBleGlzdGluZy5sZW5ndGggPiBtICYmICFleGlzdGluZy53YXJuZWQpIHtcbiAgICAgIGV4aXN0aW5nLndhcm5lZCA9IHRydWU7XG4gICAgICAvLyBObyBlcnJvciBjb2RlIGZvciB0aGlzIHNpbmNlIGl0IGlzIGEgV2FybmluZ1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgICB2YXIgdyA9IG5ldyBFcnJvcignUG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSBsZWFrIGRldGVjdGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmcubGVuZ3RoICsgJyAnICsgU3RyaW5nKHR5cGUpICsgJyBsaXN0ZW5lcnMgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdhZGRlZC4gVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdpbmNyZWFzZSBsaW1pdCcpO1xuICAgICAgdy5uYW1lID0gJ01heExpc3RlbmVyc0V4Y2VlZGVkV2FybmluZyc7XG4gICAgICB3LmVtaXR0ZXIgPSB0YXJnZXQ7XG4gICAgICB3LnR5cGUgPSB0eXBlO1xuICAgICAgdy5jb3VudCA9IGV4aXN0aW5nLmxlbmd0aDtcbiAgICAgIFByb2Nlc3NFbWl0V2FybmluZyh3KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucHJlcGVuZExpc3RlbmVyID1cbiAgICBmdW5jdGlvbiBwcmVwZW5kTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBfYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIHRydWUpO1xuICAgIH07XG5cbmZ1bmN0aW9uIG9uY2VXcmFwcGVyKCkge1xuICB2YXIgYXJncyA9IFtdO1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgYXJncy5wdXNoKGFyZ3VtZW50c1tpXSk7XG4gIGlmICghdGhpcy5maXJlZCkge1xuICAgIHRoaXMudGFyZ2V0LnJlbW92ZUxpc3RlbmVyKHRoaXMudHlwZSwgdGhpcy53cmFwRm4pO1xuICAgIHRoaXMuZmlyZWQgPSB0cnVlO1xuICAgIFJlZmxlY3RBcHBseSh0aGlzLmxpc3RlbmVyLCB0aGlzLnRhcmdldCwgYXJncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gX29uY2VXcmFwKHRhcmdldCwgdHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIHN0YXRlID0geyBmaXJlZDogZmFsc2UsIHdyYXBGbjogdW5kZWZpbmVkLCB0YXJnZXQ6IHRhcmdldCwgdHlwZTogdHlwZSwgbGlzdGVuZXI6IGxpc3RlbmVyIH07XG4gIHZhciB3cmFwcGVkID0gb25jZVdyYXBwZXIuYmluZChzdGF0ZSk7XG4gIHdyYXBwZWQubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgc3RhdGUud3JhcEZuID0gd3JhcHBlZDtcbiAgcmV0dXJuIHdyYXBwZWQ7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uIG9uY2UodHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImxpc3RlbmVyXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIEZ1bmN0aW9uLiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgbGlzdGVuZXIpO1xuICB9XG4gIHRoaXMub24odHlwZSwgX29uY2VXcmFwKHRoaXMsIHR5cGUsIGxpc3RlbmVyKSk7XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5wcmVwZW5kT25jZUxpc3RlbmVyID1cbiAgICBmdW5jdGlvbiBwcmVwZW5kT25jZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyKSB7XG4gICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImxpc3RlbmVyXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIEZ1bmN0aW9uLiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgbGlzdGVuZXIpO1xuICAgICAgfVxuICAgICAgdGhpcy5wcmVwZW5kTGlzdGVuZXIodHlwZSwgX29uY2VXcmFwKHRoaXMsIHR5cGUsIGxpc3RlbmVyKSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4vLyBFbWl0cyBhICdyZW1vdmVMaXN0ZW5lcicgZXZlbnQgaWYgYW5kIG9ubHkgaWYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHZhciBsaXN0LCBldmVudHMsIHBvc2l0aW9uLCBpLCBvcmlnaW5hbExpc3RlbmVyO1xuXG4gICAgICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImxpc3RlbmVyXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIEZ1bmN0aW9uLiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgbGlzdGVuZXIpO1xuICAgICAgfVxuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBsaXN0ID0gZXZlbnRzW3R5cGVdO1xuICAgICAgaWYgKGxpc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fCBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMClcbiAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdC5saXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxpc3QgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcG9zaXRpb24gPSAtMTtcblxuICAgICAgICBmb3IgKGkgPSBsaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8IGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICBvcmlnaW5hbExpc3RlbmVyID0gbGlzdFtpXS5saXN0ZW5lcjtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSAwKVxuICAgICAgICAgIGxpc3Quc2hpZnQoKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgc3BsaWNlT25lKGxpc3QsIHBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICBldmVudHNbdHlwZV0gPSBsaXN0WzBdO1xuXG4gICAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgb3JpZ2luYWxMaXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuICAgIGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyh0eXBlKSB7XG4gICAgICB2YXIgbGlzdGVuZXJzLCBldmVudHMsIGk7XG5cbiAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50c1t0eXBlXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhldmVudHMpO1xuICAgICAgICB2YXIga2V5O1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXJzID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgICBpZiAodHlwZW9mIGxpc3RlbmVycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gICAgICB9IGVsc2UgaWYgKGxpc3RlbmVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIExJRk8gb3JkZXJcbiAgICAgICAgZm9yIChpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbmZ1bmN0aW9uIF9saXN0ZW5lcnModGFyZ2V0LCB0eXBlLCB1bndyYXApIHtcbiAgdmFyIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuXG4gIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gW107XG5cbiAgdmFyIGV2bGlzdGVuZXIgPSBldmVudHNbdHlwZV07XG4gIGlmIChldmxpc3RlbmVyID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIFtdO1xuXG4gIGlmICh0eXBlb2YgZXZsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4gdW53cmFwID8gW2V2bGlzdGVuZXIubGlzdGVuZXIgfHwgZXZsaXN0ZW5lcl0gOiBbZXZsaXN0ZW5lcl07XG5cbiAgcmV0dXJuIHVud3JhcCA/XG4gICAgdW53cmFwTGlzdGVuZXJzKGV2bGlzdGVuZXIpIDogYXJyYXlDbG9uZShldmxpc3RlbmVyLCBldmxpc3RlbmVyLmxlbmd0aCk7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKHR5cGUpIHtcbiAgcmV0dXJuIF9saXN0ZW5lcnModGhpcywgdHlwZSwgdHJ1ZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJhd0xpc3RlbmVycyA9IGZ1bmN0aW9uIHJhd0xpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIGZhbHNlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIubGlzdGVuZXJDb3VudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGxpc3RlbmVyQ291bnQuY2FsbChlbWl0dGVyLCB0eXBlKTtcbiAgfVxufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gbGlzdGVuZXJDb3VudDtcbmZ1bmN0aW9uIGxpc3RlbmVyQ291bnQodHlwZSkge1xuICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuXG4gIGlmIChldmVudHMgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKHR5cGVvZiBldmxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2UgaWYgKGV2bGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAwO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICByZXR1cm4gdGhpcy5fZXZlbnRzQ291bnQgPiAwID8gUmVmbGVjdE93bktleXModGhpcy5fZXZlbnRzKSA6IFtdO1xufTtcblxuZnVuY3Rpb24gYXJyYXlDbG9uZShhcnIsIG4pIHtcbiAgdmFyIGNvcHkgPSBuZXcgQXJyYXkobik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgKytpKVxuICAgIGNvcHlbaV0gPSBhcnJbaV07XG4gIHJldHVybiBjb3B5O1xufVxuXG5mdW5jdGlvbiBzcGxpY2VPbmUobGlzdCwgaW5kZXgpIHtcbiAgZm9yICg7IGluZGV4ICsgMSA8IGxpc3QubGVuZ3RoOyBpbmRleCsrKVxuICAgIGxpc3RbaW5kZXhdID0gbGlzdFtpbmRleCArIDFdO1xuICBsaXN0LnBvcCgpO1xufVxuXG5mdW5jdGlvbiB1bndyYXBMaXN0ZW5lcnMoYXJyKSB7XG4gIHZhciByZXQgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmV0Lmxlbmd0aDsgKytpKSB7XG4gICAgcmV0W2ldID0gYXJyW2ldLmxpc3RlbmVyIHx8IGFycltpXTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSJdLCJzb3VyY2VSb290IjoiIn0=