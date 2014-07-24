(function() {
    angular.module('appControllers')
        .controller('LexVersionsController', ['$scope', '$log', 'NetworkService', 'AppService','UrlService', function ($scope, $log, NetworkService, AppService, UrlService) {

            $scope.versions = undefined;
            $scope.predicate = '-validIso';
            $scope.reverse = false;

            $scope.sortBy = function (predicate) {
                if ($scope.predicate === predicate) {
                    $scope.reverse = !$scope.reverse;
                } else {
                    $scope.predicate = predicate;
                    $scope.reverse = false;
                }
            };

            $scope.isLoading = function() {
                return angular.isUndefined($scope.versions);
            };

            $scope.isEmpty = function() {
                return angular.isDefined($scope.versions) && $scope.versions.length === 0;
            };

            this.update = function (changes) {
                if(angular.isDefined(changes['resource'])){
                    NetworkService.getData('lex', 'act-versions', {'resource': $scope.resource})
                        .then(function (data) {
                            console.log(data);
                            $scope.versions = data["@graph"];
                        });
                }
            };

            AppService.init($scope, ['resource','version'], this.update);

        }]);

})();
