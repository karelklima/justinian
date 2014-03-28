var pisApp;

pisApp = angular.module('pisApp', [
    'ngRoute',
    'pisControllers'
]);

pisApp.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/m/:module/a/:application', {
        templateUrl: 'view/main.html',
        controller: 'MainController',
        controllerAs: 'main'
    });
    $routeProvider.otherwise({redirectTo: '/m/pis/a/detail'});
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
});