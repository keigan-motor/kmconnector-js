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
         *
         * @#Notify したときの返り値)---------------------------------------------
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
            81:{id:81,type:"KM_ERROR_OVER_HEAT",msg:"Over Heat (over temperature)"}//温度異常
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
    * @property {number} ownColor - 58:デバイスLEDの固有色
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
            /** PIDゲインをリセットする */ resetPID:0x22,
            /** モーター測定値の取得間隔(USB,I2Cのみ) */ motorMeasurementInterval:0x2C,
            /** モーター測定値の取得設定 */ motorMeasurementByDefault:0x2D,
            /** モーター制御手段（インターフェイス）の設定 */ interface:0x2E,

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
     * @returns {*}
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
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.runForward);
    }

    /**
     * @summary 逆回転する（時計回り）
     * @desc cmdSpeed で保存された速度で、逆回転
     */
    cmdRunReverse(){
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.runReverse);
    }

    /**
     * @summary 絶対位置に移動する
     * @desc 速さは cmdSpeed で保存された速度が採用される
     * @param {number} position float 角度：radians
     * @param {number} speed float 速度の大きさ 単位：角度（ラジアン）/秒 [0-X rps]　(正の数)
     */
    cmdMoveToPosition(position,speed=null){
        if(position=== undefined){return;}
        if(speed!==null){
            let buffer = new ArrayBuffer(8);
            new DataView(buffer).setFloat32(0,parseFloat(position,10));
            new DataView(buffer).setFloat32(4,parseFloat(speed,10));
            this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.moveToPositionSpeed,buffer);
        }else{
            let buffer = new ArrayBuffer(4);
            new DataView(buffer).setFloat32(0,parseFloat(position,10));
            this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.moveToPosition,buffer);
        }
    }

    /**
     * @summary 相対位置に移動する
     * @desc 速さは cmdSpeed で保存された速度が採用される
     * @param  {number} distance float 角度：radians[左:+radians 右:-radians]
     * @param {number} speed float 速度の大きさ 単位：角度（ラジアン）/秒 [0-X rps]　(正の数)
     */
    cmdMoveByDistance(distance = 0,speed=null){
        if(speed!==null){
            let buffer = new ArrayBuffer(8);
            new DataView(buffer).setFloat32(0,parseFloat(distance,10));
            new DataView(buffer).setFloat32(4,parseFloat(speed,10));
            this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.moveByDistanceSpeed,buffer);
        }else{
            let buffer = new ArrayBuffer(4);
            new DataView(buffer).setFloat32(0,parseFloat(distance,10));
            this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.moveByDistance,buffer);
        }

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
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.stop);
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
     * @summary IMU(ジャイロ)の値取得(通知)を開始する (BLE専用コマンド)
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
        _interval=_interval<1?2:_interval;
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
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setUint32(0,Math.abs(parseInt(interval,10)));
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
     * @summary モーターの位置PIDコントローラのP（比例）ゲインを設定する
     * @param {number} positionP float 位置Pゲイン（正の値）
     */
    cmdPositionP(positionP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(positionP,10)));
        this._KMCom._sendMotorCommand('MOTOR_TX',this._MOTOR_COMMAND.positionP,buffer);
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
     * @summary 指定した設定値を取得 (BLE専用コマンド)
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgYjhiZDFlYWUxZWNhYTI4NGY2YjgiLCJ3ZWJwYWNrOi8vLy4vbGliL0tNU3RydWN0dXJlcy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01VdGwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0tNQ29tV2ViQkxFLmpzIiwid2VicGFjazovLy8uL2xpYi9LTUNvbm5lY3RvckJyb3dzZXJXUEsuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01Nb3Rvck9uZVdlYkJMRS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01Db21CYXNlLmpzIiwid2VicGFjazovLy8uL2xpYi9LTU1vdG9yQ29tbWFuZEtNT25lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhO0FBQ2IsWUFBWSxtQkFBTyxDQUFDLENBQVM7OztBQUc3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsaUJBQWlCLFFBQVE7QUFDekI7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsMEZBQTBGO0FBQzFGO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjs7QUFFQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFdBQVc7QUFDL0I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0Esb0JBQW9CLGNBQWM7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxVQUFVO0FBQ3pCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxVQUFVO0FBQ3pCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0EsOENBQThDO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLDJCQUEyQjtBQUMxQyxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25COztBQUVBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakMsdUJBQXVCO0FBQ3ZCOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsb0NBQW9DO0FBQ25ELGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEIsZUFBZSxRQUFRO0FBQ3ZCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsT0FBTztBQUN6Qix1QkFBdUIsT0FBTztBQUM5QixxQkFBcUIsT0FBTztBQUM1QixxQkFBcUIsT0FBTztBQUM1Qix1QkFBdUIsT0FBTztBQUM5QixzQkFBc0IsT0FBTztBQUM3QixvQkFBb0I7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7QUNyVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhOztBQUViO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0EsdUJBQXVCLDZCQUE2QjtBQUNwRDtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUMseUJBQXlCO0FBQ3pCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQSw4Q0FBOEM7QUFDOUM7QUFDQSxvQkFBb0Isb0JBQW9CO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsYUFBYTtBQUM1QixlQUFlLGFBQWE7QUFDNUIsZ0JBQWdCLGFBQWE7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1Qjs7Ozs7OztBQ3BPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTtBQUNiLGNBQWMsbUJBQU8sQ0FBQyxDQUFTO0FBQy9CLGtCQUFrQixtQkFBTyxDQUFDLENBQWE7QUFDdkMsbUJBQW1CLG1CQUFPLENBQUMsQ0FBZ0I7O0FBRTNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBLDBDQUEwQyxRQUFRO0FBQ2xEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQSxxQ0FBcUM7QUFDckMsMENBQTBDLFFBQVE7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsT0FBTztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtDQUFrQztBQUNsQztBQUNBLDBDQUEwQyxRQUFRO0FBQ2xELHNDQUFzQztBQUN0Qyw4QkFBOEI7O0FBRTlCLHlDQUF5QztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEMsc0NBQXNDO0FBQ3RDLHFEQUFxRDtBQUNyRCwwQ0FBMEMsUUFBUTs7QUFFbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0M7QUFDdEMsdUNBQXVDLFFBQVE7O0FBRS9DLHlDQUF5QztBQUN6QywyQ0FBMkM7QUFDM0MsZ0RBQWdEOztBQUVoRDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1HQUFtRztBQUNuRztBQUNBO0FBQ0EsbUdBQW1HO0FBQ25HO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvR0FBb0c7QUFDcEc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1HQUFtRztBQUNuRztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxR0FBcUc7QUFDckc7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUZBQXlGO0FBQ3pGLDhGQUE4RjtBQUM5Rix5Q0FBeUMsa0JBQWtCLDhDQUE4QztBQUN6RztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esb0JBQW9CO0FBQ3BCO0FBQ0EsMkRBQTJEO0FBQzNELG9CQUFvQjtBQUNwQjtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrRUFBa0U7QUFDbEU7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkJBQTZCLHlDQUF5QztBQUN0RTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDJCQUEyQjtBQUMzQix1QkFBdUI7QUFDdkI7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCLG1CQUFtQjs7QUFFbkIsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSx1QkFBdUI7QUFDdkIsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQjtBQUNuQjtBQUNBLE9BQU87QUFDUDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUNBQXlDO0FBQ3pDO0FBQ0EsNkJBQTZCO0FBQzdCO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBaUQ7QUFDakQ7QUFDQTtBQUNBLDZDQUE2QyxjQUFjLFdBQVc7QUFDdEUseUNBQXlDO0FBQ3pDLHFDQUFxQztBQUNyQztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBO0FBQ0EsNkNBQTZDLGNBQWMsV0FBVztBQUN0RSx5Q0FBeUM7QUFDekMscUNBQXFDO0FBQ3JDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaURBQWlEO0FBQ2pEO0FBQ0E7QUFDQSw2Q0FBNkMsY0FBYyxXQUFXO0FBQ3RFLHlDQUF5QztBQUN6QyxxQ0FBcUM7QUFDckM7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQSxxQ0FBcUM7QUFDckMsaUNBQWlDO0FBQ2pDO0FBQ0EsaUNBQWlDO0FBQ2pDLDZCQUE2QjtBQUM3Qix5QkFBeUI7QUFDekIsc0NBQXNDLHlEQUF5RDtBQUMvRix5QkFBeUI7QUFDekI7QUFDQSx5QkFBeUI7QUFDekIsaUJBQWlCO0FBQ2pCLGFBQWE7QUFDYjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnREFBZ0Q7QUFDaEQ7QUFDQTtBQUNBLG9CQUFvQix5QkFBeUI7QUFDN0M7QUFDQTtBQUNBO0FBQ0EscUVBQXFFOztBQUVyRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7OztBQUdBO0FBQ0E7O0FBRUEsNEI7Ozs7Ozs7QUNuaUJBLDhDQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYSxtQkFBTyxDQUFDLENBQVk7QUFDakMsaUJBQWlCLG1CQUFPLENBQUMsQ0FBbUI7QUFDNUMsa0JBQWtCLG1CQUFPLENBQUMsQ0FBbUI7QUFDN0Msa0JBQWtCLG1CQUFPLENBQUMsQ0FBbUI7QUFDN0Msa0JBQWtCLG1CQUFPLENBQUMsQ0FBbUI7QUFDN0Msb0JBQW9CLG1CQUFPLENBQUMsQ0FBbUI7QUFDL0Msa0JBQWtCLG1CQUFPLENBQUMsQ0FBbUI7QUFDN0Msd0JBQXdCLG1CQUFPLENBQUMsQ0FBdUI7Ozs7Ozs7Ozs7QUNqQnZEOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7O0FBRTVDOzs7Ozs7OztBQ3BCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2E7O0FBRWIsa0JBQWtCLG1CQUFPLENBQUMsQ0FBZTtBQUN6Qyx3QkFBd0IsbUJBQU8sQ0FBQyxDQUEwQjs7QUFFMUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsaUM7Ozs7Ozs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhO0FBQ2IsWUFBWSxtQkFBTyxDQUFDLENBQVM7QUFDN0IsaUJBQWlCLG1CQUFPLENBQUMsQ0FBZ0I7QUFDekM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxnREFBZ0Q7QUFDL0QsZUFBZSxtREFBbUQ7QUFDbEUsZUFBZSwwREFBMEQ7QUFDekUsZUFBZSwrQ0FBK0M7QUFDOUQsZUFBZSx1REFBdUQ7QUFDdEUsZUFBZSwyREFBMkQ7QUFDMUUsZUFBZSwyREFBMkQ7QUFDMUUsZUFBZSx3REFBd0Q7QUFDdkUsZUFBZSx1R0FBdUc7QUFDdEgsZUFBZSx5REFBeUQ7QUFDeEUsZ0JBQWdCLHNGQUFzRjtBQUN0RyxnQkFBZ0Isd0RBQXdEO0FBQ3hFLGdCQUFnQiwwREFBMEQ7QUFDMUUsZ0JBQWdCLDREQUE0RDtBQUM1RSxnQkFBZ0Isc0NBQXNDO0FBQ3RELGdCQUFnQix3RUFBd0U7QUFDeEYsZ0JBQWdCLG1FQUFtRTtBQUNuRixnQkFBZ0IsaUVBQWlFO0FBQ2pGLGdCQUFnQiwrREFBK0Q7QUFDL0UsZ0JBQWdCLDJEQUEyRDtBQUMzRSxnQkFBZ0IsMkRBQTJEO0FBQzNFLGdCQUFnQiw4RUFBOEU7QUFDOUYsZ0JBQWdCLDREQUE0RDtBQUM1RSxnQkFBZ0IsbUVBQW1FO0FBQ25GO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0EsMkVBQTJFO0FBQzNFOztBQUVBO0FBQ0E7QUFDQSxlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsUUFBUTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYyxVQUFVLDZGQUE2RjtBQUNySDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBOzs7Ozs7Ozs7O0FDaFFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDYTtBQUNiLHFCQUFxQixtQkFBTyxDQUFDLENBQVE7QUFDckMsY0FBYyxtQkFBTyxDQUFDLENBQVM7QUFDL0Isb0JBQW9CLG1CQUFPLENBQUMsQ0FBZTtBQUMzQyxtQkFBbUIsbUJBQU8sQ0FBQyxDQUFnQjs7O0FBRzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Qsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekI7QUFDQTtBQUNBLGdCQUFnQjtBQUNoQjs7O0FBR0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCLGtCQUFrQixPQUFPO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxrQkFBa0IsT0FBTztBQUN6QixrQkFBa0IsT0FBTztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Qsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Qsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCLG9CQUFvQixPQUFPO0FBQzNCLG9CQUFvQixPQUFPO0FBQzNCLG9CQUFvQixPQUFPO0FBQzNCLG9CQUFvQixPQUFPO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLG9DQUFvQztBQUNuRCxlQUFlLE9BQU8saUJBQWlCLGVBQWUsRUFBRTtBQUN4RDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBLDJDQUEyQyxhQUFhO0FBQ3hELHdDQUF3QyxhQUFhO0FBQ3JELHdDQUF3QyxhQUFhO0FBQ3JELDJDQUEyQyxhQUFhLEVBQUUsSUFBSTtBQUM5RCxnREFBZ0QsaUJBQWlCO0FBQ2pFLGlEQUFpRCxpQkFBaUI7QUFDbEUsZ0RBQWdELFFBQVEsRUFBRSxlQUFlO0FBQ3pFO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQzs7QUFFM0M7QUFDQTtBQUNBLHVEQUF1RCxtREFBbUQ7QUFDMUc7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlFQUFpRTtBQUNqRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsV0FBVztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUJBQW1CLFdBQVc7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCLG1CQUFtQixXQUFXO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLG1CQUFtQixPQUFPO0FBQzFCLG1CQUFtQixPQUFPO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGdCQUFnQixPQUFPO0FBQ3ZCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsNERBQTREO0FBQzNFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxQ0FBcUM7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsNENBQTRDO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFD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QSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSCxvQkFBb0IsU0FBUztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiJLTUNvbm5lY3RvckJyb3dzZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAzKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBiOGJkMWVhZTFlY2FhMjg0ZjZiOCIsIi8qKipcbiAqIEtNU3RydWN0dXJlcy5qc1xuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xubGV0IEtNVXRsID0gcmVxdWlyZSgnLi9LTVV0bCcpO1xuXG5cbi8qKlxuICogQGNsYXNzZGVzYyDmp4vpgKDkvZPjga7ln7rlupXjgq/jg6njgrlcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01TdHJ1Y3R1cmVCYXNle1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOWQjOOBmOWApOOCkuaMgeOBpOOBi+OBruavlOi8g1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB0YXIg5q+U6LyD44GZ44KL5qeL6YCg5L2TXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IOe1kOaenFxuICAgICAqL1xuICAgIEVRICh0YXIpIHtcbiAgICAgICAgaWYoISB0YXIgKXtyZXR1cm4gZmFsc2U7fVxuICAgICAgICBpZih0aGlzLmNvbnN0cnVjdG9yPT09dGFyLmNvbnN0cnVjdG9yKXtcbiAgICAgICAgICAgIGlmKHRoaXMuR2V0VmFsQXJyYXkpe1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLkdldFZhbEFycmF5KCkudG9TdHJpbmcoKT09PXRhci5HZXRWYWxBcnJheSgpLnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB9ZWxzZSBpZih0aGlzLkdldFZhbE9iail7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KHRoaXMuR2V0VmFsT2JqKCkpPT09SlNPTi5zdHJpbmdpZnkodGFyLkdldFZhbE9iaigpKTsvLyBiYWQ6OumBheOBhFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDopIfoo71cbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fSDopIfoo73jgZXjgozjgZ/mp4vpgKDkvZNcbiAgICAgKi9cbiAgICBDbG9uZSAoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKG5ldyB0aGlzLmNvbnN0cnVjdG9yKCksdGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOWApOOBruWPluW+l++8iE9iau+8iVxuICAgICAqIEByZXR1cm5zIHtvYmplY3R9XG4gICAgICovXG4gICAgR2V0VmFsT2JqICgpIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sdGhpcyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5YCk44Gu5Y+W5b6X77yI6YWN5YiX77yJXG4gICAgICogQHJldHVybnMge0FycmF5fVxuICAgICAqL1xuICAgIEdldFZhbEFycmF5ICgpIHtcbiAgICAgICAgbGV0IGs9T2JqZWN0LmtleXModGhpcyk7XG4gICAgICAgIGxldCByPVtdO1xuICAgICAgICBmb3IobGV0IGk9MDtpPGsubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICByLnB1c2godGhpc1trW2ldXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHI7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5YCk44Gu5LiA5ous6Kit5a6a77yIT2Jq77yJXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHByb3BzT2JqIOioreWumuOBmeOCi+ODl+ODreODkeODhuOCo1xuICAgICAqL1xuICAgIFNldFZhbE9iaiAocHJvcHNPYmopIHtcbiAgICAgICAgaWYodHlwZW9mIHByb3BzT2JqICE9PVwib2JqZWN0XCIpe3JldHVybjt9XG4gICAgICAgIGxldCBrZXlzPU9iamVjdC5rZXlzKHByb3BzT2JqKTtcbiAgICAgICAgZm9yKGxldCBrPTA7azxrZXlzLmxlbmd0aDtrKyspe1xuICAgICAgICAgICAgbGV0IHBuPWtleXNba107XG4gICAgICAgICAgICBpZih0aGlzLmhhc093blByb3BlcnR5KHBuKSl7XG4gICAgICAgICAgICAgICAgdGhpc1twbl09cHJvcHNPYmpbcG5dO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59XG5cblxuLyoqXG4gKiBAY2xhc3NkZXNjIFhZ5bqn5qiZ44Gu5qeL6YCg5L2T44Kq44OW44K444Kn44Kv44OIXG4gKiBAaWdub3JlXG4gKi9cbmNsYXNzIEtNVmVjdG9yMiBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5XG4gICAgICpcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoeD0wLCB5PTApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDnm7jlr77kvY3nva7jgbjnp7vli5VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHlcbiAgICAgKi9cbiAgICBNb3ZlIChkeCA9MCwgZHkgPSAwKSB7XG4gICAgICAgIHRoaXMueCArPSBkeDtcbiAgICAgICAgdGhpcy55ICs9IGR5O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAy54K56ZaT44Gu6Led6ZuiXG4gICAgICogQHBhcmFtIHtLTVZlY3RvcjJ9IHZlY3RvcjJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIERpc3RhbmNlICh2ZWN0b3IyKSB7XG4gICAgICAgIGlmICghKHZlY3RvcjIgaW5zdGFuY2VvZiBLTVZlY3RvcjIpKSB7cmV0dXJuO31cbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdygodGhpcy54LXZlY3RvcjIueCksMikgKyBNYXRoLnBvdygodGhpcy55LXZlY3RvcjIueSksMikpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAy54K56ZaT44Gu6KeS5bqmXG4gICAgICogQHBhcmFtIHtLTVZlY3RvcjJ9IHZlY3RvcjJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIFJhZGlhbiAodmVjdG9yMikge1xuICAgICAgICBpZiAoISh2ZWN0b3IyIGluc3RhbmNlb2YgS01WZWN0b3IyKSkge3JldHVybjt9XG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueS12ZWN0b3IyLnksdGhpcy54LXZlY3RvcjIueCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIDAsMOOBi+OCieOBrui3nembolxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgRGlzdGFuY2VGcm9tWmVybygpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydChNYXRoLnBvdyh0aGlzLngsMikgKyBNYXRoLnBvdyh0aGlzLnksMikpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAwLDDjgYvjgonjga7op5LluqZcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSByYWRpYW5cbiAgICAgKi9cbiAgICBSYWRpYW5Gcm9tWmVybygpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy55LHRoaXMueCk7XG4gICAgfVxufVxuXG5cblxuLyoqXG4gKiBAY2xhc3NkZXNjIOOCuOODo+OCpOODreOCu+ODs+OCteODvOWApFxuICovXG5jbGFzcyBLTUltdVN0YXRlIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBleHRlbmRzIEtNU3RydWN0dXJlQmFzZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY2NlbFgg5Yqg6YCf5bqmKHgpIFvCsSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY2NlbFkg5Yqg6YCf5bqmKHkpIFvCsSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY2NlbFog5Yqg6YCf5bqmKHopIFvCsSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0ZW1wIOa4qeW6piBDXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGd5cm9YIOinkumAn+W6pih4KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZ3lyb1kg6KeS6YCf5bqmKHkpIFvCsSAxXVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBneXJvWiDop5LpgJ/luqYoeikgW8KxIDFdXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKGFjY2VsWCwgYWNjZWxZLCBhY2NlbFosIHRlbXAsIGd5cm9YLCBneXJvWSwgZ3lyb1ogKSB7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgdGhpcy5hY2NlbFg9IEtNVXRsLnRvTnVtYmVyKGFjY2VsWCk7XG4gICAgICAgIHRoaXMuYWNjZWxZPSBLTVV0bC50b051bWJlcihhY2NlbFkpO1xuICAgICAgICB0aGlzLmFjY2VsWj0gS01VdGwudG9OdW1iZXIoYWNjZWxaKTtcbiAgICAgICAgdGhpcy50ZW1wPSBLTVV0bC50b051bWJlcih0ZW1wKTtcbiAgICAgICAgdGhpcy5neXJvWD0gS01VdGwudG9OdW1iZXIoZ3lyb1gpO1xuICAgICAgICB0aGlzLmd5cm9ZPSBLTVV0bC50b051bWJlcihneXJvWSk7XG4gICAgICAgIHRoaXMuZ3lyb1o9IEtNVXRsLnRvTnVtYmVyKGd5cm9aKTtcbiAgICB9XG59XG4vKipcbiAqIEtFSUdBTuODouODvOOCv+ODvExFROOAgOeCueeBr+ODu+iJsueKtuaFi1xuICogU3RhdGUgTU9UT1JfTEVEX1NUQVRFXG4gKiBjb2xvclIgMC0yNTVcbiAqIGNvbG9yRyAwLTI1NVxuICogY29sb3JCIDAtMjU1XG4gKiAqL1xuLyoqXG4gKiBAY2xhc3NkZXNjIOODouODvOOCv+ODvExFROOAgOeCueeBr+ODu+iJsueKtuaFi1xuICovXG5jbGFzcyBLTUxlZFN0YXRlIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga5MRUTnirbmhYtcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9MRURfU1RBVEVfT0ZGIC0gMDpMRUTmtojnga9cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTEVEX1NUQVRFX09OX1NPTElEIC0gMTpMRUTngrnnga9cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTEVEX1NUQVRFX09OX0ZMQVNIIC0gMjpMRUTngrnmu4XvvIjkuIDlrprplpPpmpTjgafngrnmu4XvvIlcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTEVEX1NUQVRFX09OX0RJTSAtIDM6TEVE44GM44KG44Gj44GP44KK6Lyd5bqm5aSJ5YyW44GZ44KLXG4gICAgICovXG4gICAgc3RhdGljIGdldCBNT1RPUl9MRURfU1RBVEUoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgXCJNT1RPUl9MRURfU1RBVEVfT0ZGXCI6MCxcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09OX1NPTElEXCI6MSxcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09OX0ZMQVNIXCI6MixcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09OX0RJTVwiOjNcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICogQGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlXG4gICAgICogQHBhcmFtIHtLTUxlZFN0YXRlLk1PVE9SX0xFRF9TVEFURX0gc3RhdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY29sb3JSIGludCBbMC0yNTVdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbG9yRyBpbnQgWzAtMjU1XVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb2xvckIgaW50IFswLTI1NV1cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihzdGF0ZSxjb2xvclIsY29sb3JHLGNvbG9yQikge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnN0YXRlPUtNVXRsLnRvTnVtYmVyKHN0YXRlKTtcbiAgICAgICAgdGhpcy5jb2xvclI9S01VdGwudG9OdW1iZXIoY29sb3JSKTtcbiAgICAgICAgdGhpcy5jb2xvckc9S01VdGwudG9OdW1iZXIoY29sb3JHKTtcbiAgICAgICAgdGhpcy5jb2xvckI9S01VdGwudG9OdW1iZXIoY29sb3JCKTtcbiAgICB9XG59XG5cbi8qKlxuICogQGNsYXNzZGVzYyDjg6Ljg7zjgr/jg7zlm57ou6Lmg4XloLFcbiAqL1xuY2xhc3MgS01Sb3RTdGF0ZSBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICog5pyA5aSn44OI44Or44Kv5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE1BWF9UT1JRVUUoKXtcbiAgICAgICAgcmV0dXJuIDAuMzsvLzAuMyBO44O7bVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOacgOWkp+mAn+W6puWumuaVsChycG0pXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE1BWF9TUEVFRF9SUE0oKXtcbiAgICAgICAgcmV0dXJuIDMwMDsvLzMwMHJwbVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDmnIDlpKfpgJ/luqblrprmlbAocmFkaWFuL3NlYylcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgTUFYX1NQRUVEX1JBRElBTigpe1xuICAgICAgICByZXR1cm4gS01VdGwucnBtVG9SYWRpYW5TZWMoMzAwKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICog5pyA5aSn5bqn5qiZ5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE1BWF9QT1NJVElPTigpe1xuICAgICAgICByZXR1cm4gMypNYXRoLnBvdygxMCwzOCk7Ly9pbmZvOjrjgIxyZXR1cm7jgIAzZSszOOOAjeOBr21pbmlmeeOBp+OCqOODqeODvFxuICAgICAgICAvL3JldHVybuOAgDNlKzM4Oy8vcmFkaWFuIDRieXRlIGZsb2F044CAMS4xNzU0OTQgMTAtMzggIDwgMy40MDI4MjMgMTArMzhcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBleHRlbmRzIEtNU3RydWN0dXJlQmFzZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiDluqfmqJlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmVsb2NpdHkg6YCf5bqmXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvcnF1ZSDjg4jjg6vjgq9cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihwb3NpdGlvbiwgdmVsb2NpdHksIHRvcnF1ZSkge1xuICAgICAgICAvL+acieWKueahgeaVsCDlsI/mlbDnrKwz5L2NXG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMucG9zaXRpb24gPSBNYXRoLmZsb29yKEtNVXRsLnRvTnVtYmVyKHBvc2l0aW9uKSoxMDApLzEwMDtcbiAgICAgICAgdGhpcy52ZWxvY2l0eSA9IE1hdGguZmxvb3IoS01VdGwudG9OdW1iZXIodmVsb2NpdHkpKjEwMCkvMTAwO1xuICAgICAgICB0aGlzLnRvcnF1ZSA9IE1hdGguZmxvb3IoS01VdGwudG9OdW1iZXIodG9ycXVlKSoxMDAwMCkvMTAwMDA7XG4gICAgfVxufVxuXG5cbi8qKlxuICogQGNsYXNzZGVzYyDjg4fjg5DjgqTjgrnmg4XloLFcbiAqL1xuY2xhc3MgS01EZXZpY2VJbmZvIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBleHRlbmRzIEtNU3RydWN0dXJlQmFzZVxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5LTV9DT05ORUNUX1RZUEV9IHR5cGUg5o6l57aa5pa55byPXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGlkIOODh+ODkOOCpOOCuVVVSURcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSDjg6Ljg7zjgr/jg7zlkI0o5b2i5byPIElEIExFRENvbG9yKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gaXNDb25uZWN0IOaOpee2mueKtuaFi1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBtYW51ZmFjdHVyZXJOYW1lIOijvemAoOS8muekvuWQjVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBoYXJkd2FyZVJldmlzaW9uXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGZpcm13YXJlUmV2aXNpb25cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0eXBlPTAsaWQ9XCJcIixuYW1lPVwiXCIsaXNDb25uZWN0PWZhbHNlLG1hbnVmYWN0dXJlck5hbWU9bnVsbCxoYXJkd2FyZVJldmlzaW9uPW51bGwsZmlybXdhcmVSZXZpc2lvbj1udWxsKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMudHlwZT10eXBlO1xuICAgICAgICB0aGlzLmlkPWlkO1xuICAgICAgICB0aGlzLm5hbWU9bmFtZTtcbiAgICAgICAgdGhpcy5pc0Nvbm5lY3Q9aXNDb25uZWN0O1xuICAgICAgICB0aGlzLm1hbnVmYWN0dXJlck5hbWU9bWFudWZhY3R1cmVyTmFtZTtcbiAgICAgICAgdGhpcy5oYXJkd2FyZVJldmlzaW9uPWhhcmR3YXJlUmV2aXNpb247XG4gICAgICAgIHRoaXMuZmlybXdhcmVSZXZpc2lvbj1maXJtd2FyZVJldmlzaW9uO1xuXG4gICAgfVxufVxuLyoqXG4gKiBAY2xhc3NkZXNjIOODouODvOOCv+ODvOODreOCsOaDheWgsVxuICovXG5jbGFzcyBLTU1vdG9yTG9nIGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0gaWQge251bWJlcn0g44K344O844Kx44Oz44K5SUQo44Om44OL44O844Kv5YCkKVxuICAgICAqIEBwYXJhbSBjbWROYW1lIHtzdHJpbmd9IOWun+ihjOOCs+ODnuODs+ODieWQjVxuICAgICAqIEBwYXJhbSBjbWRJRCB7bnVtYmVyfSDlrp/ooYzjgrPjg57jg7Pjg4lJRFxuICAgICAqIEBwYXJhbSBlcnJJRCB7bnVtYmVyfSDjgqjjg6njg7zjgr/jgqTjg5dcbiAgICAgKiBAcGFyYW0gZXJyVHlwZSB7c3RyaW5nfSDjgqjjg6njg7znqK7liKVcbiAgICAgKiBAcGFyYW0gZXJyTXNnIHtzdHJpbmd944CA44Oh44OD44K744O844K45YaF5a65XG4gICAgICogQHBhcmFtIGluZm8ge251bWJlcn1cbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAoaWQ9MCxjbWROYW1lPVwiXCIsY21kSUQ9MCxlcnJJRD0wLGVyclR5cGU9XCJcIixlcnJNc2c9XCJcIixpbmZvPTApIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5pZD0gaWQ7XG4gICAgICAgIHRoaXMuY21kTmFtZT1jbWROYW1lO1xuICAgICAgICB0aGlzLmNtZElEPSBjbWRJRDtcbiAgICAgICAgdGhpcy5lcnJJRD1lcnJJRDtcbiAgICAgICAgdGhpcy5lcnJUeXBlPSBlcnJUeXBlO1xuICAgICAgICB0aGlzLmVyck1zZz0gZXJyTXNnO1xuICAgICAgICB0aGlzLmluZm89IGluZm87XG4gICAgfVxufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIEtNU3RydWN0dXJlQmFzZTpLTVN0cnVjdHVyZUJhc2UsXG4gICAgS01WZWN0b3IyOktNVmVjdG9yMixcbiAgICAvL0tNVmVjdG9yMzpLTVZlY3RvcjMsXG4gICAgS01JbXVTdGF0ZTpLTUltdVN0YXRlLFxuICAgIEtNTGVkU3RhdGU6S01MZWRTdGF0ZSxcbiAgICBLTVJvdFN0YXRlOktNUm90U3RhdGUsXG4gICAgS01EZXZpY2VJbmZvOktNRGV2aWNlSW5mbyxcbiAgICBLTU1vdG9yTG9nOktNTW90b3JMb2dcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9LTVN0cnVjdHVyZXMuanNcbi8vIG1vZHVsZSBpZCA9IDBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKioqXG4gKiBLTVV0bC5qc1xuICogQ0NyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBAY2xhc3NkZXNjIOODpuODvOODhuOCo+ODquODhuOCo1xuICovXG5jbGFzcyBLTVV0bHtcblxuICAgIC8qKlxuICAgICAqIOaVsOWApOOBq+OCreODo+OCueODiOOBmeOCi+mWouaVsFxuICAgICAqIOaVsOWApOS7peWkluOBrzDjgpLov5TjgZk8YnI+XG4gICAgICogSW5maW5pdHnjgoIw44Go44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWZhdWx0dmFsIHZhbOOBjOaVsOWApOOBq+WkieaPm+WHuuadpeOBquOBhOWgtOWQiOOBruODh+ODleOCqeODq+ODiFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIHRvTnVtYmVyKHZhbCwgZGVmYXVsdHZhbCA9IDApIHtcbiAgICAgICAgbGV0IHYgPSBwYXJzZUZsb2F0KHZhbCwgMTApO1xuICAgICAgICByZXR1cm4gKCFpc0Zpbml0ZSh2KSA/IGRlZmF1bHR2YWwgOiB2KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIOaVsOWApOOBq+OCreODo+OCueODiOOBmeOCi+mWouaVsCBpbnTlm7rlrppcbiAgICAgKiDmlbDlgKTku6XlpJbjga8w44KS6L+U44GZPGJyPlxuICAgICAqIEluZmluaXR544KCMOOBqOOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWxcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVmYXVsdHZhbCB2YWzjgYzmlbDlgKTjgavlpInmj5vlh7rmnaXjgarjgYTloLTlkIjjga7jg4fjg5Xjgqnjg6vjg4hcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyB0b0ludE51bWJlcih2YWwsIGRlZmF1bHR2YWwgPSAwKSB7XG4gICAgICAgIGxldCB2ID0gcGFyc2VJbnQodmFsLCAxMCk7XG4gICAgICAgIHJldHVybiAoIWlzRmluaXRlKHYpID8gZGVmYXVsdHZhbCA6IHYpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICog6KeS5bqm44Gu5Y2Y5L2N5aSJ5o+b44CAZGVncmVlID4+IHJhZGlhblxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBkZWdyZWUg5bqmXG4gICAgICogQHJldHVybnMge251bWJlcn0gcmFkaWFuXG4gICAgICovXG4gICAgc3RhdGljIGRlZ3JlZVRvUmFkaWFuKGRlZ3JlZSkge1xuICAgICAgICByZXR1cm4gZGVncmVlICogMC4wMTc0NTMyOTI1MTk5NDMyOTU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIOinkuW6puOBruWNmOS9jeWkieaPm+OAgHJhZGlhbiA+PiBkZWdyZWVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkaWFuIHJhZGlhbuinklxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IOW6plxuICAgICAqL1xuICAgIHN0YXRpYyByYWRpYW5Ub0RlZ3JlZShyYWRpYW4pIHtcbiAgICAgICAgcmV0dXJuIHJhZGlhbiAvIDAuMDE3NDUzMjkyNTE5OTQzMjk1O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDpgJ/luqYgcnBtIC0+cmFkaWFuL3NlYyDjgavlpInmj5tcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcnBtXG4gICAgICogQHJldHVybnMge251bWJlcn0gcmFkaWFuL3NlY1xuICAgICAqL1xuICAgIHN0YXRpYyBycG1Ub1JhZGlhblNlYyhycG0pIHtcbiAgICAgICAgLy/pgJ/luqYgcnBtIC0+cmFkaWFuL3NlYyhNYXRoLlBJKjIvNjApXG4gICAgICAgIHJldHVybiBycG0gKiAwLjEwNDcxOTc1NTExOTY1OTc3O1xuICAgIH07XG4gICAgLyoqXG4gICAgICogMueCuemWk+OBrui3nembouOBqOinkuW6puOCkuaxguOCgeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBmcm9tX3hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbV95XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvX3hcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9feVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIHR3b1BvaW50RGlzdGFuY2VBbmdsZShmcm9tX3gsIGZyb21feSwgdG9feCwgdG9feSkge1xuICAgICAgICBsZXQgZGlzdGFuY2UgPSBNYXRoLnNxcnQoTWF0aC5wb3coZnJvbV94IC0gdG9feCwgMikgKyBNYXRoLnBvdyhmcm9tX3kgLSB0b195LCAyKSk7XG4gICAgICAgIGxldCByYWRpYW4gPSBNYXRoLmF0YW4yKGZyb21feSAtIHRvX3ksIGZyb21feCAtIHRvX3gpO1xuICAgICAgICByZXR1cm4ge2Rpc3Q6IGRpc3RhbmNlLCByYWRpOiByYWRpYW4sIGRlZzogS01VdGwucmFkaWFuVG9EZWdyZWUocmFkaWFuKX07XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIOOCs+ODnuODs+ODieOBruODgeOCp+ODg+OCr+OCteODoOOCkuioiOeul1xuICAgICAqIEBpZ25vcmVcbiAgICAgKiBAZGVzYyDlj7PpgIHjgoogQ1JDLTE2LUNDSVRUICh4MTYgKyB4MTIgKyB4NSArIDEpIFN0YXJ0OjB4MDAwMCBYT1JPdXQ6MHgwMDAwIEJ5dGVPcmRlcjpMaXR0bGUtRW5kaWFuXG4gICAgICogQHBhcmFtIHVpbnQ4YXJyYXlCdWZmZXJcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHN0YXRpYyBDcmVhdGVDb21tYW5kQ2hlY2tTdW1DUkMxNih1aW50OGFycmF5QnVmZmVyKXtcbiAgICAgICAgY29uc3QgY3JjMTZ0YWJsZT0gX19jcmMxNnRhYmxlO1xuICAgICAgICBsZXQgY3JjID0gMDsvLyBTdGFydDoweDAwMDBcbiAgICAgICAgbGV0IGxlbj11aW50OGFycmF5QnVmZmVyLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB1aW50OGFycmF5QnVmZmVyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgYyA9IHVpbnQ4YXJyYXlCdWZmZXJbaV07XG4gICAgICAgICAgICBjcmMgPSAoY3JjID4+IDgpIF4gY3JjMTZ0YWJsZVsoY3JjIF4gYykgJiAweDAwZmZdO1xuICAgICAgICB9XG4gICAgICAgIGNyYz0oKGNyYz4+OCkmMHhGRil8KChjcmM8PDgpJjB4RkYwMCk7Ly8gQnl0ZU9yZGVyOkxpdHRsZS1FbmRpYW5cbiAgICAgICAgLy9jcmM9MHhGRkZGXmNyYzsvL1hPUk91dDoweDAwMDBcbiAgICAgICAgcmV0dXJuIGNyYztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAIyBpbmZvOjogS01Db21CTEUuanPjga5ERVZJQ0UgSU5GT1JNQVRJT04gU0VSVklDReOBruODkeODvOOCueOBq+S9v+eUqFxuICAgICAqIHV0Zi5qcyAtIFVURi04IDw9PiBVVEYtMTYgY29udmVydGlvblxuICAgICAqXG4gICAgICogQGlnbm9yZVxuICAgICAqIEBwYXJhbSBhcnJheVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAZGVzY1xuICAgICAqIENvcHlyaWdodCAoQykgMTk5OSBNYXNhbmFvIEl6dW1vIDxpekBvbmljb3MuY28uanA+XG4gICAgICogVmVyc2lvbjogMS4wXG4gICAgICogTGFzdE1vZGlmaWVkOiBEZWMgMjUgMTk5OVxuICAgICAqIFRoaXMgbGlicmFyeSBpcyBmcmVlLiAgWW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeSBpdC5cbiAgICAgKi9cbiAgICBzdGF0aWMgVXRmOEFycmF5VG9TdHIoYXJyYXkpIHtcbiAgICAgICAgbGV0IG91dCwgaSwgbGVuLCBjO1xuICAgICAgICBsZXQgY2hhcjIsIGNoYXIzO1xuXG4gICAgICAgIG91dCA9IFwiXCI7XG4gICAgICAgIGxlbiA9IGFycmF5Lmxlbmd0aDtcbiAgICAgICAgaSA9IDA7XG4gICAgICAgIHdoaWxlKGkgPCBsZW4pIHtcbiAgICAgICAgICAgIGMgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgc3dpdGNoKGMgPj4gNClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogY2FzZSAyOiBjYXNlIDM6IGNhc2UgNDogY2FzZSA1OiBjYXNlIDY6IGNhc2UgNzpcbiAgICAgICAgICAgICAgICAvLyAweHh4eHh4eFxuICAgICAgICAgICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGMpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTI6IGNhc2UgMTM6XG4gICAgICAgICAgICAgICAgLy8gMTEweCB4eHh4ICAgMTB4eCB4eHh4XG4gICAgICAgICAgICAgICAgY2hhcjIgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDB4MUYpIDw8IDYpIHwgKGNoYXIyICYgMHgzRikpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgMTQ6XG4gICAgICAgICAgICAgICAgICAgIC8vIDExMTAgeHh4eCAgMTB4eCB4eHh4ICAxMHh4IHh4eHhcbiAgICAgICAgICAgICAgICAgICAgY2hhcjIgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgICAgICAgICBjaGFyMyA9IGFycmF5W2krK107XG4gICAgICAgICAgICAgICAgICAgIG91dCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKCgoYyAmIDB4MEYpIDw8IDEyKSB8XG4gICAgICAgICAgICAgICAgICAgICAgICAoKGNoYXIyICYgMHgzRikgPDwgNikgfFxuICAgICAgICAgICAgICAgICAgICAgICAgKChjaGFyMyAmIDB4M0YpIDw8IDApKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQCMgaW5mbzo6IOODh+ODkOODg+OCsOeUqFxuICAgICAqIHVpbnQ4QXJyYXkgPT4gVVRGLTE2IFN0cmluZ3MgY29udmVydGlvblxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBAcGFyYW0gdWludDhBcnJheVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9XG4gICAgICogQGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgc3RhdGljIFVpbnQ4QXJyYXlUb0hleFN0cih1aW50OEFycmF5KXtcbiAgICAgICAgaWYoIXVpbnQ4QXJyYXkgaW5zdGFuY2VvZiBVaW50OEFycmF5KXtyZXR1cm47fVxuICAgICAgICBsZXQgYXI9W107XG4gICAgICAgIGZvcihsZXQgaT0wO2k8dWludDhBcnJheS5sZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIGFyLnB1c2godWludDhBcnJheVtpXS50b1N0cmluZygxNikpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhci5qb2luKCc6Jyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQCMgaW5mbzo6VWludDjjga5Db25jYXRcbiAgICAgKiBDcmVhdGVzIGEgbmV3IFVpbnQ4QXJyYXkgYmFzZWQgb24gdHdvIGRpZmZlcmVudCBBcnJheUJ1ZmZlcnNcbiAgICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyc30gdThBcnJheTEgVGhlIGZpcnN0IGJ1ZmZlci5cbiAgICAgKiBAcGFyYW0ge0FycmF5QnVmZmVyc30gdThBcnJheTIgVGhlIHNlY29uZCBidWZmZXIuXG4gICAgICogQHJldHVybiB7QXJyYXlCdWZmZXJzfSBUaGUgbmV3IEFycmF5QnVmZmVyIGNyZWF0ZWQgb3V0IG9mIHRoZSB0d28uXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIHN0YXRpYyBVaW50OEFycmF5Q29uY2F0KHU4QXJyYXkxLCB1OEFycmF5Mikge1xuICAgICAgICBsZXQgdG1wID0gbmV3IFVpbnQ4QXJyYXkodThBcnJheTEuYnl0ZUxlbmd0aCArIHU4QXJyYXkyLmJ5dGVMZW5ndGgpO1xuICAgICAgICB0bXAuc2V0KG5ldyBVaW50OEFycmF5KHU4QXJyYXkxKSwgMCk7XG4gICAgICAgIHRtcC5zZXQobmV3IFVpbnQ4QXJyYXkodThBcnJheTIpLCB1OEFycmF5MS5ieXRlTGVuZ3RoKTtcbiAgICAgICAgcmV0dXJuIHRtcDtcbiAgICB9XG5cblxufVxuXG4vKipcbiAqIENyZWF0ZUNvbW1hbmRDaGVja1N1bUNSQzE255SoIENSQ+ODhuODvOODluODq1xuICogQGlnbm9yZVxuICogQHR5cGUge1VpbnQxNkFycmF5fVxuICogQHByaXZhdGVcbiAqL1xuY29uc3QgX19jcmMxNnRhYmxlPW5ldyBVaW50MTZBcnJheShbXG4gICAgMCAsIDB4MTE4OSAsIDB4MjMxMiAsIDB4MzI5YiAsIDB4NDYyNCAsIDB4NTdhZCAsIDB4NjUzNiAsIDB4NzRiZiAsXG4gICAgMHg4YzQ4ICwgMHg5ZGMxICwgMHhhZjVhICwgMHhiZWQzICwgMHhjYTZjICwgMHhkYmU1ICwgMHhlOTdlICwgMHhmOGY3ICxcbiAgICAweDEwODEgLCAweDAxMDggLCAweDMzOTMgLCAweDIyMWEgLCAweDU2YTUgLCAweDQ3MmMgLCAweDc1YjcgLCAweDY0M2UgLFxuICAgIDB4OWNjOSAsIDB4OGQ0MCAsIDB4YmZkYiAsIDB4YWU1MiAsIDB4ZGFlZCAsIDB4Y2I2NCAsIDB4ZjlmZiAsIDB4ZTg3NiAsXG4gICAgMHgyMTAyICwgMHgzMDhiICwgMHgwMjEwICwgMHgxMzk5ICwgMHg2NzI2ICwgMHg3NmFmICwgMHg0NDM0ICwgMHg1NWJkICxcbiAgICAweGFkNGEgLCAweGJjYzMgLCAweDhlNTggLCAweDlmZDEgLCAweGViNmUgLCAweGZhZTcgLCAweGM4N2MgLCAweGQ5ZjUgLFxuICAgIDB4MzE4MyAsIDB4MjAwYSAsIDB4MTI5MSAsIDB4MDMxOCAsIDB4NzdhNyAsIDB4NjYyZSAsIDB4NTRiNSAsIDB4NDUzYyAsXG4gICAgMHhiZGNiICwgMHhhYzQyICwgMHg5ZWQ5ICwgMHg4ZjUwICwgMHhmYmVmICwgMHhlYTY2ICwgMHhkOGZkICwgMHhjOTc0ICxcblxuICAgIDB4NDIwNCAsIDB4NTM4ZCAsIDB4NjExNiAsIDB4NzA5ZiAsIDB4MDQyMCAsIDB4MTVhOSAsIDB4MjczMiAsIDB4MzZiYiAsXG4gICAgMHhjZTRjICwgMHhkZmM1ICwgMHhlZDVlICwgMHhmY2Q3ICwgMHg4ODY4ICwgMHg5OWUxICwgMHhhYjdhICwgMHhiYWYzICxcbiAgICAweDUyODUgLCAweDQzMGMgLCAweDcxOTcgLCAweDYwMWUgLCAweDE0YTEgLCAweDA1MjggLCAweDM3YjMgLCAweDI2M2EgLFxuICAgIDB4ZGVjZCAsIDB4Y2Y0NCAsIDB4ZmRkZiAsIDB4ZWM1NiAsIDB4OThlOSAsIDB4ODk2MCAsIDB4YmJmYiAsIDB4YWE3MiAsXG4gICAgMHg2MzA2ICwgMHg3MjhmICwgMHg0MDE0ICwgMHg1MTlkICwgMHgyNTIyICwgMHgzNGFiICwgMHgwNjMwICwgMHgxN2I5ICxcbiAgICAweGVmNGUgLCAweGZlYzcgLCAweGNjNWMgLCAweGRkZDUgLCAweGE5NmEgLCAweGI4ZTMgLCAweDhhNzggLCAweDliZjEgLFxuICAgIDB4NzM4NyAsIDB4NjIwZSAsIDB4NTA5NSAsIDB4NDExYyAsIDB4MzVhMyAsIDB4MjQyYSAsIDB4MTZiMSAsIDB4MDczOCAsXG4gICAgMHhmZmNmICwgMHhlZTQ2ICwgMHhkY2RkICwgMHhjZDU0ICwgMHhiOWViICwgMHhhODYyICwgMHg5YWY5ICwgMHg4YjcwICxcblxuICAgIDB4ODQwOCAsIDB4OTU4MSAsIDB4YTcxYSAsIDB4YjY5MyAsIDB4YzIyYyAsIDB4ZDNhNSAsIDB4ZTEzZSAsIDB4ZjBiNyAsXG4gICAgMHgwODQwICwgMHgxOWM5ICwgMHgyYjUyICwgMHgzYWRiICwgMHg0ZTY0ICwgMHg1ZmVkICwgMHg2ZDc2ICwgMHg3Y2ZmICxcbiAgICAweDk0ODkgLCAweDg1MDAgLCAweGI3OWIgLCAweGE2MTIgLCAweGQyYWQgLCAweGMzMjQgLCAweGYxYmYgLCAweGUwMzYgLFxuICAgIDB4MThjMSAsIDB4MDk0OCAsIDB4M2JkMyAsIDB4MmE1YSAsIDB4NWVlNSAsIDB4NGY2YyAsIDB4N2RmNyAsIDB4NmM3ZSAsXG4gICAgMHhhNTBhICwgMHhiNDgzICwgMHg4NjE4ICwgMHg5NzkxICwgMHhlMzJlICwgMHhmMmE3ICwgMHhjMDNjICwgMHhkMWI1ICxcbiAgICAweDI5NDIgLCAweDM4Y2IgLCAweDBhNTAgLCAweDFiZDkgLCAweDZmNjYgLCAweDdlZWYgLCAweDRjNzQgLCAweDVkZmQgLFxuICAgIDB4YjU4YiAsIDB4YTQwMiAsIDB4OTY5OSAsIDB4ODcxMCAsIDB4ZjNhZiAsIDB4ZTIyNiAsIDB4ZDBiZCAsIDB4YzEzNCAsXG4gICAgMHgzOWMzICwgMHgyODRhICwgMHgxYWQxICwgMHgwYjU4ICwgMHg3ZmU3ICwgMHg2ZTZlICwgMHg1Y2Y1ICwgMHg0ZDdjICxcblxuICAgIDB4YzYwYyAsIDB4ZDc4NSAsIDB4ZTUxZSAsIDB4ZjQ5NyAsIDB4ODAyOCAsIDB4OTFhMSAsIDB4YTMzYSAsIDB4YjJiMyAsXG4gICAgMHg0YTQ0ICwgMHg1YmNkICwgMHg2OTU2ICwgMHg3OGRmICwgMHgwYzYwICwgMHgxZGU5ICwgMHgyZjcyICwgMHgzZWZiICxcbiAgICAweGQ2OGQgLCAweGM3MDQgLCAweGY1OWYgLCAweGU0MTYgLCAweDkwYTkgLCAweDgxMjAgLCAweGIzYmIgLCAweGEyMzIgLFxuICAgIDB4NWFjNSAsIDB4NGI0YyAsIDB4NzlkNyAsIDB4Njg1ZSAsIDB4MWNlMSAsIDB4MGQ2OCAsIDB4M2ZmMyAsIDB4MmU3YSAsXG4gICAgMHhlNzBlICwgMHhmNjg3ICwgMHhjNDFjICwgMHhkNTk1ICwgMHhhMTJhICwgMHhiMGEzICwgMHg4MjM4ICwgMHg5M2IxICxcbiAgICAweDZiNDYgLCAweDdhY2YgLCAweDQ4NTQgLCAweDU5ZGQgLCAweDJkNjIgLCAweDNjZWIgLCAweDBlNzAgLCAweDFmZjkgLFxuICAgIDB4Zjc4ZiAsIDB4ZTYwNiAsIDB4ZDQ5ZCAsIDB4YzUxNCAsIDB4YjFhYiAsIDB4YTAyMiAsIDB4OTJiOSAsIDB4ODMzMCAsXG4gICAgMHg3YmM3ICwgMHg2YTRlICwgMHg1OGQ1ICwgMHg0OTVjICwgMHgzZGUzICwgMHgyYzZhICwgMHgxZWYxICwgMHgwZjc4XG5dKTtcblxubW9kdWxlLmV4cG9ydHMgPSBLTVV0bDtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9LTVV0bC5qc1xuLy8gbW9kdWxlIGlkID0gMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKipcbiAqIEtNQ29tV2ViQkxFLmpzXG4gKiB2ZXJzaW9uIDAuMS4wIGFscGhhXG4gKiBDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4ndXNlIHN0cmljdCc7XG5jb25zdCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcbmNvbnN0IEtNQ29tQmFzZSA9IHJlcXVpcmUoJy4vS01Db21CYXNlJyk7XG5jb25zdCBLTVN0cnVjdHVyZXM9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMnKTtcblxuLyoqXG4gKiBAY2xhc3NkZXNjIOODluODqeOCpuOCtueUqFdlYkJsdWV0b29o6YCa5L+h44Kv44Op44K5KGNocm9tZeS+neWtmClcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01Db21XZWJCTEUgZXh0ZW5kcyBLTUNvbUJhc2V7XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5a6a5pWwXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLnR5cGU9XCJXRUJCTEVcIjtcbiAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzPXt9O1xuICAgICAgICB0aGlzLl9ibGVTZW5kaW5nUXVlPVByb21pc2UucmVzb2x2ZSh0cnVlKTtcbiAgICAgICAgdGhpcy5fcXVlQ291bnQ9MDtcbiAgICAgICAgXG4gICAgICAgIC8v44K144O844OT44K5VVVJRFxuICAgICAgICB0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEPSdmMTQwZWEzNS04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnO1xuXG4gICAgICAgIC8v44Kt44Oj44Op44Kv44K/44Oq44K544OG44Kj44Kv44K5VVVJRFxuICAgICAgICB0aGlzLl9NT1RPUl9CTEVfQ1JTPXtcbiAgICAgICAgICAgICdNT1RPUl9UWCc6J2YxNDAwMDAxLTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4YycsLy/ml6cgTU9UT1JfQ09OVFJPTFxuICAgICAgICAgICAgLy8nTU9UT1JfTEVEJzonZjE0MDAwMDMtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJywvL+ODouODvOOCv+ODvOOBrkxFROOCkuWPluOCiuaJseOBhiBpbmZvOjogTU9UT1JfQ09OVFJPTDo6YmxlTGVk44Gn5Luj55SoXG4gICAgICAgICAgICAnTU9UT1JfTUVBU1VSRU1FTlQnOidmMTQwMDAwNC04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLFxuICAgICAgICAgICAgJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCc6J2YxNDAwMDA1LTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4YycsXG4gICAgICAgICAgICAnTU9UT1JfUlgnOidmMTQwMDAwNi04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLC8v5penIE1PVE9SX1NFVFRJTkdcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFM9e1xuICAgICAgICAgICAgXCJTZXJ2aWNlXCI6MHgxODBhXG4gICAgICAgICAgICAsXCJNYW51ZmFjdHVyZXJOYW1lU3RyaW5nXCI6MHgyYTI5XG4gICAgICAgICAgICAsXCJIYXJkd2FyZVJldmlzaW9uU3RyaW5nXCI6MHgyYTI3XG4gICAgICAgICAgICAsXCJGaXJtd2FyZVJldmlzaW9uU3RyaW5nXCI6MHgyYTI2XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEJMReWIh+aWreaZglxuICAgICAgICAgKiBAcGFyYW0gZXZlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgIHRoaXMuX29uQmxlQ29ubmVjdGlvbkxvc3Q9KGV2ZSk9PntcbiAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q9ZmFsc2U7XG4gICAgICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW51bGw7XG4gICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaXNDb25uZWN0KGZhbHNlKTtcbiAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44Oi44O844K/44O85Zue6Lui5oOF5aCx5Y+X5L+hXG4gICAgICAgICAqIEBwYXJhbSBldmVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogTm90aWZ5IFZhbHVlXG4gICAgICAgICAqICBieXRlWzBdLWJ5dGVbM11cdCAgICBieXRlWzRdLWJ5dGVbN11cdCAgICAgICAgYnl0ZVs4XS1ieXRlWzExXVxuICAgICAgICAgKiAgZmxvYXQgKiBcdFx0ICAgICAgICBmbG9hdCAqICAgICAgICAgICAgICAgICBmbG9hdCAqXG4gICAgICAgICAqICBwb3NpdGlvbjpyYWRpYW5zXHQgICAgc3BlZWQ6cmFkaWFucy9zZWNvbmRcdHRvcnF1ZTpO44O7bVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25CbGVNb3Rvck1lYXN1cmVtZW50PShldmUpPT57XG4gICAgICAgICAgICBpZighZXZlfHwhZXZlLnRhcmdldCl7cmV0dXJuO31cbiAgICAgICAgICAgIGxldCBkdiA9IGV2ZS50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICBpZighKGR2IGluc3RhbmNlb2YgRGF0YVZpZXcpKXtyZXR1cm47fS8vaW5mbzo6d2ViIGJsdWV0b29o44Gu44G/IG5vZGUuanPjga9pbnN0YW5jZW9mIEJ1ZmZlclxuICAgICAgICAgICAgbGV0IHBvc2l0aW9uPWR2LmdldEZsb2F0MzIoMCxmYWxzZSk7XG4gICAgICAgICAgICBsZXQgdmVsb2NpdHk9ZHYuZ2V0RmxvYXQzMig0LGZhbHNlKTtcbiAgICAgICAgICAgIGxldCB0b3JxdWU9ZHYuZ2V0RmxvYXQzMig4LGZhbHNlKTtcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JNZWFzdXJlbWVudENCKG5ldyBLTVN0cnVjdHVyZXMuS01Sb3RTdGF0ZShwb3NpdGlvbix2ZWxvY2l0eSx0b3JxdWUpKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIOODouODvOOCv+ODvElNVeaDheWgseWPl+S/oVxuICAgICAgICAgKiBAcGFyYW0gZXZlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqXG4gICAgICAgICAqIEAjTm90aWZ5IOOBl+OBn+OBqOOBjeOBrui/lOOCiuWApCktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICogYWNjZWxfeCwgYWNjZWxfeSwgYWNjZWxfeiwgdGVtcCwgZ3lyb194LCBneXJvX3ksIGd5cm9feiDjgYzlhajjgabov5TjgaPjgabjgY/jgovjgILlj5blvpfplpPpmpTjga8xMDBtcyDlm7rlrppcbiAgICAgICAgICogYnl0ZShCaWdFbmRpYW4pICBbMF1bMV0gWzJdWzNdICBbNF1bNV0gICBbNl1bN11cdCAgICBbOF1bOV1cdFsxMF1bMTFdICAgIFsxMl1bMTNdXG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgaW50MTZfdCBpbnQxNl90IGludDE2X3QgaW50MTZfdCAgICAgaW50MTZfdCBpbnQxNl90IGludDE2X3RcbiAgICAgICAgICogICAgICAgICAgICAgICAgICBhY2NlbC14IGFjY2VsLXkgYWNjZWwteiB0ZW1wXHQgICAgZ3lyby14XHRneXJvLXlcdGd5cm8telxuICAgICAgICAgKlxuICAgICAgICAgKiBpbnQxNl90Oi0zMiw3NjjjgJwzMiw3NjhcbiAgICAgICAgICog5py644Gu5LiK44Gr44Oi44O844K/44O844KS572u44GE44Gf5aC05ZCI44CB5Yqg6YCf5bqm44CAeiA9IDE2MDAwIOeoi+W6puOBqOOBquOCi+OAgu+8iOmHjeWKm+aWueWQkeOBruOBn+OCge+8iVxuICAgICAgICAgKlxuICAgICAgICAgKiDljZjkvY3lpInmj5vvvIktLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44CA5Yqg6YCf5bqmIHZhbHVlIFtHXSA9IHJhd192YWx1ZSAqIDIgLyAzMiw3NjdcbiAgICAgICAgICog44CA5rip5bqmIHZhbHVlIFvihINdID0gcmF3X3ZhbHVlIC8gMzMzLjg3ICsgMjEuMDBcbiAgICAgICAgICog44CA6KeS6YCf5bqmXG4gICAgICAgICAqIOOAgOOAgHZhbHVlIFtkZWdyZWUvc2Vjb25kXSA9IHJhd192YWx1ZSAqIDI1MCAvIDMyLDc2N1xuICAgICAgICAgKiDjgIDjgIB2YWx1ZSBbcmFkaWFucy9zZWNvbmRdID0gcmF3X3ZhbHVlICogMC4wMDAxMzMxNjIxMVxuICAgICAgICAgKlxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25CbGVJbXVNZWFzdXJlbWVudD0oZXZlKT0+e1xuICAgICAgICAgICAgaWYoIWV2ZXx8IWV2ZS50YXJnZXQpe3JldHVybjt9XG4gICAgICAgICAgICBsZXQgZHYgPSBldmUudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgbGV0IHRlbXBDYWxpYnJhdGlvbj0tNS43Oy8v5rip5bqm5qCh5q2j5YCkXG4gICAgICAgICAgICBpZighKGR2IGluc3RhbmNlb2YgRGF0YVZpZXcpKXtyZXR1cm47fS8vaW5mbzo6d2ViIGJsdWV0b29o44Gu44G/IG5vZGUuanPjga9pbnN0YW5jZW9mIEJ1ZmZlclxuICAgICAgICAgICAgLy/ljZjkvY3jgpLmibHjgYTmmJPjgYTjgojjgYbjgavlpInmj5tcbiAgICAgICAgICAgIGxldCBhY2NlbFg9ZHYuZ2V0SW50MTYoMCxmYWxzZSkqMi8zMjc2NztcbiAgICAgICAgICAgIGxldCBhY2NlbFk9ZHYuZ2V0SW50MTYoMixmYWxzZSkqMi8zMjc2NztcbiAgICAgICAgICAgIGxldCBhY2NlbFo9ZHYuZ2V0SW50MTYoNCxmYWxzZSkqMi8zMjc2NztcbiAgICAgICAgICAgIGxldCB0ZW1wPShkdi5nZXRJbnQxNig2LGZhbHNlKSkgLyAzMzMuODcgKyAyMS4wMCt0ZW1wQ2FsaWJyYXRpb247XG4gICAgICAgICAgICBsZXQgZ3lyb1g9ZHYuZ2V0SW50MTYoOCxmYWxzZSkqMjUwLzMyNzY3O1xuICAgICAgICAgICAgbGV0IGd5cm9ZPWR2LmdldEludDE2KDEwLGZhbHNlKSoyNTAvMzI3Njc7XG4gICAgICAgICAgICBsZXQgZ3lyb1o9ZHYuZ2V0SW50MTYoMTIsZmFsc2UpKjI1MC8zMjc2NztcblxuICAgICAgICAgICAgdGhpcy5fb25JbXVNZWFzdXJlbWVudENCKG5ldyBLTVN0cnVjdHVyZXMuS01JbXVTdGF0ZShhY2NlbFgsYWNjZWxZLGFjY2VsWix0ZW1wLGd5cm9YLGd5cm9ZLGd5cm9aKSk7XG5cbiAgICAgICAgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQCMtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgICog44Oi44O844K/44O844Ot44Kw5oOF5aCx5Y+W5b6XXG4gICAgICAgICAqIEBwYXJhbSB7QnVmZmVyfSBkYXRhXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIE5vdGlmeSB2YWx1ZVxuICAgICAgICAgKiBieXRlWzBdXHRieXRlWzEtMl1cdGJ5dGVbM11cdGJ5dGVbNC03XVx0Ynl0ZVs4LTExXVx0Ynl0ZVsxMi0xM11cbiAgICAgICAgICogdWludDhfdDp0eF90eXBlXHR1aW50MTZfdDppZFx0dWludDhfdDpjb21tYW5kXHR1aW50MzJfdDplcnJvckNvZGVcdHVpbnQzMl90OmluZm9cdHVpbnQxNl90OkNSQ1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25CbGVNb3RvckxvZz0oZXZlKT0+e1xuICAgICAgICAgICAgaWYoIWV2ZXx8IWV2ZS50YXJnZXQpe3JldHVybjt9XG4gICAgICAgICAgICBsZXQgZHYgPSBldmUudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgaWYoIShkdiBpbnN0YW5jZW9mIERhdGFWaWV3KSl7cmV0dXJuO30vL2luZm86OndlYiBibHVldG9vaOOBruOBvyBub2RlLmpz44GvaW5zdGFuY2VvZiBCdWZmZXJcbiAgICAgICAgICAgIGxldCB0eFR5cGU9ZHYuZ2V0VWludDgoMCk7Ly/jgqjjg6njg7zjg63jgrDjgr/jgqTjg5c6MHhCReWbuuWumlxuICAgICAgICAgICAgaWYodHhUeXBlIT09MHhCRSl7cmV0dXJuO31cblxuICAgICAgICAgICAgbGV0IGlkPWR2LmdldFVpbnQxNigxLGZhbHNlKTsvL+mAgeS/oUlEXG4gICAgICAgICAgICBsZXQgY21kSUQ9ZHYuZ2V0VWludDgoMyxmYWxzZSk7XG4gICAgICAgICAgICBsZXQgZXJyQ29kZT1kdi5nZXRVaW50MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICBsZXQgaW5mbz1kdi5nZXRVaW50MzIoOCxmYWxzZSk7XG4gICAgICAgICAgICAvL+ODreOCsOWPluW+l1xuICAgICAgICAgICAgdGhpcy5fb25Nb3RvckxvZ0NCKG5ldyBLTVN0cnVjdHVyZXMuS01Nb3RvckxvZyhpZCxudWxsLGNtZElELHRoaXMuX01PVE9SX0xPR19FUlJPUkNPREVbZXJyQ29kZV0uaWQsdGhpcy5fTU9UT1JfTE9HX0VSUk9SQ09ERVtlcnJDb2RlXS50eXBlLHRoaXMuX01PVE9SX0xPR19FUlJPUkNPREVbZXJyQ29kZV0ubXNnLGluZm8pKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIOODouODvOOCv+ODvOioreWumuaDheWgseWPluW+l1xuICAgICAgICAgKiBAcGFyYW0gZXZlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIE5vdGlmeSB2YWx1ZVxuICAgICAgICAgKiBieXRlWzBdXHRieXRlWzFdXHRieXRlWzJdXHRieXRlWzNdIGJ5dGVbNF3ku6XpmY1cdGJ5dGVbbi0yXVx0Ynl0ZVtuLTFdXG4gICAgICAgICAqIHVpbnQ4X3Q6dHhfdHlwZVx0dWludDE2X3Q6aWRcdHVpbnQ4X3Q6cmVnaXN0ZXJcdHVpbnQ4X3Q6dmFsdWVcdHVpbnQxNl90OkNSQ1xuICAgICAgICAgKiAweDQwXHR1aW50MTZfdCAoMmJ5dGUpIDDvvZ42NTUzNVx044Os44K444K544K/44Kz44Oe44Oz44OJXHTjg6zjgrjjgrnjgr/jga7lgKTvvIjjgrPjg57jg7Pjg4njgavjgojjgaPjgablpInjgo/jgovvvIlcdHVpbnQxNl90ICgyYnl0ZSkgMO+9njY1NTM1XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9vbkJsZU1vdG9yU2V0dGluZz0oZXZlKT0+e1xuICAgICAgICAgICAgaWYoIWV2ZXx8IWV2ZS50YXJnZXQpe3JldHVybjt9XG4gICAgICAgICAgICBsZXQgZHYgPSBldmUudGFyZ2V0LnZhbHVlOy8vNStu44OQ44Kk44OI44CAXG4gICAgICAgICAgICBsZXQgdWludDhBcnJheT1uZXcgVWludDhBcnJheShkdi5idWZmZXIpOy8vaW5mbzo65LiA5pem44Kz44OU44O844GZ44KL5b+F6KaB44GM44GC44KLXG4gICAgICAgICAgICBpZighKGR2IGluc3RhbmNlb2YgRGF0YVZpZXcpKXtyZXR1cm47fS8vaW5mbzo6d2ViIGJsdWV0b29o44Gu44G/IG5vZGUuanPjga9pbnN0YW5jZW9mIEJ1ZmZlclxuXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIC8v44OH44O844K/44GucGFyc2VcbiAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLVxuICAgICAgICAgICAgbGV0IHR4TGVuPWR2LmJ5dGVMZW5ndGg7XG4gICAgICAgICAgICBsZXQgdHhUeXBlPWR2LmdldFVpbnQ4KDApOy8v44Os44K444K544K/5oOF5aCx6YCa55+l44Kz44Oe44Oz44OJSUQgMHg0MOWbuuWumlxuICAgICAgICAgICAgaWYodHhUeXBlIT09MHg0MHx8dHhMZW48NSl7cmV0dXJuO30vL+ODrOOCuOOCueOCv+aDheWgseOCkuWQq+OBvuOBquOBhOODh+ODvOOCv+OBruegtOajhFxuXG4gICAgICAgICAgICBsZXQgaWQ9ZHYuZ2V0VWludDE2KDEsZmFsc2UpOy8v6YCB5L+hSURcbiAgICAgICAgICAgIGxldCByZWdpc3RlckNtZD1kdi5nZXRVaW50OCgzKTsvL+ODrOOCuOOCueOCv+OCs+ODnuODs+ODiVxuICAgICAgICAgICAgbGV0IGNyYz1kdi5nZXRVaW50MTYodHhMZW4tMixmYWxzZSk7Ly9DUkPjga7lgKQg5pyA5b6M44GL44KJMmR5dGVcblxuICAgICAgICAgICAgbGV0IHJlcz17fTtcbiAgICAgICAgICAgIC8v44Kz44Oe44Oz44OJ5Yil44Gr44KI44KL44Os44K444K544K/44Gu5YCk44Gu5Y+W5b6XWzQtbiBieXRlXVxuICAgICAgICAgICAgbGV0IHN0YXJ0T2Zmc2V0PTQ7XG5cbiAgICAgICAgICAgIHN3aXRjaChyZWdpc3RlckNtZCl7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tYXhTcGVlZDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1heFNwZWVkPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1pblNwZWVkOlxuICAgICAgICAgICAgICAgICAgICByZXMubWluU3BlZWQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuY3VydmVUeXBlOlxuICAgICAgICAgICAgICAgICAgICByZXMuY3VydmVUeXBlPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5hY2M6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5hY2M9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuZGVjOlxuICAgICAgICAgICAgICAgICAgICByZXMuZGVjPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1heFRvcnF1ZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1heFRvcnF1ZT1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC50ZWFjaGluZ0ludGVydmFsOlxuICAgICAgICAgICAgICAgICAgICByZXMudGVhY2hpbmdJbnRlcnZhbD1kdi5nZXRVaW50MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnBsYXliYWNrSW50ZXJ2YWw6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wbGF5YmFja0ludGVydmFsPWR2LmdldFVpbnQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucUN1cnJlbnRQOlxuICAgICAgICAgICAgICAgICAgICByZXMucUN1cnJlbnRQPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnFDdXJyZW50STpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnFDdXJyZW50ST1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5xQ3VycmVudEQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5xQ3VycmVudEQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuc3BlZWRQOlxuICAgICAgICAgICAgICAgICAgICByZXMuc3BlZWRQPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnNwZWVkSTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNwZWVkST1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5zcGVlZEQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zcGVlZEQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucG9zaXRpb25QOlxuICAgICAgICAgICAgICAgICAgICByZXMucG9zaXRpb25QPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbD1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubW90b3JNZWFzdXJlbWVudEJ5RGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1vdG9yTWVhc3VyZW1lbnRCeURlZmF1bHQ9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmludGVyZmFjZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmludGVyZmFjZT1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucmVzcG9uc2U6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5yZXNwb25zZT1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQub3duQ29sb3I6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5vd25Db2xvcj0oJyMwMDAwMDAnICtOdW1iZXIoZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpPDwxNnxkdi5nZXRVaW50OChzdGFydE9mZnNldCsxKTw8OHxkdi5nZXRVaW50OChzdGFydE9mZnNldCsyKSkudG9TdHJpbmcoMTYpKS5zdWJzdHIoLTYpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmlNVU1lYXN1cmVtZW50SW50ZXJ2YWw6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5pTVVNZWFzdXJlbWVudEludGVydmFsPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5pTVVNZWFzdXJlbWVudEJ5RGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmlNVU1lYXN1cmVtZW50QnlEZWZhdWx0PWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5kZXZpY2VOYW1lOlxuICAgICAgICAgICAgICAgICAgICByZXMuZGV2aWNlTmFtZT1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFwiXCIsIHVpbnQ4QXJyYXkuc2xpY2Uoc3RhcnRPZmZzZXQsLTIpKTsvL+WPr+WkieODkOOCpOODiOaWh+Wtl1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmRldmljZUluZm86XG4gICAgICAgICAgICAgICAgICAgIHJlcy5kZXZpY2VJbmZvPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXCJcIiwgdWludDhBcnJheS5zbGljZShzdGFydE9mZnNldCwtMikpOy8v5Y+v5aSJ44OQ44Kk44OI5paH5a2XXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuc3BlZWQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zcGVlZD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5wb3NpdGlvbk9mZnNldDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnBvc2l0aW9uT2Zmc2V0PWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1vdmVUbzpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1vdmVUbz1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5ob2xkOlxuICAgICAgICAgICAgICAgICAgICByZXMuaG9sZD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5zdGF0dXM6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zdGF0dXM9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnRhc2tzZXROYW1lOlxuICAgICAgICAgICAgICAgICAgICByZXMudGFza3NldE5hbWU9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcIlwiLCB1aW50OEFycmF5LnNsaWNlKHN0YXJ0T2Zmc2V0LC0yKSk7Ly/lj6/lpInjg5DjgqTjg4jmloflrZdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC50YXNrc2V0SW5mbzpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnRhc2tzZXRJbmZvPWR2LmdldFVpbnQxNihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQudGFza3NldFVzYWdlOlxuICAgICAgICAgICAgICAgICAgICByZXMudGFza3NldFVzYWdlPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tb3Rpb25OYW1lOlxuICAgICAgICAgICAgICAgICAgICByZXMubW90aW9uTmFtZT1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFwiXCIsIHVpbnQ4QXJyYXkuc2xpY2Uoc3RhcnRPZmZzZXQsLTIpKTsvL+WPr+WkieODkOOCpOODiOaWh+Wtl1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1vdGlvbkluZm86XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tb3Rpb25JbmZvPWR2LmdldFVpbnQxNihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubW90aW9uVXNhZ2U6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tb3Rpb25Vc2FnZT1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuaTJDU2xhdmVBZGRyZXNzOlxuICAgICAgICAgICAgICAgICAgICByZXMuaTJDU2xhdmVBZGRyZXNzPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5sZWQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5sZWQ9e3N0YXRlOmR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KSxyOmR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KzEpLGc6ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQrMiksYjpkdi5nZXRVaW50OChzdGFydE9mZnNldCszKX07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuZW5hYmxlQ2hlY2tTdW06XG4gICAgICAgICAgICAgICAgICAgIHJlcy5lbmFibGVDaGVja1N1bT1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuZGV2aWNlU2VyaWFsOlxuICAgICAgICAgICAgICAgICAgICByZXMuZGV2aWNlU2VyaWFsPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXCJcIiwgdWludDhBcnJheS5zbGljZShzdGFydE9mZnNldCwtMikpOy8v5Y+v5aSJ44OQ44Kk44OI5paH5a2XXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXMpO1xuXG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yU2V0dGluZ0NCKHJlZ2lzdGVyQ21kLHJlcyk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogc2VjdGlvbjo65YWs6ZaL44Oh44K944OD44OJXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIFdlYkJsdWV0b29o44Gn44Gu5o6l57aa44KS6ZaL5aeL44GZ44KLXG4gICAgICovXG4gICAgY29ubmVjdCgpe1xuICAgICAgICBpZiAodGhpcy5fcGVyaXBoZXJhbCYmIHRoaXMuX3BlcmlwaGVyYWwuZ2F0dCYmdGhpcy5fcGVyaXBoZXJhbC5nYXR0LmNvbm5lY3RlZCApIHtyZXR1cm59XG4gICAgICAgIGxldCBnYXQ9ICh0aGlzLl9wZXJpcGhlcmFsJiYgdGhpcy5fcGVyaXBoZXJhbC5nYXR0ICk/dGhpcy5fcGVyaXBoZXJhbC5nYXR0IDp1bmRlZmluZWQ7Ly/lho3mjqXntprnlKhcbiAgICAgICAgdGhpcy5fYmxlQ29ubmVjdChnYXQpLnRoZW4ob2JqPT57Ly9pbmZvOjogcmVzb2x2ZSh7ZGV2aWNlSUQsZGV2aWNlTmFtZSxibGVEZXZpY2UsY2hhcmFjdGVyaXN0aWNzfSk7XG4gICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsPW9iai5ibGVEZXZpY2U7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmlkPXRoaXMuX3BlcmlwaGVyYWwuaWQ7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLm5hbWU9dGhpcy5fcGVyaXBoZXJhbC5uYW1lO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q9dGhpcy5fcGVyaXBoZXJhbC5nYXR0LmNvbm5lY3RlZDtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8ubWFudWZhY3R1cmVyTmFtZT1vYmouaW5mb21hdGlvbi5tYW51ZmFjdHVyZXJOYW1lO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5oYXJkd2FyZVJldmlzaW9uPW9iai5pbmZvbWF0aW9uLmhhcmR3YXJlUmV2aXNpb247XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLmZpcm13YXJlUmV2aXNpb249b2JqLmluZm9tYXRpb24uZmlybXdhcmVSZXZpc2lvbjtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3M9b2JqLmNoYXJhY3RlcmlzdGljcztcblxuICAgICAgICAgICAgaWYoIWdhdCl7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbC5yZW1vdmVFdmVudExpc3RlbmVyKCdnYXR0c2VydmVyZGlzY29ubmVjdGVkJyx0aGlzLl9vbkJsZUNvbm5lY3Rpb25Mb3N0KTtcbiAgICAgICAgICAgICAgICB0aGlzLl9wZXJpcGhlcmFsLmFkZEV2ZW50TGlzdGVuZXIoJ2dhdHRzZXJ2ZXJkaXNjb25uZWN0ZWQnLCB0aGlzLl9vbkJsZUNvbm5lY3Rpb25Mb3N0KTtcblxuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfTUVBU1VSRU1FTlQnXSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfTUVBU1VSRU1FTlQnXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3Rvck1lYXN1cmVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9NRUFTVVJFTUVOVCddLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yTWVhc3VyZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX01FQVNVUkVNRU5UJ10uc3RhcnROb3RpZmljYXRpb25zKCkudGhlbihvYmo9PntcbiAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9JTVVfTUVBU1VSRU1FTlQnXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCddLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZUltdU1lYXN1cmVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfSU1VX01FQVNVUkVNRU5UJ10uYWRkRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlSW11TWVhc3VyZW1lbnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfSU1VX01FQVNVUkVNRU5UJ10uc3RhcnROb3RpZmljYXRpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICB9KS50aGVuKG9iaj0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9SWCddKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX1JYJ10ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JTZXR0aW5nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX1JYJ10ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JMb2cpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9SWCddLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yU2V0dGluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9SWCddLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yTG9nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX1JYJ10uc3RhcnROb3RpZmljYXRpb25zKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgfSkudGhlbihvYmo9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZV9pbml0KHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzQ2hhbmdlX2lzQ29ubmVjdCh0cnVlKTsvL+WIneWbnuOBruOBvyhjb21w5Lul5YmN44Gv55m654Gr44GX44Gq44GE54K6KVxuICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZV9pc0Nvbm5lY3QodHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pLmNhdGNoKGVycj0+e1xuICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbD1udWxsO1xuICAgICAgICAgICAgdGhpcy5fb25Db25uZWN0RmFpbHVyZUhhbmRsZXIodGhpcyxlcnIpO1xuICAgICAgICB9KVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFdlYkJsdWV0b29o44Gu5YiH5patXG4gICAgICovXG4gICAgZGlzQ29ubmVjdCgpe1xuICAgICAgIGlmICghdGhpcy5fcGVyaXBoZXJhbCB8fCAhdGhpcy5fcGVyaXBoZXJhbC5nYXR0LmNvbm5lY3RlZCl7cmV0dXJuO31cbiAgICAgICAgdGhpcy5fcGVyaXBoZXJhbC5nYXR0LmRpc2Nvbm5lY3QoKTtcbiAgICAgICAgdGhpcy5fcGVyaXBoZXJhbD1udWxsO1xuXG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5YaF6YOoXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQkxF5o6l57aaXG4gICAgICogQHBhcmFtIGdhdHRfb2JqIOODmuOCouODquODs+OCsOa4iOOBv+OBrkdBVFTjga7jg4fjg5DjgqTjgrnjgavlho3mjqXntprnlKgo44Oa44Ki44Oq44Oz44Kw44Oi44O844OA44Or44Gv5Ye644Gq44GEKVxuICAgICAqIEByZXR1cm5zIHtQcm9taXNlfVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX2JsZUNvbm5lY3QoZ2F0dF9vYmopIHtcbiAgICAgIC8vbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgIC8vIGxldCBibGVEZXZpY2U7XG4gICAgICAgICAgLy8gbGV0IGRldmljZU5hbWU7XG4gICAgICAgICAgLy8gbGV0IGRldmljZUlEO1xuICAgICAgICAgIGlmKCFnYXR0X29iail7XG4gICAgICAgICAgICAgIGxldCBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgZmlsdGVyczogW3tzZXJ2aWNlczogW3RoaXMuX01PVE9SX0JMRV9TRVJWSUNFX1VVSURdfV0sXG4gICAgICAgICAgICAgICAgICBvcHRpb25hbFNlcnZpY2VzOlt0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5TZXJ2aWNlXVxuICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICBuYXZpZ2F0b3IuYmx1ZXRvb3RoLnJlcXVlc3REZXZpY2Uob3B0aW9ucylcbiAgICAgICAgICAgICAgICAgIC50aGVuKGRldmljZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgdGhpcy5fYmxlR2F0Y29ubmVjdChkZXZpY2UuZ2F0dCkudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsZURldmljZTogZGV2aWNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGV2aWNlSUQ6IGRldmljZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZU5hbWU6IGRldmljZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNzOnJlcy5jaGFyYWN0ZXJpc3RpY3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uOnJlcy5pbmZvbWF0aW9uXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICB9KVxuXG4gICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgIHRoaXMuX2JsZUdhdGNvbm5lY3QoZ2F0dF9vYmopXG4gICAgICAgICAgICAgICAgICAudGhlbihyZXMgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiX2JsZUdhdGNvbm5lY3RcIik7XG4gICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZUlEOiBnYXR0X29iai5kZXZpY2UuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZU5hbWU6IGdhdHRfb2JqLmRldmljZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBibGVEZXZpY2U6IGdhdHRfb2JqLmRldmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNzOnJlcy5jaGFyYWN0ZXJpc3RpY3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb246cmVzLmluZm9tYXRpb25cblxuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgIHJlamVjdChlcnJvcik7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICAvL0dBVFTmjqXntprnlKhcbiAgICBfYmxlR2F0Y29ubmVjdChnYXR0X29iail7XG4gICAgICAgICAgICBsZXQgY2hhcmFjdGVyaXN0aWNzID0ge307XG4gICAgICAgICAgICBsZXQgaW5mb21hdGlvbj17fTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoZ3Jlc29sdmUsIGdyZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgIGdhdHRfb2JqLmNvbm5lY3QoKS50aGVuKHNlcnZlciA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybiBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2VzKHRoaXMuX01PVE9SX0JMRV9TRVJWSUNFX1VVSUQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlKHRoaXMuX01PVE9SX0JMRV9TRVJWSUNFX1VVSUQpLnRoZW4oc2VydmljZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNycyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX01PVE9SX0JMRV9DUlMpLmZvckVhY2goKGtleSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjcnMucHVzaChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5fTU9UT1JfQkxFX0NSU1trZXldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNoYXJhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhcmFjdGVyaXN0aWNzW2tleV0gPSBjaGFyYTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBQcm9taXNlLmFsbChjcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vYmxlX2Zpcm13YXJlX3JldmlzaW9u44Gu44K144O844OT44K55Y+W5b6XIGluZm86OkFuZHJvaWRk44Gn44Gv5LiN5a6J5a6a44Gq54K65YGc5q2iXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChzcmVzb2x2ZSwgc3JlamVjdCk9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5TZXJ2aWNlKS50aGVuKChzZXJ2aWNlKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuTWFudWZhY3R1cmVyTmFtZVN0cmluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNoYXJhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hhcmEucmVhZFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uWydtYW51ZmFjdHVyZXJOYW1lJ10gPSBLTVV0bC5VdGY4QXJyYXlUb1N0cihuZXcgVWludDhBcnJheSh2YWwuYnVmZmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlKT0+e3JlamVjdChlKTt9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLkZpcm13YXJlUmV2aXNpb25TdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjaGFyYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoYXJhLnJlYWRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbih2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvblsnZmlybXdhcmVSZXZpc2lvbiddID0gS01VdGwuVXRmOEFycmF5VG9TdHIobmV3IFVpbnQ4QXJyYXkodmFsLmJ1ZmZlcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntyZWplY3QoZSk7fSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5IYXJkd2FyZVJldmlzaW9uU3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGFyYS5yZWFkVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb25bJ2hhcmR3YXJlUmV2aXNpb24nXSA9IEtNVXRsLlV0ZjhBcnJheVRvU3RyKG5ldyBVaW50OEFycmF5KHZhbC5idWZmZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGUpPT57cmVqZWN0KGUpO30pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3Jlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZWplY3QoZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmVzb2x2ZSh7Y2hhcmFjdGVyaXN0aWNzOiBjaGFyYWN0ZXJpc3RpY3MsIGluZm9tYXRpb246IGluZm9tYXRpb259KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJMReOCs+ODnuODs+ODieOBrumAgeS/oVxuICAgICAqIEBwYXJhbSBjb21tYW5kVHlwZVN0ciAgJ01PVE9SX0NPTlRST0wnLCdNT1RPUl9NRUFTVVJFTUVOVCcsJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCcsJ01PVE9SX1JYJ1xuICAgICAqIOOCs+ODnuODs+ODieeoruWIpeOBrlN0cmluZyDkuLvjgatCTEXjga7jgq3jg6Pjg6njgq/jgr/jg6rjgrnjg4bjgqPjgq/jgrnjgafkvb/nlKjjgZnjgotcbiAgICAgKiBAcGFyYW0gY29tbWFuZE51bVxuICAgICAqIEBwYXJhbSBhcnJheWJ1ZmZlclxuICAgICAqIEBwYXJhbSBub3RpZnlQcm9taXMgY21kUmVhZFJlZ2lzdGVy562J44GuQkxF5ZG844Gz5Ye644GX5b6M44Grbm90aWZ544Gn5Y+W5b6X44GZ44KL5YCk44KSUHJvbWlz44Gn5biw44GZ5b+F6KaB44Gu44GC44KL44Kz44Oe44Oz44OJ55SoXG4gICAgICogQHBhcmFtIGNpZCDjgrfjg7zjgrHjg7PjgrlJRFxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgX3NlbmRNb3RvckNvbW1hbmQoY29tbWFuZENhdGVnb3J5LCBjb21tYW5kTnVtLCBhcnJheWJ1ZmZlcj1uZXcgQXJyYXlCdWZmZXIoMCksIG5vdGlmeVByb21pcz1udWxsLGNpZD1udWxsKXtcbiAgICAgICAgbGV0IGNoYXJhY3RlcmlzdGljcz10aGlzLl9jaGFyYWN0ZXJpc3RpY3NbY29tbWFuZENhdGVnb3J5XTtcbiAgICAgICAgbGV0IGFiPW5ldyBEYXRhVmlldyhhcnJheWJ1ZmZlcik7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoYXJyYXlidWZmZXIuYnl0ZUxlbmd0aCs1KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxjb21tYW5kTnVtKTtcbiAgICAgICAgY2lkPWNpZD09PW51bGw/dGhpcy5jcmVhdGVDb21tYW5kSUQ6Y2lkOy8v44K344O844Kx44Oz44K5SUQo44Om44OL44O844Kv5YCkKVxuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMSxjaWQpO1xuICAgICAgICAvL+ODh+ODvOOCv+OBruabuOOBjei+vOOBv1xuICAgICAgICBmb3IobGV0IGk9MDtpPGFycmF5YnVmZmVyLmJ5dGVMZW5ndGg7aSsrKXtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDMraSxhYi5nZXRVaW50OChpKSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNyYz1LTVV0bC5DcmVhdGVDb21tYW5kQ2hlY2tTdW1DUkMxNihuZXcgVWludDhBcnJheShidWZmZXIuc2xpY2UoMCxidWZmZXIuYnl0ZUxlbmd0aC0yKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoYXJyYXlidWZmZXIuYnl0ZUxlbmd0aCszLGNyYyk7Ly9pbmZvOjpDUkPoqIjnrpdcblxuICAgICAgICAvL3F1ZeOBq+i/veWKoFxuICAgICAgIC8vICsrdGhpcy5fcXVlQ291bnQ7XG4gICAgICAgIHRoaXMuX2JsZVNlbmRpbmdRdWU9IHRoaXMuX2JsZVNlbmRpbmdRdWUudGhlbigocmVzKT0+e1xuICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhcIl9zZW5kTW90b3JDb21tYW5kIHF1ZUNvdW50OlwiKygtLXRoaXMuX3F1ZUNvdW50KSk7XG4gICAgICAgICAgICBpZihub3RpZnlQcm9taXMpe1xuICAgICAgICAgICAgICAgIG5vdGlmeVByb21pcy5zdGFydFJlamVjdFRpbWVPdXRDb3VudCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGNoYXJhY3RlcmlzdGljcy53cml0ZVZhbHVlKGJ1ZmZlcik7XG4gICAgICAgIH0pLmNhdGNoKGZ1bmN0aW9uKHJlcyl7XG4gICAgICAgICAgICAvL+WkseaVl+aZguOAgC8vaW5mbzo65b6M57aa44Gu44Kz44Oe44Oz44OJ44Gv5byV44GN57aa44GN5a6f6KGM44GV44KM44KLXG4gICAgICAgICAgLy8gIGNvbnNvbGUubG9nKFwiRVJSIF9zZW5kTW90b3JDb21tYW5kOlwiK3JlcytcIiBxdWVDb3VudDpcIisoLS10aGlzLl9xdWVDb3VudCkpO1xuICAgICAgICAgICAgaWYobm90aWZ5UHJvbWlzKXtcbiAgICAgICAgICAgICAgICBub3RpZnlQcm9taXMuY2FsbFJlamVjdChyZXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cblxuLy8vLy8vY2xhc3MvL1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9S01Db21XZWJCTEU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvS01Db21XZWJCTEUuanNcbi8vIG1vZHVsZSBpZCA9IDJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIndXNlIHN0cmljdCc7XG4vKioqXG4gKktNQ29ubmVjdG9yQnJvd3Nlci5qc1xuICogdmVyc2lvbiAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuZ2xvYmFsLktNVXRsPXJlcXVpcmUoJy4vS01VdGwuanMnKTtcbmdsb2JhbC5LTVZlY3RvcjI9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTVZlY3RvcjI7XG5nbG9iYWwuS01JbXVTdGF0ZT1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNSW11U3RhdGU7XG5nbG9iYWwuS01MZWRTdGF0ZT1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNTGVkU3RhdGU7XG5nbG9iYWwuS01Sb3RTdGF0ZT1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNUm90U3RhdGU7XG5nbG9iYWwuS01EZXZpY2VJbmZvPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01EZXZpY2VJbmZvO1xuZ2xvYmFsLktNTW90b3JMb2c9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTU1vdG9yTG9nO1xuZ2xvYmFsLktNTW90b3JPbmVXZWJCTEU9cmVxdWlyZSgnLi9LTU1vdG9yT25lV2ViQkxFLmpzJyk7XG5cblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvS01Db25uZWN0b3JCcm93c2VyV1BLLmpzXG4vLyBtb2R1bGUgaWQgPSAzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSA0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLyoqKlxuICpLTU1vdG9yT25lV2ViQkxFLmpzXG4gKiBDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4ndXNlIHN0cmljdCc7XG5cbmxldCBLTUNvbVdlYkJMRSA9IHJlcXVpcmUoJy4vS01Db21XZWJCTEUnKTtcbmxldCBLTU1vdG9yQ29tbWFuZEtNT25lPXJlcXVpcmUoJy4vS01Nb3RvckNvbW1hbmRLTU9uZS5qcycpO1xuXG4vKipcbiAqIEBjbGFzc2Rlc2MgS00tMeOBrldlYkJsdWV0b29o5o6l57aa55SoIOS7ruaDs+ODh+ODkOOCpOOCuVxuICovXG5jbGFzcyBLTU1vdG9yT25lV2ViQkxFIGV4dGVuZHMgS01Nb3RvckNvbW1hbmRLTU9uZXtcbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBleHRlbmRzIEtNTW90b3JDb21tYW5kS01PbmVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICBzdXBlcihLTU1vdG9yQ29tbWFuZEtNT25lLktNX0NPTk5FQ1RfVFlQRS5XRUJCTEUsbmV3IEtNQ29tV2ViQkxFKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBqOaOpee2muOBmeOCi1xuICAgICAqL1xuICAgIGNvbm5lY3QoKXtcbiAgICAgICAgdGhpcy5fS01Db20uY29ubmVjdCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBqOWIh+aWrVxuICAgICAqL1xuICAgIGRpc0Nvbm5lY3QoKXtcbiAgICAgICAgdGhpcy5fS01Db20uZGlzQ29ubmVjdCgpO1xuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPUtNTW90b3JPbmVXZWJCTEU7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvS01Nb3Rvck9uZVdlYkJMRS5qc1xuLy8gbW9kdWxlIGlkID0gNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKipcbiAqIEtNQ29tQmFzZS5qc1xuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xubGV0IEtNVXRsID0gcmVxdWlyZSgnLi9LTVV0bCcpO1xubGV0IEtNU3RydWN0dXJlcz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcycpO1xuLyoqXG4gKiBAY2xhc3NkZXNjIOmAmuS/oeOCr+ODqeOCueOBruWfuuW6lVxuICogQGlnbm9yZVxuICovXG5jbGFzcyBLTUNvbUJhc2V7XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlrprmlbBcbiAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9y44CAXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5fY29tbWFuZENvdW50PTA7XG4gICAgICAgIHRoaXMuX2RldmljZUluZm89bmV3IEtNU3RydWN0dXJlcy5LTURldmljZUluZm8oKTtcblxuICAgICAgICB0aGlzLl9tb3Rvck1lYXN1cmVtZW50PW5ldyBLTVN0cnVjdHVyZXMuS01Sb3RTdGF0ZSgpO1xuICAgICAgICB0aGlzLl9tb3RvckxlZD1uZXcgS01TdHJ1Y3R1cmVzLktNTGVkU3RhdGUoKTtcbiAgICAgICAgdGhpcy5fbW90b3JJbXVNZWFzdXJlbWVudD1uZXcgS01TdHJ1Y3R1cmVzLktNSW11U3RhdGUoKTtcblxuICAgICAgICB0aGlzLl9vbkluaXRIYW5kbGVyPWZ1bmN0aW9uKGNvbm5lY3Rvcil7fTtcbiAgICAgICAgdGhpcy5fb25Db25uZWN0SGFuZGxlcj1mdW5jdGlvbihjb25uZWN0b3Ipe307XG4gICAgICAgIHRoaXMuX29uRGlzY29ubmVjdEhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yKXt9O1xuICAgICAgICB0aGlzLl9vbkNvbm5lY3RGYWlsdXJlSGFuZGxlcj1mdW5jdGlvbihjb25uZWN0b3IsIG1zZyl7fTtcblxuICAgICAgICB0aGlzLl9vbk1vdG9yTWVhc3VyZW1lbnRDQj1mdW5jdGlvbigpe307XG4gICAgICAgIHRoaXMuX29uSW11TWVhc3VyZW1lbnRDQj1mdW5jdGlvbigpe307XG4gICAgICAgIHRoaXMuX29uTW90b3JTZXR0aW5nQ0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9vbk1vdG9yTG9nQ0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9pc0luaXQ9ZmFsc2U7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIF9vbkJsZU1vdG9yU2V0dGluZ+OBruOCs+ODnuODs+ODieOAgOODouODvOOCv+ODvOioreWumuaDheWgseOBrumAmuefpeWPl+S/oeaZguOBq+ODkeODvOOCueOBmeOCi+eUqFxuICAgICAgICAgKiBAdHlwZSB7e21heFNwZWVkOiBudW1iZXIsIG1pblNwZWVkOiBudW1iZXIsIGN1cnZlVHlwZTogbnVtYmVyLCBhY2M6IG51bWJlciwgZGVjOiBudW1iZXIsIG1heFRvcnF1ZTogbnVtYmVyLCBxQ3VycmVudFA6IG51bWJlciwgcUN1cnJlbnRJOiBudW1iZXIsIHFDdXJyZW50RDogbnVtYmVyLCBzcGVlZFA6IG51bWJlciwgc3BlZWRJOiBudW1iZXIsIHNwZWVkRDogbnVtYmVyLCBwb3NpdGlvblA6IG51bWJlciwgb3duQ29sb3I6IG51bWJlcn19XG4gICAgICAgICAqIEBpZ25vcmVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5EPXtcbiAgICAgICAgICAgICAgICBcIm1heFNwZWVkXCI6MHgwMixcbiAgICAgICAgICAgICAgICBcIm1pblNwZWVkXCI6MHgwMyxcbiAgICAgICAgICAgICAgICBcImN1cnZlVHlwZVwiOjB4MDUsXG4gICAgICAgICAgICAgICAgXCJhY2NcIjoweDA3LFxuICAgICAgICAgICAgICAgIFwiZGVjXCI6MHgwOCxcbiAgICAgICAgICAgICAgICBcIm1heFRvcnF1ZVwiOjB4MEUsXG4gICAgICAgICAgICAgICAgXCJ0ZWFjaGluZ0ludGVydmFsXCI6MHgxNixcbiAgICAgICAgICAgICAgICBcInBsYXliYWNrSW50ZXJ2YWxcIjoweDE3LFxuICAgICAgICAgICAgICAgIFwicUN1cnJlbnRQXCI6MHgxOCxcbiAgICAgICAgICAgICAgICBcInFDdXJyZW50SVwiOjB4MTksXG4gICAgICAgICAgICAgICAgXCJxQ3VycmVudERcIjoweDFBLFxuICAgICAgICAgICAgICAgIFwic3BlZWRQXCI6MHgxQixcbiAgICAgICAgICAgICAgICBcInNwZWVkSVwiOjB4MUMsXG4gICAgICAgICAgICAgICAgXCJzcGVlZERcIjoweDFELFxuICAgICAgICAgICAgICAgIFwicG9zaXRpb25QXCI6MHgxRSxcbiAgICAgICAgICAgICAgICBcIm1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbFwiOjB4MkMsXG4gICAgICAgICAgICAgICAgXCJtb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0XCI6MHgyRCxcbiAgICAgICAgICAgICAgICBcImludGVyZmFjZVwiOjB4MkUsXG4gICAgICAgICAgICAgICAgXCJyZXNwb25zZVwiOjB4MzAsXG4gICAgICAgICAgICAgICAgXCJvd25Db2xvclwiOjB4M0EsXG4gICAgICAgICAgICAgICAgXCJpTVVNZWFzdXJlbWVudEludGVydmFsXCI6MHgzQyxcbiAgICAgICAgICAgICAgICBcImlNVU1lYXN1cmVtZW50QnlEZWZhdWx0XCI6MHgzRCxcbiAgICAgICAgICAgICAgICBcImRldmljZU5hbWVcIjoweDQ2LFxuICAgICAgICAgICAgICAgIFwiZGV2aWNlSW5mb1wiOjB4NDcsXG4gICAgICAgICAgICAgICAgXCJzcGVlZFwiOjB4NTgsXG4gICAgICAgICAgICAgICAgXCJwb3NpdGlvbk9mZnNldFwiOjB4NUIsXG4gICAgICAgICAgICAgICAgXCJtb3ZlVG9cIjoweDY2LFxuICAgICAgICAgICAgICAgIFwiaG9sZFwiOjB4NzIsXG4gICAgICAgICAgICAgICAgXCJzdGF0dXNcIjoweDlBLFxuICAgICAgICAgICAgICAgIFwidGFza3NldE5hbWVcIjoweEE1LFxuICAgICAgICAgICAgICAgIFwidGFza3NldEluZm9cIjoweEE2LFxuICAgICAgICAgICAgICAgIFwidGFza3NldFVzYWdlXCI6MHhBNyxcbiAgICAgICAgICAgICAgICBcIm1vdGlvbk5hbWVcIjoweEFGLFxuICAgICAgICAgICAgICAgIFwibW90aW9uSW5mb1wiOjB4QjAsXG4gICAgICAgICAgICAgICAgXCJtb3Rpb25Vc2FnZVwiOjB4QjEsXG4gICAgICAgICAgICAgICAgXCJpMkNTbGF2ZUFkZHJlc3NcIjoweEMwLFxuICAgICAgICAgICAgICAgIFwibGVkXCI6MHhFMCxcbiAgICAgICAgICAgICAgICBcImVuYWJsZUNoZWNrU3VtXCI6MHhGMyxcbiAgICAgICAgICAgICAgICBcImRldmljZVNlcmlhbFwiOjB4RkFcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvOODreOCsOeUqOOCqOODqeODvOOCs+ODvOODieihqFxuICAgICAgICAgKiBAdHlwZSB7e319XG4gICAgICAgICAqIEBpZ25vcmVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX01PVE9SX0xPR19FUlJPUkNPREU9e1xuICAgICAgICAgICAgMDp7aWQ6MCx0eXBlOlwiS01fU1VDQ0VTU1wiLG1zZzpcIlN1Y2Nlc3NmdWwgY29tbWFuZFwifSwvL+aIkOWKn+aZguOBq+i/lOWNtOOBmeOCi1xuICAgICAgICAgICAgMTp7aWQ6MSx0eXBlOlwiS01fRVJST1JfSU5URVJOQUxcIixtc2c6XCJJbnRlcm5hbCBFcnJvclwifSwvL+WGhemDqOOCqOODqeODvFxuICAgICAgICAgICAgMjp7aWQ6Mix0eXBlOlwiS01fRVJST1JfTk9fTUVNXCIsbXNnOlwiTm8gTWVtb3J5IGZvciBvcGVyYXRpb25cIn0sLy/jg6Hjg6Ljg6rkuI3otrNcbiAgICAgICAgICAgIDM6e2lkOjMsdHlwZTpcIktNX0VSUk9SX05PVF9GT1VORFwiLG1zZzpcIk5vdCBmb3VuZFwifSwvL+imi+OBpOOBi+OCieOBquOBhFxuICAgICAgICAgICAgNDp7aWQ6NCx0eXBlOlwiS01fRVJST1JfTk9UX1NVUFBPUlRFRFwiLG1zZzpcIk5vdCBzdXBwb3J0ZWRcIn0sLy/jgrXjg53jg7zjg4jlpJZcbiAgICAgICAgICAgIDU6e2lkOjUsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfQ09NTUFORFwiLG1zZzpcIkludmFsaWQgQ29tbWFuZFwifSwvL+S4jeato+OBquOCs+ODnuODs+ODiVxuICAgICAgICAgICAgNjp7aWQ6Nix0eXBlOlwiS01fRVJST1JfSU5WQUxJRF9QQVJBTVwiLG1zZzpcIkludmFsaWQgUGFyYW1ldGVyXCJ9LC8v5LiN5q2j44Gq5byV5pWwXG4gICAgICAgICAgICA3OntpZDo3LHR5cGU6XCJLTV9FUlJPUl9TVE9SQUdFX0ZVTExcIixtc2c6XCJTdG9yYWdlIGlzIGZ1bGxcIn0sLy/oqJjpjLLpoJjln5/jgYzkuIDmna9cbiAgICAgICAgICAgIDg6e2lkOjgsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfRkxBU0hfU1RBVEVcIixtc2c6XCJJbnZhbGlkIGZsYXNoIHN0YXRlLCBvcGVyYXRpb24gZGlzYWxsb3dlZCBpbiB0aGlzIHN0YXRlXCJ9LC8v44OV44Op44OD44K344Ol44Gu54q25oWL44GM5LiN5q2jXG4gICAgICAgICAgICA5OntpZDo5LHR5cGU6XCJLTV9FUlJPUl9JTlZBTElEX0xFTkdUSFwiLG1zZzpcIkludmFsaWQgTGVuZ3RoXCJ9LC8v5LiN5q2j44Gq5byV5pWw44Gu6ZW344GV77yI44K144Kk44K677yJXG4gICAgICAgICAgICAxMDp7aWQ6MTAsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfQ0hFQ0tTVU1cIixtc2c6XCJJbnZhbGlkIENoZWNrIFN1bSAoVmFsaWRhdGlvbiBpcyBmYWlsZWQpXCJ9LC8v5LiN5q2j44Gq44OB44Kn44OD44Kv44K144OgXG4gICAgICAgICAgICAxMzp7aWQ6MTMsdHlwZTpcIktNX0VSUk9SX1RJTUVPVVRcIixtc2c6XCJPcGVyYXRpb24gdGltZWQgb3V0XCJ9LC8v44K/44Kk44Og44Ki44Km44OIXG4gICAgICAgICAgICAxNTp7aWQ6MTUsdHlwZTpcIktNX0VSUk9SX0ZPUkJJRERFTlwiLG1zZzpcIkZvcmJpZGRlbiBPcGVyYXRpb25cIn0sLy/kuI3oqLHlj6/jgarmk43kvZxcbiAgICAgICAgICAgIDE2OntpZDoxNix0eXBlOlwiS01fRVJST1JfSU5WQUxJRF9BRERSXCIsbXNnOlwiQmFkIE1lbW9yeSBBZGRyZXNzXCJ9LC8v5LiN5q2j44Gq44Ki44OJ44Os44K55Y+C54WnXG4gICAgICAgICAgICAxNzp7aWQ6MTcsdHlwZTpcIktNX0VSUk9SX0JVU1lcIixtc2c6XCJCdXN5XCJ9LC8v44OT44K444O8XG4gICAgICAgICAgICAxODp7aWQ6MTgsdHlwZTpcIktNX0VSUk9SX1JFU09VUkNFXCIsbXNnOlwiTm90IGVub3VnaCByZXNvdXJjZXMgZm9yIG9wZXJhdGlvblwifSwvL+ODquOCveODvOOCueS4jei2s1xuICAgICAgICAgICAgMjA6e2lkOjIwLHR5cGU6XCJLTV9FUlJPUl9NT1RPUl9ESVNBQkxFRFwiLG1zZzpcIk1vdG9yIHN0YXRlIGlzIGRpc2FibGVkXCJ9LC8v44Oi44O844K/44O844GM5YuV5L2c6Kix5Y+v44GV44KM44Gm44GE44Gq44GEXG4gICAgICAgICAgICA2MDp7aWQ6NjAsdHlwZTpcIktNX0VSUk9SX0RFVklDRV9EUklWRVJcIixtc2c6XCJLTV9FUlJPUl9ERVZJQ0VfRFJJVkVSXCJ9LC8v5YaF5a655pyq5a6a576pXG4gICAgICAgICAgICA2MTp7aWQ6NjEsdHlwZTpcIktNX0VSUk9SX0RFVklDRV9GTEFTSFwiLG1zZzpcIktNX0VSUk9SX0RFVklDRV9GTEFTSFwifSwvL+WGheWuueacquWumue+qVxuICAgICAgICAgICAgNjI6e2lkOjYyLHR5cGU6XCJLTV9FUlJPUl9ERVZJQ0VfTEVEXCIsbXNnOlwiS01fRVJST1JfREVWSUNFX0xFRFwifSwvL+WGheWuueacquWumue+qVxuICAgICAgICAgICAgNjM6e2lkOjYzLHR5cGU6XCJLTV9FUlJPUl9ERVZJQ0VfSU1VXCIsbXNnOlwiS01fRVJST1JfREVWSUNFX0lNVVwifSwvL+WGheWuueacquWumue+qVxuICAgICAgICAgICAgNzA6e2lkOjcwLHR5cGU6XCJLTV9FUlJPUl9OUkZfREVWSUNFXCIsbXNnOlwiRXJyb3IgcmVsYXRlZCB0byBCTEUgbW9kdWxlIChuUkY1MjgzMilcIn0sLy9CTEXjg6Ljgrjjg6Xjg7zjg6vjga7jgqjjg6njg7xcbiAgICAgICAgICAgIDgwOntpZDo4MCx0eXBlOlwiS01fRVJST1JfV0RUX0VWRU5UXCIsbXNnOlwiV2F0Y2ggRG9nIFRpbWVyIEV2ZW50XCJ9LC8v44Km44Kp44OD44OB44OJ44OD44Kw44K/44Kk44Oe44O844Kk44OZ44Oz44OI44Gu55m65YuV77yI5YaN6LW35YuV55u05YmN77yJXG4gICAgICAgICAgICA4MTp7aWQ6ODEsdHlwZTpcIktNX0VSUk9SX09WRVJfSEVBVFwiLG1zZzpcIk92ZXIgSGVhdCAob3ZlciB0ZW1wZXJhdHVyZSlcIn0vL+a4qeW6pueVsOW4uFxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDjg5fjg63jg5Hjg4bjgqNcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDjg4fjg5DjgqTjgrnmg4XloLFcbiAgICAgKiBAdHlwZSB7S01EZXZpY2VJbmZvfVxuICAgICAqXG4gICAgICovXG4gICAgZ2V0IGRldmljZUluZm8oKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2RldmljZUluZm8uQ2xvbmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmnInlirnnhKHlirlcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBnZXQgaXNDb25uZWN0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZXZpY2VJbmZvLmlzQ29ubmVjdDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgrPjg57jg7Pjg4npoIbnm6PoppbnlKjpgKPnlarjga7nmbrooYxcbiAgICAgKiBAdHlwZSB7bnVtYmVyfVxuICAgICAqL1xuICAgIGdldCBjcmVhdGVDb21tYW5kSUQoKXtcbiAgICAgICByZXR1cm4gdGhpcy5fY29tbWFuZENvdW50PSgrK3RoaXMuX2NvbW1hbmRDb3VudCkmMGIxMTExMTExMTExMTExMTExOy8vNjU1MzXjgafjg6vjg7zjg5dcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBpc0Nvbm5lY3Tjga7oqK3lrprlpInmm7Qo5a2Q44Kv44Op44K544GL44KJ5L2/55SoKVxuICAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gYm9vbFxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBfc3RhdHVzQ2hhbmdlX2lzQ29ubmVjdChib29sKXtcbiAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q9Ym9vbDtcbiAgICAgICAgaWYodGhpcy5faXNJbml0KXtcbiAgICAgICAgICAgIGlmKGJvb2wpe1xuICAgICAgICAgICAgICAgIHRoaXMuX29uQ29ubmVjdEhhbmRsZXIodGhpcyk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyKHRoaXMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5Yid5pyf5YyW54q25oWL44Gu6Kit5a6aKOWtkOOCr+ODqeOCueOBi+OCieS9v+eUqClcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJvb2xcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgX3N0YXR1c0NoYW5nZV9pbml0KGJvb2wpe1xuICAgICAgICB0aGlzLl9pc0luaXQ9Ym9vbDtcbiAgICAgICAgaWYodGhpcy5faXNJbml0KXtcbiAgICAgICAgICAgIHRoaXMuX29uSW5pdEhhbmRsZXIodGhpcyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiBjYWxsYmFja1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIOWIneacn+WMluWujOS6huOBl+OBpuWIqeeUqOOBp+OBjeOCi+OCiOOBhuOBq+OBquOBo+OBn1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihLTUNvbUJhc2UpfVxuICAgICAqL1xuICAgIHNldCBvbkluaXQoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Jbml0SGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog5b+c562U44O75YaN5o6l57aa44Gr5oiQ5Yqf44GX44GfXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKEtNQ29tQmFzZSl9XG4gICAgICovXG4gICAgc2V0IG9uQ29ubmVjdChoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDlv5znrZTjgYznhKHjgY/jgarjgaPjgZ/jg7vliIfmlq3jgZXjgozjgZ9cbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oS01Db21CYXNlKX1cbiAgICAgKi9cbiAgICBzZXQgb25EaXNjb25uZWN0KGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uRGlzY29ubmVjdEhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOaOpee2muOBq+WkseaVl1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihLTUNvbUJhc2Usc3RyaW5nKX1cbiAgICAgKi9cbiAgICBzZXQgb25Db25uZWN0RmFpbHVyZShoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RGYWlsdXJlSGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjga7lm57ou6Lmg4XloLFjYWxsYmFja1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihwb3NpdGlvbjpudW1iZXIsdmVsb2NpdHk6bnVtYmVyLHRvcnF1ZTpudW1iZXIpfVxuICAgICAqL1xuICAgIHNldCBvbk1vdG9yTWVhc3VyZW1lbnQoZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JNZWFzdXJlbWVudENCPWZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Gu44K444Oj44Kk44Ot5oOF5aCxY2FsbGJhY2tcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oe2FjY2VsWDpudW1iZXIsYWNjZWxZOm51bWJlcixhY2NlbFo6bnVtYmVyLHRlbXA6bnVtYmVyLGd5cm9YOm51bWJlcixneXJvWTpudW1iZXIsZ3lyb1o6bnVtYmVyfSl9XG4gICAgICovXG4gICAgc2V0IG9uSW11TWVhc3VyZW1lbnQoZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uSW11TWVhc3VyZW1lbnRDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O86Kit5a6a5oOF5aCx5Y+W5b6XY2FsbGJhY2tcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24ocmVnaXN0ZXJDbWQ6bnVtYmVyLHJlczpudW1iZXIpfVxuICAgICAqL1xuICAgIHNldCBvbk1vdG9yU2V0dGluZyhmdW5jKXtcbiAgICAgICAgaWYodHlwZW9mIGZ1bmM9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Nb3RvclNldHRpbmdDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOODreOCsOaDheWgseWPluW+l2NhbGxiYWNrXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKGNtZElEOm51bWJlcixyZXM6ZXJyb3Jsb2dPYmplY3QpfVxuICAgICAqL1xuICAgIHNldCBvbk1vdG9yTG9nKGZ1bmMpe1xuICAgICAgICBpZih0eXBlb2YgZnVuYz09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yTG9nQ0I9ZnVuYztcbiAgICAgICAgfVxuICAgIH1cblxuLy8vLy8vY2xhc3MvL1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9S01Db21CYXNlO1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNQ29tQmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gNlxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKipcbiAqIEtNTW90b3JDb21tYW5kS01PbmUuanNcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmNvbnN0IEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoXCJldmVudHNcIikuRXZlbnRFbWl0dGVyO1xuY29uc3QgS01VdGwgPSByZXF1aXJlKCcuL0tNVXRsJyk7XG5jb25zdCBLTUNvbVdlYkJMRSA9IHJlcXVpcmUoJy4vS01Db21XZWJCTEUnKTtcbmNvbnN0IEtNU3RydWN0dXJlcz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcycpO1xuXG5cbi8qKlxuICogQGNsYXNzZGVzYyBLTTHjgrPjg57jg7Pjg4npgIHkv6Hjgq/jg6njgrlcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01Nb3RvckNvbW1hbmRLTU9uZSBleHRlbmRzIEV2ZW50RW1pdHRlcntcbiAgICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgICAgKiDlrprmlbBcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICog5o6l57aa5pa55byP5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gV0VCQkxFIC0gMTpXRUJCTEVcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gQkxFIC0gMjpCTEVcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gU0VSSUFMIC0gMzpTRVJJQUxcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IEtNX0NPTk5FQ1RfVFlQRSgpe1xuICAgICAgICByZXR1cm4ge1wiV0VCQkxFXCI6MSxcIkJMRVwiOjIsXCJTRVJJQUxcIjozfTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIGNtZFByZXBhcmVQbGF5YmFja01vdGlvbuOBrumWi+Wni+S9jee9ruOCquODl+OCt+ODp+ODs+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFNUQVJUX1BPU0lUSU9OX0FCUyAtIDA66KiY5oa244GV44KM44Gf6ZaL5aeL5L2N572u77yI57W25a++5bqn5qiZ77yJ44GL44KJ44K544K/44O844OIXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFNUQVJUX1BPU0lUSU9OX0NVUlJFTlQgLSAxOuePvuWcqOOBruS9jee9ruOCkumWi+Wni+S9jee9ruOBqOOBl+OBpuOCueOCv+ODvOODiFxuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdTVEFSVF9QT1NJVElPTl9BQlMnOjAsXG4gICAgICAgICAgICAnU1RBUlRfUE9TSVRJT05fQ1VSUkVOVCc6MVxuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjbWRMZWTjga5MRUTjga7ngrnnga/nirbmhYvjgqrjg5fjgrfjg6fjg7PlrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBMRURfU1RBVEVfT0ZGIC0gMDrmtojnga9cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTEVEX1NUQVRFX09OX1NPTElEIC0gMTpMRUTngrnnga/vvIjngrnnga/jgZfjgaPjgbHjgarjgZfvvIlcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTEVEX1NUQVRFX09OX0ZMQVNIIC0gMjpMRUTngrnmu4XvvIjkuIDlrprplpPpmpTjgafngrnmu4XvvIlcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTEVEX1NUQVRFX09OX0RJTSAtIDozTEVE44GM44KG44Gj44GP44KK5piO5ruF44GZ44KLXG4gICAgICovXG4gICAgc3RhdGljIGdldCBjbWRMZWRfTEVEX1NUQVRFKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdMRURfU1RBVEVfT0ZGJzowLFxuICAgICAgICAgICAgJ0xFRF9TVEFURV9PTl9TT0xJRCc6MSxcbiAgICAgICAgICAgICdMRURfU1RBVEVfT05fRkxBU0gnOjIsXG4gICAgICAgICAgICAnTEVEX1NUQVRFX09OX0RJTSc6M1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjbWRDdXJ2ZVR5cGXjga7liqDmuJvpgJ/jgqvjg7zjg5bjgqrjg5fjgrfjg6fjg7PlrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBDVVJWRV9UWVBFX05PTkUgLSAwOuODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPRkZcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gQ1VSVkVfVFlQRV9UUkFQRVpPSUQgLSAxOuODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPTiDvvIjlj7DlvaLliqDmuJvpgJ/vvIlcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdDVVJWRV9UWVBFX05PTkUnOiAwLFxuICAgICAgICAgICAgJ0NVUlZFX1RZUEVfVFJBUEVaT0lEJzoxXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY21kTW90b3JNZWFzdXJlbWVudEludGVydmFs44Gu44Oi44O844K/44O85ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqU5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF81TVMgLSAwOjVNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzEwTVMgLSAxOjEwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8yME1TIC0gMjoyME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfNTBNUyAtIDM6NTBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzEwME1TIC0gNDoxMDBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzIwME1TIC0gNToyMDBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzUwME1TIC0gNjo1MDBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzEwMDBNUyAtIDc6MTAwME1TXG4gICAgICovXG4gICAgc3RhdGljIGdldCBjbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxfTU9UT1JfTUVBU19JTlRFUlZBTCgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF81TVMnOiAwLFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfMTBNUyc6MSxcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzIwTVMnOjIsXG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF81ME1TJzozLFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfMTAwTVMnOjQsXG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF8yMDBNUyc6NSxcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzUwME1TJzo2LFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfMTAwME1TJzo3XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWzjga7liqDpgJ/luqbjg7vjgrjjg6PjgqTjg63muKzlrprlgKTjga7lj5blvpfplpPpmpTlrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzVNUyAtIDA6NU1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTBNUyAtIDE6MTBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzIwTVMgLSAyOjIwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF81ME1TIC0gMzo1ME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTAwTVMgLSA0OjEwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMjAwTVMgLSA1OjIwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfNTAwTVMgLSA2OjUwME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMTAwME1TIC0gNzoxMDAwTVNcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUwoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ0lNVV9NRUFTX0lOVEVSVkFMXzVNUyc6IDAsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfMTBNUyc6MSxcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF8yME1TJzoyLFxuICAgICAgICAgICAgJ0lNVV9NRUFTX0lOVEVSVkFMXzUwTVMnOjMsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfMTAwTVMnOjQsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfMjAwTVMnOjUsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfNTAwTVMnOjYsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfMTAwME1TJzo3XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qXG4gICAgKiBSZWFkUmVnaXN0ZXLjgaflj5blvpfjgZnjgovmmYLnlKjjga7jgrPjg57jg7Pjg4nlvJXmlbDlrprmlbBcbiAgICAqIEByZWFkb25seVxuICAgICogQGVudW0ge251bWJlcn1cbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtYXhTcGVlZCAtIDI65pyA5aSn6YCf44GVXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gbWluU3BlZWQgLSAzOuacgOWwj+mAn+OBlVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGN1cnZlVHlwZSAtIDU65Yqg5rib6YCf5puy57eaXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gYWNjIC0gNzrliqDpgJ/luqZcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBkZWMgLSA4Oua4m+mAn+W6plxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IG1heFRvcnF1ZSAtIDE0OuacgOWkp+ODiOODq+OCr1xuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHFDdXJyZW50UCAtIDI0OnHou7jpm7vmtYFQSUTjgrLjgqTjg7MoUClcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBxQ3VycmVudEkgLSAyNTpx6Lu46Zu75rWBUElE44Ky44Kk44OzKEkpXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcUN1cnJlbnREIC0gMjY6cei7uOmbu+a1gVBJROOCsuOCpOODsyhEKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHNwZWVkUCAtIDI3OumAn+W6plBJROOCsuOCpOODsyhQKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHNwZWVkSSAtIDI4OumAn+W6plBJROOCsuOCpOODsyhJKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHNwZWVkRCAtIDI5OumAn+W6plBJROOCsuOCpOODsyhEKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHBvc2l0aW9uUCAtIDMwOuS9jee9rlBJROOCsuOCpOODsyhQKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IG93bkNvbG9yIC0gNTg644OH44OQ44Kk44K5TEVE44Gu5Zu65pyJ6ImyXG4gICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZFJlYWRSZWdpc3Rlcl9DT01NQU5EKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgIFwibWF4U3BlZWRcIjoweDAyLFxuICAgICAgICAgICAgXCJtaW5TcGVlZFwiOjB4MDMsXG4gICAgICAgICAgICBcImN1cnZlVHlwZVwiOjB4MDUsXG4gICAgICAgICAgICBcImFjY1wiOjB4MDcsXG4gICAgICAgICAgICBcImRlY1wiOjB4MDgsXG4gICAgICAgICAgICBcIm1heFRvcnF1ZVwiOjB4MEUsXG4gICAgICAgICAgICBcInFDdXJyZW50UFwiOjB4MTgsXG4gICAgICAgICAgICBcInFDdXJyZW50SVwiOjB4MTksXG4gICAgICAgICAgICBcInFDdXJyZW50RFwiOjB4MUEsXG4gICAgICAgICAgICBcInNwZWVkUFwiOjB4MUIsXG4gICAgICAgICAgICBcInNwZWVkSVwiOjB4MUMsXG4gICAgICAgICAgICBcInNwZWVkRFwiOjB4MUQsXG4gICAgICAgICAgICBcInBvc2l0aW9uUFwiOjB4MUUsXG4gICAgICAgICAgICBcIm93bkNvbG9yXCI6MHgzQSxcbiAgICAgICAgICAgIFwiZGV2aWNlTmFtZVwiOjB4NDYsXG4gICAgICAgICAgICBcImRldmljZUluZm9cIjoweDQ3XG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qXG4gICAgICAgKiDjg6Ljg7zjgr/jg7zliLblvqHmiYvmrrXvvIjjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnvvInjga7ntYzot6/mjIflrprnlKjlrprmlbBcbiAgICAgICAqIEByZWFkb25seVxuICAgICAgICogQGVudW0ge251bWJlcn1cbiAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBCTEUgLSAweDE6QkxFXG4gICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gVVNCIC0gMHgxMDAwOlVTQlxuICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IEkyQyAtIDB4MTAwMDA6STJDXG4gICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gSEREQlROIC0gMHgxMDAwMDAwMDrniannkIbjg5zjgr/jg7NcbiAgICAgICAqL1xuICAgIHN0YXRpYyBnZXQgY21kSW50ZXJmYWNlX0lOVEVSRkFDRV9UWVBFKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgIFwiQkxFXCI6MGIxLFxuICAgICAgICAgICAgXCJVU0JcIjowYjEwMDAsXG4gICAgICAgICAgICBcIkkyQ1wiOjBiMTAwMDAsXG4gICAgICAgICAgICBcIkhEREJUTlwiOjBiMTAwMDAwMDBcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3LjgIBcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuS01fQ09OTkVDVF9UWVBFfSBjb25uZWN0X3R5cGUg5o6l57aa5pa55byPXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGttY29tIOmAmuS/oeOCquODluOCuOOCp+OCr+ODiCB7QGxpbmsgS01Db21CTEV9IHtAbGluayBLTUNvbVdlYkJMRX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGNvbm5lY3RfdHlwZSxrbWNvbSl7XG4gICAgICAgIHN1cGVyKCk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOOCpOODmeODs+ODiOOCv+OCpOODl+WumuaVsFxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICogQGVudW0ge3N0cmluZ31cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuRVZFTlRfVFlQRT17XG4gICAgICAgICAgICAvKiog5Yid5pyf5YyW5a6M5LqG5pmCPGJyPnJldHVybjpmdW5jdGlvbih7S01EZXZpY2VJbmZvfSkgKi8gaW5pdDpcImluaXRcIixcbiAgICAgICAgICAgIC8qKiDmjqXntprmmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtLTURldmljZUluZm99KSAqLyBjb25uZWN0OlwiY29ubmVjdFwiLFxuICAgICAgICAgICAgLyoqIOWIh+aWreaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0tNRGV2aWNlSW5mb30pICovIGRpc2Nvbm5lY3Q6XCJkaXNjb25uZWN0XCIsXG4gICAgICAgICAgICAvKiog5o6l57aa44Gr5aSx5pWX5pmCPGJyPnJldHVybjpmdW5jdGlvbih7S01EZXZpY2VJbmZvfSx7bXNnfSkgKi8gY29ubmVjdEZhaWx1cmU6XCJjb25uZWN0RmFpbHVyZVwiLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOWbnui7ouaDheWgseWPl+S/oeaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0BsaW5rIEtNUm90U3RhdGV9KSAqLyBtb3Rvck1lYXN1cmVtZW50OlwibW90b3JNZWFzdXJlbWVudFwiLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvElNVeaDheWgseWPl+S/oeaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0BsaW5rIEtNSW11U3RhdGV9KSAqLyBpbXVNZWFzdXJlbWVudDpcImltdU1lYXN1cmVtZW50XCIsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844Ot44Kw5oOF5aCx5Y+X5L+h5pmCPGJyPnJldHVybjpmdW5jdGlvbih7Y21kTmFtZX0se2Vycm9ybG9nT2JqZWN0fSkgKi8gbW90b3JMb2c6XCJtb3RvckxvZ1wiLFxuICAgICAgICB9O1xuICAgICAgICBPYmplY3QuZnJlZXplKHRoaXMuRVZFTlRfVFlQRSk7Ly9pbmZvOjrlvozjgYvjgonjg5Xjg6rjg7zjgrrjgZfjgarjgYTjgahqc2RvY+OBjOeUn+aIkOOBleOCjOOBquOBhOOAglxuICAgICAgICAvKipcbiAgICAgICAgICog44Oi44O844K/44O844Gu5YWo44Kz44Oe44Oz44OJXG4gICAgICAgICAqIEByZWFkb25seVxuICAgICAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAaWdub3JlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9NT1RPUl9DT01NQU5EPXtcbiAgICAgICAgICAgIC8qKiDmnIDlpKfpgJ/jgZXjgpLoqK3lrprjgZnjgosgKi8gbWF4U3BlZWQ6MHgwMixcbiAgICAgICAgICAgIC8qKiDmnIDlsI/pgJ/jgZXjgpLoqK3lrprjgZnjgosgKi8gbWluU3BlZWQ6MHgwMyxcbiAgICAgICAgICAgIC8qKiDliqDmuJvpgJ/mm7Lnt5rjgpLoqK3lrprjgZnjgosgKi8gY3VydmVUeXBlOjB4MDUsXG4gICAgICAgICAgICAvKiog5Yqg6YCf5bqm44KS6Kit5a6a44GZ44KLICovIGFjYzoweDA3LFxuICAgICAgICAgICAgLyoqIOa4m+mAn+W6puOCkuioreWumuOBmeOCiyAqLyBkZWM6MHgwOCxcbiAgICAgICAgICAgIC8qKiDmnIDlpKfjg4jjg6vjgq/jgpLoqK3lrprjgZnjgosgKi8gbWF4VG9ycXVlOjB4MEUsXG4gICAgICAgICAgICAvKiog44OG44Kj44O844OB44Oz44Kw6ZaT6ZqUICovIHRlYWNoaW5nSW50ZXJ2YWw6MHgxNixcbiAgICAgICAgICAgIC8qKiDjg5fjg6zjgqTjg5Djg4Pjgq/plpPpmpQgKi8gcGxheWJhY2tJbnRlcnZhbDoweDE3LFxuICAgICAgICAgICAgLyoqIHHou7jpm7vmtYFQSUTjgrLjgqTjg7MoUCnjgpLoqK3lrprjgZnjgosgKi8gcUN1cnJlbnRQOjB4MTgsXG4gICAgICAgICAgICAvKiogcei7uOmbu+a1gVBJROOCsuOCpOODsyhJKeOCkuioreWumuOBmeOCiyAqLyBxQ3VycmVudEk6MHgxOSxcbiAgICAgICAgICAgIC8qKiBx6Lu46Zu75rWBUElE44Ky44Kk44OzKEQp44KS6Kit5a6a44GZ44KLICovIHFDdXJyZW50RDoweDFBLFxuICAgICAgICAgICAgLyoqIOmAn+W6plBJROOCsuOCpOODsyhQKeOCkuioreWumuOBmeOCiyAqLyBzcGVlZFA6MHgxQixcbiAgICAgICAgICAgIC8qKiDpgJ/luqZQSUTjgrLjgqTjg7MoSSnjgpLoqK3lrprjgZnjgosgKi8gc3BlZWRJOjB4MUMsXG4gICAgICAgICAgICAvKiog6YCf5bqmUElE44Ky44Kk44OzKEQp44KS6Kit5a6a44GZ44KLICovIHNwZWVkRDoweDFELFxuICAgICAgICAgICAgLyoqIOS9jee9rlBJROOCsuOCpOODsyhQKeOCkuioreWumuOBmeOCiyAqLyBwb3NpdGlvblA6MHgxRSxcbiAgICAgICAgICAgIC8qKiBQSUTjgrLjgqTjg7PjgpLjg6rjgrvjg4Pjg4jjgZnjgosgKi8gcmVzZXRQSUQ6MHgyMixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zmuKzlrprlgKTjga7lj5blvpfplpPpmpQoVVNCLEkyQ+OBruOBvykgKi8gbW90b3JNZWFzdXJlbWVudEludGVydmFsOjB4MkMsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O85ris5a6a5YCk44Gu5Y+W5b6X6Kit5a6aICovIG1vdG9yTWVhc3VyZW1lbnRCeURlZmF1bHQ6MHgyRCxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zliLblvqHmiYvmrrXvvIjjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnvvInjga7oqK3lrpogKi8gaW50ZXJmYWNlOjB4MkUsXG5cbiAgICAgICAgICAgIC8qKiDjg4fjg5DjgqTjgrlMRUTjga7lm7rmnInoibLjgpLoqK3lrprjgZnjgosgKi8gb3duQ29sb3I6MHgzQSxcbiAgICAgICAgICAgIC8qKiBJTVXmuKzlrprlgKTpgJrnn6XplpPpmpTvvIjmnInnt5rjga7jgb/vvIkgKi8gaU1VTWVhc3VyZW1lbnRJbnRlcnZhbDoweDNDLFxuICAgICAgICAgICAgLyoqIOODh+ODleOCqeODq+ODiOOBp+OBrklNVea4rOWumuWApOmAmuefpU9OL09GRiAqLyBpTVVNZWFzdXJlbWVudEJ5RGVmYXVsdDoweDNELFxuXG4gICAgICAgICAgICAvKiog5oyH5a6a44Gu6Kit5a6a5YCk44KS5Y+W5b6X44GZ44KLICovIHJlYWRSZWdpc3RlcjoweDQwLFxuICAgICAgICAgICAgLyoqIOWFqOOBpuOBruioreWumuWApOOCkuODleODqeODg+OCt+ODpeOBq+S/neWtmOOBmeOCiyAqLyBzYXZlQWxsUmVnaXN0ZXJzOjB4NDEsXG5cbiAgICAgICAgICAgIC8qKiDjg4fjg5DjgqTjgrnjg43jg7zjg6Djga7lj5blvpcgKi8gcmVhZERldmljZU5hbWU6MHg0NixcbiAgICAgICAgICAgIC8qKiDjg4fjg5DjgqTjgrnmg4XloLHjga7lj5blvpcgKi8gcmVhZERldmljZUluZm86MHg0NyxcbiAgICAgICAgICAgIC8qKiDmjIflrprjga7oqK3lrprlgKTjgpLjg6rjgrvjg4Pjg4jjgZnjgosgKi8gcmVzZXRSZWdpc3RlcjoweDRFLFxuICAgICAgICAgICAgLyoqIOWFqOioreWumuWApOOCkuODquOCu+ODg+ODiOOBmeOCiyAqLyByZXNldEFsbFJlZ2lzdGVyczoweDRGLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOBruWLleS9nOOCkuS4jeioseWPr+OBqOOBmeOCiyAqLyBkaXNhYmxlOjB4NTAsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O85YuV5L2c44KS6Kix5Y+v44GZ44KLICovIGVuYWJsZToweDUxLFxuICAgICAgICAgICAgLyoqIOmAn+W6puOBruWkp+OBjeOBleOCkuioreWumuOBmeOCiyAqLyBzcGVlZDoweDU4LFxuICAgICAgICAgICAgLyoqIOS9jee9ruOBruODl+ODquOCu+ODg+ODiOOCkuihjOOBhu+8iOWOn+eCueioreWumu+8iSAqLyBwcmVzZXRQb3NpdGlvbjoweDVBLFxuICAgICAgICAgICAgLyoqIOS9jee9ruOBruODl+ODquOCu+ODg+ODiOOBq+mWouOBmeOCi09GRlNFVOmHjyAqLyByZWFkUG9zaXRpb25PZmZzZXQ6MHg1QixcblxuICAgICAgICAgICAgLyoqIOato+Wbnui7ouOBmeOCi++8iOWPjeaZguioiOWbnuOCiu+8iSAqLyBydW5Gb3J3YXJkOjB4NjAsXG4gICAgICAgICAgICAvKiog6YCG5Zue6Lui44GZ44KL77yI5pmC6KiI5Zue44KK77yJICovIHJ1blJldmVyc2U6MHg2MSxcbiAgICAgICAgICAgIC8qKiDntbblr77kvY3nva7jgavnp7vli5XjgZnjgoso6YCf5bqm44GC44KKKSAqLyBtb3ZlVG9Qb3NpdGlvblNwZWVkOjB4NjUsXG4gICAgICAgICAgICAvKiog57W25a++5L2N572u44Gr56e75YuV44GZ44KLICovIG1vdmVUb1Bvc2l0aW9uOjB4NjYsXG4gICAgICAgICAgICAvKiog55u45a++5L2N572u44Gr56e75YuV44GZ44KLKOmAn+W6puOBguOCiikgKi8gbW92ZUJ5RGlzdGFuY2VTcGVlZDoweDY3LFxuICAgICAgICAgICAgLyoqIOebuOWvvuS9jee9ruOBq+enu+WLleOBmeOCiyAqLyBtb3ZlQnlEaXN0YW5jZToweDY4LFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOBruWKseejgeOCkuWBnOatouOBmeOCiyAqLyBmcmVlOjB4NkMsXG4gICAgICAgICAgICAvKiog6YCf5bqm44K844Ot44G+44Gn5rib6YCf44GX5YGc5q2i44GZ44KLICovIHN0b3A6MHg2RCxcbiAgICAgICAgICAgIC8qKiDjg4jjg6vjgq/liLblvqHjgpLooYzjgYYgKi8gaG9sZFRvcnF1ZToweDcyLFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOCkuWun+ihjOOBmeOCiyAqLyBzdGFydERvaW5nVGFza3NldDoweDgxLFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOCkuWBnOatoiAqLyBzdG9wRG9pbmdUYXNrc2V0OjB4ODIsXG4gICAgICAgICAgICAvKiog44Oi44O844K344On44Oz44KS5YaN55Sf77yI5rqW5YKZ44Gq44GX77yJICovIHN0YXJ0UGxheWJhY2tNb3Rpb246MHg4NSxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/jgpLlgZzmraLjgZnjgosgKi8gc3RvcFBsYXliYWNrTW90aW9uOjB4ODgsXG4gICAgICAgICAgICAvKiog44Kt44Ol44O844KS5YGc5q2i44GZ44KLICovIHBhdXNlUXVldWU6MHg5MCxcbiAgICAgICAgICAgIC8qKiDjgq3jg6Xjg7zjgpLlho3plovjgZnjgosgKi8gcmVzdW1lUXVldWU6MHg5MSxcbiAgICAgICAgICAgIC8qKiDjgq3jg6Xjg7zjgpLmjIflrprmmYLplpPlgZzmraLjgZflho3plovjgZnjgosgKi8gd2FpdFF1ZXVlOjB4OTIsXG4gICAgICAgICAgICAvKiog44Kt44Ol44O844KS44Oq44K744OD44OI44GZ44KLICovIHJlc2V0UXVldWU6MHg5NSxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zjga7nirbmhYsgKi8gcmVhZFN0YXR1czoweDlBLFxuXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44KS6ZaL5aeL44GZ44KLICovIHN0YXJ0UmVjb3JkaW5nVGFza3NldDoweEEwLFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuOCkuWBnOatouOBmeOCiyAqLyBzdG9wUmVjb3JkaW5nVGFza3NldDoweEEyLFxuICAgICAgICAgICAgLyoqIOaMh+WumuOBruOCv+OCueOCr+OCu+ODg+ODiOOCkuWJiumZpOOBmeOCiyAqLyBlcmFzZVRhc2tzZXQ6MHhBMyxcbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jjgpLlhajliYrpmaTjgZnjgosgKi8gZXJhc2VBbGxUYXNrc2V0OjB4QTQsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy5ZCN6Kit5a6aICovIHNldFRhc2tzZXROYW1lOjB4QTUsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI5YaF5a655oqK5o+hICovIHJlYWRUYXNrc2V0SW5mbzoweEE2LFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOS9v+eUqOeKtuazgeaKiuaPoSAqLyByZWFkVGFza3NldFVzYWdlOjB4QTcsXG4gICAgICAgICAgICAvKiog44OA44Kk44Os44Kv44OI44OG44Kj44O844OB44Oz44Kw6ZaL5aeL77yI5rqW5YKZ44Gq44GX77yJICovIHN0YXJ0VGVhY2hpbmdNb3Rpb246MHhBOSxcbiAgICAgICAgICAgIC8qKiDjg4bjgqPjg7zjg4Hjg7PjgrDjgpLlgZzmraLjgZnjgosgKi8gc3RvcFRlYWNoaW5nTW90aW9uOjB4QUMsXG4gICAgICAgICAgICAvKiog44OG44Kj44O844OB44Oz44Kw44Gn6Kaa44GI44Gf5YuV5L2c44KS5YmK6Zmk44GZ44KLICovIGVyYXNlTW90aW9uOjB4QUQsXG4gICAgICAgICAgICAvKiog44OG44Kj44O844OB44Oz44Kw44Gn6Kaa44GI44Gf5YWo5YuV5L2c44KS5YmK6Zmk44GZ44KLICovIGVyYXNlQWxsTW90aW9uOjB4QUUsXG4gICAgICAgICAgICAvKiogSTJD44K544Os44O844OW44Ki44OJ44Os44K5ICovIHNldEkyQ1NsYXZlQWRkcmVzczoweEMwLFxuICAgICAgICAgICAgLyoqIExFROOBrueCueeBr+eKtuaFi+OCkuOCu+ODg+ODiOOBmeOCiyAqLyBsZWQ6MHhFMCxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zjga7muKzlrprlgKTlj5blvpfvvIjpgJrnn6XvvInjgpLplovlp4sgKi8gZW5hYmxlTW90b3JNZWFzdXJlbWVudDoweEU2LFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOOBrua4rOWumuWApOWPluW+l++8iOmAmuefpe+8ieOCkumWi+WniyAqLyBkaXNhYmxlTW90b3JNZWFzdXJlbWVudDoweEU3LFxuICAgICAgICAgICAgLyoqIElNVeOBruWApOWPluW+lyjpgJrnn6Up44KS6ZaL5aeL44GZ44KLICovIGVuYWJsZUlNVU1lYXN1cmVtZW50OjB4RUEsXG4gICAgICAgICAgICAvKiogSU1V44Gu5YCk5Y+W5b6XKOmAmuefpSnjgpLlgZzmraLjgZnjgosgKi8gZGlzYWJsZUlNVU1lYXN1cmVtZW50OjB4RUIsXG5cbiAgICAgICAgICAgIC8qKiDjgrfjgrnjg4bjg6DjgpLlho3otbfli5XjgZnjgosgKi8gcmVib290OjB4RjAsXG4gICAgICAgICAgICAvKiog44OB44Kn44OD44Kv44K144Og77yIQ1JDMTYpIOacieWKueWMliAqLyBlbmFibGVDaGVja1N1bToweEYzLFxuICAgICAgICAgICAgLyoqIOODleOCoeODvOODoOOCpuOCp+OCouOCouODg+ODl+ODh+ODvOODiOODouODvOODieOBq+WFpeOCiyAqLyBlbnRlckRldmljZUZpcm13YXJlVXBkYXRlOjB4RkRcbiAgICAgICAgfTtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh0aGlzLl9NT1RPUl9DT01NQU5EKTsvL2luZm86OuW+jOOBi+OCieODleODquODvOOCuuOBl+OBquOBhOOBqGpzZG9j44GM55Sf5oiQ44GV44KM44Gq44GE44CCXG5cbiAgICAgICAgLy/jg6Ljg7zjgr/jg7zjga7lhajjgrPjg57jg7Pjg4nvvIjpgIblvJXnlKjvvIlcbiAgICAgICAgdGhpcy5fUkVWX01PVE9SX0NPTU1BTkQ9e307XG4gICAgICAgIE9iamVjdC5rZXlzKHRoaXMuX01PVE9SX0NPTU1BTkQpLmZvckVhY2goKGspPT57dGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbdGhpcy5fTU9UT1JfQ09NTUFORFtrXV09azt9KTtcbiAgICAgICAgLy9TZW5kTm90aWZ5UHJvbWlz44Gu44Oq44K544OIXG4gICAgICAgIHRoaXMuX25vdGlmeVByb21pc0xpc3Q9W107XG4gICAgICAgIHRoaXMuY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OPXRoaXMuY29uc3RydWN0b3IuY21kUHJlcGFyZVBsYXliYWNrTW90aW9uX1NUQVJUX1BPU0lUSU9OO1xuICAgICAgICB0aGlzLmNtZExlZF9MRURfU1RBVEU9dGhpcy5jb25zdHJ1Y3Rvci5jbWRMZWRfTEVEX1NUQVRFO1xuICAgICAgICB0aGlzLmNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFPXRoaXMuY29uc3RydWN0b3IuY21kQ3VydmVUeXBlX0NVUlZFX1RZUEU7XG4gICAgICAgIHRoaXMuY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUw9dGhpcy5jb25zdHJ1Y3Rvci5jbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxfTU9UT1JfTUVBU19JTlRFUlZBTDtcbiAgICAgICAgdGhpcy5jbWRJTVVNZWFzdXJlbWVudEludGVydmFsX0lNVV9NRUFTX0lOVEVSVkFMPXRoaXMuY29uc3RydWN0b3IuY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbF9JTVVfTUVBU19JTlRFUlZBTDtcbiAgICAgICAgdGhpcy5jbWRJbnRlcmZhY2VfSU5URVJGQUNFX1RZUEU9dGhpcy5jb25zdHJ1Y3Rvci5jbWRJbnRlcmZhY2VfSU5URVJGQUNFX1RZUEU7XG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgLy8gc2VjdGlvbjo6ZW50cnkgcG9pbnRcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICB0aGlzLl9jb25uZWN0VHlwZT1jb25uZWN0X3R5cGU7XG4gICAgICAgIHRoaXMuX0tNQ29tPWttY29tO1xuXG4gICAgICAgIC8v5YaF6YOo44Kk44OZ44Oz44OI44OQ44Kk44Oz44OJXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uSW5pdD0oY29ubmVjdG9yKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5pbml0LGNvbm5lY3Rvci5kZXZpY2VJbmZvKTsvL+ODh+ODkOOCpOOCueaDheWgseOCkui/lOOBmVxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9LTUNvbS5vbkNvbm5lY3Q9KGNvbm5lY3Rvcik9PntcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUuY29ubmVjdCxjb25uZWN0b3IuZGV2aWNlSW5mbyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX0tNQ29tLm9uRGlzY29ubmVjdD0oY29ubmVjdG9yKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5kaXNjb25uZWN0LGNvbm5lY3Rvci5kZXZpY2VJbmZvKTtcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fS01Db20ub25Db25uZWN0RmFpbHVyZT0oY29ubmVjdG9yLCBlcnIpPT57XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLmNvbm5lY3RGYWlsdXJlLGNvbm5lY3Rvci5kZXZpY2VJbmZvLGVycik7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zlm57ou6Lmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIHtLTVJvdFN0YXRlfSByb3RTdGF0ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fS01Db20ub25Nb3Rvck1lYXN1cmVtZW50PShyb3RTdGF0ZSk9PntcbiAgICAgICAgICAgIC8vbGV0IHJvdFN0YXRlPW5ldyBLTVN0cnVjdHVyZXMuS01Sb3RTdGF0ZShyZXMucG9zaXRpb24scmVzLnZlbG9jaXR5LHJlcy50b3JxdWUpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5tb3Rvck1lYXN1cmVtZW50LHJvdFN0YXRlKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvElNVeaDheWgseWPl+S/oVxuICAgICAgICAgKiBAcGFyYW0ge0tNSW11U3RhdGV9IGltdVN0YXRlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9LTUNvbS5vbkltdU1lYXN1cmVtZW50PShpbXVTdGF0ZSk9PntcbiAgICAgICAgICAgIC8vbGV0IGltdVN0YXRlPW5ldyBLTVN0cnVjdHVyZXMuS01JbXVTdGF0ZShyZXMuYWNjZWxYLHJlcy5hY2NlbFkscmVzLmFjY2VsWixyZXMudGVtcCxyZXMuZ3lyb1gscmVzLmd5cm9ZLHJlcy5neXJvWik7XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLmltdU1lYXN1cmVtZW50LGltdVN0YXRlKTtcbiAgICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvOODreOCsOaDheWgseWPluW+l1xuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gY21kSURcbiAgICAgICAgICogQHBhcmFtIHtLTU1vdG9yTG9nfSBtb3RvckxvZ1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fS01Db20ub25Nb3RvckxvZz0obW90b3JMb2cpPT57XG4gICAgICAgICAgICAvL+OCs+ODnuODs+ODiUlE44GL44KJ44Kz44Oe44Oz44OJ5ZCN44KS5Y+W5b6X6L+95YqgXG4gICAgICAgICAgICBsZXQgY21kTmFtZT10aGlzLl9SRVZfTU9UT1JfQ09NTUFORFttb3RvckxvZy5jbWRJRF0/dGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbbW90b3JMb2cuY21kSURdOm1vdG9yTG9nLmNtZElEO1xuICAgICAgICAgICAgbW90b3JMb2cuY21kTmFtZT1jbWROYW1lO1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5tb3RvckxvZyxtb3RvckxvZyk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvOioreWumuaDheWgseWPluW+l1xuICAgICAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVnaXN0ZXJDbWRcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHJlc1xuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fS01Db20ub25Nb3RvclNldHRpbmc9KHJlZ2lzdGVyQ21kLCByZXMpPT57XG4gICAgICAgICAgICBfS01Ob3RpZnlQcm9taXMuc2VuZEdyb3VwTm90aWZ5UmVzb2x2ZSh0aGlzLl9ub3RpZnlQcm9taXNMaXN0LHJlZ2lzdGVyQ21kLHJlcyk7XG4gICAgICAgIH07XG5cbiAgICB9XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog44OX44Ot44OR44OG44KjXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBqOOBruaOpee2muOBjOacieWKueOBi1xuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtib29sZWFufVxuICAgICAqL1xuICAgIGdldCBpc0Nvbm5lY3QoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuX0tNQ29tLmRldmljZUluZm8uaXNDb25uZWN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDmjqXntprmlrnlvI9cbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7S01Nb3RvckNvbW1hbmRLTU9uZS5LTV9DT05ORUNUX1RZUEV9XG4gICAgICovXG4gICAgZ2V0IGNvbm5lY3RUeXBlKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9jb25uZWN0VHlwZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg4fjg5DjgqTjgrnmg4XloLFcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7S01EZXZpY2VJbmZvfVxuICAgICAqL1xuICAgIGdldCBkZXZpY2VJbmZvKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9LTUNvbS5kZXZpY2VJbmZvO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOWQjVxuICAgICAqIEByZXR1cm5zIHsqfVxuICAgICAqL1xuICAgIGdldCBuYW1lKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9LTUNvbS5kZXZpY2VJbmZvP3RoaXMuX0tNQ29tLmRldmljZUluZm8ubmFtZTpudWxsO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICog5o6l57aa44Kz44ON44Kv44K/44O8XG4gICAgICogQHByaXZhdGVcbiAgICAgKiBAdHlwZSB7S01Db21CYXNlfVxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBnZXQgY29ubmVjdG9yKCl7XG4gICAgICAgIHJldHVybiAgdGhpcy5fS01Db207XG4gICAgfVxuXG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogc2VjdGlvbjo644Oi44O844K/44O844Kz44Oe44Oz44OJIGh0dHBzOi8vZG9jdW1lbnQua2VpZ2FuLW1vdG9yLmNvbS9tb3Rvci1jb250cm9sLWNvbW1hbmQvbW90b3JfYWN0aW9uLmh0bWxcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zli5XkvZzjgpLkuI3oqLHlj6/jgajjgZnjgovvvIjkuIrkvY3lkb3ku6TvvIlcbiAgICAgKiBAZGVzYyDlronlhajnlKjvvJrjgZPjga7lkb3ku6TjgpLlhaXjgozjgovjgajjg6Ljg7zjgr/jg7zjga/li5XkvZzjgZfjgarjgYQ8YnI+XG4gICAgICog44Kz44Oe44Oz44OJ44Gv44K/44K544Kv44K744OD44OI44Gr6KiY6Yyy44GZ44KL44GT44Go44Gv5LiN5Y+vXG4gICAgICovXG4gICAgY21kRGlzYWJsZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZGlzYWJsZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O85YuV5L2c44KS6Kix5Y+v44GZ44KL77yI5LiK5L2N5ZG95Luk77yJXG4gICAgICogQGRlc2Mg5a6J5YWo55So77ya44GT44Gu5ZG95Luk44KS5YWl44KM44KL44Go44Oi44O844K/44O844Gv5YuV5L2c5Y+v6IO944Go44Gq44KLPGJyPlxuICAgICAqIOODouODvOOCv+ODvOi1t+WLleaZguOBryBkaXNhYmxlIOeKtuaFi+OBruOBn+OCgeOAgeacrOOCs+ODnuODs+ODieOBp+WLleS9nOOCkuioseWPr+OBmeOCi+W/heimgeOBjOOBguOCijxicj5cbiAgICAgKiDjgrPjg57jg7Pjg4njga/jgr/jgrnjgq/jgrvjg4Pjg4jjgavoqJjpjLLjgZnjgovjgZPjgajjga/kuI3lj69cbiAgICAgKlxuICAgICAqL1xuICAgIGNtZEVuYWJsZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW5hYmxlKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6YCf5bqm44Gu5aSn44GN44GV44KS44K744OD44OI44GZ44KL77yI5Y2Y5L2N57O777yaUlBN77yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkX3JwbSBmbG9hdCAgWzAtWCBycG1d44CAKOato+OBruaVsClcbiAgICAgKi9cbiAgICBjbWRTcGVlZF9ycG0oc3BlZWRfcnBtID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkX3JwbSowLjEwNDcxOTc1NTExOTY1OTc3LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWQsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6YCf5bqm44Gu5aSn44GN44GV44KS44K744OD44OI44GZ44KL77yI5Y2Y5L2N57O777ya44Op44K444Ki44Oz77yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIGZsb2F0IOmAn+W6puOBruWkp+OBjeOBlSDljZjkvY3vvJrop5LluqbvvIjjg6njgrjjgqLjg7PvvIkv56eSIFswLVggcnBzXeOAgCjmraPjga7mlbApXG4gICAgICovXG4gICAgY21kU3BlZWQoc3BlZWQgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOS9jee9ruOBruODl+ODquOCu+ODg+ODiOOCkuihjOOBhu+8iOWOn+eCueioreWumu+8ie+8iOWNmOS9jeezu++8muODqeOCuOOCouODs++8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBmbG9hdCDntbblr77op5LluqbvvJpyYWRpYW5zXG4gICAgICovXG4gICAgY21kUHJlc2V0UG9zaXRpb24ocG9zaXRpb24gPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoS01VdGwudG9OdW1iZXIocG9zaXRpb24pLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wcmVzZXRQb3NpdGlvbixidWZmZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDkvY3nva7jga7jg5fjg6rjgrvjg4Pjg4jjgavplqLjgZnjgotPRkZTRVTph49cbiAgICAgKiBAZGVzYyDkvY3nva7jga7jgqrjg5Xjgrvjg4Pjg4jph4/vvIhwcmVzZXRQb3NpdGlvbuOBp+ioreWumuOBl+OBn+WApOOBq+WvvuW/nO+8ieOCkuiqreOBv+WPluOCi1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlPGludHxBcnJheT59XG4gICAgICovXG4gICAgY21kUmVhZFBvc2l0aW9uT2Zmc2V0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZFJlYWRSZWdpc3Rlcih0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWRQb3NpdGlvbk9mZnNldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5q2j5Zue6Lui44GZ44KL77yI5Y+N5pmC6KiI5Zue44KK77yJXG4gICAgICogQGRlc2MgY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44Gn44CB5q2j5Zue6LuiXG4gICAgICovXG4gICAgY21kUnVuRm9yd2FyZCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucnVuRm9yd2FyZCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6YCG5Zue6Lui44GZ44KL77yI5pmC6KiI5Zue44KK77yJXG4gICAgICogQGRlc2MgY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44Gn44CB6YCG5Zue6LuiXG4gICAgICovXG4gICAgY21kUnVuUmV2ZXJzZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucnVuUmV2ZXJzZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg57W25a++5L2N572u44Gr56e75YuV44GZ44KLXG4gICAgICogQGRlc2Mg6YCf44GV44GvIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBjOaOoeeUqOOBleOCjOOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBwb3NpdGlvbiBmbG9hdCDop5LluqbvvJpyYWRpYW5zXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIGZsb2F0IOmAn+W6puOBruWkp+OBjeOBlSDljZjkvY3vvJrop5LluqbvvIjjg6njgrjjgqLjg7PvvIkv56eSIFswLVggcnBzXeOAgCjmraPjga7mlbApXG4gICAgICovXG4gICAgY21kTW92ZVRvUG9zaXRpb24ocG9zaXRpb24sc3BlZWQ9bnVsbCl7XG4gICAgICAgIGlmKHBvc2l0aW9uPT09IHVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgaWYoc3BlZWQhPT1udWxsKXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoOCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChwb3NpdGlvbiwxMCkpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMig0LHBhcnNlRmxvYXQoc3BlZWQsMTApKTtcbiAgICAgICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlVG9Qb3NpdGlvblNwZWVkLGJ1ZmZlcik7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KHBvc2l0aW9uLDEwKSk7XG4gICAgICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZVRvUG9zaXRpb24sYnVmZmVyKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOebuOWvvuS9jee9ruOBq+enu+WLleOBmeOCi1xuICAgICAqIEBkZXNjIOmAn+OBleOBryBjbWRTcGVlZCDjgafkv53lrZjjgZXjgozjgZ/pgJ/luqbjgYzmjqHnlKjjgZXjgozjgotcbiAgICAgKiBAcGFyYW0gIHtudW1iZXJ9IGRpc3RhbmNlIGZsb2F0IOinkuW6pu+8mnJhZGlhbnNb5bemOityYWRpYW5zIOWPszotcmFkaWFuc11cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWQgZmxvYXQg6YCf5bqm44Gu5aSn44GN44GVIOWNmOS9je+8muinkuW6pu+8iOODqeOCuOOCouODs++8iS/np5IgWzAtWCBycHNd44CAKOato+OBruaVsClcbiAgICAgKi9cbiAgICBjbWRNb3ZlQnlEaXN0YW5jZShkaXN0YW5jZSA9IDAsc3BlZWQ9bnVsbCl7XG4gICAgICAgIGlmKHNwZWVkIT09bnVsbCl7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDgpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoZGlzdGFuY2UsMTApKTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoNCxwYXJzZUZsb2F0KHNwZWVkLDEwKSk7XG4gICAgICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZUJ5RGlzdGFuY2VTcGVlZCxidWZmZXIpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChkaXN0YW5jZSwxMCkpO1xuICAgICAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVCeURpc3RhbmNlLGJ1ZmZlcik7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruWKseejgeOCkuWBnOatouOBmeOCi++8iOaEn+inpuOBr+aui+OCiuOBvuOBme+8iVxuICAgICAqIEBkZXNjIOWujOWFqOODleODquODvOeKtuaFi+OCkuWGjeePvuOBmeOCi+WgtOWQiOOBr+OAgSBjbWRGcmVlKCkuY21kRGlzYWJsZSgpIOOBqOOBl+OBpuS4i+OBleOBhOOAglxuICAgICAqL1xuICAgIGNtZEZyZWUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmZyZWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOCkumAn+W6puOCvOODreOBvuOBp+a4m+mAn+OBl+WBnOatouOBmeOCi1xuICAgICAqIEBkZXNjIHJwbSA9IDAg44Go44Gq44KL44CCXG4gICAgICovXG4gICAgY21kU3RvcCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcCk7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg4jjg6vjgq/liLblvqHjgpLooYzjgYZcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdG9ycXVlIGZsb2F0IOODiOODq+OCryDljZjkvY3vvJpO44O7bSBbLVggfiArIFggTm1dIOaOqOWlqOWApCAwLjMtMC4wNVxuICAgICAqIEBkZXNjIOmAn+W6puOChOS9jee9ruOCkuWQjOaZguOBq+WItuW+oeOBmeOCi+WgtOWQiOOBr+OAgeODouODvOOCv+ODvOioreWumuOBriAweDBFOiBtYXhUb3JxdWUg44GoIDB4NjA6IHJ1bkZvcndhcmQg562J44KS5L2155So44GX44Gm5LiL44GV44GE44CCXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRIb2xkVG9ycXVlKHRvcnF1ZSl7XG4gICAgICAgIGlmKHRvcnF1ZT09PXVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQodG9ycXVlLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5ob2xkVG9ycXVlLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6KiY5oa244GX44Gf44K/44K544Kv77yI5ZG95Luk77yJ44Gu44K744OD44OI44KS5a6f6KGM44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjgr/jgrnjgq/jgrvjg4Pjg4jnlarlj7fvvIgw772eNjU1MzXvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVwZWF0aW5nIGludCDnubDjgorov5TjgZflm57mlbAgMOOBr+eEoeWItumZkFxuICAgICAqXG4gICAgICogQGRlc2MgS00tMSDjga8gaW5kZXg6IDB+NDkg44G+44Gn44CC77yINTDlgIvjga7jg6Hjg6Ljg6rjg5Djg7Pjgq8g5ZCEODEyOCBCeXRlIOOBvuOBp+WItumZkOOBguOCiu+8iTxicj5cbiAgICAgKiDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLjga/jgIHjgrPjg57jg7Pjg4nvvIjjgr/jgrnjgq/jgrvjg4Pjg4jvvInjgpLlj4LnhafkuIvjgZXjgYTjgIIgaHR0cHM6Ly9kb2N1bWVudC5rZWlnYW4tbW90b3IuY29tL21vdG9yLWNvbnRyb2wtY29tbWFuZC90YXNrc2V0Lmh0bWxcbiAgICAgKi9cbiAgICBjbWRTdGFydERvaW5nVGFza3NldChpbmRleCA9IDAscmVwZWF0aW5nID0gMSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMixNYXRoLmFicyhwYXJzZUludChyZXBlYXRpbmcsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdGFydERvaW5nVGFza3NldCxidWZmZXIpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgr/jgrnjgq/jgrvjg4Pjg4jjgpLlgZzmraJcbiAgICAgKiBAZGVzYyDjgr/jgrnjgq/jgrvjg4Pjg4jjga7lho3nlJ/jgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRTdG9wRG9pbmdUYXNrc2V0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdG9wRG9pbmdUYXNrc2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgrfjg6fjg7PjgpLlho3nlJ/vvIjmupblgpnjgarjgZfvvIlcbiAgICAgKiBAZGVzYyDjg6Ljg7zjgrfjg6fjg7Pjga7jg5fjg6zjgqTjg5Djg4Pjgq/jgpLvvIjmupblgpnjgarjgZfjgafvvInjg5fjg6zjgqTjg5Djg4Pjgq/plovlp4vjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOODouODvOOCt+ODp+ODs+eVquWPt++8iDDvvZ42NTUzNe+8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZXBlYXRpbmcgaW50IOe5sOOCiui/lOOBl+WbnuaVsCAw44Gv54Sh5Yi26ZmQXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLmNtZFByZXBhcmVQbGF5YmFja01vdGlvbl9TVEFSVF9QT1NJVElPTn0gc3RhcnRfcG9zaXRpb24gaW50IOOCueOCv+ODvOODiOS9jee9ruOBruioreWumjxicj5cbiAgICAgKiBTVEFSVF9QT1NJVElPTl9BQlM66KiY5oa244GV44KM44Gf6ZaL5aeL5L2N572u77yI57W25a++5bqn5qiZ77yJ44GL44KJ44K544K/44O844OIPGJyPlxuICAgICAqIFNUQVJUX1BPU0lUSU9OX0NVUlJFTlQ654++5Zyo44Gu5L2N572u44KS6ZaL5aeL5L2N572u44Go44GX44Gm44K544K/44O844OIXG4gICAgICovXG4gICAgY21kU3RhcnRQbGF5YmFja01vdGlvbihpbmRleCA9IDAscmVwZWF0aW5nID0gMCxzdGFydF9wb3NpdGlvbiA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDcpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDIsTWF0aC5hYnMocGFyc2VJbnQocmVwZWF0aW5nLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCg2LE1hdGguYWJzKHBhcnNlSW50KHN0YXJ0X3Bvc2l0aW9uLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnRQbGF5YmFja01vdGlvbixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCt+ODp+ODs+WGjeeUn+OCkuWBnOatouOBmeOCi1xuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBjbWRTdG9wUGxheWJhY2tNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3BQbGF5YmFja01vdGlvbik7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIHNlY3Rpb246OuOCreODpeODvOaTjeS9nFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgq3jg6Xjg7zjgpLkuIDmmYLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRQYXVzZVF1ZXVlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5wYXVzZVF1ZXVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgq3jg6Xjg7zjgpLlho3plovjgZnjgovvvIjok4TnqY3jgZXjgozjgZ/jgr/jgrnjgq/jgpLlho3plovvvIlcbiAgICAgKi9cbiAgICBjbWRSZXN1bWVRdWV1ZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzdW1lUXVldWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCreODpeODvOOCkuaMh+WumuaZgumWk+WBnOatouOBl+WGjemWi+OBmeOCi1xuICAgICAqIEBkZXNjIGNtZFBhdXNl77yI44Kt44Ol44O85YGc5q2i77yJ44KS5a6f6KGM44GX44CB5oyH5a6a5pmC6ZaT77yI44Of44Oq56eS77yJ57WM6YGO5b6M44CB6Ieq5YuV55qE44GrIGNtZFJlc3VtZe+8iOOCreODpeODvOWGjemWi++8iSDjgpLooYzjgYTjgb7jgZnjgIJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZSDlgZzmraLmmYLplpNbbXNlY11cbiAgICAgKi9cbiAgICBjbWRXYWl0UXVldWUodGltZSA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMCxNYXRoLmFicyhwYXJzZUludCh0aW1lLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQud2FpdFF1ZXVlLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Kt44Ol44O844KS44Oq44K744OD44OI44GZ44KLXG4gICAgICovXG4gICAgY21kUmVzZXRRdWV1ZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzZXRRdWV1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu54q25oWL44KS6Kqt44G/5Y+W44KLIO+8iHJlYWTlsILnlKjvvIlcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxpbnR8QXJyYXk+fVxuICAgICAqL1xuICAgIGNtZFJlYWRTdGF0dXMoKXtcbiAgICAgICAgcmV0dXJuIHRoaXMuY21kUmVhZFJlZ2lzdGVyKHRoaXMuX01PVE9SX0NPTU1BTkQucmVhZFN0YXR1cyk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIHNlY3Rpb246OuOCv+OCueOCr+OCu+ODg+ODiFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCv+OCueOCr++8iOWRveS7pO+8ieOBruOCu+ODg+ODiOOBruiomOmMsuOCkumWi+Wni+OBmeOCi1xuICAgICAqIEBkZXNjIOiomOaGtuOBmeOCi+OCpOODs+ODh+ODg+OCr+OCueOBruODoeODouODquOBr+OCs+ODnuODs+ODie+8mmVyYXNlVGFza3NldCDjgavjgojjgorkuojjgoHmtojljrvjgZXjgozjgabjgYTjgovlv4XopoHjgYzjgYLjgopcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuSBLTS0xIOOBruWgtOWQiOOAgeOCpOODs+ODh+ODg+OCr+OCueOBruWApOOBryAw772eNDkg77yI6KiINTDlgIvoqJjpjLLvvIlcbiAgICAgKi9cbiAgICBjbWRTdGFydFJlY29yZGluZ1Rhc2tTZXQoaW5kZXggPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdGFydFJlY29yZGluZ1Rhc2tzZXQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLjgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRTdG9wUmVjb3JkaW5nVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcFJlY29yZGluZ1Rhc2tzZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOaMh+WumuOBruOCpOODs+ODh+ODg+OCr+OCueOBruOCv+OCueOCr+OCu+ODg+ODiOOCkua2iOWOu+OBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBpbnQg44Kk44Oz44OH44OD44Kv44K5XG4gICAgICovXG4gICAgY21kRXJhc2VUYXNrc2V0KGluZGV4ID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZXJhc2VUYXNrc2V0LGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu44K/44K544Kv44K744OD44OI44KS5raI5Y6744GZ44KLXG4gICAgICovXG4gICAgY21kRXJhc2VBbGxUYXNrc2V0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZUFsbFRhc2tzZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuWQjeioreWumlxuICAgICAqIEBkZXNjIOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuWQjeOCkuioreWumuOBmeOCi+OAgu+8iOOBk+OCjOOBi+OCieiomOmMsuOBmeOCi+OCguOBruOBq+WvvuOBl+OBpu+8iVxuICAgICAqL1xuICAgIGNtZFNldFRhc2tzZXROYW1lKG5hbWUpe1xuICAgICAgICBsZXQgYnVmZmVyPSAobmV3IFVpbnQ4QXJyYXkoW10ubWFwLmNhbGwobmFtZSwgZnVuY3Rpb24oYykge1xuICAgICAgICAgICAgcmV0dXJuIGMuY2hhckNvZGVBdCgwKTtcbiAgICAgICAgfSkpKS5idWZmZXI7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zZXRUYXNrc2V0TmFtZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBzZWN0aW9uOjrjg4bjgqPjg7zjg4Hjg7PjgrBcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OA44Kk44Os44Kv44OI44OG44Kj44O844OB44Oz44Kw6ZaL5aeL77yI5rqW5YKZ44Gq44GX77yJXG4gICAgICogQGRlc2MgS00tMSDjga7loLTlkIjjgIHjgqTjg7Pjg4fjg4Pjgq/jgrnjga7lgKTjga8gMO+9njE5IO+8iOioiDIw5YCL6KiY6Yyy77yJ44Go44Gq44KL44CC6KiY6Yyy5pmC6ZaT44GvIDY1NDA4IFttc2VjXSDjgpLotoXjgYjjgovjgZPjgajjga/jgafjgY3jgarjgYRcbiAgICAgKiAgICAgICDoqJjmhrbjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjga7jg6Hjg6Ljg6rjga9ibGVFcmFzZU1vdGlvbiDjgavjgojjgorkuojjgoHmtojljrvjgZXjgozjgabjgYTjgovlv4XopoHjgYzjgYLjgotcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBpbnQg44Kk44Oz44OH44OD44Kv44K5IFswLTE5XVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0aW1lIGludCDoqJjpjLLmmYLplpMgW21zZWMgMC02NTQwOF1cbiAgICAgKi9cbiAgICBjbWRTdGFydFRlYWNoaW5nTW90aW9uKGluZGV4ID0gMCxsZW5ndGhSZWNvcmRpbmdUaW1lID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMixNYXRoLmFicyhwYXJzZUludChsZW5ndGhSZWNvcmRpbmdUaW1lLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnRUZWFjaGluZ01vdGlvbixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWun+ihjOS4reOBruODhuOCo+ODvOODgeODs+OCsOOCkuWBnOatouOBmeOCi1xuICAgICAqL1xuICAgIGNtZFN0b3BUZWFjaGluZ01vdGlvbigpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcFRlYWNoaW5nTW90aW9uKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjgZfjgZ/jgqTjg7Pjg4fjg4Pjgq/jgrnjga7jg6Ljg7zjgrfjg6fjg7PjgpLmtojljrvjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAqXG4gICAgICogQGRlc2MgS00tMSDjga7loLTlkIjjgIHjgqTjg7Pjg4fjg4Pjgq/jgrnjga7lgKTjga8gMO+9njE5IO+8iOioiDIw5YCL6KiY6Yyy77yJ44Go44Gq44KLXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRFcmFzZU1vdGlvbihpbmRleCA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlTW90aW9uLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu44Oi44O844K344On44Oz44KS5raI5Y6744GZ44KLXG4gICAgICovXG4gICAgY21kRXJhc2VBbGxNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlQWxsTW90aW9uKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo6TEVEXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IExFROOBrueCueeBr+eKtuaFi+OCkuOCu+ODg+ODiOOBmeOCi1xuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRMZWRfTEVEX1NUQVRFfSBjbWRMZWRfTEVEX1NUQVRFIGludCDngrnnga/nirbmhYs8YnI+XG4gICAgICogICBMRURfU1RBVEVfT0ZGOkxFROa2iOeBrzxicj5cbiAgICAgKiAgIExFRF9TVEFURV9PTl9TT0xJRDpMRUTngrnnga88YnI+XG4gICAgICogICBMRURfU1RBVEVfT05fRkxBU0g6TEVE54K55ruF77yI5LiA5a6a6ZaT6ZqU44Gn54K55ruF77yJPGJyPlxuICAgICAqICAgTEVEX1NUQVRFX09OX0RJTTpMRUTjgYzjgobjgaPjgY/jgormmI7mu4XjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVkIGludCAwLTI1NVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBncmVlbiBpbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYmx1ZSBpbnQgMC0yNTVcbiAgICAgKi9cbiAgICBjbWRMZWQoY21kTGVkX0xFRF9TVEFURSxyZWQsZ3JlZW4sYmx1ZSl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsTWF0aC5hYnMocGFyc2VJbnQoY21kTGVkX0xFRF9TVEFURSwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxNYXRoLmFicyhwYXJzZUludChjbWRMZWRfTEVEX1NUQVRFLDEwKSkpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgxLE1hdGguYWJzKHBhcnNlSW50KHJlZCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMixNYXRoLmFicyhwYXJzZUludChncmVlbiwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMyxNYXRoLmFicyhwYXJzZUludChibHVlLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubGVkLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIElNVSDjgrjjg6PjgqTjg61cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBJTVUo44K444Oj44Kk44OtKeOBruWApOWPluW+lyjpgJrnn6Up44KS6ZaL5aeL44GZ44KLIChCTEXlsILnlKjjgrPjg57jg7Pjg4kpXG4gICAgICogQGRlc2Mg5pys44Kz44Oe44Oz44OJ44KS5a6f6KGM44GZ44KL44Go44CBSU1V44Gu44OH44O844K/44GvQkxF44Gu44Kt44Oj44Op44Kv44K/44Oq44K544OG44Kj44Kv44K5TU9UT1JfSU1VX01FQVNVUkVNRU5U44Gr6YCa55+l44GV44KM44KLPGJyPlxuICAgICAqIE1PVE9SX0lNVV9NRUFTVVJFTUVOVOOBrm5vdGlmeeOBr+OCpOODmeODs+ODiOOCv+OCpOODlyBLTU1vdG9yQ29tbWFuZEtNT25lLkVWRU5UX1RZUEUuaW11TWVhc3VyZW1lbnQg44Gr6YCa55+lXG4gICAgICovXG4gICAgY21kRW5hYmxlSU1VTWVhc3VyZW1lbnQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVuYWJsZUlNVU1lYXN1cmVtZW50KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBJTVUo44K444Oj44Kk44OtKeOBruWApOWPluW+lyjpgJrnn6Up44KS5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kRGlzYWJsZUlNVU1lYXN1cmVtZW50KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5kaXNhYmxlSU1VTWVhc3VyZW1lbnQpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBJTVUg44Oi44O844K/44O8XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrua4rOWumuWApO+8iOS9jee9ruODu+mAn+W6puODu+ODiOODq+OCr++8ieWHuuWKm+OCkumWi+Wni+OBmeOCi1xuICAgICAqIEBkZXNjIOODh+ODleOCqeODq+ODiOOBp+OBr+ODouODvOOCv+ODvOi1t+WLleaZgm9u44CCIG1vdG9yTWVhc3VyZW1lbnRCeURlZmF1bHQoKSDlj4LnhadcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgY21kRW5hYmxlTW90b3JNZWFzdXJlbWVudCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW5hYmxlTW90b3JNZWFzdXJlbWVudCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrua4rOWumuWApO+8iOS9jee9ruODu+mAn+W6puODu+ODiOODq+OCr++8ieWHuuWKm+OCkuWBnOatouOBmeOCi1xuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBjbWREaXNhYmxlTW90b3JNZWFzdXJlbWVudCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZGlzYWJsZU1vdG9yTWVhc3VyZW1lbnQpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyDjgrfjgrnjg4bjg6BcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44K344K544OG44Og44KS5YaN6LW35YuV44GZ44KLXG4gICAgICogQGRlc2MgQkxF44Gr5o6l57aa44GX44Gm44GE44Gf5aC05ZCI44CB5YiH5pat44GX44Gm44GL44KJ5YaN6LW35YuVXG4gICAgICovXG4gICAgY21kUmVib290KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZWJvb3QpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg4Hjgqfjg4Pjgq/jgrXjg6DvvIhDUkMxNikg5pyJ5Yq55YyWXG4gICAgICogQGRlc2Mg44Kz44Oe44Oz44OJ77yI44K/44K544Kv77yJ44Gu44OB44Kn44OD44Kv44K144Og44KS5pyJ5Yq55YyW44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGlzRW5hYmxlZCAwOkRpc2JsZWQsIDE6RW5hYmxlZFxuICAgICAqL1xuICAgIGNtZEVuYWJsZUNoZWNrU3VtKGlzRW5hYmxlZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsaXNFbmFibGVkPzE6MCk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lbmFibGVDaGVja1N1bSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODleOCoeODvOODoOOCpuOCp+OCouOCouODg+ODl+ODh+ODvOODiOODouODvOODieOBq+WFpeOCi1xuICAgICAqIEBkZXNjIOODleOCoeODvOODoOOCpuOCp+OCouOCkuOCouODg+ODl+ODh+ODvOODiOOBmeOCi+OBn+OCgeOBruODluODvOODiOODreODvOODgOODvOODouODvOODieOBq+WFpeOCi+OAgu+8iOOCt+OCueODhuODoOOBr+WGjei1t+WLleOBleOCjOOCi+OAgu+8iVxuICAgICAqL1xuICAgIGNtZEVudGVyRGV2aWNlRmlybXdhcmVVcGRhdGUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVudGVyRGV2aWNlRmlybXdhcmVVcGRhdGUpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyDjg6Ljg7zjgr/jg7zoqK3lrprjgIBNT1RPUl9TRVRUSU5HXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruacgOWkp+mAn+OBleOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhTcGVlZCBmbG9hdCDmnIDlpKfpgJ/jgZUgW3JhZGlhbiAvIHNlY29uZF3vvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRNYXhTcGVlZChtYXhTcGVlZCl7XG4gICAgICAgIGlmKG1heFNwZWVkPT09dW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChtYXhTcGVlZCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1heFNwZWVkLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5pyA5bCP6YCf44GV44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1heFNwZWVkIGZsb2F0IOacgOWwj+mAn+OBlSBbcmFkaWFuIC8gc2Vjb25kXe+8iOato+OBruWApO+8iVxuICAgICAqIEBkZXNjIG1pblNwZWVkIOOBr+OAgWJsZVByZXBhcmVQbGF5YmFja01vdGlvbiDlrp/ooYzjga7pmpvjgIHplovlp4vlnLDngrnjgavnp7vli5XjgZnjgovpgJ/jgZXjgajjgZfjgabkvb/nlKjjgZXjgozjgovjgILpgJrluLjmmYLpgYvou6Ljgafjga/kvb/nlKjjgZXjgozjgarjgYTjgIJcbiAgICAgKi9cbiAgICBjbWRNaW5TcGVlZChtaW5TcGVlZCl7XG4gICAgICAgIGlmKG1pblNwZWVkPT09dW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChtaW5TcGVlZCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1pblNwZWVkLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5Yqg5rib6YCf5puy57ea44KS5oyH5a6a44GZ44KL77yI44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844Or44Gu6Kit5a6a77yJXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLmNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFfSBjbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRSBpbnQg5Yqg5rib6YCf44Kr44O844OW44Kq44OX44K344On44OzPGJyPlxuICAgICAqICAgICAgQ1VSVkVfVFlQRV9OT05FOjAg44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9GRjxicj5cbiAgICAgKiAgICAgIENVUlZFX1RZUEVfVFJBUEVaT0lEOjEg44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9OIO+8iOWPsOW9ouWKoOa4m+mAn++8iVxuICAgICAqL1xuICAgIGNtZEN1cnZlVHlwZShjbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRSA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLE1hdGguYWJzKHBhcnNlSW50KGNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuY3VydmVUeXBlLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5Yqg6YCf5bqm44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFjYyBmbG9hdCDliqDpgJ/luqYgMC0yMDAgW3JhZGlhbiAvIHNlY29uZF4yXe+8iOato+OBruWApO+8iVxuICAgICAqIEBkZXNjIGFjYyDjga/jgIHjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT04g44Gu5aC05ZCI44CB5Yqg6YCf5pmC44Gr5L2/55So44GV44KM44G+44GZ44CC77yI5Yqg6YCf5pmC44Gu55u057ea44Gu5YK+44GN77yJXG4gICAgICovXG4gICAgY21kQWNjKGFjYyA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChhY2MsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5hY2MsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7muJvpgJ/luqbjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVjIGZsb2F0IOa4m+mAn+W6piAwLTIwMCBbcmFkaWFuIC8gc2Vjb25kXjJd77yI5q2j44Gu5YCk77yJXG4gICAgICogQGRlc2MgZGVjIOOBr+OAgeODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPTiDjga7loLTlkIjjgIHmuJvpgJ/mmYLjgavkvb/nlKjjgZXjgozjgb7jgZnjgILvvIjmuJvpgJ/mmYLjga7nm7Tnt5rjga7lgr7jgY3vvIlcbiAgICAgKi9cbiAgICBjbWREZWMoZGVjID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KGRlYywxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmRlYyxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruacgOWkp+ODiOODq+OCr++8iOe1tuWvvuWApO+8ieOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhUb3JxdWUgZmxvYXQg5pyA5aSn44OI44Or44KvIFtOKm1d77yI5q2j44Gu5YCk77yJXG4gICAgICpcbiAgICAgKiBAZGVzYyBtYXhUb3JxdWUg44KS6Kit5a6a44GZ44KL44GT44Go44Gr44KI44KK44CB44OI44Or44Kv44Gu57W25a++5YCk44GMIG1heFRvcnF1ZSDjgpLotoXjgYjjgarjgYTjgojjgYbjgavpgYvou6LjgZfjgb7jgZnjgII8YnI+XG4gICAgICogbWF4VG9ycXVlID0gMC4xIFtOKm1dIOOBruW+jOOBqyBydW5Gb3J3YXJkIO+8iOato+Wbnui7ou+8ieOCkuihjOOBo+OBn+WgtOWQiOOAgTAuMSBOKm0g44KS6LaF44GI44Gq44GE44KI44GG44Gr44Gd44Gu6YCf5bqm44KS44Gq44KL44Gg44GR57at5oyB44GZ44KL44CCPGJyPlxuICAgICAqIOOBn+OBoOOBl+OAgeODiOODq+OCr+OBruacgOWkp+WApOWItumZkOOBq+OCiOOCiuOAgeOCt+OCueODhuODoOOBq+OCiOOBo+OBpuOBr+WItuW+oeaAp++8iOaMr+WLle+8ieOBjOaCquWMluOBmeOCi+WPr+iDveaAp+OBjOOBguOCi+OAglxuICAgICAqXG4gICAgICovXG4gICAgY21kTWF4VG9ycXVlKG1heFRvcnF1ZSl7XG4gICAgICAgIGlmKG1heFRvcnF1ZT09PXVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQobWF4VG9ycXVlLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubWF4VG9ycXVlLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OA44Kk44Os44Kv44OI44OG44Kj44O844OB44Oz44Kw44Gu44K144Oz44OX44Oq44Oz44Kw6ZaT6ZqUXG4gICAgICogQGRlc2Mg44OG44Kj44O844OB44Oz44Kw44O744OX44Os44Kk44OQ44OD44Kv44Gu5a6f6KGM6ZaT6ZqUXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGludGVydmFsIG1z77yIMi0xMDAwICAwLCAxbXPjga/jgqjjg6njg7zjgajjgarjgovvvIlcbiAgICAgKi9cbiAgICBjbWRUZWFjaGluZ0ludGVydmFsKGludGVydmFsKXtcbiAgICAgICAgaWYoaW50ZXJ2YWw9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBfaW50ZXJ2YWw9TWF0aC5hYnMocGFyc2VJbnQoaW50ZXJ2YWwsMTApKTtcbiAgICAgICAgX2ludGVydmFsPV9pbnRlcnZhbDwxPzI6X2ludGVydmFsO1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMCxfaW50ZXJ2YWwpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQudGVhY2hpbmdJbnRlcnZhbCxidWZmZXIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDoqJjmhrblho3nlJ/mmYLjga7lho3nlJ/plpPpmpRcbiAgICAgKiBAZGVzYyAg6KiY5oa25YaN55Sf5pmC44Gu5YaN55Sf6ZaT6ZqUXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGludGVydmFsIG1z77yIMi0xMDAwICAwLCAxbXPjga/jgqjjg6njg7zjgajjgarjgovvvIlcbiAgICAgKi9cbiAgICBjbWRQbGF5YmFja0ludGVydmFsKGludGVydmFsKXtcbiAgICAgICAgaWYoaW50ZXJ2YWw9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQzMigwLE1hdGguYWJzKHBhcnNlSW50KGludGVydmFsLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucGxheWJhY2tJbnRlcnZhbCxidWZmZXIpO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrlDvvIjmr5TkvovvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcUN1cnJlbnRQIGZsb2F0IHHpm7vmtYFQ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUUN1cnJlbnRQKHFDdXJyZW50UCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHFDdXJyZW50UCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnFDdXJyZW50UCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5Q77yI5q+U5L6L77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHFDdXJyZW50SSBmbG9hdCBx6Zu75rWBSeOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFFDdXJyZW50SShxQ3VycmVudEkpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChxQ3VycmVudEksMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5xQ3VycmVudEksYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga5x6Lu46Zu75rWBUElE44Kz44Oz44OI44Ot44O844Op44GuRO+8iOW+ruWIhu+8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBxQ3VycmVudEQgZmxvYXQgcembu+a1gUTjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRRQ3VycmVudEQocUN1cnJlbnREKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQocUN1cnJlbnRELDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucUN1cnJlbnRELGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrkTvvIjlvq7liIbvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWRQIGZsb2F0IOmAn+W6plDjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRTcGVlZFAoc3BlZWRQKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWRQLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWRQLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu6YCf5bqmUElE44Kz44Oz44OI44Ot44O844Op44GuSe+8iOepjeWIhu+8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZEkgZmxvYXQg6YCf5bqmSeOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFNwZWVkSShzcGVlZEkpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChzcGVlZEksMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZEksYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7pgJ/luqZQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5E77yI5b6u5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkRCBmbG9hdCDpgJ/luqZE44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kU3BlZWREKHNwZWVkRCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkRCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNwZWVkRCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruS9jee9rlBJROOCs+ODs+ODiOODreODvOODqeOBrlDvvIjmr5TkvovvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb25QIGZsb2F0IOS9jee9rlDjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRQb3NpdGlvblAocG9zaXRpb25QKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQocG9zaXRpb25QLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucG9zaXRpb25QLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44GuUElE44OR44Op44Oh44O844K/44KS44Oq44K744OD44OI44GX44Gm44OV44Kh44O844Og44Km44Kn44Ki44Gu5Yid5pyf6Kit5a6a44Gr5oi744GZXG4gICAgICogQGRlc2MgcUN1cnJlbnRQLCBxQ3VycmVudEksICBxQ3VycmVudEQsIHNwZWVkUCwgc3BlZWRJLCBzcGVlZEQsIHBvc2l0aW9uUCDjgpLjg6rjgrvjg4Pjg4jjgZfjgb7jgZlcbiAgICAgKlxuICAgICAqL1xuICAgIGNtZFJlc2V0UElEKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZXNldFBJRCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O85ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqU6Kit5a6aXG4gICAgICogQGRlc2Mg5pyJ57ea77yIVVNCLCBJMkPvvInjga7jgb/mnInlirnjgIJCTEXjgafjga/lm7rlrpogMTAwbXMg6ZaT6ZqU44Gn6YCa55+l44GV44KM44KL44CCXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLmNtZE1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbF9NT1RPUl9NRUFTX0lOVEVSVkFMfSBjbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxfTU9UT1JfTUVBU19JTlRFUlZBTCBlbnVtIOODouODvOOCv+ODvOa4rOWumuWApOOBruWPluW+l+mWk+malFxuICAgICAqL1xuICAgIGNtZE1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbChjbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxfTU9UT1JfTUVBU19JTlRFUlZBTD00KXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxwYXJzZUludChjbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxfTU9UT1JfTUVBU19JTlRFUlZBTCwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW90b3JNZWFzdXJlbWVudEludGVydmFsLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O85ris5a6a5YCk44Gu5Y+W5b6X6Kit5a6aXG4gICAgICogQGRlc2MgaXNFbmFibGVkID0gMSDjga7loLTlkIjjgIHvvIjkvY3nva7jg7vpgJ/luqbjg7vjg4jjg6vjgq/vvInjga7pgJrnn6XjgpLooYzjgYbvvIjotbfli5XlvozjgIFpbnRlcmZhY2Ug44Gu6Kit5a6a44Gn5YSq5YWI44GV44KM44KL6YCa5L+h57WM6Lev44Gr44CB6Ieq5YuV55qE44Gr6YCa55+l44GM6ZaL5aeL44GV44KM44KL77yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGlzRW5hYmxlZCAwOkRpc2JsZWQsIDE6RW5hYmxlZFxuICAgICAqL1xuICAgIGNtZE1vdG9yTWVhc3VyZW1lbnRCeURlZmF1bHQoaXNFbmFibGVkKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxpc0VuYWJsZWQ/MTowKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdG9yTWVhc3VyZW1lbnRCeURlZmF1bHQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zliLblvqHmiYvmrrXvvIjjgqTjg7Pjgr/jg7zjg5XjgqfjgqTjgrnvvInjga7oqK3lrppcbiAgICAgKiBAZGVzYyB1aW50OF90IGZsYWdzIOODk+ODg+ODiOOBq+OCiOOCiuOAgeWQq+OBvuOCjOOCi+ODkeODqeODoeODvOOCv+OCkuaMh+WumuOBmeOCi++8iO+8keOBruWgtOWQiOWQq+OCgOODuzDjga7loLTlkIjlkKvjgb7jgarjgYTvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYml0RmxnXG4gICAgICogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICogYml0NyAgICBiaXQ2ICAgIGJpdDUgICAgYml0NCAgICBiaXQzICAgIGJpdDIgICAgYml0MSAgICBiaXQwXG4gICAgICog54mp55CGICAgICAgICAgICAgICAgICAgICAg5pyJ57eaICAgICDmnInnt5ogICAgICAgICAgICAgICAgICAgICAg54Sh57eaXG4gICAgICog44Oc44K/44OzICAgIO+8iiAgICAgIO+8iiAgICAgIEkyQyAgICAgVVNCICAgICAgIO+8iiAgICAgIO+8iiAgICAgQkxFXG4gICAgICog44OH44OV44Kp44Or44OIXHQgICAgICAgICAgICAg44OH44OV44Kp44Or44OIICDjg4fjg5Xjgqnjg6vjg4ggICAgICAgICAgICAgIOODh+ODleOCqeODq+ODiFxuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqL1xuICAgIGNtZEludGVyZmFjZShiaXRGbGcpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KGJpdEZsZywxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuaW50ZXJmYWNlLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu6LW35YuV5pmC5Zu65pyJTEVE44Kr44Op44O844KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJlZCBpbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZ3JlZW4gaW50IDAtMjU1XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJsdWUgaW50IDAtMjU1XG4gICAgICpcbiAgICAgKiBAZGVzYyBvd25Db2xvciDjga/jgqLjgqTjg4njg6vmmYLjga7lm7rmnIlMRUTjgqvjg6njg7zjgII8YnI+c2F2ZUFsbFNldHRpbmdz44KS5a6f6KGM44GX44CB5YaN6LW35YuV5b6M44Gr5Yid44KB44Gm5Y+N5pig44GV44KM44KL44CCPGJyPlxuICAgICAqIOOBk+OBruioreWumuWApOOCkuWkieabtOOBl+OBn+WgtOWQiOOAgUJMReOBriBEZXZpY2UgTmFtZSDjga7kuIsz5qGB44GM5aSJ5pu044GV44KM44KL44CCXG4gICAgICovXG4gICAgY21kT3duQ29sb3IocmVkLGdyZWVuLGJsdWUpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDMpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLE1hdGguYWJzKHBhcnNlSW50KHJlZCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMSxNYXRoLmFicyhwYXJzZUludChncmVlbiwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMixNYXRoLmFicyhwYXJzZUludChibHVlLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQub3duQ29sb3IsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDvvJbou7jjgrvjg7PjgrXjg7zvvIjliqDpgJ/luqbjg7vjgrjjg6PjgqTjg63vvInmuKzlrprlgKTjga7lj5blvpfplpPpmpRcbiAgICAgKiBAZGVzYyDmnInnt5rvvIhVU0IsIEkyQ++8ieOBruOBv+acieWKueOAgkJMReOBp+OBr+WbuuWumiAxMDBtcyDplpPpmpTjgafpgJrnn6XjgZXjgozjgovjgIJcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbF9JTVVfTUVBU19JTlRFUlZBTH0gY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbF9JTVVfTUVBU19JTlRFUlZBTCBlbnVtIOWKoOmAn+W6puODu+OCuOODo+OCpOODrea4rOWumuWApOOBruWPluW+l+mWk+malFxuICAgICAqL1xuICAgIGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWwoY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbF9JTVVfTUVBU19JTlRFUlZBTD00KXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxwYXJzZUludChjbWRJTVVNZWFzdXJlbWVudEludGVydmFsX0lNVV9NRUFTX0lOVEVSVkFMLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5pTVVNZWFzdXJlbWVudEludGVydmFsLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg77yW6Lu444K744Oz44K144O877yI5Yqg6YCf5bqm44O744K444Oj44Kk44Ot77yJ44Gu5YCk44Gu6YCa55+l44KS44OH44OV44Kp44Or44OI44Gn6ZaL5aeL44GZ44KLXG4gICAgICogQGRlc2MgaXNFbmFibGVkID0gdHJ1ZSDjga7loLTlkIjjgIFlbmFibGVJTVUoKSDjgpLpgIHkv6HjgZfjgarjgY/jgabjgoLotbfli5XmmYLjgavoh6rli5XjgafpgJrnn6XjgYzplovlp4vjgZXjgozjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaXNFbmFibGVkIDA6RGlzYmxlZCwgMTpFbmFibGVkXG4gICAgICovXG4gICAgY21kSU1VTWVhc3VyZW1lbnRCeURlZmF1bHQoaXNFbmFibGVkKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxwYXJzZUludChpc0VuYWJsZWQsMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmlNVU1lYXN1cmVtZW50QnlEZWZhdWx0LGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5oyH5a6a44GX44Gf6Kit5a6a5YCk44KS5Y+W5b6XIChCTEXlsILnlKjjgrPjg57jg7Pjg4kpXG4gICAgICogQHBhcmFtIHtudW1iZXIgfCBhcnJheX0gcmVnaXN0ZXJzIDxpbnQgfCBbXT4g5Y+W5b6X44GZ44KL44OX44Ot44OR44OG44Kj44Gu44Kz44Oe44Oz44OJKOODrOOCuOOCueOCv+eVquWPtynlgKRcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZS48aW50IHwgYXJyYXk+fSDlj5blvpfjgZfjgZ/lgKQgPGJyPnJlZ2lzdGVyc+OBjGludD3jg6zjgrjjgrnjgr/lgKTjga7jg5fjg6rjg5/jg4bjgqPjg5blgKQgPGJyPnJlZ2lzdGVyc+OBjEFycmF5PeODrOOCuOOCueOCv+WApOOBruOCquODluOCuOOCp+OCr+ODiFxuICAgICAqXG4gICAgICogQG5vbmUg5Y+W5b6X44GZ44KL5YCk44Gv44Kz44Oe44Oz44OJ5a6f6KGM5b6M44GrQkxF44Gu44Kt44Oj44Op44Kv44K/44Oq44K544OG44Kj44Kv44K5TU9UT1JfU0VUVElOR+OBq+mAmuefpeOBleOCjOOCi+OAgjxicj5cbiAgICAgKiAgICAgICDjgZ3jgozjgpLmi77jgaPjgaZwcm9taXNl44Kq44OW44K444Kn44Kv44OI44Gu44GucmVzb2x2ZeOBq+i/lOOBl+OBpuWHpueQhuOCkue5i+OBkDxicj5cbiAgICAgKiAgICAgICBNT1RPUl9TRVRUSU5H44Gubm90aWZ544GvX29uQmxlTW90b3JTZXR0aW5n44Gn5Y+W5b6XXG4gICAgICovXG5cbiAgICBjbWRSZWFkUmVnaXN0ZXIocmVnaXN0ZXJzKXtcbiAgICAgICAgaWYoQXJyYXkuaXNBcnJheShyZWdpc3RlcnMpKXtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoYWxscmVzb2x2ZSwgYWxscmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcHJvbWlzZUxpc3Q9W107XG4gICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7aTxyZWdpc3RlcnMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZWdpc3Rlcj1wYXJzZUludChyZWdpc3RlcnNbaV0sMTApO1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlTGlzdC5wdXNoKCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjY3A9bmV3IF9LTU5vdGlmeVByb21pcyhyZWdpc3Rlcix0aGlzLl9SRVZfTU9UT1JfQ09NTUFORFtyZWdpc3Rlcl0sdGhpcy5fbm90aWZ5UHJvbWlzTGlzdCxyZXNvbHZlLHJlamVjdCw1MDAwKTsvL25vdGlmeee1jOeUseOBrnJlc3VsdOOCklByb21pc+OBqOe0kOS7mOOBkVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsIHJlZ2lzdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZWFkUmVnaXN0ZXIsIGJ1ZmZlcixjY3ApO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKHByb21pc2VMaXN0KS50aGVuKChyZXNhcik9PntcbiAgICAgICAgICAgICAgICAgICAgbGV0IHQ9W3t9XS5jb25jYXQocmVzYXIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcnRvYmo9T2JqZWN0LmFzc2lnbi5hcHBseShudWxsLHQpO1xuICAgICAgICAgICAgICAgICAgICBhbGxyZXNvbHZlKHJ0b2JqKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgobXNnKT0+e1xuICAgICAgICAgICAgICAgICAgICBhbGxyZWplY3QobXNnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgobGFzdHJlc29sdmUsIGxhc3RyZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZWdpc3Rlcj1wYXJzZUludChyZWdpc3RlcnMsMTApO1xuICAgICAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2NwPW5ldyBfS01Ob3RpZnlQcm9taXMocmVnaXN0ZXIsdGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbcmVnaXN0ZXJdLHRoaXMuX25vdGlmeVByb21pc0xpc3QscmVzb2x2ZSxyZWplY3QsMTAwMCk7Ly9ub3RpZnnntYznlLHjga5yZXN1bHTjgpJQcm9taXPjgajntJDku5jjgZFcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxyZWdpc3Rlcik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZWFkUmVnaXN0ZXIsIGJ1ZmZlcixjY3ApO1xuICAgICAgICAgICAgICAgIH0pLnRoZW4oKHJlcyk9PntcbiAgICAgICAgICAgICAgICAgICAgbGFzdHJlc29sdmUocmVzW09iamVjdC5rZXlzKHJlcylbMF1dKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgobXNnKT0+e1xuICAgICAgICAgICAgICAgICAgICBsYXN0cmVqZWN0KG1zZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBruWFqOOBpuOBruODrOOCuOOCueOCv+WApOOBruWPluW+l1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlLjxhcnJheT59XG4gICAgICovXG4gICAgY21kUmVhZEFsbFJlZ2lzdGVyKCl7XG4gICAgICAgbGV0IGNtPSB0aGlzLmNvbnN0cnVjdG9yLmNtZFJlYWRSZWdpc3Rlcl9DT01NQU5EO1xuICAgICAgICBsZXQgYWxsY21kcz1bXTtcbiAgICAgICAgT2JqZWN0LmtleXMoY20pLmZvckVhY2goKGspPT57YWxsY21kcy5wdXNoKGNtW2tdKTt9KTtcblxuICAgICAgIHJldHVybiB0aGlzLmNtZFJlYWRSZWdpc3RlcihhbGxjbWRzKTtcbiAgICB9XG4gICAgLy8vLy8v5L+d5a2YXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu6Kit5a6a5YCk44KS44OV44Op44OD44K344Ol44Oh44Oi44Oq44Gr5L+d5a2Y44GZ44KLXG4gICAgICogQGRlc2Mg5pys44Kz44Oe44Oz44OJ44KS5a6f6KGM44GX44Gq44GE6ZmQ44KK44CB6Kit5a6a5YCk44Gv44Oi44O844K/44O844Gr5rC45LmF55qE44Gr5L+d5a2Y44GV44KM44Gq44GEKOWGjei1t+WLleOBp+a2iOOBiOOCiylcbiAgICAgKi9cbiAgICBjbWRTYXZlQWxsUmVnaXN0ZXJzKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zYXZlQWxsUmVnaXN0ZXJzKTtcbiAgICB9XG5cbiAgICAvLy8vLy/jg6rjgrvjg4Pjg4hcbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjgZfjgZ/jg6zjgrjjgrnjgr/jgpLjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuY21kUmVhZFJlZ2lzdGVyX0NPTU1BTkR9IHJlZ2lzdGVyIOWIneacn+WApOOBq+ODquOCu+ODg+ODiOOBmeOCi+OCs+ODnuODs+ODiSjjg6zjgrjjgrnjgr8p5YCkXG4gICAgICovXG4gICAgY21kUmVzZXRSZWdpc3RlcihyZWdpc3Rlcil7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQocmVnaXN0ZXIsMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0UmVnaXN0ZXIsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu44Os44K444K544K/44KS44OV44Kh44O844Og44Km44Kn44Ki44Gu5Yid5pyf5YCk44Gr44Oq44K744OD44OI44GZ44KLXG4gICAgICogQGRlc2MgYmxlU2F2ZUFsbFJlZ2lzdGVyc+OCkuWun+ihjOOBl+OBquOBhOmZkOOCiuOAgeODquOCu+ODg+ODiOWApOOBr+ODouODvOOCv+ODvOOBq+awuOS5heeahOOBq+S/neWtmOOBleOCjOOBquOBhCjlho3otbfli5XjgafmtojjgYjjgospXG4gICAgICovXG4gICAgY21kUmVzZXRBbGxSZWdpc3RlcnMoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0QWxsUmVnaXN0ZXJzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OH44OQ44Kk44K544ON44O844Og44Gu5Y+W5b6XXG4gICAgICogQGRlc2Mg44OH44OQ44Kk44K544ON44O844Og44KS6Kqt44G/5Y+W44KLXG4gICAgICogQHJldHVybnMge1Byb21pc2U8aW50fEFycmF5Pn1cbiAgICAgKi9cbiAgICBjbWRSZWFkRGV2aWNlTmFtZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRSZWFkUmVnaXN0ZXIodGhpcy5fTU9UT1JfQ09NTUFORC5yZWFkRGV2aWNlTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OH44OQ44Kk44K55oOF5aCx44Gu5Y+W5b6XXG4gICAgICogQGRlc2Mg44OH44OQ44Kk44K544Kk44Oz44OV44Kp44Oh44O844K344On44Oz44KS6Kqt44G/5Y+W44KLXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICAgKi9cbiAgICBjbWRSZWFkRGV2aWNlSW5mbygpe1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRSZWFkUmVnaXN0ZXIodGhpcy5fTU9UT1JfQ09NTUFORC5yZWFkRGV2aWNlSW5mbyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSTJD44K544Os44O844OW44Ki44OJ44Os44K5XG4gICAgICogQGRlc2MgSTJD44GL44KJ5Yi25b6h44GZ44KL5aC05ZCI44Gu44K544Os44O844OW44Ki44OJ44Os44K577yIMHgwMC0weEZG77yJ44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFkZHJlc3Mg44Ki44OJ44Os44K5XG4gICAgICovXG4gICAgY21kU2V0STJDU2xhdmVBZGRyZXNzKGFkZHJlc3Mpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KGFkZHJlc3MsMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNldEkyQ1NsYXZlQWRkcmVzcyxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWGhemDqFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4vLy8vLy9jbGFzcy8vXG59XG5cblxuLyoqXG4gKiBTZW5kQmxlTm90aWZ5UHJvbWlzXG4gKiDjgIBjbWRSZWFkUmVnaXN0ZXLnrYnjga5CTEXlkbzjgbPlh7rjgZflvozjgatcbiAqIOOAgOOCs+ODnuODs+ODiee1kOaenOOBjG5vdGlmeeOBp+mAmuefpeOBleOCjOOCi+OCs+ODnuODs+ODieOCklByb21pc+OBqOe0kOS7mOOBkeOCi+eCuuOBruOCr+ODqeOCuVxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX0tNTm90aWZ5UHJvbWlze1xuICAgIC8v5oiQ5Yqf6YCa55+lXG4gICAgc3RhdGljIHNlbmRHcm91cE5vdGlmeVJlc29sdmUoZ3JvdXBBcnJheSx0YWdOYW1lLHZhbCl7XG4gICAgICAgIGlmKCFBcnJheS5pc0FycmF5KGdyb3VwQXJyYXkpKXtyZXR1cm47fVxuICAgICAgICAvL+mAgeS/oUlE44Gu6YCa55+lIENhbGxiYWNrUHJvbWlz44Gn5ZG844Gz5Ye644GX5YWD44Gu44Oh44K944OD44OJ44GuUHJvbWlz44Gr6L+U44GZXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPGdyb3VwQXJyYXkubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYoIGdyb3VwQXJyYXlbaV0udGFnTmFtZT09PXRhZ05hbWUgKXtcbiAgICAgICAgICAgICAgICBncm91cEFycmF5W2ldLmNhbGxSZXNvbHZlKHZhbCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICogY29uc3RcbiAgICAgKiBAcGFyYW0gdGFnTmFtZVxuICAgICAqIEBwYXJhbSBncm91cEFycmF5XG4gICAgICogQHBhcmFtIHByb21pc1Jlc29sdmVPYmpcbiAgICAgKiBAcGFyYW0gcHJvbWlzUmVqZWN0T2JqXG4gICAgICogQHBhcmFtIHJlamVjdFRpbWVPdXRcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcih0YWdOYW1lLHRhZ0luZm89bnVsbCxncm91cEFycmF5PVtdLHByb21pc1Jlc29sdmVPYmosIHByb21pc1JlamVjdE9iaixyZWplY3RUaW1lT3V0KXtcbiAgICAgICAgdGhpcy50aW1lb3V0SWQ9MDtcbiAgICAgICAgdGhpcy50YWdOYW1lPXRhZ05hbWU7XG4gICAgICAgIHRoaXMudGFnSW5mbz10YWdJbmZvO1xuICAgICAgICB0aGlzLmdyb3VwQXJyYXk9QXJyYXkuaXNBcnJheShncm91cEFycmF5KT9ncm91cEFycmF5OltdO1xuICAgICAgICB0aGlzLmdyb3VwQXJyYXkucHVzaCh0aGlzKTtcbiAgICAgICAgdGhpcy5wcm9taXNSZXNvbHZlT2JqPXByb21pc1Jlc29sdmVPYmo7XG4gICAgICAgIHRoaXMucHJvbWlzUmVqZWN0T2JqPXByb21pc1JlamVjdE9iajtcbiAgICAgICAgdGhpcy5yZWplY3RUaW1lT3V0PXJlamVjdFRpbWVPdXQ7XG4gICAgfVxuICAgIC8v44Kr44Km44Oz44OI44Gu6ZaL5aeLIGNoYXJhY3RlcmlzdGljcy53cml0ZVZhbHVl5ZG844Gz5Ye644GX5b6M44Gr5a6f6KGMXG4gICAgc3RhcnRSZWplY3RUaW1lT3V0Q291bnQoKXtcbiAgICAgICAgdGhpcy50aW1lb3V0SWQ9c2V0VGltZW91dCgoKT0+e1xuICAgICAgICAgICAgdGhpcy5fcmVtb3ZlR3JvdXAoKTtcbiAgICAgICAgICAgIHRoaXMucHJvbWlzUmVqZWN0T2JqKHttc2c6XCJ0aW1lb3V0OlwiLHRhZ05hbWU6dGhpcy50YWdOYW1lLHRhZ0luZm86dGhpcy50YWdJbmZvfSk7XG4gICAgICAgIH0sIHRoaXMucmVqZWN0VGltZU91dCk7XG4gICAgfVxuICAgIGNhbGxSZXNvbHZlKGFyZyl7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUdyb3VwKCk7XG4gICAgICAgIHRoaXMucHJvbWlzUmVzb2x2ZU9iaihhcmcpO1xuICAgIH1cbiAgICBjYWxsUmVqZWN0KG1zZyl7XG4gICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XG4gICAgICAgIHRoaXMuX3JlbW92ZUdyb3VwKCk7XG4gICAgICAgIHRoaXMucHJvbWlzUmVqZWN0T2JqKHttc2c6bXNnfSk7XG4gICAgfVxuXG4gICAgX3JlbW92ZUdyb3VwKCl7XG4gICAgICAgIGZvcihsZXQgaT0wOyBpPHRoaXMuZ3JvdXBBcnJheS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZiggdGhpcy5ncm91cEFycmF5W2ldPT09dGhpcyl7XG4gICAgICAgICAgICAgICAgdGhpcy5ncm91cEFycmF5LnNwbGljZShpLDEpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG59XG5cbm1vZHVsZS5leHBvcnRzID1LTU1vdG9yQ29tbWFuZEtNT25lO1xuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9LTU1vdG9yQ29tbWFuZEtNT25lLmpzXG4vLyBtb2R1bGUgaWQgPSA3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLy8gQ29weXJpZ2h0IEpveWVudCwgSW5jLiBhbmQgb3RoZXIgTm9kZSBjb250cmlidXRvcnMuXG4vL1xuLy8gUGVybWlzc2lvbiBpcyBoZXJlYnkgZ3JhbnRlZCwgZnJlZSBvZiBjaGFyZ2UsIHRvIGFueSBwZXJzb24gb2J0YWluaW5nIGFcbi8vIGNvcHkgb2YgdGhpcyBzb2Z0d2FyZSBhbmQgYXNzb2NpYXRlZCBkb2N1bWVudGF0aW9uIGZpbGVzICh0aGVcbi8vIFwiU29mdHdhcmVcIiksIHRvIGRlYWwgaW4gdGhlIFNvZnR3YXJlIHdpdGhvdXQgcmVzdHJpY3Rpb24sIGluY2x1ZGluZ1xuLy8gd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHMgdG8gdXNlLCBjb3B5LCBtb2RpZnksIG1lcmdlLCBwdWJsaXNoLFxuLy8gZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGwgY29waWVzIG9mIHRoZSBTb2Z0d2FyZSwgYW5kIHRvIHBlcm1pdFxuLy8gcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpcyBmdXJuaXNoZWQgdG8gZG8gc28sIHN1YmplY3QgdG8gdGhlXG4vLyBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZFxuLy8gaW4gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTU1xuLy8gT1IgSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRlxuLy8gTUVSQ0hBTlRBQklMSVRZLCBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTlxuLy8gTk8gRVZFTlQgU0hBTEwgVEhFIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sXG4vLyBEQU1BR0VTIE9SIE9USEVSIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1Jcbi8vIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLCBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEVcbi8vIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTiBUSEUgU09GVFdBUkUuXG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgdGhpcy5fZXZlbnRzID0gdGhpcy5fZXZlbnRzIHx8IHt9O1xuICB0aGlzLl9tYXhMaXN0ZW5lcnMgPSB0aGlzLl9tYXhMaXN0ZW5lcnMgfHwgdW5kZWZpbmVkO1xufVxubW9kdWxlLmV4cG9ydHMgPSBFdmVudEVtaXR0ZXI7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG5FdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbihuKSB7XG4gIGlmICghaXNOdW1iZXIobikgfHwgbiA8IDAgfHwgaXNOYU4obikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCduIG11c3QgYmUgYSBwb3NpdGl2ZSBudW1iZXInKTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmVtaXQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBlciwgaGFuZGxlciwgbGVuLCBhcmdzLCBpLCBsaXN0ZW5lcnM7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMpXG4gICAgdGhpcy5fZXZlbnRzID0ge307XG5cbiAgLy8gSWYgdGhlcmUgaXMgbm8gJ2Vycm9yJyBldmVudCBsaXN0ZW5lciB0aGVuIHRocm93LlxuICBpZiAodHlwZSA9PT0gJ2Vycm9yJykge1xuICAgIGlmICghdGhpcy5fZXZlbnRzLmVycm9yIHx8XG4gICAgICAgIChpc09iamVjdCh0aGlzLl9ldmVudHMuZXJyb3IpICYmICF0aGlzLl9ldmVudHMuZXJyb3IubGVuZ3RoKSkge1xuICAgICAgZXIgPSBhcmd1bWVudHNbMV07XG4gICAgICBpZiAoZXIgaW5zdGFuY2VvZiBFcnJvcikge1xuICAgICAgICB0aHJvdyBlcjsgLy8gVW5oYW5kbGVkICdlcnJvcicgZXZlbnRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIEF0IGxlYXN0IGdpdmUgc29tZSBraW5kIG9mIGNvbnRleHQgdG8gdGhlIHVzZXJcbiAgICAgICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5jYXVnaHQsIHVuc3BlY2lmaWVkIFwiZXJyb3JcIiBldmVudC4gKCcgKyBlciArICcpJyk7XG4gICAgICAgIGVyci5jb250ZXh0ID0gZXI7XG4gICAgICAgIHRocm93IGVycjtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBoYW5kbGVyID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc1VuZGVmaW5lZChoYW5kbGVyKSlcbiAgICByZXR1cm4gZmFsc2U7XG5cbiAgaWYgKGlzRnVuY3Rpb24oaGFuZGxlcikpIHtcbiAgICBzd2l0Y2ggKGFyZ3VtZW50cy5sZW5ndGgpIHtcbiAgICAgIC8vIGZhc3QgY2FzZXNcbiAgICAgIGNhc2UgMTpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAzOlxuICAgICAgICBoYW5kbGVyLmNhbGwodGhpcywgYXJndW1lbnRzWzFdLCBhcmd1bWVudHNbMl0pO1xuICAgICAgICBicmVhaztcbiAgICAgIC8vIHNsb3dlclxuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIGhhbmRsZXIuYXBwbHkodGhpcywgYXJncyk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGlzT2JqZWN0KGhhbmRsZXIpKSB7XG4gICAgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgbGlzdGVuZXJzID0gaGFuZGxlci5zbGljZSgpO1xuICAgIGxlbiA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgbGlzdGVuZXJzW2ldLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIG07XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIFRvIGF2b2lkIHJlY3Vyc2lvbiBpbiB0aGUgY2FzZSB0aGF0IHR5cGUgPT09IFwibmV3TGlzdGVuZXJcIiEgQmVmb3JlXG4gIC8vIGFkZGluZyBpdCB0byB0aGUgbGlzdGVuZXJzLCBmaXJzdCBlbWl0IFwibmV3TGlzdGVuZXJcIi5cbiAgaWYgKHRoaXMuX2V2ZW50cy5uZXdMaXN0ZW5lcilcbiAgICB0aGlzLmVtaXQoJ25ld0xpc3RlbmVyJywgdHlwZSxcbiAgICAgICAgICAgICAgaXNGdW5jdGlvbihsaXN0ZW5lci5saXN0ZW5lcikgP1xuICAgICAgICAgICAgICBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICB0aGlzLl9ldmVudHNbdHlwZV0gPSBsaXN0ZW5lcjtcbiAgZWxzZSBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdLnB1c2gobGlzdGVuZXIpO1xuICBlbHNlXG4gICAgLy8gQWRkaW5nIHRoZSBzZWNvbmQgZWxlbWVudCwgbmVlZCB0byBjaGFuZ2UgdG8gYXJyYXkuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gW3RoaXMuX2V2ZW50c1t0eXBlXSwgbGlzdGVuZXJdO1xuXG4gIC8vIENoZWNrIGZvciBsaXN0ZW5lciBsZWFrXG4gIGlmIChpc09iamVjdCh0aGlzLl9ldmVudHNbdHlwZV0pICYmICF0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkKSB7XG4gICAgaWYgKCFpc1VuZGVmaW5lZCh0aGlzLl9tYXhMaXN0ZW5lcnMpKSB7XG4gICAgICBtID0gdGhpcy5fbWF4TGlzdGVuZXJzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnM7XG4gICAgfVxuXG4gICAgaWYgKG0gJiYgbSA+IDAgJiYgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCA+IG0pIHtcbiAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS53YXJuZWQgPSB0cnVlO1xuICAgICAgY29uc29sZS5lcnJvcignKG5vZGUpIHdhcm5pbmc6IHBvc3NpYmxlIEV2ZW50RW1pdHRlciBtZW1vcnkgJyArXG4gICAgICAgICAgICAgICAgICAgICdsZWFrIGRldGVjdGVkLiAlZCBsaXN0ZW5lcnMgYWRkZWQuICcgK1xuICAgICAgICAgICAgICAgICAgICAnVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gaW5jcmVhc2UgbGltaXQuJyxcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fZXZlbnRzW3R5cGVdLmxlbmd0aCk7XG4gICAgICBpZiAodHlwZW9mIGNvbnNvbGUudHJhY2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgLy8gbm90IHN1cHBvcnRlZCBpbiBJRSAxMFxuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbmNlID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIHZhciBmaXJlZCA9IGZhbHNlO1xuXG4gIGZ1bmN0aW9uIGcoKSB7XG4gICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBnKTtcblxuICAgIGlmICghZmlyZWQpIHtcbiAgICAgIGZpcmVkID0gdHJ1ZTtcbiAgICAgIGxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICB9XG5cbiAgZy5saXN0ZW5lciA9IGxpc3RlbmVyO1xuICB0aGlzLm9uKHR5cGUsIGcpO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuLy8gZW1pdHMgYSAncmVtb3ZlTGlzdGVuZXInIGV2ZW50IGlmZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWRcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbih0eXBlLCBsaXN0ZW5lcikge1xuICB2YXIgbGlzdCwgcG9zaXRpb24sIGxlbmd0aCwgaTtcblxuICBpZiAoIWlzRnVuY3Rpb24obGlzdGVuZXIpKVxuICAgIHRocm93IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXR1cm4gdGhpcztcblxuICBsaXN0ID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuICBsZW5ndGggPSBsaXN0Lmxlbmd0aDtcbiAgcG9zaXRpb24gPSAtMTtcblxuICBpZiAobGlzdCA9PT0gbGlzdGVuZXIgfHxcbiAgICAgIChpc0Z1bmN0aW9uKGxpc3QubGlzdGVuZXIpICYmIGxpc3QubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgaWYgKHRoaXMuX2V2ZW50cy5yZW1vdmVMaXN0ZW5lcilcbiAgICAgIHRoaXMuZW1pdCgncmVtb3ZlTGlzdGVuZXInLCB0eXBlLCBsaXN0ZW5lcik7XG5cbiAgfSBlbHNlIGlmIChpc09iamVjdChsaXN0KSkge1xuICAgIGZvciAoaSA9IGxlbmd0aDsgaS0tID4gMDspIHtcbiAgICAgIGlmIChsaXN0W2ldID09PSBsaXN0ZW5lciB8fFxuICAgICAgICAgIChsaXN0W2ldLmxpc3RlbmVyICYmIGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSkge1xuICAgICAgICBwb3NpdGlvbiA9IGk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICByZXR1cm4gdGhpcztcblxuICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgICAgbGlzdC5sZW5ndGggPSAwO1xuICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGlzdC5zcGxpY2UocG9zaXRpb24sIDEpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUFsbExpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIGtleSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHJldHVybiB0aGlzO1xuXG4gIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgaWYgKCF0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIGVsc2UgaWYgKHRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvLyBlbWl0IHJlbW92ZUxpc3RlbmVyIGZvciBhbGwgbGlzdGVuZXJzIG9uIGFsbCBldmVudHNcbiAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICBmb3IgKGtleSBpbiB0aGlzLl9ldmVudHMpIHtcbiAgICAgIGlmIChrZXkgPT09ICdyZW1vdmVMaXN0ZW5lcicpIGNvbnRpbnVlO1xuICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICB9XG4gICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoJ3JlbW92ZUxpc3RlbmVyJyk7XG4gICAgdGhpcy5fZXZlbnRzID0ge307XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICBsaXN0ZW5lcnMgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgaWYgKGlzRnVuY3Rpb24obGlzdGVuZXJzKSkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgbGlzdGVuZXJzKTtcbiAgfSBlbHNlIGlmIChsaXN0ZW5lcnMpIHtcbiAgICAvLyBMSUZPIG9yZGVyXG4gICAgd2hpbGUgKGxpc3RlbmVycy5sZW5ndGgpXG4gICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVyc1tsaXN0ZW5lcnMubGVuZ3RoIC0gMV0pO1xuICB9XG4gIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVycyA9IGZ1bmN0aW9uKHR5cGUpIHtcbiAgdmFyIHJldDtcbiAgaWYgKCF0aGlzLl9ldmVudHMgfHwgIXRoaXMuX2V2ZW50c1t0eXBlXSlcbiAgICByZXQgPSBbXTtcbiAgZWxzZSBpZiAoaXNGdW5jdGlvbih0aGlzLl9ldmVudHNbdHlwZV0pKVxuICAgIHJldCA9IFt0aGlzLl9ldmVudHNbdHlwZV1dO1xuICBlbHNlXG4gICAgcmV0ID0gdGhpcy5fZXZlbnRzW3R5cGVdLnNsaWNlKCk7XG4gIHJldHVybiByZXQ7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmxpc3RlbmVyQ291bnQgPSBmdW5jdGlvbih0eXBlKSB7XG4gIGlmICh0aGlzLl9ldmVudHMpIHtcbiAgICB2YXIgZXZsaXN0ZW5lciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICAgIGlmIChpc0Z1bmN0aW9uKGV2bGlzdGVuZXIpKVxuICAgICAgcmV0dXJuIDE7XG4gICAgZWxzZSBpZiAoZXZsaXN0ZW5lcilcbiAgICAgIHJldHVybiBldmxpc3RlbmVyLmxlbmd0aDtcbiAgfVxuICByZXR1cm4gMDtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICByZXR1cm4gZW1pdHRlci5saXN0ZW5lckNvdW50KHR5cGUpO1xufTtcblxuZnVuY3Rpb24gaXNGdW5jdGlvbihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdmdW5jdGlvbic7XG59XG5cbmZ1bmN0aW9uIGlzTnVtYmVyKGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ251bWJlcic7XG59XG5cbmZ1bmN0aW9uIGlzT2JqZWN0KGFyZykge1xuICByZXR1cm4gdHlwZW9mIGFyZyA9PT0gJ29iamVjdCcgJiYgYXJnICE9PSBudWxsO1xufVxuXG5mdW5jdGlvbiBpc1VuZGVmaW5lZChhcmcpIHtcbiAgcmV0dXJuIGFyZyA9PT0gdm9pZCAwO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvZXZlbnRzL2V2ZW50cy5qc1xuLy8gbW9kdWxlIGlkID0gOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSJdLCJzb3VyY2VSb290IjoiIn0=