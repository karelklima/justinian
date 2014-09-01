(function(angular) {

    angular.module('appDirectives', ['appServices'])

        .directive('click', ['UrlService', 'UtilService', '$parse', 'ConfigurationService','$compile', '$timeout', function (UrlService, UtilService, $parse, ConfigurationService, $compile, $timeout) {
            return {
                restrict: 'A',
                scope: {
                    params: '='
                },
                link: function (scope, element, attributes) {

                    var attrRegex = new RegExp("^(click|params|ng-.*|sys-.*|class|id|pop-over)$");

                    var popover = false;

                    var getEffectiveParams = function() {
                        var params = angular.isDefined(scope.params) ? angular.copy(scope.params) : {};

                        // Copy all relevant attributes to scope.params
                        angular.forEach(attributes.$attr, function(attribute, key) {
                            if (!attrRegex.test(attribute)) {
                                params[key] = attributes[key];
                            }
                        });

                        if (
                            (angular.isDefined(params.module) && angular.isDefined(params.application))
                            ||
                            (angular.isDefined(params.resource) && angular.isDefined(params.type))
                            ) {
                            return params; // Overwrites current params
                        } else {
                            var extendedParams = UrlService.getAllParams();
                            angular.extend(extendedParams, params);
                            return extendedParams; // Extends current params
                        }
                    };

                    var effectiveParams = getEffectiveParams();

                    if(angular.isDefined(attributes.$attr['popOver']) && attributes['popOver']=='enable' && angular.isDefined(effectiveParams['type']))
                        popover = true;

//                    Set initial href attribute
                    element.attr("href", UtilService.getUrl(effectiveParams));

                    element.bind('mouseover', function() {
                        element.attr("href", UtilService.getUrl(getEffectiveParams()));
                    });


                    element.bind('click', function(event) {
                        if (event.button == 0 && !(event.metaKey || event.ctrlKey)) { // just metaKey does not work properly
                            event.preventDefault(); //open in main window
                            UrlService.setUrl(getEffectiveParams());
                        }
                        return true;
                    });

                    if(popover){

                        var popoverLoaded = false;

                        element.bind('mouseenter', function() {

                            if (popoverLoaded)
                                return;

                            popoverLoaded = true;

                            angular.extend(scope, effectiveParams);
                            scope.clickParams = effectiveParams;
                            scope.popOverTitle = "";
                            var target = ConfigurationService.getDefaultModuleApplicationForTypeAndView(effectiveParams['type'],'pop-over');
                            if(target){
                                var templateUrl = UtilService.getTemplateUrl(target.module, target.application, 'pop-over');
                                element.attr("popover", templateUrl);
                                element.attr("popover-title","{{ popOverTitle }}");
                                element.attr("popover-trigger","show");
                                element.attr("popover-placement","bottom");
                                element.bind("mouseenter", function(event){
                                    element.triggerHandler("show");
                                });
                                element.removeAttr('click');
                                $compile(element)(scope);

                                $timeout(function () {
                                    element.triggerHandler('show');
                                }, 0);

                            }

                        });

                    }
                }
            }
        }])

    .directive('compile', ['$compile', function ($compile) {
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    // watch the 'compile' expression for changes
                    return scope.$eval(attrs.compile);
                },
                function (value) {
                    // when the 'compile' expression changes
                    // assign it into the current DOM
                    element.html(value);

                    // compile the new DOM and link it to the current
                    // scope.
                    // NOTE: we only compile .childNodes so that
                    // we don't get into infinite loop compiling ourselves
                    $compile(element.contents())(scope);
                }
            );
        };
    }])

    .directive('scrollIf', function () {
        return function (scope, element, attributes) {
            setTimeout(function () {
                if (scope.$eval(attributes.scrollIf)) {
                    window.scrollTo(0, element[0].offsetTop - 100)
                }
            });
        }
    })


    .directive('changeTimeout', function () {
        return {
            require: 'ngModel',
            link: function (scope, elem, attr, ctrl) {
                if (!attr.ngChange) {
                    throw new TypeError('ng-change directive not present');
                }

                angular.forEach(ctrl.$viewChangeListeners, function (listener, index) {
                    ctrl.$viewChangeListeners[index] = _.debounce(function () {
                        scope.$apply(attr.ngChange);
                    }, attr.changeTimeout || 0)
                });
            }
        }
    })

    .run(["$templateCache", function($templateCache) {
        $templateCache.put("template/popover/popover.html",
                "<div class=\"popover {{placement}}\" ng-class=\"{ in: isOpen(), fade: animation() }\">\n" +
                "  <div class=\"arrow\"></div>\n" +
                "\n" +
                "  <div class=\"popover-inner\">\n" +
                "      <h3 class=\"popover-title\" ng-bind=\"title\" ng-show=\"title\"></h3>\n" +
                "      <div class=\"popover-content\"><div ng-include=\"content\"></div></div>\n" +
                "  </div>\n" +
                "</div>\n" +
                "");
    }]);

})(angular);
