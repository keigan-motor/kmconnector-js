/***
 *KMMotorOneUSBSerial.js
 * Created by Harada Hiroshi on 2018/02/27.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */

'use strict';

const EventEmitter = require("events").EventEmitter;
const KMUtl= require('./KMUtl');
const KMComUSBSerial = require('./KMComUSBSerial');
const KMMotorCommandKMOne=require('./KMMotorCommandKMOne.js');
const serialport = require('serialport');
const {performance} = require('perf_hooks');
/**
 * @typedef {Object< motorUUID,KMMotorOneUSBSerial >} _motorsByUUID
 * @ignore
 */
let _motorsByUUID={};
/**
 * @typedef {Object< motorName,KMMotorOneUSBSerial >} _motorsByName
 * @ignore
 */
let _motorsByName={};
let _KMMotorOneUSBSerialStaticEventEmitter=new EventEmitter(null);

process.on('exit', function() {
    //todo::プロセス終了時のUSBデバイス切断 必要なら
});

/**
 * @classdesc KM-1のUSBシリアル接続用 仮想デバイス
 */
class KMMotorOneUSBSerial extends KMMotorCommandKMOne{
    /********************************************
     * static　events
     ********************************************/
    /**
     * イベントリスナを追加する. Synonym for EventEmitter
     * @param {KMMotorOneUSBSerial.EVENT_TYPE} type イベントのタイプ.
     * @param {function(object)} listener 追加するイベントリスナ.
     */
    static on(type, listener){
        _KMMotorOneUSBSerialStaticEventEmitter.on(type,listener);
    }
    /**
     * 1回限りのイベントリスナを追加する. Synonym for EventEmitter
     * @param {KMMotorOneUSBSerial.EVENT_TYPE} type イベントのタイプ.
     * @param {function(object)} listener 追加するイベントリスナ.
     */
    static once(type, listener){
        _KMMotorOneUSBSerialStaticEventEmitter.once(type,listener);
    }
    /**
     * イベントリスナを削除する Synonym for EventEmitter
     * @param {KMMotorOneUSBSerial.EVENT_TYPE} type イベントのタイプ
     * @param {function(object)} listener 削除するイベントリスナ
     */
    static removeListener(type, listener){
        _KMMotorOneUSBSerialStaticEventEmitter.removeListener(type,listener);
    }
    /**
     * 全てのイベントリスナを削除する Synonym for EventEmitter
     * @param {KMMotorOneUSBSerial.EVENT_TYPE} type イベントのタイプ.
     */
    static removeAllListeners(type){
        _KMMotorOneUSBSerialStaticEventEmitter.removeAllListeners(type);
    }

    /**
     * イベントタイプ定数
     * @readonly
     * @enum {string}
     * @property {string} discoverMotor - モーター発見時(毎回)
     * <br>return:function({@link KMMotorOneUSBSerial})
     * @property {string} discoverNewMotor - 新規モーターの発見時(1回のみ)
     * <br>return:function({@link KMMotorOneUSBSerial})
     * @property {string} scanTimeout - スキャンのタイムアウトで終了時
     * <br>return:function()
     */
    static get EVENT_TYPE(){
        return {
            discoverMotor:"discoverMotor",
            discoverNewMotor:"discoverNewMotor",
            scanTimeout:"scanTimeout"
        };
    }
    /********************************************
     * static Method
     ********************************************/
    /**
     * USBデバイスのスキャンを開始し、検出したモーターを全てインスタンス化する
     */
    static startScanToCreateInstance(){
       return new Promise((resolve,reject)=> {
           serialport.list().then((ports)=>{
               let pmar=[];
               ports.forEach((port)=> {
                   let portName=port.comName;
                   if(port.manufacturer!=="FTDI"||(parseInt(port.productId,16)).toString(16)!=="6015"){//KM1 USBchip
                       return;
                   }
                   let serialNumber=port.serialNumber;//info::デバイス固有ID識別用。 UUID的な

                   if(!_motorsByUUID[serialNumber]){
                       let pm=new Promise(function(s_resolve, s_reject) {
                           KMMotorOneUSBSerial._getMotorNameSerial(portName).then((name)=>{
                               let motor= new KMMotorOneUSBSerial(portName,serialNumber,name);//info::検出したモーターは全てインスタンス化

                               _KMMotorOneUSBSerialStaticEventEmitter.emit(KMMotorOneUSBSerial.EVENT_TYPE.discoverNewMotor,_motorsByUUID[serialNumber]);
                               /**
                                * 新規モーターの発見時
                                * @event KMMotorOneUSBSerial#discoverNewMotor
                                * @type {KMMotorOneUSBSerial}
                                * @property {object} KMMotorOneUSBSerial {@link KMMotorOneUSBSerial}
                                * @example
                                *
                                * KMMotorOneUSBSerial.on(KMMotorOneUSBSerial.EVENT_TYPE.discoverNewMotor,function(kMMotorOne){
                                *      console.log('onDiscoverNewMotor:'+kMMotorOne.deviceInfo.name);
                                * });
                                */

                               _KMMotorOneUSBSerialStaticEventEmitter.emit(KMMotorOneUSBSerial.EVENT_TYPE.discoverMotor,_motorsByUUID[serialNumber]);
                               /**
                                * モーターの発見時
                                * @event KMMotorOneUSBSerial#discoverMotor
                                * @type {KMMotorOneUSBSerial}
                                * @property {object} KMMotorOneUSBSerial {@link KMMotorOneUSBSerial}
                                * @example
                                *
                                * KMMotorOneUSBSerial.on(KMMotorOneUSBSerial.EVENT_TYPE.discoverNewMotor,function(kMMotorOne){
                                *      console.log('onDiscoverMotor:'+kMMotorOne.deviceInfo.name);
                                * });
                                */
                               s_resolve(true);
                           }).catch((e)=>{
                               console.log("getMotorName Err",e);
                               let motor= new KMMotorOneUSBSerial(portName,serialNumber);//info::検出したモーターは全てインスタンス化
                               _KMMotorOneUSBSerialStaticEventEmitter.emit(KMMotorOneUSBSerial.EVENT_TYPE.discoverNewMotor,_motorsByUUID[serialNumber]);
                               _KMMotorOneUSBSerialStaticEventEmitter.emit(KMMotorOneUSBSerial.EVENT_TYPE.discoverMotor,_motorsByUUID[serialNumber]);
                               s_resolve(true);
                           });
                       });
                       pmar.push(pm);
                   }
                   if(_motorsByUUID[serialNumber]){
                       _KMMotorOneUSBSerialStaticEventEmitter.emit(KMMotorOneUSBSerial.EVENT_TYPE.discoverMotor,_motorsByUUID[serialNumber]);
                   }
               });

               Promise.all(pmar).then(()=>{
                   KMMotorOneUSBSerial._restructMotorsByName();
                   resolve(_motorsByUUID);
               });
           }).catch((err)=>{
               console.log(err);
               reject(err);
           });
        });
    }

