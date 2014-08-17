(function () {

    angular.module('mainApp', [
        'ngRoute',
        'angular-loading-bar',
        'ngAnimate',
        'ui.bootstrap',
        'ui.utils',
        'duScroll',
        'appControllers',
        'appDirectives',
        'appFilters'
    ])

        .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
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

            $routeProvider.otherwise({redirectTo: '/' + configuration.application.home.module + '/' + configuration.application.home.application});
            $locationProvider.html5Mode(false);
        }])

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

        .config(['$logProvider', function ($logProvider) {
            $logProvider.debugEnabled(true);
        }])

        .run(['$rootScope', '$location', '$document', function ($rootScope, $location, $document) {

            var lastLocationPath = $location.path();
            var lastLocationSearch = angular.copy($location.search());

            $rootScope.$on('$locationChangeSuccess', function($event) {
                var path = $location.path();
                var search = $location.search();

                if(angular.equals(lastLocationPath, path) && angular.equals(lastLocationSearch, search))
                    return;

                if(!angular.equals(lastLocationPath, path)){
                    lastLocationPath = path;
                    lastLocationSearch = angular.copy(search);
                    $document.scrollTo(angular.element("body"), 0); // main application has changed, scroll to top
                } else {
                    if (!angular.equals(lastLocationSearch, search)){
                        $rootScope.$emit("$locationParamsChangedEvent", lastLocationSearch, search);
                        lastLocationSearch = angular.copy(search);
                    }
                }
            });
        }]);

})();