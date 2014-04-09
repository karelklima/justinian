var appServices;

appServices = angular.module('appServices', [
    'ngRoute',
    'ngResource'
]);

// appConfiguration
appServices.service('configurationService', function () {
    this.data = angular.fromJson(appConfiguration);

    this.isModuleApplication = function (module, application) {
        return module in this.data && application in this.data[module].apps;
    };
    this.getTypes = function (module, application) {
        return this.data[module].apps[application].datatypes;
    };
    this.getViews = function (module, application) {
        return this.data[module].apps[application].views;
    };
    this.getSidebarTemplates = function (type, module, application) {
        var result = [];
        if (type !== undefined) {
            angular.forEach(this.data, function (mods, modName) {
                angular.forEach(mods.apps, function (opts, appName) {
                    if ((modName !== module || appName !== application)
                        && opts.views.indexOf('sidebar') !== -1
                        && opts.datatypes.indexOf(type) !== -1) {
                        this.push(modName + '/' + appName + '/partials/sidebar.html');
                    }
                }, result);
            });
        }
        return result;
    };
});

// userSettings
appServices.service('settingsService', function () {
    this.data = angular.fromJson(userSettings);

    // TODO
});

appServices.service('urlService', function ($routeParams, $location) {
    this.isParam = function (key) {
        return key in $routeParams;
    };
    this.getParam = function (key) {
        return $routeParams[key];
    };
    this.setParam = function (key, value) {
        $location.search(key, value);
    };
    this.setPath = function (module, application) {
        $location.path('/' + module + '/' + application);
    };
    this.setPathHome = function () {
        $location.path('/' + home.module + '/' + home.application);
    };
});

appServices.service('networkService', function ($resource) {
    this.data = null;

    // TODO
});