const express = require('express');
const router = express.Router();

const bookCarpoolingControllers = require('../../controllers/bookCarpoolingControllers');

router.post('/book', bookCarpoolingControllers.bookCarpooling);
router.post('/confirm-booking', bookCarpoolingControllers.confirmBookingRequest);
router.post('/cancel-booking', bookCarpoolingControllers.cancelBookingRequest);

module.exports = router;