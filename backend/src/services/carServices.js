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
		console.log('car: ', car);
		const newCar = await db.query(
			'INSERT INTO cars (user_id, brand, year, plate, image) VALUES ($1, $2, $3, $4, $5) RETURNING *',
			[car.user_id, car.brand, car.year, car.plate, car.image]
		);
		return newCar.rows[0];
	} catch (error) {
		throw error;
	}
}


const getCarByUserId = async (user_id) => {
	console.log('user_id90909090: ', user_id);
	try {
		const car = await db.query('SELECT * FROM cars WHERE user_id = $1', [user_id]);
		return car.rows;
	} catch (error) {
		throw error;
	}
}

const test = async (req, res) => {
	try {
		res.status(200).send('test');
	} catch (error) {
		res.status(500).send(error.message);
	}
}

module.exports = {
	getCarBrand,
	addCar,
	getCarByUserId,
	test
}