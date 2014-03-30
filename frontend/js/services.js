var appServices;

appServices = angular.module('appServices', ['ngRoute']);

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
});

// userSettings
appServices.service('settingsService', function () {
    this.data = angular.fromJson(userSettings);
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
        $location.path(homePath);
    };
});