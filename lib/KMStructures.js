/***
 * KMStructures.js
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
'use strict';
let KMUtl = require('./KMUtl');


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
