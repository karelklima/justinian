var util = require('util');
 
module.exports = function(routeParams) {
    function CustomSparqlRoute(module, api) {
        routeParams.SparqlRoute.call(this, module, api);
    }
 
    util.inherits(CustomSparqlRoute, routeParams.SparqlRoute);
 
    CustomSparqlRoute.prototype.prepareParams = function(params)
    {
        this.client.setParam("format", "application/sparql-results+json");
        return params;
    };
 
    CustomSparqlRoute.prototype.prepareResponse = function(responseString, next) {
        next(responseString);
    };
 
    return CustomSparqlRoute;
};