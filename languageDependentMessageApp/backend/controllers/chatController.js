import messages from '../models/MsgDb';
import users from '../models/UsersDb';

const reformatTime = (timestamp) => {
    var timestampArray = timestamp.toString().split(" ")
    switch(timestampArray[1]){
        case "Jan":
            var num = 1;
            timestampArray[1] = num.toString()
            break;
        case "Feb":
            var num = 2;
            timestampArray[1] = num.toString()
            break;
        case "Mar":
            var num = 3;
            timestampArray[1] = num.toString()
            break;
        case "Apr":
            var num = 4;
            timestampArray[1] = num.toString()
            break;
        case "May":
            var num = 5;
            timestampArray[1] = num.toString()
            break;
        case "Jun":
            var num = 6;
            timestampArray[1] = num.toString()
            break;
        case "Jul":
            var num = 7;
            timestampArray[1] = num.toString()
            break;
        case "Aug":
            var num = 8;
            timestampArray[1] = num.toString()
            break;
        case "Sep":
            var num = 9;
            timestampArray[1] = num.toString()
            break;
        case "Oct":
            var num = 10;
            timestampArray[1] = num.toString()
            break;
        case "Nov":
            var num = 11;
            timestampArray[1] = num.toString()
            break;
        case "Dec":
            var num = 12;
            timestampArray[1] = num.toString()
            break;
    }
    var date = timestampArray[2] + "/" + timestampArray[1] + "/" + timestampArray[3]
    var time = timestampArray[4]
    return date + " " + time

}

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

            var timestamp = reformatTime(msg.dateTime)

            reformedMsg.timestamp = timestamp
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