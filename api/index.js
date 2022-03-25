const express = require('express');
const cors = require('cors');
const {nanoid} = require('nanoid');
const app = express();
const port = 8000;

require('express-ws')(app);

app.use(cors());

const activeConnections = {};
const savedCoordinates = [];


app.ws('/draw', (ws, req) => {
    const id = nanoid();
    activeConnections[id] = ws;

    ws.send(JSON.stringify({
        type: 'PREV_PIXELS',
        coordinates: savedCoordinates
    }))

    ws.on('message', (msg) => {
        const decodedMessage = JSON.parse(msg);
        switch (decodedMessage.type) {
            case 'SEND_PIXEL':
                Object.keys(activeConnections).forEach(id => {
                    const conn = activeConnections[id];
                    savedCoordinates.push(decodedMessage.coordinates);
                    conn.send(JSON.stringify({
                        type: 'NEW_PIXEL',
                        pixelCoordinates: decodedMessage.coordinates
                    }))
                })
                break;
            default:
                console.log('Unknown message type ', decodedMessage.type);
        }
    });

    ws.on('close', (msg) => {
        delete activeConnections[id];
    })
})

app.listen(8000, () => {
    console.log('Server is listening port ' + port + '...');
})


