const express = require('express');
const router = express.Router();

const conversationsController = require('../../controllers/conversationsController');

router.get('/:user_id', conversationsController.getConversations);
router.get('/unread/:user_id', conversationsController.getUnreadLastMessagesCount);

module.exports = router;