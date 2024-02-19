const express = require("express");
const router = express.Router();
const authControllers = require("../../controllers/authControllers")

router.post("/register", authControllers.register)
router.post("/login", authControllers.login)
router.get("/updateToken", authControllers.updateToken)

module.exports = router;