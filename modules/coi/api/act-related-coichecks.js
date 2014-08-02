module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "location" : "http://schema.org/location",
            "date" : {
                "@id" : "http://purl.org/dc/terms/date",
                "@type": "http://www.w3.org/2001/XMLSchema#date"
            },
            "result" : "http://schema.org/result",
            "object" : "http://schema.org/object"
        }
    };

    route.prepareResponse = function(responseJSONLD) {
        responseJSONLD["@graph"].forEach(function(data) {
            data["title"] = data["@id"].substring(data["@id"].lastIndexOf("/check-action/") + 14);
            data["resultCount"] = _.isArray(data["result"]) ? data["result"].length : 0;
        });

        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "location" : ["string", ""],
            "locationShort" : ["string", ""],
            "dateIso" : ["string", ""],
            "result" : ["array", []],
            "resultCount" : ["number", 0],
            "object" : ["array", []],
            "title" : ["string", ""]
        }
    };

    return route;
};