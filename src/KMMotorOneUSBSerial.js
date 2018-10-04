/***
 *KMMotorOneUSBSerial.js
 * var 0.1.0 alpha
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
const SerialPort = require('serialport');
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
     * @param {KMMotorOneBLE.EVENT_TYPE} type イベントのタイプ.
     * @param {function(object)} listener 追加するイベントリスナ.
     */
    static on(type, listener){
        _KMMotorOneUSBSerialStaticEventEmitter.on(type,listener);
    }
    /**
     * 1回限りのイベントリスナを追加する. Synonym for EventEmitter
     * @param {KMMotorOneBLE.EVENT_TYPE} type イベントのタイプ.
     * @param {function(object)} listener 追加するイベントリスナ.
     */
    static once(type, listener){
        _KMMotorOneUSBSerialStaticEventEmitter.once(type,listener);
    }
    /**
     * イベントリスナを削除する Synonym for EventEmitter
     * @param {KMMotorOneBLE.EVENT_TYPE} type イベントのタイプ
     * @param {function(object)} listener 削除するイベントリスナ
     */
    static removeListener(type, listener){
        _KMMotorOneUSBSerialStaticEventEmitter.removeListener(type,listener);
    }
    /**
     * 全てのイベントリスナを削除する Synonym for EventEmitter
     * @param {KMMotorOneBLE.EVENT_TYPE} type イベントのタイプ.
     */
    static removeAllListeners(type){
        _KMMotorOneUSBSerialStaticEventEmitter.removeAllListeners(type);
    }

    /**
     * イベントタイプ定数
     * @readonly
     * @enum {string}
     * @property {string} discoverMotor - モーター発見時(毎回)
     * <br>return:function({@link KMMotorOneBLE})
     * @property {string} discoverNewMotor - 新規モーターの発見時(1回のみ)
     * <br>return:function({@link KMMotorOneBLE})
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
     * todo::20180804時点では取り外したモーターの履歴(_motorsByUUID)は消えない
     */
    static startScanToCreateInstance(){
       return new Promise((resolve,reject)=> {
           SerialPort.list().then((ports)=>{
               let pmar=[];
               ports.forEach((port)=> {
                   let comName=port.comName;
                   //!comName||comName.indexOf("USB")===-1
                   if(port.manufacturer!=="FTDI"||port.productId!=="6015"){//KM1 USBchip
                       return;
                   }
                   let serialNumber=port.serialNumber;//info::デバイス固有ID識別用。 UUID的な

                   if(!_motorsByUUID[serialNumber]){
                       let pm=new Promise(function(s_resolve, s_reject) {
                           KMMotorOneUSBSerial._getMotorNameSerial(comName).then((name)=>{
                               let motor= new KMMotorOneUSBSerial(comName,serialNumber,name);//info::検出したモーターは全てインスタンス化
                               _KMMotorOneUSBSerialStaticEventEmitter.emit(KMMotorOneUSBSerial.EVENT_TYPE.discoverNewMotor,_motorsByUUID[serialNumber]);
                               s_resolve(true);
                           }).catch((e)=>{
                               console.log("getMotorName Err",e);
                               let motor= new KMMotorOneUSBSerial(comName,serialNumber);//info::検出したモーターは全てインスタンス化
                               _KMMotorOneUSBSerialStaticEventEmitter.emit(KMMotorOneUSBSerial.EVENT_TYPE.discoverNewMotor,_motorsByUUID[serialNumber]);
                               s_resolve(true);
                           });
                       });
                       pmar.push(pm);
                   }
                   _KMMotorOneUSBSerialStaticEventEmitter.emit(KMMotorOneUSBSerial.EVENT_TYPE.discoverMotor,_motorsByUUID[serialNumber]);
               });
               Promise.all(pmar).then(()=>{
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
                    kcom._sendMotorCommand('MOTOR_SETTING',kcom._MOTOR_SETTING_READREGISTER_COMMAND.deviceName);//DeviceName
                },500);
            };
            kcom.onConnectFailure=(connector, err)=>{
                reject("getMotorName connectFailure");
            };

            kcom.onMotorSetting=(registerCmd,res)=>{
                //名前の取得
                if(registerCmd===kcom._MOTOR_SETTING_READREGISTER_COMMAND.deviceName){
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
     * <br>ex) {<motorName1>:{@link KMMotorOneBLE},<motorName2>:{@link KMMotorOneBLE},,,}
     * @readonly
     * @type {_motorsByName}
     */
    static get motors(){
        return _motorsByName;
    }

    /**
     * APIが認識しているモーターのインスタンスリスト(プロパティはUUID)
     * <br>ex) {<motorUUID1>:{@link KMMotorOneBLE},<motorUUID2>:{@link KMMotorOneBLE},,,}
     * @readonly
     * @type {_motorsByUUID}
     */
    static get motorsByUUID(){
        return _motorsByUUID;
    }
    /**
     * モーターのリストを再インデックス
     * @private
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
     * @extends KMMotorCommandKMOne
     * @param portName
     * @param id
     * @param motorName
     */
    constructor(portName,id,motorName=null){
        id=!id?"id"+String(performance.now()).split(".").join(""):id;
        if(!id){

        }
        super(KMMotorCommandKMOne.KM_CONNECT_TYPE.SERIAL,new KMComUSBSerial(portName,id,motorName));
        if(!_motorsByUUID[id]){
            _motorsByUUID[id]=this;
            KMMotorOneUSBSerial._restructMotorsByName();
        }
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

