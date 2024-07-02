const db = require('../db/db');

const getNotifications = async (
	user_id
) => {

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

	try {
		let requestsCount = await db.query(
			`SELECT COUNT(*) FROM notifications WHERE receiver_id = $1 AND notifications_type = 'newBookingRequest' AND is_read = false`,
			[user_id]
		);
		let reservationsCount = await db.query(
			`SELECT COUNT(*) FROM notifications WHERE receiver_id = $1 AND notifications_type = 'requestAccepted' AND is_read = false`,
			[user_id]
		);
		let carpoolingPublishedCount = await db.query(
			`SELECT COUNT(*) FROM notifications WHERE receiver_id = $1 AND notifications_type = 'carpoolingPublished' AND is_read = false`,
			[user_id]
		);

		requestsCount = parseInt(requestsCount.rows[0].count);
		reservationsCount = parseInt(reservationsCount.rows[0].count);
		carpoolingPublishedCount = parseInt(carpoolingPublishedCount.rows[0].count);
		const total = requestsCount + reservationsCount + carpoolingPublishedCount;

		return {
			total,
			requestsCount,
			reservationsCount,
			carpoolingPublishedCount
		};

	} catch (error) {
		throw error;
	}
}

const changeNotificationStatus = async (
	receiver_id
) => {
	try {
		const notification = await db.query(
			`UPDATE notifications SET is_read = true WHERE receiver_id = $1 RETURNING *`,
			[receiver_id]
		);
		return notification.rows[0];
	} catch (error) {
		throw error;
	}
}
module.exports = {
	getNotifications,
	getNotificationsCount,
	changeNotificationStatus
};