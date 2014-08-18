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
        	"resourceTitle" : "http://resourceTitle",
            "actTitle" : {
            	"@id" : "http://actTitle",
                "@language": "cs",
            },
        	"actId" : "http://actId",
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

		   if (responseJSONLD["@graph"][0]["resourceTitle"]) {
			   // the result is just "resourceTitle", nothing else
		   } else {
		   
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
                
                data["act"] = [{
                		"@id" : data["ancestors"][0]["@id"],
                		"actId" : data["actId"][0],
                		"actTitle" : data["actTitle"][0]
                }]
                data["ancestors"].splice(0, 1);
                
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
        
	   }

        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "type" : ["string", ""],
            "resourceTitle" : ["string", ""],
            "act" : [{
            	"@id" : ["string", ""],
            	"actTitle" : ["string", ""],
            	"actId" : ["string", ""]
            }],
            "expression" : ["string", ""],
            "validIso" : ["string", ""],
            "identifier": ["string", ""],
            "title": ["string", ""],
            "ancestors" : [{
                "@id" : ["string", ""],
                "type" : ["string", ""],
                "identifier": ["string", ""],
                "realization": ["string", ""]
            }, []],
        }
    };

    route.getPrefixedProperties = function() {
        return [
            "@id",
            "type",
            "expression",
            "realization"
        ];
    };
    
    return route;
};