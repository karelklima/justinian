var appServices;

appServices = angular.module('appServices', [
    'ngRoute',
    'ngResource'
]);

// appConfiguration
appServices.service('ConfigurationService', ['UtilService', 'PageService', '$filter', function (UtilService, PageService, $filter) {
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
    this.getTemplates = function (template) {
        var result = [];
        var datatypes = this._getTypes();
        var module = PageService.getModule();
        var application = PageService.getApplication();
        angular.forEach(_data, function (mods, modName) {
            angular.forEach(mods.apps, function (opts, appName) {
                if (opts.views.indexOf(template) !== -1) {
                    var push = false;
                    var dependencies = opts.dependencies;
                    var types = opts.datatypes;
                    if (angular.isDefined(dependencies) && module in dependencies && dependencies[module].indexOf(application) !== -1) {
                        push = true;
                    } else if (angular.isDefined(types) && angular.isDefined(datatypes)) {
                        angular.forEach(types, function (type) {
                            if (datatypes.indexOf(type) !== -1) {
                                push = true;
                            }
                        });
                    }
                    if (push || (angular.isUndefined(dependencies) && angular.isUndefined(types))) {
                        var priority = opts.priority;
                        if (angular.isUndefined(priority)) {
                            priority = 0;
                        }
                        result.push({url: UtilService.getTemplateUrl(modName, appName, template), priority: priority});
                    }
                }
            });
        });
        return $filter('orderBy')(result, 'priority', true);
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

appServices.service('UrlService', ['$routeParams', '$location', '$filter', function ($routeParams, $location, $filter) {
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
            var todo = $filter('filter')(params, this.isParam, true);
            angular.forEach(todo, function (param, index) {
                var prefix = (index === 0) ? '?' : '&';
                search += prefix + param + '=' + this.getParam(param);
            }, this);
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

appServices.service('NetworkService', ['$resource','$http', function ($resource, $http) {
    this.useApi = function(module,apiName,params,success,error){
        var request = $http.get(module+'/api/'+apiName+'?'+params);
        if(success !== undefined && success != null)
            request.success(success);
        if(error !== undefined && error != null)
            request.error(error);
    }
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