/**
 * SPARQL QUERY
 */

var fs = require('fs');
var _ = require('underscore');
var http = require('http');
var url = require('url');

// private variables
var param_regex = new RegExp('{{((?!}).)+}}', 'g');
var query_text;
var query_params = {};

function SparqlQuery(file)
{
    query_text = fs.readFileSync(file).toString();

    _.each(query_text.match(param_regex), function(match) {
        var local_param = JSON.parse(match.substring(1, match.length - 1));

        var key = local_param["param"];
        query_params[key] = local_param["default"] || null;
    });
}

SparqlQuery.prototype.getDefaultParams = function() {
    return _.clone(query_params);
}

SparqlQuery.prototype.filterEscapeDoubleQuotes = function(string) {
    return string.replace(/"/g, '\\"');
}

SparqlQuery.prototype.renderQuery = function(params) {
    params = params || {};

    var thisInstance = this;

    return query_text.replace(param_regex, function(match) {
        console.log(match.substring(1, match.length - 1));
        var localParam = JSON.parse(match.substring(1, match.length - 1));

        var key = localParam["param"];

        if (params[key] == null)
            throw Error("SparqlQuery: parameter missing - " + key);

        var result = params[key];

        if (localParam["filter"]) {
            var filter_name = "filter" + localParam["filter"];
            if (!_.contains(_.methods(thisInstance), filter_name))
                throw Error("SparqlQuery: invalid filter name: " + localParam["filter"]);
            result = thisInstance[filter_name](result);
        }

        return result;
    });
}

module.exports = SparqlQuery;
