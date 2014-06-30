/**
 * Created by Karel on 28. 4. 2014.
 */


var util = require('util');
var domain = require('domain');
var jsonld = require('jsonld');

var logger = require('./logger');

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
    // Override this if necessary
    next(responseString);
};

SparqlRouteJSONLD.prototype.handleResponse = function(responseString, res) {

//    logger.debug(responseString);

    var thisInstance = this;

    var write = function(responseString) {
        thisInstance.prepareResponse(responseString, function(preparedResponse) {
            res.write(preparedResponse);
            res.end();
        });
    };

    var d = domain.create();
    d.on('error', function(err) {
//        logger.err(err);
//        write(responseString);
        write(JSON.stringify([]));
    });
    d.run(function() {
//        logger.debug(responseString);
        jsonld.fromRDF(responseString, {format: 'application/nquads'}, function (err, doc) {
            if (err) {
                logger.err(err)
            }
            write(JSON.stringify(doc));
        });
    });

};

module.exports = SparqlRouteJSONLD;
