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
FrontendSettings.prototype.getDefaultSettings = function() {
    // TODO
    var config = {};
    config.home = {'module': 'lex', 'application': 'search'};
    config.title = settings.options["title"];
    config.appConfiguration = settings.getModulesSetup();
    return config;
};

/**
 * Serves defaultSettings as JavaScript to the client
 * @deprecated
 * @public
 * @param req
 * @param res
 * @param next
 */
FrontendSettings.prototype.defaultSettingsJS = function(req, res, next) {
    // TODO smazat
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
FrontendSettings.prototype.getUserSettings = function() {
    // TODO
    return {};
};

/**
 * Serves userSettings as JavaScript to the client
 * @deprecated
 * @public
 * @param req
 * @param res
 * @param next
 */
FrontendSettings.prototype.userSettingsJS = function(req, res, next) {
    // TODO smazat
    res.write(util.format('var userConfig = %s;', JSON.stringify({}, null, 2)));
    res.end();
};

module.exports = FrontendSettings;