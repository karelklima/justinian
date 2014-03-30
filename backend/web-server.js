/**
 * Linked Data Application Framework
 * Node.js web server
 */

var express = require('express');
var http = require('http');
var _ = require('underscore');
var fs = require('fs');
var api_router = require('./lib/api-router');
var settings = require('./settings');
var Builder = require('./lib/builder');

var DEFAULT_PORT = 8000;
var CLEAN_BUILD = false;

var builder = new Builder(CLEAN_BUILD);
builder.buildModulesDefinition();

var loggingOptions = require('./lib/logging-options');
var winston = require('winston');
var logger = new winston.Logger(loggingOptions.logger);
winston.addColors(loggingOptions.loggingLevels.colors);
var expressWinston = require('express-winston');

var app = express();

app.use( expressWinston.logger(loggingOptions.requestLogger) );					// request loggger middleware

var modules = require(settings.BuildDirectory + '/modules.json');
_.each(modules, function (moduleSpec, module) {
    app.use('/' + module + '/api', api_router(module, settings.Options, logger));
    app.use('/' + module + '/shared', express.static(settings.ModulesDirectory + '/' + module + '/shared'));
    _.each(modules[module]["apps"], function (applicationSpec, application) {
        var urlPrefix = '/' + module + '/' + application;
        var pathPrefix = settings.ModulesDirectory + '/' + module + '/apps/' + application;
        app.use(urlPrefix + '/js', express.static(pathPrefix + '/js'));
        app.use(urlPrefix + '/partials', express.static(pathPrefix + '/partials'));
    });
});

app.use('/error', function(req, res, next) { next(new Error('testing Error')) });

app.use('/build', express.static(settings.BuildDirectory));

app.use('/css', express.static(settings.FrontendDirectory + '/css'));
app.use('/img', express.static(settings.FrontendDirectory + '/img'));
app.use('/js', express.static(settings.FrontendDirectory + '/js'));
app.use('/lib', express.static(settings.FrontendDirectory + '/lib'));
app.use('/partials', express.static(settings.FrontendDirectory + '/partials'));


app.engine('.html', require('ejs').__express);

app.all('/*', function(req, res, next) {
    // Send the index.html for other files to support HTML5Mode
    res.render(settings.FrontendDirectory + '/index.html', {
        options: settings.Options,
        modules: JSON.stringify(modules)
    });
});

app.use(expressWinston.errorLogger(loggingOptions.errorLogger));				// error logger middleware
app.use(function(err, req, res, next){											// custom error handlers should follow the error logger
	if (err) {
		res.writeHead(500, {'Content-Type' : 'text/html'});
		res.end('<h2>500 : Internal Error</h2>\n<pre>'+ err.stack + '</pre>')
		} else { next();
}});

app.listen(DEFAULT_PORT);

process.stdout.write("Server started!\n");