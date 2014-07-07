(function() {
    angular.module('appControllers')
        .controller('LexVersionsController', ['$scope', '$log', 'NetworkService', 'AppService', function ($scope, $log, NetworkService, AppService) {

//            $scope.resource = UrlService.getParam('resource');

            $scope.versions = undefined;
            $scope.property = 'title';
            $scope.reverse = false;

            $scope.sortBy = function (property) {
                if ($scope.property === property) {
                    $scope.reverse = !$scope.reverse;
                } else {
                    $scope.property = property;
                    $scope.reverse = false;
                }
            };

            $scope.isLoading = function() {
                return angular.isUndefined($scope.versions);
            };

            $scope.isEmpty = function() {
                return angular.isDefined($scope.versions) && $scope.versions.length === 0;
            };

            this.update = function () {
                $log.debug("LexVersionsController: update");
                NetworkService.getData('lex', 'act-versions', {'resource': $scope.resource})
                    .then(function (data) {
                        $scope.versions = data["@graph"];
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();
