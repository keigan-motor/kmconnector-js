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
    chPos(kMRotState);
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


//-------------round---------------------
let round_pos=0;
let direction_flg=true;
let pos_fluctuation=0.1;
function setRoundData(){
    let rot_num=parseInt($("#rot_num").val());
    let rpm_num=parseInt($("#rpm_num").val());
    let easy=Boolean(parseInt($("#easy").val()));
    let rotDistance=rot_num;//回転する目標距離(50回転)
    let rotRpm=rpm_num;//回転する速度(rpm)

    round_pos=KMUtl.degreeToRadian(360*rotDistance);
    KMB.cmdDisable();
    if(easy){
        KMB.cmdCurveType(KMMotorOneWebBLE.cmdCurveType_CURVE_TYPE.CURVE_TYPE_TRAPEZOID);
    }else{
        KMB.cmdCurveType(KMMotorOneWebBLE.cmdCurveType_CURVE_TYPE.CURVE_TYPE_NONE);
    }
    KMB.cmdSpeed_rpm(rotRpm);
    KMB.cmdPresetPosition(0);
    setTimeout(()=>{
        KMB.cmdMoveToPosition(KMUtl.degreeToRadian(360*rotDistance));
    },200);
    $("#playRoundBtn").prop('disabled', false);
    $("#stopRoundBtn").prop('disabled', false);
}
function chPos(kMRotState){
    if(kMRotState.position > round_pos-pos_fluctuation){
        if(!direction_flg){return;}
        direction_flg=false;
        KMB.cmdMoveToPosition(0);
    }else if(kMRotState.position< 0+pos_fluctuation){
        if(direction_flg){return;}
        direction_flg=true;
        KMB.cmdMoveToPosition(round_pos);
    }
}


function playRound(){
    KMB.cmdEnable();
    if(direction_flg){
        KMB.cmdMoveToPosition(round_pos);
    }else if(!direction_flg){
        KMB.cmdMoveToPosition(0);
    }
}
function stopRound(){
    KMB.cmdDisable();
}

//-------------END round-----------------
