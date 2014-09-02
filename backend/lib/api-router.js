/**
 * API router
 * Routes requests to modules API providers
 */

'use strict';

var express = require('express');
var _ = require('underscore');
var domain = require('domain');
var util = require('util');
var settings = require('./settings');
var apiRoutingTable = require('./api-routing-table');
var Route = require('./api-route');
var prefixReplacer = require('./prefix-replacer');

var apiRouter = express();

exports = module.exports = apiRouter;

// expands prefixed (shortened) URIs in every parameter in query string in all incoming HTTP requests
apiRouter.use('/:module/:api', function(req, res, next) {
    try {
        for (var param in req.query)
            req.query[param] = prefixReplacer.expandString(req.query[param]);
        next();
    }
    catch (err) {
        next(err);
    }
});

// finds requested module API provider and
apiRouter.use('/:module/:api', function(req, res, next) {
    var route = apiRoutingTable.getRoute(req.params.module, req.params.api);
    var method = req.method.toLowerCase();
    if (route instanceof Route)
    {
        var d = domain.create();
        d.on('error', next);
        d.run(function() {
            // TODO more methods?
            switch (method) {
                case "get":
                    route.get(req, res);
                    break;
                case "post":
                    route.post(req, res);
                    break;
                default :
                    next();
                    break;
            }
        });
    }
    else
        next(); // route does not exist
});