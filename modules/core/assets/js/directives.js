(function() {

    angular.module("appDirectives")

        /**
        * Show loading indicator
        */
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

        /**
        * Normal-size loading indicator
        */
        .directive('spinnerBar', function() {
            return {
                restrict: 'A',
                replace: true,
                transclude: true,
                template: '<div class="spinner-bar"><div spinner="{radius:10, width:3, length: 0, shadow: false, color: \'#333\', trail: 40, lines: 11}"></div></div>'
            }
        })

        /**
        * Small loading indicator
        */
        .directive('spinnerGlyphicon', function() {
            return {
                restrict: 'A',
                replace: true,
                transclude: true,
                template: '<span class="glyphicon glyphicon-spinner"><span spinner="{radius:6, width:2, length: 0, shadow: false, color: \'#333\', trail: 40, lines: 11}"></span></span>'
            }
        })

        /**
        * Paging directive
        */
        .directive('datapager', function() {
            return {
                restrict: 'A',
                replace: true,
                scope: {
                    source: '=',
                    target: '=',
                    itemsPerPage: '@',
                    hideControls: '@'
                },
                template:
                    "<div class=\"text-center\" ng-show=\"showControls && !source.isEmpty\">\n" +
                    "  <a class=\"btn btn-default pull-left\" ng-click=\"previousPage()\" ng-class=\"{disabled: isLoading || page < 1}\">Předchozí</a>\n" +
                    "  <a class=\"btn btn-default pull-right\" ng-click=\"nextPage()\" ng-class=\"{disabled: isLoading || page >= maxPage}\">Následující</a>\n" +
                    "  <a class=\"btn btn-primary\" ng-click=\"appendPage()\" ng-class=\"{disabled: isLoading || page >= maxPage}\">\n" +
                    "    <span ng-hide=\"isLoading\">Načíst další</span><span ng-show=\"isLoading\">Načítám</span>\n" +
                    "  </a>\n" +
                    "</div>",
                link: function(scope, element, attrs) {

                    if (angular.isUndefined(scope.source)
                        || !angular.isFunction(scope.source.get)) {
                        throw new Error("Datapager: data source is not valid");
                    }

                    scope.limit = scope.itemsPerPage;
                    if (angular.isUndefined(scope.limit) || scope.limit < 1)
                        scope.limit = 10; // default page size

                    scope.showControls = angular.isUndefined(scope.hideControls) || scope.hideControls != "true";

                    scope.page = 0;
                    scope.maxPage = 1000;
                    scope.append = false;
                    scope.target = [];

                    scope.source.isEmpty = false;
                    scope.source.isLoading = false;

                    /** Show next page. */
                    scope.appendPage = function() {
                        scope.append = true;
                        scope.page++;
                        scope.update();
                    };

                    /** Show next page. */
                    scope.nextPage = function() {
                        scope.page++;
                        scope.update();
                    };
                    /** Show previous page. */
                    scope.previousPage = function() {
                        scope.page--;
                        scope.update();
                    };

                    /** Full update of current directive on datasource changing. */
                    scope.$watch('source', function(current, previous) {
                        if (angular.isUndefined(current.revision) || current.revision == previous.revision)
                            return; // do not refresh
                        scope.target = [];
                        scope.page = 0;
                        scope.maxPage = 1000;
                        scope.update()
                    }, true);

                    /** Update current state and view. */
                    scope.update = function() {
                        scope.source.isLoading = true;
                        scope.source.isEmpty = false;
                        if (!scope.append)
                            scope.target = [];
                        else
                            scope.append = false;

                        var originalRevision = scope.source.revision;

                        scope.source.get(scope.page * scope.limit, scope.limit, function(data) {
                            if (scope.source.revision !== originalRevision) {
                                return; // newer datasource is already in place
                            }
                            if (data.length < scope.limit)
                                scope.maxPage = scope.page;
                            if (data.length == 0 && scope.maxPage == 0)
                                scope.source.isEmpty = true;
                            scope.target.push.apply(scope.target, data);
                            scope.source.isLoading = false;
                        });
                    };

                    scope.update(); // initial load

                }
            }
        })

        /**
        * Top bar for main application
        */
        .directive('appBar', ['$window', '$timeout', function($window, $timeout) {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template:
                    "<div class=\"app-bar ui-scrollfix-container\">\n" +
                    "  <div class=\"ui-scrollfix-element\" ui-scrollfix>\n" +
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

                    function adjust() {
                        $timeout(function () {
                            element.find('.ui-scrollfix-element').width(element.width());
                            element.height(element.find('.ui-scrollfix-element').height());
                        }, 0, false);
                    }

                    adjust();

                    angular.element($window).bind('resize', adjust);
                    scope.$on('$destroy', function () {
                        $(window).unbind('resize',adjust);
                    });

                    if (angular.isDefined(attrs.adjustOn)) {
                        scope.$watch(attrs.adjustOn, function() {
                            adjust();
                        });
                    }

                }
            }
        }])

        /**
        * Button "To top" in main application bar.
        */
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

        /**
        * Button section in main application bar.
        */
        .directive('appBarToolbox', ['$document', function($document) {
            return {
                restrict: 'A',
                scope: true,
                replace: true,
                template:
                    "<span class=\"app-bar-toolbox navbar-default\">\n" +
                    "  <a title=\"Nástroje\" class=\"app-bar-up-button btn btn-link navbar-btn\" ng-click=\"goToSidebar()\"><span class=\"glyphicon glyphicon-list-alt\"></span></a>" +
                    "  <a title=\"Nahoru\" class=\"app-bar-up-button btn btn-link navbar-btn\" ng-click=\"goUp()\"><span class=\"glyphicon glyphicon-chevron-up\"></span></a>" +
                    "</span>"
                ,
                link: function(scope, element, attrs) {
                    scope.goUp = function() {
                        $document.scrollTo(angular.element("body"), 0, 300);
                    };

                    scope.goToSidebar = function() {
                        $document.scrollTo(angular.element("div.sidebar"), 150, 300);
                    };
                }
            }
        }])

        /** Main application */
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

        /** Sidebar application
        * @param {boolean} set-open - Sidebar app is minimized.
        * @param {boolean} set-disable - Sidebar app is disabled.
        * @param {boolean} set-hidden - Sidebar app is hidden.
        * @param {string} [heading="Aplikace"] - Panel title
        */
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

                    /** Transfer attributes to scope */

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

        /** Popover application */
        .directive('popOverApp', function () {
            return {
                priority: 10000,
                restrict: 'A',
                transclude: true,
                replace: true,
                template:
                    "<div class=\"pop-over-app transclude\">\n" +
                    "</div>",
                controller: function($scope) {
                    var targetScope = $scope;
                    for (var i = 1; i < 5; i++)
                    {
                        if (angular.isUndefined(targetScope.$parent))
                            break;

                        targetScope = targetScope.$parent;

                        if (angular.isDefined(targetScope.clickParams))
                        {
                            $scope.clickPopOverScope = targetScope;
                            angular.extend($scope, targetScope.clickParams);
                            break;
                        }
                    }
                },
                link: function(scope, element, attrs, controller, linker) {
                    // Custom transclusion so we can share scope with custom controller
                    linker(scope, function(clone){
                        element.append(clone); // add to DOM
                    });

                    scope.$watch('heading', function(current, previous) {
                        scope.clickPopOverScope.popOverTitle = current;
                    });

                    if (angular.isDefined(attrs.heading)) {
                        scope.heading = attrs.heading;
                    }
                    else if (angular.isUndefined(scope.heading))
                        scope.heading = undefined;
                }
            }
        })

        /** Move to selected element on screen.
        * If you need to scroll current page to selected element, you have to broadcast event "anchor-scroll" with parameters : {target: XXXX}
        * Example: $scope.$broadcast('anchor-scroll', {target: 'section[resource="'+$scope.section+'"]'});
        */
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