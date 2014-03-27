/**
 * Linked Data Application Framework
 * Node.js web server
 */

var express = require('express');
var http = require('http');
var _ = require('underscore');
var api_router = require('./lib/api-router');
var options = require('./options');
var Builder = require('./lib/builder');

var DEFAULT_PORT = 8000;
var CLEAN_BUILD = false;

var builder = new Builder(CLEAN_BUILD);
builder.buildModulesDefinition();

var app = express();

_.each(options["api-modules"], function(moduleName) {
    app.use('/' + moduleName + '/api', api_router(moduleName, options));
    app.use('/' + moduleName + '/applications', express.static(__dirname + '/../modules/' + moduleName + '/applications'));
    app.use('/' + moduleName + '/shared', express.static(__dirname + '/../modules/' + moduleName + '/shared'));
});

app.use(express.static(__dirname + '/../app'));

app.listen(DEFAULT_PORT);

process.stdout.write("Server started!");

