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
                specification["datasets"].forEach(function(dataset){
                	rawValues.push([specification["type"], specification["property"], specification["label"], dataset]);
                });
            });
        }

    });

    _.each(rawPrefixes, function(uri, prefix) {
        persistentParams.prefixes = persistentParams.prefixes + "PREFIX " + prefix + " <" + uri + ">\n";
    });
    _.each(rawFrom, function(uri) {
        persistentParams.from = persistentParams.from + "FROM NAMED <" + uri + ">\n";
    });
    var rawValuesTemp = [];
    _.each(rawValues, function(triple) {
        rawValuesTemp.push("VALUES (?type ?property ?label ?graph) { ( " + triple[0] + " " + triple[1] + ' "' + triple[2] + '" <' + triple[3] + '>' +" ) }");
    });
    persistentParams.values = "{\n" + rawValuesTemp.join("\n} UNION {\n") + "\n}\n";

    var route = new routeParams.SparqlRouteJSONLD;

    route.prepareParams = function(params) {
        _.extend(params, persistentParams);
        return params;
    };

    route.getContext = function() {
        return {
            "text" : "http://TEXT",
            "score" : "http://SCORE",
            "label" : "http://LABEL"
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
            item["score"] = Number(item["score"]);
        });

        responseJSON["@graph"] = _.sortBy(responseJSON["@graph"], function(item) { return 100 - item["score"]; });

        return responseJSON;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "@type" : ["string", ""],
            "text" : ["string", ""],
            "score" : ["number", 0],
            "label" : ["string", ""]
        }
    };

    route.getPrefixedProperties = function() {
        return [
           "@id",
           "@type"
        ];
    };

    return route;

};