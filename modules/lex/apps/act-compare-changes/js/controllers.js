(function() {
    angular.module('appControllers')
        .controller('LexActCompareChangesController', ['$scope', 'AppService', function ($scope, AppService) {

            $scope.list = undefined;

            $scope.isLoading = function () {
                return angular.isUndefined($scope.list);
            };

            $scope.isEmpty = function() {
                return angular.isDefined($scope.list) && $scope.list.length == 0;
            }

            this.update = function () {
                $scope.list = undefined;
                $scope.isLoading = true;
            };

            $scope.$listen('$LexActCompareFinished',function(event, text){
                console.log("Text received in event: text.length = "+text.length);
                $scope.list = [];
                var doc = angular.element("<div>" + text + "</div>");
                var changes = doc.find(".diff_remove, .diff_add");
                for(var i =0;i<changes.length;i++){
                    var item = angular.element(changes[i]);
                    var result = {};
                    result.index = i+1;
                    result.type = item.hasClass('diff_add')?'add':'remove';
                    result.content = item[0].textContent.trim();
                    if(result.content.length>40)
                        result.content = result.content.substr(0,40).trim()+'...';
                    $scope.list.push(result);
//                    console.log(result);
                }
                $scope.isLoading = false;
            });

            AppService.init($scope, ['resource', 'version', 'compare'], this.update);

        }]);

})();

