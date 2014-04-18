/**
 * Linked Data Application Framework
 * Node.js web server
 */

var express = require('express');
var http = require('http');
var _ = require('underscore');
var fs = require('fs');
var api_router = require('./lib/api-router');
var settings = require('./lib/settings');
var frontendSettings = require('./lib/frontend-settings');
var assetManager = require('./lib/asset-manager');

var loggingOptions = require('./lib/logging-options');
var logger = require('./lib/logger');
var expressWinston = require('express-winston');

settings.useCache(!settings.options["development"]);

var app = express();

app.use( expressWinston.logger(loggingOptions.requestLogger) );					// request loggger middleware

app.use('/assets', require('./lib/asset-router'));

var modules = settings.getModulesSetup();
_.each(modules, function (moduleSpec, module) {
    app.use('/' + module + '/api', api_router(module, settings.options));
    app.use('/' + module + '/shared', express.static(settings.modulesDirectory + '/' + module + '/shared'));
    _.each(modules[module]["apps"], function (applicationSpec, application) {
        var urlPrefix = '/' + module + '/' + application;
        var pathPrefix = settings.modulesDirectory + '/' + module + '/apps/' + application;
        app.use(urlPrefix + '/js', express.static(pathPrefix + '/js'));
        app.use(urlPrefix + '/partials', express.static(pathPrefix + '/partials'));
    });
});

app.use('/error', function(req, res, next) { next(new Error('testing Error')) });

app.get('/settings/default.js', frontendSettings.defaultSettingsJS);
app.get('/settings/user.js', frontendSettings.userSettingsJS);


app.engine('.html', require('ejs').__express);
app.get('/', function(req, res, next) {
    // Send the index.html for other files to support HTML5Mode
    res.render(settings.frontendDirectory + '/index.html', {
        options: settings.options,
        modules: JSON.stringify(modules),
        css: assetManager.cssPile.htmlTags(),
        js: assetManager.jsPile.htmlTags()

    });
});

app.use(express.static(settings.frontendDirectory));

app.use(expressWinston.errorLogger(loggingOptions.errorLogger));				// error logger middleware
app.use(function(err, req, res, next){											// custom error handlers should follow the error logger
	if (err) {
		res.writeHead(500, {'Content-Type' : 'text/html'});
		res.end('<h2>500 : Internal Error</h2>\n<pre>'+ err.stack + '</pre>')
		} else { next();
}});

app.listen(process.env.PORT || settings.options["port"]);

logger.debug("Server started!\n");