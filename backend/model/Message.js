 const mongoose = require('mongoose');
 const Schema = mongoose.Schema;


 const messageSchema = new Schema({
    sender: {
        type: String,
        required: true,

    },
    reciever: {
        type: String,
        required: true,

    },
    timestamp: {
        type: String,
        default: Date.now
    },
    messageContent: {
        type: String,
        required: true
    },
    iv: {
        type: String,
        required: true
    }
 })

 module.exports = mongoose.model('Message', messageSchema);
  