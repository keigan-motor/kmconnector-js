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
    KMB.cmdEnable();//For safety, the motor operation at startup is disabled
    KMB.cmdDisableIMU();//info::GyroGraphのデモでモーターのGyroがOnになっていた場合にOffにする(負荷軽減の為)
    KMB.cmdSpeed_rpm(10);
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


//KMB.connect();//info::セキュリティの為clickイベントで発火させないとpermission requestエラーになる
//KMB.disConnect()

/**
 * 設定値の取得と表示
 * */
function allRegisterInfoUpdate(){
    $("#allRegisterInfoUpdateBtn").prop('disabled', true);
    KMB.cmdReadAllRegister().then(function(val){
        var str="";
        Object.keys(val).forEach(function(k){str+=k+":"+val[k]+"<br/>"});
        $("#allRegisterInfo").html(str);
        $("#allRegisterInfoUpdateBtn").prop('disabled', false);
    }).catch(function(msg){
        console.log(msg);
        $("#allRegisterInfoUpdateBtn").prop('disabled', false);
    });
}
/**
 * 設定値の取得と表示（加速曲線周り）
 * */
function curveRegisterInfoUpdate(){
    //レジスタ値の取得 複数取得は返り値がObject
    KMB.cmdReadRegister([KMMotorOneWebBLE.cmdReadRegister_COMMAND.curveType,KMMotorOneWebBLE.cmdReadRegister_COMMAND.acc,KMMotorOneWebBLE.cmdReadRegister_COMMAND.dec]).then(function(val){
        var str="";
        Object.keys(val).forEach(function(k){str+=k+":"+val[k]+" "});
        $("#curveRegisterInfo").text(str);
    }).catch(function(msg){
        console.log(msg);
    });
}

//-----------------torqueDemo---------------------
/**
 * 右に回すとトルクが増大する
 * @param disableflg デモを解除
 */
let torqueDemo_set_torque=0.01;
let torqueDemo_pos_sep=0;//段階を判断するポジション
let torqueDemo_revlocksw=false;

$('#torqueDemoCheckB').on('change', function () {
    torqueDemo_revlocksw=$(this).prop('checked');
});

function torqueDemo(disableflg){
    KMB.cmdResetAllRegisters();
    if(disableflg){
        KMB.removeListener(KMB.EVENT_TYPE.motorMeasurement,torqueDemo_lis);
        KMB.cmdPresetPosition(0);
        KMB.cmdMoveToPosition(0);
        KMB.cmdFree();
        KMB.cmdMaxTorque(1);
    }else{
        KMB.removeListener(KMB.EVENT_TYPE.motorMeasurement,torqueDemo_lis);
        torqueDemo_set_torque=0.01;
        torqueDemo_pos_sep=10;
        KMB.cmdDisable();
        KMB.cmdSpeed_rpm(50);
        KMB.cmdPresetPosition(0);
        setTimeout(
            function(){
                KMB.cmdEnable();
                KMB.cmdMaxTorque(0.01);
                KMB.cmdMoveToPosition(0);
                KMB.on(KMB.EVENT_TYPE.motorMeasurement,torqueDemo_lis);
            }
            ,1000);
    }
}
//45度毎に最大トルクを加減算する
function torqueDemo_lis(KMRotState){
    let stepInterval=Math.PI/4;
    var diff=torqueDemo_pos_sep-KMRotState.position;
    if(diff>stepInterval||diff< -stepInterval){
        torqueDemo_pos_sep=KMRotState.position;
        torqueDemo_set_torque+=(diff>0?0.005:-0.005);
        torqueDemo_set_torque=torqueDemo_set_torque>0.2?0.2:torqueDemo_set_torque;//安全の為
        if(torqueDemo_revlocksw){
          KMB.cmdMoveToPosition(torqueDemo_pos_sep);//ここを有効にすると、手を離しても戻らなくなる
        }
        KMB.cmdMaxTorque(torqueDemo_set_torque);
        $("#torqueDemoInfo").text("Now Torque: "+torqueDemo_set_torque);
    }
    console.log("torqueDemo_set_torque:"+torqueDemo_set_torque);
}
//-------------END torqueDemo---------------------


