module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "valid" : {
                "@id" : "http://actExprValid",
                "@type" : "http://www.w3.org/2001/XMLSchema#date"
            },
            "typeRaw" : "http://type",
            "act" : {
                "@id": "http://act",
                "@type": "@id"
            },
            "actId" : "http://actId",
            "actTitle" : {
            	"@id" : "http://actTitle",
                "@language": "cs",
            }
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
        });
        
		function sortByProperty(array, propertyName) {
			return array.sort(function (a, b) {
 	            return (a[propertyName][0] > b[propertyName][0]) ? -1 :
 	                    (a[propertyName][0] < b[propertyName][0]) ? 1 : 0;
			});
		}

		sortByProperty(responseJSONLD["@graph"], "validIso");
        
        return responseJSONLD;
    };

   route.getModel = function() {
       return {
           "@id" : ["string", ""],
           "type" : ["string", ""],
           "validIso": ["string", ""],
           "act" : ["string", ""],
           "actId" : ["string", ""],
           "actTitle" : ["string", ""]
       }
   };

    route.getPrefixedProperties = function() {
        return [
            "@id",
            "act"
        ];
    };
    
    return route;
};