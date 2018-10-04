/***
 *KMMotorOneNet.js
 * var 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */



'use strict';

let EventEmitter = require("events").EventEmitter;
let KMComNet = require('./KMComNet');
let KMMotorCommandKMOne=require('./KMMotorCommandKMOne.js');

/**
 * @typedef {Object< motorUUID,KMMotorOneNet >} _motorsByUUID
 * @ignore
 */
let _motorsByUUID={};
/**
 * @typedef {Object< motorName,KMMotorOneNet >} _motorsByName
 * @ignore
 */
let _motorsByName={};
let _startScanTimeoutID=0;
let _KMMotorOneNetStaticEventEmitter=new EventEmitter(null);

process.on('exit', function() {
    if(KMMotorOneNet.allDisConnect){
        KMMotorOneNet.allDisConnect();
    }
});

/**
 * @classdesc KM-1のNET接続用 仮想デバイス
 */
class KMMotorOneNet extends KMMotorCommandKMOne{

    /********************************************
     * instance Method
     ********************************************/

    /**
     * KMMotorOneNet
     * @constructor
     * @extends KMMotorCommandKMOne
     * @param {object} socket socket.io-client
     * @param {string} motorName 接続先モーター名
     */
    constructor(socket,motorName){
        super(KMMotorCommandKMOne.KM_CONNECT_TYPE.NET,new KMComNet(socket,motorName));
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

module.exports =KMMotorOneNet;

