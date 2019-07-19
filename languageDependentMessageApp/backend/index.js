const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io').listen(server);
const port = 3000;
var mongoose = require("mongoose");

// import routes from './routes';

mongoose.connect('mongodb://localhost/my_chat_app', { useNewUrlParser: true }).then(() => {
    console.log('connected to db');
}).catch((err) => {
    console.log("Error on db connection", err);
});

io.on("connection", socket => {
    console.log("a user connected: " + socket.id);
    socket.on("Chat Message", msg => {
        // on recieving the message with sender and reciever id, store the message in the db via routes.
        // and then send the message to the appropriate client by using the client id.
        // and send the updated chat list to the sender.
        console.log(msg);
        io.emit("Chat Message", msg);
    });    
});

server.listen(port, () => console.log("Server is running on port " + port));