var appServices;

appServices = angular.module('appServices', [
    'ngRoute',
    'ngResource'
]);

// appConfiguration
appServices.service('ConfigurationService', ['UtilService', 'PageService', '$filter', 'NetworkService', function (UtilService, PageService, $filter, NetworkService) {
    var _data = angular.fromJson(appConfiguration);
//    var _data = NetworkService.getDefaultSettings();

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
    this.getDefaultTitle = function () {
        var title = [];
        var module = PageService.getModule();
        var application = PageService.getApplication();
        if (angular.isDefined(_data.title)) {
            title.push(_data.title);
        }
        if (angular.isDefined(_data[module]) && angular.isDefined(_data[module].title)) {
            title.push(_data[module].title);
        }
        if (angular.isDefined(_data[module]) && angular.isDefined(_data[module].apps[application]) && angular.isDefined(_data[module].apps[application].title)) {
            title.push(_data[module].apps[application].title);
        }
        return title.join(" - ");
    };
    this.getApiUrl = function (module, name, params) {
        if (module in _data && name in _data[module].apis) {
            return '/api/' + UtilService.matchUrlParams(_data[module].apis[name], params)
        }
    };
}]);

// userSettings
appServices.service('SettingsService', [function () {
    var _data = angular.fromJson(userSettings);

    // TODO
}]);

appServices.service('UrlService', ['$routeParams','$route', '$location', '$filter', 'UtilService', '$window', function ($routeParams,$route, $location, $filter, UtilService, $window) {
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
        var path = '';
        if (angular.isDefined(module) && angular.isDefined(application)) {
            path = module + '/' + application;
        }
        if (angular.isArray(params)) {
            params = this.getUrlParamValues(params);
        }
        var search = UtilService.getUrlSearch(params);
//        console.log(path);
//        console.log($location.path());
        var needReload = $location.path() == '/'+path;
        $location.url(path + '?' + search);
        if(needReload) $route.reload();
    };
    this.setUrlError = function () {
        this.setUrl(home.module, home.application);
    };
    this.getUrlParamValues = function (params) {
        var search = {};
        var todo = $filter('filter')(params, this.isParam, true);
        angular.forEach(todo, function (param) {
            search[param] = this.getParam(param);
        }, this);
        return search;
    };
}]);

appServices.service('UtilService', ['$filter', function ($filter) {
    this.getTemplateUrl = function (module, application, template) {
        return 'assets/' + module + '/' + application + '/partials/' + template + '.html';
    };
    this.getUrlSearch = function (params) {
        var url = [];
        angular.forEach(params, function (value, key) {
            url.push(key + '=' + value);
        });
        return url.join('&');
    };
    this.getUrlPath = function (params) {
        return params.join('/');
    };
    this.getUrl = function (path, search) {
        return this.getUrlPath(path) + '?' + this.getUrlSearch(search);
    };
    this.matchUrlParams = function (url, params) {
        angular.forEach(params, function (value, index) {
            url = url.replace('$' + (index+1).toString(), value);
        });
        return url;
    };

    //decode escaped unicode characters to normal form
     this.decodeUnicodeString = function (value){
        return $filter('decodeUnicode')(value);
    }
}]);

appServices.service('NetworkService', ['$resource','$http', '$q', 'UtilService', function ($resource, $http, $q, UtilService) {
    this.useApi = function(module,apiName,params,success,error){
        params = typeof params == "object" ? UtilService.getUrlSearch(params) : params;
        var request = $http.get('/api/'+module+'/'+apiName+'?'+params);
        if(success !== undefined && success != null)
            request.success(success);
        if(error !== undefined && error != null)
            request.error(error);
    };
    this.getDefaultSettings = function () {
        var d = $q.defer();
        $resource('/settings/default/json').get().$promise.then(function (result) {
            d.resolve(angular.fromJson(result).appConfiguration);
        });
        return d.promise;
    };
}]);

appServices.service('PageService', ['UrlService', '$window', function (UrlService, $window) {
    this.setTitle = function (title) {
        $window.document.title = title;
    };
    this.getModule = function () {
        return UrlService.getParam('module');
    };
    this.getApplication = function () {
        return UrlService.getParam('application');
    };
}]);