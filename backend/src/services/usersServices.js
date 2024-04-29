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

module.exports = {
	getUsers,
	getUsersById,
}