(function() {
    angular.module('appControllers')
        .controller('CourtDecisionsController', ['$scope', 'NetworkService', 'UrlService', 'AppService', function ($scope, NetworkService, UrlService, AppService) {

//            $scope.resource = UrlService.getParam('resource');

            $scope.decisions = [];
            $scope.courtDecisionsLimit = "10";
            $scope.courtDecisionsOffset = 0;

            this.update = function () {
                NetworkService.getData('court', 'decisions', {'limit': $scope.courtDecisionsLimit, 'offset': $scope.courtDecisionsOffset})
                    .then(function (decisions) {
                        $scope.decisions = angular.isArray(decisions["@graph"]) ? decisions["@graph"] : [];
                        $scope.support = angular.isArray(decisions["@support"]) ? decisions["@support"] : [];
                    });
            };

            AppService.init($scope, ['court-decisions-offset', 'court-decisions-limit'], this.update);

        }]);

})();