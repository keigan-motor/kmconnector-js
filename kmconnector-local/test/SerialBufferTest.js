'use strict';
let KMUtl = require('../src/KMUtl');
function SerialBufferTest(){
    this._serialBuf=new Uint8Array(0);//on dataシリアル受信時のバッファー

    this.onData=function(data){
        if(! data instanceof Buffer){return;}

        /**
         * ---------------------------------------------------------
         * シリアルデータのバッファ
         * データーは細切れで来るのでバッファーに溜めて、プリアンブル〜ポストアンブルを検出し、情報バイト、CRCを抽出する
         * ---------------------------------------------------------
         * データフォーマット
         * 開始を表す固定データ	     情報バイト               CRC              終端データ
         * byte[0]-byte[3]	        byte[4]-byte[n]	  byte[n+1]-byte[n+2]  byte[n+3]-byte[n+4]
         * [0x00][0x00][0xAA][0xAA]     ・・・             uint16              [0xD0][0x0A]
         */
        this._serialBuf=KMUtl.Uint8ArrayConcat(this._serialBuf,new Uint8Array(data));
        console.log("this._serialBuf<<<"+KMUtl.Uint8ArrayToHexStr(this._serialBuf));
        let sv=this._serialBuf;
        let sv_len=this._serialBuf.length;
        let is_pre=false;//プリアンブル検出したか
        if(sv_len<8){return;}
        // console.log(KMUtl.Uint8ArrayToHexStr(sv));
        console.log("serialBuf len:"+sv_len);
        let delete_idx=sv_len;//抽出済みとしてバッファーから削除するインデックス
        for(let i=0;i<sv_len;i++){
            if(sv[i]===0x00&&sv[i+1]===0x00&&sv[i+2]===0xAA&&sv[i+3]===0xAA&&!is_pre){//プリアンブル検出
                is_pre=true;
                delete_idx=i;
                for(let ie=i+4;ie<sv_len;ie++){
                    if(sv[ie+2]===0x0D&&sv[ie+3]===0x0A){//ポストアンブル検出
                        let crc=sv[ie]<<8 | sv[ie+1];//CRC uint16_t
                        // todo::CRCのチェック処理
                        let payload=sv.slice(i+4,ie);//情報バイト
                        console.log("payload:::"+KMUtl.Uint8ArrayToHexStr(payload));
                        //this._serialdataParse(payload);
                        delete_idx=ie+4;
                        i=ie+3;
                        is_pre=false;
                        break;
                    }
                }
            }
        }
        this._serialBuf=this._serialBuf.slice(delete_idx);
       console.log("this._serialBuf:::"+KMUtl.Uint8ArrayToHexStr(this._serialBuf));
    }

};

let serialBufferTest=new SerialBufferTest();

serialBufferTest.onData(new Buffer([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]));
serialBufferTest.onData(new Buffer([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]));//ヘッダー無しデータ

serialBufferTest.onData(new Buffer([0x00, 0x00, 0xAA, 0xAA]));//プリアンブル
serialBufferTest.onData(new Buffer([0x08,0xB4,0x11,0x22,0x33,0x44,0x55,0x66]));//payload正常
serialBufferTest.onData(new Buffer([0xDD, 0xDD, 0x0D, 0x0A]));//ポストアンブル
serialBufferTest.onData(new Buffer([0x00, 0x00, 0xAA, 0xAA]));//プリアンブル
serialBufferTest.onData(new Buffer([0x04,0xB4,0xee,0xee,0xee,0xee,0xee,0xee]));//payloadバイト長エラー 不足
serialBufferTest.onData(new Buffer([0xDD, 0xDD, 0x0D, 0x0A]));//ポストアンブル

serialBufferTest.onData(new Buffer([0x99, 0x00,0x99]));//ゴミ
serialBufferTest.onData(new Buffer([0x00, 0x00, 0xAA, 0xAA]));//プリアンブル
serialBufferTest.onData(new Buffer([0x0a,0xB4,0xee,0xee,0xee,0xee,0xee,0xee]));//payloadバイト長エラー　長い
serialBufferTest.onData(new Buffer([0xDD, 0xDD, 0x0D, 0x0A]));//ポストアンブル

//一括データ
serialBufferTest.onData(new Buffer([].concat(
    [0x00, 0x00, 0xAA, 0xAA]//プリアンブル
    ,[0x08,0xB4,0x11,0x22,0x33,0x44,0x55,0x66]//payload正常
    ,[0xDD, 0xDD, 0x0D, 0x0A]//ポストアンブル
    ,[0x99, 0x00,0x99]//ゴミ
    ,[0x00, 0x00, 0xAA, 0xAA]//プリアンブル
    ,[0x08,0xB4,0x11,0x22,0x33,0x44,0x55,0x66]//payload正常
    ,[0xDD, 0xDD, 0x0D, 0x0A]//ポストアンブル
    ,[0x00, 0x00, 0xAA, 0xAA]//プリアンブル
    ,[0x08,0xB4,0x00, 0x00, 0xAA, 0xAA,0x99,0x99]//ポストアンブルと同じ値含むpayload
    ,[0xDD, 0xDD, 0x0D, 0x0A]//ポストアンブル
    ,[0x99, 0x00,0x99],[0x99, 0x00,0x99]//ゴミ
    ,[0xDD, 0xDD, 0x0D, 0x0A]//不要なポストアンブル　//this._serialBuf:::99:0:99:99:0:99:dd:dd:d:a
)));
serialBufferTest.onData(new Buffer([0x99, 0x00,0x99]));//ゴミ //this._serialBuf:::