module.exports = function(routeParams) {
    // return new routeParams.SparqlRoute;

    var _ = routeParams.Underscore;
    var http = routeParams.HTTP;
    var Q = routeParams.Q;
    var route = new routeParams.SparqlRouteJSONLD;

    route.prepareResponse = function(responseJSON)
    {

        var resource = "";
        if (responseJSON["@graph"].length > 0)
        {
            resource = responseJSON["@graph"][0]["http://purl.org/vocab/frbr/core#realization"][0];
        }

        var response = { "@graph" : [] };

        var deferred = Q.defer();

        var expressionRegexPattern = "^http://linked\.opendata\.cz/resource/legislation/cz/act/([0-9]{4})/([0-9]{1,4})-([0-9]{4})/expression/cz/act/([0-9]{4})/([0-9]{1,4})-([0-9]{4})/cs$";
        var expressionRegex = new RegExp(expressionRegexPattern);

        var addWarning = this.addWarning;

        if (_.isUndefined(resource) || !resource.match(expressionRegex))
        {
            addWarning(response, "Invalid resource specified");
            deferred.resolve(response);
        } else {

            var pad = "0000";
            var matches = resource.match(expressionRegex);
            var cislo = pad.substring(0, pad.length - matches[2].length) + matches[2];
            var rocnik = matches[3];
            var ncislo = pad.substring(0, pad.length - matches[5].length) + matches[5];
            var nrocnik = matches[6];

            var url = "/predpisy/" + rocnik + "/" + cislo + "/pr" + cislo + "-" + rocnik + "_";
            if (cislo == ncislo && rocnik == nrocnik) {
                url = url + "original";
            } else {
                url = url + ncislo + "-" + nrocnik;
            }
            url = url + ".html";

            console.log(url);

            var options = {
                hostname: 'justinian.karelklima.cz',
                port: 80,
                path: url,
                method: 'GET'
            };

            http.request(options, function (res) {
                var responseString = '';
                res.on('data', function (chunk) {
                    responseString += chunk;
                });
                res.on('end', function () {
                    if (res.statusCode == 200) {
                        response["@graph"].push({
                            "@id": resource,
                            "htmlValue": responseString
                        });

                    } else {
                        addWarning(response,"Error fetching resource: " + res.statusCode );
                    }
                    deferred.resolve(response);
                });
            }).on('error', function (error) {
                addWarning(response, "Error contacting justinian.karelklima.cz");
                deferred.resolve(response);
            }).end();

        }

        return deferred.promise;
    };

    /*
    route.get = function(req, res)
    {

        var write = function(responseJSON)
        {
            res.write(JSON.stringify(responseJSON, null, ' '));
            res.end();
        };

        var resource = req.query.resource;

        var expressionRegexPattern = "^http://linked\.opendata\.cz/resource/legislation/cz/act/([0-9]{4})/([0-9]{1,4})-([0-9]{4})/expression/cz/act/([0-9]{4})/([0-9]{1,4})-([0-9]{4})/cs$";
        var expressionRegex = new RegExp(expressionRegexPattern);

        if (_.isUndefined(resource) || !resource.match(expressionRegex))
        {
            write({
                "@graph" : [],
                "@error" : ["Invalid resource specified"]
            });
            return;
        }

        var pad = "0000";
        var matches = resource.match(expressionRegex);
        var cislo = pad.substring(0, pad.length - matches[2].length) + matches[2];
        var rocnik = matches[3];
        var ncislo = pad.substring(0, pad.length - matches[5].length) + matches[5];
        var nrocnik = matches[6];

        var url = "/predpisy/" + rocnik + "/" + cislo + "/pr" + cislo + "-" + rocnik + "_";
        if (cislo == ncislo && rocnik == nrocnik)
        {
            url = url + "original";
        } else {
            url = url + ncislo + "-" + nrocnik;
        }
        url = url + ".html";

        var options = {
            hostname: 'justinian.karelklima.cz',
            port: 80,
            path: url,
            method: 'GET'
        };


        http.request(options, function(res) {
            var responseString = '';
            res.on('data', function(chunk) {
                responseString += chunk;
            });
            res.on('end', function() {
                if (res.statusCode == 200) {
                    write({
                        "@graph": [
                            {
                                "@id": resource,
                                "xmlValue": responseString
                            }
                        ]
                    });
                } else {
                    write({
                        "@graph" : [],
                        "@error" : ["Error fetching resource: " + res.statusCode]
                    });
                }
            });
        }).on('error', function(error) {
            write({
                "@graph" : [],
                "@error" : ["Error contacting justinian.karelklima.cz"]
            });
        }).end();
    }; */

    return route;
};