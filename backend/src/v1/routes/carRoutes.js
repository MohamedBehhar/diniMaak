const express = require('express');
const multer = require('multer');
const carController = require('../../controllers/carController');
const path = require('path');
const routes = express.Router();
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../images');

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
const upload = multer({ storage });
routes.get('/:brand', carController.getCarBrand);
routes.post('/', upload.single('image'), carController.addCar);

module.exports = routes;
