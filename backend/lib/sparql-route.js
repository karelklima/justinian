/**
 * REST API provider with automated SPARQL processing
 */

var util = require('util');
var _ = require('underscore');
var Q = require('q');
var settings = require('./settings');
var ApiRoute = require('./api-route');
var SparqlClient = require('./sparql-client');
var SparqlQuery = require('./sparql-query');

/**
 * SparqlRoute
 * REST API provider for dedicated OpenLink Virtuoso server
 */
function SparqlRoute() {
    ApiRoute.call(this);
    this.client = null;
    this.query = null;
}
util.inherits(SparqlRoute, ApiRoute);

SparqlRoute.prototype.init = function(moduleName, apiName)
{
    ApiRoute.prototype.init.call(this, moduleName, apiName);
    this.client = this.prepareSparqlClient();
    this.query = this.prepareSparqlQuery();
};

SparqlRoute.prototype.prepareSparqlClientOptions = function(options) {
    // Override me if necessary
    return options;
};

// Creates client instance to connect to Virtuoso server
SparqlRoute.prototype.prepareSparqlClient = function() {
    var options = _.clone(settings.options["sparql"]);
    options = this.prepareSparqlClientOptions(options);
    return new SparqlClient(options);
};

// Create SPARQL query file container
SparqlRoute.prototype.prepareSparqlQuery = function() {
    var sparqlFile = settings.modulesDirectory + '/' + this.getModuleName() + '/api/' + this.getApiName() + '.sparql';
    return new SparqlQuery(sparqlFile);
};

// GET request handler
SparqlRoute.prototype.get = function(req, res) {

    var params = this.prepareParams(req.query);

    // gets final SPARQL query with input params applied
    var sparqlQuery = this.query.renderQuery(params);

    var thisInstance = this;

    this.client.sendRequest(sparqlQuery, function(responseString) {
        thisInstance.handleResponse(responseString, res, params);
    }, function(responseError) {
        thisInstance.handleError(responseError, res);
    });

};

// Possibility to change input parameters
SparqlRoute.prototype.prepareParams = function(params) {
    // Override this if necessary
    return params;
};

// Possibility to change Virtuoso response
// returns string or promise
SparqlRoute.prototype.prepareResponse = function(response, requstParams) {
    // Override this if necessary, can return a promise
    return response;
};

// Successful response handler
SparqlRoute.prototype.handleResponse = function(responseString, res, requestParams) {
    // Override this if necessary
    var self = this;
    // Init request and response process
    Q.fcall(function() { return responseString; })
        .then(function(r) { return self.prepareResponse(responseString, requestParams) })
        .then(function(r) {
            res.write(r); // write request to response output
            res.end();
        });
};

// Unsuccessful response handler
SparqlRoute.prototype.handleError = function (responseError, res) {
    res.write(responseError);
    res.end();
};

module.exports = SparqlRoute;
