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

/**
 * Basic interface of API provider
 * @param {string} module_name
 * @param {string} api_name
 * @constructor
 */
function ApiRoute(module_name, api_name) {
    this.module = module_name;
    this.api = api_name;
}

/**
 * Gets name (id) of the module of this API
 * @public
 * @returns {string}
 */
ApiRoute.prototype.getModuleName = function() {
    return this.module;
};

/**
 * Gets name (id) of this API
 * @public
 * @returns {string}
 */
ApiRoute.prototype.getApiName = function() {
    return this.api;
};

/**
 * REST API GET endpoint
 * @puublic
 * @param req
 * @param res
 */
ApiRoute.prototype.get = function(req, res) {
    res.end(404); // TODO Better error handling
};

/**
 * REST API POST endpoint
 * @public
 * @param req
 * @param res
 */
ApiRoute.prototype.post = function(req, res) {
    res.end(404); // TODO Better error handling
};

module.exports = ApiRoute;