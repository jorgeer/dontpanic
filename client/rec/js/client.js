var socket = io.connect('http://localhost');


socket.on('isconnected', function () {
    console.log('Connected');
    socket.emit('msg', 'Hello server');
});

socket.on('msg', function (msg) {
    console.log(msg);
    socket.emit('msg', 'Server said "' + msg + '" to me.');
});

socket.on('data', function (data) {
    var d = JSON.parse(data);
    console.log('Received data ' + data);
    //game_client.onData(d);
});

function command(c){
    var send = JSON.stringify(c)
    console.log('Sending command "' + send + '"');
    socket.emit('command', send);
}

function msg(m){
    console.log('Sending message "' + c + '"');
    socket.emit('msg', m);
}
s
