(function () {
    angular.module('appFilters')

        /**
        * Format date to template d. M. yyyy
        * @param date
        * @return Date in format d. M. yyyy
        */
        .filter('formatDate', ['$filter', function ($filter) {
            return function (date) {
                return $filter('date')(date, 'd. M. yyyy'); // TODO do konfigurace?
            }
        }])

        /**
        * If number is zero, it returns emptry string, otherwise input number.
        * @param {(string|number)} number - Number
        * @return {(string|number)} - Input number or emptry string
        */
        .filter('formatZero', [function () {
            return function (number) {
                return (number == 0) ? "" : number; // it can be string "0" or number 0, do not use ===
            }
        }])

        /**
        * Replace dashes by whitespace in input string
        * @param {string} Text
        * @return {string} Text without dashes
        */
        .filter('formatDash', function () {
            return function (text) {
                return text.replace(/\-/g, ' ');
            }
        })

        /**
        * Select items from input array for selected page
        * @param {array} input - All items
        * @param {number} page - Page index, it is started from 1.
        * @param {number} limit - Items per page.
        * @return {array} - Selected items
        */
        .filter('select', function () {
            return function (input, page, limit) {
                var start = (page - 1) * limit;
                var end = page * limit;
                return angular.isDefined(input) ? input.slice(start, end) : undefined;
            }
        })

        /**
        * Join all elements from input to one string
        * @param {array} input - Input elements
        * @param {string} [joinString=", "] - Join template
        * @return {string} - One string
        */
        .filter('join', function() {
            return function(input, joinString) {
                joinString = angular.isDefined(joinString) ? joinString : ", ";
                return angular.isArray(input) ? input.join(joinString) : input;
            }
        })
})();
