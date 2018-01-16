# KMConnector

Node.js and Browser javascript Library for Keigan Motor.

## Description
You can control USB Serial and BLE in Node.js. Browser can control Web Bluetooth.
https://www.keigan-motor.com/

***DEMO:***

- WebBluetooh (Browser only. Chrome on Android or Mac) 
https://document.keigan-motor.com/apiSample/KMConnector/examples/browser_webbluetooh/Demo.html

- other exsample file is /examples/

## Requirement

- noble 1.8+

## Usage 

1. BLE (Node.js only. Raspberrypi needs to run with administrator privilege to launch Bluetooh.(sudo))
2. USB Serial (Node.js only)comming soon.
3. Web Bluetooth (Browser only. andoroid or chrome on macos)

## Installation

### Node.js

    $ npm install kmconnector

### Browser(Web Bluetooth)

    <script src="kmconnector/indexBrowser.js"></script>

## Examples

### BLE
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

## BLE connection Api (Node.js)
### Methods
#### BLE Scanninng and Stopping (Static Methods)

    KMConnector.KMMotorOneBLE.startScanToCreateInstance(15000);
    KMConnector.KMMotorOneBLE.stopScan();
   
#### Collective disconnection (Static Methods)

     KMConnector.KMMotorOneBLE.allDisConnect();

#### Connect and disConnect(instance Methods)

    kMMotorOneBLE.connect();
    kMMotorOneBLE.disConnect();

### Events(Scan)
#### discoverMotor (Static)

    KMConnector.KMMotorOneBLE.on(KMConnector.KMMotorOneBLE.EVENT_TYPE.discoverMotor,function(kMMotorOneBLE){
        console.log('onDiscoverMotor:'+kMMotorOneBLE.deviceInfo.name);
    });
    
#### discoverNewMotor (Static)
Only when new motor is found.

    KMConnector.KMMotorOneBLE.on(KMConnector.KMMotorOneBLE.EVENT_TYPE.discoverNewMotor,function(kMMotorOneBLE){
        KMConnector.KMMotorOneBLE.stopScan();//Depending on the adapter, it is necessary to initialize the motor after completing the scan.　https://github.com/sandeepmistry/noble#notes
        //todo::Motor initialization processing
    });
    
#### scanTimeout (Static)

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
#### init

     kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.init,function(kMDeviceInfo){
            //Motor operation
            kMMotorOneBLE.cmdEnable();
            kMMotorOneBLE.cmdSpeed_rpm(10);
            kMMotorOneBLE.cmdRunForward();
        });
        
#### Connect and disconnect

    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.connect,function(kMDeviceInfo){
        console.log("onConnect:"+kMDeviceInfo.isConnect);
    });

    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.disconnect,function(kMDeviceInfo){
         console.log("onDisconnect:"+kMDeviceInfo.isConnect);
    });
    
    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.connectFailure,function(kMDeviceInfo,err){
        console.log("onConnectFailure:"+err);
    });

#### motorMeasurement

    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.motorMeasurement,function(kMRotState){
        console.log(kMRotState.GetValObj());//{position,velocity,torque}
    });

#### imuMeasurement
It is output only when the gyro is enabled (kMMotorOneBLE.cmdEnableIMU())

    kMMotorOneBLE.on(kMMotorOneBLE.EVENT_TYPE.imuMeasurement,function(kMImuState){
        console.log(kMImuState.GetValObj());//{accelX,accelY,accelZ,temp,gyroX,gyroY,gyroZ}
    });
    

## Web Bluetooth Api (Browser)
### Methods
#### Connect and disConnect
    kMMotorOneWebBLE.connect()
    kMMotorOneWebBLE.disConnect()

### Events

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
    
## Motor command Api (common)
The command of the motor is defined by "cmd [CommandName] (prame, ...)"

    kMMotorOneBLE.cmdSpeed_rpm(10);//Set the speed 10rpm
    kMMotorOneBLE.cmdEnable();//Enable motor action
    kMMotorOneBLE.cmdRunForward();//Run forward (ccw)
    
#### For details of the command, see the following site
- Motor command Api(English)
https://en.document.keigan-motor.com/motor-control-command/command-motor-action.html

- Motor command Api(日本語)
https://document.keigan-motor.com/motor-control-command/motor_action.html


## Author
[Keigan Inc.](https://keigan-motor.com/)

## License

[MIT](http://b4b4r07.mit-license.org)
