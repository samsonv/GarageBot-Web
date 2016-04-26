var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var got = require('got');

var port = process.env.PORT || 8080;

var self = this;

this.messages = [];
var lastVal = {
    time: moment().format('DD/MM/YYYY HH:mm'),
    distance: 0
};
this.distances = [];

app.use(express.static('wwwroot'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/messages', function(req, res) {
    res.send(self.messages);
})

app.get('/distance', function(req, res){
    res.send(self.lastVal);
})

io.on('connection', function(socket) {
    io.emit('web', 'someone connected');

    socket.on('pi', function(msg) {
        saveMessage(msg);
        io.emit('web', 'Pi says ' + msg);
    });
    
    socket.on('distance-message', function(msg) {
        var threshold = 2; //meter
        var time = moment().format('DD/MM/YYYY HH:mm');
        
        if (threshold < Math.abs(lastVal.distance - (msg/100))){
            lastVal.distance = msg/100;
            return;
        }
        
        pushDistance(msg);
        var dist = Math.round(getAvgDistance())/100;
        var status = dist > 2.2 ? "lukket" :
            dist < 0.2 ? "åpen" : "limbo";
        io.emit('distance', {
            'status': status,
            'distance': dist,
            'time': time
        });
        lastVal.distance = dist;
        lastVal.time = time
    })

    socket.on('web message', function(msg) {
        io.emit('command', msg)
    })

    socket.on('disconnect', function() { });
});

function getAvgDistance(){
    return self.distances.reduce(function(previousValue, currentValue, currentIndex, array) {
        return previousValue + currentValue;
    })/self.distances.length;
}

function pushDistance(dist){
    if (self.distances.length > 10) {
        self.distances.shift();
    }
    self.distances.push(dist);
}

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