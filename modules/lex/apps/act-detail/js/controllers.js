(function() {
    angular.module('appControllers')
        .controller('LexDetailController', ['$scope', '$sce', '$log', 'NetworkService', 'AppService', 'UrlService', function ($scope, $sce, $log, NetworkService, AppService, UrlService) {

            $scope.actDetail = undefined;
            $scope.actText = undefined;

            $scope.isLoading = function () {
                return angular.isUndefined($scope.actDetail);
            };

            $scope.isEmpty = function () {
                return angular.isDefined($scope.actDetail) && $scope.actDetail.length === 0;
            };

            $scope.isTextLoading = function () {
                return angular.isUndefined($scope.actText);
            };

            $scope.isTextEmpty = function () {
                return angular.isDefined($scope.actText) && $scope.actText.length === 0;
            };


            this.update = function () {
                $log.debug("LexDetailController.update: running update");
                if (!angular.isDefined($scope.version)) {
                    $log.debug("LexDetailController.update: retrieving latest act version");
                    NetworkService.getData('lex', 'act-detail', {resource: $scope.resource})
                        .then(function(actDetail) {
                            if (actDetail["@graph"].length > 0) {
                                var version = actDetail["@graph"][0]["lastVersion"];
                                UrlService.setParam("version", version, true);
                            }
                        });
                } else {
                    $log.debug("LexDetailController.update: retrieving act details");

                    NetworkService.getData('lex', 'act-detail', {'resource': $scope.resource})
                        .then(function (actDetail) {
                            if (actDetail["@graph"].length > 0)
                                $scope.actDetail = actDetail["@graph"][0];
                            else $scope.actDetail = {};
                        });
                    NetworkService.getData('lex', 'act-text', {'resource': $scope.resource})
                        .then(function (actText) {
                            if (actText["@graph"].length > 0) {
                                var doc = angular.element("<div>" + actText["@graph"][0]["htmlValue"] + "</div>");
                                $scope.actText = $sce.trustAsHtml(doc.html());
                            }
                            else $scope.actText = "";
                        });

                }
            };

            AppService.init($scope, ['resource', 'version', 'section'], this.update);

        }]);

})();

