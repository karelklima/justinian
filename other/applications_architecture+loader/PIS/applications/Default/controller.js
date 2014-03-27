/**
 * Created by zaitsevyan on 09/01/14.
 */
function DefaultApplicationController($scope){
    InitApplicationController($scope,"Default");
    var self = this;
    $scope.openApp = function(AppName){
        $scope.$parent.delegate.openApp(AppName, self);
    }
}