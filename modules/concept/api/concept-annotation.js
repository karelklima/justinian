module.exports = function(routeParams) {

    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function()
    {
        return {
            "hasConcept" : "http://hasConcept",
            "hasLabel": "http://hasLabel"
        }
    };

    route.getPrefixedProperties = function()
    {
        return [
            "@id",
            "hasConcept",
            "hasLabel"
        ];
    };

    route.getApplyModel = function()
    {
        return true;
    };

    route.getModel = function()
    {
        return {
            "@id": ["string", ""],
            "hasConcept": ["string", ""],
            "hasLabel": ["string", ""]
        }
    };

    return route;

};