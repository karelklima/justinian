module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var jsonld = routeParams.JSONLD;

    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "title" : {
            	"@id" : "http://purl.org/dc/terms/title",
                "@language": "cs",
            },
            "issued" : {
                "@id" : "http://issued",
                "@type" : "http://www.w3.org/2001/XMLSchema#date"
            },
            "creator" : "http://purl.org/dc/terms/creator",

            "identifier" : "http://purl.org/dc/terms/identifier",
            "hasText" : "http://hasText",
            "valid" : {
                "@id" : "http://purl.org/dc/terms/valid",
                "@type" : "http://www.w3.org/2001/XMLSchema#date"
            },
            "hitExpressions" : "http://purl.org/vocab/frbr/core#realization"
        };
    };
    
    route.prepareParams = function(params) {
    	
    	var outputParams = {};
    	
    	// triplets inserted inside resulting CONSTRUCT section
    	outputParams.construct = " ";
    	
    	// triplets inserted into the query, but outside the scope of the LIMIT clause
    	outputParams.outsideLimitValues = " ";
    	
    	// triplets inserted into the query, inside the scope of the LIMIT clause
    	outputParams.values = 
        	"OPTIONAL { ?expr frbr:realizationOf ?act .  GRAPH <http://linked.opendata.cz/resource/dataset/legislation/acts/fulltexts/txt> { ?expr <http://linked.opendata.cz/ontology/odcs/txtValue> ?text } }\n";
    	
    	/*
    	 * if "text" or "query" is present, there is no need for the default OPTIONAL section asking for lexExpressions, because
    	 * the lexExpressions aren't optional any more.
    	 */
    	if (! _.isUndefined(params["text"]) || ! _.isUndefined(params["query"]) )
    		outputParams.values = "";
    	
    	// "query" is a more specific version of "text" -- no need to keep both parameters
    	if (! _.isUndefined(params["text"]) && ! _.isUndefined(params["query"]))
    		delete params["text"];

    	
	    for(var param in params) {
			
			// remove incoming doublequotes
			params[param] = params[param].replace(/"/g, '');
			
			// construct the SPARQL query
			switch(param) {
				case "identifier":
					// fulltext search inside the identifier property:
					outputParams.values += 
						"?act dcterms:identifier ?identifier .\n" +
						"?identifier bif:contains '[__enc \"UTF-8\"]\"" +
						params["identifier"] + "\"'.\n";
					break;
				case "query":
					// fulltext search inside the txtValue property of all possible actExpressions:
					outputParams.values +=
						"?expr frbr:realizationOf ?act . \n" +
						"GRAPH <http://linked.opendata.cz/resource/dataset/legislation/acts/fulltexts/txt> {\n" +
						"?expr <http://linked.opendata.cz/ontology/odcs/txtValue> ?text . \n" +
						"?text bif:contains '[__enc \"UTF-8\"]\"" +
						params["query"] + "\"'.}\n";
					// search for the matching actExpressions again -- in order to return them, they must be outside the LIMIT as well as inside the LIMIT scope
					outputParams.outsideLimitValues =
						"?expr frbr:realizationOf ?act . \n" +
						"OPTIONAL {?expr dcterms:valid ?valid .} \n" +
						"GRAPH <http://linked.opendata.cz/resource/dataset/legislation/acts/fulltexts/txt> {\n" +
						"?expr <http://linked.opendata.cz/ontology/odcs/txtValue> ?text. \n" +
						"?text bif:contains '[__enc \"UTF-8\"]\"" +
						params["query"] + "\"'.}";
					// include the matching actExpressions into the final CONSTRUCT
					outputParams.construct = "\n?act frbr:realization ?expr. \n?expr dcterms:valid ?valid.";
					break;
				case "text" :
					// find only acts whose actExpressions have the "txtValue" property:
					outputParams.values +=
						"?expr frbr:realizationOf ?act . \n" +
						"GRAPH <http://linked.opendata.cz/resource/dataset/legislation/acts/fulltexts/txt> {\n" +
						"?expr <http://linked.opendata.cz/ontology/odcs/txtValue> ?text . } \n";
					break;
				case "minDate" : outputParams.values += "GRAPH <http://linked.opendata.cz/resource/dataset/legislation/cz/uz> { ?act dcterms:issued ?issued2. } \nFILTER ( ?issued2 >= \"" + params["minDate"] + "\"^^xsd:date)\n"; break;
				case "maxDate" : outputParams.values += "GRAPH <http://linked.opendata.cz/resource/dataset/legislation/cz/uz> { ?act dcterms:issued ?issued2. } \nFILTER ( ?issued2 <= \"" + params["maxDate"] + "\"^^xsd:date)\n"; break;
				case "title":
					// fulltext search inside the title property:
					outputParams.values +=
						"?title bif:contains '[__enc \"UTF-8\"]\"" +
						params["title"] + "\"'.\n";
					break;
				default : outputParams[param] = params[param];
	
	       }
	    }
	    
	    return outputParams;
    };
    
    route.getReconstructComplexObjects = function() {
        return true;
    };
    
    route.prepareResponse = function(responseJSONLD, requestParams) {
        
    	 if (responseJSONLD["@graph"].length > 0) {

    		// sorting function for ordering all the expressions of a section according to its validity date:
	        var sortByDate = function (a,b) {
	            if ( !_.isUndefined(a["validIso"]) && !_.isUndefined(b["validIso"]) ) {
	                return (a["validIso"] > b["validIso"]) ? -1 :
	                    (a["validIso"] < b["validIso"]) ? 1 : 0;
	            }
	        };

	        responseJSONLD["@graph"].forEach(function(data){
	        	if (_.isArray(data["expressions"])) {
	        		data["expressions"].sort(sortByDate);
	        	}
	        });
	        
    	}
        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "title" : ["string", ""],
        	"issuedIso" : ["string", ""],
            "creator" : ["string", ""],
            "identifier" : ["string", ""],
            "hasText" : ["number", 0],
            "hitExpressions" : [{
                "@id" : ["string", ""],
                "validIso" : ["string", ""],
            }, []]
        }
    };
    
    
    return route;
};