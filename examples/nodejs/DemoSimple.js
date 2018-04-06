//let KMConnector = require('kmconnector');
let KMConnector = require('../../index');
global.KMConnector=KMConnector;//debug


//モーター発見時(新規モーターの発見時 1回のみ)
KMConnector.KMMotorOneBLE.on(KMConnector.KMMotorOneBLE.EVENT_TYPE.discoverNewMotor,function(kMMotorOneBLE){
    let name=kMMotorOneBLE.deviceInfo.name;
    console.log('onDiscover NewMotor:'+name);
    console.log(Object.keys(KMConnector.KMMotorOneBLE.motors));//APIが認識しているモーターのインスタンスリスト(プロパティはモーター名)
    KMConnector.KMMotorOneBLE.stopScan();//info::End scanning when one device is detected

    // 応答・再接続に成功した
    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.connect,function(kMDeviceInfo){
        console.log(name,':onConnect');
        //Motor register information
        kMMotorOneBLE.cmdReadAllRegister().then(function(val){
            Object.keys(val).forEach(function(k){
                console.log(k+":"+val[k]);
            });
        }).catch(function(msg){
            console.log(msg);
        });
        //info::Command execution
        if(kMMotorOneBLE.isConnect){
            kMMotorOneBLE.cmdLed(kMMotorOneBLE.cmdLed_LED_STATE.LED_STATE_ON_SOLID,200,0,0);//led
            setTimeout(()=>{
                kMMotorOneBLE.cmdLed(kMMotorOneBLE.cmdLed_LED_STATE.LED_STATE_ON_FLASH,200,200,0);//led
                kMMotorOneBLE.cmdSpeed_rpm(1);
                kMMotorOneBLE.cmdEnable();
                kMMotorOneBLE.cmdRunForward();
            },2000);
        }
    });
    //応答が無くなった・切断された
    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.disconnect,function(kMDeviceInfo){
        console.log(name,':onDisconnect');
    });
    //接続に失敗
    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.connectFailure,function(kMDeviceInfo,err){
        console.log(name,':onConnectFailure'+':'+err);
    });
    //モーターの回転情報
    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.motorMeasurement,function(kMRotState){
        console.log(name,kMRotState.GetValObj());
    });
    //モーターIMU情報受信
    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.imuMeasurement,function(kMImuState){
       console.log(name,kMImuState.GetValObj()); //info::ジャイロ有効（kMMotorOneBLE.cmdEnableIMU()）時のみ出力される
    });
    //初期化完了して利用できるようになった
    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.init,function(kMDeviceInfo){
        console.log(name, ':onInit',kMMotorOneBLE.deviceInfo.GetValObj());//モーターの情報
    });

    kMMotorOneBLE.connect();

});

//スキャンのタイムアウトイベント　
KMConnector.KMMotorOneBLE.on(KMConnector.KMMotorOneBLE.EVENT_TYPE.scanTimeout,function(){
    console.log('onScanTimeout');
});

console.log('スキャンの開始');
KMConnector.KMMotorOneBLE.startScanToCreateInstance(20000);//スキャンの開始