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

const getNotificationsByType = async (req, res) => {
	const { user_id, type } = req.params;
	console.log("getNotifications user_id", user_id);
	try {
		const notifications = await notificationsServices.getNotificationsByType(user_id, type);
		res.status(200).json(notifications);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
}

module.exports = {
	getNotifications,
	getNotificationsByType
};