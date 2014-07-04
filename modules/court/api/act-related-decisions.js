module.exports = function(routeParams) {
    
    var route = new routeParams.SparqlRouteJSONLD;

    route.prepareResponse = function(responseString, next) {

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

            var resource = item["@id"];
            var title = item["http://purl.org/dc/terms/title"][0]["@value"];

            var valid = [];
            item["http://purl.org/dc/terms/valid"].forEach(function(value) {
                valid.push(new Date(value["@value"].substring(0, 10)).valueOf());
            });

            var subject = [];
            item["http://purl.org/dc/terms/subject"].forEach(function(value) {
                subject.push(decodeUnicode(value["@value"]));
            });

            row['resource'] = resource;
            row['title'] = title;
            row['valid'] = valid;
            row['subject'] = subject.join(', ');

            table.push(row);
        });

        next(JSON.stringify(table));
    };

    return route;

};