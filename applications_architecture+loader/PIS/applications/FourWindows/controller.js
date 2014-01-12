/**
 * Created by zaitsevyan on 09/01/14.
 */
function FourWindowsDelegate(application, $scope, $compile, $http){
    var self = this;

    this.application = application;

    this.scope = $scope;
    this.compile = $compile;
    this.http = $http;

    this.openApp = function(AppName, Application){
        appsManager.loadApp(AppName, self.http, self._container, self.scope, self.compile, self);
    }
    this._container = null;
    this.container = function(Container){
        self._container = Container;
        return self;
    }
    return self;
}

function FourWindowsApplicationController($scope, $http, $compile){
    InitApplicationController($scope,"FourWindows");

    this.scope = $scope;

    $scope.identifier = ++FourWindowsApplicationController.windows;
    var ctrl = "Custom";

    if(FourWindowsApplicationController.windows < 2)
    {
        ctrl = "FourWindows";
    }
    else
        ctrl = "Custom";

    appsManager.loadApp(ctrl, $http, '#FourWindows'+$scope.identifier+' #window_1', $scope, $compile, new FourWindowsDelegate(this, $scope, $compile, $http).container('#FourWindows'+$scope.identifier+' #window_1'));
    appsManager.loadApp(ctrl, $http, '#FourWindows'+$scope.identifier+' #window_2', $scope, $compile, new FourWindowsDelegate(this, $scope, $compile, $http).container('#FourWindows'+$scope.identifier+' #window_2'));
    appsManager.loadApp(ctrl, $http, '#FourWindows'+$scope.identifier+' #window_3', $scope, $compile, new FourWindowsDelegate(this, $scope, $compile, $http).container('#FourWindows'+$scope.identifier+' #window_3'));
    appsManager.loadApp(ctrl, $http, '#FourWindows'+$scope.identifier+' #window_4', $scope, $compile, new FourWindowsDelegate(this, $scope, $compile, $http).container('#FourWindows'+$scope.identifier+' #window_4'));
}

FourWindowsApplicationController.windows = 0;