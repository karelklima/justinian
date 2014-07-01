module.exports = function(routeParams) {

    var route = new routeParams.SparqlRouteJSONLD;

    route.prepareResponse = function(responseString, next) {

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

        var decodeUnicode = function(encodedString) {
            var decodeUnicodeStringRegex = /\\u([\d\w]{4})/gi;
            return encodedString.replace(decodeUnicodeStringRegex, function (match, grp) {
                return String.fromCharCode(parseInt(grp, 16));
            });
        };

        var data = JSON.parse(responseString);
        var table = [];

        data.forEach(function(item) {
            var row = {};

            var date = new Date(item["http://purl.org/dc/terms/date"][0]["@value"].substring(0, 10));
            var check = item["@id"];
            var region = item["http://schema.org/location"][0]["@value"];
            var title = decodeUnicode(region);
            var sanction = item["http://schema.org/result"];

            row['date'] = date.valueOf();
            row['resource'] = check;
            row['name'] = "..." + check.substring(check.lastIndexOf("/check-action/") + 23);
            row['title'] = title;
            row['region'] = regions[title];
            row['sanction'] = (typeof sanction === 'undefined') ? 0 : sanction.length;

            table.push(row);
        });

        next(JSON.stringify(table));
    };

    return route;
};