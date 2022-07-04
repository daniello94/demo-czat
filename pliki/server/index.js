require('dotenv').config()
const express = require('express');
const app = express();
const http = require('http').Server(app);
const path = require('path');
const Message = require('./Message')
const io = require('socket.io')(http, {
    cors: {
        origin: " localhost:3000 ",
        methods: ["GET", "POST"]
    }
});

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

io.on('connection', (socket) => {

    // Get the last 10 messages from the database.
    Message.find().sort({ createdAt: -1 }).limit(10).exec((err, messages) => {
        if (err) return console.error(err);

        // Send the last messages to the user.
        socket.emit('init', messages);
    });

    // Listen to connected users for a new message.
    socket.on('message', (msg) => {
        // Create a message with the content and the name of the user.
        const message = new Message({
            content: msg.content,
            name: msg.name,
        });

        // Save the message to the database.
        message.save((err) => {
            if (err) return console.error(err);
        });

        // Notify all other users about a new message.
        socket.broadcast.emit('push', msg);
    });
});

http.listen(process.env.PORT, function () {
    console.log(`listening on *: ${process.env.PORT}`);
});