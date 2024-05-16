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

const getNotificationsCount = async (
	user_id
) => {
	console.log("getNotifications user_id22", user_id);

	try {
		let requestsCount = await db.query(
			`SELECT COUNT(*) FROM notifications WHERE receiver_id = $1 AND notifications_type = 'newBookingRequest' AND notification_status = 'unread'`,
			[user_id]
		);
		let reservationsCount = await db.query(
			`SELECT COUNT(*) FROM notifications WHERE receiver_id = $1 AND notifications_type = 'requestAccepted' AND notification_status = 'unread'`,
			[user_id]
		);

		requestsCount = parseInt(requestsCount.rows[0].count);
		reservationsCount = parseInt(reservationsCount.rows[0].count);
		const total = requestsCount + reservationsCount;

		return {
			total,
			requestsCount,
			reservationsCount
		};

	} catch (error) {
		throw error;
	}
}

module.exports = {
	getNotifications,
	getNotificationsCount
};