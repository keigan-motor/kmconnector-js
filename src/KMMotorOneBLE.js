/***
 *KMMotorOneBLE.js
 * var 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */



'use strict';

let EventEmitter = require("events").EventEmitter;
let KMComBLE = require('./KMComBLE');
let KMMotorCommandKMOne=require('./KMMotorCommandKMOne.js');

let noble = require('noble');

let _motorsByUUID={};
let _motorsByName={};
let _startScanTimeoutID=0;
let _KMMotorOneBLEStaticEventEmitter=new EventEmitter(null);

process.on('exit', function() {
    KMMotorOneBLE.allDisConnect();
});

//
class KMMotorOneBLE extends KMMotorCommandKMOne{
    /********************************************
     * static　events
     ********************************************/
    static on(type, listener){
        _KMMotorOneBLEStaticEventEmitter.on(type,listener);
    }
    static once(type, listener){
        _KMMotorOneBLEStaticEventEmitter.once(type,listener);
    }
    static removeListener(type, listener){
        _KMMotorOneBLEStaticEventEmitter.removeListener(type,listener);
    }
    static removeAllListeners(type){
        _KMMotorOneBLEStaticEventEmitter.removeAllListeners(type);
    }

    /**
     * EVENT
     * discoverMotor:モーター発見時(毎回) function(kMMotorOneBLE instace){}
     * discoverNewMotor:モーター発見時(新規モーターの発見時 1回のみ) function(kMMotorOneBLE instace){}
     * scanTimeout:スキャンのタイムアウトで終了時 function(){}
     * @returns {{discoverMotor: string, discoverNewMotor: string, scanTimeout: string}}
     * @constructor
     */
    static get EVENT_TYPE(){
          return {"discoverMotor":"discoverMotor","discoverNewMotor":"discoverNewMotor","scanTimeout":"scanTimeout"};
    }

    /********************************************
     * static Scanning
     ********************************************/
    /**
     * APIが認識しているモーターのインスタンスリスト(プロパティはモーター名)
     * @returns {{}}
     */
    static get motors(){
        return _motorsByName;
    }
    /**
     * APIが認識しているモーターのインスタンスリスト(プロパティはUUID)
     * @returns {{}}
     */
    static get motorsByUUID(){
        return _motorsByUUID;
    }
    /**
     * スキャンを開始して検出したモーターを全てインスタンス化する
     * @param time ms
     */
    static startScanToCreateInstance(time){

        time=!time?20000:time;//default 20sec
        clearTimeout(_startScanTimeoutID);
        if(noble.state === 'poweredOn'){
            noble.removeListener('discover',KMMotorOneBLE._discoverLis);
            noble.on('discover',KMMotorOneBLE._discoverLis);
            console.log('startScanToCreateInstance');
            noble.startScanning([KMComBLE.MOTOR_BLE_SERVICE_UUID],false);//info::UUIDを指定しないとスキャン時にadvertisement.serviceUuidsが取得出来ない
            _startScanTimeoutID=setTimeout(()=>{
                KMMotorOneBLE.stopScan();
                _KMMotorOneBLEStaticEventEmitter.emit(KMMotorOneBLE.EVENT_TYPE.scanTimeout);
            },time);
        }else if(noble.state === 'unknown') {
            noble.once('stateChange', function(){
                KMMotorOneBLE.startScanToCreateInstance();
            });
        }else{
            //BLE無効時
            console.log('Could not start scanning, state is:'+noble.state);
        }
    }

    /**
     * スキャンの強制停止
     */
    static stopScan(){
        noble.removeListener('discover',KMMotorOneBLE._discoverLis);
        if(noble.state === 'poweredOn') {
            noble.stopScanning();
            console.log('stopScan');
        };
    }

    /**
     * 全てのモーターのBLE接続を解除
     */
    static allDisConnect(){
        Object.keys(_motorsByUUID).forEach((key)=> {
            _motorsByUUID[key]._KMCom.disConnect();
        });
        _motorsByUUID={};
        KMMotorOneBLE._restructMotorsByName();
    }
    static _discoverLis(nobleperipheral){
        //info::デバイスを選別する。startScanToCreateInstance中に別のクラスからnoble.startScanningした場合、Motor以外のデバイスも拾う可能性がある為。
        if(!(nobleperipheral.advertisement&&nobleperipheral.advertisement.serviceUuids&&nobleperipheral.advertisement.serviceUuids[0]==KMComBLE.MOTOR_BLE_SERVICE_UUID)){
            return;
        };
        if(!_motorsByUUID[nobleperipheral.uuid]){
           let motor= new KMMotorOneBLE(nobleperipheral);//info::検出したモーターは全てインスタンス化
            _KMMotorOneBLEStaticEventEmitter.emit(KMMotorOneBLE.EVENT_TYPE.discoverNewMotor,_motorsByUUID[nobleperipheral.uuid]);
        }
        _KMMotorOneBLEStaticEventEmitter.emit(KMMotorOneBLE.EVENT_TYPE.discoverMotor,_motorsByUUID[nobleperipheral.uuid]);
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
        })
        _motorsByName=list;
    }
    /********************************************
     * instance Method
     ********************************************/
    constructor(noblePeripheral){
        super(KMMotorCommandKMOne.KM_CONNECT_TYPE.BLE,new KMComBLE(noblePeripheral));
        if(!_motorsByUUID[noblePeripheral.uuid]){
            _motorsByUUID[noblePeripheral.uuid]=this;
            KMMotorOneBLE._restructMotorsByName();
        }
    }

    /**
     * BLE接続
     */
    connect(){
       this._KMCom.connect();
    }

    /**
     * BLE接続を解除
     */
    disConnect(){
        this._KMCom.disConnect();
    }
}

module.exports =KMMotorOneBLE;