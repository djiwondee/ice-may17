var http = require('http');
var fs = require('fs');

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var nforce = require('nforce');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('static'));

var port = process.env.PORT || 8888;
var sf_user = process.env.SF_USER;
var sf_pass = process.env.SF_PASS;

app.get('/', function(req, res) {
    res.sendfile('index.html', {root: './static'});
});

app.post('/', function(req, res) {
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
});

app.get('/temperature', function(req, res) {
    res.send({
        "temperature": temperature,
        "buttonPressed": false
    });
});
var temperature = 21;
setInterval(newTemp, 1000);
function newTemp() {
        var delta = Math.random() * 10 - 5;
        if(temperature + delta > 30 || temperature + delta < 0) {
            delta = -delta;
        }
        temperature = temperature + delta;
};


http.createServer(app).listen(port);
