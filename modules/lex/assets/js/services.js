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

            var DIFF_EQUAL = 0;
            var DIFF_REMOVE = -1;
            var DIFF_ADD = 1;

            var DIFF_ITEM_TEXT = 1;
            var DIFF_ITEM_OPERATION = 0;
            var DIFF_ITEM_ISTAG = 2;

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

                    d = self.diff_mergeSequences(d, false);
                    d = self.diff_mergeTags(d); //merge tags
                    d = self.diff_mergeTags(d); //merge tags into one item
                    d = self.diff_mergeWords(d); //merge words
                    d = self.diff_mergeTags(d); //merge tags into one item
                    d = self.diff_mergeBlocks(d); //repositioning diff_remove blocks

                    d = self.diff_mergeTags(d); //merge tags into one item
                    d = self.diff_mergeBlocks(d); //merge diff_remove blocks

                    d = self.diff_mergeSequences(d, true); //repositioning
                    d = self.diff_mergeTags(d); //merge tags into one item
                    d = self.diff_mergeBlocks(d); //repositioning diff_remove blocks
                    d = self.diff_mergeTags(d); //merge tags into one item
                    d = self.diff_mergeBlocks(d); //merge diff_remove blocks
//                    d = self.diff_mergeWords(d); //merge words
//                    d = self.diff_mergeTags(d); //merge tags into one item
//                    d = self.diff_mergeBlocks(d); //merge diff_remove blocks

                    var result = "";

                    for(var i = 0;i<d.length;i++){
                        var item = d[i];
//                        console.log(item.concat(self.tagLevel(item[DIFF_ITEM_TEXT])));
                        if(self.isCompleteTagBlock(item[DIFF_ITEM_TEXT])){
                            if(item[DIFF_ITEM_OPERATION] == DIFF_EQUAL)
                                result+=item[DIFF_ITEM_TEXT];
                            else if(item[DIFF_ITEM_OPERATION] == DIFF_REMOVE)
                                result+='<span class="diff_remove">'+item[DIFF_ITEM_TEXT]+' </span>';
                            else if(item[DIFF_ITEM_OPERATION] == DIFF_ADD)
                                result+='<span class="diff_add">'+item[DIFF_ITEM_TEXT]+' </span>';
                        } else if(item[DIFF_ITEM_OPERATION] != DIFF_REMOVE){
//                            console.log("^ is not complete");
                            result += item[DIFF_ITEM_TEXT];
                        } else {
//                            console.log("^ diff_remove");
                        }
                    }
                    $().cssParentSelector();
                    return result;
                }
            };

            this.diff_section = function (section1, section2){

            }

            this.removeNonVisibleChars = function(text){
                text = text.replace(/(\r\n|\n|\r)/gm,"");
                text = text.replace(/\s+/g," ");
                return text;
            }

            this.diff_addItem = function(diff, text, operation, isTag){
                if(angular.isDefined(text) && text.length>0)
                    text = self.removeNonVisibleChars(text);

                if(angular.isUndefined(diff) || angular.isUndefined(text) || text.length == 0) return;
                if(operation!=DIFF_EQUAL && operation!=DIFF_ADD && operation!=DIFF_REMOVE) return;
                if(isTag !== true && isTag !== false) return;

                var diff_last_object = diff.length>0 ? diff[diff.length-1] : undefined;
                if(diff_last_object!==undefined &&
                    diff_last_object[DIFF_ITEM_OPERATION]==operation &&
                    diff_last_object[DIFF_ITEM_ISTAG] == false && isTag==false)
                {
                    diff_last_object[DIFF_ITEM_TEXT]+=text;
                } else {
                    var item = [];
                    item[DIFF_ITEM_TEXT] = text;
                    item[DIFF_ITEM_OPERATION] = operation;
                    item[DIFF_ITEM_ISTAG] = isTag;


                    if(diff.length>0 && isTag){
                        var last_object = diff[diff.length-1];
                        if(last_object[DIFF_ITEM_TEXT] == " ")
                            diff.pop();
                    }

                    diff.push(item);
                }
            }

            this.isWordEnding = function(string){
                if(string.length == 0) return true;
                if(" .!?:,;".indexOf(string[string.length-1]) === -1)
                    return false;
                return true;
            }

            this.diff_addBothVariants = function(diff, itemAdd, itemRemove, isTag){
                if(itemAdd == itemRemove){
                    self.diff_addItem(diff, itemAdd, DIFF_EQUAL, isTag);
                } else {
                    self.diff_addItem(diff, itemRemove, DIFF_REMOVE, isTag);
                    self.diff_addItem(diff, itemAdd, DIFF_ADD, isTag);
                }
            }

            this.diff_mergeWords = function(diff){
                var result = [];
                var inside = false;
                var itemRemove = "";
                var itemAdd = "";
                for(var i = 0; i < diff.length; i++){
                    var input = diff[i][DIFF_ITEM_TEXT];
                    var operation = diff[i][DIFF_ITEM_OPERATION];
                    var isTag = diff[i][DIFF_ITEM_ISTAG];
                    if(isTag){
                        self.diff_addBothVariants(result, itemAdd, itemRemove, false);
                        itemAdd = itemRemove = "";
                        self.diff_addItem(result, input, operation, isTag);
                        continue;
                    }
                    for(var j = 0;j<input.length; j++){
                        if(operation == DIFF_EQUAL){
                            itemRemove+=input[j];
                            itemAdd+=input[j];
                        }
                        if(operation == DIFF_ADD){
                            itemAdd+=input[j];
                        }
                        if(operation == DIFF_REMOVE){
                            itemRemove+=input[j];
                        }
                        if(self.isWordEnding(input[j])){
                            if(itemRemove.length < itemAdd.length && itemRemove == itemAdd.substr(0,itemRemove.length)){
                                self.diff_addItem(result, itemRemove, DIFF_EQUAL, false);
                                self.diff_addItem(result, itemAdd.substr(itemRemove.length), DIFF_ADD, false);
                            } else {
                                self.diff_addBothVariants(result, itemAdd, itemRemove, false);
                            }
                            itemAdd = itemRemove = "";
                        }
                    }
                }
                self.diff_addBothVariants(result, itemAdd, itemRemove, false);
                return result;
            }

            this.tagLevel = function(text){
                var insideTag = false;
                var tagLevel = 0;
                var prevChar = "";
                var correct = true;
                for(var i = 0;i<text.length;i++){
                    if(text[i] == '<'){
                        tagLevel++;//inside tag
                        tagLevel++;//new tag[1]
                    }
                    if(text[i] == '/' && prevChar == '<'){
                        tagLevel--;//revert new tag[1]
                        tagLevel--;//close tag
                    }
                    if(text[i] == '>'){
                        tagLevel--;//inside tag
                        if(prevChar == '/'){
                            tagLevel--;//revert new tag[1]
                        }
                        if(tagLevel < 0)
                            correct = false;
                    }
                    prevChar = text[i];
                }
//                console.log([text, tagLevel, correct]);
                return [tagLevel, correct];
            }

            this.isCompleteTagBlock = function(text){
                var tagLevel = self.tagLevel(text);
                return tagLevel[0] == 0 && tagLevel[1];
            }

            this.getTextFromInterval = function(diff, start, length){
                var result = "";
                var index = start;
                var end = start + length - 1;
                while(index <= end){
                    result+=diff[index][DIFF_ITEM_TEXT];
                    index++;
                }
                return result;
            }

            this.diff_mergeSequences = function(diff, smart){
                if(angular.isUndefined(smart))
                    smart = true;
                var result = [];
                var itemAdd = "";
                var itemRemove = "";
                for(var i =0;i<diff.length;i++){
                    var input = diff[i][DIFF_ITEM_TEXT];
                    var operation = diff[i][DIFF_ITEM_OPERATION];
                    var isTag = diff[i][DIFF_ITEM_ISTAG];

                    if(operation == DIFF_EQUAL){
                        if(smart && isTag && (self.tagLevel(itemAdd+input)[0] == 0 || self.tagLevel(itemAdd+input)[0] == 0)){
                            itemAdd+=input;
                            itemRemove+=input;
                        } else {
                            self.diff_addBothVariants(result, itemAdd, itemRemove, false);
                            self.diff_addItem(result, input, DIFF_EQUAL, (smart && isTag) || (!smart));
                            itemAdd = itemRemove = "";
                        }
                    } else if(operation == DIFF_REMOVE){
                        itemRemove+=input;
                    } else if(operation == DIFF_ADD){
                        itemAdd+=input;
                    }
                }
                self.diff_addBothVariants(result, itemAdd, itemRemove, false);
                return result;
            }

            this.diff_mergeBlocks = function(diff){

                var logging = false;
                //preprocessing
                var result = [];
                var unclosedRemovedTags = 0;
                for(var i = 0; i < diff.length; i++){
                    var input = diff[i][DIFF_ITEM_TEXT];
                    var operation = diff[i][DIFF_ITEM_OPERATION];
                    var isTag = diff[i][DIFF_ITEM_ISTAG];
                    var tagLevel = self.tagLevel(input)[0];
                    if(operation == DIFF_REMOVE && tagLevel<0){
                        logging && console.log("Incorrect[level = "+tagLevel+"]: ");
                        logging && console.log(diff[i].concat(self.tagLevel(diff[i][DIFF_ITEM_TEXT])));

                        var remove = diff[i];

                        var add = [];
                        add[DIFF_ITEM_TEXT] = "";
                        add[DIFF_ITEM_OPERATION]=DIFF_ADD;
                        add[DIFF_ITEM_ISTAG] = false;

                        while(tagLevel!=0 && result.length>0){

                            var popped = result.pop();
                            var popTagLevel = self.tagLevel(popped[DIFF_ITEM_TEXT])[0];
                            logging && console.log("Popped[level = "+tagLevel+"+"+popTagLevel+"]: ");
                            logging && console.log(popped.concat(self.tagLevel(popped[DIFF_ITEM_TEXT])));

                            if(popped[DIFF_ITEM_OPERATION] == DIFF_EQUAL){
                                remove[DIFF_ITEM_TEXT] = popped[DIFF_ITEM_TEXT] + remove[DIFF_ITEM_TEXT];
                                add[DIFF_ITEM_TEXT] = popped[DIFF_ITEM_TEXT] + add[DIFF_ITEM_TEXT];
                                tagLevel+=popTagLevel;

                                if(popped[DIFF_ITEM_ISTAG]){
                                    add[DIFF_ITEM_ISTAG] = true;
                                    remove[DIFF_ITEM_ISTAG] = true;
                                }

                            } else if(popped[DIFF_ITEM_OPERATION] == DIFF_REMOVE){
                                remove[DIFF_ITEM_TEXT] = popped[DIFF_ITEM_TEXT] + remove[DIFF_ITEM_TEXT];
                                tagLevel+=popTagLevel;

                                if(popped[DIFF_ITEM_ISTAG]){
                                    remove[DIFF_ITEM_ISTAG] = true;
                                }

                            } else if(popped[DIFF_ITEM_OPERATION] == DIFF_ADD){
                                add[DIFF_ITEM_TEXT] = popped[DIFF_ITEM_TEXT] + add[DIFF_ITEM_TEXT];

                                if(popped[DIFF_ITEM_ISTAG]){
                                    add[DIFF_ITEM_ISTAG] = true;
                                }
                            }
                        }
                        remove[DIFF_ITEM_TEXT].length>0 && result.push(remove);
                        add[DIFF_ITEM_TEXT].length>0 && result.push(add);

                        logging && console.log("Pushed[remove]: ");
                        logging && console.log(remove.concat(self.tagLevel(remove[DIFF_ITEM_TEXT])));
                        logging && console.log("Pushed[add]: ");
                        logging && console.log(add.concat(self.tagLevel(add[DIFF_ITEM_TEXT])));
                    } else {
                        result.push(diff[i]);
                        logging && console.log("Pushed[equal]: ");
                        logging && console.log(diff[i].concat(self.tagLevel(diff[i][DIFF_ITEM_TEXT])));
                    }
                }
                for(var i = 0; i < result.length && logging; i++){
                    console.log(result[i].concat(self.tagLevel(result[i][DIFF_ITEM_TEXT])));
                }
                return result;
            }

            this.diff_mergeTags = function(diff){
                var result = [];
                var insideTag = false;
                var itemRemove = "";
                var itemAdd = "";
                var itemText = "";
                for(var i = 0; i < diff.length; i++){
                    var input = diff[i][DIFF_ITEM_TEXT];
                    var operation = diff[i][DIFF_ITEM_OPERATION];
                    if(insideTag && operation == DIFF_ADD){
                        itemAdd+=input;
                    } else if(insideTag && operation == DIFF_REMOVE){
                        itemRemove+=input;
                    } else {
                        for(var j = 0;j<input.length; j++){
                            if(input[j] == '<' && !insideTag){
                                insideTag = true;
                                self.diff_addItem(result, itemText, operation, false);
                                itemText = "";
                            }
                            if(insideTag){
                                if(operation == DIFF_EQUAL){
                                    itemRemove+=input[j];
                                    itemAdd+=input[j];
                                } else if(operation == DIFF_REMOVE){
                                    itemRemove+=input[j];
                                } else if(operation == DIFF_ADD){
                                    itemAdd+=input[j];
                                }
                            } else {
                                itemText += input[j];
                            }
                            if(input[j] == '>' && insideTag){
                                insideTag = false;
                                self.diff_addBothVariants(result, itemAdd, itemRemove, true);
                                itemAdd = itemRemove = "";
                            }
                        }
                        if(!insideTag){
                            self.diff_addItem(result, itemText, operation, false);
                            itemText = "";
                        }
                    }
                }
                self.diff_addBothVariants(result, itemAdd, itemRemove, true);

                for(var i = result.length-1;i>=0;i--){
                    if(result[i][DIFF_ITEM_OPERATION] == DIFF_REMOVE){
                        for(var j =i-1;j>=0;j--){
                            if(result[i][DIFF_ITEM_TEXT] == result[j][DIFF_ITEM_TEXT]){
                                result[i][DIFF_ITEM_OPERATION] = result[j][DIFF_ITEM_OPERATION];
                                result[j][DIFF_ITEM_OPERATION] = DIFF_REMOVE;
                            } else break;
                        }
                    }
                }
                return result;
            }
        });

})();