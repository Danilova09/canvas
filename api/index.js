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


    ws.on('message', (msg) => {
        const decodedMessage = JSON.parse(msg);
        switch (decodedMessage.type) {
            case 'NEW_PIXEL':
                console.log(decodedMessage);
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


