const { Pool } = require('pg');

// Create a PostgreSQL connection pool
const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_NAME,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,

});


// Test the database connection
pool.query('SELECT NOW()', (err, result) => {
	if (err) {
		console.error('Error connecting to the database:', err);
	} else {
		console.log('Connected to the database at:', result.rows[0].now);
	}
});


module.exports = {
	query: (text, params) => pool.query(text, params)
};