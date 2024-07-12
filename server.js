const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

// Store room states
const roomStates = {};

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'client/build')));

  // The "catchall" handler: for any request that doesn't match the above, send back the React app's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
  });
}

io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join room', (roomCode) => {
    socket.join(roomCode);
    console.log(`A user joined room: ${roomCode}`);
    io.to(roomCode).emit('update client id', socket.id);

    // Create room if not already existed
    if (!roomStates[roomCode]) {
      roomStates[roomCode] = {};
    }

    // Send the current state of the room to the newly joined client
    io.to(socket.id).emit('update mstate', roomStates[roomCode]);
  });

  socket.on('block selected', ({ roomCode, block }) => {
    if (roomStates[roomCode]) {
      roomStates[roomCode][socket.id] = block;
      console.log(`Updated mstate for room ${roomCode}:`, roomStates[roomCode]);
      
      io.to(roomCode).emit('update mstate', roomStates[roomCode]);

      if (roomStates[roomCode].length === 2) {
        io.to(roomCode).emit('start game', roomStates[roomCode]);
      }
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // Handle disconnection logic here, like removing the disconnected client's choice
  });
});


server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
