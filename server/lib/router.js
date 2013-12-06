/**
 * LDAF API router
 */

'use strict';

var _ = require('underscore');
var fs = require('fs');
var util = require('util');
var sparqlRoute = require('./sparql-route');

exports = module.exports = function router(options) {
    options = options || {}
    options["api-modules"] = options["api-modules"] || {};
    options["api-directory"] = options["api-directory"] || __dirname + "/../api/";

    var routingTable = {};
    _.each(options["api-modules"], function(moduleName) {
        var moduleDirectory = options["api-directory"] + moduleName;
        var files = fs.readdirSync(moduleDirectory);
        var sparqlFiles = _.filter(files, function(file) { return /^[a-z-]+\.sparql$/.test(file); });
        _.each(sparqlFiles, function(file) {
            routingTable[file.split('.')[0]] = sparqlRoute.fromFile(moduleDirectory + '/' + file, options);
        });
        var jsFiles = _.filter(files, function(file) { return /^[a-z-]+\.js$/.test(file); });

    });

    return function process (req, res, next) {
        console.log("process");
        var name = req.path.substring(1); // remove starting slash
        if (_.isObject(routingTable[name]))
        {

            var matchedRoute = routingTable[name];
            var method = req.method.toLowerCase();

            console.log(matchedRoute);

            switch (method) {
                case "get":
                    if ('function' == typeof matchedRoute.get)
                        matchedRoute.get(req, res, function() { /*done*/  });
                    break;
                default :
                    next();
                    break;
            }
        } else
            next();
    }
}


