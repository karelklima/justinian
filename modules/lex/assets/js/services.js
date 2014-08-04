(function () {

    angular.module('appServices')

        .service('LexUtilService', ['$filter', function ($filter) {

            /**
             * converts date from YYYY-MM-DD to d. M. yyyy
             * @param {string} date (YYYY-MM-DD)
             * @return {string}
             */
            this.convertDate = function (date) {
                return $filter('date')($filter('limitTo')(date, 10), 'd. M. yyyy');
            };

            /**
             * Formats day, month and year to d. M. yyyy
             * @param {Date} date (new Date(year, month, day))
             * @return {string}
             */
            this.formatDate = function (date) {
                return $filter('date')(date, 'd. M. yyyy');
            };

            /**
             * sorts array by attribute
             * @param {array} array [{..., 'attribute':[{"@value":"2014-02-17+02:00", ...}], ...}]
             * @param {string} attribute (eg. http://purl.org/dc/terms/date; http://purl.org/dc/terms/valid)
             * @param {boolean} reverse
             * @return {array}
             */
            this.orderByAttribute = function (array, attribute, reverse) {
                if (!angular.isDefined(reverse)) {
                    reverse = false;
                }
                var getValue = function (expression) {
                    return expression[attribute][0]["@value"]
                };
                return $filter('orderBy')(array, getValue, reverse);
            }

        }])

        .service('LexDiffService', function() {

            var self = this;

            this.diff = function (text1, text2){
                if(angular.isUndefined(text1) || angular.isUndefined(text2) || text1.length == 0 || text2.length == 0){
                    return undefined;
                } else {
                    var dmp = new diff_match_patch();
                    dmp.Diff_Timeout = 0;
                    dmp.Diff_EditCost = 4;
                    //console.log("Text 1: "+text1.length);
                    //console.log("Text 2: "+text2.length);
                    var d = dmp.diff_main(text1, text2);
                    dmp.diff_cleanupSemantic(d);
                    //console.log(d);
                    var result = "";
                    for(var i = 0; i< d.length; i++){
                        var item = d[i];
                        if(angular.isDefined(item[0]) && angular.isDefined(item[1]) && item[1].length>0){
                            if(item[0] == 0)
                                result+= item[1];
                            else if(item[0] == -1){
                                result+= self.colored(result, item[1], '#AA4139', 'remove');
                            } else if (item[0] == 1){
                                result+= self.colored(result, item[1], '#779D34', 'add');
                            }
                        }
                    }
                    return result;
                }
            };

            this.colored = function (previous, text, color, operation){
                var result = "";
                var textIndex = 0;

                var normalText = false;

                for(var i = previous.length -1; i>=0; i--){
                    if(previous[i] == '>'){
                        normalText = true;
                        break;
                    } else if(previous[i] == '<'){
                        for(textIndex = 0; textIndex<text.length;textIndex++){
                            if(text[textIndex]=='>'){
                                textIndex++;
                                normalText = true;
                                break;
                            } else if(operation == 'add' || normalText)
                                result+=text[textIndex];
                        }
                        break;
                    }
                }

                if(normalText)
                    result+='<font style="color:'+color+';">';

                for(; textIndex<text.length; textIndex++){
                    if(text[textIndex] == '>'){
                        if(operation == 'add')
                            result+='>';
                        if(!normalText)
                            result+='<font style="color:'+color+';">';
                        normalText = true;
                    } else if(text[textIndex] == '<'){
                        if(normalText)
                            result+='</font>';
                        if(operation == 'add')
                            result+='<';
                        normalText = false;
                    } else if(operation == 'add' || normalText)
                        result+=text[textIndex];
                }
                if(normalText)
                    result+='</font>';

                //console.log(result);
                return result;
            }
        });

})();