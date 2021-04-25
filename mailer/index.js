#!/usr/bin/env node
const Email = require('email-templates');
require('dotenv').config()
var amqp = require('amqplib/callback_api');

const email = new Email({
 message: {
   from: 'hi@example.com'
 },
 options: {
   open: false
 },
 send: true,
 transport: {
   host: 'smtp.mailtrap.io',
   port: 2525,
   ssl: false,
   tls: true,
   auth: {
     user: process.env.MAILTRAP_USER, // your Mailtrap username
     pass: process.env.MAILTRAP_PASS //your Mailtrap password
   }
 }
});

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    
    var queue = 'avaliado';
    

    channel.assertQueue(queue, {
      durable: false
    });

    channel.prefetch(1);

    channel.consume(queue, function(msg) {

      email
        .send({
          template: 'welcome',
          message: {
            to: 'teste@gmail.com'
          },
          locals: JSON.parse(msg.content.toString())
        })
        .then(console.log)
        .catch(console.error);
        
      setTimeout(() => {
          console.log(" [x] Done");
          channel.ack(msg);
      }, 2000);
        
    }, {
        noAck: false
    });
  });
});
