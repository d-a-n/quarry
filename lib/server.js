var dns = require("native-dns");
var _ = require("lodash");
var logger = require([__dirname, "logger"].join("/"));

// Server object
function Server(options){
    var self = this;

    // initialize server and options
    this.server = dns.createServer();
    this.options = options;

    // initialize persistence layer
    this.persistence = require([__dirname, "..", "persistence", _.first(options._)].join("/"));
    this.persistence.initialize(options);

    // listen for requests
    this.server.on("request", function(req, res){
        var query = req.question[0].name;

        // check if record exists
        if(_.has(self.records, query)){
            res.answer = self.records[query];
            res.send();
        }

        // proxy to upstream server if one is configured
        else if(_.keys(self.forwarders).length > 0){
            var forwarder = self.get_forwarder(query);

            forwarder.on("timeout", function(){
                logger.log("verbose", "Timed out fetching from upstream DNS server");
                logger.log("debug", ["Record: ", query, ", Server: ", forwarder.server.address].join(""));
                res.send();
            });

            forwarder.on("message", function(err, answer){
                res.answer = answer.answer;
                res.send();
            });

            forwarder.send();
        }

        // respond with no answer
        else
            res.send();
    });

    // listen for errors
    this.server.on("error", function(err, buff, req, res){
        logger.log("error", err.message);
    });

    // update configuration on interval
    this.update_configuration();

    setInterval(function(){
        self.update_configuration();
    }, this.options["reconciliation-interval"]);
}

// get an upstream DNS server
Server.prototype.get_forwarder = function(query){
    var forwarder_name = _.sample(_.keys(this.forwarders));
    var forwarder = this.forwarders[forwarder_name];

    var request = dns.Request({
        question: dns.Question({
            name: query,
            type: "A"
        }),

        server: {
            address: forwarder_name,
            port: forwarder.port,
            type: "udp"
        },

        timeout: forwarder.timeout
    });

    return request;
}

// update configuration from backend
Server.prototype.update_configuration = function(){
    var self = this;
    logger.log("verbose", "Updating configuration");

    this.persistence.get_configuration(function(err, configuration){
        if(err)
            logger.log("error", err.message);
        else{
            self.forwarders = configuration.forwarders;
            var records = {};
            _.each(configuration.records, function(record, name){
                if(!_.isArray(record.address))
                    record.address = [record.address]

                records[name] = _.map(record.address, function(addr){
                    return dns[record.type]({
                        name: name,
                        address: addr,
                        ttl: record.ttl || 60
                    });
                });
            });
            self.records = records;
            logger.log("verbose", [_.keys(self.forwarders).length, "known forwarders"].join(" "));
            logger.log("debug", ["Forwarders:", _.keys(self.forwarders).join(", ")].join(" "));
            logger.log("verbose", [_.keys(self.records).length, "known records"].join(" "));
            logger.log("debug", ["Records:", _.keys(self.records).join(", ")].join(" "));
        }
    });
}

// start listening
Server.prototype.listen = function(){
    this.server.serve(this.options.port);
    logger.log("info", ["DNS server listening on", [this.options.interface, this.options.port].join(":")].join(" "));
}

module.exports = Server;
