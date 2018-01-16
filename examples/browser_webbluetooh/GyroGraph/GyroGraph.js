

// forked from sugi346's "加速度とSMAを折れ線グラフリアルタイム表示" http://jsdo.it/sugi346/zT5C
var NN = 1000; // 横軸の分解数
var updateInterval = 300;  // インターバルタイマー
var container = $('#placeholder');
var dataX = [], dataY = [], dataZ = [], dataA = [], dataB = [], dataG = [], dataC = [];

var axis = { alpha:0, beta:0, gamma:0, compass:0 }; // ジャイロセンサー
var gra = { x:0, y:0, z:0 }; // 加速度

function updateAllData() {
    var resX = [], resY = [], resZ = [], resA = [], resB = [], resG = [], resC = [];
    for( i = 1, j = 0; i < NN; i++, j++ ) {
        resX[j] = dataX[i][1]; // resに待避
        resY[j] = dataY[i][1]; // resに待避
        resZ[j] = dataZ[i][1]; // resに待避
        resA[j] = dataA[i][1]; // resに待避
        resB[j] = dataB[i][1]; // resに待避
        resG[j] = dataG[i][1]; // resに待避
//        resC[j] = dataC[i][1]; // resに待避
    }
    dataX = [], dataY = [], dataZ = [], dataA = [], dataB = [], dataG = [], dataC = []; // clear

    var px = gra.x;
    var py = gra.y;
    var pz = gra.z;

    /*
     var n = 10; // 単純移動平均をとる回数
     var pMax = Math.max(px, py, pz);
     var ps = resS[NN - 2] - ( resS[NN - 1 - n + 1] ) / n + pMax / n;
     var pm = calcMagnitude(px, py, pz);
     */

    var pa = axis.alpha;
    var pb = axis.beta;
    var pg = axis.gamma;
    var pc = axis.compass;

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

    for( var i=0; i < NN; ++i) {
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
    for( var i = 0; i < NN; i++) {
        dataX.push( [i, 0] );
        dataY.push( [i, 0] );
        dataZ.push( [i, 0] );
        dataA.push( [i, 0] );
        dataB.push( [i, 0] );
        dataG.push( [i, 0] );
    }
}

// plot 描画オプション
var series = [];
series[0] = { label: "X軸", data: dataX, lines:{lineWidth:1} };
series[1] = { label: "Y軸", data: dataY, lines:{lineWidth:1} };
series[2] = { label: "Z軸", data: dataZ, lines:{lineWidth:1} };
series[3] = { label: "α/10", data: dataA, lines:{lineWidth:1} };
series[4] = { label: "β/10", data: dataB, lines:{lineWidth:1} };
series[5] = { label: "γ/10", data: dataG, lines:{lineWidth:1} };
var options = {
    series: { data: series, shadowSize: 2 },
    colors: [ "#b3ffb3", "#b3e6ff", "#ccb3ff", "#0000FF", "#ff0000", "#00FF00"],
    legend: { position:"sw"},
    yaxis: { min: -40, max: 40 },
    xaxis: { show: false, min: 0, max: NN }
};

var plot = $.plot( container, series, options ); // 描画領域

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
var KMB=new KMMotorOneWebBLE();

KMB.onComp= function(tar){

    console.log("onComp:"+tar.name);
    /**
     * ジャイロの取得
     * @param KMImuState {accelX,accelY,accelZ,temp,gyroX,gyroY,gyroZ};
     */
    KMB.onImuMeasurement=function(imuState){
       // console.log(data.GetValObj());
        devicemotion(imuState.gyroX,imuState.gyroY,imuState.gyroZ);
        deviceorientation(imuState.accelX,imuState.accelY,imuState.accelZ);
        $("#temp").text(imuState.temp);
        update();
    };
    KMB.cmdEnableIMU();
};
KMB.onDisconnect= function(deviceinfo){
    console.log("onDisconnect:"+deviceinfo.isEnable);
};
KMB.onConnect= function(deviceinfo){
    console.log("onConnect:"+deviceinfo.isEnable);
};
KMB.onConnectFailure= function(deviceinfo, msg){
    console.log("onConnectFailure:"+msg);
};

//KMB.cmdConnect();//手動でしないとpermission request.エラー

console.log("////debug/////");