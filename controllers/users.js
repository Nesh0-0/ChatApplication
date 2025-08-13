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
        
        // if (!getUserDetails.success) {
        //     return res.status(500).json({ success: false, message: getUserDetails.message });
        // }
        
        if (getUserDetails.details != null) {
            return res.status(400).json({ success: false, message: 'Email ID already exists!' });
        }


        const saltRounds = parseInt(process.env.SALT_ROUNDS, 10);

        bcrypt.hash(password, saltRounds, async (err, encrypted) => {
            if (err) {
                console.log('Hashing error:', err);
                return res.status(500).json({ success: false, message: 'Error encrypting password' });
            }

            try {
                const createNewUser = await userServices.createUser(username, email, phone, encrypted);
                if (createNewUser.success) {
                    res.status(201).json({
                        success: true,
                        message: 'New user created successfully!',
                        data: createNewUser
                    });
                }
                else {
                    console.log(createNewUser.error);
                    throw new Error(createNewUser.message);
                    // res.status(500).json({
                    //     success: false,
                    //     message: createNewUser.message,
                    //     err: createNewUser.error
                    // });
                }
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
        res.status(200).json({ success: true, message: 'Login successful.', token, details: userDetails.details });

    } catch (err) {
        console.log(err);
        res.status(401).json({ success: false, message: err.message });
    }
};

const addOnlineUser = async (req, res) => {
    try {
        const userId = req.userId.id;
        const { username } = req.body;
        console.log("username -----------> ", username);
        const addOnline = await userServices.makeOnline(userId);
        if (addOnline.success) {
            res.status(200).json({ success: true, message: addOnline.message });
        }
        else {
            console.log(addOnline.error);
            throw new Error(addOnline.message);
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message});
    }
};



const getOnlineUsers = async (req, res) => {
    try {
        const onlineUsers = await userServices.getOnlineUsers();
        if (onlineUsers.success) {
            res.status(200).json({ success: true, message: onlineUsers.message, data: onlineUsers.data});
        }
        else {
            console.log(onlineUsers.err);
            throw new Error(onlineUsers.message);
        }
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = { addUser, login, addOnlineUser, getOnlineUsers };
