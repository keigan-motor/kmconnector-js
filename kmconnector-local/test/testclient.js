'use strict';
let io = require('socket.io-client');
let socket = io.connect('http://192.168.24.40:6223', {reconnect: true});

// Add a connect listener
socket.on('connect', function (res) {
    console.log('Connected!');
    socket.emit('CH01', 'me', 'test msg');
});
