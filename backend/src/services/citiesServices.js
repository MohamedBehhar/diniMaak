const db = require('../db/db');

const searchCitieByInitialLetter = async () => {
	try {
		const cities = await db.query('SELECT * FROM cities');
		return cities.rows;
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}

}

module.exports = {
	searchCitieByInitialLetter,
}