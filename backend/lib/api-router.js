/**
 * LDAF API router
 */

'use strict';

var _ = require('underscore');
var fs = require('fs');
var util = require('util');
var settings = require('../settings');
var logger = require('./logger');
var ApiRoute = require('./api-route');
var SparqlRoute = require('./sparql-route');

exports = module.exports = function apiRouter(moduleName) {

    var moduleDirectory = __dirname + '/../../modules/' + moduleName + '/api/';

    var routingTable = {};
    var files = fs.readdirSync(moduleDirectory);

    var routeParams = {
        ApiRoute: ApiRoute,
        SparqlRoute: SparqlRoute
    };

    var jsFiles = _.filter(files, function(file) { return /^[a-z-]+\.js$/.test(file); });
    _.each(jsFiles, function(file) {
        var Route = require(moduleDirectory + '/' + file)(routeParams);
        routingTable[file.split('.')[0]] = new Route(moduleName, file.split('.')[0]);
logger.debug('setting a route for ' + file.split('.')[0] );
    });
logger.warn('September is approaching...');
logger.err('Testing Error logging from the main logger');

	return function process (req, res, next) {
        var name = req.path.substring(1); // remove starting slash
        console.log(name);
        if (_.isObject(routingTable[name]))
        {
            var matchedRoute = routingTable[name];
            var method = req.method.toLowerCase();

            switch (method) {
                case "get":
                    if ('function' == typeof matchedRoute.get)
                        matchedRoute.get(req, res);
                    else
                        next();
                    break;
                default :
                    next();
                    break;
            }
        } else
            next();
    }
};


