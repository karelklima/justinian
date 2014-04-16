/**
 * REST API provider with automatic SOLR processing
 */

var util = require('util');
var settings = require('./settings');
var ApiRoute = require('./api-route');
var SolrClient = require('./solr-client');
var jsonld = require('jsonld');
var logger = require('./logger');

var client;

function SolrRoute(module, api) {
    ApiRoute.call(this, module, api);
    client = this.prepareSolrClient();
}
util.inherits(SolrRoute, ApiRoute);

SolrRoute.prototype.prepareSolrClient = function() {
    return new SolrClient();
};


SolrRoute.prototype.get = function(req, res) {
	
	var solrQuery = req.query.q;
logger.debug("METHOD: " + req.method);
logger.debug("QUERY: " + solrQuery);

	var thisInstance = this;

	client.sendRequest(solrQuery, function(responseString) {		
    	thisInstance.handleResponse(responseString, res);
	}, function(responseError) {
		thisInstance.handleError(responseError, res);
	});
    
};

SolrRoute.prototype.prepareParams = function(params) {
    // Override this if necessary
    return params;
};

SolrRoute.prototype.handleResponse = function(responseString, res) {
    // Override this if necessary
	res.write(responseString);
	res.end();
};

SolrRoute.prototype.handleError = function (responseError, res) {
    res.write(responseError);
    res.end();
};

module.exports = SolrRoute;
