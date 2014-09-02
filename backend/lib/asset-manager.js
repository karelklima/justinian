/**
 * AssetManager
 */

var util = require('util');
var glob = require('glob');
var crypto = require('crypto');
var _ = require('underscore');

var settings = require('./settings');

/*
  * Basic class for CSSPile and JSPile
  * Serves as a container for collection of files
  */
function Pile()
{
    // whether or not include random ?v query string to prevent browser cache
    this.useRand = settings.options.development;
    this.rand = '?v=' + crypto.randomBytes(20).toString('hex').substring(0,5);
    // list of files
    this.list = [];
    this.regex = /\.*/;
}

// ADD file to Pile
Pile.prototype.addPath = function(module, url, file)
{
    if (this.useRand)
    {
        url = url + this.rand;
    }

    this.list.push({
        module: module,
        url: url,
        file: file
    });
};

/**
 * Returns string of html tags of files in collection
 */
Pile.prototype.htmlTags = function() {
    // overwrite me
};

// Pile for CSS files
function CSSPile() {
    Pile.call(this);
    this.regex = /\.css$/; // match CSS files
}
util.inherits(CSSPile, Pile);

// Generate proper CSS html links
CSSPile.prototype.htmlTags = function() {
    var output = "";
    for (var i = 0; i < this.list.length; i++)
    {
        output = output + '<link href="' + this.list[i].url + '" rel="stylesheet"/>' + "\n";
    }
    return output;
};

// Pile for JS files
function JSPile() {
    Pile.call(this);
    this.regex = /\.js$/;
}
util.inherits(JSPile, Pile);

// Generate proper JS html tags
JSPile.prototype.htmlTags = function() {
    var output = "";
    for (var i = 0; i < this.list.length; i++)
    {
        output = output + '<script src="' + this.list[i].url + '"></script>' + "\n";
    }
    return output;
};

/**
 * AssetManager
 *
 */
function AssetManager()
{
    this.baseDir = settings.modulesDirectory;
    this.baseUrl = '/';
    // requests application modules setup
    this.setup = settings.getModulesSetup();
    // init both piles
    this.jsPile = new JSPile();
    this.cssPile = new CSSPile();
    // look for assets
    this.findFiles();
}

// Gets module assets directory
AssetManager.prototype.getModuleAssetsDir = function(module)
{
    return this.baseDir + '/' + module + '/assets';
};
// Gets module assets base URL
AssetManager.prototype.getModuleAssetsUrl = function(module)
{
    return this.baseUrl + 'assets/' + module;
};
// Gets module's application assets directory
AssetManager.prototype.getApplicationAssetDir = function(module, application)
{
    return this.baseDir + '/' + module + '/apps/' + application;
};
// Gets module's application assets URL
AssetManager.prototype.getApplicationAssetUrl = function(module, application)
{
    return this.baseUrl + 'assets/' + module + '/' + application;
};
// Looks for CSS and JS files in modules' and applications' directories
AssetManager.prototype.findFiles = function()
{
    for (var module in this.setup)
    {
        // also include subdirectories
        var files = glob.sync(this.getModuleAssetsDir(module) + '/**/*.*');
        this.fillPiles(files, module);

        for (var application in this.setup[module]["apps"])
        {
            var files = glob.sync(this.getApplicationAssetDir(module, application) + '/**/*.*');
            this.fillPiles(files, module, application);
        }
    }
};
// Adds found files to proper piles
AssetManager.prototype.fillPiles = function(files, module, application)
{
    var path = this.getModuleAssetsDir(module);
    var url = this.getModuleAssetsUrl(module);

    if (application)
    {
        path = this.getApplicationAssetDir(module, application);
        url = this.getApplicationAssetUrl(module, application);
    }

    for (var i = 0; i < files.length; i++)
    {
        var assetPath = files[i].substring(this.baseDir.length);
        var assetUrl = url + files[i].substring(path.length);

        // Adds CSS files to CSSPile
        if (assetPath.match(this.cssPile.regex)) {
            this.cssPile.addPath(module, assetUrl, assetPath);
        }
        // Adds JS files to JSPile
        if (assetPath.match(this.jsPile.regex)) {
            this.jsPile.addPath(module, assetUrl, assetPath);
        }
    }
};

var instance = new AssetManager();
module.exports = instance; // returns singleton instance
