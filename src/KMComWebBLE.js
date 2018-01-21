/***
 * KMComWebBLE.js
 * version 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
'use strict';
let KMUtl = require('./KMUtl');
let KMComBase = require('./KMComBase');
/**
 * @classdesc ブラウザ用WebBluetooh通信クラス(chrome依存)
 * @ignore
 */
class KMComWebBLE extends KMComBase{
    /********************************************
     * 定数
     ********************************************/

    /**
     * constructor
     */
    constructor(){
        super();
        this._deviceInfo.type="WEBBLE";
        this._characteristics={};
        this._bleSendingQue=Promise.resolve(true);
        this._queCount=0;
        
        //サービスUUID
        this._MOTOR_BLE_SERVICE_UUID='f140ea35-8936-4d35-a0ed-dfcd795baa8c';

        //キャラクタリスティクスUUID
        this._MOTOR_BLE_CRS={
            'MOTOR_CONTROL':'f1400001-8936-4d35-a0ed-dfcd795baa8c',//モーターへの設定、制御命令を取り扱う
            //'MOTOR_LED':'f1400003-8936-4d35-a0ed-dfcd795baa8c',//モーターのLEDを取り扱う info:: MOTOR_CONTROL::bleLedで代用
            'MOTOR_MEASUREMENT':'f1400004-8936-4d35-a0ed-dfcd795baa8c',//モーターの位置・速度・トルク等測定値を取り扱う
            'MOTOR_IMU_MEASUREMENT':'f1400005-8936-4d35-a0ed-dfcd795baa8c',//モーターの加速度・ジャイロセンサー（IMU）を取り扱う
            'MOTOR_SETTING':'f1400006-8936-4d35-a0ed-dfcd795baa8c'//モーターの設定値を取り扱う
        };
        this._DEVICE_INFORMATION_SERVICE_UUIDS={
            "Service":0x180a
            ,"ManufacturerNameString":0x2a29
            ,"HardwareRevisionString":0x2a27
            ,"FirmwareRevisionString":0x2a26
        };

        /**
         * BLE切断時
         * @param eve
         * @private
         */
       this._onBleConnectionLost=(eve)=>{
           this._deviceInfo.isConnect=false;
               this._peripheral=null;
               this._statusChange_isConnect(false);
       };
        /**
         * @#---------------------------------------------------------
         * モーター回転情報受信
         * @param eve
         * @private
         * @#---------------------------------------------------------
         * Notify したときの返り値
         * byte[0]-byte[3]	    byte[4]-byte[7]	        byte[8]-byte[11]
         * float * 		        float *                 float *
         * position:radians	    speed:radians/second	torque:N・m
         */
        this._onBleMotorMeasurement=(eve)=>{
            if(!eve||!eve.target){return;}
            let dv = eve.target.value;
            if(!(dv instanceof DataView)){return;}//info::web bluetoohのみ node.jsはinstanceof Buffer
            let res={position:dv.getFloat32(0,false),velocity:dv.getFloat32(4,false),torque:dv.getFloat32(8,false)};
            this._onMotorMeasurementCB(res);
        };
        /**
         * @#---------------------------------------------------------
         * モーターIMU情報受信
         * @param eve
         * @private
         *
         * @#Notify したときの返り値)---------------------------------------------
         *
         * accel_x, accel_y, accel_z, temp, gyro_x, gyro_y, gyro_z が全て返ってくる。取得間隔は100ms 固定
         * byte(BigEndian)  [0][1] [2][3]  [4][5]   [6][7]	    [8][9]	[10][11]    [12][13]
         *                  int16_t int16_t int16_t int16_t     int16_t int16_t int16_t
         *                  accel-x accel-y accel-z temp	    gyro-x	gyro-y	gyro-z
         *
         * int16_t:-32,768〜32,768
         * 机の上にモーターを置いた場合、加速度　z = 16000 程度となる。（重力方向のため）
         *
         * 単位変換）---------------------------------------------------------
         * 　加速度 value [G] = raw_value * 2 / 32,767
         * 　温度 value [℃] = raw_value / 333.87 + 21.00
         * 　角速度
         * 　　value [degree/second] = raw_value * 250 / 32,767
         * 　　value [radians/second] = raw_value * 0.00013316211
         *
         */
        this._onBleImuMeasurement=(eve)=>{
            if(!eve||!eve.target){return;}
            let dv = eve.target.value;
            let tempCalibration=-5.7;//温度校正値
            if(!(dv instanceof DataView)){return;}//info::web bluetoohのみ node.jsはinstanceof Buffer
            //単位を扱い易いように変換
            let res={
                accelX:dv.getInt16(0,false)*2/32767,accelY:dv.getInt16(2,false)*2/32767,accelZ:dv.getInt16(4,false)*2/32767,
                temp:(dv.getInt16(6,false)) / 333.87 + 21.00+tempCalibration,
                gyroX:dv.getInt16(8,false)*250/32767,gyroY:dv.getInt16(10,false)*250/32767,gyroZ:dv.getInt16(12,false)*250/32767
            };

            // console.log(res);
            this._onImuMeasurementCB(res);
        };

        /**
         * @#---------------------------------------------------------
         * モーター設定情報取得
         * @param eve
         * @private
         * @#---------------------------------------------------------
         * Notify したときの返り値
         * byte[0]	byte[1]	byte[2]	byte[3] byte[4]以降	byte[n-2]	byte[n-1]
         * uint8_t:log_type	uint16_t:id	uint8_t:register	uint8_t:value	uint16_t:CRC
         * 0x40	uint16_t (2byte) 0～65535	レジスタコマンド	レジスタの値（コマンドによって変わる）	uint16_t (2byte) 0～65535
         */
        this._onBleMotorSetting=(eve)=>{
            if(!eve||!eve.target){return;}
            let dv = eve.target.value;//6+nバイト　データ仕様　https://docs.google.com/spreadsheets/d/1uxJu86Xe8KbIlxu5oPFv9KQdvHY33-NIy0cdSgInoUk/edit#gid=1000482383
            if(!(dv instanceof DataView)){return;}//info::web bluetoohのみ node.jsはinstanceof Buffer

            //-------------
            //データのparse
            //-------------
            let notifyBinLen=dv.byteLength;
            let notifyCmd=dv.getUint8(0);//レジスタ情報通知コマンドID 0x40固定

            if(notifyCmd!=0x40||notifyBinLen<=6){return;}//レジスタ情報を含まないデータの破棄

            let id=dv.getUint16(1,false);//送信ID
            let registerCmd=dv.getUint8(3);//レジスタコマンド
            let crc=dv.getUint16(notifyBinLen-2,false);//CRCの値 最後から2dyte

            let res={};
            //コマンド別によるレジスタの値の取得[4-n byte]
            switch(registerCmd){
                case this._MOTOR_SETTING_READREGISTER_COMMAND.maxSpeed:
                    res.maxSpeed=dv.getFloat32(4,false);
                    break;
                case this._MOTOR_SETTING_READREGISTER_COMMAND.minSpeed:
                    res.minSpeed=dv.getFloat32(4,false);
                    break;
                case this._MOTOR_SETTING_READREGISTER_COMMAND.curveType:
                    res.curveType=dv.getUint8(4);
                    break;
                case this._MOTOR_SETTING_READREGISTER_COMMAND.acc:
                    res.acc=dv.getFloat32(4,false);
                    break;
                case this._MOTOR_SETTING_READREGISTER_COMMAND.dec:
                    res.dec=dv.getFloat32(4,false);
                    break;
                case this._MOTOR_SETTING_READREGISTER_COMMAND.maxTorque:
                    res.maxTorque=dv.getFloat32(4,false);
                    break;
                case this._MOTOR_SETTING_READREGISTER_COMMAND.qCurrentP:
                    res.qCurrentP=dv.getFloat32(4,false);
                    break;
                case this._MOTOR_SETTING_READREGISTER_COMMAND.qCurrentI:
                    res.qCurrentI=dv.getFloat32(4,false);
                    break;
                case this._MOTOR_SETTING_READREGISTER_COMMAND.qCurrentD:
                    res.qCurrentD=dv.getFloat32(4,false);
                    break;
                case this._MOTOR_SETTING_READREGISTER_COMMAND.speedP:
                    res.speedP=dv.getFloat32(4,false);
                    break;
                case this._MOTOR_SETTING_READREGISTER_COMMAND.speedI:
                    res.speedI=dv.getFloat32(4,false);
                    break;
                case this._MOTOR_SETTING_READREGISTER_COMMAND.speedD:
                    res.speedD=dv.getFloat32(4,false);
                    break;
                case this._MOTOR_SETTING_READREGISTER_COMMAND.positionP:
                    res.positionP=dv.getFloat32(4,false);
                    break;
                case this._MOTOR_SETTING_READREGISTER_COMMAND.ownColor:
                    res.ownColor=('#000000' +Number(dv.getUint8(4)<<16|dv.getUint8(5)<<8|dv.getUint8(6)).toString(16)).substr(-6);
                    break;
            }
            //console.log(res);

            this._onMotorSettingCB(registerCmd,res);

        }

    }

