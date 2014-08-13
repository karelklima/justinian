module.exports = function(routeParams) {
    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "type" : "http://type",
            "ancestorsRaw" : "http://hasAncestor",
            "realizations" : "http://hasRealization",
            "identifier" : "http://purl.org/dc/terms/identifier",
            "expressionsRaw" : "http://sectionExpression",
            "valid" : {
                "@id" : "http://purl.org/dc/terms/valid",
                "@type": "http://www.w3.org/2001/XMLSchema#date"
            }
        }
    };
    
   route.prepareResponse = function(responseJSONLD, next) {
	   
 	    // copy all the helping data for easier access (their URI as their key): 
	   	responseJSONLD["@graph"].forEach(function(data) {
			if ( _.isUndefined(data["ancestorsRaw"]) ) {
				responseJSONLD["@graph"][data["@id"]] = data;
			}
		});

	   	// sorting function for ordering all the expressions of a section according to its validity date:
		var sortRealizations = function (a,b) {
			if ( !_.isUndefined(responseJSONLD["@graph"][a]["validIso"]) && !_.isUndefined(responseJSONLD["@graph"][b]["validIso"]) ) {
				return (responseJSONLD["@graph"][a]["validIso"] > responseJSONLD["@graph"][b]["validIso"]) ? -1 :
						(responseJSONLD["@graph"][a]["validIso"] < responseJSONLD["@graph"][b]["validIso"]) ? 1 : 0;
			}
		}
			
	   	responseJSONLD["@graph"].forEach(function(data) {
	   		if (! _.isUndefined(data["ancestorsRaw"])) {
	   			
	   			// the shortest ancestor (URI-wise) is the parent act:
	   			data["ancestorsRaw"].sort();
	   			data["act"] = data["ancestorsRaw"].splice(0,1);
	   			
	   			// for each ancestor select its last expression
	   			data["ancestors"] = [];
	   			data["ancestorsRaw"].forEach(function(ancestor){
   					if(!_.isUndefined(responseJSONLD["@graph"][ancestor]["realizations"])) {
   						var realizations = responseJSONLD["@graph"][ancestor]["realizations"];					
   						realizations.sort(sortRealizations);
   						var lastExprUri = realizations[0];
   						
   						var newAnc = {
   							"uri" : responseJSONLD["@graph"][ancestor]["@id"],
   							"identifier" : responseJSONLD["@graph"][ancestor]["identifier"][0],
   							"expression" : lastExprUri,
   							"type" : responseJSONLD["@graph"][ancestor]["type"][0]
   							//"valid" : responseJSONLD["@graph"][lastExprUri]["validIso"][0]
   						};
   						
   						data["ancestors"].push( newAnc );   						
   					}
	   			})
	   	
	   			// select the last expression of the given section
	   			data["expressionsRaw"].sort(sortRealizations);
	   			data["expression"] = data["expressionsRaw"][0];
	   		}
	   	})
	   	
	   	// clear the "@graph" space:
		for (var i = responseJSONLD["@graph"].length - 1; i >= 0; i--) {
	 	   if ( _.isUndefined(responseJSONLD["@graph"][i]["ancestorsRaw"]))
	 		   responseJSONLD["@graph"].splice(i, 1);
	 	}
	 	
        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "type" : ["string", ""],
            "act" : ["string", ""],
            "expression" : ["string", ""],
            "ancestors" : ["object", []]
        }
    };

    route.getPrefixedProperties = function() {
        return [
            "@id",
            "ancestors",
            "expression"
        ];
    };
    
    return route;
};