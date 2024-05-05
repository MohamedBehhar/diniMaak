const db = require('../db/db');

const getNotifications = async (
	user_id
) => {
	console.log("getNotifications user_id22", user_id);

	try {
		const notifications = await db.query(
			`SELECT * FROM notifications WHERE receiver_id = $1`,
			[user_id]
		);
		console.log("notifications", notifications.rows[1]);
		return notifications.rows;
	} catch (error) {
		console.error(error);
		throw error;
	}
};

module.exports = {
	getNotifications,
};