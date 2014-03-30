/**
 * API route
 *
 * Interface to be used in all REST API routes
 */
var fs = require('fs');
var _ = require('underscore');
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var sparqlClient = require('./sparql-client');
var sparqlQuery = require('./sparql-query');

var module;
var api;

function ApiRoute(module_name, api_name) {
    module = module_name;
    api = api_name;
}

ApiRoute.prototype.getModuleName = function() {
    return module;
};

ApiRoute.prototype.getApiName = function() {
    return api;
};

/**
 * REST API GET endpoint
 * @param req
 * @param res
 */
ApiRoute.prototype.get = function(req, res) {
    res.end(404); // TODO Better error handling
};

/**
 * REST API POST endpoint
 * @param req
 * @param res
 */
ApiRoute.prototype.post = function(req, res) {
    res.end(404); // TODO Better error handling
};

module.exports = ApiRoute;