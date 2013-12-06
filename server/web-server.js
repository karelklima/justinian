/**
 * Linked Data Application Framework
 * Node.js web server
 */

var express = require('express');
var http = require('http');
var _ = require('underscore');
var router = require('./lib/router');
var options = require('./options');

var DEFAULT_PORT = 8000;


var app = express();
app.use('/api', router(options));
app.use(express.static(__dirname + '/../app'));




app.listen(DEFAULT_PORT);

