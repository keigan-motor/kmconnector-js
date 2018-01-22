
# KMConnector

Node.js and Browser javascript Library for Keigan Motor.  
<p>Keigan Motor用のNode.jsとBrowser JavaScriptライブラリ</p>

## Description
You can control USB Serial and BLE in Node.js. Browser can control Web Bluetooth.
https://www.keigan-motor.com/  
<p>Node.jsではUSBシリアル・BLE、ブラウザ(chrome)ではWebBluetoothを用いて接続出来ます。</p>

***DEMO:***

- WebBluetooh (Browser only. Chrome on Android or Mac)  <p>WebBluetoothでのデモ(Android又はMac上のChromeで動作)</p>
**<a href="https://document.keigan-motor.com/apiSample/kmconnector-js/examples/browser_webbluetooh/Demo.html" target="_brank">https://document.keigan-motor.com/apiSample/kmconnector-js/examples/browser_webbluetooh/Demo.html</a>**

- other exsample file is /examples/  <p>サンプルファイルは/examples/にあります。</p>

## Requirement

- noble 1.8+

## Usage

- BLE (Node.js only. Raspberrypi needs to run with administrator privilege to launch Bluetooh.(sudo))  <p>BLE Node.js用。RaspberryPiは管理者権限で実行する必要があります。</p>

- USB Serial (Node.js only)comming soon. <p>現在開発中。</p>

- Web Bluetooth (Browser only. andoroid or chrome on macos)  <p>Web Bluetoothは現在andoroid及びMacOSのchromeのみで動作します。</p>

## Installation

### Node.js
<p>npmからインストール</p>  

    $ npm install kmconnector


### Browser(Web Bluetooth)
<p>ブラウザはhtmlのヘッダーにindexBrowser.jsを読み込んで下さい</p> 
 
    <script src="kmconnector/indexBrowser.js"></script>

## Examples

### BLE 
<p>BLEでの接続例。サンプルファイルはexamples/nodejs/  </p>
 
    let KMConnector = require('kmconnector');
    KMConnector.KMMotorOneBLE.on(KMConnector.KMMotorOneBLE.EVENT_TYPE.discoverNewMotor,function(kMMotorOneBLE){
        KMConnector.KMMotorOneBLE.stopScan();
        kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.init,function(kMDeviceInfo){
                if(kMMotorOneBLE.isConnect){
                    kMMotorOneBLE.cmdLed(1,200,0,0);
                }
        });
        kMMotorOneBLE.connect();
    });  
    KMConnector.KMMotorOneBLE.startScanToCreateInstance();
    
Exsample file is /examples/nodejs/

### BLE (When directly using noble API)
<p>BLE通信(noble)を既に使用している物に組み込む場合の例</p>

    let noble = require('noble');
    noble.on('discover',(nobleperipheral)=>{
        noble.stopScanning();
        
        //connected to motor only
        let localName=nobleperipheral.advertisement?nobleperipheral.advertisement.localName:"";
        if(localName.startsWith('KM-1')){
            let kMMotorOneBLE= new KMConnector.KMMotorOneBLE(nobleperipheral);
            kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.init,function(kMDeviceInfo){
                            if(kMMotorOneBLE.isConnect){
                                kMMotorOneBLE.cmdLed(1,200,0,0);
                            }
                    });
            kMMotorOneBLE.connect();
        }
    });
    
    if(noble.state === 'poweredOn'){
        noble.startScanning();
    }else{
        noble.once('stateChange',()=>{
            noble.startScanning();
        });
    }

### Web Bluetooth (Browser only. Chrome on Android or Mac)
<p>Web Bluetoothでの例。 サンプルファイルは/examples/browser_webbluetooh/</p>

#### html

    <head>
    <script src="kmconnector/indexBrowser.js"></script>
    </head>
    <body>
        <a href="javascript:KMB.connect();">connect</a>
    </body>
    
#### javascript 

    let KMB=new KMMotorOneWebBLE();
    KMB.on(KMB.EVENT_TYPE.init,function(kMDeviceInfo){
        KMB.cmdEnable();
        KMB.cmdSpeed_rpm(10);
        KMB.cmdRunForward();
    });

    //KMB.connect();//For security reasons permission request error occurs unless it is ignited by user's click operation
    

Exsample file is /examples/browser_webbluetooh/

