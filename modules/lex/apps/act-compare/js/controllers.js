(function() {
    angular.module('appControllers')
        .controller('LexCompareVersionController', ['$scope', '$sce', 'NetworkService', 'AppService', function ($scope, $sce, NetworkService, AppService) {

            $scope.actDetail = undefined;
            $scope.actText = undefined;

            var self = this;

            this.actText1Raw = undefined;
            this.actText2Raw = undefined;

            $scope.isLoading = function () {
                return angular.isUndefined($scope.actDetail);
            };

            $scope.isEmpty = function () {
                return angular.isDefined($scope.actDetail) && $scope.actDetail.length === 0;
            };

            $scope.isTextLoading = function () {
                return angular.isUndefined($scope.actText);
            };

            $scope.isTextEmpty = function () {
                return (angular.isDefined($scope.actText) && $scope.actText.length === 0);
            };

            $scope.actText1RawLength = function() {
                if(angular.isDefined(self.actText1Raw))
                    return self.actText1Raw.length;
                else return 0;
            }

            $scope.actText2RawLength = function() {
                if(angular.isDefined(self.actText2Raw))
                    return self.actText2Raw.length;
                else return 0;
            }

            this.update = function () {
                if(angular.isUndefined($scope.actDetail) || $scope.actDetail["@id"] != $scope.resource){
                    $scope.actDetail = undefined;
                    NetworkService.getData('lex', 'act-detail', {'resource': $scope.resource})
                        .then(function (actDetail) {
                            if (actDetail["@graph"].length > 0)
                                $scope.actDetail = actDetail["@graph"][0];
                            else $scope.actDetail = {};
                        });
                }

                if(angular.isUndefined(self.actText1Raw) || self.actText1Raw["@id"] != $scope.secondVersion){
                    self.actText1Raw = undefined;
                    NetworkService.getData('lex', 'act-text', {'resource': $scope.secondVersion})
                        .then(function (data) {
                            console.log(data);
                            if (data["@graph"].length > 0)
                            {
                                self.actText1Raw = data["@graph"][0]["htmlValue"];
                            }
                            else self.actText1Raw = "";
                            self.processTexts();
                        });
                }

                if(angular.isUndefined(self.actText2Raw) || self.actText2Raw["@id"] != $scope.version){
                    self.actText2Raw = undefined;
                    NetworkService.getData('lex', 'act-text', {'resource': $scope.version})
                        .then(function (data) {
                            console.log(data);
                            if (data["@graph"].length > 0)
                            {
                                self.actText2Raw = data["@graph"][0]["htmlValue"];
                            }
                            else self.actText2Raw = "";
                            self.processTexts();
                        });
                }
            };
            this.processTexts = function (){
                console.log(self);
                var result = self.diff(self.actText1Raw, self.actText2Raw);
                if(angular.isDefined(result)){
                    var doc = angular.element("<div>" + result + "</div>");
                    $scope.actText = $sce.trustAsHtml(doc.html());
                } else if(angular.isDefined(self.actText1Raw) && angular.isDefined(self.actText2Raw) && (self.actText1Raw.length == 0 || self.actText2Raw.length == 0)){
                    $scope.actText = "";
                }
            }
            this.diff = function (text1, text2){
                if(angular.isUndefined(text1) || angular.isUndefined(text2) || text1.length == 0 || text2.length == 0){
                    return undefined;
                } else {
                    var dmp = new diff_match_patch();
                    dmp.Diff_Timeout = 0;
                    dmp.Diff_EditCost = 4;
                    console.log("Text 1: "+text1.length);
                    console.log("Text 2: "+text2.length);
                    var d = dmp.diff_main(text1, text2);
                    dmp.diff_cleanupSemantic(d);
                    console.log(d);
                    var result = "";
                    for(var i = 0; i< d.length; i++){
                        var item = d[i];
                        if(angular.isDefined(item[0]) && angular.isDefined(item[1]) && item[1].length>0){
                            if(item[0] == 0)
                                result+= item[1];
                            else if(item[0] == -1){
                                result+= self.colored(result, item[1], '#FF0000', 'remove');
                            } else if (item[0] == 1){
                                result+= self.colored(result, item[1], '#00FF00', 'add');
                            }
                        }
                    }
                    return result;
                }
            }

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
                    result+='<font color="'+color+'">';

                for(; textIndex<text.length; textIndex++){
                    if(text[textIndex] == '>'){
                        if(operation == 'add')
                            result+='>';
                        if(!normalText)
                            result+='<font color="'+color+'">';
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

                console.log(result);
                return result;
            }

            AppService.init($scope, ['resource', 'version', 'secondVersion'], this.update);

        }]);

})();

