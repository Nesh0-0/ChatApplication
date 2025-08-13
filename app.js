const express = require('express');
const app = express();
require('dotenv').config();
// const PORT = process.env.PORT;
const userRoutes = require('./routes/users');
const messageRoutes = require('./routes/messages');
const db = require('./utils/db');
const cors = require('cors');


app.use(cors({
    origin: "*",
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(express.json());
app.use('/users', userRoutes);
app.use(express.static('public'));
app.use('/messages', messageRoutes);


db.sync().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running!`);
    });

}).catch(err => {
    console.log("Could not run server!");
});