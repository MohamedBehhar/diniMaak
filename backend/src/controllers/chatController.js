const chatService = require('../services/chatServices');

const getChats = async (req, res) => {
	const { sender_id, receiver_id } = req.params;
	console.log('req.params', req.params);
	console.log("sender_id", sender_id);
	console.log("receiver_id", receiver_id);
	const chats = await chatService.getChats(sender_id, receiver_id);
	res.json(chats);
}


module.exports = {
	getChats
};

