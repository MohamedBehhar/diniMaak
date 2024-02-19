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

module.exports = {
	getUsers,
}