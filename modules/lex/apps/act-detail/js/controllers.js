/**
 * Created by Fantomaus on 31. 3. 2014.
 */
 function LexDetailController($scope, UrlService, NetworkService, UtilService){
    $scope.versions = null;
    $scope.resource = UrlService.getParam('resource');
    $scope.selectedVersion = null;
    $scope.selectedVersionLoading = false;

   $scope.openVersion = function (version){
        if(version == null) return;
        var versionId = null;
        if(typeof(version) == 'string')
            versionId = version;
         else
            versionId = version["@id"];
        UrlService.setParam('selectedVersion',versionId);
        $scope.selectedVersionLoading = true;
        NetworkService.useApi('lex','act-version-text','resource='+versionId, function success(data, status){
            //console.log(data);
            console.log('act-version-text loaded');
            $scope.selectedVersion = data;
            $scope.selectedVersionLoading = false;
            $scope.$$phase || $scope.$apply();
        },function error(data, status){
           $scope.selectedVersion = null;
           $scope.selectedVersionLoading = false;
           $scope.$$phase || $scope.$apply();
       });
   }
   $scope.printVersion = function (version){
        var value = version["@id"];
        return UtilService.decodeUnicodeString(value);
   }
   $scope.printVersionValid = function(version){
        var value = version["http://purl.org/dc/terms/valid"][0]["@value"];
        return UtilService.decodeUnicodeString(value);
   }
   $scope.printVersionText = function(version){
        if(version == null) return '';
        return version;
   }

    NetworkService.useApi('lex','act-versions','resource='+$scope.resource,function success(versions, status){
        if(!(versions instanceof Array)) versions = [];
        if(versions.length > 0)
        {
            $scope.selectedVersion = versions[0];
            $scope.openVersion($scope.selectedVersion);
         }
        $scope.versions = versions;
        $scope.$$phase || $scope.$apply();
    },function error(data, status){
        $scope.versions = null;
        $scope.$$phase || $scope.$apply();
    });
    $scope.openVersion(UrlService.getParam('selectedVersion'));
 }
