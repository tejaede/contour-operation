/* jshint node: true */
'use strict';

// [START main_body]
var express = require('express');  
var http = require('http');  
var io = require('socket.io');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');

const APP_PUBLIC_PATH = process.env.APP_PUBLIC_PATH || __dirname;
const APP_HOSTNAME = process.env.APP_HOSTNAME || 'localhost';
const APP_PORT = process.env.APP_PORT || '8080';

var app = express();  
var server = http.createServer(app);
var socket = io(server);

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    //use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(cors()); // support cross-origin
app.use(bodyParser.json()); // support json encoded body
app.use(bodyParser.urlencoded({extended: true})); // support encoded body

// Serve statics
app.use(express.static(APP_PUBLIC_PATH));

// Load controller
var main = require('./main');

//
// HTTP REST Routing 
// /api/data GET|POST|PUT|DELETE
//

function resultToHttpResponse(response, event, result) {
    response.header("Content-Type", "application/json");
    response.send(result);
    response.end();
}

app.route("/api/data")
    .get(function (req, res, next) {
        // GET query
        main.fetchData(req.query.query).then(function (result) {
          resultToHttpResponse(res, 'fetchData', result);
        }).catch(next);
    });

app.route("/api/data/save")
    .post(function (req, res, next) {
        // POST data
        main.saveDataObject(req.body.data).then(function (result) {
          resultToHttpResponse(res, 'saveDataObject', result);
        }).catch(next);
    });

app.route("/api/data/delete")
    .post(function (req, res, next) {
        // POST data
        main.deleteDataObject(req.body.data).then(function (result) {
          resultToHttpResponse(res, 'deleteDataObject', result);
        }).catch(next);
    });


//
// Socket Routing
//

var socketSubscriptions = new Map();
function broadcastsResultSubscriptions(event, data, clientSource) {
  console.log('[socket]', clientSource && clientSource.id, 'broadcastsResultSubscriptions', event);
  return Array.from(socketSubscriptions).filter(function (socketSubscription) {
    return clientSource && socketSubscription.id !== clientSource.id;
  }).map(function (socketSubscription) {
    return socket.to(socketSubscription.id).emit(event, data);
  });
}

function resultToSocketResponse(client, event, result) {
    // Preparse
    result = JSON.parse(result);

    client.emit(event, result);
    broadcastsResultSubscriptions(event, result, client);
}

socket.on('connection', function(client) {  

    function socketLog(event, msg) {
      console.log('[socket]', client.id, event, msg);
    }

    function socketError(err) {
      socketLog('error', err.stack || err);
      client.emit('error', err.message);
    }

    // Use socket to communicate with this particular client only, sending it it's own id
    client.emit('welcome', { 
      message: 'Welcome!', 
      time: Date.now(),
      id: client.id 
    });

    // Add socketSubscriptions
    client.on('subscribe', function(data) {
        socketLog('subscribe');

        // Get current subscription data or create
        var currentData = socketSubscriptions.get(client.id) || {
          id: client.id
        };

        // Store subscription
        socketSubscriptions.set(client.id, Object.assign(currentData, data));

        // Remove socketSubscriptions on disconnected
        client.on('disconnected', function(client) {
          socketLog('disconnected');
          socketSubscriptions.delete(client.id);
        });

        client.on('unsubscribe', function(data) {
          socketLog('unsubscribe');
            socketSubscriptions.delete(client.id);
        });
    });

    client.on('fetchData', function (data) {
      socketLog('fetchData');
      main.fetchData(data).then(function (result) {
        resultToSocketResponse(client, 'fetchData', result);
      }, socketError);
    });

    client.on('saveDataObject', function (data) {
      socketLog('saveDataObject');
      main.saveDataObject(data).then(function (result) {
        resultToSocketResponse(client, 'saveDataObject', result);
      }, socketError);
    });

    client.on('deleteDataObject', function (data) {
      socketLog('deleteDataObject');
      main.deleteDataObject(data).then(function (result) {
        resultToSocketResponse(client, 'deleteDataObject', result);
      }, socketError);
    });
});


// Handle error
app.use(function (err, req, res, next) {
  console.error("error", err.stack || err);
  res.status(500);
  res.end(err.messag || err);  
});

// Start Service endpoint

server.on('error', function (err) {
  // Handle your error here
  console.error("error", err.stack || err);
});

server.on('listening', function (e) {
  console.log(`Server Listening on: ${APP_HOSTNAME}:${APP_PORT}`); 
});

server.listen(APP_PORT);


// Expose app
module.exports = app; // for testing
// [END main_body]
