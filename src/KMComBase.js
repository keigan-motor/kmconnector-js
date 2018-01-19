/***
 * KMComBase.js
 * version 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
'use strict';
let KMUtl = require('./KMUtl');
let KMStructures=require('./KMStructures');
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


