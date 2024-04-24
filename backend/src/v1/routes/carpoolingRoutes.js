const express = require('express');
const router = express.Router();


const carpoolingControllers = require('../../controllers/carpoolingControllers');

router.get('/', carpoolingControllers.getCarpooling);
router.post('/', carpoolingControllers.createCarpooling);
router.get('/search/:user_id/:departure/:destination/:departure_day', carpoolingControllers.searchCarpooling);
router.get('/search/:user_id/:departure/:destination', carpoolingControllers.searchCarpooling);


module.exports = router;