    /********************************************
     * section::公開メソッド
     ********************************************/
    /**
     * WebBluetoohでの接続を開始する
     */
    connect(){
        if (this._peripheral&& this._peripheral.gatt&&this._peripheral.gatt.connected ) {return}
        let gat= (this._peripheral&& this._peripheral.gatt )?this._peripheral.gatt :undefined;//再接続用
        this._bleConnect(gat).then(obj=>{//info:: resolve({deviceID,deviceName,bleDevice,characteristics});
            this._peripheral=obj.bleDevice;
            this._deviceInfo.id=this._peripheral.id;
            this._deviceInfo.name=this._peripheral.name;
            this._deviceInfo.isConnect=this._peripheral.gatt.connected;
            this._deviceInfo.manufacturerName=obj.infomation.manufacturerName;
            this._deviceInfo.hardwareRevision=obj.infomation.hardwareRevision;
            this._deviceInfo.firmwareRevision=obj.infomation.firmwareRevision;
            //
            this._characteristics=obj.characteristics;

            if(!gat){
                this._peripheral.removeEventListener('gattserverdisconnected',this._onBleConnectionLost);
                this._peripheral.addEventListener('gattserverdisconnected', this._onBleConnectionLost);

                if(this._characteristics['MOTOR_MEASUREMENT']){
                    this._characteristics['MOTOR_MEASUREMENT'].removeEventListener('characteristicvaluechanged',this._onBleMotorMeasurement);
                    this._characteristics['MOTOR_MEASUREMENT'].addEventListener('characteristicvaluechanged',this._onBleMotorMeasurement);
                    this._characteristics['MOTOR_MEASUREMENT'].startNotifications().then(obj=>{
                       if(this._characteristics['MOTOR_IMU_MEASUREMENT']){
                           this._characteristics['MOTOR_IMU_MEASUREMENT'].removeEventListener('characteristicvaluechanged',this._onBleImuMeasurement);
                           this._characteristics['MOTOR_IMU_MEASUREMENT'].addEventListener('characteristicvaluechanged',this._onBleImuMeasurement);
                           return this._characteristics['MOTOR_IMU_MEASUREMENT'].startNotifications();
                       }
                   }).then(obj=>{
                        if(this._characteristics['MOTOR_SETTING']){
                            this._characteristics['MOTOR_SETTING'].removeEventListener('characteristicvaluechanged',this._onBleMotorSetting);
                            this._characteristics['MOTOR_SETTING'].addEventListener('characteristicvaluechanged',this._onBleMotorSetting);
                            return this._characteristics['MOTOR_SETTING'].startNotifications();
                        }
                   }).then(obj=>{
                        this._statusChange_init(true);
                        this._statusChange_isConnect(true);//初回のみ(comp以前は発火しない為)
                   })
                }
            }else {
                this._statusChange_isConnect(true);
            }
        }).catch(err=>{
            this._peripheral=null;
            this._onConnectFailureHandler(this,err);
        })
    }

