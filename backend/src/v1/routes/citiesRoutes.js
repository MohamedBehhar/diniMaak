const express = require('express');
const router = express.Router();


const citiesControllers = require('../../controllers/citiesControllers');

router.get('/:letter', citiesControllers.searchCitieByInitialLetter);

module.exports = router;
