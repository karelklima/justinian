/**
 * Created by Karel on 30. 3. 2014.
 */

module.exports = function(routeParams) {

    var _ = routeParams.Underscore;
    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
            "title" : "http://purl.org/dc/terms/title"
        }
    };

   route.prepareResponse = function(responseJSONLD, next) {
       responseJSONLD["@graph"].forEach(function(item) {
                   if(typeof item["title"] == 'string' || item['title'] instanceof String) return;
                   if(item['title'] instanceof Array){
                    var best = undefined;
                    item['title'].forEach(function(title){
                        if((typeof title == 'string' || title instanceof String) && best === undefined)
                            best = title;

                        if(title instanceof Object && title['@language'] == 'cs' && title['@value'] !== undefined)
                            best = title['@value'];
                    });

                    if(best === undefined)
                        item['title'].forEach(function(title){
                            if(title instanceof Object && title['@value'] !== undefined)
                                best = title['@value'];
                        });
                   }

                   item['title'] = best;
               });
        return responseJSONLD;
    };

   route.getModel = function() {
       return {
           "@id" : ["string", ""],
           "title" : ["string", ""]
       }
   };

    return route;
};