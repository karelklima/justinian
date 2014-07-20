module.exports = function(routeParams) {
    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
        	"title" : {
        		"@id" : "http://purl.org/dc/terms/title",
        		"@language" : "cs"
        	},
        }
    };

   route.prepareResponse = function(responseJSONLD, next) {
        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "title" : ["string", ""]
        }
    };
    
    return route;
};