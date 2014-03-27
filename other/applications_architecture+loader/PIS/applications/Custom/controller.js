/**
 * Created by zaitsevyan on 09/01/14.
 */
function CustomApplicationController($scope, $http, $compile){
    InitApplicationController($scope,"Custom");
    var self = this;
    $scope.count = ++CustomApplicationController.windows;
    $scope.openApp = function(AppName){
        $scope.$parent.delegate.openApp(AppName, self);
    }
}
CustomApplicationController.windows = 0;