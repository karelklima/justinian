/**
 * REST API provider with automatic SPARQL processing
 */

var util = require('util');
var _ = require('underscore');
var settings = require('./settings');
var ApiRoute = require('./api-route');
var SparqlClient = require('./sparql-client');
var SparqlQuery = require('./sparql-query');

function SparqlRoute() {
    ApiRoute.call(this);
    this.client = null;
    this.query = null;
}
util.inherits(SparqlRoute, ApiRoute);

SparqlRoute.prototype.setup = function()
{
    this.client = this.prepareSparqlClient();
    this.query = this.prepareSparqlQuery();
};

SparqlRoute.prototype.prepareSparqlClient = function() {
    return new SparqlClient();
};

SparqlRoute.prototype.prepareSparqlQuery = function() {
    var sparqlFile = settings.modulesDirectory + '/' + this.getModuleName() + '/api/' + this.getApiName() + '.sparql';
    return new SparqlQuery(sparqlFile);
};

SparqlRoute.prototype.get = function(req, res) {

    var params = this.prepareParams(req.query);

    var sparqlQuery = this.query.renderQuery(params);

    var thisInstance = this;

    this.client.sendRequest(sparqlQuery, function(responseString) {
        thisInstance.handleResponse(responseString, res);
    }, function(responseError) {
        thisInstance.handleError(responseError, res);
    });

};

SparqlRoute.prototype.prepareParams = function(params) {
    // Override this if necessary
    return params;
};

SparqlRoute.prototype.prepareResponse = function(responseString, next) {
    // Override this if necessary
    next(responseString);
};

SparqlRoute.prototype.handleResponse = function(responseString, res) {
    // Override this if necessary
    this.prepareResponse(responseString, function(processedResponse) {
        res.write(processedResponse);
        res.end();
    });
};

SparqlRoute.prototype.handleError = function (responseError, res) {
    res.write(responseError);
    res.end();
};

module.exports = SparqlRoute;
