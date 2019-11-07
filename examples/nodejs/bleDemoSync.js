/**
 * bleDemoSync.js
 *  (MotorFarm Ver >= 2.23)
 *  https://docs.keigan-motor.com/firmware/download
 */
const KMConnector = require('kmconnector/KMConnectorBLE');
const KMMotorOneBLE=KMConnector.KMMotorOneBLE;
const KMUtl=KMConnector.KMUtl;

let reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

let _kMMotorOne=null;

//モーター発見時(新規モーターの発見時 1回のみ)
KMMotorOneBLE.on(KMMotorOneBLE.EVENT_TYPE.discoverNewMotor,function(kMMotorOne){
    _kMMotorOne=kMMotorOne;
    let name=kMMotorOne.deviceInfo.name;
    console.log('onDiscover NewMotor:'+name);
    console.log(Object.keys(KMMotorOneBLE.motors));//APIが認識しているモーターのインスタンスリスト(プロパティはモーター名)
    KMMotorOneBLE.stopScan();//info::End scanning when one device is detected

    // 応答・再接続に成功した
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.connect,function(kMDeviceInfo){
        console.log(name,':onConnect');
        //info::Command execution
        if(kMMotorOne.isConnect){
            playSync(kMMotorOne);
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
        return kMMotorOne.cmdMoveByDistanceSync(KMConnector.KMUtl.degreeToRadian(360),KMConnector.KMUtl.rpmToRadianSec(30));//Sync Command (MotorFarm Ver >= 2.23)
    }).then((resolve) =>{
        console.log(name,':-360度回転(10rpm)');
        return kMMotorOne.cmdMoveByDistanceSync(KMConnector.KMUtl.degreeToRadian(-360),KMConnector.KMUtl.rpmToRadianSec(10));
    }).then((resolve) =>{
        console.log(name,':360度回転(30rpm)');
        return kMMotorOne.cmdMoveByDistanceSync(KMConnector.KMUtl.degreeToRadian(360),KMConnector.KMUtl.rpmToRadianSec(30));//Sync Command (MotorFarm Ver >= 2.23)
    }).then((resolve) =>{
        console.log(name,':-360度回転(50rpm)');
        return kMMotorOne.cmdMoveByDistanceSync(KMConnector.KMUtl.degreeToRadian(-360),KMConnector.KMUtl.rpmToRadianSec(50));
    }).then((resolve) =>{
        console.log(name,':原点移動');
        return kMMotorOne.cmdMoveToPositionSync(0);
    }).then((resolve) =>{
        console.log(name,':停止');
        kMMotorOne.cmdStop();

        console.log('---------------------------------------------');
        console.log('[play]:デモをリプレイ');
        console.log('[exit]:exit 終了');
        console.log('>');
    }).catch((e)=>{
        console.log(name,e);

        console.log('---------------------------------------------');
        console.log('[play]:デモをリプレイ');
        console.log('[exit]:exit 終了');
        console.log('>');
    });
}

reader.on('line', function(inputst) {
    switch (inputst){
        case 'start':
            console.log('スキャンの開始');
            KMMotorOneBLE.startScanToCreateInstance(20000);//スキャンの開始
            break;
        case 'play':
            playSync(_kMMotorOne);
            break;
        case 'exit':
            KMMotorOneBLE.allDisConnect();
            process.exit();
            break;
    }
});

console.log('---------------------------------------------');
console.log('[start]:接続＆デモを開始（注意 モーターが動きます）');
console.log('[exit]:exit 終了');
console.log('>');
