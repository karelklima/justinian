/**
 * SPARQL CLIENT
 *
 * client for Virtuoso dedicated server
 */
var fs = require('fs');
var _ = require('underscore');
var https = require('https');
var url = require('url');
var querystring = require('querystring');
var assert = require('assert');
var settings = require('./settings');
var logger = require('./logger');


/*
 * SparqlClient
 * options is an object from options.json
 * @constructor
 */
function SparqlClient(options) {
    this.options = options;
    this.params = _.clone(this.options["default-params"]);
}

SparqlClient.prototype.setParam = function (key, value) {
    if (typeof key != "string" || typeof value != "string")
        throw new Error();
    this.params[key] = value;
    return this;
};

SparqlClient.prototype.getParam = function (key) {
    if(!this.params[key])
        throw new Error();
    return this.params[key];
};

/**
 * Sends REST API request to dedicated Virtuoso server specified in options
 * @param query string SPARQL query
 * @param successCallback
 * @param errorCallback
 */
SparqlClient.prototype.sendRequest = function(query, successCallback, errorCallback) {
    logger.debug(query);
    assert(_.isString(query));

    successCallback = successCallback || function(data) {};
    errorCallback = errorCallback || function(message) {};

    var finalParams = _.clone(this.params);
    finalParams["query"] = query; // sends query as query string parameter

    var requestParams = url.parse(this.options["datastore-url"]);
    requestParams["path"] = requestParams["path"] + '?' + querystring.stringify(finalParams);

    https.request(requestParams, function(res) {
        var responseString = '';
        res.on('data', function(chunk) {
            responseString += chunk;
        });
        res.on('end', function() {
            successCallback(responseString);
        });
    }).on('error', function(error) {
        console.log(error);
        errorCallback("Datastore error");
    }).end();

};

module.exports = SparqlClient;