module.exports = function(routeParams) {
;
    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "location" : "http://schema.org/location",
            "regions" : "http://haveRegions",
            "minDate" : {
            	"@id" : "http://haveMinDate",
            	"@type": "http://www.w3.org/2001/XMLSchema#date"
            },
            "maxDate" : {
            	"@id" : "http://haveMaxDate",
            	"@type": "http://www.w3.org/2001/XMLSchema#date"
        	},
        	/*"states" : {
        		"@id" : "http://haveStates",
        		"@language": "cs"
        	}*/
        }
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
        	"regions" : ["object", []],
        	//"states" : ["object", []],
        	"maxDateIso" : ["string", ""],
        	"minDateIso" : ["string", ""]
        }
    };

    return route;
};