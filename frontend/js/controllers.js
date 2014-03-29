var pisControllers;

pisControllers = angular.module('pisControllers', []);

pisControllers.controller('MainController', function($scope, $route, $routeParams, $location) {
    $scope.routeParams = $routeParams;
    $scope.appsToLoad = ["hodnota0", "hodnota1","hodnota2"];

    $scope.getParam = function(key) {
        return $route.current.params[key];
    };
    $scope.setParam = function(key, value) {
        $location.search(key, value);
    };
    $scope.setPath = function(module,application) {
        $location.path('/'+module+'/'+application);
    };
});

pisControllers.controller('LogoController', function($scope) {
    this.templateUrl = 'partials/logo.'+$scope.getParam('module')+'.html';
});

pisControllers.controller('ApplicationController', function($scope) {
    this.templateUrl = 'partials/application.'+$scope.getParam('module')+'.'+$scope.getParam('application')+'.html'
});

pisControllers.controller('SidebarController', function($scope) {
    this.templateUrl = 'partials/sidebar.html';
    this.appsToLoad = $scope.appsToLoad;
});