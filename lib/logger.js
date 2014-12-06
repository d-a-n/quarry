var _ = require("lodash");
var winston = require("winston");

module.exports = {

    // logging client
    logger: null,

    // initialize
    init: function(log_level){
        this.logger = new(winston.Logger);

        this.logger.add(winston.transports.Console, {
            level: log_level,
            colorize: true
        });
    },

    // write a log
    log: function(level, message){
        this.logger.log(level, message);
    }

}
