const notificationsServices = require('../services/notificationsServices');

const getNotifications = async (req, res) => {
	const { user_id } = req.params;
	console.log("getNotifications user_id", user_id);
	try {
		const notifications = await notificationsServices.getNotifications(user_id);
		res.status(200).json(notifications);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
}

const getNotificationsCount = async (req, res) => {
	const { user_id } = req.params;
	try {
		const notificationsCount = await notificationsServices.getNotificationsCount(user_id);
		res.status(200).json(notificationsCount);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
}


module.exports = {
	getNotifications,
	getNotificationsCount
};