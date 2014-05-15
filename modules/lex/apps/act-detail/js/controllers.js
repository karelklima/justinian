/**
 * Created by Fantomaus on 31. 3. 2014.
 */

 function LexDetailController($scope, UrlService, NetworkService, UtilService){

    var self = this;
    $scope.versions = null;
    $scope.resource = UrlService.getParam('resource');
    this.prepareVersion = function (version)
    {
        if(version == null || version == undefined)
            return '';
        var paragraphs = [];
        var curParagraph = null;
        var curArticle = null;
        for(var i = 0;i<version.results.bindings.length;i++){
            var item = version.results.bindings[i];
            var part = {};
            part.id = UtilService.decodeUnicodeString(item["id"]["value"]);
            part.text = item["text"] ? UtilService.decodeUnicodeString(item["text"]["value"]) : '';
            part.section = item["section"]["value"];
            part.type = item["type"]["value"];
            if(part.type == 'http://purl.org/lex/cz#Paragraf'){
                part.parent = null;
                part.articles = [];
                curParagraph = part;
                paragraphs.push(curParagraph);
            } else if(part.type == 'http://purl.org/lex/cz#Odstavec'){
                part.parent = curParagraph;
                part.subArticles = [];
                curParagraph.articles.push(part);
                curArticle = part;
            } else if(part.type == 'http://purl.org/lex/cz#Pismeno'){
                if(curArticle)
                {
                    part.parent = curArticle;
                    curArticle.subArticles.push(part);
                } else
                {
                    part.parent = curParagraph;
                    curParagraph.articles.push(part);
                }
            }
        }
        return paragraphs;
    }
    this.setSelectedVersion = function (version){
        $scope.selectedVersion = version;
        $scope.selectedVersionPrepared = self.prepareVersion(version);
        $scope.selectedVersionLoading = false;
        if($scope.selectedVersionPrepared.length){
            setTimeout(function(){
                document.getElementById('selectedVersionTextDiv').scrollIntoView();
            },100);
        }
    }

    self.setSelectedVersion(null);

    $scope.openVersion = function (version){
        console.log(version);
        if(version == null || $scope.selectedVersionLoading==true) return;
        var versionId = null;
        if(typeof(version) == 'string')
            versionId = version;
         else
            versionId = version["@id"];
        UrlService.setParam('selectedVersion',versionId);
        $scope.selectedVersionLoading = true;
        NetworkService.useApi('lex','act-version-text','resource='+versionId, function success(data, status){
//            console.log(data);
            self.setSelectedVersion(data);
            $scope.$$phase || $scope.$apply();
        },function error(data, status){
           self.setSelectedVersion(null);
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

    NetworkService.useApi('lex','act-versions','resource='+$scope.resource,function success(versions, status){
        if(!(versions instanceof Array)) versions = [];
        if(versions.length > 0 && $scope.selectedVersion == null)
        {
            $scope.openVersion(versions[0]);
         }
        $scope.versions = versions;
        $scope.$$phase || $scope.$apply();
    },function error(data, status){
        $scope.versions = null;
        $scope.$$phase || $scope.$apply();
    });
    $scope.openVersion(UrlService.getParam('selectedVersion'));
 }
