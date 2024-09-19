const conversationsServices = require('../services/conversationsServices');


const getConversations = async (req, res) => {
	try {
		const conversations = await conversationsServices.getConversations(req.params.user_id);
		res.status(200).json(conversations);
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const getUnreadLastMessagesCount = async (req, res) => {
	try {
		const unreadMessages = await conversationsServices.getUnreadLastMessagesCount(req.params.user_id);
		res.status(200).json(unreadMessages);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const getConversationStatus = async (req, res) => {
	if (!req.params.conversation_id) {
		res.status(400).json({ error: 'Bad Request' });
		return;
	}
	try {
		const conversationStatus = await conversationsServices.getConversationStatus(req.params.conversation_id);
		res.status(200).json(conversationStatus);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

module.exports = {
	getConversations,
	getUnreadLastMessagesCount,
	getConversationStatus
};