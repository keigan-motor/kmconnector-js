//let KMConnector = require('kmconnector');
let KMConnector = require('../../index');
global.KMConnector=KMConnector;//debug


///単体接続

let kMMotorOneUSBSerial=new KMConnector.KMMotorOneUSBSerial('/dev/tty.usbserial-DM00LP55');

// 応答・再接続に成功した
kMMotorOneUSBSerial.on(kMMotorOneUSBSerial.EVENT_TYPE.connect,function(kMDeviceInfo){
    console.log(kMDeviceInfo.name,':onConnect');
    //Motor register information
    //todo::モーターの全てのレジスタ値の取得
    // kMMotorOneUSBSerial.cmdReadAllRegister().then(function(val){
    //     Object.keys(val).forEach(function(k){
    //         console.log(k+":"+val[k]);
    //     });
    // }).catch(function(msg){
    //     console.log(msg);
    // });
    //info::Command execution
    if(kMMotorOneUSBSerial.isConnect){

        kMMotorOneUSBSerial.cmdLed(kMMotorOneUSBSerial.cmdLed_LED_STATE.LED_STATE_ON_SOLID,100,100,0);//led
        //kMMotorOneUSBSerial.cmdWait(10000);
        setTimeout(()=>{
            kMMotorOneUSBSerial.cmdLed(kMMotorOneUSBSerial.cmdLed_LED_STATE.LED_STATE_ON_FLASH,200,200,0);//led
            kMMotorOneUSBSerial.cmdSpeed_rpm(10);
            kMMotorOneUSBSerial.cmdEnable();
            kMMotorOneUSBSerial.cmdRunForward();
            kMMotorOneUSBSerial.cmdWait(5000);
            kMMotorOneUSBSerial.cmdSpeed_rpm(100);
            kMMotorOneUSBSerial.cmdRunReverse();
            kMMotorOneUSBSerial.cmdWait(5000);
            kMMotorOneUSBSerial.cmdStop();
            kMMotorOneUSBSerial.cmdFree();
            kMMotorOneUSBSerial.cmdEnableIMU();//todo::ファームに実装が無い
        },2000);
    }
});
//応答が無くなった・切断された
kMMotorOneUSBSerial.on(kMMotorOneUSBSerial.EVENT_TYPE.disconnect,function(kMDeviceInfo){
    console.log(kMDeviceInfo.name,':onDisconnect');
});
//接続に失敗
kMMotorOneUSBSerial.on(kMMotorOneUSBSerial.EVENT_TYPE.connectFailure,function(kMDeviceInfo,err){
    console.log(kMDeviceInfo.name,':onConnectFailure'+':'+err);
});
//モーターの回転情報
kMMotorOneUSBSerial.on(kMMotorOneUSBSerial.EVENT_TYPE.motorMeasurement,function(kMRotState){
    let name=kMMotorOneUSBSerial.deviceInfo.name;
    console.log(name,kMRotState.GetValObj());
});
//モーターIMU情報受信
kMMotorOneUSBSerial.on(kMMotorOneUSBSerial.EVENT_TYPE.imuMeasurement,function(kMImuState){
    let name=kMMotorOneUSBSerial.deviceInfo.name;
   console.log(name,kMImuState.GetValObj()); //info::ジャイロ有効（kMMotorOneBLE.cmdEnableIMU()）時のみ出力される
});
//初期化完了して利用できるようになった
kMMotorOneUSBSerial.on(kMMotorOneUSBSerial.EVENT_TYPE.init,function(kMDeviceInfo){
    console.log(kMDeviceInfo.name, ':onInit',kMMotorOneUSBSerial.deviceInfo.GetValObj());//モーターの情報
});

kMMotorOneUSBSerial.connect();