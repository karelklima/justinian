var mainApp;

mainApp = angular.module('mainApp', [
    'ngRoute',
    'appControllers',
    'appDirectives'
]);

mainApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/root.html',
        controller: 'RootController',
        controllerAs: 'root',
        reloadOnSearch: false
    });
    $routeProvider.when('/:module/:application', {
        templateUrl: 'partials/root.html',
        controller: 'RootController',
        controllerAs: 'root',
        reloadOnSearch: false
    });
    $routeProvider.otherwise({redirectTo: '/' + home.module + '/' + home.application});
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
});