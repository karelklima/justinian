(function() {

    angular.module("appDirectives")

        .directive('spinner', function() {
            return {
                scope: {
                    spinner: '='
                },
                link: function(scope, element, attrs)
                {
                    var s = new Spinner(scope.spinner || {});
                    s.spin(element[0]);

                    scope.$on('$destroy', function () {
                        s.stop();
                        s = null;
                    });
                }
            }
        })

        .directive('spinnerBar', function() {
            return {
                restrict: 'A',
                replace: true,
                transclude: true,
                template: '<div class="spinner-bar"><div spinner="{radius:10, width:3, length: 0, shadow: false, color: \'#333\', trail: 40, lines: 11}"></div></div>'
            }
        })

        .directive('spinnerGlyphicon', function() {
            return {
                restrict: 'A',
                replace: true,
                transclude: true,
                template: '<span class="glyphicon glyphicon-spinner"><span spinner="{radius:6, width:2, length: 0, shadow: false, color: \'#333\', trail: 40, lines: 11}"></span></span>'
            }
        })

        .directive('datapager', function() {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    source: '=',
                    target: '=',
                    itemsPerPage: '@'
                },
                template:
                    "<div class=\"text-center\">\n" +
                    "  <a class=\"btn btn-default pull-left\" ng-click=\"previousPage()\" ng-class=\"{disabled: isLoading || page < 1}\">Předchozí</a>\n" +
                    "  <a class=\"btn btn-default pull-right\" ng-click=\"nextPage()\" ng-class=\"{disabled: isLoading || page >= maxPage}\">Následující</a>\n" +
                    "  <a class=\"btn btn-primary\" ng-click=\"appendPage()\" ng-class=\"{disabled: isLoading || page >= maxPage}\">Načíst další</a>\n" +
                    "</div>",
                link: function(scope, element, attrs) {

                    if (angular.isUndefined(scope.source)
                        || !angular.isFunction(scope.source.get)) {
                        throw new Error("Datapager: data source is not valid");
                    }

                    scope.limit = scope.itemsPerPage;
                    if (angular.isUndefined(scope.limit) || scope.limit < 1)
                        scope.limit = 10; // default page size

                    scope.page = 0;
                    scope.maxPage = 1000;
                    scope.append = false;
                    scope.target = [];
                    scope.isLoading = false;

                    scope.appendPage = function() {
                        scope.append = true;
                        scope.page++;
                        scope.update();
                    };

                    scope.nextPage = function() {
                        scope.page++;
                        scope.update();
                    };

                    scope.previousPage = function() {
                        scope.page--;
                        scope.update();
                    };

                    scope.$watch('source', function(current, previous) {
                        if (angular.isUndefined(current.revision) || current.revision == previous.revision)
                            return; // do not refresh
                        scope.target = [];
                        scope.page = 0;
                        scope.maxPage = 1000;
                        scope.update()
                    }, true);

                    scope.update = function() {
                        scope.isLoading = true;
                        if (!scope.append)
                            scope.target = [];
                        else
                            scope.append = false;
                        scope.source.get(scope.page * scope.limit, scope.limit, function(data) {
                            if (data.length < scope.limit)
                                scope.maxPage = scope.page;
                            scope.target.push.apply(scope.target, data);
                            scope.isLoading = false;
                        });
                    };

                    scope.update(); // initial load

                }
            }
        })

        .directive('appBar', ['$window', function($window) {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template:
                    "<div class=\"app-bar ui-scrollfix-container\">\n" +
                    "  <div class=\"ui-scrollfix-element\" ui-scrollfix=\"{{scrollfixOffset}}\">\n" +
                    "    <div class=\"navbar navbar-default\">\n" +
                    "       <div class=\"container-fluid transclude\">\n" +
                    "       </div>\n" +
                    "    </div>\n" +
                    "  </div>\n" +
                    "</div>",
                link: function(scope, element, attrs, controller, linker) {
                    linker(scope, function(clone) {
                        element.find(".transclude").append(clone);
                    });

                    scope.scrollfixOffset = 0;
                    if (attrs.appBar !== null && attrs.appBar.length > 0) {
                        scope.scrollfixOffset = attrs.appBar;
                    }

                    // set outer height via CSS so when the content "pops" out the height of the document is maintained
                    element.height(element.height());
                    element.find('.ui-scrollfix-element').width(element.width());

                    function adjustWidth() {
                        scope.$apply(function() {
                            element.find('.ui-scrollfix-element').width(element.width());
                        });
                    }
                    angular.element($window).bind('resize', adjustWidth);
                    scope.$on('$destroy', function () {
                        $(window).unbind('resize',adjustWidth);
                    });

                }
            }
        }])

        .directive('appBarUpButton', ['$window', '$document', function($window, $document) {
            return {
                restrict: 'A',
                scope: true,
                replace: true,
                template: "<a class=\"app-bar-up-button btn btn-link navbar-btn\" ng-click=\"goUp()\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a>",
                link: function(scope, element, attrs) {
                    scope.goUp = function() {
                        $document.scrollTo(angular.element("body"), 0, 300);
                    }
                }
            }
        }])

        .directive('mainApp', function () {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template:
                    "<div class=\"panel main-app\">\n" +
                    "  <div class=\"panel-body transclude\"></div>\n" +
                    "</div>",
                link: function(scope, element, attrs, controller, linker) {
                    // Custom transclusion so we can share scope with custom controller
                    linker(scope, function(clone){
                        element.find(".transclude").append(clone); // add to DOM
                    });
                }
            }
        })

        .directive('sidebarApp', function () {
            return {
                restrict: 'A',
                transclude: true,              // It transcludes the contents of the directive into the template
                replace: true,                // The element containing the directive will be replaced with the template
                template:
                    "<div class=\"panel panel-default sidebar-app\" ng-hide=\"isHidden\">\n" +
                    "  <div class=\"panel-heading cursor-pointer\" ng-click=\"toggleOpen()\">\n" +
                    "    <h4 class=\"panel-title\">\n" +
                    "      <div class=\"sidebar-toggle\">\n" +
                    "        <span ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span>\n" +
                    "        <div class=\"pull-right\">\n" +
                    "          <span ng-show=\"isLoading\" spinner-glyphicon></span>\n" +
                    "          <span class=\"glyphicon\" ng-class=\"{'glyphicon-chevron-down': isOpen, 'glyphicon-chevron-right': !isOpen}\"></span>" +
                    "        </div>\n" +
                    "      </div>\n" +
                    "    </h4>\n" +
                    "  </div>\n" +
                    "  <div class=\"panel-collapse\" collapse=\"!isOpen\">\n" +
                    "	  <div class=\"panel-body transclude\"></div>\n" +
                    "  </div>\n" +
                    "</div>",
                link: function(scope, element, attrs, controller, linker) {
                    // Custom transclusion so we can share scope with custom controller
                    linker(scope, function(clone){
                        element.find(".transclude").append(clone); // add to DOM
                    });

                    if (angular.isUndefined(scope.isOpen))
                        scope.isOpen = !(angular.isDefined(attrs.setOpen) && attrs.setOpen != "true");

                    if (angular.isUndefined(scope.isDisabled))
                        scope.isDisabled = angular.isDefined(attrs.setDisabled) && attrs.setDisabled == "true";

                    if (angular.isUndefined(scope.isHidden))
                        scope.isHidden = angular.isDefined(attrs.setHidden) && attrs.setHidden == "true";

                    if (angular.isDefined(attrs.heading))
                        scope.heading = attrs.heading;
                    else if (angular.isUndefined(scope.heading))
                        scope.heading = "Aplikace";

                    scope.toggleOpen = function() {
                        if ( !scope.isDisabled ) {
                            scope.isOpen = !scope.isOpen;
                        }
                    };
                }
            };
        })

        .directive('anchorScroll', ['$timeout', '$document', function ($timeout, $document) {
            return {
                restrict: 'A',
                scope: {
                    offsetTop: '@'
                },
                link: function (scope, element, attrs) {
                    if (angular.isUndefined(scope.offsetTop))
                        scope.offsetTop = element.offset().top;
                    scope.$on('anchor-scroll', function (events, params) {
                        $timeout(function () { // You might need this timeout to be sure its run after DOM render.
                            var target = element.find(params.target);
                            if (target.length) {
                               $document.scrollTo(target[0], scope.offsetTop, 300);
                            }
                        }, 0, false);
                    })
                }
            }
        }]);



})();