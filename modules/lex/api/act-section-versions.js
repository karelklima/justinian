module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "valid" : {
                "@id" : "http://purl.org/dc/terms/valid",
                "@type" : "http://www.w3.org/2001/XMLSchema#date"
            },
            "version" : "http://purl.org/dc/terms/partOf",
            "amendmentId" : "http://purl.org/dc/terms/identifier",
            "amendment" : "http://purl.org/dc/terms/amendment"
        }
    };

    route.getReconstructComplexObjects = function() {
        return true;
    };
    
	
    route.prepareResponse = function(responseJSONLD, next) {
	
    	if (responseJSONLD["@graph"].length > 0) {

    		function sortByProperty(array, propertyName) {
    			return array.sort(function (a, b) {
     	            return (a[propertyName] > b[propertyName]) ? -1 :
     	                    (a[propertyName] < b[propertyName]) ? 1 : 0;
    			});
    		}

    		sortByProperty(responseJSONLD["@graph"], "validIso");

		}
		
        return responseJSONLD;
	};

	route.getModel = function() {
       return {
           "@id" : ["string", ""],
           "version": ["string", ""],
           "validIso" : ["string", ""],
           "amendment" : ["string", ""],
           "amendmentId" : ["string", ""]
       }
	};
    
    route.getPrefixedProperties = function() {
        return [
            "@id",
            "version",
            "amendment"
        ];
    };
    
	
    return route;
};