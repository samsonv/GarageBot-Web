var socket = io();

$('form').submit(function() {
    socket.emit('web message', $('#m').val());
    $('#m').val('');
    return false;
});

$('#open-button').click(function() {
    socket.emit('web message', 'blink');
    return false;
})

var addMessage = function(msg) {
    $('#messages').prepend($('<li class="list-group-item">')
        .text(msg.time + ': ' + msg.message));
}

var getMessages = function() {
    $('#messages').html("");
    $.get("/messages").done(function(data) {
        data.map(addMessage);
    })
}

socket.on('distance', function(msg) {
    var status = msg.status;
    $('#status').text(status);
    
    $('#status').toggleClass("label-success", status == "lukket");
    $('#status').toggleClass("label-danger", status == "åpen");
    $('#status').toggleClass("label-warning", status == "limbo");
    
    $('#open-button').text(status == 'lukket' ? 'åpne' : status == 'åpen' ? 'lukk' : 'start/stopp');
    $('#distance').text(msg.distance);
})

socket.on('web', getMessages);

getMessages();