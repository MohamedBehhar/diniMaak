
const { Server } = require("socket.io");

function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('**************** a user connected ****************');
        socket.emit('new', 'hello from server');
        socket.on('test', (msg) => {
            console.log('**************** user disconnected ****************' + msg);
        });
    });

    return io;
}

module.exports = initializeSocket;
