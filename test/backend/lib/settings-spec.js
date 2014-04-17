/**
 * Created by Karel on 31. 3. 2014.
 */

var settings = require('../../../backend/lib/settings');

function checkDescription(object, properties) {
    object.should.have.keys(Object.keys(properties));
    for (var property in properties) {
        object[property].should.have.type(properties[property]);
    }
}

describe('Settings', function() {

    it('should have options object', function() {
       settings.options.should.have.type('object');
    });

    /*

    TODO


    it('should have all keys', function() {
        var properties = {
            'Options' : 'object',
            'BaseDirectory' : 'string',
            'BuildDirectory' : 'string',
            'CacheDirectory' : 'string',
            'FrontendDirectory' : 'string',
            'ModulesDirectory' : 'string'
        };
        checkDescription(settings, properties);
    });

    it('should have all Options keys', function() {
        var properties = {
            'title' : 'string',
            'modules' : 'object',
            'sparql' : 'object'
        };
        checkDescription(settings.Options, properties);
    });

    it('should have all Options["sparql"] keys', function() {
        var properties = {
            'datastore-url' : 'string',
            'query-param-name' : 'string',
            'default-params' : 'object'
        };
        checkDescription(settings.Options["sparql"], properties);
    });*/

});
