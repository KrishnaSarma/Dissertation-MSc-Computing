import messages from '../models/MsgDb';
import users from '../models/UsersDb';

export const getMessages = async (req, response) => {
    let sender = {}
    let reciever = {}

    await users.findOne({email: req.query.sender})
    .then( (user) => {
        sender = user
    })
    .catch( (err) => {
        console.log("Find sender error", err)
    })

    await users.findOne({email: req.query.reciever})
    .then( (user) => {
        reciever = user
    })
    .catch( (err) => {
        console.log("Find reciever error", err)
    })

    messages.find({
        $or : [
            {
                sender: sender._id,
                reciever: reciever._id
            },
            {
                sender: reciever._id,
                reciever: sender._id
            }
        ]        
    })
    .then((messages) => {
        let msgList = []

        for(let msg of messages){
            let reformedMsg = {}
            if(msg.sender.toString() == sender._id.toString()){
                reformedMsg.sender = sender.email
                reformedMsg.message = msg.text
            }
            else{
                reformedMsg.sender = reciever.email
                reformedMsg.message = msg.reciever_text

            }
            reformedMsg.originalMessage = msg.text
            reformedMsg.timestamp = msg.dateTime
            reformedMsg.delivered = msg.delivered
            msgList.push(reformedMsg)
        }

        return response.status(201).json({
            msgList
        });
    }).catch((err)=>{
        console.log("Error getting message list", err)
        return response.status(500).json({
            data: "Internal server error!"
        });
    })
}

export const saveMessage = async(msg, sent) => {

    var sender = {}
    var reciever = {}

    await users.findOne({email: msg.sender})
    .then( (user) => {
        sender = user
    })
    .catch( (err) => {
        console.log("Find sender error", err)
    })

    await users.findOne({email: msg.reciever})
    .then( (user) => {
        reciever = user
    })
    .catch( (err) => {
        console.log("Find reciever error", err)
    })
    let newMessage = new messages({
        text: msg.message,
        sender: sender._id,
        reciever: reciever._id,
        reciever_text: msg.reciever_message,
        delivered: sent
    });

    newMessage.save()
    .then((res)=>{
        if(res){
            console.log("Message saved", res)
        }        
    }).catch((err)=>{
        console.log("Message saving error", err)
    })
}