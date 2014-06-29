/**
 * Created by Karel on 20. 5. 2014.
 */

appFilters.filter('convertDate', ['LexUtilService', function(LexUtilService) {
    return function (date) {
        return LexUtilService.convertDate(date);
    }
}]);

appFilters.filter('orderByDate', ['LexUtilService', function(LexUtilService) {
    return function (input, attribute, reverse) {
        return LexUtilService.orderByDate(input, attribute, reverse);
    }
}]);