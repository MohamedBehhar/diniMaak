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

const searchCarpoolingWithoutDepartureDay = async ({ departure, destination, user_id }) => {
	console.log("searchCarpoolingWithoutDepartureDay", departure, destination, user_id);
	try {
		// write a query to get all carpooling with the same departure and destination but not the same user_id
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
			AND carpooling.user_id != $3
	`, [departure, destination, user_id]);
		return carpooling.rows;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const searchCarpooling = async ({ departure, destination, departure_day }) => {
	console.log("searchCarpooling", departure, destination, departure_day);
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

// check if the user already has a carpooling for the same day
const checkCarpooling = async (user_id, departure_day) => {
	try {
		const carpooling = await db.query('SELECT * FROM carpooling WHERE user_id = $1 AND departure_day = $2', [user_id, departure_day]);
		return carpooling.rows;
	} catch (err) {
		console.error(err);
		throw err;
	}
}



// creat a carpooling with user id, departure, destination, date, time, seats, price, and description
const createCarpooling = async ({ user_id, departure, destination, departure_time, departure_day, number_of_seats }) => {

	try {
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
	searchCarpooling,
	checkCarpooling,
	searchCarpoolingWithoutDepartureDay
}