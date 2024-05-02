// bookCarpoolingServices.js
const db = require('../db/db');

const bookCarpooling = async ({ requester_id, carpooling_id, numberOfSeats }) => {
    try {
        console.log('requester_id', requester_id);
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

        if (publisher_id === requester_id) {
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
                AND requester_id = $2
        `, [carpooling_id, requester_id]);

        if (alreadyBooked.rows.length > 0) {
            throw new Error('You have already booked this carpooling');
        }


        const booking = await db.query(`
            INSERT INTO
                booking (publisher_id, requester_id, carpooling_id, requested_seats, status)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING
                *
        `, [publisher_id, requester_id, carpooling_id, numberOfSeats, 'pending']);

        const newBooking = booking.rows[0];

        // Emit a socket event to notify the client about the new booking
        io.emit('newBooking', booking.rows[0]);


        return newBooking;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


const bookerConfirmRequest = async (
    { carpooling_id, requester_id, booking_id }
) => {
    try {
        const booking = await db.query(`
            UPDATE
                booking
            SET
                status = 'confirmed'
            WHERE
                id = $1
            RETURNING
                *
        `, [booking_id]);
    
        const carpooling = await db.query(`
            UPDATE
                carpooling
            SET
                available_seats -= $1
            WHERE
                id = $2
            RETURNING
                *
        `, [booking.rows[0].requested_seats, carpooling_id]);





        // Emit a socket event to notify the client about the confirmation
        io.emit('bookingConfirmed', booking.rows[0]);

        return booking.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const bookerCancelRequest = async (booking_id) => {
    try {
        const booking = await db.query(`
            UPDATE
                booking
            SET
                status = 'cancelled'
            WHERE
                id = $1
            RETURNING
                *
        `, [booking_id]);

        // Emit a socket event to notify the client about the cancellation
        io.emit('bookingCancelled', booking.rows[0]);

        return booking.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}



module.exports = {
    bookCarpooling,
    bookerConfirmRequest,
    bookerCancelRequest
};
