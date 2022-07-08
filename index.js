
 



var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(8000||process.env.PORT);
console.log(server.address().port);
const users={};
app.use(express.static(__dirname + '/public'));
app.get('/',(req,res)=>{
    res.sendFile('./public/index.html',{root:__dirname});
})



io.on('connection',socket=>{
    socket.on('new-user-joined',name=>{
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',name);
        socket.broadcast.emit('set-zero');
        socket.broadcast.emit('IamOnline-2');
        // socket.broadcast.emit('Online',users.length);
        // socket.broadcast.to(socket.id).emit('Online',users.length);
    });
    socket.on('send',message=>{
        socket.broadcast.emit('receive',{message:message,name:users[socket.id]})
    });
    socket.on('audio',message=>{
        socket.broadcast.emit('playAudio',message);
    });
    socket.on('IamOnline-1',()=>{
        socket.broadcast.emit('IamOnline');
    });
    socket.on('sendingAudio',blob=>{
        socket.broadcast.emit('audioReceived',{chunks:blob,name:users[socket.id]});
        
    });

    socket.on('disconnect',message=>{
        socket.broadcast.emit('left',users[socket.id]);
        delete users[socket.id];
        socket.broadcast.emit('ILeft');
        // socket.broadcast.emit('Online',users.length);
    });
})