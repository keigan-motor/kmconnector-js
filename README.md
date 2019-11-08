
# KMConnector

Keigan Motor用のNode.jsとBrowser JavaScriptライブラリ
<a href="https://www.keigan-motor.com/" target="_brank">https://www.keigan-motor.com/</a>  
Node.jsではUSBシリアル・BLE、ブラウザ(chrome)ではWebBluetoothを用いて接続できます。

***Quick Demo:***
- ブラウザ接続でのデモ(WebBluetooth Android又はMac上のChromeで動作)  
**<a href="https://docs.keigan-motor.com/apiSample/kmconnector-js/examples/browser_webbluetooh/Demo.html" target="_brank">https://docs.keigan-motor.com/apiSample/motorApiSample/</a>**

## Requirement
- node 8.11.2 - 10.14.2
- @abandonware/noble 1.9.2
- serialport 7.0.2+

## Usage
- KeiganMotor ファームウェア version 2.23 以上。

- 現時点でサポートされているOSはRaspbian(Raspberry Pi),Linux、Mac OS Xのみです。 

- BLE Node.js用。RaspberryPiは管理者権限で実行する必要があります。

- RaspberryPi等の一部のBluetoohアダプタでは、複数プロセスによるBLEの動作は、正常に動作しません。<br>複数のプロセスで、Node.jsからBLE接続を行うと、"Type mismatch of motor peripheral"により失敗します。

- USB Serial (Node.js only) serialport 7.0.2+

- Web Bluetoothは現在andoroid及びMacOSのchromeのみで動作します。


## インストール

### Node.js（npmからインストール）

    $ npm install kmconnector


#### Macにインストールする場合
+ MAC & node.js 10.xで依存ライブラリxpc-connectionが正常にインストールされない(”Cannot find module 'xpc-connection' ”)
場合は以下のコマンドでxpc-connectionをインストールして下さい。
  
        $ npm install git://github.com/taoyuan/node-xpc-connection.git

+ Macでnodebrewを使用している場合、依存ライブラリxpc-connectionのインストールで失敗する場合があります。  
その場合以下の方法でインストールを行って下さい。
    - node-gypを最新にUPDATEする。
    - インストール時に一時的にpathを以下に書き換える。
    
        $ export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/X11/bin:~/.nodebrew/node/[nodebrewのヴァージョン]/bin

       例)
        
            $ npm explore npm -g -- npm install node-gyp@latest
            $ export PATH=/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin:/opt/X11/bin:~/.nodebrew/node/v10.14.2/bin
            $ npm i kmconnector


### Webブラウザへの組み込み
ブラウザはhtmlのヘッダーに/KMConnectorBrowser.jsを読み込んで下さい
 
    <script src="kmconnector-js/KMConnectorBrowser.js"></script>
    
+ WebBluetoothを使用する為、Android又はMac上のChromeでのみ動作します。
+ Web Bluetoothはセキュリティの為、https://での接続が必須です。

## Examples(BLE)


#### BLE通信で接続する例(Node.js)

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
    

#### BLE通信(noble)を既に使用している物に組み込む場合の例(Node.js)
    
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


### 主なメソッド
#### BLEスキャンと停止

        KMConnector.KMMotorOneBLE.startScanToCreateInstance(15000);
        KMConnector.KMMotorOneBLE.stopScan();
   
#### 接続したモーターの全切断

        KMConnector.KMMotorOneBLE.allDisConnect();

#### 個々のモーターの切断

        kMMotorOneBLE.connect();
        kMMotorOneBLE.disConnect();

### イベント
#### スキャン中のモーター発見時

        KMConnector.KMMotorOneBLE.on(KMConnector.KMMotorOneBLE.EVENT_TYPE.discoverMotor,function(kMMotorOneBLE){
            console.log('onDiscoverMotor:'+kMMotorOneBLE.deviceInfo.name);
        });
    
#### 未接続の新規モーター発見時

        KMConnector.KMMotorOneBLE.on(KMConnector.KMMotorOneBLE.EVENT_TYPE.discoverNewMotor,function(kMMotorOneBLE){
            KMConnector.KMMotorOneBLE.stopScan();//Depending on the adapter, it is necessary to initialize the motor after completing the scan.　https://github.com/sandeepmistry/noble#notes
            //todo::Motor initialization processing
        });
    
#### スキャンがタイムアウトで終了した時

        KMConnector.KMMotorOneBLE.on(KMConnector.KMMotorOneBLE.EVENT_TYPE.scanTimeout,function(){        
             //Connected to all motors
             Object.keys(KMConnector.KMMotorOneBLE.motors).forEach((key)=>{
                    let motor=KMConnector.KMMotorOneBLE.motors[key];
                    if(!motor.isConnect){
                        motor.connect();
                    }
             });
        });
    