    /**
     * Motor名取得用にコマンド発行->受信
     * @param comName
     * @returns {Promise<any>}
     * @private
     * @ignore
     */
    static _getMotorNameSerial(comName){
        return new Promise((resolve,reject)=> {
            let execTimeoutms=5000;

            //motorNameの取得の為、一度接続する
            let kcom= new KMComUSBSerial(comName);

            let timeOutIntevalID=setTimeout(()=>{
                kcom.disConnect();
                reject("getMotorName timeout");
            },execTimeoutms);

            kcom.onConnect=(connector)=>{
                setTimeout(()=>{
                    kcom._sendMotorCommand('MOTOR_SETTING',kcom._MOTOR_RX_READREGISTER_COMMAND.deviceName);//DeviceName
                },500);
            };
            kcom.onConnectFailure=(connector, err)=>{
                reject("getMotorName connectFailure");
            };

            kcom.onMotorSetting=(registerCmd,res)=>{
                //名前の取得
                if(registerCmd===kcom._MOTOR_RX_READREGISTER_COMMAND.deviceName){
                    let rName=typeof res.deviceName==="string"?res.deviceName.split('#')[0]:null;
                    kcom.disConnect();
                    clearTimeout(timeOutIntevalID);
                    resolve(rName);
                }
            };

            kcom.connect();

        });
    }
    /**
     * 全てのモーターのUSB接続を解除
     */
    static allDisConnect(){
        Object.keys(_motorsByUUID).forEach((key)=> {
            _motorsByUUID[key]._KMCom.disConnect();
        });
    }

    /**
     *  全ての仮想モーターを消去
     */
    static clearMotors(){
        KMMotorOneUSBSerial.allDisConnect();
        _motorsByUUID={};
        KMMotorOneUSBSerial._restructMotorsByName();
    }
    /**
     * APIが認識しているモーターのインスタンスリスト(プロパティはモーター名)
     * <br>ex) {<motorName1>:{@link KMMotorOneUSBSerial},<motorName2>:{@link KMMotorOneUSBSerial},,,}
     * <br>一度作成された仮想モーターは物理的に取り外してもclearMotors()を行うまで消えない
     * @readonly
     * @type {_motorsByName}
     */
    static get motors(){
        return _motorsByName;
    }

    /**
     * APIが認識しているモーターのインスタンスリスト(プロパティはUUID)
     * <br>ex) {<motorUUID1>:{@link KMMotorOneUSBSerial},<motorUUID2>:{@link KMMotorOneUSBSerial},,,}
     * <br>一度作成された仮想モーターは物理的に取り外してもclearMotors()を行うまで消えない
     * @readonly
     * @type {_motorsByUUID}
     */
    static get motorsByUUID(){
        return _motorsByUUID;
    }
    /**
     * モーターのリストを再インデックス
     * @private
     * @ignore
     */
    static _restructMotorsByName(){
        let list={};
        Object.keys(_motorsByUUID).forEach((key)=>{
            let name=  _motorsByUUID[key].deviceInfo.name? _motorsByUUID[key].deviceInfo.name.split('#')[0]:null;
            if(name){
                list[name]=_motorsByUUID[key];
            }else{
                console.log('Err motor name not found');
            }
        });
        _motorsByName=list;
    }
    /********************************************
     * instance Method
     ********************************************/
    /**
     * KMMotorOneUSBSerial
     * @constructor
     * @extends {KMMotorCommandKMOne}
     * @param portName
     * @param id UniqueID デバイスのユニーク名 内部生成用。通常は指定しない (手動接続時は常にnull)
     * @param defaultMotorName string 内部生成用。通常は指定しない (手動接続時は常にnull)
     */
    constructor(portName,id=null,defaultMotorName=null){
        let cid=!id?"id_"+String(performance.now()).split(".").join("")+"_"+portName:id;
        super(KMMotorCommandKMOne.KM_CONNECT_TYPE.SERIAL,new KMComUSBSerial(portName,cid,defaultMotorName));
        if(!_motorsByUUID[cid]){
            _motorsByUUID[cid]=this;
        }

        this.on(this.EVENT_TYPE.init,(kMDeviceInfo)=>{
            KMMotorOneUSBSerial._restructMotorsByName();
        });
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

module.exports =KMMotorOneUSBSerial;

