const KMConnector = require('kmconnector/KMConnectorUSB');
const KMMotorOneUSBSerial=KMConnector.KMMotorOneUSBSerial;

//Motor discovery (only once when a new motor is found)
KMMotorOneUSBSerial.on(KMMotorOneUSBSerial.EVENT_TYPE.discoverNewMotor,function(kMMotorOne){
    let name=kMMotorOne.deviceInfo.name;
    console.log('onDiscover NewMotor:'+name);

    kMMotorOne.on(kMMotorOne.EVENT_TYPE.connect,function(kMDeviceInfo){
        console.log(name,':onConnect');
        //Motor register information
        kMMotorOne.cmdReadAllRegister().then((val)=>{
            Object.keys(val).forEach((k)=>{
                console.log(k+":"+val[k]);
            });
        }).catch((msg)=>{
            console.log(msg);
        });
        //info::Command execution
        if(kMMotorOne.isConnect){
            kMMotorOne.cmdLed(kMMotorOne.cmdLed_LED_STATE.LED_STATE_ON_SOLID,200,0,0);//led
            setTimeout(()=>{
                kMMotorOne.cmdLed(kMMotorOne.cmdLed_LED_STATE.LED_STATE_ON_FLASH,200,200,0);//led
                kMMotorOne.cmdSpeed_rpm(20);
                kMMotorOne.cmdEnable();
                kMMotorOne.cmdRunForward();
                kMMotorOne.cmdWaitQueue(4000);
                kMMotorOne.cmdRunReverse();

            },3000);
        }
    });

    kMMotorOne.on(kMMotorOne.EVENT_TYPE.disconnect,(kMDeviceInfo)=>{
        console.log(name,':onDisconnect');
        //info::Try Auto Reconnect
        setTimeout(()=>{
            kMMotorOne.connect();
        },5000);
    });

    kMMotorOne.on(kMMotorOne.EVENT_TYPE.connectFailure,(kMDeviceInfo,err)=>{
        console.log(name,':onConnectFailure'+':'+err);
        //info::Try Auto Reconnect
        setTimeout(()=>{
            kMMotorOne.connect();
        },5000);
    });

    kMMotorOne.on(kMMotorOne.EVENT_TYPE.motorMeasurement,(kMRotState)=>{
      //console.log(name,kMRotState.GetValObj());
    });

    kMMotorOne.on(kMMotorOne.EVENT_TYPE.imuMeasurement,(kMImuState)=>{
       console.log(name,kMImuState.GetValObj()); //info::It is output only when gyro is enabled (kMMotorOneBLE.cmdEnableIMU())
    });

    kMMotorOne.on(kMMotorOne.EVENT_TYPE.motorLog,(kMMotorLog)=>{
       // console.log(name,kMMotorLog.GetValObj());
    });

    kMMotorOne.on(kMMotorOne.EVENT_TYPE.init,(kMDeviceInfo)=>{
        console.log(name, ':onInit');
        console.log(kMMotorOne.deviceInfo.GetValObj());
    });

    kMMotorOne.connect();

});

KMMotorOneUSBSerial.on(KMMotorOneUSBSerial.EVENT_TYPE.discoverMotor,function(kMMotorOne){
    console.log('onDiscoverMotor:'+kMMotorOne.deviceInfo.name);
});

console.log('Start Scan>>>');
KMMotorOneUSBSerial.startScanToCreateInstance().then((motorsByUUIDs) => {

}).catch((err) => {
    console.log(err);
});
