module.exports = function(routeParams) {
    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "creator" : "http://purl.org/dc/terms/creator",
            "identifier" : "http://purl.org/dc/terms/identifier",
            "title" : "http://purl.org/dc/terms/title",
            "fileKind" : "http://purl.org/lex#fileKind",
            "fileNumber" : "http://purl.org/lex#fileNumber",
            "fileYear" : "http://purl.org/lex#fileYear",
            "senateNumber" : "http://purl.org/lex#senateNumber",
            "issued" : {
                "@id" : "http://purl.org/dc/terms/issued",
                "@type": "http://www.w3.org/2001/XMLSchema#date"
            },
            "subject" : "http://purl.org/dc/terms/subject",
            "belongsToFile" : "http://purl.org/lex#belongsToFile",
            "decisionCategory" : "http://purl.org/lex#decisionCategory",
            "decisionKind" : "http://purl.org/lex#decisionKind",
            "decisionCategoryLabel" : "http://DECISIONCATEGORYLABEL",
            "decisionKindLabel" : "http://DECISIONKINDLABEL"
        }
    };


    route.prepareResponse = function(responseJSONLD, next) {
        if (_.has(responseJSONLD, "subject")) {

            var extractSubject = function(url) {
                return url.substring(url.lastIndexOf('/') + 1).replace("-", " ");
            };

            if (_.isArray(responseJSONLD["subject"]))
            {
                responseJSONLD["subject-title"] = [];
                responseJSONLD["subject"].forEach(function(item) {
                    responseJSONLD["subject-title"].push(extractSubject(item));
                });
            } else {
                responseJSONLD["subject-title"] = extractSubject(responseJSONLD["subject"]);
            }
        }
        responseJSONLD["issued-utc"] = _.has(responseJSONLD, "issued") ? (new Date(responseJSONLD["issued"].substring(0, 10))).valueOf() : "";

        next(responseJSONLD);
    };

    return route;
};