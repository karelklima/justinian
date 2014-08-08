var appServices;

appServices = angular.module('appServices', [
    'ngRoute',
    'ngResource'
]);

// appConfiguration
appServices.service('ConfigurationService', ['UtilService', 'PageService', '$filter', '$log', function (UtilService, PageService, $filter, $log) {
    var _data = configuration.application;
    var _modules = configuration.application.modules;

    this.getPrefixes = function() {
        var prefixes = {};
        angular.forEach(_modules, function(spec, module) {
            if (angular.isObject(spec["prefixes"]))
                angular.extend(prefixes, spec["prefixes"]);
        });
        return prefixes;
    };

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
                        var priority = angular.isDefined(opts.priority) ? opts.priority : 0;
                        result.push({url: UtilService.getTemplateUrl(modName, appName, template), priority: priority});
                    }
                }
            });
        });
        return $filter('orderBy')(result, 'priority', true);
    };

    this.getDefaultModuleApplication = function (type) {
        var result = [];
        angular.forEach(_modules, function (mods, modName) {
            angular.forEach(mods.apps, function (opts, appName) {
                if (angular.isDefined(opts.datatypes) && opts.datatypes.indexOf(type) !== -1
                        && angular.isDefined(opts.views) && opts.views.indexOf("main") !== -1) {
                    var priority = angular.isDefined(opts.priority) ? opts.priority : 0;
                    result.push({module: modName, application: appName, priority: priority});
                }
            });
        });
        //$log.debug("ConfigurationService.getDefaultModuleApplication: " +  angular.toJson(result));
        var path = $filter('orderBy')(result, 'priority').pop();
        $log.debug("ConfigurationService.getDefaultModuleApplication: " + type + " - " +  angular.toJson(path));
        return path;
    };

    this.getDefaultTitle = function () {
        return _data["title"];
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

    this.getHomeApplication = function() {
        return _data.home;
    };

    this.getErrorApplication = function() {
        return _data.error;
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
    this.getAllParams = function(){ // deprecated
        return angular.copy($routeParams);
    };
    this.getParams = function() {
        return $location.search();
    };
    this.setParam = function (key, value, redirect) {
        //var params = $location.search();
        //params[key] = value;
        //$location.search(params);
        $location.search(key, value);
        if (redirect)
            $location.replace();
        $rootScope.$$phase || $rootScope.$apply();
    };
    this.setParams = function(params, redirect) {
        $location.search(params);
        if (redirect)
            $location.replace();
    };
    this.setPath = function (module, application) {
        this.setUrl(module, application, null);
    };
    this.setUrl = function (params, redirect) {
        if (!angular.isObject(params))
            params = {};
        var parts = UtilService.getUrlParts(params);
        $location.path(UtilService.getUrlPath(parts.path)).search(parts.search);
        if (redirect)
            $location.replace();
        $rootScope.$$phase || $rootScope.$apply();
    };

    this.setUrlError = function () {
        this.setUrl(configuration.application.error, true);
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
        return '/' + params.join('/');
    };
    this.getUrl = function (params) {
        var parts = this.getUrlParts(params);
        return '#' + this.getUrlPath(parts.path) + '?' + this.getUrlSearch(parts.search);
    };
    /**
     * Splits params to "path" and "search"
     * @param params
     * @return object
     */
    this.getUrlParts = function(params) {
        var output = { path : [], search : angular.copy(params) };
        if (angular.isDefined(params.module) && angular.isDefined(params.application)) {
            output.path = [params.module, params.application];
            delete output.search.module;
            delete output.search.application;
        }
        return output;
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
            .replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
    };
    this.dashToCamel = function (str) {
        return str.replace(/\W+(.)/g, function (x, chr) {
            return chr.toUpperCase();
        });
    };
}]);

