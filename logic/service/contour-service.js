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
    save: function (value) {

        // Update rawData
        if (!value.id) {
            AUTO_INCREMENT_ID++;
            value.id = AUTO_INCREMENT_ID;
            value.created = Date.now();
        } else {
            value.updated = Date.now();
        }

        return Promise.resolve(STORE.set(value.id, value)).then(function () {
            return value;
        });
    },
    get: function (key) {
        return Promise.resolve(STORE.get(key));  
    },
    delete: function (key) {
        return Promise.resolve(STORE.delete(key));   
    }
};

var Contour = require('logic/model/contour-model');

/**
 * Provides Contour
 *
 * @class
 * @extends external:HttpService
 */
exports.ContourService = HttpService.specialize(/** @lends ContourService.prototype */ {

    // TODO
    // Cause Can\'t fetch data of unknown type
    // Need to me module not object
    /*
    types: {
        value: [Contour]
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
            var self = this;
            // Update store
            return dataStore.save(rawData).then(function (rawData) {
                return object ? self._mapRawDataToObject(rawData, object) : rawData;
            });
        }
    },

    // Delete
    deleteRawData: {
        value: function (rawData, object) {
            return dataStore.delete(rawData.id);
        }
    }
});
