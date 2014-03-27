/**
 * Created by zaitsevyan on 09/01/14.
 */
function App(name){
    this.JSLoaded = false;
    this.views = {};
    this._viewsLoading = [];
    this._JSLoading = false;
    this.name = name;

    this._ViewLoadingCallbacks = {};
    this._JSLoadingCallbacks = [];

    this.IsJSLoaded = function(){
        return this.JSLoaded;
    }

    this.LoadJS = function(JSCode){
        if(this.JSLoaded == false){
            this.JSLoaded = true;
            var JSElement = document.createElement('script');
            JSElement.type = 'text/javascript';
            JSElement.innerHTML = JSCode;
            $('head')[0].appendChild(JSElement);
        }
    }

    this.IsViewStored = function(ViewName){
        return ViewName in this.views;
    }

    this.StoreView = function(ViewName, HTMLCode){
        this.views[ViewName] = HTMLCode;
    }

    this.GetView = function(ViewName){
        return this.views[ViewName];
    }

    this.LoadJSHTTP = function($http, Callback){
        if(this.IsJSLoaded() == false){
            this._JSLoadingCallbacks.push(Callback);

            if(this._JSLoading) return;

            this._JSLoading = true;

            var app = this;

            $http.get(env.AppControllerPath(this.name)).then(function (jsResponse) {
                app.LoadJS(jsResponse.data);
                app._JSLoading = false;

                for(var callbackIndex in app._JSLoadingCallbacks){
                    app._JSLoadingCallbacks[callbackIndex](app);
                }

                app._JSLoadingCallbacks = [];
            });
//            $.getScript(env.AppControllerPath(this.name), function() {
//                app.JSLoaded = true;
//                app._JSLoading = false;
//                for(var callbackIndex in app._JSLoadingCallbacks){
//                    app._JSLoadingCallbacks[callbackIndex](app);
//                }
//
//                app._JSLoadingCallbacks = [];
//            });
        }
        else{
            Callback(this);
        }
    }
    this.LoadViewHTTP = function(ViewName, $http, Callback){
        if(this.IsViewStored(ViewName) == false){

            if(!(ViewName in this._ViewLoadingCallbacks))
                this._ViewLoadingCallbacks[ViewName] = [];
            this._ViewLoadingCallbacks[ViewName].push(Callback);

            if(this._viewsLoading.indexOf(ViewName) != -1) return;

            this._viewsLoading.push(ViewName);

            var app = this;

            $http.get(env.AppViewPath(this.name)).then(function (htmlResponse) {
                app.StoreView(ViewName,htmlResponse.data);
                app._viewsLoading = app._viewsLoading.splice(app._viewsLoading.indexOf(ViewName),1);

                for(var callbackIndex in app._ViewLoadingCallbacks[ViewName]){
                    app._ViewLoadingCallbacks[ViewName][callbackIndex](app, app.GetView(ViewName));
                }

                app._ViewLoadingCallbacks[ViewName] = [];
            });
        }
        else{
            Callback(this, this.GetView(ViewName));
        }
    }
}