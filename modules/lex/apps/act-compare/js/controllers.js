(function() {
    angular.module('appControllers')
        .controller('LexActCompareController', ['$scope', '$sce', '$q', 'NetworkService', 'AppService', 'LexDiffService', function ($scope, $sce, $q, NetworkService, AppService, LexDiffService) {

            $scope.actDetail = undefined;
            $scope.actText = undefined;

            $scope.isError = false;

            var self = this;

            $scope.isEmpty = function () {
                return angular.isDefined($scope.actDetail) && $scope.actDetail.length === 0;
            };

            $scope.isTextLoading = function () {
                return angular.isUndefined($scope.actText);
            };

            $scope.isTextEmpty = function () {
                return (angular.isDefined($scope.actText) && $scope.actText.length === 0);
            };

            this.update = function (changes) {

                if (angular.isUndefined($scope.resource) || angular.isUndefined($scope.version) || angular.isUndefined($scope.compare)) {
                    AppService.pageNotFound();
                    return;
                }

                if (angular.isDefined(changes.resource) || angular.isDefined(changes.version) || angular.isDefined(changes.compare)) {

                    AppService.getData($scope, 'lex', 'act-detail', {'resource': $scope.resource})
                        .then(function (actDetail) {
                            if (actDetail["@graph"].length > 0)
                                $scope.actDetail = actDetail["@graph"][0];
                            else $scope.actDetail = {};
                        });

                    $scope.actText = undefined;

                    var promiseVersion = AppService.getData($scope, 'lex', 'act-text', {'resource': $scope.version});
                    var promiseCompare = AppService.getData($scope, 'lex', 'act-text', {'resource': $scope.compare});

                    $q.all([promiseVersion, promiseCompare])
                        .then(function(results) {
                            $scope.isError = false;
                            var newer = results[0]["@graph"][0]["htmlValue"];
                            var older = results[1]["@graph"][0]["htmlValue"];
                            $scope.actText = LexDiffService.diff(older, newer);
                            if (!$scope.isEmpty() && angular.isDefined(changes.section)) {
                                $scope.$broadcast('anchor-scroll', {target: 'section[resource="' + $scope.section + '"]'});
                            }
                        })
                        .catch(function() {
                            $scope.isError = true;
                            $scope.actText = "";
                        });
                }
                if (!$scope.isEmpty() && angular.isDefined(changes.section)) {
                    $scope.$broadcast('anchor-scroll', {target: 'section[resource="' + $scope.section + '"]'});
                }
            };

            AppService.init($scope, ['resource', 'version', 'compare', 'section'], this.update);

        }]);

})();

