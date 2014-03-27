/**
 * Created by Karel on 10.3.14.
 */

'use strict';

var settings = require('../settings');
var fs = require('fs');

exports = module.exports = function moduleAggregator(production)
{
    production = production || false;

    var cacheFile = settings.CacheDirectory + '/modules.json';
    if (fs.existsSync(cacheFile)) {
        if (production)
            return;
        else
            fs.unlinkSync(cacheFile);
    }

    var modules = [];

    var moduleDirs = fs.readdirSync(settings.ModulesDirectory);
    for (var i in moduleDirs)
    {
        var moduleDir = settings.ModulesDirectory + '/' + moduleDirs[i];
        var moduleInfo = require(moduleDir + '/package.json');
        moduleInfo["applications"] = [];

        var applicationDirs = fs.readdirSync(moduleDir + '/applications');
        for (var j in applicationDirs)
        {
            var applicationDir = moduleDir + '/applications/' + applicationDirs[j];
            if (!fs.lstatSync(applicationDir).isDirectory())
                continue; // neni to aplikace
            var applicationInfo = require(applicationDir + '/package.json');
            moduleInfo["applications"].push(applicationInfo);
        }

        modules.push(moduleInfo);

    }

    fs.writeFileSync(cacheFile, JSON.stringify(modules));


}