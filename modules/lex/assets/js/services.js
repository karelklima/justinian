
(function(angular) {

    var appServices = angular.module('appServices');

    appServices.service('LexUtilService', ['$filter', function ($filter) {

        /**
         * converts date from YYYY-MM-DD to DD.MM.YYYY
         * @param {string} date (YYYY-MM-DD)
         * @return {string}
         */
        this.convertDate = function(date)
        {
            // we cannot use Date object as it only works for post 1970 dates
            var chunks = date.split("-");
            if (chunks.length != 3)
                return date; // return original value by default
            else
                return this.formatDate(chunks[2], chunks[1], chunks[0]);
        };

        /**
         * Formats day, month and year to one string
         * @param {string} day
         * @param {string} month
         * @param {string} year
         * @return {string}
         */
        this.formatDate = function(day, month, year)
        {
            return [day, month, year].join(".");
        }

    }]);


}(angular));