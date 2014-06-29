appControllers.controller('COICheckController', ['$scope', 'NetworkService', 'UrlService', function ($scope, NetworkService, UrlService) {

    $scope.resource = UrlService.getParam('resource');

    $scope.checks = [];
    $scope.property = '-date';
    $scope.reverse = false;

    $scope.sortBy = function(property) {
        if ($scope.property === property) {
            $scope.reverse = !$scope.reverse;
        } else {
            $scope.property = property;
            $scope.reverse = false;
        }
    };

    NetworkService.useApi('lex','lex/act-related-coicheck',[$scope.resource],function success(checks, status){
        if(!(checks instanceof Array)) checks = [];
        $scope.checks = checks;
        $scope.$$phase || $scope.$apply();
    },function error(data, status){
        $scope.checks = null;
        $scope.$$phase || $scope.$apply();
    });
}]);