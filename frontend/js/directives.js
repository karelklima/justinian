var appDirectives;

appDirectives = angular.module('appDirectives', [
    'appServices'
]);

appDirectives.directive('click', ['UrlService', 'UtilService', '$parse', '$compile', function (UrlService, UtilService, $parse, $compile) {
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
            attributes.$set('href', '#!/' +  UtilService.getUrl([scope.module, scope.application],
                angular.isDefined(scope.params) ? UrlService.getUrlParamValues(scope.params) : []
                ));

            scope.click = function ($event) {
                if($event){
                    if($event.button == 0 && !$event.metaKey){
                        $event.preventDefault();
//                        console.log($event);
//                        console.log("Phase[1]: "+($event.button == 0 && !$event.metaKey));
                    }
                }

                if($event && !$event.isDefaultPrevented()) {
//                    console.log($event);
//                    console.log("Phase[2]: "+$event.isDefaultPrevented());
                    return false;
                }

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
                UrlService.setUrl(scope.module, scope.application, params);

                var fn = $parse(attributes.sysClick);
                fn(scope.$parent, {$event:$event});
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
