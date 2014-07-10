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

    route.prepareResponse = function(responseJSONLD) {

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
            data["title"] = data["@id"].substring(data["@id"].lastIndexOf("/check-action/") + 14);
            data["result-count"] = _.has(data, "result") ? (_.isArray(data["result"]) ? data["result"].length : "1") : "0";
        });

        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "location" : ["string", ""],
            "location-short" : ["string", ""],
            "date" : ["string", ""],
            "date-utc" : ["number", undefined],
            "result" : ["array", []],
            "object" : ["array", []],
            "title" : ["string", ""],
            "result-count" : ["number", 0]
        }
    };


    return route;
};