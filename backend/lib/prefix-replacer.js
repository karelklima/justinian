/*
 * PrefixReplacer
 */

var _ = require('underscore');
var settings = require('./settings');

const PREFIXES_KEY = "prefixes";

var instance = new PrefixReplacer();
exports = module.exports = instance;

/*
 * PrefixReplacer
 * Provides methods to contract or expand URIs with prefixes
 */
function PrefixReplacer()
{
    // init - create prefix map
    var prefixes = {};
    var setup = settings.getModulesSetup();
    // iterate over all modules
    _.each(setup, function(spec, module) {
        if (_.isObject(spec[PREFIXES_KEY])) {
            var p = spec[PREFIXES_KEY];
            if (_.every(_.keys(p), function(key) { return !_.has(prefixes, key) || prefixes[key] == p[key]; })) {
                _.extend(prefixes, p);
            } else {
                throw Error("Invalid modules configuration, prefix collision detected in module " + module);
            }
        }
    });
    this.prefixes = prefixes;
}

PrefixReplacer.prototype.expandString = function(value)
{
    for (var prefix in this.prefixes)
    {
        if (value.indexOf(prefix) == 0)
            return this.prefixes[prefix] + value.substr(prefix.length);
    }
    return value;
};

PrefixReplacer.prototype.contractString = function(value)
{
    for (var prefix in this.prefixes)
    {
        if (value.indexOf(this.prefixes[prefix]) == 0)
            return prefix + value.substr(this.prefixes[prefix].length);
    }
    return value;
};