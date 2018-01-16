/***
 * KMMotorCommandKMOne.js
 * version 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
'use strict';
let EventEmitter = require("events").EventEmitter;
let KMUtl = require('./KMUtl');
let KMComWebBLE = require('./KMComWebBLE');
let KMStructures=require('./KMStructures');

class KMMotorCommandKMOne extends EventEmitter{
    /********************************************
     * 定数
     ********************************************/
    /**
     * 接続方式
     * @returns {{"UNSETTLED":0,"BLE":1,"SERIAL":2}}
     * @constructor
     */
    static get KM_CONNECT_TYPE(){
        return {"WEBBLE":1,"BLE":2,"SERIAL":3};
    }

    static get cmdPreparePlaybackMotion_START_POSITION(){
        return{
            'START_POSITION_ABS':0,//記憶された開始位置（絶対座標）からスタート
            'START_POSITION_CURRENT':1//現在の位置を開始位置としてスタート
        };
    }
    static get cmdLed_LED_STATE(){
        return{
            'LED_STATE_OFF':0,	// LED消灯
            'LED_STATE_ON_SOLID':1,	// LED点灯（点灯しっぱなし）
            'LED_STATE_ON_FLASH':2,	// LED点滅（一定間隔で点滅）
            'LED_STATE_ON_DIM':3	// LEDがゆっくり明滅する
        };
    }
    static get cmdCurveType_CURVE_TYPE(){
        return{
            'CURVE_TYPE_NONE': 0,	// モーションコントロール OFF
            'CURVE_TYPE_TRAPEZOID':1	// モーションコントロール ON （台形加減速）
        };
    }
    /*
    * ReadRegisterで取得する時用のコマンド引数
    * */
    static get cmdReadRegister_COMMAND(){
        return{
            "maxSpeed":0x02,
            "minSpeed":0x03,
            "curveType":0x05,
            "acc":0x07,
            "dec":0x08,
            "maxTorque":0x0E,
            "qCurrentP":0x18,
            "qCurrentI":0x19,
            "qCurrentD":0x1A,
            "speedP":0x1B,
            "speedI":0x1C,
            "speedD":0x1D,
            "positionP":0x1E,
            "ownColor":0x3A
        };
    }

    /**
     * constructor　
     *  @param connect_type 接続方式 KMMotorCommandKMOne.KM_CONNECT_TYPE
     * @param kmcom
     */
    constructor(connect_type,kmcom){
        super();
        //イベントハンドラタイプ
        this.EVENT_TYPE={"init":"init","connect":"connect","disconnect":"disconnect","connectFailure":"connectFailure","motorMeasurement":"motorMeasurement","imuMeasurement":"imuMeasurement"};
        //モーターの全コマンド
        this._MOTOR_COMMAND={
            "maxSpeed":0x02,//最大速さを設定する
            "minSpeed":0x03,//最小速さを設定する
            "curveType":0x05,//加減速曲線を設定する
            "acc":0x07,//加速度を設定する
            "dec":0x08,//減速度を設定する
            "maxTorque":0x0E,//最大トルクを設定する
            "qCurrentP":0x18,//q軸電流PIDゲイン(P)を設定する
            "qCurrentI":0x19,//q軸電流PIDゲイン(I)を設定する
            "qCurrentD":0x1A,//q軸電流PIDゲイン(D)を設定する
            "speedP":0x1B,//速度PIDゲイン(P)を設定する
            "speedI":0x1C,//速度PIDゲイン(I)を設定する
            "speedD":0x1D,//速度PIDゲイン(D)を設定する
            "positionP":0x1E,//位置PIDゲイン(P)を設定する
            "resetPID":0x22,//PIDゲインをリセットする
            "ownColor":0x3A,//デバイスLEDの固有色を設定する
            "readRegister":0x40,//指定の設定値を取得する
            "saveAllRegisters":0x41,//全ての設定値をフラッシュに保存する
            "resetRegister":0x4E,//指定の設定値をリセットする
            "resetAllRegisters":0x4F,//全設定値をリセットする
            "disable":0x50,//モーターの動作を不許可とする
            "enable":0x51,//モーター動作を許可する
            "speed":0x58,//速度の大きさを設定する
            "presetPosition":0x5A,//位置のプリセットを行う（原点設定）
            "runForward":0x60,//正回転する（反時計回り）
            "runReverse":0x61,//逆回転する（時計回り）
            "moveToPosition":0x66,//絶対位置に移動する
            "moveByDistance":0x68,//相対位置に移動する
            "free":0x6C,//モーターの励磁を停止する
            "stop":0x6D,//速度ゼロまで減速し停止する
            "holdTorque":0x72,//トルク制御を行う
            "doTaskset":0x81,//タスクセットを実行する
            "preparePlaybackMotion":0x86,//モーション再生の開始地点に移動する
            "startPlayback":0x87,//モーションを再生する
            "stopPlayback":0x88,//モーション再生を停止する
            "pause":0x90,//キューを停止する
            "resume":0x91,//キューを再開する
            "wait":0x92,//キューを指定時間停止し再開する
            "reset":0x95,//キューをリセットする
            "startRecordingTaskset":0xA0,//タスクセットの記録を開始する
            "stopRecordingTaskset":0xA2,//タスクセットの記録を停止する
            "eraseTaskset":0xA3,//指定のタスクセットを削除する
            "eraseAllTasksets":0xA4,//タスクセットを全削除する
            "prepareTeachingMotion":0xAA,//ティーチングの開始準備を行う
            "startTeachingMotion":0xAB,//ティーチングを開始する
            "stopTeachingMotion":0xAC,//ティーチングを停止する
            "eraseMotion":0xAD,//ティーチングで覚えた動作を削除する
            "eraseAllMotion":0xAE,//ティーチングで覚えた全動作を削除する
            "led":0xE0,//LEDの点灯状態をセットする
            "enableIMU":0xEA,//IMUの値取得(通知)を開始する
            "disableIMU":0xEB,//IMUの値取得(通知)を停止する
            "reboot":0xF0,//システムを再起動する
            "enterDeviceFirmwareUpdate":0xFD//ファームウェアアップデートモードに入る
        };
        //モーターの全コマンド（逆引用）
        this._REV_MOTOR_COMMAND={};
        Object.keys(this._MOTOR_COMMAND).forEach((k)=>{this._REV_MOTOR_COMMAND[this._MOTOR_COMMAND[k]]=k;});
        //SendNotifyPromisのリスト
        this._notifyPromisList=[];

        this.KM_CONNECT_TYPE=this.constructor.KM_CONNECT_TYPE;
        this.cmdPreparePlaybackMotion_START_POSITION=this.constructor.cmdPreparePlaybackMotion_START_POSITION;
        this.cmdLed_LED_STATE=this.constructor.cmdLed_LED_STATE;
        this.cmdCurveType_CURVE_TYPE=this.constructor.cmdCurveType_CURVE_TYPE;
        //--------------------------
        // section::entry point
        //--------------------------
        this._connectType=connect_type;
        this._KMCom=kmcom;

        //内部イベントバインド
        this._KMCom.onInit=(connector)=>{
            this.emit(this.EVENT_TYPE.init,connector.deviceInfo);//デバイス情報を返す
        };
        this._KMCom.onConnect=(connector)=>{
            this.emit(this.EVENT_TYPE.connect,connector.deviceInfo);
        };
        this._KMCom.onDisconnect=(connector)=>{
            this.emit(this.EVENT_TYPE.disconnect,connector.deviceInfo);
        };
        this._KMCom.onConnectFailure=(connector, err)=>{
            this.emit(this.EVENT_TYPE.connectFailure,connector.deviceInfo);
        };
        /**
         * モーター回転情報受信
         * @param res {position:dv.getFloat32(0,false),velocity:dv.getFloat32(4,false),torque:dv.getFloat32(8,false)}
         */
        this._KMCom.onMotorMeasurement=(res)=>{
            let rotState=new KMStructures.KMRotState(res.position,res.velocity,res.torque);
            this.emit(this.EVENT_TYPE.motorMeasurement,rotState);
        };
        /**
         * モーターIMU情報受信
         * @param res {accelX,accelY,accelZ,temp,gyroX,gyroY,gyroZ}
         */
        this._KMCom.onImuMeasurement=(res)=>{
            let imuState=new KMStructures.KMImuState(res.accelX,res.accelY,res.accelZ,res.temp,res.gyroX,res.gyroY,res.gyroZ);
            this.emit(this.EVENT_TYPE.imuMeasurement,imuState);
        };
        /**
         * モーター設定情報取得
         * @param registerCmd
         * @param res {maxSpeed,minSpeed・・・ownColor}
         * @private
         */
        this._KMCom._onMotorSettingCB=(registerCmd, res)=>{
            _KMNotifyPromis.sendGroupNotifyResolve(this._notifyPromisList,registerCmd,res);
        };
    }
    /********************************************
     * プロパティ
     ********************************************/
    /**
     * モーターのBLE接続が有効か
     * @returns {boolean}
     */
    get isConnect(){
        return this._KMCom.deviceInfo.isConnect;
    }
    /**
     * 接続方式
     * @returns {KMMotorCommandKMOne.KM_CONNECT_TYPE}
     */
    get connectType(){
        return this._connectType;
    }

    /**
     * デバイス情報
     * @returns {{name: string, id: string, info: null}}
     *
     * info::メーカーサービスデータ(info)はwebBluetoohでは実装が無い為、ファームversionは取得出来ない 2017/12/1時点
     */
    get deviceInfo(){
        return this._KMCom.deviceInfo;
    }
    get connector(){
        return  this._KMCom;
    }

    /********************************************
     * callback
     ********************************************/
    /**
     * 初期化完了して利用できるようになった
     * @param handlerFunction(KMDeviceInfo)
     * @constructor
     */
    set onInit(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onInitHandler=handlerFunction;
        }
    }
    /**
     * 応答・再接続に成功した
     * @param handlerFunction(KMDeviceInfo)
     * @constructor
     */
    set onConnect(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onConnectHandler=handlerFunction;
        }
    }
    /**
     * 応答が無くなった・切断された
     * @param handlerFunction(KMDeviceInfo)
     * @constructor
     */
    set onDisconnect(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onDisconnectHandler=handlerFunction;
        }
    }
    /**
     * 接続に失敗
     * @param handlerFunction(KMDeviceInfo,err)
     * @constructor
     */
    set onConnectFailure(handlerFunction){
        if(typeof handlerFunction ==="function"){
            this._onConnectFailureHandler=handlerFunction;
        }
    }

    /**
     * モーターの回転情報callback
     * @param func ({position,velocity,torque})
     */
    set onMotorMeasurement(func){
        if(typeof func==="function"){
            this._onMotorMeasurementCB=func;
        }
    }
    /**
     * モーターのジャイロ情報callback
     * @param func ({accelX,accelY,accelZ,temp,gyroX,gyroY,gyroZ})
     */
    set onImuMeasurement(func){
        if(typeof func==="function"){
            this._onImuMeasurementCB=func;
        }
    }
    /********************************************
     * 内部ユーティリティ
     ********************************************/

    /********************************************
     * section::モーターコマンド https://document.keigan-motor.com/motor-control-command/motor_action.html
     ********************************************/
   

    /**
     * モーター動作を不許可とする（上位命令）
     * 安全用：この命令を入れるとモーターは動作しない
     * コマンドはタスクセットに記録することは不可
     */
    cmdDisable(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.disable);
    }

    /**
     * モーター動作を許可する（上位命令）
     * 安全用：この命令を入れるとモーターは動作可能となる
     * モーター起動時は disable 状態のため、本コマンドで動作を許可する必要があり
     * コマンドはタスクセットに記録することは不可
     */
    cmdEnable(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.enable);
    }
    /**
     * 速度の大きさをセットする（単位系：RPM）
     * @param speed:Float  [0-X rpm]　(正の数)
     */
    cmdSpeed_rpm(speed_rpm){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speed_rpm*0.10471975511965977,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.speed,buffer);
    }
    /**
     * 速度の大きさをセットする（単位系：ラジアン）
     * @param speed:Float 速度の大きさ 単位：角度（ラジアン）/秒 [0-X rps]　(正の数)
     */
    cmdSpeed(speed){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speed,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.speed,buffer);
    }

    /**
     * 位置のプリセットを行う（原点設定）（単位系：ラジアン）
     * @param position:Float 絶対角度：radians
     */
    cmdPresetPosition(position){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,parseFloat(KMUtl.toNumber(position),10));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.presetPosition,buffer);
    }

    /**
     *正回転する（反時計回り）
     * cmdSpeed で保存された速度で、正回転
     */
    cmdRunForward(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.runForward);
    }

    /**
     * 逆回転する（時計回り）
     * cmdSpeed で保存された速度で、逆回転
     */
    cmdRunReverse(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.runReverse);
    }

    /**
     * 絶対位置に移動する
     * 速さは cmdSpeed で保存された速度が採用される
     * @param position:Float 角度：radians
     */
    cmdMoveToPosition(position){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,parseFloat(position,10));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.moveToPosition,buffer);
    }

    /**
     * 相対位置に移動する
     * 速さは cmdSpeed で保存された速度が採用される
     * @param distance:Float 角度：radians[左:+radians 右:-radians]
     */
    cmdMoveByDistance(distance){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,parseFloat(distance,10));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.moveByDistance,buffer);
    }

    /**
     * モーターの励磁を停止する（感触は残ります）
     * 完全フリー状態を再現する場合は、 bleFree().cmdDisable() として下さい。
     */
    cmdFree(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.free);
    }

    /**
     * モーターを速度ゼロまで減速し停止する
     * rpm = 0 となる。※実質 bleRunAt(0)と同じ
     */
    cmdStop(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.stop);
    }


    /**
     * トルク制御を行う
     * @param torque:Float トルク 単位：N・m [-X ~ + X Nm] 推奨値 0.3-0.05
     * ---------------------------------------------------------
     * info::速度や位置を同時に制御する場合は、モーター設定の 0x0E: maxTorque と 0x60: runForward 等を併用して下さい。
     *
     */
    cmdHoldTorque(torque){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,parseFloat(torque,10));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.holdTorque,buffer);
    }

    /**
     * 0x81 記憶したタスク（命令）のセットを実行する
     * @param index:int タスクセット番号（0～65535）
     * @param repeating:int 繰り返し回数 0は無制限 todo::未実装
     * ---------------------------------------------------------
     * info:: KM-1 は index: 0~49 まで。（50個のメモリバンク 各8128 Byte まで制限あり）
     * タスクセットの記録は、コマンド（タスクセット）を参照下さい。 https://document.keigan-motor.com/motor-control-command/taskset.html
     */
    cmdDoTaskset(index,repeating){
        let buffer = new ArrayBuffer(6);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(repeating,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.doTaskset,buffer);
    };

    /**
     * 0x86 モーション再生の開始地点に移動する
     * @param index:int モーション番号（0～65535）
     * @param repeating:int 繰り返し回数 0は無制限　todo::未実装
     * @param cmdPreparePlaybackMotion_START_POSITION:int スタート位置の設定　todo::未実装
     *          START_POSITION_ABS = 0; // 記憶された開始位置（絶対座標）からスタート
     *          START_POSITION_CURRENT = 1; // 現在の位置を開始位置としてスタート
     * ---------------------------------------------------------
     * info::※ KM-1 は index: 0~9 まで。（10個のメモリバンク。）それぞれ 約2分記録可能。
     * ティーチング（動作の記録）は、コマンド（ティーチング）を参照下さい。https://document.keigan-motor.com/motor-control-command/teaching.html
     *          repeating, option についてはファームウェア未実装
     *          再生回数は１回固定であり、本コマンドを実行すると、記録した絶対位置の最初のポイントに移動する
     *
     */
    cmdPreparePlaybackMotion(index,repeating,cmdPreparePlaybackMotion_START_POSITION){
        let buffer = new ArrayBuffer(7);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(repeating,10)));
        new DataView(buffer).setUint8(6,Math.abs(parseInt(cmdPreparePlaybackMotion_START_POSITION,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.preparePlaybackMotion,buffer);
    }

    /**
     * モーションを再生する
     */
    cmdStartPlayback(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.startPlayback);
    }

    /**
     * モーション再生を停止する
     */
    cmdStopPlayback(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.stopPlayback);
    }

    //---------------------//
    // section::キュー操作
    //---------------------//
    /**
     * キューを一時停止する 0x90
     */
    cmdPause(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.pause);
    }

    /**
     *キューを再開する（蓄積されたタスクを再開）
     */
    cmdResume(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.resume);
    }

    /**
     *キューを指定時間停止し再開する
     * pause（キュー停止）を実行し、指定時間（ミリ秒）経過後、自動的に resume（キュー再開） を行います。
     * @param time 停止時間[msec]（ミリ秒）
     */
    cmdWait(time){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setUint32(0,Math.abs(parseInt(time,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.wait,buffer);
    }

    /**
     *キューをリセットする
     */
    cmdReset(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.reset);
    }

    //---------------------//
    // section::タスクセット
    //---------------------//

    /**
     * タスク（命令）のセットの記録を開始する 0xA0
     *  ・記憶するインデックスのメモリはコマンド：eraseTaskset により予め消去されている必要があり
     * @param index:int インデックス KM-1 の場合、インデックスの値は 0～49 （計50個記録）
     */
    cmdStartRecordingTaskSet(index){
        let buffer = new ArrayBuffer(2);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.startRecordingTaskset,buffer);
    }

    /**
     * タスクセットの記録を停止する 0xA2
     * ・startRecordingTaskset 実施中のみ有効
     */
    cmdStopRecordingTaskset(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.stopRecordingTaskset);
    }

    /**
     * 指定のインデックスのタスクセットを消去する 0xA3
     * @param index:int インデックス
     */
    cmdEraseTaskset(index){
        let buffer = new ArrayBuffer(2);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.eraseTaskset,buffer);
    }

    /**
     * 全てのタスクセットを消去する 0xA4
     */
    cmdEraseAllTaskset(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.eraseAllTasksets);
    }

    //---------------------//
    // section::ティーチング
    //---------------------//
    
    /**
     * 0xAA インデックスと記録時間[msec]を指定し、ティーチングの開始準備を行う。
     * @param index インデックス
     * @param time 記録時間（ミリ秒） [msec 0-65408]
     * ---------------------------------------------------------
     * info::KM-1 の場合、インデックスの値は 0～9 （計10個記録）となる。記録時間は 65408 [msec] を超えることはできない
     *          記憶するインデックスのメモリはbleEraseMotion により予め消去されている必要がある
     * ---------------------------------------------------------
     */
    cmdPrepareTeachingMotion(index,lengthRecordingTime){
        let buffer = new ArrayBuffer(6);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        new DataView(buffer).setUint32(2,Math.abs(parseInt(lengthRecordingTime,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.prepareTeachingMotion,buffer);
    }

    /**
     * 0xAB 直前に行った prepareTeachingMotion の条件でティーチングを開始する。
     * blePrepareTeachingMotion を実行した直後のみ有効。
     */
    cmdStartTeachingMotion(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.startTeachingMotion);
    }

    /**
     * 0xAC 実行中のティーチングを停止する
     */
    cmdStopTeachingMotion(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.stopTeachingMotion);
    }

    /**
     * 0xAD 指定したインデックスのモーションを消去する
     * @param index:int インデックス
     * ---------------------------------------------------------
     * info:: KM-1 の場合、インデックスの値は 0～9 （計10個記録）となる
     * ---------------------------------------------------------
     */
    cmdEraseMotion(index){
        let buffer = new ArrayBuffer(2);
        new DataView(buffer).setUint16(0,Math.abs(parseInt(index,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.eraseMotion,buffer);
    }

    /**
     * 0xAE 全てのモーションを消去する
     */
    cmdEraseAllMotion(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.eraseAllMotion);
    }

    //---------------------//
    // section::LED
    //---------------------//
    /**
     * 0xE0 LEDの点灯状態をセットする
     * 点灯状態（OFF, 点灯：SOLID, 点滅：FLASH, ゆっくり明滅：DIM）と、RGB各色の強度を指定し、LEDの点灯状態をセットする。
     * @param cmdLed_LED_STATE:int
     *          LED_STATE_OFF = 0,	// LED消灯
     *          LED_STATE_ON_SOLID = 1,	// LED点灯（点灯しっぱなし）
     *          LED_STATE_ON_FLASH = 2,	// LED点滅（一定間隔で点滅）
     *          LED_STATE_ON_DIM = 3	// LEDがゆっくり明滅する
     * @param red:int 0-255
     * @param green:int 0-255
     * @param blue:int 0-255
     */
    cmdLed(cmdLed_LED_STATE,red,green,blue){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setUint8(0,Math.abs(parseInt(cmdLed_LED_STATE,10)));
        new DataView(buffer).setUint8(1,Math.abs(parseInt(red,10)));
        new DataView(buffer).setUint8(2,Math.abs(parseInt(green,10)));
        new DataView(buffer).setUint8(3,Math.abs(parseInt(blue,10)));
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.led,buffer);
    }

    //---------------------//
    // IMU ジャイロ
    //---------------------//
    /**
     * 0xEA　IMUの値取得(通知)を開始する info::BLE専用コマンド
     * ---------------------------------------------------------
     * info::本コマンドを実行すると、IMUのデータはBLEのキャラクタリスティクスMOTOR_IMU_MEASUREMENTに通知される
     *        MOTOR_IMU_MEASUREMENTのnotifyは_onBleImuMeasurementで取得
     * ---------------------------------------------------------
     */
    cmdEnableIMU(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.enableIMU);
    }

    /**
     * 0xEB IMUの値取得(通知)を停止する
     */
    cmdDisableIMU(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.disableIMU);
    }

    //---------------------//
    // システム
    //---------------------//
    /**
     * 0xF0 システムを再起動する
     * info::BLEに接続していた場合、切断してから再起動
     */
    cmdReboot(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.reboot);
    }

    /**
     * 0xFD ファームウェアアップデートモードに入る
     * info::ファームウェアをアップデートするためのブートローダーモードに入る。（システムは再起動される。）
     */
    cmdEnterDeviceFirmwareUpdate(){
        this._KMCom._sendMotorCommand('MOTOR_CONTROL',this._MOTOR_COMMAND.enterDeviceFirmwareUpdate);
    }

    //---------------------//
    // モーター設定　MOTOR_SETTING
    //---------------------//
    /**
     * 0x02 モーターの最大速さを設定する
     * @param maxSpeed:float 最大速さ [radian / second]（正の値）
     */
    cmdMaxSpeed(maxSpeed){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(maxSpeed,10)));//todo::NaNが返る可能性 parseFloat("aaa",10)===NaN
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.maxSpeed,buffer);
    }

    /**
     * 0x03 モーターの最小速さを設定する
     * @param maxSpeed:float 最小速さ [radian / second]（正の値）
     * info::minSpeed は、blePreparePlaybackMotion 実行の際、開始地点に移動する速さとして使用される。通常時運転では使用されない。
     */
    cmdMinSpeed(minSpeed){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(minSpeed,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.minSpeed,buffer);
    }

    /**
     * 0x05 加減速曲線を指定する（モーションコントロールの設定）
     * @param cmdCurveType_CURVE_TYPE:int
     *      CURVE_TYPE_NONE = 0,	// モーションコントロール OFF
     *      CURVE_TYPE_TRAPEZOID = 1,	// モーションコントロール ON （台形加減速）
     */
    cmdCurveType(cmdCurveType_CURVE_TYPE){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,Math.abs(parseInt(cmdCurveType_CURVE_TYPE,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.curveType,buffer);
    }

    /**
     * 0x07 モーターの加速度を設定する
     * @param acc:float 加速度 0-200 [radian / second^2]（正の値）
     * info::acc は、モーションコントロール ON の場合、加速時に使用されます。（加速時の直線の傾き）
     */
    cmdAcc(acc){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(acc,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.acc,buffer);
    }

    /**
     * 0x08 モーターの減速度を設定する
     * @param dec:float 減速度 0-200 [radian / second^2]（正の値）
     * info::dec は、モーションコントロール ON の場合、減速時に使用されます。（減速時の直線の傾き）
     */
    cmdDec(dec){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(dec,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.dec,buffer);
    }

    /**
     * 0x0E モーターの最大トルク（絶対値）を設定する
     * @param maxTorque:float 最大トルク [N*m]（正の値）
     * ---------------------------------------------------------
     * info::maxTorque を設定することにより、トルクの絶対値が maxTorque を超えないように運転します。
     * info:: maxTorque = 0.1 [N*m] の後に runForward （正回転）を行った場合、0.1 N*m を超えないようにその速度をなるだけ維持する。
     * info:: ただし、トルクの最大値制限により、システムによっては制御性（振動）が悪化する可能性がある。
     *
     */
    cmdMaxTorque(maxTorque){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(maxTorque,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.maxTorque,buffer);
    }

    /**
     * 0x18 モーターのq軸電流PIDコントローラのP（比例）ゲインを設定する
     * @param qCurrentP:float q電流Pゲイン（正の値）
     */
    cmdQCurrentP(qCurrentP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentP,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.qCurrentP,buffer);
    }

    /**
     * 0x19 モーターのq軸電流PIDコントローラのP（比例）ゲインを設定する
     * @param qCurrentI:float q電流Iゲイン（正の値）
     */
    cmdQCurrentI(qCurrentI){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentI,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.qCurrentI,buffer);
    }

    /**
     * 0x1A モーターのq軸電流PIDコントローラのD（微分）ゲインを設定する
     * @param qCurrentD:float q電流Dゲイン（正の値）
     */
    cmdQCurrentD(qCurrentD){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(qCurrentD,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.qCurrentD,buffer);
    }

    /**
     * 0x1B モーターのq軸電流PIDコントローラのD（微分）ゲインを設定する
     * @param speedP:float 速度Pゲイン（正の値）
     */
    cmdSpeedP(speedP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedP,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.speedP,buffer);
    }

    /**
     * 0x1C モーターの速度PIDコントローラのI（積分）ゲインを設定する
     * @param speedI:float 速度Iゲイン（正の値）
     */
    cmdSpeedI(speedI){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedI,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.speedI,buffer);
    }

    /**
     * 0x1D モーターの速度PIDコントローラのD（微分）ゲインを設定する
     * @param speedD:float 速度Dゲイン（正の値）
     */
    cmdSpeedD(speedD){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(speedD,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.speedD,buffer);
    }

    /**
     * 0x1E モーターの位置PIDコントローラのP（比例）ゲインを設定する
     * @param positionP:float 位置Pゲイン（正の値）
     */
    cmdPositionP(positionP){
        let buffer = new ArrayBuffer(4);
        new DataView(buffer).setFloat32(0,Math.abs(parseFloat(positionP,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.positionP,buffer);
    }

    /**
     * 0x22 全てのPIDパラメータをリセットしてファームウェアの初期設定に戻す
     * info::qCurrentP, qCurrentI,  qCurrentD, speedP, speedI, speedD, positionP をリセットします
     *
     */
    cmdResetPID(){
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.resetPID);
    }

    /**
     * 0x3A モーターの起動時固有LEDカラーを設定する
     * @param red:int 0-255
     * @param green:int 0-255
     * @param blue:int 0-255
     *
     * info::ownColor はアイドル時の固有LEDカラー。saveAllSettingsを実行し、再起動後に初めて反映される。
     * この設定値を変更した場合、BLEの Device Name の下3桁が変更される。
     */
    cmdOwnColor(red,green,blue){
        let buffer = new ArrayBuffer(3);
        new DataView(buffer).setUint8(0,Math.abs(parseInt(red,10)));
        new DataView(buffer).setUint8(1,Math.abs(parseInt(green,10)));
        new DataView(buffer).setUint8(2,Math.abs(parseInt(blue,10)));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.ownColor,buffer);
    }


    /**
     * 0x40 指定した設定値を取得 info::BLE専用コマンド todo::分離作業
     * @param registers:mix int [] 取得するプロパティのコマンド(レジスタ番号)値
     * @returns {Promise} 取得した値 registersがint=レジスタ値のプリミティブ値。registersがarray=レジスタ値のオブジェクト。
     * ---------------------------------------------------------
     * info:: 取得する値はコマンド実行後にBLEのキャラクタリスティクスMOTOR_SETTINGに通知される。
     *          それを拾ってpromiseオブジェクトののresolveに返して処理を繋ぐ
     *          MOTOR_SETTINGのnotifyは_onBleMotorSettingで取得
     * ---------------------------------------------------------
     */
    cmdReadRegister(registers){
        if(registers instanceof Array){
            return new Promise((allresolve, allreject)=> {
                var promiseList=[];
                for(let i=0;i<registers.length;i++){
                    let register=registers[i];
                    promiseList.push( new Promise((resolve, reject)=> {
                        let ccp=new _KMNotifyPromis(register,this._REV_MOTOR_COMMAND[register],this._notifyPromisList,resolve,reject,1000);//notify経由のresultをPromisと紐付け
                        let buffer = new ArrayBuffer(1);
                        new DataView(buffer).setUint8(0, parseInt(register, 10));
                        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.readRegister, buffer,ccp);
                    }));
                }
                Promise.all(promiseList).then((resar)=>{
                    let t=[{}].concat(resar);
                    let rtobj=Object.assign.apply(null,t);
                    allresolve(rtobj);
                }).catch((msg)=>{
                    allreject(msg);
                });
            });
        }else{
            return new Promise((lastresolve, lastreject)=> {
                let register=registers;
                new Promise((resolve, reject)=> {
                    let ccp=new _KMNotifyPromis(register,this._REV_MOTOR_COMMAND[register],this._notifyPromisList,resolve,reject,1000);//notify経由のresultをPromisと紐付け
                    let buffer = new ArrayBuffer(1);
                    new DataView(buffer).setUint8(0, parseInt(register, 10));
                    this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.readRegister, buffer,ccp);
                }).then((res)=>{
                    lastresolve(res[Object.keys(res)[0]]);
                }).catch((msg)=>{
                    lastreject(msg);
                });
            });
        }
    }

    /**
     * モーターの全てのレジスタ値の取得
     */
    cmdReadAllRegister(){
       let cm= this.constructor.cmdReadRegister_COMMAND;
        let allcmds=[];
        Object.keys(cm).forEach((k)=>{allcmds.push(cm[k]);});

       return this.cmdReadRegister(allcmds);
    }
    //////保存
    /**
     * 0x41 全ての設定値をフラッシュメモリに保存する
     * info::本コマンドを実行しない限り、設定値はモーターに永久的に保存されない(再起動で消える)
     */
    cmdSaveAllRegisters(){
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.saveAllRegisters);
    }

    //////リセット
    /**
     * 0x4E 指定したレジスタをファームウェアの初期値にリセットする
     * @param register:KMMotorCommandKMOne.cmdReadRegister_COMMAND 初期値にリセットするコマンド(レジスタ)値
     */
    cmdResetRegister(register){
        let buffer = new ArrayBuffer(1);
        new DataView(buffer).setUint8(0,parseInt(register,10));
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.resetRegister,buffer);
    }
    /**
     * 0x4F 全てのレジスタをファームウェアの初期値にリセットする
     * info::bleSaveAllRegistersを実行しない限り、リセット値はモーターに永久的に保存されない(再起動で消える)
     */
    cmdResetAllRegisters(){
        this._KMCom._sendMotorCommand('MOTOR_SETTING',this._MOTOR_COMMAND.resetAllRegisters);
    }

    /********************************************
     * 内部
     ********************************************/


