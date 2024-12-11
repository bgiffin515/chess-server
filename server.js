const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Initial game state
let gameState = {
    board: [
        ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
        ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
        ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
    ],
    turn: "white"
};

// Handle client connections
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Log and emit the initial game state
    console.log('Sending initial game state:', JSON.stringify(gameState, null, 2));
    socket.emit('gameState', gameState);

    // Handle move events
    socket.on('move', (data) => {
        console.log('Received move:', JSON.stringify(data, null, 2));

        // Update the game state and log it
        gameState = data;
        console.log('Updated game state:', JSON.stringify(gameState, null, 2));

        // Broadcast the updated game state to all clients
        io.emit('gameState', gameState);
    });

    // Handle client disconnection
    socket.on('disconnect', () => {
        console.log(`A user disconnected: ${socket.id}`);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
