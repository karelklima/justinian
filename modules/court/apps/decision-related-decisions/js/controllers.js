(function() {
    angular.module('appControllers')
        .controller('DecisionRelatedDecisionsController', ['$scope', 'NetworkService', 'AppService', function ($scope, NetworkService, AppService) {

            $scope.decisions = undefined;
            $scope.predicate = '-issuedIso';
            $scope.reverse = false;
            $scope.limit = 2;

            $scope.decisionIdentifier = undefined;

            $scope.increase = function() {
                $scope.datasource.revision = $scope.datasource.revision + 1;
            };

            $scope.datasource = {
                get: function(offset, limit, callback) {

                    var params = {'limit': limit, 'offset': offset, 'resource': $scope.resource};
                    AppService.getData($scope, 'court', 'decision-related-decisions', params)
                        .then(function (decisions) {
                            callback(angular.isArray(decisions["@graph"]) ? decisions["@graph"] : []);
                        }, function(error) {
                            callback([]);
                        });
                },
                revision: 0
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
                $scope.increase();

                if (AppService.isMainApplication("court", "decision-related-decisions")) {
                    AppService.getData($scope, 'court', 'decision-detail', {'resource': $scope.resource})
                        .then(function(decisionDetail) {
                            if (angular.isArray(decisionDetail["@graph"])) {
                                $scope.decisionIdentifier = decisionDetail["@graph"][0]["identifier"];
                                AppService.setTitle("Kontroly ČOI k předpisu č. " + $scope.decisionIdentifier);
                            }
                        });
                }
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();