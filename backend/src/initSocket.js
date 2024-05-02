
const { Server } = require("socket.io");
const usersMap = new Map();



function initializeSocket(server) {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });


    io.on('connection', (socket) => {
        console.log('**************** a user connected ****************');
        socket.emit('connection', null);
        socket.on('join', (user_id) => {
            usersMap.set(user_id + '', socket.id);
        });
        socket.on('disconnect', () => {
            console.log('**************** user disconnected ****************');
            for (let [key, value] of usersMap) {
                if (value === socket.id) {
                    usersMap.delete(key);
                }
            }
        });

    });

    return io;
}

function sendNotification(user_id, event, paylod) {
    console.log('**************** usersMap ****************', usersMap);
    console.log('**************** user_id ****************', user_id);
    console.log('**************** event ****************', event);
    console.log('**************** paylod ****************', paylod);
    const socket_id = usersMap.get(user_id + '');
    if (socket_id) {
        io.to(socket_id).emit(event, paylod);
    }
    else {
        console.log('**************** user not found ****************');
    }
}

module.exports = {
    initializeSocket,
    sendNotification,
    usersMap
}
