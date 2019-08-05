import messages from '../models/MsgDb';
import users from '../models/UsersDb';

import request from "request";
import uuidv4 from "uuid/v4";

export const getMessages = async (req, response) => {
    let sender = {}
    let reciever = {}

    await users.findOne({email: req.query.sender})
    .then( (user) => {
        sender = user
    })
    .catch( (err) => {
        console.log(err)
    })

    await users.findOne({email: req.query.reciever})
    .then( (user) => {
        reciever = user
    })
    .catch( (err) => {
        console.log(err)
    })

    console.log("sender", sender)

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
            reformedMsg.timestamp = msg.dateTime
            reformedMsg.delivered = msg.delivered
            msgList.push(reformedMsg)
        }

        return response.status(201).json({
            msgList
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
        reciever_text: msg.reciever_message,
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

export const convertMessage = async (message, sourceLanguage, finalLanguage) => {
    const subscriptionKey = "3f9c828f2abc46359519882f4a0e96ad"

    let options = {
        method: 'POST',
        baseUrl: 'https://api.cognitive.microsofttranslator.com/',
        url: 'translate',
        qs: {
          'api-version': '3.0',
          'to': [finalLanguage]
        },
        headers: {
          'Ocp-Apim-Subscription-Key': subscriptionKey,
          'Content-type': 'application/json',
          'X-ClientTraceId': uuidv4().toString()
        },
        body: [{
              'text': message
        }],
        json: true,
    };

    request(options, function(err, res, body){
        console.log("res", res)

        console.log("err", err)

        console.log("body", JSON.stringify(body, null, 4));

        return (message)
    });
}

// handle getMessages and sendMessage function

