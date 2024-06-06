const express = require('express');
const router = express.Router();
const remindersControllers = require('../../controllers/remindersControllers');

router.post('/setReminder', remindersControllers.setReminder);

module.exports = router;