module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var jsonld = routeParams.JSONLD;

    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
        	"maxDate" : {
                "@id" : "http://maxDate",
                "@type" : "http://www.w3.org/2001/XMLSchema#date"
            },
            "minDate" : {
                "@id" : "http://minDate",
                "@type" : "http://www.w3.org/2001/XMLSchema#date"
            }
        };
    };
    
        route.getModel = function() {
        return {
            "minDateIso" : ["string", ""],
            "maxDateIso" : ["string", ""]
            }
    };
    
    return route;
};