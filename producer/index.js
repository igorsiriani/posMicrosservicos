#!/usr/bin/env node
var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
    if (error0) {
        console.error('error', error0);
        return;
    }
    console.log('connection success');
    connection.createChannel(function(error1, channel) {
        if (error1) {
            console.error('error', error1);
            return;
        }
        console.log('channel success');
        var queue = 'pedidos';
        channel.assertQueue(queue, {
            durable: false        });
        setInterval(() => {
            var msg = {
                data: new Date().toISOString(),
                name: "Igor",
                message: "Mensagem produzida"
            };
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
            console.log(" [x] Sent %s", msg);
        }, 6000);
    });
});