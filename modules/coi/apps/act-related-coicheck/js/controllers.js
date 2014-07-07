(function() {
    angular.module('appControllers')
        .controller('COICheckController', ['$scope', 'NetworkService', 'UrlService', 'AppService', function ($scope, NetworkService, UrlService, AppService) {

//            $scope.resource = UrlService.getParam('resource');

            $scope.checks = undefined;
            $scope.property = '-date-utc';
            $scope.reverse = false;

            $scope.sortBy = function (property) {
                if ($scope.property === property) {
                    $scope.reverse = !$scope.reverse;
                } else {
                    $scope.property = property;
                    $scope.reverse = false;
                }
            };

            $scope.isLoading = function() {
                return angular.isUndefined($scope.checks);
            };

            $scope.isEmpty = function() {
                return angular.isDefined($scope.checks) && $scope.checks.length === 0;
            };

            this.update = function () {
                NetworkService.getData('coi', 'act-related-coicheck', {'resource': $scope.resource})
                    .then(function (checks) {
                        $scope.checks = checks["@graph"];
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();