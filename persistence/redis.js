var fs = require("fs");
var _ = require("lodash");
var redis = require("redis");
var async = require("async");

module.exports = {

    initialize: function(options, fn){
        this.options = options;
        this.client = redis.createClient(options["redis-port"], options["redis-host"]);
        return fn();
    },

    get_configuration: function(fn){
        var self = this;

        var configuration = {};
        async.parallel([
            function(cb){
                self.client.hgetall(["quarry", "records"].join(":"), function(err, records){
                    configuration.records = {};
                    _.each(records, function(record, name){
                        try{
                            configuration.records[name] = JSON.parse(record);
                        }
                        catch(err){}
                    });
                    return cb();
                });
            },
            function(cb){
                self.client.hgetall(["quarry", "forwarders"].join(":"), function(err, forwarders){
                    configuration.forwarders = {};
                    _.each(forwarders, function(forwarder, name){
                        try{
                            configuration.forwarders[name] = JSON.parse(forwarder);
                        }
                        catch(err){}
                    });
                    return cb();
                });
            }
        ], function(err){
            return fn(err, configuration);
        });
    },

    create_record: function(name, record, fn){
        var self = this;

        this.client.hexists(["quarry", "records"].join(":"), name, function(err, exists){
            if(err)
                return fn({code: 400, body: err.message});
            else if(exists != 0)
                return fn({code: 400, body: "Record already exists!"});
            else{
                self.client.hset(["quarry", "records"].join(":"), name, JSON.stringify(record), function(err){
                    if(err)
                        return fn({code: 400, body: err.message});
                    else
                        return fn();
                });
            }
        });
    },

    update_record: function(name, record, fn){
        var self = this;

        this.client.hexists(["quarry", "records"].join(":"), name, function(err, exists){
            if(err)
                return fn({code: 400, body: err.message});
            else if(exists == 0)
                return fn({code: 404});
            else{
                self.client.hset(["quarry", "records"].join(":"), name, JSON.stringify(record), function(err){
                    if(err)
                        return fn({code: 400, body: err.message});
                    else
                        return fn();
                });
            }
        });
    },

    delete_record: function(name, fn){
        var self = this;

        this.client.hexists(["quarry", "records"].join(":"), name, function(err, exists){
            if(err)
                return fn({code: 400, body: err.message});
            else if(exists == 0)
                return fn({code: 404});
            else{
                self.client.hdel(["quarry", "records"].join(":"), name, function(err){
                    if(err)
                        return fn({code: 400, body: err.message});
                    else
                        return fn();
                });
            }
        })
    },

    create_forwarder: function(name, forwarder, fn){
        var self = this;

        this.client.hexists(["quarry", "forwarders"].join(":"), name, function(err, exists){
            if(err)
                return fn({code: 400, body: err.message});
            else if(exists != 0)
                return fn({code: 400, body: "Forwarder already exists!"});
            else{
                self.client.hset(["quarry", "forwarders"].join(":"), name, JSON.stringify(forwarder), function(err){
                    if(err)
                        return fn({code: 400, body: err.message});
                    else
                        return fn();
                });
            }
        });
    },

    update_forwarder: function(name, record, fn){
        var self = this;

        this.client.hexists(["quarry", "forwarders"].join(":"), name, function(err, exists){
            if(err)
                return fn({code: 400, body: err.message});
            else if(exists == 0)
                return fn({code: 404});
            else{
                self.client.hset(["quarry", "forwarders"].join(":"), name, JSON.stringify(record), function(err){
                    if(err)
                        return fn({code: 400, body: err.message});
                    else
                        return fn();
                });
            }
        });
    },

    delete_forwarder: function(name, fn){
        var self = this;

        this.client.hexists(["quarry", "forwarders"].join(":"), name, function(err, exists){
            if(err)
                return fn({code: 400, body: err.message});
            else if(exists == 0)
                return fn({code: 404});
            else{
                self.client.hdel(["quarry", "forwarders"].join(":"), name, function(err){
                    if(err)
                        return fn({code: 400, body: err.message});
                    else
                        return fn();
                });
            }
        });
    }

}
