/**
 * Created by Karel on 20. 5. 2014.
 */

appFilters.filter('convertDate', ['LexUtilService', function(LexUtilService) {
    return function (date) {
        return LexUtilService.convertDate(date);
    }
}]);

appFilters.filter('formatDate', ['$filter', function($filter) {
    return function (date) {
        return $filter('date')(date, 'd. M. yyyy');
    }
}]);

appFilters.filter('formatZero', [function() {
    return function (number) {
        return (number === 0) ? "" : number;
    }
}]);

appFilters.filter('orderByAttribute', ['LexUtilService', function(LexUtilService) {
    return function (array, attribute, reverse) {
        return LexUtilService.orderByAttribute(array, attribute, reverse);
    }
}]);