/**
 * Linked Data Application Framework
 * Node.js web server
 */

var express = require('express');
var http = require('http');
var _ = require('underscore');
var api_router = require('./lib/api-router');
var settings = require('./settings');
var Builder = require('./lib/builder');

var DEFAULT_PORT = 8000;
var CLEAN_BUILD = false;

var builder = new Builder(CLEAN_BUILD);
builder.buildModulesDefinition();

var app = express();

_.each(settings.Options["modules"], function(moduleName) {
    app.use('/api/' + moduleName, api_router(moduleName, settings.Options));
    app.use('/apps/' + moduleName, express.static(settings.ModulesDirectory + '/' + moduleName + '/apps'));
    app.use('/shared/' + moduleName, express.static(settings.ModulesDirectory + '/' + moduleName + '/shared'));
});

app.use('/build', express.static(settings.BuildDirectory));

app.use('/css', express.static(settings.FrontendDirectory + '/css'));
app.use('/img', express.static(settings.FrontendDirectory + '/img'));
app.use('/js', express.static(settings.FrontendDirectory + '/js'));
app.use('/lib', express.static(settings.FrontendDirectory + '/lib'));
app.use('/partials', express.static(settings.FrontendDirectory + '/partials'));

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
    res.sendfile('index.html', { root: settings.FrontendDirectory });
});

app.listen(DEFAULT_PORT);

process.stdout.write("Server started!");

