(function () {

    /**
     * Services module
     */
    angular.module('appServices', [
        'ngRoute',
        'ngResource'
    ])

    /**
     * Configuration service - service for getting information defined in configuration
     */
        .service('ConfigurationService', ['UtilService', 'PageService', '$filter', '$log', function (UtilService, PageService, $filter, $log) {
            // save applications configuration
            var _data = configuration.application;
            // save modules configuration
            var _modules = configuration.application.modules;
            var self = this;

            /**
             * load modules prefixes
             * @returns {object}
             */
            this.getPrefixes = function () {
                var prefixes = {};
                angular.forEach(_modules, function (spec, module) {
                    if (angular.isObject(spec["prefixes"]))
                        angular.extend(prefixes, spec["prefixes"]);
                });
                return prefixes;
            };

            /**
             * check if module and application exists
             * @param module
             * @param application
             * @returns {boolean}
             */
            this.isModuleApplication = function (module, application) {
                return module in _modules && application in _modules[module].apps;
            };

            /**
             * get types for main view application
             * @returns {boolean}
             * @private
             */
            this._getTypes = function () {
                return _modules[PageService.getModule()].apps[PageService.getApplication()].datatypes;
            };

            /**
             * get default module and application for defined type and view
             * @param type
             * @param view
             * @returns {object}
             */
            this.getDefaultModuleApplicationForTypeAndView = function (type, view) {
                var result = [];
                // find all main view module applications to show
                angular.forEach(_modules, function (mods, modName) {
                    angular.forEach(mods.apps, function (opts, appName) {
                        if (angular.isDefined(opts.datatypes) && opts.datatypes.indexOf(type) !== -1
                            && angular.isDefined(opts.views) && opts.views.indexOf(view) !== -1) {
                            var priority = angular.isDefined(opts.priority) ? opts.priority : 0;
                            var appTitle = angular.isDefined(opts.title) ? opts.title : undefined;
                            result.push({module: modName, application: appName, priority: priority, title: appTitle});
                        }
                    });
                });
                // get first if there are more
                var path = $filter('orderBy')(result, 'priority').pop();
                if (angular.isDefined(path))
                    delete path.priority;
                $log.debug("ConfigurationService.getDefaultModuleApplicationForTypeAndView: " + type + ", view = " + view + " - " + angular.toJson(path));

                return path;
            };

            /**
             * get template url for main view
             * @returns {string}
             */
            this.getMainTemplate = function () {
                var module = PageService.getModule();
                var application = PageService.getApplication();
                return (this.isModuleApplication(module, application) && _modules[module].apps[application].views.indexOf('main') !== -1)
                    ? UtilService.getTemplateUrl(module, application, 'main')
                    : undefined;
            };

            /**
             * get templates for defined view
             * @param view
             * @returns {array}
             */
            this.getTemplates = function (template) {
                var result = [];
                var datatypes = this._getTypes();
                var module = PageService.getModule();
                var application = PageService.getApplication();
                angular.forEach(_modules, function (mods, modName) {
                    angular.forEach(mods.apps, function (opts, appName) {
                        // check if view exist for this module and application
                        if (opts.views.indexOf(template) !== -1) {
                            var push = false;
                            var dependencies = opts.dependencies;
                            var types = opts.datatypes;
                            // push if current module and application are defined as dependency
                            if (angular.isDefined(dependencies) && module in dependencies && dependencies[module].indexOf(application) !== -1) {
                                push = true;
                            } else if (angular.isDefined(types) && angular.isDefined(datatypes) && angular.isUndefined(dependencies)) {
                                // push if current type is defined as dependency
                                angular.forEach(types, function (type) {
                                    if (datatypes.indexOf(type) !== -1) {
                                        push = true;
                                    }
                                });
                            }
                            // add module and application to result
                            if (push || (angular.isUndefined(dependencies) && angular.isUndefined(types))) {
                                var priority = angular.isDefined(opts.priority) ? opts.priority : 0;
                                result.push({url: UtilService.getTemplateUrl(modName, appName, template), priority: priority});
                            }
                        }
                    });
                });
                return $filter('orderBy')(result, 'priority', true);
            };

            /**
             * get default module and application for defined type
             * @param type
             * @returns {object}
             */
            this.getDefaultModuleApplication = function (type) {
                return self.getDefaultModuleApplicationForTypeAndView(type, 'main');
            };

            /**
             * get basic title defined in configuration
             * @returns {string}
             */
            this.getDefaultTitle = function () {
                return _data["title"];
            };

            /**
             * get title for defined module and application
             * @param module
             * @param application
             * @returns {string}
             */
            this.getModuleApplicationTitle = function (module, application) {
                var title = undefined;
                angular.forEach(_modules, function (mods, modName) {
                    if (modName == module) {
                        angular.forEach(mods.apps, function (opts, appName) {
                            if (appName == application && angular.isDefined(opts.title) && opts.title.length > 0)
                                title = opts.title;
                        });
                    }
                });
                return title; // may return undefined
            };

            /**
             * get api url for defined module and application with parameters
             * @param module
             * @param name
             * @param params
             * @returns {string}
             */
            this.getApiUrl = function (module, name, params) {
                if (module in _modules && name in _modules[module].apis) {
                    return '/api/' + UtilService.matchUrlParams(_modules[module].apis[name], params)
                }
            };

            /**
             * get api path for module and api name
             * @param module
             * @param name
             * @returns {object}
             */
            this.getApiPath = function (module, name) {
                if (module in _modules && name in _modules[module].apis) {
                    var path = UtilService.getUrlPath(['api', module, name]);
                    return path;
                }
            };

            /**
             * get api parameters default values for module and api name
             * @param module
             * @param name
             * @returns {object}
             */
            this.getApiParamDefaults = function (module, name) {
                if (module in _modules && name in _modules[module].apis) {
                    var paramDefaults = _modules[module].apis[name];
                    return paramDefaults;
                }
            };

            /**
             * get module and application for home page
             * @returns {object}
             */
            this.getHomeApplication = function () {
                return _data.home;
            };

            /**
             * get module and application for not found page
             * @returns {object}
             */
            this.getPageNotFoundApplication = function () {
                return _data.pageNotFound;
            };
        }])

    /**
     * URL service - service for getting and manipulating data in url
     */
        .service('UrlService', ['$routeParams', '$route', '$location', '$filter', 'UtilService', '$window', '$rootScope', function ($routeParams, $route, $location, $filter, UtilService, $window, $rootScope) {
            var self = this;

            /**
             * check if defined key is param in url
             * @param key
             * @returns {boolean}
             */
            this.isParam = function (key) {
                return key in $routeParams;
            };

            /**
             * get data for defined parameter key in url
             * @param key
             * @returns {string}
             */
            this.getParam = function (key) {
                return $routeParams[key];
            };

            /**
             * get data for all parameters in url
             * @returns {object}
             */
            this.getAllParams = function () {
                return angular.copy($routeParams);
            };

            /**
             * get data for all parameters in search part of url
             * @returns {object}
             */
            this.getParams = function () {
                return $location.search();
            };

            /**
             * set parameter key to value and reload if defined
             * @param key
             * @param value
             * @param redirect
             */
            this.setParam = function (key, value, redirect) {
                $location.search(key, value);
                if (redirect)
                    $location.replace();
                $rootScope.$$phase || $rootScope.$apply();
            };

            /**
             * set parameters values and reload if defined
             * @param params
             * @param redirect
             */
            this.setParams = function (params, redirect) {
                $location.search(params);
                if (redirect)
                    $location.replace();
            };

            /**
             * set path to defined module and application
             * @param module
             * @param application
             */
            this.setPath = function (module, application) {
                this.setUrl(module, application, null);
            };

            /**
             * set url with defined parameters and reload if defined
             * @param params
             * @param redirect
             */
            this.setUrl = function (params, redirect) {
                if (!angular.isObject(params))
                    params = {};
                var parts = UtilService.getUrlParts(params);
                $location.path(UtilService.getUrlPath(parts.path)).search(parts.search);
                if (redirect)
                    $location.replace();
                $rootScope.$$phase || $rootScope.$apply();
            };

            /**
             * get defined parameters values from url
             * @param params
             * @returns {object}
             */
            this.getUrlParamValues = function (params) {
                var search = {};
                var todo = $filter('filter')(params, this.isParam, true);
                angular.forEach(todo, function (param) {
                    search[param] = this.getParam(param);
                }, this);
                return search;
            };
        }])

    /**
     * Utility service - common methods for manipulating with data
     */
        .service('UtilService', ['$filter', function ($filter) {

            /**
             * get template url string for defined module, application and view
             * @param module
             * @param application
             * @param template
             * @returns {string}
             */
            this.getTemplateUrl = function (module, application, template) {
                return 'assets/' + module + '/' + application + '/partials/' + template + '.html';
            };

            /**
             * get url search string for defined parameters
             * @param params
             * @returns {string}
             */
            this.getUrlSearch = function (params) {
                var url = [];
                angular.forEach(params, function (value, key) {
                    url.push(key + '=' + value);
                });
                return url.join('&');
            };

            /**
             * get url path string for defined parameters
             * @param params
             * @returns {string}
             */
            this.getUrlPath = function (params) {
                return '/' + params.join('/');
            };
            this.getUrl = function (params) {
                var parts = this.getUrlParts(params);
                return '#' + this.getUrlPath(parts.path) + '?' + this.getUrlSearch(parts.search);
            };

            /**
             * get url parameters separated to groups "path" and "search"
             * @param params
             * @return {object}
             */
            this.getUrlParts = function (params) {
                var output = { path: [], search: angular.copy(params) };
                if (angular.isDefined(params.module) && angular.isDefined(params.application)) {
                    output.path = [params.module, params.application];
                    delete output.search.module;
                    delete output.search.application;
                }
                return output;
            };

            /**
             * create url string filled with defined parameters in url as $1=xxx&$2=yyy
             * @param url
             * @param params
             * @returns {string}
             */
            this.matchUrlParams = function (url, params) {
                angular.forEach(params, function (value, index) {
                    url = url.replace('$' + (index + 1).toString(), value);
                });
                return url;
            };

            /**
             * convert string in camel case to dash notation
             * @param str
             * @returns {string}
             */
            this.camelToDash = function (str) {
                return str.replace(/\W+/g, '-')
                    .replace(/([a-z\d])([A-Z])/g, '$1-$2').toLowerCase();
            };

            /**
             * convert string in dash notation to camel case
             * @param str
             * @returns {string}
             */
            this.dashToCamel = function (str) {
                return str.replace(/\W+(.)/g, function (x, chr) {
                    return chr.toUpperCase();
                });
            };
        }])

    /**
     * Network service - service for getting data from defined api
     */
        .service('NetworkService', ['$resource', '$http', '$q', 'UtilService', 'ConfigurationService', '$log', '$cacheFactory', function ($resource, $http, $q, UtilService, ConfigurationService, $log, $cacheFactory) {

            // client least recently used cache
            var lruCache = $cacheFactory('lruCache', { capacity: 100 });

            /**
             * use api name from module with parameters
             * @param module
             * @param apiName
             * @param params
             * @param success {function} callback success function
             * @param error {function} callback error function
             */
            this.useApi = function (module, apiName, params, success, error) {
                if (!params) params = [];
                if (!(params instanceof Array)) throw new TypeError("params must be an Array");
                var url = ConfigurationService.getApiUrl(module, apiName, params);
                if (url == undefined) throw new Error("Cannot find api " + apiName + " in module " + module);
                var request = $http.get(ConfigurationService.getApiUrl(module, apiName, params));
                if (success !== undefined && success != null)
                    request.success(success);
                if (error !== undefined && error != null)
                    request.error(error);
            };

            /**
             * get data for defined module and api name with parameters
             * @param module
             * @param api
             * @param parameters
             * @param cache {boolean} if cache should be used (default: true)
             * @returns {promise}
             */
            this.getData = function (module, api, parameters, cache) {
                var url = ConfigurationService.getApiPath(module, api);
                var paramDefaults = ConfigurationService.getApiParamDefaults(module, api);
                $log.debug("NetworkService.getData[" + url + "]: url - " + angular.toJson(url));
                $log.debug("NetworkService.getData[" + url + "]: paramDefaults - " + angular.toJson(paramDefaults));
                $log.debug("NetworkService.getData[" + url + "]: parameters - " + angular.toJson(parameters));

                // check if parameters are defined for api
                angular.forEach(parameters, function (value, key) {
                    if (key in paramDefaults) {
                        if (angular.isUndefined(value)) {
                            parameters[key] = paramDefaults[key];
                            $log.warn("NetworkService.getData[" + url + "]: Undefined parameter '" + key + "' for module '" + module + "' and api '" + api + "'.");
                        }
                    } else {
                        $log.error("NetworkService.getData[" + url + "]: Wrong parameter '" + key + "' for module '" + module + "' and api '" + api + "'.");
                    }
                });


                // use LRU cache
                cache = angular.isDefined(cache) && !cache ? false : lruCache;

                // promise to return
                var deferred = $q.defer();
                $resource(url, paramDefaults, {get: {method: 'GET', cache: cache}}).get(parameters, function (value, responseHeaders) {
                    deferred.resolve(value);
                    $log.debug("NetworkService.getData[" + url + "]: value.length = " + angular.toJson(value).length);
                }, function (httpResponse) {
                    deferred.resolve({});
                    $log.debug("NetworkService.getData[" + url + "]: error");
                });
                return deferred.promise;
            };
        }])

    /**
     * Prefix service - service for exchanging prefixes in string
     */
        .service('PrefixService', ['ConfigurationService', function (ConfigurationService) {

            // load prefixes definitions
            var prefixes = ConfigurationService.getPrefixes();

            /**
             * expand string with prefix value
             * @param value
             * @returns {string}
             */
            this.expandString = function (value) {
                for (var prefix in prefixes) {
                    if (value.indexOf(prefix) == 0)
                        return prefixes[prefix] + value.substr(prefix.length);
                }
                return value;
            };

            /**
             * contract string with prefix value
             * @param value
             * @returns {string}
             */
            this.contractString = function (value) {
                for (var prefix in prefixes) {
                    if (value.indexOf(prefixes[prefix]) == 0)
                        return prefix + value.substr(prefixes[prefix].length);
                }
                return value;
            };

        }])

    /**
     * Page service - service to set and load basic page data
     */
        .service('PageService', ['UrlService', '$window', function (UrlService, $window) {

            /**
             * set window title
             * @param title
             */
            this.setTitle = function (title) {
                $window.document.title = title;
            };

            /**
             * get recent application module
             * @returns {string}
             */
            this.getModule = function () {
                return UrlService.getParam('module');
            };

            /**
             * get recent application
             * @returns {string}
             */
            this.getApplication = function () {
                return UrlService.getParam('application');
            };
        }])

    /**
     * Application service - basic interface for applications
     */
        .service('AppService', ['$q', 'UrlService', 'UtilService', 'NetworkService', 'ConfigurationService', 'PrefixService', 'PageService',
            function ($q, UrlService, UtilService, NetworkService, ConfigurationService, PrefixService, PageService) {
                var self = this;

                /**
                 * initialize params in application and setup listener for required params changing
                 * @param {angular.scope} $appScope application scope
                 * @param {array} params required parameters for app, ex.: params = ['resource'] -> $appScope.resource = UrlService.getParam('resource') -> listening for parameter changing
                 * @param {function} update function for view updating
                 */
                this.init = function ($appScope, params, update) {

                    if (angular.isDefined($appScope) && angular.isDefined(params) && params instanceof Array && params.length > 0) {
                        var changes = {};
                        for (var i = 0; i < params.length; i++) {
                            var appParamName = UtilService.dashToCamel(params[i]);
                            var paramValue = UrlService.getParam(params[i])
                            if ($appScope[appParamName] !== paramValue) {
                                changes[appParamName] = {'old': $appScope[appParamName], 'new': paramValue};
                                $appScope[appParamName] = paramValue;
                            }
                        }

                        // on url change event
                        $appScope.$listen("$locationParamsChangedEvent", function (event, oldParams, newParams) {
                            var paramsChanged = false;
                            var changes = {};
                            // check if anything changed
                            angular.forEach(params, function (param) {
                                if (!angular.equals(oldParams[param], newParams[param]) && !angular.equals($appScope[param], newParams[param])) {
                                    changes[param] = {old: oldParams[param], new: newParams[param]};
                                    $appScope[param] = newParams[param];
                                    paramsChanged = true;
                                }
                            });
                            // call update to process change
                            if (paramsChanged) {
                                angular.isDefined(update) && update(changes);
                            }
                        });
                    }
                    angular.isDefined(update) && update(changes);
                };

                /**
                 * get data for defined module and api name with parameters and set information about loading in scope parameters
                 * @param $scope
                 * @param module
                 * @param api
                 * @param parameters
                 * @param cache {boolean} if cache should be used (default: true)
                 * @returns {promise}
                 */
                this.getData = function ($scope, module, api, parameters, cache) {
                    $scope.isLoading = true;
                    var promise = NetworkService.getData(module, api, parameters, cache);
                    if (angular.isUndefined($scope.loadingQueue))
                        $scope.loadingQueue = [];
                    $scope.loadingQueue.push(promise);
                    var counter = $scope.loadingQueue.length;
                    $q.all($scope.loadingQueue).then(function () {
                        if ($scope.loadingQueue.length == counter) { // all requests have been resolved
                            $scope.loadingQueue = [];
                            $scope.isLoading = false;
                        }
                    });

                    return promise;
                };

                /**
                 * set window title with application defined part and configuration defined part
                 * @param title
                 */
                this.setTitle = function (title) {
                    title = angular.isDefined(title) ? title + " | " : "";
                    PageService.setTitle(title + ConfigurationService.getDefaultTitle());
                };

                /**
                 * set url with defined parameters and reload if defined
                 * @param params
                 * @param redirect
                 */
                this.setUrl = function (params, redirect) {
                    UrlService.setUrl(params, redirect);
                };

                /**
                 * set parameters values and reload if defined
                 * @param params
                 * @param redirect
                 */
                this.setParams = function (params, redirect) {
                    UrlService.setParams(params, redirect);
                };

                /**
                 * set parameter key to value and reload if defined
                 * @param key
                 * @param value
                 * @param redirect
                 */
                this.setParam = function (key, value, redirect) {
                    UrlService.setParam(key, value, redirect);
                };

                /**
                 * get information about main view application
                 * @returns {object}
                 */
                this.getMainApplication = function () {
                    return {
                        module: UrlService.getParam("module"),
                        application: UrlService.getParam("application")
                    };
                };

                /**
                 * check if defined module and application is in main view
                 * @param module
                 * @param application
                 * @returns {boolean}
                 */
                this.isMainApplication = function (module, application) {
                    var main = this.getMainApplication();
                    return main.module == module && main.application == application;
                };

                /**
                 * redirect to page not found
                 */
                this.pageNotFound = function () {
                    UrlService.setUrl(ConfigurationService.getPageNotFoundApplication(), true);
                };

                /**
                 * expand string with prefix value
                 * @param prefixedString
                 * @returns {string}
                 */
                this.expandPrefix = function (prefixedString) {
                    return PrefixService.expandString(prefixedString);
                };

                /**
                 * contract string with prefix value
                 * @param nonPrefixedString
                 * @returns {string}
                 */
                this.contractPrefix = function (nonPrefixedString) {
                    return PrefixService.contractString(nonPrefixedString);
                };
            }]);

})();