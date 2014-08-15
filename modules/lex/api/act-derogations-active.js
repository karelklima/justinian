module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "valid" : {
                "@id" : "http://valid",
                "@type" : "http://www.w3.org/2001/XMLSchema#date"
            },
            "typeRaw" : "http://type",
            "original" : "http://original",
            "result" : "http://result"
        }
    };

   route.prepareResponse = function(responseJSONLD, next) {
        responseJSONLD["@graph"].forEach(function(item) {
        	if(! _.isUndefined(item["typeRaw"]))
        		switch(item["typeRaw"][0]) {
        		case "http://purl.org/lex#Cancellation" : item["type"] = "zrušení"; break;
        		case "http://purl.org/lex#Update" : item["type"] = "změna"; break;
        		case "http://purl.org/lex#Creation" : item["type"] = "vytvoření"; break;
        		default : item["type"] = "neznámý typ"; break;
        		
        		}
        		console.log(item["typeRaw"][0])
        });
        
        return responseJSONLD;
    };

   route.getModel = function() {
       return {
           "@id" : ["string", ""],
           "type" : ["string", ""],
           "original" : ["string", ""],
           "result" : ["string", ""],
           "validIso": ["string", ""]
       }
   };

    route.getPrefixedProperties = function() {
        return [
            "@id",
            "original",
            "result"
        ];
    };
    
    return route;
};