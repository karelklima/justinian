/**
 * REST API provider with automatic SPARQL processing
 */

var util = require('util');
var settings = require('../settings');
var ApiRoute = require('./api-route');
var SparqlClient = require('./sparql-client');
var SparqlQuery = require('./sparql-query');
var jsonld = require('jsonld');
var logger = require('./logger');

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

SparqlRoute.prototype.prepareResponse = function(responseString, next) {
    // TODO jsonld.fromRDF throws JsonLdError, it is a bug but we have to do a workaround
    jsonld.fromRDF(responseString, {format: 'application/nquads'}, function(err, doc) {
        // TODO logger.debug(err);
        next(doc);
    });
};

SparqlRoute.prototype.handleResponse = function(responseString, res) {
    // Override this if necessary
    this.prepareResponse(responseString, function(jsonld) {
        res.write(JSON.stringify(jsonld));
        res.end();
    });
};

SparqlRoute.prototype.handleError = function (responseError, res) {
    res.write(responseError);
    res.end();
};

module.exports = SparqlRoute;
