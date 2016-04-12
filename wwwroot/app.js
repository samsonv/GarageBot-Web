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
    $('#status').text(msg.status);
    $('#status').toggleClass("label-success", msg.status == "lukket");
    $('#status').toggleClass("label-danger", msg.status == "åpen");
    $('#status').toggleClass("label-warning", msg.status == "limbo");
    $('#distance').text(msg.distance);
})

socket.on('web', getMessages);

getMessages();