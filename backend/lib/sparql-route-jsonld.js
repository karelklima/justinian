
var util = require('util');
var domain = require('domain');
var jsonld = require('jsonld');

var logger = require('./logger');
var settings = require('./settings');

var SparqlRoute = require('./sparql-route');
var SparqlClient = require('./sparql-client');

function SparqlRouteJSONLD()
{
    SparqlRoute.call(this);
}
util.inherits(SparqlRouteJSONLD, SparqlRoute);

SparqlRouteJSONLD.prototype.prepareSparqlClient = function()
{
    var client = new SparqlClient();
    client.setParam("format", settings.options["sparql"]["jsonld"]["format"]);
    return client;
};

SparqlRouteJSONLD.prototype.getContext = function() {
    return settings.options["sparql"]["jsonld"]["default-context"];
};

SparqlRouteJSONLD.prototype.prepareResponse = function(responseJSON, next) {
    // Override this if necessary
    next(responseJSON);
};

SparqlRouteJSONLD.prototype.applyContext = function(responseJSON, next) {
    var p = jsonld.promises();
    p.compact(responseJSON, this.getContext()).then(function(compacted) {
        next(compacted);
    }, function(err) {
        next(settings.options["sparql"]["jsonld"]["error-result"]);
    });
};

SparqlRouteJSONLD.prototype.handleResponse = function(responseString, res) {

//    logger.debug(responseString);

    var thisInstance = this;

    var write = function(responseJSON) {
        thisInstance.prepareResponse(responseJSON, function(preparedJSON) {
            res.write(JSON.stringify(preparedJSON, null, "  "));
            res.end();
        });
    };

    var d = domain.create();
    d.on('error', function(err) {
        logger.err(err);
        write(settings.options["sparql"]["jsonld"]["error-result"]);
    });
    d.run(function() {
        var data = JSON.parse(responseString);
        thisInstance.applyContext(data, function(responseJSON) {
            thisInstance.prepareResponse(responseJSON, function(preparedJSON) {
                write(preparedJSON);
            })
        });
    });

};

module.exports = SparqlRouteJSONLD;
