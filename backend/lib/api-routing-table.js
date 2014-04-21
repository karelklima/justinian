/**
 * Created by Karel on 21. 4. 2014.
 */


var _ = require('underscore');
var fs = require('fs');
var settings = require('./settings');
var ApiRoute = require('./api-route');
var SparqlRoute = require('./sparql-route');
var SolrRoute = require('./solr-route');

var apiRoutingTable = new ApiRoutingTable();
exports = module.exports = apiRoutingTable; // exports singleton

function ApiRoutingTable()
{
    this.routingTable = {};

    var routeParams = {
        ApiRoute: ApiRoute,
        SparqlRoute: SparqlRoute,
        SolrRoute: SolrRoute
    };

    var modules = _.keys(settings.getModulesSetup());
    for (var i = 0; i < modules.length; i++)
    {
        var moduleName = modules[i];
        var apiDirectory = settings.modulesDirectory + '/' + moduleName + '/api';

        var files = fs.readdirSync(apiDirectory);

        var apiJSFiles = _.filter(files, function(file) { return /^[a-z-]+\.js$/.test(file); });
        for (var f = 0; f < apiJSFiles.length; f++) {
            var file = apiJSFiles[f];
            var Route = require(apiDirectory + '/' + file)(routeParams);
            var apiName = file.substring(0, file.length - 3); // remove extension
            this.routingTable[moduleName + '/' + apiName] = new Route(moduleName, apiName);
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