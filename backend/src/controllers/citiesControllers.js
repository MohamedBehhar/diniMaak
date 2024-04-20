const citiesServices = require('../services/citiesServices');

const searchCitieByInitialLetter = async (req, res) => {
	try {
		const { letter } = req.params;
		const cities = await citiesServices.searchCitieByInitialLetter(letter);
		res.send(cities);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Internal Server Error' });
	}

}

module.exports = {

	searchCitieByInitialLetter,
}