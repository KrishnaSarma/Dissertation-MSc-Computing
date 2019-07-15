const express = require('express');
const app = express();
const server = require("http").createServer(app);
const io = require('socket.io').listen(server);
const port = 3000;

import routes from routes;

io.on("connection", socket => {
    console.log("a user connected: " + socket.id);
    socket.on("Chat Message", msg => {
        console.log(msg);
        io.emit("Chat Message", msg);
    });    
});

server.listen(port, () => console.log("Server is running on port " + port));