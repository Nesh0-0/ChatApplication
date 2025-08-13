const express = require('express');
const router = express.Router();
const path = require('path');
const userController = require('../controllers/users');
const auth = require('../middleware/auth');

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
});

router.post('/addUser', userController.addUser);

router.post('/login', userController.login);

router.post('/updateOnline', auth.authenticate, userController.addOnlineUser);

router.get('/getOnlineUsers', auth.authenticate, userController.getOnlineUsers);


module.exports = router;