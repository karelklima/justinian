(function() {
    angular.module('appControllers')
        .controller('ActSectionRelatedDecisionsController', ['$scope', 'AppService', function ($scope, AppService) {

            $scope.decisions = undefined;
            $scope.predicate = '-issuedIso';
            $scope.reverse = false;
            $scope.limit = 9;

            $scope.actIdentifier = undefined;
            $scope.actSectionIdentifier = undefined;

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

                if (AppService.isMainApplication("court", "act-section-related-decisions")) {
                    AppService.getData($scope, 'lex', 'act-section-detail', {'resource': $scope.resource})
                        .then(function(actDetail) {
                            if (angular.isArray(actDetail["@graph"])) {
                                $scope.actIdentifier = actDetail["@graph"][0]["title"];
                                $scope.actSectionIdentifier = actDetail["@graph"][0]["act"][0]["actId"];
                                AppService.setTitle("Judikáty k předpisu " + $scope.actSectionIdentifier + ", "+ $scope.actIdentifier);
                            }
                        });
                }
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();