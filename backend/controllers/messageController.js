const Message = require('../model/Message');
const crypto = require('crypto');
const {encrypt, decrypt} = require('../utils/cryptoUtils')

// Finished
const getAllChats = async (req, res) => {
    
    try {
        const allChats = await Message.aggregate([
            {
                $match: {
                    $or: [
                        {sender: req.user.emails[0].value},
                        {reciever: req.user.emails[0].value}
                    ]
                }
            },            
            {
                $project: {
                    conversation: {
                        $cond: {
                            if: {$eq: ["$sender", req.user.emails[0].value]},
                            then: "$reciever",
                            else: "$sender"
                        }
                    }
                }
            },
            {
                $group: {
                    _id: "$conversation"
                }
            },
            {
                $project: {
                    _id: 0,
                    conversation: "$_id"
                }
            }
        ])
        res.status(200).json(allChats);
        console.log(allChats);
    } catch (error) {
        console.log(error);
    }

}

// Finished
const getAllMessages = async (req, res) => {
    
    try {
        const allMessages = await Message.aggregate([
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                {sender: req.user.emails[0].value},
                                {reciever: req.user.emails[0].value}
                            ]
                        },
                        {
                            $or: [
                                {sender: req.query.conversation},
                                {reciever: req.query.conversation},
                            ]
                        }
                    ]
                }
            },
            {
                $project: {
                    messageContent: 1,
                    sender: 1,
                    reciever: 1
                }
            }
        ])

        res.status(200).json(allMessages)
    } catch (error) {

        console.log(error);
        
    }


}

// Finished
const decryptAllMessages = async (req, res) => {
    try {
        
        const allMessagesEncrypted = await Message.aggregate([
            {
                $match: {
                    $and: [
                        {
                            $or: [
                                {sender: req.user.emails[0].value},
                                {reciever: req.user.emails[0].value}
                            ]
                        },
                        {
                            $or: [
                                {sender: req.query.conversation},
                                {reciever: req.query.conversation},
                            ]
                        }
                    ]
                }
            },
            {
                $project: {
                    messageContent: 1,
                    iv: 1,
                    sender: 1 // Used to show who sent the message
                }
            }
        ]);

        
        const decryptedMessages = [];
        
        for(const message of allMessagesEncrypted) {

            
            try {
                const decryptedContent = decrypt(
                    message.messageContent,
                    req.query.key,
                    message.iv
                );

                
                decryptedMessages.push({
                    ...message,
                    decryptedContent
                });
                console.log('Successfully decrypted message');
            } catch (err) {
                
                const encryptedMessageForPush = message.messageContent
                console.error('Failed to decrypt message:', err.message);
                // Add the message anyway, but show that decryption failed
                decryptedMessages.push({
                    ...message,
                    decryptedContent: { error: 'Failed to decrypt' }
                });
            }
        }

        res.status(200).json(decryptedMessages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Failed to decrypt messages' });
    }
}

// Finished
const createNewMessage = async (req, res) => {

    const timeNow = Date.now();

    const newMessage = {
        sender: req.body.sender,
        reciever: req.body.reciever,
        timeStamp: timeNow,
        messageContent: req.body.messageContent,
        key: req.body.key
    }
    try {
        
        const messageContentBuffer = Buffer.from(newMessage.messageContent);

        const encryptedMessage = encrypt(messageContentBuffer, newMessage.key);

        const result = await Message.create({
            "sender": newMessage.sender,
            "reciever": newMessage.reciever,
            "timestamp": newMessage.timeStamp,
            "messageContent": encryptedMessage.encryptedData,
            "iv": encryptedMessage.iv
        })

        res.status(201).json(result);
        
    } catch (error) {
        console.log(error);
    }
    
    
}

// To finish
const deleteMessage = (req, res) => {

    
}

module.exports = {
    getAllChats,
    getAllMessages,
    decryptAllMessages,
    createNewMessage,
    deleteMessage
}