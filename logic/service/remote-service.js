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

    _getQuery: {
        value: function (criteria, type, selector) {
            
            var that = this,
                dataQueryJson = serialize(selector, require);
            // Debug serialize
            //console.log(dataQueryJson);
            //return Promise.resolve(encodeURIComponent(dataQueryJson));
            // Test deserialize
            console.log(dataQueryJson);

            return deserialize(dataQueryJson, require).then(function (dataQuery) {
                //console.log(dataQuery);
                return dataQueryJson;
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
                criteria = stream.query.criteria,
                type = stream.query.type,
                query = stream.query;

            var url = '/api/message';

            return self._getQuery(criteria, type, query).then(function (body) {
                return self.fetchHttpRawData(url, null, encodeURIComponent(body), false).then(function (data) {
                    if (data) {
                        self.addRawData(stream, [data], criteria);
                        self.rawDataDone(stream);
                    }
                }); 
            }); 
        }
    },

    // Create and update
    saveRawData: {
        value: function (rawData, object) {

            // TODO POST/PUT
            // this.rootService.createdDataObjects.has(object)
        }
    },

    // Delete
    deleteRawData: {
        value: function (rawData, object) {
            // TODO DELETE
        }
    }
});
