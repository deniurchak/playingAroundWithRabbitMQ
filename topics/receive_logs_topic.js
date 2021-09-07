#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var args = process.argv.slice(2);

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'topic_exchange';

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: true
    }, function(error2, q) {
      if(error2) {
        throw error2
      }
      console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);

      args.forEach(function(key) {
              channel.bindQueue(q.queue, exchange, key);
            });

      channel.consume(q.queue, function(msg) {
        if(msg.content) {
          console.log(" [x] Received %s", msg.fields.routingKey, msg.content.toString());
        }
      }, {
          noAck: true 
        });
    });
  });
});

