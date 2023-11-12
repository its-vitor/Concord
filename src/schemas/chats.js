const mongoose = require('mongoose');
const messageSchema = require('./message.js')

const chatSchema = mongoose.Schema({
    members: {
        type: [mongoose.Types.ObjectId],
        required: true,
    },
    messages: {
        type: [messageSchema],
        default: []
    },
});

const Chats = mongoose.model('Chats', chatSchema, 'chats');

module.exports = Chats;