module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

 route.prepareParams = function(params) {
    	
    	var outputParams = {};
    	
    	outputParams.values = "OPTIONAL { ?expr  odcs:htmlValue ?html .}\n";

    	// if "text" is present, the text atribute is no longer optional
    	if ( ! _.isUndefined(params["text"]) )
    		outputParams.values = "";
    	    	
	    for(var param in params) {
			
			// remove incoming doublequotes
			params[param] = params[param].replace(/"/g, '');
			
			// construct the SPARQL query
			switch(param) {
				case "text": outputParams.values += "?expr  odcs:htmlValue ?html .\n"; break;
				case "expression": outputParams.values += "?conceptVersion frbr:partOf <" + params["expression"] + ">.\n"; break;
				case "label":  outputParams.values += "?conceptVersion skos:prefLabel ?label.\n " +
						"?label bif:contains '[__enc \"UTF-8\"]\"" +
						params["label"] + "\"'.\n";
					break;
				case "definition":  outputParams.values += "?conceptVersion  lexc:hasDefinition ?definition.\n " +
						"?definition bif:contains '[__enc \"UTF-8\"]\"" +
						params["definition"] + "\"'.\n";
					break;
				default : outputParams[param] = params[param];
	       }
	    }
	    
	    return outputParams;
    };
    
    route.getContext = function() {
        return {
            "act" : "http://hasAct",
            "actIdRaw" : "http://actId",
            "actTitle" : { 
            	"@id" : "http://actTitle",
            	"@language" : "cs"
            },
            "actIssued" : {
                "@id" : "http://actIssued",
                "@type" : "http://www.w3.org/2001/XMLSchema#date"
            },
        	"hasText" : "http://hasText",
        	"label" : "http://hasLabel",
        	"expression" : "http://expression",
        	//"definition" : "http://hasDefinition"
        }
    };

    route.getReconstructComplexObjects = function() {
        return true;
    };
    
    route.prepareResponse = function(responseJSONLD) {
        responseJSONLD["@graph"].forEach( function(data) {
        	act = data["act"][0]; // there is only one act for each conceptVersion
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
        	"@id" : ["string", ""],
        	"label" : ["string", ""],
        	//"definition" : ["object", []],
        	"act" : [{
                "@id" : ["string", ""],
                "actId" : ["string", ""],
                "actTitle" : ["string", ""],
                "actIssuedIso" : ["string", ""],
                "hasText" : ["number", 0],
                "expression" : ["string", ""],
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