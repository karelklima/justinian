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
    $routeProvider.otherwise({redirectTo: '/' + home.module + '/' + home.application});
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
});