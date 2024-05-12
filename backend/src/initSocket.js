
const { Server } = require("socket.io");
const usersMap = new Map();
const db = require('./db/db');


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
            console.log('**************** user disconnected ****************',
                socket.id,);
            for (let [key, value] of usersMap) {
                if (value === socket.id) {
                    usersMap.delete(key);
                }
            }
        });

    });

    return io;
}

async function sendNotification(sender_id, receiver_id, message, type) {
    const receiverSocketId = usersMap.get(receiver_id + '');
    console.log('receiverSocketId', receiverSocketId);
    console.log('sender_idtype ; ; ', type);

    if (receiverSocketId) {
        io.to(receiverSocketId).emit(
            type, { message, sender_id }
        );

        const notification = await db.query(`
            SELECT
                *
            FROM
                notifications
            WHERE
                sender_id = $1 AND receiver_id = $2 AND message = $3 AND notifications_type = $4
        `, [sender_id, receiver_id, message, type]);

        console.log('notification', notification);

        if (notification.rows.length > 0) {
            return;
        }

        db.query(`
            INSERT INTO
                notifications (sender_id, receiver_id, message, notifications_type)
            VALUES
                ($1, $2, $3, $4)
        `, [sender_id, receiver_id, message, type]);
    } else {
        console.log('receiver is offline');
    }

}

module.exports = {
    initializeSocket,
    sendNotification,
    usersMap
}
