const express = require('express');
const router = express.Router();
const path = require('path');
const userController = require('../controllers/users');

router.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
});

router.post('/addUser', userController.addUser);

router.post('/login', userController.login);


module.exports = router;