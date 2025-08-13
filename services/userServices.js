const users = require('../models/users'); 
const sequelize = require('../utils/db');




const createUser = async (username, email, phone, password) => {
    const transaction = await sequelize.transaction();
    try {
        const uploadToDB = await users.create({username, email, phone, password, status: 'offline'}, {transaction});
        await transaction.commit();
        return {success: true, details: uploadToDB};
    }
    catch (err) {
        await transaction.rollback();
        console.log(err);
        return { success: false, message: 'Error creating user', error: err };
        
    }
};



const getUser = async (email) => {
    try {
        const user = await users.findOne({ where: { email } });

        if (!user) {
            return { success: false, message: 'User not found', details: null };
        }

        return { success: true, details: user };
    } catch (err) {
        console.error('Error fetching user:', err);
        return { success: false, message: 'Internal server error', error: err };
    }
};

const makeOnline = async (id) => {
    const transaction = await sequelize.transaction(); 
    try {
        const details = await users.findByPk(id, { transaction }); 
        if (!details) {
            throw new Error('User not found');
        }

        details.status = 'online';
        await details.save({ transaction });

        await transaction.commit();

        return { success: true, message: 'User marked online successfully!', details };
    } catch (err) {
        console.error(err);
        await transaction.rollback();
        return { success: false, message: 'Internal server error', error: err };
    }
};

const getOnlineUsers = async () => {
    try {
        const onlineUsers = await users.findAll( { 
            where: { 
                status: 'online'
            }
        });

        return { success: true, message: 'Online users fetched successfully!', data: onlineUsers };
    }

    catch (err) {
        console.log(err);
        return { success: false, message: 'Could not fetch online users!', error: err };
    }
}



module.exports = {getUser, createUser, makeOnline, getOnlineUsers};
  