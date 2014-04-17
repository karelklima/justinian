/**
 * Created by Karel on 15. 4. 2014.
 */


module.exports = function(grunt) {

    // Add the grunt-mocha-test tasks.
    grunt.loadNpmTasks('grunt-mocha-test');

    grunt.initConfig({
        // Configure a mochaTest task
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: ['should']
                },
                src: ['test/backend/**/*.js']
            }
        }
    });

    grunt.registerTask('test', 'mochaTest');

};