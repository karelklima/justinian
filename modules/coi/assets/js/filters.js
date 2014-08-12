(function() {
    angular.module('appFilters')
        .filter('abbreviateRegion', ['CoiUtilService', function(CoiUtilService) {
            return function (region) {
                return CoiUtilService.abbreviateRegion(region);
            }
        }]);
})();