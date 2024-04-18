const carpoolingServices = require('../services/carpoolingServices');

const getCarpooling = async (req, res) => {
	try {
		const carpooling = await carpoolingServices.getCarpooling();
		res.status(200).json(carpooling);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const createCarpooling = async (req, res) => {
	try {
		const { user_id, departure, destination, date, time, seats, price, description } = req.body;
		if (!user_id || !departure || !destination || !date || !time || !seats || !price || !description) {
			return res.status(400).json({ error: 'Missing required fields: user_id, departure, destination, date, time, seats, price, description' });
		}
		const carpooling = await carpoolingServices.createCarpooling({ user_id, departure, destination, date, time, seats, price, description });
		res.status(201).json(carpooling);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

module.exports = {
	getCarpooling,
	createCarpooling
}