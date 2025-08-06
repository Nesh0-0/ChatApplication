const usersDb = require('../models/users'); 
const sequelize = require('../utils/db');




const createUser = async (username, email, phone, password) => {
    const transaction = await sequelize.transaction();
    try {
        const uploadToDB = await usersDb.create({username, email, phone, password}, {transaction});
        await transaction.commit();
        return {success: true, details: uploadToDB};
    }
    catch (err) {
        await transaction.rollback();
        console.log(err);
        return new Error(err);
    }
};



const getUser = async (email) => {
    try {
        const user = await usersDb.findOne({ where: { email } });

        if (!user) {
            return { success: false, message: 'User not found', details: null };
        }

        return { success: true, details: user };
    } catch (err) {
        console.error('Error fetching user:', err);
        return { success: false, message: 'Internal server error', error: err };
    }
};


module.exports = {getUser, createUser};
  