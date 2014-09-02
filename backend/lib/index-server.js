/**
 * Index server
 * Manages deployment of index.html to client file with application configuration included
 */

var settings = require('./lib/settings');
var assetManager = require('./lib/asset-manager');

module.exports = function(req, res, next) {
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
};