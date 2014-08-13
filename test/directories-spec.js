var _  = require('underscore');
var should = require('should');
var fs = require('fs');

describe('Directories', function() {

    var directories;
    try {
        directories = require('../backend/directories.json');
    } catch (e) {}

    it('should be valid JSON file', function() {
        directories.should.be.of.type('object');
    });

    var monitoredDirectories = ['base', 'backend', 'frontend', 'modules'];

    _.each(monitoredDirectories, function(directory) {

        it('should have valid ' + directory + ' directory', function() {
            directories.should.have.property(directory);

            directories[directory].should.have.type('string');
            directories[directory].should.not.be.empty;

            var targetDirectory = __dirname + '/../backend' + directories[directory];
            var targetDirectoryExists = fs.existsSync(targetDirectory);
            targetDirectoryExists.should.be.true;
        })

    });

});