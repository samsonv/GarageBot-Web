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
    console.log('got distance', msg);
    $('#distance').text(msg);
    $('#progress').val(msg);
})

socket.on('web', getMessages);

getMessages();