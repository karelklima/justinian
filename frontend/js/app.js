(function() {

    angular.module('mainApp', [
        'ngRoute',
        'angular-loading-bar',
        'ngAnimate',
        'ui.bootstrap',
        'appControllers',
        'appDirectives',
        'appFilters'
    ])

    .config(function ($routeProvider, $locationProvider) {
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
        // TODO configuration service
        $routeProvider.otherwise({redirectTo: '/' + configuration.application.home.module + '/' + configuration.application.home.application});
        $locationProvider.html5Mode(false);

        //If you want to set $locationProvider.hashPrefix, you should to check "click" directive -> line directives.js:33 `attributes.$set('href', XXX`
        //$locationProvider.hashPrefix('!');
    })

    .config(['$provide', function ($provide) {
        $provide.decorator('$rootScope', ['$delegate', function ($delegate) {
            Object.defineProperty($delegate.constructor.prototype, '$listen', {
                value: function (name, listener) {
                    var unsubscribe = $delegate.$on(name, listener);
                    this.$on('$destroy', unsubscribe);
                    return unsubscribe;
                },
                enumerable: false
            });
            return $delegate;
        }]);
    }])

    .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }])

    .config(['$logProvider', function($logProvider) {
        $logProvider.debugEnabled(true);
    }]);

})();