var HttpService = require("montage/data/service/http-service").HttpService,
    Promise = require("montage/core/promise").Promise;

/*
// Producer
// TODO
var topic = 'topic1';
var partition = 0;
var attributes = 0;

var message = program.message;
var keyedMessage = new KeyedMessage(program.key, message);

var client = new Client('localhost:2181');
var producer = new Producer(client, { 
  requireAcks: 1 
});

producer.on('ready', function () {
  producer.send([
    { 
    topic: topic, 
    partition: partition, 
    messages: [
      message, 
      keyedMessage
    ], 
    attributes: attributes
  }
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
var topic = argv.topic || 'topic1';
var topics = [{ 
  topic: topic, partition: 1 
}, { 
  topic: topic, 
  partition: 0 
}];

var client = new Client('localhost:2181');
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
});e.log('error', err);
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
