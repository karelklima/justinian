module.exports = function(routeParams) {

    var _ = routeParams.Underscore;

    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
        	"name": "http://hasName",
            "trade" : "http://trade",
            "state" : {
            	"@id" : "http://state",
                "@language": "cs"
            },
            "postalCode" : "http://postalCode",
            "locality" : "http://locality",
            "streetAddress" : "http://streetAddress",
        }
    };


    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "name" : ["string", ""],
        	"trade" : ["object", []],
        	"http://zivnost" : ["string", ""], 
        	"state" : ["string", ""],
        	"postalCode" : ["string", ""],
        	"locality" : ["string", ""],
        	"streetAddress" : ["string", ""]
        }
    };

    return route;

};