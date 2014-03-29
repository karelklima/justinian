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

var modules = require(settings.BuildDirectory + '/modules.json');
_.each(modules, function (moduleSpec, module) {
    app.use('/' + module + '/api', api_router(module, settings.Options));
    app.use('/' + module + '/shared', express.static(settings.ModulesDirectory + '/' + module + '/shared'));
    _.each(modules[module]["apps"], function (applicationSpec, application) {
        var urlPrefix = '/' + module + '/' + application;
        var pathPrefix = settings.ModulesDirectory + '/' + module + '/apps/' + application;
        process.stdout.write(urlPrefix);
        process.stdout.write(pathPrefix);
        app.use(urlPrefix + '/js', express.static(pathPrefix + '/js'));
        app.use(urlPrefix + '/partials', express.static(pathPrefix + '/partials'));
    });
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

