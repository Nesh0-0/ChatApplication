const send = document.getElementById('sendBtn');
const message = document.getElementById('message');
const chatDiv = document.getElementById('chatDiv');



window.addEventListener('load', async () => {
    try {

        const token = localStorage.getItem('token');
        const onlineDetails = await axios.get('http://localhost:3000/users/getOnlineUsers', { headers: { 'Authorization': token } });

        if (!onlineDetails.data.success) {
            throw new Error(onlineDetails.data.message);
        }

        const onlineUsers = onlineDetails.data.data;

        onlineUsers.forEach(element => {
            const h = document.createElement('h6');
            h.id = 'chatMessage';
            h.innerText = `${element.username} joined`;
            chatDiv.appendChild(h);
        });

        const messageDetails = await axios.get('http://localhost:3000/messages/getAllMessages', { headers: { 'Authorization': token}});

        if (!messageDetails.data.success) 
            throw new Error(messageDetails.data.message)

        const allMessages = messageDetails.data.data;

        allMessages.forEach(element => {
            const h = document.createElement('h6');
            h.id = 'chatMessage';
            const username = element.user.username;
            const message = element.message;
            h.innerText = `${username}: ${message}`;
            chatDiv.appendChild(h);
        })

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
        const uploadMessageToDb = await axios.post('http://localhost:3000/messages/uploadMessage', {message: text, username}, { headers: { 'Authorization': token } });
        
        if (!uploadMessageToDb.data.success) {
            throw new Error(uploadMessageToDb.data.message);
        }

        else {
            console.log(uploadMessageToDb.data.message);
        }
    }
    catch (err) {
        console.log(err.message);
    }


});