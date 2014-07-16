(function() {
    angular.module('appControllers')
        .controller('LexDetailVersionController', ['$scope', '$sce', 'NetworkService', 'AppService', function ($scope, $sce, NetworkService, AppService) {

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
                if(angular.isUndefined($scope.actDetail) || $scope.actDetail["@id"] != $scope.resource){
                    $scope.actDetail = undefined;
                    NetworkService.getData('lex', 'act-detail', {'resource': $scope.resource})
                        .then(function (actDetail) {
                            if (actDetail["@graph"].length > 0)
                                $scope.actDetail = actDetail["@graph"][0];
                            else $scope.actDetail = {};
                        });
                }

                if(angular.isUndefined($scope.actText) || $scope.actText["@id"] != $scope.version){
                    $scope.actText = undefined;
                    NetworkService.getData('lex', 'act-text', {'resource': $scope.version})
                        .then(function (actText) {
                            if (actText["@graph"].length > 0)
                            {
                                var doc = angular.element("<div>" + actText["@graph"][0]["htmlValue"] + "</div>");
                                $scope.actText = $sce.trustAsHtml(doc.html());
                            }
                            else $scope.actText = "";
                        });
                }
            };

            AppService.init($scope, ['resource', 'version'], this.update);

        }]);

})();

