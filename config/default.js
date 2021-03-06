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

    "statsd-host": {
        help: "Address of statsd server",
        metavar: "HOST",
        required: false
    },

    "statsd-port": {
        help: "Port statsd server listens on",
        metavar: "PORT",
        default: 8125
    },

    "log-level": {
        abbr: "l",
        help: "Log level",
        metavar: "LEVEL",
        choices: ["silly", "debug", "verbose", "info", "warn", "error"],
        default: "info"
    },

    "blacklist": {
        abbr: "b",
        help: "Comma seperated list of TLDs/hostnames you don't want clients to set. e.g. --blacklist=.com,.example.org",
        metavar: "BLACKLIST",
        transform: function(blacklist) {
            return blacklist.trim().split(",");
        },
        default: []       
    },

    "whitelist": {
        abbr: "w",
        help: "Comma seperated list of TLDs/hostnames you want your service be limited to e.g. --whitelist=.dev,.development.corp",
        metavar: "WHITELIST",
        transform: function(whitelist) {
            return whitelist.trim().split(",");
        },
        default: []       
    }
}
