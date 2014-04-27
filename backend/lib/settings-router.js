/**
 * Created by Karel on 21. 4. 2014.
 */

var express = require('express');
var util = require('util');
var FrontendSettings = require('./frontend-settings');

var settingsRouter = express();

exports = module.exports = settingsRouter;

settingsRouter.use('/:type/:format', function(req, res, next) {

    var type = req.params.type;
    var format = req.params.format;

    var frontendSettings = new FrontendSettings();

    var config, template;

    switch (type)
    {
        case "default":
            config = frontendSettings.getDefaultSettings();
            template = format == "js" ? 'var defaultConfig = %s;' : '%s';
            break;
        case "user":
            config = frontendSettings.getUserSettings();
            template = format == "js" ? 'var userConfig = %s' : '%s';
            break;
    }

    if (config && template) {
        res.write(util.format(template, JSON.stringify(config, null, 2)));
        res.end();
    }
    else
        next();

});