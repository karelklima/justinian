module.exports = function(routeParams) {
    
	var _ = routeParams.Underscore;
	var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "xmlValue" : "http://linked.opendata.cz/ontology/odcs/xmlValue"
        }
    };

    
    route.prepareResponse = function(responseJSONLD) {
        if(responseJSONLD["@graph"].length > 0){
            // remove XML tag
            responseJSONLD["@graph"][0]["xmlValue"] = responseJSONLD["@graph"][0]["xmlValue"][0].substring(responseJSONLD["@graph"][0]["xmlValue"].indexOf(">") + 1);
    	}
    	
        return responseJSONLD;
    };
    
    
    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "xmlValue" : ["string", ""]
        }
    }
    
    return route;
};