/**
 * SolrRoute - REST API provider with automatic SOLR processing
 */

var util = require('util');
var settings = require('./settings');
var ApiRoute = require('./api-route');
var SolrClient = require('./solr-client');
var jsonld = require('jsonld');
var logger = require('./logger');

/**
 * SolrRoute
 * REST API provider for dedicated Apache SOLR server
 * @param module
 * @param api
 * @constructor
 */
function SolrRoute(module, api) {
    ApiRoute.call(this, module, api);
    this.client = this.prepareSolrClient();
}
util.inherits(SolrRoute, ApiRoute);

// Request SOLR configuration
SolrRoute.prepareSolrClientOptions = function() {
    // Override this if necessary
    return settings.options["solr"]
};

// Prepare SOLR client using configuration
SolrRoute.prototype.prepareSolrClient = function() {
    var options = this.prepareSolrClientOptions();
    return new SolrClient(options);
};

// Process GET request to SOLR dedicated server
SolrRoute.prototype.get = function(req, res) {
	
	var solrQuery = req.query.q;
    logger.debug("METHOD: " + req.method);
    logger.debug("QUERY: " + solrQuery);

	var thisInstance = this;

	this.client.sendRequest(solrQuery, function(responseString) {
    	thisInstance.handleResponse(responseString, res);
	}, function(responseError) {
		thisInstance.handleError(responseError, res);
	});
    
};

// Prepare incoming params in HTTP request from client
SolrRoute.prototype.prepareParams = function(params) {
    // Override this if necessary
    return params;
};

// Successful SOLR repsonse handler
SolrRoute.prototype.handleResponse = function(responseString, res) {
    // Override this if necessary
	res.write(responseString);
	res.end();
};

// Unsuccessful SOLR response handler
SolrRoute.prototype.handleError = function (responseError, res) {
    res.write(responseError);
    res.end();
};

module.exports = SolrRoute;
