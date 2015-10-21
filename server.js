(function () {
  'use strict';

  var debug   = require('debug')('backend:server');
  var express = require('express');
  var http    = require('http');
  var app     = express();

  // ======================8<-------- cut here ---------------------------- //

  var port = normalizePort(process.env.PORT || '4000');
  app.set('port', port);

  var server = http.createServer(app);
  server.listen(port);
  server.on('error', onError);
  server.on('listening', onListening);

  var io = require('socket.io')(server);

  io.on('connection', function (socket) {
    var connectionId      = socket.id;
    var connectionAddress = socket.handshake.address;
    debug(connectionId + ' connection on ' + connectionAddress);

    socket.on('disconnect', function () {
      debug(connectionId + ' disconnected from ' + connectionAddress);
    });

    socket.on('slack::invite', function(data) {
      console.log(data);
    });

  });

  // ======================8<-------- cut here ---------------------------- //

  function normalizePort (value) {
    var port = parseInt(value, 10);

    // Named Pipe
    if (isNaN(port)) return value;

    // Port Number
    if (port >= 0) return port;

    return false;
  }

  // ======================8<-------- cut here ---------------------------- //

  function onError (error) {
    if (error.syscall !== 'listen') throw error;

    var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges.');
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use.');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  function onListening () {
    var address = server.address(),
        bind    = typeof address === 'string' ? 'pipe ' + address : 'port ' + address.port;

    debug('Listening on ' + bind);
  }
})();
