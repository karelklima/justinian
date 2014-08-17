(function() {

    angular.module('appControllers')

        .controller('LexActDerogationsPassiveController', ['$scope', 'AppService', function($scope, AppService) {

            $scope.derogations = undefined;
            $scope.actIdentifier = undefined;
            $scope.actTitle = undefined;

            $scope.predicate = '';
            $scope.reverse = false;

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
                    AppService.getData($scope, 'lex', 'act-derogations-passive', params)
                        .then(function (checks) {
                            callback(angular.isArray(checks["@graph"]) ? checks["@graph"] : []);
                        }, function(error) {
                            callback([]);
                        });
                },
                revision: 0
            };

            this.update = function() {
                $scope.datasource.revision = $scope.datasource.revision + 1;

                if (AppService.isMainApplication("lex", "act-derogations-passive")) {
                    AppService.getData($scope, 'lex', 'act-detail', {'resource': $scope.resource})
                        .then(function(actDetail) {
                            if (angular.isArray(actDetail["@graph"])) {
                                $scope.actIdentifier = actDetail["@graph"][0]["identifier"];
                                $scope.actTitle = actDetail["@graph"][0]["title"];
                                AppService.setTitle("Předpis č. " + $scope.actIdentifier + " &ndash; derogace pasivní");
                            }
                        });
                }
            };

            AppService.init($scope, ['resource', 'version'], this.update);

        }])

})();