/**
 * Created by zaitsevyan on 09/01/14.
 */
var ActivityIndicatorOpts = {
    lines: 10, // The number of lines to draw
    length: 7, // The length of each line
    width: 5, // The line thickness
    radius: 12, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#000', // #rgb or #rrggbb or array of colors
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
};

function DelayedAppLoading(AppName,http,ViewContainer,scope,compile, delegate){
    this.AppName = AppName;
    this.http = http;
    this.ViewContainer = ViewContainer;
    this.scope = scope;
    this.compile = compile;
    this.delegate = delegate;
}

function AppsManager(){

    var self = this;

    this.apps = {};
    this._delayedLoading = {};
    this._CheckDelayedLoading = function(){
        for(var ViewContainer in self._delayedLoading){
            if($(ViewContainer).length!=0){
                var app = self._delayedLoading[ViewContainer];
                delete self._delayedLoading[ViewContainer];
                self.loadApp(app.AppName,app.http,app.ViewContainer,app.scope,app.compile, app.delegate);
            }
        }
    }

    this.GetApp = function(AppName){
        if(AppName in this.apps)
            return this.apps[AppName]
        return null;
    }


    this.loadApp = function(AppName, $http, ViewContainer, $scope, $compile, delegate){
        if($(ViewContainer).length == 0){
            var _delayedLoadingSetup = new DelayedAppLoading(AppName, $http, ViewContainer, $scope, $compile, delegate);
            this._delayedLoading[ViewContainer] = _delayedLoadingSetup;
            console.log('Delayed load '+AppName+' to '+ViewContainer);
            return;
        }
        console.log('Load '+AppName+' to '+ViewContainer);
        var app = this.GetApp(AppName);
        if(app == null){
            app = new App(AppName);
            this.apps[AppName] = app;
        }
        new Spinner(ActivityIndicatorOpts).spin($(ViewContainer)[0]);
        var CurState = {State: "HTMLNotLoaded"};
        var loadHTMLView = function(application){
            if(application.IsViewStored('view') && CurState.State == "HTMLNotLoaded")
            {
                CurState.State = "HTMLLoaded";
                console.log('Set html for view '+ViewContainer+'['+$(ViewContainer).length+']');
                $(ViewContainer).empty();
                $(ViewContainer).html(application.GetView('view'));
                var scope = $scope.$new(true);
                scope.delegate = delegate;
                $compile($(ViewContainer))(scope);

                window.setTimeout(function(){ //Magic
                    scope.$apply();
                    self._CheckDelayedLoading();
                }, 10);
            }
        };

        app.LoadJSHTTP($http, function(application){
            loadHTMLView(application);
        });

        app.LoadViewHTTP('view', $http, function(application, HTMLCode){
            loadHTMLView(application);
        });
    }
}

var appsManager = new AppsManager();
