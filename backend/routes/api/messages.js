const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/messageController');


router.route('/newMessage')
    .post(messageController.createNewMessage)

router.route('/chats')
    .get(messageController.getAllChats)


module.exports = router;