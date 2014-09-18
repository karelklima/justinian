/**
 * SPARQL ROUTE JSONLD
 */

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

/**
 * SparqlRouteJSONLD
 * enriched SparqlRoute to support JSON-LD format
 * @constructor
 */
function SparqlRouteJSONLD()
{
    SparqlRoute.call(this);
}
util.inherits(SparqlRouteJSONLD, SparqlRoute);

// Parent method override
SparqlRouteJSONLD.prototype.prepareSparqlClient = function()
{
    var options = _.clone(settings.options["sparql"]);
    options = this.prepareSparqlClientOptions(options);
    var client = new SparqlClient(options);
    // request special JSON-LD format
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
// Indicates whether or not convert dates in JSON-LD response
SparqlRouteJSONLD.prototype.getConvertDates = function() {
    return settings.options["sparql"]["jsonld"]["dates"]["convert"];
};
// Returns key suffix for converted day values
SparqlRouteJSONLD.prototype.getDateSuffix = function() {
    return settings.options["sparql"]["jsonld"]["dates"]["suffix"];
};
// Returns set of RDF types of date objects to convert
SparqlRouteJSONLD.prototype.getDateInputTypes = function() {
    return settings.options["sparql"]["jsonld"]["dates"]["input-types"];
};
// Returns date formats to parse date values with
SparqlRouteJSONLD.prototype.getDateInputFormats = function() {
    return settings.options["sparql"]["jsonld"]["dates"]["input-formats"];
};
// Return new date output format
SparqlRouteJSONLD.prototype.getDateOutputFormat = function() {
    return settings.options["sparql"]["jsonld"]["dates"]["output-format"];
};
// Indicates whether or not to convert graph in JSON-LD
// response specified with multiple objects into one object
SparqlRouteJSONLD.prototype.getReconstructComplexObjects = function() {
    return settings.options["sparql"]["jsonld"]["reconstruct-complex-objects"];
};
/**
 * Modification of JSON-LD response
 * @param {object} response data in JSON-LD format
 * @return {object} modified data in JSON-LD format OR a promise
 */
SparqlRouteJSONLD.prototype.prepareResponse = function(response, requestParams) {
    // Override this if necessary
    return response;
};
// Indicates whether or not to apply data model to JSON-response
SparqlRouteJSONLD.prototype.getApplyModel = function() {
    return settings.options["sparql"]["jsonld"]["apply-model"];
};
// Returns default data model
SparqlRouteJSONLD.prototype.getModel = function() {
    return settings.options["sparql"]["jsonld"]["default-model"];
};
// Indicates whether or not to shorten resource URIs in some properties
SparqlRouteJSONLD.prototype.getApplyPrefixedProperties = function() {
    return settings.options["sparql"]["jsonld"]["apply-prefixed-properties"];
};
// Returns list of properties to shorten resource URIs with
SparqlRouteJSONLD.prototype.getPrefixedProperties = function() {
    return settings.options["sparql"]["jsonld"]["default-prefixed-properties"];
};
// Indicates whether or not to send warnings to output, useful for debuggins
SparqlRouteJSONLD.prototype.getSendWarnings = function() {
    return settings.options["sparql"]["jsonld"]["send-warnings"];
};
// Applies context to JSON-LD Virtuoso response using JSONLD library
SparqlRouteJSONLD.prototype.applyContext = function(response) {
    var p = jsonld.promises();
    return p.compact(response, this.getContext(), settings.options["sparql"]["jsonld"]["compact-options"]);
};
// Converts dates according to configuration
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
                                var temp = item[key][0].substring(0, 10);
                                temp = moment(temp);
                                //temp.add('days', 1); // fix Virtuoso timezone bug
                                item[convertedKey] = [temp.format(self.getDateOutputFormat())];
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
// Converts list of response graph objects into one complex object based on @id
SparqlRouteJSONLD.prototype.reconstructComplexObjects = function(response) {

    if (!this.getReconstructComplexObjects()) // do not reconstruct
        return response;

    var objects = {};

    _.each(response["@graph"], function(object) {
        objects[object["@id"]] = {
            data: object,
            isLinked: false
        };
    });

    // find links among graph objects
    _.each(response["@graph"], function(object) {
        _.each(object, function(values, key) {
            if (key.indexOf("@") == 0)
                return; // RDF-specific property
            _.each(values, function(value, index) {
                if (_.has(objects, value)) { // link to another object
                    values[index] = objects[value].data;
                    objects[value].isLinked = true;
                }
            });
        });
    });

    response["@graph"] = [];

    // only include non-linked nodes in final response
    _.each(objects, function(object) {
        if (!object.isLinked)
            response["@graph"].push(object.data);
    });

    return response;
};
// Applies data model to response
SparqlRouteJSONLD.prototype.processModel = function(response) {

    if (!this.getApplyModel()) // do not apply model
        return response;

    var self = this;
    try {
        var model = this.getModel();

        var processModelPart = function(objects, model) {

            var keys = _.keys(model);
            var defaults = {};
            _.each(keys, function (key) {
                defaults[key] = model[key][1];
            });
            _.each(objects, function (item) {
                _.each(keys, function(key) {
                    if (!_.isUndefined(item[key]) && typeof item[key] != model[key][0]) {

                        var validType = model[key][0];
                        if (_.isObject(model[key][0]) && !_.isString(model[key][0])) {
                            validType = "object";
                        }

                        if (_.isObject(model[key][0]) && !_.isString(model[key][0]) && _.isArray(item[key])) {
                            processModelPart(item[key], model[key][0]);
                        } else {
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
                    }
                });
                _.defaults(item, defaults); // fill in default values
                var trailingKeys = _.difference(_.keys(item), keys); // omit unwanted fields
                _.each(trailingKeys, function(key) {
                    delete item[key];
                })
            });
        };

        processModelPart(response["@graph"], model);

    }
    catch (e) {
        console.log(e);
        console.log(e.stack);
        this.addWarning(response, "Unable to process model");
    }

    return response;
};
// Shortens long URIs in defined properties
SparqlRouteJSONLD.prototype.processPrefixedProperties = function(response) {

    if (!this.getApplyPrefixedProperties()) // do not apply prefixed properties
        return response;

    try {
        var prefixedProperties = this.getPrefixedProperties();
        var self = this;

        var prefixPart = function(objects) {
            _.each(objects, function(item) {
                _.each(prefixedProperties, function(property) {
                    if (!_.isUndefined(item[property])) {
                        if (_.isString(item[property])) {
                            item[property] = prefixReplacer.contractString(item[property]);
                        } else if (_.isArray(item[property]) && _.isString(item[property][0])){
                            // array of strings:
                            for (var i = 0; i < item[property].length; i++) {
                                item[property][i] = prefixReplacer.contractString(item[property][i])
                            }
                        } else {
                            self.addWarning(response, "Prefixed property must be either a string or an array: " + property);
                        }
                    }
                });
                _.each(item, function(value, key) {
                    if (_.isArray(value) && _.isObject(value[0]))
                        prefixPart(value);
                });
            });
        };

        prefixPart(response["@graph"]);
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
// Include warnings in JSON-LD response
SparqlRouteJSONLD.prototype.processWarnings = function(response) {
    if (!this.getSendWarnings() && _.has(response, "@warning")) {
        response = _.omit(response, "@warning");
    }
    return response;
};
// Override of SparqlRoute.handleResponse
SparqlRouteJSONLD.prototype.handleResponse = function(responseString, res, requestParams) {

    var self = this;

    // Initiate main workflow
    Q.fcall(function() { return responseString; })
        .then(function(r) {
            if (_.isString(r) && r.indexOf("{") !== 0) { // not a valid JSON-LD response
                throw new Error(r);
            }
            return r;
        })
        .then(function(r) { return JSON.parse(responseString); })
        .then(function(r) { return self.applyContext(r); })
        .then(function(r) { return self.convertDates(r); })
        .then(function(r) { return self.reconstructComplexObjects(r); })
        .then(function(r) { return self.prepareResponse(r, requestParams); })
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
