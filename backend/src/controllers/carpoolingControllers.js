const carpoolingServices = require('../services/carpoolingServices');
const usersServices = require('../services/usersServices');

const getCarpooling = async (req, res) => {
	try {
		const carpooling = await carpoolingServices.getCarpooling();
		res.status(200).json(carpooling);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const getCarpoolingById = async (req, res) => {
	try {
		const { id } = req.params;
		const carpooling = await carpoolingServices.getCarpoolingById(id);
		res.status(200).json(carpooling);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const searchCarpooling = async (req, res) => {
	try {
		const { departure, destination, user_id, departure_day, number_of_seats } = req.params;

		console.log("searchCarpooling ccccccc", departure, destination, user_id, departure_day, number_of_seats);

		const carpooling = await carpoolingServices.searchCarpooling({ departure, destination, requester_id: user_id, departure_day, number_of_seats });
		res.status(200).json(carpooling);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}


const createCarpooling = async (req, res) => {
	try {
		const { user_id, departure, destination, departure_time, departure_day, number_of_seats, price } = req.body;
		const driver_name = await usersServices.getUsersById(user_id);

		console.log("createCarpooling", user_id, departure, destination, departure_time, departure_day, number_of_seats, price, driver_name);
		console.log("-- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -");
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
			await carpoolingServices.createCarpooling({ user_id, departure, destination, departure_time, number_of_seats, departure_day, price, driver_name }).then((carpooling) => {
				res.status(201).json(carpooling);
			}
			).catch((error) => {
				console.error(error);
				res.status(500).json({ error: 'Internal Server Error' });
			}
			);
		}
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const getCarpoolingRequests = async (req, res) => {
	try {
		const { user_id } = req.params;
		console.log("getCarpoolingRequests", user_id);
		const carpoolingRequests = await carpoolingServices.getCarpoolingRequests(user_id);
		res.status(200).json(carpoolingRequests);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const getBookedCarpooling = async (req, res) => {
	try {
		const { user_id } = req.params;
		console.log("getBookedCarpooling", user_id);
		const bookedCarpooling = await carpoolingServices.getBookedCarpooling(user_id);
		res.status(200).json(bookedCarpooling);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}



module.exports = {
	getCarpooling,
	getCarpoolingById,
	createCarpooling,
	searchCarpooling,
	getCarpoolingRequests,
	getBookedCarpooling,
}