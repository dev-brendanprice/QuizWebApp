const express = require('express'),
    res = require('express/lib/response'),
    { createServer } = require('http'),
    { Server } = require('socket.io'),
    path = require('path');
const log = console.log.bind(console);

const app = express(),
    httpServer = createServer(app),
    port = 3221,
    io = new Server(httpServer, {});
log(`- http://86.2.10.33:${port}/`);

// Objects to store users & rooms
var __userStruct__ = {},
    __roomStruct__ = {};


io.on('connection', (socket) => {

    socket.on('roomListener', (args) => {

        // Check for userType & config rooms
        if (args.user.userType == 'student' && __roomStruct__[args.room.roomCode]) {
            __userStruct__[socket.id] = 
            {
                user: { userType: args.user.userType, isTeacher: false },
                room: { roomCode: args.room.roomCode }
            };

            socket.join(args.room.id);
            log('Student Joined Room!');
        }
        else if (args.user.userType == 'teacher' && !__roomStruct__[args.room.id]) {
            __roomStruct__[args.room.id] =
            {
                inception: { time: new Date() },
                room:      { roomCode: args.room.roomCode, roomName: args.room.rommName }
            };
            __userStruct__[socket.id] = 
            {
                user: { userType: args.user.userType, isTeacher: true },
                room: { roomCode: args.room.roomCode }
            };

            socket.join(args.room.id);
            log('Teacher Created Room!');
        };
    });

    socket.on('disconnect', () => {
        // This works somehow lmfao, If client disconnects remove all references (RAM efficient)
        if (__userStruct__[socket.id]) {
            let roomCode = __userStruct__[socket.id].room.roomCode;
            delete __roomStruct__[roomCode];
            delete __userStruct__[socket.id];
        };
    });
});



app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '/home.html'));
});
app.get('', (req, res) => {
    res.sendFile(path.join(__dirname, '/home.html'));
});

app.get('/teacher', (req, res) => {
    res.sendFile(path.join(__dirname, '/teacher.html'));
});

app.get('/student', (req, res) => {
    res.sendFile(path.join(__dirname, '/student.html'));
});

app.get('*', (req, res) => {
    res.send('Error 404: How did we get here?');
});

httpServer.listen(port);