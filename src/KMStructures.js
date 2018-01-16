/***
 * KMStructures.js
 * var 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
'use strict';
let KMUtl = require('./KMUtl');


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