//-------------teaching---------------------
let teachingCountIntervalId=0;
let teachingRecTime=10000;//ms
let teachingCountIntervalTime=0;
let teachingIsRec=false;
let teachingIsPlay=false;
//インデックスの値は 0～9 （計10個記録）最大記録時間は 65408 [msec]
function teachingRec(index){
    teachingIsPlay=false;
    teachingIsRec=!teachingIsRec;
    clearInterval(teachingCountIntervalId);
    if(!teachingIsRec){
        KMB.cmdStopTeachingMotion();
        KMB.cmdEnable();
    }else{
       // KMB.cmdResetAllRegisters();
        KMB.cmdEraseMotion(index);//消してないとエラー無しで録画出来ない
        KMB.cmdPrepareTeachingMotion(index,teachingRecTime);
        KMB.cmdStartTeachingMotion();
        teachingCountIntervalTime=teachingRecTime+1000;
        teachingCountFnc();
        teachingCountIntervalId=setInterval(teachingCountFnc,1000);
    }
    $(".teachingPlayB").prop("disabled",teachingIsRec);
}
function teachingPlay(index){
    teachingIsPlay=!teachingIsPlay;
    if(!teachingIsPlay){
        KMB.cmdStopPlayback();
    }else {
        //KMB.cmdResetAllRegisters();
        KMB.cmdEnable();
        KMB.cmdPreparePlaybackMotion(index,0,0);
        KMB.cmdStartPlayback();
    }
}

function teachingCountFnc(){
    teachingCountIntervalTime-=1000;
    $("#teachingCountInfo").text("モーターを動かして下さい。 残り:"+Math.floor(teachingCountIntervalTime/1000)+" sec");
    if(teachingCountIntervalTime<1){
        teachingIsRec=true;teachingRec();//停止
    }
}

//-------------END teaching-----------------

//-------------taskSet---------------------
let taskSetList=[];
let taskSetPlayNum=99;

taskSetResetList(["cmdSpeed(10)","cmdLed(1,0,0,250)","cmdMoveByDistance(1.57)","cmdWait(2000)","cmdMoveByDistance(1.57)","cmdWait(2000)","cmdMoveByDistance(1.57)","cmdWait(2000)","cmdMoveByDistance(-4.71)","cmdWait(3000)","cmdStop()"]);

function taskSetResetList(defarray){
    taskSetList=defarray?defarray:[];
    $("#taskSetSelectCmdinfo").html(taskSetList.join("<br>"));
}
function taskSetAdd(elem){
    var cmd = $(elem).val();
    taskSetList.push(cmd);
    $("#taskSetSelectCmdinfo").html(taskSetList.join("<br>"));
}
function taskSetSave(num){
    KMB.cmdEraseTaskset(num);
    setTimeout(function(){
        KMB.cmdDisable();
        KMB.cmdStartRecordingTaskSet(num);
        setTimeout(function(){
            $.each(taskSetList,function(i,v){
                let com="KMB."+v+";";
                eval(com);
            });
            KMB.cmdStopRecordingTaskset();
            //KMB.cmdEnable();
            $("#taskSetPlayB"+num).prop("disabled",false);
        },200);
    },200);
}
function taskSetTest(){
    KMB.cmdDisable();
    KMB.cmdEnable();
    setTimeout(function(){
        $.each(taskSetList,function(i,v){
            let com="KMB."+v+";";
            eval(com);
        });
    },200);
}
function taskSetPlay(num){
    KMB.cmdDisable();
    KMB.cmdEnable();
    KMB.cmdDoTaskset(num,0);
}
function taskSetStop(){
    KMB.cmdDisable();
    KMB.cmdEnable();
}
//-------------END taskSet-----------------
