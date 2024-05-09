const db = require('../db/db');

const getCarBrand = async (brand) => {
	try {
		const car = await db.query('SELECT * FROM cars_brands WHERE label ILIKE $1', [`${brand}%`]);
		return car.rows;
	} catch (error) {
		throw error;
	}
}

const addCar = async (car) => {
	try {
		const newCar = await db.query(`
			INSERT INTO cars (brand, model, year, color, user_id)
			VALUES ($1, $2, $3, $4, $5)
			RETURNING *
		`, [car.brand, car.model, car.year, car.color, car.user_id]);

		return newCar.rows[0];
	} catch (error) {
		throw error;
	}
}



module.exports = {
	getCarBrand,
	addCar,
}