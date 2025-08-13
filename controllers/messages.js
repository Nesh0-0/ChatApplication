const messageServices = require('../services/messageServices');



const sendMessage = async (req, res) => {
    try {
        
        const { message, username } = req.body;
        const userId = req.userId.id;
        const uploadMessageToDb = await messageServices.uploadMessage(userId, message, username);
        
        if (uploadMessageToDb.success) 
            res.status(200).json({ success: true, message: uploadMessageToDb.message, data: uploadMessageToDb.details });
            
        else
            throw new Error(uploadMessageToDb.message)

    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message});
    }
};


const getMessages = async (req, res) => {
    try {

        const getMessagesFromDb = await messageServices.getAllMessages();

        if (getMessagesFromDb.success) 
            res.status(200).json({ success: true, message: getMessagesFromDb.message, data: getMessagesFromDb.details});

        else 
            throw new Error(getMessagesFromDb.message);
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message});
    }
}


module.exports = {sendMessage, getMessages};