/**
 * REST API provider with automatic SPARQL processing
 */

var util = require('util');
var domain = require('domain');
var jsonld = require('jsonld');
var _ = require('underscore');
var settings = require('./settings');
var ApiRoute = require('./api-route');
var SparqlClient = require('./sparql-client');
var SparqlQuery = require('./sparql-query');
var logger = require('./logger');

function SparqlRoute(module, api) {
    ApiRoute.call(this, module, api);
    this.client = this.prepareSparqlClient();
    this.query = this.prepareSparqlQuery();
}
util.inherits(SparqlRoute, ApiRoute);

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
    params = this.replacePrefixesInParams(params, /^resource/);
    return params;
};

SparqlRoute.prototype.prepareResponse = function(responseString, next) {
    // Async exceptions need to be handled using domain
    var d = domain.create();
    d.on('error', function(err) {
        next(responseString);
    });
    d.run(function() {
        jsonld.fromRDF(responseString, {format: 'application/nquads'}, function (err, doc) {
            logger.err(err);
            next(JSON.stringify(doc));
        });
    });
};

SparqlRoute.prototype.handleResponse = function(responseString, res) {
    // Override this if necessary
    this.prepareResponse(responseString, function(preparedResponse) {
        res.write(preparedResponse);
        res.end();
    });
};

SparqlRoute.prototype.handleError = function (responseError, res) {
    res.write(responseError);
    res.end();
};

SparqlRoute.prototype.replacePrefixesInParams = function(params, regex)
{
    // prefix helper method
    for (var key in params)
    {
        if (key.match(regex))
        {
            params[key] = this.replacePrefixInParam(params[key]);
        }
    }
    return params;
};

SparqlRoute.prototype.replacePrefixInParam = function(param)
{
    // prefix helper method
    var prefixes = {};
    var moduleSettings = settings.getModulesSetup()[this.module];
    if (_.contains(_.keys(moduleSettings), "prefixes"))
        prefixes = moduleSettings["prefixes"];
    for (var prefix in prefixes)
    {
        if (param.indexOf(prefix) == 0)
        {
            return prefixes[prefix] + param.substr(prefix.length);
        }
    }
    return param;
};

module.exports = SparqlRoute;
