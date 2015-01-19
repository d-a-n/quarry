var _ = require("lodash");

module.exports = {

    initialize: function (options) {
        this.options = options;
    },

    allowed: function (record) {

        // validate blacklist
        if (this.options.blacklist.length > 0) {
            for (var key in this.options.blacklist) {
                var entry = this.options.blacklist[key].replace(".", "\.") + "$";
                if (record.match(entry)) {
                    return false;
                }
            }
        }

        // validate whitelist
        if (this.options.whitelist.length > 0) {
            for (var key in this.options.whitelist) {
                var entry = this.options.whitelist[key].replace(".", "\.") + "$";
                if (record.match(entry)) {
                    return true;
                }
            }
            return false;
        }
        return true;
    }
}
