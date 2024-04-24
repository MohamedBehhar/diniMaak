const db = require('../db');

const bookCarpooling = async ({ user_id, carpooling_id, numberOfSeats }) => {
	try {
		const carpooling = await db.query(`
		SELECT 
			*
		FROM
			carpooling
		WHERE
			id = $1
	`, [carpooling_id]);
		if (carpooling.rows.length === 0) {
			throw new Error('Carpooling not found');
		}
		const carpoolingData = carpooling.rows[0];
		if (carpoolingData.user_id === user_id) {
			throw new Error('You cannot book your own carpooling');
		}
		if (carpoolingData.number_of_seats < numberOfSeats) {
			throw new Error('Not enough seats available');
		}
		const booking = await db.query(`
		INSERT INTO
			bookings (user_id, carpooling_id, number_of_seats)
		VALUES
			($1, $2, $3)
		RETURNING
			*
	`, [user_id, carpooling_id, numberOfSeats]);
		return booking.rows[0];
		
	}
	catch (error) {
		console.error(error);
		throw error;
	}
}