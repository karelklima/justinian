/**
 * Linked Data Application Framework
 * Node.js web server
 */

var express = require('express');
var http = require('http');
var _ = require('underscore');
var fs = require('fs');

var expressWinston = require('express-winston');
var favicon = require('serve-favicon');

var settings = require('./lib/settings');

var assetManager = require('./lib/asset-manager');

var loggingOptions = require('./lib/logging-options');
var logger = require('./lib/logger');

settings.useCache(!settings.options["development"]);

var app = express();

app.use( expressWinston.logger(loggingOptions.requestLogger) );					// request loggger middleware

app.use(favicon(settings.baseDirectory + '/' + settings.options["favicon"]));

app.use('/settings', require('./lib/settings-router'));
app.use('/assets', require('./lib/asset-router'));
app.use('/api', require('./lib/api-router'));

app.use('/error', function(req, res, next) { next(new Error('testing Error')) });


app.engine('.html', require('ejs').__express);
app.get('/', function(req, res, next) {
    // Send the index.html for other files to support HTML5Mode
    var configuration = {
        application : {
            title: settings.options["title"],
            home: settings.options["home"],
            pageNotFound : settings.options["page-not-found"],
            modules: settings.getModulesSetup()
        },
        user: {}
    };
    res.render(settings.frontendDirectory + '/index.html', {
        title: settings.options["title"],
        configuration: JSON.stringify(configuration),
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