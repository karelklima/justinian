appFilters.filter('convertDate', ['LexUtilService', function(LexUtilService) {
    return function (date) {
        return LexUtilService.convertDate(date);
    }
}]);

appFilters.filter('orderByAttribute', ['LexUtilService', function(LexUtilService) {
    return function (array, attribute, reverse) {
        return LexUtilService.orderByAttribute(array, attribute, reverse);
    }
}]);