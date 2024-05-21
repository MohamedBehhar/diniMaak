const express = require('express');
const router = express.Router();

const chatController = require('../../controllers/chatController');

router.get('/:sender_id/:receiver_id', chatController.getChats);


module.exports = router;