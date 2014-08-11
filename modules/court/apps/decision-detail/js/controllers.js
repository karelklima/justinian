(function() {
    angular.module('appControllers')
        .controller('CourtDecisionDetailController', ['$scope', '$sce', 'NetworkService', 'AppService', function ($scope, $sce, NetworkService, AppService) {

//            $scope.resource = UrlService.getParam('resource');

            $scope.decisionDetail = undefined;
            $scope.decisionText = undefined;

            $scope.isEmpty = function() {
                return angular.isDefined($scope.decisionDetail) && $scope.decisionDetail.length === 0;
            };

            $scope.isTextLoading = function() {
                return angular.isUndefined($scope.decisionText);
            };

            $scope.isTextEmpty = function() {
                return angular.isDefined($scope.decisionText) && $scope.decisionText.length === 0;
            };

            this.update = function () {
                $scope.decisionDetail = undefined;
                $scope.decisionText = undefined;
                AppService.getData($scope, 'court', 'decision-detail', {'resource': $scope.resource})
                    .then(function (decisionDetail) {
                        if(angular.isDefined(decisionDetail['@graph']) && angular.isDefined(decisionDetail['@graph'][0])){
                            $scope.decisionDetail = decisionDetail['@graph'][0];
                            console.log($scope.decisionDetail);
                        } else {
                           $scope.decisionDetail = {};
                        }
                    }, function fail(){
                           $scope.decisionDetail = {};
                    });
                AppService.getData($scope, 'court', 'decision-text', {'resource': $scope.resource})
                    .then(function(decisionText) {
                        if(decisionText["@graph"].length == 0) {
                            $scope.decisionText = "";
                            return;
                        }
                        var doc = angular.element("<div>" + decisionText["@graph"][0]["xmlValue"] + "</div>");
                        doc.find("span[rel='sdo:hasSection']").children().unwrap();
                        doc.find("span[rel='sdo:hasParagraph']").children().unwrap();
                        doc.find("paragraph").each(function() {
                            var self = angular.element(this);
                            var replacement = angular.element("<p/>");
                            var attributes = {};
                            angular.forEach(self.get(0).attributes, function(attribute, index) {
                                attributes[attribute.name] = attribute.value;
                            });
                            replacement.attr(attributes);
                            replacement.html(self.html());
                            self.replaceWith(replacement);
                        });
                        doc.find("footer > div").each(function(){
                            var self = angular.element(this);
                            var annotation = self.get(0);
                            var chunk = annotation.attributes["about"].value;
                            if(angular.isUndefined(chunk)) return;
                            var target = self.children("div[typeof='sao:Annotation']").children("div").get(0);
                            if(angular.isUndefined(target) || angular.isUndefined(target.attributes)) return;
                            var targetType = target.attributes["typeof"] === undefined ? undefined : target.attributes["typeof"].value;
                            var resource = target.attributes["resource"] == undefined ? undefined : target.attributes["resource"].value;
                            if(angular.isDefined(targetType) && angular.isDefined(resource)){
                                doc.find("span[resource='"+annotation.attributes["about"].value+"']").each(function(){
                                    var self = angular.element(this);
                                    var replacement = angular.element("<a/>");
                                    var attributes = {};
                                    if(targetType == 'lex:Decision'){
                                        attributes['click']='';
                                        attributes['resource'] = resource.replace("/cz/",":");
                                        attributes['type'] = targetType;
                                        attributes['class'] = 'annotation-decision';
                                    } else if (targetType == 'lex:Court'){
                                        attributes['href']="http://linked.opendata.cz/resource/"+resource;
                                        attributes['class'] = 'annotation-court';
                                    } else if(targetType == 'lex:Act'){
                                        attributes['click'] = '';
                                        attributes['resource'] = resource.replace("/cz/",":");
                                        attributes['type'] = targetType;
                                        attributes['class'] = 'annotation-act';
                                    }else if(targetType == 'frbr:Work'){
                                        attributes['click']='';
                                        attributes['resource'] = resource.replace("/cz/",":");
                                        attributes['type'] = "lex:ActSection";
                                        attributes['class'] = 'annotation-work';
                                    }else{
                                        console.log(chunk);
                                        console.log(resource);
                                        console.log(targetType);
                                        return;
                                    }
                                    replacement.attr(attributes);
                                    replacement.html(self.html());
                                    self.replaceWith(replacement);
                                });
                            }
                        });
                        $scope.decisionText = doc.html();
                    }, function fail(){
                        $scope.decisionText = "";
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();