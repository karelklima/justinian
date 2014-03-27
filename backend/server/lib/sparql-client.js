/**
 * SPARQL CLIENT
 */
var fs = require('fs');
var _ = require('underscore');
var http = require('http');
var url = require('url');
var querystring = require('querystring');

module.exports = function(options)
{
    options = options || {};
    options["datastore-url"] = options["datastore-url"] || "http://localhost";

    return {
        query: function (text, params, successCallback, errorCallback) {
            var datastoreUrl = url.parse(options["datastore-url"]);

            params = params || {};

            var urlQuery = {
                format: 'application/sparql-results+json',
                timeout: '0',
                debug: 'on',
                query: text
            };

            _.each(params, function(key) {
                urlQuery[key] = params[key];
            });

            datastoreUrl["path"] = datastoreUrl["path"] + '?' + querystring.stringify(urlQuery);

            var data = "";

            successCallback = successCallback || function(data) {};
            errorCallback = errorCallback || function(message) {};

            var dbReq = http.request(datastoreUrl, function(dbRes) {
                dbRes.on('data', function(chunk) {
                    data += chunk;
                });
                dbRes.on('end', function() {
                    successCallback(data)
                });
            });
            dbReq.on('error', function(error) {
                console.log(error);
                errorCallback("Datastore error");
            });

            dbReq.end();
        }
    }
}
