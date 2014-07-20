module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "title": "http://purl.org/dc/terms/title"
        }
    };

    route.prepareResponse = function(responseJSONLD) {

    	responseJSONLD["@graph"].forEach(function(data) {
            if(_.isArray(data["title"]))
            {
            	data["title"].forEach(function(title) {            
            		if(_.isObject(title)) data["title"] = title["@value"];
            	});
            }
        });

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