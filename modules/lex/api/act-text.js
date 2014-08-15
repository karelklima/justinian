module.exports = function(routeParams) {
    // return new routeParams.SparqlRoute;

    var _ = routeParams.Underscore;
    var http = routeParams.HTTP;
    var Q = routeParams.Q;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "htmlValue" : "http://linked.opendata.cz/ontology/odcs/htmlValue"
        }
    };

    route.prepareResponse = function(responseJSON)
    {
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