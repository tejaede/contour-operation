var Montage = require("montage").Montage;

/**
 * @class
 * @extends external:Montage
 */
exports.Person = Montage.specialize(/** @lends Message.prototype */ {

    /**
     * The unique identifier for this message
     * @type {number}
     */
    id: {
        value: undefined
    },

    /**
     * The person's name.
     * @type {string}
     */
    name: {
        value: undefined
    },

    created: {
        value: undefined
    },

    updated: {
        value: undefined
    }
});
