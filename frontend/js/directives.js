var appDirectives;

appDirectives = angular.module('appDirectives', [
    'appServices'
]);

appDirectives.directive('click', ['UrlService', 'UtilService', '$parse', function (UrlService, UtilService, $parse) {
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        scope: {
            module: '@',
            application: '@',
            resource: '@',
            type: '@',
            query: '@',
            params: '@'
        },
        template: "<a ng-click=click($event) ng-transclude></a>",
        link: function (scope, element, attributes) {
            var params = angular.isDefined(scope.params) ? angular.fromJson(scope.params) : {};
            if (angular.isDefined(scope.resource)) {
                params['resource'] = scope.resource;
            }
            if (angular.isDefined(scope.type)) {
                params['type'] = scope.type;
            }
            if (angular.isDefined(scope.query)) {
                params['query'] = scope.query;
            }

            attributes.$set('href', '#!/' +  UtilService.getUrl([scope.module, scope.application], params));

            scope.click = function ($event) {
                if($event){
                    if($event.button == 0 && !$event.metaKey && attributes.sysClick){
                        $event.preventDefault();
//                        console.log($event);
//                        console.log("Phase[1]: "+($event.button == 0 && !$event.metaKey));
                    }
                }

                if($event && $event.isDefaultPrevented()) {
//                    console.log($event);
//                    console.log("Phase[2]: "+$event.isDefaultPrevented());
                    return false;
                }

                UrlService.setUrl(scope.module, scope.application, params);

                if(attributes.sysClick){
                    var fn = $parse(attributes.sysClick);
                    fn(scope.$parent, {$event:$event});
                }
                return true;
            }
        }
    };
}]);

appDirectives.directive('scrollIf', function () {
  return function (scope, element, attributes) {
    setTimeout(function () {
      if (scope.$eval(attributes.scrollIf)) {
        window.scrollTo(0, element[0].offsetTop - 100)
      }
    });
  }
});


appDirectives.directive('changeTimeout', function() {
        return {
            require: 'ngModel',
            link: function(scope, elem, attr, ctrl) {
                if (!attr.ngChange) {
                    throw new TypeError('ng-change directive not present');
                }

                angular.forEach(ctrl.$viewChangeListeners, function(listener, index) {
                    ctrl.$viewChangeListeners[index] = _.debounce(function() {
                        scope.$apply(attr.ngChange);
                    }, attr.changeTimeout || 0)
                });
            }
        }
    });
