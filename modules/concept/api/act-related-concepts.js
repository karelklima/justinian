module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "concepts" : "http://hasConcept",
            "label" : "http://hasLabel",
        }
    };

    route.getReconstructComplexObjects = function() {
        return true;
    };
    
 /*   route.prepareResponse = function(responseJSONLD) {
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
 */   
    route.getModel = function() {
        return {
        	"concepts" : [{
                "@id" : ["string", ""],
                "label" : ["string", ""],
            }, []]
            
        }
    };

 /*   route.getPrefixedProperties = function() {
        return [
            "@id",
            "expression"
        ];
    };
   */ 
    return route;
};