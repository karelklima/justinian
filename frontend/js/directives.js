var appDirectives;

appDirectives = angular.module('appDirectives', [
    'appServices'
]);

appDirectives.directive('click', ['UrlService', function (UrlService) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
            module: '@',
            application: '@',
            resource: '@',
            type: '@',
            params: '@'
        },
        template: '<a href ng-click="click()" ng-transclude></a>',
        link: function (scope) {
            scope.click = function () {
                var params;
                if (angular.isDefined(scope.params)) {
                    params = angular.fromJson(scope.params);
                } else {
                    params = {};
                }
                if (angular.isDefined(scope.resource)) {
                    params['resource'] = scope.resource;
                }
                if (angular.isDefined(scope.type)) {
                    params['type'] = scope.type;
                }
                UrlService.setUrl(scope.module, scope.application, params);
            }
        }
    };
}]);