var mainApp;

mainApp = angular.module('mainApp', [
    'ngRoute',
    'appControllers'
]);

mainApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/root.html',
        controller: 'RootController',
        controllerAs: 'root'
    });
    $routeProvider.when('/:module/:application', {
        templateUrl: 'partials/root.html',
        controller: 'RootController',
        controllerAs: 'root'
    });
    $routeProvider.otherwise({redirectTo: '/' + home.module + '/' + home.application});
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
});