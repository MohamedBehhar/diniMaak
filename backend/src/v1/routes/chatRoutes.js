const express = require('express');
const router = express.Router();

const chatController = require('../../controllers/chatController');

router.get('/', chatController.getChats);
router.get('/:chat_id', chatController.getChatById);
router.post('/', chatController.createChat);
router.put('/:chat_id', chatController.updateChat);

module.exports = router;