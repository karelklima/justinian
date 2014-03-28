/**
 * LDAF SPARQL route
 */
var fs = require('fs');
var _ = require('underscore');
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var sparqlClient = require('./sparql-client');
var sparqlQuery = require('./sparql-query');

module.exports.fromFile = function(file, options)
{
    options = options || {};
    options["datastore-url"] = options["datastore-url"] || "http://localhost";

    return {
        get: function (req, res, done) {
            var sparql = sparqlQuery(file, req.query).generate();

            console.log(sparql);

            sparqlClient(options).query(sparql, {}, function(result) {
                res.write(result);
                res.end()
            }, function(error) {
                res.write(error);
                res.end();
            });
        }
    }
}
