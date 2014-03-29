var pisApp;

pisApp = angular.module('pisApp', [
    'ngRoute',
    'pisControllers'
]);

pisApp.config(function($routeProvider, $locationProvider) {
    $routeProvider.when('/:module/:application', {
        templateUrl: 'partials/main.html',
        controller: 'MainController',
        controllerAs: 'main'
    });
    $routeProvider.otherwise({redirectTo: '/pis/detail'});
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
});