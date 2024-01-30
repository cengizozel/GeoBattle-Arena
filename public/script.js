const socket = io();
const canvas = document.getElementById('gameCanvas');
const joinRoomBtn = document.getElementById('joinRoom');
const roomCodeInput = document.getElementById('roomCode');
const roomDisplay = document.getElementById('roomDisplay');
const roomState = document.getElementById('roomState');
const toggleStateBtn = document.getElementById('toggleState');

joinRoomBtn.addEventListener('click', function() {
    const roomCode = roomCodeInput.value;
    if(roomCode) {
        socket.emit('joinRoom', roomCode);
        roomDisplay.style.display = 'block'; // Show the room display
    }
});

socket.on('roomJoined', (code) => {
    console.log(`Joined room ${code}`);
    canvas.style.display = 'none'; // Optional: hide or remove canvas
});

socket.on('stateChanged', (state) => {
    roomState.textContent = state;
});

toggleStateBtn.addEventListener('click', () => {
    const roomCode = roomCodeInput.value;
    if (roomCode) {
        socket.emit('toggleState', roomCode);
    }
});
