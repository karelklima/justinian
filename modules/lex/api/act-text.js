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