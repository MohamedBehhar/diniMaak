const db = require('../db/db');

const getConversations = async (user_id) => {
	try {
		const conversations = await db.query(
			`
			  SELECT 
				user_conversations.*,
				conversations.*,
				carpooling.*,
				messages.message,
				messages.timestamp,
				messages.is_read,
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
		return conversations.rows;

	} catch (error) {
		throw error;
	}
}

const getUnreadLastMessagesCount = async (user_id) => {
	try {
		const unreadMessages = await db.query(
			`
			SELECT
				COUNT(*) as count
			FROM
				conversations
			INNER JOIN
				messages
			ON
				conversations.last_message_id = messages.id
			WHERE
				messages.is_read = false AND
				(
					conversations.user1_id = $1 OR
					conversations.user2_id = $1
				)
				AND messages.sender_id != $1

			`,
			[user_id]
		);
		return unreadMessages.rows[0].count;
	} catch (error) {
		throw error;
	}
}


const getConversationStatus = async (conversation_id) => {
	try {
		const conversationStatus = await db.query(
			`
			SELECT status FROM conversations WHERE id = $1
			`,
			[conversation_id]
		);
		return conversationStatus.rows[0].status;
	} catch (error) {
		throw error;
	}
}



module.exports = {
	getConversations,
	getUnreadLastMessagesCount,
	getConversationStatus
};