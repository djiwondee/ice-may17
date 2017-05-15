var http = require('http');
var fs = require('fs');

var Promise = require('bluebird');
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
var sf_clientId = process.env.SF_CLIENTID;
var sf_clientSecret = process.env.SF_CLIENTSECRET;

app.get('/', function(req, res) {
    res.redirect(301, '/chart-tilt');
});

app.post('/', function(req, res) {
    res.redirect(301, '/chart-tilt');
});

var org = null;
app.post('/flic-button', function(req, res) {
    if(!org) {
        res.status(500);
        return;
    }

    var c = nforce.createSObject('Case');
    //c.set('AssetId', process.env.CASE_ASSETID);
    c.set('Subject', process.env.CASE_SUBJECT);
    c.set('SuppliedEmail', process.env.CASE_SUPPLIEDEMAIL);

    org.insert({sobject: c})
    .then(function(result){
        console.log("Sucess");
        res.status(200).send("OK");
    })
    .catch(function(err){
        res.status(503);
    });
});

if(sf_user != "CHANGE ME" && sf_pass != "CHANGE ME" && sf_clientId != "CHANGE ME" && sf_clientSecret != "CHANGE ME") {
    console.log(sf_user);
    console.log(sf_pass);
    console.log(sf_clientId);
    console.log(sf_clientSecret);
    org = nforce.createConnection({
        clientId: sf_clientId,
        clientSecret: sf_clientSecret,
        redirectUri: '',
        mode: 'single',
        plugins: []
    });
    org.authenticate({ username: sf_user, password: sf_pass})
    .then(function(){
        console.log("Authenicated successfully against Salesforce Org");
    })
    .catch(function(err){
        console.log("Error authenicating against Salesforce Org");
        console.log(err);
    });
}

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

    ws.on("close", function() {
        console.log("websocket connection close");
        //clearInterval(id);
    });
});
