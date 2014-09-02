/**
 * JUSTINIAN
 * Linked Data Application Framework
 * Node.js web server
 */

var express = require('express');
var compression = require('compression');
var http = require('http');
var _ = require('underscore');
var fs = require('fs');
var expressWinston = require('express-winston');
var favicon = require('serve-favicon');
var settings = require('./lib/settings');
var loggingOptions = require('./lib/logging-options');
var logger = require('./lib/logger');
settings.useCache(!settings.options["development"]);

// init ExpressJS application
var app = express();

// enable GZIP compression
app.use(compression());
// request logger middleware
app.use(expressWinston.logger(loggingOptions.requestLogger));
// favicon server
app.use(favicon(settings.baseDirectory + '/' + settings.options["favicon"]));

// assets router for static modules content
app.use('/assets', require('./lib/asset-server'));
// API router for data providers
app.use('/api', require('./lib/api-router'));

// index router with EJS preprocessor in place
app.engine('.html', require('ejs').__express);
app.get('/', require('./lib/index-server'));

// static router for frontend files
app.use(express.static(settings.frontendDirectory));

// error logger middleware
app.use(expressWinston.errorLogger(loggingOptions.errorLogger));
// custom error handler
app.use(function(err, req, res, next){
	if (err) {
		res.writeHead(500, {'Content-Type' : 'text/html'});
		res.end('<h2>500 : Internal Error</h2>');
        logger.error(err.stack);
		} else { next();
}});

// configure server port
app.listen(process.env.PORT || settings.options["port"]);

logger.debug("Server started!\n");