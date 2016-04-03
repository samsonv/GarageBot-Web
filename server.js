var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var got = require('got');

var port = process.env.PORT || 8080;

var self = this;

this.messages = [];

app.use(express.static('wwwroot'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/messages', function(req, res) {
    res.send(self.messages);
})


io.on('connection', function(socket) {
    io.emit('web', 'someone connected');

    socket.on('pi', function(msg) {
        saveMessage(msg);
        io.emit('web', 'Pi says ' + msg);
    });
    
    socket.on('distance-message', function(msg) {
        io.emit('distance', msg);
    })

    socket.on('web message', function(msg) {
        io.emit('command', msg)
    })

    socket.on('disconnect', function() { });
});

function saveMessage(msg) {
    if (self.messages.length > 10) {
        self.messages.shift();
    }
    self.messages.push({
        time: moment().format('DD/MM/YYYY HH:mm'),
        message: msg
    });
}


http.listen(port, function() {
    console.log('listening on *:' + port);
});