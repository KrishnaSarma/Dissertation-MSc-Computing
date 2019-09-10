const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io').listen(server);
const port = 3000;
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

import {saveMessage} from "./controllers/chatController";
import {translateText} from "./controllers/translatorController";
import {getUserLanguage, getUserTopicName} from "./controllers/usersController";

import {sendNotification} from "./controllers/firebaseController";

import routes from './routes';

mongoose.connect('mongodb://localhost:27017/my_chat_app', { useNewUrlParser: true }).then(() => {
    console.log('connected to db');
}).catch((err) => {
    console.log("Error on db connection", err);
});

mongoose.set('useFindAndModify', false);

var users = [];

io.on("connection", socket => {
    console.log("a user connected: " + socket.id);
    
    socket.on("User Name", uname => {
        console.log("uname sent", uname);
        let present = false
        let usrIndex
        users.forEach((user, index) => {
            if (user.uname == uname){
                present = true
                usrIndex = index
            }
        });
    
        if (!present){
            users.push({
                uname: uname,
                socket: socket.id
            })
        }
        else {
            users[usrIndex].socket = socket.id
        }
        
        console.log("users list", users);

    })
    
    socket.on("Chat Message", async msg => {
        let reciever_socket = ""
        for(var user of users){
            if (user.uname == msg.reciever){
                reciever_socket = user.socket
                break
            }
        }

        var recieverLanguage = await getUserLanguage(msg.reciever);
        var senderLanguage = await getUserLanguage(msg.sender);

        if(recieverLanguage != senderLanguage){

            msg.reciever_message = await translateText(msg.message, senderLanguage, recieverLanguage)
        }

        else{
            msg.reciever_message = msg.message
        }   

        if(reciever_socket == ""){
            saveMessage(msg, 0);
            var topicName = await getUserTopicName(msg.reciever)
            await sendNotification(msg.sender, topicName, msg.reciever_message)
        }
        else if (reciever_socket){
            saveMessage(msg, 1);
            let msgToSend = {
                sender: msg.sender,
                message: msg.reciever_message,
                originalMessage: msg.message,
                timestamp: msg.timestamp
            }
            socket.to(reciever_socket).emit("Chat Message", msgToSend);
        }        
    });
     
    socket.on("disconnect", data => {
        users.forEach((user, index) => {
            
            if (user.socket == socket.id){
                console.log("disconnect: user", user.uname)
                users.splice(index, 1);
            }
        });
        console.log('users after disconnect', users);
    })
});

app.use(bodyParser.json());
app.use("/", routes);
server.listen(port, () => console.log("Server is running on port " + port));