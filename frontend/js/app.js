var mainApp;

mainApp = angular.module('mainApp', [
    'ngRoute',
    'appControllers',
    'appDirectives',
    'appFilters'
]);

mainApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider.when('/', {
        templateUrl: 'partials/root.html',
        controller: 'RootController',
        controllerAs: 'root',
        reloadOnSearch: true
    });
    $routeProvider.when('/:module/:application', {
        templateUrl: 'partials/root.html',
        controller: 'RootController',
        controllerAs: 'root',
        reloadOnSearch: true
    });
    $routeProvider.otherwise({redirectTo: '/' + home.module + '/' + home.application});
    $locationProvider.html5Mode(false);
    $locationProvider.hashPrefix('!');
});

mainApp.config(['$provide', function($provide){
    $provide.decorator('$rootScope', ['$delegate', function($delegate){
        Object.defineProperty($delegate.constructor.prototype, '$listen', {
            value: function(name, listener){
                var unsubscribe = $delegate.$on(name, listener);
                this.$on('$destroy', unsubscribe);
                return unsubscribe;
            },
            enumerable: false
        });
        return $delegate;
    }]);
}]);