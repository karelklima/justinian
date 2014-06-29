function COICheckController($scope, $sce, UrlService, NetworkService, UtilService, PageService, LexUtilService){

    var self = this;
    $scope.checks = null;
    $scope.resource = UrlService.getParam('resource');

   $scope.printCheckID = function (item){
        var value = item["@id"];
        return "..." + value.substring(value.lastIndexOf("/check-action/") + 23);
   };
   $scope.printCheckRegion = function(item){
	   var value = item["http://schema.org/location"][0]["@value"];
	   var regions =  {
			   "Hlavní město Praha": "PHA",
			   "Středočeský kraj": "STČ",
			   "Jihočeský kraj": "JHČ",
			   "Plzeňský kraj": "PLK",
			   "Karlovarský kraj": "KVK",
			   "Ústecký kraj": "ULK",
			   "Liberecký kraj": "LBK",
			   "Královéhradecký kraj": "HKK",
			   "Pardubický kraj": "PAK",
			   "Kraj Vysočina": "VYS",
			   "Jihomoravský kraj": "JHM",
			   "Olomoucký kraj": "OLK",
			   "Zlínský kraj": "ZLK",
			   "Moravskoslezský kraj": "MSK"
	   };
       return regions[UtilService.decodeUnicodeString(value)];
   }
   $scope.hasSanctions = function(item){
	   var value = item["http://schema.org/result"];
	   var output = "";
	   if (value != undefined) { output =  value.length };
	   return output;
   }
   NetworkService.useApi('lex','lex/act-related-coicheck',[$scope.resource],function success(checks, status){
        if(!(checks instanceof Array)) checks = [];
        $scope.checks = checks;
        $scope.$$phase || $scope.$apply();
   },function error(data, status){
        $scope.checks = null;
        $scope.$$phase || $scope.$apply();
   });
}
