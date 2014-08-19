module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "act" : "http://hasAct",
            "actIdRaw" : "http://actId",
            "actTitle" : { 
            	"@id" : "http://actTitle",
            	"@language" : "cs"
            },
            "expression" : "http://expression",
            "definitions" : "http://hasDefinition",
            "label" : "http://hasLabel",
            "generalConcepts" : "http://hasGeneralConcepts",
            "specificConcepts" : "http://hasSpecificConcepts",
            "textForms" : "http://appearsAs",
            "obligations": "http://hasObligation",
            "targetTextChunk": "http://targetChunk"
        }
    };

    route.getReconstructComplexObjects = function() {
        return true;
    };
    
    /*route.prepareResponse = function(responseJSONLD) {
        responseJSONLD["@graph"][0]["acts"].forEach( function(act) {
        	if ( _.isArray(act["actIdRaw"]) ) {
        		act["actId"] = act["actIdRaw"][0];
        		act["actIdRaw"].forEach( function(id) {
        			if ( id.indexOf("Sb.") > -1 ) act["actId"] = id;
        		});
        	}
        });

        return responseJSONLD;
    };*/

    route.getApplyModel = function() {
        return true;
    };
    
    route.getModel = function() {
        return {
        	"definitions" : ["object", []],
        	"textForms" : ["object", []],
        	"label" : ["string", ""],
        	"generalConcepts" : [{
        		"@id" : ["string", ""],
        		"label" : ["string", ""]
        	}, []],
        	"specificConcepts" : [{
        		"@id" : ["string", ""],
        		"label" : ["string", ""]
        	}, []],
        	"act" : [{
                "@id" : ["string", ""],
                "actId" : ["string", ""],
                "actTitle" : ["string", ""],
                "expression" : ["string", ""]
            }, []],
            "obligations" : [{
                "@id" : ["string", ""],
                "label" : ["string", ""],
                "targetTextChunk" : ["string", ""]
            }, []]
            
        }
    };

    route.getPrefixedProperties = function() {
        return [
            "@id",
            "expression"
        ];
    };
    
    return route;
};