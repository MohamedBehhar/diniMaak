const express = require('express');
const router = express.Router();


const carpoolingControllers = require('../../controllers/carpoolingControllers');

router.get('/', carpoolingControllers.getCarpooling);
router.get('/:id', carpoolingControllers.getCarpoolingById);
router.post('/', carpoolingControllers.createCarpooling);
router.get('/search/:user_id/:departure/:destination/:departure_day?/:number_of_seats?', carpoolingControllers.searchCarpooling);

router.get('/requests/:user_id', carpoolingControllers.getCarpoolingRequests);
router.get('/bookings/:user_id', carpoolingControllers.getBookedCarpooling);



module.exports = router;