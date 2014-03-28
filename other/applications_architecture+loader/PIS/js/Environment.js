/**
 * Created by zaitsevyan on 09/01/14.
 */
function Environment(){
    this.AppsDir = "./applications/";
    this.AppDir = function(AppName){
        return this.AppsDir+AppName+"/";
    }
    this.AppControllerPath = function(AppName){
        return this.AppDir(AppName) + "controller.js";
    }
    this.AppViewPath = function(AppName, ViewName){//ViewName is optional argument

        // elegant processing for optional arguments
        switch (arguments.length - 1)
        {
            case 0: ViewName = "view";
        }

        return this.AppDir(AppName) + ViewName +".html";
    }
}

var env = new Environment();