
'use strict';
// forked from sugi346's "加速度とSMAを折れ線グラフリアルタイム表示" http://jsdo.it/sugi346/zT5C
let NN = 1000; // 横軸の分解数
let updateInterval = 300;  // インターバルタイマー
let container = $('#placeholder');
let dataX = [], dataY = [], dataZ = [], dataA = [], dataB = [], dataG = [], dataC = [];

let axis = { alpha:0, beta:0, gamma:0, compass:0 }; // ジャイロセンサー
let gra = { x:0, y:0, z:0 }; // 加速度

function updateAllData() {
    let resX = [], resY = [], resZ = [], resA = [], resB = [], resG = [], resC = [];
    for(let i = 1,  j = 0; i < NN; i++, j++ ) {
        resX[j] = dataX[i][1]; // resに待避
        resY[j] = dataY[i][1]; // resに待避
        resZ[j] = dataZ[i][1]; // resに待避
        resA[j] = dataA[i][1]; // resに待避
        resB[j] = dataB[i][1]; // resに待避
        resG[j] = dataG[i][1]; // resに待避
//        resC[j] = dataC[i][1]; // resに待避
    }
    dataX = [], dataY = [], dataZ = [], dataA = [], dataB = [], dataG = [], dataC = []; // clear

    let px = gra.x;
    let py = gra.y;
    let pz = gra.z;

    /*
     let n = 10; // 単純移動平均をとる回数
     let pMax = Math.max(px, py, pz);
     let ps = resS[NN - 2] - ( resS[NN - 1 - n + 1] ) / n + pMax / n;
     let pm = calcMagnitude(px, py, pz);
     */

    let pa = axis.alpha;
    let pb = axis.beta;
    let pg = axis.gamma;
    let pc = axis.compass;

    $('#xx').html(px);
    $('#yy').html(py);
    $('#zz').html(pz);
    $('#aa').html(pa);
    $('#bb').html(pb);
    $('#gg').html(pg);
    $('#cc').html(pc);

    resX[NN - 1 ] = px;
    resY[NN - 1 ] = py;
    resZ[NN - 1 ] = pz;
    resA[NN - 1 ] = pa / 10;
    resB[NN - 1 ] = pb / 10;
    resG[NN - 1 ] = pg / 10;
    resC[NN - 1 ] = pc;

    for( let i=0; i < NN; ++i) {
        dataX[i] = [ i, resX[i] ]; // 復帰
        dataY[i] = [ i, resY[i] ]; // 復帰
        dataZ[i] = [ i, resZ[i] ]; // 復帰
        dataA[i] = [ i, resA[i] ]; // 復帰
        dataB[i] = [ i, resB[i] ]; // 復帰
        dataG[i] = [ i, resG[i] ]; // 復帰
        dataC[i] = [ i, resC[i] ]; // 復帰
    }
}

function calcMagnitude(x, y, z) {
    return Math.sqrt(x*x+y*y+z*z);
}

// データの初期化
function init(){
    dataX = [], dataY = [], dataZ = [], dataA = [], dataB = [], dataG = [], dataC = [];
    for( let i = 0; i < NN; i++) {
        dataX.push( [i, 0] );
        dataY.push( [i, 0] );
        dataZ.push( [i, 0] );
        dataA.push( [i, 0] );
        dataB.push( [i, 0] );
        dataG.push( [i, 0] );
    }
}

// plot 描画オプション
let series = [];
series[0] = { label: "X軸", data: dataX, lines:{lineWidth:1} };
series[1] = { label: "Y軸", data: dataY, lines:{lineWidth:1} };
series[2] = { label: "Z軸", data: dataZ, lines:{lineWidth:1} };
series[3] = { label: "α/10", data: dataA, lines:{lineWidth:1} };
series[4] = { label: "β/10", data: dataB, lines:{lineWidth:1} };
series[5] = { label: "γ/10", data: dataG, lines:{lineWidth:1} };
let options = {
    series: { data: series, shadowSize: 2 },
    colors: [ "#b3ffb3", "#b3e6ff", "#ccb3ff", "#0000FF", "#ff0000", "#00FF00"],
    legend: { position:"sw"},
    yaxis: { min: -40, max: 40 },
    xaxis: { show: false, min: 0, max: NN }
};

let plot = $.plot( container, series, options ); // 描画領域

function update() {
    updateAllData();
    series[0].data = dataX;
    series[1].data = dataY;
    series[2].data = dataZ;
    series[3].data = dataA;
    series[4].data = dataB;
    series[5].data = dataG;
    plot.setData( series );
    plot.draw();

    setTimeout(update, updateInterval); // 繰り返し描画
}

// 初期化
init();

// データ更新
update();


// イベント定義：iPhoneジャイロセンサーとデジタルコンパス
function deviceorientation(axisX,axisY,axisZ) {
    axis.alpha = axisZ; // z-axis　方位
    axis.beta = axisX; // x-axis　ピッチ
    axis.gamma = axisY; // y-axis　ロール
}

// イベント定義：iPhone加速度
function devicemotion(mx,my,mz) {
    gra.x = mx;
    gra.y = my;
    gra.z = mz;
}

///////////////////////////////////////////
let KMB=new KMMotorOneWebBLE();
KMB.on(KMB.EVENT_TYPE.init,function(kMDeviceInfo){
    KMB.cmdEnableIMUMeasurement();
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
    //console.debug(kMRotState.GetValObj());
});

/**
 * ジャイロの取得
 * @param KMImuState {accelX,accelY,accelZ,temp,gyroX,gyroY,gyroZ};
 */
KMB.on(KMB.EVENT_TYPE.imuMeasurement,function(kMImuState){
    console.log(kMImuState.gyroZ);
    devicemotion(kMImuState.gyroX,kMImuState.gyroY,kMImuState.gyroZ);
    deviceorientation(kMImuState.accelX,kMImuState.accelY,kMImuState.accelZ);
    $("#temp").text(kMImuState.temp);
    update();
});

//KMB.cmdConnect();//手動でしないとpermission request.エラー

console.log("////debug/////");