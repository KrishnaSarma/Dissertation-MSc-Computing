const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io').listen(server);
const port = 3000;
var mongoose = require("mongoose");
var bodyParser = require('body-parser');
import {getMessages, sendMessage, recieveMessage} from "./controllers/chatController";

import routes from './routes';

mongoose.connect('mongodb://localhost:27017/my_chat_app', { useNewUrlParser: true }).then(() => {
    console.log('connected to db');
}).catch((err) => {
    console.log("Error on db connection", err);
});

const users = {};
const sender = "";
const reciever = "";

// @todo: ONE connection to be done through out the chat app
io.on("connection", socket => {
    console.log("a user connected: " + socket.id);

    // @todo: send the username ONCE on connection,
    // seperate the reciever and sender after above implementation
    // on second thought this can also be used while choosing the reciever in the users screen
    socket.on("Users", senRec => {
        users[senRec.sen] = socket;
        sender = senRec.sen;  
        reciever = senRec.rec;       
        console.log("username socket", users);
        var messages = getMessages(sender, reciever)
        // will need to edit the function below to just return the messages to sender
        socket.emit("previousMessages", messages)
    })

    // @todo: send the reciever ONCE on choosing the reciever in user screen
    // socket.on("Reciever", reciever => {
    //     reciever = reciever;
    // })

    // @todo: calls everytime a message is sent.
    socket.on("Chat Message", msg => {
        // on recieving the message with sender and reciever id, store the message in the db via routes.
        // and then send the message to the appropriate client by using the client id.
        // and send the updated chat list to the sender.
        console.log(msg.reciever);
        users[msg.reciever].emit("Chat Message", msg);
    });
     
    socket.on("disconnect", data => {
        console.log("Socket disconnected due to", data);
        users.forEach((user, index) => {
            if (user.key == socket.id){
                users.slice(index, 1);
            }
        });
        console.log('users after disconnect', users);
    })
});

app.use(bodyParser.json());
app.use("/", routes);
// app.post("/login", function(req, res){
//     console.log("in server index", req.body);
// })
server.listen(port, () => console.log("Server is running on port " + port))
;