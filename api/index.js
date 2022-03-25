const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const app = express();
const port = 8000;


require('express-ws')(app);

app.use(cors());


const activeConnections = {};


app.ws('/draw', (ws, req) => {
    const id = nanoid();
    activeConnections[id] = ws;
    console.log('Client connected!');

    let username = 'Anonymous';

    ws.on('message', (msg) => {
        const decodedMessage = JSON.parse(msg);
        switch (decodedMessage.type) {
            case 'SET_USERNAME':
                username = decodedMessage.username;
                break;
            case 'SEND_MESSAGE':
                Object.keys(activeConnections).forEach(connId => {
                    const conn = activeConnections[id];
                    conn.send(JSON.stringify({
                        type: 'NEW_MESSAGE',
                        message: {
                            username,
                            text: decodedMessage.text,
                        }
                    }))
                });
                break;
            default:
                console.log('Unknown message type ', decodedMessage.type);

        }
    })

    ws.on('close', (msg) => {
        console.log('Client disconnected id = ', id);
        delete activeConnections[id];
    })
})

app.listen(8000, () => {
    console.log('Server is listening port ' + port + '...');
})


