module.exports = function(routeParams) {
	
    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "textChunk" : "http://textChunk",
            "label" : "http://label",
            "annotId" :  {
                "@id" : "http://id",
                "@type": "http://www.w3.org/2001/XMLSchema#decimal"
             },
        	"act" : "http://act",
        	"version" : "http://version",
        	"title" : {
        		"@id" : "http://title",
        		"@language" : "cs" 
        	},
        	"actId" : "http://actId",
        }
    };

    route.getReconstructComplexObjects = function() {
        return true;
    };
    
    route.prepareResponse = function(responseJSONLD) {
    	
       responseJSONLD["@graph"].forEach( function(data) {
        	if (! _.isUndefined(data["textChunk"])){
        		data["textChunk"].sort(function(a, b){return  a["annotId"] - b["annotId"] });
        	}
       });

        return responseJSONLD;
    };
    
    route.getModel = function() {
        return {
        	"textChunk" : [{
        		"@id" : ["string", ""] ,
        		"label" : ["string", ""],
        		"annotId" : ["number", 0],
        	}, []],
        	"act" : [{
        		"@id" : ["string", ""] ,
        		"version" : ["string", ""],
        		"title" : ["string", ""],
        		"actId" : ["string", ""],
        	}, []],
        	
        }
    };

    route.getPrefixedProperties = function() {
        return [
            "@id",
            "version"
        ];
    };
    
    return route;
};