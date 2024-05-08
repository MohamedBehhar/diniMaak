const citiesServices = require('../services/citiesServices');

const searchCitieByInitialLetter = async (req, res) => {
	try {
		const { letters } = req.params;
		const cities = await citiesServices.searchCitieByInitialLetter(letters);
		res.send(cities);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}

}

module.exports = {

	searchCitieByInitialLetter,
}