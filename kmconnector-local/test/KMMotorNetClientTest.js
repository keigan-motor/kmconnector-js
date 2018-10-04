'use strict';
const KMMotorNetClient=require('../src/KMMotorNetClient');

let netClient=new KMMotorNetClient('http://192.168.24.40','6223');//,{transports: ['websocket']}

netClient.on(netClient.EVENT_TYPE.serverConnectError,(e)=>{
    console.log('Lisner server connect error',e);
});
netClient.on(netClient.EVENT_TYPE.serverConnectTimeout,()=>{
    console.log('Lisner server connect timeout');
});
netClient.on(netClient.EVENT_TYPE.serverReconnect,()=>{
    console.log('Lisner server reconnect');
});
netClient.on(netClient.EVENT_TYPE.serverReconnecting,()=>{
    console.log('Lisner server reconnecting');
});
netClient.on(netClient.EVENT_TYPE.serverDisconnect,()=>{
    console.log('Lisner server disconnect');
});
netClient.on(netClient.EVENT_TYPE.serverError,(e)=>{
    console.log('Lisner server serverError',e);
});

netClient.on(netClient.EVENT_TYPE.serverConnect,()=>{
    console.log('Lisner server connect');
    //初期化&モーター取得
    netClient.clearMotors().then(()=>{
        this.getMotors(10000);
    });
});

///scan event
netClient.on(netClient.EVENT_TYPE.discoverMotor,(motor_st)=>{
    console.log('Lisner client discoverMotor',motor_st);
});
netClient.on(netClient.EVENT_TYPE.scanTimeout,()=>{
    console.log('Lisner client scanTimeout');
});


netClient.connectServer();

///
this.netClient=netClient;
this.motors=[];//debug
this.getMotors=function(time){
    this.motors=[];
        //BLE SCAN
        netClient.getMotors(time).then((kMMotorOneNets)=>{
            kMMotorOneNets.forEach((kMMotorOneNet)=>{
                console.log(kMMotorOneNet.deviceInfo);
                console.assert(kMMotorOneNet.deviceInfo," err!!");
                this.bindNetMotor(kMMotorOneNet);//todo::ch
                this.motors.push(kMMotorOneNet);
            });


        }).catch((e)=>{
            console.log("err",e);
        });
};

this.clearMotors=function(){
    netClient.clearMotors().then(()=>{
        console.log("clearMotors");
    });
};

//仮想モーターのイベント確認
/**
 *
 * @param {KMMotorOneNet} kMMotorOneNet
 */
this.bindNetMotor=function(kMMotorOneNet){

    //todo::続き
    kMMotorOneNet.on(kMMotorOneNet.EVENT_TYPE.init,function(deviceInfo){
                console.log("EVENT_TYPE.init",deviceInfo.name);
    });
    kMMotorOneNet.on(kMMotorOneNet.EVENT_TYPE.connect,function(deviceInfo){
        console.log("EVENT_TYPE.connect",deviceInfo.name,deviceInfo);
    }.bind(this));
    kMMotorOneNet.on(kMMotorOneNet.EVENT_TYPE.disconnect,function(deviceInfo){
        console.log("EVENT_TYPE.disconnect",deviceInfo.name,deviceInfo);
    });
    kMMotorOneNet.on(kMMotorOneNet.EVENT_TYPE.connectFailure,function(deviceInfo,err){
        console.log("EVENT_TYPE.connectFailure",deviceInfo.name,err);
    });
    kMMotorOneNet.on(kMMotorOneNet.EVENT_TYPE.motorMeasurement,function(rotState){
       // console.log("motorMeasurement",this.deviceInfo.name,rotState);
    });
    kMMotorOneNet.on(kMMotorOneNet.EVENT_TYPE.imuMeasurement,function(imuState){
       // console.log("motorMeasurement",this.deviceInfo.name,imuState);
    });


    //検証用ハンドラ
    kMMotorOneNet.once(kMMotorOneNet.EVENT_TYPE.connect,function(deviceInfo){
        this.motor_sequence(kMMotorOneNet);
    }.bind(this));
    //
    kMMotorOneNet.connect();

};

/**
 * 接続後のモーターのコマンド等実行
 * @param kMMotorOneNet
 */
this.motor_sequence=function(kMMotorOneNet){
    new Promise((resolve) =>{

        console.log("//------------設定値受信テスト------------//");
        kMMotorOneNet.cmdReadAllRegister().then(function(val){
            Object.keys(val).forEach(function(k){
                console.log(k+":"+val[k]);
            });
            resolve(true);
        }).catch(function(msg){
            console.log(msg);
        });
    }).then((resolve) =>{
        console.log("//------------接続テスト------------//");
        return new Promise((resolve) =>{
            kMMotorOneNet.cmdLed(kMMotorOneNet.cmdLed_LED_STATE.LED_STATE_ON_FLASH,200,200,0);//led
            kMMotorOneNet.cmdSpeed_rpm(4);
            kMMotorOneNet.cmdEnable();
            kMMotorOneNet.cmdRunForward();
            setTimeout(()=>{resolve(true);},5000);
        });
    }).then((resolve) =>{
        return new Promise((resolve) =>{
            kMMotorOneNet.cmdStop();
            kMMotorOneNet.cmdLed(kMMotorOneNet.cmdLed_LED_STATE.LED_STATE_ON_FLASH,0,200,0);//led
            setTimeout(()=>{resolve(true);},2000);
        });
    }).then((resolve) =>{
        console.log("//------------切断テスト------------//");
        return new Promise((resolve) =>{
            kMMotorOneNet.disConnect();
            setTimeout(()=>{resolve(true);},2000);
        });
    }).then((resolve) =>{
        //再接続
        console.log("//------------再接続テスト------------//");
        return new Promise((resolve) =>{
            kMMotorOneNet.once(kMMotorOneNet.EVENT_TYPE.connect,(deviceInfo)=>{
                console.log("//------------再接続テスト >LED----------//");
                //info::bug::connectイベント発生直後だとコマンドが効かない(イベント発生順確認)
                kMMotorOneNet.cmdLed(kMMotorOneNet.cmdLed_LED_STATE.LED_STATE_ON_FLASH,200,200,0);//led;
                kMMotorOneNet.cmdEnable();
                kMMotorOneNet.cmdRunForward();
                setTimeout(()=>{
                    kMMotorOneNet.cmdLed(kMMotorOneNet.cmdLed_LED_STATE.LED_STATE_ON_FLASH,0,200,200);//led;
                    resolve(true);
                    },2000);
            });
            kMMotorOneNet.connect();

        });
    })

};

////////
global["debug"]=this;
