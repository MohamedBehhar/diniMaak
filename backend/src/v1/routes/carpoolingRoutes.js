const express = require('express');
const router = express.Router();


const carpoolingControllers = require('../../controllers/carpoolingControllers');

router.get('/', carpoolingControllers.getCarpooling);
router.post('/', carpoolingControllers.createCarpooling);
router.post('/search', carpoolingControllers.searchCarpooling);

module.exports = router;