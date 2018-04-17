process.env.NODE_ENV = 'test';

var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);

global.chai = chai;
global.should = chai.should();
global.expect = chai.expect;


var io = require('socket.io-client');
global.io = io;

require('./spec/message-service-spec');
require('./spec/message-service-ws-spec');