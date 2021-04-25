#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    
    var queue = 'pedidos';

    channel.assertQueue(queue, {
      durable: false
    });

    channel.prefetch(1);

    channel.consume(queue, function(msg) {

      var status = Math.floor(Math.random() * 10) >= 5;

      if (status) {
        aprovedHandler(channel, JSON.parse(msg.content.toString()));
      } else {
        rejectedHandler(channel, JSON.parse(msg.content.toString()));
      }
        
      setTimeout(() => {
          console.log(" [x] Done");
          channel.ack(msg);
      }, 2000);
        
    }, {
        noAck: false
    });
  });
});

function aprovedHandler(channel, message) {
  const queue = 'avaliado';
  channel.assertQueue(queue, {
    durable: false
  });

  var msg = {
    data: message.data,
    name: message.name,
    message: message.message,
    status: "aprovado"
  };

  channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
  console.log(" [x] Aprovado %s", JSON.stringify(msg));
}

function rejectedHandler(channel, message) {
  const queue = 'avaliado';
  channel.assertQueue(queue, {
    durable: false
  });

  var msg = {
    data: message.data,
    name: message.name,
    message: message.message,
    status: "rejeitado"
  };
  
  channel.sendToQueue(queue, Buffer.from(JSON.stringify(msg)));
  console.log(" [x] Rejeitado %s", JSON.stringify(msg));
}