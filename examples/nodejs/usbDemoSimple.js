const KMConnector = require('../../KMConnectorUSB');
const KMMotorOneUSBSerial=KMConnector.KMMotorOneUSBSerial;

let kMMotorOne=new KMMotorOneUSBSerial('/dev/ttyUSB0');//

//let kMMotorOne=new KMMotorOneUSBSerial('/dev/serial/by-id/usb-FTDI_FT230X_Basic_UART_DM00KBZZ-if00-port0');//For a static device port

//let kMMotorOne=new KMMotorOneUSBSerial('COM1');//for Windows COM port

kMMotorOne.on(kMMotorOne.EVENT_TYPE.connect,function(kMDeviceInfo){
    console.log(kMMotorOne.deviceInfo.name,':onConnect');
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
            kMMotorOne.cmdSpeed_rpm(5);
            kMMotorOne.cmdEnable();
            kMMotorOne.cmdRunForward();
            kMMotorOne.cmdWaitQueue(4000);
            kMMotorOne.cmdRunReverse();

        },3000);
    }
});


kMMotorOne.on(kMMotorOne.EVENT_TYPE.disconnect,(kMDeviceInfo)=>{
    console.log(kMMotorOne.deviceInfo.name,':onDisconnect');
    //info::Try Auto Reconnect
    setTimeout(()=>{
        kMMotorOne.connect();
    },5000);
});

kMMotorOne.on(kMMotorOne.EVENT_TYPE.connectFailure,(kMDeviceInfo,err)=>{
    console.log(kMMotorOne.deviceInfo.name,':onConnectFailure'+':'+err);
    //info::Try Auto Reconnect
    setTimeout(()=>{
        kMMotorOne.connect();
    },5000);
});

kMMotorOne.on(kMMotorOne.EVENT_TYPE.motorMeasurement,(kMRotState)=>{
  //console.log(kMMotorOne.deviceInfo.name,kMRotState.GetValObj());
});

kMMotorOne.on(kMMotorOne.EVENT_TYPE.imuMeasurement,(kMImuState)=>{
   console.log(kMMotorOne.deviceInfo.name,kMImuState.GetValObj()); //info::It is output only when gyro is enabled (kMMotorOneBLE.cmdEnableIMU())
});

kMMotorOne.on(kMMotorOne.EVENT_TYPE.motorLog,(kMMotorLog)=>{
   // console.log(kMMotorOne.deviceInfo.name,kMMotorLog.GetValObj());
});

kMMotorOne.on(kMMotorOne.EVENT_TYPE.init,(kMDeviceInfo)=>{

});

kMMotorOne.connect();


