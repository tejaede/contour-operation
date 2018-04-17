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
    }
});
