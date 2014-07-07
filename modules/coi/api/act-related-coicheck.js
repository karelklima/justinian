module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "location" : "http://schema.org/location",
            "date" : {
                "@id" : "http://purl.org/dc/terms/date",
                "@type": "http://www.w3.org/2001/XMLSchema#date"
            },
            "result" : "http://schema.org/result",
            "object" : "http://schema.org/object"
        }
    };

    route.prepareResponse = function(responseJSONLD, next) {

        var regions =  {
            "Hlavní město Praha": "PHA",
            "Středočeský kraj": "STČ",
            "Jihočeský kraj": "JHČ",
            "Plzeňský kraj": "PLK",
            "Karlovarský kraj": "KVK",
            "Ústecký kraj": "ULK",
            "Liberecký kraj": "LBK",
            "Královéhradecký kraj": "HKK",
            "Pardubický kraj": "PAK",
            "Kraj Vysočina": "VYS",
            "Jihomoravský kraj": "JHM",
            "Olomoucký kraj": "OLK",
            "Zlínský kraj": "ZLK",
            "Moravskoslezský kraj": "MSK"
        };

        responseJSONLD["@graph"].forEach(function(data) {
            data["location-short"] = _.has(regions, data["location"]) ? regions[data["location"]] : data["location"];
            data["date-utc"] = _.has(data, "date") ? (new Date(data["date"].substring(0, 10))).valueOf() : "";
            data["title"] = data["@id"].substring(data["@id"].lastIndexOf("/check-action/") + 14);
            data["result-count"] = _.has(data, "result") ? (_.isArray(data["result"]) ? data["result"].length : "1") : "0";
        });

        next(responseJSONLD);
    };

    return route;
};