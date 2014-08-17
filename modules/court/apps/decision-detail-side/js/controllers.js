(function() {
    angular.module('appControllers')
        .controller('CourtDecisionDetailSidebarController', ['$scope', '$sce', 'NetworkService', 'AppService', function ($scope, $sce, NetworkService, AppService) {

            $scope.decisionDetail = undefined;

            $scope.isEmpty = function() {
                return angular.isDefined($scope.decisionDetail) && $scope.decisionDetail.length == 0;
            };

            this.update = function () {
                $scope.decisionDetail = undefined;
                AppService.getData($scope, 'court', 'decision-detail', {'resource': $scope.resource})
                    .then(function (decisionDetail) {
                        if(angular.isDefined(decisionDetail['@graph']) && decisionDetail['@graph'].length>0){
                            $scope.decisionDetail = decisionDetail['@graph'][0];
                        } else {
                           $scope.decisionDetail = {};
                        }
                    }, function fail(){
                           $scope.decisionDetail = {};
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();