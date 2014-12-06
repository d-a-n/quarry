var fs = require("fs");
var _ = require("lodash");

module.exports = {

    initialize: function(options, fn){
        this.options = options;
        return fn();
    },

    get_configuration: function(fn){
        if(_.has(require.cache, this.options["config-path"]))
            delete require.cache[this.options["config-path"]];

        var configuration = require(this.options["config-path"]);
        return fn(null, configuration);
    },

    create_record: function(name, record, fn){
        var self = this;

        fs.readFile(this.options["config-path"], function(err, contents){
            if(err)
                return fn({code: 400, body: err.message});

            try{
                contents = JSON.parse(contents.toString());
                if(_.has(contents.records, name))
                    return fn({code: 400, body: "Record already exists!"});
                else
                    contents.records[name] = record;
            }
            catch(err){
                return fn({code: 400, body: err.message});
            }

            fs.writeFile(self.options["config-path"], JSON.stringify(contents), fn);
        });
    },

    update_record: function(name, record, fn){
        var self = this;

        fs.readFile(this.options["config-path"], function(err, contents){
            if(err)
                return fn({code: 400, body: err.message});

            try{
                contents = JSON.parse(contents.toString());
                if(_.has(contents.records, name))
                    contents.records[name] = record;
                else
                    return fn({code: 404});
            }
            catch(err){
                return fn({code: 400, body: err.message});
            }

            fs.writeFile(self.options["config-path"], JSON.stringify(contents), fn);
        });
    },

    delete_record: function(name, fn){
        var self = this;

        fs.readFile(this.options["config-path"], function(err, contents){
            if(err)
                return fn({code: 400, body: err.message});

            try{
                contents = JSON.parse(contents.toString());
                if(_.has(contents.records, name))
                    delete contents.records[name];
                else
                    return fn({code: 404});
            }
            catch(err){
                return fn({code: 400, body: err.message});
            }

            fs.writeFile(self.options["config-path"], JSON.stringify(contents), fn);
        });
    },

    create_forwarder: function(name, forwarder, fn){
        var self = this;

        fs.readFile(this.options["config-path"], function(err, contents){
            if(err)
                return fn({code: 400, body: err.message});

            try{
                contents = JSON.parse(contents.toString());
                if(_.has(contents.forwarders, name))
                    return fn({code: 400, body: "Forwarder already exists!"});
                else
                    contents.forwarders[name] = forwarder;
            }
            catch(err){
                return fn({code: 400, body: err.message});
            }

            fs.writeFile(self.options["config-path"], JSON.stringify(contents), fn);
        });
    },

    update_forwarder: function(name, forwarder, fn){
        var self = this;

        fs.readFile(this.options["config-path"], function(err, contents){
            if(err)
                return fn({code: 400, body: err.message});

            try{
                contents = JSON.parse(contents.toString());
                if(_.has(contents.forwarders, name))
                    contents.forwarders[name] = forwarder;
                else
                    return fn({code: 404});
            }
            catch(err){
                return fn({code: 400, body: err.message});
            }

            fs.writeFile(self.options["config-path"], JSON.stringify(contents), fn);
        });
    },

    delete_forwarder: function(name, fn){
        var self = this;

        fs.readFile(this.options["config-path"], function(err, contents){
            if(err)
                return fn({code: 400, body: err.message});

            try{
                contents = JSON.parse(contents.toString());
                if(_.has(contents.forwarders, name))
                    delete contents.forwarders[name];
                else
                    return fn({code: 404});
            }
            catch(err){
                return fn({code: 400, body: err.message});
            }

            fs.writeFile(self.options["config-path"], JSON.stringify(contents), fn);
        });
    }

}
