const PATH = require("path");
const APP_PATH = process.env.APP_PATH || PATH.join(__dirname, ".");

var Montage = require('montage');

// TODO
// In progress - Load Service/Model/Mapping programaticly 
// Next - Load Via main.mjson

var montageRequire;
function getMontageRequire() {
    // Once only
    if (montageRequire) {
        return Promise.resolve(montageRequire);
    }

    return Montage.loadPackage(APP_PATH, {
        mainPackageLocation: APP_PATH
    }).then(function (require) {
        return (montageRequire = require);
    });
}

var mainService;
function getMainService() {
    return getMontageRequire().then(function (mr) {

        // Once only
        if (mainService) {
            return Promise.resolve(mainService);
        }
        
        return mr.async('montage/core/serialization/deserializer/montage-deserializer').then(function (module) {
            var Deserializer = module.MontageDeserializer;
            return mr.async('data/main.mjson').then(function (descriptor) {
                var deserializer = new Deserializer().init(descriptor, mr);
                return deserializer.deserializeObject();
            }); 
        });
    });
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

function getOperationFromData(data) {
    if (!data) {
        return Promise.reject('Missing Operation Data');
    }

    return getMontageRequire().then(function (mr) {
        return mr.async("montage/data/model/data-query").then(function (module) {
            var DataQuery = module.DataQuery;
            return mr.async("montage/core/criteria").then(function (module) {
                var Criteria = module.Criteria;
                return deserialize(data);
            });
        }); 
    });
}

function getDataOperationResponse(queryResult) {
    return serialize(queryResult).then(function (queryJson) {
        //console.log('getDataOperationResponse (serialized)', queryJson);
        return queryJson;
    });
}

exports.fetchData = function (query) {
    return getMainService().then(function (mainService) {
        return getOperationFromData(query).then(function (dataQuery) {
            //console.log('mainService.fetchData', dataQuery);
            return mainService.fetchData(dataQuery).then(function (queryResult) {
                return getDataOperationResponse(queryResult);
            });
        });
    });
};

exports.deleteDataObject = function (data) {
    return getMainService().then(function (mainService) {
        return getOperationFromData(data).then(function (dataObject) {
            //console.log('mainService.deleteDataObject', dataObject);
            return mainService.deleteDataObject(dataObject).then(function (result) {
                return getDataOperationResponse(dataObject);
            });
        });
    });
};

exports.saveDataObject = function (data) {
    return getMainService().then(function (mainService) {
        return getOperationFromData(data).then(function (dataObject) {
            //console.log('mainService.saveDataObject', dataObject);
            return mainService.saveDataObject(dataObject).then(function (result) {
                return getDataOperationResponse(dataObject);
            });
        });
    });
};