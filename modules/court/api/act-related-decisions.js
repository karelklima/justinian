module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "subject" : "http://purl.org/dc/terms/subject",
            "title" : "http://purl.org/dc/terms/title",
            "issued" : {
                "@id" : "http://purl.org/dc/terms/issued",
                "@type": "http://www.w3.org/2001/XMLSchema#date"
            }
        }
    };

    route.prepareResponse = function(responseJSONLD) {

        responseJSONLD["@graph"].forEach(function(data) {
            data["subject"] = _.isArray(data["subject"]) ? data["subject"].join(', ') : "";
        });

        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "title" : ["string", ""],
            "issuedIso" : ["string", ""],
            "subject": ["string", ""]
        }
    };

    return route;

};