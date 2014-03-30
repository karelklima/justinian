var mainApp;

mainApp = angular.module('mainApp', [
    'ngRoute',
    'appControllers'
]);

mainApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/:module/:application', {
        templateUrl: 'partials/main.html',
        controller: 'MainController',
        controllerAs: 'main'
    });
    $routeProvider.otherwise({redirectTo: homePath});
    $locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
});