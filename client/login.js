

const login = async (event) => {
    try {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        const loginDetails = await axios.post('http://localhost:3000/users/login', {email, password});

        if (!loginDetails.data.success) {
            throw new Error(loginDetails.data.message);
        }

        
        const token = loginDetails.data.token;
        
        localStorage.setItem('token', token);
        
        const { username } = loginDetails.data.details;
        localStorage.setItem('username', username);
        
        console.log(username);
        
        const updateStatusToOnline = await axios.post('http://localhost:3000/users/updateOnline', {username}, {headers: {'Authorization': token}});
        
        // alert(loginDetails.data.message);

        window.location.href = 'chatScreen.html';

    }
    catch (err) {
        console.log(err);
        alert(err.response.data.message);
    }
}


const signup = () => {
    window.location.href = 'signup.html';
}