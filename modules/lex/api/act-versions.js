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
            "exprID" : "http://purl.org/dc/terms/exprID"
        }
    };

   route.prepareResponse = function(responseJSONLD, next) {
        responseJSONLD["@graph"].forEach(function(item) {
        	item["exprID"] != undefined ? item["identifier"] = item["exprID"] : item["identifier"] = item["actID"]  
        });
        
        return responseJSONLD;
    };

   route.getModel = function() {
       return {
           "@id" : ["string", ""],
           "identifier" : ["string", ""],
           "validIso" : ["string", ""]
       }
   };
    
    return route;
};