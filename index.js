const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: '*'
    }
});

app.use(express.static('public'));
httpServer.listen(3000);

io.on('connection', (socket) => {
    console.log('made socket connection', socket.id);

    socket.on('join', (roomName) => {
        var rooms = io.sockets.adapter.rooms;

        var room = rooms.get(roomName);

        if (room == undefined) {
            console.log(roomName);
            socket.join(roomName);
            socket.emit('created', roomName);

        }
        else if (room.size == 1) {
            socket.join(roomName);
            socket.emit('joined', roomName);

        } else {
            socket.emit('full', roomName);

        }

    });


    socket.on('ready', roomName => {
        console.log('ready');
        socket.broadcast.to(roomName).emit("ready");

    });

    socket.on('candidate', function (candidate, roomName) {
        console.log(candidate);
        socket.broadcast.to(roomName).emit("candidate", candidate); //Sends Candidate to the other peer in the room.
    });


    socket.on('offer', function (offer, roomName) {
        console.log(offer);
        socket.broadcast.to(roomName).emit("offer", offer); //Sends Offer to the other peer in the room.
    });

    socket.on('answer', function (answer, roomName) {
        console.log(answer);
        socket.broadcast.to(roomName).emit("answer", answer); //Sends Answer to the other peer in the room.
    });

}
);