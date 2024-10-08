const db = require('../db/db');
const { usersMap, sendNotification, sendMessage } = require('../initSocket');

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
		const carpooling = await db.query(`
		SELECT
		 *, 
		 cars.*,
		 users.profile_picture
		FROM 
		carpooling
		INNER JOIN cars
		ON carpooling.car_id = cars.car_id
		INNER JOIN users
		ON carpooling.publisher_id = users.id
		WHERE carpooling.id = $1`, [id]);

		return carpooling.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}



const searchCarpooling = async ({ departure, destination, departure_day, requester_id, number_of_seats }) => {

	try {
		const carpooling = await db.query(`
		SELECT
			carpooling.*,
			cars.*,
			users.username as driver_name,
			users.rating ,
			users.profile_picture
		FROM
			carpooling
		INNER JOIN
			users
		ON
			carpooling.publisher_id = users.id
		INNER JOIN
			cars
		ON
			cars.user_id = users.id
		WHERE
			carpooling.departure = $1
			AND carpooling.destination = $2
			AND carpooling.departure_day >= $3
			AND carpooling.publisher_id != $4
			AND carpooling.available_seats >= $5
			AND carpooling.id NOT IN (
				SELECT
					carpooling_id
				FROM
					booking
				WHERE
					requester_id = $4
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
const createCarpooling = async ({ user_id, departure, destination, departure_time, departure_day, number_of_seats, price, driver_name, car_id }) => {


	try {
		const carpooling = await db.query('INSERT INTO carpooling (publisher_id, departure, destination, departure_day, departure_time, number_of_seats, available_seats,  price, driver_name, car_id) VALUES ( $1, $2, $3, $4, $5 , $6, $7, $8, $9, $10) RETURNING *', [user_id, departure, destination, departure_day, departure_time, number_of_seats, number_of_seats, price, driver_name, car_id]);

		// check if there is a request in reminders table for the same departure and destination and sent a notification to the user
		const reminders = await db.query('SELECT * FROM reminders WHERE departure = $1 AND destination = $2 AND user_id != $3', [departure, destination, user_id ]);
		console.log('reminders====>', reminders.rows);	

		if (reminders.rows.length > 0) {
			const user = await db.query('SELECT * FROM users WHERE id = $1', [user_id]);
			const sender_id = user_id;
			const receiver_id = reminders.rows[0].user_id;
			const sender_name = user.rows[0].username;

			sendNotification(sender_id, receiver_id, `${sender_name} has created a carpooling for ${departure} to ${destination}`, 'carpoolingPublished', carpooling.rows[0].id);

		}

		return carpooling.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const getCarpoolingRequests = async (user_id) => {
	try {
		// get users where the requester_id is the user_id

		const carpoolingRequests = await db.query(`
		SELECT
		booking.*,
		users.username as booker_name ,
		carpooling.*
	FROM
		booking
	INNER JOIN
		users
	ON
		booking.requester_id = users.id
	INNER JOIN
		carpooling
	ON
		booking.carpooling_id = carpooling.id
	WHERE
		carpooling.publisher_id = $1
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
				booking.requester_id = $1
		`, [user_id]);

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
			booking.requester_id = users.id
		INNER JOIN
			carpooling
		ON
			booking.carpooling_id = carpooling.id
		WHERE
			booking.requester_id = $1
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
			available_seats
		FROM
			carpooling
		WHERE
			id = $1
	`, [carpooling_id]);

		return availableSeats.rows[0].available_seats
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const acceptCarpoolingRequest = async ({ requester_id, publisher_id, carpooling_id, requested_seats }) => {

	try {
		const requestInfo = await db.query(`
		UPDATE
			booking
		SET
			status = 'confirmed'
		WHERE
			requester_id = $1
			AND carpooling_id = $2
		RETURNING *
	`, [requester_id, carpooling_id]);

const carpooling = await db.query(`
	UPDATE
		carpooling
	SET
		available_seats = available_seats - $1,
		confirmed_passengers = array_append(confirmed_passengers, $3),
		status = $4
	WHERE
		id = $2
	RETURNING
		*
`, [requested_seats, carpooling_id, requester_id, 'confirmed']);

		const receiver_id = requestInfo.rows[0].requester_id;
		const sender_id = requestInfo.rows[0].publisher_id;
		const sender_name = carpooling.rows[0].driver_name;
		console.log('receiver_id   ===>', requestInfo.rows[0]);

		console.log('sender_name   ===>', sender_name);

		sendNotification(sender_id, receiver_id,
			`${sender_name} has accepted your request`, 'requestAccepted', carpooling_id);

		// insert the booking info into the notifications table
		await db.query(`
		INSERT INTO
			notifications (sender_id, receiver_id, message, notifications_type)
		VALUES
			($1, $2, $3, $4)
	`, [
			sender_id, receiver_id, `${sender_name} has accepted your request`, 'requestAccepted'
		]);


		const conversation = await db.query(`
		INSERT INTO
			conversations (user1_id, user2_id, carpooling_id)
		VALUES
			($1, $2, $3)
		RETURNING *
	`, [sender_id, receiver_id, carpooling_id]);

		//  start a conversation between the two users
		const message = await db.query(`
			INSERT INTO
				messages (sender_id, receiver_id, message, timestamp, conversation_id)
			VALUES
				($1, $2,  $3, $4, $5)
			RETURNING *
		`, [sender_id, receiver_id, 'Hello, I have accepted your request', new Date(), conversation.rows[0].id]);

		// update last message_id in the conversation table
		await db.query(`
		UPDATE
			conversations
		SET
			last_message_id = $1
		WHERE
			id = $2
	`, [message.rows[0].id, conversation.rows[0].id]);

		const userConversations = await db.query(`
		INSERT INTO
			user_conversations (user_id, conversation_id)
		VALUES
			($1, $2)
		RETURNING *
	`, [sender_id, conversation.rows[0].id]);

		const receiverConversations = await db.query(`
		INSERT INTO
			user_conversations (user_id, conversation_id)
		VALUES
			($1, $2)
		RETURNING *
	`, [receiver_id, conversation.rows[0].id]);


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
		requester_id = $1
			AND carpooling_id = $2
		RETURNING *
			`, [requester_id, carpooling_id]);

		return requestInfo.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const getCarpoolingByPublisherId = async (user_id) => {
	try {
		// check if the carpooling has any booking requests

		const carpooling = await db.query(`
		SELECT
			*
		FROM
			carpooling
		WHERE
			publisher_id = $1
			AND status != 'canceled'
		ORDER BY
			departure_day ASC
		`, [user_id]);


		for (let i = 0; i < carpooling.rows.length; i++) {
			const carpooling_id = carpooling.rows[i].id;
			const bookingRequests = await db.query(`
			SELECT
				booking.*,
				users.username,
				users.rating,
				users.profile_picture,
				users.phone_number
			FROM
				booking
			INNER JOIN
				users
			ON
				booking.requester_id = users.id
			WHERE
				carpooling_id = $1
				AND status = 'pending'
			`, [carpooling_id]);

			const acceptedRequests = await db.query(`
			SELECT
				booking.*,
				users.username,
				users.rating,
				users.profile_picture,
				users.phone_number
			FROM
				booking
			INNER JOIN
				users
			ON
				booking.requester_id = users.id
			WHERE
				carpooling_id = $1
				AND status = 'confirmed'
			`, [carpooling_id]);
			carpooling.rows[i].confirmed_requests = acceptedRequests.rows;
			carpooling.rows[i].requests_infos = bookingRequests.rows;
		}

		return carpooling.rows;
	} catch (err) {
		console.error(err);
		throw err;
	}
}

const deleteCarpooling = async (carpooling_id) => {
	try {
		const carpooling = await db.query('UPDATE carpooling SET status = $1 WHERE id = $2 RETURNING *', ['canceled', carpooling_id]);

		// emit a notification to the users that the carpooling has been deleted
		for (let i = 0; i < carpooling.rows[0]?.confirmed_passengers?.length; i++) {
			console.log('carpooling.rows[0].confirmed_passengers[i]', carpooling.rows[0].confirmed_passengers[i]);
			const user_id = carpooling.rows[0].confirmed_passengers[i];
			sendNotification(carpooling.rows[0].publisher_id, user_id, 'The carpooling has been deleted', 'carpoolingDeleted', carpooling_id);
			sendMessage(carpooling.rows[0].publisher_id, user_id, 'The carpooling has been deleted', carpooling_id);
		}

		return carpooling.rows[0];
	} catch (err) {
		console.error(err);
		throw err;
	}
};


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
	getAvailableSeats,
	getCarpoolingByPublisherId,
	deleteCarpooling
}