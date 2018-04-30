/* jshint node: true */
'use strict';

// [START main_body]
var Montage = require('montage');

const PATH = require("path");
const APP_PATH = process.env.APP_PATH || PATH.join(__dirname, ".");

var montageRequire;
function getMontageRequire() {
    // Next call with wait on same promise
    return montageRequire ? montageRequire : (montageRequire = Montage.loadPackage(APP_PATH, {
        mainPackageLocation: APP_PATH
    }));
}

var mainService;
function getMainService() {
    // Next call with wait on same promise
    return mainService ? mainService : (mainService = getMontageRequire().then(function (mr) {
        return mr.async('montage/core/serialization/deserializer/montage-deserializer').then(function (module) {
            var Deserializer = module.MontageDeserializer;
            return mr.async('data/main.mjson').then(function (descriptor) {
                var deserializer = new Deserializer().init(descriptor, mr);
                return deserializer.deserializeObject();
            }); 
        });
    }));
}

function serialize(object) {
    return getMontageRequire().then(function (mr) {
        return mr.async('montage/core/serialization/serializer/montage-serializer').then(function (module) {
            return module.serialize(object, mr); 
        });
    });
}

function deserialize(data) {
    return getMontageRequire().then(function (mr) {
        return mr.async('montage/core/serialization/deserializer/montage-deserializer').then(function (module) {
            return module.deserialize(data, mr); 
        });
    });
}

// Deserialize data to query or object
// TODO wrap in operation or receive operation
function getOperationFromData(data) {
    if (!data) {
        return Promise.reject('Missing Operation Data');
    }
    return deserialize(data);
}

// Serialize data to query result or object
// TODO wrap in operation or receive operation
function getDataOperationResponse(queryResult) {
    return serialize(queryResult);
}

// Perform fetchData operation
exports.fetchData = function (query) {
    return getOperationFromData(query).then(function (dataQuery) {
        return getMainService().then(function (mainService) {
            //console.log('mainService.fetchData', dataQuery);
            return mainService.fetchData(dataQuery).then(function (queryResult) {
                return getDataOperationResponse(queryResult);
            });
        });
    });
};

// Perform deleteDataObject operation
exports.deleteDataObject = function (data) {
    return getOperationFromData(data).then(function (dataObject) {
        return getMainService().then(function (mainService) {
            //console.log('mainService.deleteDataObject', dataObject);
            return mainService.deleteDataObject(dataObject).then(function (result) {
                return getDataOperationResponse(dataObject);
            });
        });
    });
};


// Perform saveDataObject operation
exports.saveDataObject = function (data) {
    return getOperationFromData(data).then(function (dataObject) {
        return getMainService().then(function (mainService) {
            //console.log('mainService.saveDataObject', dataObject);
            return mainService.saveDataObject(dataObject).then(function (result) {
                return getDataOperationResponse(dataObject);
            });
        });
    });
};