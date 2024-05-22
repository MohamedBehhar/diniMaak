const db = require('../db/db');

const getConversations = async (user_id) => {
	try {
		const conversations = await db.query(`
			SELECT DISTINCT ON (messages.receiver_id)
				messages.id,
				messages.sender_id,
				messages.receiver_id,
				messages.message,
				messages.timestamp,
				users.username as receiver_name,
				users.profile_picture as receiver_profile_picture
			FROM
				messages
			INNER JOIN
				users
			ON
				messages.receiver_id = users.id
			WHERE
				messages.receiver_id = $1 OR messages.sender_id = $1
			ORDER BY
				messages.receiver_id,
				messages.timestamp DESC
		`, [user_id]);
		return conversations.rows;
	} catch (error) {
		throw error;
	}
}


module.exports = {
	getConversations
};