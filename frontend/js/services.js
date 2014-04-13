var appServices;

appServices = angular.module('appServices', [
    'ngRoute',
    'ngResource'
]);

// appConfiguration
appServices.service('ConfigurationService', ['UtilService', 'PageService', function (UtilService, PageService) {
    var _data = angular.fromJson(appConfiguration);

    this.isModuleApplication = function (module, application) {
        return module in _data && application in _data[module].apps;
    };
    this._getTypes = function () {
        return _data[PageService.getModule()].apps[PageService.getApplication()].datatypes;
    };
    this.getMainTemplate = function () {
        return UtilService.getTemplateUrl(PageService.getModule(), PageService.getApplication(), 'main');
    };
    this._getDefaultTemplates = function (template) {
        var result = [];
        // TODO docasne, dokud nebude moci ziskat z konfigurace defaultni
        angular.forEach(_data, function (mods, modName) {
            angular.forEach(mods.apps, function (opts, appName) {
                if (opts.views.indexOf(template) !== -1) {
                    result.push(UtilService.getTemplateUrl(modName, appName, template));
                }
            });
        });
        return result;
    };
    this.getTemplates = function (template) {
        var result = [];
        angular.forEach(_data, function (mods, modName) {
            angular.forEach(mods.apps, function (opts, appName) {
                if (opts.views.indexOf(template) !== -1
                /*TODO && ma se zobrazit pro uvedenou stranku module a application ziskame z PageService*/) {
                    result.push(UtilService.getTemplateUrl(modName, appName, template));
                }
            });
        });
        if (!result.length > 0) {
            result.concat(this._getDefaultTemplates(template));
        }
        return result;
    };
    this.getSidebarTemplates = function () {
        var result = [];
        var types = this._getTypes();
        angular.forEach(_data, function (mods, modName) {
            angular.forEach(mods.apps, function (opts, appName) {
                if (opts.views.indexOf('sidebar') !== -1) {
                    var push = false;
                    if (false /*TODO ma se zobrazit pro uvedenou stranku module a application ziskame z PageService*/) {
                        push = true;
                    } else {
                        angular.forEach(types, function (type) {
                            if (opts.datatypes.indexOf(type) !== -1) {
                                push = true;
                            }
                        });
                    }
                    if (push) {
                        result.push(UtilService.getTemplateUrl(modName, appName, 'sidebar'));
                    }
                }
            });
        });
        return result;
    };
    this.getDefaultModuleApplication = function (type) {
        //TODO po pridani konfigurace do JSONu
        return home;
    };
}]);

// userSettings
appServices.service('SettingsService', [function () {
    var _data = angular.fromJson(userSettings);

    // TODO
}]);

appServices.service('UrlService', ['$routeParams', '$location', function ($routeParams, $location) {
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
        var search = '';
        if (angular.isDefined(params)) {
            var todo = [];
            angular.forEach(params, function (param) {
                if (this.isParam(param)) {
                    todo.push(param);
                }
            }, this);
            if (todo.length > 0) {
                var param = params.pop();
                search = '?' + param + '=' + this.getParam(param);
                if (params > 0) {
                    angular.forEach(params, function (param) {
                        search += '&' + param + '=' + this.getParam(param);
                    });
                }
            }
        }
        $location.url(module + '/' + application + search);
    };
    this.setUrlError = function () {
        this.setUrl(home.module, home.application);
    };
}]);

appServices.service('UtilService', [function () {
    this.getTemplateUrl = function (module, application, template) {
        return module + '/' + application + '/partials/' + template + '.html';
    };
}]);

appServices.service('NetworkService', [function ($resource) {

    // TODO
}]);

appServices.service('PageService', ['UrlService', function (UrlService) {
    var _title = 'PIS'; // TODO smazat nastaveni az bude default
    this.getTitle = function () {
        if (angular.isDefined(_title)) {
            return _title;
        } else {
            return; //TODO default title
        }
    };
    this.setTitle = function (title) {
        _title = title;
    };
    this.getModule = function () {
        return UrlService.getParam('module');
    };
    this.getApplication = function () {
        return UrlService.getParam('application');
    };
}]);