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
    KMUtl: require('./KMUtl'),
    KMVector2: require('./KMStructures').KMVector2,
    KMImuState: require('./KMStructures').KMImuState,
    KMLedState: require('./KMStructures').KMLedState,
    KMRotState: require('./KMStructures').KMRotState,
    KMDeviceInfo: require('./KMStructures').KMDeviceInfo,
    KMMotorOneBLE: require('./KMMotorOneBLE'),
    KMMotorOneUSBSerial: require('./KMMotorOneUSBSerial')
};
