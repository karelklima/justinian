function LexVersionsController($scope, $sce, UrlService, NetworkService, UtilService, PageService){

    var self = this;
    $scope.versions = null;
    $scope.resource = UrlService.getParam('resource');
    $scope.selectedVersion = null;

   $scope.renderHtml = function(html_code) {
        return $sce.trustAsHtml(html_code);
   };
   $scope.makeBold = function(string) {
	   return "<b>"+string+"</b>";
   };
   $scope.printVersion = function (version){
        var value = version["@id"];
        $scope.selectedVersion = UrlService.getParam('selectedVersion');					// kam s timhle?
        value = "..." + value.substring(value.lastIndexOf("/act/") + 4);
        if (version["@id"] == $scope.selectedVersion) { value = $scope.makeBold(value) }
        return UtilService.decodeUnicodeString(value);
   };
   $scope.printVersionValid = function(version){
        var value = version["http://purl.org/dc/terms/valid"][0]["@value"];
        date = value.split("-");
        value = date[2] + "." + date[1] + "." + date[0];									// udělat společnou konverzi data do českýho formátu?
        if (version["@id"] == $scope.selectedVersion) { value = $scope.makeBold(value) }
        return UtilService.decodeUnicodeString(value);
   };
   $scope.openVersion = function (version){
       //UrlService.setParam('selectedVersion',version["@id"]);								// setParam nefunguje - smaže ostatní parametry
	   var mainApp = PageService.getApplication();
	   UrlService.setUrl('lex', mainApp, {'resource':$scope.resource, 'selectedVersion':version["@id"]});
   };
   NetworkService.useApi('lex','act-versions','resource='+$scope.resource,function success(versions, status){
        if(!(versions instanceof Array)) versions = [];
        $scope.versions = versions;
        $scope.$$phase || $scope.$apply();
   },function error(data, status){
        $scope.versions = null;
        $scope.$$phase || $scope.$apply();
   });
 //   $scope.openVersion(UrlService.getParam('selectedVersion'));
 }
