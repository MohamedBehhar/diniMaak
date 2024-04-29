// bookCarpoolingServices.js
const db = require('../db/db');

const bookCarpooling = async ({ booker_id, carpooling_id, numberOfSeats }) => {
    try {
        console.log('booker_id', booker_id);
        console.log('carpooling_id', carpooling_id);
        console.log('numberOfSeats', numberOfSeats);


        const carpooling = await db.query(`
            SELECT 
                *
            FROM
                carpooling
            WHERE
                id = $1
        `, [carpooling_id]);

        if (carpooling.rows[0].length === 0) {
            throw new Error('Carpooling not found');
        }

        const carpoolingData = carpooling.rows[0];
        const publisher_id = carpoolingData.publisher_id;

        if (publisher_id === booker_id) {
            throw new Error('You cannot book your own carpooling');
        }

        if (carpoolingData.number_of_seats < numberOfSeats) {
            throw new Error('Not enough seats available');
        }

        // check if the user has already booked this carpooling
        const alreadyBooked = await db.query(`
            SELECT
                *
            FROM
                booking
            WHERE
                carpooling_id = $1
                AND booker_id = $2
        `, [carpooling_id, booker_id]);

        if (alreadyBooked.rows.length > 0) {
            throw new Error('You have already booked this carpooling');
        }


        const booking = await db.query(`
            INSERT INTO
                booking (publisher_id, booker_id, carpooling_id, number_of_seats, status)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING
                *
        `, [publisher_id, booker_id, carpooling_id, numberOfSeats, 'pending']);

        const newBooking = booking.rows[0];

        // Emit a socket event to notify the client about the new booking
        io.emit('newBooking', booking.rows[0]);


        return newBooking;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

module.exports = {
    bookCarpooling,
};
