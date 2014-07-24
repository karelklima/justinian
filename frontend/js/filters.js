var appFilters;

appFilters = angular.module('appFilters', []);
appFilters.filter('decodeUnicode', function() {
        var decodeUnicodeStringRegex = /\\u([\d\w]{4})/gi;
        return function (encodedString) {
            return encodedString.replace(decodeUnicodeStringRegex, function (match, grp) {
                return String.fromCharCode(parseInt(grp, 16));
            });
        }
    });

appFilters.filter('formatDate', ['$filter', function($filter) {
    return function (date) {
        return $filter('date')(date, 'd. M. yyyy'); // TODO do konfigurace?
    }
}]);

appFilters.filter('formatZero', [function() {
    return function (number) {
        return (number == 0) ? "" : number; // it can be string "0" or number 0, do not use ===
    }
}]);

appFilters.filter('formatDash', function() {
    return function(text) {
        return text.replace(/\-/g,' ');
    }
});

appFilters.filter('startFrom', function() {
    return function(input, page, limit) {
        var start = (page-1)*limit;
        return angular.isDefined(input) ? input.slice(start) : [];
    }
});