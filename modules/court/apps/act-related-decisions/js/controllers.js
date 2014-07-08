(function() {
    angular.module('appControllers')
        .controller('ActRelatedDecisionsController', ['$scope', 'NetworkService', 'AppService', function ($scope, NetworkService, AppService) {

//            $scope.resource = UrlService.getParam('resource');

            $scope.decisions = undefined;
            $scope.property = 'title';
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
                return angular.isUndefined($scope.decisions);
            };

            $scope.isEmpty = function() {
                return angular.isDefined($scope.decisions) && $scope.decisions.length === 0;
            };

            this.update = function () {
                NetworkService.getData('court', 'act-related-decisions', {'resource': $scope.resource})
                    .then(function (decisions) {
                        if ("@graph" in decisions) {
                            $scope.decisions = decisions["@graph"];
                        }else {
                            $scope.decisions = []
                            $scope.decisions.push(decisions);
                        }
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();