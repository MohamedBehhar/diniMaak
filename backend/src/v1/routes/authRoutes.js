const express = require("express");
const router = express.Router();
const authControllers = require("../../controllers/authControllers")

router.post("/register", authControllers.signUp)
router.post("/login", authControllers.login)
router.post("/refresh-token", authControllers.updateToken)

module.exports = router;