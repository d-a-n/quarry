module.exports = {
    version: {
        flag: true,
        abbr: "v",
        help: "Print version and exit",
        callback: function(){
            return pkg.version;
        }
    },

    "reconciliation-interval": {
        help: "Interval on which to update DNS records",
        metavar: "INTERVAL",
        default: 60000
    },

    interface: {
        abbr: "i",
        help: "Interface to listen on for DNS queries",
        metavar: "INTERFACE",
        default: "0.0.0.0"
    },

    port: {
        abbr: "p",
        help: "Port to listen on for DNS queries",
        metavar: "PORT",
        default: 53
    },

    "api-interface": {
        help: "Interface to listen on for API requests",
        metavar: "INTERFACE",
        default: "0.0.0.0"
    },

    "api-port": {
        help: "Port to listen on for API requests",
        metavar: "PORT",
        default: 5353
    },

    "log-level": {
        abbr: "l",
        help: "Log level",
        metavar: "LEVEL",
        choices: ["silly", "debug", "verbose", "info", "warn", "error"],
        default: "info"
    }
}