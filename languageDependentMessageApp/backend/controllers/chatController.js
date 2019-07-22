import messages from '../models/MsgDb';

export const getMessages = (sender, reciever) => {

    messages.find({
        // @todo: put an OR filter here to find the other way around messages
        sender: sender,
        reciever: reciever
    })
    .then((messages) => {
        var justMessages = []
        for (var msg of messages){
            justMessages.push(msg.text)
        }
        return justMessages;
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

// handle getMessages and sendMessage function

