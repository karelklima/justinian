module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var jsonld = routeParams.JSONLD;

    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "title" : "http://purl.org/dc/terms/title",
            "hasTopic" : "http://salt.semanticauthoring.org/ontologies/sao#hasTopic_PASSIVE",
            "totalCount" : "http://TOTALCOUNT"
        };
    };


    route.prepareResponse = function(responseJSONLD, next) {
        for (var i = 1; i < responseJSONLD["@graph"].length; i++)
        {
            if (responseJSONLD["@graph"][i]["@id"] == "http://RESULTS")
            {
                responseJSONLD["@support"] = [responseJSONLD["@graph"][i]];
                responseJSONLD["@graph"].splice(i, 1);
                break;
            }
        }
        next(responseJSONLD);
    };

    return route;
};