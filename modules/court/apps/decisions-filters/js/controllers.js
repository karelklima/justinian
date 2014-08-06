(function() {

    angular.module('appControllers')

        .controller('CourtDecisionsFiltersController', ['$scope', 'AppService', function($scope, AppService) {

            var filters = ['creator', 'subject'];

            $scope.search = function() {
                var params = {};
                angular.forEach(filters, function(filter) {
                    if (angular.isDefined($scope[filter]) && $scope[filter].length > 0) {
                        params[filter] = $scope[filter];
                    }
                });
                AppService.setParams(params);
            };

            $scope.filtersLoaded = false;

            this.update = function() {
                AppService.getData($scope, 'court', 'decisions-filters')
                    .then(function(decisionFilters) {
                        if (angular.isDefined(decisionFilters['@graph'][0])) {
                            $scope.filters = decisionFilters['@graph'][0];
                            $scope.filtersLoaded = true;
                        }
                    });
            };

            AppService.init($scope, filters, this.update);

        }]);

})();