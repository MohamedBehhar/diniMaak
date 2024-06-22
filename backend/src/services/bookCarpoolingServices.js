// bookCarpoolingServices.js
const db = require('../db/db');
const { sendNotification } = require('../initSocket');
io = require('../initSocket');
const CustomError = require('../errors/customErrors');

const bookCarpooling = async ({ requester_id, carpooling_id, requested_seats }) => {
    try {
        const carpooling = await db.query(`
            SELECT 
                *
            FROM
                carpooling
            WHERE
                id = $1
        `, [carpooling_id]);

        if (carpooling.rows[0].length === 0)
            throw new CustomError('Carpooling not found', 404);


        if (carpooling.rows[0].publisher_id == requester_id)
            throw new CustomError('You cannot book your own carpooling', 400);


        const carpoolingData = carpooling.rows[0];
        const publisher_id = carpoolingData.publisher_id;


        if (carpoolingData.number_of_seats < requested_seats) {
            throw new CustomError('The number of requested seats is greater than the available seats', 400);
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
            throw new CustomError('You have already booked this carpooling', 400);
        }


        const booking = await db.query(`
            INSERT INTO
                booking (publisher_id, requester_id, carpooling_id, requested_seats, status)
            VALUES
                ($1, $2, $3, $4, $5)
            RETURNING
                *
        `, [publisher_id, requester_id, carpooling_id, requested_seats, 'pending']);

        const carpoolingUpdate = await db.query(`
            UPDATE
                carpooling
            SET
            booking_requests_ids = array_append(booking_requests_ids, $1)
            WHERE
                id = $2
            RETURNING
                *
        `, [booking.rows[0].booking_id, carpooling_id]);


        const newBooking = booking.rows[0];

        // Emit a socket event to notify the client about the new booking
        const requesterName = await db.query(`
            SELECT
                username
            FROM
                users
            WHERE
                id = $1
        `, [requester_id]);

        console.log('requesterName', requesterName.rows[0].username);

        sendNotification(requester_id, publisher_id, `You have a new booking request from ${requesterName.rows[0].username}`, 'newBookingRequest', carpooling_id);


        return newBooking;
    } catch (error) {
        console.error(error);
        throw error;
    }
};


const confirmBookingRequest = async (
    { carpooling_id, requester_id, booking_id, requested_seats }
) => {
    try {
        console.log('carpooling_id---------------------------------------\n', carpooling_id,
            'requester_id', requester_id,
            'booking_id', booking_id,
            'requested_seats', requested_seats
        );
        const booking = await db.query(`
            UPDATE
                booking
            SET
                status = 'confirmed'
            WHERE
                booking_id = $1
            RETURNING
                *
        `, [booking_id]);


        const carpooling = await db.query(`
            UPDATE
                carpooling
            SET
                available_seats = available_seats - $1,
                confirmed_passengers = array_append(confirmed_passengers, $3)
            WHERE
                id = $2
            RETURNING
                *
        `, [requested_seats, carpooling_id, requester_id]);


        // Emit a socket event to notify the client about the confirmation
        sendNotification(requester_id, booking.rows[0].publisher_id, 'Your booking has been confirmed', 'bookingConfirmed', carpooling_id);

        return booking.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const cancelBookingRequest = async (booking_id) => {
    try {
        const booking = await db.query(`
            UPDATE
                booking
            SET
                status = 'canceled'
            WHERE
                booking_id = $1
            RETURNING
                *
        `, [booking_id]);

        // Emit a socket event to notify the client about the cancellation
        io.emit('bookingCanceled', booking.rows[0]);

        return booking.rows[0];
    } catch (error) {
        console.error(error);
        throw error;
    }
}



module.exports = {
    bookCarpooling,
    confirmBookingRequest,
    cancelBookingRequest,
};
