var appServices;

appServices = angular.module('appServices', [
    'ngRoute',
    'ngResource'
]);

// appConfiguration
appServices.service('ConfigurationService', ['UtilService', 'PageService', '$filter', function (UtilService, PageService, $filter) {
    var _data = configuration.application;
    var _modules = configuration.application.modules;

    this.isModuleApplication = function (module, application) {
        return module in _modules && application in _modules[module].apps;
    };
    this._getTypes = function () {
        return _modules[PageService.getModule()].apps[PageService.getApplication()].datatypes;
    };
    this.getMainTemplate = function () {
        return UtilService.getTemplateUrl(PageService.getModule(), PageService.getApplication(), 'main');
    };
    this.getTemplates = function (template) {
        var result = [];
        var datatypes = this._getTypes();
        var module = PageService.getModule();
        var application = PageService.getApplication();
        angular.forEach(_modules, function (mods, modName) {
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
        return _data.home;
    };
    this.getDefaultTitle = function () {
        var title = [];

        return _data["title"];
        // TODO

        var module = PageService.getModule();
        var application = PageService.getApplication();
        if (angular.isDefined(_modules.title)) {
            title.push(_modules.title);
        }
        if (angular.isDefined(_modules[module]) && angular.isDefined(_modules[module].title)) {
            title.push(_modules[module].title);
        }
        if (angular.isDefined(_modules[module]) && angular.isDefined(_modules[module].apps[application]) && angular.isDefined(_modules[module].apps[application].title)) {
            title.push(_modules[module].apps[application].title);
        }
        return title.join(" - ");
    };

    this.getApiUrl = function (module, name, params) {
        if (module in _modules && name in _modules[module].apis) {
            return '/api/' + UtilService.matchUrlParams(_modules[module].apis[name], params)
        }
    };

    this.getApiPath = function (module, name) {
        if (module in _modules && name in _modules[module].apis) {
            var path = UtilService.getUrlPath(['api', module, name]);
            return path;
        }
    };

    this.getApiParamDefaults = function (module, name) {
        if (module in _modules && name in _modules[module].apis) {
            var paramDefaults = _modules[module].apis[name];
            return paramDefaults;
        }
    };
}]);

// userSettings
appServices.service('SettingsService', [function () {
    //var _data = angular.fromJson(configuration);
    var _data = configuration.user;

    // TODO
}]);

appServices.service('UrlService', ['$routeParams','$route', '$location', '$filter', 'UtilService', '$window','$rootScope', function ($routeParams,$route, $location, $filter, UtilService, $window, $rootScope) {
    var self = this;

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
        this.setUrl(module, application, null);
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
        $location.path(path).search(search);
    };

    $rootScope.$on('$locationChangeSuccess', function() {
        var search = UtilService.getUrlSearch($location.search());
//        console.log($rootScope.actualLocationPath + " == " + $location.path());
//        console.log($rootScope.actualLocationSearch + " == " + search);
//        console.log($rootScope.actualLocationPath + '?' + $rootScope.actualLocationSearch + ' == ' + $location.url());

        if($rootScope.actualLocationPath + '?' + $rootScope.actualLocationSearch == $location.url())
            return;

        if($rootScope.actualLocationPath != $location.path()){
            $rootScope.actualLocationPath = $location.path();
            $rootScope.actualLocationSearch = search;
        } else {
            if($rootScope.actualLocationSearch != search){
//                console.log("Emit event");
                $rootScope.actualLocationSearch = search;
                var eventObject = new LocationParamsChangedEvent();
                var event = $rootScope.$emit(eventObject.getName(), eventObject);
            }
        }
    });
    this.setUrlError = function () {
        // TODO
        this.setUrl(configuration.application.error.module, configuration.application.error.application);

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
    };
    this.camelToDash = function (str) {
        return str.replace(/\W+/g, '-')
            .replace(/([a-z\d])([A-Z])/g, '$1-$2');
    };
    this.dashToCamel = function (str) {
        return str.replace(/\W+(.)/g, function (x, chr) {
            return chr.toUpperCase();
        });
    };
}]);

appServices.service('NetworkService', ['$resource','$http', '$q', 'UtilService', 'ConfigurationService', '$log', function ($resource, $http, $q, UtilService, ConfigurationService, $log) {
    this.useApi = function(module,apiName,params,success,error){
        if(!params) params = [];
        if(!(params instanceof Array)) throw new TypeError("params must be an Array");
//        params = typeof params == "object" ? UtilService.getUrlSearch(params) : params;
//        var request = $http.get('/api/'+module+'/'+apiName+'?'+params);
        var url = ConfigurationService.getApiUrl(module,apiName,params);
        if(url == undefined) throw new Error("Cannot find api "+apiName+" in module "+module);
        var request = $http.get(ConfigurationService.getApiUrl(module,apiName,params));
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
    this.getData = function (module, api, parameters) {
        var url = ConfigurationService.getApiPath(module, api);
        var paramDefaults = ConfigurationService.getApiParamDefaults(module, api);
        $log.debug("NetworkService.getData: url - " + angular.toJson(url));
        $log.debug("NetworkService.getData: paramDefaults - " + angular.toJson(paramDefaults));
        $log.debug("NetworkService.getData: parameters - " + angular.toJson(parameters));
        angular.forEach(parameters, function(value, key) {
            if (key in paramDefaults) {
                if (angular.isUndefined(value)) {
                    parameters[key] = paramDefaults[key];
                    $log.warn("NetworkService.getData: Undefined parameter '" + key + "' for module '" + module + "' and api '" + api + "'.");
                }
            } else {
                $log.error("NetworkService.getData: Wrong parameter '" + key + "' for module '" + module + "' and api '" + api + "'.");
            }
        });
        var deferred = $q.defer();
        $resource(url, paramDefaults).query(parameters, function (value, responseHeaders) {
            deferred.resolve(angular.fromJson(value));
            $log.debug("NetworkService.getData: value - " + angular.toJson(value));
        }, function(httpResponse) {
            deferred.resolve([]);
            $log.debug("NetworkService.getData: error");
        });
        return deferred.promise;
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

appServices.service('AppService', ['UrlService', 'UtilService', function (UrlService, UtilService){
    var self = this;
    /**
     * initialize params in application and setup listener for required params changing
     * @param {angular.scope} $appScope application scope
     * @param {array} params required parameters for app, ex.: params = ['resource'] -> $appScope.resource = UrlService.getParam('resource') -> listening for parameter changing
     * @param {function} update function for view updating
    */
    this.init = function ($appScope, params, update){
        if(angular.isDefined($appScope) && angular.isDefined(params) && params instanceof Array && params.length > 0){
            for(var i = 0; i < params.length; i++){
                $appScope[UtilService.dashToCamel(params[i])] = UrlService.getParam(params[i]);
            }
            $appScope.$listen(LocationParamsChangedEvent.getName(), function(event, eventObject){
                var paramsChanged = false;
                for(var i = 0; i < params.length; i++){
                    var paramValue = UrlService.getParam(params[i]);
                    var appParamName = UtilService.dashToCamel(params[i]);
                    if(!UrlService.isParam(params[i]))
                        paramValue = undefined;
                    if(paramValue !== $appScope[appParamName])
                    {
                        paramsChanged = true;
                        $appScope[appParamName] = paramValue;
                    }
                }
                if(paramsChanged){
                    angular.isDefined(update) && update();
                }
            });
        }
        angular.isDefined(update) && update();
    }
}]);