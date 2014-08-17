module.exports = function(routeParams) {

    var _ = routeParams.Underscore;

    var route = new routeParams.SparqlRouteJSONLD;

    route.prepareParams = function(params) {
    	var outputParams = {};
    	outputParams.values = "?check dcterms:date ?date. \n";
    	
    	outputParams.checkResultsA = "";
    	outputParams.checkResultsB = "OPTIONAL {\n";
    	outputParams.checkResultsC = "}\n";
    	
    	if( ! _.isUndefined(params["dateGT"]) || ! _.isUndefined(params["dateLT"]))
    		outputParams.values = "";
    	
    	for(var param in params) {
    		
    		// remove incoming doublequotes
    		params[param] = params[param].replace(/"/g, '');
    		
    		// construct the SPARQL query
    		switch(param) {
    			case "region" : outputParams.values += "?location s:addressRegion \"" + params["region"] + "\".\n"; break;
    			case "state"  : outputParams.values += "?check s:object/ares:stav-zivnosti/skos:prefLabel \"" + params["state"] + "\"@cs.\n"; break;
    			case "dateGT" : outputParams.values += "?check dcterms:date ?date. \nFILTER ( ?date >= \"" + params["dateGT"] + "\"^^xsd:date)\n"; break;
    			case "dateLT" : outputParams.values += "?check dcterms:date ?date. \nFILTER ( ?date <= \"" + params["dateLT"] + "\"^^xsd:date)\n"; break;
    			case "town":
    				outputParams.values +=
    					"?location s:addressLocality ?locality.\n" +
    					"?locality bif:contains '[__enc \"UTF-8\"]\""
    					+ params["town"] + "\"'.\n";
    				break;
    			case "street":
    				outputParams.values +=
    					"?location s:streetAddress ?street.\n" +
    					"?street bif:contains '[__enc \"UTF-8\"]\""
    					+ params["street"] + "\"'.\n";
    				break;
    			case "zipcode" : outputParams.values += "?location s:postalCode \"" + params["zipcode"] + "\".\n"; break;
    			case "objectName" :
    				outputParams.values +=
    					"?check s:object ?object.\n" +
    					"?object gr:legalName ?objectName.\n" +
    					"?objectName bif:contains '[__enc \"UTF-8\"]\""
    					+ params["objectName"] + "\"'.\n";
    				break;
    			case "activity" :
    				outputParams.values +=
    					"?check s:object ?object.\n" +
    					"?object regorg:orgActivity ?activity.\n" +
    					"?activity skos:prefLabel ?label.\n" +
    					"?label bif:contains '[__enc \"UTF-8\"]\""
    					+ params["activity"] + "\"'.\n";
    				break;
    			case "trade" :
    				outputParams.values +=
    					"?check s:object ?object.\n" +
    					"?object ares:zivnost ?trade.\n" +
    					"?trade dcterms:title ?tradeTitle.\n" +
    					"?tradeTitle bif:contains '[__enc \"UTF-8\"]\""
    					+ params["trade"] + "\"'.\n";
    				break;
    			case "results" :
    				outputParams.checkResultsA = "{ GRAPH <http://linked.opendata.cz/resource/dataset/coi.cz/sankce>{\n " +
    					" ?check s:result ?result. } } UNION { GRAPH <http://linked.opendata.cz/resource/dataset/coi.cz/zajisteni>{\n " +
    					" ?check s:result ?result. } } UNION { GRAPH <http://linked.opendata.cz/resource/dataset/coi.cz/zakazy>{\n" +
    					" ?check s:result ?result. } }\n";
    				outputParams.checkResultsB = "";
    				outputParams.checkResultsC = "";
    				break;
    			default : outputParams[param] = params[param];
 
           }
        }

        return outputParams;
    };

    route.getContext = function() {
        return {
        	"title": "http://www.w3.org/2004/02/skos/core#notation",
            "date" : {
            	"@id" : "http://purl.org/dc/terms/date",
            	"@type": "http://www.w3.org/2001/XMLSchema#date"
        	},
            "region" : "http://region",
            "zipcode" : "http://zipcode",
            "locality" : "http://locality",
            "street" : "http://street",
            "objectName" : "http://objectName",
            "tradeState" : {
            	"@id" : "http://state",
            	"@language": "cs"
        	},
            "trade" : "http://trade",
            "result" : "http://result",	
        }
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "title" : ["string", ""],
        	"dateIso" : ["string", ""],
        	"region" : ["string", ""],
        	"zipcode" : ["string", ""],
        	"locality" : ["string", ""],
        	"street" : ["string", ""],
        	"objectName" : ["string", ""],      
            "result" : ["object", []]		
        }
    };

    return route;

};