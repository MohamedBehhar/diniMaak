const db = require('../db/db');

const searchCitieByInitialLetter = async (letters) => {
	try {
		console.log("5555555  ",letters);
		const cities = await db.query('SELECT * FROM cities WHERE name LIKE $1', [letters + '%']);
		console.log("cities ", cities.rows);
		return cities.rows;
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}

}

module.exports = {
	searchCitieByInitialLetter,
}