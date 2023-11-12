const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    content: {
        type: String,
        required: true,
    },
    authorId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    timestamp: { 
        type: Date, 
        default: Date.now 
    },
});

module.exports = messageSchema;