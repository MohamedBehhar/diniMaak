const express = require('express');
const router = express.Router();

const conversationsController = require('../../controllers/conversationsController');

router.get('/:user_id', conversationsController.getConversations);

module.exports = router;