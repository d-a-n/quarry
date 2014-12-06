var _ = require("lodash");
var winston = require("winston");

module.exports = {

    // logging client
    logger: null,

    // initialize
    initialize: function(options){
        this.logger = new(winston.Logger);

        this.logger.add(winston.transports.Console, {
            level: options["log-level"],
            colorize: true
        });
    },

    // write a log
    log: function(level, message){
        this.logger.log(level, message);
    }

}
