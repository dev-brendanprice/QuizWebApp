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
    log(`${socket.id} attached`)
    var number = 0;

    socket.on('createRoom', (room) => {
        log("hi")
        socket.join(room);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});

httpServer.listen(port);