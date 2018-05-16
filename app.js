var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

users = [];
connections = [];

server.listen(process.env.PORT || 4200);
console.log('Server running...')

app.get('/', function(req, res,next) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: % sockets connected',connections.length);

    // Disconnect
    socket.on('disconnect', function(data){
        // if user logOf - remove that user from list
        users.splice(users.indexOf(socket.username), 1);
        updateUsernames();
        //
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: % sockets connected',connections.length);
    });

    // Send message
    socket.on('send message', function(data){
        io.sockets.emit('new message', connections);

        // setTimeout(function() {
        //     socket.send('Sent a message 4seconds after connection!');
        // }, 4000);

    });

    // new User
    socket.on('new user', function(data, callback){
        callback(true);
        socket.username = data;
        users.push(socket.username);
        updateUsernames();
    });

    function updateUsernames(){
        io.sockets.emit('get users', users);
    }

    // countDown timer
    // var counter = 1000;
    // var WinnerCountdown = setInterval(function(){
    //   counter--;
    //   io.sockets.emit('timer', {counter, counter});
    // }, 1000);
    //
    // socket.on('connection', function(socket){
    //     socket.on('reset', function (data) {
    //         countdown = 1000;
    //         io.sockets.emit('timer', { countdown: countdown });
    //       });
    // });


});
