/**
 * Created by zaitsevyan on 09/01/14.
 */

var MainApp = angular.module('MainApp',[
    'ngRoute',
    'LoaderModule'
]);

MainApp.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.
            when('/:AppName', {
                templateUrl: 'BlankView.html',
                controller: 'LoaderController'
            }).
            otherwise({
                redirectTo:'/'+config.defaultApplication
            });
    }]);

var LoaderModule = angular.module('LoaderModule', []);
function RootDelegate($scope, $compile, $http){
    var self = this;
    this.scope = $scope;
    this.compile = $compile;
    this.http = $http;
    this.openApp = function(AppName, Application){
        appsManager.loadApp(AppName, self.http, '#main-window', self.scope, self.compile, self);
    }
}

LoaderModule.controller('LoaderController',['$scope', '$http', '$route', '$routeParams', '$compile',
    function($scope, $http, $route, $routeParams, $compile){
        appsManager.loadApp($routeParams.AppName, $http, '#main-window', $scope, $compile, new RootDelegate($scope,$compile,$http));
    }]);

function InitApplicationController($scope, AppName){
    $scope.AppName = AppName;
    $scope.App = appsManager.GetApp(AppName);
    $scope.AppDir = env.AppDir(AppName);
}