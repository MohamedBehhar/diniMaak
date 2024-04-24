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
		const { departure, destination, user_id } = req.params;
		console.log("searchCarpooling", departure, destination, user_id);
		const departure_day = req.params.departure_day || '';
		if (!departure || !destination) {
			return res.status(400).json({ error: 'Missing required fields: departure, destination' });
		}
		let carpooling = [];
		if (!departure_day) {
			carpooling = await carpoolingServices.searchCarpoolingWithoutDepartureDay({ departure, destination, user_id });

		} else {
			carpooling = await carpoolingServices.searchCarpooling({ departure, destination, user_id, departure_day });

		}
		res.status(200).json(carpooling);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}


const createCarpooling = async (req, res) => {
	try {
		const { user_id, departure, destination, departure_time, departure_day, number_of_seats } = req.body;
		const duplicateCarpooling = await carpoolingServices.checkCarpooling(user_id, departure_day);
		console.log("duplicateCarpooling", duplicateCarpooling);
		if (!user_id || !departure || !destination || !departure_time || !number_of_seats || !departure_day) {
			res.status(400).json({ error: 'Missing required fields: user_id, departure, destination, date, time, seats, price, description' });
		} else if (number_of_seats < 1 || number_of_seats > 4) {
			res.status(400).json({
				error: {
					key: 'number_of_seats',
					message: 'Number of seats must be greater than 0 and less than 5'
				}
			});
		} else if (departure === destination) {
			res.status(400).json({
				error: {
					key: 'destination',
					message: 'Destination must be different from departure'
				}
			});
		} else if (duplicateCarpooling.length > 0) {
			res.status(400).json({
				error: {
					key: 'carpooling',
					message: 'You already have a carpooling for the same day'
				}
			});
		} else {
			const carpooling = await carpoolingServices.createCarpooling({ user_id, departure, destination, departure_time, number_of_seats, departure_day });
			res.status(201).json('Carpooling created successfully');
		}
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