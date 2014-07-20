module.exports = function(routeParams) {
    
	var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "creator" : "http://purl.org/dc/terms/creator",
            "creatorTitles" : "http://purl.org/dc/terms/creatorTitles",
            "rawIdentifier" : "http://purl.org/dc/terms/identifier",
            "title" : "http://purl.org/dc/terms/title",
            "fileKind" : "http://purl.org/lex#fileKind",
            "fileNumber" : "http://purl.org/lex#fileNumber",
            "fileYear" : "http://purl.org/lex#fileYear",
            "senateNumber" : "http://purl.org/lex#senateNumber",
            "issued" : {
                "@id" : "http://purl.org/dc/terms/issued",
                "@type": "http://www.w3.org/2001/XMLSchema#date"
            },
            "subject" : "http://purl.org/dc/terms/subject",
            "belongsToFile" : "http://purl.org/lex#belongsToFile",
            "decisionCategory" : "http://www.w3.org/2004/02/skos/core#catLabel",
            "decisionKind" : "http://www.w3.org/2004/02/skos/core#kindLabel"
        }
    };


    route.prepareResponse = function(responseJSONLD) {
    	
    	var decision = responseJSONLD["@graph"][0];
  
    	if (_.has(decision, "subject")) {
    		
    		var extractSubject = function(url) {
                return url.substring(url.lastIndexOf('/') + 1).replace("-", " ");
            };
    		
            if (_.isArray(decision["subject"]))
            {
                decision["subject-title"] = [];
                decision["subject"].forEach(function(item) {
                    decision["subject-title"].push(extractSubject(item));
                });
            } else {
                decision["subject-title"] = extractSubject(responseJSONLD["subject"]);
            }
    	}
    	
    	if (_.has(decision, "rawIdentifier")) {
    		if (_.isArray(decision["rawIdentifier"]))
    		{
    			decision["rawIdentifier"].forEach(function(identifier){
    				if (identifier.match(/^[0-9]/)) { decision["identifier"] = identifier; }
    			});
    		} else {
    			decision["identifier"] = decision["rawIdentifier"];
    		}
    	}
    	
    	if (_.has(decision, "creatorTitles")) {
    		if (decision["creator"] == "http://linked.opendata.cz/resource/court/cz/nejvyssi-soud") 
    			decision["creatorTitle"] = "Nejvyšší soud ČR"; 
    		else if (_.isArray(decision["creatorTitles"]))
    		{
    			decision["creatorTitle"] = decision["creatorTitles"][0]; 
    		} else {
    			decision["creatorTitle"] = decision["creatorTitles"];
    		}
    	}
        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "identifier" : ["string", ""],
            "creator" : ["string", ""],
            "creatorTitle" : ["string", ""],
            "title" : ["string", ""],
            "issuedIso" : ["string", ""],
            "belongsToFile" : ["string", ""],
            "fileKind" : ["string", ""],
            "fileNumber" : ["number", undefined],
            "fileYear" : ["string", ""],
            "senateNumber" : ["string", ""],
        	"decisionKind" : ["string", ""],
            "decisionCategory" : ["string", ""],
            "subject-title" : ["array", []]
        }
    };
    
    return route;
};