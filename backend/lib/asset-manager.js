/**
 * Created by Karel on 18. 4. 2014.
 */

var util = require('util');
var glob = require('glob');
var crypto = require('crypto');
var _ = require('underscore');

var settings = require('./settings');

function Pile()
{
    this.useRand = true;
    this.rand = '';
    if (settings.options.development)
        this.rand = '?v=' + crypto.randomBytes(20).toString('hex').substring(0,5);
    this.list = [];
    this.regex = /\.*/;
}

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

Pile.prototype.htmlTags = function() {
    // overwrite me
};

function CSSPile() {
    Pile.call(this);
    this.regex = /\.css$/;
}
util.inherits(CSSPile, Pile);

CSSPile.prototype.htmlTags = function() {
    var output = "";
    for (var i = 0; i < this.list.length; i++)
    {
        output = output + '<link href="' + this.list[i].url + '" rel="stylesheet"/>' + "\n";
    }
    return output;
};

function JSPile() {
    Pile.call(this);
    this.regex = /\.js$/;
}
util.inherits(JSPile, Pile);

JSPile.prototype.htmlTags = function() {
    var output = "";
    for (var i = 0; i < this.list.length; i++)
    {
        output = output + '<script src="' + this.list[i].url + '"></script>' + "\n";
    }
    return output;
};


function AssetManager()
{
    this.baseDir = settings.modulesDirectory;
    this.baseUrl = '/';
    this.setup = settings.getModulesSetup();
    this.jsPile = new JSPile();
    this.cssPile = new CSSPile();
    this.findFiles();
}

AssetManager.prototype.getModuleAssetsDir = function(module)
{
    return this.baseDir + '/' + module + '/assets';
};

AssetManager.prototype.getModuleAssetsUrl = function(module)
{
    return this.baseUrl + 'assets/' + module;
};

AssetManager.prototype.getApplicationAssetDir = function(module, application)
{
    return this.baseDir + '/' + module + '/apps/' + application;
};

AssetManager.prototype.getApplicationAssetUrl = function(module, application)
{
    return this.baseUrl + 'assets/' + module + '/' + application;
};

AssetManager.prototype.findFiles = function()
{
    for (var module in this.setup)
    {
        var files = glob.sync(this.getModuleAssetsDir(module) + '/**/*.*');
        this.fillPiles(files, module);

        for (var application in this.setup[module]["apps"])
        {
            var files = glob.sync(this.getApplicationAssetDir(module, application) + '/**/*.*');
            this.fillPiles(files, module, application);
        }
    }
};

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

        if (assetPath.match(this.cssPile.regex)) {
            this.cssPile.addPath(module, assetUrl, assetPath);
        }

        if (assetPath.match(this.jsPile.regex)) {
            this.jsPile.addPath(module, assetUrl, assetPath);
        }
    }
};

var instance = new AssetManager();
module.exports = instance;
