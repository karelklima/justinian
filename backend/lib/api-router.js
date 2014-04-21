/**
 * LDAF API router
 */

'use strict';

var express = require('express');
var _ = require('underscore');
var domain = require('domain');
var util = require('util');
var settings = require('./settings');
var apiRoutingTable = require('./api-routing-table');
var Route = require('./api-route');

var apiRouter = express();

exports = module.exports = apiRouter;

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

/*

exports = module.exports = function apiRouter(moduleName) {


    var moduleDirectory = settings.modulesDirectory + '/' + moduleName + '/api/';

    var routingTable = {};
    var files = fs.readdirSync(moduleDirectory);

    var routeParams = {
        ApiRoute: ApiRoute,
        SparqlRoute: SparqlRoute,
        SolrRoute: SolrRoute
    };

    var jsFiles = _.filter(files, function(file) { return /^[a-z-]+\.js$/.test(file); });
    _.each(jsFiles, function(file) {
        var Route = require(moduleDirectory + '/' + file)(routeParams);
        routingTable[file.split('.')[0]] = new Route(moduleName, file.split('.')[0]);
logger.debug('setting an api route for ' + file.split('.')[0] );
    });

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

*/
