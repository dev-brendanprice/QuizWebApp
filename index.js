const express = require("express");
const res = require("express/lib/response");
const { createServer } = require("http");
const { Server } = require("socket.io");
const path = require("path");
const log = console.log.bind(console);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {});
const port = 3221;
log(`- http://86.2.10.33:${port}/`);

io.on('connection', (socket) => {
    log(`${socket.id} attached`);

    var users = {};

    socket.on('createRoom', (room) => {
        // Create Room
        log('Room Created: ' + room);
        socket.join(room.id);
    });

    socket.on('joinRoom', (room) => {
        // Assign Client to room
        log(room);
    });
});

app.get('/home', (req, res) => {
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