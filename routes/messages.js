const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messages');
const auth = require('../middleware/auth');

router.post('/uploadMessage', auth.authenticate, messageController.sendMessage);

router.get('/getAllMessages', messageController.getMessages);

module.exports = router;