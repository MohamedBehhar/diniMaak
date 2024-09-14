const express = require('express');
const router = express.Router();

const chatController = require('../../controllers/chatController');

router.get('/:sender_id/:receiver_id/:conversation_id', chatController.getChats);
router.get('/unread/:user_id', chatController.getUnreadMessages);
router.put('chat/read/:conversation_id/:user_id', chatController.setMessagesAsRead);


module.exports = router;