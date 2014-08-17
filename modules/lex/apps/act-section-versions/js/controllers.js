(function() {
    angular.module('appControllers')
        .controller('LexSectionVersionsController', ['$scope', '$log', 'NetworkService', 'AppService','UrlService','PageService', function ($scope, $log, NetworkService, AppService, UrlService, PageService) {

            $scope.versions = undefined;
            $scope.predicate = '-number';
            $scope.reverse = false;

            $scope.sortBy = function (predicate) {
                if ($scope.predicate === predicate) {
                    $scope.reverse = !$scope.reverse;
                } else {
                    $scope.predicate = predicate;
                    $scope.reverse = false;
                }
            };

            $scope.limit = 10;
            $scope.toggleLimit = function() {
                $scope.limit = ($scope.limit == 10) ? 100 : 10;
            };

            $scope.isEmpty = function() {
                return angular.isDefined($scope.versions) && $scope.versions.length === 0;
            };

            $scope.getVersionValidIso = function(versionId) {
                var valid = undefined;
                angular.forEach($scope.versions, function(version) {
                    if (version['@id'] == versionId)
                        valid = version['validIso'];
                });
                return valid;
            };

            this.update = function (changes) {
                if(angular.isDefined(changes['resource'])){
                    AppService.getData($scope, 'lex', 'act-section-versions', {'resource': $scope.resource, 'limit': 100})
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
                            $scope.versions = versions;
                        });

                    AppService.getData($scope, 'lex', 'act-section-detail', {'resource': $scope.resource})
                        .then(function (data) {
                            $scope.actResource = data["@graph"][0]["act"][0]["@id"];
                            $scope.actSection = data["@graph"][0]["@id"].substring($scope.actResource.length + 1);
                            $scope.actVersion = data["@graph"][0]["expression"].substring(0,data["@graph"][0]["expression"].length - $scope.actSection.length - 1);
                        });
                }
            };

            AppService.init($scope, ['resource','version','compare'], this.update);

        }]);

})();
