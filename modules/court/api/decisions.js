module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var jsonld = routeParams.JSONLD;

    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "title" : "http://purl.org/dc/terms/title",
            "issued" : {
                "@id" : "http://purl.org/dc/terms/issued",
                "@type" : "http://www.w3.org/2001/XMLSchema#date"
            },
            "subject" : "http://purl.org/dc/terms/subject",
            "creator" : {
            	"@id" : "http://purl.org/dc/terms/creatorTitle",
            	"@language": "cs"
            },
            "identifier" : "http://purl.org/dc/terms/identifier",
            "fileKind" : "http://purl.org/lex#fileKind",
            "fileNumber" : "http://purl.org/lex#fileNumber",
            "senateNumber" : "http://purl.org/lex#senateNumber",
            "decisionCategory" : "http://www.w3.org/2004/02/skos/core#catLabel",
            "decisionKind" : "http://www.w3.org/2004/02/skos/core#kindLabel",
            "hasText" : "http://purl.org/dc/terms/hasText"
        };
    };
    
    route.prepareParams = function(params) {
    	var outputParams = {};
    	outputParams.values = " ";
    	
	    for(var param in params) {
			
			// remove incoming doublequotes
			params[param] = params[param].replace(/"/g, '');
			
			// construct the SPARQL query
			switch(param) {
				case "category" : outputParams.values += 
					"?dec lex:decisionCategory <http://linked.opendata.cz/resource/legislation/cz/decision-category/supreme-court/"
					+ params["category"].toLowerCase() + "> .\n";
					break;
				case "kind"  : outputParams.values += 
					"?dec lex:decisionKind <http://linked.opendata.cz/resource/legislation/cz/decision-kind/supreme-court/" 
					+ params["kind"].toLowerCase() + "> .\n";
					break;
				case "creator" : outputParams.values += "?dec dcterms:creator <" + params["creator"] + ">. \n"; break;
				case "subject" : outputParams.values += "?dec dcterms:subject <http://linked.opendata.cz/resource/legislation/cz/decision-subject/" + params["subject"].replace(/ /g, '-') + ">. \n"; break;
				case "fileKind" : outputParams.values += "?file lex:fileKind \"" + params["fileKind"] + "\". \n"; break;
				case "senateNumber" : outputParams.values += "?file lex:senateNumber \"" + params["senateNumber"] + "\". \n"; break;
				case "fileNumber" : outputParams.values += "?file lex:fileNumber \"" + params["fileNumber"] + "\"^^xsd:integer . \n"; break;
				case "minDate" : outputParams.values += "?dec dcterms:issued ?date. \nFILTER ( ?date >= \"" + params["minDate"] + "\"^^xsd:date)\n"; break;
				case "maxDate" : outputParams.values += "?dec dcterms:issued ?date. \nFILTER ( ?date <= \"" + params["maxDate"] + "\"^^xsd:date)\n"; break;
				case "text" : outputParams.values +=
					"?dec  ^frbr:realizationOf ?expr. \n" +
					"?expr <http://linked.opendata.cz/ontology/odcs/xmlValue> ?text . \n";
					break;
				case "query":
					outputParams.values +=
						"?dec  ^frbr:realizationOf ?expr. \n" +
						"?expr <http://linked.opendata.cz/ontology/odcs/xmlValue> ?text . \n" +
						"?text bif:contains '[__enc \"UTF-8\"]\"" +
						params["query"] + "\"'.\n";
					break;
				case "identifier":
					outputParams.values += 
						"?dec dcterms:identifier ?identifier .\n" +
						"?identifier bif:contains '[__enc \"UTF-8\"]\"" +
						params["identifier"] + "\"'.\n";
					break;
				default : outputParams[param] = params[param];
	
	       }
	    }
	
	    return outputParams;
    };
    
    route.prepareResponse = function(responseJSONLD) {
    	responseJSONLD["@graph"].forEach(function(data) {
    		if (_.isArray(data["subject"])) {
    			data["subjectTitles"] = [];
    			data["subject"].forEach(function(subject){
                    var label = subject.substring(subject.lastIndexOf('/') + 1).replace(/-/g, " ");
                    if (label.length > 0)
                        data["subjectTitles"].push(label);
    			});
    		}
    	});
        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "title" : ["string", ""],
        	"issuedIso" : ["string", ""],
            "subjectTitles" : ["object", []],
            "creator" : ["string", ""],
            "identifier" : ["string", ""],
            "fileKind" : ["string", ""],
            "fileNumber" : ["number", 0],
            "senateNumber" : ["string", ""],
            "decisionCategory" : ["string", ""],
            "decisionKind" : ["string", ""],
            "hasText" : ["number", 0]
        }
    };
    
    
    return route;
};