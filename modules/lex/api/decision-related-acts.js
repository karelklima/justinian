module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "title": "http://purl.org/dc/terms/title",
            "identifier": "http://purl.org/dc/terms/identifier",
            "hasSectionsRaw": "http://purl.org/dc/terms/hasSection"
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
            if(_.isArray(data["hasSectionsRaw"]))
            data["hasSections"] = [];
            {
            	data["hasSectionsRaw"].forEach(function(section){
            		if (section != data["@id"]) data["hasSections"].push(section);
            	});
            }
        });

        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "title" : ["string", ""],
            "identifier" : ["string", ""],
            "hasSections" : ["object", []]
        }
    };

    route.getPrefixedProperties = function() {
        return [
            "@id",
            "hasSections"
        ];
    };
    
    return route;
};