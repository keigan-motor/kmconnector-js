const KMConnector=require('../../kmconnector-local');
const SerialPort = require('serialport');

const KMMotorOneUSBSerial=KMConnector.KMMotorOneUSBSerial;

//--------------------------
// section::motorイベント＆ 接続
//--------------------------
// 応答・再接続に成功した
on_kMMotorOneUSBSerial_connect=function(kMDeviceInfo){
    console.log(kMDeviceInfo.name,':onConnect');
    //Motor register information
    //todo::モーターの全てのレジスタ値の取得
    // this.cmdReadAllRegister().then(function(val){
    //     Object.keys(val).forEach(function(k){
    //         console.log(k+":"+val[k]);
    //     });
    // }).catch(function(msg){
    //     console.log(msg);
    // });
    //info::Command execution
    if(this.isConnect){

        this.cmdLed(this.cmdLed_LED_STATE.LED_STATE_ON_SOLID,100,100,0);//led
        //this.cmdWait(10000);
        setTimeout(()=>{
            this.cmdLed(this.cmdLed_LED_STATE.LED_STATE_ON_FLASH,200,200,0);//led
            this.cmdSpeed_rpm(10);
            this.cmdEnable();
            this.cmdRunForward();
            this.cmdWait(5000);
            this.cmdSpeed_rpm(100);
            this.cmdRunReverse();
            this.cmdWait(5000);
            this.cmdStop();
            this.cmdFree();
            this.cmdEnableIMU();//todo::ファームに実装が無い
        },2000);
    }
};
//応答が無くなった・切断された
on_kMMotorOneUSBSerial_disconnect=function(kMDeviceInfo){
    //todo::切断された場合の自動再接続処理
    console.log(kMDeviceInfo.name,':onDisconnect');
};
//接続に失敗
on_kMMotorOneUSBSerial_connectFailure=function(kMDeviceInfo,err){
    //todo::切断された場合の自動再接続処理
    console.log(kMDeviceInfo.name,':onConnectFailure'+':'+err);
};
//モーターの回転情報
on_kMMotorOneUSBSerial_motorMeasurement=function(kMRotState){
    let name=this.deviceInfo.name;
    console.log(name,kMRotState.GetValObj());
};
//モーターIMU情報受信
on_kMMotorOneUSBSerial_imuMeasurement=function(kMImuState){
    let name=this.deviceInfo.name;
    console.log(name,kMImuState.GetValObj()); //info::ジャイロ有効（kMMotorOneBLE.cmdEnableIMU()）時のみ出力される
};
//初期化完了して利用できるようになった
on_kMMotorOneUSBSerial_init=function(kMDeviceInfo){
    console.log(kMDeviceInfo.name, ':onInit',this.deviceInfo.GetValObj());//モーターの情報
};

//モーター発見時(新規モーターの発見時 1回のみ)
KMMotorOneUSBSerial.on(KMMotorOneUSBSerial.EVENT_TYPE.discoverNewMotor,function(kMMotorOneUSB){
    kMMotorOneUSB.on(kMMotorOneUSB.EVENT_TYPE.connect,on_kMMotorOneUSBSerial_connect);
    kMMotorOneUSB.on(kMMotorOneUSB.EVENT_TYPE.disconnect,on_kMMotorOneUSBSerial_disconnect);
    kMMotorOneUSB.on(kMMotorOneUSB.EVENT_TYPE.connectFailure,on_kMMotorOneUSBSerial_connectFailure);
   // kMMotorOneUSB.on(kMMotorOneUSB.EVENT_TYPE.motorMeasurement,on_kMMotorOneUSBSerial_motorMeasurement);
   // kMMotorOneUSB.on(kMMotorOneUSB.EVENT_TYPE.imuMeasurement,on_kMMotorOneUSBSerial_imuMeasurement);
    kMMotorOneUSB.on(kMMotorOneUSB.EVENT_TYPE.init,on_kMMotorOneUSBSerial_init);
    kMMotorOneUSB.connect();
});



// ///単体接続
// let dev_nemes=['/dev/ttyUSB0','/dev/ttyUSB1','/dev/ttyUSB2','/dev/ttyUSB3'];
// let motor_lists={};
// for(let i=0;i<dev_nemes.length;i++){
//     let mt=new KMConnector.KMMotorOneUSBSerial(dev_nemes[i]);
//     mt.on(mt.EVENT_TYPE.connect,on_kMMotorOneUSBSerial_connect);
//     mt.on(mt.EVENT_TYPE.disconnect,on_kMMotorOneUSBSerial_disconnect);
//     mt.on(mt.EVENT_TYPE.connectFailure,on_kMMotorOneUSBSerial_connectFailure);
//     mt.on(mt.EVENT_TYPE.motorMeasurement,on_kMMotorOneUSBSerial_motorMeasurement);
//     mt.on(mt.EVENT_TYPE.imuMeasurement,on_kMMotorOneUSBSerial_imuMeasurement);
//     mt.on(mt.EVENT_TYPE.init,on_kMMotorOneUSBSerial_init);
//     motor_lists[dev_nemes[i]]=mt;
//     mt.connect();
// }


