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
                        $scope.decisionText = doc.html();
                    }, function fail(){
                        $scope.decisionText = "";
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();