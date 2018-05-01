var Montage = require("montage").Montage,
    HttpService = require("montage/data/service/http-service").HttpService,
    RawDataService = require("montage/data/service/raw-data-service").RawDataService,
    Promise = require("montage/core/promise").Promise;

var serialize = require("montage/core/serialization/serializer/montage-serializer").serialize;
var deserialize = require("montage/core/serialization/deserializer/montage-deserializer").deserialize;
var io = require('socket.io-client/dist/socket.io');

/**
 * Provides AbstractRemoteService
 *
 * @class
 * @extends external:AbstractRemoteService
 */
exports.AbstractRemoteService = {

   _serialize: {
        value: function (dataObject) {
            
            var self = this,
                objectJSON = serialize(dataObject, require);
            return self._deserialize(objectJSON).then(function () {
                //console.log('_serialize', objectJSON, dataObject);
                return objectJSON;
            });
        }
    },

    _deserialize: {
        value: function (objectJSON) {
            return deserialize(objectJSON, require).then(function (dataObject) {
                //console.log('_deserialize', objectJSON, dataObject);
                return dataObject;
            });
        }
    },
    
    //==========================================================================
    // Entry points
    //==========================================================================

    _performOperation: {
        value: function (action, data) {
            return Promise.reject('Not Implemented');
        }
    },

    // Get and query
    fetchRawData: {
        value: function (stream) {
            var self = this,
                query = stream.query,
                action = 'fetchData';
            return self._serialize(query).then(function (queryJSON) {
                return self._performOperation(action, queryJSON).then(function (remoteDataJson) {
                    return self._deserialize(remoteDataJson).then(function (remoteData) {
                        stream.addData(remoteData);
                        stream.dataDone();
                    });
                }); 
            }); 
        }
    },

    // Create and update
    saveRawData: {
        value: function (rawData, object) {
            var self = this,
                action = 'saveDataObject';
            return self._serialize(object).then(function (dataObjectJSON) {
                return self._performOperation(action, dataObjectJSON).then(function (remoteObjectJSON) {
                    return self._deserialize(remoteObjectJSON).then(function (remoteObject) {
                        return self._mapRawDataToObject(remoteObject, object);
                    });
                });
            }); 
        }
    },

    // Delete
    deleteRawData: {
        value: function (rawData, object) {
            var self = this,
                action = 'deleteDataObject';
            return self._serialize(object).then(function (dataObjectJSON) {
                return self._performOperation(action, dataObjectJSON);
            }); 
        }
    }
};

/*
 * Provides RemoteService and  HttpRemoteService
 *
 * @class
 * @extends external:RemoteService
 */
exports.HttpRemoteService = HttpService.specialize(exports.AbstractRemoteService).specialize(/** @lends RemoteService.prototype */ {

    _baseUrl: {
        value: '/api/data'
    },

    _actionsToPaths: {
        value: {
            'fetchData': '',
            'saveDataObject': '/save',
            'deleteDataObject': '/delete'
        }
    },

    constructor: {
        value: function HttpRemoteService() {
            // TODO opts
        }
    },

    _performOperation: {
        value: function (action, data) {
            var body, url, headers, 
                self = this;

            if (!self._actionsToPaths.hasOwnProperty(action)) {
                return Promise.reject('Invalid action "' + action + '"');
            } else if (!data) {
                return Promise.reject('Missing or invalid data');
            }
            
            url = self._baseUrl + self._actionsToPaths[action];

            if (action !== 'fetchData') {
                headers = {
                    "Content-Type": "application/json"
                };
                body = JSON.stringify({
                    data: data
                });
            } else {
                url += '?query=' + encodeURIComponent(data);
            }   

            return self.fetchHttpRawData(url, headers, body, false);
        }  
    } 
});

/*
 * Provides WebSocketRemoteService
 *
 * @class
 * @extends external:WebSocketRemoteService
 */
exports.WebSocketRemoteService = RawDataService.specialize(exports.AbstractRemoteService).specialize(/** @lends WebSocketRemoteService.prototype */ {

    _baseUrl: {
        value: ''
    },

    _socket: {
        value: null
    },

    _socketOptions: {
        value: {
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionDelayMax : 5000,
            reconnectionAttempts: Infinity
        }
    },

    constructor: {
        value: function WebSocketRemoteService() {
            this._getSocket();
        }
    },

    _getSocket: {
        value: function () { 
            var self = this;
            return self._socket ? self._socket : (self._socket = new Promise(function (resolve, reject) {  
                // Setup
                var socket = io.connect(self._baseUrl, self._socketOptions);
                socket.on('connect', function() {
                    // TODO
                    //console.log('worked...');
                });
                socket.on('disconnect', function() {
                    // TODO
                    //console.log('disconnected...');
                });

                socket.on('fetchData', function() {
                    // TODO
                    // dispatch result ? on main root service
                });

                socket.on('saveDataObject', function() {
                    // TODO
                    // dispatch on main root service
                });

                socket.on('deleteDataObject', function() {
                    // TODO
                    // dispatch on main root service
                });

                resolve(socket);
            }));
        }
    },

    _performOperation: {
        value: function (action, data) {
            var self = this;
            return self._getSocket().then(function (socket) {
                return new Promise(function (resolve, reject) {  
                    socket.emit(action, data, function(res) {
                        // TODO handle error reject     
                        resolve(res);
                    }); 
                });
            });
        }
    }
});

/*
 * Provides WorkerRemoteService
 *
 * @class
 * @extends external:WorkerRemoteService
 */
exports.WorkerRemoteService = RawDataService.specialize(exports.AbstractRemoteService).specialize(/** @lends WorkerRemoteService.prototype */ {

    constructor: {
        value: function WorkerRemoteService() {
            this._getWorker();
        }
    },

    _getWorker: function () {

    },

    _performOperation: function () {

    }
});

exports.RemoteService = exports.HttpRemoteService;
//exports.RemoteService = exports.WebSocketRemoteService;
