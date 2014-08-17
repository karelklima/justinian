(function() {

    angular.module('appControllers')

        .controller('CourtDecisionsFiltersController', ['$scope', '$filter', 'AppService', function($scope, $filter, AppService) {

            var filters = ['creator', 'subject', 'minDate', 'maxDate', 'identifier','query', 'kind', 'category', 'hasText'];
            var advancedOptions = ['identifier', 'query', 'kind', 'category', 'hasText'];


            var dates = {
                "minDate" : "minDateRaw",
                "maxDate" : "maxDateRaw"
            };

            $scope.search = function() {
                var params = {};
                angular.forEach(filters, function(filter) {
                    if (angular.isDefined($scope[filter]) && $scope[filter] !== null && ($scope[filter].length > 0 || $scope[filter] === true)) {
                        params[filter] = $scope[filter];
                    }
                });
                AppService.setParams(params);
            };

            $scope.openMinDatePopupCalendar = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.popupMinDateIsOpen = true;
            };

            $scope.openMaxDatePopupCalendar = function($event) {
                $event.preventDefault();
                $event.stopPropagation();
                $scope.popupMaxDateIsOpen = true;
            };

            angular.forEach(dates, function(dateValue, stringValue) {
                $scope.$watch(dateValue, function(newDate) {
                    if (angular.isUndefined(newDate) || newDate === null)
                        $scope[stringValue] = undefined;
                    else
                        $scope[stringValue] = $filter('date')(newDate, "yyyy-MM-dd");
                });
            });

            $scope.filtersLoaded = false;

            this.update = function() {

                if (!$scope.filtersLoaded) {
                    // load filters specification
                    AppService.getData($scope, 'court', 'decisions-filters')
                        .then(function (decisionFilters) {
                            if (angular.isDefined(decisionFilters['@graph'][0])) {
                                $scope.filters = decisionFilters['@graph'][0];
                                $scope.filters['categories'].sort();
                                $scope.filterMinDate = new Date($scope.filters["minDateIso"]);
                                $scope.filterMaxDate = new Date($scope.filters["maxDateIso"]);
                                $scope.filtersLoaded = true;
                            }
                        });

                    // open advanced options if necessary
                    angular.forEach(advancedOptions, function(option) {
                        if (angular.isDefined($scope[option]) && $scope[option] !== null)
                            $scope.advancedOptionsIsOpen = true;
                    });
                }

                angular.forEach(dates, function(dateValue, stringValue) {
                    if (angular.isUndefined($scope[stringValue]))
                        $scope[dateValue] = null;
                    else
                        $scope[dateValue] = new Date($scope[stringValue]);
                });
            };

            AppService.init($scope, filters, this.update);

        }]);

})();