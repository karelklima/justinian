'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('MyCtrl1', [function() {

  }])
  .controller('MyCtrl2', [function() {

  }])
  .controller('TypeaheadCtrl', ['HledejZakon','$scope', '$q', function(HledejZakon, $scope, $q) {
  	$scope.sourceArray = function (term) {
		var d = $q.defer();
		var results = HledejZakon.suggest({query: term}, function() {
			d.resolve(results.results.bindings);
		}); 
		return d.promise;
	}
  }]);
