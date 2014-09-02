/**
 * Index server
 * Manages deployment of index.html to client file with application configuration included
 */

var settings = require('./settings');
var assetManager = require('./asset-manager');

module.exports = function(req, res, next) {
    // prepare application configuration
    var configuration = {
        application : {
            title: settings.options["title"],
            home: settings.options["home"],
            pageNotFound : settings.options["page-not-found"],
            modules: settings.getModulesSetup() // calculates modules configuration
        },
        user: {}
    };
    // send response to client
    res.render(settings.frontendDirectory + '/index.html', {
        title: settings.options["title"],
        configuration: JSON.stringify(configuration), // include application configuration
        css: assetManager.cssPile.htmlTags(), // modules CSS files list
        js: assetManager.jsPile.htmlTags() // modules JS files list
    });
};