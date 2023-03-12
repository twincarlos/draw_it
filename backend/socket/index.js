const app = require('../app');
const { origin } = require('../config');

const http = require('http');
const server = http.createServer(app);

const { Server } = require('socket.io');

const io = new Server(server, {
    cors: {
        origin: origin,
        // origin: environment === 'development' ? '*' : origin
        methods: ['GET', 'POST'],
    },
});

app.set('socketio', io);

const onConnection = (socket) => {
    socket.on('game-update', gameId => {
        io.emit('game-update', gameId);
    });
};

module.exports = { server, io, onConnection };