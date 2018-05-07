var Montage = require("montage").Montage;

/**
 * @class
 * @extends external:Montage
 */
exports.Contour = Montage.specialize(/** @lends Contour.prototype */ {

    /**
     * The unique identifier for this contour
     * @type {number}
     */
    id: {
        value: undefined
    },

    /**
     * The contour's subject.
     * @type {string}
     */
    subject: {
        value: undefined
    },

    /**
     * The contour's text.
     * @type {string}
     */
    text: {
        value: undefined
    },

    created: {
        value: undefined
    },

    updated: {
        value: undefined
    }

}, {
    /**
     * The Montage Data type of features.
     *
     * @type {external:ObjectDescriptor}
     */
    objectPrototype: {
        get: function () {
            return exports.Contour;
        }
    }
});