    /**
     * WebBluetoohの切断
     */
    disConnect(){
       if (!this._peripheral || !this._peripheral.gatt.connected){return;}
        this._peripheral.gatt.disconnect();
        this._peripheral=null;

    }

    /********************************************
     * 内部
     ********************************************/

    /**
     * BLE接続
     * @param gatt_obj ペアリング済みのGATTのデバイスに再接続用(ペアリングモーダルは出ない)
     * @returns {Promise}
     * @private
     */
    _bleConnect(gatt_obj) {
      //let self = this;
      return new Promise((resolve, reject)=> {
          // let bleDevice;
          // let deviceName;
          // let deviceID;
          if(!gatt_obj){
              let options = {
                  filters: [{services: [this._MOTOR_BLE_SERVICE_UUID]}],
                  optionalServices:[this._DEVICE_INFORMATION_SERVICE_UUIDS.Service]
              };
              navigator.bluetooth.requestDevice(options)
                  .then(device => {
                      this._bleGatconnect(device.gatt).then(res => {
                          resolve({
                              bleDevice: device,
                              deviceID: device.id,
                              deviceName: device.name,
                              characteristics:res.characteristics,
                              infomation:res.infomation

                          });
                      })
                      .catch(error => {
                          console.log(error);
                          reject(error);
                      });
                  })

          }else{
              this._bleGatconnect(gatt_obj)
                  .then(res => {
                      console.log("_bleGatconnect");
                      resolve({
                          deviceID: gatt_obj.device.id,
                          deviceName: gatt_obj.device.name,
                          bleDevice: gatt_obj.device,
                          characteristics:res.characteristics,
                          infomation:res.infomation

                      });
                  })
                  .catch(error => {
                      console.log(error);
                      reject(error);
                  });
          }
      });
    }

