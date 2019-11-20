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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNjI5MTQyNzAyOTFkZmViYjIyMzEiLCJ3ZWJwYWNrOi8vLy4vbGliL0tNU3RydWN0dXJlcy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01VdGwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0tNQ29tV2ViQkxFLmpzIiwid2VicGFjazovLy8uL2xpYi9LTUNvbm5lY3RvckJyb3dzZXJXUEsuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01Nb3Rvck9uZVdlYkJMRS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01Db21CYXNlLmpzIiwid2VicGFjazovLy8uL2xpYi9LTU1vdG9yQ29tbWFuZEtNT25lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EsS0FBSztRQUNMO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7O1FBRUE7UUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhO0FBQ2IsWUFBWSxtQkFBTyxDQUFDLENBQVM7OztBQUc3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIs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OztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUscUNBQXFDO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSw0Q0FBNEM7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBLGlDQUFpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLE9BQU87QUFDdkIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxvRUFBb0U7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLGdFQUFnRTtBQUMvRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FB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QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLGlCQUFpQjtBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLHNDQUFzQyxRQUFRO0FBQzlDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxRQUFRLHlCQUF5QjtBQUNqQztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixnQkFBZ0I7QUFDakM7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZXhhbXBsZXMvYnJvd3Nlcl93ZWJibHVldG9vaC9saWJyYXJ5L0tNQ29ubmVjdG9yQnJvd3Nlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwge1xuIFx0XHRcdFx0Y29uZmlndXJhYmxlOiBmYWxzZSxcbiBcdFx0XHRcdGVudW1lcmFibGU6IHRydWUsXG4gXHRcdFx0XHRnZXQ6IGdldHRlclxuIFx0XHRcdH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IDMpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIDYyOTE0MjcwMjkxZGZlYmIyMjMxIiwiLyoqKlxuICogS01TdHJ1Y3R1cmVzLmpzXG4gKiBDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4ndXNlIHN0cmljdCc7XG5sZXQgS01VdGwgPSByZXF1aXJlKCcuL0tNVXRsJyk7XG5cblxuLyoqXG4gKiBAY2xhc3NkZXNjIOani+mAoOS9k+OBruWfuuW6leOCr+ODqeOCuVxuICogQGlnbm9yZVxuICovXG5jbGFzcyBLTVN0cnVjdHVyZUJhc2V7XG4gICAgY29uc3RydWN0b3IoKXtcbiAgICB9XG4gICAgLyoqXG4gICAgICog5ZCM44GY5YCk44KS5oyB44Gk44GL44Gu5q+U6LyDXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHRhciDmr5TovIPjgZnjgovmp4vpgKDkvZNcbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0g57WQ5p6cXG4gICAgICovXG4gICAgRVEgKHRhcikge1xuICAgICAgICBpZighIHRhciApe3JldHVybiBmYWxzZTt9XG4gICAgICAgIGlmKHRoaXMuY29uc3RydWN0b3I9PT10YXIuY29uc3RydWN0b3Ipe1xuICAgICAgICAgICAgaWYodGhpcy5HZXRWYWxBcnJheSl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuR2V0VmFsQXJyYXkoKS50b1N0cmluZygpPT09dGFyLkdldFZhbEFycmF5KCkudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHRoaXMuR2V0VmFsT2JqKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkodGhpcy5HZXRWYWxPYmooKSk9PT1KU09OLnN0cmluZ2lmeSh0YXIuR2V0VmFsT2JqKCkpOy8vIGJhZDo66YGF44GEXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOikh+ijvVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9IOikh+ijveOBleOCjOOBn+ani+mAoOS9k1xuICAgICAqL1xuICAgIENsb25lICgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24obmV3IHRoaXMuY29uc3RydWN0b3IoKSx0aGlzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICog5YCk44Gu5Y+W5b6X77yIT2Jq77yJXG4gICAgICogQHJldHVybnMge29iamVjdH1cbiAgICAgKi9cbiAgICBHZXRWYWxPYmogKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSx0aGlzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlgKTjga7lj5blvpfvvIjphY3liJfvvIlcbiAgICAgKiBAcmV0dXJucyB7QXJyYXl9XG4gICAgICovXG4gICAgR2V0VmFsQXJyYXkgKCkge1xuICAgICAgICBsZXQgaz1PYmplY3Qua2V5cyh0aGlzKTtcbiAgICAgICAgbGV0IHI9W107XG4gICAgICAgIGZvcihsZXQgaT0wO2k8ay5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIHIucHVzaCh0aGlzW2tbaV1dKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDlgKTjga7kuIDmi6zoqK3lrprvvIhPYmrvvIlcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcHJvcHNPYmog6Kit5a6a44GZ44KL44OX44Ot44OR44OG44KjXG4gICAgICovXG4gICAgU2V0VmFsT2JqIChwcm9wc09iaikge1xuICAgICAgICBpZih0eXBlb2YgcHJvcHNPYmogIT09XCJvYmplY3RcIil7cmV0dXJuO31cbiAgICAgICAgbGV0IGtleXM9T2JqZWN0LmtleXMocHJvcHNPYmopO1xuICAgICAgICBmb3IobGV0IGs9MDtrPGtleXMubGVuZ3RoO2srKyl7XG4gICAgICAgICAgICBsZXQgcG49a2V5c1trXTtcbiAgICAgICAgICAgIGlmKHRoaXMuaGFzT3duUHJvcGVydHkocG4pKXtcbiAgICAgICAgICAgICAgICB0aGlzW3BuXT1wcm9wc09ialtwbl07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbn1cblxuXG4vKipcbiAqIEBjbGFzc2Rlc2MgWFnluqfmqJnjga7mp4vpgKDkvZPjgqrjg5bjgrjjgqfjgq/jg4hcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01WZWN0b3IyIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBleHRlbmRzIEtNU3RydWN0dXJlQmFzZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHlcbiAgICAgKlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yICh4PTAsIHk9MCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOebuOWvvuS9jee9ruOBuOenu+WLlVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkeFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkeVxuICAgICAqL1xuICAgIE1vdmUgKGR4ID0wLCBkeSA9IDApIHtcbiAgICAgICAgdGhpcy54ICs9IGR4O1xuICAgICAgICB0aGlzLnkgKz0gZHk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIDLngrnplpPjga7ot53pm6JcbiAgICAgKiBAcGFyYW0ge0tNVmVjdG9yMn0gdmVjdG9yMlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgRGlzdGFuY2UgKHZlY3RvcjIpIHtcbiAgICAgICAgaWYgKCEodmVjdG9yMiBpbnN0YW5jZW9mIEtNVmVjdG9yMikpIHtyZXR1cm47fVxuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KCh0aGlzLngtdmVjdG9yMi54KSwyKSArIE1hdGgucG93KCh0aGlzLnktdmVjdG9yMi55KSwyKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIDLngrnplpPjga7op5LluqZcbiAgICAgKiBAcGFyYW0ge0tNVmVjdG9yMn0gdmVjdG9yMlxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgUmFkaWFuICh2ZWN0b3IyKSB7XG4gICAgICAgIGlmICghKHZlY3RvcjIgaW5zdGFuY2VvZiBLTVZlY3RvcjIpKSB7cmV0dXJuO31cbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy55LXZlY3RvcjIueSx0aGlzLngtdmVjdG9yMi54KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMCww44GL44KJ44Gu6Led6ZuiXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBEaXN0YW5jZUZyb21aZXJvKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMueCwyKSArIE1hdGgucG93KHRoaXMueSwyKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIDAsMOOBi+OCieOBruinkuW6plxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHJhZGlhblxuICAgICAqL1xuICAgIFJhZGlhbkZyb21aZXJvKCkge1xuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnksdGhpcy54KTtcbiAgICB9XG59XG5cblxuXG4vKipcbiAqIEBjbGFzc2Rlc2Mg44K444Oj44Kk44Ot44K744Oz44K144O85YCkXG4gKi9cbmNsYXNzIEtNSW11U3RhdGUgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICogQGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFjY2VsWCDliqDpgJ/luqYoeCkgW8KxIDFdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFjY2VsWSDliqDpgJ/luqYoeSkgW8KxIDFdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFjY2VsWiDliqDpgJ/luqYoeikgW8KxIDFdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRlbXAg5rip5bqmIENcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZ3lyb1gg6KeS6YCf5bqmKHgpIFvCsSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBneXJvWSDop5LpgJ/luqYoeSkgW8KxIDFdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGd5cm9aIOinkumAn+W6pih6KSBbwrEgMV1cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoYWNjZWxYLCBhY2NlbFksIGFjY2VsWiwgdGVtcCwgZ3lyb1gsIGd5cm9ZLCBneXJvWiApIHtcbiAgICAgICAgc3VwZXIoKTtcblxuICAgICAgICB0aGlzLmFjY2VsWD0gS01VdGwudG9OdW1iZXIoYWNjZWxYKTtcbiAgICAgICAgdGhpcy5hY2NlbFk9IEtNVXRsLnRvTnVtYmVyKGFjY2VsWSk7XG4gICAgICAgIHRoaXMuYWNjZWxaPSBLTVV0bC50b051bWJlcihhY2NlbFopO1xuICAgICAgICB0aGlzLnRlbXA9IEtNVXRsLnRvTnVtYmVyKHRlbXApO1xuICAgICAgICB0aGlzLmd5cm9YPSBLTVV0bC50b051bWJlcihneXJvWCk7XG4gICAgICAgIHRoaXMuZ3lyb1k9IEtNVXRsLnRvTnVtYmVyKGd5cm9ZKTtcbiAgICAgICAgdGhpcy5neXJvWj0gS01VdGwudG9OdW1iZXIoZ3lyb1opO1xuICAgIH1cbn1cbi8qKlxuICogS0VJR0FO44Oi44O844K/44O8TEVE44CA54K554Gv44O76Imy54q25oWLXG4gKiBTdGF0ZSBNT1RPUl9MRURfU1RBVEVcbiAqIGNvbG9yUiAwLTI1NVxuICogY29sb3JHIDAtMjU1XG4gKiBjb2xvckIgMC0yNTVcbiAqICovXG4vKipcbiAqIEBjbGFzc2Rlc2Mg44Oi44O844K/44O8TEVE44CA54K554Gv44O76Imy54q25oWLXG4gKi9cbmNsYXNzIEtNTGVkU3RhdGUgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBrkxFROeKtuaFi1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX0xFRF9TVEFURV9PRkYgLSAwOkxFROa2iOeBr1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9MRURfU1RBVEVfT05fU09MSUQgLSAxOkxFROeCueeBr1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9MRURfU1RBVEVfT05fRkxBU0ggLSAyOkxFROeCuea7he+8iOS4gOWumumWk+malOOBp+eCuea7he+8iVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9MRURfU1RBVEVfT05fRElNIC0gMzpMRUTjgYzjgobjgaPjgY/jgorovJ3luqblpInljJbjgZnjgotcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE1PVE9SX0xFRF9TVEFURSgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PRkZcIjowLFxuICAgICAgICAgICAgXCJNT1RPUl9MRURfU1RBVEVfT05fU09MSURcIjoxLFxuICAgICAgICAgICAgXCJNT1RPUl9MRURfU1RBVEVfT05fRkxBU0hcIjoyLFxuICAgICAgICAgICAgXCJNT1RPUl9MRURfU1RBVEVfT05fRElNXCI6M1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2VcbiAgICAgKiBAcGFyYW0ge0tNTGVkU3RhdGUuTU9UT1JfTEVEX1NUQVRFfSBzdGF0ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb2xvclIgaW50IFswLTI1NV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY29sb3JHIGludCBbMC0yNTVdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbG9yQiBpbnQgWzAtMjU1XVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHN0YXRlLGNvbG9yUixjb2xvckcsY29sb3JCKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc3RhdGU9S01VdGwudG9OdW1iZXIoc3RhdGUpO1xuICAgICAgICB0aGlzLmNvbG9yUj1LTVV0bC50b051bWJlcihjb2xvclIpO1xuICAgICAgICB0aGlzLmNvbG9yRz1LTVV0bC50b051bWJlcihjb2xvckcpO1xuICAgICAgICB0aGlzLmNvbG9yQj1LTVV0bC50b051bWJlcihjb2xvckIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBAY2xhc3NkZXNjIOODouODvOOCv+ODvOWbnui7ouaDheWgsVxuICovXG5jbGFzcyBLTVJvdFN0YXRlIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiDmnIDlpKfjg4jjg6vjgq/lrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgTUFYX1RPUlFVRSgpe1xuICAgICAgICByZXR1cm4gMC4zOy8vMC4zIE7jg7ttXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pyA5aSn6YCf5bqm5a6a5pWwKHJwbSlcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgTUFYX1NQRUVEX1JQTSgpe1xuICAgICAgICByZXR1cm4gMzAwOy8vMzAwcnBtXG4gICAgfVxuICAgIC8qKlxuICAgICAqIOacgOWkp+mAn+W6puWumuaVsChyYWRpYW4vc2VjKVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBNQVhfU1BFRURfUkFESUFOKCl7XG4gICAgICAgIHJldHVybiBLTVV0bC5ycG1Ub1JhZGlhblNlYygzMDApO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDmnIDlpKfluqfmqJnlrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgTUFYX1BPU0lUSU9OKCl7XG4gICAgICAgIHJldHVybiAzKk1hdGgucG93KDEwLDM4KTsvL2luZm86OuOAjHJldHVybuOAgDNlKzM444CN44GvbWluaWZ544Gn44Ko44Op44O8XG4gICAgICAgIC8vcmV0dXJu44CAM2UrMzg7Ly9yYWRpYW4gNGJ5dGUgZmxvYXTjgIAxLjE3NTQ5NCAxMC0zOCAgPCAzLjQwMjgyMyAxMCszOFxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICogQGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uIOW6p+aomVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2ZWxvY2l0eSDpgJ/luqZcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9ycXVlIOODiOODq+OCr1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHBvc2l0aW9uLCB2ZWxvY2l0eSwgdG9ycXVlKSB7XG4gICAgICAgIC8v5pyJ5Yq55qGB5pWwIOWwj+aVsOesrDTkvY1cbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5wb3NpdGlvbiA9IE1hdGguZmxvb3IoS01VdGwudG9OdW1iZXIocG9zaXRpb24pKjEwMDAwKS8xMDAwMDtcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IE1hdGguZmxvb3IoS01VdGwudG9OdW1iZXIodmVsb2NpdHkpKjEwMDAwKS8xMDAwMDtcbiAgICAgICAgdGhpcy50b3JxdWUgPSBNYXRoLmZsb29yKEtNVXRsLnRvTnVtYmVyKHRvcnF1ZSkqMTAwMDApLzEwMDAwO1xuICAgIH1cbn1cblxuXG4vKipcbiAqIEBjbGFzc2Rlc2Mg44OH44OQ44Kk44K55oOF5aCxXG4gKi9cbmNsYXNzIEtNRGV2aWNlSW5mbyBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2VcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuS01fQ09OTkVDVF9UWVBFfSB0eXBlIOaOpee2muaWueW8j1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCDjg4fjg5DjgqTjgrlVVUlEXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUg44Oi44O844K/44O85ZCNKOW9ouW8jyBJRCBMRURDb2xvcilcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzQ29ubmVjdCDmjqXntprnirbmhYtcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWFudWZhY3R1cmVyTmFtZSDoo73pgKDkvJrnpL7lkI1cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaGFyZHdhcmVSZXZpc2lvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaXJtd2FyZVJldmlzaW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IodHlwZT0wLGlkPVwiXCIsbmFtZT1cIlwiLGlzQ29ubmVjdD1mYWxzZSxtYW51ZmFjdHVyZXJOYW1lPW51bGwsaGFyZHdhcmVSZXZpc2lvbj1udWxsLGZpcm13YXJlUmV2aXNpb249bnVsbCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGU9dHlwZTtcbiAgICAgICAgdGhpcy5pZD1pZDtcbiAgICAgICAgdGhpcy5uYW1lPW5hbWU7XG4gICAgICAgIHRoaXMuaXNDb25uZWN0PWlzQ29ubmVjdDtcbiAgICAgICAgdGhpcy5tYW51ZmFjdHVyZXJOYW1lPW1hbnVmYWN0dXJlck5hbWU7XG4gICAgICAgIHRoaXMuaGFyZHdhcmVSZXZpc2lvbj1oYXJkd2FyZVJldmlzaW9uO1xuICAgICAgICB0aGlzLmZpcm13YXJlUmV2aXNpb249ZmlybXdhcmVSZXZpc2lvbjtcblxuICAgIH1cbn1cbi8qKlxuICogQGNsYXNzZGVzYyDjg6Ljg7zjgr/jg7zjg63jgrDmg4XloLFcbiAqL1xuY2xhc3MgS01Nb3RvckxvZyBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGlkIHtudW1iZXJ9IOOCt+ODvOOCseODs+OCuUlEKOODpuODi+ODvOOCr+WApClcbiAgICAgKiBAcGFyYW0gY21kTmFtZSB7c3RyaW5nfSDlrp/ooYzjgrPjg57jg7Pjg4nlkI1cbiAgICAgKiBAcGFyYW0gY21kSUQge251bWJlcn0g5a6f6KGM44Kz44Oe44Oz44OJSURcbiAgICAgKiBAcGFyYW0gZXJySUQge251bWJlcn0g44Ko44Op44O844K/44Kk44OXXG4gICAgICogQHBhcmFtIGVyclR5cGUge3N0cmluZ30g44Ko44Op44O856iu5YilXG4gICAgICogQHBhcmFtIGVyck1zZyB7c3RyaW5nfeOAgOODoeODg+OCu+ODvOOCuOWGheWuuVxuICAgICAqIEBwYXJhbSBpbmZvIHtudW1iZXJ9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKGlkPTAsY21kTmFtZT1cIlwiLGNtZElEPTAsZXJySUQ9MCxlcnJUeXBlPVwiXCIsZXJyTXNnPVwiXCIsaW5mbz0wKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaWQ9IGlkO1xuICAgICAgICB0aGlzLmNtZE5hbWU9Y21kTmFtZTtcbiAgICAgICAgdGhpcy5jbWRJRD0gY21kSUQ7XG4gICAgICAgIHRoaXMuZXJySUQ9ZXJySUQ7XG4gICAgICAgIHRoaXMuZXJyVHlwZT0gZXJyVHlwZTtcbiAgICAgICAgdGhpcy5lcnJNc2c9IGVyck1zZztcbiAgICAgICAgdGhpcy5pbmZvPSBpbmZvO1xuICAgIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBLTVN0cnVjdHVyZUJhc2U6S01TdHJ1Y3R1cmVCYXNlLFxuICAgIEtNVmVjdG9yMjpLTVZlY3RvcjIsXG4gICAgLy9LTVZlY3RvcjM6S01WZWN0b3IzLFxuICAgIEtNSW11U3RhdGU6S01JbXVTdGF0ZSxcbiAgICBLTUxlZFN0YXRlOktNTGVkU3RhdGUsXG4gICAgS01Sb3RTdGF0ZTpLTVJvdFN0YXRlLFxuICAgIEtNRGV2aWNlSW5mbzpLTURldmljZUluZm8sXG4gICAgS01Nb3RvckxvZzpLTU1vdG9yTG9nXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvS01TdHJ1Y3R1cmVzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLyoqKlxuICogS01VdGwuanNcbiAqIENDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQGNsYXNzZGVzYyDjg6bjg7zjg4bjgqPjg6rjg4bjgqNcbiAqL1xuY2xhc3MgS01VdGx7XG5cbiAgICAvKipcbiAgICAgKiDmlbDlgKTjgavjgq3jg6Pjgrnjg4jjgZnjgovplqLmlbBcbiAgICAgKiDmlbDlgKTku6XlpJbjga8w44KS6L+U44GZPGJyPlxuICAgICAqIEluZmluaXR544KCMOOBqOOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWxcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVmYXVsdHZhbCB2YWzjgYzmlbDlgKTjgavlpInmj5vlh7rmnaXjgarjgYTloLTlkIjjga7jg4fjg5Xjgqnjg6vjg4hcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyB0b051bWJlcih2YWwsIGRlZmF1bHR2YWwgPSAwKSB7XG4gICAgICAgIGxldCB2ID0gcGFyc2VGbG9hdCh2YWwsIDEwKTtcbiAgICAgICAgcmV0dXJuICghaXNGaW5pdGUodikgPyBkZWZhdWx0dmFsIDogdik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiDmlbDlgKTjgavjgq3jg6Pjgrnjg4jjgZnjgovplqLmlbAgaW505Zu65a6aXG4gICAgICog5pWw5YCk5Lul5aSW44GvMOOCkui/lOOBmTxicj5cbiAgICAgKiBJbmZpbml0eeOCgjDjgajjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlZmF1bHR2YWwgdmFs44GM5pWw5YCk44Gr5aSJ5o+b5Ye65p2l44Gq44GE5aC05ZCI44Gu44OH44OV44Kp44Or44OIXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgdG9JbnROdW1iZXIodmFsLCBkZWZhdWx0dmFsID0gMCkge1xuICAgICAgICBsZXQgdiA9IHBhcnNlSW50KHZhbCwgMTApO1xuICAgICAgICByZXR1cm4gKCFpc0Zpbml0ZSh2KSA/IGRlZmF1bHR2YWwgOiB2KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIOinkuW6puOBruWNmOS9jeWkieaPm+OAgGRlZ3JlZSA+PiByYWRpYW5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVncmVlIOW6plxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHJhZGlhblxuICAgICAqL1xuICAgIHN0YXRpYyBkZWdyZWVUb1JhZGlhbihkZWdyZWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZ3JlZSAqIDAuMDE3NDUzMjkyNTE5OTQzMjk1O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDop5Lluqbjga7ljZjkvY3lpInmj5vjgIByYWRpYW4gPj4gZGVncmVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbiByYWRpYW7op5JcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDluqZcbiAgICAgKi9cbiAgICBzdGF0aWMgcmFkaWFuVG9EZWdyZWUocmFkaWFuKSB7XG4gICAgICAgIHJldHVybiByYWRpYW4gLyAwLjAxNzQ1MzI5MjUxOTk0MzI5NTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICog6YCf5bqmIHJwbSAtPnJhZGlhbi9zZWMg44Gr5aSJ5o+bXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJwbVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHJhZGlhbi9zZWNcbiAgICAgKi9cbiAgICBzdGF0aWMgcnBtVG9SYWRpYW5TZWMocnBtKSB7XG4gICAgICAgIC8v6YCf5bqmIHJwbSAtPnJhZGlhbi9zZWMoTWF0aC5QSSoyLzYwKVxuICAgICAgICByZXR1cm4gcnBtICogMC4xMDQ3MTk3NTUxMTk2NTk3NztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIDLngrnplpPjga7ot53pm6Ljgajop5LluqbjgpLmsYLjgoHjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbV94XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZyb21feVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b194XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvX3lcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyB0d29Qb2ludERpc3RhbmNlQW5nbGUoZnJvbV94LCBmcm9tX3ksIHRvX3gsIHRvX3kpIHtcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KGZyb21feCAtIHRvX3gsIDIpICsgTWF0aC5wb3coZnJvbV95IC0gdG9feSwgMikpO1xuICAgICAgICBsZXQgcmFkaWFuID0gTWF0aC5hdGFuMihmcm9tX3kgLSB0b195LCBmcm9tX3ggLSB0b194KTtcbiAgICAgICAgcmV0dXJuIHtkaXN0OiBkaXN0YW5jZSwgcmFkaTogcmFkaWFuLCBkZWc6IEtNVXRsLnJhZGlhblRvRGVncmVlKHJhZGlhbil9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDjgrPjg57jg7Pjg4njga7jg4Hjgqfjg4Pjgq/jgrXjg6DjgpLoqIjnrpdcbiAgICAgKiBAaWdub3JlXG4gICAgICogQGRlc2Mg5Y+z6YCB44KKIENSQy0xNi1DQ0lUVCAoeDE2ICsgeDEyICsgeDUgKyAxKSBTdGFydDoweDAwMDAgWE9ST3V0OjB4MDAwMCBCeXRlT3JkZXI6TGl0dGxlLUVuZGlhblxuICAgICAqIEBwYXJhbSB1aW50OGFycmF5QnVmZmVyXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBzdGF0aWMgQ3JlYXRlQ29tbWFuZENoZWNrU3VtQ1JDMTYodWludDhhcnJheUJ1ZmZlcil7XG4gICAgICAgIGNvbnN0IGNyYzE2dGFibGU9IF9fY3JjMTZ0YWJsZTtcbiAgICAgICAgbGV0IGNyYyA9IDA7Ly8gU3RhcnQ6MHgwMDAwXG4gICAgICAgIGxldCBsZW49dWludDhhcnJheUJ1ZmZlci5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdWludDhhcnJheUJ1ZmZlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGMgPSB1aW50OGFycmF5QnVmZmVyW2ldO1xuICAgICAgICAgICAgY3JjID0gKGNyYyA+PiA4KSBeIGNyYzE2dGFibGVbKGNyYyBeIGMpICYgMHgwMGZmXTtcbiAgICAgICAgfVxuICAgICAgICBjcmM9KChjcmM+PjgpJjB4RkYpfCgoY3JjPDw4KSYweEZGMDApOy8vIEJ5dGVPcmRlcjpMaXR0bGUtRW5kaWFuXG4gICAgICAgIC8vY3JjPTB4RkZGRl5jcmM7Ly9YT1JPdXQ6MHgwMDAwXG4gICAgICAgIHJldHVybiBjcmM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQCMgaW5mbzo6IEtNQ29tQkxFLmpz44GuREVWSUNFIElORk9STUFUSU9OIFNFUlZJQ0Xjga7jg5Hjg7zjgrnjgavkvb/nlKhcbiAgICAgKiB1dGYuanMgLSBVVEYtOCA8PT4gVVRGLTE2IGNvbnZlcnRpb25cbiAgICAgKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBAcGFyYW0gYXJyYXlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQGRlc2NcbiAgICAgKiBDb3B5cmlnaHQgKEMpIDE5OTkgTWFzYW5hbyBJenVtbyA8aXpAb25pY29zLmNvLmpwPlxuICAgICAqIFZlcnNpb246IDEuMFxuICAgICAqIExhc3RNb2RpZmllZDogRGVjIDI1IDE5OTlcbiAgICAgKiBUaGlzIGxpYnJhcnkgaXMgZnJlZS4gIFlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQuXG4gICAgICovXG4gICAgc3RhdGljIFV0ZjhBcnJheVRvU3RyKGFycmF5KSB7XG4gICAgICAgIGxldCBvdXQsIGksIGxlbiwgYztcbiAgICAgICAgbGV0IGNoYXIyLCBjaGFyMztcblxuICAgICAgICBvdXQgPSBcIlwiO1xuICAgICAgICBsZW4gPSBhcnJheS5sZW5ndGg7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICB3aGlsZShpIDwgbGVuKSB7XG4gICAgICAgICAgICBjID0gYXJyYXlbaSsrXTtcbiAgICAgICAgICAgIHN3aXRjaChjID4+IDQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IGNhc2UgMjogY2FzZSAzOiBjYXNlIDQ6IGNhc2UgNTogY2FzZSA2OiBjYXNlIDc6XG4gICAgICAgICAgICAgICAgLy8gMHh4eHh4eHhcbiAgICAgICAgICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDEyOiBjYXNlIDEzOlxuICAgICAgICAgICAgICAgIC8vIDExMHggeHh4eCAgIDEweHggeHh4eFxuICAgICAgICAgICAgICAgIGNoYXIyID0gYXJyYXlbaSsrXTtcbiAgICAgICAgICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAweDFGKSA8PCA2KSB8IChjaGFyMiAmIDB4M0YpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgICAgICAgICAvLyAxMTEwIHh4eHggIDEweHggeHh4eCAgMTB4eCB4eHh4XG4gICAgICAgICAgICAgICAgICAgIGNoYXIyID0gYXJyYXlbaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcjMgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAweDBGKSA8PCAxMikgfFxuICAgICAgICAgICAgICAgICAgICAgICAgKChjaGFyMiAmIDB4M0YpIDw8IDYpIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICgoY2hhcjMgJiAweDNGKSA8PCAwKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEAjIGluZm86OiDjg4fjg5Djg4PjgrDnlKhcbiAgICAgKiB1aW50OEFycmF5ID0+IFVURi0xNiBTdHJpbmdzIGNvbnZlcnRpb25cbiAgICAgKiBAaWdub3JlXG4gICAgICogQHBhcmFtIHVpbnQ4QXJyYXlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHN0YXRpYyBVaW50OEFycmF5VG9IZXhTdHIodWludDhBcnJheSl7XG4gICAgICAgIGlmKCF1aW50OEFycmF5IGluc3RhbmNlb2YgVWludDhBcnJheSl7cmV0dXJuO31cbiAgICAgICAgbGV0IGFyPVtdO1xuICAgICAgICBmb3IobGV0IGk9MDtpPHVpbnQ4QXJyYXkubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBhci5wdXNoKHVpbnQ4QXJyYXlbaV0udG9TdHJpbmcoMTYpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXIuam9pbignOicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEAjIGluZm86OlVpbnQ444GuQ29uY2F0XG4gICAgICogQ3JlYXRlcyBhIG5ldyBVaW50OEFycmF5IGJhc2VkIG9uIHR3byBkaWZmZXJlbnQgQXJyYXlCdWZmZXJzXG4gICAgICogQHBhcmFtIHtBcnJheUJ1ZmZlcnN9IHU4QXJyYXkxIFRoZSBmaXJzdCBidWZmZXIuXG4gICAgICogQHBhcmFtIHtBcnJheUJ1ZmZlcnN9IHU4QXJyYXkyIFRoZSBzZWNvbmQgYnVmZmVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5QnVmZmVyc30gVGhlIG5ldyBBcnJheUJ1ZmZlciBjcmVhdGVkIG91dCBvZiB0aGUgdHdvLlxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBzdGF0aWMgVWludDhBcnJheUNvbmNhdCh1OEFycmF5MSwgdThBcnJheTIpIHtcbiAgICAgICAgbGV0IHRtcCA9IG5ldyBVaW50OEFycmF5KHU4QXJyYXkxLmJ5dGVMZW5ndGggKyB1OEFycmF5Mi5ieXRlTGVuZ3RoKTtcbiAgICAgICAgdG1wLnNldChuZXcgVWludDhBcnJheSh1OEFycmF5MSksIDApO1xuICAgICAgICB0bXAuc2V0KG5ldyBVaW50OEFycmF5KHU4QXJyYXkyKSwgdThBcnJheTEuYnl0ZUxlbmd0aCk7XG4gICAgICAgIHJldHVybiB0bXA7XG4gICAgfVxuXG5cbn1cblxuLyoqXG4gKiBDcmVhdGVDb21tYW5kQ2hlY2tTdW1DUkMxNueUqCBDUkPjg4bjg7zjg5bjg6tcbiAqIEBpZ25vcmVcbiAqIEB0eXBlIHtVaW50MTZBcnJheX1cbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IF9fY3JjMTZ0YWJsZT1uZXcgVWludDE2QXJyYXkoW1xuICAgIDAgLCAweDExODkgLCAweDIzMTIgLCAweDMyOWIgLCAweDQ2MjQgLCAweDU3YWQgLCAweDY1MzYgLCAweDc0YmYgLFxuICAgIDB4OGM0OCAsIDB4OWRjMSAsIDB4YWY1YSAsIDB4YmVkMyAsIDB4Y2E2YyAsIDB4ZGJlNSAsIDB4ZTk3ZSAsIDB4ZjhmNyAsXG4gICAgMHgxMDgxICwgMHgwMTA4ICwgMHgzMzkzICwgMHgyMjFhICwgMHg1NmE1ICwgMHg0NzJjICwgMHg3NWI3ICwgMHg2NDNlICxcbiAgICAweDljYzkgLCAweDhkNDAgLCAweGJmZGIgLCAweGFlNTIgLCAweGRhZWQgLCAweGNiNjQgLCAweGY5ZmYgLCAweGU4NzYgLFxuICAgIDB4MjEwMiAsIDB4MzA4YiAsIDB4MDIxMCAsIDB4MTM5OSAsIDB4NjcyNiAsIDB4NzZhZiAsIDB4NDQzNCAsIDB4NTViZCAsXG4gICAgMHhhZDRhICwgMHhiY2MzICwgMHg4ZTU4ICwgMHg5ZmQxICwgMHhlYjZlICwgMHhmYWU3ICwgMHhjODdjICwgMHhkOWY1ICxcbiAgICAweDMxODMgLCAweDIwMGEgLCAweDEyOTEgLCAweDAzMTggLCAweDc3YTcgLCAweDY2MmUgLCAweDU0YjUgLCAweDQ1M2MgLFxuICAgIDB4YmRjYiAsIDB4YWM0MiAsIDB4OWVkOSAsIDB4OGY1MCAsIDB4ZmJlZiAsIDB4ZWE2NiAsIDB4ZDhmZCAsIDB4Yzk3NCAsXG5cbiAgICAweDQyMDQgLCAweDUzOGQgLCAweDYxMTYgLCAweDcwOWYgLCAweDA0MjAgLCAweDE1YTkgLCAweDI3MzIgLCAweDM2YmIgLFxuICAgIDB4Y2U0YyAsIDB4ZGZjNSAsIDB4ZWQ1ZSAsIDB4ZmNkNyAsIDB4ODg2OCAsIDB4OTllMSAsIDB4YWI3YSAsIDB4YmFmMyAsXG4gICAgMHg1Mjg1ICwgMHg0MzBjICwgMHg3MTk3ICwgMHg2MDFlICwgMHgxNGExICwgMHgwNTI4ICwgMHgzN2IzICwgMHgyNjNhICxcbiAgICAweGRlY2QgLCAweGNmNDQgLCAweGZkZGYgLCAweGVjNTYgLCAweDk4ZTkgLCAweDg5NjAgLCAweGJiZmIgLCAweGFhNzIgLFxuICAgIDB4NjMwNiAsIDB4NzI4ZiAsIDB4NDAxNCAsIDB4NTE5ZCAsIDB4MjUyMiAsIDB4MzRhYiAsIDB4MDYzMCAsIDB4MTdiOSAsXG4gICAgMHhlZjRlICwgMHhmZWM3ICwgMHhjYzVjICwgMHhkZGQ1ICwgMHhhOTZhICwgMHhiOGUzICwgMHg4YTc4ICwgMHg5YmYxICxcbiAgICAweDczODcgLCAweDYyMGUgLCAweDUwOTUgLCAweDQxMWMgLCAweDM1YTMgLCAweDI0MmEgLCAweDE2YjEgLCAweDA3MzggLFxuICAgIDB4ZmZjZiAsIDB4ZWU0NiAsIDB4ZGNkZCAsIDB4Y2Q1NCAsIDB4YjllYiAsIDB4YTg2MiAsIDB4OWFmOSAsIDB4OGI3MCAsXG5cbiAgICAweDg0MDggLCAweDk1ODEgLCAweGE3MWEgLCAweGI2OTMgLCAweGMyMmMgLCAweGQzYTUgLCAweGUxM2UgLCAweGYwYjcgLFxuICAgIDB4MDg0MCAsIDB4MTljOSAsIDB4MmI1MiAsIDB4M2FkYiAsIDB4NGU2NCAsIDB4NWZlZCAsIDB4NmQ3NiAsIDB4N2NmZiAsXG4gICAgMHg5NDg5ICwgMHg4NTAwICwgMHhiNzliICwgMHhhNjEyICwgMHhkMmFkICwgMHhjMzI0ICwgMHhmMWJmICwgMHhlMDM2ICxcbiAgICAweDE4YzEgLCAweDA5NDggLCAweDNiZDMgLCAweDJhNWEgLCAweDVlZTUgLCAweDRmNmMgLCAweDdkZjcgLCAweDZjN2UgLFxuICAgIDB4YTUwYSAsIDB4YjQ4MyAsIDB4ODYxOCAsIDB4OTc5MSAsIDB4ZTMyZSAsIDB4ZjJhNyAsIDB4YzAzYyAsIDB4ZDFiNSAsXG4gICAgMHgyOTQyICwgMHgzOGNiICwgMHgwYTUwICwgMHgxYmQ5ICwgMHg2ZjY2ICwgMHg3ZWVmICwgMHg0Yzc0ICwgMHg1ZGZkICxcbiAgICAweGI1OGIgLCAweGE0MDIgLCAweDk2OTkgLCAweDg3MTAgLCAweGYzYWYgLCAweGUyMjYgLCAweGQwYmQgLCAweGMxMzQgLFxuICAgIDB4MzljMyAsIDB4Mjg0YSAsIDB4MWFkMSAsIDB4MGI1OCAsIDB4N2ZlNyAsIDB4NmU2ZSAsIDB4NWNmNSAsIDB4NGQ3YyAsXG5cbiAgICAweGM2MGMgLCAweGQ3ODUgLCAweGU1MWUgLCAweGY0OTcgLCAweDgwMjggLCAweDkxYTEgLCAweGEzM2EgLCAweGIyYjMgLFxuICAgIDB4NGE0NCAsIDB4NWJjZCAsIDB4Njk1NiAsIDB4NzhkZiAsIDB4MGM2MCAsIDB4MWRlOSAsIDB4MmY3MiAsIDB4M2VmYiAsXG4gICAgMHhkNjhkICwgMHhjNzA0ICwgMHhmNTlmICwgMHhlNDE2ICwgMHg5MGE5ICwgMHg4MTIwICwgMHhiM2JiICwgMHhhMjMyICxcbiAgICAweDVhYzUgLCAweDRiNGMgLCAweDc5ZDcgLCAweDY4NWUgLCAweDFjZTEgLCAweDBkNjggLCAweDNmZjMgLCAweDJlN2EgLFxuICAgIDB4ZTcwZSAsIDB4ZjY4NyAsIDB4YzQxYyAsIDB4ZDU5NSAsIDB4YTEyYSAsIDB4YjBhMyAsIDB4ODIzOCAsIDB4OTNiMSAsXG4gICAgMHg2YjQ2ICwgMHg3YWNmICwgMHg0ODU0ICwgMHg1OWRkICwgMHgyZDYyICwgMHgzY2ViICwgMHgwZTcwICwgMHgxZmY5ICxcbiAgICAweGY3OGYgLCAweGU2MDYgLCAweGQ0OWQgLCAweGM1MTQgLCAweGIxYWIgLCAweGEwMjIgLCAweDkyYjkgLCAweDgzMzAgLFxuICAgIDB4N2JjNyAsIDB4NmE0ZSAsIDB4NThkNSAsIDB4NDk1YyAsIDB4M2RlMyAsIDB4MmM2YSAsIDB4MWVmMSAsIDB4MGY3OFxuXSk7XG5cbm1vZHVsZS5leHBvcnRzID0gS01VdGw7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvS01VdGwuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKioqXG4gKiBLTUNvbVdlYkJMRS5qc1xuICogdmVyc2lvbiAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuY29uc3QgS01VdGwgPSByZXF1aXJlKCcuL0tNVXRsJyk7XG5jb25zdCBLTUNvbUJhc2UgPSByZXF1aXJlKCcuL0tNQ29tQmFzZScpO1xuY29uc3QgS01TdHJ1Y3R1cmVzPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzJyk7XG5cbi8qKlxuICogQGNsYXNzZGVzYyDjg5bjg6njgqbjgrbnlKhXZWJCbHVldG9vaOmAmuS/oeOCr+ODqeOCuShjaHJvbWXkvp3lrZgpXG4gKiBAaWdub3JlXG4gKi9cbmNsYXNzIEtNQ29tV2ViQkxFIGV4dGVuZHMgS01Db21CYXNle1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWumuaVsFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fZGV2aWNlSW5mby50eXBlPVwiV0VCQkxFXCI7XG4gICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljcz17fTtcbiAgICAgICAgdGhpcy5fYmxlU2VuZGluZ1F1ZT1Qcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICAgIHRoaXMuX3F1ZUNvdW50PTA7XG4gICAgICAgIFxuICAgICAgICAvL+OCteODvOODk+OCuVVVSURcbiAgICAgICAgdGhpcy5fTU9UT1JfQkxFX1NFUlZJQ0VfVVVJRD0nZjE0MGVhMzUtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJztcblxuICAgICAgICAvL+OCreODo+ODqeOCr+OCv+ODquOCueODhuOCo+OCr+OCuVVVSURcbiAgICAgICAgdGhpcy5fTU9UT1JfQkxFX0NSUz17XG4gICAgICAgICAgICAnTU9UT1JfVFgnOidmMTQwMDAwMS04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLC8v5penIE1PVE9SX0NPTlRST0xcbiAgICAgICAgICAgIC8vJ01PVE9SX0xFRCc6J2YxNDAwMDAzLTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4YycsLy/jg6Ljg7zjgr/jg7zjga5MRUTjgpLlj5bjgormibHjgYYgaW5mbzo6IE1PVE9SX0NPTlRST0w6OmJsZUxlZOOBp+S7o+eUqFxuICAgICAgICAgICAgJ01PVE9SX01FQVNVUkVNRU5UJzonZjE0MDAwMDQtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJyxcbiAgICAgICAgICAgICdNT1RPUl9JTVVfTUVBU1VSRU1FTlQnOidmMTQwMDAwNS04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLFxuICAgICAgICAgICAgJ01PVE9SX1JYJzonZjE0MDAwMDYtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJywvL+aXpyBNT1RPUl9TRVRUSU5HXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTPXtcbiAgICAgICAgICAgIFwiU2VydmljZVwiOjB4MTgwYVxuICAgICAgICAgICAgLFwiTWFudWZhY3R1cmVyTmFtZVN0cmluZ1wiOjB4MmEyOVxuICAgICAgICAgICAgLFwiSGFyZHdhcmVSZXZpc2lvblN0cmluZ1wiOjB4MmEyN1xuICAgICAgICAgICAgLFwiRmlybXdhcmVSZXZpc2lvblN0cmluZ1wiOjB4MmEyNlxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCTEXliIfmlq3mmYJcbiAgICAgICAgICogQHBhcmFtIGV2ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICB0aGlzLl9vbkJsZUNvbm5lY3Rpb25Mb3N0PShldmUpPT57XG4gICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uaXNDb25uZWN0PWZhbHNlO1xuICAgICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbD1udWxsO1xuICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzQ2hhbmdlX2lzQ29ubmVjdChmYWxzZSk7XG4gICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIOODouODvOOCv+ODvOWbnui7ouaDheWgseWPl+S/oVxuICAgICAgICAgKiBAcGFyYW0gZXZlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIE5vdGlmeSBWYWx1ZVxuICAgICAgICAgKiAgYnl0ZVswXS1ieXRlWzNdXHQgICAgYnl0ZVs0XS1ieXRlWzddXHQgICAgICAgIGJ5dGVbOF0tYnl0ZVsxMV1cbiAgICAgICAgICogIGZsb2F0ICogXHRcdCAgICAgICAgZmxvYXQgKiAgICAgICAgICAgICAgICAgZmxvYXQgKlxuICAgICAgICAgKiAgcG9zaXRpb246cmFkaWFuc1x0ICAgIHNwZWVkOnJhZGlhbnMvc2Vjb25kXHR0b3JxdWU6TuODu21cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29uQmxlTW90b3JNZWFzdXJlbWVudD0oZXZlKT0+e1xuICAgICAgICAgICAgaWYoIWV2ZXx8IWV2ZS50YXJnZXQpe3JldHVybjt9XG4gICAgICAgICAgICBsZXQgZHYgPSBldmUudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgaWYoIShkdiBpbnN0YW5jZW9mIERhdGFWaWV3KSl7cmV0dXJuO30vL2luZm86OndlYiBibHVldG9vaOOBruOBvyBub2RlLmpz44GvaW5zdGFuY2VvZiBCdWZmZXJcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbj1kdi5nZXRGbG9hdDMyKDAsZmFsc2UpO1xuICAgICAgICAgICAgbGV0IHZlbG9jaXR5PWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICBsZXQgdG9ycXVlPWR2LmdldEZsb2F0MzIoOCxmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yTWVhc3VyZW1lbnRDQihuZXcgS01TdHJ1Y3R1cmVzLktNUm90U3RhdGUocG9zaXRpb24sdmVsb2NpdHksdG9ycXVlKSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7xJTVXmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIGV2ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAI1xuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBOb3RpZnkgVmFsdWVcbiAgICAgICAgICogYWNjZWxfeCwgYWNjZWxfeSwgYWNjZWxfeiwgdGVtcCwgZ3lyb194LCBneXJvX3ksIGd5cm9feiDjgYzlhajjgabov5TjgaPjgabjgY/jgovjgILlj5blvpfplpPpmpTjga8xMDBtcyDlm7rlrppcbiAgICAgICAgICogYnl0ZShCaWdFbmRpYW4pICBbMF1bMV0gWzJdWzNdICBbNF1bNV0gICBbNl1bN11cdCAgICBbOF1bOV1cdFsxMF1bMTFdICAgIFsxMl1bMTNdXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgaW50MTZfdCBpbnQxNl90IGludDE2X3QgaW50MTZfdCAgICAgaW50MTZfdCBpbnQxNl90IGludDE2X3RcbiAgICAgICAgICogICAgICAgICAgICAgICAgICBhY2NlbC14IGFjY2VsLXkgYWNjZWwteiB0ZW1wXHQgICAgZ3lyby14XHRneXJvLXlcdGd5cm8telxuICAgICAgICAgKlxuICAgICAgICAgKiBpbnQxNl90Oi0zMiw3NjjjgJwzMiw3NjhcbiAgICAgICAgICog5py644Gu5LiK44Gr44Oi44O844K/44O844KS572u44GE44Gf5aC05ZCI44CB5Yqg6YCf5bqm44CAeiA9IDE2MDAwIOeoi+W6puOBqOOBquOCi+OAgu+8iOmHjeWKm+aWueWQkeOBruOBn+OCge+8iVxuICAgICAgICAgKlxuICAgICAgICAgKiDljZjkvY3lpInmj5vvvIktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44CA5Yqg6YCf5bqmIHZhbHVlIFtHXSA9IHJhd192YWx1ZSAqIDIgLyAzMiw3NjdcbiAgICAgICAgICog44CA5rip5bqmIHZhbHVlIFvihINdID0gcmF3X3ZhbHVlIC8gMzMzLjg3ICsgMjEuMDBcbiAgICAgICAgICog44CA6KeS6YCf5bqmXG4gICAgICAgICAqIOOAgOOAgHZhbHVlIFtkZWdyZWUvc2Vjb25kXSA9IHJhd192YWx1ZSAqIDI1MCAvIDMyLDc2N1xuICAgICAgICAgKiDjgIDjgIB2YWx1ZSBbcmFkaWFucy9zZWNvbmRdID0gcmF3X3ZhbHVlICogMC4wMDAxMzMxNjIxMVxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25CbGVJbXVNZWFzdXJlbWVudD0oZXZlKT0+e1xuICAgICAgICAgICAgaWYoIWV2ZXx8IWV2ZS50YXJnZXQpe3JldHVybjt9XG4gICAgICAgICAgICBsZXQgZHYgPSBldmUudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgbGV0IHRlbXBDYWxpYnJhdGlvbj0tNS43Oy8v5rip5bqm5qCh5q2j5YCkXG4gICAgICAgICAgICBpZighKGR2IGluc3RhbmNlb2YgRGF0YVZpZXcpKXtyZXR1cm47fS8vaW5mbzo6d2ViIGJsdWV0b29o44Gu44G/IG5vZGUuanPjga9pbnN0YW5jZW9mIEJ1ZmZlclxuICAgICAgICAgICAgLy/ljZjkvY3jgpLmibHjgYTmmJPjgYTjgojjgYbjgavlpInmj5tcbiAgICAgICAgICAgIGxldCBhY2NlbFg9ZHYuZ2V0SW50MTYoMCxmYWxzZSkqMi8zMjc2NztcbiAgICAgICAgICAgIGxldCBhY2NlbFk9ZHYuZ2V0SW50MTYoMixmYWxzZSkqMi8zMjc2NztcbiAgICAgICAgICAgIGxldCBhY2NlbFo9ZHYuZ2V0SW50MTYoNCxmYWxzZSkqMi8zMjc2NztcbiAgICAgICAgICAgIGxldCB0ZW1wPShkdi5nZXRJbnQxNig2LGZhbHNlKSkgLyAzMzMuODcgKyAyMS4wMCt0ZW1wQ2FsaWJyYXRpb247XG4gICAgICAgICAgICBsZXQgZ3lyb1g9ZHYuZ2V0SW50MTYoOCxmYWxzZSkqMjUwLzMyNzY3O1xuICAgICAgICAgICAgbGV0IGd5cm9ZPWR2LmdldEludDE2KDEwLGZhbHNlKSoyNTAvMzI3Njc7XG4gICAgICAgICAgICBsZXQgZ3lyb1o9ZHYuZ2V0SW50MTYoMTIsZmFsc2UpKjI1MC8zMjc2NztcblxuICAgICAgICAgICAgdGhpcy5fb25JbXVNZWFzdXJlbWVudENCKG5ldyBLTVN0cnVjdHVyZXMuS01JbXVTdGF0ZShhY2NlbFgsYWNjZWxZLGFjY2VsWix0ZW1wLGd5cm9YLGd5cm9ZLGd5cm9aKSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44Oi44O844K/44O844Ot44Kw5oOF5aCx5Y+W5b6XXG4gICAgICAgICAqIEBwYXJhbSB7QnVmZmVyfSBkYXRhXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIE5vdGlmeSB2YWx1ZVxuICAgICAgICAgKiBieXRlWzBdXHRieXRlWzEtMl1cdGJ5dGVbM11cdGJ5dGVbNC03XVx0Ynl0ZVs4LTExXVx0Ynl0ZVsxMi0xM11cbiAgICAgICAgICogdWludDhfdDp0eF90eXBlXHR1aW50MTZfdDppZFx0dWludDhfdDpjb21tYW5kXHR1aW50MzJfdDplcnJvckNvZGVcdHVpbnQzMl90OmluZm9cdHVpbnQxNl90OkNSQ1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25CbGVNb3RvckxvZz0oZXZlKT0+e1xuICAgICAgICAgICAgaWYoIWV2ZXx8IWV2ZS50YXJnZXQpe3JldHVybjt9XG4gICAgICAgICAgICBsZXQgZHYgPSBldmUudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgaWYoIShkdiBpbnN0YW5jZW9mIERhdGFWaWV3KSl7cmV0dXJuO30vL2luZm86OndlYiBibHVldG9vaOOBruOBvyBub2RlLmpz44GvaW5zdGFuY2VvZiBCdWZmZXJcbiAgICAgICAgICAgIGxldCB0eFR5cGU9ZHYuZ2V0VWludDgoMCk7Ly/jgqjjg6njg7zjg63jgrDjgr/jgqTjg5c6MHhCReWbuuWumlxuICAgICAgICAgICAgaWYodHhUeXBlIT09MHhCRSl7cmV0dXJuO31cblxuICAgICAgICAgICAgbGV0IGlkPWR2LmdldFVpbnQxNigxLGZhbHNlKTsvL+mAgeS/oUlEXG4gICAgICAgICAgICBsZXQgY21kSUQ9ZHYuZ2V0VWludDgoMyxmYWxzZSk7XG4gICAgICAgICAgICBsZXQgZXJyQ29kZT1kdi5nZXRVaW50MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICBsZXQgaW5mbz1kdi5nZXRVaW50MzIoOCxmYWxzZSk7XG4gICAgICAgICAgICAvL+ODreOCsOWPluW+l1xuICAgICAgICAgICAgdGhpcy5fb25Nb3RvckxvZ0NCKG5ldyBLTVN0cnVjdHVyZXMuS01Nb3RvckxvZyhpZCxudWxsLGNtZElELHRoaXMuX01PVE9SX0xPR19FUlJPUkNPREVbZXJyQ29kZV0uaWQsdGhpcy5fTU9UT1JfTE9HX0VSUk9SQ09ERVtlcnJDb2RlXS50eXBlLHRoaXMuX01PVE9SX0xPR19FUlJPUkNPREVbZXJyQ29kZV0ubXNnLGluZm8pKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIOODouODvOOCv+ODvOioreWumuaDheWgseWPluW+l1xuICAgICAgICAgKiBAcGFyYW0gZXZlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIE5vdGlmeSB2YWx1ZVxuICAgICAgICAgKiBieXRlWzBdXHRieXRlWzFdXHRieXRlWzJdXHRieXRlWzNdIGJ5dGVbNF3ku6XpmY1cdGJ5dGVbbi0yXVx0Ynl0ZVtuLTFdXG4gICAgICAgICAqIHVpbnQ4X3Q6dHhfdHlwZVx0dWludDE2X3Q6aWRcdHVpbnQ4X3Q6cmVnaXN0ZXJcdHVpbnQ4X3Q6dmFsdWVcdHVpbnQxNl90OkNSQ1xuICAgICAgICAgKiAweDQwXHR1aW50MTZfdCAoMmJ5dGUpIDDvvZ42NTUzNVx044Os44K444K544K/44Kz44Oe44Oz44OJXHTjg6zjgrjjgrnjgr/jga7lgKTvvIjjgrPjg57jg7Pjg4njgavjgojjgaPjgablpInjgo/jgovvvIlcdHVpbnQxNl90ICgyYnl0ZSkgMO+9njY1NTM1XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vbkJsZU1vdG9yU2V0dGluZz0oZXZlKT0+e1xuICAgICAgICAgICAgaWYoIWV2ZXx8IWV2ZS50YXJnZXQpe3JldHVybjt9XG4gICAgICAgICAgICBsZXQgZHYgPSBldmUudGFyZ2V0LnZhbHVlOy8vNStu44OQ44Kk44OI44CAXG4gICAgICAgICAgICBsZXQgdWludDhBcnJheT1uZXcgVWludDhBcnJheShkdi5idWZmZXIpOy8vaW5mbzo65LiA5pem44Kz44OU44O844GZ44KL5b+F6KaB44GM44GC44KLXG4gICAgICAgICAgICBpZighKGR2IGluc3RhbmNlb2YgRGF0YVZpZXcpKXtyZXR1cm47fS8vaW5mbzo6d2ViIGJsdWV0b29o44Gu44G/IG5vZGUuanPjga9pbnN0YW5jZW9mIEJ1ZmZlclxuXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIC8v44OH44O844K/44GucGFyc2VcbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgbGV0IHR4TGVuPWR2LmJ5dGVMZW5ndGg7XG4gICAgICAgICAgICBsZXQgdHhUeXBlPWR2LmdldFVpbnQ4KDApOy8v44Os44K444K544K/5oOF5aCx6YCa55+l44Kz44Oe44Oz44OJSUQgMHg0MOWbuuWumlxuICAgICAgICAgICAgaWYodHhUeXBlIT09MHg0MHx8dHhMZW48NSl7cmV0dXJuO30vL+ODrOOCuOOCueOCv+aDheWgseOCkuWQq+OBvuOBquOBhOODh+ODvOOCv+OBruegtOajhFxuXG4gICAgICAgICAgICBsZXQgaWQ9ZHYuZ2V0VWludDE2KDEsZmFsc2UpOy8v6YCB5L+hSURcbiAgICAgICAgICAgIGxldCByZWdpc3RlckNtZD1kdi5nZXRVaW50OCgzKTsvL+ODrOOCuOOCueOCv+OCs+ODnuODs+ODiVxuICAgICAgICAgICAgbGV0IGNyYz1kdi5nZXRVaW50MTYodHhMZW4tMixmYWxzZSk7Ly9DUkPjga7lgKQg5pyA5b6M44GL44KJMmR5dGVcblxuICAgICAgICAgICAgbGV0IHJlcz17fTtcbiAgICAgICAgICAgIC8v44Kz44Oe44Oz44OJ5Yil44Gr44KI44KL44Os44K444K544K/44Gu5YCk44Gu5Y+W5b6XWzQtbiBieXRlXVxuICAgICAgICAgICAgbGV0IHN0YXJ0T2Zmc2V0PTQ7XG5cbiAgICAgICAgICAgIHN3aXRjaChyZWdpc3RlckNtZCl7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tYXhTcGVlZDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1heFNwZWVkPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1pblNwZWVkOlxuICAgICAgICAgICAgICAgICAgICByZXMubWluU3BlZWQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuY3VydmVUeXBlOlxuICAgICAgICAgICAgICAgICAgICByZXMuY3VydmVUeXBlPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5hY2M6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5hY2M9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuZGVjOlxuICAgICAgICAgICAgICAgICAgICByZXMuZGVjPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1heFRvcnF1ZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1heFRvcnF1ZT1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC50ZWFjaGluZ0ludGVydmFsOlxuICAgICAgICAgICAgICAgICAgICByZXMudGVhY2hpbmdJbnRlcnZhbD1kdi5nZXRVaW50OChzdGFydE9mZnNldCxmYWxzZSk7Ly90b2RvOjrjg5DjgqTjg4jkuI3otrMgVWludDMyLT5VaW50OCAgMi4yNFxuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnBsYXliYWNrSW50ZXJ2YWw6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wbGF5YmFja0ludGVydmFsPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0LGZhbHNlKTsvL3RvZG86OuODkOOCpOODiOS4jei2syBVaW50MzItPlVpbnQ4ICAyLjI0XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucUN1cnJlbnRQOlxuICAgICAgICAgICAgICAgICAgICByZXMucUN1cnJlbnRQPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnFDdXJyZW50STpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnFDdXJyZW50ST1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5xQ3VycmVudEQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5xQ3VycmVudEQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuc3BlZWRQOlxuICAgICAgICAgICAgICAgICAgICByZXMuc3BlZWRQPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnNwZWVkSTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNwZWVkST1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5zcGVlZEQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zcGVlZEQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucG9zaXRpb25QOlxuICAgICAgICAgICAgICAgICAgICByZXMucG9zaXRpb25QPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnBvc2l0aW9uSTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnBvc2l0aW9uST1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5wb3NpdGlvbkQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wb3NpdGlvbkQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucG9zQ29udHJvbFRocmVzaG9sZDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnBvc0NvbnRyb2xUaHJlc2hvbGQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubW90b3JNZWFzdXJlbWVudEludGVydmFsOlxuICAgICAgICAgICAgICAgICAgICByZXMubW90b3JNZWFzdXJlbWVudEludGVydmFsPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0OlxuICAgICAgICAgICAgICAgICAgICByZXMubW90b3JNZWFzdXJlbWVudEJ5RGVmYXVsdD1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuaW50ZXJmYWNlOlxuICAgICAgICAgICAgICAgICAgICByZXMuaW50ZXJmYWNlPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5yZXNwb25zZTovL3RvZG86OuWApOOBjOWPluW+l+WHuuadpeOBquOBhCAyLjI0XG4gICAgICAgICAgICAgICAgICAgIHJlcy5yZXNwb25zZT1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQub3duQ29sb3I6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5vd25Db2xvcj0oJyMwMDAwMDAnICtOdW1iZXIoZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpPDwxNnxkdi5nZXRVaW50OChzdGFydE9mZnNldCsxKTw8OHxkdi5nZXRVaW50OChzdGFydE9mZnNldCsyKSkudG9TdHJpbmcoMTYpKS5zdWJzdHIoLTYpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmlNVU1lYXN1cmVtZW50SW50ZXJ2YWw6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5pTVVNZWFzdXJlbWVudEludGVydmFsPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5pTVVNZWFzdXJlbWVudEJ5RGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmlNVU1lYXN1cmVtZW50QnlEZWZhdWx0PWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5kZXZpY2VOYW1lOlxuICAgICAgICAgICAgICAgICAgICByZXMuZGV2aWNlTmFtZT1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFwiXCIsIHVpbnQ4QXJyYXkuc2xpY2Uoc3RhcnRPZmZzZXQsLTIpKTsvL+WPr+WkieODkOOCpOODiOaWh+Wtl1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmRldmljZUluZm86XG4gICAgICAgICAgICAgICAgICAgIHJlcy5kZXZpY2VJbmZvPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXCJcIiwgdWludDhBcnJheS5zbGljZShzdGFydE9mZnNldCwtMikpOy8v5Y+v5aSJ44OQ44Kk44OI5paH5a2XXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuc3BlZWQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zcGVlZD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5wb3NpdGlvbk9mZnNldDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnBvc2l0aW9uT2Zmc2V0PWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1vdmVUbzpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1vdmVUbz1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5ob2xkOlxuICAgICAgICAgICAgICAgICAgICByZXMuaG9sZD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5zdGF0dXM6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXM9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnRhc2tzZXROYW1lOlxuICAgICAgICAgICAgICAgICAgICByZXMudGFza3NldE5hbWU9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcIlwiLCB1aW50OEFycmF5LnNsaWNlKHN0YXJ0T2Zmc2V0LC0yKSk7Ly/lj6/lpInjg5DjgqTjg4jmloflrZdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC50YXNrc2V0SW5mbzpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnRhc2tzZXRJbmZvPWR2LmdldFVpbnQxNihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQudGFza3NldFVzYWdlOlxuICAgICAgICAgICAgICAgICAgICByZXMudGFza3NldFVzYWdlPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tb3Rpb25OYW1lOlxuICAgICAgICAgICAgICAgICAgICByZXMubW90aW9uTmFtZT1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFwiXCIsIHVpbnQ4QXJyYXkuc2xpY2Uoc3RhcnRPZmZzZXQsLTIpKTsvL+WPr+WkieODkOOCpOODiOaWh+Wtl1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1vdGlvbkluZm86XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tb3Rpb25JbmZvPWR2LmdldFVpbnQxNihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubW90aW9uVXNhZ2U6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tb3Rpb25Vc2FnZT1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuaTJDU2xhdmVBZGRyZXNzOlxuICAgICAgICAgICAgICAgICAgICByZXMuaTJDU2xhdmVBZGRyZXNzPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC51YXJ0QmF1ZFJhdGU6XG4gICAgICAgICAgICAgICAgICAgIHJlcy51YXJ0QmF1ZFJhdGU9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmxlZDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmxlZD17c3RhdGU6ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpLHI6ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQrMSksZzpkdi5nZXRVaW50OChzdGFydE9mZnNldCsyKSxiOmR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KzMpfTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5lbmFibGVDaGVja1N1bTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmVuYWJsZUNoZWNrU3VtPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5kZXZpY2VTZXJpYWw6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5kZXZpY2VTZXJpYWw9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcIlwiLCB1aW50OEFycmF5LnNsaWNlKHN0YXJ0T2Zmc2V0LC0yKSk7Ly/lj6/lpInjg5DjgqTjg4jmloflrZdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKHJlcyk7XG5cbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JTZXR0aW5nQ0IocmVnaXN0ZXJDbWQscmVzKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBzZWN0aW9uOjrlhazplovjg6Hjgr3jg4Pjg4lcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICogV2ViQmx1ZXRvb2jjgafjga7mjqXntprjgpLplovlp4vjgZnjgotcbiAgICAgKi9cbiAgICBjb25uZWN0KCl7XG4gICAgICAgIGlmICh0aGlzLl9wZXJpcGhlcmFsJiYgdGhpcy5fcGVyaXBoZXJhbC5nYXR0JiZ0aGlzLl9wZXJpcGhlcmFsLmdhdHQuY29ubmVjdGVkICkge3JldHVybn1cbiAgICAgICAgbGV0IGdhdD0gKHRoaXMuX3BlcmlwaGVyYWwmJiB0aGlzLl9wZXJpcGhlcmFsLmdhdHQgKT90aGlzLl9wZXJpcGhlcmFsLmdhdHQgOnVuZGVmaW5lZDsvL+WGjeaOpee2mueUqFxuICAgICAgICB0aGlzLl9ibGVDb25uZWN0KGdhdCkudGhlbihvYmo9PnsvL2luZm86OiByZXNvbHZlKHtkZXZpY2VJRCxkZXZpY2VOYW1lLGJsZURldmljZSxjaGFyYWN0ZXJpc3RpY3N9KTtcbiAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9b2JqLmJsZURldmljZTtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uaWQ9dGhpcy5fcGVyaXBoZXJhbC5pZDtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8ubmFtZT10aGlzLl9wZXJpcGhlcmFsLm5hbWU7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmlzQ29ubmVjdD10aGlzLl9wZXJpcGhlcmFsLmdhdHQuY29ubmVjdGVkO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5tYW51ZmFjdHVyZXJOYW1lPW9iai5pbmZvbWF0aW9uLm1hbnVmYWN0dXJlck5hbWU7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmhhcmR3YXJlUmV2aXNpb249b2JqLmluZm9tYXRpb24uaGFyZHdhcmVSZXZpc2lvbjtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uZmlybXdhcmVSZXZpc2lvbj1vYmouaW5mb21hdGlvbi5maXJtd2FyZVJldmlzaW9uO1xuICAgICAgICAgICAgLy9cbiAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljcz1vYmouY2hhcmFjdGVyaXN0aWNzO1xuXG4gICAgICAgICAgICBpZighZ2F0KXtcbiAgICAgICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2dhdHRzZXJ2ZXJkaXNjb25uZWN0ZWQnLHRoaXMuX29uQmxlQ29ubmVjdGlvbkxvc3QpO1xuICAgICAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWwuYWRkRXZlbnRMaXN0ZW5lcignZ2F0dHNlcnZlcmRpc2Nvbm5lY3RlZCcsIHRoaXMuX29uQmxlQ29ubmVjdGlvbkxvc3QpO1xuXG4gICAgICAgICAgICAgICAgaWYodGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9NRUFTVVJFTUVOVCddKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9NRUFTVVJFTUVOVCddLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yTWVhc3VyZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX01FQVNVUkVNRU5UJ10uYWRkRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JNZWFzdXJlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfTUVBU1VSRU1FTlQnXS5zdGFydE5vdGlmaWNhdGlvbnMoKS50aGVuKG9iaj0+e1xuICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCddKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfSU1VX01FQVNVUkVNRU5UJ10ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlSW11TWVhc3VyZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9JTVVfTUVBU1VSRU1FTlQnXS5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVJbXVNZWFzdXJlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9JTVVfTUVBU1VSRU1FTlQnXS5zdGFydE5vdGlmaWNhdGlvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIH0pLnRoZW4ob2JqPT57XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX1JYJ10pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3RvclNldHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3RvckxvZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX1JYJ10uYWRkRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JTZXR0aW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX1JYJ10uYWRkRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JMb2cpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXS5zdGFydE5vdGlmaWNhdGlvbnMoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICB9KS50aGVuKG9iaj0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzQ2hhbmdlX2luaXQodHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaXNDb25uZWN0KHRydWUpOy8v5Yid5Zue44Gu44G/KGNvbXDku6XliY3jga/nmbrngavjgZfjgarjgYTngropXG4gICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzQ2hhbmdlX2lzQ29ubmVjdCh0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goZXJyPT57XG4gICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW51bGw7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RGYWlsdXJlSGFuZGxlcih0aGlzLGVycik7XG4gICAgICAgIH0pXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV2ViQmx1ZXRvb2jjga7liIfmlq1cbiAgICAgKi9cbiAgICBkaXNDb25uZWN0KCl7XG4gICAgICAgaWYgKCF0aGlzLl9wZXJpcGhlcmFsIHx8ICF0aGlzLl9wZXJpcGhlcmFsLmdhdHQuY29ubmVjdGVkKXtyZXR1cm47fVxuICAgICAgICB0aGlzLl9wZXJpcGhlcmFsLmdhdHQuZGlzY29ubmVjdCgpO1xuICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW51bGw7XG5cbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlhoXpg6hcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBCTEXmjqXntppcbiAgICAgKiBAcGFyYW0gZ2F0dF9vYmog44Oa44Ki44Oq44Oz44Kw5riI44G/44GuR0FUVOOBruODh+ODkOOCpOOCueOBq+WGjeaOpee2mueUqCjjg5rjgqLjg6rjg7PjgrDjg6Ljg7zjg4Djg6vjga/lh7rjgarjgYQpXG4gICAgICogQHJldHVybnMge1Byb21pc2V9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfYmxlQ29ubmVjdChnYXR0X29iaikge1xuICAgICAgLy9sZXQgc2VsZiA9IHRoaXM7XG4gICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgLy8gbGV0IGJsZURldmljZTtcbiAgICAgICAgICAvLyBsZXQgZGV2aWNlTmFtZTtcbiAgICAgICAgICAvLyBsZXQgZGV2aWNlSUQ7XG4gICAgICAgICAgaWYoIWdhdHRfb2JqKXtcbiAgICAgICAgICAgICAgbGV0IG9wdGlvbnMgPSB7XG4gICAgICAgICAgICAgICAgICBmaWx0ZXJzOiBbe3NlcnZpY2VzOiBbdGhpcy5fTU9UT1JfQkxFX1NFUlZJQ0VfVVVJRF19XSxcbiAgICAgICAgICAgICAgICAgIG9wdGlvbmFsU2VydmljZXM6W3RoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLlNlcnZpY2VdXG4gICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgIG5hdmlnYXRvci5ibHVldG9vdGgucmVxdWVzdERldmljZShvcHRpb25zKVxuICAgICAgICAgICAgICAgICAgLnRoZW4oZGV2aWNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9ibGVHYXRjb25uZWN0KGRldmljZS5nYXR0KS50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYmxlRGV2aWNlOiBkZXZpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VJRDogZGV2aWNlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlTmFtZTogZGV2aWNlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3M6cmVzLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb246cmVzLmluZm9tYXRpb25cblxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0pXG5cbiAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgdGhpcy5fYmxlR2F0Y29ubmVjdChnYXR0X29iailcbiAgICAgICAgICAgICAgICAgIC50aGVuKHJlcyA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJfYmxlR2F0Y29ubmVjdFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlSUQ6IGdhdHRfb2JqLmRldmljZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlTmFtZTogZ2F0dF9vYmouZGV2aWNlLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJsZURldmljZTogZ2F0dF9vYmouZGV2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3M6cmVzLmNoYXJhY3RlcmlzdGljcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvbjpyZXMuaW5mb21hdGlvblxuXG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycm9yKTtcbiAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vR0FUVOaOpee2mueUqFxuICAgIF9ibGVHYXRjb25uZWN0KGdhdHRfb2JqKXtcbiAgICAgICAgICAgIGxldCBjaGFyYWN0ZXJpc3RpY3MgPSB7fTtcbiAgICAgICAgICAgIGxldCBpbmZvbWF0aW9uPXt9O1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChncmVzb2x2ZSwgZ3JlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgZ2F0dF9vYmouY29ubmVjdCgpLnRoZW4oc2VydmVyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgLy8gcmV0dXJuIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZXModGhpcy5fTU9UT1JfQkxFX1NFUlZJQ0VfVVVJRCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5fTU9UT1JfQkxFX1NFUlZJQ0VfVVVJRCkudGhlbihzZXJ2aWNlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgY3JzID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgT2JqZWN0LmtleXModGhpcy5fTU9UT1JfQkxFX0NSUykuZm9yRWFjaCgoa2V5KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNycy5wdXNoKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLl9NT1RPUl9CTEVfQ1JTW2tleV0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFyYWN0ZXJpc3RpY3Nba2V5XSA9IGNoYXJhO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKGNycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9ibGVfZmlybXdhcmVfcmV2aXNpb27jga7jgrXjg7zjg5Pjgrnlj5blvpcgaW5mbzo6QW5kcm9pZGTjgafjga/kuI3lronlrprjgarngrrlgZzmraJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHNyZXNvbHZlLCBzcmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLlNlcnZpY2UpLnRoZW4oKHNlcnZpY2UpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5NYW51ZmFjdHVyZXJOYW1lU3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGFyYS5yZWFkVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb25bJ21hbnVmYWN0dXJlck5hbWUnXSA9IEtNVXRsLlV0ZjhBcnJheVRvU3RyKG5ldyBVaW50OEFycmF5KHZhbC5idWZmZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGUpPT57cmVqZWN0KGUpO30pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuRmlybXdhcmVSZXZpc2lvblN0cmluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNoYXJhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hhcmEucmVhZFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uWydmaXJtd2FyZVJldmlzaW9uJ10gPSBLTVV0bC5VdGY4QXJyYXlUb1N0cihuZXcgVWludDhBcnJheSh2YWwuYnVmZmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlKT0+e3JlamVjdChlKTt9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLkhhcmR3YXJlUmV2aXNpb25TdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjaGFyYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoYXJhLnJlYWRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbih2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvblsnaGFyZHdhcmVSZXZpc2lvbiddID0gS01VdGwuVXRmOEFycmF5VG9TdHIobmV3IFVpbnQ4QXJyYXkodmFsLmJ1ZmZlcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntyZWplY3QoZSk7fSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3JlamVjdChlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyZXNvbHZlKHtjaGFyYWN0ZXJpc3RpY3M6IGNoYXJhY3RlcmlzdGljcywgaW5mb21hdGlvbjogaW5mb21hdGlvbn0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQkxF44Kz44Oe44Oz44OJ44Gu6YCB5L+hXG4gICAgICogQHBhcmFtIGNvbW1hbmRUeXBlU3RyICAnTU9UT1JfQ09OVFJPTCcsJ01PVE9SX01FQVNVUkVNRU5UJywnTU9UT1JfSU1VX01FQVNVUkVNRU5UJywnTU9UT1JfUlgnXG4gICAgICog44Kz44Oe44Oz44OJ56iu5Yil44GuU3RyaW5nIOS4u+OBq0JMReOBruOCreODo+ODqeOCr+OCv+ODquOCueODhuOCo+OCr+OCueOBp+S9v+eUqOOBmeOCi1xuICAgICAqIEBwYXJhbSBjb21tYW5kTnVtXG4gICAgICogQHBhcmFtIGFycmF5YnVmZmVyXG4gICAgICogQHBhcmFtIG5vdGlmeVByb21pcyBjbWRSZWFkUmVnaXN0ZXLnrYnjga5CTEXlkbzjgbPlh7rjgZflvozjgatub3RpZnnjgaflj5blvpfjgZnjgovlgKTjgpJQcm9taXPjgafluLDjgZnlv4XopoHjga7jgYLjgovjgrPjg57jg7Pjg4nnlKhcbiAgICAgKiBAcGFyYW0gY2lkIOOCt+ODvOOCseODs+OCuUlEXG4gICAgICogQHJldHVybnMge251bWJlcn0gY2lkIOOCt+ODvOOCseODs+OCuUlEXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBfc2VuZE1vdG9yQ29tbWFuZChjb21tYW5kQ2F0ZWdvcnksIGNvbW1hbmROdW0sIGFycmF5YnVmZmVyPW5ldyBBcnJheUJ1ZmZlcigwKSwgbm90aWZ5UHJvbWlzPW51bGwsY2lkPW51bGwpe1xuICAgICAgICBsZXQgY2hhcmFjdGVyaXN0aWNzPXRoaXMuX2NoYXJhY3RlcmlzdGljc1tjb21tYW5kQ2F0ZWdvcnldO1xuICAgICAgICBsZXQgYWI9bmV3IERhdGFWaWV3KGFycmF5YnVmZmVyKTtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcihhcnJheWJ1ZmZlci5ieXRlTGVuZ3RoKzUpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLGNvbW1hbmROdW0pO1xuICAgICAgICBjaWQ9Y2lkPT09bnVsbD90aGlzLmNyZWF0ZUNvbW1hbmRJRDpjaWQ7Ly/jgrfjg7zjgrHjg7PjgrlJRCjjg6bjg4vjg7zjgq/lgKQpXG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigxLGNpZCk7XG4gICAgICAgIC8v44OH44O844K/44Gu5pu444GN6L6844G/XG4gICAgICAgIGZvcihsZXQgaT0wO2k8YXJyYXlidWZmZXIuYnl0ZUxlbmd0aDtpKyspe1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMytpLGFiLmdldFVpbnQ4KGkpKTtcbiAgICAgICAgfVxuICAgICAgICBsZXQgY3JjPUtNVXRsLkNyZWF0ZUNvbW1hbmRDaGVja1N1bUNSQzE2KG5ldyBVaW50OEFycmF5KGJ1ZmZlci5zbGljZSgwLGJ1ZmZlci5ieXRlTGVuZ3RoLTIpKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNihhcnJheWJ1ZmZlci5ieXRlTGVuZ3RoKzMsY3JjKTsvL2luZm86OkNSQ+ioiOeul1xuXG4gICAgICAgIC8vcXVl44Gr6L+95YqgXG4gICAgICAgLy8gKyt0aGlzLl9xdWVDb3VudDtcbiAgICAgICAgdGhpcy5fYmxlU2VuZGluZ1F1ZT0gdGhpcy5fYmxlU2VuZGluZ1F1ZS50aGVuKChyZXMpPT57XG4gICAgICAgICAgLy8gIGNvbnNvbGUubG9nKFwiX3NlbmRNb3RvckNvbW1hbmQgcXVlQ291bnQ6XCIrKC0tdGhpcy5fcXVlQ291bnQpKTtcbiAgICAgICAgICAgIGlmKG5vdGlmeVByb21pcyl7XG4gICAgICAgICAgICAgICAgbm90aWZ5UHJvbWlzLnN0YXJ0UmVqZWN0VGltZU91dENvdW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gY2hhcmFjdGVyaXN0aWNzLndyaXRlVmFsdWUoYnVmZmVyKTtcbiAgICAgICAgfSkuY2F0Y2goZnVuY3Rpb24ocmVzKXtcbiAgICAgICAgICAgIC8v5aSx5pWX5pmC44CALy9pbmZvOjrlvozntprjga7jgrPjg57jg7Pjg4njga/lvJXjgY3ntprjgY3lrp/ooYzjgZXjgozjgotcbiAgICAgICAgICAvLyAgY29uc29sZS5sb2coXCJFUlIgX3NlbmRNb3RvckNvbW1hbmQ6XCIrcmVzK1wiIHF1ZUNvdW50OlwiKygtLXRoaXMuX3F1ZUNvdW50KSk7XG4gICAgICAgICAgICBpZihub3RpZnlQcm9taXMpe1xuICAgICAgICAgICAgICAgIG5vdGlmeVByb21pcy5jYWxsUmVqZWN0KHJlcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gY2lkO1xuICAgIH1cblxuXG4vLy8vLy9jbGFzcy8vXG59XG5cbm1vZHVsZS5leHBvcnRzID1LTUNvbVdlYkJMRTtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9LTUNvbVdlYkJMRS5qc1xuLy8gbW9kdWxlIGlkID0gMlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIid1c2Ugc3RyaWN0Jztcbi8qKipcbiAqS01Db25uZWN0b3JCcm93c2VyLmpzXG4gKiB2ZXJzaW9uIDAuMS4wIGFscGhhXG4gKiBDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG5nbG9iYWwuS01VdGw9cmVxdWlyZSgnLi9LTVV0bC5qcycpO1xuZ2xvYmFsLktNVmVjdG9yMj1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNVmVjdG9yMjtcbmdsb2JhbC5LTUltdVN0YXRlPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01JbXVTdGF0ZTtcbmdsb2JhbC5LTUxlZFN0YXRlPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01MZWRTdGF0ZTtcbmdsb2JhbC5LTVJvdFN0YXRlPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01Sb3RTdGF0ZTtcbmdsb2JhbC5LTURldmljZUluZm89cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTURldmljZUluZm87XG5nbG9iYWwuS01Nb3RvckxvZz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNTW90b3JMb2c7XG5nbG9iYWwuS01Nb3Rvck9uZVdlYkJMRT1yZXF1aXJlKCcuL0tNTW90b3JPbmVXZWJCTEUuanMnKTtcblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9LTUNvbm5lY3RvckJyb3dzZXJXUEsuanNcbi8vIG1vZHVsZSBpZCA9IDNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCJ2YXIgZztcclxuXHJcbi8vIFRoaXMgd29ya3MgaW4gbm9uLXN0cmljdCBtb2RlXHJcbmcgPSAoZnVuY3Rpb24oKSB7XHJcblx0cmV0dXJuIHRoaXM7XHJcbn0pKCk7XHJcblxyXG50cnkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgZXZhbCBpcyBhbGxvd2VkIChzZWUgQ1NQKVxyXG5cdGcgPSBnIHx8IEZ1bmN0aW9uKFwicmV0dXJuIHRoaXNcIikoKSB8fCAoMSxldmFsKShcInRoaXNcIik7XHJcbn0gY2F0Y2goZSkge1xyXG5cdC8vIFRoaXMgd29ya3MgaWYgdGhlIHdpbmRvdyByZWZlcmVuY2UgaXMgYXZhaWxhYmxlXHJcblx0aWYodHlwZW9mIHdpbmRvdyA9PT0gXCJvYmplY3RcIilcclxuXHRcdGcgPSB3aW5kb3c7XHJcbn1cclxuXHJcbi8vIGcgY2FuIHN0aWxsIGJlIHVuZGVmaW5lZCwgYnV0IG5vdGhpbmcgdG8gZG8gYWJvdXQgaXQuLi5cclxuLy8gV2UgcmV0dXJuIHVuZGVmaW5lZCwgaW5zdGVhZCBvZiBub3RoaW5nIGhlcmUsIHNvIGl0J3NcclxuLy8gZWFzaWVyIHRvIGhhbmRsZSB0aGlzIGNhc2UuIGlmKCFnbG9iYWwpIHsgLi4ufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBnO1xyXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAod2VicGFjaykvYnVpbGRpbi9nbG9iYWwuanNcbi8vIG1vZHVsZSBpZCA9IDRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKioqXG4gKktNTW90b3JPbmVXZWJCTEUuanNcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcblxubGV0IEtNQ29tV2ViQkxFID0gcmVxdWlyZSgnLi9LTUNvbVdlYkJMRScpO1xubGV0IEtNTW90b3JDb21tYW5kS01PbmU9cmVxdWlyZSgnLi9LTU1vdG9yQ29tbWFuZEtNT25lLmpzJyk7XG5cbi8qKlxuICogQGNsYXNzZGVzYyBLTS0x44GuV2ViQmx1ZXRvb2jmjqXntprnlKgg5Luu5oOz44OH44OQ44Kk44K5XG4gKi9cbmNsYXNzIEtNTW90b3JPbmVXZWJCTEUgZXh0ZW5kcyBLTU1vdG9yQ29tbWFuZEtNT25le1xuICAgIC8qKlxuICAgICAqIEtNTW90b3JPbmVXZWJCTEVcbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTU1vdG9yQ29tbWFuZEtNT25lXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoS01Nb3RvckNvbW1hbmRLTU9uZS5LTV9DT05ORUNUX1RZUEUuV0VCQkxFLG5ldyBLTUNvbVdlYkJMRSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgajmjqXntprjgZnjgotcbiAgICAgKi9cbiAgICBjb25uZWN0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLmNvbm5lY3QoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgajliIfmlq1cbiAgICAgKi9cbiAgICBkaXNDb25uZWN0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLmRpc0Nvbm5lY3QoKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID1LTU1vdG9yT25lV2ViQkxFO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNTW90b3JPbmVXZWJCTEUuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKioqXG4gKiBLTUNvbUJhc2UuanNcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmxldCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcbmxldCBLTVN0cnVjdHVyZXM9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMnKTtcbi8qKlxuICogQGNsYXNzZGVzYyDpgJrkv6Hjgq/jg6njgrnjga7ln7rlupVcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01Db21CYXNle1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5a6a5pWwXG4gICAgKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvcuOAgFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuX2NvbW1hbmRDb3VudD0wO1xuICAgICAgICB0aGlzLl9kZXZpY2VJbmZvPW5ldyBLTVN0cnVjdHVyZXMuS01EZXZpY2VJbmZvKCk7XG5cbiAgICAgICAgdGhpcy5fbW90b3JNZWFzdXJlbWVudD1uZXcgS01TdHJ1Y3R1cmVzLktNUm90U3RhdGUoKTtcbiAgICAgICAgdGhpcy5fbW90b3JMZWQ9bmV3IEtNU3RydWN0dXJlcy5LTUxlZFN0YXRlKCk7XG4gICAgICAgIHRoaXMuX21vdG9ySW11TWVhc3VyZW1lbnQ9bmV3IEtNU3RydWN0dXJlcy5LTUltdVN0YXRlKCk7XG5cbiAgICAgICAgdGhpcy5fb25Jbml0SGFuZGxlcj1mdW5jdGlvbihjb25uZWN0b3Ipe307XG4gICAgICAgIHRoaXMuX29uQ29ubmVjdEhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yKXt9O1xuICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyPWZ1bmN0aW9uKGNvbm5lY3Rvcil7fTtcbiAgICAgICAgdGhpcy5fb25Db25uZWN0RmFpbHVyZUhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yLCBtc2cpe307XG5cbiAgICAgICAgdGhpcy5fb25Nb3Rvck1lYXN1cmVtZW50Q0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9vbkltdU1lYXN1cmVtZW50Q0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9vbk1vdG9yU2V0dGluZ0NCPWZ1bmN0aW9uKCl7fTtcbiAgICAgICAgdGhpcy5fb25Nb3RvckxvZ0NCPWZ1bmN0aW9uKCl7fTtcbiAgICAgICAgdGhpcy5faXNJbml0PWZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBfb25CbGVNb3RvclNldHRpbmfjga7jgrPjg57jg7Pjg4njgIDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHjga7pgJrnn6Xlj5fkv6HmmYLjgavjg5Hjg7zjgrnjgZnjgovnlKhcbiAgICAgICAgICogQHR5cGUge3ttYXhTcGVlZDogbnVtYmVyLCBtaW5TcGVlZDogbnVtYmVyLCBjdXJ2ZVR5cGU6IG51bWJlciwgYWNjOiBudW1iZXIsIGRlYzogbnVtYmVyLCBtYXhUb3JxdWU6IG51bWJlciwgcUN1cnJlbnRQOiBudW1iZXIsIHFDdXJyZW50STogbnVtYmVyLCBxQ3VycmVudEQ6IG51bWJlciwgc3BlZWRQOiBudW1iZXIsIHNwZWVkSTogbnVtYmVyLCBzcGVlZEQ6IG51bWJlciwgcG9zaXRpb25QOiBudW1iZXIsIG93bkNvbG9yOiBudW1iZXJ9fVxuICAgICAgICAgKiBAaWdub3JlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORD17XG4gICAgICAgICAgICAgICAgXCJtYXhTcGVlZFwiOjB4MDIsXG4gICAgICAgICAgICAgICAgXCJtaW5TcGVlZFwiOjB4MDMsXG4gICAgICAgICAgICAgICAgXCJjdXJ2ZVR5cGVcIjoweDA1LFxuICAgICAgICAgICAgICAgIFwiYWNjXCI6MHgwNyxcbiAgICAgICAgICAgICAgICBcImRlY1wiOjB4MDgsXG4gICAgICAgICAgICAgICAgXCJtYXhUb3JxdWVcIjoweDBFLFxuICAgICAgICAgICAgICAgIFwidGVhY2hpbmdJbnRlcnZhbFwiOjB4MTYsXG4gICAgICAgICAgICAgICAgXCJwbGF5YmFja0ludGVydmFsXCI6MHgxNyxcbiAgICAgICAgICAgICAgICBcInFDdXJyZW50UFwiOjB4MTgsXG4gICAgICAgICAgICAgICAgXCJxQ3VycmVudElcIjoweDE5LFxuICAgICAgICAgICAgICAgIFwicUN1cnJlbnREXCI6MHgxQSxcbiAgICAgICAgICAgICAgICBcInNwZWVkUFwiOjB4MUIsXG4gICAgICAgICAgICAgICAgXCJzcGVlZElcIjoweDFDLFxuICAgICAgICAgICAgICAgIFwic3BlZWREXCI6MHgxRCxcbiAgICAgICAgICAgICAgICBcInBvc2l0aW9uUFwiOjB4MUUsXG4gICAgICAgICAgICAgICAgXCJwb3NpdGlvbklcIjoweDFGLFxuICAgICAgICAgICAgICAgIFwicG9zaXRpb25EXCI6MHgyMCxcbiAgICAgICAgICAgICAgICBcInBvc0NvbnRyb2xUaHJlc2hvbGRcIjoweDIxLFxuXG4gICAgICAgICAgICAgICAgXCJub3RpZnlQb3NBcnJpdmFsXCI6MHgyQixcbiAgICAgICAgICAgICAgICBcIm1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbFwiOjB4MkMsXG4gICAgICAgICAgICAgICAgXCJtb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0XCI6MHgyRCxcbiAgICAgICAgICAgICAgICBcImludGVyZmFjZVwiOjB4MkUsXG4gICAgICAgICAgICAgICAgXCJyZXNwb25zZVwiOjB4MzAsXG4gICAgICAgICAgICAgICAgXCJvd25Db2xvclwiOjB4M0EsXG4gICAgICAgICAgICAgICAgXCJpTVVNZWFzdXJlbWVudEludGVydmFsXCI6MHgzQyxcbiAgICAgICAgICAgICAgICBcImlNVU1lYXN1cmVtZW50QnlEZWZhdWx0XCI6MHgzRCxcbiAgICAgICAgICAgICAgICBcImRldmljZU5hbWVcIjoweDQ2LFxuICAgICAgICAgICAgICAgIFwiZGV2aWNlSW5mb1wiOjB4NDcsXG4gICAgICAgICAgICAgICAgXCJzcGVlZFwiOjB4NTgsXG4gICAgICAgICAgICAgICAgXCJwb3NpdGlvbk9mZnNldFwiOjB4NUIsXG4gICAgICAgICAgICAgICAgXCJtb3ZlVG9cIjoweDY2LFxuICAgICAgICAgICAgICAgIFwiaG9sZFwiOjB4NzIsXG4gICAgICAgICAgICAgICAgXCJzdGF0dXNcIjoweDlBLFxuICAgICAgICAgICAgICAgIFwidGFza3NldE5hbWVcIjoweEE1LFxuICAgICAgICAgICAgICAgIFwidGFza3NldEluZm9cIjoweEE2LFxuICAgICAgICAgICAgICAgIFwidGFza3NldFVzYWdlXCI6MHhBNyxcbiAgICAgICAgICAgICAgICBcIm1vdGlvbk5hbWVcIjoweEFGLFxuICAgICAgICAgICAgICAgIFwibW90aW9uSW5mb1wiOjB4QjAsXG4gICAgICAgICAgICAgICAgXCJtb3Rpb25Vc2FnZVwiOjB4QjEsXG4gICAgICAgICAgICAgICAgXCJpMkNTbGF2ZUFkZHJlc3NcIjoweEMwLFxuICAgICAgICAgICAgICAgIFwidWFydEJhdWRSYXRlXCI6MHhDMyxcbiAgICAgICAgICAgICAgICBcImxlZFwiOjB4RTAsXG4gICAgICAgICAgICAgICAgXCJlbmFibGVDaGVja1N1bVwiOjB4RjMsXG4gICAgICAgICAgICAgICAgXCJkZXZpY2VTZXJpYWxcIjoweEZBXG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zjg63jgrDnlKjjgqjjg6njg7zjgrPjg7zjg4nooahcbiAgICAgICAgICogQHR5cGUge3t9fVxuICAgICAgICAgKiBAaWdub3JlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9NT1RPUl9MT0dfRVJST1JDT0RFPXtcbiAgICAgICAgICAgIDA6e2lkOjAsdHlwZTpcIktNX1NVQ0NFU1NcIixtc2c6XCJTdWNjZXNzZnVsIGNvbW1hbmRcIn0sLy/miJDlip/mmYLjgavov5TljbTjgZnjgotcbiAgICAgICAgICAgIDE6e2lkOjEsdHlwZTpcIktNX0VSUk9SX0lOVEVSTkFMXCIsbXNnOlwiSW50ZXJuYWwgRXJyb3JcIn0sLy/lhoXpg6jjgqjjg6njg7xcbiAgICAgICAgICAgIDI6e2lkOjIsdHlwZTpcIktNX0VSUk9SX05PX01FTVwiLG1zZzpcIk5vIE1lbW9yeSBmb3Igb3BlcmF0aW9uXCJ9LC8v44Oh44Oi44Oq5LiN6LazXG4gICAgICAgICAgICAzOntpZDozLHR5cGU6XCJLTV9FUlJPUl9OT1RfRk9VTkRcIixtc2c6XCJOb3QgZm91bmRcIn0sLy/opovjgaTjgYvjgonjgarjgYRcbiAgICAgICAgICAgIDQ6e2lkOjQsdHlwZTpcIktNX0VSUk9SX05PVF9TVVBQT1JURURcIixtc2c6XCJOb3Qgc3VwcG9ydGVkXCJ9LC8v44K144Od44O844OI5aSWXG4gICAgICAgICAgICA1OntpZDo1LHR5cGU6XCJLTV9FUlJPUl9JTlZBTElEX0NPTU1BTkRcIixtc2c6XCJJbnZhbGlkIENvbW1hbmRcIn0sLy/kuI3mraPjgarjgrPjg57jg7Pjg4lcbiAgICAgICAgICAgIDY6e2lkOjYsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfUEFSQU1cIixtc2c6XCJJbnZhbGlkIFBhcmFtZXRlclwifSwvL+S4jeato+OBquW8leaVsFxuICAgICAgICAgICAgNzp7aWQ6Nyx0eXBlOlwiS01fRVJST1JfU1RPUkFHRV9GVUxMXCIsbXNnOlwiU3RvcmFnZSBpcyBmdWxsXCJ9LC8v6KiY6Yyy6aCY5Z+f44GM5LiA5p2vXG4gICAgICAgICAgICA4OntpZDo4LHR5cGU6XCJLTV9FUlJPUl9JTlZBTElEX0ZMQVNIX1NUQVRFXCIsbXNnOlwiSW52YWxpZCBmbGFzaCBzdGF0ZSwgb3BlcmF0aW9uIGRpc2FsbG93ZWQgaW4gdGhpcyBzdGF0ZVwifSwvL+ODleODqeODg+OCt+ODpeOBrueKtuaFi+OBjOS4jeato1xuICAgICAgICAgICAgOTp7aWQ6OSx0eXBlOlwiS01fRVJST1JfSU5WQUxJRF9MRU5HVEhcIixtc2c6XCJJbnZhbGlkIExlbmd0aFwifSwvL+S4jeato+OBquW8leaVsOOBrumVt+OBle+8iOOCteOCpOOCuu+8iVxuICAgICAgICAgICAgMTA6e2lkOjEwLHR5cGU6XCJLTV9FUlJPUl9JTlZBTElEX0NIRUNLU1VNXCIsbXNnOlwiSW52YWxpZCBDaGVjayBTdW0gKFZhbGlkYXRpb24gaXMgZmFpbGVkKVwifSwvL+S4jeato+OBquODgeOCp+ODg+OCr+OCteODoFxuICAgICAgICAgICAgMTM6e2lkOjEzLHR5cGU6XCJLTV9FUlJPUl9USU1FT1VUXCIsbXNnOlwiT3BlcmF0aW9uIHRpbWVkIG91dFwifSwvL+OCv+OCpOODoOOCouOCpuODiFxuICAgICAgICAgICAgMTU6e2lkOjE1LHR5cGU6XCJLTV9FUlJPUl9GT1JCSURERU5cIixtc2c6XCJGb3JiaWRkZW4gT3BlcmF0aW9uXCJ9LC8v5LiN6Kix5Y+v44Gq5pON5L2cXG4gICAgICAgICAgICAxNjp7aWQ6MTYsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfQUREUlwiLG1zZzpcIkJhZCBNZW1vcnkgQWRkcmVzc1wifSwvL+S4jeato+OBquOCouODieODrOOCueWPgueFp1xuICAgICAgICAgICAgMTc6e2lkOjE3LHR5cGU6XCJLTV9FUlJPUl9CVVNZXCIsbXNnOlwiQnVzeVwifSwvL+ODk+OCuOODvFxuICAgICAgICAgICAgMTg6e2lkOjE4LHR5cGU6XCJLTV9FUlJPUl9SRVNPVVJDRVwiLG1zZzpcIk5vdCBlbm91Z2ggcmVzb3VyY2VzIGZvciBvcGVyYXRpb25cIn0sLy/jg6rjgr3jg7zjgrnkuI3otrNcbiAgICAgICAgICAgIDIwOntpZDoyMCx0eXBlOlwiS01fRVJST1JfTU9UT1JfRElTQUJMRURcIixtc2c6XCJNb3RvciBzdGF0ZSBpcyBkaXNhYmxlZFwifSwvL+ODouODvOOCv+ODvOOBjOWLleS9nOioseWPr+OBleOCjOOBpuOBhOOBquOBhFxuICAgICAgICAgICAgNjA6e2lkOjYwLHR5cGU6XCJLTV9FUlJPUl9ERVZJQ0VfRFJJVkVSXCIsbXNnOlwiS01fRVJST1JfREVWSUNFX0RSSVZFUlwifSwvL+WGheWuueacquWumue+qVxuICAgICAgICAgICAgNjE6e2lkOjYxLHR5cGU6XCJLTV9FUlJPUl9ERVZJQ0VfRkxBU0hcIixtc2c6XCJLTV9FUlJPUl9ERVZJQ0VfRkxBU0hcIn0sLy/lhoXlrrnmnKrlrprnvqlcbiAgICAgICAgICAgIDYyOntpZDo2Mix0eXBlOlwiS01fRVJST1JfREVWSUNFX0xFRFwiLG1zZzpcIktNX0VSUk9SX0RFVklDRV9MRURcIn0sLy/lhoXlrrnmnKrlrprnvqlcbiAgICAgICAgICAgIDYzOntpZDo2Myx0eXBlOlwiS01fRVJST1JfREVWSUNFX0lNVVwiLG1zZzpcIktNX0VSUk9SX0RFVklDRV9JTVVcIn0sLy/lhoXlrrnmnKrlrprnvqlcbiAgICAgICAgICAgIDcwOntpZDo3MCx0eXBlOlwiS01fRVJST1JfTlJGX0RFVklDRVwiLG1zZzpcIkVycm9yIHJlbGF0ZWQgdG8gQkxFIG1vZHVsZSAoblJGNTI4MzIpXCJ9LC8vQkxF44Oi44K444Ol44O844Or44Gu44Ko44Op44O8XG4gICAgICAgICAgICA4MDp7aWQ6ODAsdHlwZTpcIktNX0VSUk9SX1dEVF9FVkVOVFwiLG1zZzpcIldhdGNoIERvZyBUaW1lciBFdmVudFwifSwvL+OCpuOCqeODg+ODgeODieODg+OCsOOCv+OCpOODnuODvOOCpOODmeODs+ODiOOBrueZuuWLle+8iOWGjei1t+WLleebtOWJje+8iVxuICAgICAgICAgICAgODE6e2lkOjgxLHR5cGU6XCJLTV9FUlJPUl9PVkVSX0hFQVRcIixtc2c6XCJPdmVyIEhlYXQgKG92ZXIgdGVtcGVyYXR1cmUpXCJ9LC8v5rip5bqm55Ww5bi477yI44Oe44Kk44Kz44Oz5rip5bqm44GMMuWIhuS7peS4ijYw5bqm44KS6LaF6YGO77yJXG4gICAgICAgICAgICAxMDA6e2lkOjEwMCx0eXBlOlwiS01fU1VDQ0VTU19BUlJJVkFMXCIsbXNnOlwiUG9zaXRpb24gQXJyaXZhbCBOb3RpZmljYXRpb25cIn0vL+S9jee9ruWItuW+oeaZguOBq+aMh+WumuS9jee9ruOBq+WIsOmBlOOBl+OBn+WgtOWQiOOBrumAmuefpVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDjg5fjg63jg5Hjg4bjgqNcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDjg4fjg5DjgqTjgrnmg4XloLFcbiAgICAgKiBAdHlwZSB7S01EZXZpY2VJbmZvfVxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IGRldmljZUluZm8oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RldmljZUluZm8uQ2xvbmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmnInlirnnhKHlirlcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBnZXQgaXNDb25uZWN0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZXZpY2VJbmZvLmlzQ29ubmVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgrPjg57jg7Pjg4npoIbnm6PoppbnlKjpgKPnlarjga7nmbrooYxcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBjcmVhdGVDb21tYW5kSUQoKXtcbiAgICAgICByZXR1cm4gdGhpcy5fY29tbWFuZENvdW50PSgrK3RoaXMuX2NvbW1hbmRDb3VudCkmMGIxMTExMTExMTExMTExMTExOy8vNjU1MzXjgafjg6vjg7zjg5dcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpc0Nvbm5lY3Tjga7oqK3lrprlpInmm7Qo5a2Q44Kv44Op44K544GL44KJ5L2/55SoKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYm9vbFxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBfc3RhdHVzQ2hhbmdlX2lzQ29ubmVjdChib29sKXtcbiAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q9Ym9vbDtcbiAgICAgICAgaWYodGhpcy5faXNJbml0KXtcbiAgICAgICAgICAgIGlmKGJvb2wpe1xuICAgICAgICAgICAgICAgIHRoaXMuX29uQ29ubmVjdEhhbmRsZXIodGhpcyk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yid5pyf5YyW54q25oWL44Gu6Kit5a6aKOWtkOOCr+ODqeOCueOBi+OCieS9v+eUqClcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJvb2xcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgX3N0YXR1c0NoYW5nZV9pbml0KGJvb2wpe1xuICAgICAgICB0aGlzLl9pc0luaXQ9Ym9vbDtcbiAgICAgICAgaWYodGhpcy5faXNJbml0KXtcbiAgICAgICAgICAgIHRoaXMuX29uSW5pdEhhbmRsZXIodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBjYWxsYmFja1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIOWIneacn+WMluWujOS6huOBl+OBpuWIqeeUqOOBp+OBjeOCi+OCiOOBhuOBq+OBquOBo+OBn1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihLTUNvbUJhc2UpfVxuICAgICAqL1xuICAgIHNldCBvbkluaXQoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Jbml0SGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog5b+c562U44O75YaN5o6l57aa44Gr5oiQ5Yqf44GX44GfXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKEtNQ29tQmFzZSl9XG4gICAgICovXG4gICAgc2V0IG9uQ29ubmVjdChoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDlv5znrZTjgYznhKHjgY/jgarjgaPjgZ/jg7vliIfmlq3jgZXjgozjgZ9cbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oS01Db21CYXNlKX1cbiAgICAgKi9cbiAgICBzZXQgb25EaXNjb25uZWN0KGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uRGlzY29ubmVjdEhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOaOpee2muOBq+WkseaVl1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihLTUNvbUJhc2Usc3RyaW5nKX1cbiAgICAgKi9cbiAgICBzZXQgb25Db25uZWN0RmFpbHVyZShoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RGYWlsdXJlSGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga7lm57ou6Lmg4XloLFjYWxsYmFja1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihwb3NpdGlvbjpudW1iZXIsdmVsb2NpdHk6bnVtYmVyLHRvcnF1ZTpudW1iZXIpfVxuICAgICAqL1xuICAgIHNldCBvbk1vdG9yTWVhc3VyZW1lbnQoZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JNZWFzdXJlbWVudENCPWZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Gu44K444Oj44Kk44Ot5oOF5aCxY2FsbGJhY2tcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oe2FjY2VsWDpudW1iZXIsYWNjZWxZOm51bWJlcixhY2NlbFo6bnVtYmVyLHRlbXA6bnVtYmVyLGd5cm9YOm51bWJlcixneXJvWTpudW1iZXIsZ3lyb1o6bnVtYmVyfSl9XG4gICAgICovXG4gICAgc2V0IG9uSW11TWVhc3VyZW1lbnQoZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uSW11TWVhc3VyZW1lbnRDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O86Kit5a6a5oOF5aCx5Y+W5b6XY2FsbGJhY2tcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24ocmVnaXN0ZXJDbWQ6bnVtYmVyLHJlczpudW1iZXIpfVxuICAgICAqL1xuICAgIHNldCBvbk1vdG9yU2V0dGluZyhmdW5jKXtcbiAgICAgICAgaWYodHlwZW9mIGZ1bmM9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Nb3RvclNldHRpbmdDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOODreOCsOaDheWgseWPluW+l2NhbGxiYWNrXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKGNtZElEOm51bWJlcixyZXM6ZXJyb3Jsb2dPYmplY3QpfVxuICAgICAqL1xuICAgIHNldCBvbk1vdG9yTG9nKGZ1bmMpe1xuICAgICAgICBpZih0eXBlb2YgZnVuYz09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yTG9nQ0I9ZnVuYztcbiAgICAgICAgfVxuICAgIH1cblxuLy8vLy8vY2xhc3MvL1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9S01Db21CYXNlO1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNQ29tQmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKipcbiAqIEtNTW90b3JDb21tYW5kS01PbmUuanNcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoXCJldmVudHNcIikuRXZlbnRFbWl0dGVyO1xuY29uc3QgS01VdGwgPSByZXF1aXJlKCcuL0tNVXRsJyk7XG5jb25zdCBLTUNvbVdlYkJMRSA9IHJlcXVpcmUoJy4vS01Db21XZWJCTEUnKTtcbmNvbnN0IEtNU3RydWN0dXJlcz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcycpO1xuXG5cbi8qKlxuICogQGNsYXNzZGVzYyBLTTHjgrPjg57jg7Pjg4npgIHkv6Hjgq/jg6njgrlcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01Nb3RvckNvbW1hbmRLTU9uZSBleHRlbmRzIEV2ZW50RW1pdHRlcntcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlrprmlbBcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICog5o6l57aa5pa55byP5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gV0VCQkxFIC0gMTpXRUJCTEVcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gQkxFIC0gMjpCTEVcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gU0VSSUFMIC0gMzpTRVJJQUxcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IEtNX0NPTk5FQ1RfVFlQRSgpe1xuICAgICAgICByZXR1cm4ge1wiV0VCQkxFXCI6MSxcIkJMRVwiOjIsXCJTRVJJQUxcIjozfTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIGNtZFByZXBhcmVQbGF5YmFja01vdGlvbuOBrumWi+Wni+S9jee9ruOCquODl+OCt+ODp+ODs+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFNUQVJUX1BPU0lUSU9OX0FCUyAtIDA66KiY5oa244GV44KM44Gf6ZaL5aeL5L2N572u77yI57W25a++5bqn5qiZ77yJ44GL44KJ44K544K/44O844OIXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFNUQVJUX1BPU0lUSU9OX0NVUlJFTlQgLSAxOuePvuWcqOOBruS9jee9ruOCkumWi+Wni+S9jee9ruOBqOOBl+OBpuOCueOCv+ODvOODiFxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdTVEFSVF9QT1NJVElPTl9BQlMnOjAsXG4gICAgICAgICAgICAnU1RBUlRfUE9TSVRJT05fQ1VSUkVOVCc6MVxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjbWRMZWTjga5MRUTjga7ngrnnga/nirbmhYvjgqrjg5fjgrfjg6fjg7PlrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBMRURfU1RBVEVfT0ZGIC0gMDrmtojnga9cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTEVEX1NUQVRFX09OX1NPTElEIC0gMTpMRUTngrnnga/vvIjngrnnga/jgZfjgaPjgbHjgarjgZfvvIlcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTEVEX1NUQVRFX09OX0ZMQVNIIC0gMjpMRUTngrnmu4XvvIjkuIDlrprplpPpmpTjgafngrnmu4XvvIlcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTEVEX1NUQVRFX09OX0RJTSAtIDozTEVE44GM44KG44Gj44GP44KK5piO5ruF44GZ44KLXG4gICAgICovXG4gICAgc3RhdGljIGdldCBjbWRMZWRfTEVEX1NUQVRFKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdMRURfU1RBVEVfT0ZGJzowLFxuICAgICAgICAgICAgJ0xFRF9TVEFURV9PTl9TT0xJRCc6MSxcbiAgICAgICAgICAgICdMRURfU1RBVEVfT05fRkxBU0gnOjIsXG4gICAgICAgICAgICAnTEVEX1NUQVRFX09OX0RJTSc6M1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjbWRDdXJ2ZVR5cGXjga7liqDmuJvpgJ/jgqvjg7zjg5bjgqrjg5fjgrfjg6fjg7PlrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBDVVJWRV9UWVBFX05PTkUgLSAwOuODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPRkZcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gQ1VSVkVfVFlQRV9UUkFQRVpPSUQgLSAxOuODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPTiDvvIjlj7DlvaLliqDmuJvpgJ/vvIlcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdDVVJWRV9UWVBFX05PTkUnOiAwLFxuICAgICAgICAgICAgJ0NVUlZFX1RZUEVfVFJBUEVaT0lEJzoxXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY21kTW90b3JNZWFzdXJlbWVudEludGVydmFs44Gu44Oi44O844K/44O85ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqU5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF81TVMgLSAwOjVNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzEwTVMgLSAxOjEwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8yME1TIC0gMjoyME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfNTBNUyAtIDM6NTBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzEwME1TIC0gNDoxMDBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzIwME1TIC0gNToyMDBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzUwME1TIC0gNjo1MDBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzEwMDBNUyAtIDc6MTAwME1TXG4gICAgICovXG4gICAgc3RhdGljIGdldCBjbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxfTU9UT1JfTUVBU19JTlRFUlZBTCgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF81TVMnOiAwLFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfMTBNUyc6MSxcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzIwTVMnOjIsXG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF81ME1TJzozLFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfMTAwTVMnOjQsXG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF8yMDBNUyc6NSxcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzUwME1TJzo2LFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfMTAwME1TJzo3XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWzjga7liqDpgJ/luqbjg7vjgrjjg6PjgqTjg63muKzlrprlgKTjga7lj5blvpfplpPpmpTlrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzVNUyAtIDA6NU1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTBNUyAtIDE6MTBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzIwTVMgLSAyOjIwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF81ME1TIC0gMzo1ME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTAwTVMgLSA0OjEwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMjAwTVMgLSA1OjIwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfNTAwTVMgLSA2OjUwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTAwME1TIC0gNzoxMDAwTVNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUwoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ0lNVV9NRUFTX0lOVEVSVkFMXzVNUyc6IDAsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfMTBNUyc6MSxcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF8yME1TJzoyLFxuICAgICAgICAgICAgJ0lNVV9NRUFTX0lOVEVSVkFMXzUwTVMnOjMsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfMTAwTVMnOjQsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfMjAwTVMnOjUsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfNTAwTVMnOjYsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfMTAwME1TJzo3XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qXG4gICAgKiBSZWFkUmVnaXN0ZXLjgaflj5blvpfjgZnjgovmmYLnlKjjga7jgrPjg57jg7Pjg4nlvJXmlbDlrprmlbBcbiAgICAqIEByZWFkb25seVxuICAgICogQGVudW0ge251bWJlcn1cbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtYXhTcGVlZCAtIDI65pyA5aSn6YCf44GVXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gbWluU3BlZWQgLSAzOuacgOWwj+mAn+OBlVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGN1cnZlVHlwZSAtIDU65Yqg5rib6YCf5puy57eaXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gYWNjIC0gNzrliqDpgJ/luqZcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkZWMgLSA4Oua4m+mAn+W6plxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IG1heFRvcnF1ZSAtIDE0OuacgOWkp+ODiOODq+OCr1xuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHFDdXJyZW50UCAtIDI0OnHou7jpm7vmtYFQSUTjgrLjgqTjg7MoUClcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBxQ3VycmVudEkgLSAyNTpx6Lu46Zu75rWBUElE44Ky44Kk44OzKEkpXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcUN1cnJlbnREIC0gMjY6cei7uOmbu+a1gVBJROOCsuOCpOODsyhEKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHNwZWVkUCAtIDI3OumAn+W6plBJROOCsuOCpOODsyhQKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHNwZWVkSSAtIDI4OumAn+W6plBJROOCsuOCpOODsyhJKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHNwZWVkRCAtIDI5OumAn+W6plBJROOCsuOCpOODsyhEKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHBvc2l0aW9uUCAtIDMwOuS9jee9rlBJROOCsuOCpOODsyhQKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHBvc2l0aW9uSSAtIDMxOuS9jee9rlBJROOCsuOCpOODsyhJKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHBvc2l0aW9uRCAtIDMyOuS9jee9rlBJROOCsuOCpOODsyhEKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHBvc0NvbnRyb2xUaHJlc2hvbGQgLSAzMzrjg6Ljg7zjgr/jg7zjga7kvY3nva7liLblvqHmmYLjgIFJROWItuW+oeOCkuacieWKueOBq+OBmeOCi+WBj+W3ruOBrue1tuWvvuWApFxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGludGVyZmFjZSAtIDQ2OuODouODvOOCv+ODvOmAmuS/oee1jOi3r1xuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHJlc3BvbnNlIC0gNDg644Kz44Oe44Oz44OJ44KS5Y+X5L+h44GX44Gf44Go44GN44Gr6YCa55+l44GZ44KL44GLXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gb3duQ29sb3IgLSA1ODrjg4fjg5DjgqTjgrlMRUTjga7lm7rmnInoibJcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkZXZpY2VOYW1lIC0gNzA6XG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gZGV2aWNlSW5mbyAtIDcxOlxuICAgICovXG4gICAgc3RhdGljIGdldCBjbWRSZWFkUmVnaXN0ZXJfQ09NTUFORCgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICBcIm1heFNwZWVkXCI6MHgwMiwvL1xuICAgICAgICAgICAgXCJtaW5TcGVlZFwiOjB4MDMsLy9cbiAgICAgICAgICAgIFwiY3VydmVUeXBlXCI6MHgwNSwvL1xuICAgICAgICAgICAgXCJhY2NcIjoweDA3LC8vXG4gICAgICAgICAgICBcImRlY1wiOjB4MDgsLy9cbiAgICAgICAgICAgIFwibWF4VG9ycXVlXCI6MHgwRSwvL1xuICAgICAgICAgICAgXCJ0ZWFjaGluZ0ludGVydmFsXCI6MHgxNiwvL1xuICAgICAgICAgICAgXCJwbGF5YmFja0ludGVydmFsXCI6MHgxNywvL1xuICAgICAgICAgICAgXCJxQ3VycmVudFBcIjoweDE4LC8vXG4gICAgICAgICAgICBcInFDdXJyZW50SVwiOjB4MTksLy9cbiAgICAgICAgICAgIFwicUN1cnJlbnREXCI6MHgxQSwvL1xuICAgICAgICAgICAgXCJzcGVlZFBcIjoweDFCLC8vXG4gICAgICAgICAgICBcInNwZWVkSVwiOjB4MUMsLy9cbiAgICAgICAgICAgIFwic3BlZWREXCI6MHgxRCwvL1xuICAgICAgICAgICAgXCJwb3NpdGlvblBcIjoweDFFLC8vXG4gICAgICAgICAgICBcInBvc2l0aW9uSVwiOjB4MUYsLy9cbiAgICAgICAgICAgIFwicG9zaXRpb25EXCI6MHgyMCwvL1xuICAgICAgICAgICAgXCJwb3NDb250cm9sVGhyZXNob2xkXCI6MHgyMSwvL1xuICAgICAgICAgICAgLy9cIm5vdGlmeVBvc0Fycml2YWxcIjoweDJCLFxuICAgICAgICAgICAgXCJtb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxcIjoweDJDLC8vXG4gICAgICAgICAgICBcIm1vdG9yTWVhc3VyZW1lbnRCeURlZmF1bHRcIjoweDJELC8vXG4gICAgICAgICAgICBcImludGVyZmFjZVwiOjB4MkUsLy9cbiAgICAgICAgICAgIC8vXCJyZXNwb25zZVwiOjB4MzAsLy90b2RvOjrlgKTjgYzlj5blvpflh7rmnaXjgarjgYQgMi4yNFxuICAgICAgICAgICAgXCJvd25Db2xvclwiOjB4M0EsLy9cbiAgICAgICAgICAgIFwiaU1VTWVhc3VyZW1lbnRJbnRlcnZhbFwiOjB4M0MsLy9cbiAgICAgICAgICAgIFwiaU1VTWVhc3VyZW1lbnRCeURlZmF1bHRcIjoweDNELC8vXG4gICAgICAgICAgICBcImRldmljZU5hbWVcIjoweDQ2LC8vXG4gICAgICAgICAgICBcImRldmljZUluZm9cIjoweDQ3LC8vXG4gICAgICAgICAgICBcInNwZWVkXCI6MHg1OCwvL1xuICAgICAgICAgICAgXCJwb3NpdGlvbk9mZnNldFwiOjB4NUIsLy9cbiAgICAgICAgICAgIFwibW92ZVRvXCI6MHg2NiwvL1xuICAgICAgICAgICAgXCJob2xkXCI6MHg3MiwvL1xuICAgICAgICAgICAgXCJzdGF0dXNcIjoweDlBLC8vXG4gICAgICAgICAgICBcImkyQ1NsYXZlQWRkcmVzc1wiOjB4QzAsLy9cbiAgICAgICAgICAgIFwidWFydEJhdWRSYXRlXCI6MHhDMyxcbiAgICAgICAgICAgIFwibGVkXCI6MHhFMCwvL1xuICAgICAgICAgICAgXCJlbmFibGVDaGVja1N1bVwiOjB4RjMvL1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKlxuICAgICAgICog44Oi44O844K/44O85Yi25b6h5omL5q6177yI44Kk44Oz44K/44O844OV44Kn44Kk44K577yJ44Gu57WM6Lev5oyH5a6a55So5a6a5pWwXG4gICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gQkxFIC0gMHgxOkJMRVxuICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFVTQiAtIDB4MTAwMDpVU0JcbiAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBJMkMgLSAweDEwMDAwOkkyQ1xuICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IEhEREJUTiAtIDB4MTAwMDAwMDA654mp55CG44Oc44K/44OzXG4gICAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZEludGVyZmFjZV9JTlRFUkZBQ0VfVFlQRSgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICBcIkJMRVwiOjBiMSxcbiAgICAgICAgICAgIFwiVVNCXCI6MGIxMDAwLFxuICAgICAgICAgICAgXCJJMkNcIjowYjEwMDAwLFxuICAgICAgICAgICAgXCJIRERCVE5cIjowYjEwMDAwMDAwXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9y44CAXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLktNX0NPTk5FQ1RfVFlQRX0gY29ubmVjdF90eXBlIOaOpee2muaWueW8j1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBrbWNvbSDpgJrkv6Hjgqrjg5bjgrjjgqfjgq/jg4gge0BsaW5rIEtNQ29tQkxFfSB7QGxpbmsgS01Db21XZWJCTEV9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihjb25uZWN0X3R5cGUsa21jb20pe1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjgqTjg5njg7Pjg4jjgr/jgqTjg5flrprmlbBcbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqIEBlbnVtIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLkVWRU5UX1RZUEU9e1xuICAgICAgICAgICAgLyoqIOWIneacn+WMluWujOS6huaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0tNRGV2aWNlSW5mb30pICovIGluaXQ6XCJpbml0XCIsXG4gICAgICAgICAgICAvKiog5o6l57aa5pmCPGJyPnJldHVybjpmdW5jdGlvbih7S01EZXZpY2VJbmZvfSkgKi8gY29ubmVjdDpcImNvbm5lY3RcIixcbiAgICAgICAgICAgIC8qKiDliIfmlq3mmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtLTURldmljZUluZm99KSAqLyBkaXNjb25uZWN0OlwiZGlzY29ubmVjdFwiLFxuICAgICAgICAgICAgLyoqIOaOpee2muOBq+WkseaVl+aZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0tNRGV2aWNlSW5mb30se21zZ30pICovIGNvbm5lY3RGYWlsdXJlOlwiY29ubmVjdEZhaWx1cmVcIixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zlm57ou6Lmg4XloLHlj5fkv6HmmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtAbGluayBLTVJvdFN0YXRlfSkgKi8gbW90b3JNZWFzdXJlbWVudDpcIm1vdG9yTWVhc3VyZW1lbnRcIixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7xJTVXmg4XloLHlj5fkv6HmmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtAbGluayBLTUltdVN0YXRlfSkgKi8gaW11TWVhc3VyZW1lbnQ6XCJpbXVNZWFzdXJlbWVudFwiLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOODreOCsOaDheWgseWPl+S/oeaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe2NtZE5hbWV9LHtlcnJvcmxvZ09iamVjdH0pICovIG1vdG9yTG9nOlwibW90b3JMb2dcIixcbiAgICAgICAgfTtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh0aGlzLkVWRU5UX1RZUEUpOy8vaW5mbzo65b6M44GL44KJ44OV44Oq44O844K644GX44Gq44GE44GoanNkb2PjgYznlJ/miJDjgZXjgozjgarjgYTjgIJcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvOOBruWFqOOCs+ODnuODs+ODiVxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICogQGVudW0ge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQGlnbm9yZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fTU9UT1JfQ09NTUFORD17XG4gICAgICAgICAgICAvKiog5pyA5aSn6YCf44GV44KS6Kit5a6a44GZ44KLICovIG1heFNwZWVkOjB4MDIsXG4gICAgICAgICAgICAvKiog5pyA5bCP6YCf44GV44KS6Kit5a6a44GZ44KLICovIG1pblNwZWVkOjB4MDMsXG4gICAgICAgICAgICAvKiog5Yqg5rib6YCf5puy57ea44KS6Kit5a6a44GZ44KLICovIGN1cnZlVHlwZToweDA1LFxuICAgICAgICAgICAgLyoqIOWKoOmAn+W6puOCkuioreWumuOBmeOCiyAqLyBhY2M6MHgwNyxcbiAgICAgICAgICAgIC8qKiDmuJvpgJ/luqbjgpLoqK3lrprjgZnjgosgKi8gZGVjOjB4MDgsXG4gICAgICAgICAgICAvKiog5pyA5aSn44OI44Or44Kv44KS6Kit5a6a44GZ44KLICovIG1heFRvcnF1ZToweDBFLFxuICAgICAgICAgICAgLyoqIOODhuOCo+ODvOODgeODs+OCsOmWk+malCAqLyB0ZWFjaGluZ0ludGVydmFsOjB4MTYsXG4gICAgICAgICAgICAvKiog44OX44Os44Kk44OQ44OD44Kv6ZaT6ZqUICovIHBsYXliYWNrSW50ZXJ2YWw6MHgxNyxcbiAgICAgICAgICAgIC8qKiBx6Lu46Zu75rWBUElE44Ky44Kk44OzKFAp44KS6Kit5a6a44GZ44KLICovIHFDdXJyZW50UDoweDE4LFxuICAgICAgICAgICAgLyoqIHHou7jpm7vmtYFQSUTjgrLjgqTjg7MoSSnjgpLoqK3lrprjgZnjgosgKi8gcUN1cnJlbnRJOjB4MTksXG4gICAgICAgICAgICAvKiogcei7uOmbu+a1gVBJROOCsuOCpOODsyhEKeOCkuioreWumuOBmeOCiyAqLyBxQ3VycmVudEQ6MHgxQSxcbiAgICAgICAgICAgIC8qKiDpgJ/luqZQSUTjgrLjgqTjg7MoUCnjgpLoqK3lrprjgZnjgosgKi8gc3BlZWRQOjB4MUIsXG4gICAgICAgICAgICAvKiog6YCf5bqmUElE44Ky44Kk44OzKEkp44KS6Kit5a6a44GZ44KLICovIHNwZWVkSToweDFDLFxuICAgICAgICAgICAgLyoqIOmAn+W6plBJROOCsuOCpOODsyhEKeOCkuioreWumuOBmeOCiyAqLyBzcGVlZEQ6MHgxRCxcbiAgICAgICAgICAgIC8qKiDkvY3nva5QSUTjgrLjgqTjg7MoUCnjgpLoqK3lrprjgZnjgosgKi8gcG9zaXRpb25QOjB4MUUsXG4gICAgICAgICAgICAvKiog5L2N572uUElE44Ky44Kk44OzKEkp44KS6Kit5a6a44GZ44KLICovIHBvc2l0aW9uSToweDFGLFxuICAgICAgICAgICAgLyoqIOS9jee9rlBJROOCsuOCpOODsyhEKeOCkuioreWumuOBmeOCiyAqLyBwb3NpdGlvbkQ6MHgyMCxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zjga7kvY3nva7liLblvqHmmYLjgIFJROWItuW+oeOCkuacieWKueOBq+OBmeOCi+WBj+W3ruOBrue1tuWvvuWApOOCkuaMh+WumuOBmeOCiyAqLyBwb3NDb250cm9sVGhyZXNob2xkOjB4MjEsXG5cbiAgICAgICAgICAgIC8qKiBQSUTjgrLjgqTjg7PjgpLjg6rjgrvjg4Pjg4jjgZnjgosgKi8gcmVzZXRQSUQ6MHgyMixcbiAgICAgICAgICAgIC8qKiDkvY3nva7liLblvqHmmYLjgIHnm67mqJnkvY3nva7jgavliLDpgZTmmYLjgIHliKTlrprmnaHku7bjgpLmuoDjgZ/jgZfjgZ/loLTlkIjpgJrnn6XjgpLooYzjgYYqLyBub3RpZnlQb3NBcnJpdmFsOjB4MkIsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O85ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqUKFVTQixJMkPjga7jgb8pICovIG1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbDoweDJDLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOa4rOWumuWApOOBruWPluW+l+ioreWumiAqLyBtb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0OjB4MkQsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O85Yi25b6h5omL5q6177yI44Kk44Oz44K/44O844OV44Kn44Kk44K577yJ44Gu6Kit5a6aICovIGludGVyZmFjZToweDJFLFxuICAgICAgICAgICAgLyoqIOOCs+ODnuODs+ODieOCkuWPl+S/oeOBl+OBn+OBqOOBjeOBq+aIkOWKn+mAmuefpe+8iGVycm9yQ29kZSA9IDDvvInjgpLjgZnjgovjgYvjganjgYbjgYsgKi8gcmVzcG9uc2U6MHgzMCxcblxuICAgICAgICAgICAgLyoqIOODh+ODkOOCpOOCuUxFROOBruWbuuacieiJsuOCkuioreWumuOBmeOCiyAqLyBvd25Db2xvcjoweDNBLFxuICAgICAgICAgICAgLyoqIElNVea4rOWumuWApOmAmuefpemWk+malO+8iOaciee3muOBruOBv++8iSAqLyBpTVVNZWFzdXJlbWVudEludGVydmFsOjB4M0MsXG4gICAgICAgICAgICAvKiog44OH44OV44Kp44Or44OI44Gn44GuSU1V5ris5a6a5YCk6YCa55+lT04vT0ZGICovIGlNVU1lYXN1cmVtZW50QnlEZWZhdWx0OjB4M0QsXG5cbiAgICAgICAgICAgIC8qKiDmjIflrprjga7oqK3lrprlgKTjgpLlj5blvpfjgZnjgosgKi8gcmVhZFJlZ2lzdGVyOjB4NDAsXG4gICAgICAgICAgICAvKiog5YWo44Gm44Gu6Kit5a6a5YCk44KS44OV44Op44OD44K344Ol44Gr5L+d5a2Y44GZ44KLICovIHNhdmVBbGxSZWdpc3RlcnM6MHg0MSxcblxuICAgICAgICAgICAgLyoqIOODh+ODkOOCpOOCueODjeODvOODoOOBruWPluW+lyAqLyByZWFkRGV2aWNlTmFtZToweDQ2LFxuICAgICAgICAgICAgLyoqIOODh+ODkOOCpOOCueaDheWgseOBruWPluW+lyAqLyByZWFkRGV2aWNlSW5mbzoweDQ3LFxuICAgICAgICAgICAgLyoqIOaMh+WumuOBruioreWumuWApOOCkuODquOCu+ODg+ODiOOBmeOCiyAqLyByZXNldFJlZ2lzdGVyOjB4NEUsXG4gICAgICAgICAgICAvKiog5YWo6Kit5a6a5YCk44KS44Oq44K744OD44OI44GZ44KLICovIHJlc2V0QWxsUmVnaXN0ZXJzOjB4NEYsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844Gu5YuV5L2c44KS5LiN6Kix5Y+v44Go44GZ44KLICovIGRpc2FibGU6MHg1MCxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zli5XkvZzjgpLoqLHlj6/jgZnjgosgKi8gZW5hYmxlOjB4NTEsXG4gICAgICAgICAgICAvKiog6YCf5bqm44Gu5aSn44GN44GV44KS6Kit5a6a44GZ44KLICovIHNwZWVkOjB4NTgsXG4gICAgICAgICAgICAvKiog5L2N572u44Gu44OX44Oq44K744OD44OI44KS6KGM44GG77yI5Y6f54K56Kit5a6a77yJICovIHByZXNldFBvc2l0aW9uOjB4NUEsXG4gICAgICAgICAgICAvKiog5L2N572u44Gu44OX44Oq44K744OD44OI44Gr6Zai44GZ44KLT0ZGU0VU6YePICovIHJlYWRQb3NpdGlvbk9mZnNldDoweDVCLFxuXG4gICAgICAgICAgICAvKiog5q2j5Zue6Lui44GZ44KL77yI5Y+N5pmC6KiI5Zue44KK77yJICovIHJ1bkZvcndhcmQ6MHg2MCxcbiAgICAgICAgICAgIC8qKiDpgIblm57ou6LjgZnjgovvvIjmmYLoqIjlm57jgorvvIkgKi8gcnVuUmV2ZXJzZToweDYxLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOCkuaMh+WumumAn+W6puOBp+Wbnui7ouOBleOBm+OCiyAqLyBydW46MHg2MixcbiAgICAgICAgICAgIC8qKiDntbblr77kvY3nva7jgavnp7vli5XjgZnjgoso6YCf5bqm44GC44KKKSAqLyBtb3ZlVG9Qb3NpdGlvblNwZWVkOjB4NjUsXG4gICAgICAgICAgICAvKiog57W25a++5L2N572u44Gr56e75YuV44GZ44KLICovIG1vdmVUb1Bvc2l0aW9uOjB4NjYsXG4gICAgICAgICAgICAvKiog55u45a++5L2N572u44Gr56e75YuV44GZ44KLKOmAn+W6puOBguOCiikgKi8gbW92ZUJ5RGlzdGFuY2VTcGVlZDoweDY3LFxuICAgICAgICAgICAgLyoqIOebuOWvvuS9jee9ruOBq+enu+WLleOBmeOCiyAqLyBtb3ZlQnlEaXN0YW5jZToweDY4LFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOBruWKseejgeOCkuWBnOatouOBmeOCiyAqLyBmcmVlOjB4NkMsXG4gICAgICAgICAgICAvKiog6YCf5bqm44K844Ot44G+44Gn5rib6YCf44GX5YGc5q2i44GZ44KLICovIHN0b3A6MHg2RCxcbiAgICAgICAgICAgIC8qKiDjg4jjg6vjgq/liLblvqHjgpLooYzjgYYgKi8gaG9sZFRvcnF1ZToweDcyLFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOCkuWun+ihjOOBmeOCiyAqLyBzdGFydERvaW5nVGFza3NldDoweDgxLFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOCkuWBnOatoiAqLyBzdG9wRG9pbmdUYXNrc2V0OjB4ODIsXG4gICAgICAgICAgICAvKiog44Oi44O844K344On44Oz44KS5YaN55Sf77yI5rqW5YKZ44Gq44GX77yJICovIHN0YXJ0UGxheWJhY2tNb3Rpb246MHg4NSxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/jgpLlgZzmraLjgZnjgosgKi8gc3RvcFBsYXliYWNrTW90aW9uOjB4ODgsXG4gICAgICAgICAgICAvKiog44Kt44Ol44O844KS5YGc5q2i44GZ44KLICovIHBhdXNlUXVldWU6MHg5MCxcbiAgICAgICAgICAgIC8qKiDjgq3jg6Xjg7zjgpLlho3plovjgZnjgosgKi8gcmVzdW1lUXVldWU6MHg5MSxcbiAgICAgICAgICAgIC8qKiDjgq3jg6Xjg7zjgpLmjIflrprmmYLplpPlgZzmraLjgZflho3plovjgZnjgosgKi8gd2FpdFF1ZXVlOjB4OTIsXG4gICAgICAgICAgICAvKiog44Kt44Ol44O844KS44Oq44K744OD44OI44GZ44KLICovIHJlc2V0UXVldWU6MHg5NSxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zjga7nirbmhYsgKi8gcmVhZFN0YXR1czoweDlBLFxuXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44KS6ZaL5aeL44GZ44KLICovIHN0YXJ0UmVjb3JkaW5nVGFza3NldDoweEEwLFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuOCkuWBnOatouOBmeOCiyAqLyBzdG9wUmVjb3JkaW5nVGFza3NldDoweEEyLFxuICAgICAgICAgICAgLyoqIOaMh+WumuOBruOCv+OCueOCr+OCu+ODg+ODiOOCkuWJiumZpOOBmeOCiyAqLyBlcmFzZVRhc2tzZXQ6MHhBMyxcbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jjgpLlhajliYrpmaTjgZnjgosgKi8gZXJhc2VBbGxUYXNrc2V0OjB4QTQsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy5ZCN6Kit5a6aICovIHNldFRhc2tzZXROYW1lOjB4QTUsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI5YaF5a655oqK5o+hICovIHJlYWRUYXNrc2V0SW5mbzoweEE2LFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOS9v+eUqOeKtuazgeaKiuaPoSAqLyByZWFkVGFza3NldFVzYWdlOjB4QTcsXG4gICAgICAgICAgICAvKiog44OA44Kk44Os44Kv44OI44OG44Kj44O844OB44Oz44Kw6ZaL5aeL77yI5rqW5YKZ44Gq44GX77yJICovIHN0YXJ0VGVhY2hpbmdNb3Rpb246MHhBOSxcbiAgICAgICAgICAgIC8qKiDjg4bjgqPjg7zjg4Hjg7PjgrDjgpLlgZzmraLjgZnjgosgKi8gc3RvcFRlYWNoaW5nTW90aW9uOjB4QUMsXG4gICAgICAgICAgICAvKiog44OG44Kj44O844OB44Oz44Kw44Gn6Kaa44GI44Gf5YuV5L2c44KS5YmK6Zmk44GZ44KLICovIGVyYXNlTW90aW9uOjB4QUQsXG4gICAgICAgICAgICAvKiog44OG44Kj44O844OB44Oz44Kw44Gn6Kaa44GI44Gf5YWo5YuV5L2c44KS5YmK6Zmk44GZ44KLICovIGVyYXNlQWxsTW90aW9uOjB4QUUsXG4gICAgICAgICAgICAvKiogSTJD44K544Os44O844OW44Ki44OJ44Os44K5ICovIHNldEkyQ1NsYXZlQWRkcmVzczoweEMwLFxuICAgICAgICAgICAgLyoqIExFROOBrueCueeBr+eKtuaFi+OCkuOCu+ODg+ODiOOBmeOCiyAqLyBsZWQ6MHhFMCxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zjga7muKzlrprlgKTlj5blvpfvvIjpgJrnn6XvvInjgpLplovlp4sgKi8gZW5hYmxlTW90b3JNZWFzdXJlbWVudDoweEU2LFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOBrua4rOWumuWApOWPluW+l++8iOmAmuefpe+8ieOCkumWi+WniyAqLyBkaXNhYmxlTW90b3JNZWFzdXJlbWVudDoweEU3LFxuICAgICAgICAgICAgLyoqIElNVeOBruWApOWPluW+lyjpgJrnn6Up44KS6ZaL5aeL44GZ44KLICovIGVuYWJsZUlNVU1lYXN1cmVtZW50OjB4RUEsXG4gICAgICAgICAgICAvKiogSU1V44Gu5YCk5Y+W5b6XKOmAmuefpSnjgpLlgZzmraLjgZnjgosgKi8gZGlzYWJsZUlNVU1lYXN1cmVtZW50OjB4RUIsXG5cbiAgICAgICAgICAgIC8qKiDjgrfjgrnjg4bjg6DjgpLlho3otbfli5XjgZnjgosgKi8gcmVib290OjB4RjAsXG4gICAgICAgICAgICAvKiog44OB44Kn44OD44Kv44K144Og77yIQ1JDMTYpIOacieWKueWMliAqLyBlbmFibGVDaGVja1N1bToweEYzLFxuICAgICAgICAgICAgLyoqIOODleOCoeODvOODoOOCpuOCp+OCouOCouODg+ODl+ODh+ODvOODiOODouODvOODieOBq+WFpeOCiyAqLyBlbnRlckRldmljZUZpcm13YXJlVXBkYXRlOjB4RkRcbiAgICAgICAgfTtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh0aGlzLl9NT1RPUl9DT01NQU5EKTsvL2luZm86OuW+jOOBi+OCieODleODquODvOOCuuOBl+OBquOBhOOBqGpzZG9j44GM55Sf5oiQ44GV44KM44Gq44GE44CCXG5cbiAgICAgICAgLy/jg6Ljg7zjgr/jg7zjga7lhajjgrPjg57jg7Pjg4nvvIjpgIblvJXnlKjvvIlcbiAgICAgICAgdGhpcy5fUkVWX01PVE9SX0NPTU1BTkQ9e307XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX01PVE9SX0NPTU1BTkQpLmZvckVhY2goKGspPT57dGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbdGhpcy5fTU9UT1JfQ09NTUFORFtrXV09azt9KTtcbiAgICAgICAgLy9TZW5kTm90aWZ5UHJvbWlz44Gu44Oq44K544OIXG4gICAgICAgIHRoaXMuX25vdGlmeVByb21pc0xpc3Q9W107XG4gICAgICAgIHRoaXMuY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OPXRoaXMuY29uc3RydWN0b3IuY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OO1xuICAgICAgICB0aGlzLmNtZExlZF9MRURfU1RBVEU9dGhpcy5jb25zdHJ1Y3Rvci5jbWRMZWRfTEVEX1NUQVRFO1xuICAgICAgICB0aGlzLmNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFPXRoaXMuY29uc3RydWN0b3IuY21kQ3VydmVUeXBlX0NVUlZFX1RZUEU7XG4gICAgICAgIHRoaXMuY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUw9dGhpcy5jb25zdHJ1Y3Rvci5jbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxfTU9UT1JfTUVBU19JTlRFUlZBTDtcbiAgICAgICAgdGhpcy5jbWRJTVVNZWFzdXJlbWVudEludGVydmFsX0lNVV9NRUFTX0lOVEVSVkFMPXRoaXMuY29uc3RydWN0b3IuY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbF9JTVVfTUVBU19JTlRFUlZBTDtcbiAgICAgICAgdGhpcy5jbWRJbnRlcmZhY2VfSU5URVJGQUNFX1RZUEU9dGhpcy5jb25zdHJ1Y3Rvci5jbWRJbnRlcmZhY2VfSU5URVJGQUNFX1RZUEU7XG4gICAgICAgIHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbj1udWxsOy8vS01fU1VDQ0VTU19BUlJJVkFM55uj6KaW55SoXG4gICAgICAgIHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvblRpbWVPdXRJZD0wO1xuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIHNlY3Rpb246OmVudHJ5IHBvaW50XG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgdGhpcy5fY29ubmVjdFR5cGU9Y29ubmVjdF90eXBlO1xuICAgICAgICB0aGlzLl9LTUNvbT1rbWNvbTtcblxuICAgICAgICAvL+WGhemDqOOCpOODmeODs+ODiOODkOOCpOODs+ODiVxuICAgICAgICB0aGlzLl9LTUNvbS5vbkluaXQ9KGNvbm5lY3Rvcik9PntcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUuaW5pdCxjb25uZWN0b3IuZGV2aWNlSW5mbyk7Ly/jg4fjg5DjgqTjgrnmg4XloLHjgpLov5TjgZlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fS01Db20ub25Db25uZWN0PShjb25uZWN0b3IpPT57XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLmNvbm5lY3QsY29ubmVjdG9yLmRldmljZUluZm8pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9LTUNvbS5vbkRpc2Nvbm5lY3Q9KGNvbm5lY3Rvcik9PntcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUuZGlzY29ubmVjdCxjb25uZWN0b3IuZGV2aWNlSW5mbyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX0tNQ29tLm9uQ29ubmVjdEZhaWx1cmU9KGNvbm5lY3RvciwgZXJyKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5jb25uZWN0RmFpbHVyZSxjb25uZWN0b3IuZGV2aWNlSW5mbyxlcnIpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICog44Oi44O844K/44O85Zue6Lui5oOF5aCx5Y+X5L+hXG4gICAgICAgICAqIEBwYXJhbSB7S01Sb3RTdGF0ZX0gcm90U3RhdGVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uTW90b3JNZWFzdXJlbWVudD0ocm90U3RhdGUpPT57XG4gICAgICAgICAgICAvL2xldCByb3RTdGF0ZT1uZXcgS01TdHJ1Y3R1cmVzLktNUm90U3RhdGUocmVzLnBvc2l0aW9uLHJlcy52ZWxvY2l0eSxyZXMudG9ycXVlKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUubW90b3JNZWFzdXJlbWVudCxyb3RTdGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7xJTVXmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIHtLTUltdVN0YXRlfSBpbXVTdGF0ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fS01Db20ub25JbXVNZWFzdXJlbWVudD0oaW11U3RhdGUpPT57XG4gICAgICAgICAgICAvL2xldCBpbXVTdGF0ZT1uZXcgS01TdHJ1Y3R1cmVzLktNSW11U3RhdGUocmVzLmFjY2VsWCxyZXMuYWNjZWxZLHJlcy5hY2NlbFoscmVzLnRlbXAscmVzLmd5cm9YLHJlcy5neXJvWSxyZXMuZ3lyb1opO1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5pbXVNZWFzdXJlbWVudCxpbXVTdGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zjg63jgrDmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGNtZElEXG4gICAgICAgICAqIEBwYXJhbSB7S01Nb3RvckxvZ30gbW90b3JMb2dcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uTW90b3JMb2c9KG1vdG9yTG9nKT0+e1xuICAgICAgICAgICAgLy/jgrPjg57jg7Pjg4lJROOBi+OCieOCs+ODnuODs+ODieWQjeOCkuWPluW+l+i/veWKoFxuICAgICAgICAgICAgbGV0IGNtZE5hbWU9dGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbbW90b3JMb2cuY21kSURdP3RoaXMuX1JFVl9NT1RPUl9DT01NQU5EW21vdG9yTG9nLmNtZElEXTptb3RvckxvZy5jbWRJRDtcbiAgICAgICAgICAgIG1vdG9yTG9nLmNtZE5hbWU9Y21kTmFtZTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUubW90b3JMb2csbW90b3JMb2cpO1xuXG4gICAgICAgICAgICAvL2luZm86OuS9jee9ruWItuW+oeaZguOAgeebruaomeS9jee9ruOBq+WIsOmBlOaZguOAgeWIpOWumuadoeS7tuOCkua6gOOBn+OBl+OBn+WgtOWQiOmAmuefpeOCkuihjOOBhlxuICAgICAgICAgICAgaWYobW90b3JMb2cuZXJySUQ9PT0xMDApey8vS01fU1VDQ0VTU19BUlJJVkFMXG4gICAgICAgICAgICAgICBpZih0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24pe1xuICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi50YWdOYW1lPT09bW90b3JMb2cuaWQpe1xuICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24uY2FsbFJlc29sdmUoe2lkOnRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi50YWdOYW1lLG1zZzonUG9zaXRpb24gQXJyaXZhbCBOb3RpZmljYXRpb24nLGluZm86bW90b3JMb2cuaW5mb30pO1xuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgIC8vIHRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi5jYWxsUmVqZWN0KHtpZDp0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24udGFnTmFtZSxtc2c6J0luc3RydWN0aW9uIG92ZXJyaWRlOicgK2NtZE5hbWUsb3ZlcnJpZGVJZDptb3RvckxvZy5pZH0pO1xuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICog44Oi44O844K/44O86Kit5a6a5oOF5aCx5Y+W5b6XXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZWdpc3RlckNtZFxuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVzXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9LTUNvbS5vbk1vdG9yU2V0dGluZz0ocmVnaXN0ZXJDbWQsIHJlcyk9PntcbiAgICAgICAgICAgIF9LTU5vdGlmeVByb21pcy5zZW5kR3JvdXBOb3RpZnlSZXNvbHZlKHRoaXMuX25vdGlmeVByb21pc0xpc3QscmVnaXN0ZXJDbWQscmVzKTtcbiAgICAgICAgfTtcblxuICAgIH1cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDjg5fjg63jg5Hjg4bjgqNcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Go44Gu5o6l57aa44GM5pyJ5Yq544GLXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgZ2V0IGlzQ29ubmVjdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fS01Db20uZGV2aWNlSW5mby5pc0Nvbm5lY3Q7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOaOpee2muaWueW8j1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtLTU1vdG9yQ29tbWFuZEtNT25lLktNX0NPTk5FQ1RfVFlQRX1cbiAgICAgKi9cbiAgICBnZXQgY29ubmVjdFR5cGUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Nvbm5lY3RUeXBlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODh+ODkOOCpOOCueaDheWgsVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtLTURldmljZUluZm99XG4gICAgICovXG4gICAgZ2V0IGRldmljZUluZm8oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0tNQ29tLmRldmljZUluZm87XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O85ZCNXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge3N0cmluZ31cbiAgICAgKi9cbiAgICBnZXQgbmFtZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fS01Db20uZGV2aWNlSW5mbz90aGlzLl9LTUNvbS5kZXZpY2VJbmZvLm5hbWU6bnVsbDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIOaOpee2muOCs+ODjeOCr+OCv+ODvFxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge0tNQ29tQmFzZX1cbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgZ2V0IGNvbm5lY3Rvcigpe1xuICAgICAgICByZXR1cm4gIHRoaXMuX0tNQ29tO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIHNlY3Rpb246OuODouODvOOCv+ODvOOCs+ODnuODs+ODiSBodHRwczovL2RvY3VtZW50LmtlaWdhbi1tb3Rvci5jb20vbW90b3ItY29udHJvbC1jb21tYW5kL21vdG9yX2FjdGlvbi5odG1sXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O85YuV5L2c44KS5LiN6Kix5Y+v44Go44GZ44KL77yI5LiK5L2N5ZG95Luk77yJXG4gICAgICogQGRlc2Mg5a6J5YWo55So77ya44GT44Gu5ZG95Luk44KS5YWl44KM44KL44Go44Oi44O844K/44O844Gv5YuV5L2c44GX44Gq44GEPGJyPlxuICAgICAqIOOCs+ODnuODs+ODieOBr+OCv+OCueOCr+OCu+ODg+ODiOOBq+iomOmMsuOBmeOCi+OBk+OBqOOBr+S4jeWPr1xuICAgICAqL1xuICAgIGNtZERpc2FibGUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmRpc2FibGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOWLleS9nOOCkuioseWPr+OBmeOCi++8iOS4iuS9jeWRveS7pO+8iVxuICAgICAqIEBkZXNjIOWuieWFqOeUqO+8muOBk+OBruWRveS7pOOCkuWFpeOCjOOCi+OBqOODouODvOOCv+ODvOOBr+WLleS9nOWPr+iDveOBqOOBquOCizxicj5cbiAgICAgKiDjg6Ljg7zjgr/jg7zotbfli5XmmYLjga8gZGlzYWJsZSDnirbmhYvjga7jgZ/jgoHjgIHmnKzjgrPjg57jg7Pjg4njgafli5XkvZzjgpLoqLHlj6/jgZnjgovlv4XopoHjgYzjgYLjgoo8YnI+XG4gICAgICog44Kz44Oe44Oz44OJ44Gv44K/44K544Kv44K744OD44OI44Gr6KiY6Yyy44GZ44KL44GT44Go44Gv5LiN5Y+vXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRFbmFibGUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVuYWJsZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOmAn+W6puOBruWkp+OBjeOBleOCkuOCu+ODg+ODiOOBmeOCi++8iOWNmOS9jeezu++8mlJQTe+8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZF9ycG0gZmxvYXQgIFswLVggcnBtXeOAgCjmraPjga7mlbApXG4gICAgICovXG4gICAgY21kU3BlZWRfcnBtKHNwZWVkX3JwbSA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChzcGVlZF9ycG0qMC4xMDQ3MTk3NTUxMTk2NTk3NywxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNwZWVkLGJ1ZmZlcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOmAn+W6puOBruWkp+OBjeOBleOCkuOCu+ODg+ODiOOBmeOCi++8iOWNmOS9jeezu++8muODqeOCuOOCouODs++8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCBmbG9hdCDpgJ/luqbjga7lpKfjgY3jgZUg5Y2Y5L2N77ya6KeS5bqm77yI44Op44K444Ki44Oz77yJL+enkiBbMC1YIHJwc13jgIAo5q2j44Gu5pWwKVxuICAgICAqL1xuICAgIGNtZFNwZWVkKHNwZWVkID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDkvY3nva7jga7jg5fjg6rjgrvjg4Pjg4jjgpLooYzjgYbvvIjljp/ngrnoqK3lrprvvInvvIjljZjkvY3ns7vvvJrjg6njgrjjgqLjg7PvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb24gZmxvYXQg57W25a++6KeS5bqm77yacmFkaWFuc1xuICAgICAqL1xuICAgIGNtZFByZXNldFBvc2l0aW9uKHBvc2l0aW9uID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KEtNVXRsLnRvTnVtYmVyKHBvc2l0aW9uKSwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucHJlc2V0UG9zaXRpb24sYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5L2N572u44Gu44OX44Oq44K744OD44OI44Gr6Zai44GZ44KLT0ZGU0VU6YePXG4gICAgICogQGRlc2Mg5L2N572u44Gu44Kq44OV44K744OD44OI6YeP77yIcHJlc2V0UG9zaXRpb27jgafoqK3lrprjgZfjgZ/lgKTjgavlr77lv5zvvInjgpLoqq3jgb/lj5bjgotcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxpbnR8QXJyYXk+fVxuICAgICAqL1xuICAgIGNtZFJlYWRQb3NpdGlvbk9mZnNldCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRSZWFkUmVnaXN0ZXIodGhpcy5fTU9UT1JfQ09NTUFORC5yZWFkUG9zaXRpb25PZmZzZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOato+Wbnui7ouOBmeOCi++8iOWPjeaZguioiOWbnuOCiu+8iVxuICAgICAqIEBkZXNjIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBp+OAgeato+Wbnui7olxuICAgICAqL1xuICAgIGNtZFJ1bkZvcndhcmQoKXtcbiAgICAgICAgbGV0IGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucnVuRm9yd2FyZCk7XG4gICAgICAgIHRoaXMuX21vdmVTeW5jSW5zdHJ1Y3Rpb25PdmVycmlkZVJlamVjdChjaWQpOy8v56e75YuV57O744GuU3luY+OCs+ODnuODs+ODieWun+ihjOaZguOBrkNC44GuUmVqZWN0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6YCG5Zue6Lui44GZ44KL77yI5pmC6KiI5Zue44KK77yJXG4gICAgICogQGRlc2MgY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44Gn44CB6YCG5Zue6LuiXG4gICAgICovXG4gICAgY21kUnVuUmV2ZXJzZSgpe1xuICAgICAgICBsZXQgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ydW5SZXZlcnNlKTtcbiAgICAgICAgdGhpcy5fbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCk7Ly/np7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ5a6f6KGM5pmC44GuQ0Ljga5SZWplY3RcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjgpLmjIflrprpgJ/luqbjgaflm57ou6LjgZXjgZvjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgZmxvYXQg6YCf5bqm44Gu5aSn44GN44GVIOWNmOS9je+8muinkuW6pu+8iOODqeOCuOOCouODs++8iS/np5IgW8KxWCBycHNdXG4gICAgICovXG4gICAgY21kUnVuKHNwZWVkID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkLDEwKSkpO1xuICAgICAgICBsZXQgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ydW4sYnVmZmVyKTtcbiAgICAgICAgdGhpcy5fbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCk7Ly/np7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ5a6f6KGM5pmC44GuQ0Ljga5SZWplY3RcblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOCkuaMh+WumumAn+W6puOBp+Wbnui7ouOBleOBm+OCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZF9ycG0gZmxvYXQgW8KxWCBycG1dXG4gICAgICovXG4gICAgY21kUnVuX3JwbShzcGVlZF9ycG0gPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoc3BlZWRfcnBtKjAuMTA0NzE5NzU1MTE5NjU5NzcsMTApKTtcbiAgICAgICAgbGV0IGNpZD0gdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJ1bixidWZmZXIpO1xuICAgICAgICB0aGlzLl9tb3ZlU3luY0luc3RydWN0aW9uT3ZlcnJpZGVSZWplY3QoY2lkKTsvL+enu+WLleezu+OBrlN5bmPjgrPjg57jg7Pjg4nlrp/ooYzmmYLjga5DQuOBrlJlamVjdFxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg57W25a++5L2N572u44Gr56e75YuV44GZ44KLXG4gICAgICogQGRlc2Mg6YCf44GV44GvIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBjOaOoeeUqOOBleOCjOOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBmbG9hdCDop5LluqbvvJpyYWRpYW5zXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIGZsb2F0IOmAn+W6puOBruWkp+OBjeOBlSDljZjkvY3vvJrop5LluqbvvIjjg6njgrjjgqLjg7PvvIkv56eSIFswLVggcnBzXeOAgFxuICAgICAqL1xuICAgIGNtZE1vdmVUb1Bvc2l0aW9uKHBvc2l0aW9uLHNwZWVkPW51bGwpe1xuICAgICAgICBpZihwb3NpdGlvbj09PSB1bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBjaWQ9bnVsbDtcbiAgICAgICAgaWYoc3BlZWQhPT1udWxsKXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoOCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChwb3NpdGlvbiwxMCkpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMig0LHBhcnNlRmxvYXQoc3BlZWQsMTApKTtcbiAgICAgICAgICAgIGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZVRvUG9zaXRpb25TcGVlZCxidWZmZXIpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChwb3NpdGlvbiwxMCkpO1xuICAgICAgICAgICAgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlVG9Qb3NpdGlvbixidWZmZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbW92ZVN5bmNJbnN0cnVjdGlvbk92ZXJyaWRlUmVqZWN0KGNpZCk7Ly/np7vli5Xns7vjga5TeW5j44Kz44Oe44Oz44OJ5a6f6KGM5pmC44GuQ0Ljga5SZWplY3RcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDntbblr77kvY3nva7jgavnp7vli5XjgZfjgIHnp7vli5Xjga7miJDlkKbjgpLpgJrnn6XjgZnjgosgKE1vdG9yRmFybSBWZXIgPj0gMi4yMylcbiAgICAgKiBAZGVzYyDpgJ/jgZXjga8gY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44GM5o6h55So44GV44KM44KLXG4gICAgICogPHVsPlxuICAgICAqICAgICA8bGk+44GT44Gu44Kz44Oe44Oz44OJ5a6f6KGM5Lit44Gr5Yil44Gu56e75YuV57O744Gu44Kz44Oe44Oz44OJ44KS5a6f6KGM44GZ44KL44GoJ0luc3RydWN0aW9uIG92ZXJyaWRlJ+OBqOOBl+OBpnJlamVjdOOBleOCjOOCizwvbGk+XG4gICAgICogPC91bD5cbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKHJlc29sdmUpID0+e1xuICAgICAqICAgICAga01Nb3Rvck9uZS5jbWROb3RpZnlQb3NBcnJpdmFsKDEsS01VdGwuZGVncmVlVG9SYWRpYW4oMC41KSk7Ly/liLDpgZTjgajliKTlrprjgZnjgovnm67mqJnluqfmqJnjga7nr4Tlm7IgKy0wLjXluqZcbiAgICAgKiAgICAgIC8v5Y6f54K556e75YuVIDMwcnBtIOOCv+OCpOODoOOCouOCpuODiCA1c1xuICAgICAqICAgICAgcmV0dXJuIGtNTW90b3JPbmUuY21kTW92ZVRvUG9zaXRpb25TeW5jKDAsS01Db25uZWN0b3IuS01VdGwucnBtVG9SYWRpYW5TZWMoMzApLDUwMDApO1xuICAgICAqIH0pLnRoZW4oKHJlc29sdmUpID0+e1xuICAgICAqICAgICAgLy9wb3NpdGlvbiBBcnJpdmVkXG4gICAgICogfSkuY2F0Y2goKGUpPT57XG4gICAgICogICAgICBjb25zb2xlLmxvZyhlKTsvLydJbnN0cnVjdGlvbiBvdmVycmlkZScgb3IgVGltZW91dFxuICAgICAqIH0pO1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBmbG9hdCDop5LluqbvvJpyYWRpYW5zXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIGZsb2F0IOmAn+W6puOBruWkp+OBjeOBlSDljZjkvY3vvJrop5LluqbvvIjjg6njgrjjgqLjg7PvvIkv56eSIFswLVggcnBzXeOAgFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lb3V0IGludCBbMCAtIHggbXNdIOODh+ODleOCqeODq+ODiCAwOuOCv+OCpOODoOOCouOCpuODiOeEoeOBl1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4gICAgICovXG4gICAgY21kTW92ZVRvUG9zaXRpb25TeW5jKHBvc2l0aW9uLHNwZWVkPW51bGwsdGltZW91dD0wKXtcbiAgICAgICAgaWYocG9zaXRpb249PT0gdW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgc2VsZj10aGlzO1xuICAgICAgICBsZXQgY2lkPW51bGw7XG4gICAgICAgIGlmKHNwZWVkIT09bnVsbCl7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDgpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQocG9zaXRpb24sMTApKTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoNCxwYXJzZUZsb2F0KHNwZWVkLDEwKSk7XG4gICAgICAgICAgICBjaWQ9dGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVUb1Bvc2l0aW9uU3BlZWQsYnVmZmVyKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQocG9zaXRpb24sMTApKTtcbiAgICAgICAgICAgIGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZVRvUG9zaXRpb24sYnVmZmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vdmVTeW5jSW5zdHJ1Y3Rpb25PdmVycmlkZVJlamVjdChjaWQpOy8v56e75YuV57O744GuU3luY+OCs+ODnuODs+ODieWun+ihjOaZguOBrkNC44GuUmVqZWN0XG5cbiAgICAgICAgLy/miJDlkKbjga7mjZXmjYlcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgICAgICAgbGV0IHRtPSBNYXRoLmFicyhwYXJzZUludCh0aW1lb3V0KSk7XG4gICAgICAgICAgICBzZWxmLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb249bmV3IF9LTU5vdGlmeVByb21pcyhjaWQsXCJjbWRNb3ZlVG9Qb3NpdGlvblN5bmNcIixudWxsLHJlc29sdmUscmVqZWN0LHRtKTsvL25vdGlmeee1jOeUseOBrktNX1NVQ0NFU1NfQVJSSVZBTOOCklByb21pc+OBqOe0kOS7mOOBkVxuICAgICAgICAgICAgaWYodG0pe1xuICAgICAgICAgICAgICAgIHNlbGYuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi5zdGFydFJlamVjdFRpbWVPdXRDb3VudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDnm7jlr77kvY3nva7jgavnp7vli5XjgZnjgotcbiAgICAgKiBAZGVzYyDpgJ/jgZXjga8gY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44GM5o6h55So44GV44KM44KLXG4gICAgICogQHBhcmFtICB7bnVtYmVyfSBkaXN0YW5jZSBmbG9hdCDop5LluqbvvJpyYWRpYW5zW+W3pjorcmFkaWFucyDlj7M6LXJhZGlhbnNdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIGZsb2F0IOmAn+W6puOBruWkp+OBjeOBlSDljZjkvY3vvJrop5LluqbvvIjjg6njgrjjgqLjg7PvvIkv56eSIFswLVggcnBzXeOAgCjmraPjga7mlbApXG4gICAgICovXG4gICAgY21kTW92ZUJ5RGlzdGFuY2UoZGlzdGFuY2UgPSAwLHNwZWVkPW51bGwpe1xuICAgICAgICBsZXQgY2lkPW51bGw7XG4gICAgICAgIGlmKHNwZWVkIT09bnVsbCl7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDgpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoZGlzdGFuY2UsMTApKTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoNCxwYXJzZUZsb2F0KHNwZWVkLDEwKSk7XG4gICAgICAgICAgICBjaWQ9dGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVCeURpc3RhbmNlU3BlZWQsYnVmZmVyKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoZGlzdGFuY2UsMTApKTtcbiAgICAgICAgICAgIGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZUJ5RGlzdGFuY2UsYnVmZmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vdmVTeW5jSW5zdHJ1Y3Rpb25PdmVycmlkZVJlamVjdChjaWQpOy8v56e75YuV57O744GuU3luY+OCs+ODnuODs+ODieWun+ihjOaZguOBrkNC44GuUmVqZWN0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg55u45a++5L2N572u44Gr56e75YuV44GX44CB56e75YuV44Gu5oiQ5ZCm44KS6YCa55+l44GZ44KLIChNb3RvckZhcm0gVmVyID49IDIuMjMpXG4gICAgICogQGRlc2Mg6YCf44GV44GvIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBjOaOoeeUqOOBleOCjOOCi1xuICAgICAqIDx1bD5cbiAgICAgKiAgICAgPGxpPuOBk+OBruOCs+ODnuODs+ODieWun+ihjOS4reOBq+WIpeOBruenu+WLleezu+OBruOCs+ODnuODs+ODieOCkuWun+ihjOOBmeOCi+OBqCdJbnN0cnVjdGlvbiBvdmVycmlkZSfjgajjgZfjgaZyZWplY3TjgZXjgozjgos8L2xpPlxuICAgICAqIDwvdWw+XG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBQcm9taXNlLnJlc29sdmUoKS50aGVuKChyZXNvbHZlKSA9PntcbiAgICAgKiAgICAgIGtNTW90b3JPbmUuY21kTm90aWZ5UG9zQXJyaXZhbCgxLEtNVXRsLmRlZ3JlZVRvUmFkaWFuKDAuNSkpOy8v5Yiw6YGU44Go5Yik5a6a44GZ44KL55uu5qiZ5bqn5qiZ44Gu56+E5ZuyICstMC415bqmXG4gICAgICogICAgICAvLzM2MOW6puebuOWvvuenu+WLlSAzMHJwbSDjgr/jgqTjg6DjgqLjgqbjg4jnhKHjgZdcbiAgICAgKiAgICAgIHJldHVybiBrTU1vdG9yT25lLmNtZE1vdmVCeURpc3RhbmNlU3luYyhLTUNvbm5lY3Rvci5LTVV0bC5kZWdyZWVUb1JhZGlhbigzNjApLEtNQ29ubmVjdG9yLktNVXRsLnJwbVRvUmFkaWFuU2VjKDMwKSk7XG4gICAgICogfSkudGhlbigocmVzb2x2ZSkgPT57XG4gICAgICogICAgICAvL3Bvc2l0aW9uIEFycml2ZWRcbiAgICAgKiB9KS5jYXRjaCgoZSk9PntcbiAgICAgKiAgICAgIGNvbnNvbGUubG9nKGUpOy8vJ0luc3RydWN0aW9uIG92ZXJyaWRlJyBvciBUaW1lb3V0XG4gICAgICogfSk7XG4gICAgICogQHBhcmFtICB7bnVtYmVyfSBkaXN0YW5jZSBmbG9hdCDop5LluqbvvJpyYWRpYW5zW+W3pjorcmFkaWFucyDlj7M6LXJhZGlhbnNdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIGZsb2F0IOmAn+W6puOBruWkp+OBjeOBlSDljZjkvY3vvJrop5LluqbvvIjjg6njgrjjgqLjg7PvvIkv56eSIFswLVggcnBzXeOAgCjmraPjga7mlbApXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVvdXQgaW50IFswIC0geCBtc10g44OH44OV44Kp44Or44OIIDA644K/44Kk44Og44Ki44Km44OI54Sh44GXXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICAgKi9cbiAgICBjbWRNb3ZlQnlEaXN0YW5jZVN5bmMoZGlzdGFuY2UgPSAwLHNwZWVkPW51bGwsdGltZW91dD0wKXtcbiAgICAgICAgbGV0IHNlbGY9dGhpcztcbiAgICAgICAgbGV0IGNpZD1udWxsO1xuICAgICAgICBpZihzcGVlZCE9PW51bGwpe1xuICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig4KTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KGRpc3RhbmNlLDEwKSk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDQscGFyc2VGbG9hdChzcGVlZCwxMCkpO1xuICAgICAgICAgICAgY2lkPXRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlQnlEaXN0YW5jZVNwZWVkLGJ1ZmZlcik7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KGRpc3RhbmNlLDEwKSk7XG4gICAgICAgICAgICBjaWQ9dGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVCeURpc3RhbmNlLGJ1ZmZlcik7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLl9tb3ZlU3luY0luc3RydWN0aW9uT3ZlcnJpZGVSZWplY3QoY2lkKTsvL+enu+WLleezu+OBrlN5bmPjgrPjg57jg7Pjg4nlrp/ooYzmmYLjga5DQuOBrlJlamVjdFxuXG4gICAgICAgIC8v5oiQ5ZCm44Gu5o2V5o2JXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgICAgICAgIGxldCB0bT0gTWF0aC5hYnMocGFyc2VJbnQodGltZW91dCkpO1xuICAgICAgICAgICAgc2VsZi5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uPW5ldyBfS01Ob3RpZnlQcm9taXMoY2lkLFwiY21kTW92ZUJ5RGlzdGFuY2VTeW5jXCIsbnVsbCxyZXNvbHZlLHJlamVjdCx0bSk7XG4gICAgICAgICAgICBpZih0bSl7XG4gICAgICAgICAgICAgICAgc2VsZi5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uLnN0YXJ0UmVqZWN0VGltZU91dENvdW50KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7lirHno4HjgpLlgZzmraLjgZnjgovvvIjmhJ/op6bjga/mrovjgorjgb7jgZnvvIlcbiAgICAgKiBAZGVzYyDlrozlhajjg5Xjg6rjg7znirbmhYvjgpLlho3nj77jgZnjgovloLTlkIjjga/jgIEgY21kRnJlZSgpLmNtZERpc2FibGUoKSDjgajjgZfjgabkuIvjgZXjgYTjgIJcbiAgICAgKi9cbiAgICBjbWRGcmVlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5mcmVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjgpLpgJ/luqbjgrzjg63jgb7jgafmuJvpgJ/jgZflgZzmraLjgZnjgotcbiAgICAgKiBAZGVzYyBycG0gPSAwIOOBqOOBquOCi+OAglxuICAgICAqL1xuICAgIGNtZFN0b3AoKXtcbiAgICAgICAgbGV0IGNpZD10aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcCk7XG4gICAgICAgIHRoaXMuX21vdmVTeW5jSW5zdHJ1Y3Rpb25PdmVycmlkZVJlamVjdChjaWQpOy8v56e75YuV57O744GuU3luY+OCs+ODnuODs+ODieWun+ihjOaZguOBrkNC44GuUmVqZWN0XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OI44Or44Kv5Yi25b6h44KS6KGM44GGXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvcnF1ZSBmbG9hdCDjg4jjg6vjgq8g5Y2Y5L2N77yaTuODu20gWy1YIH4gKyBYIE5tXSDmjqjlpajlgKQgMC4zLTAuMDVcbiAgICAgKiBAZGVzYyDpgJ/luqbjgoTkvY3nva7jgpLlkIzmmYLjgavliLblvqHjgZnjgovloLTlkIjjga/jgIHjg6Ljg7zjgr/jg7zoqK3lrprjga4gMHgwRTogbWF4VG9ycXVlIOOBqCAweDYwOiBydW5Gb3J3YXJkIOetieOCkuS9teeUqOOBl+OBpuS4i+OBleOBhOOAglxuICAgICAqXG4gICAgICovXG4gICAgY21kSG9sZFRvcnF1ZSh0b3JxdWUpe1xuICAgICAgICBpZih0b3JxdWU9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KHRvcnF1ZSwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuaG9sZFRvcnF1ZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOiomOaGtuOBl+OBn+OCv+OCueOCr++8iOWRveS7pO+8ieOBruOCu+ODg+ODiOOCkuWun+ihjOOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBpbnQg44K/44K544Kv44K744OD44OI55Wq5Y+377yIMO+9njY1NTM177yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJlcGVhdGluZyBpbnQg57mw44KK6L+U44GX5Zue5pWwIDDjga/nhKHliLbpmZBcbiAgICAgKlxuICAgICAqIEBkZXNjIEtNLTEg44GvIGluZGV4OiAwfjQ5IOOBvuOBp+OAgu+8iDUw5YCL44Gu44Oh44Oi44Oq44OQ44Oz44KvIOWQhDgxMjggQnl0ZSDjgb7jgafliLbpmZDjgYLjgorvvIk8YnI+XG4gICAgICog44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44Gv44CB44Kz44Oe44Oz44OJ77yI44K/44K544Kv44K744OD44OI77yJ44KS5Y+C54Wn5LiL44GV44GE44CCIGh0dHBzOi8vZG9jdW1lbnQua2VpZ2FuLW1vdG9yLmNvbS9tb3Rvci1jb250cm9sLWNvbW1hbmQvdGFza3NldC5odG1sXG4gICAgICovXG4gICAgY21kU3RhcnREb2luZ1Rhc2tzZXQoaW5kZXggPSAwLHJlcGVhdGluZyA9IDEpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDYpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDIsTWF0aC5hYnMocGFyc2VJbnQocmVwZWF0aW5nLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnREb2luZ1Rhc2tzZXQsYnVmZmVyKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44K/44K544Kv44K744OD44OI44KS5YGc5q2iXG4gICAgICogQGRlc2Mg44K/44K544Kv44K744OD44OI44Gu5YaN55Sf44KS5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kU3RvcERvaW5nVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcERvaW5nVGFza3NldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K344On44Oz44KS5YaN55Sf77yI5rqW5YKZ44Gq44GX77yJXG4gICAgICogQGRlc2Mg44Oi44O844K344On44Oz44Gu44OX44Os44Kk44OQ44OD44Kv44KS77yI5rqW5YKZ44Gq44GX44Gn77yJ44OX44Os44Kk44OQ44OD44Kv6ZaL5aeL44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjg6Ljg7zjgrfjg6fjg7Pnlarlj7fvvIgw772eNjU1MzXvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVwZWF0aW5nIGludCDnubDjgorov5TjgZflm57mlbAgMOOBr+eEoeWItumZkFxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRQcmVwYXJlUGxheWJhY2tNb3Rpb25fU1RBUlRfUE9TSVRJT059IHN0YXJ0X3Bvc2l0aW9uIGludCDjgrnjgr/jg7zjg4jkvY3nva7jga7oqK3lrpo8YnI+XG4gICAgICogU1RBUlRfUE9TSVRJT05fQUJTOuiomOaGtuOBleOCjOOBn+mWi+Wni+S9jee9ru+8iOe1tuWvvuW6p+aome+8ieOBi+OCieOCueOCv+ODvOODiDxicj5cbiAgICAgKiBTVEFSVF9QT1NJVElPTl9DVVJSRU5UOuePvuWcqOOBruS9jee9ruOCkumWi+Wni+S9jee9ruOBqOOBl+OBpuOCueOCv+ODvOODiFxuICAgICAqL1xuICAgIGNtZFN0YXJ0UGxheWJhY2tNb3Rpb24oaW5kZXggPSAwLHJlcGVhdGluZyA9IDAsc3RhcnRfcG9zaXRpb24gPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig3KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQzMigyLE1hdGguYWJzKHBhcnNlSW50KHJlcGVhdGluZywxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoNixNYXRoLmFicyhwYXJzZUludChzdGFydF9wb3NpdGlvbiwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0YXJ0UGxheWJhY2tNb3Rpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/jgpLlgZzmraLjgZnjgotcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgY21kU3RvcFBsYXliYWNrTW90aW9uKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdG9wUGxheWJhY2tNb3Rpb24pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBzZWN0aW9uOjrjgq3jg6Xjg7zmk43kvZxcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Kt44Ol44O844KS5LiA5pmC5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kUGF1c2VRdWV1ZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucGF1c2VRdWV1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Kt44Ol44O844KS5YaN6ZaL44GZ44KL77yI6JOE56mN44GV44KM44Gf44K/44K544Kv44KS5YaN6ZaL77yJXG4gICAgICovXG4gICAgY21kUmVzdW1lUXVldWUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc3VtZVF1ZXVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgq3jg6Xjg7zjgpLmjIflrprmmYLplpPlgZzmraLjgZflho3plovjgZnjgotcbiAgICAgKiBAZGVzYyBjbWRQYXVzZe+8iOOCreODpeODvOWBnOatou+8ieOCkuWun+ihjOOBl+OAgeaMh+WumuaZgumWk++8iOODn+ODquenku+8iee1jOmBjuW+jOOAgeiHquWLleeahOOBqyBjbWRSZXN1bWXvvIjjgq3jg6Xjg7zlho3plovvvIkg44KS6KGM44GE44G+44GZ44CCXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWUg5YGc5q2i5pmC6ZaTW21zZWNdXG4gICAgICovXG4gICAgY21kV2FpdFF1ZXVlKHRpbWUgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDAsTWF0aC5hYnMocGFyc2VJbnQodGltZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELndhaXRRdWV1ZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCreODpeODvOOCkuODquOCu+ODg+ODiOOBmeOCi1xuICAgICAqL1xuICAgIGNtZFJlc2V0UXVldWUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0UXVldWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrueKtuaFi+OCkuiqreOBv+WPluOCiyDvvIhyZWFk5bCC55So77yJXG4gICAgICogQHJldHVybnMge1Byb21pc2U8aW50fEFycmF5Pn1cbiAgICAgKi9cbiAgICBjbWRSZWFkU3RhdHVzKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZFJlYWRSZWdpc3Rlcih0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWRTdGF0dXMpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBzZWN0aW9uOjrjgr/jgrnjgq/jgrvjg4Pjg4hcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgr/jgrnjgq/vvIjlkb3ku6TvvInjga7jgrvjg4Pjg4jjga7oqJjpjLLjgpLplovlp4vjgZnjgotcbiAgICAgKiBAZGVzYyDoqJjmhrbjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjga7jg6Hjg6Ljg6rjga/jgrPjg57jg7Pjg4nvvJplcmFzZVRhc2tzZXQg44Gr44KI44KK5LqI44KB5raI5Y6744GV44KM44Gm44GE44KL5b+F6KaB44GM44GC44KKXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjgqTjg7Pjg4fjg4Pjgq/jgrkgS00tMSDjga7loLTlkIjjgIHjgqTjg7Pjg4fjg4Pjgq/jgrnjga7lgKTjga8gMO+9njQ5IO+8iOioiDUw5YCL6KiY6Yyy77yJXG4gICAgICovXG4gICAgY21kU3RhcnRSZWNvcmRpbmdUYXNrU2V0KGluZGV4ID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnRSZWNvcmRpbmdUYXNrc2V0LGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44KS5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kU3RvcFJlY29yZGluZ1Rhc2tzZXQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3BSZWNvcmRpbmdUYXNrc2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjga7jgqTjg7Pjg4fjg4Pjgq/jgrnjga7jgr/jgrnjgq/jgrvjg4Pjg4jjgpLmtojljrvjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAqL1xuICAgIGNtZEVyYXNlVGFza3NldChpbmRleCA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlVGFza3NldCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBruOCv+OCueOCr+OCu+ODg+ODiOOCkua2iOWOu+OBmeOCi1xuICAgICAqL1xuICAgIGNtZEVyYXNlQWxsVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZXJhc2VBbGxUYXNrc2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLlkI3oqK3lrppcbiAgICAgKiBAZGVzYyDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLlkI3jgpLoqK3lrprjgZnjgovjgILvvIjjgZPjgozjgYvjgonoqJjpjLLjgZnjgovjgoLjga7jgavlr77jgZfjgabvvIlcbiAgICAgKi9cbiAgICBjbWRTZXRUYXNrc2V0TmFtZShuYW1lKXtcbiAgICAgICAgbGV0IGJ1ZmZlcj0gKG5ldyBVaW50OEFycmF5KFtdLm1hcC5jYWxsKG5hbWUsIGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgICAgIHJldHVybiBjLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIH0pKSkuYnVmZmVyO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc2V0VGFza3NldE5hbWUsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo644OG44Kj44O844OB44Oz44KwXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODgOOCpOODrOOCr+ODiOODhuOCo+ODvOODgeODs+OCsOmWi+Wni++8iOa6luWCmeOBquOBl++8iVxuICAgICAqIEBkZXNjIEtNLTEg44Gu5aC05ZCI44CB44Kk44Oz44OH44OD44Kv44K544Gu5YCk44GvIDDvvZ4xOSDvvIjoqIgyMOWAi+iomOmMsu+8ieOBqOOBquOCi+OAguiomOmMsuaZgumWk+OBryA2NTQwOCBbbXNlY10g44KS6LaF44GI44KL44GT44Go44Gv44Gn44GN44Gq44GEXG4gICAgICogICAgICAg6KiY5oa244GZ44KL44Kk44Oz44OH44OD44Kv44K544Gu44Oh44Oi44Oq44GvYmxlRXJhc2VNb3Rpb24g44Gr44KI44KK5LqI44KB5raI5Y6744GV44KM44Gm44GE44KL5b+F6KaB44GM44GC44KLXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuSBbMC0xOV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZSBpbnQg6KiY6Yyy5pmC6ZaTIFttc2VjIDAtNjU0MDhdXG4gICAgICovXG4gICAgY21kU3RhcnRUZWFjaGluZ01vdGlvbihpbmRleCA9IDAsbGVuZ3RoUmVjb3JkaW5nVGltZSA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDYpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDIsTWF0aC5hYnMocGFyc2VJbnQobGVuZ3RoUmVjb3JkaW5nVGltZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0YXJ0VGVhY2hpbmdNb3Rpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDlrp/ooYzkuK3jga7jg4bjgqPjg7zjg4Hjg7PjgrDjgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRTdG9wVGVhY2hpbmdNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3BUZWFjaGluZ01vdGlvbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5oyH5a6a44GX44Gf44Kk44Oz44OH44OD44Kv44K544Gu44Oi44O844K344On44Oz44KS5raI5Y6744GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjgqTjg7Pjg4fjg4Pjgq/jgrlcbiAgICAgKlxuICAgICAqIEBkZXNjIEtNLTEg44Gu5aC05ZCI44CB44Kk44Oz44OH44OD44Kv44K544Gu5YCk44GvIDDvvZ4xOSDvvIjoqIgyMOWAi+iomOmMsu+8ieOBqOOBquOCi1xuICAgICAqXG4gICAgICovXG4gICAgY21kRXJhc2VNb3Rpb24oaW5kZXggPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZU1vdGlvbixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBruODouODvOOCt+ODp+ODs+OCkua2iOWOu+OBmeOCi1xuICAgICAqL1xuICAgIGNtZEVyYXNlQWxsTW90aW9uKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZUFsbE1vdGlvbik7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIHNlY3Rpb246OkxFRFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBMRUTjga7ngrnnga/nirbmhYvjgpLjgrvjg4Pjg4jjgZnjgotcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuY21kTGVkX0xFRF9TVEFURX0gY21kTGVkX0xFRF9TVEFURSBpbnQg54K554Gv54q25oWLPGJyPlxuICAgICAqICAgTEVEX1NUQVRFX09GRjpMRUTmtojnga88YnI+XG4gICAgICogICBMRURfU1RBVEVfT05fU09MSUQ6TEVE54K554GvPGJyPlxuICAgICAqICAgTEVEX1NUQVRFX09OX0ZMQVNIOkxFROeCuea7he+8iOS4gOWumumWk+malOOBp+eCuea7he+8iTxicj5cbiAgICAgKiAgIExFRF9TVEFURV9PTl9ESU06TEVE44GM44KG44Gj44GP44KK5piO5ruF44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJlZCBpbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZ3JlZW4gaW50IDAtMjU1XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJsdWUgaW50IDAtMjU1XG4gICAgICovXG4gICAgY21kTGVkKGNtZExlZF9MRURfU1RBVEUscmVkLGdyZWVuLGJsdWUpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLE1hdGguYWJzKHBhcnNlSW50KGNtZExlZF9MRURfU1RBVEUsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDEsTWF0aC5hYnMocGFyc2VJbnQocmVkLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgyLE1hdGguYWJzKHBhcnNlSW50KGdyZWVuLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgzLE1hdGguYWJzKHBhcnNlSW50KGJsdWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5sZWQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gSU1VIOOCuOODo+OCpOODrVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IElNVSjjgrjjg6PjgqTjg60p44Gu5YCk5Y+W5b6XKOmAmuefpSnjgpLplovlp4vjgZnjgotcbiAgICAgKiBAZGVzYyDmnKzjgrPjg57jg7Pjg4njgpLlrp/ooYzjgZnjgovjgajjgIFJTVXjga7jg4fjg7zjgr/jga9CTEXjga7jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrlNT1RPUl9JTVVfTUVBU1VSRU1FTlTjgavpgJrnn6XjgZXjgozjgos8YnI+XG4gICAgICogTU9UT1JfSU1VX01FQVNVUkVNRU5U44Gubm90aWZ544Gv44Kk44OZ44Oz44OI44K/44Kk44OXIEtNTW90b3JDb21tYW5kS01PbmUuRVZFTlRfVFlQRS5pbXVNZWFzdXJlbWVudCDjgavpgJrnn6VcbiAgICAgKi9cbiAgICBjbWRFbmFibGVJTVVNZWFzdXJlbWVudCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW5hYmxlSU1VTWVhc3VyZW1lbnQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IElNVSjjgrjjg6PjgqTjg60p44Gu5YCk5Y+W5b6XKOmAmuefpSnjgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWREaXNhYmxlSU1VTWVhc3VyZW1lbnQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmRpc2FibGVJTVVNZWFzdXJlbWVudCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIElNVSDjg6Ljg7zjgr/jg7xcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5ris5a6a5YCk77yI5L2N572u44O76YCf5bqm44O744OI44Or44Kv77yJ5Ye65Yqb44KS6ZaL5aeL44GZ44KLXG4gICAgICogQGRlc2Mg44OH44OV44Kp44Or44OI44Gn44Gv44Oi44O844K/44O86LW35YuV5pmCb27jgIIgbW90b3JNZWFzdXJlbWVudEJ5RGVmYXVsdCgpIOWPgueFp1xuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBjbWRFbmFibGVNb3Rvck1lYXN1cmVtZW50KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lbmFibGVNb3Rvck1lYXN1cmVtZW50KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5ris5a6a5YCk77yI5L2N572u44O76YCf5bqm44O744OI44Or44Kv77yJ5Ye65Yqb44KS5YGc5q2i44GZ44KLXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIGNtZERpc2FibGVNb3Rvck1lYXN1cmVtZW50KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5kaXNhYmxlTW90b3JNZWFzdXJlbWVudCk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIOOCt+OCueODhuODoFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgrfjgrnjg4bjg6DjgpLlho3otbfli5XjgZnjgotcbiAgICAgKiBAZGVzYyBCTEXjgavmjqXntprjgZfjgabjgYTjgZ/loLTlkIjjgIHliIfmlq3jgZfjgabjgYvjgonlho3otbfli5VcbiAgICAgKi9cbiAgICBjbWRSZWJvb3QoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlYm9vdCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODgeOCp+ODg+OCr+OCteODoO+8iENSQzE2KSDmnInlirnljJZcbiAgICAgKiBAZGVzYyDjgrPjg57jg7Pjg4nvvIjjgr/jgrnjgq/vvInjga7jg4Hjgqfjg4Pjgq/jgrXjg6DjgpLmnInlirnljJbjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaXNFbmFibGVkIDA6RGlzYmxlZCwgMTpFbmFibGVkXG4gICAgICovXG4gICAgY21kRW5hYmxlQ2hlY2tTdW0oaXNFbmFibGVkKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxpc0VuYWJsZWQ/MTowKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVuYWJsZUNoZWNrU3VtLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OV44Kh44O844Og44Km44Kn44Ki44Ki44OD44OX44OH44O844OI44Oi44O844OJ44Gr5YWl44KLXG4gICAgICogQGRlc2Mg44OV44Kh44O844Og44Km44Kn44Ki44KS44Ki44OD44OX44OH44O844OI44GZ44KL44Gf44KB44Gu44OW44O844OI44Ot44O844OA44O844Oi44O844OJ44Gr5YWl44KL44CC77yI44K344K544OG44Og44Gv5YaN6LW35YuV44GV44KM44KL44CC77yJXG4gICAgICovXG4gICAgY21kRW50ZXJEZXZpY2VGaXJtd2FyZVVwZGF0ZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW50ZXJEZXZpY2VGaXJtd2FyZVVwZGF0ZSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIOODouODvOOCv+ODvOioreWumuOAgE1PVE9SX1NFVFRJTkdcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5pyA5aSn6YCf44GV44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heFNwZWVkIGZsb2F0IOacgOWkp+mAn+OBlSBbcmFkaWFuIC8gc2Vjb25kXe+8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZE1heFNwZWVkKG1heFNwZWVkKXtcbiAgICAgICAgaWYobWF4U3BlZWQ9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KG1heFNwZWVkLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubWF4U3BlZWQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7mnIDlsI/pgJ/jgZXjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4U3BlZWQgZmxvYXQg5pyA5bCP6YCf44GVIFtyYWRpYW4gLyBzZWNvbmRd77yI5q2j44Gu5YCk77yJXG4gICAgICogQGRlc2MgbWluU3BlZWQg44Gv44CBYmxlUHJlcGFyZVBsYXliYWNrTW90aW9uIOWun+ihjOOBrumam+OAgemWi+Wni+WcsOeCueOBq+enu+WLleOBmeOCi+mAn+OBleOBqOOBl+OBpuS9v+eUqOOBleOCjOOCi+OAgumAmuW4uOaZgumBi+i7ouOBp+OBr+S9v+eUqOOBleOCjOOBquOBhOOAglxuICAgICAqL1xuICAgIGNtZE1pblNwZWVkKG1pblNwZWVkKXtcbiAgICAgICAgaWYobWluU3BlZWQ9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KG1pblNwZWVkLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubWluU3BlZWQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDliqDmuJvpgJ/mm7Lnt5rjgpLmjIflrprjgZnjgovvvIjjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6vjga7oqK3lrprvvIlcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuY21kQ3VydmVUeXBlX0NVUlZFX1RZUEV9IGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFIGludCDliqDmuJvpgJ/jgqvjg7zjg5bjgqrjg5fjgrfjg6fjg7M8YnI+XG4gICAgICogICAgICBDVVJWRV9UWVBFX05PTkU6MCDjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT0ZGPGJyPlxuICAgICAqICAgICAgQ1VSVkVfVFlQRV9UUkFQRVpPSUQ6MSDjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT04g77yI5Y+w5b2i5Yqg5rib6YCf77yJXG4gICAgICovXG4gICAgY21kQ3VydmVUeXBlKGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsTWF0aC5hYnMocGFyc2VJbnQoY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5jdXJ2ZVR5cGUsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7liqDpgJ/luqbjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWNjIGZsb2F0IOWKoOmAn+W6piAwLTIwMCBbcmFkaWFuIC8gc2Vjb25kXjJd77yI5q2j44Gu5YCk77yJXG4gICAgICogQGRlc2MgYWNjIOOBr+OAgeODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPTiDjga7loLTlkIjjgIHliqDpgJ/mmYLjgavkvb/nlKjjgZXjgozjgb7jgZnjgILvvIjliqDpgJ/mmYLjga7nm7Tnt5rjga7lgr7jgY3vvIlcbiAgICAgKi9cbiAgICBjbWRBY2MoYWNjID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KGFjYywxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmFjYyxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrua4m+mAn+W6puOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWMgZmxvYXQg5rib6YCf5bqmIDAtMjAwIFtyYWRpYW4gLyBzZWNvbmReMl3vvIjmraPjga7lgKTvvIlcbiAgICAgKiBAZGVzYyBkZWMg44Gv44CB44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9OIOOBruWgtOWQiOOAgea4m+mAn+aZguOBq+S9v+eUqOOBleOCjOOBvuOBmeOAgu+8iOa4m+mAn+aZguOBruebtOe3muOBruWCvuOBje+8iVxuICAgICAqL1xuICAgIGNtZERlYyhkZWMgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoZGVjLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZGVjLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5pyA5aSn44OI44Or44Kv77yI57W25a++5YCk77yJ44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heFRvcnF1ZSBmbG9hdCDmnIDlpKfjg4jjg6vjgq8gW04qbV3vvIjmraPjga7lgKTvvIlcbiAgICAgKlxuICAgICAqIEBkZXNjIG1heFRvcnF1ZSDjgpLoqK3lrprjgZnjgovjgZPjgajjgavjgojjgorjgIHjg4jjg6vjgq/jga7ntbblr77lgKTjgYwgbWF4VG9ycXVlIOOCkui2heOBiOOBquOBhOOCiOOBhuOBq+mBi+i7ouOBl+OBvuOBmeOAgjxicj5cbiAgICAgKiBtYXhUb3JxdWUgPSAwLjEgW04qbV0g44Gu5b6M44GrIHJ1bkZvcndhcmQg77yI5q2j5Zue6Lui77yJ44KS6KGM44Gj44Gf5aC05ZCI44CBMC4xIE4qbSDjgpLotoXjgYjjgarjgYTjgojjgYbjgavjgZ3jga7pgJ/luqbjgpLjgarjgovjgaDjgZHntq3mjIHjgZnjgovjgII8YnI+XG4gICAgICog44Gf44Gg44GX44CB44OI44Or44Kv44Gu5pyA5aSn5YCk5Yi26ZmQ44Gr44KI44KK44CB44K344K544OG44Og44Gr44KI44Gj44Gm44Gv5Yi25b6h5oCn77yI5oyv5YuV77yJ44GM5oKq5YyW44GZ44KL5Y+v6IO95oCn44GM44GC44KL44CCXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRNYXhUb3JxdWUobWF4VG9ycXVlKXtcbiAgICAgICAgaWYobWF4VG9ycXVlPT09dW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChtYXhUb3JxdWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tYXhUb3JxdWUsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg4DjgqTjg6zjgq/jg4jjg4bjgqPjg7zjg4Hjg7PjgrDjga7jgrXjg7Pjg5fjg6rjg7PjgrDplpPpmpRcbiAgICAgKiBAZGVzYyDjg4bjgqPjg7zjg4Hjg7PjgrDjg7vjg5fjg6zjgqTjg5Djg4Pjgq/jga7lrp/ooYzplpPpmpRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW50ZXJ2YWwgbXPvvIgyLTEwMDAgIDAsIDFtc+OBr+OCqOODqeODvOOBqOOBquOCi++8iVxuICAgICAqL1xuICAgIGNtZFRlYWNoaW5nSW50ZXJ2YWwoaW50ZXJ2YWwpe1xuICAgICAgICBpZihpbnRlcnZhbD09PXVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IF9pbnRlcnZhbD1NYXRoLmFicyhwYXJzZUludChpbnRlcnZhbCwxMCkpO1xuICAgICAgICBfaW50ZXJ2YWw9X2ludGVydmFsPDI/MjpfaW50ZXJ2YWw7XG4gICAgICAgIF9pbnRlcnZhbD1faW50ZXJ2YWw+MTAwMD8xMDAwOl9pbnRlcnZhbDtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDAsX2ludGVydmFsKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnRlYWNoaW5nSW50ZXJ2YWwsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6KiY5oa25YaN55Sf5pmC44Gu5YaN55Sf6ZaT6ZqUXG4gICAgICogQGRlc2MgIOiomOaGtuWGjeeUn+aZguOBruWGjeeUn+mWk+malFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbnRlcnZhbCBtc++8iDItMTAwMCAgMCwgMW1z44Gv44Ko44Op44O844Go44Gq44KL77yJXG4gICAgICovXG4gICAgY21kUGxheWJhY2tJbnRlcnZhbChpbnRlcnZhbCl7XG4gICAgICAgIGlmKGludGVydmFsPT09dW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgX2ludGVydmFsPU1hdGguYWJzKHBhcnNlSW50KGludGVydmFsLDEwKSk7XG4gICAgICAgIF9pbnRlcnZhbD1faW50ZXJ2YWw8Mj8yOl9pbnRlcnZhbDtcbiAgICAgICAgX2ludGVydmFsPV9pbnRlcnZhbD4xMDAwPzEwMDA6X2ludGVydmFsO1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMCxfaW50ZXJ2YWwpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucGxheWJhY2tJbnRlcnZhbCxidWZmZXIpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrlDvvIjmr5TkvovvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcUN1cnJlbnRQIGZsb2F0IHHpm7vmtYFQ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUUN1cnJlbnRQKHFDdXJyZW50UCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHFDdXJyZW50UCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnFDdXJyZW50UCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5Q77yI5q+U5L6L77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHFDdXJyZW50SSBmbG9hdCBx6Zu75rWBSeOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFFDdXJyZW50SShxQ3VycmVudEkpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChxQ3VycmVudEksMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5xQ3VycmVudEksYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga5x6Lu46Zu75rWBUElE44Kz44Oz44OI44Ot44O844Op44GuRO+8iOW+ruWIhu+8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBxQ3VycmVudEQgZmxvYXQgcembu+a1gUTjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRRQ3VycmVudEQocUN1cnJlbnREKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQocUN1cnJlbnRELDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucUN1cnJlbnRELGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrkTvvIjlvq7liIbvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWRQIGZsb2F0IOmAn+W6plDjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRTcGVlZFAoc3BlZWRQKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWRQLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWRQLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu6YCf5bqmUElE44Kz44Oz44OI44Ot44O844Op44GuSe+8iOepjeWIhu+8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZEkgZmxvYXQg6YCf5bqmSeOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFNwZWVkSShzcGVlZEkpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChzcGVlZEksMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZEksYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7pgJ/luqZQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5E77yI5b6u5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkRCBmbG9hdCDpgJ/luqZE44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kU3BlZWREKHNwZWVkRCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkRCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNwZWVkRCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruS9jee9ruWItuW+oVDjg5Hjg6njg6Hjgr/jgpLjgrvjg4Pjg4hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb25QIGZsb2F0IFsxLjAwMDAgLSAyMC4wMDAwXe+8iOODh+ODleOCqeODq+ODiCA1LjDvvIlcbiAgICAgKi9cbiAgICBjbWRQb3NpdGlvblAocG9zaXRpb25QKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQocG9zaXRpb25QLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucG9zaXRpb25QLGJ1ZmZlcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruS9jee9ruWItuW+oUnjg5Hjg6njg6Hjgr/jgpLjgrvjg4Pjg4hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb25JIGZsb2F0IFsxLjAwMDAgLSAxMDAuMDAwMF3vvIjjg4fjg5Xjgqnjg6vjg4ggMTAuMO+8iVxuICAgICAqL1xuICAgIGNtZFBvc2l0aW9uSShwb3NpdGlvbkkpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChwb3NpdGlvbkksMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wb3NpdGlvbkksYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5L2N572u5Yi25b6hROODkeODqeODoeOCv+OCkuOCu+ODg+ODiFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbkQgZmxvYXQgWzAuMDAwMSAtIDAuMl3vvIjjg4fjg5Xjgqnjg6vjg4ggMC4wMe+8iVxuICAgICAqL1xuICAgIGNtZFBvc2l0aW9uRChwb3NpdGlvbkQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChwb3NpdGlvbkQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wb3NpdGlvbkQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7kvY3nva7liLblvqHmmYLjgIFJROWItuW+oeOCkuacieWKueOBq+OBmeOCi+WBj+W3ruOBrue1tuWvvuWApOOCkuaMh+WumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aHJlc2hvbGQgZmxvYXQgWzAuMCAtIG5d77yI44OH44OV44Kp44Or44OIIDAuMDEzOTYyNmYgLy8gMC44ZGVn77yJXG4gICAgICovXG4gICAgY21kUG9zQ29udHJvbFRocmVzaG9sZCh0aHJlc2hvbGQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdCh0aHJlc2hvbGQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wb3NDb250cm9sVGhyZXNob2xkLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5L2N572u5Yi25b6h5pmC44CB55uu5qiZ5L2N572u44Gr5Yiw6YGU5pmC44CB5Yik5a6a5p2h5Lu244KS5rqA44Gf44GX44Gf5aC05ZCI6YCa55+l44KS6KGM44GG44CCXG4gICAgICogQGRlc2Mg5Yik5a6a5p2h5Lu277yaIHRvbGVyYW5jZSDlhoXjgavkvY3nva7jgYzlhaXjgaPjgabjgYTjgovnirbmhYvjgYzjgIFzZXR0bGVUaW1lIOmAo+e2muOBp+e2muOBj+OBqOOAgemAmuefpShLTV9TVUNDRVNTX0FSUklWQUwp44GM5LiA5Zue6KGM44KP44KM44KL44CCXG4gICAgICogPHVsPlxuICAgICAqICAgICA8bGk+dG9sZXJhbmNl5YaF44Gr5L2N572u44GM5YWl44Gj44Gm44GE44KL54q25oWL44GM44CBc2V0dGxlVGltZeOBrumWk+mAo+e2muOBp+e2muOBj+OBqOmAmuefpeOBjOODiOODquOCrOODvOOBleOCjOOCi+OAgjwvbGk+XG4gICAgICogICAgIDxsaT50b2xlcmFuY2XjgavkuIDnnqzjgafjgoLlhaXjgaPjgaZzZXR0bGVUaW1l5pyq5rqA44Gn5Ye644KL44Go6YCa55+l44OI44Oq44Ks44O844Gv5YmK6Zmk44GV44KM44CB6YCa55+l44Gv6KGM44KP44KM44Gq44GE44CCPC9saT5cbiAgICAgKiAgICAgPGxpPnRvbGVyYW5jZeOBq+S4gOW6puOCguWFpeOCieOBquOBhOWgtOWQiOOAgemAmuefpeODiOODquOCrOODvOOBr+aui+OCiue2muOBkeOCi+OAgijjg4jjg6rjgqzjg7zjga7mmI7npLrnmoTjgarmtojljrvjga8gY21kTm90aWZ5UG9zQXJyaXZhbCgwLDAsMCkgKTwvbGk+XG4gICAgICogICAgIDxsaT7lho3luqZub3RpZnlQb3NBcnJpdmFs44Gn6Kit5a6a44KS6KGM44GG44Go44CB5Lul5YmN44Gu6YCa55+l44OI44Oq44Ks44O844Gv5raI44GI44KL44CCPC9saT5cbiAgICAgKiA8L3VsPlxuICAgICAqIEBwYXJhbSAge251bWJlcn0gaXNFbmFibGVkIDA6RGlzYmxlZCwgMTpFbmFibGVkXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvbGVyYW5jZSBmbG9hdCBbMC4wIC0gbl0g6Kix5a656Kqk5beuIHJhZGlhbiAo44OH44OV44Kp44Or44OIIOKJkiAwLjFkZWfvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc2V0dGxlVGltZSBpbnQgWzAgLSBuXSDliKTlrprmmYLplpMg44Of44Oq56eSICjjg4fjg5Xjgqnjg6vjg4ggMjAwbXPvvIlcbiAgICAgKlxuICAgICAqL1xuICAgIGNtZE5vdGlmeVBvc0Fycml2YWwoaXNFbmFibGVkPTAsdG9sZXJhbmNlPTAuMDAxNzQ1MzMsc2V0dGxlVGltZT0yMDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLGlzRW5hYmxlZD8xOjApO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDEsTWF0aC5hYnMocGFyc2VGbG9hdCh0b2xlcmFuY2UsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQzMig1LE1hdGguYWJzKHBhcnNlSW50KHNldHRsZVRpbWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ub3RpZnlQb3NBcnJpdmFsLGJ1ZmZlcik7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDlhajjgabjga5QSUTjg5Hjg6njg6Hjg7zjgr/jgpLjg6rjgrvjg4Pjg4jjgZfjgabjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/oqK3lrprjgavmiLvjgZlcbiAgICAgKiBAZGVzYyBxQ3VycmVudFAsIHFDdXJyZW50SSwgIHFDdXJyZW50RCwgc3BlZWRQLCBzcGVlZEksIHNwZWVkRCwgcG9zaXRpb25QIOOCkuODquOCu+ODg+ODiOOBl+OBvuOBmVxuICAgICAqXG4gICAgICovXG4gICAgY21kUmVzZXRQSUQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0UElEKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zmuKzlrprlgKTjga7lj5blvpfplpPpmpToqK3lrppcbiAgICAgKiBAZGVzYyDmnInnt5rvvIhVU0IsIEkyQ++8ieOBruOBv+acieWKueOAgkJMReOBp+OBr+WbuuWumiAxMDBtcyDplpPpmpTjgafpgJrnn6XjgZXjgozjgovjgIJcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUx9IGNtZE1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbF9NT1RPUl9NRUFTX0lOVEVSVkFMIGVudW0g44Oi44O844K/44O85ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqUXG4gICAgICovXG4gICAgY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsKGNtZE1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbF9NT1RPUl9NRUFTX0lOVEVSVkFMPTQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KGNtZE1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbF9NT1RPUl9NRUFTX0lOVEVSVkFMLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWwsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zmuKzlrprlgKTjga7lj5blvpfoqK3lrppcbiAgICAgKiBAZGVzYyBpc0VuYWJsZWQgPSAxIOOBruWgtOWQiOOAge+8iOS9jee9ruODu+mAn+W6puODu+ODiOODq+OCr++8ieOBrumAmuefpeOCkuihjOOBhu+8iOi1t+WLleW+jOOAgWludGVyZmFjZSDjga7oqK3lrprjgaflhKrlhYjjgZXjgozjgovpgJrkv6HntYzot6/jgavjgIHoh6rli5XnmoTjgavpgJrnn6XjgYzplovlp4vjgZXjgozjgovvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaXNFbmFibGVkIDA6RGlzYmxlZCwgMTpFbmFibGVkXG4gICAgICovXG4gICAgY21kTW90b3JNZWFzdXJlbWVudEJ5RGVmYXVsdChpc0VuYWJsZWQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLGlzRW5hYmxlZD8xOjApO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW90b3JNZWFzdXJlbWVudEJ5RGVmYXVsdCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOWItuW+oeaJi+aute+8iOOCpOODs+OCv+ODvOODleOCp+OCpOOCue+8ieOBruioreWumlxuICAgICAqIEBkZXNjIHVpbnQ4X3QgZmxhZ3Mg44OT44OD44OI44Gr44KI44KK44CB5ZCr44G+44KM44KL44OR44Op44Oh44O844K/44KS5oyH5a6a44GZ44KL77yI77yR44Gu5aC05ZCI5ZCr44KA44O7MOOBruWgtOWQiOWQq+OBvuOBquOBhO+8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBiaXRGbGdcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKiBiaXQ3ICAgIGJpdDYgICAgYml0NSAgICBiaXQ0ICAgIGJpdDMgICAgYml0MiAgICBiaXQxICAgIGJpdDBcbiAgICAgKiDniannkIYgICAgICAgICAgICAgICAgICAgICDmnInnt5ogICAgIOaciee3miAgICAgICAgICAgICAgICAgICAgICDnhKHnt5pcbiAgICAgKiDjg5zjgr/jg7MgICAg77yKICAgICAg77yKICAgICAgSTJDICAgICBVU0IgICAgICAg77yKICAgICAg77yKICAgICBCTEVcbiAgICAgKiDjg4fjg5Xjgqnjg6vjg4hcdCAgICAgICAgICAgICDjg4fjg5Xjgqnjg6vjg4ggIOODh+ODleOCqeODq+ODiCAgICAgICAgICAgICAg44OH44OV44Kp44Or44OIXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICovXG4gICAgY21kSW50ZXJmYWNlKGJpdEZsZyl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQoYml0RmxnLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5pbnRlcmZhY2UsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgrPjg57jg7Pjg4njgpLlj5fkv6HjgZfjgZ/jgajjgY3jgavmiJDlip/pgJrnn6XvvIhlcnJvckNvZGUgPSAw77yJ44KS44GZ44KL44GL44Gp44GG44GLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGlzRW5hYmxlZCAwOumAmuefpeOBl+OBquOBhCwgMTrpgJrnn6XjgZnjgotcbiAgICAgKi9cbiAgICBjbWRSZXNwb25zZShpc0VuYWJsZWQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLGlzRW5hYmxlZD8xOjApO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzcG9uc2UsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7otbfli5XmmYLlm7rmnIlMRUTjgqvjg6njg7zjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVkIGludCAwLTI1NVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBncmVlbiBpbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmx1ZSBpbnQgMC0yNTVcbiAgICAgKlxuICAgICAqIEBkZXNjIG93bkNvbG9yIOOBr+OCouOCpOODieODq+aZguOBruWbuuaciUxFROOCq+ODqeODvOOAgjxicj5zYXZlQWxsU2V0dGluZ3PjgpLlrp/ooYzjgZfjgIHlho3otbfli5XlvozjgavliJ3jgoHjgablj43mmKDjgZXjgozjgovjgII8YnI+XG4gICAgICog44GT44Gu6Kit5a6a5YCk44KS5aSJ5pu044GX44Gf5aC05ZCI44CBQkxF44GuIERldmljZSBOYW1lIOOBruS4izPmoYHjgYzlpInmm7TjgZXjgozjgovjgIJcbiAgICAgKi9cbiAgICBjbWRPd25Db2xvcihyZWQsZ3JlZW4sYmx1ZSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMyk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsTWF0aC5hYnMocGFyc2VJbnQocmVkLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgxLE1hdGguYWJzKHBhcnNlSW50KGdyZWVuLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgyLE1hdGguYWJzKHBhcnNlSW50KGJsdWUsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5vd25Db2xvcixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IO+8lui7uOOCu+ODs+OCteODvO+8iOWKoOmAn+W6puODu+OCuOODo+OCpOODre+8iea4rOWumuWApOOBruWPluW+l+mWk+malFxuICAgICAqIEBkZXNjIOaciee3mu+8iFVTQiwgSTJD77yJ44Gu44G/5pyJ5Yq544CCQkxF44Gn44Gv5Zu65a6aIDEwMG1zIOmWk+malOOBp+mAmuefpeOBleOCjOOCi+OAglxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRJTVVNZWFzdXJlbWVudEludGVydmFsX0lNVV9NRUFTX0lOVEVSVkFMfSBjbWRJTVVNZWFzdXJlbWVudEludGVydmFsX0lNVV9NRUFTX0lOVEVSVkFMIGVudW0g5Yqg6YCf5bqm44O744K444Oj44Kk44Ot5ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqUXG4gICAgICovXG4gICAgY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbChjbWRJTVVNZWFzdXJlbWVudEludGVydmFsX0lNVV9NRUFTX0lOVEVSVkFMPTQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUwsMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmlNVU1lYXN1cmVtZW50SW50ZXJ2YWwsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDvvJbou7jjgrvjg7PjgrXjg7zvvIjliqDpgJ/luqbjg7vjgrjjg6PjgqTjg63vvInjga7lgKTjga7pgJrnn6XjgpLjg4fjg5Xjgqnjg6vjg4jjgafplovlp4vjgZnjgotcbiAgICAgKiBAZGVzYyBpc0VuYWJsZWQgPSB0cnVlIOOBruWgtOWQiOOAgWVuYWJsZUlNVSgpIOOCkumAgeS/oeOBl+OBquOBj+OBpuOCgui1t+WLleaZguOBq+iHquWLleOBp+mAmuefpeOBjOmWi+Wni+OBleOCjOOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpc0VuYWJsZWQgMDpEaXNibGVkLCAxOkVuYWJsZWRcbiAgICAgKi9cbiAgICBjbWRJTVVNZWFzdXJlbWVudEJ5RGVmYXVsdChpc0VuYWJsZWQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KGlzRW5hYmxlZCwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuaU1VTWVhc3VyZW1lbnRCeURlZmF1bHQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjgZfjgZ/oqK3lrprlgKTjgpLlj5blvpdcbiAgICAgKiBAcGFyYW0ge251bWJlciB8IGFycmF5fSByZWdpc3RlcnMgPGludCB8IFtdPiDlj5blvpfjgZnjgovjg5fjg63jg5Hjg4bjgqPjga7jgrPjg57jg7Pjg4ko44Os44K444K544K/55Wq5Y+3KeWApFxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlLjxpbnQgfCBhcnJheT59IOWPluW+l+OBl+OBn+WApCA8YnI+cmVnaXN0ZXJz44GMaW50PeODrOOCuOOCueOCv+WApOOBruODl+ODquODn+ODhuOCo+ODluWApCA8YnI+cmVnaXN0ZXJz44GMQXJyYXk944Os44K444K544K/5YCk44Gu44Kq44OW44K444Kn44Kv44OIXG4gICAgICpcbiAgICAgKiBAbm9uZSDlj5blvpfjgZnjgovlgKTjga/jgrPjg57jg7Pjg4nlrp/ooYzlvozjgatCTEXjga7jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrlNT1RPUl9TRVRUSU5H44Gr6YCa55+l44GV44KM44KL44CCPGJyPlxuICAgICAqICAgICAgIOOBneOCjOOCkuaLvuOBo+OBpnByb21pc2Xjgqrjg5bjgrjjgqfjgq/jg4jjga7jga5yZXNvbHZl44Gr6L+U44GX44Gm5Yem55CG44KS57mL44GQPGJyPlxuICAgICAqICAgICAgIE1PVE9SX1NFVFRJTkfjga5ub3RpZnnjga9fb25CbGVNb3RvclNldHRpbmfjgaflj5blvpdcbiAgICAgKi9cblxuICAgIGNtZFJlYWRSZWdpc3RlcihyZWdpc3RlcnMpe1xuICAgICAgICBpZihBcnJheS5pc0FycmF5KHJlZ2lzdGVycykpe1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChhbGxyZXNvbHZlLCBhbGxyZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgIGxldCBwcm9taXNlTGlzdD1bXTtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGk9MDtpPHJlZ2lzdGVycy5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJlZ2lzdGVyPXBhcnNlSW50KHJlZ2lzdGVyc1tpXSwxMCk7XG4gICAgICAgICAgICAgICAgICAgIHByb21pc2VMaXN0LnB1c2goIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNjcD1uZXcgX0tNTm90aWZ5UHJvbWlzKHJlZ2lzdGVyLHRoaXMuX1JFVl9NT1RPUl9DT01NQU5EW3JlZ2lzdGVyXSx0aGlzLl9ub3RpZnlQcm9taXNMaXN0LHJlc29sdmUscmVqZWN0LDUwMDApOy8vbm90aWZ557WM55Sx44GucmVzdWx044KSUHJvbWlz44Go57SQ5LuY44GRXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCwgcmVnaXN0ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWRSZWdpc3RlciwgYnVmZmVyLGNjcCk7XG4gICAgICAgICAgICAgICAgICAgIH0pKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgUHJvbWlzZS5hbGwocHJvbWlzZUxpc3QpLnRoZW4oKHJlc2FyKT0+e1xuICAgICAgICAgICAgICAgICAgICBsZXQgdD1be31dLmNvbmNhdChyZXNhcik7XG4gICAgICAgICAgICAgICAgICAgIGxldCBydG9iaj1PYmplY3QuYXNzaWduLmFwcGx5KG51bGwsdCk7XG4gICAgICAgICAgICAgICAgICAgIGFsbHJlc29sdmUocnRvYmopO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChtc2cpPT57XG4gICAgICAgICAgICAgICAgICAgIGFsbHJlamVjdChtc2cpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChsYXN0cmVzb2x2ZSwgbGFzdHJlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgbGV0IHJlZ2lzdGVyPXBhcnNlSW50KHJlZ2lzdGVycywxMCk7XG4gICAgICAgICAgICAgICAgbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBjY3A9bmV3IF9LTU5vdGlmeVByb21pcyhyZWdpc3Rlcix0aGlzLl9SRVZfTU9UT1JfQ09NTUFORFtyZWdpc3Rlcl0sdGhpcy5fbm90aWZ5UHJvbWlzTGlzdCxyZXNvbHZlLHJlamVjdCwxMDAwKTsvL25vdGlmeee1jOeUseOBrnJlc3VsdOOCklByb21pc+OBqOe0kOS7mOOBkVxuICAgICAgICAgICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICAgICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHJlZ2lzdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWRSZWdpc3RlciwgYnVmZmVyLGNjcCk7XG4gICAgICAgICAgICAgICAgfSkudGhlbigocmVzKT0+e1xuICAgICAgICAgICAgICAgICAgICBsYXN0cmVzb2x2ZShyZXNbT2JqZWN0LmtleXMocmVzKVswXV0pO1xuICAgICAgICAgICAgICAgIH0pLmNhdGNoKChtc2cpPT57XG4gICAgICAgICAgICAgICAgICAgIGxhc3RyZWplY3QobXNnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Gu5YWo44Gm44Gu44Os44K444K544K/5YCk44Gu5Y+W5b6XICjlu4PmraLkuojlrpoxLjMuMuOAnClcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZS48YXJyYXk+fVxuICAgICAqL1xuICAgIGNtZFJlYWRBbGxSZWdpc3Rlcigpe1xuICAgICAgICAvL2luZm86OuW7g+atouS6iOWumjEuMy4y44CcIE1vdG9yRmFybeOBrnZlcnNpb27jgavjgojjgorjgIHlj5blvpflh7rmnaXjgarjgYTjg6zjgrjjgrnjgr/jgYzlrZjlnKjjgZnjgovngrrjgIJcbiAgICAgICAgLy8g77yI5a2Y5Zyo44GX44Gq44GE44Os44K444K544K/44GMMeOBpOOBp+OCguOBguOCi+OBqOODl+ODreODkeODhuOCo+OBjOaPg+OCj+OBmnRpbWVvdXTjgavjgarjgovvvIlcbiAgICAgICAgbGV0IGNtPSB0aGlzLmNvbnN0cnVjdG9yLmNtZFJlYWRSZWdpc3Rlcl9DT01NQU5EO1xuICAgICAgICBsZXQgYWxsY21kcz1bXTtcbiAgICAgICAgT2JqZWN0LmtleXMoY20pLmZvckVhY2goKGspPT57YWxsY21kcy5wdXNoKGNtW2tdKTt9KTtcblxuICAgICAgICByZXR1cm4gdGhpcy5jbWRSZWFkUmVnaXN0ZXIoYWxsY21kcyk7XG4gICAgfVxuICAgIC8vLy8vL+S/neWtmFxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBruioreWumuWApOOCkuODleODqeODg+OCt+ODpeODoeODouODquOBq+S/neWtmOOBmeOCi1xuICAgICAqIEBkZXNjIOacrOOCs+ODnuODs+ODieOCkuWun+ihjOOBl+OBquOBhOmZkOOCiuOAgeioreWumuWApOOBr+ODouODvOOCv+ODvOOBq+awuOS5heeahOOBq+S/neWtmOOBleOCjOOBquOBhCjlho3otbfli5XjgafmtojjgYjjgospXG4gICAgICovXG4gICAgY21kU2F2ZUFsbFJlZ2lzdGVycygpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc2F2ZUFsbFJlZ2lzdGVycyk7XG4gICAgfVxuXG4gICAgLy8vLy8v44Oq44K744OD44OIXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5oyH5a6a44GX44Gf44Os44K444K544K/44KS44OV44Kh44O844Og44Km44Kn44Ki44Gu5Yid5pyf5YCk44Gr44Oq44K744OD44OI44GZ44KLXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLmNtZFJlYWRSZWdpc3Rlcl9DT01NQU5EfSByZWdpc3RlciDliJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgovjgrPjg57jg7Pjg4ko44Os44K444K544K/KeWApFxuICAgICAqL1xuICAgIGNtZFJlc2V0UmVnaXN0ZXIocmVnaXN0ZXIpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KHJlZ2lzdGVyLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZXNldFJlZ2lzdGVyLGJ1ZmZlcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBruODrOOCuOOCueOCv+OCkuODleOCoeODvOODoOOCpuOCp+OCouOBruWIneacn+WApOOBq+ODquOCu+ODg+ODiOOBmeOCi1xuICAgICAqIEBkZXNjIGJsZVNhdmVBbGxSZWdpc3RlcnPjgpLlrp/ooYzjgZfjgarjgYTpmZDjgorjgIHjg6rjgrvjg4Pjg4jlgKTjga/jg6Ljg7zjgr/jg7zjgavmsLjkuYXnmoTjgavkv53lrZjjgZXjgozjgarjgYQo5YaN6LW35YuV44Gn5raI44GI44KLKVxuICAgICAqL1xuICAgIGNtZFJlc2V0QWxsUmVnaXN0ZXJzKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZXNldEFsbFJlZ2lzdGVycyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODh+ODkOOCpOOCueODjeODvOODoOOBruWPluW+l1xuICAgICAqIEBkZXNjIOODh+ODkOOCpOOCueODjeODvOODoOOCkuiqreOBv+WPluOCi1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGludHxBcnJheT59XG4gICAgICovXG4gICAgY21kUmVhZERldmljZU5hbWUoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kUmVhZFJlZ2lzdGVyKHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZERldmljZU5hbWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODh+ODkOOCpOOCueaDheWgseOBruWPluW+l1xuICAgICAqIEBkZXNjIOODh+ODkOOCpOOCueOCpOODs+ODleOCqeODoeODvOOCt+ODp+ODs+OCkuiqreOBv+WPluOCi1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGFueT59XG4gICAgICovXG4gICAgY21kUmVhZERldmljZUluZm8oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kUmVhZFJlZ2lzdGVyKHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZERldmljZUluZm8pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IEkyQ+OCueODrOODvOODluOCouODieODrOOCuVxuICAgICAqIEBkZXNjIEkyQ+OBi+OCieWItuW+oeOBmeOCi+WgtOWQiOOBruOCueODrOODvOODluOCouODieODrOOCue+8iDB4MDAtMHhGRu+8ieOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhZGRyZXNzIOOCouODieODrOOCuVxuICAgICAqL1xuICAgIGNtZFNldEkyQ1NsYXZlQWRkcmVzcyhhZGRyZXNzKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxwYXJzZUludChhZGRyZXNzLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zZXRJMkNTbGF2ZUFkZHJlc3MsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlhoXpg6hcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgX2lzSW5zdGFuY09mUHJvbWlzZShhbnkpe1xuICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgUHJvbWlzZSB8fCAob2JqICYmIHR5cGVvZiBvYmoudGhlbiA9PT0gJ2Z1bmN0aW9uJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5LuW44Gu56e75YuV57O744Gu44Kz44Oe44Oz44OJ44KS5a6f6KGM5pmC44CB5pei44Gr56e75YuV57O744GuU3luY+OCs+ODnuODs+ODieOBjOWun+ihjOOBleOCjOOBpuOBhOOCi+WgtOWQiOOBr+OBneOBrkNC44KSUmVqZWN044GZ44KLXG4gICAgICog56e75YuV57O744GuU3luY+OCs+ODnuODs+ODie+8iGNtZE1vdmVCeURpc3RhbmNlU3luY+OAgWNtZE1vdmVUb1Bvc2l0aW9uU3luY++8ieetiVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX21vdmVTeW5jSW5zdHJ1Y3Rpb25PdmVycmlkZVJlamVjdChjaWQpe1xuICAgICAgICBpZih0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb24pe1xuICAgICAgICAgICAgdGhpcy5fUG9zaXRpb25BcnJpdmFsTm90aWZpY2F0aW9uLmNhbGxSZWplY3Qoe2lkOnRoaXMuX1Bvc2l0aW9uQXJyaXZhbE5vdGlmaWNhdGlvbi50YWdOYW1lLG1zZzonSW5zdHJ1Y3Rpb24gb3ZlcnJpZGUnLG92ZXJyaWRlSWQ6Y2lkfSk7XG4gICAgICAgICAgICB0aGlzLl9Qb3NpdGlvbkFycml2YWxOb3RpZmljYXRpb249bnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuXG4vLy8vLy9jbGFzcy8vXG59XG5cblxuLyoqXG4gKiBTZW5kQmxlTm90aWZ5UHJvbWlzXG4gKiDjgIBjbWRSZWFkUmVnaXN0ZXLnrYnjga5CTEXlkbzjgbPlh7rjgZflvozjgatcbiAqIOOAgOOCs+ODnuODs+ODiee1kOaenOOBjG5vdGlmeeOBp+mAmuefpeOBleOCjOOCi+OCs+ODnuODs+ODieOCklByb21pc+OBqOe0kOS7mOOBkeOCi+eCuuOBruOCr+ODqeOCuVxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX0tNTm90aWZ5UHJvbWlze1xuICAgIC8v5oiQ5Yqf6YCa55+lXG4gICAgc3RhdGljIHNlbmRHcm91cE5vdGlmeVJlc29sdmUoZ3JvdXBBcnJheSx0YWdOYW1lLHZhbCl7XG4gICAgICAgIGlmKCFBcnJheS5pc0FycmF5KGdyb3VwQXJyYXkpKXtyZXR1cm47fVxuICAgICAgICAvL+mAgeS/oUlE44Gu6YCa55+lIENhbGxiYWNrUHJvbWlz44Gn5ZG844Gz5Ye644GX5YWD44Gu44Oh44K944OD44OJ44GuUHJvbWlz44Gr6L+U44GZXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPGdyb3VwQXJyYXkubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYoIGdyb3VwQXJyYXlbaV0udGFnTmFtZT09PXRhZ05hbWUgKXtcbiAgICAgICAgICAgICAgICBncm91cEFycmF5W2ldLmNhbGxSZXNvbHZlKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogY29uc3RcbiAgICAgKiBAcGFyYW0gdGFnTmFtZVxuICAgICAqIEBwYXJhbSBncm91cEFycmF5XG4gICAgICogQHBhcmFtIHByb21pc1Jlc29sdmVPYmpcbiAgICAgKiBAcGFyYW0gcHJvbWlzUmVqZWN0T2JqXG4gICAgICogQHBhcmFtIHJlamVjdFRpbWVPdXRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0YWdOYW1lLHRhZ0luZm89bnVsbCxncm91cEFycmF5PVtdLHByb21pc1Jlc29sdmVPYmosIHByb21pc1JlamVjdE9iaixyZWplY3RUaW1lT3V0KXtcbiAgICAgICAgdGhpcy50aW1lb3V0SWQ9MDtcbiAgICAgICAgdGhpcy50YWdOYW1lPXRhZ05hbWU7XG4gICAgICAgIHRoaXMudGFnSW5mbz10YWdJbmZvO1xuICAgICAgICB0aGlzLmdyb3VwQXJyYXk9QXJyYXkuaXNBcnJheShncm91cEFycmF5KT9ncm91cEFycmF5OltdO1xuICAgICAgICB0aGlzLmdyb3VwQXJyYXkucHVzaCh0aGlzKTtcbiAgICAgICAgdGhpcy5wcm9taXNSZXNvbHZlT2JqPXByb21pc1Jlc29sdmVPYmo7XG4gICAgICAgIHRoaXMucHJvbWlzUmVqZWN0T2JqPXByb21pc1JlamVjdE9iajtcbiAgICAgICAgdGhpcy5yZWplY3RUaW1lT3V0PXJlamVjdFRpbWVPdXQ7XG4gICAgfVxuICAgIC8v44Kr44Km44Oz44OI44Gu6ZaL5aeLIGNoYXJhY3RlcmlzdGljcy53cml0ZVZhbHVl5ZG844Gz5Ye644GX5b6M44Gr5a6f6KGMXG4gICAgc3RhcnRSZWplY3RUaW1lT3V0Q291bnQoKXtcbiAgICAgICAgdGhpcy50aW1lb3V0SWQ9c2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlR3JvdXAoKTtcbiAgICAgICAgICAgIHRoaXMucHJvbWlzUmVqZWN0T2JqKHttc2c6XCJ0aW1lb3V0OlwiLHRhZ05hbWU6dGhpcy50YWdOYW1lLHRhZ0luZm86dGhpcy50YWdJbmZvfSk7XG4gICAgICAgIH0sIHRoaXMucmVqZWN0VGltZU91dCk7XG4gICAgfVxuICAgIGNhbGxSZXNvbHZlKGFyZyl7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUdyb3VwKCk7XG4gICAgICAgIHRoaXMucHJvbWlzUmVzb2x2ZU9iaihhcmcpO1xuICAgIH1cbiAgICBjYWxsUmVqZWN0KG1zZyl7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUdyb3VwKCk7XG4gICAgICAgIHRoaXMucHJvbWlzUmVqZWN0T2JqKHttc2c6bXNnfSk7XG4gICAgfVxuXG4gICAgX3JlbW92ZUdyb3VwKCl7XG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMuZ3JvdXBBcnJheS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZiggdGhpcy5ncm91cEFycmF5W2ldPT09dGhpcyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cEFycmF5LnNwbGljZShpLDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID1LTU1vdG9yQ29tbWFuZEtNT25lO1xuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9LTU1vdG9yQ29tbWFuZEtNT25lLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFIgPSB0eXBlb2YgUmVmbGVjdCA9PT0gJ29iamVjdCcgPyBSZWZsZWN0IDogbnVsbFxudmFyIFJlZmxlY3RBcHBseSA9IFIgJiYgdHlwZW9mIFIuYXBwbHkgPT09ICdmdW5jdGlvbidcbiAgPyBSLmFwcGx5XG4gIDogZnVuY3Rpb24gUmVmbGVjdEFwcGx5KHRhcmdldCwgcmVjZWl2ZXIsIGFyZ3MpIHtcbiAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmNhbGwodGFyZ2V0LCByZWNlaXZlciwgYXJncyk7XG4gIH1cblxudmFyIFJlZmxlY3RPd25LZXlzXG5pZiAoUiAmJiB0eXBlb2YgUi5vd25LZXlzID09PSAnZnVuY3Rpb24nKSB7XG4gIFJlZmxlY3RPd25LZXlzID0gUi5vd25LZXlzXG59IGVsc2UgaWYgKE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMpIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KVxuICAgICAgLmNvbmNhdChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKHRhcmdldCkpO1xuICB9O1xufSBlbHNlIHtcbiAgUmVmbGVjdE93bktleXMgPSBmdW5jdGlvbiBSZWZsZWN0T3duS2V5cyh0YXJnZXQpIHtcbiAgICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGFyZ2V0KTtcbiAgfTtcbn1cblxuZnVuY3Rpb24gUHJvY2Vzc0VtaXRXYXJuaW5nKHdhcm5pbmcpIHtcbiAgaWYgKGNvbnNvbGUgJiYgY29uc29sZS53YXJuKSBjb25zb2xlLndhcm4od2FybmluZyk7XG59XG5cbnZhciBOdW1iZXJJc05hTiA9IE51bWJlci5pc05hTiB8fCBmdW5jdGlvbiBOdW1iZXJJc05hTih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT09IHZhbHVlO1xufVxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIEV2ZW50RW1pdHRlci5pbml0LmNhbGwodGhpcyk7XG59XG5tb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcblxuLy8gQmFja3dhcmRzLWNvbXBhdCB3aXRoIG5vZGUgMC4xMC54XG5FdmVudEVtaXR0ZXIuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHMgPSB1bmRlZmluZWQ7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9ldmVudHNDb3VudCA9IDA7XG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLl9tYXhMaXN0ZW5lcnMgPSB1bmRlZmluZWQ7XG5cbi8vIEJ5IGRlZmF1bHQgRXZlbnRFbWl0dGVycyB3aWxsIHByaW50IGEgd2FybmluZyBpZiBtb3JlIHRoYW4gMTAgbGlzdGVuZXJzIGFyZVxuLy8gYWRkZWQgdG8gaXQuIFRoaXMgaXMgYSB1c2VmdWwgZGVmYXVsdCB3aGljaCBoZWxwcyBmaW5kaW5nIG1lbW9yeSBsZWFrcy5cbnZhciBkZWZhdWx0TWF4TGlzdGVuZXJzID0gMTA7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShFdmVudEVtaXR0ZXIsICdkZWZhdWx0TWF4TGlzdGVuZXJzJywge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBkZWZhdWx0TWF4TGlzdGVuZXJzO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uKGFyZykge1xuICAgIGlmICh0eXBlb2YgYXJnICE9PSAnbnVtYmVyJyB8fCBhcmcgPCAwIHx8IE51bWJlcklzTmFOKGFyZykpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdUaGUgdmFsdWUgb2YgXCJkZWZhdWx0TWF4TGlzdGVuZXJzXCIgaXMgb3V0IG9mIHJhbmdlLiBJdCBtdXN0IGJlIGEgbm9uLW5lZ2F0aXZlIG51bWJlci4gUmVjZWl2ZWQgJyArIGFyZyArICcuJyk7XG4gICAgfVxuICAgIGRlZmF1bHRNYXhMaXN0ZW5lcnMgPSBhcmc7XG4gIH1cbn0pO1xuXG5FdmVudEVtaXR0ZXIuaW5pdCA9IGZ1bmN0aW9uKCkge1xuXG4gIGlmICh0aGlzLl9ldmVudHMgPT09IHVuZGVmaW5lZCB8fFxuICAgICAgdGhpcy5fZXZlbnRzID09PSBPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcykuX2V2ZW50cykge1xuICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICB9XG5cbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn07XG5cbi8vIE9idmlvdXNseSBub3QgYWxsIEVtaXR0ZXJzIHNob3VsZCBiZSBsaW1pdGVkIHRvIDEwLiBUaGlzIGZ1bmN0aW9uIGFsbG93c1xuLy8gdGhhdCB0byBiZSBpbmNyZWFzZWQuIFNldCB0byB6ZXJvIGZvciB1bmxpbWl0ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnNldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIHNldE1heExpc3RlbmVycyhuKSB7XG4gIGlmICh0eXBlb2YgbiAhPT0gJ251bWJlcicgfHwgbiA8IDAgfHwgTnVtYmVySXNOYU4obikpIHtcbiAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIG9mIFwiblwiIGlzIG91dCBvZiByYW5nZS4gSXQgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXIuIFJlY2VpdmVkICcgKyBuICsgJy4nKTtcbiAgfVxuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSBuO1xuICByZXR1cm4gdGhpcztcbn07XG5cbmZ1bmN0aW9uICRnZXRNYXhMaXN0ZW5lcnModGhhdCkge1xuICBpZiAodGhhdC5fbWF4TGlzdGVuZXJzID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICByZXR1cm4gdGhhdC5fbWF4TGlzdGVuZXJzO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmdldE1heExpc3RlbmVycyA9IGZ1bmN0aW9uIGdldE1heExpc3RlbmVycygpIHtcbiAgcmV0dXJuICRnZXRNYXhMaXN0ZW5lcnModGhpcyk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbiBlbWl0KHR5cGUpIHtcbiAgdmFyIGFyZ3MgPSBbXTtcbiAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICB2YXIgZG9FcnJvciA9ICh0eXBlID09PSAnZXJyb3InKTtcblxuICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICBpZiAoZXZlbnRzICE9PSB1bmRlZmluZWQpXG4gICAgZG9FcnJvciA9IChkb0Vycm9yICYmIGV2ZW50cy5lcnJvciA9PT0gdW5kZWZpbmVkKTtcbiAgZWxzZSBpZiAoIWRvRXJyb3IpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKGRvRXJyb3IpIHtcbiAgICB2YXIgZXI7XG4gICAgaWYgKGFyZ3MubGVuZ3RoID4gMClcbiAgICAgIGVyID0gYXJnc1swXTtcbiAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgLy8gTm90ZTogVGhlIGNvbW1lbnRzIG9uIHRoZSBgdGhyb3dgIGxpbmVzIGFyZSBpbnRlbnRpb25hbCwgdGhleSBzaG93XG4gICAgICAvLyB1cCBpbiBOb2RlJ3Mgb3V0cHV0IGlmIHRoaXMgcmVzdWx0cyBpbiBhbiB1bmhhbmRsZWQgZXhjZXB0aW9uLlxuICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgfVxuICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICB2YXIgZXJyID0gbmV3IEVycm9yKCdVbmhhbmRsZWQgZXJyb3IuJyArIChlciA/ICcgKCcgKyBlci5tZXNzYWdlICsgJyknIDogJycpKTtcbiAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgIHRocm93IGVycjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgfVxuXG4gIHZhciBoYW5kbGVyID0gZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChoYW5kbGVyID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmICh0eXBlb2YgaGFuZGxlciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIFJlZmxlY3RBcHBseShoYW5kbGVyLCB0aGlzLCBhcmdzKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgbGVuID0gaGFuZGxlci5sZW5ndGg7XG4gICAgdmFyIGxpc3RlbmVycyA9IGFycmF5Q2xvbmUoaGFuZGxlciwgbGVuKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgKytpKVxuICAgICAgUmVmbGVjdEFwcGx5KGxpc3RlbmVyc1tpXSwgdGhpcywgYXJncyk7XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn07XG5cbmZ1bmN0aW9uIF9hZGRMaXN0ZW5lcih0YXJnZXQsIHR5cGUsIGxpc3RlbmVyLCBwcmVwZW5kKSB7XG4gIHZhciBtO1xuICB2YXIgZXZlbnRzO1xuICB2YXIgZXhpc3Rpbmc7XG5cbiAgaWYgKHR5cGVvZiBsaXN0ZW5lciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBcImxpc3RlbmVyXCIgYXJndW1lbnQgbXVzdCBiZSBvZiB0eXBlIEZ1bmN0aW9uLiBSZWNlaXZlZCB0eXBlICcgKyB0eXBlb2YgbGlzdGVuZXIpO1xuICB9XG5cbiAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG4gIGlmIChldmVudHMgPT09IHVuZGVmaW5lZCkge1xuICAgIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICB0YXJnZXQuX2V2ZW50c0NvdW50ID0gMDtcbiAgfSBlbHNlIHtcbiAgICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAgIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgICBpZiAoZXZlbnRzLm5ld0xpc3RlbmVyICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRhcmdldC5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA/IGxpc3RlbmVyLmxpc3RlbmVyIDogbGlzdGVuZXIpO1xuXG4gICAgICAvLyBSZS1hc3NpZ24gYGV2ZW50c2AgYmVjYXVzZSBhIG5ld0xpc3RlbmVyIGhhbmRsZXIgY291bGQgaGF2ZSBjYXVzZWQgdGhlXG4gICAgICAvLyB0aGlzLl9ldmVudHMgdG8gYmUgYXNzaWduZWQgdG8gYSBuZXcgb2JqZWN0XG4gICAgICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cztcbiAgICB9XG4gICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV07XG4gIH1cblxuICBpZiAoZXhpc3RpbmcgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIE9wdGltaXplIHRoZSBjYXNlIG9mIG9uZSBsaXN0ZW5lci4gRG9uJ3QgbmVlZCB0aGUgZXh0cmEgYXJyYXkgb2JqZWN0LlxuICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gICAgKyt0YXJnZXQuX2V2ZW50c0NvdW50O1xuICB9IGVsc2Uge1xuICAgIGlmICh0eXBlb2YgZXhpc3RpbmcgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgICAgZXhpc3RpbmcgPSBldmVudHNbdHlwZV0gPVxuICAgICAgICBwcmVwZW5kID8gW2xpc3RlbmVyLCBleGlzdGluZ10gOiBbZXhpc3RpbmcsIGxpc3RlbmVyXTtcbiAgICAgIC8vIElmIHdlJ3ZlIGFscmVhZHkgZ290IGFuIGFycmF5LCBqdXN0IGFwcGVuZC5cbiAgICB9IGVsc2UgaWYgKHByZXBlbmQpIHtcbiAgICAgIGV4aXN0aW5nLnVuc2hpZnQobGlzdGVuZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICBleGlzdGluZy5wdXNoKGxpc3RlbmVyKTtcbiAgICB9XG5cbiAgICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICAgIG0gPSAkZ2V0TWF4TGlzdGVuZXJzKHRhcmdldCk7XG4gICAgaWYgKG0gPiAwICYmIGV4aXN0aW5nLmxlbmd0aCA+IG0gJiYgIWV4aXN0aW5nLndhcm5lZCkge1xuICAgICAgZXhpc3Rpbmcud2FybmVkID0gdHJ1ZTtcbiAgICAgIC8vIE5vIGVycm9yIGNvZGUgZm9yIHRoaXMgc2luY2UgaXQgaXMgYSBXYXJuaW5nXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1zeW50YXhcbiAgICAgIHZhciB3ID0gbmV3IEVycm9yKCdQb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5IGxlYWsgZGV0ZWN0ZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICBleGlzdGluZy5sZW5ndGggKyAnICcgKyBTdHJpbmcodHlwZSkgKyAnIGxpc3RlbmVycyAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2FkZGVkLiBVc2UgZW1pdHRlci5zZXRNYXhMaXN0ZW5lcnMoKSB0byAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2luY3JlYXNlIGxpbWl0Jyk7XG4gICAgICB3Lm5hbWUgPSAnTWF4TGlzdGVuZXJzRXhjZWVkZWRXYXJuaW5nJztcbiAgICAgIHcuZW1pdHRlciA9IHRhcmdldDtcbiAgICAgIHcudHlwZSA9IHR5cGU7XG4gICAgICB3LmNvdW50ID0gZXhpc3RpbmcubGVuZ3RoO1xuICAgICAgUHJvY2Vzc0VtaXRXYXJuaW5nKHcpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0YXJnZXQ7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICByZXR1cm4gX2FkZExpc3RlbmVyKHRoaXMsIHR5cGUsIGxpc3RlbmVyLCBmYWxzZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5wcmVwZW5kTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgdHJ1ZSk7XG4gICAgfTtcblxuZnVuY3Rpb24gb25jZVdyYXBwZXIoKSB7XG4gIHZhciBhcmdzID0gW107XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgaWYgKCF0aGlzLmZpcmVkKSB7XG4gICAgdGhpcy50YXJnZXQucmVtb3ZlTGlzdGVuZXIodGhpcy50eXBlLCB0aGlzLndyYXBGbik7XG4gICAgdGhpcy5maXJlZCA9IHRydWU7XG4gICAgUmVmbGVjdEFwcGx5KHRoaXMubGlzdGVuZXIsIHRoaXMudGFyZ2V0LCBhcmdzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBfb25jZVdyYXAodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgc3RhdGUgPSB7IGZpcmVkOiBmYWxzZSwgd3JhcEZuOiB1bmRlZmluZWQsIHRhcmdldDogdGFyZ2V0LCB0eXBlOiB0eXBlLCBsaXN0ZW5lcjogbGlzdGVuZXIgfTtcbiAgdmFyIHdyYXBwZWQgPSBvbmNlV3JhcHBlci5iaW5kKHN0YXRlKTtcbiAgd3JhcHBlZC5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICBzdGF0ZS53cmFwRm4gPSB3cmFwcGVkO1xuICByZXR1cm4gd3JhcHBlZDtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24gb25jZSh0eXBlLCBsaXN0ZW5lcikge1xuICBpZiAodHlwZW9mIGxpc3RlbmVyICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRnVuY3Rpb24uIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBsaXN0ZW5lcik7XG4gIH1cbiAgdGhpcy5vbih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnByZXBlbmRPbmNlTGlzdGVuZXIgPVxuICAgIGZ1bmN0aW9uIHByZXBlbmRPbmNlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRnVuY3Rpb24uIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBsaXN0ZW5lcik7XG4gICAgICB9XG4gICAgICB0aGlzLnByZXBlbmRMaXN0ZW5lcih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbi8vIEVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZiBhbmQgb25seSBpZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbiAgICBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgdmFyIGxpc3QsIGV2ZW50cywgcG9zaXRpb24sIGksIG9yaWdpbmFsTGlzdGVuZXI7XG5cbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwibGlzdGVuZXJcIiBhcmd1bWVudCBtdXN0IGJlIG9mIHR5cGUgRnVuY3Rpb24uIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBsaXN0ZW5lcik7XG4gICAgICB9XG5cbiAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIGxpc3QgPSBldmVudHNbdHlwZV07XG4gICAgICBpZiAobGlzdCA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8IGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICgtLXRoaXMuX2V2ZW50c0NvdW50ID09PSAwKVxuICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgICAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0Lmxpc3RlbmVyIHx8IGxpc3RlbmVyKTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgbGlzdCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBwb3NpdGlvbiA9IC0xO1xuXG4gICAgICAgIGZvciAoaSA9IGxpc3QubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHwgbGlzdFtpXS5saXN0ZW5lciA9PT0gbGlzdGVuZXIpIHtcbiAgICAgICAgICAgIG9yaWdpbmFsTGlzdGVuZXIgPSBsaXN0W2ldLmxpc3RlbmVyO1xuICAgICAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uIDwgMClcbiAgICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgICBpZiAocG9zaXRpb24gPT09IDApXG4gICAgICAgICAgbGlzdC5zaGlmdCgpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBzcGxpY2VPbmUobGlzdCwgcG9zaXRpb24pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAxKVxuICAgICAgICAgIGV2ZW50c1t0eXBlXSA9IGxpc3RbMF07XG5cbiAgICAgICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lciAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBvcmlnaW5hbExpc3RlbmVyIHx8IGxpc3RlbmVyKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vZmYgPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyO1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9XG4gICAgZnVuY3Rpb24gcmVtb3ZlQWxsTGlzdGVuZXJzKHR5cGUpIHtcbiAgICAgIHZhciBsaXN0ZW5lcnMsIGV2ZW50cywgaTtcblxuICAgICAgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuICAgICAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgICAgICByZXR1cm4gdGhpcztcblxuICAgICAgLy8gbm90IGxpc3RlbmluZyBmb3IgcmVtb3ZlTGlzdGVuZXIsIG5vIG5lZWQgdG8gZW1pdFxuICAgICAgaWYgKGV2ZW50cy5yZW1vdmVMaXN0ZW5lciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gICAgICAgIH0gZWxzZSBpZiAoZXZlbnRzW3R5cGVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMClcbiAgICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1t0eXBlXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICB2YXIga2V5cyA9IE9iamVjdC5rZXlzKGV2ZW50cyk7XG4gICAgICAgIHZhciBrZXk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBrZXlzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgICAga2V5ID0ga2V5c1tpXTtcbiAgICAgICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycyhrZXkpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICB0aGlzLl9ldmVudHNDb3VudCA9IDA7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgfVxuXG4gICAgICBsaXN0ZW5lcnMgPSBldmVudHNbdHlwZV07XG5cbiAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXJzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgICAgIH0gZWxzZSBpZiAobGlzdGVuZXJzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgLy8gTElGTyBvcmRlclxuICAgICAgICBmb3IgKGkgPSBsaXN0ZW5lcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuZnVuY3Rpb24gX2xpc3RlbmVycyh0YXJnZXQsIHR5cGUsIHVud3JhcCkge1xuICB2YXIgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG5cbiAgaWYgKGV2ZW50cyA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBbXTtcblxuICB2YXIgZXZsaXN0ZW5lciA9IGV2ZW50c1t0eXBlXTtcbiAgaWYgKGV2bGlzdGVuZXIgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gW107XG5cbiAgaWYgKHR5cGVvZiBldmxpc3RlbmVyID09PSAnZnVuY3Rpb24nKVxuICAgIHJldHVybiB1bndyYXAgPyBbZXZsaXN0ZW5lci5saXN0ZW5lciB8fCBldmxpc3RlbmVyXSA6IFtldmxpc3RlbmVyXTtcblxuICByZXR1cm4gdW53cmFwID9cbiAgICB1bndyYXBMaXN0ZW5lcnMoZXZsaXN0ZW5lcikgOiBhcnJheUNsb25lKGV2bGlzdGVuZXIsIGV2bGlzdGVuZXIubGVuZ3RoKTtcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbiBsaXN0ZW5lcnModHlwZSkge1xuICByZXR1cm4gX2xpc3RlbmVycyh0aGlzLCB0eXBlLCB0cnVlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmF3TGlzdGVuZXJzID0gZnVuY3Rpb24gcmF3TGlzdGVuZXJzKHR5cGUpIHtcbiAgcmV0dXJuIF9saXN0ZW5lcnModGhpcywgdHlwZSwgZmFsc2UpO1xufTtcblxuRXZlbnRFbWl0dGVyLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbihlbWl0dGVyLCB0eXBlKSB7XG4gIGlmICh0eXBlb2YgZW1pdHRlci5saXN0ZW5lckNvdW50ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbGlzdGVuZXJDb3VudC5jYWxsKGVtaXR0ZXIsIHR5cGUpO1xuICB9XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBsaXN0ZW5lckNvdW50O1xuZnVuY3Rpb24gbGlzdGVuZXJDb3VudCh0eXBlKSB7XG4gIHZhciBldmVudHMgPSB0aGlzLl9ldmVudHM7XG5cbiAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSBldmVudHNbdHlwZV07XG5cbiAgICBpZiAodHlwZW9mIGV2bGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiAxO1xuICAgIH0gZWxzZSBpZiAoZXZsaXN0ZW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIDA7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuZXZlbnROYW1lcyA9IGZ1bmN0aW9uIGV2ZW50TmFtZXMoKSB7XG4gIHJldHVybiB0aGlzLl9ldmVudHNDb3VudCA+IDAgPyBSZWZsZWN0T3duS2V5cyh0aGlzLl9ldmVudHMpIDogW107XG59O1xuXG5mdW5jdGlvbiBhcnJheUNsb25lKGFyciwgbikge1xuICB2YXIgY29weSA9IG5ldyBBcnJheShuKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBuOyArK2kpXG4gICAgY29weVtpXSA9IGFycltpXTtcbiAgcmV0dXJuIGNvcHk7XG59XG5cbmZ1bmN0aW9uIHNwbGljZU9uZShsaXN0LCBpbmRleCkge1xuICBmb3IgKDsgaW5kZXggKyAxIDwgbGlzdC5sZW5ndGg7IGluZGV4KyspXG4gICAgbGlzdFtpbmRleF0gPSBsaXN0W2luZGV4ICsgMV07XG4gIGxpc3QucG9wKCk7XG59XG5cbmZ1bmN0aW9uIHVud3JhcExpc3RlbmVycyhhcnIpIHtcbiAgdmFyIHJldCA9IG5ldyBBcnJheShhcnIubGVuZ3RoKTtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXQubGVuZ3RoOyArK2kpIHtcbiAgICByZXRbaV0gPSBhcnJbaV0ubGlzdGVuZXIgfHwgYXJyW2ldO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzXG4vLyBtb2R1bGUgaWQgPSA4XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIl0sInNvdXJjZVJvb3QiOiIifQ==