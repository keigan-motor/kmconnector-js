
# KMConnector

Node.js and Browser javascript Library for Keigan Motor.  
<p>Keigan Motor用のNode.jsとBrowser JavaScriptライブラリ</p>

## Description
You can control USB Serial and BLE in Node.js. Browser can control Web Bluetooth.
https://www.keigan-motor.com/  
<p>Node.jsではUSBシリアル・BLE、ブラウザ(chrome)ではWebBluetoothを用いて接続できます。</p>

***Note:***

- Raspbian(Raspberry Pi),Linux, Mac OS X are currently the only supported OSes.<br>現時点でサポートされているOSはRaspbian(Raspberry Pi),Linux、Mac OS Xのみです。 

- RaspberryPi等の一部のBluetoohアダプタでは、複数プロセスによるBLEの動作は、正常に動作しません。<br>複数のプロセスで、Node.jsからBLE接続を行うと、"Type mismatch of motor peripheral"により失敗します。


***DEMO:***

- WebBluetooh (Browser only. Chrome on Android or Mac)  <p>WebBluetoothでのデモ(Android又はMac上のChromeで動作)</p>
**<a href="https://docs.keigan-motor.com/apiSample/kmconnector-js/examples/browser_webbluetooh/Demo.html" target="_brank">https://docs.keigan-motor.com/apiSample/motorApiSample/</a>**

- other exsample file is /examples/  <p>サンプルファイルは/examples/にあります。</p>

## Requirement
- node 8.11.2 - 10.14.2
- @abandonware/noble 1.9.2
- serialport 7.0.2+


## Usage
- KeiganMotor firmware version 2.23 or above

- BLE (Node.js only. Raspberrypi needs to run with administrator privilege to launch Bluetooh.(sudo))  <p>BLE Node.js用。RaspberryPiは管理者権限で実行する必要があります。</p>

- USB Serial (Node.js only) serialport 7.0.2+


- Web Bluetooth (Browser only. andoroid or chrome on macos)  <p>Web Bluetoothは現在andoroid及びMacOSのchromeのみで動作します。</p>

## Installation

### Node.js
<p>npmからインストール</p>  

    $ npm install kmconnector

~~※ MAC & node.js 10.xで依存ライブラリxpc-connectionが正常にインストールされない(”Cannot find module 'xpc-connection' ”)~~
~~場合は以下のコマンドでxpc-connectionをインストールして下さい。~~
~~$ npm install git://github.com/taoyuan/node-xpc-connection.git~~
    

#### Macにインストールする場合
<p>Macでnodebrewを使用している場合、依存ライブラリxpc-connectionのインストールで失敗する場合があります。</p>

##### 対処方法
- node-gypを最新にUPDATEする。

- インストール時に一時的にpathを以下に書き換える。

    export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/X11/bin:~/.nodebrew/node/[nodebrewのヴァージョン]/bin

ex)

    $ npm explore npm -g -- npm install node-gyp@latest
    $ export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/X11/bin:~/.nodebrew/node/v10.14.2/bin
    $ npm i kmconnector


### Browser(Web Bluetooth)
<p>ブラウザはhtmlのヘッダーにindexBrowser.jsを読み込んで下さい</p> 
 
    <script src="kmconnector-js/KMConnectorBrowser.js"></script>

## Examples (Exsample file is /examples/nodejs/)
<p>サンプルファイルは /examples/nodejs/ にあります</p>

### USB (Example of connection to specified port)
<p>指定したUSBポートに接続する例</p>

    const KMConnector = require('kmconnector/KMConnectorUSB');
    const KMMotorOneUSBSerial=KMConnector.KMMotorOneUSBSerial;
    
    let kMMotorOne=new KMMotorOneUSBSerial('/dev/serial/by-id/usb-FTDI_FT230X_Basic_UART_DM00KBZZ-if00-port0');
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.connect,function(kMDeviceInfo){
       if(kMMotorOne.isConnect){
           kMMotorOne.cmdLed(1,200,0,0);//led
       }
    });
   
    //Try Auto Reconnect
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.disconnect,(kMDeviceInfo)=>{
        setTimeout(()=>{kMMotorOne.connect();},5000);
    });
    
    kMMotorOne.on(kMMotorOne.EVENT_TYPE.connectFailure,(kMDeviceInfo,err)=>{
        setTimeout(()=>{kMMotorOne.connect();},5000);
    });
    
    kMMotorOne.connect();

### USB (Example of all scanning USB port for connection)
<p>全てのUSBポートをスキャンして接続する例</p>

    const KMConnector = require('kmconnector/KMConnectorUSB');
    KMConnector.KMMotorOneUSBSerial.on(KMMotorOneUSBSerial.EVENT_TYPE.discoverNewMotor,function(kMMotorOne){
       kMMotorOne.on(kMMotorOne.EVENT_TYPE.connect,function(kMDeviceInfo){
           if(kMMotorOne.isConnect){
               kMMotorOne.cmdLed(1,200,0,0);//led
           }
       });
       kMMotorOne.connect();
    });
   
    KMConnector.KMMotorOneBLE.startScanToCreateInstance();
    

### BLE

    const KMConnector = require('kmconnector/KMConnectorBLE');
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
    

### BLE (When directly using noble API)
<p>BLE通信(noble)を既に使用している物に組み込む場合の例</p>

    const KMConnector = require('kmconnector/KMConnectorBLE');
    const noble = require('noble');
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
<p>Exsample file is /examples/browser_webbluetooh/</p>

#### html

    <head>
    <script src="kmconnector/indexBrowser.js"></script>
    </head>
    <body>
        <a href="javascript:KMB.connect();">connect</a>
    </body>
    
#### javascript 

    const KMB=new KMMotorOneWebBLE();
    KMB.on(KMB.EVENT_TYPE.init,function(kMDeviceInfo){
        KMB.cmdEnable();
        KMB.cmdSpeed_rpm(10);
        KMB.cmdRunForward();
    });

    //KMB.connect();//For security reasons permission request error occurs unless it is ignited by user's click operation
    

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

- KeiganMotor javascript Libraryリファレンス   
https://docs.keigan-motor.com/apiDocument/kmconnector-js/
- モーターコマンド一覧  
https://docs.keigan-motor.com/motor-control-command

## Author
[Keigan Inc.](https://keigan-motor.com/)

## License

[MIT](http://b4b4r07.mit-license.org)
