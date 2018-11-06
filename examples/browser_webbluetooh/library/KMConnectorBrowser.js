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
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.maxSpeed,buffer);
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
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.minSpeed,buffer);
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
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.curveType,buffer);
    }

    /**
     * @summary モーターの加速度を設定する
     * @param {number} acc float 加速度 0-200 [radian / second^2]（正の値）
     * @desc acc は、モーションコントロール ON の場合、加速時に使用されます。（加速時の直線の傾き）
     */
    cmdAcc(acc = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(acc,10)));
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.acc,buffer);
    }

    /**
     * @summary モーターの減速度を設定する
     * @param {number} dec float 減速度 0-200 [radian / second^2]（正の値）
     * @desc dec は、モーションコントロール ON の場合、減速時に使用されます。（減速時の直線の傾き）
     */
    cmdDec(dec = 0){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(dec,10)));
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.dec,buffer);
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
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.maxTorque,buffer);
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
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.teachingInterval,buffer);
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
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.playbackInterval,buffer);
    }


    /**
     * @summary モーターのq軸電流PIDコントローラのP（比例）ゲインを設定する
     * @param {number} qCurrentP float q電流Pゲイン（正の値）
     */
    cmdQCurrentP(qCurrentP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentP,10)));
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.qCurrentP,buffer);
    }

    /**
     * @summary モーターのq軸電流PIDコントローラのP（比例）ゲインを設定する
     * @param {number} qCurrentI float q電流Iゲイン（正の値）
     */
    cmdQCurrentI(qCurrentI){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentI,10)));
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.qCurrentI,buffer);
    }

    /**
     * @summary モーターのq軸電流PIDコントローラのD（微分）ゲインを設定する
     * @param {number} qCurrentD float q電流Dゲイン（正の値）
     */
    cmdQCurrentD(qCurrentD){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentD,10)));
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.qCurrentD,buffer);
    }

    /**
     * @summary モーターのq軸電流PIDコントローラのD（微分）ゲインを設定する
     * @param {number} speedP float 速度Pゲイン（正の値）
     */
    cmdSpeedP(speedP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedP,10)));
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.speedP,buffer);
    }

    /**
     * @summary モーターの速度PIDコントローラのI（積分）ゲインを設定する
     * @param {number} speedI float 速度Iゲイン（正の値）
     */
    cmdSpeedI(speedI){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedI,10)));
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.speedI,buffer);
    }

    /**
     * @summary モーターの速度PIDコントローラのD（微分）ゲインを設定する
     * @param {number} speedD float 速度Dゲイン（正の値）
     */
    cmdSpeedD(speedD){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedD,10)));
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.speedD,buffer);
    }

    /**
     * @summary モーターの位置PIDコントローラのP（比例）ゲインを設定する
     * @param {number} positionP float 位置Pゲイン（正の値）
     */
    cmdPositionP(positionP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(positionP,10)));
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.positionP,buffer);
    }

    /**
     * @summary 全てのPIDパラメータをリセットしてファームウェアの初期設定に戻す
     * @desc qCurrentP, qCurrentI,  qCurrentD, speedP, speedI, speedD, positionP をリセットします
     *
     */
    cmdResetPID(){
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.resetPID);
    }

    /**
     * @summary モーター測定値の取得間隔設定
     * @desc 有線（USB, I2C）のみ有効。BLEでは固定 100ms 間隔で通知される。
     * @param {KMMotorCommandKMOne.cmdMotorMeasurementInterval_MOTOR_MEAS_INTERVAL} cmdMotorMeasurementInterval_MOTOR_MEAS_INTERVAL enum モーター測定値の取得間隔
     */
    cmdMotorMeasurementInterval(cmdMotorMeasurementInterval_MOTOR_MEAS_INTERVAL=4){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(cmdMotorMeasurementInterval_MOTOR_MEAS_INTERVAL,10));
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.motorMeasurementInterval,buffer);
    }

    /**
     * @summary モーター測定値の取得設定
     * @desc isEnabled = 1 の場合、（位置・速度・トルク）の通知を行う（起動後、interface の設定で優先される通信経路に、自動的に通知が開始される）
     * @param {number} isEnabled 0:Disbled, 1:Enabled
     */
    cmdMotorMeasurementByDefault(isEnabled){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,isEnabled?1:0);
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.motorMeasurementByDefault,buffer);
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
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.interface,buffer);
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
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.ownColor,buffer);
    }

    /**
     * @summary ６軸センサー（加速度・ジャイロ）測定値の取得間隔
     * @desc 有線（USB, I2C）のみ有効。BLEでは固定 100ms 間隔で通知される。
     * @param {KMMotorCommandKMOne.cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL} cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL enum 加速度・ジャイロ測定値の取得間隔
     */
    cmdIMUMeasurementInterval(cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL=4){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(cmdIMUMeasurementInterval_IMU_MEAS_INTERVAL,10));
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.iMUMeasurementInterval,buffer);
    }

    /**
     * @summary ６軸センサー（加速度・ジャイロ）の値の通知をデフォルトで開始する
     * @desc isEnabled = true の場合、enableIMU() を送信しなくても起動時に自動で通知が開始される
     * @param {number} isEnabled 0:Disbled, 1:Enabled
     */
    cmdIMUMeasurementByDefault(isEnabled){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(isEnabled,10));
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.iMUMeasurementByDefault,buffer);
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
                let promiseList=[];
                for(let i=0;i<registers.length;i++){
                    let register=parseInt(registers[i],10);
                    promiseList.push( new Promise((resolve, reject)=> {
                        let ccp=new _KMNotifyPromis(register,this._REV_MOTOR_COMMAND[register],this._notifyPromisList,resolve,reject,5000);//notify経由のresultをPromisと紐付け
                        let buffer = new ArrayBuffer(1);
                        new DataView(buffer).setUint8(0, register);
                        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.readRegister, buffer,ccp);
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
                    this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.readRegister, buffer,ccp);
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
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.saveAllRegisters);
    }

    //////リセット
    /**
     * @summary 指定したレジスタをファームウェアの初期値にリセットする
     * @param {KMMotorCommandKMOne.cmdReadRegister_COMMAND} register 初期値にリセットするコマンド(レジスタ)値
     */
    cmdResetRegister(register){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(register,10));
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.resetRegister,buffer);
    }
    /**
     * @summary 全てのレジスタをファームウェアの初期値にリセットする
     * @desc bleSaveAllRegistersを実行しない限り、リセット値はモーターに永久的に保存されない(再起動で消える)
     */
    cmdResetAllRegisters(){
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.resetAllRegisters);
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
        this._KMCom._sendMotorCommand('MOTOR_RX',this._MOTOR_COMMAND.setI2CSlaveAddress,buffer);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgNDJjMzBiZWI3NzBlYTg5Mzk0MjEiLCJ3ZWJwYWNrOi8vLy4vbGliL0tNU3RydWN0dXJlcy5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01VdGwuanMiLCJ3ZWJwYWNrOi8vLy4vbGliL0tNQ29tV2ViQkxFLmpzIiwid2VicGFjazovLy8uL2xpYi9LTUNvbm5lY3RvckJyb3dzZXJXUEsuanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01Nb3Rvck9uZVdlYkJMRS5qcyIsIndlYnBhY2s6Ly8vLi9saWIvS01Db21CYXNlLmpzIiwid2VicGFjazovLy8uL2xpYi9LTU1vdG9yQ29tbWFuZEtNT25lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7O0FBRUE7QUFDQTs7Ozs7Ozs7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNhO0FBQ2IsWUFBWSxtQkFBTyxDQUFDLENBQVM7OztBQUc3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIs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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZCxrQkFBa0IsT0FBTztBQUN6QixrQkFBa0IsT0FBTztBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Qsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Qsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekIsa0JBQWtCLE9BQU87QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEIsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0E7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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxxQ0FBcUM7QUFDcEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsNENBQTRDO0FBQzNEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQ0FBa0M7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFD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QSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSCxvQkFBb0IsU0FBUztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiJleGFtcGxlcy9icm93c2VyX3dlYmJsdWV0b29oL2xpYnJhcnkvS01Db25uZWN0b3JCcm93c2VyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7XG4gXHRcdFx0XHRjb25maWd1cmFibGU6IGZhbHNlLFxuIFx0XHRcdFx0ZW51bWVyYWJsZTogdHJ1ZSxcbiBcdFx0XHRcdGdldDogZ2V0dGVyXG4gXHRcdFx0fSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gMyk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgNDJjMzBiZWI3NzBlYTg5Mzk0MjEiLCIvKioqXG4gKiBLTVN0cnVjdHVyZXMuanNcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmxldCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcblxuXG4vKipcbiAqIEBjbGFzc2Rlc2Mg5qeL6YCg5L2T44Gu5Z+65bqV44Kv44Op44K5XG4gKiBAaWdub3JlXG4gKi9cbmNsYXNzIEtNU3RydWN0dXJlQmFzZXtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDlkIzjgZjlgKTjgpLmjIHjgaTjgYvjga7mr5TovINcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdGFyIOavlOi8g+OBmeOCi+ani+mAoOS9k1xuICAgICAqIEByZXR1cm5zIHtib29sZWFufSDntZDmnpxcbiAgICAgKi9cbiAgICBFUSAodGFyKSB7XG4gICAgICAgIGlmKCEgdGFyICl7cmV0dXJuIGZhbHNlO31cbiAgICAgICAgaWYodGhpcy5jb25zdHJ1Y3Rvcj09PXRhci5jb25zdHJ1Y3Rvcil7XG4gICAgICAgICAgICBpZih0aGlzLkdldFZhbEFycmF5KXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5HZXRWYWxBcnJheSgpLnRvU3RyaW5nKCk9PT10YXIuR2V0VmFsQXJyYXkoKS50b1N0cmluZygpO1xuICAgICAgICAgICAgfWVsc2UgaWYodGhpcy5HZXRWYWxPYmope1xuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh0aGlzLkdldFZhbE9iaigpKT09PUpTT04uc3RyaW5naWZ5KHRhci5HZXRWYWxPYmooKSk7Ly8gYmFkOjrpgYXjgYRcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog6KSH6KO9XG4gICAgICogQHJldHVybnMge29iamVjdH0g6KSH6KO944GV44KM44Gf5qeL6YCg5L2TXG4gICAgICovXG4gICAgQ2xvbmUgKCkge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihuZXcgdGhpcy5jb25zdHJ1Y3RvcigpLHRoaXMpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiDlgKTjga7lj5blvpfvvIhPYmrvvIlcbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fVxuICAgICAqL1xuICAgIEdldFZhbE9iaiAoKSB7XG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LHRoaXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWApOOBruWPluW+l++8iOmFjeWIl++8iVxuICAgICAqIEByZXR1cm5zIHtBcnJheX1cbiAgICAgKi9cbiAgICBHZXRWYWxBcnJheSAoKSB7XG4gICAgICAgIGxldCBrPU9iamVjdC5rZXlzKHRoaXMpO1xuICAgICAgICBsZXQgcj1bXTtcbiAgICAgICAgZm9yKGxldCBpPTA7aTxrLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgci5wdXNoKHRoaXNba1tpXV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWApOOBruS4gOaLrOioreWumu+8iE9iau+8iVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwcm9wc09iaiDoqK3lrprjgZnjgovjg5fjg63jg5Hjg4bjgqNcbiAgICAgKi9cbiAgICBTZXRWYWxPYmogKHByb3BzT2JqKSB7XG4gICAgICAgIGlmKHR5cGVvZiBwcm9wc09iaiAhPT1cIm9iamVjdFwiKXtyZXR1cm47fVxuICAgICAgICBsZXQga2V5cz1PYmplY3Qua2V5cyhwcm9wc09iaik7XG4gICAgICAgIGZvcihsZXQgaz0wO2s8a2V5cy5sZW5ndGg7aysrKXtcbiAgICAgICAgICAgIGxldCBwbj1rZXlzW2tdO1xuICAgICAgICAgICAgaWYodGhpcy5oYXNPd25Qcm9wZXJ0eShwbikpe1xuICAgICAgICAgICAgICAgIHRoaXNbcG5dPXByb3BzT2JqW3BuXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5cbi8qKlxuICogQGNsYXNzZGVzYyBYWeW6p+aomeOBruani+mAoOS9k+OCquODluOCuOOCp+OCr+ODiFxuICogQGlnbm9yZVxuICovXG5jbGFzcyBLTVZlY3RvcjIgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICogQGV4dGVuZHMgS01TdHJ1Y3R1cmVCYXNlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geVxuICAgICAqXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKHg9MCwgeT0wKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog55u45a++5L2N572u44G456e75YuVXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR4XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGR5XG4gICAgICovXG4gICAgTW92ZSAoZHggPTAsIGR5ID0gMCkge1xuICAgICAgICB0aGlzLnggKz0gZHg7XG4gICAgICAgIHRoaXMueSArPSBkeTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMueCuemWk+OBrui3nembolxuICAgICAqIEBwYXJhbSB7S01WZWN0b3IyfSB2ZWN0b3IyXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBEaXN0YW5jZSAodmVjdG9yMikge1xuICAgICAgICBpZiAoISh2ZWN0b3IyIGluc3RhbmNlb2YgS01WZWN0b3IyKSkge3JldHVybjt9XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3coKHRoaXMueC12ZWN0b3IyLngpLDIpICsgTWF0aC5wb3coKHRoaXMueS12ZWN0b3IyLnkpLDIpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMueCuemWk+OBruinkuW6plxuICAgICAqIEBwYXJhbSB7S01WZWN0b3IyfSB2ZWN0b3IyXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBSYWRpYW4gKHZlY3RvcjIpIHtcbiAgICAgICAgaWYgKCEodmVjdG9yMiBpbnN0YW5jZW9mIEtNVmVjdG9yMikpIHtyZXR1cm47fVxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnktdmVjdG9yMi55LHRoaXMueC12ZWN0b3IyLngpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiAwLDDjgYvjgonjga7ot53pm6JcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIERpc3RhbmNlRnJvbVplcm8oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQoTWF0aC5wb3codGhpcy54LDIpICsgTWF0aC5wb3codGhpcy55LDIpKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogMCww44GL44KJ44Gu6KeS5bqmXG4gICAgICogQHJldHVybnMge251bWJlcn0gcmFkaWFuXG4gICAgICovXG4gICAgUmFkaWFuRnJvbVplcm8oKSB7XG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueSx0aGlzLngpO1xuICAgIH1cbn1cblxuXG5cbi8qKlxuICogQGNsYXNzZGVzYyDjgrjjg6PjgqTjg63jgrvjg7PjgrXjg7zlgKRcbiAqL1xuY2xhc3MgS01JbXVTdGF0ZSBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWNjZWxYIOWKoOmAn+W6pih4KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWNjZWxZIOWKoOmAn+W6pih5KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gYWNjZWxaIOWKoOmAn+W6pih6KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGVtcCDmuKnluqYgQ1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBneXJvWCDop5LpgJ/luqYoeCkgW8KxIDFdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGd5cm9ZIOinkumAn+W6pih5KSBbwrEgMV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZ3lyb1og6KeS6YCf5bqmKHopIFvCsSAxXVxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChhY2NlbFgsIGFjY2VsWSwgYWNjZWxaLCB0ZW1wLCBneXJvWCwgZ3lyb1ksIGd5cm9aICkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMuYWNjZWxYPSBLTVV0bC50b051bWJlcihhY2NlbFgpO1xuICAgICAgICB0aGlzLmFjY2VsWT0gS01VdGwudG9OdW1iZXIoYWNjZWxZKTtcbiAgICAgICAgdGhpcy5hY2NlbFo9IEtNVXRsLnRvTnVtYmVyKGFjY2VsWik7XG4gICAgICAgIHRoaXMudGVtcD0gS01VdGwudG9OdW1iZXIodGVtcCk7XG4gICAgICAgIHRoaXMuZ3lyb1g9IEtNVXRsLnRvTnVtYmVyKGd5cm9YKTtcbiAgICAgICAgdGhpcy5neXJvWT0gS01VdGwudG9OdW1iZXIoZ3lyb1kpO1xuICAgICAgICB0aGlzLmd5cm9aPSBLTVV0bC50b051bWJlcihneXJvWik7XG4gICAgfVxufVxuLyoqXG4gKiBLRUlHQU7jg6Ljg7zjgr/jg7xMRUTjgIDngrnnga/jg7voibLnirbmhYtcbiAqIFN0YXRlIE1PVE9SX0xFRF9TVEFURVxuICogY29sb3JSIDAtMjU1XG4gKiBjb2xvckcgMC0yNTVcbiAqIGNvbG9yQiAwLTI1NVxuICogKi9cbi8qKlxuICogQGNsYXNzZGVzYyDjg6Ljg7zjgr/jg7xMRUTjgIDngrnnga/jg7voibLnirbmhYtcbiAqL1xuY2xhc3MgS01MZWRTdGF0ZSBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844GuTEVE54q25oWLXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTEVEX1NUQVRFX09GRiAtIDA6TEVE5raI54GvXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX0xFRF9TVEFURV9PTl9TT0xJRCAtIDE6TEVE54K554GvXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX0xFRF9TVEFURV9PTl9GTEFTSCAtIDI6TEVE54K55ruF77yI5LiA5a6a6ZaT6ZqU44Gn54K55ruF77yJXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX0xFRF9TVEFURV9PTl9ESU0gLSAzOkxFROOBjOOChuOBo+OBj+OCiui8neW6puWkieWMluOBmeOCi1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgTU9UT1JfTEVEX1NUQVRFKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgIFwiTU9UT1JfTEVEX1NUQVRFX09GRlwiOjAsXG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PTl9TT0xJRFwiOjEsXG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PTl9GTEFTSFwiOjIsXG4gICAgICAgICAgICBcIk1PVE9SX0xFRF9TVEFURV9PTl9ESU1cIjozXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvclxuICAgICAqIEBleHRlbmRzIEtNU3RydWN0dXJlQmFzZVxuICAgICAqIEBwYXJhbSB7S01MZWRTdGF0ZS5NT1RPUl9MRURfU1RBVEV9IHN0YXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGNvbG9yUiBpbnQgWzAtMjU1XVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBjb2xvckcgaW50IFswLTI1NV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gY29sb3JCIGludCBbMC0yNTVdXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3Ioc3RhdGUsY29sb3JSLGNvbG9yRyxjb2xvckIpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5zdGF0ZT1LTVV0bC50b051bWJlcihzdGF0ZSk7XG4gICAgICAgIHRoaXMuY29sb3JSPUtNVXRsLnRvTnVtYmVyKGNvbG9yUik7XG4gICAgICAgIHRoaXMuY29sb3JHPUtNVXRsLnRvTnVtYmVyKGNvbG9yRyk7XG4gICAgICAgIHRoaXMuY29sb3JCPUtNVXRsLnRvTnVtYmVyKGNvbG9yQik7XG4gICAgfVxufVxuXG4vKipcbiAqIEBjbGFzc2Rlc2Mg44Oi44O844K/44O85Zue6Lui5oOF5aCxXG4gKi9cbmNsYXNzIEtNUm90U3RhdGUgZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2Uge1xuICAgIC8qKlxuICAgICAqIOacgOWkp+ODiOODq+OCr+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBNQVhfVE9SUVVFKCl7XG4gICAgICAgIHJldHVybiAwLjM7Ly8wLjMgTuODu21cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDmnIDlpKfpgJ/luqblrprmlbAocnBtKVxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBNQVhfU1BFRURfUlBNKCl7XG4gICAgICAgIHJldHVybiAzMDA7Ly8zMDBycG1cbiAgICB9XG4gICAgLyoqXG4gICAgICog5pyA5aSn6YCf5bqm5a6a5pWwKHJhZGlhbi9zZWMpXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IE1BWF9TUEVFRF9SQURJQU4oKXtcbiAgICAgICAgcmV0dXJuIEtNVXRsLnJwbVRvUmFkaWFuU2VjKDMwMCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOacgOWkp+W6p+aomeWumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICovXG4gICAgc3RhdGljIGdldCBNQVhfUE9TSVRJT04oKXtcbiAgICAgICAgcmV0dXJuIDMqTWF0aC5wb3coMTAsMzgpOy8vaW5mbzo644CMcmV0dXJu44CAM2UrMzjjgI3jga9taW5pZnnjgafjgqjjg6njg7xcbiAgICAgICAgLy9yZXR1cm7jgIAzZSszODsvL3JhZGlhbiA0Ynl0ZSBmbG9hdOOAgDEuMTc1NDk0IDEwLTM4ICA8IDMuNDAyODIzIDEwKzM4XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb24g5bqn5qiZXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZlbG9jaXR5IOmAn+W6plxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b3JxdWUg44OI44Or44KvXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocG9zaXRpb24sIHZlbG9jaXR5LCB0b3JxdWUpIHtcbiAgICAgICAgLy/mnInlirnmoYHmlbAg5bCP5pWw56ysM+S9jVxuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnBvc2l0aW9uID0gTWF0aC5mbG9vcihLTVV0bC50b051bWJlcihwb3NpdGlvbikqMTAwKS8xMDA7XG4gICAgICAgIHRoaXMudmVsb2NpdHkgPSBNYXRoLmZsb29yKEtNVXRsLnRvTnVtYmVyKHZlbG9jaXR5KSoxMDApLzEwMDtcbiAgICAgICAgdGhpcy50b3JxdWUgPSBNYXRoLmZsb29yKEtNVXRsLnRvTnVtYmVyKHRvcnF1ZSkqMTAwMDApLzEwMDAwO1xuICAgIH1cbn1cblxuXG4vKipcbiAqIEBjbGFzc2Rlc2Mg44OH44OQ44Kk44K55oOF5aCxXG4gKi9cbmNsYXNzIEtNRGV2aWNlSW5mbyBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTVN0cnVjdHVyZUJhc2VcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuS01fQ09OTkVDVF9UWVBFfSB0eXBlIOaOpee2muaWueW8j1xuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBpZCDjg4fjg5DjgqTjgrlVVUlEXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUg44Oi44O844K/44O85ZCNKOW9ouW8jyBJRCBMRURDb2xvcilcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGlzQ29ubmVjdCDmjqXntprnirbmhYtcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gbWFudWZhY3R1cmVyTmFtZSDoo73pgKDkvJrnpL7lkI1cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gaGFyZHdhcmVSZXZpc2lvblxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBmaXJtd2FyZVJldmlzaW9uXG4gICAgICogQGluc3RhbmNlXG4gICAgICovXG4gICAgY29uc3RydWN0b3IodHlwZT0wLGlkPVwiXCIsbmFtZT1cIlwiLGlzQ29ubmVjdD1mYWxzZSxtYW51ZmFjdHVyZXJOYW1lPW51bGwsaGFyZHdhcmVSZXZpc2lvbj1udWxsLGZpcm13YXJlUmV2aXNpb249bnVsbCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLnR5cGU9dHlwZTtcbiAgICAgICAgdGhpcy5pZD1pZDtcbiAgICAgICAgdGhpcy5uYW1lPW5hbWU7XG4gICAgICAgIHRoaXMuaXNDb25uZWN0PWlzQ29ubmVjdDtcbiAgICAgICAgdGhpcy5tYW51ZmFjdHVyZXJOYW1lPW1hbnVmYWN0dXJlck5hbWU7XG4gICAgICAgIHRoaXMuaGFyZHdhcmVSZXZpc2lvbj1oYXJkd2FyZVJldmlzaW9uO1xuICAgICAgICB0aGlzLmZpcm13YXJlUmV2aXNpb249ZmlybXdhcmVSZXZpc2lvbjtcblxuICAgIH1cbn1cbi8qKlxuICogQGNsYXNzZGVzYyDjg6Ljg7zjgr/jg7zjg63jgrDmg4XloLFcbiAqL1xuY2xhc3MgS01Nb3RvckxvZyBleHRlbmRzIEtNU3RydWN0dXJlQmFzZSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGlkIHtudW1iZXJ9IOOCt+ODvOOCseODs+OCuUlEKOODpuODi+ODvOOCr+WApClcbiAgICAgKiBAcGFyYW0gY21kTmFtZSB7c3RyaW5nfSDlrp/ooYzjgrPjg57jg7Pjg4nlkI1cbiAgICAgKiBAcGFyYW0gY21kSUQge251bWJlcn0g5a6f6KGM44Kz44Oe44Oz44OJSURcbiAgICAgKiBAcGFyYW0gZXJySUQge251bWJlcn0g44Ko44Op44O844K/44Kk44OXXG4gICAgICogQHBhcmFtIGVyclR5cGUge3N0cmluZ30g44Ko44Op44O856iu5YilXG4gICAgICogQHBhcmFtIGVyck1zZyB7c3RyaW5nfeOAgOODoeODg+OCu+ODvOOCuOWGheWuuVxuICAgICAqIEBwYXJhbSBpbmZvIHtudW1iZXJ9XG4gICAgICovXG4gICAgY29uc3RydWN0b3IgKGlkPTAsY21kTmFtZT1cIlwiLGNtZElEPTAsZXJySUQ9MCxlcnJUeXBlPVwiXCIsZXJyTXNnPVwiXCIsaW5mbz0wKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuaWQ9IGlkO1xuICAgICAgICB0aGlzLmNtZE5hbWU9Y21kTmFtZTtcbiAgICAgICAgdGhpcy5jbWRJRD0gY21kSUQ7XG4gICAgICAgIHRoaXMuZXJySUQ9ZXJySUQ7XG4gICAgICAgIHRoaXMuZXJyVHlwZT0gZXJyVHlwZTtcbiAgICAgICAgdGhpcy5lcnJNc2c9IGVyck1zZztcbiAgICAgICAgdGhpcy5pbmZvPSBpbmZvO1xuICAgIH1cbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBLTVN0cnVjdHVyZUJhc2U6S01TdHJ1Y3R1cmVCYXNlLFxuICAgIEtNVmVjdG9yMjpLTVZlY3RvcjIsXG4gICAgLy9LTVZlY3RvcjM6S01WZWN0b3IzLFxuICAgIEtNSW11U3RhdGU6S01JbXVTdGF0ZSxcbiAgICBLTUxlZFN0YXRlOktNTGVkU3RhdGUsXG4gICAgS01Sb3RTdGF0ZTpLTVJvdFN0YXRlLFxuICAgIEtNRGV2aWNlSW5mbzpLTURldmljZUluZm8sXG4gICAgS01Nb3RvckxvZzpLTU1vdG9yTG9nXG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvS01TdHJ1Y3R1cmVzLmpzXG4vLyBtb2R1bGUgaWQgPSAwXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiLyoqKlxuICogS01VdGwuanNcbiAqIENDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogQGNsYXNzZGVzYyDjg6bjg7zjg4bjgqPjg6rjg4bjgqNcbiAqL1xuY2xhc3MgS01VdGx7XG5cbiAgICAvKipcbiAgICAgKiDmlbDlgKTjgavjgq3jg6Pjgrnjg4jjgZnjgovplqLmlbBcbiAgICAgKiDmlbDlgKTku6XlpJbjga8w44KS6L+U44GZPGJyPlxuICAgICAqIEluZmluaXR544KCMOOBqOOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB2YWxcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVmYXVsdHZhbCB2YWzjgYzmlbDlgKTjgavlpInmj5vlh7rmnaXjgarjgYTloLTlkIjjga7jg4fjg5Xjgqnjg6vjg4hcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyB0b051bWJlcih2YWwsIGRlZmF1bHR2YWwgPSAwKSB7XG4gICAgICAgIGxldCB2ID0gcGFyc2VGbG9hdCh2YWwsIDEwKTtcbiAgICAgICAgcmV0dXJuICghaXNGaW5pdGUodikgPyBkZWZhdWx0dmFsIDogdik7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiDmlbDlgKTjgavjgq3jg6Pjgrnjg4jjgZnjgovplqLmlbAgaW505Zu65a6aXG4gICAgICog5pWw5YCk5Lul5aSW44GvMOOCkui/lOOBmTxicj5cbiAgICAgKiBJbmZpbml0eeOCgjDjgajjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdmFsXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlZmF1bHR2YWwgdmFs44GM5pWw5YCk44Gr5aSJ5o+b5Ye65p2l44Gq44GE5aC05ZCI44Gu44OH44OV44Kp44Or44OIXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKi9cbiAgICBzdGF0aWMgdG9JbnROdW1iZXIodmFsLCBkZWZhdWx0dmFsID0gMCkge1xuICAgICAgICBsZXQgdiA9IHBhcnNlSW50KHZhbCwgMTApO1xuICAgICAgICByZXR1cm4gKCFpc0Zpbml0ZSh2KSA/IGRlZmF1bHR2YWwgOiB2KTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIOinkuW6puOBruWNmOS9jeWkieaPm+OAgGRlZ3JlZSA+PiByYWRpYW5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZGVncmVlIOW6plxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHJhZGlhblxuICAgICAqL1xuICAgIHN0YXRpYyBkZWdyZWVUb1JhZGlhbihkZWdyZWUpIHtcbiAgICAgICAgcmV0dXJuIGRlZ3JlZSAqIDAuMDE3NDUzMjkyNTE5OTQzMjk1O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDop5Lluqbjga7ljZjkvY3lpInmj5vjgIByYWRpYW4gPj4gZGVncmVlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGlhbiByYWRpYW7op5JcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSDluqZcbiAgICAgKi9cbiAgICBzdGF0aWMgcmFkaWFuVG9EZWdyZWUocmFkaWFuKSB7XG4gICAgICAgIHJldHVybiByYWRpYW4gLyAwLjAxNzQ1MzI5MjUxOTk0MzI5NTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICog6YCf5bqmIHJwbSAtPnJhZGlhbi9zZWMg44Gr5aSJ5o+bXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJwbVxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHJhZGlhbi9zZWNcbiAgICAgKi9cbiAgICBzdGF0aWMgcnBtVG9SYWRpYW5TZWMocnBtKSB7XG4gICAgICAgIC8v6YCf5bqmIHJwbSAtPnJhZGlhbi9zZWMoTWF0aC5QSSoyLzYwKVxuICAgICAgICByZXR1cm4gcnBtICogMC4xMDQ3MTk3NTUxMTk2NTk3NztcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIDLngrnplpPjga7ot53pm6Ljgajop5LluqbjgpLmsYLjgoHjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZnJvbV94XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGZyb21feVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB0b194XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvX3lcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfVxuICAgICAqL1xuICAgIHN0YXRpYyB0d29Qb2ludERpc3RhbmNlQW5nbGUoZnJvbV94LCBmcm9tX3ksIHRvX3gsIHRvX3kpIHtcbiAgICAgICAgbGV0IGRpc3RhbmNlID0gTWF0aC5zcXJ0KE1hdGgucG93KGZyb21feCAtIHRvX3gsIDIpICsgTWF0aC5wb3coZnJvbV95IC0gdG9feSwgMikpO1xuICAgICAgICBsZXQgcmFkaWFuID0gTWF0aC5hdGFuMihmcm9tX3kgLSB0b195LCBmcm9tX3ggLSB0b194KTtcbiAgICAgICAgcmV0dXJuIHtkaXN0OiBkaXN0YW5jZSwgcmFkaTogcmFkaWFuLCBkZWc6IEtNVXRsLnJhZGlhblRvRGVncmVlKHJhZGlhbil9O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiDjgrPjg57jg7Pjg4njga7jg4Hjgqfjg4Pjgq/jgrXjg6DjgpLoqIjnrpdcbiAgICAgKiBAaWdub3JlXG4gICAgICogQGRlc2Mg5Y+z6YCB44KKIENSQy0xNi1DQ0lUVCAoeDE2ICsgeDEyICsgeDUgKyAxKSBTdGFydDoweDAwMDAgWE9ST3V0OjB4MDAwMCBCeXRlT3JkZXI6TGl0dGxlLUVuZGlhblxuICAgICAqIEBwYXJhbSB1aW50OGFycmF5QnVmZmVyXG4gICAgICogQHJldHVybnMge251bWJlcn1cbiAgICAgKiBAY29uc3RydWN0b3JcbiAgICAgKi9cbiAgICBzdGF0aWMgQ3JlYXRlQ29tbWFuZENoZWNrU3VtQ1JDMTYodWludDhhcnJheUJ1ZmZlcil7XG4gICAgICAgIGNvbnN0IGNyYzE2dGFibGU9IF9fY3JjMTZ0YWJsZTtcbiAgICAgICAgbGV0IGNyYyA9IDA7Ly8gU3RhcnQ6MHgwMDAwXG4gICAgICAgIGxldCBsZW49dWludDhhcnJheUJ1ZmZlci5sZW5ndGg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdWludDhhcnJheUJ1ZmZlci5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGMgPSB1aW50OGFycmF5QnVmZmVyW2ldO1xuICAgICAgICAgICAgY3JjID0gKGNyYyA+PiA4KSBeIGNyYzE2dGFibGVbKGNyYyBeIGMpICYgMHgwMGZmXTtcbiAgICAgICAgfVxuICAgICAgICBjcmM9KChjcmM+PjgpJjB4RkYpfCgoY3JjPDw4KSYweEZGMDApOy8vIEJ5dGVPcmRlcjpMaXR0bGUtRW5kaWFuXG4gICAgICAgIC8vY3JjPTB4RkZGRl5jcmM7Ly9YT1JPdXQ6MHgwMDAwXG4gICAgICAgIHJldHVybiBjcmM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQCMgaW5mbzo6IEtNQ29tQkxFLmpz44GuREVWSUNFIElORk9STUFUSU9OIFNFUlZJQ0Xjga7jg5Hjg7zjgrnjgavkvb/nlKhcbiAgICAgKiB1dGYuanMgLSBVVEYtOCA8PT4gVVRGLTE2IGNvbnZlcnRpb25cbiAgICAgKlxuICAgICAqIEBpZ25vcmVcbiAgICAgKiBAcGFyYW0gYXJyYXlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQGRlc2NcbiAgICAgKiBDb3B5cmlnaHQgKEMpIDE5OTkgTWFzYW5hbyBJenVtbyA8aXpAb25pY29zLmNvLmpwPlxuICAgICAqIFZlcnNpb246IDEuMFxuICAgICAqIExhc3RNb2RpZmllZDogRGVjIDI1IDE5OTlcbiAgICAgKiBUaGlzIGxpYnJhcnkgaXMgZnJlZS4gIFlvdSBjYW4gcmVkaXN0cmlidXRlIGl0IGFuZC9vciBtb2RpZnkgaXQuXG4gICAgICovXG4gICAgc3RhdGljIFV0ZjhBcnJheVRvU3RyKGFycmF5KSB7XG4gICAgICAgIGxldCBvdXQsIGksIGxlbiwgYztcbiAgICAgICAgbGV0IGNoYXIyLCBjaGFyMztcblxuICAgICAgICBvdXQgPSBcIlwiO1xuICAgICAgICBsZW4gPSBhcnJheS5sZW5ndGg7XG4gICAgICAgIGkgPSAwO1xuICAgICAgICB3aGlsZShpIDwgbGVuKSB7XG4gICAgICAgICAgICBjID0gYXJyYXlbaSsrXTtcbiAgICAgICAgICAgIHN3aXRjaChjID4+IDQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOiBjYXNlIDE6IGNhc2UgMjogY2FzZSAzOiBjYXNlIDQ6IGNhc2UgNTogY2FzZSA2OiBjYXNlIDc6XG4gICAgICAgICAgICAgICAgLy8gMHh4eHh4eHhcbiAgICAgICAgICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShjKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDEyOiBjYXNlIDEzOlxuICAgICAgICAgICAgICAgIC8vIDExMHggeHh4eCAgIDEweHggeHh4eFxuICAgICAgICAgICAgICAgIGNoYXIyID0gYXJyYXlbaSsrXTtcbiAgICAgICAgICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAweDFGKSA8PCA2KSB8IChjaGFyMiAmIDB4M0YpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDE0OlxuICAgICAgICAgICAgICAgICAgICAvLyAxMTEwIHh4eHggIDEweHggeHh4eCAgMTB4eCB4eHh4XG4gICAgICAgICAgICAgICAgICAgIGNoYXIyID0gYXJyYXlbaSsrXTtcbiAgICAgICAgICAgICAgICAgICAgY2hhcjMgPSBhcnJheVtpKytdO1xuICAgICAgICAgICAgICAgICAgICBvdXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGMgJiAweDBGKSA8PCAxMikgfFxuICAgICAgICAgICAgICAgICAgICAgICAgKChjaGFyMiAmIDB4M0YpIDw8IDYpIHxcbiAgICAgICAgICAgICAgICAgICAgICAgICgoY2hhcjMgJiAweDNGKSA8PCAwKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEAjIGluZm86OiDjg4fjg5Djg4PjgrDnlKhcbiAgICAgKiB1aW50OEFycmF5ID0+IFVURi0xNiBTdHJpbmdzIGNvbnZlcnRpb25cbiAgICAgKiBAaWdub3JlXG4gICAgICogQHBhcmFtIHVpbnQ4QXJyYXlcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqIEBjb25zdHJ1Y3RvclxuICAgICAqL1xuICAgIHN0YXRpYyBVaW50OEFycmF5VG9IZXhTdHIodWludDhBcnJheSl7XG4gICAgICAgIGlmKCF1aW50OEFycmF5IGluc3RhbmNlb2YgVWludDhBcnJheSl7cmV0dXJuO31cbiAgICAgICAgbGV0IGFyPVtdO1xuICAgICAgICBmb3IobGV0IGk9MDtpPHVpbnQ4QXJyYXkubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBhci5wdXNoKHVpbnQ4QXJyYXlbaV0udG9TdHJpbmcoMTYpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYXIuam9pbignOicpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEAjIGluZm86OlVpbnQ444GuQ29uY2F0XG4gICAgICogQ3JlYXRlcyBhIG5ldyBVaW50OEFycmF5IGJhc2VkIG9uIHR3byBkaWZmZXJlbnQgQXJyYXlCdWZmZXJzXG4gICAgICogQHBhcmFtIHtBcnJheUJ1ZmZlcnN9IHU4QXJyYXkxIFRoZSBmaXJzdCBidWZmZXIuXG4gICAgICogQHBhcmFtIHtBcnJheUJ1ZmZlcnN9IHU4QXJyYXkyIFRoZSBzZWNvbmQgYnVmZmVyLlxuICAgICAqIEByZXR1cm4ge0FycmF5QnVmZmVyc30gVGhlIG5ldyBBcnJheUJ1ZmZlciBjcmVhdGVkIG91dCBvZiB0aGUgdHdvLlxuICAgICAqIEBpZ25vcmVcbiAgICAgKi9cbiAgICBzdGF0aWMgVWludDhBcnJheUNvbmNhdCh1OEFycmF5MSwgdThBcnJheTIpIHtcbiAgICAgICAgbGV0IHRtcCA9IG5ldyBVaW50OEFycmF5KHU4QXJyYXkxLmJ5dGVMZW5ndGggKyB1OEFycmF5Mi5ieXRlTGVuZ3RoKTtcbiAgICAgICAgdG1wLnNldChuZXcgVWludDhBcnJheSh1OEFycmF5MSksIDApO1xuICAgICAgICB0bXAuc2V0KG5ldyBVaW50OEFycmF5KHU4QXJyYXkyKSwgdThBcnJheTEuYnl0ZUxlbmd0aCk7XG4gICAgICAgIHJldHVybiB0bXA7XG4gICAgfVxuXG5cbn1cblxuLyoqXG4gKiBDcmVhdGVDb21tYW5kQ2hlY2tTdW1DUkMxNueUqCBDUkPjg4bjg7zjg5bjg6tcbiAqIEBpZ25vcmVcbiAqIEB0eXBlIHtVaW50MTZBcnJheX1cbiAqIEBwcml2YXRlXG4gKi9cbmNvbnN0IF9fY3JjMTZ0YWJsZT1uZXcgVWludDE2QXJyYXkoW1xuICAgIDAgLCAweDExODkgLCAweDIzMTIgLCAweDMyOWIgLCAweDQ2MjQgLCAweDU3YWQgLCAweDY1MzYgLCAweDc0YmYgLFxuICAgIDB4OGM0OCAsIDB4OWRjMSAsIDB4YWY1YSAsIDB4YmVkMyAsIDB4Y2E2YyAsIDB4ZGJlNSAsIDB4ZTk3ZSAsIDB4ZjhmNyAsXG4gICAgMHgxMDgxICwgMHgwMTA4ICwgMHgzMzkzICwgMHgyMjFhICwgMHg1NmE1ICwgMHg0NzJjICwgMHg3NWI3ICwgMHg2NDNlICxcbiAgICAweDljYzkgLCAweDhkNDAgLCAweGJmZGIgLCAweGFlNTIgLCAweGRhZWQgLCAweGNiNjQgLCAweGY5ZmYgLCAweGU4NzYgLFxuICAgIDB4MjEwMiAsIDB4MzA4YiAsIDB4MDIxMCAsIDB4MTM5OSAsIDB4NjcyNiAsIDB4NzZhZiAsIDB4NDQzNCAsIDB4NTViZCAsXG4gICAgMHhhZDRhICwgMHhiY2MzICwgMHg4ZTU4ICwgMHg5ZmQxICwgMHhlYjZlICwgMHhmYWU3ICwgMHhjODdjICwgMHhkOWY1ICxcbiAgICAweDMxODMgLCAweDIwMGEgLCAweDEyOTEgLCAweDAzMTggLCAweDc3YTcgLCAweDY2MmUgLCAweDU0YjUgLCAweDQ1M2MgLFxuICAgIDB4YmRjYiAsIDB4YWM0MiAsIDB4OWVkOSAsIDB4OGY1MCAsIDB4ZmJlZiAsIDB4ZWE2NiAsIDB4ZDhmZCAsIDB4Yzk3NCAsXG5cbiAgICAweDQyMDQgLCAweDUzOGQgLCAweDYxMTYgLCAweDcwOWYgLCAweDA0MjAgLCAweDE1YTkgLCAweDI3MzIgLCAweDM2YmIgLFxuICAgIDB4Y2U0YyAsIDB4ZGZjNSAsIDB4ZWQ1ZSAsIDB4ZmNkNyAsIDB4ODg2OCAsIDB4OTllMSAsIDB4YWI3YSAsIDB4YmFmMyAsXG4gICAgMHg1Mjg1ICwgMHg0MzBjICwgMHg3MTk3ICwgMHg2MDFlICwgMHgxNGExICwgMHgwNTI4ICwgMHgzN2IzICwgMHgyNjNhICxcbiAgICAweGRlY2QgLCAweGNmNDQgLCAweGZkZGYgLCAweGVjNTYgLCAweDk4ZTkgLCAweDg5NjAgLCAweGJiZmIgLCAweGFhNzIgLFxuICAgIDB4NjMwNiAsIDB4NzI4ZiAsIDB4NDAxNCAsIDB4NTE5ZCAsIDB4MjUyMiAsIDB4MzRhYiAsIDB4MDYzMCAsIDB4MTdiOSAsXG4gICAgMHhlZjRlICwgMHhmZWM3ICwgMHhjYzVjICwgMHhkZGQ1ICwgMHhhOTZhICwgMHhiOGUzICwgMHg4YTc4ICwgMHg5YmYxICxcbiAgICAweDczODcgLCAweDYyMGUgLCAweDUwOTUgLCAweDQxMWMgLCAweDM1YTMgLCAweDI0MmEgLCAweDE2YjEgLCAweDA3MzggLFxuICAgIDB4ZmZjZiAsIDB4ZWU0NiAsIDB4ZGNkZCAsIDB4Y2Q1NCAsIDB4YjllYiAsIDB4YTg2MiAsIDB4OWFmOSAsIDB4OGI3MCAsXG5cbiAgICAweDg0MDggLCAweDk1ODEgLCAweGE3MWEgLCAweGI2OTMgLCAweGMyMmMgLCAweGQzYTUgLCAweGUxM2UgLCAweGYwYjcgLFxuICAgIDB4MDg0MCAsIDB4MTljOSAsIDB4MmI1MiAsIDB4M2FkYiAsIDB4NGU2NCAsIDB4NWZlZCAsIDB4NmQ3NiAsIDB4N2NmZiAsXG4gICAgMHg5NDg5ICwgMHg4NTAwICwgMHhiNzliICwgMHhhNjEyICwgMHhkMmFkICwgMHhjMzI0ICwgMHhmMWJmICwgMHhlMDM2ICxcbiAgICAweDE4YzEgLCAweDA5NDggLCAweDNiZDMgLCAweDJhNWEgLCAweDVlZTUgLCAweDRmNmMgLCAweDdkZjcgLCAweDZjN2UgLFxuICAgIDB4YTUwYSAsIDB4YjQ4MyAsIDB4ODYxOCAsIDB4OTc5MSAsIDB4ZTMyZSAsIDB4ZjJhNyAsIDB4YzAzYyAsIDB4ZDFiNSAsXG4gICAgMHgyOTQyICwgMHgzOGNiICwgMHgwYTUwICwgMHgxYmQ5ICwgMHg2ZjY2ICwgMHg3ZWVmICwgMHg0Yzc0ICwgMHg1ZGZkICxcbiAgICAweGI1OGIgLCAweGE0MDIgLCAweDk2OTkgLCAweDg3MTAgLCAweGYzYWYgLCAweGUyMjYgLCAweGQwYmQgLCAweGMxMzQgLFxuICAgIDB4MzljMyAsIDB4Mjg0YSAsIDB4MWFkMSAsIDB4MGI1OCAsIDB4N2ZlNyAsIDB4NmU2ZSAsIDB4NWNmNSAsIDB4NGQ3YyAsXG5cbiAgICAweGM2MGMgLCAweGQ3ODUgLCAweGU1MWUgLCAweGY0OTcgLCAweDgwMjggLCAweDkxYTEgLCAweGEzM2EgLCAweGIyYjMgLFxuICAgIDB4NGE0NCAsIDB4NWJjZCAsIDB4Njk1NiAsIDB4NzhkZiAsIDB4MGM2MCAsIDB4MWRlOSAsIDB4MmY3MiAsIDB4M2VmYiAsXG4gICAgMHhkNjhkICwgMHhjNzA0ICwgMHhmNTlmICwgMHhlNDE2ICwgMHg5MGE5ICwgMHg4MTIwICwgMHhiM2JiICwgMHhhMjMyICxcbiAgICAweDVhYzUgLCAweDRiNGMgLCAweDc5ZDcgLCAweDY4NWUgLCAweDFjZTEgLCAweDBkNjggLCAweDNmZjMgLCAweDJlN2EgLFxuICAgIDB4ZTcwZSAsIDB4ZjY4NyAsIDB4YzQxYyAsIDB4ZDU5NSAsIDB4YTEyYSAsIDB4YjBhMyAsIDB4ODIzOCAsIDB4OTNiMSAsXG4gICAgMHg2YjQ2ICwgMHg3YWNmICwgMHg0ODU0ICwgMHg1OWRkICwgMHgyZDYyICwgMHgzY2ViICwgMHgwZTcwICwgMHgxZmY5ICxcbiAgICAweGY3OGYgLCAweGU2MDYgLCAweGQ0OWQgLCAweGM1MTQgLCAweGIxYWIgLCAweGEwMjIgLCAweDkyYjkgLCAweDgzMzAgLFxuICAgIDB4N2JjNyAsIDB4NmE0ZSAsIDB4NThkNSAsIDB4NDk1YyAsIDB4M2RlMyAsIDB4MmM2YSAsIDB4MWVmMSAsIDB4MGY3OFxuXSk7XG5cbm1vZHVsZS5leHBvcnRzID0gS01VdGw7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvS01VdGwuanNcbi8vIG1vZHVsZSBpZCA9IDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKioqXG4gKiBLTUNvbVdlYkJMRS5qc1xuICogdmVyc2lvbiAwLjEuMCBhbHBoYVxuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuY29uc3QgS01VdGwgPSByZXF1aXJlKCcuL0tNVXRsJyk7XG5jb25zdCBLTUNvbUJhc2UgPSByZXF1aXJlKCcuL0tNQ29tQmFzZScpO1xuY29uc3QgS01TdHJ1Y3R1cmVzPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzJyk7XG5cbi8qKlxuICogQGNsYXNzZGVzYyDjg5bjg6njgqbjgrbnlKhXZWJCbHVldG9vaOmAmuS/oeOCr+ODqeOCuShjaHJvbWXkvp3lrZgpXG4gKiBAaWdub3JlXG4gKi9cbmNsYXNzIEtNQ29tV2ViQkxFIGV4dGVuZHMgS01Db21CYXNle1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWumuaVsFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9yXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fZGV2aWNlSW5mby50eXBlPVwiV0VCQkxFXCI7XG4gICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljcz17fTtcbiAgICAgICAgdGhpcy5fYmxlU2VuZGluZ1F1ZT1Qcm9taXNlLnJlc29sdmUodHJ1ZSk7XG4gICAgICAgIHRoaXMuX3F1ZUNvdW50PTA7XG4gICAgICAgIFxuICAgICAgICAvL+OCteODvOODk+OCuVVVSURcbiAgICAgICAgdGhpcy5fTU9UT1JfQkxFX1NFUlZJQ0VfVVVJRD0nZjE0MGVhMzUtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJztcblxuICAgICAgICAvL+OCreODo+ODqeOCr+OCv+ODquOCueODhuOCo+OCr+OCuVVVSURcbiAgICAgICAgdGhpcy5fTU9UT1JfQkxFX0NSUz17XG4gICAgICAgICAgICAnTU9UT1JfVFgnOidmMTQwMDAwMS04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLC8v5penIE1PVE9SX0NPTlRST0xcbiAgICAgICAgICAgIC8vJ01PVE9SX0xFRCc6J2YxNDAwMDAzLTg5MzYtNGQzNS1hMGVkLWRmY2Q3OTViYWE4YycsLy/jg6Ljg7zjgr/jg7zjga5MRUTjgpLlj5bjgormibHjgYYgaW5mbzo6IE1PVE9SX0NPTlRST0w6OmJsZUxlZOOBp+S7o+eUqFxuICAgICAgICAgICAgJ01PVE9SX01FQVNVUkVNRU5UJzonZjE0MDAwMDQtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJyxcbiAgICAgICAgICAgICdNT1RPUl9JTVVfTUVBU1VSRU1FTlQnOidmMTQwMDAwNS04OTM2LTRkMzUtYTBlZC1kZmNkNzk1YmFhOGMnLFxuICAgICAgICAgICAgJ01PVE9SX1JYJzonZjE0MDAwMDYtODkzNi00ZDM1LWEwZWQtZGZjZDc5NWJhYThjJywvL+aXpyBNT1RPUl9TRVRUSU5HXG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTPXtcbiAgICAgICAgICAgIFwiU2VydmljZVwiOjB4MTgwYVxuICAgICAgICAgICAgLFwiTWFudWZhY3R1cmVyTmFtZVN0cmluZ1wiOjB4MmEyOVxuICAgICAgICAgICAgLFwiSGFyZHdhcmVSZXZpc2lvblN0cmluZ1wiOjB4MmEyN1xuICAgICAgICAgICAgLFwiRmlybXdhcmVSZXZpc2lvblN0cmluZ1wiOjB4MmEyNlxuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBCTEXliIfmlq3mmYJcbiAgICAgICAgICogQHBhcmFtIGV2ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICB0aGlzLl9vbkJsZUNvbm5lY3Rpb25Mb3N0PShldmUpPT57XG4gICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uaXNDb25uZWN0PWZhbHNlO1xuICAgICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbD1udWxsO1xuICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzQ2hhbmdlX2lzQ29ubmVjdChmYWxzZSk7XG4gICAgICAgfTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIOODouODvOOCv+ODvOWbnui7ouaDheWgseWPl+S/oVxuICAgICAgICAgKiBAcGFyYW0gZXZlXG4gICAgICAgICAqIEBwcml2YXRlXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIE5vdGlmeSBWYWx1ZVxuICAgICAgICAgKiAgYnl0ZVswXS1ieXRlWzNdXHQgICAgYnl0ZVs0XS1ieXRlWzddXHQgICAgICAgIGJ5dGVbOF0tYnl0ZVsxMV1cbiAgICAgICAgICogIGZsb2F0ICogXHRcdCAgICAgICAgZmxvYXQgKiAgICAgICAgICAgICAgICAgZmxvYXQgKlxuICAgICAgICAgKiAgcG9zaXRpb246cmFkaWFuc1x0ICAgIHNwZWVkOnJhZGlhbnMvc2Vjb25kXHR0b3JxdWU6TuODu21cbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29uQmxlTW90b3JNZWFzdXJlbWVudD0oZXZlKT0+e1xuICAgICAgICAgICAgaWYoIWV2ZXx8IWV2ZS50YXJnZXQpe3JldHVybjt9XG4gICAgICAgICAgICBsZXQgZHYgPSBldmUudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgICAgaWYoIShkdiBpbnN0YW5jZW9mIERhdGFWaWV3KSl7cmV0dXJuO30vL2luZm86OndlYiBibHVldG9vaOOBruOBvyBub2RlLmpz44GvaW5zdGFuY2VvZiBCdWZmZXJcbiAgICAgICAgICAgIGxldCBwb3NpdGlvbj1kdi5nZXRGbG9hdDMyKDAsZmFsc2UpO1xuICAgICAgICAgICAgbGV0IHZlbG9jaXR5PWR2LmdldEZsb2F0MzIoNCxmYWxzZSk7XG4gICAgICAgICAgICBsZXQgdG9ycXVlPWR2LmdldEZsb2F0MzIoOCxmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yTWVhc3VyZW1lbnRDQihuZXcgS01TdHJ1Y3R1cmVzLktNUm90U3RhdGUocG9zaXRpb24sdmVsb2NpdHksdG9ycXVlKSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7xJTVXmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIGV2ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKlxuICAgICAgICAgKiBAI05vdGlmeSDjgZfjgZ/jgajjgY3jga7ov5TjgorlgKQpLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIGFjY2VsX3gsIGFjY2VsX3ksIGFjY2VsX3osIHRlbXAsIGd5cm9feCwgZ3lyb195LCBneXJvX3og44GM5YWo44Gm6L+U44Gj44Gm44GP44KL44CC5Y+W5b6X6ZaT6ZqU44GvMTAwbXMg5Zu65a6aXG4gICAgICAgICAqIGJ5dGUoQmlnRW5kaWFuKSAgWzBdWzFdIFsyXVszXSAgWzRdWzVdICAgWzZdWzddXHQgICAgWzhdWzldXHRbMTBdWzExXSAgICBbMTJdWzEzXVxuICAgICAgICAgKiAgICAgICAgICAgICAgICAgIGludDE2X3QgaW50MTZfdCBpbnQxNl90IGludDE2X3QgICAgIGludDE2X3QgaW50MTZfdCBpbnQxNl90XG4gICAgICAgICAqICAgICAgICAgICAgICAgICAgYWNjZWwteCBhY2NlbC15IGFjY2VsLXogdGVtcFx0ICAgIGd5cm8teFx0Z3lyby15XHRneXJvLXpcbiAgICAgICAgICpcbiAgICAgICAgICogaW50MTZfdDotMzIsNzY444CcMzIsNzY4XG4gICAgICAgICAqIOacuuOBruS4iuOBq+ODouODvOOCv+ODvOOCkue9ruOBhOOBn+WgtOWQiOOAgeWKoOmAn+W6puOAgHogPSAxNjAwMCDnqIvluqbjgajjgarjgovjgILvvIjph43lipvmlrnlkJHjga7jgZ/jgoHvvIlcbiAgICAgICAgICpcbiAgICAgICAgICog5Y2Y5L2N5aSJ5o+b77yJLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIOOAgOWKoOmAn+W6piB2YWx1ZSBbR10gPSByYXdfdmFsdWUgKiAyIC8gMzIsNzY3XG4gICAgICAgICAqIOOAgOa4qeW6piB2YWx1ZSBb4oSDXSA9IHJhd192YWx1ZSAvIDMzMy44NyArIDIxLjAwXG4gICAgICAgICAqIOOAgOinkumAn+W6plxuICAgICAgICAgKiDjgIDjgIB2YWx1ZSBbZGVncmVlL3NlY29uZF0gPSByYXdfdmFsdWUgKiAyNTAgLyAzMiw3NjdcbiAgICAgICAgICog44CA44CAdmFsdWUgW3JhZGlhbnMvc2Vjb25kXSA9IHJhd192YWx1ZSAqIDAuMDAwMTMzMTYyMTFcbiAgICAgICAgICpcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29uQmxlSW11TWVhc3VyZW1lbnQ9KGV2ZSk9PntcbiAgICAgICAgICAgIGlmKCFldmV8fCFldmUudGFyZ2V0KXtyZXR1cm47fVxuICAgICAgICAgICAgbGV0IGR2ID0gZXZlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgIGxldCB0ZW1wQ2FsaWJyYXRpb249LTUuNzsvL+a4qeW6puagoeato+WApFxuICAgICAgICAgICAgaWYoIShkdiBpbnN0YW5jZW9mIERhdGFWaWV3KSl7cmV0dXJuO30vL2luZm86OndlYiBibHVldG9vaOOBruOBvyBub2RlLmpz44GvaW5zdGFuY2VvZiBCdWZmZXJcbiAgICAgICAgICAgIC8v5Y2Y5L2N44KS5omx44GE5piT44GE44KI44GG44Gr5aSJ5o+bXG4gICAgICAgICAgICBsZXQgYWNjZWxYPWR2LmdldEludDE2KDAsZmFsc2UpKjIvMzI3Njc7XG4gICAgICAgICAgICBsZXQgYWNjZWxZPWR2LmdldEludDE2KDIsZmFsc2UpKjIvMzI3Njc7XG4gICAgICAgICAgICBsZXQgYWNjZWxaPWR2LmdldEludDE2KDQsZmFsc2UpKjIvMzI3Njc7XG4gICAgICAgICAgICBsZXQgdGVtcD0oZHYuZ2V0SW50MTYoNixmYWxzZSkpIC8gMzMzLjg3ICsgMjEuMDArdGVtcENhbGlicmF0aW9uO1xuICAgICAgICAgICAgbGV0IGd5cm9YPWR2LmdldEludDE2KDgsZmFsc2UpKjI1MC8zMjc2NztcbiAgICAgICAgICAgIGxldCBneXJvWT1kdi5nZXRJbnQxNigxMCxmYWxzZSkqMjUwLzMyNzY3O1xuICAgICAgICAgICAgbGV0IGd5cm9aPWR2LmdldEludDE2KDEyLGZhbHNlKSoyNTAvMzI3Njc7XG5cbiAgICAgICAgICAgIHRoaXMuX29uSW11TWVhc3VyZW1lbnRDQihuZXcgS01TdHJ1Y3R1cmVzLktNSW11U3RhdGUoYWNjZWxYLGFjY2VsWSxhY2NlbFosdGVtcCxneXJvWCxneXJvWSxneXJvWikpO1xuXG4gICAgICAgIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEAjLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgICAqIOODouODvOOCv+ODvOODreOCsOaDheWgseWPluW+l1xuICAgICAgICAgKiBAcGFyYW0ge0J1ZmZlcn0gZGF0YVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBOb3RpZnkgdmFsdWVcbiAgICAgICAgICogYnl0ZVswXVx0Ynl0ZVsxLTJdXHRieXRlWzNdXHRieXRlWzQtN11cdGJ5dGVbOC0xMV1cdGJ5dGVbMTItMTNdXG4gICAgICAgICAqIHVpbnQ4X3Q6dHhfdHlwZVx0dWludDE2X3Q6aWRcdHVpbnQ4X3Q6Y29tbWFuZFx0dWludDMyX3Q6ZXJyb3JDb2RlXHR1aW50MzJfdDppbmZvXHR1aW50MTZfdDpDUkNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX29uQmxlTW90b3JMb2c9KGV2ZSk9PntcbiAgICAgICAgICAgIGlmKCFldmV8fCFldmUudGFyZ2V0KXtyZXR1cm47fVxuICAgICAgICAgICAgbGV0IGR2ID0gZXZlLnRhcmdldC52YWx1ZTtcbiAgICAgICAgICAgIGlmKCEoZHYgaW5zdGFuY2VvZiBEYXRhVmlldykpe3JldHVybjt9Ly9pbmZvOjp3ZWIgYmx1ZXRvb2jjga7jgb8gbm9kZS5qc+OBr2luc3RhbmNlb2YgQnVmZmVyXG4gICAgICAgICAgICBsZXQgdHhUeXBlPWR2LmdldFVpbnQ4KDApOy8v44Ko44Op44O844Ot44Kw44K/44Kk44OXOjB4QkXlm7rlrppcbiAgICAgICAgICAgIGlmKHR4VHlwZSE9PTB4QkUpe3JldHVybjt9XG5cbiAgICAgICAgICAgIGxldCBpZD1kdi5nZXRVaW50MTYoMSxmYWxzZSk7Ly/pgIHkv6FJRFxuICAgICAgICAgICAgbGV0IGNtZElEPWR2LmdldFVpbnQ4KDMsZmFsc2UpO1xuICAgICAgICAgICAgbGV0IGVyckNvZGU9ZHYuZ2V0VWludDMyKDQsZmFsc2UpO1xuICAgICAgICAgICAgbGV0IGluZm89ZHYuZ2V0VWludDMyKDgsZmFsc2UpO1xuICAgICAgICAgICAgLy/jg63jgrDlj5blvpdcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JMb2dDQihuZXcgS01TdHJ1Y3R1cmVzLktNTW90b3JMb2coaWQsbnVsbCxjbWRJRCx0aGlzLl9NT1RPUl9MT0dfRVJST1JDT0RFW2VyckNvZGVdLmlkLHRoaXMuX01PVE9SX0xPR19FUlJPUkNPREVbZXJyQ29kZV0udHlwZSx0aGlzLl9NT1RPUl9MT0dfRVJST1JDT0RFW2VyckNvZGVdLm1zZyxpbmZvKSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIGV2ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKiBAIy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAgICAgKiBOb3RpZnkgdmFsdWVcbiAgICAgICAgICogYnl0ZVswXVx0Ynl0ZVsxXVx0Ynl0ZVsyXVx0Ynl0ZVszXSBieXRlWzRd5Lul6ZmNXHRieXRlW24tMl1cdGJ5dGVbbi0xXVxuICAgICAgICAgKiB1aW50OF90OnR4X3R5cGVcdHVpbnQxNl90OmlkXHR1aW50OF90OnJlZ2lzdGVyXHR1aW50OF90OnZhbHVlXHR1aW50MTZfdDpDUkNcbiAgICAgICAgICogMHg0MFx0dWludDE2X3QgKDJieXRlKSAw772eNjU1MzVcdOODrOOCuOOCueOCv+OCs+ODnuODs+ODiVx044Os44K444K544K/44Gu5YCk77yI44Kz44Oe44Oz44OJ44Gr44KI44Gj44Gm5aSJ44KP44KL77yJXHR1aW50MTZfdCAoMmJ5dGUpIDDvvZ42NTUzNVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fb25CbGVNb3RvclNldHRpbmc9KGV2ZSk9PntcbiAgICAgICAgICAgIGlmKCFldmV8fCFldmUudGFyZ2V0KXtyZXR1cm47fVxuICAgICAgICAgICAgbGV0IGR2ID0gZXZlLnRhcmdldC52YWx1ZTsvLzUrbuODkOOCpOODiOOAgFxuICAgICAgICAgICAgbGV0IHVpbnQ4QXJyYXk9bmV3IFVpbnQ4QXJyYXkoZHYuYnVmZmVyKTsvL2luZm86OuS4gOaXpuOCs+ODlOODvOOBmeOCi+W/heimgeOBjOOBguOCi1xuICAgICAgICAgICAgaWYoIShkdiBpbnN0YW5jZW9mIERhdGFWaWV3KSl7cmV0dXJuO30vL2luZm86OndlYiBibHVldG9vaOOBruOBvyBub2RlLmpz44GvaW5zdGFuY2VvZiBCdWZmZXJcblxuICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tXG4gICAgICAgICAgICAvL+ODh+ODvOOCv+OBrnBhcnNlXG4gICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS1cbiAgICAgICAgICAgIGxldCB0eExlbj1kdi5ieXRlTGVuZ3RoO1xuICAgICAgICAgICAgbGV0IHR4VHlwZT1kdi5nZXRVaW50OCgwKTsvL+ODrOOCuOOCueOCv+aDheWgsemAmuefpeOCs+ODnuODs+ODiUlEIDB4NDDlm7rlrppcbiAgICAgICAgICAgIGlmKHR4VHlwZSE9PTB4NDB8fHR4TGVuPDUpe3JldHVybjt9Ly/jg6zjgrjjgrnjgr/mg4XloLHjgpLlkKvjgb7jgarjgYTjg4fjg7zjgr/jga7noLTmo4RcblxuICAgICAgICAgICAgbGV0IGlkPWR2LmdldFVpbnQxNigxLGZhbHNlKTsvL+mAgeS/oUlEXG4gICAgICAgICAgICBsZXQgcmVnaXN0ZXJDbWQ9ZHYuZ2V0VWludDgoMyk7Ly/jg6zjgrjjgrnjgr/jgrPjg57jg7Pjg4lcbiAgICAgICAgICAgIGxldCBjcmM9ZHYuZ2V0VWludDE2KHR4TGVuLTIsZmFsc2UpOy8vQ1JD44Gu5YCkIOacgOW+jOOBi+OCiTJkeXRlXG5cbiAgICAgICAgICAgIGxldCByZXM9e307XG4gICAgICAgICAgICAvL+OCs+ODnuODs+ODieWIpeOBq+OCiOOCi+ODrOOCuOOCueOCv+OBruWApOOBruWPluW+l1s0LW4gYnl0ZV1cbiAgICAgICAgICAgIGxldCBzdGFydE9mZnNldD00O1xuXG4gICAgICAgICAgICBzd2l0Y2gocmVnaXN0ZXJDbWQpe1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubWF4U3BlZWQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tYXhTcGVlZD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5taW5TcGVlZDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1pblNwZWVkPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmN1cnZlVHlwZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmN1cnZlVHlwZT1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuYWNjOlxuICAgICAgICAgICAgICAgICAgICByZXMuYWNjPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmRlYzpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmRlYz1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tYXhUb3JxdWU6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tYXhUb3JxdWU9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQudGVhY2hpbmdJbnRlcnZhbDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnRlYWNoaW5nSW50ZXJ2YWw9ZHYuZ2V0VWludDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5wbGF5YmFja0ludGVydmFsOlxuICAgICAgICAgICAgICAgICAgICByZXMucGxheWJhY2tJbnRlcnZhbD1kdi5nZXRVaW50MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnFDdXJyZW50UDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnFDdXJyZW50UD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5xQ3VycmVudEk6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5xQ3VycmVudEk9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucUN1cnJlbnREOlxuICAgICAgICAgICAgICAgICAgICByZXMucUN1cnJlbnREPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnNwZWVkUDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnNwZWVkUD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5zcGVlZEk6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5zcGVlZEk9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuc3BlZWREOlxuICAgICAgICAgICAgICAgICAgICByZXMuc3BlZWREPWR2LmdldEZsb2F0MzIoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnBvc2l0aW9uUDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnBvc2l0aW9uUD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWw6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWw9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1vdG9yTWVhc3VyZW1lbnRCeURlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0PWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5pbnRlcmZhY2U6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5pbnRlcmZhY2U9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnJlc3BvbnNlOlxuICAgICAgICAgICAgICAgICAgICByZXMucmVzcG9uc2U9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm93bkNvbG9yOlxuICAgICAgICAgICAgICAgICAgICByZXMub3duQ29sb3I9KCcjMDAwMDAwJyArTnVtYmVyKGR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTw8MTZ8ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQrMSk8PDh8ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQrMikpLnRvU3RyaW5nKDE2KSkuc3Vic3RyKC02KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5pTVVNZWFzdXJlbWVudEludGVydmFsOlxuICAgICAgICAgICAgICAgICAgICByZXMuaU1VTWVhc3VyZW1lbnRJbnRlcnZhbD1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuaU1VTWVhc3VyZW1lbnRCeURlZmF1bHQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5pTVVNZWFzdXJlbWVudEJ5RGVmYXVsdD1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuZGV2aWNlTmFtZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmRldmljZU5hbWU9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcIlwiLCB1aW50OEFycmF5LnNsaWNlKHN0YXJ0T2Zmc2V0LC0yKSk7Ly/lj6/lpInjg5DjgqTjg4jmloflrZdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5kZXZpY2VJbmZvOlxuICAgICAgICAgICAgICAgICAgICByZXMuZGV2aWNlSW5mbz1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFwiXCIsIHVpbnQ4QXJyYXkuc2xpY2Uoc3RhcnRPZmZzZXQsLTIpKTsvL+WPr+WkieODkOOCpOODiOaWh+Wtl1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnNwZWVkOlxuICAgICAgICAgICAgICAgICAgICByZXMuc3BlZWQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQucG9zaXRpb25PZmZzZXQ6XG4gICAgICAgICAgICAgICAgICAgIHJlcy5wb3NpdGlvbk9mZnNldD1kdi5nZXRGbG9hdDMyKHN0YXJ0T2Zmc2V0LGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tb3ZlVG86XG4gICAgICAgICAgICAgICAgICAgIHJlcy5tb3ZlVG89ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuaG9sZDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmhvbGQ9ZHYuZ2V0RmxvYXQzMihzdGFydE9mZnNldCxmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQuc3RhdHVzOlxuICAgICAgICAgICAgICAgICAgICByZXMuc3RhdHVzPWR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC50YXNrc2V0TmFtZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnRhc2tzZXROYW1lPVN0cmluZy5mcm9tQ2hhckNvZGUuYXBwbHkoXCJcIiwgdWludDhBcnJheS5zbGljZShzdGFydE9mZnNldCwtMikpOy8v5Y+v5aSJ44OQ44Kk44OI5paH5a2XXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQudGFza3NldEluZm86XG4gICAgICAgICAgICAgICAgICAgIHJlcy50YXNrc2V0SW5mbz1kdi5nZXRVaW50MTYoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELnRhc2tzZXRVc2FnZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLnRhc2tzZXRVc2FnZT1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubW90aW9uTmFtZTpcbiAgICAgICAgICAgICAgICAgICAgcmVzLm1vdGlvbk5hbWU9U3RyaW5nLmZyb21DaGFyQ29kZS5hcHBseShcIlwiLCB1aW50OEFycmF5LnNsaWNlKHN0YXJ0T2Zmc2V0LC0yKSk7Ly/lj6/lpInjg5DjgqTjg4jmloflrZdcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORC5tb3Rpb25JbmZvOlxuICAgICAgICAgICAgICAgICAgICByZXMubW90aW9uSW5mbz1kdi5nZXRVaW50MTYoc3RhcnRPZmZzZXQsZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELm1vdGlvblVzYWdlOlxuICAgICAgICAgICAgICAgICAgICByZXMubW90aW9uVXNhZ2U9ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmkyQ1NsYXZlQWRkcmVzczpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmkyQ1NsYXZlQWRkcmVzcz1kdi5nZXRVaW50OChzdGFydE9mZnNldCk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgdGhpcy5fTU9UT1JfUlhfUkVBRFJFR0lTVEVSX0NPTU1BTkQubGVkOlxuICAgICAgICAgICAgICAgICAgICByZXMubGVkPXtzdGF0ZTpkdi5nZXRVaW50OChzdGFydE9mZnNldCkscjpkdi5nZXRVaW50OChzdGFydE9mZnNldCsxKSxnOmR2LmdldFVpbnQ4KHN0YXJ0T2Zmc2V0KzIpLGI6ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQrMyl9O1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmVuYWJsZUNoZWNrU3VtOlxuICAgICAgICAgICAgICAgICAgICByZXMuZW5hYmxlQ2hlY2tTdW09ZHYuZ2V0VWludDgoc3RhcnRPZmZzZXQpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIHRoaXMuX01PVE9SX1JYX1JFQURSRUdJU1RFUl9DT01NQU5ELmRldmljZVNlcmlhbDpcbiAgICAgICAgICAgICAgICAgICAgcmVzLmRldmljZVNlcmlhbD1TdHJpbmcuZnJvbUNoYXJDb2RlLmFwcGx5KFwiXCIsIHVpbnQ4QXJyYXkuc2xpY2Uoc3RhcnRPZmZzZXQsLTIpKTsvL+WPr+WkieODkOOCpOODiOaWh+Wtl1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzKTtcblxuICAgICAgICAgICAgdGhpcy5fb25Nb3RvclNldHRpbmdDQihyZWdpc3RlckNtZCxyZXMpO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIHNlY3Rpb246OuWFrOmWi+ODoeOCveODg+ODiVxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiBXZWJCbHVldG9vaOOBp+OBruaOpee2muOCkumWi+Wni+OBmeOCi1xuICAgICAqL1xuICAgIGNvbm5lY3QoKXtcbiAgICAgICAgaWYgKHRoaXMuX3BlcmlwaGVyYWwmJiB0aGlzLl9wZXJpcGhlcmFsLmdhdHQmJnRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5jb25uZWN0ZWQgKSB7cmV0dXJufVxuICAgICAgICBsZXQgZ2F0PSAodGhpcy5fcGVyaXBoZXJhbCYmIHRoaXMuX3BlcmlwaGVyYWwuZ2F0dCApP3RoaXMuX3BlcmlwaGVyYWwuZ2F0dCA6dW5kZWZpbmVkOy8v5YaN5o6l57aa55SoXG4gICAgICAgIHRoaXMuX2JsZUNvbm5lY3QoZ2F0KS50aGVuKG9iaj0+ey8vaW5mbzo6IHJlc29sdmUoe2RldmljZUlELGRldmljZU5hbWUsYmxlRGV2aWNlLGNoYXJhY3RlcmlzdGljc30pO1xuICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbD1vYmouYmxlRGV2aWNlO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5pZD10aGlzLl9wZXJpcGhlcmFsLmlkO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5uYW1lPXRoaXMuX3BlcmlwaGVyYWwubmFtZTtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uaXNDb25uZWN0PXRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5jb25uZWN0ZWQ7XG4gICAgICAgICAgICB0aGlzLl9kZXZpY2VJbmZvLm1hbnVmYWN0dXJlck5hbWU9b2JqLmluZm9tYXRpb24ubWFudWZhY3R1cmVyTmFtZTtcbiAgICAgICAgICAgIHRoaXMuX2RldmljZUluZm8uaGFyZHdhcmVSZXZpc2lvbj1vYmouaW5mb21hdGlvbi5oYXJkd2FyZVJldmlzaW9uO1xuICAgICAgICAgICAgdGhpcy5fZGV2aWNlSW5mby5maXJtd2FyZVJldmlzaW9uPW9iai5pbmZvbWF0aW9uLmZpcm13YXJlUmV2aXNpb247XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzPW9iai5jaGFyYWN0ZXJpc3RpY3M7XG5cbiAgICAgICAgICAgIGlmKCFnYXQpe1xuICAgICAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWwucmVtb3ZlRXZlbnRMaXN0ZW5lcignZ2F0dHNlcnZlcmRpc2Nvbm5lY3RlZCcsdGhpcy5fb25CbGVDb25uZWN0aW9uTG9zdCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcGVyaXBoZXJhbC5hZGRFdmVudExpc3RlbmVyKCdnYXR0c2VydmVyZGlzY29ubmVjdGVkJywgdGhpcy5fb25CbGVDb25uZWN0aW9uTG9zdCk7XG5cbiAgICAgICAgICAgICAgICBpZih0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX01FQVNVUkVNRU5UJ10pe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX01FQVNVUkVNRU5UJ10ucmVtb3ZlRXZlbnRMaXN0ZW5lcignY2hhcmFjdGVyaXN0aWN2YWx1ZWNoYW5nZWQnLHRoaXMuX29uQmxlTW90b3JNZWFzdXJlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfTUVBU1VSRU1FTlQnXS5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3Rvck1lYXN1cmVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9NRUFTVVJFTUVOVCddLnN0YXJ0Tm90aWZpY2F0aW9ucygpLnRoZW4ob2JqPT57XG4gICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfSU1VX01FQVNVUkVNRU5UJ10pe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9JTVVfTUVBU1VSRU1FTlQnXS5yZW1vdmVFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVJbXVNZWFzdXJlbWVudCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCddLmFkZEV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZUltdU1lYXN1cmVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9jaGFyYWN0ZXJpc3RpY3NbJ01PVE9SX0lNVV9NRUFTVVJFTUVOVCddLnN0YXJ0Tm90aWZpY2F0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgfSkudGhlbihvYmo9PntcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9SWCddLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yU2V0dGluZyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9SWCddLnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2NoYXJhY3RlcmlzdGljdmFsdWVjaGFuZ2VkJyx0aGlzLl9vbkJsZU1vdG9yTG9nKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXS5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3RvclNldHRpbmcpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2NoYXJhY3RlcmlzdGljc1snTU9UT1JfUlgnXS5hZGRFdmVudExpc3RlbmVyKCdjaGFyYWN0ZXJpc3RpY3ZhbHVlY2hhbmdlZCcsdGhpcy5fb25CbGVNb3RvckxvZyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5fY2hhcmFjdGVyaXN0aWNzWydNT1RPUl9SWCddLnN0YXJ0Tm90aWZpY2F0aW9ucygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIH0pLnRoZW4ob2JqPT57XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaW5pdCh0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1c0NoYW5nZV9pc0Nvbm5lY3QodHJ1ZSk7Ly/liJ3lm57jga7jgb8oY29tcOS7peWJjeOBr+eZuueBq+OBl+OBquOBhOeCuilcbiAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9zdGF0dXNDaGFuZ2VfaXNDb25uZWN0KHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5jYXRjaChlcnI9PntcbiAgICAgICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9bnVsbDtcbiAgICAgICAgICAgIHRoaXMuX29uQ29ubmVjdEZhaWx1cmVIYW5kbGVyKHRoaXMsZXJyKTtcbiAgICAgICAgfSlcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBXZWJCbHVldG9vaOOBruWIh+aWrVxuICAgICAqL1xuICAgIGRpc0Nvbm5lY3QoKXtcbiAgICAgICBpZiAoIXRoaXMuX3BlcmlwaGVyYWwgfHwgIXRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5jb25uZWN0ZWQpe3JldHVybjt9XG4gICAgICAgIHRoaXMuX3BlcmlwaGVyYWwuZ2F0dC5kaXNjb25uZWN0KCk7XG4gICAgICAgIHRoaXMuX3BlcmlwaGVyYWw9bnVsbDtcblxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWGhemDqFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuICAgIC8qKlxuICAgICAqIEJMReaOpee2mlxuICAgICAqIEBwYXJhbSBnYXR0X29iaiDjg5rjgqLjg6rjg7PjgrDmuIjjgb/jga5HQVRU44Gu44OH44OQ44Kk44K544Gr5YaN5o6l57aa55SoKOODmuOCouODquODs+OCsOODouODvOODgOODq+OBr+WHuuOBquOBhClcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZX1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9ibGVDb25uZWN0KGdhdHRfb2JqKSB7XG4gICAgICAvL2xldCBzZWxmID0gdGhpcztcbiAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAvLyBsZXQgYmxlRGV2aWNlO1xuICAgICAgICAgIC8vIGxldCBkZXZpY2VOYW1lO1xuICAgICAgICAgIC8vIGxldCBkZXZpY2VJRDtcbiAgICAgICAgICBpZighZ2F0dF9vYmope1xuICAgICAgICAgICAgICBsZXQgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgIGZpbHRlcnM6IFt7c2VydmljZXM6IFt0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEXX1dLFxuICAgICAgICAgICAgICAgICAgb3B0aW9uYWxTZXJ2aWNlczpbdGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuU2VydmljZV1cbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgbmF2aWdhdG9yLmJsdWV0b290aC5yZXF1ZXN0RGV2aWNlKG9wdGlvbnMpXG4gICAgICAgICAgICAgICAgICAudGhlbihkZXZpY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX2JsZUdhdGNvbm5lY3QoZGV2aWNlLmdhdHQpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBibGVEZXZpY2U6IGRldmljZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRldmljZUlEOiBkZXZpY2UuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VOYW1lOiBkZXZpY2UubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljczpyZXMuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvbjpyZXMuaW5mb21hdGlvblxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGVycm9yID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgfSlcblxuICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICB0aGlzLl9ibGVHYXRjb25uZWN0KGdhdHRfb2JqKVxuICAgICAgICAgICAgICAgICAgLnRoZW4ocmVzID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIl9ibGVHYXRjb25uZWN0XCIpO1xuICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VJRDogZ2F0dF9vYmouZGV2aWNlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VOYW1lOiBnYXR0X29iai5kZXZpY2UubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYmxlRGV2aWNlOiBnYXR0X29iai5kZXZpY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljczpyZXMuY2hhcmFjdGVyaXN0aWNzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uOnJlcy5pbmZvbWF0aW9uXG5cbiAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyb3IpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9HQVRU5o6l57aa55SoXG4gICAgX2JsZUdhdGNvbm5lY3QoZ2F0dF9vYmope1xuICAgICAgICAgICAgbGV0IGNoYXJhY3RlcmlzdGljcyA9IHt9O1xuICAgICAgICAgICAgbGV0IGluZm9tYXRpb249e307XG4gICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKGdyZXNvbHZlLCBncmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICBnYXR0X29iai5jb25uZWN0KCkudGhlbihzZXJ2ZXIgPT4ge1xuICAgICAgICAgICAgICAgICAgICAvLyByZXR1cm4gc2VydmVyLmdldFByaW1hcnlTZXJ2aWNlcyh0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZlci5nZXRQcmltYXJ5U2VydmljZSh0aGlzLl9NT1RPUl9CTEVfU0VSVklDRV9VVUlEKS50aGVuKHNlcnZpY2UgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjcnMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9NT1RPUl9CTEVfQ1JTKS5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JzLnB1c2goXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuX01PVE9SX0JMRV9DUlNba2V5XSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjaGFyYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNoYXJhY3RlcmlzdGljc1trZXldID0gY2hhcmE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoY3JzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2JsZV9maXJtd2FyZV9yZXZpc2lvbuOBruOCteODvOODk+OCueWPluW+lyBpbmZvOjpBbmRyb2lkZOOBp+OBr+S4jeWuieWumuOBqueCuuWBnOatolxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoc3Jlc29sdmUsIHNyZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2ZXIuZ2V0UHJpbWFyeVNlcnZpY2UodGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuU2VydmljZSkudGhlbigoc2VydmljZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJ2aWNlLmdldENoYXJhY3RlcmlzdGljKHRoaXMuX0RFVklDRV9JTkZPUk1BVElPTl9TRVJWSUNFX1VVSURTLk1hbnVmYWN0dXJlck5hbWVTdHJpbmcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAudGhlbihjaGFyYSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGNoYXJhLnJlYWRWYWx1ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbih2YWwgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5mb21hdGlvblsnbWFudWZhY3R1cmVyTmFtZSddID0gS01VdGwuVXRmOEFycmF5VG9TdHIobmV3IFVpbnQ4QXJyYXkodmFsLmJ1ZmZlcikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntyZWplY3QoZSk7fSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4oKCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VydmljZS5nZXRDaGFyYWN0ZXJpc3RpYyh0aGlzLl9ERVZJQ0VfSU5GT1JNQVRJT05fU0VSVklDRV9VVUlEUy5GaXJtd2FyZVJldmlzaW9uU3RyaW5nKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRoZW4oY2hhcmEgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGFyYS5yZWFkVmFsdWUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLnRoZW4odmFsID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZm9tYXRpb25bJ2Zpcm13YXJlUmV2aXNpb24nXSA9IEtNVXRsLlV0ZjhBcnJheVRvU3RyKG5ldyBVaW50OEFycmF5KHZhbC5idWZmZXIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGUpPT57cmVqZWN0KGUpO30pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKCgpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcnZpY2UuZ2V0Q2hhcmFjdGVyaXN0aWModGhpcy5fREVWSUNFX0lORk9STUFUSU9OX1NFUlZJQ0VfVVVJRFMuSGFyZHdhcmVSZXZpc2lvblN0cmluZylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKGNoYXJhID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gY2hhcmEucmVhZFZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS50aGVuKHZhbCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbmZvbWF0aW9uWydoYXJkd2FyZVJldmlzaW9uJ10gPSBLTVV0bC5VdGY4QXJyYXlUb1N0cihuZXcgVWludDhBcnJheSh2YWwuYnVmZmVyKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pLmNhdGNoKChlKT0+e3JlamVjdChlKTt9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKT0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNyZXNvbHZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSkuY2F0Y2goKGUpPT57XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzcmVqZWN0KGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkudGhlbigoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3Jlc29sdmUoe2NoYXJhY3RlcmlzdGljczogY2hhcmFjdGVyaXN0aWNzLCBpbmZvbWF0aW9uOiBpbmZvbWF0aW9ufSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5jYXRjaCgoZSk9PntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCTEXjgrPjg57jg7Pjg4njga7pgIHkv6FcbiAgICAgKiBAcGFyYW0gY29tbWFuZFR5cGVTdHIgICdNT1RPUl9DT05UUk9MJywnTU9UT1JfTUVBU1VSRU1FTlQnLCdNT1RPUl9JTVVfTUVBU1VSRU1FTlQnLCdNT1RPUl9SWCdcbiAgICAgKiDjgrPjg57jg7Pjg4nnqK7liKXjga5TdHJpbmcg5Li744GrQkxF44Gu44Kt44Oj44Op44Kv44K/44Oq44K544OG44Kj44Kv44K544Gn5L2/55So44GZ44KLXG4gICAgICogQHBhcmFtIGNvbW1hbmROdW1cbiAgICAgKiBAcGFyYW0gYXJyYXlidWZmZXJcbiAgICAgKiBAcGFyYW0gbm90aWZ5UHJvbWlzIGNtZFJlYWRSZWdpc3RlcuetieOBrkJMReWRvOOBs+WHuuOBl+W+jOOBq25vdGlmeeOBp+WPluW+l+OBmeOCi+WApOOCklByb21pc+OBp+W4sOOBmeW/heimgeOBruOBguOCi+OCs+ODnuODs+ODieeUqFxuICAgICAqIEBwYXJhbSBjaWQg44K344O844Kx44Oz44K5SURcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIF9zZW5kTW90b3JDb21tYW5kKGNvbW1hbmRDYXRlZ29yeSwgY29tbWFuZE51bSwgYXJyYXlidWZmZXI9bmV3IEFycmF5QnVmZmVyKDApLCBub3RpZnlQcm9taXM9bnVsbCxjaWQ9bnVsbCl7XG4gICAgICAgIGxldCBjaGFyYWN0ZXJpc3RpY3M9dGhpcy5fY2hhcmFjdGVyaXN0aWNzW2NvbW1hbmRDYXRlZ29yeV07XG4gICAgICAgIGxldCBhYj1uZXcgRGF0YVZpZXcoYXJyYXlidWZmZXIpO1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKGFycmF5YnVmZmVyLmJ5dGVMZW5ndGgrNSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsY29tbWFuZE51bSk7XG4gICAgICAgIGNpZD1jaWQ9PT1udWxsP3RoaXMuY3JlYXRlQ29tbWFuZElEOmNpZDsvL+OCt+ODvOOCseODs+OCuUlEKOODpuODi+ODvOOCr+WApClcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDEsY2lkKTtcbiAgICAgICAgLy/jg4fjg7zjgr/jga7mm7jjgY3ovrzjgb9cbiAgICAgICAgZm9yKGxldCBpPTA7aTxhcnJheWJ1ZmZlci5ieXRlTGVuZ3RoO2krKyl7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgzK2ksYWIuZ2V0VWludDgoaSkpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjcmM9S01VdGwuQ3JlYXRlQ29tbWFuZENoZWNrU3VtQ1JDMTYobmV3IFVpbnQ4QXJyYXkoYnVmZmVyLnNsaWNlKDAsYnVmZmVyLmJ5dGVMZW5ndGgtMikpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KGFycmF5YnVmZmVyLmJ5dGVMZW5ndGgrMyxjcmMpOy8vaW5mbzo6Q1JD6KiI566XXG5cbiAgICAgICAgLy9xdWXjgavov73liqBcbiAgICAgICAvLyArK3RoaXMuX3F1ZUNvdW50O1xuICAgICAgICB0aGlzLl9ibGVTZW5kaW5nUXVlPSB0aGlzLl9ibGVTZW5kaW5nUXVlLnRoZW4oKHJlcyk9PntcbiAgICAgICAgICAvLyAgY29uc29sZS5sb2coXCJfc2VuZE1vdG9yQ29tbWFuZCBxdWVDb3VudDpcIisoLS10aGlzLl9xdWVDb3VudCkpO1xuICAgICAgICAgICAgaWYobm90aWZ5UHJvbWlzKXtcbiAgICAgICAgICAgICAgICBub3RpZnlQcm9taXMuc3RhcnRSZWplY3RUaW1lT3V0Q291bnQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBjaGFyYWN0ZXJpc3RpY3Mud3JpdGVWYWx1ZShidWZmZXIpO1xuICAgICAgICB9KS5jYXRjaChmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgLy/lpLHmlZfmmYLjgIAvL2luZm86OuW+jOe2muOBruOCs+ODnuODs+ODieOBr+W8leOBjee2muOBjeWun+ihjOOBleOCjOOCi1xuICAgICAgICAgIC8vICBjb25zb2xlLmxvZyhcIkVSUiBfc2VuZE1vdG9yQ29tbWFuZDpcIityZXMrXCIgcXVlQ291bnQ6XCIrKC0tdGhpcy5fcXVlQ291bnQpKTtcbiAgICAgICAgICAgIGlmKG5vdGlmeVByb21pcyl7XG4gICAgICAgICAgICAgICAgbm90aWZ5UHJvbWlzLmNhbGxSZWplY3QocmVzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG5cbi8vLy8vL2NsYXNzLy9cbn1cblxubW9kdWxlLmV4cG9ydHMgPUtNQ29tV2ViQkxFO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNQ29tV2ViQkxFLmpzXG4vLyBtb2R1bGUgaWQgPSAyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwiJ3VzZSBzdHJpY3QnO1xuLyoqKlxuICpLTUNvbm5lY3RvckJyb3dzZXIuanNcbiAqIHZlcnNpb24gMC4xLjAgYWxwaGFcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbmdsb2JhbC5LTVV0bD1yZXF1aXJlKCcuL0tNVXRsLmpzJyk7XG5nbG9iYWwuS01WZWN0b3IyPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01WZWN0b3IyO1xuZ2xvYmFsLktNSW11U3RhdGU9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTUltdVN0YXRlO1xuZ2xvYmFsLktNTGVkU3RhdGU9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTUxlZFN0YXRlO1xuZ2xvYmFsLktNUm90U3RhdGU9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMuanMnKS5LTVJvdFN0YXRlO1xuZ2xvYmFsLktNRGV2aWNlSW5mbz1yZXF1aXJlKCcuL0tNU3RydWN0dXJlcy5qcycpLktNRGV2aWNlSW5mbztcbmdsb2JhbC5LTU1vdG9yTG9nPXJlcXVpcmUoJy4vS01TdHJ1Y3R1cmVzLmpzJykuS01Nb3RvckxvZztcbmdsb2JhbC5LTU1vdG9yT25lV2ViQkxFPXJlcXVpcmUoJy4vS01Nb3Rvck9uZVdlYkJMRS5qcycpO1xuXG5cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNQ29ubmVjdG9yQnJvd3NlcldQSy5qc1xuLy8gbW9kdWxlIGlkID0gM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gNFxuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKipcbiAqS01Nb3Rvck9uZVdlYkJMRS5qc1xuICogQ3JlYXRlZCBieSBIYXJhZGEgSGlyb3NoaSBvbiAyMDE3LzEyLzA3LlxuICpcbiAqIENvcHlyaWdodCAoYykgMjAxNyBLZWlnYW4gSW5jLiBodHRwczovL2tlaWdhbi1tb3Rvci5jb20vXG4gKiBUaGlzIHNvZnR3YXJlIGlzIHJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5sZXQgS01Db21XZWJCTEUgPSByZXF1aXJlKCcuL0tNQ29tV2ViQkxFJyk7XG5sZXQgS01Nb3RvckNvbW1hbmRLTU9uZT1yZXF1aXJlKCcuL0tNTW90b3JDb21tYW5kS01PbmUuanMnKTtcblxuLyoqXG4gKiBAY2xhc3NkZXNjIEtNLTHjga5XZWJCbHVldG9vaOaOpee2mueUqCDku67mg7Pjg4fjg5DjgqTjgrlcbiAqL1xuY2xhc3MgS01Nb3Rvck9uZVdlYkJMRSBleHRlbmRzIEtNTW90b3JDb21tYW5kS01PbmV7XG4gICAgLyoqXG4gICAgICogY29uc3RydWN0b3JcbiAgICAgKiBAZXh0ZW5kcyBLTU1vdG9yQ29tbWFuZEtNT25lXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgc3VwZXIoS01Nb3RvckNvbW1hbmRLTU9uZS5LTV9DT05ORUNUX1RZUEUuV0VCQkxFLG5ldyBLTUNvbVdlYkJMRSgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgajmjqXntprjgZnjgotcbiAgICAgKi9cbiAgICBjb25uZWN0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLmNvbm5lY3QoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgajliIfmlq1cbiAgICAgKi9cbiAgICBkaXNDb25uZWN0KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLmRpc0Nvbm5lY3QoKTtcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID1LTU1vdG9yT25lV2ViQkxFO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbGliL0tNTW90b3JPbmVXZWJCTEUuanNcbi8vIG1vZHVsZSBpZCA9IDVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKioqXG4gKiBLTUNvbUJhc2UuanNcbiAqIENyZWF0ZWQgYnkgSGFyYWRhIEhpcm9zaGkgb24gMjAxNy8xMi8wNy5cbiAqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTcgS2VpZ2FuIEluYy4gaHR0cHM6Ly9rZWlnYW4tbW90b3IuY29tL1xuICogVGhpcyBzb2Z0d2FyZSBpcyByZWxlYXNlZCB1bmRlciB0aGUgTUlUIExpY2Vuc2UuXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gKi9cbid1c2Ugc3RyaWN0JztcbmxldCBLTVV0bCA9IHJlcXVpcmUoJy4vS01VdGwnKTtcbmxldCBLTVN0cnVjdHVyZXM9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMnKTtcbi8qKlxuICogQGNsYXNzZGVzYyDpgJrkv6Hjgq/jg6njgrnjga7ln7rlupVcbiAqIEBpZ25vcmVcbiAqL1xuY2xhc3MgS01Db21CYXNle1xuICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5a6a5pWwXG4gICAgKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiBjb25zdHJ1Y3RvcuOAgFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuX2NvbW1hbmRDb3VudD0wO1xuICAgICAgICB0aGlzLl9kZXZpY2VJbmZvPW5ldyBLTVN0cnVjdHVyZXMuS01EZXZpY2VJbmZvKCk7XG5cbiAgICAgICAgdGhpcy5fbW90b3JNZWFzdXJlbWVudD1uZXcgS01TdHJ1Y3R1cmVzLktNUm90U3RhdGUoKTtcbiAgICAgICAgdGhpcy5fbW90b3JMZWQ9bmV3IEtNU3RydWN0dXJlcy5LTUxlZFN0YXRlKCk7XG4gICAgICAgIHRoaXMuX21vdG9ySW11TWVhc3VyZW1lbnQ9bmV3IEtNU3RydWN0dXJlcy5LTUltdVN0YXRlKCk7XG5cbiAgICAgICAgdGhpcy5fb25Jbml0SGFuZGxlcj1mdW5jdGlvbihjb25uZWN0b3Ipe307XG4gICAgICAgIHRoaXMuX29uQ29ubmVjdEhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yKXt9O1xuICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyPWZ1bmN0aW9uKGNvbm5lY3Rvcil7fTtcbiAgICAgICAgdGhpcy5fb25Db25uZWN0RmFpbHVyZUhhbmRsZXI9ZnVuY3Rpb24oY29ubmVjdG9yLCBtc2cpe307XG5cbiAgICAgICAgdGhpcy5fb25Nb3Rvck1lYXN1cmVtZW50Q0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9vbkltdU1lYXN1cmVtZW50Q0I9ZnVuY3Rpb24oKXt9O1xuICAgICAgICB0aGlzLl9vbk1vdG9yU2V0dGluZ0NCPWZ1bmN0aW9uKCl7fTtcbiAgICAgICAgdGhpcy5fb25Nb3RvckxvZ0NCPWZ1bmN0aW9uKCl7fTtcbiAgICAgICAgdGhpcy5faXNJbml0PWZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBfb25CbGVNb3RvclNldHRpbmfjga7jgrPjg57jg7Pjg4njgIDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHjga7pgJrnn6Xlj5fkv6HmmYLjgavjg5Hjg7zjgrnjgZnjgovnlKhcbiAgICAgICAgICogQHR5cGUge3ttYXhTcGVlZDogbnVtYmVyLCBtaW5TcGVlZDogbnVtYmVyLCBjdXJ2ZVR5cGU6IG51bWJlciwgYWNjOiBudW1iZXIsIGRlYzogbnVtYmVyLCBtYXhUb3JxdWU6IG51bWJlciwgcUN1cnJlbnRQOiBudW1iZXIsIHFDdXJyZW50STogbnVtYmVyLCBxQ3VycmVudEQ6IG51bWJlciwgc3BlZWRQOiBudW1iZXIsIHNwZWVkSTogbnVtYmVyLCBzcGVlZEQ6IG51bWJlciwgcG9zaXRpb25QOiBudW1iZXIsIG93bkNvbG9yOiBudW1iZXJ9fVxuICAgICAgICAgKiBAaWdub3JlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9NT1RPUl9SWF9SRUFEUkVHSVNURVJfQ09NTUFORD17XG4gICAgICAgICAgICAgICAgXCJtYXhTcGVlZFwiOjB4MDIsXG4gICAgICAgICAgICAgICAgXCJtaW5TcGVlZFwiOjB4MDMsXG4gICAgICAgICAgICAgICAgXCJjdXJ2ZVR5cGVcIjoweDA1LFxuICAgICAgICAgICAgICAgIFwiYWNjXCI6MHgwNyxcbiAgICAgICAgICAgICAgICBcImRlY1wiOjB4MDgsXG4gICAgICAgICAgICAgICAgXCJtYXhUb3JxdWVcIjoweDBFLFxuICAgICAgICAgICAgICAgIFwidGVhY2hpbmdJbnRlcnZhbFwiOjB4MTYsXG4gICAgICAgICAgICAgICAgXCJwbGF5YmFja0ludGVydmFsXCI6MHgxNyxcbiAgICAgICAgICAgICAgICBcInFDdXJyZW50UFwiOjB4MTgsXG4gICAgICAgICAgICAgICAgXCJxQ3VycmVudElcIjoweDE5LFxuICAgICAgICAgICAgICAgIFwicUN1cnJlbnREXCI6MHgxQSxcbiAgICAgICAgICAgICAgICBcInNwZWVkUFwiOjB4MUIsXG4gICAgICAgICAgICAgICAgXCJzcGVlZElcIjoweDFDLFxuICAgICAgICAgICAgICAgIFwic3BlZWREXCI6MHgxRCxcbiAgICAgICAgICAgICAgICBcInBvc2l0aW9uUFwiOjB4MUUsXG4gICAgICAgICAgICAgICAgXCJtb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxcIjoweDJDLFxuICAgICAgICAgICAgICAgIFwibW90b3JNZWFzdXJlbWVudEJ5RGVmYXVsdFwiOjB4MkQsXG4gICAgICAgICAgICAgICAgXCJpbnRlcmZhY2VcIjoweDJFLFxuICAgICAgICAgICAgICAgIFwicmVzcG9uc2VcIjoweDMwLFxuICAgICAgICAgICAgICAgIFwib3duQ29sb3JcIjoweDNBLFxuICAgICAgICAgICAgICAgIFwiaU1VTWVhc3VyZW1lbnRJbnRlcnZhbFwiOjB4M0MsXG4gICAgICAgICAgICAgICAgXCJpTVVNZWFzdXJlbWVudEJ5RGVmYXVsdFwiOjB4M0QsXG4gICAgICAgICAgICAgICAgXCJkZXZpY2VOYW1lXCI6MHg0NixcbiAgICAgICAgICAgICAgICBcImRldmljZUluZm9cIjoweDQ3LFxuICAgICAgICAgICAgICAgIFwic3BlZWRcIjoweDU4LFxuICAgICAgICAgICAgICAgIFwicG9zaXRpb25PZmZzZXRcIjoweDVCLFxuICAgICAgICAgICAgICAgIFwibW92ZVRvXCI6MHg2NixcbiAgICAgICAgICAgICAgICBcImhvbGRcIjoweDcyLFxuICAgICAgICAgICAgICAgIFwic3RhdHVzXCI6MHg5QSxcbiAgICAgICAgICAgICAgICBcInRhc2tzZXROYW1lXCI6MHhBNSxcbiAgICAgICAgICAgICAgICBcInRhc2tzZXRJbmZvXCI6MHhBNixcbiAgICAgICAgICAgICAgICBcInRhc2tzZXRVc2FnZVwiOjB4QTcsXG4gICAgICAgICAgICAgICAgXCJtb3Rpb25OYW1lXCI6MHhBRixcbiAgICAgICAgICAgICAgICBcIm1vdGlvbkluZm9cIjoweEIwLFxuICAgICAgICAgICAgICAgIFwibW90aW9uVXNhZ2VcIjoweEIxLFxuICAgICAgICAgICAgICAgIFwiaTJDU2xhdmVBZGRyZXNzXCI6MHhDMCxcbiAgICAgICAgICAgICAgICBcImxlZFwiOjB4RTAsXG4gICAgICAgICAgICAgICAgXCJlbmFibGVDaGVja1N1bVwiOjB4RjMsXG4gICAgICAgICAgICAgICAgXCJkZXZpY2VTZXJpYWxcIjoweEZBXG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zjg63jgrDnlKjjgqjjg6njg7zjgrPjg7zjg4nooahcbiAgICAgICAgICogQHR5cGUge3t9fVxuICAgICAgICAgKiBAaWdub3JlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9NT1RPUl9MT0dfRVJST1JDT0RFPXtcbiAgICAgICAgICAgIDA6e2lkOjAsdHlwZTpcIktNX1NVQ0NFU1NcIixtc2c6XCJTdWNjZXNzZnVsIGNvbW1hbmRcIn0sLy/miJDlip/mmYLjgavov5TljbTjgZnjgotcbiAgICAgICAgICAgIDE6e2lkOjEsdHlwZTpcIktNX0VSUk9SX0lOVEVSTkFMXCIsbXNnOlwiSW50ZXJuYWwgRXJyb3JcIn0sLy/lhoXpg6jjgqjjg6njg7xcbiAgICAgICAgICAgIDI6e2lkOjIsdHlwZTpcIktNX0VSUk9SX05PX01FTVwiLG1zZzpcIk5vIE1lbW9yeSBmb3Igb3BlcmF0aW9uXCJ9LC8v44Oh44Oi44Oq5LiN6LazXG4gICAgICAgICAgICAzOntpZDozLHR5cGU6XCJLTV9FUlJPUl9OT1RfRk9VTkRcIixtc2c6XCJOb3QgZm91bmRcIn0sLy/opovjgaTjgYvjgonjgarjgYRcbiAgICAgICAgICAgIDQ6e2lkOjQsdHlwZTpcIktNX0VSUk9SX05PVF9TVVBQT1JURURcIixtc2c6XCJOb3Qgc3VwcG9ydGVkXCJ9LC8v44K144Od44O844OI5aSWXG4gICAgICAgICAgICA1OntpZDo1LHR5cGU6XCJLTV9FUlJPUl9JTlZBTElEX0NPTU1BTkRcIixtc2c6XCJJbnZhbGlkIENvbW1hbmRcIn0sLy/kuI3mraPjgarjgrPjg57jg7Pjg4lcbiAgICAgICAgICAgIDY6e2lkOjYsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfUEFSQU1cIixtc2c6XCJJbnZhbGlkIFBhcmFtZXRlclwifSwvL+S4jeato+OBquW8leaVsFxuICAgICAgICAgICAgNzp7aWQ6Nyx0eXBlOlwiS01fRVJST1JfU1RPUkFHRV9GVUxMXCIsbXNnOlwiU3RvcmFnZSBpcyBmdWxsXCJ9LC8v6KiY6Yyy6aCY5Z+f44GM5LiA5p2vXG4gICAgICAgICAgICA4OntpZDo4LHR5cGU6XCJLTV9FUlJPUl9JTlZBTElEX0ZMQVNIX1NUQVRFXCIsbXNnOlwiSW52YWxpZCBmbGFzaCBzdGF0ZSwgb3BlcmF0aW9uIGRpc2FsbG93ZWQgaW4gdGhpcyBzdGF0ZVwifSwvL+ODleODqeODg+OCt+ODpeOBrueKtuaFi+OBjOS4jeato1xuICAgICAgICAgICAgOTp7aWQ6OSx0eXBlOlwiS01fRVJST1JfSU5WQUxJRF9MRU5HVEhcIixtc2c6XCJJbnZhbGlkIExlbmd0aFwifSwvL+S4jeato+OBquW8leaVsOOBrumVt+OBle+8iOOCteOCpOOCuu+8iVxuICAgICAgICAgICAgMTA6e2lkOjEwLHR5cGU6XCJLTV9FUlJPUl9JTlZBTElEX0NIRUNLU1VNXCIsbXNnOlwiSW52YWxpZCBDaGVjayBTdW0gKFZhbGlkYXRpb24gaXMgZmFpbGVkKVwifSwvL+S4jeato+OBquODgeOCp+ODg+OCr+OCteODoFxuICAgICAgICAgICAgMTM6e2lkOjEzLHR5cGU6XCJLTV9FUlJPUl9USU1FT1VUXCIsbXNnOlwiT3BlcmF0aW9uIHRpbWVkIG91dFwifSwvL+OCv+OCpOODoOOCouOCpuODiFxuICAgICAgICAgICAgMTU6e2lkOjE1LHR5cGU6XCJLTV9FUlJPUl9GT1JCSURERU5cIixtc2c6XCJGb3JiaWRkZW4gT3BlcmF0aW9uXCJ9LC8v5LiN6Kix5Y+v44Gq5pON5L2cXG4gICAgICAgICAgICAxNjp7aWQ6MTYsdHlwZTpcIktNX0VSUk9SX0lOVkFMSURfQUREUlwiLG1zZzpcIkJhZCBNZW1vcnkgQWRkcmVzc1wifSwvL+S4jeato+OBquOCouODieODrOOCueWPgueFp1xuICAgICAgICAgICAgMTc6e2lkOjE3LHR5cGU6XCJLTV9FUlJPUl9CVVNZXCIsbXNnOlwiQnVzeVwifSwvL+ODk+OCuOODvFxuICAgICAgICAgICAgMTg6e2lkOjE4LHR5cGU6XCJLTV9FUlJPUl9SRVNPVVJDRVwiLG1zZzpcIk5vdCBlbm91Z2ggcmVzb3VyY2VzIGZvciBvcGVyYXRpb25cIn0sLy/jg6rjgr3jg7zjgrnkuI3otrNcbiAgICAgICAgICAgIDIwOntpZDoyMCx0eXBlOlwiS01fRVJST1JfTU9UT1JfRElTQUJMRURcIixtc2c6XCJNb3RvciBzdGF0ZSBpcyBkaXNhYmxlZFwifSwvL+ODouODvOOCv+ODvOOBjOWLleS9nOioseWPr+OBleOCjOOBpuOBhOOBquOBhFxuICAgICAgICAgICAgNjA6e2lkOjYwLHR5cGU6XCJLTV9FUlJPUl9ERVZJQ0VfRFJJVkVSXCIsbXNnOlwiS01fRVJST1JfREVWSUNFX0RSSVZFUlwifSwvL+WGheWuueacquWumue+qVxuICAgICAgICAgICAgNjE6e2lkOjYxLHR5cGU6XCJLTV9FUlJPUl9ERVZJQ0VfRkxBU0hcIixtc2c6XCJLTV9FUlJPUl9ERVZJQ0VfRkxBU0hcIn0sLy/lhoXlrrnmnKrlrprnvqlcbiAgICAgICAgICAgIDYyOntpZDo2Mix0eXBlOlwiS01fRVJST1JfREVWSUNFX0xFRFwiLG1zZzpcIktNX0VSUk9SX0RFVklDRV9MRURcIn0sLy/lhoXlrrnmnKrlrprnvqlcbiAgICAgICAgICAgIDYzOntpZDo2Myx0eXBlOlwiS01fRVJST1JfREVWSUNFX0lNVVwiLG1zZzpcIktNX0VSUk9SX0RFVklDRV9JTVVcIn0sLy/lhoXlrrnmnKrlrprnvqlcbiAgICAgICAgICAgIDcwOntpZDo3MCx0eXBlOlwiS01fRVJST1JfTlJGX0RFVklDRVwiLG1zZzpcIkVycm9yIHJlbGF0ZWQgdG8gQkxFIG1vZHVsZSAoblJGNTI4MzIpXCJ9LC8vQkxF44Oi44K444Ol44O844Or44Gu44Ko44Op44O8XG4gICAgICAgICAgICA4MDp7aWQ6ODAsdHlwZTpcIktNX0VSUk9SX1dEVF9FVkVOVFwiLG1zZzpcIldhdGNoIERvZyBUaW1lciBFdmVudFwifSwvL+OCpuOCqeODg+ODgeODieODg+OCsOOCv+OCpOODnuODvOOCpOODmeODs+ODiOOBrueZuuWLle+8iOWGjei1t+WLleebtOWJje+8iVxuICAgICAgICAgICAgODE6e2lkOjgxLHR5cGU6XCJLTV9FUlJPUl9PVkVSX0hFQVRcIixtc2c6XCJPdmVyIEhlYXQgKG92ZXIgdGVtcGVyYXR1cmUpXCJ9Ly/muKnluqbnlbDluLhcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog44OX44Ot44OR44OG44KjXG4gICAgICoqKioqKioqKioqKioqKioqKioqKiovXG4gICAgLyoqXG4gICAgICog44OH44OQ44Kk44K55oOF5aCxXG4gICAgICogQHR5cGUge0tNRGV2aWNlSW5mb31cbiAgICAgKlxuICAgICAqL1xuICAgIGdldCBkZXZpY2VJbmZvKCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9kZXZpY2VJbmZvLkNsb25lKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog5pyJ5Yq554Sh5Yq5XG4gICAgICogQHR5cGUge2Jvb2xlYW59XG4gICAgICovXG4gICAgZ2V0IGlzQ29ubmVjdCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fZGV2aWNlSW5mby5pc0Nvbm5lY3Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Kz44Oe44Oz44OJ6aCG55uj6KaW55So6YCj55Wq44Gu55m66KGMXG4gICAgICogQHR5cGUge251bWJlcn1cbiAgICAgKi9cbiAgICBnZXQgY3JlYXRlQ29tbWFuZElEKCl7XG4gICAgICAgcmV0dXJuIHRoaXMuX2NvbW1hbmRDb3VudD0oKyt0aGlzLl9jb21tYW5kQ291bnQpJjBiMTExMTExMTExMTExMTExMTsvLzY1NTM144Gn44Or44O844OXXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogaXNDb25uZWN044Gu6Kit5a6a5aSJ5pu0KOWtkOOCr+ODqeOCueOBi+OCieS9v+eUqClcbiAgICAgKiBAcGFyYW0ge2Jvb2xlYW59IGJvb2xcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgX3N0YXR1c0NoYW5nZV9pc0Nvbm5lY3QoYm9vbCl7XG4gICAgICAgIHRoaXMuX2RldmljZUluZm8uaXNDb25uZWN0PWJvb2w7XG4gICAgICAgIGlmKHRoaXMuX2lzSW5pdCl7XG4gICAgICAgICAgICBpZihib29sKXtcbiAgICAgICAgICAgICAgICB0aGlzLl9vbkNvbm5lY3RIYW5kbGVyKHRoaXMpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgdGhpcy5fb25EaXNjb25uZWN0SGFuZGxlcih0aGlzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOWIneacn+WMlueKtuaFi+OBruioreWumijlrZDjgq/jg6njgrnjgYvjgonkvb/nlKgpXG4gICAgICogQHBhcmFtIHtib29sZWFufSBib29sXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIF9zdGF0dXNDaGFuZ2VfaW5pdChib29sKXtcbiAgICAgICAgdGhpcy5faXNJbml0PWJvb2w7XG4gICAgICAgIGlmKHRoaXMuX2lzSW5pdCl7XG4gICAgICAgICAgICB0aGlzLl9vbkluaXRIYW5kbGVyKHRoaXMpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqXG4gICAgICogY2FsbGJhY2tcbiAgICAgKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDliJ3mnJ/ljJblrozkuobjgZfjgabliKnnlKjjgafjgY3jgovjgojjgYbjgavjgarjgaPjgZ9cbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oS01Db21CYXNlKX1cbiAgICAgKi9cbiAgICBzZXQgb25Jbml0KGhhbmRsZXJGdW5jdGlvbil7XG4gICAgICAgIGlmKHR5cGVvZiBoYW5kbGVyRnVuY3Rpb24gPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uSW5pdEhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOW/nOetlOODu+WGjeaOpee2muOBq+aIkOWKn+OBl+OBn1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihLTUNvbUJhc2UpfVxuICAgICAqL1xuICAgIHNldCBvbkNvbm5lY3QoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Db25uZWN0SGFuZGxlcj1oYW5kbGVyRnVuY3Rpb247XG4gICAgICAgIH1cbiAgICB9XG4gICAgLyoqXG4gICAgICog5b+c562U44GM54Sh44GP44Gq44Gj44Gf44O75YiH5pat44GV44KM44GfXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKEtNQ29tQmFzZSl9XG4gICAgICovXG4gICAgc2V0IG9uRGlzY29ubmVjdChoYW5kbGVyRnVuY3Rpb24pe1xuICAgICAgICBpZih0eXBlb2YgaGFuZGxlckZ1bmN0aW9uID09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkRpc2Nvbm5lY3RIYW5kbGVyPWhhbmRsZXJGdW5jdGlvbjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDmjqXntprjgavlpLHmlZdcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24oS01Db21CYXNlLHN0cmluZyl9XG4gICAgICovXG4gICAgc2V0IG9uQ29ubmVjdEZhaWx1cmUoaGFuZGxlckZ1bmN0aW9uKXtcbiAgICAgICAgaWYodHlwZW9mIGhhbmRsZXJGdW5jdGlvbiA9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Db25uZWN0RmFpbHVyZUhhbmRsZXI9aGFuZGxlckZ1bmN0aW9uO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44Oi44O844K/44O844Gu5Zue6Lui5oOF5aCxY2FsbGJhY2tcbiAgICAgKiBAdHlwZSB7ZnVuY3Rpb24ocG9zaXRpb246bnVtYmVyLHZlbG9jaXR5Om51bWJlcix0b3JxdWU6bnVtYmVyKX1cbiAgICAgKi9cbiAgICBzZXQgb25Nb3Rvck1lYXN1cmVtZW50KGZ1bmMpe1xuICAgICAgICBpZih0eXBlb2YgZnVuYz09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbk1vdG9yTWVhc3VyZW1lbnRDQj1mdW5jO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBruOCuOODo+OCpOODreaDheWgsWNhbGxiYWNrXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKHthY2NlbFg6bnVtYmVyLGFjY2VsWTpudW1iZXIsYWNjZWxaOm51bWJlcix0ZW1wOm51bWJlcixneXJvWDpudW1iZXIsZ3lyb1k6bnVtYmVyLGd5cm9aOm51bWJlcn0pfVxuICAgICAqL1xuICAgIHNldCBvbkltdU1lYXN1cmVtZW50KGZ1bmMpe1xuICAgICAgICBpZih0eXBlb2YgZnVuYz09PVwiZnVuY3Rpb25cIil7XG4gICAgICAgICAgICB0aGlzLl9vbkltdU1lYXN1cmVtZW50Q0I9ZnVuYztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOioreWumuaDheWgseWPluW+l2NhbGxiYWNrXG4gICAgICogQHR5cGUge2Z1bmN0aW9uKHJlZ2lzdGVyQ21kOm51bWJlcixyZXM6bnVtYmVyKX1cbiAgICAgKi9cbiAgICBzZXQgb25Nb3RvclNldHRpbmcoZnVuYyl7XG4gICAgICAgIGlmKHR5cGVvZiBmdW5jPT09XCJmdW5jdGlvblwiKXtcbiAgICAgICAgICAgIHRoaXMuX29uTW90b3JTZXR0aW5nQ0I9ZnVuYztcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjg63jgrDmg4XloLHlj5blvpdjYWxsYmFja1xuICAgICAqIEB0eXBlIHtmdW5jdGlvbihjbWRJRDpudW1iZXIscmVzOmVycm9ybG9nT2JqZWN0KX1cbiAgICAgKi9cbiAgICBzZXQgb25Nb3RvckxvZyhmdW5jKXtcbiAgICAgICAgaWYodHlwZW9mIGZ1bmM9PT1cImZ1bmN0aW9uXCIpe1xuICAgICAgICAgICAgdGhpcy5fb25Nb3RvckxvZ0NCPWZ1bmM7XG4gICAgICAgIH1cbiAgICB9XG5cbi8vLy8vL2NsYXNzLy9cbn1cblxubW9kdWxlLmV4cG9ydHMgPUtNQ29tQmFzZTtcblxuXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL2xpYi9LTUNvbUJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiLCIvKioqXG4gKiBLTU1vdG9yQ29tbWFuZEtNT25lLmpzXG4gKiBDcmVhdGVkIGJ5IEhhcmFkYSBIaXJvc2hpIG9uIDIwMTcvMTIvMDcuXG4gKlxuICogQ29weXJpZ2h0IChjKSAyMDE3IEtlaWdhbiBJbmMuIGh0dHBzOi8va2VpZ2FuLW1vdG9yLmNvbS9cbiAqIFRoaXMgc29mdHdhcmUgaXMgcmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBMaWNlbnNlLlxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICovXG4ndXNlIHN0cmljdCc7XG5jb25zdCBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKFwiZXZlbnRzXCIpLkV2ZW50RW1pdHRlcjtcbmNvbnN0IEtNVXRsID0gcmVxdWlyZSgnLi9LTVV0bCcpO1xuY29uc3QgS01Db21XZWJCTEUgPSByZXF1aXJlKCcuL0tNQ29tV2ViQkxFJyk7XG5jb25zdCBLTVN0cnVjdHVyZXM9cmVxdWlyZSgnLi9LTVN0cnVjdHVyZXMnKTtcblxuXG4vKipcbiAqIEBjbGFzc2Rlc2MgS00x44Kz44Oe44Oz44OJ6YCB5L+h44Kv44Op44K5XG4gKiBAaWdub3JlXG4gKi9cbmNsYXNzIEtNTW90b3JDb21tYW5kS01PbmUgZXh0ZW5kcyBFdmVudEVtaXR0ZXJ7XG4gICAgLyoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4gICAgICog5a6a5pWwXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuICAgIC8qKlxuICAgICAqIOaOpee2muaWueW8j+WumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFdFQkJMRSAtIDE6V0VCQkxFXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IEJMRSAtIDI6QkxFXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFNFUklBTCAtIDM6U0VSSUFMXG4gICAgICovXG4gICAgc3RhdGljIGdldCBLTV9DT05ORUNUX1RZUEUoKXtcbiAgICAgICAgcmV0dXJuIHtcIldFQkJMRVwiOjEsXCJCTEVcIjoyLFwiU0VSSUFMXCI6M307XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBjbWRQcmVwYXJlUGxheWJhY2tNb3Rpb27jga7plovlp4vkvY3nva7jgqrjg5fjgrfjg6fjg7PlrprmlbBcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAZW51bSB7bnVtYmVyfVxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBTVEFSVF9QT1NJVElPTl9BQlMgLSAwOuiomOaGtuOBleOCjOOBn+mWi+Wni+S9jee9ru+8iOe1tuWvvuW6p+aome+8ieOBi+OCieOCueOCv+ODvOODiFxuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBTVEFSVF9QT1NJVElPTl9DVVJSRU5UIC0gMTrnj77lnKjjga7kvY3nva7jgpLplovlp4vkvY3nva7jgajjgZfjgabjgrnjgr/jg7zjg4hcbiAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZFByZXBhcmVQbGF5YmFja01vdGlvbl9TVEFSVF9QT1NJVElPTigpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnU1RBUlRfUE9TSVRJT05fQUJTJzowLFxuICAgICAgICAgICAgJ1NUQVJUX1BPU0lUSU9OX0NVUlJFTlQnOjFcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogY21kTGVk44GuTEVE44Gu54K554Gv54q25oWL44Kq44OX44K344On44Oz5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTEVEX1NUQVRFX09GRiAtIDA65raI54GvXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IExFRF9TVEFURV9PTl9TT0xJRCAtIDE6TEVE54K554Gv77yI54K554Gv44GX44Gj44Gx44Gq44GX77yJXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IExFRF9TVEFURV9PTl9GTEFTSCAtIDI6TEVE54K55ruF77yI5LiA5a6a6ZaT6ZqU44Gn54K55ruF77yJXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IExFRF9TVEFURV9PTl9ESU0gLSA6M0xFROOBjOOChuOBo+OBj+OCiuaYjua7heOBmeOCi1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgY21kTGVkX0xFRF9TVEFURSgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnTEVEX1NUQVRFX09GRic6MCxcbiAgICAgICAgICAgICdMRURfU1RBVEVfT05fU09MSUQnOjEsXG4gICAgICAgICAgICAnTEVEX1NUQVRFX09OX0ZMQVNIJzoyLFxuICAgICAgICAgICAgJ0xFRF9TVEFURV9PTl9ESU0nOjNcbiAgICAgICAgfTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogY21kQ3VydmVUeXBl44Gu5Yqg5rib6YCf44Kr44O844OW44Kq44OX44K344On44Oz5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gQ1VSVkVfVFlQRV9OT05FIC0gMDrjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT0ZGXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IENVUlZFX1RZUEVfVFJBUEVaT0lEIC0gMTrjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT04g77yI5Y+w5b2i5Yqg5rib6YCf77yJXG4gICAgICovXG4gICAgc3RhdGljIGdldCBjbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRSgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICAnQ1VSVkVfVFlQRV9OT05FJzogMCxcbiAgICAgICAgICAgICdDVVJWRV9UWVBFX1RSQVBFWk9JRCc6MVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNtZE1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbOOBruODouODvOOCv+ODvOa4rOWumuWApOOBruWPluW+l+mWk+malOWumuaVsFxuICAgICAqIEByZWFkb25seVxuICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfNU1TIC0gMDo1TVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8xME1TIC0gMToxME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfMjBNUyAtIDI6MjBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzUwTVMgLSAzOjUwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8xMDBNUyAtIDQ6MTAwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8yMDBNUyAtIDU6MjAwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF81MDBNUyAtIDY6NTAwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8xMDAwTVMgLSA3OjEwMDBNU1xuICAgICAqL1xuICAgIHN0YXRpYyBnZXQgY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUwoKXtcbiAgICAgICAgcmV0dXJue1xuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfNU1TJzogMCxcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzEwTVMnOjEsXG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF8yME1TJzoyLFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfNTBNUyc6MyxcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzEwME1TJzo0LFxuICAgICAgICAgICAgJ01PVE9SX01FQVNfSU5URVJWQUxfMjAwTVMnOjUsXG4gICAgICAgICAgICAnTU9UT1JfTUVBU19JTlRFUlZBTF81MDBNUyc6NixcbiAgICAgICAgICAgICdNT1RPUl9NRUFTX0lOVEVSVkFMXzEwMDBNUyc6N1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBjbWRJTVVNZWFzdXJlbWVudEludGVydmFs44Gu5Yqg6YCf5bqm44O744K444Oj44Kk44Ot5ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqU5a6a5pWwXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQGVudW0ge251bWJlcn1cbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF81TVMgLSAwOjVNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzEwTVMgLSAxOjEwTVNcbiAgICAgKiBAcHJvcGVydHkge251bWJlcn0gTU9UT1JfTUVBU19JTlRFUlZBTF8yME1TIC0gMjoyME1TXG4gICAgICogQHByb3BlcnR5IHtudW1iZXJ9IE1PVE9SX01FQVNfSU5URVJWQUxfNTBNUyAtIDM6NTBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzEwME1TIC0gNDoxMDBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzIwME1TIC0gNToyMDBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzUwME1TIC0gNjo1MDBNU1xuICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBNT1RPUl9NRUFTX0lOVEVSVkFMXzEwMDBNUyAtIDc6MTAwME1TXG4gICAgICovXG4gICAgc3RhdGljIGdldCBjbWRJTVVNZWFzdXJlbWVudEludGVydmFsX0lNVV9NRUFTX0lOVEVSVkFMKCl7XG4gICAgICAgIHJldHVybntcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF81TVMnOiAwLFxuICAgICAgICAgICAgJ0lNVV9NRUFTX0lOVEVSVkFMXzEwTVMnOjEsXG4gICAgICAgICAgICAnSU1VX01FQVNfSU5URVJWQUxfMjBNUyc6MixcbiAgICAgICAgICAgICdJTVVfTUVBU19JTlRFUlZBTF81ME1TJzozLFxuICAgICAgICAgICAgJ0lNVV9NRUFTX0lOVEVSVkFMXzEwME1TJzo0LFxuICAgICAgICAgICAgJ0lNVV9NRUFTX0lOVEVSVkFMXzIwME1TJzo1LFxuICAgICAgICAgICAgJ0lNVV9NRUFTX0lOVEVSVkFMXzUwME1TJzo2LFxuICAgICAgICAgICAgJ0lNVV9NRUFTX0lOVEVSVkFMXzEwMDBNUyc6N1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKlxuICAgICogUmVhZFJlZ2lzdGVy44Gn5Y+W5b6X44GZ44KL5pmC55So44Gu44Kz44Oe44Oz44OJ5byV5pWw5a6a5pWwXG4gICAgKiBAcmVhZG9ubHlcbiAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gbWF4U3BlZWQgLSAyOuacgOWkp+mAn+OBlVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IG1pblNwZWVkIC0gMzrmnIDlsI/pgJ/jgZVcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBjdXJ2ZVR5cGUgLSA1OuWKoOa4m+mAn+absue3mlxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IGFjYyAtIDc65Yqg6YCf5bqmXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gZGVjIC0gODrmuJvpgJ/luqZcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBtYXhUb3JxdWUgLSAxNDrmnIDlpKfjg4jjg6vjgq9cbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBxQ3VycmVudFAgLSAyNDpx6Lu46Zu75rWBUElE44Ky44Kk44OzKFApXG4gICAgKiBAcHJvcGVydHkge251bWJlcn0gcUN1cnJlbnRJIC0gMjU6cei7uOmbu+a1gVBJROOCsuOCpOODsyhJKVxuICAgICogQHByb3BlcnR5IHtudW1iZXJ9IHFDdXJyZW50RCAtIDI2OnHou7jpm7vmtYFQSUTjgrLjgqTjg7MoRClcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzcGVlZFAgLSAyNzrpgJ/luqZQSUTjgrLjgqTjg7MoUClcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzcGVlZEkgLSAyODrpgJ/luqZQSUTjgrLjgqTjg7MoSSlcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBzcGVlZEQgLSAyOTrpgJ/luqZQSUTjgrLjgqTjg7MoRClcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBwb3NpdGlvblAgLSAzMDrkvY3nva5QSUTjgrLjgqTjg7MoUClcbiAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBvd25Db2xvciAtIDU4OuODh+ODkOOCpOOCuUxFROOBruWbuuacieiJslxuICAgICovXG4gICAgc3RhdGljIGdldCBjbWRSZWFkUmVnaXN0ZXJfQ09NTUFORCgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICBcIm1heFNwZWVkXCI6MHgwMixcbiAgICAgICAgICAgIFwibWluU3BlZWRcIjoweDAzLFxuICAgICAgICAgICAgXCJjdXJ2ZVR5cGVcIjoweDA1LFxuICAgICAgICAgICAgXCJhY2NcIjoweDA3LFxuICAgICAgICAgICAgXCJkZWNcIjoweDA4LFxuICAgICAgICAgICAgXCJtYXhUb3JxdWVcIjoweDBFLFxuICAgICAgICAgICAgXCJxQ3VycmVudFBcIjoweDE4LFxuICAgICAgICAgICAgXCJxQ3VycmVudElcIjoweDE5LFxuICAgICAgICAgICAgXCJxQ3VycmVudERcIjoweDFBLFxuICAgICAgICAgICAgXCJzcGVlZFBcIjoweDFCLFxuICAgICAgICAgICAgXCJzcGVlZElcIjoweDFDLFxuICAgICAgICAgICAgXCJzcGVlZERcIjoweDFELFxuICAgICAgICAgICAgXCJwb3NpdGlvblBcIjoweDFFLFxuICAgICAgICAgICAgXCJvd25Db2xvclwiOjB4M0EsXG4gICAgICAgICAgICBcImRldmljZU5hbWVcIjoweDQ2LFxuICAgICAgICAgICAgXCJkZXZpY2VJbmZvXCI6MHg0N1xuICAgICAgICB9O1xuICAgIH1cbiAgICAvKlxuICAgICAgICog44Oi44O844K/44O85Yi25b6h5omL5q6177yI44Kk44Oz44K/44O844OV44Kn44Kk44K577yJ44Gu57WM6Lev5oyH5a6a55So5a6a5pWwXG4gICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAqIEBlbnVtIHtudW1iZXJ9XG4gICAgICAgKiBAcHJvcGVydHkge251bWJlcn0gQkxFIC0gMHgxOkJMRVxuICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IFVTQiAtIDB4MTAwMDpVU0JcbiAgICAgICAqIEBwcm9wZXJ0eSB7bnVtYmVyfSBJMkMgLSAweDEwMDAwOkkyQ1xuICAgICAgICogQHByb3BlcnR5IHtudW1iZXJ9IEhEREJUTiAtIDB4MTAwMDAwMDA654mp55CG44Oc44K/44OzXG4gICAgICAgKi9cbiAgICBzdGF0aWMgZ2V0IGNtZEludGVyZmFjZV9JTlRFUkZBQ0VfVFlQRSgpe1xuICAgICAgICByZXR1cm57XG4gICAgICAgICAgICBcIkJMRVwiOjBiMSxcbiAgICAgICAgICAgIFwiVVNCXCI6MGIxMDAwLFxuICAgICAgICAgICAgXCJJMkNcIjowYjEwMDAwLFxuICAgICAgICAgICAgXCJIRERCVE5cIjowYjEwMDAwMDAwXG4gICAgICAgIH07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIGNvbnN0cnVjdG9y44CAXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLktNX0NPTk5FQ1RfVFlQRX0gY29ubmVjdF90eXBlIOaOpee2muaWueW8j1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBrbWNvbSDpgJrkv6Hjgqrjg5bjgrjjgqfjgq/jg4gge0BsaW5rIEtNQ29tQkxFfSB7QGxpbmsgS01Db21XZWJCTEV9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3Rvcihjb25uZWN0X3R5cGUsa21jb20pe1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjgqTjg5njg7Pjg4jjgr/jgqTjg5flrprmlbBcbiAgICAgICAgICogQHJlYWRvbmx5XG4gICAgICAgICAqIEBlbnVtIHtzdHJpbmd9XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLkVWRU5UX1RZUEU9e1xuICAgICAgICAgICAgLyoqIOWIneacn+WMluWujOS6huaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0tNRGV2aWNlSW5mb30pICovIGluaXQ6XCJpbml0XCIsXG4gICAgICAgICAgICAvKiog5o6l57aa5pmCPGJyPnJldHVybjpmdW5jdGlvbih7S01EZXZpY2VJbmZvfSkgKi8gY29ubmVjdDpcImNvbm5lY3RcIixcbiAgICAgICAgICAgIC8qKiDliIfmlq3mmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtLTURldmljZUluZm99KSAqLyBkaXNjb25uZWN0OlwiZGlzY29ubmVjdFwiLFxuICAgICAgICAgICAgLyoqIOaOpee2muOBq+WkseaVl+aZgjxicj5yZXR1cm46ZnVuY3Rpb24oe0tNRGV2aWNlSW5mb30se21zZ30pICovIGNvbm5lY3RGYWlsdXJlOlwiY29ubmVjdEZhaWx1cmVcIixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zlm57ou6Lmg4XloLHlj5fkv6HmmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtAbGluayBLTVJvdFN0YXRlfSkgKi8gbW90b3JNZWFzdXJlbWVudDpcIm1vdG9yTWVhc3VyZW1lbnRcIixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7xJTVXmg4XloLHlj5fkv6HmmYI8YnI+cmV0dXJuOmZ1bmN0aW9uKHtAbGluayBLTUltdVN0YXRlfSkgKi8gaW11TWVhc3VyZW1lbnQ6XCJpbXVNZWFzdXJlbWVudFwiLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOODreOCsOaDheWgseWPl+S/oeaZgjxicj5yZXR1cm46ZnVuY3Rpb24oe2NtZE5hbWV9LHtlcnJvcmxvZ09iamVjdH0pICovIG1vdG9yTG9nOlwibW90b3JMb2dcIixcbiAgICAgICAgfTtcbiAgICAgICAgT2JqZWN0LmZyZWV6ZSh0aGlzLkVWRU5UX1RZUEUpOy8vaW5mbzo65b6M44GL44KJ44OV44Oq44O844K644GX44Gq44GE44GoanNkb2PjgYznlJ/miJDjgZXjgozjgarjgYTjgIJcbiAgICAgICAgLyoqXG4gICAgICAgICAqIOODouODvOOCv+ODvOOBruWFqOOCs+ODnuODs+ODiVxuICAgICAgICAgKiBAcmVhZG9ubHlcbiAgICAgICAgICogQGVudW0ge251bWJlcn1cbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICogQGlnbm9yZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fTU9UT1JfQ09NTUFORD17XG4gICAgICAgICAgICAvKiog5pyA5aSn6YCf44GV44KS6Kit5a6a44GZ44KLICovIG1heFNwZWVkOjB4MDIsXG4gICAgICAgICAgICAvKiog5pyA5bCP6YCf44GV44KS6Kit5a6a44GZ44KLICovIG1pblNwZWVkOjB4MDMsXG4gICAgICAgICAgICAvKiog5Yqg5rib6YCf5puy57ea44KS6Kit5a6a44GZ44KLICovIGN1cnZlVHlwZToweDA1LFxuICAgICAgICAgICAgLyoqIOWKoOmAn+W6puOCkuioreWumuOBmeOCiyAqLyBhY2M6MHgwNyxcbiAgICAgICAgICAgIC8qKiDmuJvpgJ/luqbjgpLoqK3lrprjgZnjgosgKi8gZGVjOjB4MDgsXG4gICAgICAgICAgICAvKiog5pyA5aSn44OI44Or44Kv44KS6Kit5a6a44GZ44KLICovIG1heFRvcnF1ZToweDBFLFxuICAgICAgICAgICAgLyoqIOODhuOCo+ODvOODgeODs+OCsOmWk+malCAqLyB0ZWFjaGluZ0ludGVydmFsOjB4MTYsXG4gICAgICAgICAgICAvKiog44OX44Os44Kk44OQ44OD44Kv6ZaT6ZqUICovIHBsYXliYWNrSW50ZXJ2YWw6MHgxNyxcbiAgICAgICAgICAgIC8qKiBx6Lu46Zu75rWBUElE44Ky44Kk44OzKFAp44KS6Kit5a6a44GZ44KLICovIHFDdXJyZW50UDoweDE4LFxuICAgICAgICAgICAgLyoqIHHou7jpm7vmtYFQSUTjgrLjgqTjg7MoSSnjgpLoqK3lrprjgZnjgosgKi8gcUN1cnJlbnRJOjB4MTksXG4gICAgICAgICAgICAvKiogcei7uOmbu+a1gVBJROOCsuOCpOODsyhEKeOCkuioreWumuOBmeOCiyAqLyBxQ3VycmVudEQ6MHgxQSxcbiAgICAgICAgICAgIC8qKiDpgJ/luqZQSUTjgrLjgqTjg7MoUCnjgpLoqK3lrprjgZnjgosgKi8gc3BlZWRQOjB4MUIsXG4gICAgICAgICAgICAvKiog6YCf5bqmUElE44Ky44Kk44OzKEkp44KS6Kit5a6a44GZ44KLICovIHNwZWVkSToweDFDLFxuICAgICAgICAgICAgLyoqIOmAn+W6plBJROOCsuOCpOODsyhEKeOCkuioreWumuOBmeOCiyAqLyBzcGVlZEQ6MHgxRCxcbiAgICAgICAgICAgIC8qKiDkvY3nva5QSUTjgrLjgqTjg7MoUCnjgpLoqK3lrprjgZnjgosgKi8gcG9zaXRpb25QOjB4MUUsXG4gICAgICAgICAgICAvKiogUElE44Ky44Kk44Oz44KS44Oq44K744OD44OI44GZ44KLICovIHJlc2V0UElEOjB4MjIsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O85ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqUKFVTQixJMkPjga7jgb8pICovIG1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbDoweDJDLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOa4rOWumuWApOOBruWPluW+l+ioreWumiAqLyBtb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0OjB4MkQsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O85Yi25b6h5omL5q6177yI44Kk44Oz44K/44O844OV44Kn44Kk44K577yJ44Gu6Kit5a6aICovIGludGVyZmFjZToweDJFLFxuXG4gICAgICAgICAgICAvKiog44OH44OQ44Kk44K5TEVE44Gu5Zu65pyJ6Imy44KS6Kit5a6a44GZ44KLICovIG93bkNvbG9yOjB4M0EsXG4gICAgICAgICAgICAvKiogSU1V5ris5a6a5YCk6YCa55+l6ZaT6ZqU77yI5pyJ57ea44Gu44G/77yJICovIGlNVU1lYXN1cmVtZW50SW50ZXJ2YWw6MHgzQyxcbiAgICAgICAgICAgIC8qKiDjg4fjg5Xjgqnjg6vjg4jjgafjga5JTVXmuKzlrprlgKTpgJrnn6VPTi9PRkYgKi8gaU1VTWVhc3VyZW1lbnRCeURlZmF1bHQ6MHgzRCxcblxuICAgICAgICAgICAgLyoqIOaMh+WumuOBruioreWumuWApOOCkuWPluW+l+OBmeOCiyAqLyByZWFkUmVnaXN0ZXI6MHg0MCxcbiAgICAgICAgICAgIC8qKiDlhajjgabjga7oqK3lrprlgKTjgpLjg5Xjg6njg4Pjgrfjg6Xjgavkv53lrZjjgZnjgosgKi8gc2F2ZUFsbFJlZ2lzdGVyczoweDQxLFxuXG4gICAgICAgICAgICAvKiog44OH44OQ44Kk44K544ON44O844Og44Gu5Y+W5b6XICovIHJlYWREZXZpY2VOYW1lOjB4NDYsXG4gICAgICAgICAgICAvKiog44OH44OQ44Kk44K55oOF5aCx44Gu5Y+W5b6XICovIHJlYWREZXZpY2VJbmZvOjB4NDcsXG4gICAgICAgICAgICAvKiog5oyH5a6a44Gu6Kit5a6a5YCk44KS44Oq44K744OD44OI44GZ44KLICovIHJlc2V0UmVnaXN0ZXI6MHg0RSxcbiAgICAgICAgICAgIC8qKiDlhajoqK3lrprlgKTjgpLjg6rjgrvjg4Pjg4jjgZnjgosgKi8gcmVzZXRBbGxSZWdpc3RlcnM6MHg0RixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zjga7li5XkvZzjgpLkuI3oqLHlj6/jgajjgZnjgosgKi8gZGlzYWJsZToweDUwLFxuICAgICAgICAgICAgLyoqIOODouODvOOCv+ODvOWLleS9nOOCkuioseWPr+OBmeOCiyAqLyBlbmFibGU6MHg1MSxcbiAgICAgICAgICAgIC8qKiDpgJ/luqbjga7lpKfjgY3jgZXjgpLoqK3lrprjgZnjgosgKi8gc3BlZWQ6MHg1OCxcbiAgICAgICAgICAgIC8qKiDkvY3nva7jga7jg5fjg6rjgrvjg4Pjg4jjgpLooYzjgYbvvIjljp/ngrnoqK3lrprvvIkgKi8gcHJlc2V0UG9zaXRpb246MHg1QSxcbiAgICAgICAgICAgIC8qKiDkvY3nva7jga7jg5fjg6rjgrvjg4Pjg4jjgavplqLjgZnjgotPRkZTRVTph48gKi8gcmVhZFBvc2l0aW9uT2Zmc2V0OjB4NUIsXG5cbiAgICAgICAgICAgIC8qKiDmraPlm57ou6LjgZnjgovvvIjlj43mmYLoqIjlm57jgorvvIkgKi8gcnVuRm9yd2FyZDoweDYwLFxuICAgICAgICAgICAgLyoqIOmAhuWbnui7ouOBmeOCi++8iOaZguioiOWbnuOCiu+8iSAqLyBydW5SZXZlcnNlOjB4NjEsXG4gICAgICAgICAgICAvKiog57W25a++5L2N572u44Gr56e75YuV44GZ44KLKOmAn+W6puOBguOCiikgKi8gbW92ZVRvUG9zaXRpb25TcGVlZDoweDY1LFxuICAgICAgICAgICAgLyoqIOe1tuWvvuS9jee9ruOBq+enu+WLleOBmeOCiyAqLyBtb3ZlVG9Qb3NpdGlvbjoweDY2LFxuICAgICAgICAgICAgLyoqIOebuOWvvuS9jee9ruOBq+enu+WLleOBmeOCiyjpgJ/luqbjgYLjgoopICovIG1vdmVCeURpc3RhbmNlU3BlZWQ6MHg2NyxcbiAgICAgICAgICAgIC8qKiDnm7jlr77kvY3nva7jgavnp7vli5XjgZnjgosgKi8gbW92ZUJ5RGlzdGFuY2U6MHg2OCxcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zjga7lirHno4HjgpLlgZzmraLjgZnjgosgKi8gZnJlZToweDZDLFxuICAgICAgICAgICAgLyoqIOmAn+W6puOCvOODreOBvuOBp+a4m+mAn+OBl+WBnOatouOBmeOCiyAqLyBzdG9wOjB4NkQsXG4gICAgICAgICAgICAvKiog44OI44Or44Kv5Yi25b6h44KS6KGM44GGICovIGhvbGRUb3JxdWU6MHg3MixcbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jjgpLlrp/ooYzjgZnjgosgKi8gc3RhcnREb2luZ1Rhc2tzZXQ6MHg4MSxcbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jjgpLlgZzmraIgKi8gc3RvcERvaW5nVGFza3NldDoweDgyLFxuICAgICAgICAgICAgLyoqIOODouODvOOCt+ODp+ODs+OCkuWGjeeUn++8iOa6luWCmeOBquOBl++8iSAqLyBzdGFydFBsYXliYWNrTW90aW9uOjB4ODUsXG4gICAgICAgICAgICAvKiog44Oi44O844K344On44Oz5YaN55Sf44KS5YGc5q2i44GZ44KLICovIHN0b3BQbGF5YmFja01vdGlvbjoweDg4LFxuICAgICAgICAgICAgLyoqIOOCreODpeODvOOCkuWBnOatouOBmeOCiyAqLyBwYXVzZVF1ZXVlOjB4OTAsXG4gICAgICAgICAgICAvKiog44Kt44Ol44O844KS5YaN6ZaL44GZ44KLICovIHJlc3VtZVF1ZXVlOjB4OTEsXG4gICAgICAgICAgICAvKiog44Kt44Ol44O844KS5oyH5a6a5pmC6ZaT5YGc5q2i44GX5YaN6ZaL44GZ44KLICovIHdhaXRRdWV1ZToweDkyLFxuICAgICAgICAgICAgLyoqIOOCreODpeODvOOCkuODquOCu+ODg+ODiOOBmeOCiyAqLyByZXNldFF1ZXVlOjB4OTUsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844Gu54q25oWLICovIHJlYWRTdGF0dXM6MHg5QSxcblxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuOCkumWi+Wni+OBmeOCiyAqLyBzdGFydFJlY29yZGluZ1Rhc2tzZXQ6MHhBMCxcbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLjgpLlgZzmraLjgZnjgosgKi8gc3RvcFJlY29yZGluZ1Rhc2tzZXQ6MHhBMixcbiAgICAgICAgICAgIC8qKiDmjIflrprjga7jgr/jgrnjgq/jgrvjg4Pjg4jjgpLliYrpmaTjgZnjgosgKi8gZXJhc2VUYXNrc2V0OjB4QTMsXG4gICAgICAgICAgICAvKiog44K/44K544Kv44K744OD44OI44KS5YWo5YmK6Zmk44GZ44KLICovIGVyYXNlQWxsVGFza3NldDoweEE0LFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOOBruiomOmMsuWQjeioreWumiAqLyBzZXRUYXNrc2V0TmFtZToweEE1LFxuICAgICAgICAgICAgLyoqIOOCv+OCueOCr+OCu+ODg+ODiOWGheWuueaKiuaPoSAqLyByZWFkVGFza3NldEluZm86MHhBNixcbiAgICAgICAgICAgIC8qKiDjgr/jgrnjgq/jgrvjg4Pjg4jkvb/nlKjnirbms4Hmiormj6EgKi8gcmVhZFRhc2tzZXRVc2FnZToweEE3LFxuICAgICAgICAgICAgLyoqIOODgOOCpOODrOOCr+ODiOODhuOCo+ODvOODgeODs+OCsOmWi+Wni++8iOa6luWCmeOBquOBl++8iSAqLyBzdGFydFRlYWNoaW5nTW90aW9uOjB4QTksXG4gICAgICAgICAgICAvKiog44OG44Kj44O844OB44Oz44Kw44KS5YGc5q2i44GZ44KLICovIHN0b3BUZWFjaGluZ01vdGlvbjoweEFDLFxuICAgICAgICAgICAgLyoqIOODhuOCo+ODvOODgeODs+OCsOOBp+immuOBiOOBn+WLleS9nOOCkuWJiumZpOOBmeOCiyAqLyBlcmFzZU1vdGlvbjoweEFELFxuICAgICAgICAgICAgLyoqIOODhuOCo+ODvOODgeODs+OCsOOBp+immuOBiOOBn+WFqOWLleS9nOOCkuWJiumZpOOBmeOCiyAqLyBlcmFzZUFsbE1vdGlvbjoweEFFLFxuICAgICAgICAgICAgLyoqIEkyQ+OCueODrOODvOODluOCouODieODrOOCuSAqLyBzZXRJMkNTbGF2ZUFkZHJlc3M6MHhDMCxcbiAgICAgICAgICAgIC8qKiBMRUTjga7ngrnnga/nirbmhYvjgpLjgrvjg4Pjg4jjgZnjgosgKi8gbGVkOjB4RTAsXG4gICAgICAgICAgICAvKiog44Oi44O844K/44O844Gu5ris5a6a5YCk5Y+W5b6X77yI6YCa55+l77yJ44KS6ZaL5aeLICovIGVuYWJsZU1vdG9yTWVhc3VyZW1lbnQ6MHhFNixcbiAgICAgICAgICAgIC8qKiDjg6Ljg7zjgr/jg7zjga7muKzlrprlgKTlj5blvpfvvIjpgJrnn6XvvInjgpLplovlp4sgKi8gZGlzYWJsZU1vdG9yTWVhc3VyZW1lbnQ6MHhFNyxcbiAgICAgICAgICAgIC8qKiBJTVXjga7lgKTlj5blvpco6YCa55+lKeOCkumWi+Wni+OBmeOCiyAqLyBlbmFibGVJTVVNZWFzdXJlbWVudDoweEVBLFxuICAgICAgICAgICAgLyoqIElNVeOBruWApOWPluW+lyjpgJrnn6Up44KS5YGc5q2i44GZ44KLICovIGRpc2FibGVJTVVNZWFzdXJlbWVudDoweEVCLFxuXG4gICAgICAgICAgICAvKiog44K344K544OG44Og44KS5YaN6LW35YuV44GZ44KLICovIHJlYm9vdDoweEYwLFxuICAgICAgICAgICAgLyoqIOODgeOCp+ODg+OCr+OCteODoO+8iENSQzE2KSDmnInlirnljJYgKi8gZW5hYmxlQ2hlY2tTdW06MHhGMyxcbiAgICAgICAgICAgIC8qKiDjg5XjgqHjg7zjg6DjgqbjgqfjgqLjgqLjg4Pjg5fjg4fjg7zjg4jjg6Ljg7zjg4njgavlhaXjgosgKi8gZW50ZXJEZXZpY2VGaXJtd2FyZVVwZGF0ZToweEZEXG4gICAgICAgIH07XG4gICAgICAgIE9iamVjdC5mcmVlemUodGhpcy5fTU9UT1JfQ09NTUFORCk7Ly9pbmZvOjrlvozjgYvjgonjg5Xjg6rjg7zjgrrjgZfjgarjgYTjgahqc2RvY+OBjOeUn+aIkOOBleOCjOOBquOBhOOAglxuXG4gICAgICAgIC8v44Oi44O844K/44O844Gu5YWo44Kz44Oe44Oz44OJ77yI6YCG5byV55So77yJXG4gICAgICAgIHRoaXMuX1JFVl9NT1RPUl9DT01NQU5EPXt9O1xuICAgICAgICBPYmplY3Qua2V5cyh0aGlzLl9NT1RPUl9DT01NQU5EKS5mb3JFYWNoKChrKT0+e3RoaXMuX1JFVl9NT1RPUl9DT01NQU5EW3RoaXMuX01PVE9SX0NPTU1BTkRba11dPWs7fSk7XG4gICAgICAgIC8vU2VuZE5vdGlmeVByb21pc+OBruODquOCueODiFxuICAgICAgICB0aGlzLl9ub3RpZnlQcm9taXNMaXN0PVtdO1xuICAgICAgICB0aGlzLmNtZFByZXBhcmVQbGF5YmFja01vdGlvbl9TVEFSVF9QT1NJVElPTj10aGlzLmNvbnN0cnVjdG9yLmNtZFByZXBhcmVQbGF5YmFja01vdGlvbl9TVEFSVF9QT1NJVElPTjtcbiAgICAgICAgdGhpcy5jbWRMZWRfTEVEX1NUQVRFPXRoaXMuY29uc3RydWN0b3IuY21kTGVkX0xFRF9TVEFURTtcbiAgICAgICAgdGhpcy5jbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRT10aGlzLmNvbnN0cnVjdG9yLmNtZEN1cnZlVHlwZV9DVVJWRV9UWVBFO1xuICAgICAgICB0aGlzLmNtZE1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbF9NT1RPUl9NRUFTX0lOVEVSVkFMPXRoaXMuY29uc3RydWN0b3IuY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUw7XG4gICAgICAgIHRoaXMuY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbF9JTVVfTUVBU19JTlRFUlZBTD10aGlzLmNvbnN0cnVjdG9yLmNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUw7XG4gICAgICAgIHRoaXMuY21kSW50ZXJmYWNlX0lOVEVSRkFDRV9UWVBFPXRoaXMuY29uc3RydWN0b3IuY21kSW50ZXJmYWNlX0lOVEVSRkFDRV9UWVBFO1xuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgICAgIC8vIHNlY3Rpb246OmVudHJ5IHBvaW50XG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgICAgdGhpcy5fY29ubmVjdFR5cGU9Y29ubmVjdF90eXBlO1xuICAgICAgICB0aGlzLl9LTUNvbT1rbWNvbTtcblxuICAgICAgICAvL+WGhemDqOOCpOODmeODs+ODiOODkOOCpOODs+ODiVxuICAgICAgICB0aGlzLl9LTUNvbS5vbkluaXQ9KGNvbm5lY3Rvcik9PntcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUuaW5pdCxjb25uZWN0b3IuZGV2aWNlSW5mbyk7Ly/jg4fjg5DjgqTjgrnmg4XloLHjgpLov5TjgZlcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fS01Db20ub25Db25uZWN0PShjb25uZWN0b3IpPT57XG4gICAgICAgICAgICB0aGlzLmVtaXQodGhpcy5FVkVOVF9UWVBFLmNvbm5lY3QsY29ubmVjdG9yLmRldmljZUluZm8pO1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9LTUNvbS5vbkRpc2Nvbm5lY3Q9KGNvbm5lY3Rvcik9PntcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUuZGlzY29ubmVjdCxjb25uZWN0b3IuZGV2aWNlSW5mbyk7XG4gICAgICAgIH07XG4gICAgICAgIHRoaXMuX0tNQ29tLm9uQ29ubmVjdEZhaWx1cmU9KGNvbm5lY3RvciwgZXJyKT0+e1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5jb25uZWN0RmFpbHVyZSxjb25uZWN0b3IuZGV2aWNlSW5mbyxlcnIpO1xuICAgICAgICB9O1xuICAgICAgICAvKipcbiAgICAgICAgICog44Oi44O844K/44O85Zue6Lui5oOF5aCx5Y+X5L+hXG4gICAgICAgICAqIEBwYXJhbSB7S01Sb3RTdGF0ZX0gcm90U3RhdGVcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uTW90b3JNZWFzdXJlbWVudD0ocm90U3RhdGUpPT57XG4gICAgICAgICAgICAvL2xldCByb3RTdGF0ZT1uZXcgS01TdHJ1Y3R1cmVzLktNUm90U3RhdGUocmVzLnBvc2l0aW9uLHJlcy52ZWxvY2l0eSxyZXMudG9ycXVlKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUubW90b3JNZWFzdXJlbWVudCxyb3RTdGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7xJTVXmg4XloLHlj5fkv6FcbiAgICAgICAgICogQHBhcmFtIHtLTUltdVN0YXRlfSBpbXVTdGF0ZVxuICAgICAgICAgKiBAcHJpdmF0ZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fS01Db20ub25JbXVNZWFzdXJlbWVudD0oaW11U3RhdGUpPT57XG4gICAgICAgICAgICAvL2xldCBpbXVTdGF0ZT1uZXcgS01TdHJ1Y3R1cmVzLktNSW11U3RhdGUocmVzLmFjY2VsWCxyZXMuYWNjZWxZLHJlcy5hY2NlbFoscmVzLnRlbXAscmVzLmd5cm9YLHJlcy5neXJvWSxyZXMuZ3lyb1opO1xuICAgICAgICAgICAgdGhpcy5lbWl0KHRoaXMuRVZFTlRfVFlQRS5pbXVNZWFzdXJlbWVudCxpbXVTdGF0ZSk7XG4gICAgICAgIH07XG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zjg63jgrDmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IGNtZElEXG4gICAgICAgICAqIEBwYXJhbSB7S01Nb3RvckxvZ30gbW90b3JMb2dcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uTW90b3JMb2c9KG1vdG9yTG9nKT0+e1xuICAgICAgICAgICAgLy/jgrPjg57jg7Pjg4lJROOBi+OCieOCs+ODnuODs+ODieWQjeOCkuWPluW+l+i/veWKoFxuICAgICAgICAgICAgbGV0IGNtZE5hbWU9dGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbbW90b3JMb2cuY21kSURdP3RoaXMuX1JFVl9NT1RPUl9DT01NQU5EW21vdG9yTG9nLmNtZElEXTptb3RvckxvZy5jbWRJRDtcbiAgICAgICAgICAgIG1vdG9yTG9nLmNtZE5hbWU9Y21kTmFtZTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCh0aGlzLkVWRU5UX1RZUEUubW90b3JMb2csbW90b3JMb2cpO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiDjg6Ljg7zjgr/jg7zoqK3lrprmg4XloLHlj5blvpdcbiAgICAgICAgICogQHBhcmFtIHtudW1iZXJ9IHJlZ2lzdGVyQ21kXG4gICAgICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZXNcbiAgICAgICAgICogQHByaXZhdGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX0tNQ29tLm9uTW90b3JTZXR0aW5nPShyZWdpc3RlckNtZCwgcmVzKT0+e1xuICAgICAgICAgICAgX0tNTm90aWZ5UHJvbWlzLnNlbmRHcm91cE5vdGlmeVJlc29sdmUodGhpcy5fbm90aWZ5UHJvbWlzTGlzdCxyZWdpc3RlckNtZCxyZXMpO1xuICAgICAgICB9O1xuXG4gICAgfVxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOODl+ODreODkeODhuOCo1xuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zjgajjga7mjqXntprjgYzmnInlirnjgYtcbiAgICAgKiBAcmVhZG9ubHlcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn1cbiAgICAgKi9cbiAgICBnZXQgaXNDb25uZWN0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLl9LTUNvbS5kZXZpY2VJbmZvLmlzQ29ubmVjdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICog5o6l57aa5pa55byPXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge0tNTW90b3JDb21tYW5kS01PbmUuS01fQ09OTkVDVF9UWVBFfVxuICAgICAqL1xuICAgIGdldCBjb25uZWN0VHlwZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fY29ubmVjdFR5cGU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICog44OH44OQ44Kk44K55oOF5aCxXG4gICAgICogQHJlYWRvbmx5XG4gICAgICogQHR5cGUge0tNRGV2aWNlSW5mb31cbiAgICAgKi9cbiAgICBnZXQgZGV2aWNlSW5mbygpe1xuICAgICAgICByZXR1cm4gdGhpcy5fS01Db20uZGV2aWNlSW5mbztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiDjg6Ljg7zjgr/jg7zlkI1cbiAgICAgKiBAcmV0dXJucyB7Kn1cbiAgICAgKi9cbiAgICBnZXQgbmFtZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5fS01Db20uZGV2aWNlSW5mbz90aGlzLl9LTUNvbS5kZXZpY2VJbmZvLm5hbWU6bnVsbDtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIOaOpee2muOCs+ODjeOCr+OCv+ODvFxuICAgICAqIEBwcml2YXRlXG4gICAgICogQHR5cGUge0tNQ29tQmFzZX1cbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgZ2V0IGNvbm5lY3Rvcigpe1xuICAgICAgICByZXR1cm4gIHRoaXMuX0tNQ29tO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIHNlY3Rpb246OuODouODvOOCv+ODvOOCs+ODnuODs+ODiSBodHRwczovL2RvY3VtZW50LmtlaWdhbi1tb3Rvci5jb20vbW90b3ItY29udHJvbC1jb21tYW5kL21vdG9yX2FjdGlvbi5odG1sXG4gICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O85YuV5L2c44KS5LiN6Kix5Y+v44Go44GZ44KL77yI5LiK5L2N5ZG95Luk77yJXG4gICAgICogQGRlc2Mg5a6J5YWo55So77ya44GT44Gu5ZG95Luk44KS5YWl44KM44KL44Go44Oi44O844K/44O844Gv5YuV5L2c44GX44Gq44GEPGJyPlxuICAgICAqIOOCs+ODnuODs+ODieOBr+OCv+OCueOCr+OCu+ODg+ODiOOBq+iomOmMsuOBmeOCi+OBk+OBqOOBr+S4jeWPr1xuICAgICAqL1xuICAgIGNtZERpc2FibGUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmRpc2FibGUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOWLleS9nOOCkuioseWPr+OBmeOCi++8iOS4iuS9jeWRveS7pO+8iVxuICAgICAqIEBkZXNjIOWuieWFqOeUqO+8muOBk+OBruWRveS7pOOCkuWFpeOCjOOCi+OBqOODouODvOOCv+ODvOOBr+WLleS9nOWPr+iDveOBqOOBquOCizxicj5cbiAgICAgKiDjg6Ljg7zjgr/jg7zotbfli5XmmYLjga8gZGlzYWJsZSDnirbmhYvjga7jgZ/jgoHjgIHmnKzjgrPjg57jg7Pjg4njgafli5XkvZzjgpLoqLHlj6/jgZnjgovlv4XopoHjgYzjgYLjgoo8YnI+XG4gICAgICog44Kz44Oe44Oz44OJ44Gv44K/44K544Kv44K744OD44OI44Gr6KiY6Yyy44GZ44KL44GT44Go44Gv5LiN5Y+vXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRFbmFibGUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVuYWJsZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOmAn+W6puOBruWkp+OBjeOBleOCkuOCu+ODg+ODiOOBmeOCi++8iOWNmOS9jeezu++8mlJQTe+8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZF9ycG0gZmxvYXQgIFswLVggcnBtXeOAgCjmraPjga7mlbApXG4gICAgICovXG4gICAgY21kU3BlZWRfcnBtKHNwZWVkX3JwbSA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChzcGVlZF9ycG0qMC4xMDQ3MTk3NTUxMTk2NTk3NywxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNwZWVkLGJ1ZmZlcik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOmAn+W6puOBruWkp+OBjeOBleOCkuOCu+ODg+ODiOOBmeOCi++8iOWNmOS9jeezu++8muODqeOCuOOCouODs++8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCBmbG9hdCDpgJ/luqbjga7lpKfjgY3jgZUg5Y2Y5L2N77ya6KeS5bqm77yI44Op44K444Ki44Oz77yJL+enkiBbMC1YIHJwc13jgIAo5q2j44Gu5pWwKVxuICAgICAqL1xuICAgIGNtZFNwZWVkKHNwZWVkID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDkvY3nva7jga7jg5fjg6rjgrvjg4Pjg4jjgpLooYzjgYbvvIjljp/ngrnoqK3lrprvvInvvIjljZjkvY3ns7vvvJrjg6njgrjjgqLjg7PvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb24gZmxvYXQg57W25a++6KeS5bqm77yacmFkaWFuc1xuICAgICAqL1xuICAgIGNtZFByZXNldFBvc2l0aW9uKHBvc2l0aW9uID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KEtNVXRsLnRvTnVtYmVyKHBvc2l0aW9uKSwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucHJlc2V0UG9zaXRpb24sYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5L2N572u44Gu44OX44Oq44K744OD44OI44Gr6Zai44GZ44KLT0ZGU0VU6YePXG4gICAgICogQGRlc2Mg5L2N572u44Gu44Kq44OV44K744OD44OI6YeP77yIcHJlc2V0UG9zaXRpb27jgafoqK3lrprjgZfjgZ/lgKTjgavlr77lv5zvvInjgpLoqq3jgb/lj5bjgotcbiAgICAgKiBAcmV0dXJucyB7UHJvbWlzZTxpbnR8QXJyYXk+fVxuICAgICAqL1xuICAgIGNtZFJlYWRQb3NpdGlvbk9mZnNldCgpe1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRSZWFkUmVnaXN0ZXIodGhpcy5fTU9UT1JfQ09NTUFORC5yZWFkUG9zaXRpb25PZmZzZXQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOato+Wbnui7ouOBmeOCi++8iOWPjeaZguioiOWbnuOCiu+8iVxuICAgICAqIEBkZXNjIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBp+OAgeato+Wbnui7olxuICAgICAqL1xuICAgIGNtZFJ1bkZvcndhcmQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJ1bkZvcndhcmQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOmAhuWbnui7ouOBmeOCi++8iOaZguioiOWbnuOCiu+8iVxuICAgICAqIEBkZXNjIGNtZFNwZWVkIOOBp+S/neWtmOOBleOCjOOBn+mAn+W6puOBp+OAgemAhuWbnui7olxuICAgICAqL1xuICAgIGNtZFJ1blJldmVyc2UoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJ1blJldmVyc2UpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOe1tuWvvuS9jee9ruOBq+enu+WLleOBmeOCi1xuICAgICAqIEBkZXNjIOmAn+OBleOBryBjbWRTcGVlZCDjgafkv53lrZjjgZXjgozjgZ/pgJ/luqbjgYzmjqHnlKjjgZXjgozjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcG9zaXRpb24gZmxvYXQg6KeS5bqm77yacmFkaWFuc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZCBmbG9hdCDpgJ/luqbjga7lpKfjgY3jgZUg5Y2Y5L2N77ya6KeS5bqm77yI44Op44K444Ki44Oz77yJL+enkiBbMC1YIHJwc13jgIAo5q2j44Gu5pWwKVxuICAgICAqL1xuICAgIGNtZE1vdmVUb1Bvc2l0aW9uKHBvc2l0aW9uLHNwZWVkPW51bGwpe1xuICAgICAgICBpZihwb3NpdGlvbj09PSB1bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGlmKHNwZWVkIT09bnVsbCl7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDgpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQocG9zaXRpb24sMTApKTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoNCxwYXJzZUZsb2F0KHNwZWVkLDEwKSk7XG4gICAgICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQubW92ZVRvUG9zaXRpb25TcGVlZCxidWZmZXIpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAscGFyc2VGbG9hdChwb3NpdGlvbiwxMCkpO1xuICAgICAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVUb1Bvc2l0aW9uLGJ1ZmZlcik7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDnm7jlr77kvY3nva7jgavnp7vli5XjgZnjgotcbiAgICAgKiBAZGVzYyDpgJ/jgZXjga8gY21kU3BlZWQg44Gn5L+d5a2Y44GV44KM44Gf6YCf5bqm44GM5o6h55So44GV44KM44KLXG4gICAgICogQHBhcmFtICB7bnVtYmVyfSBkaXN0YW5jZSBmbG9hdCDop5LluqbvvJpyYWRpYW5zW+W3pjorcmFkaWFucyDlj7M6LXJhZGlhbnNdXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkIGZsb2F0IOmAn+W6puOBruWkp+OBjeOBlSDljZjkvY3vvJrop5LluqbvvIjjg6njgrjjgqLjg7PvvIkv56eSIFswLVggcnBzXeOAgCjmraPjga7mlbApXG4gICAgICovXG4gICAgY21kTW92ZUJ5RGlzdGFuY2UoZGlzdGFuY2UgPSAwLHNwZWVkPW51bGwpe1xuICAgICAgICBpZihzcGVlZCE9PW51bGwpe1xuICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig4KTtcbiAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KGRpc3RhbmNlLDEwKSk7XG4gICAgICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDQscGFyc2VGbG9hdChzcGVlZCwxMCkpO1xuICAgICAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdmVCeURpc3RhbmNlU3BlZWQsYnVmZmVyKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLHBhcnNlRmxvYXQoZGlzdGFuY2UsMTApKTtcbiAgICAgICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3ZlQnlEaXN0YW5jZSxidWZmZXIpO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7lirHno4HjgpLlgZzmraLjgZnjgovvvIjmhJ/op6bjga/mrovjgorjgb7jgZnvvIlcbiAgICAgKiBAZGVzYyDlrozlhajjg5Xjg6rjg7znirbmhYvjgpLlho3nj77jgZnjgovloLTlkIjjga/jgIEgY21kRnJlZSgpLmNtZERpc2FibGUoKSDjgajjgZfjgabkuIvjgZXjgYTjgIJcbiAgICAgKi9cbiAgICBjbWRGcmVlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5mcmVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjgpLpgJ/luqbjgrzjg63jgb7jgafmuJvpgJ/jgZflgZzmraLjgZnjgotcbiAgICAgKiBAZGVzYyBycG0gPSAwIOOBqOOBquOCi+OAglxuICAgICAqL1xuICAgIGNtZFN0b3AoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3ApO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OI44Or44Kv5Yi25b6h44KS6KGM44GGXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRvcnF1ZSBmbG9hdCDjg4jjg6vjgq8g5Y2Y5L2N77yaTuODu20gWy1YIH4gKyBYIE5tXSDmjqjlpajlgKQgMC4zLTAuMDVcbiAgICAgKiBAZGVzYyDpgJ/luqbjgoTkvY3nva7jgpLlkIzmmYLjgavliLblvqHjgZnjgovloLTlkIjjga/jgIHjg6Ljg7zjgr/jg7zoqK3lrprjga4gMHgwRTogbWF4VG9ycXVlIOOBqCAweDYwOiBydW5Gb3J3YXJkIOetieOCkuS9teeUqOOBl+OBpuS4i+OBleOBhOOAglxuICAgICAqXG4gICAgICovXG4gICAgY21kSG9sZFRvcnF1ZSh0b3JxdWUpe1xuICAgICAgICBpZih0b3JxdWU9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxwYXJzZUZsb2F0KHRvcnF1ZSwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuaG9sZFRvcnF1ZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOiomOaGtuOBl+OBn+OCv+OCueOCr++8iOWRveS7pO+8ieOBruOCu+ODg+ODiOOCkuWun+ihjOOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbmRleCBpbnQg44K/44K544Kv44K744OD44OI55Wq5Y+377yIMO+9njY1NTM177yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJlcGVhdGluZyBpbnQg57mw44KK6L+U44GX5Zue5pWwIDDjga/nhKHliLbpmZBcbiAgICAgKlxuICAgICAqIEBkZXNjIEtNLTEg44GvIGluZGV4OiAwfjQ5IOOBvuOBp+OAgu+8iDUw5YCL44Gu44Oh44Oi44Oq44OQ44Oz44KvIOWQhDgxMjggQnl0ZSDjgb7jgafliLbpmZDjgYLjgorvvIk8YnI+XG4gICAgICog44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44Gv44CB44Kz44Oe44Oz44OJ77yI44K/44K544Kv44K744OD44OI77yJ44KS5Y+C54Wn5LiL44GV44GE44CCIGh0dHBzOi8vZG9jdW1lbnQua2VpZ2FuLW1vdG9yLmNvbS9tb3Rvci1jb250cm9sLWNvbW1hbmQvdGFza3NldC5odG1sXG4gICAgICovXG4gICAgY21kU3RhcnREb2luZ1Rhc2tzZXQoaW5kZXggPSAwLHJlcGVhdGluZyA9IDEpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDYpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDIsTWF0aC5hYnMocGFyc2VJbnQocmVwZWF0aW5nLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnREb2luZ1Rhc2tzZXQsYnVmZmVyKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44K/44K544Kv44K744OD44OI44KS5YGc5q2iXG4gICAgICogQGRlc2Mg44K/44K544Kv44K744OD44OI44Gu5YaN55Sf44KS5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kU3RvcERvaW5nVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RvcERvaW5nVGFza3NldCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K344On44Oz44KS5YaN55Sf77yI5rqW5YKZ44Gq44GX77yJXG4gICAgICogQGRlc2Mg44Oi44O844K344On44Oz44Gu44OX44Os44Kk44OQ44OD44Kv44KS77yI5rqW5YKZ44Gq44GX44Gn77yJ44OX44Os44Kk44OQ44OD44Kv6ZaL5aeL44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjg6Ljg7zjgrfjg6fjg7Pnlarlj7fvvIgw772eNjU1MzXvvIlcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmVwZWF0aW5nIGludCDnubDjgorov5TjgZflm57mlbAgMOOBr+eEoeWItumZkFxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRQcmVwYXJlUGxheWJhY2tNb3Rpb25fU1RBUlRfUE9TSVRJT059IHN0YXJ0X3Bvc2l0aW9uIGludCDjgrnjgr/jg7zjg4jkvY3nva7jga7oqK3lrpo8YnI+XG4gICAgICogU1RBUlRfUE9TSVRJT05fQUJTOuiomOaGtuOBleOCjOOBn+mWi+Wni+S9jee9ru+8iOe1tuWvvuW6p+aome+8ieOBi+OCieOCueOCv+ODvOODiDxicj5cbiAgICAgKiBTVEFSVF9QT1NJVElPTl9DVVJSRU5UOuePvuWcqOOBruS9jee9ruOCkumWi+Wni+S9jee9ruOBqOOBl+OBpuOCueOCv+ODvOODiFxuICAgICAqL1xuICAgIGNtZFN0YXJ0UGxheWJhY2tNb3Rpb24oaW5kZXggPSAwLHJlcGVhdGluZyA9IDAsc3RhcnRfcG9zaXRpb24gPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig3KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQzMigyLE1hdGguYWJzKHBhcnNlSW50KHJlcGVhdGluZywxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoNixNYXRoLmFicyhwYXJzZUludChzdGFydF9wb3NpdGlvbiwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0YXJ0UGxheWJhY2tNb3Rpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgrfjg6fjg7Plho3nlJ/jgpLlgZzmraLjgZnjgotcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgY21kU3RvcFBsYXliYWNrTW90aW9uKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zdG9wUGxheWJhY2tNb3Rpb24pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBzZWN0aW9uOjrjgq3jg6Xjg7zmk43kvZxcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Kt44Ol44O844KS5LiA5pmC5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kUGF1c2VRdWV1ZSgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucGF1c2VRdWV1ZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Kt44Ol44O844KS5YaN6ZaL44GZ44KL77yI6JOE56mN44GV44KM44Gf44K/44K544Kv44KS5YaN6ZaL77yJXG4gICAgICovXG4gICAgY21kUmVzdW1lUXVldWUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc3VtZVF1ZXVlKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgq3jg6Xjg7zjgpLmjIflrprmmYLplpPlgZzmraLjgZflho3plovjgZnjgotcbiAgICAgKiBAZGVzYyBjbWRQYXVzZe+8iOOCreODpeODvOWBnOatou+8ieOCkuWun+ihjOOBl+OAgeaMh+WumuaZgumWk++8iOODn+ODquenku+8iee1jOmBjuW+jOOAgeiHquWLleeahOOBqyBjbWRSZXN1bWXvvIjjgq3jg6Xjg7zlho3plovvvIkg44KS6KGM44GE44G+44GZ44CCXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWUg5YGc5q2i5pmC6ZaTW21zZWNdXG4gICAgICovXG4gICAgY21kV2FpdFF1ZXVlKHRpbWUgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDAsTWF0aC5hYnMocGFyc2VJbnQodGltZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELndhaXRRdWV1ZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCreODpeODvOOCkuODquOCu+ODg+ODiOOBmeOCi1xuICAgICAqL1xuICAgIGNtZFJlc2V0UXVldWUoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0UXVldWUpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrueKtuaFi+OCkuiqreOBv+WPluOCiyDvvIhyZWFk5bCC55So77yJXG4gICAgICogQHJldHVybnMge1Byb21pc2U8aW50fEFycmF5Pn1cbiAgICAgKi9cbiAgICBjbWRSZWFkU3RhdHVzKCl7XG4gICAgICAgIHJldHVybiB0aGlzLmNtZFJlYWRSZWdpc3Rlcih0aGlzLl9NT1RPUl9DT01NQU5ELnJlYWRTdGF0dXMpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBzZWN0aW9uOjrjgr/jgrnjgq/jgrvjg4Pjg4hcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgr/jgrnjgq/vvIjlkb3ku6TvvInjga7jgrvjg4Pjg4jjga7oqJjpjLLjgpLplovlp4vjgZnjgotcbiAgICAgKiBAZGVzYyDoqJjmhrbjgZnjgovjgqTjg7Pjg4fjg4Pjgq/jgrnjga7jg6Hjg6Ljg6rjga/jgrPjg57jg7Pjg4nvvJplcmFzZVRhc2tzZXQg44Gr44KI44KK5LqI44KB5raI5Y6744GV44KM44Gm44GE44KL5b+F6KaB44GM44GC44KKXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjgqTjg7Pjg4fjg4Pjgq/jgrkgS00tMSDjga7loLTlkIjjgIHjgqTjg7Pjg4fjg4Pjgq/jgrnjga7lgKTjga8gMO+9njQ5IO+8iOioiDUw5YCL6KiY6Yyy77yJXG4gICAgICovXG4gICAgY21kU3RhcnRSZWNvcmRpbmdUYXNrU2V0KGluZGV4ID0gMCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMik7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQxNigwLE1hdGguYWJzKHBhcnNlSW50KGluZGV4LDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3RhcnRSZWNvcmRpbmdUYXNrc2V0LGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44K/44K544Kv44K744OD44OI44Gu6KiY6Yyy44KS5YGc5q2i44GZ44KLXG4gICAgICovXG4gICAgY21kU3RvcFJlY29yZGluZ1Rhc2tzZXQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3BSZWNvcmRpbmdUYXNrc2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjga7jgqTjg7Pjg4fjg4Pjgq/jgrnjga7jgr/jgrnjgq/jgrvjg4Pjg4jjgpLmtojljrvjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuVxuICAgICAqL1xuICAgIGNtZEVyYXNlVGFza3NldChpbmRleCA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDIpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVyYXNlVGFza3NldCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBruOCv+OCueOCr+OCu+ODg+ODiOOCkua2iOWOu+OBmeOCi1xuICAgICAqL1xuICAgIGNtZEVyYXNlQWxsVGFza3NldCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZXJhc2VBbGxUYXNrc2V0KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLlkI3oqK3lrppcbiAgICAgKiBAZGVzYyDjgr/jgrnjgq/jgrvjg4Pjg4jjga7oqJjpjLLlkI3jgpLoqK3lrprjgZnjgovjgILvvIjjgZPjgozjgYvjgonoqJjpjLLjgZnjgovjgoLjga7jgavlr77jgZfjgabvvIlcbiAgICAgKi9cbiAgICBjbWRTZXRUYXNrc2V0TmFtZShuYW1lKXtcbiAgICAgICAgbGV0IGJ1ZmZlcj0gKG5ldyBVaW50OEFycmF5KFtdLm1hcC5jYWxsKG5hbWUsIGZ1bmN0aW9uKGMpIHtcbiAgICAgICAgICAgIHJldHVybiBjLmNoYXJDb2RlQXQoMCk7XG4gICAgICAgIH0pKSkuYnVmZmVyO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc2V0VGFza3NldE5hbWUsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gc2VjdGlvbjo644OG44Kj44O844OB44Oz44KwXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODgOOCpOODrOOCr+ODiOODhuOCo+ODvOODgeODs+OCsOmWi+Wni++8iOa6luWCmeOBquOBl++8iVxuICAgICAqIEBkZXNjIEtNLTEg44Gu5aC05ZCI44CB44Kk44Oz44OH44OD44Kv44K544Gu5YCk44GvIDDvvZ4xOSDvvIjoqIgyMOWAi+iomOmMsu+8ieOBqOOBquOCi+OAguiomOmMsuaZgumWk+OBryA2NTQwOCBbbXNlY10g44KS6LaF44GI44KL44GT44Go44Gv44Gn44GN44Gq44GEXG4gICAgICogICAgICAg6KiY5oa244GZ44KL44Kk44Oz44OH44OD44Kv44K544Gu44Oh44Oi44Oq44GvYmxlRXJhc2VNb3Rpb24g44Gr44KI44KK5LqI44KB5raI5Y6744GV44KM44Gm44GE44KL5b+F6KaB44GM44GC44KLXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gaW5kZXggaW50IOOCpOODs+ODh+ODg+OCr+OCuSBbMC0xOV1cbiAgICAgKiBAcGFyYW0ge251bWJlcn0gdGltZSBpbnQg6KiY6Yyy5pmC6ZaTIFttc2VjIDAtNjU0MDhdXG4gICAgICovXG4gICAgY21kU3RhcnRUZWFjaGluZ01vdGlvbihpbmRleCA9IDAsbGVuZ3RoUmVjb3JkaW5nVGltZSA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDYpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MTYoMCxNYXRoLmFicyhwYXJzZUludChpbmRleCwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDIsTWF0aC5hYnMocGFyc2VJbnQobGVuZ3RoUmVjb3JkaW5nVGltZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0YXJ0VGVhY2hpbmdNb3Rpb24sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDlrp/ooYzkuK3jga7jg4bjgqPjg7zjg4Hjg7PjgrDjgpLlgZzmraLjgZnjgotcbiAgICAgKi9cbiAgICBjbWRTdG9wVGVhY2hpbmdNb3Rpb24oKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnN0b3BUZWFjaGluZ01vdGlvbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5oyH5a6a44GX44Gf44Kk44Oz44OH44OD44Kv44K544Gu44Oi44O844K344On44Oz44KS5raI5Y6744GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGluZGV4IGludCDjgqTjg7Pjg4fjg4Pjgq/jgrlcbiAgICAgKlxuICAgICAqIEBkZXNjIEtNLTEg44Gu5aC05ZCI44CB44Kk44Oz44OH44OD44Kv44K544Gu5YCk44GvIDDvvZ4xOSDvvIjoqIgyMOWAi+iomOmMsu+8ieOBqOOBquOCi1xuICAgICAqXG4gICAgICovXG4gICAgY21kRXJhc2VNb3Rpb24oaW5kZXggPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigyKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDE2KDAsTWF0aC5hYnMocGFyc2VJbnQoaW5kZXgsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZU1vdGlvbixidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBruODouODvOOCt+ODp+ODs+OCkua2iOWOu+OBmeOCi1xuICAgICAqL1xuICAgIGNtZEVyYXNlQWxsTW90aW9uKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lcmFzZUFsbE1vdGlvbik7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8vIHNlY3Rpb246OkxFRFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSBMRUTjga7ngrnnga/nirbmhYvjgpLjgrvjg4Pjg4jjgZnjgotcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuY21kTGVkX0xFRF9TVEFURX0gY21kTGVkX0xFRF9TVEFURSBpbnQg54K554Gv54q25oWLPGJyPlxuICAgICAqICAgTEVEX1NUQVRFX09GRjpMRUTmtojnga88YnI+XG4gICAgICogICBMRURfU1RBVEVfT05fU09MSUQ6TEVE54K554GvPGJyPlxuICAgICAqICAgTEVEX1NUQVRFX09OX0ZMQVNIOkxFROeCuea7he+8iOS4gOWumumWk+malOOBp+eCuea7he+8iTxicj5cbiAgICAgKiAgIExFRF9TVEFURV9PTl9ESU06TEVE44GM44KG44Gj44GP44KK5piO5ruF44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJlZCBpbnQgMC0yNTVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZ3JlZW4gaW50IDAtMjU1XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJsdWUgaW50IDAtMjU1XG4gICAgICovXG4gICAgY21kTGVkKGNtZExlZF9MRURfU1RBVEUscmVkLGdyZWVuLGJsdWUpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLE1hdGguYWJzKHBhcnNlSW50KGNtZExlZF9MRURfU1RBVEUsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsTWF0aC5hYnMocGFyc2VJbnQoY21kTGVkX0xFRF9TVEFURSwxMCkpKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMSxNYXRoLmFicyhwYXJzZUludChyZWQsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDIsTWF0aC5hYnMocGFyc2VJbnQoZ3JlZW4sMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDMsTWF0aC5hYnMocGFyc2VJbnQoYmx1ZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmxlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvLyBJTVUg44K444Oj44Kk44OtXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSU1VKOOCuOODo+OCpOODrSnjga7lgKTlj5blvpco6YCa55+lKeOCkumWi+Wni+OBmeOCiyAoQkxF5bCC55So44Kz44Oe44Oz44OJKVxuICAgICAqIEBkZXNjIOacrOOCs+ODnuODs+ODieOCkuWun+ihjOOBmeOCi+OBqOOAgUlNVeOBruODh+ODvOOCv+OBr0JMReOBruOCreODo+ODqeOCr+OCv+ODquOCueODhuOCo+OCr+OCuU1PVE9SX0lNVV9NRUFTVVJFTUVOVOOBq+mAmuefpeOBleOCjOOCizxicj5cbiAgICAgKiBNT1RPUl9JTVVfTUVBU1VSRU1FTlTjga5ub3RpZnnjga/jgqTjg5njg7Pjg4jjgr/jgqTjg5cgS01Nb3RvckNvbW1hbmRLTU9uZS5FVkVOVF9UWVBFLmltdU1lYXN1cmVtZW50IOOBq+mAmuefpVxuICAgICAqL1xuICAgIGNtZEVuYWJsZUlNVU1lYXN1cmVtZW50KCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lbmFibGVJTVVNZWFzdXJlbWVudCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSU1VKOOCuOODo+OCpOODrSnjga7lgKTlj5blvpco6YCa55+lKeOCkuWBnOatouOBmeOCi1xuICAgICAqL1xuICAgIGNtZERpc2FibGVJTVVNZWFzdXJlbWVudCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZGlzYWJsZUlNVU1lYXN1cmVtZW50KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8gSU1VIOODouODvOOCv+ODvFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7muKzlrprlgKTvvIjkvY3nva7jg7vpgJ/luqbjg7vjg4jjg6vjgq/vvInlh7rlipvjgpLplovlp4vjgZnjgotcbiAgICAgKiBAZGVzYyDjg4fjg5Xjgqnjg6vjg4jjgafjga/jg6Ljg7zjgr/jg7zotbfli5XmmYJvbuOAgiBtb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0KCkg5Y+C54WnXG4gICAgICogQGlnbm9yZVxuICAgICAqL1xuICAgIGNtZEVuYWJsZU1vdG9yTWVhc3VyZW1lbnQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmVuYWJsZU1vdG9yTWVhc3VyZW1lbnQpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7muKzlrprlgKTvvIjkvY3nva7jg7vpgJ/luqbjg7vjg4jjg6vjgq/vvInlh7rlipvjgpLlgZzmraLjgZnjgotcbiAgICAgKiBAaWdub3JlXG4gICAgICovXG4gICAgY21kRGlzYWJsZU1vdG9yTWVhc3VyZW1lbnQoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1RYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmRpc2FibGVNb3Rvck1lYXN1cmVtZW50KTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8g44K344K544OG44OgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0vL1xuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOOCt+OCueODhuODoOOCkuWGjei1t+WLleOBmeOCi1xuICAgICAqIEBkZXNjIEJMReOBq+aOpee2muOBl+OBpuOBhOOBn+WgtOWQiOOAgeWIh+aWreOBl+OBpuOBi+OCieWGjei1t+WLlVxuICAgICAqL1xuICAgIGNtZFJlYm9vdCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVib290KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OB44Kn44OD44Kv44K144Og77yIQ1JDMTYpIOacieWKueWMllxuICAgICAqIEBkZXNjIOOCs+ODnuODs+ODie+8iOOCv+OCueOCr++8ieOBruODgeOCp+ODg+OCr+OCteODoOOCkuacieWKueWMluOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpc0VuYWJsZWQgMDpEaXNibGVkLCAxOkVuYWJsZWRcbiAgICAgKi9cbiAgICBjbWRFbmFibGVDaGVja1N1bShpc0VuYWJsZWQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLGlzRW5hYmxlZD8xOjApO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfVFgnLHRoaXMuX01PVE9SX0NPTU1BTkQuZW5hYmxlQ2hlY2tTdW0sYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg5XjgqHjg7zjg6DjgqbjgqfjgqLjgqLjg4Pjg5fjg4fjg7zjg4jjg6Ljg7zjg4njgavlhaXjgotcbiAgICAgKiBAZGVzYyDjg5XjgqHjg7zjg6DjgqbjgqfjgqLjgpLjgqLjg4Pjg5fjg4fjg7zjg4jjgZnjgovjgZ/jgoHjga7jg5bjg7zjg4jjg63jg7zjg4Djg7zjg6Ljg7zjg4njgavlhaXjgovjgILvvIjjgrfjgrnjg4bjg6Djga/lho3otbfli5XjgZXjgozjgovjgILvvIlcbiAgICAgKi9cbiAgICBjbWRFbnRlckRldmljZUZpcm13YXJlVXBkYXRlKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9UWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5lbnRlckRldmljZUZpcm13YXJlVXBkYXRlKTtcbiAgICB9XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS8vXG4gICAgLy8g44Oi44O844K/44O86Kit5a6a44CATU9UT1JfU0VUVElOR1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLy9cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7mnIDlpKfpgJ/jgZXjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4U3BlZWQgZmxvYXQg5pyA5aSn6YCf44GVIFtyYWRpYW4gLyBzZWNvbmRd77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kTWF4U3BlZWQobWF4U3BlZWQpe1xuICAgICAgICBpZihtYXhTcGVlZD09PXVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQobWF4U3BlZWQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9SWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tYXhTcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruacgOWwj+mAn+OBleOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBtYXhTcGVlZCBmbG9hdCDmnIDlsI/pgJ/jgZUgW3JhZGlhbiAvIHNlY29uZF3vvIjmraPjga7lgKTvvIlcbiAgICAgKiBAZGVzYyBtaW5TcGVlZCDjga/jgIFibGVQcmVwYXJlUGxheWJhY2tNb3Rpb24g5a6f6KGM44Gu6Zqb44CB6ZaL5aeL5Zyw54K544Gr56e75YuV44GZ44KL6YCf44GV44Go44GX44Gm5L2/55So44GV44KM44KL44CC6YCa5bi45pmC6YGL6Lui44Gn44Gv5L2/55So44GV44KM44Gq44GE44CCXG4gICAgICovXG4gICAgY21kTWluU3BlZWQobWluU3BlZWQpe1xuICAgICAgICBpZihtaW5TcGVlZD09PXVuZGVmaW5lZCl7cmV0dXJuO31cbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQobWluU3BlZWQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9SWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5taW5TcGVlZCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWKoOa4m+mAn+absue3muOCkuaMh+WumuOBmeOCi++8iOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODq+OBruioreWumu+8iVxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRX0gY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUgaW50IOWKoOa4m+mAn+OCq+ODvOODluOCquODl+OCt+ODp+ODszxicj5cbiAgICAgKiAgICAgIENVUlZFX1RZUEVfTk9ORTowIOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPRkY8YnI+XG4gICAgICogICAgICBDVVJWRV9UWVBFX1RSQVBFWk9JRDoxIOODouODvOOCt+ODp+ODs+OCs+ODs+ODiOODreODvOODqyBPTiDvvIjlj7DlvaLliqDmuJvpgJ/vvIlcbiAgICAgKi9cbiAgICBjbWRDdXJ2ZVR5cGUoY21kQ3VydmVUeXBlX0NVUlZFX1RZUEUgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxNYXRoLmFicyhwYXJzZUludChjbWRDdXJ2ZVR5cGVfQ1VSVkVfVFlQRSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1JYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmN1cnZlVHlwZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBruWKoOmAn+W6puOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBhY2MgZmxvYXQg5Yqg6YCf5bqmIDAtMjAwIFtyYWRpYW4gLyBzZWNvbmReMl3vvIjmraPjga7lgKTvvIlcbiAgICAgKiBAZGVzYyBhY2Mg44Gv44CB44Oi44O844K344On44Oz44Kz44Oz44OI44Ot44O844OrIE9OIOOBruWgtOWQiOOAgeWKoOmAn+aZguOBq+S9v+eUqOOBleOCjOOBvuOBmeOAgu+8iOWKoOmAn+aZguOBruebtOe3muOBruWCvuOBje+8iVxuICAgICAqL1xuICAgIGNtZEFjYyhhY2MgPSAwKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoYWNjLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfUlgnLHRoaXMuX01PVE9SX0NPTU1BTkQuYWNjLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu5rib6YCf5bqm44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRlYyBmbG9hdCDmuJvpgJ/luqYgMC0yMDAgW3JhZGlhbiAvIHNlY29uZF4yXe+8iOato+OBruWApO+8iVxuICAgICAqIEBkZXNjIGRlYyDjga/jgIHjg6Ljg7zjgrfjg6fjg7PjgrPjg7Pjg4jjg63jg7zjg6sgT04g44Gu5aC05ZCI44CB5rib6YCf5pmC44Gr5L2/55So44GV44KM44G+44GZ44CC77yI5rib6YCf5pmC44Gu55u057ea44Gu5YK+44GN77yJXG4gICAgICovXG4gICAgY21kRGVjKGRlYyA9IDApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChkZWMsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9SWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5kZWMsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7mnIDlpKfjg4jjg6vjgq/vvIjntbblr77lgKTvvInjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gbWF4VG9ycXVlIGZsb2F0IOacgOWkp+ODiOODq+OCryBbTiptXe+8iOato+OBruWApO+8iVxuICAgICAqXG4gICAgICogQGRlc2MgbWF4VG9ycXVlIOOCkuioreWumuOBmeOCi+OBk+OBqOOBq+OCiOOCiuOAgeODiOODq+OCr+OBrue1tuWvvuWApOOBjCBtYXhUb3JxdWUg44KS6LaF44GI44Gq44GE44KI44GG44Gr6YGL6Lui44GX44G+44GZ44CCPGJyPlxuICAgICAqIG1heFRvcnF1ZSA9IDAuMSBbTiptXSDjga7lvozjgasgcnVuRm9yd2FyZCDvvIjmraPlm57ou6LvvInjgpLooYzjgaPjgZ/loLTlkIjjgIEwLjEgTiptIOOCkui2heOBiOOBquOBhOOCiOOBhuOBq+OBneOBrumAn+W6puOCkuOBquOCi+OBoOOBkee2reaMgeOBmeOCi+OAgjxicj5cbiAgICAgKiDjgZ/jgaDjgZfjgIHjg4jjg6vjgq/jga7mnIDlpKflgKTliLbpmZDjgavjgojjgorjgIHjgrfjgrnjg4bjg6DjgavjgojjgaPjgabjga/liLblvqHmgKfvvIjmjK/li5XvvInjgYzmgqrljJbjgZnjgovlj6/og73mgKfjgYzjgYLjgovjgIJcbiAgICAgKlxuICAgICAqL1xuICAgIGNtZE1heFRvcnF1ZShtYXhUb3JxdWUpe1xuICAgICAgICBpZihtYXhUb3JxdWU9PT11bmRlZmluZWQpe3JldHVybjt9XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KG1heFRvcnF1ZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1JYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1heFRvcnF1ZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODgOOCpOODrOOCr+ODiOODhuOCo+ODvOODgeODs+OCsOOBruOCteODs+ODl+ODquODs+OCsOmWk+malFxuICAgICAqIEBkZXNjIOODhuOCo+ODvOODgeODs+OCsOODu+ODl+ODrOOCpOODkOODg+OCr+OBruWun+ihjOmWk+malFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbnRlcnZhbCBtc++8iDItMTAwMCAgMCwgMW1z44Gv44Ko44Op44O844Go44Gq44KL77yJXG4gICAgICovXG4gICAgY21kVGVhY2hpbmdJbnRlcnZhbChpbnRlcnZhbCl7XG4gICAgICAgIGlmKGludGVydmFsPT09dW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgX2ludGVydmFsPU1hdGguYWJzKHBhcnNlSW50KGludGVydmFsLDEwKSk7XG4gICAgICAgIF9pbnRlcnZhbD1faW50ZXJ2YWw8MT8yOl9pbnRlcnZhbDtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDMyKDAsX2ludGVydmFsKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1JYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnRlYWNoaW5nSW50ZXJ2YWwsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg6KiY5oa25YaN55Sf5pmC44Gu5YaN55Sf6ZaT6ZqUXG4gICAgICogQGRlc2MgIOiomOaGtuWGjeeUn+aZguOBruWGjeeUn+mWk+malFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpbnRlcnZhbCBtc++8iDItMTAwMCAgMCwgMW1z44Gv44Ko44Op44O844Go44Gq44KL77yJXG4gICAgICovXG4gICAgY21kUGxheWJhY2tJbnRlcnZhbChpbnRlcnZhbCl7XG4gICAgICAgIGlmKGludGVydmFsPT09dW5kZWZpbmVkKXtyZXR1cm47fVxuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50MzIoMCxNYXRoLmFicyhwYXJzZUludChpbnRlcnZhbCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1JYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnBsYXliYWNrSW50ZXJ2YWwsYnVmZmVyKTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5Q77yI5q+U5L6L77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHFDdXJyZW50UCBmbG9hdCBx6Zu75rWBUOOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFFDdXJyZW50UChxQ3VycmVudFApe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChxQ3VycmVudFAsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9SWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5xQ3VycmVudFAsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga5x6Lu46Zu75rWBUElE44Kz44Oz44OI44Ot44O844Op44GuUO+8iOavlOS+i++8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBxQ3VycmVudEkgZmxvYXQgcembu+a1gUnjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRRQ3VycmVudEkocUN1cnJlbnRJKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQocUN1cnJlbnRJLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfUlgnLHRoaXMuX01PVE9SX0NPTU1BTkQucUN1cnJlbnRJLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gucei7uOmbu+a1gVBJROOCs+ODs+ODiOODreODvOODqeOBrkTvvIjlvq7liIbvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcUN1cnJlbnREIGZsb2F0IHHpm7vmtYFE44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUUN1cnJlbnREKHFDdXJyZW50RCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHFDdXJyZW50RCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1JYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnFDdXJyZW50RCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrnHou7jpm7vmtYFQSUTjgrPjg7Pjg4jjg63jg7zjg6njga5E77yI5b6u5YiG77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHNwZWVkUCBmbG9hdCDpgJ/luqZQ44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kU3BlZWRQKHNwZWVkUCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHNwZWVkUCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1JYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNwZWVkUCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrumAn+W6plBJROOCs+ODs+ODiOODreODvOODqeOBrknvvIjnqY3liIbvvInjgrLjgqTjg7PjgpLoqK3lrprjgZnjgotcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gc3BlZWRJIGZsb2F0IOmAn+W6pknjgrLjgqTjg7PvvIjmraPjga7lgKTvvIlcbiAgICAgKi9cbiAgICBjbWRTcGVlZEkoc3BlZWRJKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcig0KTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0RmxvYXQzMigwLE1hdGguYWJzKHBhcnNlRmxvYXQoc3BlZWRJLDEwKSkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfUlgnLHRoaXMuX01PVE9SX0NPTU1BTkQuc3BlZWRJLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O844Gu6YCf5bqmUElE44Kz44Oz44OI44Ot44O844Op44GuRO+8iOW+ruWIhu+8ieOCsuOCpOODs+OCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBzcGVlZEQgZmxvYXQg6YCf5bqmROOCsuOCpOODs++8iOato+OBruWApO+8iVxuICAgICAqL1xuICAgIGNtZFNwZWVkRChzcGVlZEQpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDQpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRGbG9hdDMyKDAsTWF0aC5hYnMocGFyc2VGbG9hdChzcGVlZEQsMTApKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9SWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zcGVlZEQsYnVmZmVyKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDjg6Ljg7zjgr/jg7zjga7kvY3nva5QSUTjgrPjg7Pjg4jjg63jg7zjg6njga5Q77yI5q+U5L6L77yJ44Ky44Kk44Oz44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHBvc2l0aW9uUCBmbG9hdCDkvY3nva5Q44Ky44Kk44Oz77yI5q2j44Gu5YCk77yJXG4gICAgICovXG4gICAgY21kUG9zaXRpb25QKHBvc2l0aW9uUCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoNCk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldEZsb2F0MzIoMCxNYXRoLmFicyhwYXJzZUZsb2F0KHBvc2l0aW9uUCwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1JYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnBvc2l0aW9uUCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOWFqOOBpuOBrlBJROODkeODqeODoeODvOOCv+OCkuODquOCu+ODg+ODiOOBl+OBpuODleOCoeODvOODoOOCpuOCp+OCouOBruWIneacn+ioreWumuOBq+aIu+OBmVxuICAgICAqIEBkZXNjIHFDdXJyZW50UCwgcUN1cnJlbnRJLCAgcUN1cnJlbnRELCBzcGVlZFAsIHNwZWVkSSwgc3BlZWRELCBwb3NpdGlvblAg44KS44Oq44K744OD44OI44GX44G+44GZXG4gICAgICpcbiAgICAgKi9cbiAgICBjbWRSZXNldFBJRCgpe1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfUlgnLHRoaXMuX01PVE9SX0NPTU1BTkQucmVzZXRQSUQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOa4rOWumuWApOOBruWPluW+l+mWk+malOioreWumlxuICAgICAqIEBkZXNjIOaciee3mu+8iFVTQiwgSTJD77yJ44Gu44G/5pyJ5Yq544CCQkxF44Gn44Gv5Zu65a6aIDEwMG1zIOmWk+malOOBp+mAmuefpeOBleOCjOOCi+OAglxuICAgICAqIEBwYXJhbSB7S01Nb3RvckNvbW1hbmRLTU9uZS5jbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWxfTU9UT1JfTUVBU19JTlRFUlZBTH0gY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUwgZW51bSDjg6Ljg7zjgr/jg7zmuKzlrprlgKTjga7lj5blvpfplpPpmpRcbiAgICAgKi9cbiAgICBjbWRNb3Rvck1lYXN1cmVtZW50SW50ZXJ2YWwoY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUw9NCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQoY21kTW90b3JNZWFzdXJlbWVudEludGVydmFsX01PVE9SX01FQVNfSU5URVJWQUwsMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1JYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm1vdG9yTWVhc3VyZW1lbnRJbnRlcnZhbCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOa4rOWumuWApOOBruWPluW+l+ioreWumlxuICAgICAqIEBkZXNjIGlzRW5hYmxlZCA9IDEg44Gu5aC05ZCI44CB77yI5L2N572u44O76YCf5bqm44O744OI44Or44Kv77yJ44Gu6YCa55+l44KS6KGM44GG77yI6LW35YuV5b6M44CBaW50ZXJmYWNlIOOBruioreWumuOBp+WEquWFiOOBleOCjOOCi+mAmuS/oee1jOi3r+OBq+OAgeiHquWLleeahOOBq+mAmuefpeOBjOmWi+Wni+OBleOCjOOCi++8iVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBpc0VuYWJsZWQgMDpEaXNibGVkLCAxOkVuYWJsZWRcbiAgICAgKi9cbiAgICBjbWRNb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0KGlzRW5hYmxlZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsaXNFbmFibGVkPzE6MCk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9SWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5tb3Rvck1lYXN1cmVtZW50QnlEZWZhdWx0LGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44Oi44O844K/44O85Yi25b6h5omL5q6177yI44Kk44Oz44K/44O844OV44Kn44Kk44K577yJ44Gu6Kit5a6aXG4gICAgICogQGRlc2MgdWludDhfdCBmbGFncyDjg5Pjg4Pjg4jjgavjgojjgorjgIHlkKvjgb7jgozjgovjg5Hjg6njg6Hjg7zjgr/jgpLmjIflrprjgZnjgovvvIjvvJHjga7loLTlkIjlkKvjgoDjg7sw44Gu5aC05ZCI5ZCr44G+44Gq44GE77yJXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGJpdEZsZ1xuICAgICAqIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgICAqIGJpdDcgICAgYml0NiAgICBiaXQ1ICAgIGJpdDQgICAgYml0MyAgICBiaXQyICAgIGJpdDEgICAgYml0MFxuICAgICAqIOeJqeeQhiAgICAgICAgICAgICAgICAgICAgIOaciee3miAgICAg5pyJ57eaICAgICAgICAgICAgICAgICAgICAgIOeEoee3mlxuICAgICAqIOODnOOCv+ODsyAgICDvvIogICAgICDvvIogICAgICBJMkMgICAgIFVTQiAgICAgICDvvIogICAgICDvvIogICAgIEJMRVxuICAgICAqIOODh+ODleOCqeODq+ODiFx0ICAgICAgICAgICAgIOODh+ODleOCqeODq+ODiCAg44OH44OV44Kp44Or44OIICAgICAgICAgICAgICDjg4fjg5Xjgqnjg6vjg4hcbiAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAgKi9cbiAgICBjbWRJbnRlcmZhY2UoYml0RmxnKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxwYXJzZUludChiaXRGbGcsMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1JYJyx0aGlzLl9NT1RPUl9DT01NQU5ELmludGVyZmFjZSxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOODouODvOOCv+ODvOOBrui1t+WLleaZguWbuuaciUxFROOCq+ODqeODvOOCkuioreWumuOBmeOCi1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSByZWQgaW50IDAtMjU1XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGdyZWVuIGludCAwLTI1NVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBibHVlIGludCAwLTI1NVxuICAgICAqXG4gICAgICogQGRlc2Mgb3duQ29sb3Ig44Gv44Ki44Kk44OJ44Or5pmC44Gu5Zu65pyJTEVE44Kr44Op44O844CCPGJyPnNhdmVBbGxTZXR0aW5nc+OCkuWun+ihjOOBl+OAgeWGjei1t+WLleW+jOOBq+WIneOCgeOBpuWPjeaYoOOBleOCjOOCi+OAgjxicj5cbiAgICAgKiDjgZPjga7oqK3lrprlgKTjgpLlpInmm7TjgZfjgZ/loLTlkIjjgIFCTEXjga4gRGV2aWNlIE5hbWUg44Gu5LiLM+ahgeOBjOWkieabtOOBleOCjOOCi+OAglxuICAgICAqL1xuICAgIGNtZE93bkNvbG9yKHJlZCxncmVlbixibHVlKXtcbiAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigzKTtcbiAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxNYXRoLmFicyhwYXJzZUludChyZWQsMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDEsTWF0aC5hYnMocGFyc2VJbnQoZ3JlZW4sMTApKSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDIsTWF0aC5hYnMocGFyc2VJbnQoYmx1ZSwxMCkpKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1JYJyx0aGlzLl9NT1RPUl9DT01NQU5ELm93bkNvbG9yLGJ1ZmZlcik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg77yW6Lu444K744Oz44K144O877yI5Yqg6YCf5bqm44O744K444Oj44Kk44Ot77yJ5ris5a6a5YCk44Gu5Y+W5b6X6ZaT6ZqUXG4gICAgICogQGRlc2Mg5pyJ57ea77yIVVNCLCBJMkPvvInjga7jgb/mnInlirnjgIJCTEXjgafjga/lm7rlrpogMTAwbXMg6ZaT6ZqU44Gn6YCa55+l44GV44KM44KL44CCXG4gICAgICogQHBhcmFtIHtLTU1vdG9yQ29tbWFuZEtNT25lLmNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUx9IGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUwgZW51bSDliqDpgJ/luqbjg7vjgrjjg6PjgqTjg63muKzlrprlgKTjga7lj5blvpfplpPpmpRcbiAgICAgKi9cbiAgICBjbWRJTVVNZWFzdXJlbWVudEludGVydmFsKGNtZElNVU1lYXN1cmVtZW50SW50ZXJ2YWxfSU1VX01FQVNfSU5URVJWQUw9NCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQoY21kSU1VTWVhc3VyZW1lbnRJbnRlcnZhbF9JTVVfTUVBU19JTlRFUlZBTCwxMCkpO1xuICAgICAgICB0aGlzLl9LTUNvbS5fc2VuZE1vdG9yQ29tbWFuZCgnTU9UT1JfUlgnLHRoaXMuX01PVE9SX0NPTU1BTkQuaU1VTWVhc3VyZW1lbnRJbnRlcnZhbCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IO+8lui7uOOCu+ODs+OCteODvO+8iOWKoOmAn+W6puODu+OCuOODo+OCpOODre+8ieOBruWApOOBrumAmuefpeOCkuODh+ODleOCqeODq+ODiOOBp+mWi+Wni+OBmeOCi1xuICAgICAqIEBkZXNjIGlzRW5hYmxlZCA9IHRydWUg44Gu5aC05ZCI44CBZW5hYmxlSU1VKCkg44KS6YCB5L+h44GX44Gq44GP44Gm44KC6LW35YuV5pmC44Gr6Ieq5YuV44Gn6YCa55+l44GM6ZaL5aeL44GV44KM44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGlzRW5hYmxlZCAwOkRpc2JsZWQsIDE6RW5hYmxlZFxuICAgICAqL1xuICAgIGNtZElNVU1lYXN1cmVtZW50QnlEZWZhdWx0KGlzRW5hYmxlZCl7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQoaXNFbmFibGVkLDEwKSk7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9SWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5pTVVNZWFzdXJlbWVudEJ5RGVmYXVsdCxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEBzdW1tYXJ5IOaMh+WumuOBl+OBn+ioreWumuWApOOCkuWPluW+lyAoQkxF5bCC55So44Kz44Oe44Oz44OJKVxuICAgICAqIEBwYXJhbSB7bnVtYmVyIHwgYXJyYXl9IHJlZ2lzdGVycyA8aW50IHwgW10+IOWPluW+l+OBmeOCi+ODl+ODreODkeODhuOCo+OBruOCs+ODnuODs+ODiSjjg6zjgrjjgrnjgr/nlarlj7cp5YCkXG4gICAgICogQHJldHVybnMge1Byb21pc2UuPGludCB8IGFycmF5Pn0g5Y+W5b6X44GX44Gf5YCkIDxicj5yZWdpc3RlcnPjgYxpbnQ944Os44K444K544K/5YCk44Gu44OX44Oq44Of44OG44Kj44OW5YCkIDxicj5yZWdpc3RlcnPjgYxBcnJheT3jg6zjgrjjgrnjgr/lgKTjga7jgqrjg5bjgrjjgqfjgq/jg4hcbiAgICAgKlxuICAgICAqIEBub25lIOWPluW+l+OBmeOCi+WApOOBr+OCs+ODnuODs+ODieWun+ihjOW+jOOBq0JMReOBruOCreODo+ODqeOCr+OCv+ODquOCueODhuOCo+OCr+OCuU1PVE9SX1NFVFRJTkfjgavpgJrnn6XjgZXjgozjgovjgII8YnI+XG4gICAgICogICAgICAg44Gd44KM44KS5ou+44Gj44GmcHJvbWlzZeOCquODluOCuOOCp+OCr+ODiOOBruOBrnJlc29sdmXjgavov5TjgZfjgablh6bnkIbjgpLnuYvjgZA8YnI+XG4gICAgICogICAgICAgTU9UT1JfU0VUVElOR+OBrm5vdGlmeeOBr19vbkJsZU1vdG9yU2V0dGluZ+OBp+WPluW+l1xuICAgICAqL1xuXG4gICAgY21kUmVhZFJlZ2lzdGVyKHJlZ2lzdGVycyl7XG4gICAgICAgIGlmKHJlZ2lzdGVycyBpbnN0YW5jZW9mIEFycmF5KXtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgoYWxscmVzb2x2ZSwgYWxscmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICBsZXQgcHJvbWlzZUxpc3Q9W107XG4gICAgICAgICAgICAgICAgZm9yKGxldCBpPTA7aTxyZWdpc3RlcnMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgIGxldCByZWdpc3Rlcj1wYXJzZUludChyZWdpc3RlcnNbaV0sMTApO1xuICAgICAgICAgICAgICAgICAgICBwcm9taXNlTGlzdC5wdXNoKCBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KT0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjY3A9bmV3IF9LTU5vdGlmeVByb21pcyhyZWdpc3Rlcix0aGlzLl9SRVZfTU9UT1JfQ09NTUFORFtyZWdpc3Rlcl0sdGhpcy5fbm90aWZ5UHJvbWlzTGlzdCxyZXNvbHZlLHJlamVjdCw1MDAwKTsvL25vdGlmeee1jOeUseOBrnJlc3VsdOOCklByb21pc+OBqOe0kOS7mOOBkVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAsIHJlZ2lzdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9SWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZWFkUmVnaXN0ZXIsIGJ1ZmZlcixjY3ApO1xuICAgICAgICAgICAgICAgICAgICB9KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFByb21pc2UuYWxsKHByb21pc2VMaXN0KS50aGVuKChyZXNhcik9PntcbiAgICAgICAgICAgICAgICAgICAgbGV0IHQ9W3t9XS5jb25jYXQocmVzYXIpO1xuICAgICAgICAgICAgICAgICAgICBsZXQgcnRvYmo9T2JqZWN0LmFzc2lnbi5hcHBseShudWxsLHQpO1xuICAgICAgICAgICAgICAgICAgICBhbGxyZXNvbHZlKHJ0b2JqKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgobXNnKT0+e1xuICAgICAgICAgICAgICAgICAgICBhbGxyZWplY3QobXNnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgobGFzdHJlc29sdmUsIGxhc3RyZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgIGxldCByZWdpc3Rlcj1wYXJzZUludChyZWdpc3RlcnMsMTApO1xuICAgICAgICAgICAgICAgIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpPT4ge1xuICAgICAgICAgICAgICAgICAgICBsZXQgY2NwPW5ldyBfS01Ob3RpZnlQcm9taXMocmVnaXN0ZXIsdGhpcy5fUkVWX01PVE9SX0NPTU1BTkRbcmVnaXN0ZXJdLHRoaXMuX25vdGlmeVByb21pc0xpc3QscmVzb2x2ZSxyZWplY3QsMTAwMCk7Ly9ub3RpZnnntYznlLHjga5yZXN1bHTjgpJQcm9taXPjgajntJDku5jjgZFcbiAgICAgICAgICAgICAgICAgICAgbGV0IGJ1ZmZlciA9IG5ldyBBcnJheUJ1ZmZlcigxKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3IERhdGFWaWV3KGJ1ZmZlcikuc2V0VWludDgoMCxyZWdpc3Rlcik7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9SWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5yZWFkUmVnaXN0ZXIsIGJ1ZmZlcixjY3ApO1xuICAgICAgICAgICAgICAgIH0pLnRoZW4oKHJlcyk9PntcbiAgICAgICAgICAgICAgICAgICAgbGFzdHJlc29sdmUocmVzW09iamVjdC5rZXlzKHJlcylbMF1dKTtcbiAgICAgICAgICAgICAgICB9KS5jYXRjaCgobXNnKT0+e1xuICAgICAgICAgICAgICAgICAgICBsYXN0cmVqZWN0KG1zZyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIOODouODvOOCv+ODvOOBruWFqOOBpuOBruODrOOCuOOCueOCv+WApOOBruWPluW+l1xuICAgICAqIEByZXR1cm5zIHtQcm9taXNlLjxhcnJheT59XG4gICAgICovXG4gICAgY21kUmVhZEFsbFJlZ2lzdGVyKCl7XG4gICAgICAgbGV0IGNtPSB0aGlzLmNvbnN0cnVjdG9yLmNtZFJlYWRSZWdpc3Rlcl9DT01NQU5EO1xuICAgICAgICBsZXQgYWxsY21kcz1bXTtcbiAgICAgICAgT2JqZWN0LmtleXMoY20pLmZvckVhY2goKGspPT57YWxsY21kcy5wdXNoKGNtW2tdKTt9KTtcblxuICAgICAgIHJldHVybiB0aGlzLmNtZFJlYWRSZWdpc3RlcihhbGxjbWRzKTtcbiAgICB9XG4gICAgLy8vLy8v5L+d5a2YXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu6Kit5a6a5YCk44KS44OV44Op44OD44K344Ol44Oh44Oi44Oq44Gr5L+d5a2Y44GZ44KLXG4gICAgICogQGRlc2Mg5pys44Kz44Oe44Oz44OJ44KS5a6f6KGM44GX44Gq44GE6ZmQ44KK44CB6Kit5a6a5YCk44Gv44Oi44O844K/44O844Gr5rC45LmF55qE44Gr5L+d5a2Y44GV44KM44Gq44GEKOWGjei1t+WLleOBp+a2iOOBiOOCiylcbiAgICAgKi9cbiAgICBjbWRTYXZlQWxsUmVnaXN0ZXJzKCl7XG4gICAgICAgIHRoaXMuX0tNQ29tLl9zZW5kTW90b3JDb21tYW5kKCdNT1RPUl9SWCcsdGhpcy5fTU9UT1JfQ09NTUFORC5zYXZlQWxsUmVnaXN0ZXJzKTtcbiAgICB9XG5cbiAgICAvLy8vLy/jg6rjgrvjg4Pjg4hcbiAgICAvKipcbiAgICAgKiBAc3VtbWFyeSDmjIflrprjgZfjgZ/jg6zjgrjjgrnjgr/jgpLjg5XjgqHjg7zjg6DjgqbjgqfjgqLjga7liJ3mnJ/lgKTjgavjg6rjgrvjg4Pjg4jjgZnjgotcbiAgICAgKiBAcGFyYW0ge0tNTW90b3JDb21tYW5kS01PbmUuY21kUmVhZFJlZ2lzdGVyX0NPTU1BTkR9IHJlZ2lzdGVyIOWIneacn+WApOOBq+ODquOCu+ODg+ODiOOBmeOCi+OCs+ODnuODs+ODiSjjg6zjgrjjgrnjgr8p5YCkXG4gICAgICovXG4gICAgY21kUmVzZXRSZWdpc3RlcihyZWdpc3Rlcil7XG4gICAgICAgIGxldCBidWZmZXIgPSBuZXcgQXJyYXlCdWZmZXIoMSk7XG4gICAgICAgIG5ldyBEYXRhVmlldyhidWZmZXIpLnNldFVpbnQ4KDAscGFyc2VJbnQocmVnaXN0ZXIsMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1JYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0UmVnaXN0ZXIsYnVmZmVyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg5YWo44Gm44Gu44Os44K444K544K/44KS44OV44Kh44O844Og44Km44Kn44Ki44Gu5Yid5pyf5YCk44Gr44Oq44K744OD44OI44GZ44KLXG4gICAgICogQGRlc2MgYmxlU2F2ZUFsbFJlZ2lzdGVyc+OCkuWun+ihjOOBl+OBquOBhOmZkOOCiuOAgeODquOCu+ODg+ODiOWApOOBr+ODouODvOOCv+ODvOOBq+awuOS5heeahOOBq+S/neWtmOOBleOCjOOBquOBhCjlho3otbfli5XjgafmtojjgYjjgospXG4gICAgICovXG4gICAgY21kUmVzZXRBbGxSZWdpc3RlcnMoKXtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1JYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnJlc2V0QWxsUmVnaXN0ZXJzKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OH44OQ44Kk44K544ON44O844Og44Gu5Y+W5b6XXG4gICAgICogQGRlc2Mg44OH44OQ44Kk44K544ON44O844Og44KS6Kqt44G/5Y+W44KLXG4gICAgICogQHJldHVybnMge1Byb21pc2U8aW50fEFycmF5Pn1cbiAgICAgKi9cbiAgICBjbWRSZWFkRGV2aWNlTmFtZSgpe1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRSZWFkUmVnaXN0ZXIodGhpcy5fTU9UT1JfQ09NTUFORC5yZWFkRGV2aWNlTmFtZSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkg44OH44OQ44Kk44K55oOF5aCx44Gu5Y+W5b6XXG4gICAgICogQGRlc2Mg44OH44OQ44Kk44K544Kk44Oz44OV44Kp44Oh44O844K344On44Oz44KS6Kqt44G/5Y+W44KLXG4gICAgICogQHJldHVybnMge1Byb21pc2U8YW55Pn1cbiAgICAgKi9cbiAgICBjbWRSZWFkRGV2aWNlSW5mbygpe1xuICAgICAgICByZXR1cm4gdGhpcy5jbWRSZWFkUmVnaXN0ZXIodGhpcy5fTU9UT1JfQ09NTUFORC5yZWFkRGV2aWNlSW5mbyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHN1bW1hcnkgSTJD44K544Os44O844OW44Ki44OJ44Os44K5XG4gICAgICogQGRlc2MgSTJD44GL44KJ5Yi25b6h44GZ44KL5aC05ZCI44Gu44K544Os44O844OW44Ki44OJ44Os44K577yIMHgwMC0weEZG77yJ44KS6Kit5a6a44GZ44KLXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGFkZHJlc3Mg44Ki44OJ44Os44K5XG4gICAgICovXG4gICAgY21kU2V0STJDU2xhdmVBZGRyZXNzKGFkZHJlc3Mpe1xuICAgICAgICBsZXQgYnVmZmVyID0gbmV3IEFycmF5QnVmZmVyKDEpO1xuICAgICAgICBuZXcgRGF0YVZpZXcoYnVmZmVyKS5zZXRVaW50OCgwLHBhcnNlSW50KGFkZHJlc3MsMTApKTtcbiAgICAgICAgdGhpcy5fS01Db20uX3NlbmRNb3RvckNvbW1hbmQoJ01PVE9SX1JYJyx0aGlzLl9NT1RPUl9DT01NQU5ELnNldEkyQ1NsYXZlQWRkcmVzcyxidWZmZXIpO1xuICAgIH1cblxuICAgIC8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICAqIOWGhemDqFxuICAgICAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cblxuXG4vLy8vLy9jbGFzcy8vXG59XG5cblxuLyoqXG4gKiBTZW5kQmxlTm90aWZ5UHJvbWlzXG4gKiDjgIBjbWRSZWFkUmVnaXN0ZXLnrYnjga5CTEXlkbzjgbPlh7rjgZflvozjgatcbiAqIOOAgOOCs+ODnuODs+ODiee1kOaenOOBjG5vdGlmeeOBp+mAmuefpeOBleOCjOOCi+OCs+ODnuODs+ODieOCklByb21pc+OBqOe0kOS7mOOBkeOCi+eCuuOBruOCr+ODqeOCuVxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgX0tNTm90aWZ5UHJvbWlze1xuICAgIC8v5oiQ5Yqf6YCa55+lXG4gICAgc3RhdGljIHNlbmRHcm91cE5vdGlmeVJlc29sdmUoZ3JvdXBBcnJheSx0YWdOYW1lLHZhbCl7XG4gICAgICAgIGlmKCFncm91cEFycmF5IGluc3RhbmNlb2YgQXJyYXkpe3JldHVybjt9XG4gICAgICAgIC8v6YCB5L+hSUTjga7pgJrnn6UgQ2FsbGJhY2tQcm9taXPjgaflkbzjgbPlh7rjgZflhYPjga7jg6Hjgr3jg4Pjg4njga5Qcm9taXPjgavov5TjgZlcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8Z3JvdXBBcnJheS5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICBpZiggZ3JvdXBBcnJheVtpXS50YWdOYW1lPT09dGFnTmFtZSApe1xuICAgICAgICAgICAgICAgIGdyb3VwQXJyYXlbaV0uY2FsbFJlc29sdmUodmFsKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBjb25zdFxuICAgICAqIEBwYXJhbSB0YWdOYW1lXG4gICAgICogQHBhcmFtIGdyb3VwQXJyYXlcbiAgICAgKiBAcGFyYW0gcHJvbWlzUmVzb2x2ZU9ialxuICAgICAqIEBwYXJhbSBwcm9taXNSZWplY3RPYmpcbiAgICAgKiBAcGFyYW0gcmVqZWN0VGltZU91dFxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHRhZ05hbWUsdGFnSW5mbz1udWxsLGdyb3VwQXJyYXk9W10scHJvbWlzUmVzb2x2ZU9iaiwgcHJvbWlzUmVqZWN0T2JqLHJlamVjdFRpbWVPdXQpe1xuICAgICAgICB0aGlzLnRpbWVvdXRJZD0wO1xuICAgICAgICB0aGlzLnRhZ05hbWU9dGFnTmFtZTtcbiAgICAgICAgdGhpcy50YWdJbmZvPXRhZ0luZm87XG4gICAgICAgIHRoaXMuZ3JvdXBBcnJheT1ncm91cEFycmF5IGluc3RhbmNlb2YgQXJyYXk/Z3JvdXBBcnJheTpbXTtcbiAgICAgICAgdGhpcy5ncm91cEFycmF5LnB1c2godGhpcyk7XG4gICAgICAgIHRoaXMucHJvbWlzUmVzb2x2ZU9iaj1wcm9taXNSZXNvbHZlT2JqO1xuICAgICAgICB0aGlzLnByb21pc1JlamVjdE9iaj1wcm9taXNSZWplY3RPYmo7XG4gICAgICAgIHRoaXMucmVqZWN0VGltZU91dD1yZWplY3RUaW1lT3V0O1xuICAgIH1cbiAgICAvL+OCq+OCpuODs+ODiOOBrumWi+WniyBjaGFyYWN0ZXJpc3RpY3Mud3JpdGVWYWx1ZeWRvOOBs+WHuuOBl+W+jOOBq+Wun+ihjFxuICAgIHN0YXJ0UmVqZWN0VGltZU91dENvdW50KCl7XG4gICAgICAgIHRoaXMudGltZW91dElkPXNldFRpbWVvdXQoKCk9PntcbiAgICAgICAgICAgIHRoaXMuX3JlbW92ZUdyb3VwKCk7XG4gICAgICAgICAgICB0aGlzLnByb21pc1JlamVjdE9iaih7bXNnOlwidGltZW91dDpcIix0YWdOYW1lOnRoaXMudGFnTmFtZSx0YWdJbmZvOnRoaXMudGFnSW5mb30pO1xuICAgICAgICB9LCB0aGlzLnJlamVjdFRpbWVPdXQpO1xuICAgIH1cbiAgICBjYWxsUmVzb2x2ZShhcmcpe1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xuICAgICAgICB0aGlzLl9yZW1vdmVHcm91cCgpO1xuICAgICAgICB0aGlzLnByb21pc1Jlc29sdmVPYmooYXJnKTtcbiAgICB9XG4gICAgY2FsbFJlamVjdChtc2cpe1xuICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xuICAgICAgICB0aGlzLl9yZW1vdmVHcm91cCgpO1xuICAgICAgICB0aGlzLnByb21pc1JlamVjdE9iaih7bXNnOm1zZ30pO1xuICAgIH1cblxuICAgIF9yZW1vdmVHcm91cCgpe1xuICAgICAgICBmb3IobGV0IGk9MDsgaTx0aGlzLmdyb3VwQXJyYXkubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgaWYoIHRoaXMuZ3JvdXBBcnJheVtpXT09PXRoaXMpe1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JvdXBBcnJheS5zcGxpY2UoaSwxKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9S01Nb3RvckNvbW1hbmRLTU9uZTtcblxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9saWIvS01Nb3RvckNvbW1hbmRLTU9uZS5qc1xuLy8gbW9kdWxlIGlkID0gN1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanNcbi8vIG1vZHVsZSBpZCA9IDhcbi8vIG1vZHVsZSBjaHVua3MgPSAwIDEiXSwic291cmNlUm9vdCI6IiJ9