const express = require('express');
const multer = require('multer');
const carController = require('../../controllers/carController');
const path = require('path');
const routes = express.Router();
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../public/cars');

// Ensure the uploads directory exists
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage for multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, uploadDir);
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

// Initialize upload middleware
routes.get('/:user_id', carController.getCarByUserId);
routes.get('/brand/:brand', carController.getCarBrand);
const upload = multer({ storage });
routes.post('/', upload.single('image'), carController.addCar);
routes.put('/', upload.single('image'), carController.editCar);

module.exports = routes;
