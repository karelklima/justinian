(function() {

    angular.module("appDirectives")

        .directive('mainApp', function () {
            return {
                restrict: 'A',
                transclude: true,
                replace: true,
                template: "<div class=\"panel transclude\"></div>",
                link: function(scope, element, attrs, controller, linker) {
                    // Custom transclusion so we can share scope with custom controller
                    linker(scope, function(clone){
                        element.append(clone); // add to DOM
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
                    "        <i class=\"pull-right glyphicon\" ng-class=\"{'glyphicon-chevron-down': isOpen, 'glyphicon-chevron-right': !isOpen}\"></i>" +
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



})();