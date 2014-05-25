
function LexDetailController($scope, UrlService, NetworkService, UtilService) {

    var self = this;

    $scope.versions = null;
    $scope.resource = UrlService.getParam('resource');

    $scope.isLoading = true;
    $scope.isError = false;
    $scope.isEmpty = false;
    $scope.content = null;

    this.prepareVersion = function (version) {
        if (version == null || version == undefined)
            return '';
        console.log(version);
        var paragraphs = [];
        var curParagraph = null;
        var curArticle = null;
        for (var i = 0; i < version.results.bindings.length; i++) {
            var item = version.results.bindings[i];
            var part = {};
            part.id = UtilService.decodeUnicodeString(item["id"]["value"]);
            part.text = item["text"] ? UtilService.decodeUnicodeString(item["text"]["value"]) : '';
            part.section = item["section"]["value"];
            part.type = item["type"]["value"];
            if (part.type == 'http://purl.org/lex/cz#Paragraf') {
                part.parent = null;
                part.articles = [];
                curParagraph = part;
                paragraphs.push(curParagraph);
            } else if (part.type == 'http://purl.org/lex/cz#Odstavec') {
                if(curParagraph == null){
                    part.parent = null;
                    part.articles = [];
                    curParagraph = part;
                    paragraphs.push(curParagraph);
                }
                part.parent = curParagraph;
                part.subArticles = [];
                curParagraph.articles.push(part);
                curArticle = part;
            } else if (part.type == 'http://purl.org/lex/cz#Pismeno') {
                if (curArticle) {
                    part.parent = curArticle;
                    curArticle.subArticles.push(part);
                } else {
                    if(curParagraph == null){
                            part.parent = null;
                            part.articles = [];
                            curParagraph = part;
                            paragraphs.push(curParagraph);
                    }
                    part.parent = curParagraph;
                    curParagraph.articles.push(part);
                }
            }
        }
        return paragraphs;
    };

    this.init = function() {
        NetworkService.useApi('lex', 'act-versions', {resource: $scope.resource}, function (versions) {
            if (!(versions instanceof Array)) versions = [];
            if (versions.length > 0) {
                var versionId = versions[0]['@id'];
                NetworkService.useApi('lex', 'act-version-text', {resource: versionId}, function (data) {
                    $scope.content = self.prepareVersion(data);
                    $scope.isLoading = false;
                }, function error(data, status) {
                    $scope.isError = true;
                });
            } else {
                $scope.isEmpty = true;
            }
        }, function error(data, status) {
            $scope.isError = true;
        });
    };

    this.init();
}

