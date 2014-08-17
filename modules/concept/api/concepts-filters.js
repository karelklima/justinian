module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "acts" : "http://haveActs",
            "actIdRaw" : "http://actId",
            "actTitle" : { 
            	"@id" : "http://actTitle",
            	"@language" : "cs"
            },
            "expression" : "http://expression"
        }
    };

    route.getReconstructComplexObjects = function() {
        return true;
    };
    
    route.prepareResponse = function(responseJSONLD) {
        responseJSONLD["@graph"][0]["acts"].forEach( function(act) {
        	if ( _.isArray(act["actIdRaw"]) ) {
        		act["actId"] = act["actIdRaw"][0];
        		act["actIdRaw"].forEach( function(id) {
        			if ( id.indexOf("Sb.") > -1 ) act["actId"] = id;
        		});
        	}
        });

        return responseJSONLD;
    };
    
    route.getModel = function() {
        return {
        	"acts" : [{
                "@id" : ["string", ""],
                "actId" : ["string", ""],
                "actTitle" : ["string", ""],
                "expression" : ["string", ""],
            }, []]
            
        }
    };

    return route;
};