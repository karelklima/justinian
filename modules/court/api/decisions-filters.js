module.exports = function(routeParams) {
;
    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "decKinds" : "http://haveDecKinds",
            "categories" : "http://haveCategories",
            "creators" : "http://haveCreators",
            "subjects" : "http://haveSubjects",
            "fileKinds" : "http://haveFileKinds",
            "senateNumbers" : "http://haveSenateNumbers",
            "minDate" : {
            	"@id" : "http://haveMinDate",
            	"@type": "http://www.w3.org/2001/XMLSchema#date"
            },
            "maxDate" : {
            	"@id" : "http://haveMaxDate",
            	"@type": "http://www.w3.org/2001/XMLSchema#date"
        	},
        	"states" : {
        		"@id" : "http://haveStates",
        		"@language": "cs"
        	},
        	"courtTitle" : {
        		"@id" : "http://purl.org/dc/terms/title",
        		"@language": "cs"
        	}
        }
    };

    route.prepareResponse = function(responseJSONLD) {
    	
    	responseJSONLD["@graph"].forEach(function(data) {
    		if (data["@id"] != "http://decs") {
    			responseJSONLD["@graph"][data["@id"]] = data;
    		}
    	});
    	
    	responseJSONLD["@graph"].forEach(function(data) {
    		if (!_.isUndefined(data["subjects"])) {
    			data["subjectLabels"] = [];
    			data["subjects"].forEach(function(subject) {
    				data["subjectLabels"].push( subject.substring(subject.lastIndexOf('/') + 1) );
    			});
    			data["subjectLabels"].sort();
    		}
    		if (!_.isUndefined(data["senateNumbers"]))
    			data["senateNumbers"].sort(function(a,b){return a - b});
    		if (!_.isUndefined(data["creators"])) {
    			data["creators-titles"] = []
    			data["creators"].forEach(function(creator) {
    				data["creators-titles"].push( [ creator, responseJSONLD["@graph"][creator]["courtTitle"][0] ] );
    			});
    		}
    		
    	});
    	
    	for (var i = responseJSONLD["@graph"].length - 1; i >= 0; i--) {
    	   if (responseJSONLD["@graph"][i]["@id"] != "http://decs")
    		   responseJSONLD["@graph"].splice(i, 1);
    	}
        return responseJSONLD;
    };
    
    route.getModel = function() {
        return {
            "@id" : ["string", ""],
        	"categories" : ["object", []],
        	"decKinds" : ["object", []],
        	"creators-titles" : ["object", []],
        	"subjectLabels" : ["object", []],
        	"fileKinds" : ["object", []],
        	"senateNumbers" : ["object", []],
        	"maxDateIso" : ["string", ""],
        	"minDateIso" : ["string", ""]
        }
    };

    return route;
};