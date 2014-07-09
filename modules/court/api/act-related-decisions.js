module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "subject" : "http://purl.org/dc/terms/subject",
            "title" : "http://purl.org/dc/terms/title",
            "valid" : {
                "@id" : "http://purl.org/dc/terms/valid",
                "@type": "http://www.w3.org/2001/XMLSchema#date"
            }
        }
    };

    route.prepareResponse = function(responseJSONLD, next) {

        if ("@graph" in responseJSONLD) {
            responseJSONLD["@graph"].forEach(function (data) {
                data["valid-utc"] = _.has(data, "valid") ? (new Date(data["valid"].substring(0, 10))).valueOf() : "";
            });
        } else {
            responseJSONLD["valid-utc"] = _.has(responseJSONLD, "valid") ? (new Date(responseJSONLD["valid"].substring(0, 10))).valueOf() : "";
        }

        next(responseJSONLD);
    };

    return route;

};