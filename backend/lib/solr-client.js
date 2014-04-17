/**
 * SOLR CLIENT
 */

var fs = require('fs');
var _ = require('underscore');
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var assert = require('assert');
var settings = require('./settings');
var logger = require('./logger');

function SolrClient() {
    this.options = settings.options["solr"];
    this.params = _.clone(this.options["default-params"]);
}

SolrClient.prototype.setParam = function (key, value) {
    if (typeof key != "string" || typeof value != "string")
        throw new Error();
    this.params[key] = value;
    return this;
};

SolrClient.prototype.getParam = function (key) {
    if(!this.params[key])
        throw new Error();
    return this.params[key];
};

SolrClient.prototype.sendRequest = function(query, successCallback, errorCallback) {

    assert(_.isString(query));

    successCallback = successCallback || function(data) {};
    errorCallback = errorCallback || function(message) {};

    var finalParams = _.clone(this.params);
    finalParams["q"] = query;

    var requestParams = url.parse(this.options["datastore-url"]);
    requestParams["path"] = requestParams["path"] + '?' + querystring.stringify(finalParams);
logger.debug("finalParams: " + finalParams["q"]);
logger.debug("requestParams: " + JSON.stringify(requestParams));
    
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

module.exports = SolrClient;