/**
 * LDAF SPARQL route
 */
var fs = require('fs');
var _ = require('underscore');
var http = require('http');
var url = require('url');
var querystring = require('querystring');

module.exports.fromFile = function(file, options)
{
    options = options || {};
    options["datastore-url"] = options["datastore-url"] || "http://localhost";

    var text = fs.readFileSync(file).toString();
    return {
        get: function (req, res, done) {
            var localText = text;
            for (var key in req.query)
            {
                var re = new RegExp('__' + key + '__', 'g')
                localText = localText.replace(re, req.query[key]);
            }

            var params = url.parse(options["datastore-url"]);

            var query = {
                format: 'application/sparql-results+json',
                timeout: '0',
                debug: 'on',
                query: localText
            };

            params["path"] = params["path"] + '?' + querystring.stringify(query);

            var dbReq = http.request(params, function(dbRes) {
                res.sethe
                dbRes.on('data', function(chunk) {
                    res.write(chunk);
                });
                dbRes.on('end', function() {
                    res.end();
                    done();
                });
            });
            dbReq.on('error', function(error) {
                console.log(error);
                res.write("Datastore connection error");
                res.end();
                done();
            });

            dbReq.end();
        }
    }
}
