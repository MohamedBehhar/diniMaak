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

const searchCarpooling = async (req, res) => {
	try {
		const { departure, destination, departure_day } = req.params;
		console.log("info", departure, destination, departure_day);
		if (!departure || !destination || !departure_day) {
			return res.status(400).json({ error: 'Missing required fields: departure, destination, departure_day' });
		}
		const carpooling = await carpoolingServices.searchCarpooling({ departure, destination, departure_day });
		res.status(200).json(carpooling);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const createCarpooling = async (req, res) => {
	try {
		const { user_id, departure, destination, departure_time, departure_day, number_of_seats } = req.body;
		if (!user_id || !departure || !destination || !departure_time || !number_of_seats || !departure_day) {
			return res.status(400).json({ error: 'Missing required fields: user_id, departure, destination, date, time, seats, price, description' });
		}
		const carpooling = await carpoolingServices.createCarpooling({ user_id, departure, destination, departure_time, number_of_seats, departure_day });
		res.status(201).json(carpooling);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

module.exports = {
	getCarpooling,
	createCarpooling,
	searchCarpooling
}