#### モーターの初期化完了時

         kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.init,function(kMDeviceInfo){
                //Motor operation
                kMMotorOneBLE.cmdEnable();
                kMMotorOneBLE.cmdSpeed_rpm(10);
                kMMotorOneBLE.cmdRunForward();
            });
        
#### モーター接続・切断時

        kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.connect,function(kMDeviceInfo){
            console.log("onConnect:"+kMDeviceInfo.isConnect);
        });
    
        kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.disconnect,function(kMDeviceInfo){
             console.log("onDisconnect:"+kMDeviceInfo.isConnect);
        });
        
        kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.connectFailure,function(kMDeviceInfo,err){
            console.log("onConnectFailure:"+err);
        });

#### モーター回転情報受信時

        kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.motorMeasurement,function(kMRotState){
            console.log(kMRotState.GetValObj());//{position,velocity,torque}
        });

#### ジャイロ情報受信時
受信するには別途cmdEnableIMU()を有効にする必要があります。

        kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.imuMeasurement,function(kMImuState){
            console.log(kMImuState.GetValObj());//{accelX,accelY,accelZ,temp,gyroX,gyroY,gyroZ}
        });
    
## Examples(USB)

#### 指定したUSBポートに接続する例 (Node.js)

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

#### 全てのUSBポートをスキャンして接続する例(Node.js)

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
        
## Examples(Browser Web Bluetooth Api)

#### WebブラウザからBLE接続する例 
+ WebBluetoothを使用する為、Android又はMac上のChromeでのみ動作します。
+ Web Bluetoothはセキュリティの為、https://での接続が必須です。

##### html
    
        <head>
        <script src="kmconnector/indexBrowser.js"></script>
        </head>
        <body>
            <!--セキュリティ上の理由から、KMB.connect()は直接ユーザーのクリック操作が必要です。-->
            <a href="javascript:KMB.connect();">connect</a>
        </body>
    
##### javascript 

        const KMB=new KMMotorOneWebBLE();
        KMB.on(KMB.EVENT_TYPE.init,function(kMDeviceInfo){
            KMB.cmdEnable();
            KMB.cmdSpeed_rpm(10);
            KMB.cmdRunForward();
        });
        
        //KMB.connect();//セキュリティ上の理由から、エラーになる

#### 接続・切断
        kMMotorOneWebBLE.connect()
        kMMotorOneWebBLE.disConnect()

### イベント

#### モーターの接続・初期化完了時 (Browser)

        kMMotorOneWebBLE.on(KMB.EVENT_TYPE.init,function(kMDeviceInfo){
            console.log(kMDeviceInfo.GetValObj());//{type,id,name,isConnect,manufacturerName,firmwareRevision}
            kMMotorOneWebBLE.cmdEnable();//For safety, the motor operation at startup is disabled
            kMMotorOneWebBLE.cmdSpeed_rpm(10);
        });
    
#### 接続・切断(Browser) 

        kMMotorOneWebBLE.on(KMB.EVENT_TYPE.connect,function(kMDeviceInfo){
                console.log("onConnect:"+kMDeviceInfo.isConnect);
        });
        kMMotorOneWebBLE.on(KMB.EVENT_TYPE.disconnect,function(kMDeviceInfo){
            console.log("onDisconnect:"+kMDeviceInfo.isConnect);
        });
        kMMotorOneWebBLE.on(KMB.EVENT_TYPE.connectFailure,function(kMDeviceInfo,err){
            console.log("onConnectFailure:"+err);
        });
    
#### モーター回転情報受信時(Browser)

        kMMotorOneWebBLE.on(KMB.EVENT_TYPE.motorMeasurement,function(kMRotState){
            console.log(kMRotState.GetValObj());//{position,velocity,torque}
        });

#### ジャイロ情報受信時(Browser)

受信するには別途cmdEnableIMU()を有効にする必要があります。 

        kMMotorOneWebBLE.on(KMB.EVENT_TYPE.imuMeasurement,function(kMImuState){
            console.log(kMImuState.GetValObj());//{accelX,accelY,accelZ,temp,gyroX,gyroY,gyroZ}
        });
    
    
## モーター操作コマンド(全接続方式で共通)
操作コマンドは「cmdコマンド名()」の書式になります。

        kMMotorOneBLE.cmdSpeed_rpm(10);//Set the speed 10rpm
        kMMotorOneBLE.cmdEnable();//Enable motor action
        kMMotorOneBLE.cmdRunForward();//Run forward (ccw)
    
## 詳細なドキュメント

KeiganMotor javascript Libraryリファレンス   
https://docs.keigan-motor.com/apiDocument/kmconnector-js/

KeiganMotor ドキュメント  
https://docs.keigan-motor.com/

## Author
[Keigan Inc.](https://keigan-motor.com/)

## License

[MIT](http://b4b4r07.mit-license.org)
