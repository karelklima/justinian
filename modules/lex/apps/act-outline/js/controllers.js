(function() {
    angular.module('appControllers')
        .controller('LexActOutlineController', ['$scope', 'AppService', function ($scope, AppService) {

            $scope.actExpression = undefined;
            $scope.actOutline = undefined;

            $scope.isTextLoading = function () {
                return angular.isUndefined($scope.actOutline);
            };

            $scope.isTextEmpty = function () {
                return angular.isDefined($scope.actOutline) && $scope.actOutline.length === 0;
            };

            $scope.toggleSection = function ($event) {
                var self = angular.element($event.target);
                self.closest("section").children(':not(header):not(.toggle-button)').toggle();
                self.toggleClass("glyphicon-plus").toggleClass("glyphicon-minus");
            };

            this.update = function () {
                AppService.getData($scope, 'lex', 'act-text', {'resource': $scope.resource})
                    .then(function (actText) {
                        if (actText["@graph"].length > 0)
                        {
                            var toggle = angular.element('<span ng-click="toggleSection($event)" class="glyphicon glyphicon-plus toggle-button"></span>');
                            var link = angular.element('<a click></a>');
                            var doc = angular.element("<div>" + actText["@graph"][0]["htmlValue"] + "</div>");
                            var content = doc.find("section[class='obsah']");
                            content.find("section[class='paragraf'], section[class='clanek'], section[class='preambule']").children(':not(header)').remove();
                            content.find("section[class='cast'], section[class='hlava'], section[class='dil'], section[class='oddil'], section[class='pododdil']").prepend(toggle.clone());
                            content.find("section").children("header").each(function(index, element) {
                                var self = angular.element(element);
                                var text = self.children("h1:first").html();
                                if (self.children("h1").length > 1)
                                    text = text + "<span> - </span>" + self.children("h1:last").html();
                                var cloned = link.clone();
                                cloned.html(text);
                                cloned.attr("section", self.closest('section').attr('resource'));
                                self.prepend(cloned);
                                self.children("h1").remove();
                            });
                            content.find("section section, h2").hide();
                            $scope.actOutline = content.html();
                        }
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);

})();

