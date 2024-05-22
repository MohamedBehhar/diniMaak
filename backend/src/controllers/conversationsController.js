const conversationsServices = require('../services/conversationsServices');


const getConversations = async (req, res) => {
	try {
		const conversations = await conversationsServices.getConversations(req.params.user_id);
		console.log('conversations', conversations);
		res.status(200).json(conversations);
	}
	catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

module.exports = {
	getConversations
};