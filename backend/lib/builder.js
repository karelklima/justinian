/**
 * Created by Karel on 10.3.14.
 */

'use strict';

var settings = require('../settings');
var fs = require('fs');
var logger = require('./logger');

function Builder(cleanBuild) {
    this.cleanBuild = cleanBuild || false;
}

Builder.prototype.buildModulesDefinition = function() {
    var buildFile = settings.BuildDirectory + '/modules.json';
    if (fs.existsSync(buildFile)) {
        if (this.cleanBuild)
            return;
        else
            fs.unlinkSync(buildFile);
    }

    logger.debug("Rebuilding modules definition");

    var modules = {};

    var moduleDirs = fs.readdirSync(settings.ModulesDirectory);
    for (var i in moduleDirs)
    {
        var moduleDir = settings.ModulesDirectory + '/' + moduleDirs[i];
        var moduleInfo = require(moduleDir + '/package.json');
        var moduleName = moduleInfo["name"];
        delete moduleInfo["name"];
        moduleInfo["apps"] = {};

        var applicationDirs = fs.readdirSync(moduleDir + '/apps');
        for (var j in applicationDirs)
        {
            var applicationDir = moduleDir + '/apps/' + applicationDirs[j];
            if (!fs.lstatSync(applicationDir).isDirectory())
                continue; // neni to aplikace
            var applicationInfo = require(applicationDir + '/package.json');
            var applicationName = applicationInfo["name"];
            delete applicationInfo["name"];
            moduleInfo["apps"][applicationName] = applicationInfo;
        }

        modules[moduleName] = moduleInfo;

    }

    if (!fs.existsSync(settings.BuildDirectory))
        fs.mkdirSync(settings.BuildDirectory);
    fs.writeFileSync(buildFile, JSON.stringify(modules, null, 2));
    logger.debug("Modules definition file created");
}

module.exports = Builder;