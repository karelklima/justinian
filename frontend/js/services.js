var appServices;

appServices = angular.module('appServices', [
    'ngRoute',
    'ngResource'
]);

// appConfiguration
appServices.service('ConfigurationService', function (UtilService) {
    this.data = angular.fromJson(appConfiguration);

    this.isModuleApplication = function (module, application) {
        return module in this.data && application in this.data[module].apps;
    };
    this.getTypes = function (module, application) {
        return this.data[module].apps[application].datatypes;
    };
    this.getTemplate = function (template) {
        var result;
        angular.forEach(this.data, function (mods, modName) {
            angular.forEach(mods.apps, function (opts, appName) {
                if (opts.views.indexOf(template) !== -1) {
                    result = UtilService.getTemplateUrl(modName, appName, template);
                }
            });
        });
        return result;
    };
    this.getTemplates = function (template, module, application) {
        var result = [];
        angular.forEach(this.data, function (mods, modName) {
            angular.forEach(mods.apps, function (opts, appName) {
                if (opts.views.indexOf(template) !== -1
                /*TODO && ma se zobrazit pro uvedenou stranku*/) {
                    this.push(UtilService.getTemplateUrl(modName, appName, template));
                }
            }, result);
        });
        return result;
    };
    this.getSidebarTemplates = function (types, module, application) {
        var result = [];
        angular.forEach(this.data, function (mods, modName) {
            angular.forEach(mods.apps, function (opts, appName) {
                if (opts.views.indexOf('sidebar') !== -1) {
                    var push = false;
                    if (false /*TODO ma se zobrazit pro uvedenou stranku*/) {
                        push = true;
                    } else {
                        angular.forEach(types, function (type, index) {
                            if (opts.datatypes.indexOf(type) !== -1) {
                                push = true;
                            }
                        });
                    }
                    if (push) {
                        this.push(UtilService.getTemplateUrl(modName, appName, 'sidebar'));
                    }
                }
            }, result);
        });
        return result;
    };
    this.getDefaultModuleApplication = function (type) {
        //TODO po pridani konfigurace do JSONu
        return home;
    };
});

// userSettings
appServices.service('SettingsService', function () {
    this.data = angular.fromJson(userSettings);

    // TODO
});

appServices.service('UrlService', function ($routeParams, $location) {
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
        $location.path(module + '/' + application);
    };
    this.setUrl = function (module, application, params) {
        //TODO vylepseni se zachovanim urcitych params
        $location.url(module + '/' + application);
    };
    this.setUrlError = function () {
        $location.url(home.module + '/' + home.application);
    };
});

appServices.service('UtilService', function () {
    this.getTemplateUrl = function (module, application, template) {
        return module + '/' + application + '/partials/' + template + '.html';
    };
});

appServices.service('NetworkService', function ($resource) {
    this.data = null;

    // TODO
});

appServices.service('TitleService', function () {
    var title = 'PIS';
    this.getTitle = function () {
        return title;
    };
    this.setTitle = function (newTitle) {
        title = newTitle;
    };
});