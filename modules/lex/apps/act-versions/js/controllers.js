function LexVersionsController($scope, $sce, UrlService, NetworkService, UtilService, PageService, LexUtilService, AppService){

    var self = this;
    $scope.versions = null;
    AppService.init($scope, ['resource']);
//    $scope.resource = UrlService.getParam('resource');
    //$scope.selectedVersion = UrlService.getParam('selectedVersion');

   $scope.renderHtml = function(html_code) {
        return $sce.trustAsHtml(html_code);
   };
   $scope.makeBold = function(string) {
	   return "<b>"+string+"</b>";
   };
   $scope.printVersionName = function (version){
        var value = version["@id"];
        return "..." + value.substring(value.lastIndexOf("/act/") + 4);
   };
   $scope.openVersion = function (version){
       //UrlService.setParam('selectedVersion',version["@id"]);								// setParam nefunguje - smaže ostatní parametry
	   var mainApp = PageService.getApplication();
	   UrlService.setUrl('lex', mainApp, {'resource':$scope.resource, 'selectedVersion':version["@id"]});
   };
   NetworkService.useApi('lex','lex/act-versions',[$scope.resource],function success(versions, status){
        if(!(versions instanceof Array)) versions = [];
        $scope.versions = versions;
        $scope.$$phase || $scope.$apply();
   },function error(data, status){
        $scope.versions = null;
        $scope.$$phase || $scope.$apply();
   });

//   $scope.$listen(LocationParamsChangedEvent.getName(), function(event, eventObject){
//          $scope.resource = UrlService.getParam('resource');
//      });
 }
