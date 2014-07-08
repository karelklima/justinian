module.exports = function(routeParams) {
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "xmlValue" : "http://linked.opendata.cz/ontology/odcs/xmlValue"
        }
    };

    route.prepareResponse = function(responseJSONLD, next) {
        // remove XML tag
        responseJSONLD["htmlValue"] = responseJSONLD["xmlValue"].substring(responseJSONLD["xmlValue"].indexOf(">") + 1);
        next(responseJSONLD);
    };

    return route;
};