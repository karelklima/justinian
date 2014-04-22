/**
 * Created by Karel on 22. 4. 2014.
 */

var _ = require('underscore');
var settings = require('./settings');

const PREFIXES_KEY = "prefixes";

var instance = new PrefixReplacer();
exports = module.exports = instance;

function PrefixReplacer()
{
    this.prefixes = {};
    var setup = settings.getModulesSetup();
    var modules = _.keys(setup);
    for (var i = 0; i < modules.length; i++)
    {
        this.prefixes[modules[i]] = {};
        if (!setup[modules[i]].hasOwnProperty(PREFIXES_KEY))
            continue;
        var modulePrefixes = _.keys(setup[modules[i]][PREFIXES_KEY]);
        for (var j = 0; j < modulePrefixes.length; j++)
        {
            this.prefixes[modules[i]][modulePrefixes[j]] = setup[modules[i]][PREFIXES_KEY][modulePrefixes[j]];
        }
    }
}

PrefixReplacer.prototype.validate = function(module)
{
    if (!_.contains(_.keys(this.prefixes), module) || typeof this.prefixes[module] != "object")
       throw new Error("Unknown module: " + module);
};


PrefixReplacer.prototype.expandString = function(module, value)
{
    this.validate(module);
    for (var prefix in this.prefixes[module])
    {
        if (value.indexOf(prefix) == 0)
            return this.prefixes[module][prefix] + value.substr(prefix.length);
    }
    return value;
};

PrefixReplacer.prototype.contractString = function(module, value)
{
    this.validate(module);
    for (var prefix in this.prefixes[module])
    {
        if (value.indexOf(this.prefixes[module][prefix]) == 0)
            return prefix + value.substr(this.prefixes[module][prefix].length);
    }
    return value;
};