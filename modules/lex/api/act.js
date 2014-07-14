module.exports = function(routeParams) {
    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
        	"title" : {
        		"@id" : "http://purl.org/dc/terms/title",
        		"@language" : "cs"
        	},
            "issued" : {
                "@id" : "http://purl.org/dc/terms/issued",
                "@type" : "http://www.w3.org/2001/XMLSchema#date"
            },
            "creator" : "http://purl.org/dc/terms/creator",
            "identifier" : "http://purl.org/dc/terms/identifier",            
            "lastVersion" : "http://purl.org/vocab/frbr/core#realization",
            "lastVersionValid" : {
                "@id" : "http://purl.org/dc/terms/lastVersionValid",
                "@type": "http://www.w3.org/2001/XMLSchema#date"
            }
        }
    };

   route.prepareResponse = function(responseJSONLD, next) {
        responseJSONLD["@graph"].forEach(function(item) {
            item["issued-utc"] = Number(item["issued-utc"]);
            item["lastVersionValid-utc"] = Number(item["lastVersionValid-utc"]); 
        });
        
        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "title" : ["string", ""],
        	"issued-utc" : ["number", undefined],
            "creator" : ["string", ""],
            "identifier" : ["string", ""],
            "lastVersion" : ["string", ""],
            "lastVersionValid-utc" : ["number", undefined]
        }
    };
    
    return route;
};