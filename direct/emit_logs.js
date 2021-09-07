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
    var exchange = 'direct_exchange';
    var args = process.argv.slice(2);
    var severity = (args.length > 0) ? args[0] : 'info';
    var msg = process.argv.slice(2).join(' ') || "Hello World!";

    channel.assertExchange(exchange, 'direct', {
      durable: false 
    });

    channel.publish(exchange, severity, Buffer.from(msg), {
      persistent: true
    });
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
    }, 500);
});

