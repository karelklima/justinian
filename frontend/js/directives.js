var appDirectives;

appDirectives = angular.module('appDirectives', [
    'appServices'
]);

appDirectives.directive('click', ['UrlService', function (UrlService) {
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
        template: '<a href ng-click="click()" ng-transclude></a>',
        link: function (scope, element, attributes) {
            scope.click = function () {
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
