
var util = require('util');
var domain = require('domain');
var jsonld = require('jsonld');
var _ = require('underscore');
var Q = require('q');
var moment = require('moment');

var logger = require('./logger');
var settings = require('./settings');
var prefixReplacer = require('./prefix-replacer');

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

/**
 * Provider for JSON-LD @context
 * http://www.w3.org/TR/json-ld/#the-context
 * @return {object} definition of JSON-LD context
 */
SparqlRouteJSONLD.prototype.getContext = function() {
    // Override this if necessary
    return settings.options["sparql"]["jsonld"]["default-context"];
};

SparqlRouteJSONLD.prototype.getConvertDates = function() {
    return settings.options["sparql"]["jsonld"]["dates"]["convert"];
};

SparqlRouteJSONLD.prototype.getDateSuffix = function() {
    return settings.options["sparql"]["jsonld"]["dates"]["suffix"];
};

SparqlRouteJSONLD.prototype.getDateInputTypes = function() {
    return settings.options["sparql"]["jsonld"]["dates"]["input-types"];
};

SparqlRouteJSONLD.prototype.getDateInputFormats = function() {
    return settings.options["sparql"]["jsonld"]["dates"]["input-formats"];
};

SparqlRouteJSONLD.prototype.getDateOutputFormat = function() {
    return settings.options["sparql"]["jsonld"]["dates"]["output-format"];
};

/**
 * Modification of JSON-LD response
 * @param {object} response data in JSON-LD format
 * @return {object} modified data in JSON-LD format OR a promise
 */
SparqlRouteJSONLD.prototype.prepareResponse = function(response) {
    // Override this if necessary
    return response;
};

SparqlRouteJSONLD.prototype.getModel = function() {
    return settings.options["sparql"]["jsonld"]["default-model"];
};

SparqlRouteJSONLD.prototype.getPrefixedProperties = function() {
    return settings.options["sparql"]["jsonld"]["default-prefixed-properties"];
};

SparqlRouteJSONLD.prototype.getSendWarnings = function() {
    return settings.options["sparql"]["jsonld"]["send-warnings"];
};

SparqlRouteJSONLD.prototype.applyContext = function(response) {
    var p = jsonld.promises();
    return p.compact(response, this.getContext(), settings.options["sparql"]["jsonld"]["compact-options"]);
};



SparqlRouteJSONLD.prototype.convertDates = function(response) {
    var self = this;
    if (self.getConvertDates()) {
        var context = response["@context"];
        _.each(_.keys(context), function(key) {
            if (_.isObject(context[key]) && _.has(context[key], "@type") && _.contains(self.getDateInputTypes(), context[key]["@type"])) {
                _.each(response["@graph"], function(item) {
                    if (_.has(item, key)) {
                        try {
                            var convertedKey = key + self.getDateSuffix();
                            if (_.has(item, convertedKey) && key != convertedKey) {
                                self.addWarning(response, "Cannot convert date, overwrite of other key detected: " + convertedKey);
                            } else {
                                item[convertedKey] = [moment(item[key][0], self.getDateInputFormats()).format(self.getDateOutputFormat())];
                            }
                        }
                        catch (e)
                        {
                            self.addWarning(response, "Unable to parse date: " + item[key]);
                        }
                    }
                });
            }
        });
    }
    return response;
};



SparqlRouteJSONLD.prototype.processModel = function(response) {
    var self = this;
    try {
        var model = this.getModel();
        var keys = _.keys(model);
        var defaults = {};
        _.each(keys, function (key) {
            defaults[key] = model[key][1];
        });

        _.each(response["@graph"], function (item) {
            _.each(keys, function(key) {
                if (!_.isUndefined(item[key]) && typeof item[key] != model[key][0]) {
                    if (_.isArray(item[key]) && item[key].length > 0) {
                        if (item[key].length > 1) {
                            self.addWarning(response, "Single value expected for key '" + key + "', multiple received");
                        }
                        item[key] = item[key][0];
                    }

                    if (typeof item[key] != model[key][0]) {
                        // possibly corrupted data
                        self.addWarning(response, "Invalid data for key '" + key + "':   expected type '" + model[key][0] + "', recieved '" + typeof item[key] + "'");

                        // let's fix some cases
                        switch (model[key][0]) {
                            case "array":
                                item[key] = [item[key]];
                                break;
                            case "number":
                                item[key] = Number(item[key]);
                                break;
                            case "string":
                                item[key] = item[key].toString();
                                break;
                        }
                    }
                }
            });
            _.defaults(item, defaults); // fill in default values
            var trailingKeys = _.difference(_.keys(item), keys); // omit unwanted fields
            _.each(trailingKeys, function(key) {
                delete item[key];
            })
        });
    }
    catch (e) {
        console.log(e);
        console.log(e.stack);
        this.addWarning(response, "Unable to process model");
    }

    return response;
};

SparqlRouteJSONLD.prototype.processPrefixedProperties = function(response) {
    try {
        var prefixedProperties = this.getPrefixedProperties();
        var self = this;
        _.each(response["@graph"], function(item) {
            _.each(prefixedProperties, function(property) {
                if (!_.isUndefined(item[property])) {
                    if (_.isString(item[property])) {
                        item[property] = prefixReplacer.contractString(item[property]);
                    } else if (_.isArray(item[property])){
                    	for (var i = 0; i < item[property].length; i++) {
                    		item[property][i] = prefixReplacer.contractString(item[property][i])
                    	}
                    } else {
                        self.addWarning(response, "Prefixed property must be either a string or an array: " + property);
                    }
                } else {
                    self.addWarning(response, "Prefixed property not found: " + property);
                }
            });
        });
    }
    catch (e) {
        logger.err(e);
        logger.err(e.stack);
        this.addWarning(response, "Unable to process prefixed properties")
    }

    return response;
};

SparqlRouteJSONLD.prototype.addWarning = function (response, message) {
    if (!_.has(response, "@warning"))
        response["@warning"] = [];
    response["@warning"].push(message);
};

SparqlRouteJSONLD.prototype.processWarnings = function(response) {
    if (!this.getSendWarnings() && _.has(response, "@warning")) {
        response = _.omit(response, "@warning");
    }
    return response;
};

SparqlRouteJSONLD.prototype.handleResponse = function(responseString, res) {

//    logger.debug(responseString);

    var self = this;

    Q.fcall(function() { return responseString; })
        .then(function(r) { return JSON.parse(responseString); })
        .then(function(r) { return self.applyContext(r); })
        .then(function(r) { return self.convertDates(r); })
        .then(function(r) { return self.prepareResponse(r); })
        .then(function(r) { return self.processModel(r); })
        .then(function(r) { return self.processPrefixedProperties(r); })
        .then(function(r) { return self.processWarnings(r); })
        .then(function(responseJSON) {
            res.write(JSON.stringify(responseJSON, null, "  "));
            res.end();
            return true;
        })
        .catch(function(err) {
            logger.err(err.stack);
            res.write(JSON.stringify(settings.options["sparql"]["jsonld"]["error-result"], null, "  "));
            res.end();
            return true;
        });

};

module.exports = SparqlRouteJSONLD;
