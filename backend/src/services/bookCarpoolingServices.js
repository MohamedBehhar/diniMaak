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

        if (carpooling.rows.length === 0) {
            throw new Error('Carpooling not found');
        }

        const carpoolingData = carpooling.rows[0];
        const user_id = carpoolingData.user_id;

        if (user_id === booker_id) {
            throw new Error('You cannot book your own carpooling');
        }

        if (carpoolingData.number_of_seats < numberOfSeats) {
            throw new Error('Not enough seats available');
        }



        const booking = await db.query(`
            INSERT INTO
                booking (user_id, booker_id, carpooling_id, number_of_seats, status)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING
                *
        `, [user_id, booker_id, carpooling_id, numberOfSeats, 'pending']);

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
