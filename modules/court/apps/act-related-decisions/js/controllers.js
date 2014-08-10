(function() {
    angular.module('appControllers')
        .controller('ActRelatedDecisionsController', ['$scope', 'NetworkService', 'AppService', function ($scope, NetworkService, AppService) {

            $scope.decisions = undefined;
            $scope.predicate = '-issuedIso';
            $scope.reverse = false;
            $scope.limit = 9;

            $scope.increase = function() {
                $scope.datasource.revision = $scope.datasource.revision + 1;
            };

            $scope.datasource = {
                get: function(offset, limit, callback) {

                    var params = {'limit': limit, 'offset': offset, 'resource': $scope.resource};

                    AppService.getData($scope, 'court', 'act-related-decisions', params)
                        .then(function (decisions) {
                            callback(angular.isArray(decisions["@graph"]) ? decisions["@graph"] : []);
                        }, function(error) {
                            callback([]);
                        });
                }
            };

            $scope.sortBy = function (predicate) {
                if ($scope.predicate === predicate) {
                    $scope.reverse = !$scope.reverse;
                } else {
                    $scope.predicate = predicate;
                    $scope.reverse = false;
                }
            };

            $scope.isEmpty = function() {
                return angular.isDefined($scope.decisions) && $scope.decisions.length === 0;
            };

            $scope.isShowMore = function() {
                return angular.isDefined($scope.decisions) && $scope.decisions.length > $scope.limit;
            };

            this.update = function () {
                AppService.getData($scope, 'court', 'act-related-decisions', {'resource': $scope.resource})
                    .then(function (decisions) {
                        $scope.decisions = decisions["@graph"];
                    });
                $scope.increase();
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();