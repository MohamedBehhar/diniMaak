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

const editCar = async (car) => {
	console.log('edit car: ', car);
	try {
		const updatedCar = await db.query(
			'UPDATE cars SET brand = $1, year = $2, plate = $3, image = $4 WHERE car_id = $5 RETURNING *',
			[car.brand, car.year, car.plate, car.image, car.car_id]
		);
		return updatedCar.rows[0];
	} catch (error) {
		throw error;
	}
}


const getCarByUserId = async (user_id) => {
	try {
		const car = await db.query('SELECT * FROM cars WHERE user_id = $1', [user_id]);
		return car.rows[0];
	} catch (error) {
		throw error;
	}
}



module.exports = {
	getCarBrand,
	addCar,
	getCarByUserId,
	editCar
}