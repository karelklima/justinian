module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "valid" : {
                "@id" : "http://purl.org/dc/terms/valid",
                "@type" : "http://www.w3.org/2001/XMLSchema#date"
            },
            "actID" : "http://purl.org/dc/terms/actID",
            "amendmentID" : {
                "@id": "http://purl.org/dc/terms/amendmentID",
                "@type": "@id"
            },
            "exprID" : "http://purl.org/dc/terms/exprID",
            "partOf": "http://purl.org/vocab/frbr/core#partOf"
        }
    };

   route.prepareResponse = function(responseJSONLD, next) {
        responseJSONLD["@graph"].forEach(function(item) {
        	item["exprID"] != undefined ? item["identifier"] = item["exprID"] : item["identifier"] = item["actID"];
        	item["haveText"] = (item["partOf"]!==undefined);
        	delete item["partOf"];

        });
        
        return responseJSONLD;
    };

   route.getModel = function() {
       return {
           "@id" : ["string", ""],
           "identifier" : ["string", ""],
           "amendmentID" : ["string", ""],
           "validIso" : ["string", ""],
           "haveText": ["boolean", ""]
       }
   };

    route.getPrefixedProperties = function() {
        return [
            "@id",
            "amendmentID"
        ];
    };
    
    return route;
};