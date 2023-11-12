const WebSocket = require('ws');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const express = require('express');
const { sendMessage } = require('./controllers/message.js');
const { userFromToken } = require('./middlewares/auth.js')
const Errors = require('./errors/errors.js')
const userRoutes = require('./routes/user.js')

dotenv.config();

mongoose.connect(process.env.MONGODB)
    .then(() => console.log('Conexão foi estabelecida.'))
    .catch(err => console.error('Conexão não foi estabelecida. Error: ', err));

const app = express();
app.use(userRoutes);
const expressServer = app.listen(3000, () => {
    console.log(`Express PORT: ${expressServer.address().port}`);
});


const server = new WebSocket.Server({ port: 8080 });
const connections = {};

server.on('connection', (ws, req) => {
    const token = req.headers.authorization;
    const user = userFromToken(token);

    connections[user._id] = ws;

    ws.on('message', async (data) => {
        const { userId, content } = JSON.parse(data);

        try {
            await sendMessage(userId, content, token);
            if (connections[userId]) {
                connections[userId].send(JSON.stringify({ content, authorId: user._id }));
            }
        } catch (err) {
            if (err instanceof Errors.NotFriends) {
                ws.send(JSON.stringify({ error: 'Você só pode enviar mensagens para seus amigos.' }));
            }
        }
    });

    ws.on('close', () => {
        delete connections[user._id];
    });
});

console.log('Websocket PORT: 8080');