appServices.service('LexUtilService', ['$filter', function ($filter) {

    /**
     * converts date from YYYY-MM-DD to d. M. yyyy
     * @param {string} date (YYYY-MM-DD)
     * @return {string}
     */
    this.convertDate = function(date)
    {
        return $filter('date')($filter('limitTo')(date, 10), 'd. M. yyyy');
    };

    /**
     * Formats day, month and year to d. M. yyyy
     * @param {Date} date (new Date(year, month, day))
     * @return {string}
     */
    this.formatDate = function(date)
    {
        return $filter('date')(date, 'd. M. yyyy');
    }

    /**
     * sorts array by attribute
     * @param {array} array [{..., 'attribute':[{"@value":"2014-02-17+02:00", ...}], ...}]
     * @param {string} attribute (eg. http://purl.org/dc/terms/date; http://purl.org/dc/terms/valid)
     * @param {boolean} reverse
     * @return {array}
     */
    this.orderByAttribute = function (array, attribute, reverse) {
        if (!angular.isDefined(reverse)) { reverse = false; }
        var getValue = function(expression) { return expression[attribute][0]["@value"] };
        return $filter('orderBy')(array, getValue, reverse);
     }

}]);