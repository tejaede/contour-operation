var HttpService = require("montage/data/service/http-service").HttpService,
    Promise = require("montage/core/promise").Promise;

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
    },

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
    
    //==========================================================================
    // Entry points
    //==========================================================================

    // Get and query
    fetchRawData: {
        value: function (stream) {
            var self = this,
                query = stream.query,
                criteria = query.criteria,
                parameters = criteria.parameters;

            if (parameters && parameters.id) {
                return dataStore.filterBy('id', parameters.id).then(function (rawData) {
                    self.addRawData(stream, rawData);
                    self.rawDataDone(stream); 
                });
            } else {
                return dataStore.all().then(function (rawData) {
                    self.addRawData(stream, rawData);
                    self.rawDataDone(stream);
                });
            }
        }
    },

    // Create and update
    saveRawData: {
        value: function (rawData, object) {

            // Update rawData
            if (this.rootService.createdDataObjects.has(object)) {

                AUTO_INCREMENT_ID++;
                rawData.id = AUTO_INCREMENT_ID;
                rawData.created = Date.now();

                //Object.assign(object, rawData);

            } else {
                rawData.updated = Date.now();
            }

            // Update store
            return dataStore.set(rawData.id, rawData).then(function () {
                return Promise.resolve(rawData);                
            });

        }
    },

    // Delete
    deleteRawData: {
        value: function (rawData, object) {
            return dataStore.delete(rawData.id).then(function () {
                return Promise.resolve(rawData); 
            });
        }
    }
});
