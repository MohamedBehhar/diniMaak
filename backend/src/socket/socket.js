const { Server } = require('socket.io');
const http = require('http');

const initSocket = (server) => {
    const io = new Server(server);

    io.on('connection', (socket) => {
        console.log('a user connected');
    });

    return io;
};

module.exports = initSocket;
