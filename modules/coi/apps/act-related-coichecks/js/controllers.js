(function() {
    angular.module('appControllers')
        .controller('ActRelatedCoiChecksController', ['$scope', 'NetworkService', 'UrlService', 'AppService', function ($scope, NetworkService, UrlService, AppService) {

            $scope.checks = undefined;
            $scope.predicate = '-dateIso';
            $scope.reverse = false;

            $scope.sortBy = function (predicate) {
                if ($scope.predicate === predicate) {
                    $scope.reverse = !$scope.reverse;
                } else {
                    $scope.predicate = predicate;
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
                NetworkService.getData('coi', 'act-related-coichecks', {'resource': $scope.resource})
                    .then(function (checks) {
                        $scope.checks = checks["@graph"];
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();