(function() {
    angular.module('appControllers')
        .controller('CourtDecisionDetailController', ['$scope', 'NetworkService', 'AppService', function ($scope, NetworkService, AppService) {

//            $scope.resource = UrlService.getParam('resource');

            $scope.decisionDetail = undefined;

            $scope.isLoading = function() {
                return angular.isUndefined($scope.decisionDetail);
            };

            $scope.isEmpty = function() {
                return angular.isDefined($scope.decisionDetail) && $scope.decisionDetail.length === 0;
            };

            this.update = function () {
                NetworkService.getData('court', 'decision-detail', {'resource': $scope.resource})
                    .then(function (decisionDetail) {
                        $scope.decisionDetail = decisionDetail;
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();