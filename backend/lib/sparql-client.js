/**
 * SPARQL CLIENT
 */
var fs = require('fs');
var _ = require('underscore');
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var assert = require('assert');
var settings = require('../settings');

var options;
var params;

function SparqlClient() {
    options = settings.Options["sparql"];
    params = _.clone(options["default-params"]);
}

SparqlClient.prototype.setParam = function (key, value) {
    if (typeof key != "string" || typeof value != "string")
        throw new Error();
    params[key] = value;
    return this;
};

SparqlClient.prototype.getParam = function (key) {
    if(!params[key])
        throw new Error();
    return params[key];
};

SparqlClient.prototype.sendRequest = function(query, successCallback, errorCallback) {

    assert(_.isString(query));

    successCallback = successCallback || function(data) {};
    errorCallback = errorCallback || function(message) {};

    var finalParams = _.clone(params);
    finalParams["query"] = query;

    var requestParams = url.parse(options["datastore-url"]);
    requestParams["path"] = requestParams["path"] + '?' + querystring.stringify(finalParams);

    http.request(requestParams, function(res) {
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