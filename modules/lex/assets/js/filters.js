/**
 * Created by Karel on 20. 5. 2014.
 */

(function(angular) {

    angular.module('appFilters')

    .filter('convertDate', function() {
        return function (date) {
            var chunks = date.split("-");
            if (chunks.length != 3)
                return date; // return original value by default
            else
                return [chunks[2], chunks[1], chunks[0]].join(".");
        }
    });

}(angular));