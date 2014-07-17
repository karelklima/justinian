(function() {
    angular.module('appControllers')
        .controller('ActRelatedDecisionsController', ['$scope', 'NetworkService', 'AppService', function ($scope, NetworkService, AppService) {

            $scope.decisions = undefined;
            $scope.predicate = '-issuedIso';
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
                return angular.isUndefined($scope.decisions);
            };

            $scope.isEmpty = function() {
                return angular.isDefined($scope.decisions) && $scope.decisions.length === 0;
            };

            this.update = function () {
                NetworkService.getData('court', 'act-related-decisions', {'resource': $scope.resource})
                    .then(function (decisions) {
                        $scope.decisions = decisions["@graph"];
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();