**Https(https://) connection is required for Web Bluetooth operation.**  

<p>※Web Bluetoothはセキュリティの為、https://での接続が必須です</p>


## BLE connection Api (Node.js) <p>Node.jsでのBLE接続例</p>
### Methods
#### BLE Scanninng and Stopping (Static Methods) <p>BLEスキャンと停止</p>

    KMConnector.KMMotorOneBLE.startScanToCreateInstance(15000);
    KMConnector.KMMotorOneBLE.stopScan();
   
#### Collective disconnection (Static Methods) <p>接続したモーターの全切断</p>

     KMConnector.KMMotorOneBLE.allDisConnect();

#### Connect and disConnect(instance Methods) <p>個々のモーターの切断</p>

    kMMotorOneBLE.connect();
    kMMotorOneBLE.disConnect();

### Events(Scan)
#### discoverMotor (Static) <p>スキャン中のモーター発見時のイベント例</p>

    KMConnector.KMMotorOneBLE.on(KMConnector.KMMotorOneBLE.EVENT_TYPE.discoverMotor,function(kMMotorOneBLE){
        console.log('onDiscoverMotor:'+kMMotorOneBLE.deviceInfo.name);
    });
    
#### discoverNewMotor (Static) <p>未接続の新規モーター発見時</p>
Only when new motor is found.

    KMConnector.KMMotorOneBLE.on(KMConnector.KMMotorOneBLE.EVENT_TYPE.discoverNewMotor,function(kMMotorOneBLE){
        KMConnector.KMMotorOneBLE.stopScan();//Depending on the adapter, it is necessary to initialize the motor after completing the scan.　https://github.com/sandeepmistry/noble#notes
        //todo::Motor initialization processing
    });
    
#### scanTimeout (Static) <p>スキャンがタイムアウトで終了した時</p>

    KMConnector.KMMotorOneBLE.on(KMConnector.KMMotorOneBLE.EVENT_TYPE.scanTimeout,function(){        
         //Connected to all motors
         Object.keys(KMConnector.KMMotorOneBLE.motors).forEach((key)=>{
                let motor=KMConnector.KMMotorOneBLE.motors[key];
                if(!motor.isConnect){
                    motor.connect();
                }
         });
    });
    
### Events(Motors)
#### init <p>モーターの初期化完了時のイベント例</p>

     kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.init,function(kMDeviceInfo){
            //Motor operation
            kMMotorOneBLE.cmdEnable();
            kMMotorOneBLE.cmdSpeed_rpm(10);
            kMMotorOneBLE.cmdRunForward();
        });
        
#### Connect and disconnect <p>モーター接続・切断時イベント</p>

    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.connect,function(kMDeviceInfo){
        console.log("onConnect:"+kMDeviceInfo.isConnect);
    });

    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.disconnect,function(kMDeviceInfo){
         console.log("onDisconnect:"+kMDeviceInfo.isConnect);
    });
    
    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.connectFailure,function(kMDeviceInfo,err){
        console.log("onConnectFailure:"+err);
    });

#### motorMeasurement <p>モーター回転情報受信時</p>

    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.motorMeasurement,function(kMRotState){
        console.log(kMRotState.GetValObj());//{position,velocity,torque}
    });

#### imuMeasurement <p>ジャイロ情報受信時(受信するには別途cmdEnableIMU()を有効にする)</p>
It is output only when the gyro is enabled (kMMotorOneBLE.cmdEnableIMU())  

    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.imuMeasurement,function(kMImuState){
        console.log(kMImuState.GetValObj());//{accelX,accelY,accelZ,temp,gyroX,gyroY,gyroZ}
    });
    

## Web Bluetooth Api (Browser) <p>ブラウザでの接続例</p>
### Methods
#### Connect and disConnect <p>接続・切断</p>
    kMMotorOneWebBLE.connect()
    kMMotorOneWebBLE.disConnect()

### Events  <p>Node.jsと同様</p>

#### init
When the motor is first connected and initialized

    kMMotorOneWebBLE.on(KMB.EVENT_TYPE.init,function(kMDeviceInfo){
        console.log(kMDeviceInfo.GetValObj());//{type,id,name,isConnect,manufacturerName,firmwareRevision}
        kMMotorOneWebBLE.cmdEnable();//For safety, the motor operation at startup is disabled
        kMMotorOneWebBLE.cmdSpeed_rpm(10);
    });
#### Connect and disconnect

    kMMotorOneWebBLE.on(KMB.EVENT_TYPE.connect,function(kMDeviceInfo){
            console.log("onConnect:"+kMDeviceInfo.isConnect);
    });
    kMMotorOneWebBLE.on(KMB.EVENT_TYPE.disconnect,function(kMDeviceInfo){
        console.log("onDisconnect:"+kMDeviceInfo.isConnect);
    });
    kMMotorOneWebBLE.on(KMB.EVENT_TYPE.connectFailure,function(kMDeviceInfo,err){
        console.log("onConnectFailure:"+err);
    });
    
#### motorMeasurement
    kMMotorOneWebBLE.on(KMB.EVENT_TYPE.motorMeasurement,function(kMRotState){
        console.log(kMRotState.GetValObj());//{position,velocity,torque}
    });

#### imuMeasurement
It is output only when the gyro is enabled (kMMotorOneWebBLE.cmdEnableIMU())

    kMMotorOneWebBLE.on(KMB.EVENT_TYPE.imuMeasurement,function(kMImuState){
        console.log(kMImuState.GetValObj());//{accelX,accelY,accelZ,temp,gyroX,gyroY,gyroZ}
    });
    
## Motor command Api (common) <p>モーター操作コマンド</p>
The command of the motor is defined by "cmd [CommandName] (prame, ...)"  
<p>操作コマンドは「cmdコマンド名()」の書式になります。</p>

    kMMotorOneBLE.cmdSpeed_rpm(10);//Set the speed 10rpm
    kMMotorOneBLE.cmdEnable();//Enable motor action
    kMMotorOneBLE.cmdRunForward();//Run forward (ccw)
    
#### For details of the command, see the following site 
<p>詳細なドキュメント</p>

- Motor command Api(English)  
https://en.document.keigan-motor.com/motor-control-command/command-motor-action.html
- KeiganMotor javascript Libraryリファレンス(日本語)   
https://document.keigan-motor.com/apiDocument/kmconnector-js/
- モーターコマンド一覧  
https://document.keigan-motor.com/motor-control-command

## Author
[Keigan Inc.](https://keigan-motor.com/)

## License

[MIT](http://b4b4r07.mit-license.org)