    //GATT接続用
    _bleGatconnect(gatt_obj){
            let characteristics = {};
            let infomation={};
            return new Promise((gresolve, greject)=> {
                gatt_obj.connect().then(server => {
                    // return server.getPrimaryServices(this._MOTOR_BLE_SERVICE_UUID);
                        server.getPrimaryService(this._MOTOR_BLE_SERVICE_UUID).then(service => {
                            let crs = [];
                            Object.keys(this._MOTOR_BLE_CRS).forEach((key) => {
                                crs.push(
                                    service.getCharacteristic(this._MOTOR_BLE_CRS[key])
                                        .then(chara => {
                                            characteristics[key] = chara;
                                        })
                                );
                            });
                            return Promise.all(crs);
                        }).then(()=>{
                            //ble_firmware_revisionのサービス取得 info::Androiddでは不安定な為停止
                            return new Promise((sresolve, sreject)=> {
                                server.getPrimaryService(this._DEVICE_INFORMATION_SERVICE_UUIDS.Service).then((service) => {
                                    Promise.resolve().then(()=>{
                                        return new Promise((resolve, reject)=>{
                                            service.getCharacteristic(this._DEVICE_INFORMATION_SERVICE_UUIDS.ManufacturerNameString)
                                                .then(chara => {
                                                    return chara.readValue();
                                                }).then(val => {
                                                infomation['manufacturerName'] = KMUtl.Utf8ArrayToStr(new Uint8Array(val.buffer));
                                                resolve();
                                            }).catch((e)=>{reject(e);})
                                        });
                                    }).then(()=>{
                                        return new Promise((resolve, reject)=>{
                                            service.getCharacteristic(this._DEVICE_INFORMATION_SERVICE_UUIDS.FirmwareRevisionString)
                                                .then(chara => {
                                                    return chara.readValue();
                                                }).then(val => {
                                                infomation['firmwareRevision'] = KMUtl.Utf8ArrayToStr(new Uint8Array(val.buffer));
                                                resolve();
                                            }).catch((e)=>{reject(e);})
                                        });
                                    }).then(()=>{
                                        return new Promise((resolve, reject)=>{
                                            service.getCharacteristic(this._DEVICE_INFORMATION_SERVICE_UUIDS.HardwareRevisionString)
                                                .then(chara => {
                                                    return chara.readValue();
                                                }).then(val => {
                                                infomation['hardwareRevision'] = KMUtl.Utf8ArrayToStr(new Uint8Array(val.buffer));
                                                resolve();
                                            }).catch((e)=>{reject(e);})
                                        });
                                    }).then(()=>{
                                        sresolve();
                                    }).catch((e)=>{
                                        sreject(e);
                                    })
                                }).catch((e)=>{
                                    sreject(e);
                                })
                            });
                        }).then(() => {
                            gresolve({characteristics: characteristics, infomation: infomation});
                        }).catch((e)=>{
                            console.log(e);
                        })
                });
            });
    }

    /**
     * BLEコマンドの送信
     * @param commandTypeStr  'MOTOR_CONTROL','MOTOR_MEASUREMENT','MOTOR_IMU_MEASUREMENT','MOTOR_SETTING'
     * コマンド種別のString 主にBLEのキャラクタリスティクスで使用する
     * @param commandNum
     * @param arraybuffer
     * @param notifyPromis cmdReadRegister等のBLE呼び出し後にnotifyで取得する値をPromisで帰す必要のあるコマンド用
     * @private
     */
    _sendMotorCommand(commandCategory, commandNum, arraybuffer=new ArrayBuffer(0), notifyPromis=null){
        let characteristics=this._characteristics[commandCategory];
        let ab=new DataView(arraybuffer);
        //コマンド・ID・CRCの付加
        let buffer = new ArrayBuffer(arraybuffer.byteLength+5);
        new DataView(buffer).setUint8(0,commandNum);
        new DataView(buffer).setUint16(1,this.createCommandID);
        new DataView(buffer).setUint16(arraybuffer.byteLength+3,0);
        //データの書き込み
        for(let i=0;i<arraybuffer.byteLength;i++){
            new DataView(buffer).setUint8(3+i,ab.getUint8(i));
        }
        //queに追加
       // ++this._queCount;
        this._bleSendingQue= this._bleSendingQue.then((res)=>{
          //  console.log("_sendMotorCommand queCount:"+(--this._queCount));
            if(notifyPromis){
                notifyPromis.startRejectTimeOutCount();
            }
            return characteristics.writeValue(buffer);
        }).catch(function(res){
            //失敗時　//info::後続のコマンドは引き続き実行される
          //  console.log("ERR _sendMotorCommand:"+res+" queCount:"+(--this._queCount));
            if(notifyPromis){
                notifyPromis.callReject(res);
            }
        });
    }


//////class//
}

module.exports =KMComWebBLE;