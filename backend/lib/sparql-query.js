/**
 * SPARQL QUERY
 */

var fs = require('fs');
var _ = require('underscore');
var http = require('http');
var url = require('url');
var logger = require('./logger');

function SparqlQuery(file)
{
    this.paramRegex = new RegExp('{{((?!}).)+}}', 'g');
    this.queryText = fs.readFileSync(file).toString();
}

SparqlQuery.prototype.filterEscapeDoubleQuotes = function(string) {
    return string.replace(/"/g, '\\"');
};

SparqlQuery.prototype.filterRemoveLTGT = function(string) {
	return string.replace(/[<>]/g, '');
};

SparqlQuery.prototype.renderQuery = function(params) {
    params = params || {};

    var thisInstance = this;

    return this.queryText.replace(this.paramRegex, function(match) {
        logger.debug('sparql query:' + match.substring(1, match.length - 1));
        var definition = JSON.parse(match.substring(1, match.length - 1));
        var key = definition['param'];

        if (params[key] == null && definition['default'] == null)
            throw Error("SparqlQuery: parameter missing - " + key);

        var result = params[key] ? params[key] : definition['default'];

        if (params["filter"]) {
            var filter_name = "filter" + params["filter"];
            if (!_.contains(_.methods(thisInstance), filter_name))
                throw Error("SparqlQuery: invalid filter name: " + params["filter"]);
            result = thisInstance[filter_name](result);
        }

        return result;
    });
};

module.exports = SparqlQuery;
