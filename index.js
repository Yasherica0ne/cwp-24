const express = require('express');
const socketio = require('socket.io');
const app = express();
const http = require('http');
const Worker = require('./worker');

const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('./public'));
const worker = new Worker();
worker.working();

io.on('connection', client => {
    client.join('Buy');
    client.join('Sell');
    let currency;
    let interval;
    client.on('setData', data => {
        currency = data.currency;
        interval = data.interval;
        setInterval(() => {
            const currencyData = worker.getData();
            client.emit('btc', currencyData[currency])
        }, interval);
    }); 

    client.on('sendMessage', messageObj => {
        const { room } = messageObj;
        client.nsp.to(room).emit('getMessage', messageObj);
    });

    client.on('setCurrency', data => {
        currency = data;
    });

    client.on('setInterval', data => {
        interval = parseInt(data) * 1000;
    });
});

server.listen(3000, 'localhost', () => {
    console.log('Server is running');
  })