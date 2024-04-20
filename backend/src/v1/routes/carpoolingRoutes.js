const express = require('express');
const router = express.Router();


const carpoolingControllers = require('../../controllers/carpoolingControllers');

router.get('/', carpoolingControllers.getCarpooling);
router.post('/', carpoolingControllers.createCarpooling);
router.get('/search/:departure/:destination/:departure_day', carpoolingControllers.searchCarpooling);


module.exports = router;