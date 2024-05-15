const db = require('../db/db');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, '../images'));
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname);
	}
});

const upload = multer({ storage: storage });


const getCarBrand = async (brand) => {
	try {
		const car = await db.query('SELECT * FROM cars_brands WHERE label ILIKE $1', [`${brand}%`]);
		return car.rows;
	} catch (error) {
		throw error;
	}
}

// CREATE TABLE IF NOT EXISTS cars (
//     car_id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL,
//     brand VARCHAR (50) NOT NULL,
//     year INT NOT NULL,
//     plate VARCHAR (50),
//     image VARCHAR (250),
//     FOREIGN KEY (user_id) REFERENCES users (id)
// );

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



module.exports = {
	getCarBrand,
	addCar,
}