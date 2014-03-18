/**
 * LDAF API router
 */

'use strict';

var _ = require('underscore');
var fs = require('fs');
var util = require('util');
var apiRoute = require('./api-route');

exports = module.exports = function router(moduleName, options) {
    options = options || {};

    var moduleDirectory = __dirname + '/../../modules/' + moduleName + '/api/';

    var routingTable = {};
    var files = fs.readdirSync(moduleDirectory);


    var jsFiles = _.filter(files, function(file) { return /^[a-z-]+\.js$/.test(file); });
    _.each(jsFiles, function(file) {
        routingTable[file.split('.')[0]] = require(moduleDirectory + '/' + file);
    });

    var sparqlFiles = _.filter(files, function(file) { return /^[a-z-]+\.sparql$/.test(file); });
    _.each(sparqlFiles, function(file) {
        var prefix = file.split('.')[0];
        if (!(prefix in routingTable)) {
            routingTable[file.split('.')[0]] = apiRoute.fromFile(moduleDirectory + '/' + file, options);
        }
    });





    return function process (req, res, next) {
        var name = req.path.substring(1); // remove starting slash
        if (_.isObject(routingTable[name]))
        {
            var matchedRoute = routingTable[name];
            var method = req.method.toLowerCase();

            switch (method) {
                case "get":
                    if ('function' == typeof matchedRoute.get)
                        matchedRoute.get(req, res, function() { /* done */ });
                    break;
                default :
                    next();
                    break;
            }
        } else
            next();
    }
}


