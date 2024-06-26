const db = require('../db/db');
const customError = require('../errors/customErrors');

const setReminder = async ({
    user_id,
    destination,
    departure,
}) => {
    

    try {
        const newReminder = await db.query(
            `INSERT INTO reminders (user_id, destination, departure)
             VALUES ($1, $2, $3)
             ON CONFLICT (user_id, destination, departure) DO NOTHING
             RETURNING *`,
            [user_id, destination, departure]
        );

        // If no rows were inserted, newReminder.rows will be an empty array
        if (newReminder.rows.length === 0) {
            return null; // or you can return a message indicating a duplicate entry
        }

        return newReminder.rows[0];
    } catch (error) {
        throw error;
    }
};


module.exports = {
	setReminder
}