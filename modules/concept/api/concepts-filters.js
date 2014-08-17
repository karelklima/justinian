module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "acts" : "http://haveActs",
            "actId" : "http://actId",
            "actTitle" : "http://actTitle"
        }
    };
/*
    route.prepareResponse = function(responseJSONLD) {
        responseJSONLD["@graph"].forEach(function(data) {
            data["title"] = data["@id"].substring(data["@id"].lastIndexOf("/check-action/") + 14);
            data["resultCount"] = _.isArray(data["result"]) ? data["result"].length : 0;
        });

        return responseJSONLD;
    };
*/
    route.getModel = function() {
        return {
        	"acts" : ["object", []],
        	"actId" : ["object", []],
        	"actTitle" : ["object", []],
            
        }
    };

    return route;
};