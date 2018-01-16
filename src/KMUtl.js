/***
 * KMUtl.js
 * version 0.1.0 alpha
 * CCreated by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
'use strict';
var KMUtl = (function () {
    function KMUtl() {
    }

    /**
     * 数値にキャストする関数 (C)　
     * 数値以外は0を返す
     * Infinityも0とする
     */
    KMUtl.toNumber=function toNumber(val, defaultval = 0) {
        var v = parseFloat(val, 10);
        return (isNaN(v) || val === Infinity ? defaultval : v);
    };
    /**
     * 単位変換　degree >> radian
     * @param degree
     * @returns {number}
     * @constructor
     */
        KMUtl.degreeToRadian= function degreeToRadian(degree) {
        return degree * 0.017453292519943295;
    };
    /**
     * 単位変換　radian >> degree
     * @param radian
     * @returns {number}
     * @constructor
     */
    KMUtl.radianToDegree= function radianToDegree(radian) {
        return radian / 0.017453292519943295;
    };
    /**
     * 速度 rpm ->radian/sec に変換
     * @param rpm
     * @returns {number}
     * @constructor
     */
    KMUtl.rpmToRadianSec= function rpmToRadianSec(rpm) {
        //速度 rpm ->radian/sec(Math.PI*2/60)
        return rpm * 0.10471975511965977;
    };
    /**
     * 2点間の距離と角度を求める
     * @param from_x,from_y,to_x,to_y
     * @returns {number}
     * @constructor
     */
    KMUtl.twoPointDistanceAngle= function twoPointDistanceAngle(from_x, from_y, to_x, to_y) {
        var distance = Math.sqrt(Math.pow(from_x - to_x, 2) + Math.pow(from_y - to_y, 2));
        var radian = Math.atan2(from_y - to_y, from_x - to_x);
        return {dist: distance, radi: radian, deg: KMUtl.radianToDegree(radian)};
    };


    /* utf.js - UTF-8 <=> UTF-16 convertion
     *
     * Copyright (C) 1999 Masanao Izumo <iz@onicos.co.jp>
     * Version: 1.0
     * LastModified: Dec 25 1999
     * This library is free.  You can redistribute it and/or modify it.
     */
    KMUtl.Utf8ArrayToStr=function(array) {
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

    return KMUtl;
}());

module.exports = KMUtl;