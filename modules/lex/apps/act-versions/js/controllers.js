(function() {
    angular.module('appControllers')
        .controller('LexVersionsController', ['$scope', '$log', 'NetworkService', 'AppService','UrlService','PageService', function ($scope, $log, NetworkService, AppService, UrlService, PageService) {

            if(PageService.getModule()=='lex' && PageService.getApplication()=='act-compare')
                $scope.isOpen = true;

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

            $scope.isEmpty = function() {
                return angular.isDefined($scope.versions) && $scope.versions.length === 0;
            };

            this.update = function (changes) {
                if(angular.isDefined(changes['resource'])){
                    AppService.getData($scope, 'lex', 'act-versions', {'resource': $scope.resource})
                        .then(function (data) {
                            var versions = data["@graph"];
                            versions.sort(function(v1, v2) {
                                return (new Date(v1["validIso"])) - (new Date(v2["validIso"]));
                            });
                            var counter = 0;
                            angular.forEach(versions, function(version) {
                                version["number"] = counter;
                                counter++;
                            });
                            $scope.versions = data["@graph"];
                        });
                }
            };

            AppService.init($scope, ['resource','version','compare'], this.update);

        }]);

})();
