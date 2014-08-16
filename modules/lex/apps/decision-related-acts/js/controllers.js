(function() {
    angular.module('appControllers')
        .controller('DecisionRelatedActsController', ['$scope', 'NetworkService', 'AppService', function ($scope, NetworkService, AppService) {

            $scope.acts = undefined;
            $scope.predicate = '-issuedIso';
            $scope.reverse = false;
            $scope.limit = 2;

            $scope.decisionIdentifier = undefined;

            $scope.increase = function() {
                $scope.datasource.revision = $scope.datasource.revision + 1;
            };

            $scope.sortBy = function (predicate) {
                if ($scope.predicate === predicate) {
                    $scope.reverse = !$scope.reverse;
                } else {
                    $scope.predicate = predicate;
                    $scope.reverse = false;
                }
            };

            $scope.datasource = {
                get: function(offset, limit, callback) {

                    var params = {'limit': limit, 'offset': offset, 'resource': $scope.resource};
                    AppService.getData($scope, 'lex', 'decision-related-acts', params)
                        .then(function (acts) {
                            callback(angular.isArray(acts["@graph"]) ? acts["@graph"] : []);
                        }, function(error) {
                            callback([]);
                        });
                },
                revision: 0
            };

            $scope.isEmpty = function() {
                return angular.isDefined($scope.acts) && $scope.acts.length === 0;
            };

            $scope.isShowMore = function() {
                return angular.isDefined($scope.acts) && $scope.acts.length > $scope.limit;
            };

            this.update = function () {
                $scope.increase();

                if (AppService.isMainApplication("lex", "decision-related-acts")) {
                    AppService.getData($scope, 'court', 'decision-detail', {'resource': $scope.resource})
                        .then(function(decisionDetail) {
                            if (angular.isArray(decisionDetail["@graph"])) {
                                $scope.decisionIdentifier = decisionDetail["@graph"][0]["title"];
                                AppService.setTitle("Zákony k judikátu č. " + $scope.decisionIdentifier);
                            }
                        });
                }
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();