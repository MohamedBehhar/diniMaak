const db = require('../db/db');
const io = require('../initSocket');

const getChats = async (
	conversation_id,
	receiver_id,
	sender_id
) => {
	console.log('conversation_id', conversation_id);
	console.log('receiver_id', receiver_id);
	try {
		const chats = await db.query(
			`SELECT * FROM messages WHERE conversation_id = $1 ORDER BY timestamp ASC`,
			[conversation_id]
		);
		const updateMessagesStatus = await db.query(
			`UPDATE messages SET is_read = true WHERE conversation_id = $1 AND receiver_id = $2`,
			[conversation_id, sender_id]
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

const getUnreadMessages = async (user_id) => {
	try {
		const unreadMessages = await db.query(
			`SELECT * FROM messages WHERE receiver_id = $1 AND is_read = false`,
			[user_id]
		);
		return unreadMessages.rows;
	} catch (error) {
		console.error(error);
		throw error;
	}
}

const setMessagesAsRead = async (conversation_id, receiver_id) => {
	try {
		const updateMessagesStatus = await db.query(
			`UPDATE messages SET is_read = true WHERE conversation_id = $1 AND receiver_id = $2`,
			[conversation_id, receiver_id]
		);
		// emit event to update unread messages count in frontend for the user who sent the message to the receiver "newMsg" event
		io.getIO().emit('updateMsgCount', { conversation_id, receiver_id });

		return updateMessagesStatus.rows;
	} catch (error) {
		console.error(error);
		throw error;
	}
}



module.exports = {
	getChats,
	sendMessage,
	getUnreadMessages,
	setMessagesAsRead
};