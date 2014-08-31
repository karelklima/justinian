var fs = require('fs');

module.exports = function(routeParams) {
    // return new routeParams.SparqlRoute;

    var _ = routeParams.Underscore;
    var http = routeParams.HTTP;
    var Q = routeParams.Q;
    var route = new routeParams.SparqlRouteJSONLD;

    route.get = function(req, res) {

        var params = this.prepareParams(req.query);

        var expressionRegex = new RegExp("\/(([0-9]{1,})-([0-9]{1,}))\/.*\/(([0-9]{1,})-([0-9]{1,}))\/");


        if (_.isString(params.resource))
        {
            var matches = params.resource.match(expressionRegex);

            var padZero = function(string) {
                return "0000".substring(string.length) + string;
            };

            var cacheFile = __dirname + "/act-text-cache/pr" + padZero(matches[2]) + '-' + padZero(matches[3]) + '_' + padZero(matches[5]) + '-' + padZero(matches[6]) + '.xml';

            if (fs.existsSync(cacheFile))
            {
                var content = fs.readFileSync(cacheFile, "utf8");

                var output = {
                    "@graph":[{
                        "@id" : params.resource,
                        "htmlValue" : content
                    }]
                };

                res.write(JSON.stringify(output, null, "  "));
                res.end();
                return;

                 var g = 1;
            }

            var f = 1;
        }

        var sparqlQuery = this.query.renderQuery(params);

        var thisInstance = this;

        this.client.sendRequest(sparqlQuery, function(responseString) {
            thisInstance.handleResponse(responseString, res, params);
        }, function(responseError) {
            thisInstance.handleError(responseError, res);
        });

    };

    route.getContext = function() {
        return {
            "htmlValue" : "http://linked.opendata.cz/ontology/odcs/htmlValue"
        }
    };

    route.prepareResponse = function(responseJSON)
    {
        if (responseJSON["@graph"].length > 0) {
            var value = responseJSON["@graph"][0]["htmlValue"][0];
            if (value.indexOf("<?xml") == 0) { // it starts with XML declaration
                responseJSON["@graph"][0]["htmlValue"][0] = value.substring(value.indexOf(">") + 1);
            }
        }
        return responseJSON;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "htmlValue" : ["string", ""]
        }
    };

    return route;
};