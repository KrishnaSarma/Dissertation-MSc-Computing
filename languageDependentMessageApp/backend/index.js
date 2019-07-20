const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io').listen(server);
const port = 3000;
var mongoose = require("mongoose");
var bodyParser = require('body-parser');

import routes from './routes';

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

app.use(bodyParser.json());
app.post("/login", (req, res, next) => {
    console.log("in server", req)
    res.send('hello world')
})

//app.use("/", routes);
//app.use(bodyParser.json());

server.listen(port, () => console.log("Server is running on port " + port));