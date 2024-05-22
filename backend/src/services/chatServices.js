const db = require('../db/db');
const io = require('../initSocket');

const getChats = async (
	sender_id,
	receiver_id
) => {
	try {
		const chats = await db.query(
			`SELECT * FROM messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $2 AND receiver_id = $1)`,
			[sender_id, receiver_id]
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
	message
) => {
	try {
		const newMessage = await db.query(
			`INSERT INTO messages (sender_id, receiver_id, message, timestamp) VALUES ($1, $2, $3, NOW()) RETURNING *`,
			[sender_id, receiver_id, message]
		);
		io.getIO().emit('newMessage', { sender_id, receiver_id, message });
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