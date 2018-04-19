'use strict';

var kafka = require('kafka-node');
var Consumer = kafka.Consumer;
var Offset = kafka.Offset;
var Client = kafka.Client;

var program = require('commander');
 
program
  .version('0.1.0') // TODO use package versiob
  .option('-s, --start [topic]', 'start consumer for given topic', 'topic1')
  .option('-p, --partition [partition]', 'partition', 0)
  .parse(process.argv);

var topic = program.start;
var partition = 0;

var topics = [{ 
	topic: topic, 
	partition: 1 
}, { 
	topic: topic, 
	partition: 0 
}];

var client = new Client('localhost:2181');
var options = { 
  autoCommit: false, 
  fetchMaxWaitMs: 1000, 
  fetchMaxBytes: 1024 * 1024 
};

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