(function() {

    angular.module('appControllers')

        .controller("ConceptConceptDetailController", ['$scope', 'AppService', function($scope, AppService) {

            $scope.conceptDetail = undefined;

            $scope.isEmpty = function() {
                return angular.isDefined($scope.conceptDetail) && $scope.conceptDetail === null;
            };

            this.update = function() {

                AppService.getData($scope, 'concept', 'concept-detail', {resource: $scope.resource})
                    .then(function(data) {

                        if (angular.isDefined(data["@graph"][0])) {
                            $scope.conceptDetail = data["@graph"][0];
                            AppService.setTitle("Právní pojem " + data["@graph"][0]["label"]);
                        } else {
                            $scope.conceptDetail = null;
                        }

                    });

            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();