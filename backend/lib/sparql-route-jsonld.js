/**
 * Created by Karel on 28. 4. 2014.
 */


var util = require('util');
var domain = require('domain');
var jsonld = require('jsonld');

var SparqlRoute = require('./sparql-route');
var SparqlClient = require('./sparql-client');

function SparqlRouteJSONLD()
{

}
util.inherits(SparqlRouteJSONLD, SparqlRoute);

SparqlRouteJSONLD.prototype.prepareSparqlClient = function()
{
    var client = new SparqlClient();
    client.setParam("format", "text/plain");
    return client;
};

SparqlRouteJSONLD.prototype.prepareResponse = function(responseString, next) {
    // Async exceptions need to be handled using domain
    var d = domain.create();
    d.on('error', function(err) {
        //logger.debug(err);
        next(responseString);
    });
    d.run(function() {
        jsonld.fromRDF(responseString, {format: 'application/nquads'}, function (err, doc) {
            if (err) { logger.err(err) }
            next(JSON.stringify(doc));
        });
    });
};

SparqlRouteJSONLD.prototype.handleResponse = function(responseString, res) {
    // Override this if necessary
    this.prepareResponse(responseString, function(preparedResponse) {
        res.write(preparedResponse);
        res.end();
    });
};

module.exports = SparqlRouteJSONLD;
