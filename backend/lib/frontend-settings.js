/**
 * Created by Karel on 12. 4. 2014.
 */

var settings = require('./settings');
var util = require('util');


/**
 * FrontendSettings
 * @constructor
 */
function FrontendSettings() {

}

/**
 * Builds default settings to JSON object
 * @private
 * @returns {{}}
 */
FrontendSettings.prototype.defaultSettings = function() {
    // TODO
    var config = {};
    config.home = {'module': 'lex', 'application': 'search'};
    config.title = settings.options["title"];
    config.appConfiguration = settings.getModulesSetup();
    return config;
};

/**
 * Serves defaultSettings as JSON to the client
 * @public
 * @param req
 * @param res
 * @param next
 */
FrontendSettings.prototype.defaultSettingsJSON = function(req, res, next) {
    // TODO
    var ds = this.defaultSettings();
    res.write(JSON.stringify(ds, null, 2));
    res.end();
};

/**
 * Serves defaultSettings as JavaScript to the client
 * @public
 * @param req
 * @param res
 * @param next
 */
FrontendSettings.prototype.defaultSettingsJS = function(req, res, next) {
    var config = {};
    config.home = {'module': 'lex', 'application': 'search'};
    config.title = settings.options["title"];
    config.appConfiguration = settings.getModulesSetup();
    res.write(util.format('var defaultConfig = %s;', JSON.stringify(config, null, 2)));
    res.end();
};

/**
 * Builds user settings to JSON object
 * @private
 * @returns {{}}
 */
FrontendSettings.prototype.userSettings = function() {
    // TODO
    return {};
};

/**
 * Serves userSettings as JSON to the client
 * @public
 * @param req
 * @param res
 * @param next
 */
FrontendSettings.prototype.userSettingsJSON = function(req, res, next) {
    // TODO
    res.write(JSON.stringify(this.userSettings(), null, 2));
    res.end();
};

/**
 * Serves userSettings as JavaScript to the client
 * @public
 * @param req
 * @param res
 * @param next
 */
FrontendSettings.prototype.userSettingsJS = function(req, res, next) {
    res.write(util.format('var userConfig = %s;', JSON.stringify({}, null, 2)));
    res.end();
};

var frontendSettings = new FrontendSettings();
module.exports = frontendSettings;