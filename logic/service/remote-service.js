var HttpService = require("montage/data/service/http-service").HttpService,
    Promise = require("montage/core/promise").Promise;

var serialize = require("montage/core/serialization/serializer/montage-serializer").serialize;
var deserialize = require("montage/core/serialization/deserializer/montage-deserializer").deserialize;

/**
 * Provides Message
 *
 * @class
 * @extends external:HttpService
 */
exports.RemoteService = HttpService.specialize(/** @lends MessageService.prototype */ {

    // TODO
    // Cause Can\'t fetch data of unknown type
    // Need to me module not object
    /*
    types: {
        value: [Message]
    },

    MessageMapping: {
        value: null
    },
    */

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

    // Get and query
    fetchRawData: {
        value: function (stream) {
            var self = this,
                query = stream.query,
                url = '/api/data';

            return self._serialize(query).then(function (queryJSON) {
                //console.log('fetchRawData', queryJSON);
                url += '?query=' + encodeURIComponent(queryJSON);
                return self.fetchHttpRawData(url, null, null, false).then(function (data) {
                    if (data) {
                        self.addRawData(stream, [data]);
                        self.rawDataDone(stream);
                    }
                }); 
            }); 
        }
    },

    // Create and update
    saveRawData: {
        value: function (rawData, object) {
            var self = this,
                url = '/api/data';

            // TODO POST/PUT
            var queryObject = Object.create(object);
            self._mapRawDataToObject(rawData, queryObject);

            return self._serialize(queryObject).then(function (queryJSON) {
                //console.log('saveRawData', queryJSON);

                var headers = {
                        "Content-Type": "application/json"
                    },
                    body = JSON.stringify({
                        data: queryJSON
                    });

                return self.fetchHttpRawData(url, headers, body, false).then(function (remoteObjectJSON) {
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
                url = '/api/data/delete';

            // TODO DELETE
            return self._serialize(object).then(function (queryJSON) {
                console.log('deleteRawData', queryJSON);

                var headers = {
                        "Content-Type": "application/json"
                    },
                    body = JSON.stringify({
                        data: queryJSON
                    });

                return self.fetchHttpRawData(url, headers, body, false).then(function (remoteObjectJSON) {
                    return self._deserialize(remoteObjectJSON).then(function (remoteObject) {
                        return self._mapRawDataToObject(remoteObject, object);
                    });
                });
            }); 
        }
    }
});
