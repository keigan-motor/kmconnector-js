##node.js用サンプルコード
Git Hub
https://github.com/keigan-motor/kmconnector-js

##Requirements
+ node 8.11.2 - 10.14.2
+ @abandonware/noble 1.9.2
+ serialport 7.0.2+

##重要
RaspberryPi等の一部のBluetoohアダプタでは、複数プロセスによるBLEの動作は、正常に動作しません。
複数のプロセスで、Node.jsからBLE接続を行うと、"Type mismatch of motor peripheral"により失敗します。

##BLEサンプル

+ bleDemoSimple.js 
    
    基本接続　Bluetooh接続でモーターのスキャン及び接続
    #####実行 
        $node bleDemoSimple.js
        
+ bleDemoAll.js 
    
    複数動作 Bluetooh接続でモーターのスキャン及び接続
    #####実行 
        $node bleDemoAll.js 

+ bleDemoSync.js 
    
    モーターの位置到達を検知して次の位置制御をおこなう
    #####実行 
        $node bleDemoSync.js 


##USBサンプル

+ usbDemoSimple.js

    基本的な接続。 実行前にデバイスファイルを指定する必要があります ex'/dev/ttyUSB0'
    #####実行
        $node usbDemoSimple.js
        
+ usbDemoAll.js
    
    デバイスファイルを指定せずにモーターをスキャンして接続
    #####実行
        $node usbDemoAll.js
    
+ usbDemoSimpleScan.js

    デバイスファイルを指定せずにモーターをスキャンして接続
    #####実行
        $node usbDemoSimpleScan.js
        
+ usbDemoSync.js
    
    モーターの位置到達を検知して次の位置制御をおこなう
    #####実行 
        $node usbDemoSync.js 
