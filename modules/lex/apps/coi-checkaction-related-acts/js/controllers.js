(function() {
    angular.module('appControllers')
        .controller('CoiCheckactionsRelatedActsController', ['$scope', 'AppService', function ($scope, AppService) {

            $scope.acts = undefined;
            $scope.predicate = '-issuedIso';
            $scope.reverse = false;
            $scope.limit = 9;

            $scope.coiIdentifier = undefined;

            $scope.increase = function() {
                $scope.datasource.revision = $scope.datasource.revision + 1;
            };

            $scope.datasource = {
                get: function(offset, limit, callback) {

                    var params = {'limit': limit, 'offset': offset, 'resource': $scope.resource};
                    AppService.getData($scope, 'lex', 'coi-checkaction-related-acts', params)
                        .then(function (acts) {
                            callback(angular.isArray(acts["@graph"]) ? acts["@graph"] : []);
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
                return angular.isDefined($scope.acts) && $scope.acts.length === 0;
            };

            $scope.isShowMore = function() {
                return angular.isDefined($scope.acts) && $scope.acts.length > $scope.limit;
            };

            this.update = function () {
                $scope.increase();

                if (AppService.isMainApplication("lex", "coi-checkaction-related-acts")) {
                    AppService.getData($scope, 'coi', 'checkaction-detail', {'resource': $scope.resource})
                        .then(function(coiDetail) {
                            if (angular.isArray(coiDetail["@graph"])) {
                                $scope.coiIdentifier = coiDetail["@graph"][0]["title"];
                                AppService.setTitle("Zákony ke kontrole ČOI č. " + $scope.coiIdentifier);
                            }
                        });
                }
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();