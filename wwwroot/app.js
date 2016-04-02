var socket = io();

$('form').submit(function () {
    socket.emit('web message', $('#m').val());
    $('#m').val('');
    return false;
});

$('#open-button').click(function () {
    socket.emit('web message', 'blink');
    return false;
})

socket.on('distance-message', function(msg){
    $('#distance').text(msg);
})

socket.on('web', function (msg) {
    $('#messages').prepend($('<li class="list-group-item">').text(msg));
});