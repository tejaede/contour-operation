var HttpService = require("montage/data/service/http-service").HttpService,
    Promise = require("montage/core/promise").Promise;

/*
// Producer
// TODO
var kafka = require('kafka-node');
var Producer = kafka.Producer;
var KeyedMessage = kafka.KeyedMessage;
var Client = kafka.Client;
var client = new Client('localhost:2181');
var argv = require('optimist').argv;
var topic = argv.topic || 'topic1';
var p = argv.p || 0;
var a = argv.a || 0;
var producer = new Producer(client, { requireAcks: 1 });

producer.on('ready', function () {
  var message = 'a message';
  var keyedMessage = new KeyedMessage('keyed', 'a keyed message');

  producer.send([
    { topic: topic, partition: p, messages: [message, keyedMessage], attributes: a }
  ], function (err, result) {
    console.log(err || result);
    process.exit();
  });
});

producer.on('error', function (err) {
  console.log('error', err);
});

// Consumer
// TODO
var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var Client = kafka.Client;
var argv = require('optimist').argv;
var topic = argv.topic || 'topic1';

var client = new Client('localhost:2181');
var topics = [{ topic: topic, partition: 1 }, { topic: topic, partition: 0 }];
var options = { autoCommit: false, fetchMaxWaitMs: 1000, fetchMaxBytes: 1024 * 1024 };

var consumer = new Consumer(client, topics, options);
var offset = new Offset(client);

consumer.on('message', function (message) {
  console.log(message);
});

consumer.on('error', function (err) {
  console.log('error', err);
});

/*
* If consumer get `offsetOutOfRange` event, fetch data from the smallest(oldest) offset
*/
consumer.on('offsetOutOfRange', function (topic) {
  topic.maxNum = 2;
  offset.fetch([topic], function (err, offsets) {
    if (err) {
      return console.error(err);
    }
    var min = Math.min.apply(null, offsets[topic.topic][topic.partition]);
    consumer.setOffset(topic.topic, topic.partition, min);
  });
});

*/

/**
 * Provides Message
 *
 * @class
 * @extends external:HttpService
 */
exports.HttpServerService = HttpService.specialize(/** @lends MessageService.prototype */ {

    constructor: {
        value: function HttpServerService() {

        }
    }
});
