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
        return $filter('date')(date, 'd. M. yyyy');
    }
}]);

appFilters.filter('formatZero', [function() {
    return function (number) {
        return (number === 0) ? "" : number;
    }
}]);

appFilters.filter('formatDash', function() {
    return function(text) {
        return text.split('-').join(' ');
    }
});