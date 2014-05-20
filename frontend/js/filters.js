(function(angular) {

    angular.module('appFilters', [])

    .filter('decodeUnicode', function() {
            var decodeUnicodeStringRegex = /\\u([\d\w]{4})/gi;
            return function (encodedString) {
                return encodedString.replace(decodeUnicodeStringRegex, function (match, grp) {
                    return String.fromCharCode(parseInt(grp, 16));
                });
            }
        });

}(angular));