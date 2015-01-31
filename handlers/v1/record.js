var _ = require("lodash"),
    auth = require([__dirname, "..", "..", "lib", "auth"].join("/")),
    persistence;

var record = {

    initialize: function(options){
        auth.initialize(options);
        persistence = require([__dirname, "..", "..", "persistence", _.first(options._)].join("/"));
    },

    get: function(req, res, next){
        persistence.get_configuration(function(err, configuration){
            if(_.has(configuration.records, req.params.record))
                res.stash.body = configuration.records[req.params.record];

            return next();
        });
    },

    create: function(req, res, next){
        if(_.has(req, "body") && _.has(req.body, "type")){

            var record = req.params.record;
            if (!auth.allowed(record)) {
                res.stash.code = 403;
                return next();
            }

            persistence.create_record(record, req.body, function(err){
                if(err)
                    res.stash = err;
                else
                    res.stash.code = 201;

                return next();
            });
        }
        else{
            res.stash.code = 400;
            return next();
        }
    },

    update: function(req, res, next){
        if(_.has(req, "body") && _.has(req.body, "type")){
            persistence.update_record(req.params.record, req.body, function(err){
                if(err) {
                    if(err.code == 404) {
                        return record.create(req, res, next);
                    }
                    res.stash = err;
                } else {
                    res.stash.code = 200;
                }
                return next();
            });
        }
        else{
            res.stash.code = 400;
            return next();
        }
    },

    delete: function(req, res, next){
        persistence.delete_record(req.params.record, function(err){
            if(err)
                res.stash = err;
            else
                res.stash.code = 204;

            return next();
        });
    }

}
