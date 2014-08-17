(function() {

    angular.module('appControllers')

        .controller('LexActsFiltersController', ['$scope', '$filter', 'AppService', function($scope, $filter, AppService) {

            var filters = ['identifier', 'title', 'minDate', 'maxDate', 'query'];
            var advancedOptions = ['query'];

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
                    AppService.getData($scope, 'lex', 'acts-filters')
                        .then(function (filters) {
                            if (angular.isDefined(filters['@graph'][0])) {
                                $scope.filters = filters['@graph'][0];
                                $scope.filterMinDate = $scope.filters["minDateIso"];
                                $scope.filterMaxDate = $scope.filters["maxDateIso"];
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