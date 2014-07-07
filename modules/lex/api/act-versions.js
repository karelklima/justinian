module.exports = function(routeParams) {
    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "valid" : {
                "@id" : "http://purl.org/dc/terms/valid",
                "@type" : "http://www.w3.org/2001/XMLSchema#date"
            }
        }
    };

    route.prepareResponse = function(responseJSONLD, next) {
        responseJSONLD["@graph"].forEach(function(item) {
            item["title"] = item["@id"].substring(item["@id"].lastIndexOf("/act/") + 4);
            item["valid-utc"] = _.has(item, "valid") ? (new Date(item["valid"].substring(0, 10))).valueOf() : "";

        });
        next(responseJSONLD);
    };

    return route;
};