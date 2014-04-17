/**
 * Created by Karel on 10.3.14.
 */

var parseurl = require('parseurl');
var extname = require('path').extname;
var send = require('send');
var url = require('url');
var http = require('http');
var _ = require('underscore');

var settings = require('./settings');

exports = module.exports =  function staticMiddleware(req, res, next) {

    if ('GET' != req.method && 'HEAD' != req.method) return next();
    var path = parseurl(req).pathname;

    var root = settings.modulesDirectory;

    var chunks = path.split('/');

    if (chunks.length > 2
        && settings.getModulesSetup().hasOwnProperty(chunks[1])
        && typeof settings.getModulesSetup()[chunks[1]] == "object"
        && settings.getModulesSetup()[chunks[1]].hasOwnProperty("apps")
        && typeof settings.getModulesSetup()[chunks[1]]["apps"] == "object"
        && settings.getModulesSetup()[chunks[1]]["apps"].hasOwnProperty(chunks[2]))
    { // module + app match
        path = '/' + chunks[1] + '/apps' + path.substring(chunks[1].length + 1);
    }
    else if (chunks.length > 1)
    {
        path = '/' + chunks[1] + '/assets' + path.substring(chunks[1].length + 1);
    }
    else
    {
        return do404();
    }

    var extensions = settings.options["asset-extensions"];
    if (extname(path).length < 1 || !_.contains(extensions, extname(path).substring(1)))
    {
        return do404();
    }

    function do404()
    {
        var status = 404;
        var err = new Error(http.STATUS_CODES[status]);
        err.status = status;
        return error(err);
    }

    function error(err) {
        if (404 == err.status) return next();
        next(err);
    }

    send(req, path)
        .maxage(/*options.maxAge || */0)
        .root(root)
        .on('error', error)
        .pipe(res);

};