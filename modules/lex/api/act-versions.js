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
            item["title"] = item["@id"].substring(item["@id"].lastIndexOf("/act/") + 10, item["@id"].lastIndexOf("/"));
        });
        
        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "title" : ["string", ""],
            "valid-utc" : ["number", undefined]
        }
    };
    
    return route;
};