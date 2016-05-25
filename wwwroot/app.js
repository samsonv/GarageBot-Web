var socket = io();
var self = this;

$('form').submit(function() {
    socket.emit('web message', $('#m').val());
    $('#m').val('');
    return false;
});

$('#open-button').click(function() {
    socket.emit('web message', 'bot: blink');
    return false;
})

this.setStatusLabel = function(status){
    $('#status').text(status);
    
    $('#status').toggleClass("label-success", status == "lukket");
    $('#status').toggleClass("label-danger", status == "åpen");
    $('#status').toggleClass("label-warning", status == "limbo");
    
    $('#open-button').text(status == 'lukket' ? 'åpne' : status == 'åpen' ? 'lukk' : 'start/stopp');
}

socket.on('distance', function(msg) {
    self.setStatusLabel(msg.status);
    
    $('#lastUpdatedDistance').text(msg.time);
    $('#distance').text(msg.distance);
})

$.get("/distance").done(function(data) {
    var dist = data.distance;
    var status = dist > 2.2 ? "lukket" :
            dist < 0.2 ? "åpen" : "limbo";
    self.setStatusLabel(status);
    $('#distance').text(data.distance);
    $('#lastUpdatedDistance').text(data.time);
});