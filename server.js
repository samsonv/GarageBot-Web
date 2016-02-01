var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var got = require('got');

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
    io.emit('web', 'someone connected');
    
    socket.on('pi', function(msg){
        console.log('Pi tells me: ' + msg);
        io.emit('web', 'Pi says ' + msg);
    });
    
    socket.on('web message', function(msg){
        io.emit('command', msg)
    })
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});