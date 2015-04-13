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
            "creator" : {
                "@id": "http://purl.org/dc/terms/creator",
                "@type": "@id"
            },
            "identifier" : "http://purl.org/dc/terms/identifier",            
            "lastVersion" : {
                "@id": "http://purl.org/vocab/frbr/core#realization",
                "@type": "@id"
            },
            "lastVersionValid" : {
                "@id" : "http://purl.org/dc/terms/lastVersionValid",
                "@type": "http://www.w3.org/2001/XMLSchema#date"
            }
        }
    };

   route.prepareResponse = function(responseJSONLD, next) {
       //var version = responseJSONLD["@graph"][0]["lastVersion"];
       //responseJSONLD["@graph"][0]["lastVersion"] = version[0]["@id"];
       return responseJSONLD;
   };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "title" : ["string", ""],
        	"issuedIso" : ["string", ""],
            "creator" : ["string", ""],
            "identifier" : ["string", ""],
            "lastVersion" : ["string", ""],
            "lastVersionValidIso" : ["string", ""]
        }
    };

    route.getPrefixedProperties = function() {
        return [
            "@id",
            "lastVersion"
        ];
    };
    
    return route;
};