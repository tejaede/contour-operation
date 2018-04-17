var HttpService = require("montage/data/service/http-service").HttpService,
    Promise = require("montage/core/promise").Promise;

var STORE = Map.from({
    42: {
        "id": 42,
        "subject": "You've got mail",
        "text": "Hello World!",
        "updated": void 0,
        "created": Date.now()
    }
});

var AUTO_INCREMENT_ID = 43;

var dataStore = {
    all: function () {
        return Promise.resolve(Array.from(STORE));
    },
    filterBy: function (prop, value) {
        return Promise.resolve(Array.from(STORE).filter(function (rawDataEntry) {
            return rawDataEntry[prop] === value;
        }));
    },
    set: function (key, value) {
        return Promise.resolve(STORE.set(key, value));
    },
    get: function (key) {
        return Promise.resolve(STORE.get(key));  
    },
    delete: function (key) {
        return Promise.resolve(STORE.delete(key));   
    }
};

var Message = require('logic/model/message-model');

/**
 * Provides Message
 *
 * @class
 * @extends external:HttpService
 */
exports.MessageService = HttpService.specialize(/** @lends MessageService.prototype */ {

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

            //console.log('fetchRawData', parameters);

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

                // WHY why ?
                //Object.assign(object, rawData);

            } else {
                rawData.updated = Date.now();

                // WHY why ?
                //object.updated = rawData.updated;
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
