const { messages, users } = require('../models/associations');
const sequelize = require('../utils/db');


const uploadMessage = async (userId, message, username) => {
    const transaction = await sequelize.transaction();
    try {
        const upload = await messages.create({userId, message, username}, {transaction});
        await transaction.commit();
        return { success: true, message: 'Message uploaded to DB successfully!', details: upload};
            
    }
    catch (err) {
        console.log(err);
        await transaction.rollback();
        return { success: false, message: 'Could not upload the message to DB!', error: err};
    }
};


const getAllMessages = async () => {
    try {
        const messageDetails = await messages.findAll({ include: [
                {
                    model: users,
                    attributes: ['username'], // only fetch the username
                }
            ],});
        return { success: true, message: 'Messages retrieved successfully!', details: messageDetails};
    }
    catch (err) {
        console.log(err);
        return { success: false, message: 'Could not retrieve messages from DB!', error: err};
    }
}


module.exports = {uploadMessage, getAllMessages};