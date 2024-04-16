const db = require('../db/db');

const getCarpooling = async () => {
	try {
		const carpooling = await db.query('SELECT * FROM carpooling');
		return carpooling.rows;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

// creat a carpooling with user id, departure, destination, date, time, seats, price, and description
const createCarpooling = async ({ user_id, departure, destination, date, time, seats, price, description }) => {
	try {
		const carpooling = await db.query('INSERT INTO carpooling (user_id, departure, destination, date, time, seats, price, description) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [user_id, departure, destination, date, time, seats, price, description]);
		return carpooling.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}

module.exports = {
	getCarpooling,
	createCarpooling,
}