const Message = require('../model/Message');
const {encrypt, decrypr} = require('../utils/cryptoUtils');
const crypto = require('crypto');


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
                    messageContent: 1
                }
            }
        ])

        res.status(200).json(allMessages)
    } catch (error) {
        
    }


}

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

const deleteMessage = (req, res) => {

    
}

module.exports = {
    getAllChats,
    getAllMessages,
    createNewMessage,
    deleteMessage
}