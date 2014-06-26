appServices.service('LexUtilService', ['$filter', function ($filter) {

        /**
         * converts date from YYYY-MM-DD to DD.MM.YYYY
         * @param {string} date (YYYY-MM-DD)
         * @return {string}
         */
        this.convertDate = function(date)
        {
            return $filter('date')($filter('limitTo')(date, 10), 'd. M. yyyy');
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
            return this.convertDate([year, month, day].join("-"));
        }

    }]);