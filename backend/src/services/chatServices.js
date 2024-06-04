const db = require('../db/db');
const io = require('../initSocket');

const getChats = async (
	conversation_id
) => {
	try {
		const chats = await db.query(
			`SELECT * FROM messages WHERE conversation_id = $1 ORDER BY timestamp ASC`,
			[conversation_id]
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