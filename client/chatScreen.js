const send = document.getElementById('sendBtn');
const message = document.getElementById('message');
const chatDiv = document.getElementById('chatDiv');

let lastMessageId = 0;

const addMessagesToTheScreen = (message) => {
    const h = document.createElement('h6');
    h.id = 'chatMessage';
    h.innerText = message;
    chatDiv.appendChild(h);
}



const getMessagesFromDb = async () => {
    
    try {

        const token = localStorage.getItem('token');

        const messageDetails = await axios.get('http://localhost:3000/messages/getAllMessages', { headers: { 'Authorization': token } });

        if (!messageDetails.data.success)
            throw new Error(messageDetails.data.message)

        const allMessages = messageDetails.data.data;

        allMessages.forEach(element => {

            if (lastMessageId < element.id) {
                
                const username = element.user.username;
                const message = element.message;
                addMessagesToTheScreen(`${username}: ${message}`);
                lastMessageId = element.id;
            }

        });
    }
    catch (err) {
        
        console.log(err);
    }
};

setInterval(async () => {
    const token = localStorage.getItem('token');
    await getMessagesFromDb(token);
}, 1000);





window.addEventListener('load', async () => {
    try {

        const token = localStorage.getItem('token');
        const onlineDetails = await axios.get('http://localhost:3000/users/getOnlineUsers', { headers: { 'Authorization': token } });

        if (!onlineDetails.data.success) {
            throw new Error(onlineDetails.data.message);
        }

        const onlineUsers = onlineDetails.data.data;

        onlineUsers.forEach(element => {
            addMessagesToTheScreen(`${element.username} joined`);

        });

        await getMessagesFromDb();
        

    }
    catch (err) {
        console.log(err);
    }
});




send.addEventListener('click', async () => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const text = message.value;
    console.log(message);
    if (text === '') {
        return;
    }

    console.log(text);
    const h = document.createElement('h6');
    h.id = 'chatMessage';
    h.innerText = `${username}: ${text}`;
    chatDiv.appendChild(h);

    try {
        const uploadMessageToDb = await axios.post('http://localhost:3000/messages/uploadMessage', { message: text, username }, { headers: { 'Authorization': token } });

        if (!uploadMessageToDb.data.success) {
            throw new Error(uploadMessageToDb.data.message);
        }

        else {
            console.log(uploadMessageToDb.data.message);
            lastMessageId = uploadMessageToDb.data.data.id;
        }
    }
    catch (err) {
        console.log(err.message);
    }


});