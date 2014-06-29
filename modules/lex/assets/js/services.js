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

        /**
         * sorts json object by date
         * @param {json: {..., "attribute":[{"@value":"2014-02-17+02:00",...}], ... } input
         * @param {string} attribute (eg. http://purl.org/dc/terms/date; http://purl.org/dc/terms/valid)
         * @param {string} reverse
         * @return {array}
         */
        this.orderByDate = function (input, attribute, reverse) { 
        	if (!angular.isObject(input)) return input;
        	
        	var array = [];
            for(var objectKey in input) {
                array.push(input[objectKey]);
            }

            array.sort(function(a, b){
            	  var adate = a[attribute][0]["@value"],
            	      bdate= b[attribute][0]["@value"];
            	  if (reverse == 'reverse') {
            		  return adate < bdate ? 1 : adate > bdate ? -1 : 0;
            	  } 
            	  else {
            		  return adate > bdate ? 1 : adate < bdate ? -1 : 0;
            	  }
            });
            
            return array;
         }
        
    }]);