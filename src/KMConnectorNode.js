/***
 * KMConnector.js
 * version 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
'use strict';
module.exports = {
    KMUtl: require('./KMUtl.js'),
    KMVector2: require('./KMStructures.js').KMVector2,
    //KMVector3: require('./KMStructures.js').KMVector3,
    KMImuState: require('./KMStructures.js').KMImuState,
    KMLedState: require('./KMStructures.js').KMLedState,
    KMRotState: require('./KMStructures.js').KMRotState,
    KMDeviceInfo: require('./KMStructures.js').KMDeviceInfo,
    KMMotorOneBLE: require('./KMMotorOneBLE.js')
};
