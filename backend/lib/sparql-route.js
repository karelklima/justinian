/**
 * REST API provider with automatic SPARQL processing
 */

var util = require('util');
var settings = require('../settings');
var ApiRoute = require('./api-route');
var SparqlClient = require('./sparql-client');
var SparqlQuery = require('./sparql-query');

var client;
var query;

function SparqlRoute(module, api) {
    ApiRoute.call(this, module, api);
    client = this.prepareSparqlClient();
    query = this.prepareSparqlQuery();
}
util.inherits(SparqlRoute, ApiRoute);

SparqlRoute.prototype.prepareSparqlClient = function() {
    return new SparqlClient();
};

SparqlRoute.prototype.prepareSparqlQuery = function() {
    var sparqlFile = settings.ModulesDirectory + '/' + this.getModuleName() + '/api/' + this.getApiName() + '.sparql';
    return new SparqlQuery(sparqlFile);
};



SparqlRoute.prototype.get = function(req, res) {

    var params = this.prepareParams(req.query);

    var sparqlQuery = query.renderQuery(params);

    var thisInstance = this;

    client.sendRequest(sparqlQuery, function(responseString) {
        thisInstance.handleResponse(responseString, res);
    }, function(responseError) {
        thisInstance.handleError(responseError, res);
    });

};

SparqlRoute.prototype.prepareParams = function(params) {
    // Override this if necessary
    return params;
};

SparqlRoute.prototype.prepareResponse = function(responseString) {
    return responseString;
};

SparqlRoute.prototype.handleResponse = function(responseString, res) {
    // Override this if necessary

    responseString = this.prepareResponse(responseString);

    res.write(responseString);
    res.end();
};

SparqlRoute.prototype.handleError = function (responseError, res) {
    res.write(responseError);
    res.end();
};

module.exports = SparqlRoute;
