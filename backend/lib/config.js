/**
 * Created by Karel on 12. 4. 2014.
 */

var settings = require('../settings');


function Config() {

}

Config.prototype.defaultConfig = function(req, res, next) {
    var config = {
        home: {'module': 'lex', 'application': 'search'},
        appConfiguration: require('../build/modules.json')
    };
    res.write('var defaultConfig = ');
    res.write(JSON.stringify(config, null, 2));
    res.write(';');
    res.end();
};

Config.prototype.userConfig = function(req, res, next) {
    // TODO user config
    res.write('var userConfig = {};');
    res.end();
};

module.exports = new Config();