//////class//
}


/**
 * SendBleNotifyPromis
 * 　cmdReadRegister等のBLE呼び出し後に
 * 　コマンド結果がnotifyで通知されるコマンドをPromisと紐付ける為のクラス
 */
class _KMNotifyPromis{
    //成功通知
    static sendGroupNotifyResolve(groupArray,tagName,val){
        if(!groupArray instanceof Array){return;}
        //送信IDの通知 CallbackPromisで呼び出し元のメソッドのPromisに返す
        for(let i=0; i<groupArray.length; i++){
            if( groupArray[i].tagName===tagName ){
                groupArray[i].callResolve(val);
                groupArray.splice(i,1);
            }
        }
    }
    /**
     * const
     * @param tagName
     * @param groupArray
     * @param promisResolveObj
     * @param promisRejectObj
     * @param rejectTimeOut
     */
    constructor(tagName,tagInfo=null,groupArray=[],promisResolveObj, promisRejectObj,rejectTimeOut){
        this.timeoutId=0;
        this.tagName=tagName;
        this.tagInfo=tagInfo;
        this.groupArray=groupArray instanceof Array?groupArray:[];
        this.groupArray.push(this);
        this.promisResolveObj=promisResolveObj;
        this.promisRejectObj=promisRejectObj;
        this.rejectTimeOut=rejectTimeOut;
    }
    //カウントの開始 characteristics.writeValue呼び出し後に実行
    startRejectTimeOutCount(){
        this.timeoutId=setTimeout(()=>{
            this._removeGroup();
            this.promisRejectObj({msg:"timeout:",tagName:this.tagName,tagInfo:this.tagInfo});
        }, this.rejectTimeOut);
    }
    callResolve(arg){
        clearTimeout(this.timeoutId);
        this._removeGroup();
        this.promisResolveObj(arg);
    }
    callReject(msg){
        clearTimeout(this.timeoutId);
        this._removeGroup();
        this.promisRejectObj({msg:msg});
    }

    _removeGroup(){
        for(let i=0; i<this.groupArray.length; i++){
            if( this.groupArray===this){
                this.groupArray.splice(i,1);
                break;
            }
        }
    }

}

module.exports =KMMotorCommandKMOne;
