(function() {

    angular.module('appControllers')

        .controller('LexActDerogationsActiveController', ['$scope', 'AppService', function($scope, AppService) {

            $scope.derogations = undefined;
            $scope.actIdentifier = undefined;

            $scope.datasource = {
                get: function(offset, limit, callback) {
                    var params = {'limit': limit, 'offset': offset, 'resource': $scope.resource};
                    AppService.getData($scope, 'lex', 'act-derogations-active', params)
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

                if (AppService.isMainApplication("lex", "act-derogations-active")) {
                    AppService.getData($scope, 'lex', 'act-detail', {'resource': $scope.resource})
                        .then(function(actDetail) {
                            if (angular.isArray(actDetail["@graph"])) {
                                $scope.actIdentifier = actDetail["@graph"][0]["identifier"];
                                AppService.setTitle("Předpis č. " + $scope.actIdentifier + " &ndash; derogace aktivní");
                            }
                        });
                }
            };

            AppService.init($scope, ['resource'], this.update);

        }])

})();