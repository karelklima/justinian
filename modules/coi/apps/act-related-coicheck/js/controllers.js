appControllers.controller('COICheckController', ['$scope', 'NetworkService', 'UrlService', 'AppService', function ($scope, NetworkService, UrlService, AppService) {

//    $scope.resource = UrlService.getParam('resource');

    $scope.checks = [];
    $scope.property = '-date';
    $scope.reverse = false;

    $scope.sortBy = function (property) {
        if ($scope.property === property) {
            $scope.reverse = !$scope.reverse;
        } else {
            $scope.property = property;
            $scope.reverse = false;
        }
    };

    this.update = function () {
        NetworkService.getData('coi', 'act-related-coicheck', {'resource': $scope.resource})
            .then(function (checks) {
                $scope.checks = checks;
            });
    };

    AppService.init($scope, ['resource'], this.update);

}]);