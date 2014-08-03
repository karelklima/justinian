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


        .directive('mainApp', function () {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template:
                    "<div class=\"panel\">\n" +
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
                    "<div class=\"panel panel-default\">\n" +
                    "  <div class=\"panel-heading cursor-pointer\" ng-click=\"toggleOpen()\">\n" +
                    "    <h4 class=\"panel-title\">\n" +
                    "      <a class=\"sidebar-toggle\">\n" +
                    "        <span ng-class=\"{'text-muted': isDisabled}\">{{heading}}</span>\n" +
                    "        <div class=\"pull-right\">\n" +
                    "          <span ng-show=\"isLoading\" spinner-glyphicon></span>\n" +
                    "          <span class=\"glyphicon\" ng-class=\"{'glyphicon-chevron-down': isOpen, 'glyphicon-chevron-right': !isOpen}\"></span>" +
                    "        </div>\n" +
                    "      </a>\n" +
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

                    if (angular.isDefined(attrs.isOpen)) // if it is defined as an attribute, initiate / overwrite scope
                        scope.isOpen = attrs.isOpen == "true";
                    else if (angular.isUndefined(scope.isOpen)) // if it is not defined in custom controller, initiate
                        scope.isOpen = false;

                    if (angular.isDefined(attrs.isDisabled))
                        scope.isDisabled = attrs.isDisabled == "true";
                    else if (angular.isUndefined(scope.isDisabled))
                        scope.isDisabled = false;

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