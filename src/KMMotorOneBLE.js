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
/**
 * @typedef {Object< motorUUID,KMMotorOneBLE >} _motorsByUUID
 * @ignore
 */
let _motorsByUUID={};
/**
 * @typedef {Object< motorName,KMMotorOneBLE >} _motorsByName
 * @ignore
 */
let _motorsByName={};
let _startScanTimeoutID=0;
let _KMMotorOneBLEStaticEventEmitter=new EventEmitter(null);

process.on('exit', function() {
    KMMotorOneBLE.allDisConnect();
});

/**
 * @classdesc KM-1のBLE接続用 仮想デバイス
 */
class KMMotorOneBLE extends KMMotorCommandKMOne{
    /********************************************
     * static　events
     ********************************************/
    /**
     * イベントリスナを追加する. Synonym for EventEmitter
     * @param {KMMotorOneBLE.EVENT_TYPE} type イベントのタイプ.
     * @param {function(object)} listener 追加するイベントリスナ.
     */
    static on(type, listener){
        _KMMotorOneBLEStaticEventEmitter.on(type,listener);
    }
    /**
     * 1回限りのイベントリスナを追加する. Synonym for EventEmitter
     * @param {KMMotorOneBLE.EVENT_TYPE} type イベントのタイプ.
     * @param {function(object)} listener 追加するイベントリスナ.
     */
    static once(type, listener){
        _KMMotorOneBLEStaticEventEmitter.once(type,listener);
    }
    /**
     * イベントリスナを削除する Synonym for EventEmitter
     * @param {KMMotorOneBLE.EVENT_TYPE} type イベントのタイプ
     * @param {function(object)} listener 削除するイベントリスナ
     */
    static removeListener(type, listener){
        _KMMotorOneBLEStaticEventEmitter.removeListener(type,listener);
    }
    /**
     * 全てのイベントリスナを削除する Synonym for EventEmitter
     * @param {KMMotorOneBLE.EVENT_TYPE} type イベントのタイプ.
     */
    static removeAllListeners(type){
        _KMMotorOneBLEStaticEventEmitter.removeAllListeners(type);
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
     * static Scanning
     ********************************************/

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
     * BLEデバイスのスキャンを開始し、検出したモーターを全てインスタンス化する
     * @param {number} time スキャンの継続時間(ms)
     * @param {boolean} allowDuplicates 重複検出を許可
     */
    static startScanToCreateInstance(time = 2000,allowDuplicates=false){
        clearTimeout(_startScanTimeoutID);
        if(noble.state === 'poweredOn'){
            noble.removeListener('discover',KMMotorOneBLE._discoverLis);
            noble.on('discover',KMMotorOneBLE._discoverLis);
            console.log('startScanToCreateInstance');
            noble.startScanning([KMComBLE.MOTOR_BLE_SERVICE_UUID],allowDuplicates);//info::UUIDを指定しないとスキャン時にadvertisement.serviceUuidsが取得出来ない
            _startScanTimeoutID=setTimeout(()=>{
                KMMotorOneBLE.stopScan();
                _KMMotorOneBLEStaticEventEmitter.emit(KMMotorOneBLE.EVENT_TYPE.scanTimeout);
            },time);
        }else if(noble.state === 'unknown') {
            noble.once('stateChange', function(){
                KMMotorOneBLE.startScanToCreateInstance(time,allowDuplicates);
            });
        }else{
            //BLE無効時
            console.log('Could not start scanning, state is:'+noble.state);
        }
    }

    /**
     * BLEデバイスのスキャンの停止
     */
    static stopScan(){
        noble.removeListener('discover',KMMotorOneBLE._discoverLis);
        if(noble.state === 'poweredOn') {
            noble.stopScanning();
            console.log('stopScan');
        }
    }

    /**
     * 全てのモーターのBLE接続を解除
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
        KMMotorOneBLE.allDisConnect();
        _motorsByUUID={};
        KMMotorOneBLE._restructMotorsByName();
    }

    /**
     * 検出時リスナー
     * @param nobleperipheral
     * @private
     */
    static _discoverLis(nobleperipheral){
        //info::デバイスを選別する。startScanToCreateInstance中に別のクラスからnoble.startScanningした場合、Motor以外のデバイスも拾う可能性がある為。
        if(!(nobleperipheral.advertisement&&nobleperipheral.advertisement.serviceUuids&&nobleperipheral.advertisement.serviceUuids[0]==KMComBLE.MOTOR_BLE_SERVICE_UUID)){
            return;
        }

        console.log('Discover device:'+nobleperipheral.uuid);

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
        });
        _motorsByName=list;
    }
    /********************************************
     * instance Method
     ********************************************/
    /**
     * KMMotorOneBLE
     * @constructor
     * @extends KMMotorCommandKMOne
     * @param {object} noblePeripheral noble Peripheralオブジェクト
     * @description 通常はstartScanToCreateInstance()メソッドから自動生成される為、単体では使用しない。<br>
     * モーター以外のデバイスの接続等でnoble APIをプログラム全体で使用している場合にnoblePeripheralと仮想モーターを関連付ける場合に使用。
     */
    constructor(noblePeripheral){
        super(KMMotorCommandKMOne.KM_CONNECT_TYPE.BLE,new KMComBLE(noblePeripheral));
        if(!_motorsByUUID[noblePeripheral.uuid]){
            _motorsByUUID[noblePeripheral.uuid]=this;
            KMMotorOneBLE._restructMotorsByName();
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

module.exports =KMMotorOneBLE;

