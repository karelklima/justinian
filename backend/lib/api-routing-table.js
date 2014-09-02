/**
 * ApiRoutingTable
 * Search, init and provide data API providers
 */

var _ = require('underscore');
var fs = require('fs');
var settings = require('./settings');
var ApiRoute = require('./api-route');
var SparqlRoute = require('./sparql-route');
var SparqlRouteJSONLD = require('./sparql-route-jsonld');
var SolrRoute = require('./solr-route');
var JSONLD = require('jsonld');
var HTTP = require('http');
var Q = require('q');

var apiRoutingTable = new ApiRoutingTable();
exports = module.exports = apiRoutingTable; // exports singleton

function ApiRoutingTable()
{
    this.routingTable = {};

    // params to be passed to each
    var routeParams = {
        ApiRoute: ApiRoute,
        SparqlRoute: SparqlRoute,
        SparqlRouteJSONLD: SparqlRouteJSONLD,
        SolrRoute: SolrRoute,
        Underscore: _,
        JSONLD: JSONLD,
        HTTP: HTTP,
        Q: Q,
        settings: settings
    };

    // looks for all data API providers in all modules
    var modules = _.keys(settings.getModulesSetup());
    for (var i = 0; i < modules.length; i++)
    {
        var moduleName = modules[i];
        var apiDirectory = settings.modulesDirectory + '/' + moduleName + '/api';

        if (!fs.existsSync(apiDirectory))
            continue;

        var files = fs.readdirSync(apiDirectory);

        // reads all JS files from module's API directory
        var apiJSFiles = _.filter(files, function(file) { return /^[a-z-]+\.js$/.test(file); });
        for (var f = 0; f < apiJSFiles.length; f++) {
            var file = apiJSFiles[f];
            var apiName = file.substring(0, file.length - 3); // remove extension
            var routeProvider = require(apiDirectory + '/' + file);
            // checks if it is a valid API provider
            if (typeof routeProvider != "function")
                throw new Error("Invalid API provider: " + moduleName + '/' + apiName);
            var route = routeProvider(routeParams);
            if (route instanceof ApiRoute) {
                route.init(moduleName, apiName);
                // valid provider found, Add to routingTable
                this.routingTable[moduleName + '/' + apiName] = route;
            }
            else {
                throw new Error("Invalid API provider: " + moduleName + '/' + apiName);
            }
        }
    }
}


ApiRoutingTable.prototype.getRoute = function(module, api)
{
    var id = module + '/' + api;
    if (this.routingTable.hasOwnProperty(id))
        return this.routingTable[id];
    return null;
};