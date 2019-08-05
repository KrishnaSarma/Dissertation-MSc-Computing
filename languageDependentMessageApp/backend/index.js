const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io').listen(server);
const port = 3000;
const mongoose = require("mongoose");
const bodyParser = require('body-parser');

import {saveMessage, convertMessage} from "./controllers/chatController";

import routes from './routes';

mongoose.connect('mongodb://localhost:27017/my_chat_app', { useNewUrlParser: true }).then(() => {
    console.log('connected to db');
}).catch((err) => {
    console.log("Error on db connection", err);
});

var users = [];
var sender = "";
var reciever = "";

io.on("connection", socket => {
    console.log("a user connected: " + socket.id);

    //initially check for any unread messages for the username and send it.
    //implement push notification.
    
    socket.on("User Name", async uname => {
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
    
    socket.on("Chat Message", msg => {
        let reciever_socket = {}
        console.log("reciever", msg.reciever);
        for(var user of users){
            if (user.uname == msg.reciever){
                reciever_socket = user.socket
                break
            }
        }

        const recieverLanguage = "de";
        const senderLanguage = "en";

        if(recieverLanguage != senderLanguage){
            msg.reciever_message = convertMessage(msg.message, senderLanguage, recieverLanguage)
        }

        else{
            msg.reciever_message = msg.message
        }

        if(reciever_socket == {}){
            saveMessage(msg, 0);
        }
        else{
            saveMessage(msg, 1);
            console.log("reciever socket", reciever_socket)
            let msgToSend = {
                sender: msg.sender,
                message: msg.reciever_message
            }
            socket.to(reciever_socket).emit("Chat Message", msgToSend);
            // socket.emit("Chat Message", msgToSend)
        }        
    });
     
    socket.on("disconnect", data => {
        console.log("Socket disconnected due to", data);
        console.log("the socket disconnected is", socket.id);
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