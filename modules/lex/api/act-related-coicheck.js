module.exports = function(routeParams) {

    var route = new routeParams.SparqlRouteJSONLD;

    route.prepareResponse = function(responseString, next) {
        // Do something
        next(responseString); // async
    };

    return route;

};
