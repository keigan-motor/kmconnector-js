/***
 * AllDemos.js
 * version 0.1.0 alpha
 * Created by Harada Hiroshi on 2017/12/07.
 *
 * Copyright (c) 2017 Keigan Inc. https://keigan-motor.com/
 * This software is released under the MIT License.
 * http://opensource.org/licenses/mit-license.php
 */
'use strict';
//------------------------------
// API初期化と各種イベントバインド
//------------------------------
let KMB=new KMMotorOneWebBLE();

/**
 *
 * @param deviceinfo {name,id,info}
 */

KMB.on(KMB.EVENT_TYPE.init,function(kMDeviceInfo){
    console.log("onInit:"+kMDeviceInfo.name);
    KMB.cmdResetAllRegisters();
    KMB.cmdSpeed_rpm(10);
    KMB.cmdDisable();
    KMB.cmdDisableIMUMeasurement();//info::GyroGraphのデモでモーターのGyroがOnになっていた場合にOffにする(負荷軽減の為)
    let infost=[];
    Object.keys(kMDeviceInfo).forEach((v)=>{
        infost.push(v+":"+kMDeviceInfo[v]);
    });
    $("#kmName").html(infost.join('<br/>'));
    $("#control").toggleClass("disable",false);
    allRegisterInfoUpdate();
});
KMB.on(KMB.EVENT_TYPE.connect,function(kMDeviceInfo){
    console.log("onConnect:"+kMDeviceInfo.isConnect);
    $("#control").toggleClass("disable",false);
});
KMB.on(KMB.EVENT_TYPE.disconnect,function(kMDeviceInfo){
    console.log("onDisconnect:"+kMDeviceInfo.isConnect);
    $("#control").toggleClass("disable",true);
});
KMB.on(KMB.EVENT_TYPE.connectFailure,function(kMDeviceInfo,err){
    console.log("onConnectFailure:"+err);
    alert("onConnectFailure:"+err);
    $("#control").toggleClass("disable",true);
});
KMB.on(KMB.EVENT_TYPE.motorMeasurement,function(kMRotState){
    // console.log(kMRotState.GetValObj());
    $("#status").text(kMRotState.position+"\n"+kMRotState.velocity+"\n"+kMRotState.torque);
});
KMB.on(KMB.EVENT_TYPE.imuMeasurement,function(kMImuState){
    console.log(kMImuState.GetValObj());
});


/**
 * 設定値の取得と表示
 * */
function allRegisterInfoUpdate(){
    $("#allRegisterInfoUpdateBtn").prop('disabled', true);
    KMB.cmdReadAllRegister().then(function(val){
        let str="";
        Object.keys(val).forEach(function(k){str+=k+":"+val[k]+"<br/>"});
        $("#allRegisterInfo").html(str);
        $("#allRegisterInfoUpdateBtn").prop('disabled', false);
    }).catch(function(msg){
        console.log(msg);
        $("#allRegisterInfoUpdateBtn").prop('disabled', false);
    });
}


//-------------taskSet---------------------
function onClicksetPresetData(){
$("#onClicksetPresetDataBtn").prop('disabled', true);
    setPresetData().then(()=>{
        alert("書き込み完了");
        $("#onClicksetPresetDataBtn").prop('disabled', false);
        $("#onplayPresetDataBtn").prop('disabled', false);

    }).catch((e)=>{
        alert(e);
        $("#onClicksetPresetDataBtn").prop('disabled', false);
    })
}
function setPresetData(){
    return new Promise((resolve,reject)=>{
        try{
            let rot_num=parseInt($("#rot_num").val());
            let rpm_num=parseInt($("#rpm_num").val());
            let recIdx=0;//REC番号
            let rotDistance=rot_num;//回転する目標距離(50回転)
            let rotRpm=rpm_num;//回転する速度(rpm)
            let curve=rotRpm/rotDistance;
            let waitTime=(60/curve)*(curve*0.18);//回転数から目的地までの到達時間 *1.2:イージングの減速分
            KMB.cmdPresetPosition(0);
           // KMB.cmdResetAllRegisters();
            KMB.cmdEraseTaskset(recIdx);
            setTimeout(function(){
                KMB.cmdDisable();
                KMB.cmdStartRecordingTaskSet(recIdx);
                setTimeout(function(){
                    KMB.cmdSpeed_rpm(rotRpm);
                    KMB.cmdLed(KMMotorOneWebBLE.cmdLed_LED_STATE.LED_STATE_ON_SOLID,200,0,0);
                    KMB.cmdMoveToPosition(KMUtl.degreeToRadian(360*rotDistance));
                    KMB.cmdWaitQueue(Math.floor(waitTime*1000));//10秒間
                    KMB.cmdLed(KMMotorOneWebBLE.cmdLed_LED_STATE.LED_STATE_ON_SOLID,0,200,0);
                    KMB.cmdMoveToPosition(KMUtl.degreeToRadian(0));
                    KMB.cmdWaitQueue(Math.floor(waitTime*1000));
                    KMB.cmdStopRecordingTaskset();
                    setTimeout(function(){
                        resolve(true);
                    },500);
                },500);
            },500);
        }catch (e){
            reject(false);
        }
    });
}
function playPresetData(){
    let recIdx=0;//REC番号
    KMB.cmdEnable();
    setTimeout(function(){
        KMB.cmdStartDoingTaskset(recIdx,0);
    },500);
}


//-------------END taskSet-----------------