//--------------------------
// section::デバッグ関数
//--------------------------

// function ch_usbSerial(){
//     SerialPort.list().then((ports)=>{
//         ports.forEach((port)=> {
//             console.log(port.comName);
//             console.log(port.pnpId);
//             console.log(port.manufacturer);
//         });
//     }).catch((err)=>{
//         console.log(err);
//
//     });
// }
// function ch_motionPlay(){
//     Object.keys(motor_lists).forEach((key)=>{
//         let kMMotorOneUSBSerial=   motor_lists[key];
//         if(kMMotorOneUSBSerial.isConnect){
//
//             kMMotorOneUSBSerial.cmdLed(kMMotorOneUSBSerial.cmdLed_LED_STATE.LED_STATE_ON_SOLID,100,100,0);//led
//             //this.cmdWait(10000);
//             setTimeout(()=>{
//                 kMMotorOneUSBSerial.cmdLed(kMMotorOneUSBSerial.cmdLed_LED_STATE.LED_STATE_ON_FLASH,200,200,0);//led
//                 kMMotorOneUSBSerial.cmdSpeed_rpm(10);
//                 kMMotorOneUSBSerial.cmdEnable();
//                 kMMotorOneUSBSerial.cmdRunForward();
//                 kMMotorOneUSBSerial.cmdWait(5000);
//                 kMMotorOneUSBSerial.cmdSpeed_rpm(100);
//                 kMMotorOneUSBSerial.cmdRunReverse();
//                 kMMotorOneUSBSerial.cmdWait(5000);
//                 kMMotorOneUSBSerial.cmdStop();
//                 kMMotorOneUSBSerial.cmdFree();
//                 kMMotorOneUSBSerial.cmdEnableIMU();//todo::ファームに実装が無い
//             },2000);
//         }
//     })
// }
//
// function ch_kMMotorOneIsConnect(){
//     Object.keys(motor_lists).forEach((key)=>{
//         let kMMotorOneUSBSerial=   motor_lists[key];
//         console.log("ch_IsConnect",key,kMMotorOneUSBSerial.name,kMMotorOneUSBSerial.isConnect);
//
//     });
// }

function ch_kMMotorOneIsConnect(){
    let mts=KMMotorOneUSBSerial.motorsByUUID;
    Object.keys(mts).forEach((key)=>{
        let kMMotorOneUSBSerial=   mts[key];
        console.log("ch_IsConnect",key,kMMotorOneUSBSerial.name,kMMotorOneUSBSerial.isConnect);

    });
}

function ch_motionPlay(){
    let mts=KMMotorOneUSBSerial.motorsByUUID;
    Object.keys(mts).forEach((key)=>{
        let kMMotorOneUSBSerial=   mts[key];
        if(kMMotorOneUSBSerial.isConnect){

        kMMotorOneUSBSerial.cmdLed(kMMotorOneUSBSerial.cmdLed_LED_STATE.LED_STATE_ON_SOLID,100,100,0);//led
        //this.cmdWait(10000);
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
    })
}


function ch_usbmode(){
    KMMotorOneUSBSerial.clearMotors();
    setTimeout(()=>{
        KMMotorOneUSBSerial.startScanToCreateInstance().then((motorsByUUID)=>{
            Object.keys(motorsByUUID).forEach((k)=>{
                let motor= motorsByUUID[k];
                console.log("isConnect:",motor.name,motor.isConnect);
                if(!motor.isConnect){
                    motor.once(motor.EVENT_TYPE.connect,function(kMDeviceInfo){
                        console.log("USBモード設定:",k);
                        //info::インターフェイス設定　interface レジスタの設定は、saveAllRegisters でのフラッシュ書き込み後、再起動（reboot）しないと反映されない。
                        motor.cmdDisable();
                        motor.cmdInterface(0b10001000);//物理ボタン USBのみ
                        motor.cmdSaveAllRegisters();
                        setTimeout(()=>{
                            motor.cmdReboot();
                        },500);

                    });
                    motor.connect();
                }
            })
        });
    },2000);
}

////
global.ch_kMMotorOneIsConnect=ch_kMMotorOneIsConnect;
// global.ch_usbSerial=ch_usbSerial;
global.ch_motionPlay=ch_motionPlay;//todo::ケーブル抜いて実行確認
global.ch_usbmode=ch_usbmode;

global.KMMotorOneUSBSerial=KMMotorOneUSBSerial;

// KMMotorOneUSBSerial.startScanToCreateInstance();//スキャンの開始


//info::todo::全てのモーターが切断されるとプログラムが終了する
/////

