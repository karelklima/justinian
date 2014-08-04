(function() {
    angular.module('appControllers')
        .controller('ActRelatedCoiChecksController', ['$scope', 'NetworkService', 'UrlService', 'AppService', function ($scope, NetworkService, UrlService, AppService) {

            $scope.checks = undefined;
            $scope.predicate = '-dateIso';
            $scope.reverse = false;

            // TODO remove me
            /*$scope.page = 1;
            $scope.limit = 5;
            $scope.size = 5;*/

            $scope.sortBy = function (predicate) {
                if ($scope.predicate === predicate) {
                    $scope.reverse = !$scope.reverse;
                } else {
                    $scope.predicate = predicate;
                    $scope.reverse = false;
                }
            };

            $scope.isEmpty = function() {
                return angular.isDefined($scope.checks) && $scope.checks.length === 0;
            };

            this.update = function () {
                AppService.getData($scope, 'coi', 'act-related-coichecks', {'resource': $scope.resource})
                    .then(function (checks) {
                        $scope.checks = checks["@graph"];
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();