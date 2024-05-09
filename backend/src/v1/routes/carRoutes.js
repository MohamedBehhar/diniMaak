const express = require('express');
const routes = express.Router();
const carController = require('../../controllers/carController');

routes.get('/:brand', carController.getCarBrand);
routes.post('/', carController.addCar);





module.exports = routes;