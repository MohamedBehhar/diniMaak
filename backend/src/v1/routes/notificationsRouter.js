const express = require('express');
const router = express.Router();

const notificationsControllers = require('../../controllers/notificationsControllers');

router.get('/:user_id', notificationsControllers.getNotifications);
router.get('/count/:user_id', notificationsControllers.getNotificationsCount);
router.put('/:receiver_id', notificationsControllers.changeNotificationStatus);


module.exports = router;