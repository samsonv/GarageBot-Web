var app = require('express')();
var moment = require('moment');
var got = require('got');
var http = require('http').Server(app);
var io = require('socket.io')(http);

var timeSinceLastPhone = moment();
var garageAdress = '';
var garagePort = '3000';
var port = process.env.PORT || 1337;

app.get('/', function(req, res){
    res.send('Hello world!');
})

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

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

app.listen(port, function () {
  console.log('Example app listening on port ', port);
});