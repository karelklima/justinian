(function() {
    angular.module('appControllers')
        .controller('DecisionRelatedActsController', ['$scope', 'NetworkService', 'AppService', function ($scope, NetworkService, AppService) {

            $scope.acts = undefined;
            $scope.reverse = false;

            $scope.page = 1;
            $scope.limit = 2;
            $scope.size = 5;

            $scope.sortBy = function (predicate) {
                if ($scope.predicate === predicate) {
                    $scope.reverse = !$scope.reverse;
                } else {
                    $scope.predicate = predicate;
                    $scope.reverse = false;
                }
            };

            $scope.isEmpty = function() {
                return angular.isDefined($scope.acts) && $scope.acts.length === 0;
            };

            $scope.isShowPagination = function() {
                return angular.isDefined($scope.acts) && $scope.acts.length > $scope.limit;
            };

            this.update = function () {
                AppService.getData($scope, 'lex', 'decision-related-acts', {'resource': $scope.resource})
                    .then(function (acts) {
                        $scope.acts = acts["@graph"];
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();