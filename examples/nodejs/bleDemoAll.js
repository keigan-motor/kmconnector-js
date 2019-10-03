const KMConnector = require('kmconnector/KMConnectorBLE');
const KMMotorOneBLE=KMConnector.KMMotorOneBLE;


//-----------------------------------------
// デモ用標準入力の受付
//-----------------------------------------
let reader = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

reader.on('line', function(inputst) {
    switch (inputst){
        case 'help':
        case 'h':
            help();
            break;
        case 'scan':
            KMMotorOneBLE.startScanToCreateInstance(15000);//スキャンの開始
            break;
        case 'play':
            demoPlay();
            break;
        case 'discon':
           KMMotorOneBLE.allDisConnect();
            console.log('>');
            break;
        case 'exit':
            KMMotorOneBLE.allDisConnect();
            process.exit();
            break;
    }
});

function help(){
    console.log('[h]:help ヘルプ');
    console.log('[scan]:After the scan is completed, connect all detected motors. スキャン終了後、検出したモータ全ての接続');
    console.log('[play]:Motor demonstration playback. 接続したモータのデモ再生');
    console.log('[discon]:BLE disconnection of all motors. 全てのモーターのBLE接続を解除');
    console.log('[exit]:exit 終了');
    console.log('>');
}

help();


process.on('SIGINT',function  () {
    process.exit(0);
});

//-----------------------------------------
//  ex1-1) 接続例(BLEデバイスがモーターのみの場合)
//-----------------------------------------

//モーター発見時(毎回)
KMMotorOneBLE.on(KMMotorOneBLE.EVENT_TYPE.discoverMotor,function(kMMotorOne){
    console.log('onDiscoverMotor:'+kMMotorOne.deviceInfo.name);
    motorInit(kMMotorOne);//info::ex2) 初期化例
    //KMMotorOneBLE.stopScan();//info::raspizero等のアダプタによってはスキャンを終了してからモータを初期化する必要がある　https://github.com/sandeepmistry/noble#notes
});

//モーター発見時(新規モーターの発見時 1回のみ)
KMMotorOneBLE.on(KMMotorOneBLE.EVENT_TYPE.discoverNewMotor,function(kMMotorOne){
    console.log('onDiscover NewMotor:'+kMMotorOne.deviceInfo.name);
    console.log(Object.keys(KMMotorOneBLE.motors));//APIが認識しているモーターのインスタンスリスト(プロパティはモーター名)
});

//スキャンのタイムアウトイベント　info::アダプタによってはスキャン中に接続を行うとエラーになる為、スキャン終了後に接続を行う
KMMotorOneBLE.on(KMMotorOneBLE.EVENT_TYPE.scanTimeout,function(){
    console.log('onScanTimeout');
    allConnect();//info::ex2-2) モーターの一括接続
    console.log('>');
});

//-----------------------------------------
// ex1-2) 接続例 (nobleを他のBLEデバイスの接続と併用している場合)
//-----------------------------------------
/*
    let noble = require('noble');
    noble.on('discover',(nobleperipheral)=>{
        noble.stopScanning();
        //info::デバイスをモーターのみに選別する。
        let localName=nobleperipheral.advertisement?nobleperipheral.advertisement.localName:"";
        if(localName.startsWith('KM-1')){
            let kMMotorOneBLE= new KMMotorOneBLE(nobleperipheral);
            motorInit(kMMotorOneBLE);//info::ex2) 初期化例
        }
    });
    if(noble.state === 'poweredOn'){
        noble.startScanning();
    }else{
        noble.once('stateChange',()=>{
            noble.startScanning();
        });
    }
*/
//-----------------------------------------


//-----------------------------------------
// ex2) 初期化例
//-----------------------------------------
function motorInit(kMMotorOne){

    let name=kMMotorOne.deviceInfo.name;

    //個々のモーターのイベントバインド

    // 応答・再接続に成功した
    kMMotorOne.removeAllListeners(kMMotorOne.EVENT_TYPE.connect);
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.connect,function(kMDeviceInfo){
        console.log(name,':接続 onConnect');
    });
    //応答が無くなった・切断された
    kMMotorOne.removeAllListeners(kMMotorOne.EVENT_TYPE.disconnect);
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.disconnect,function(kMDeviceInfo){
        console.log(name,':onDisconnect');
    });
    //接続に失敗
    kMMotorOne.removeAllListeners(kMMotorOne.EVENT_TYPE.connectFailure);
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.connectFailure,function(kMDeviceInfo,err){
        console.log(name,':onConnectFailure'+':'+err);
    });
    //モーターの回転情報
    kMMotorOne.removeAllListeners(kMMotorOne.EVENT_TYPE.motorMeasurement);
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.motorMeasurement,function(kMRotState){
     //console.log(name,kMRotState.GetValObj());
    });
    //モーターのログ情報
    kMMotorOne.removeAllListeners(kMMotorOne.EVENT_TYPE.motorLog);
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.motorLog,function(kMMotorLog){
       console.log(name,kMMotorLog.GetValObj());
    });
    //モーターIMU情報受信
    kMMotorOne.removeAllListeners(kMMotorOne.EVENT_TYPE.imuMeasurement);
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.imuMeasurement,function(kMImuState){
        console.log(name,kMImuState.GetValObj()); //info::ジャイロ有効（kMMotorOneBLE.cmdEnableIMU()）時のみ出力される
    });
    //初期化完了して利用できるようになった
    kMMotorOne.removeAllListeners(kMMotorOne.EVENT_TYPE.init);
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.init,function(kMDeviceInfo){
        console.log(name,':初期化完了 onInit');
        console.log(name, kMMotorOne.deviceInfo.GetValObj());//BLE information
        //Motor register information
        kMMotorOne.cmdReadAllRegister().then(function(val){
            Object.keys(val).forEach(function(k){
                console.log(k+":"+val[k]);
            });
        }).catch(function(msg){
            console.log(msg);
        });
    });
}
//-----------------------------------------
// ex2-2) モーターの一括接続
//-----------------------------------------
function allConnect(){
    Object.keys(KMMotorOneBLE.motors).forEach((key)=>{
        let motor=KMMotorOneBLE.motors[key];
        //モーターの接続
        if(!motor.isConnect){
            motor.connect();
        }
    });
}



