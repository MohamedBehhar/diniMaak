const chatServices = require('../services/chatServices');

const getChats = async (req, res) => {
	const sender_id = parseInt(req.params.sender_id);
	const receiver_id = parseInt(req.params.receiver_id);
	const conversation_id = parseInt(req.params.conversation_id);
	if (!sender_id || !receiver_id || !conversation_id) {
		res.status(400).json({ error: 'Invalid request' });
		return;
	}
	try {
		const chats = await chatServices.getChats(conversation_id, receiver_id, sender_id);
		res.json(chats).status(200);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const getUnreadMessages = async (req, res) => {
	const user_id = parseInt(req.params.user_id);
	if (!user_id) {
		res.status(400).json({ error: 'Invalid request' });
		return;
	}
	try {
		const unreadMessages = await chatServices.getUnreadMessages(user_id);
		res.json(unreadMessages).status(200);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const setMessagesAsRead = async (req, res) => {

	const conversation_id = parseInt(req.params.conversation_id);
	const receiver_id = parseInt(req.params.receiver_id);
	console.log('conversation_id, receiver_id', conversation_id, receiver_id);
	if (!conversation_id || !receiver_id) {
		res.status(400).json({ error: 'Invalid request' });
		return;
	}
	try {
		const updateMessagesStatus = await chatServices.setMessagesAsRead(conversation_id, receiver_id);
		res.json(updateMessagesStatus).status(200);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}



module.exports = {
	getChats,
	getUnreadMessages,
	setMessagesAsRead
};

