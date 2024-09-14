const express = require("express");
const router = express.Router();
const usersControllers = require("../../controllers/usersControllers")
const fs = require('fs');
const multer = require('multer');
const path = require('path');

const uploadDir = path.join(__dirname, '../../public');
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
const upload = multer({ storage });





router.get("/", usersControllers.getUsers)
router.get("/:user_id", usersControllers.getUserInfo)
router.put("/", upload.single('profile_picture'), usersControllers.updateUserInfo)


module.exports = router;
