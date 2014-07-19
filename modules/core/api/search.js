module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var settings = routeParams.settings;


    var persistentParams = {};
    persistentParams.prefixes = "";
    persistentParams.from = "";
    persistentParams.values = "x";

    var rawPrefixes = {};
    var rawFrom = [];
    var rawValues = [];
    _.each(settings.getModulesSetup(), function(module) {
        if (module["universal-search"].length > 0) {
            _.extend(rawPrefixes, module["prefixes"]);
            _.each(module["universal-search"], function(specification) {
                rawFrom = _.union(rawFrom, specification["datasets"]);
                rawValues.push([specification["type"], specification["property"]]);
            });
        }

    });

    _.each(rawPrefixes, function(uri, prefix) {
        persistentParams.prefixes = persistentParams.prefixes + "PREFIX " + prefix + " <" + uri + ">\n";
    });
    _.each(rawFrom, function(uri) {
        persistentParams.from = persistentParams.from + "FROM <" + uri + ">\n";
    });
    var rawValuesTemp = [];
    _.each(rawValues, function(pair) {
        rawValuesTemp.push("VALUES (?type ?property) { ( " + pair[0] + " " + pair[1] + " ) }");
    });
    persistentParams.values = "{\n" + rawValuesTemp.join("\n} UNION {\n") + "\n}\n";

    var route = new routeParams.SparqlRouteJSONLD;

    route.prepareParams = function(params) {
        _.extend(params, persistentParams);
        console.log("params");
        return params;
    };

    route.getContext = function() {
        return {
            "text" : "http://TEXT"
        }
    };

    route.prepareResponse = function(responseJSON) {
        var self = this;
        _.each(responseJSON["@graph"], function(item) {
            item["text"] = item["text"][0];
            if (!_.isString(item["text"])) { // it is an object, we need to extract "@value"
                if (!_.isUndefined(item["text"]["@value"])) {
                    item["text"] = item["text"]["@value"];
                } else {
                    self.addWarning(responseJSON, "Invalid result format, string or object with @value property expected");
                }
            }
        });

        return responseJSON;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "@type" : ["string", ""],
            "text" : ["string", ""]
        }
    };

    return route;

};