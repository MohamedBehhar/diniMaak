const express = require('express');
const router = express.Router();

const notificationsControllers = require('../../controllers/notificationsControllers');

router.get('/:user_id', notificationsControllers.getNotifications);


module.exports = router;