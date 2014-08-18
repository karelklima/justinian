(function() {

    angular.module('appControllers')

        .controller('ConceptConceptsFiltersController', ['$scope', '$filter', 'AppService', function($scope, $filter, AppService) {

            var filters = ['label', 'definition', 'expression'];
            var advancedOptions = [];

            $scope.search = function() {
                var params = {};
                angular.forEach(filters, function(filter) {
                    if (angular.isDefined($scope[filter]) && $scope[filter] !== null && ($scope[filter].length > 0 || $scope[filter] === true)) {
                        params[filter] = $scope[filter];
                    }
                });
                AppService.setParams(params);
            };

            $scope.filtersLoaded = false;

            this.update = function() {

                if (!$scope.filtersLoaded) {
                    // load filters specification
                    AppService.getData($scope, 'concept', 'concepts-filters')
                        .then(function (conceptFilters) {
                            if (angular.isDefined(conceptFilters['@graph'][0])) {
                                $scope.filters = conceptFilters['@graph'][0];
                                console.log($scope.filters);
                                $scope.filtersLoaded = true;
                            }
                        });

                }

            };

            AppService.init($scope, filters, this.update);

        }]);

})();