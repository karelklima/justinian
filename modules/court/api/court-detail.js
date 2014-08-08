module.exports = function(routeParams) {
    
	var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "title" : {
        		"@id" : "http://purl.org/dc/terms/title",
        		"@language": "cs"
        	},
            "email": {
            	"@id" : "http://schema.org/email",
                "@type": "http://www.w3.org/2001/XMLSchema#string",
              },
            "faxNumber" : {
            	"@id" : "http://schema.org/faxNumber",
            	"@type": "http://www.w3.org/2001/XMLSchema#string",
          	},
            "telephone": {
            	"@id" : "http://schema.org/telephone",
                "@type": "http://www.w3.org/2001/XMLSchema#string",
            },
            "url" : "http://schema.org/url",
            "locality" : {
            	"@id" : "http://schema.org/addressLocality",
            	"@language": "cs"
            },
            "streetAddress" : {
            	"@id" : "http://schema.org/streetAddress",
            	"@language": "cs"            	
            },
            "postalCode" : {
            	"@id" : "http://schema.org/postalCode",
            	"@language": "cs"            	
            }

        }
    };

/*
    route.prepareResponse = function(responseJSONLD) {
    	
    	var decision = responseJSONLD["@graph"][0];
  
    	if (_.has(decision, "subject")) {
            decision["subjectTitle"] = [];
            _.each(decision["subject"], function(item) {
                decision["subjectTitle"].push(item.substring(item.lastIndexOf('/') + 1).replace("-", " "))
            });
    	}
    	
    	if (_.has(decision, "rawIdentifier")) {
            decision["rawIdentifier"].forEach(function(identifier){
                if (identifier.match(/^[0-9]/)) { decision["identifier"] = identifier; }
            });
    	}
    	
    	if (_.has(decision, "creatorTitles")) {
    		if (decision["creator"] == "http://linked.opendata.cz/resource/court/cz/nejvyssi-soud") 
    			decision["creatorTitle"] = "Nejvyšší soud ČR"; 
    		else
                decision["creatorTitle"] = decision["creatorTitles"][0];
    	}
        return responseJSONLD;
    };
*/
    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "title" :["string", ""],
            "email" : ["string", ""],
            "faxNumber" : ["string", ""],
            "telephone" : ["string", ""],
            "url" : ["string", ""],
            "locality" : ["string", ""],
            "streetAddress" : ["string", ""],
            "postalCode" : ["string", ""]
        }
    };
    
    return route;
};