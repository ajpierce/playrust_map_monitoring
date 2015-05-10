'use strict'

var WebSocketClient = require('websocket').client;
var client = new WebSocketClient();

client.on('connectFailed', function(error) {
    console.log('Connect Error: ' + error.toString());
});

client.on('connect', function(connection) {
    console.log('WebSocket Client Connected');
    connection.on('error', function(error) {
        console.log("Connection Error: " + error.toString());
    });
    connection.on('close', function() {
        console.log('echo-protocol Connection Closed');
    });
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log("Received: '" + message.utf8Data + "'");
        }
        return handleMessage(connection, message.utf8Data);
    });
});

client.connect('ws://198.15.64.82:49075/ms');

function handleMessage(connection, msg) {
    var cmd,
        data;
    var p = msg.indexOf(" ");
    if (p < 0) {
        cmd = msg;
        data = null;
    } else {
        cmd = msg.substring(0, p);
        data = JSON.parse(msg.substring(p + 1));
    }
    switch (cmd) {
        case "hello":
            console.log("greeted by server");
            connection.sendUTF("hello");
            break; 
        default:
            console.log("received unknown command: " + cmd);
            break;
    }
}
