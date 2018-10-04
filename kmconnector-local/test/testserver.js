'use strict';
// let app = require('express')();
// let http = require('http').Server(app);
//let io = require('socket.io')(http);

let http = require('http').createServer(handler);
let io = require('socket.io')(http);


io.on('connection', function (socket){
    console.log('connection');

    socket.on('CH01', function (from, msg) {
        console.log('MSG', from, ' saying ', msg);
    });

});

http.listen(3000, function () {
    console.log('listening on *:3000');
});

function handler (req, res) {
    fs.readFile(__dirname + '/index.html',
        function (err, data) {
            if (err) {
                res.writeHead(500);
                return res.end('Error loading index.html');
            }

            res.writeHead(200);
            res.end(data);
        });
}