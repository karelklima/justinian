/**
 * CORE SPARQL QUERY
 */

var fs = require('fs');
var _ = require('underscore');
var http = require('http');
var url = require('url');

module.exports = function(file, params)
{
    params = params || {};

    var text = fs.readFileSync(file).toString();

    return {
        generate: function () {
            var parsed = text;

            var regex = new RegExp('{{((?!}).)+}}', 'g');

            parsed = parsed.replace(regex, function(match) {
                console.log(match.substring(1, match.length - 1));
                var localParam = JSON.parse(match.substring(1, match.length - 1));

                var key = localParam["param"];
                var result = params[key];

                if (localParam["escape"] || localParam["escape"] == "doubleQuotes")
                    result = result.replace(/"/g, '\\"');

                return result;
            });

            console.log(parsed);

            return parsed;

        }
    }
}
