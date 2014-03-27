
var fs = require('fs');
var settings = require('../settings');
var moduleAggregator = require('./module-aggregator');

module.exports = function()
{
    this.modulesDefinitionFile = settings.BuildDirectory + '/modules.json';

    this.buildModulesDefinition = function(clean) {
        clean = clean || false;

        var cacheFile = this.modulesDefinitionFile;
        if (fs.existsSync(cacheFile)) {
            if (!clean)
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

        fs.writeFileSync(cacheFile, JSON.stringify(modules, null, '   '));


    }
}