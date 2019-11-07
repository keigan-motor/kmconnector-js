/**
 * usbDemoSync.js
 *  (MotorFarm Ver >= 2.23)
 *  https://docs.keigan-motor.com/firmware/download
 */
const KMConnector = require('kmconnector/KMConnectorUSB');
const KMMotorOneUSBSerial=KMConnector.KMMotorOneUSBSerial;
const KMUtl=KMConnector.KMUtl;

let reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});


let kMMotorOne=new KMMotorOneUSBSerial('/dev/tty.usbserial-DM00LN44');//info::for Mac
//let kMMotorOne=new KMMotorOneUSBSerial('/dev/serial/by-id/usb-FTDI_FT230X_Basic_UART_DM00KBZZ-if00-port0');//info::For a static device port
//let kMMotorOne=new KMMotorOneUSBSerial('COM1');//info::for Windows COM port

kMMotorOne.on(kMMotorOne.EVENT_TYPE.connect,function(kMDeviceInfo){
    console.log(kMMotorOne.deviceInfo.name,':onConnect');
    if(kMMotorOne.isConnect){
        kMMotorOne.cmdStop();
        playSync(kMMotorOne);
    }
});


kMMotorOne.on(kMMotorOne.EVENT_TYPE.disconnect,(kMDeviceInfo)=>{
    console.log(kMMotorOne.deviceInfo.name,':onDisconnect');
    //info::Try Auto Reconnect
    // setTimeout(()=>{
    //     kMMotorOne.connect();
    // },5000);
});

kMMotorOne.on(kMMotorOne.EVENT_TYPE.connectFailure,(kMDeviceInfo,err)=>{
    console.log(kMMotorOne.deviceInfo.name,':onConnectFailure'+':'+err);
    //info::Try Auto Reconnect
    // setTimeout(()=>{
    //     kMMotorOne.connect();
    // },5000);
});

kMMotorOne.on(kMMotorOne.EVENT_TYPE.motorMeasurement,(kMRotState)=>{
    //console.log(kMMotorOne.deviceInfo.name,kMRotState.GetValObj());
});

kMMotorOne.on(kMMotorOne.EVENT_TYPE.imuMeasurement,(kMImuState)=>{
    //console.log(kMMotorOne.deviceInfo.name,kMImuState.GetValObj()); //info::It is output only when gyro is enabled (kMMotorOneBLE.cmdEnableIMU())
});

kMMotorOne.on(kMMotorOne.EVENT_TYPE.motorLog,(kMMotorLog)=>{
  //  console.log(kMMotorOne.deviceInfo.name,kMMotorLog.GetValObj());
});

kMMotorOne.on(kMMotorOne.EVENT_TYPE.init,(kMDeviceInfo)=>{

});


function playSync(kMMotorOne){
    let name=kMMotorOne.deviceInfo.name;
    kMMotorOne.cmdEnable();
    Promise.resolve().then((resolve) =>{
        kMMotorOne.cmdResponse(0);//コマンド通知ON
        kMMotorOne.cmdNotifyPosArrival(1,KMUtl.degreeToRadian(0.5),200);//位置制御時、目標位置に到達時、判定条件を満たした場合通知を行う
        console.log(name,':LEDの点灯(赤色 2s)');
        kMMotorOne.cmdLed(1,200,0,0);
        kMMotorOne.cmdPresetPosition(0);//現在座標を原点として設定
        return new Promise((resolve) =>{setTimeout(()=>{resolve(true);},2000);});
    }).then((resolve) =>{
        console.log(name,':LEDの点灯(黄色 2s)');
        kMMotorOne.cmdLed(1,200,200,0);
        return new Promise((resolve) =>{setTimeout(()=>{resolve(true);},2000);});
    }).then((resolve) =>{
        console.log(name,':360度回転(30rpm)');
        //Sync Command (MotorFarm Ver >= 2.23)
        //cmdMoveByDistanceSync(座標 radian,速度 rad/sec,タイムアウトms 0は無限)
        return kMMotorOne.cmdMoveByDistanceSync(KMConnector.KMUtl.degreeToRadian(360),KMConnector.KMUtl.rpmToRadianSec(30));
    }).then((resolve) =>{
        console.log(name,':-360度回転(10rpm)');
        return kMMotorOne.cmdMoveByDistanceSync(KMConnector.KMUtl.degreeToRadian(-360),KMConnector.KMUtl.rpmToRadianSec(10));
    }).then((resolve) =>{
        console.log(name,':720度回転(30rpm)');
        return kMMotorOne.cmdMoveByDistanceSync(KMConnector.KMUtl.degreeToRadian(720),KMConnector.KMUtl.rpmToRadianSec(30));//Sync Command (MotorFarm Ver >= 2.23)
    }).then((resolve) =>{
        console.log(name,':-360度回転 タイムアウト 5s');
        return kMMotorOne.cmdMoveByDistanceSync(KMConnector.KMUtl.degreeToRadian(-360),null,5000);
    }).then((resolve) =>{
        console.log(name,':原点移動 タイムアウト 5s');
        return kMMotorOne.cmdMoveToPositionSync(0,null,5000);
    }).then((resolve) =>{
        console.log(name,':停止');
        kMMotorOne.cmdStop();//info::励磁あり
        kMMotorOne.cmdDisable();//info::励磁OFF

        console.log('---------------------------------------------');
        console.log('[play]:デモをリプレイ');
        console.log('[exit]:exit 終了');
        console.log('>');
    }).catch((e)=>{
        console.log(name,e);
        kMMotorOne.cmdDisable();

        console.log('---------------------------------------------');
        console.log('[play]:デモをリプレイ');
        console.log('[exit]:exit 終了');
        console.log('>');
    });
}


reader.on('line', function(inputst) {
    switch (inputst){
        case 'start':
            console.log('接続の開始');
            kMMotorOne.connect();
            break;
        case 'play':
            playSync(kMMotorOne);
            break;
        case 'exit':
            KMMotorOneUSBSerial.allDisConnect();
            process.exit();
            break;
    }
});
console.log('---------------------------------------------');
console.log('[start]:接続＆デモを開始（注意 モーターが動きます）');
console.log('[exit]:exit 終了');
console.log('>');