appServices.service('NetworkService', ['$resource','$http', '$q', 'UtilService', 'ConfigurationService', '$log', '$cacheFactory', function ($resource, $http, $q, UtilService, ConfigurationService, $log, $cacheFactory) {

    var lruCache = $cacheFactory('lruCache', { capacity: 10 });

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
        $log.debug("NetworkService.getData["+url+"]: url - " + angular.toJson(url));
        $log.debug("NetworkService.getData["+url+"]: paramDefaults - " + angular.toJson(paramDefaults));
        $log.debug("NetworkService.getData["+url+"]: parameters - " + angular.toJson(parameters));
        angular.forEach(parameters, function(value, key) {
            if (key in paramDefaults) {
                if (angular.isUndefined(value)) {
                    parameters[key] = paramDefaults[key];
                    $log.warn("NetworkService.getData["+url+"]: Undefined parameter '" + key + "' for module '" + module + "' and api '" + api + "'.");
                }
            } else {
                $log.error("NetworkService.getData["+url+"]: Wrong parameter '" + key + "' for module '" + module + "' and api '" + api + "'.");
            }
        });
        var deferred = $q.defer();
        $resource(url, paramDefaults, {get: {method: 'GET', cache: lruCache}}).get(parameters, function (value, responseHeaders) {
            deferred.resolve(value);
            $log.debug("NetworkService.getData["+url+"]: value.length = " + angular.toJson(value).length);
        }, function(httpResponse) {
            deferred.resolve({});
            $log.debug("NetworkService.getData["+url+"]: error");
        });
        return deferred.promise;
    };
}]);

appServices.service('PrefixService', ['ConfigurationService', function(ConfigurationService) {

    var prefixes = ConfigurationService.getPrefixes();

    this.expandString = function(value) {
        for (var prefix in prefixes) {
            if (value.indexOf(prefix) == 0)
                return prefixes[prefix] + value.substr(prefix.length);
        }
        return value;
    };

    this.contractString = function(value) {
        for (var prefix in prefixes) {
            if (value.indexOf(prefixes[prefix]) == 0)
                return prefix + value.substr(prefixes[prefix].length);
        }
        return value;
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

appServices.service('AppService', ['$q', 'UrlService', 'UtilService', 'NetworkService', 'ConfigurationService', 'PrefixService', function ($q, UrlService, UtilService, NetworkService, ConfigurationService, PrefixService){
    var self = this;
    /**
     * initialize params in application and setup listener for required params changing
     * @param {angular.scope} $appScope application scope
     * @param {array} params required parameters for app, ex.: params = ['resource'] -> $appScope.resource = UrlService.getParam('resource') -> listening for parameter changing
     * @param {function} update function for view updating
    */
    this.init = function ($appScope, params, update){

        if(angular.isDefined($appScope) && angular.isDefined(params) && params instanceof Array && params.length > 0){
            var changes = {};
            for(var i = 0; i < params.length; i++){
                var appParamName = UtilService.dashToCamel(params[i]);
                var paramValue = UrlService.getParam(params[i])
                if($appScope[appParamName] !== paramValue){
                    changes[appParamName]={'old':$appScope[appParamName],'new':paramValue};
                    $appScope[appParamName] = paramValue;
                }
            }
            $appScope.$listen("$locationParamsChangedEvent", function(event, oldParams, newParams){
                var paramsChanged = false;
                var changes = {};
                angular.forEach(params, function(param) {
                    if (!angular.equals(oldParams[param], newParams[param]) && !angular.equals($appScope[param], newParams[param])) {
                        changes[param] = {old: oldParams[param], new: newParams[param]};
                        $appScope[param] = newParams[param];
                        paramsChanged = true;
                    }
                });
                if(paramsChanged){
                    angular.isDefined(update) && update(changes);
                }
            });
        }
        angular.isDefined(update) && update(changes);
    };

    this.getData = function ($scope, module, api, parameters) {
        $scope.isLoading = true;
        var promise = NetworkService.getData(module, api, parameters);
        if (angular.isUndefined($scope.loadingQueue))
            $scope.loadingQueue = [];
        $scope.loadingQueue.push(promise);
        var counter = $scope.loadingQueue.length;
        $q.all($scope.loadingQueue).then(function() {
            if ($scope.loadingQueue.length == counter) { // all requests have been resolved
                $scope.loadingQueue = [];
                $scope.isLoading = false;
            }
        });

        return promise;
    };

    this.setParams = function(params, redirect) {
        UrlService.setParams(params, redirect);
    };

    this.setParam = function(key, value, redirect) {
        UrlService.setParam(key, value, redirect);
    };

    this.getMainModuleApplication = function() {
        return {
            module: UrlService.getParam("module"),
            application: UrlService.getParam("application")
        };
    };

    this.pageNotFound = function() {
        // TODO different error vs 404 page
        UrlService.setUrl(ConfigurationService.getErrorApplication(), true);
    };

    this.expandPrefix = function(prefixedString) {
        return PrefixService.expandString(prefixedString);
    };

    this.contractPrefix = function(nonPrefixedString) {
        return PrefixService.contractString(nonPrefixedString);
    };
}]);