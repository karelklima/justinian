appControllers.controller('COICheckController', ['$scope', 'NetworkService', 'UrlService', 'AppService', function ($scope, NetworkService, UrlService, AppService) {

//    $scope.resource = UrlService.getParam('resource');

    $scope.checks = [];
    $scope.property = '-date';
    $scope.reverse = false;

    $scope.sortBy = function(property) {
        if ($scope.property === property) {
            $scope.reverse = !$scope.reverse;
        } else {
            $scope.property = property;
            $scope.reverse = false;
        }
    };
    $scope.update = function (){
        NetworkService.useApi('coi','coi/act-related-coicheck',[$scope.resource],function success(checks, status){
                if(!(checks instanceof Array)) checks = [];
                $scope.checks = checks;
                $scope.$$phase || $scope.$apply();
            },function error(data, status){
                $scope.checks = null;
                $scope.$$phase || $scope.$apply();
            });
    }

    AppService.init($scope, ['resource'], $scope.update);

//    $scope.update();


//    $scope.$listen(LocationParamsChangedEvent.getName(), function(event, eventObject){
//        $scope.resource = UrlService.getParam('resource');
//        $scope.update();
//    });
}]);