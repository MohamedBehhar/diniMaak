const db = require('../db/db');




const getUsers = async () => {
	try {
		const users = await db.query('SELECT * FROM users');
		return users.rows;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const getUsersById = async (id) => {
	try {
		const user = await db.query('SELECT * FROM users WHERE id = $1', [id]);
		return user.rows[0].username;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const getUserInfo = async (user_id) => {
	try {
		// exclude password refresh_token from the response
		const user = await db.query('SELECT id, username,phone_number, email, profile_picture FROM users WHERE id = $1', [user_id]);

		return user.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const updateUserInfo = async (user) => {
	console.log('user55: ', user);
	try {
		const updatedUser = await db.query(
			'UPDATE users SET username = $1, phone_number = $2, email = $3, profile_picture = $4 WHERE id = $5 RETURNING *',
			[user.username, user.phone_number, user.email, user.profile_picture, user.id]
		);
		console.log('updatedUser : ', updatedUser.rows[0]);
		return updatedUser.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}


module.exports = {
	getUsers,
	getUsersById,
	getUserInfo,
	updateUserInfo
}