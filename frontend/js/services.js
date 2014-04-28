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
}]);

// userSettings
appServices.service('SettingsService', [function () {
    var _data = angular.fromJson(userSettings);

    // TODO
}]);

appServices.service('UrlService', ['$routeParams', '$location', '$filter', 'UtilService', function ($routeParams, $location, $filter, UtilService) {
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
        var search = UtilService.getUrlSearch(params);
        $location.url(path + '?' + search);
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

appServices.service('UtilService', [function () {
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

    //decode escaped unicode characters to normal form
    var decodeUnicodeStringRegex = /\\u([\d\w]{4})/gi;
    this.decodeUnicodeString = function (value){
        value = value.replace(decodeUnicodeStringRegex, function (match, grp) {
                return String.fromCharCode(parseInt(grp, 16));
            });
        value = unescape(value);
        return value;
    }
}]);

appServices.service('NetworkService', ['$resource','$http', function ($resource, $http) {
    this.useApi = function(module,apiName,params,success,error){
        var request = $http.get('/api/'+module+'/'+apiName+'?'+params);
        if(success !== undefined && success != null)
            request.success(success);
        if(error !== undefined && error != null)
            request.error(error);
    }
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