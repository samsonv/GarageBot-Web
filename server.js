var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var got = require('got');

var self = this;

var port = process.env.PORT || 8080;
var version = process.env.VERSION;
var sendgrid_username = process.env.sendgrid_username;
var sendgrid_password = process.env.sendgrid_password;
var mailTo = process.env.send_mail_to;

var mail_after_minutes = mail_after_minutes || 5;

var sendgrid = require('sendgrid')(sendgrid_username, sendgrid_password);
var timer = null;

this.messages = [];

var lastVal = {
    time: moment().format('DD/MM/YYYY HH:mm:ss'),
    distance: 0
};
this.distances = [];

app.use(express.static('wwwroot'));

app.get('/version', function (req, res) {
    res.send(version);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/messages', function (req, res) {
    res.send(self.messages);
})

app.get('/distance', function (req, res) {
    res.send(lastVal);
})

this.getMessageWithTimeStamp = function (msg) {
    return {
        time: moment().format("DD/MM/YYYY HH:mm"),
        message: msg
    }
}

io.on('connection', function (socket) {
    var isGarage = false;
    io.emit('web', self.getMessageWithTimeStamp('Noen logget på.'));

    socket.on('pi', function (msg) {
        saveMessage(msg);
        isGarage = true;
        io.emit('web', self.getMessageWithTimeStamp(msg));
    });

    socket.on('distance-message', function (msg) {
        if (timer) {
            clearTimeout(timer); //cancel the previous timer.
            timer = null;
        }
        timer = setTimeout(function () {
            console.log('O noes!');
            sendgrid.send({
                to: mailTo,
                from: mailTo,
                subject: 'Failing bot',
                text: 'Something went wrong ' + moment().format('DD/MM/YYYY HH:mm')
            });
        }, mail_after_minutes * 1000 * 60);

        var threshold = 2; //meter
        var time = moment().format('DD/MM/YYYY HH:mm:ss');

        if (threshold < Math.abs(lastVal.distance - (msg / 100))) {
            lastVal.distance = msg / 100;
            return;
        }

        pushDistance(msg);
        var dist = Math.round(getAvgDistance()) / 100;
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

    socket.on('web message', function (msg) {
        var command = msg.split(' ')[0];
        if (command == "mail") {
            sendgrid.send({
                to: msg.split(' ')[1],
                from: msg.split(' ')[2],
                subject: 'test mail',
                text: 'testing..'
            });
        } 
        if (command == "bot:") {
            io.emit('command', msg.split(' ').splice(1).join(' '));
        }
        
        io.emit('web', self.getMessageWithTimeStamp(msg));
    })

    socket.on('disconnect', function () {
        if (isGarage) {
            var msg = "Garasjen logget av. :("
            saveMessage(msg);
            io.emit('web', self.getMessageWithTimeStamp(msg));
        } else {
            io.emit('web', self.getMessageWithTimeStamp("Noen logget av."));
        }
    });
});

function getAvgDistance() {
    return self.distances.reduce(function (previousValue, currentValue, currentIndex, array) {
        return previousValue + currentValue;
    }) / self.distances.length;
}

function pushDistance(dist) {
    if (self.distances.length > 10) {
        self.distances.shift();
    }
    self.distances.push(dist);
}

function saveMessage(msg) {
    if (self.messages.length > 100) {
        self.messages.shift();
    }
    self.messages.push({
        time: moment().format('DD/MM/YYYY HH:mm'),
        message: msg
    });
}

http.listen(port, function () {
    console.log('listening on *:' + port);
});