(function() {

    angular.module('appFilters')

        .filter('cleanConcept', function() {
            return function(text) {
                return text.replace(/(-[0-9] )|(-[0-9]$)/g, " ");
            }
        })

})();