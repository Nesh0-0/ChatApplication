const userServices = require('../services/userServices');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
};

const addUser = async (req, res) => {
    try {
        const { username, email, phone, password } = req.body;
        const getUserDetails = await userServices.getUser(email);

        if (getUserDetails.details != null) {
            return res.status(400).json({ success: false, message: 'Email ID already exists!' });
        }

        // if (!getUserDetails.success) {
        //     return res.status(500).json({ success: false, message: getUserDetails.message });
        // }

        const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);

        bcrypt.hash(password, saltRounds, async (err, encrypted) => {
            if (err) {
                console.log('Hashing error:', err);
                return res.status(500).json({ success: false, message: 'Error encrypting password' });
            }

            try {
                const createNewUser = await userServices.createUser(username, email, phone, encrypted);
                res.status(201).json({
                    success: true,
                    message: 'New user created successfully!',
                    data: createNewUser
                });
            } catch (err) {
                console.log(err);
                res.status(500).json({ success: false, message: 'Error creating user' });
            }
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: err.message });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const userDetails = await userServices.getUser(email);

        if (!userDetails.success) {
            throw new Error(userDetails.message);
        }

        console.log('userDetails = ', userDetails.details.password);

        const isPasswordCorrect = await bcrypt.compare(password, userDetails.details.password);
        if (!isPasswordCorrect) {
            throw new Error('Password incorrect. Please try again.');
        }

        const token = generateToken(userDetails.details.id);
        res.status(200).json({ success: true, message: 'Login successful.', token });

    } catch (err) {
        console.log(err);
        res.status(401).json({ success: false, message: err.message });
    }
};

module.exports = { addUser, login };
