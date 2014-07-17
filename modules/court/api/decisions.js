module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var jsonld = routeParams.JSONLD;

    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "title" : "http://purl.org/dc/terms/title",
 
            "issued" : {
                "@id" : "http://purl.org/dc/terms/issued",
                "@type" : "http://www.w3.org/2001/XMLSchema#date"
            },
            "subject" : "http://purl.org/dc/terms/subject",
            "totalCount" : "http://TOTALCOUNT"
        };
    };

    route.prepareResponse = function(responseJSONLD) {
        responseJSONLD["@graph"].forEach(function(data) {
            data["subject"] = _.isArray(data["subject"]) ? data["subject"].join(', ') : "";
        });

        for (var i = 1; i < responseJSONLD["@graph"].length; i++)
        {
            if (responseJSONLD["@graph"][i]["@id"] == "http://RESULTS")
            {
                responseJSONLD["@support"] = [responseJSONLD["@graph"][i]];
                responseJSONLD["@graph"].splice(i, 1);
                break;
            }
        }

        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "title" : ["string", ""],
        	"issuedIso" : ["string", ""],
            "subject" : ["string", ""]
        }
    };
    
    
    return route;
};