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

const searchCarpooling = async ({ departure, destination, departure_day }) => {
	console.log("info", departure, destination, departure_day);
	try {
		const carpooling = await db.query(`
		SELECT 
			carpooling.*, 
			users.username as driver_name
		FROM 
			carpooling 
		INNER JOIN 
			users 
		ON 
			carpooling.user_id = users.id 
		WHERE 
			carpooling.departure = $1 
			AND carpooling.destination = $2 
			AND carpooling.departure_day = $3
	`, [departure, destination, departure_day]);
		return carpooling.rows;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

// creat a carpooling with user id, departure, destination, date, time, seats, price, and description
const createCarpooling = async ({ user_id, departure, destination, departure_time, departure_day, number_of_seats }) => {

	try {
		console.log("departure_time", departure_time);
		console.log("departure_day", departure_day);

		const carpooling = await db.query('INSERT INTO carpooling (user_id, departure, destination, departure_day, departure_time, number_of_seats) VALUES ( $1, $2, $3, $4, $5 , $6) RETURNING *', [user_id, departure, destination, departure_day, departure_time, number_of_seats]);
		return carpooling.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}

module.exports = {
	getCarpooling,
	createCarpooling,
	searchCarpooling
}