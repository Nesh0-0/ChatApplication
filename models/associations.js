const messages = require('../models/messages');
const users = require('../models/users');

users.hasMany(messages);
messages.belongsTo(users);

module.exports = {users, messages};