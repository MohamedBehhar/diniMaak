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

		const duplicateCarpooling = await carpoolingServices.checkCarpooling(user_id, departure_day);
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
		const bookedCarpooling = await carpoolingServices.getBookedCarpooling(user_id);
		res.status(200).json(bookedCarpooling);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const getSingleRequestInfo = async (req, res) => {
	try {
		const { requester_id, carpooling_id } = req.params;
		const requestInfo = await carpoolingServices.getSingleRequestInfo(requester_id, carpooling_id);
		res.status(200).json(requestInfo);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const acceptCarpoolingRequest = async (req, res) => {
	try {
		const { carpooling_id, requester_id, publisher_id, requested_seats } = req.body;
		console.log("+ + + + + + + + + + + + + + + ");
		console.log("carpooling_id", carpooling_id);
		console.log("requester_id", requester_id);
		console.log("requested_seats", requested_seats);
		console.log("publisher_id", publisher_id);
		console.log("+ + + + + + + + + + + + + + + ");

		const availableSeats = await carpoolingServices.getAvailableSeats(carpooling_id);

		if (availableSeats === 0) {
			res.status(400).json({ error: 'Not enough available seats' });
			return;
		}

		await carpoolingServices.acceptCarpoolingRequest(
			req.body
		);
		res.status(200).json({ message: 'Request accepted' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const rejectCarpoolingRequest = async (req, res) => {
	try {
		const { carpooling_id, requester_id, number_of_seats } = req.body;
		await carpoolingServices.rejectCarpoolingRequest(carpooling_id, requester_id, number_of_seats);
		res.status(200).json({ message: 'Request rejected' });
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: 'Internal Server Error' });
	}
}

const getCarpoolingByPublisherId = async (req, res) => {
	try {
		const { user_id } = req.params;
		const carpooling = await carpoolingServices.getCarpoolingByPublisherId(user_id);
		res.status(200).json(carpooling);
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
	getSingleRequestInfo,
	acceptCarpoolingRequest,
	rejectCarpoolingRequest,
	getCarpoolingByPublisherId
}