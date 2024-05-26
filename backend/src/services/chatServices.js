const db = require('../db/db');
const io = require('../initSocket');

const getChats = async (
	sender_id,
	receiver_id,
	carpooling_id
) => {
	try {
		const chats = await db.query(
			`SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1) AND carpooling_id = $3 ORDER BY timestamp ASC`,
			[sender_id, receiver_id, carpooling_id]
		);
		return chats.rows;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

const sendMessage = async (
	sender_id,
	receiver_id,
	message,
	carpooling_id
) => {
	try {
		const newMessage = await db.query(
			`INSERT INTO messages (sender_id, receiver_id, message, timestamp, carpooling_id) VALUES ($1, $2, $3, NOW(), $4) RETURNING *`,
			[sender_id, receiver_id, message, carpooling_id]
		);
		io.getIO().emit('newMessage', { sender_id, receiver_id, message, carpooling_id });
		return newMessage.rows[0];
	} catch (error) {
		console.error(error);
		throw error;
	}
}



module.exports = {
	getChats,
	sendMessage
};