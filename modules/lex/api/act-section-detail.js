module.exports = function(routeParams) {
    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "type" : "http://type",
            "act" : "http://act",
            "ancestors" : "http://hasAncestor",
            "realization" : "http://hasRealization",
            "identifier" : "http://purl.org/dc/terms/identifier",
            "expression" : "http://sectionExpression",
            "valid" : {
                "@id" : "http://purl.org/dc/terms/valid",
                "@type": "http://www.w3.org/2001/XMLSchema#date"
            }
        }
    };

    route.getReconstructComplexObjects = function() {
        return true;
    };
    
   route.prepareResponse = function(responseJSONLD, requestParams) {

        if (responseJSONLD["@graph"].length > 0) {

            // sorting function for ordering all the expressions of a section according to its validity date:
            var sortByDate = function (a,b) {
                if ( !_.isUndefined(a["validIso"]) && !_.isUndefined(b["validIso"]) ) {
                    return (a["validIso"] > b["validIso"]) ? -1 :
                        (a["validIso"] < b["validIso"]) ? 1 : 0;
                }
            };

            var sortById = function(a, b) {
                return a["@id"] > b["@id"];
            };

            var path = [];

            var data = responseJSONLD["@graph"][0];
            if (_.isArray(data["ancestors"])) {
                data["ancestors"].sort(sortById);
                _.each(data["ancestors"], function(ancestor) {
                    path.push([ancestor["type"], ancestor["identifier"]]);
                    if (_.isArray(ancestor["realization"])) {
                        ancestor["realization"].sort(sortByDate);
                        ancestor["realization"] = ancestor["realization"][0]["@id"];
                    }
                });
            }
            if (_.isArray(data["expression"])) {
                data["expression"].sort(sortByDate);
                data["validIso"] = data["expression"][0]["validIso"];
                data["expression"] = data["expression"][0]["@id"];
            }

            path.push([data["type"], data["identifier"]]);

            var formatSection = function(section) {
                switch (section[0][0]) {
                    case "http://purl.org/lex/cz#Paragraf":
                        return "§ " + section[1][0];
                    case "http://purl.org/lex/cz#Clanek":
                        return "Čl. " + section[1][0];
                    case "http://purl.org/lex/cz#Odstavec":
                        return "odst. " + section[1][0];
                    case "http://purl.org/lex/cz#Pismeno":
                        return "písm. " + section[1][0] + ")";
                    case "http://purl.org/lex/cz#Bod":
                        return "bod " + section[1][0] + ".";
                    default:
                        return "X";
                }
            };

            data["title"] = _.map(path, formatSection).join(" ");
        }

        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "type" : ["string", ""],
            "act" : ["string", ""],
            "expression" : ["string", ""],
            "validIso" : ["string", ""],
            "identifier": ["string", ""],
            "title": ["string", ""],
            "ancestors" : [{
                "@id" : ["string", ""],
                "type" : ["string", ""],
                "identifier": ["string", ""],
                "realization": ["string", ""]
            }, []]
        }
    };

    route.getPrefixedProperties = function() {
        return [
            "@id",
            "act",
            "type",
            "expression",
            "realization"
        ];
    };
    
    return route;
};