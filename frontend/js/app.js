(function () {

    /**
     * Main module - application configuration
     */
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

    /**
     * Routing configuration
     */
        .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            // route configuration for url format /#?type=xxx&resource=yyy
            $routeProvider.when('/', {
                templateUrl: 'partials/root.html',
                controller: 'RootController',
                controllerAs: 'root',
                reloadOnSearch: false
            });
            // route configuration for basic type of url /#/module/application
            $routeProvider.when('/:module/:application', {
                templateUrl: 'partials/root.html',
                controller: 'RootController',
                controllerAs: 'root',
                reloadOnSearch: false
            });

            // default home route for cases without # in url
            $routeProvider.otherwise({redirectTo: '/' + configuration.application.home.module + '/' + configuration.application.home.application});
            $locationProvider.html5Mode(false);
        }])

    /**
     * Definition of $listen property on scope to watch emitted events on rootscope
     */
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

    /**
     * Loading bar configuration
     */
        .config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {
            cfpLoadingBarProvider.includeSpinner = false;
        }])

    /**
     * Log debug configuration
     */
        .config(['$logProvider', function ($logProvider) {
            $logProvider.debugEnabled(true);
        }])

    /**
     * Tooltip trigger configuration
     */
        .config(["$tooltipProvider", function ($tooltipProvider) {
            $tooltipProvider.setTriggers({ 'show': 'mouseleave' });
        }])

    /**
     * RootScope events processing
     */
        .run(['$rootScope', '$location', '$document', function ($rootScope, $location, $document) {

            var lastLocationPath = $location.path();
            var lastLocationSearch = angular.copy($location.search());

            // on url change
            $rootScope.$on('$locationChangeSuccess', function ($event) {
                var path = $location.path();
                var search = $location.search();

                // check if anything changed
                if (angular.equals(lastLocationPath, path) && angular.equals(lastLocationSearch, search))
                    return;

                // url changed
                if (!angular.equals(lastLocationPath, path)) {
                    lastLocationPath = path;
                    lastLocationSearch = angular.copy(search);
                    $document.scrollTo(angular.element("body"), 0); // main application has changed, scroll to top
                } else {
                    // parameters changed
                    if (!angular.equals(lastLocationSearch, search)) {
                        $rootScope.$emit("$locationParamsChangedEvent", lastLocationSearch, search);
                        lastLocationSearch = angular.copy(search);
                    }
                }
            });
        }]);

})();