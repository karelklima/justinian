(function () {
    angular.module('appFilters')

        .filter('formatDate', ['$filter', function ($filter) {
            return function (date) {
                return $filter('date')(date, 'd. M. yyyy'); // TODO do konfigurace?
            }
        }])

        .filter('formatZero', [function () {
            return function (number) {
                return (number == 0) ? "" : number; // it can be string "0" or number 0, do not use ===
            }
        }])

        .filter('formatDash', function () {
            return function (text) {
                return text.replace(/\-/g, ' ');
            }
        })

        .filter('select', function () {
            return function (input, page, limit) {
                var start = (page - 1) * limit;
                var end = page * limit;
                return angular.isDefined(input) ? input.slice(start, end) : undefined;
            }
        })

        .filter('join', function() {
            return function(input, joinString) {
                joinString = angular.isDefined(joinString) ? joinString : ", ";
                return angular.isArray(input) ? input.join(joinString) : input;
            }
        })
})();
