module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "htmlValue" : "http://linked.opendata.cz/ontology/odcs/htmlValue"
        }
    };

    route.prepareParams = function(params) {
        if (!_.isUndefined(params["resource"]) && _.isString(params["resource"])) {
            var position = Math.max(params["resource"].lastIndexOf("/section"), params["resource"].lastIndexOf("/outline"));
            if (position != -1) {
                params["section"] = params["resource"].substring(position + 1); // remove slash at the beginning
                params["resource"] = params["resource"].substring(0, position);
            }
        }
        return params;
    };

    route.prepareResponse = function(responseJSONLD, requestParams) {
        console.log(requestParams);

        if (!_.isUndefined(responseJSONLD["@graph"][0]) && !_.isUndefined(requestParams["section"])) {

            var htmlAct = responseJSONLD["@graph"][0]["htmlValue"][0];
            var section = requestParams["section"];

            var currentSectionRegex = new RegExp('<section[^>]+(resource=\"' + section + '\")[^>]*>');
            var sectionStartRegex = new RegExp('<section[^>]*>', 'g');
            var sectionEndRegex = new RegExp('</section>', 'g');

            var currentSectionMatch = htmlAct.match(currentSectionRegex);

            var htmlSection = "";

            if (currentSectionMatch) {
                htmlAct = htmlAct.substring(currentSectionMatch.index);

                var isValid = function(v) {
                    return v[0] != null && v[1] != null;
                };

                var sectionEndIndex = undefined;

                sectionStartRegex.exec(htmlAct);

                var v = [{index:0}, {index:0}];
                while (isValid(v)) {

                    if (v[0].index > v[1].index) {
                        sectionEndIndex = v[1].index + 10;
                        break;
                    }
                    v = [
                        sectionStartRegex.exec(htmlAct),
                        sectionEndRegex.exec(htmlAct)
                    ];
                }

                if (!_.isUndefined(sectionEndIndex)) {
                    htmlSection = htmlAct.substring(0, sectionEndIndex);
                }
            }

            responseJSONLD["@graph"][0]["htmlValue"] = htmlSection;

        }

        return responseJSONLD;
    };

    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "htmlValue" : ["string", ""]
        }
    };

    return route;
};