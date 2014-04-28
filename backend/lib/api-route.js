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

ApiRoute.prototype.init = function(module_name, api_name)
{
    this.module = module_name;
    this.api = api_name;
    this.setup();
};

ApiRoute.prototype.setup = function()
{
    // override me
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