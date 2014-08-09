module.exports = function(routeParams) {

    var _ = routeParams.Underscore;

    var route = new routeParams.SparqlRouteJSONLD;

    route.getContext = function() {
        return {
        	"title": "http://www.w3.org/2004/02/skos/core#notation",
            "date" : {
            	"@id" : "http://purl.org/dc/terms/date",
            	"@type": "http://www.w3.org/2001/XMLSchema#date"
        	},
            "region" : "http://region",
            "zipcode" : "http://zipcode",
            "locality" : "http://locality",
            "street" : "http://street",
            "latitude" : "http://hasLatitude",
            "longitude" : "http://hasLongitude",
            "objectName" : "http://objectName",
            // sankce ČOI
            "resultSanctionsRaw" : "http://resultSanction",
            "value" : {
            	"@id" : "http://value",
            	"@type": "http://www.w3.org/2001/XMLSchema#decimal"
            },
            "currency" : "http://currency",
            // zabavení ČOI
            "resultConfiscationsRaw" : "http://resultConfiscation",
            "amountOfGoods" : {
            	"@id" : "http://amountOfGoods",
            	"@type": "http://www.w3.org/2001/XMLSchema#decimal"
            },
            "unitOfGoods" : "http://unitOfGoods",
            "category" : {
            	"@id" : "http://category",
            	"@language" : "cs"
            },
            "brandName" : "http://brandName",
            // zákazy ČOI	
            "resultBansRaw" : "http://resultBan"
        }
    };
    
    route.prepareResponse = function(responseJSONLD) {
    	
    	responseJSONLD["@graph"].forEach(function(data) {
    		if (data["@id"].indexOf("check-action") == -1){
    			responseJSONLD["@graph"][data["@id"]] = data;
   			}
    	});

    	responseJSONLD["@graph"].forEach(function(data) {
    		// sankce
            if(_.isArray(data["resultSanctionsRaw"]))
            {
            	data["resultSanctions"] = [];
            	data["resultSanctionsRaw"].forEach(function(sanction) {
            		sancDetail = {} ;
            		sancDetail["uri"] = sanction;
            		if (!_.isUndefined(responseJSONLD["@graph"][sanction]["value"])) sancDetail["value"] = responseJSONLD["@graph"][sanction]["value"][0];
            		if (!_.isUndefined(responseJSONLD["@graph"][sanction]["currency"])) sancDetail["currency"] = responseJSONLD["@graph"][sanction]["currency"][0];
            		data["resultSanctions"].push( sancDetail );
            	});
            }
            
            // zabaveni
            if(_.isArray(data["resultConfiscationsRaw"]))
            {
            	data["resultConfiscations"] = [];
            	data["resultConfiscationsRaw"].forEach(function(confiscation) {
            		confDetail = {} ;
            		confDetail["uri"] = confiscation;
            		if (!_.isUndefined(responseJSONLD["@graph"][confiscation]["amountOfGoods"])) confDetail["amount"] = responseJSONLD["@graph"][confiscation]["amountOfGoods"][0];
            		if (!_.isUndefined(responseJSONLD["@graph"][confiscation]["unitOfGoods"])) confDetail["unit"] = responseJSONLD["@graph"][confiscation]["unitOfGoods"][0];
            		if (!_.isUndefined(responseJSONLD["@graph"][confiscation]["category"])) confDetail["category"] = responseJSONLD["@graph"][confiscation]["category"][0];
            		if (!_.isUndefined(responseJSONLD["@graph"][confiscation]["brandName"])) { confDetail["brand"] = responseJSONLD["@graph"][confiscation]["brandName"][0]; }
            		data["resultConfiscations"].push( confDetail );
            	});
            }
            
            // zakazy
            if(_.isArray(data["resultBansRaw"]))
            {
            	data["resultBans"] = [];
            	data["resultBansRaw"].forEach(function(ban) {
            		console.log(ban);
            		banDetail = {} ;
            		banDetail["uri"] = ban;
            		if (!_.isUndefined(responseJSONLD["@graph"][ban]["amountOfGoods"])) banDetail["amount"] = responseJSONLD["@graph"][ban]["amountOfGoods"][0];
            		if (!_.isUndefined(responseJSONLD["@graph"][ban]["unitOfGoods"])) banDetail["unit"] = responseJSONLD["@graph"][ban]["unitOfGoods"][0];
            		if (!_.isUndefined(responseJSONLD["@graph"][ban]["category"])) banDetail["category"] = responseJSONLD["@graph"][ban]["category"][0];
            		if (!_.isUndefined(responseJSONLD["@graph"][ban]["brandName"])) banDetail["brand"] = responseJSONLD["@graph"][confiscation]["brandName"][0];
            		if (!_.isUndefined(responseJSONLD["@graph"][ban]["value"])) banDetail["value"] = responseJSONLD["@graph"][ban]["value"][0];
            		if (!_.isUndefined(responseJSONLD["@graph"][ban]["currency"])) banDetail["currency"] = responseJSONLD["@graph"][ban]["currency"][0];
            		data["resultBans"].push( banDetail );
            	});
            }
        });
    	
    	for (var i = responseJSONLD["@graph"].length - 1; i >= 0; i--) {
     	   if (responseJSONLD["@graph"][i]["@id"].indexOf("check-action") == -1)
     		   responseJSONLD["@graph"].splice(i, 1);
     	}

        return responseJSONLD;
    };



    route.getModel = function() {
        return {
            "@id" : ["string", ""],
            "title" : ["string", ""],
        	"dateIso" : ["string", ""],
        	"region" : ["string", ""],
        	"zipcode" : ["string", ""],
        	"locality" : ["string", ""],
        	"street" : ["string", ""],
        	"latitude" : ["string", ""],
        	"longitude" : ["string", ""],
        	"objectName" : ["string", ""],
            "resultSanctions" : ["object", []],
            "resultConfiscations" : ["object", []],
            "resultBans" : ["object", []]
        }
    };

    route.getPrefixedProperties = function() {
        return [
            "@id",
            "resultSanctions",
            "resultConfiscations",
            "resultBans"
        ];
    };
    
    return route;

};