//-----------------------------------------
// ex3) コマンド実行
//-----------------------------------------
function cmdTest(kMMotorOneBLE){
    let name=kMMotorOneBLE.deviceInfo.name;
    //LEDの点灯(1s)
    console.log(name,':LEDの点灯(赤色 2s)');
    new Promise((resolve) =>{
        kMMotorOneBLE.cmdLed(1,200,0,0);
        kMMotorOneBLE.cmdPresetPosition(0);//現在座標を原点として設定
        setTimeout(()=>{resolve(true);},2000);
    }).then((resolve) =>{
        //LEDの点灯(黄色 1s)
        console.log(name,':LEDの点灯(黄色 2s)');
       return new Promise((resolve) =>{
           kMMotorOneBLE.cmdLed(1,200,200,0);
           setTimeout(()=>{resolve(true);},2000);
        });
    }).then((resolve) =>{
        //モーターの回転(正転10rpm 2s)
        console.log(name,':モーターの回転(正転10rpm 2s)');
        return new Promise((resolve) =>{
            kMMotorOneBLE.cmdSpeed_rpm(10);
            kMMotorOneBLE.cmdEnable();
            kMMotorOneBLE.cmdRunForward();
            setTimeout(()=>{resolve(true);},2000);
        });
    }).then((resolve) =>{
        //モーターの回転(逆転10rpm 1s)
        console.log(name,':モーターの回転(逆転10rpm 2s)');
        return new Promise((resolve) =>{
            kMMotorOneBLE.cmdRunReverse();
            setTimeout(()=>{resolve(true);},2000);
        });
    }).then((resolve) =>{
        //モーターの回転(逆転30rpm 2s)
        console.log(name,':モーターの回転(逆転30rpm 2s)');
        return new Promise((resolve) =>{
            kMMotorOneBLE.cmdSpeed_rpm(30);
            kMMotorOneBLE.cmdRunReverse();
            setTimeout(()=>{resolve(true);},2000);
        });
    }).then((resolve) =>{
        //停止(2s)
        console.log(name,':停止(2s)');
        return new Promise((resolve) =>{
            kMMotorOneBLE.cmdStop();
            setTimeout(()=>{resolve(true);},2000);
        });
    }).then((resolve) =>{
        //15度回転(30rpm 1s)
        console.log(name,':90度回転(30rpm 4s)');
        return new Promise((resolve) =>{
            kMMotorOneBLE.cmdMoveByDistance(KMConnector.KMUtl.degreeToRadian(90));//degree >> radian
            setTimeout(()=>{resolve(true);},4000);
        });
    }).then((resolve) =>{
        //15度回転(30rpm 1s)
        console.log(name,':90度回転(30rpm 4s)');
        return new Promise((resolve) =>{
            kMMotorOneBLE.cmdMoveByDistance(KMConnector.KMUtl.degreeToRadian(90));
            setTimeout(()=>{resolve(true);},4000);
        });
    }).then((resolve) =>{
        //30度逆回転(30rpm 2s)
        console.log(name,':180度逆回転(30rpm 5s)');
        return new Promise((resolve) =>{
            kMMotorOneBLE.cmdMoveByDistance(KMConnector.KMUtl.degreeToRadian(-180));
            setTimeout(()=>{resolve(true);},5000);
        });
    }).then((resolve) =>{
        //原点移動
        console.log(name,':原点移動');
        return new Promise((resolve) =>{
            kMMotorOneBLE.cmdMoveToPosition(0);
            setTimeout(()=>{resolve(true);},5000);
        });
    }).then((resolve) =>{
        //停止(励磁あり)
        console.log(name,':停止(励磁あり)');
        kMMotorOneBLE.cmdFree();
    });

}

//-----------------------------------------
// ex4) 検出モーター全て コマンド実行
//-----------------------------------------
function demoPlay(){
    Object.keys(KMMotorOneBLE.motors).forEach((key)=>{
        cmdTest(KMMotorOneBLE.motors[key]);
    });
}
