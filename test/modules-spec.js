var _  = require('underscore');
var should = require('should');
var fs = require('fs');
var settings = require('../backend/lib/settings.js');

describe('Modules', function() {

    var options;
    try {
        options = require('../backend/options.json');
    } catch (e) {}

    it('configuration should contain at least one module', function() {
        options["modules"].length.should.be.above(0);
    });

    it('configuration should contain core module', function() {
        options["modules"].should.containEql("core");
    });



    var moduleProperties = {
        "title": ["string", true],
        "dependencies": ["object", true],
        "prefixes": ["object", false],
        "apis": ["object", false],
        "universal-search": ["object", false]
    };

    _.each(options["modules"], function(module) {

        var packageJson;
        try {
            packageJson = require(settings.modulesDirectory + '/' + module + '/package.json');
        }
        catch (e) { }

        it('module ' + module + ' should contain valid package.json file', function() {
            packageJson.should.be.of.type("object");
        });

        _.each(moduleProperties, function(definition, property) {
            var type = definition[0];
            var required = definition[1];

            if (required) {
                it('module ' + module + ' should contain property ' + property, function() {
                    packageJson.should.have.property(property);
                });
            }

            if (_.has(packageJson, property)) {
                it('module ' + module + ' property ' + property + ' should be of type ' + type, function () {
                    packageJson[property].should.be.of.type(type);
                });
            }
        });

        it('module ' + module + ' should have valid dependencies', function() {
            _.each(packageJson["dependencies"], function(dependency) {
                options["modules"].should.containEql(dependency);
            });
        });

    });

});