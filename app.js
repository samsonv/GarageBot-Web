var express = require('express');
var moment = require('moment');
var got = require('got');
var app = express();

var timeSinceLastPhone = moment();
var garageAdress = '';
var garagePort = '3000';

app.get('/status', function(req, res){
    res.send('Time since hello: ' + timeSinceLastPhone.from(moment()));
})

app.get('/push/:seconds', function(req, res){
    var seconds = parseInt(req.params.seconds) || 2;
    var address = 'http://' + garageAdress + ':' + garagePort + '/blink/' + seconds        
    console.log('should blink', seconds, address);
    got(address)
    .then(response => {
        console.log(response.body);
        res.send('Sim sala bim')
    })
    .catch(error => {
        console.log(error.response.body);
    });
});

app.get('/phonehome', function(req, res){
    garageAdress = req.connection.remoteAddress.split(':').pop();
    console.log('The garage opener phoned home from ' + garageAdress);
    timeSinceLastPhone = moment();
    res.send("ok");
})

app.listen(1337, function () {
  console.log('Example app listening on port 1337!');
});