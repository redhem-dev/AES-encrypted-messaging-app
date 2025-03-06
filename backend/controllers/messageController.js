const Message = require('../model/Message');

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

            }
        ])
    } catch (error) {
        
    }


}

const createNewMessage = async (req, res) => {

    const timeNow = Date.now();

    const newMessage = {
        sender: req.body.sender,
        reciever: req.body.reciever,
        timeStamp: timeNow,
        messageContent: req.body.messageContent
    }
    try {

        const result = await Message.create({
            "sender": newMessage.sender,
            "reciever": newMessage.reciever,
            "timestamp": newMessage.timeStamp,
            "messageContent": newMessage.messageContent
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