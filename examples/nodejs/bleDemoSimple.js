const KMConnector = require('../../KMConnectorBLE');
const KMMotorOneBLE=KMConnector.KMMotorOneBLE;

//モーター発見時(新規モーターの発見時 1回のみ)
KMMotorOneBLE.on(KMMotorOneBLE.EVENT_TYPE.discoverNewMotor,function(kMMotorOne){
    let name=kMMotorOne.deviceInfo.name;
    console.log('onDiscover NewMotor:'+name);
    console.log(Object.keys(KMMotorOneBLE.motors));//APIが認識しているモーターのインスタンスリスト(プロパティはモーター名)
    KMMotorOneBLE.stopScan();//info::End scanning when one device is detected

    // 応答・再接続に成功した
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
    //応答が無くなった・切断された
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.disconnect,(kMDeviceInfo)=>{
        console.log(name,':onDisconnect');
    });
    //接続に失敗
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.connectFailure,(kMDeviceInfo,err)=>{
        console.log(name,':onConnectFailure'+':'+err);
    });
    //モーターの回転情報
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.motorMeasurement,(kMRotState)=>{
      //console.log(name,kMRotState.GetValObj());
    });
    //モーターIMU情報受信
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.imuMeasurement,(kMImuState)=>{
       console.log(name,kMImuState.GetValObj()); //info::ジャイロ有効（kMMotorOneBLE.cmdEnableIMU()）時のみ出力される
    });
    //モーターのログ情報
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.motorLog,(kMMotorLog)=>{
       // console.log(name,kMMotorLog.GetValObj());
    });
    //初期化完了して利用できるようになった
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.init,(kMDeviceInfo)=>{
        console.log(name, ':onInit');//モーターの情報
        console.log(kMMotorOne.deviceInfo.GetValObj());
    });

    kMMotorOne.connect();

});

//スキャンのタイムアウトイベント　
KMMotorOneBLE.on(KMMotorOneBLE.EVENT_TYPE.scanTimeout,()=>{
    console.log('onScanTimeout');
});

console.log('スキャンの開始');
KMMotorOneBLE.startScanToCreateInstance(20000);//スキャンの開始