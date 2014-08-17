(function() {
    angular.module('appControllers')
        .controller('LexActCompareController', ['$rootScope','$scope', '$sce', '$q', 'NetworkService', 'AppService', 'LexDiffService', function ($rootScope,$scope, $sce, $q, NetworkService, AppService, LexDiffService) {

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
                            if (actDetail["@graph"].length > 0){
                                $scope.actDetail = actDetail["@graph"][0];
                                AppService.setTitle("Předpis č. " + $scope.actDetail["identifier"]);
                            }
                            else {
                                $scope.actDetail = {};
                                AppService.setTitle("Předpis nenalezen");
                            }
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
                            self.updateScroll(changes);
                            $rootScope.$emit("$LexActCompareFinished", $scope.actText);
                        })
                        .catch(function() {
                            $scope.isError = true;
                            $scope.actText = "";
                        });
                }

                self.updateScroll(changes);
            };

            this.updateScroll = function(changes){
                if (!$scope.isEmpty() && angular.isDefined(changes.section)) {
                    $scope.$broadcast('anchor-scroll', {target: 'section[resource="' + $scope.section + '"]'});
                }
                if(!$scope.isEmpty() && angular.isDefined(changes.diffindex)){
                    var doc = $(".lex-act-text");
                    var changes = doc.find(".diff_remove, .diff_add");
                    console.log(changes);
                    for(var i =0;i<changes.length;i++){
                        var item = angular.element(changes[i]);
                        if(i == $scope.diffindex){
                            $scope.$broadcast('anchor-scroll', {target: item});
                            break;
                        }
                    }
                }
            }

            AppService.init($scope, ['resource', 'version', 'compare', 'section', 'diffindex'], this.update);

        }]);

})();

