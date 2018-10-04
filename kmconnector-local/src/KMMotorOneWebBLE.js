/***
 *KMMotorOneWebBLE.js
 * var 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
'use strict';

let KMComWebBLE = require('./KMComWebBLE');
let KMMotorCommandKMOne=require('./KMMotorCommandKMOne.js');

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