import messages from '../models/MsgDb';
import users from '../models/UsersDb';

export const getMessages = async (req, response) => {
    let sender = {}
    let reciever = {}

    console.log("request", req.query)

    await users.findOne({email: req.query.sender})
    .then( (user) => {
        console.log("user returned", user)
        sender = user
    })
    .catch( (err) => {
        console.log(err)
    })

    await users.findOne({email: req.query.reciever})
    .then( (user) => {
        console.log("user returned", user)
        reciever = user
    })
    .catch( (err) => {
        console.log(err)
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
        console.log("messages returned", messages)
        return response.status(201).json({
            messages
        });
    }).catch((err) => {
        console.log(err)
    })

    console.log("get all messages between 2 users");
}

export const sendMessage = (req, res) => {
    console.log("sent message");
}

export const recieveMessage = (req, res) => {
    console.log("recieved message")
}

export const saveMessage = async(msg, sent) => {

    var sender = {}
    var reciever = {}

    await users.findOne({email: msg.sender})
    .then( (user) => {
        console.log("user", user._id)
        sender = user
    })
    .catch( (err) => {
        console.log("err", err)
    })

    await users.findOne({email: msg.reciever})
    .then( (user) => {
        console.log("user", user._id)
        reciever = user
    })
    .catch( (err) => {
        console.log("err", err)
    })
    console.log("msg", msg)
    let newMessage = new messages({
        text: msg.message,
        sender: sender._id,
        reciever: reciever._id,
        reciever_text: msg.message,
        delivered: sent
    });

    newMessage.save()
    .then((res)=>{
        
        if(res){
            console.log("message saved", res)
        }        
    }).catch((err)=>{
        console.log(err)
    })
}

// handle getMessages and sendMessage function

