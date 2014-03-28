var pisControllers;

pisControllers = angular.module('pisControllers', []);

pisControllers.controller('MainController', function($scope, $route, $routeParams, $location) {
    $scope.routeParams = $routeParams;
    this.params = $scope.routeParams;
});

pisControllers.controller('ChildController', function($scope) {
    this.myParams = $scope.routeParams;
});

pisControllers.controller('SearchController', function($scope) {
    this.message = "Toto je testovaci zprava pro vyhledavani.";
});