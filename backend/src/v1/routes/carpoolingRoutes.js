const express = require('express');
const router = express.Router();


const carpoolingControllers = require('../../controllers/carpoolingControllers');

router.get('/', carpoolingControllers.getCarpooling);
router.get('/:id', carpoolingControllers.getCarpoolingById);
router.post('/', carpoolingControllers.createCarpooling);
router.get('/search/:user_id/:departure/:destination/:departure_day?/:number_of_seats?', carpoolingControllers.searchCarpooling);
router.delete('/:id', carpoolingControllers.deleteCarpooling);

router.get('/requests/:user_id', carpoolingControllers.getCarpoolingRequests);
router.get('/request/:requester_id/:carpooling_id', carpoolingControllers.getSingleRequestInfo);
router.get('/bookings/:user_id', carpoolingControllers.getBookedCarpooling);
router.post('/requests/accept', carpoolingControllers.acceptCarpoolingRequest);
router.post('/requests/reject', carpoolingControllers.rejectCarpoolingRequest);
router.get('/published/:user_id', carpoolingControllers.getCarpoolingByPublisherId);



module.exports = router;