var pisApp;

pisApp = angular.module('pisApp', [
    'ngRoute',
    'pisControllers'
]);

pisApp.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/m/:module/a/:application', {
        templateUrl: 'view/child.html',
        controller: 'ChildController',
        controllerAs: 'child'
    });
    $routeProvider.when('/s/:search', {
        templateUrl: 'view/search.html',
        controller: 'SearchController',
        controllerAs: 'search'
    });
    $routeProvider.otherwise({redirectTo: '/m/pis/a/detail'});
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
});