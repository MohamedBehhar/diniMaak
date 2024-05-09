const carServices = require('../services/carServices');

const getCarBrand = async (req, res) => {
	try {
		const brand = req.params.brand;
		const result = await carServices.getCarBrand(brand);
		res.status(200).send(result);
	} catch (error) {
		res.status(500
		).send(error.message);
	}
}

const addCar = async (req, res) => {
	try {
		const car = req.body;
		const result = await carServices.addCar(car);
		res.status(201).send(result);
	} catch (error) {
		res
			.status(500)
			.send(error.message);
	}
}

module.exports = {
	getCarBrand,
	addCar,
}