

const handleSubmitEvent = async (event) => {
    try {
        event.preventDefault();
        const username = event.target.username.value;
        const email = event.target.email.value;
        const phone = event.target.phone.value;
        const password = event.target.password.value;
        const signup = await axios.post('http://localhost:3000/users/addUser', {username, email, phone, password});
        alert(signup.data.message);
        // alert(signup);
    }
    catch (err) {
        console.log(err.response.data.message);
        alert(err.response.data.message);
    }

};

const login = () => {
    window.location.href = 'login.html';
};