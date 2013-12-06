'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', [])
  .value('version', '0.1')
  .factory('HledejZakon', ['$resource',
    function($resource){
        return $resource('http://localhost:8000/api/hledej-zakon', {
        	format: 'json'
        }, {
            suggest: {method:'GET', isArray: false}
        });
    }]
);