const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Store room states
const roomStates = {};

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinRoom', (code) => {
        socket.join(code);
        console.log(`Socket ${socket.id} joined room ${code}`);
        // Initialize room state if not exists
        if (!roomStates[code]) {
            roomStates[code] = 1;
        }
        // Emit current state to just joined client
        socket.emit('stateChanged', roomStates[code]);
    });

    socket.on('toggleState', (code) => {
        if (roomStates[code] === 1) {
            roomStates[code] = 2;
        } else {
            roomStates[code] = 1;
        }
        // Emit updated state to all clients in the room
        io.to(code).emit('stateChanged', roomStates[code]);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
