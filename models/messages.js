const { DataTypes } = require('sequelize');
const sequelize = require('../utils/db');

const messages = sequelize.define('messages', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    message: {
        type: DataTypes.STRING
    }

},
    { timestamps: false });

module.exports = messages;