const express = require('express');
const router = express.Router();

const bookCarpoolingControllers = require('../../controllers/bookCarpoolingControllers');

router.post('/book', bookCarpoolingControllers.bookCarpooling);

module.exports = router;