(function() {

    angular.module('appControllers')

        .controller('ConceptConceptAnnotationPopOverController', ['$scope', 'AppService', function($scope, AppService) {

            $scope.conceptLabel = undefined;

            AppService.getData($scope, 'concept', 'concept-annotation', { resource: $scope.resource })
                .then(function(data) {
                    if (data["@graph"].length > 0)
                    {
                        $scope.conceptLabel = data["@graph"][0]["hasLabel"];
                    }
                    else {
                        $scope.conceptLabel = null;
                    }
                });


        }])

        .controller('ConceptConceptAnnotationMainController', ['$scope', 'AppService', function($scope, AppService) {

            $scope.isEmpty = false;

            this.update = function() {
                AppService.getData($scope, 'concept', 'concept-annotation', { resource: $scope.resource })
                    .then(function (data) {
                        if (data["@graph"].length > 0) {
                            var urlParams = {
                                module: "concept",
                                application: "concept-detail",
                                resource: data["@graph"][0]["hasConcept"]
                            };

                            AppService.setUrl(urlParams, true);
                        }
                        else {
                            $scope.isEmpty = true;
                        }
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();