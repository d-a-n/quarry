var fs = require("fs");
var _ = require("lodash");
var AWS_SDK= require("aws-sdk");
var async = require("async");

module.exports = {

    initialize: function(options, fn){
        var self = this;
        this.options = options;

        AWS_SDK.config.update({
            region: options.region,
            credentials: {
                accessKeyId: options["access-key-id"],
                secretAccessKey: options["secret-access-key"]
            }
        });

        this.s3 = new AWS_SDK.S3();

        async.parallel([
            function(cb){
                self.s3.getObject({Bucket: self.options.bucket, Key: "records"}, function(err, records){
                    if(err && err.code == "NoSuchKey"){
                        self.s3.putObject({
                            Bucket: self.options.bucket,
                            Key: "records",
                            Body: JSON.stringify({}),
                            ContentType: "application/json"
                        }, function(err){
                            return cb();
                        });
                    }
                });
            },
            function(cb){
                self.s3.getObject({Bucket: self.options.bucket, Key: "forwarders"}, function(err, forwarders){
                    if(err && err.code == "NoSuchKey"){
                        self.s3.putObject({
                            Bucket: self.options.bucket,
                            Key: "forwarders",
                            Body: JSON.stringify({}),
                            ContentType: "application/json"
                        }, function(err){
                            return cb();
                        });
                    }
                });
            }
        ], function(err){
            return fn();
        });
    },

    get_configuration: function(fn){
        var self = this;

        var configuration = {};
        async.parallel([
            function(cb){
                self.s3.getObject({Bucket: self.options.bucket, Key: "records"}, function(err, records){
                    if(err)
                        configuration.records = {};
                    else{
                        try{
                            configuration.records = JSON.parse(records.Body);
                        }
                        catch(err){
                            configuration.records = {};
                        }
                    }
                    return cb();
                });
            },
            function(cb){
                self.s3.getObject({Bucket: self.options.bucket, Key: "forwarders"}, function(err, forwarders){
                    if(err)
                        configuration.forwarders = {};
                    else{
                        try{
                            configuration.forwarders = JSON.parse(forwarders.Body);
                        }
                        catch(err){
                            configuration.forwarders = {};
                        }
                    }

                    return cb();
                });
            }
        ], function(err){
            return fn(err, configuration);
        });
    },

    create_record: function(name, record, fn){
        var self = this;

        this.s3.getObject({Bucket: this.options.bucket, Key: "records"}, function(err, records){
            if(err)
                return fn({code: 400, body: err.message});
            else{
                try{
                    var records = JSON.parse(records.Body);
                    if(_.has(records, name))
                        return fn({code: 400, body: "Record already exists!"});
                    else{
                        records[name] = record;
                        self.s3.putObject({
                            Bucket: self.options.bucket,
                            Key: "records",
                            Body: JSON.stringify(records),
                            ContentType: "application/json"
                        }, function(err){
                            return fn();
                        });
                    }
                }
                catch(err){
                    return fn({code: 400, body: err.message});
                }
            }
            return fn();
        });
    },

    update_record: function(name, record, fn){
        var self = this;

        this.s3.getObject({Bucket: this.options.bucket, Key: "records"}, function(err, records){
            if(err)
                return fn({code: 400, body: err.message});
            else{
                try{
                    var records = JSON.parse(records.Body);
                    if(_.has(records, name)){
                        records[name] = record;
                        self.s3.putObject({
                            Bucket: self.options.bucket,
                            Key: "records",
                            Body: JSON.stringify(records),
                            ContentType: "application/json"
                        }, function(err){
                            return fn();
                        });
                    }
                    else
                        return fn({code: 404});
                }
                catch(err){
                    return fn({code: 400, body: err.message});
                }
            }
            return fn();
        });
    },

    delete_record: function(name, fn){
        var self = this;

        this.s3.getObject({Bucket: this.options.bucket, Key: "records"}, function(err, records){
            if(err)
                return fn({code: 400, body: err.message});
            else{
                try{
                    var records = JSON.parse(records.Body);
                    if(_.has(records, name)){
                        delete records[name];
                        self.s3.putObject({
                            Bucket: self.options.bucket,
                            Key: "records",
                            Body: JSON.stringify(records),
                            ContentType: "application/json"
                        }, function(err){
                            return fn();
                        });
                    }
                    else
                        return fn({code: 404});
                }
                catch(err){
                    return fn({code: 400, body: err.message});
                }
            }
            return fn();
        });
    },

    create_forwarder: function(name, forwarder, fn){
        var self = this;

        this.s3.getObject({Bucket: this.options.bucket, Key: "forwarders"}, function(err, forwarders){
            if(err)
                return fn({code: 400, body: err.message});
            else{
                try{
                    var forwarders = JSON.parse(forwarders.Body);
                    if(_.has(forwarders, name))
                        return fn({code: 400, body: "Forwarder already exists!"});
                    else{
                        forwarders[name] = forwarder;
                        self.s3.putObject({
                            Bucket: self.options.bucket,
                            Key: "forwarders",
                            Body: JSON.stringify(forwarders),
                            ContentType: "application/json"
                        }, function(err){
                            return fn();
                        });
                    }
                }
                catch(err){
                    return fn({code: 400, body: err.message});
                }
            }
            return fn();
        });
    },

    update_forwarder: function(name, forwarder, fn){
        var self = this;

        this.s3.getObject({Bucket: this.options.bucket, Key: "forwarders"}, function(err, forwarders){
            if(err)
                return fn({code: 400, body: err.message});
            else{
                try{
                    var forwarders = JSON.parse(forwarders.Body);
                    if(_.has(forwarders, name)){
                        forwarders[name] = forwarder;
                        self.s3.putObject({
                            Bucket: self.options.bucket,
                            Key: "forwarders",
                            Body: JSON.stringify(forwarders),
                            ContentType: "application/json"
                        }, function(err){
                            return fn();
                        });
                    }
                    else
                        return fn({code: 404});
                }
                catch(err){
                    return fn({code: 400, body: err.message});
                }
            }
            return fn();
        });
    },

    delete_forwarder: function(name, fn){
        var self = this;

        this.s3.getObject({Bucket: this.options.bucket, Key: "forwarders"}, function(err, forwarders){
            if(err)
                return fn({code: 400, body: err.message});
            else{
                try{
                    var forwarders = JSON.parse(forwarders.Body);
                    if(_.has(forwarders, name)){
                        delete forwarders[name];
                        self.s3.putObject({
                            Bucket: self.options.bucket,
                            Key: "forwarders",
                            Body: JSON.stringify(forwarders),
                            ContentType: "application/json"
                        }, function(err){
                            return fn();
                        });
                    }
                    else
                        return fn({code: 404});
                }
                catch(err){
                    return fn({code: 400, body: err.message});
                }
            }
            return fn();
        });
    }

}

