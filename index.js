var http = require('http');
var fs = require('fs');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nforce = require('nforce');
var WebSocket = require("ws");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));

var port = process.env.PORT || 8888;
var sf_user = process.env.SF_USER;
var sf_pass = process.env.SF_PASS;

app.get('/', function(req, res) {
    res.redirect(301, '/chart-tilt');    
});

app.post('/', function(req, res) {
    res.redirect(301, '/chart-tilt');
    /*
    var options = {
        root: __dirname + '/static/',
        dotfiles: 'deny',
        headers: {
            'x-timestamp': Date.now(),
            'x-sent': true
        }
    };
    res.sendFile('index.html', options, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
    });
    */
});

app.get('/temperature', function(req, res) {
    res.send({
        "temperature": temperature,
        "buttonPressed": false
    });
});



var server = http.createServer(app);
server.listen(port);

var wss = new WebSocket.Server({server: server});
console.log("websocket server created");

wss.on("connection", function(ws) {
    ws.on("message", function(data) {
        if(data === "ping") return;
        // Broadcast to everyone else.
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    });

    /*
    var tilt = 0;
    var id = setInterval(newTilt, 1000);
    function newTilt() {
        var delta = Math.random() * 60 - 30;
        if(tilt + delta > 180 || tilt + delta < -180) {
            delta = -delta;
        }
        tilt = tilt + delta;
        var data = {
            timestamp: Date.now(),
            tilt: tilt
        };
        ws.send(JSON.stringify(data));
    };
    console.log("websocket connection open");
    */

    ws.on("close", function() {
        console.log("websocket connection close");
        //clearInterval(id);
    });
});
