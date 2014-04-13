/**
 * Created by Karel on 11.3.14.
 */

'use strict';

var path = require('path');
var fs = require('fs');
var _ = require('underscore');
var logger = require('./logger');

var options = require('./../options');
var directories = require('./../directories');

/**
 * Settings
 * @constructor
 */
function Settings() {
    /**
     * @public
     * @type {object}
     */
    this.options = options;
    /**
     * @public
     * @type {string}
     */
    this.baseDirectory = path.normalize(__dirname + '/..' + directories["base"]);
    /**
     * @public
     * @type {string}
     */
    this.backendDirectory = path.normalize(__dirname + '/..' + directories["backend"]);
    /**
     * @public
     * @type {string}
     */
    this.cacheDirectory = path.normalize(__dirname + '/..' + directories["cache"]);
    /**
     * @public
     * @type {string}
     */
    this.frontendDirectory = path.normalize(__dirname + '/..' + directories["frontend"]);
    /**
     * @public
     * @type {string}
     */
    this.modulesDirectory = path.normalize(__dirname + '/..' + directories["modules"]);
    /**
     * @private
     * @type {boolean}
     */
    this._useCache = true;
    /**
     * @private
     * @type {boolean}
     */
    this._modulesCache = null;
}

/**
 * Enables or disables caching
 * @param {boolean} flag
 */
Settings.prototype.useCache = function(flag) {
    this._useCache = !!flag;
};

/**
 * Gets current setup of modules and applications
 * @public
 */
Settings.prototype.getModulesSetup = function() {

    if (this._modulesCache)
        return this._modulesCache;

    var cacheFile = this.cacheDirectory + '/modules.json';
    if (this._useCache) {
        try {
            logger.log("Trying to load modules definition cache file");
            this._modulesCache = require(cacheFile);
            return this._modulesCache;
        }
        catch (e) {
            logger.debug("Modules definition cache file not found");
            // file does not exists
            // TODO make it async?
            this._modulesCache = this.buildModulesSetup();
            if (!fs.existsSync(path.dirname(cacheFile)))
                fs.mkdirSync(path.dirname(cacheFile));
            fs.writeFileSync(cacheFile, JSON.stringify(this._modulesCache, null, 2));
            logger.debug("Modules definition cache file created");
            return this._modulesCache;
        }
    }

    this._modulesCache = this.buildModulesSetup();
    return this._modulesCache;
};

/**
 * Builds current setup of modules and applications
 * @private
 * @returns object
 */
Settings.prototype.buildModulesSetup = function() {
    logger.debug("Building modules setup");

    var modules = {};
    var moduleDirs = fs.readdirSync(this.modulesDirectory);
    for (var i in moduleDirs)
    {


        var moduleDir = this.modulesDirectory + '/' + moduleDirs[i];
        var modulePackageInfo = require(moduleDir + '/package.json');
        var moduleName = moduleDirs[i];
        var moduleInfo = {};
        _.defaults(moduleInfo, modulePackageInfo, {
            "title" : "Undefined",
            "apps" : {},
            "extends" : [],
            "prefixes" : {}
        });

        moduleInfo["name"] = moduleName;

        var applicationDirs = fs.readdirSync(moduleDir + '/apps');
        for (var j in applicationDirs)
        {
            var applicationDir = moduleDir + '/apps/' + applicationDirs[j];
            if (!fs.lstatSync(applicationDir).isDirectory())
                continue; // neni to aplikace
            var applicationPackageInfo = require(applicationDir + '/package.json');
            var applicationName = applicationDirs[j];
            var applicationInfo = {};
            _.defaults(applicationInfo, applicationPackageInfo, {
                "title" : "Undefined",
                "views" : [],
                "datatypes" : [],
                "dependencies" : []
            });
            applicationInfo["name"] = applicationName;

            var expandedDependencies = [];
            _.each(applicationInfo["dependencies"], function(value) {
                if (value.indexOf('/') < 0)
                    value = moduleName + '/' + value;
                expandedDependencies.push(value);
            });
            applicationInfo["dependencies"] = expandedDependencies;

            moduleInfo["apps"][applicationName] = applicationInfo;
        }

        modules[moduleName] = moduleInfo;
    }

    return modules;
};


/** @type {Settings} */
var settings = new Settings(); // IDE autocomplete hack
module.exports = settings;