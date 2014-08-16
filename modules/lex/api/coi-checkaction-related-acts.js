module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "identifier" : "http://actId",
            "issued" : {
                "@id" : "http://issued",
                "@type": "http://www.w3.org/2001/XMLSchema#date"
            },
            "title" : "http://title"
        }
    };

    route.getModel = function() {
        return {
        	"@id" : ["string", ""],
            "identifier" : ["string", ""],
            "issuedIso" : ["string", ""],
            "title" : ["string", ""]
        }
    };

    return route;
};