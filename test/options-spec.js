var _  = require('underscore');
var should = require('should');
var fs = require('fs');

describe('Options', function() {

    var options;
    try {
        options = require('../backend/options.json');
    } catch (e) { }

    it('should be valid JSON file', function() {
        options.should.be.of.type('object');
    });

    var optionsProperties = {
        "title" : "string",
        "favicon" : "string",
        "home" : "object",
        "page-not-found" : "object",
        "modules" : "object",
        "asset-extensions" : "object",
        "sparql" : {
            "datastore-url" : "string",
            "query-param-name" : "string",
            "default-params": "object",
            "jsonld" : {
                "format": "string",
                "empty-result": "object",
                "error-result": "object",
                "default-context": "object",
                "compact-options": "object",
                "dates" : {
                    "convert" : "boolean",
                    "suffix" : "string",
                    "input-types" : "object",
                    "input-formats" : "object",
                    "output-format" : "string"
                },
                "default-model": "object",
                "default-prefixed-properties": "object",
                "send-warnings": "boolean"
            }
        },
        "solr" : {
                "datastore-url" : "string",
                "default-params": "object"
         },
        "port" : "number",
        "development" : "boolean"
    };

    function checkProperties(object, properties, prefix) {
        _.each(properties, function(type, property) {

            if (!_.isString(type)) {
                var subObject = object[property];
                var subProperties = type;
                type = "object";
            }

            it('property ' + prefix + property + ' should be of type ' + type, function() {
                object[property].should.be.of.type(type);
            });

            if (!_.isUndefined(subObject))
                checkProperties(subObject, subProperties, property + ':');

        });
    }

    checkProperties(options, optionsProperties, "");

});