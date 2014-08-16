(function() {
    angular.module('appControllers')
        .controller('ActRelatedCoiChecksController', ['$scope', 'NetworkService', 'UrlService', 'AppService', function ($scope, NetworkService, UrlService, AppService) {

            $scope.checks = undefined;
            $scope.predicate = '-dateIso';
            $scope.reverse = false;
            $scope.limit = 9;

            $scope.actIdentifier = undefined;

            $scope.increase = function() {
                $scope.datasource.revision = $scope.datasource.revision + 1;
            };

            $scope.datasource = {
                get: function(offset, limit, callback) {

                    var params = {'limit': limit, 'offset': offset, 'resource': $scope.resource};
                    AppService.getData($scope, 'coi', 'act-related-coichecks', params)
                        .then(function (checks) {
                            callback(angular.isArray(checks["@graph"]) ? checks["@graph"] : []);
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
                return angular.isDefined($scope.checks) && $scope.checks.length === 0;
            };

            $scope.isShowMore = function() {
                return angular.isDefined($scope.checks) && $scope.checks.length > $scope.limit;
            };

            this.update = function (changes) {
                $scope.increase();

                if (AppService.isMainApplication("coi", "act-related-coichecks")) {
                    AppService.getData($scope, 'lex', 'act-detail', {'resource': $scope.resource})
                        .then(function(actDetail) {
                            if (angular.isArray(actDetail["@graph"])) {
                                $scope.actIdentifier = actDetail["@graph"][0]["identifier"];
                                AppService.setTitle("Kontroly ČOI k předpisu č. " + $scope.actIdentifier);
                            }
                        });
                }
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();