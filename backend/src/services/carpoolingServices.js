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

const getCarpoolingById = async (id) => {
	try {
		const carpooling = await db.query('SELECT * FROM carpooling WHERE id = $1', [id]);

		return carpooling.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}



const searchCarpooling = async ({ departure, destination, departure_day, requester_id, number_of_seats }) => {
	console.log("searchCarpooling9999 99 9 9 9 9 ", typeof departure_day);
	console.log("searchCarpooling9999 99 9 9 9 9 ", departure_day)
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
			carpooling.publisher_id = users.id
		WHERE
			carpooling.departure = $1
			AND carpooling.destination = $2
			AND carpooling.departure_day >= $3
			AND carpooling.publisher_id != $4
			AND carpooling.number_of_seats >= $5
			AND carpooling.id NOT IN (
				SELECT
					carpooling_id
				FROM
					booking
				WHERE
					booker_id = $4
			)
		ORDER BY
			carpooling.departure_day

	`, [departure, destination, departure_day, requester_id, number_of_seats]);
		return carpooling.rows;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

// check if the user already has a carpooling for the same day
const checkCarpooling = async (user_id, departure_day) => {
	try {
		const carpooling = await db.query('SELECT * FROM carpooling WHERE publisher_id = $1 AND departure_day = $2', [user_id, departure_day]);
		return carpooling.rows;
	} catch (err) {
		console.error(err);
		throw err;
	}
}



// creat a carpooling with user id, departure, destination, date, time, seats, price, and description
const createCarpooling = async ({ user_id, departure, destination, departure_time, departure_day, number_of_seats, price, driver_name }) => {

	try {
		const carpooling = await db.query('INSERT INTO carpooling (publisher_id, departure, destination, departure_day, departure_time, number_of_seats, price, driver_name) VALUES ( $1, $2, $3, $4, $5 , $6, $7, $8) RETURNING *', [user_id, departure, destination, departure_day, departure_time, number_of_seats, price, driver_name]);
		return carpooling.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const getCarpoolingRequests = async (user_id) => {
	try {
		// get users where the booker_id is the user_id

		const carpoolingRequests = await db.query(`
		SELECT
		booking.*,
		users.username as booker_name ,
		carpooling.departure,
		carpooling.destination,
		carpooling.id as carpooling_id
	FROM
		booking
	INNER JOIN
		users
	ON
		booking.booker_id = users.id
	INNER JOIN
		carpooling
	ON
		booking.carpooling_id = carpooling.id
	WHERE
		carpooling.publisher_id = $1
		AND booking.status = 'pending'
		`, [user_id]);



		console.log("carpoolingRequests", carpoolingRequests.rows);
		return carpoolingRequests.rows;

	} catch (err) {
		console.error(err);
		throw err;
	}
}

const getBookedCarpooling = async (user_id) => {
	try {
		const bookedCarpooling = await db.query(`
			SELECT
				booking.*,
				carpooling.*
			FROM
				booking
			INNER JOIN
				carpooling
			ON
				booking.carpooling_id = carpooling.id
			WHERE
				booking.booker_id = $1
		`, [user_id]);

		console.log("----------------------------------------------------bookedCarpooling--------------------------", bookedCarpooling.rows);
		console.log("----------------------------------------------------bookedCarpooling--------------------------");

		return bookedCarpooling.rows;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const getSingleRequestInfo = async (requester_id, carpooling_id) => {
	try {
		const requestInfo = await db.query(`
		SELECT
			booking.*,
			users.username as booker_name,
			users.rating as booker_rating,
			carpooling.departure,
			carpooling.destination,
			carpooling.departure_time,
			carpooling.departure_day,
			carpooling.price,
			carpooling.driver_name
		FROM
			booking
		INNER JOIN
			users
		ON
			booking.booker_id = users.id
		INNER JOIN
			carpooling
		ON
			booking.carpooling_id = carpooling.id
		WHERE
			booking.booker_id = $1
			AND booking.carpooling_id = $2
	`, [requester_id, carpooling_id]);

		return requestInfo.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const getAvailableSeats = async (carpooling_id, number_of_seats) => {
	try {
		const availableSeats = await db.query(`
		SELECT
			number_of_seats
		FROM
			carpooling
		WHERE
			id = $1
	`, [carpooling_id]);

		return availableSeats.rows[0].number_of_seats
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const acceptCarpoolingRequest = async (requester_id, carpooling_id, number_of_seats) => {
	// update the booking status to accepted and decrease the number of seats in the carpooling
	try {
		console.log("acceptCarpoolingRequest", requester_id, carpooling_id, number_of_seats);
		const carpooling = await db.query(`
		UPDATE
			carpooling
		SET
			number_of_seats = number_of_seats - $1
		WHERE
			id = $2
		RETURNING *
	`, [number_of_seats, carpooling_id]);

		console.log("carpooling updated",
			carpooling.rows[0]);


		const requestInfo = await db.query(`
		UPDATE
			booking
		SET
			status = 'accepted'
		WHERE
			booker_id = $1
			AND carpooling_id = $2
		RETURNING *
	`, [requester_id, carpooling_id]);

		return requestInfo.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}


}

const rejectCarpoolingRequest = async (requester_id, carpooling_id, number_of_seats) => {
	try {
		const requestInfo = await db.query(`
		UPDATE
			booking
		SET
			status = 'rejected'
		WHERE
			booker_id = $1
			AND carpooling_id = $2
		RETURNING *
	`, [requester_id, carpooling_id]);

		return requestInfo.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}

module.exports = {
	getCarpooling,
	getCarpoolingById,
	createCarpooling,
	searchCarpooling,
	checkCarpooling,
	getCarpoolingRequests,
	getBookedCarpooling,
	getSingleRequestInfo,
	acceptCarpoolingRequest,
	rejectCarpoolingRequest,
	getAvailableSeats
}