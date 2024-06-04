const db = require('../db/db');

const getConversations = async (user_id) => {
	try {
		// const conversations = await db.query(`
		// 	SELECT DISTINCT ON (messages.receiver_id)
		// 		messages.id,
		// 		messages.sender_id,
		// 		messages.receiver_id,
		// 		messages.message,
		// 		messages.timestamp,
		// 		users.username as receiver_name,
		// 		users.profile_picture as receiver_profile_picture
		// 	FROM
		// 		messages
		// 	INNER JOIN
		// 		users
		// 	ON
		// 		messages.receiver_id = users.id
		// 	WHERE
		// 		messages.receiver_id = $1 OR messages.sender_id = $1
		// 	ORDER BY
		// 		messages.receiver_id,
		// 		messages.timestamp DESC
		// `, [user_id]);

		const conversations = await db.query(
			`
			  SELECT 
				user_conversations.*,
				conversations.*,
				carpooling.*,
				messages.message,
				CASE 
				  WHEN conversations.user1_id = $1 THEN u2.id
				  ELSE u1.id
				END AS receiver_id,
				CASE 
				  WHEN conversations.user1_id = $1 THEN u2.username
				  ELSE u1.username
				END AS receiver_name,
				CASE
				  WHEN conversations.user1_id = $1 THEN u2.profile_picture
				  ELSE u1.profile_picture
				END AS receiver_profile_picture
			  FROM
				user_conversations
			  INNER JOIN
				conversations
			  ON
				user_conversations.conversation_id = conversations.id
			  INNER JOIN
				users AS u1
			  ON
				conversations.user1_id = u1.id
			  INNER JOIN
				users AS u2
			  ON
				conversations.user2_id = u2.id
			  LEFT JOIN
				carpooling
			  ON
				conversations.carpooling_id = carpooling.id
			  LEFT JOIN
				messages
			  ON
				conversations.last_message_id = messages.id
			  WHERE
				user_conversations.user_id = $1
			`,
			[user_id]
		  );
		  

		console.log('conversations', conversations.rows);
		return conversations.rows;

	} catch (error) {
		throw error;
	}
}


module.exports = {
	getConversations
};