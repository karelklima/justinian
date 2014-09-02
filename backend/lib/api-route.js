/**
 * API route
 *
 * Interface to be used in all REST API routes
 */
var fs = require('fs');
var _ = require('underscore');
var http = require('http');
var url = require('url');

/**
 * Basic interface of API provider
 * @constructor
 */
function ApiRoute() {
    this.module = null;
    this.api = null;
}

/**
 * Route initialization
 * @param {string} moduleName
 * @param {string} apiName
 */
ApiRoute.prototype.init = function(moduleName, apiName)
{
    this.module = moduleName;
    this.api = apiName;
};

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
    res.end(404);
};

/**
 * REST API POST endpoint
 * @public
 * @param req
 * @param res
 */
ApiRoute.prototype.post = function(req, res) {
    res.end(404);
};

module.exports = ApiRoute;