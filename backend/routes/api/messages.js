const express = require('express');
const router = express.Router();
const messageController = require('../../controllers/messageController');


router.route('/newMessage')
    .post(messageController.createNewMessage)

router.route('/chats')
    .get(messageController.getAllChats)

router.route('/messages')
    .get(messageController.getAllMessages)

router.route('/decryptedMessages')
    .get(messageController.decryptAllMessages)


module.exports = router;