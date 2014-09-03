/**
 * SPARQL QUERY
 */

var fs = require('fs');
var _ = require('underscore');
var http = require('http');
var url = require('url');
var logger = require('./logger');

/**
 * SparqlQuery
 * Tool for generating SPARQL queries
 * @param file SPARQL query file
 * @constructor
 */
function SparqlQuery(file)
{
    // Regex for string between "{{" and "}}"
    this.paramRegex = new RegExp('{{((?!}).)+}}', 'g');
    // load SPARQL query file
    this.queryText = fs.readFileSync(file).toString();
}

// Replace '"' with '\"' in input string
SparqlQuery.prototype.filterEscapeDoubleQuotes = function(string) {
    return string.replace(/"/g, '\\"');
};

// Removes "<" and ">" characters from input string
SparqlQuery.prototype.filterRemoveLTGT = function(string) {
	return string.replace(/[<>]/g, '');
};

// Generates complete SPARQL text using input parameters
SparqlQuery.prototype.renderQuery = function(params) {
    params = params || {};

    var thisInstance = this;

    // match all possible parameter definitions in SPARQL query
    // and replace them with actual values
    // for example {{"param":"query", "default", "xyz"}}
    return this.queryText.replace(this.paramRegex, function(match) {
        logger.debug('sparql query:' + match.substring(1, match.length - 1));
        // convert match to JSON object
        var definition = JSON.parse(match.substring(1, match.length - 1));
        var key = definition['param'];

        if (params[key] == null && definition['default'] == null)
            throw Error("SparqlQuery: parameter missing - " + key);

        var result = params[key] ? params[key] : definition['default'];

        if (_.isUndefined(result))
            result = "";

        // apply filters
        if (definition['filter']) {
            var filterName = "filter" + definition['filter'];
            if (!_.contains(_.methods(thisInstance), filterName))
                throw Error("SparqlQuery: invalid filter name: " + definition['filter']);
            result = thisInstance[filterName](result);
        }

        return result;
    });
};

module.exports = SparqlQuery;
