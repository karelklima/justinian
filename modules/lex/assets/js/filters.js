/**
 * Created by Karel on 20. 5. 2014.
 */

(function(angular) {

    angular.module('appFilters', [
        'appServices'
    ])

    .filter('convertDate', ['LexUtilService', function(LexUtilService) {
        return function (date) {
            return LexUtilService.convertDate(date);
        }
    }]);

}(angular));