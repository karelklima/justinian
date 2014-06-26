function LexDetailVersionController($scope, $rootScope, UrlService, NetworkService, UtilService) {

    this.prepareVersion = function (version) {
        if (version == null || version == undefined)
            return '';
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

    var self = this;
    this.init = function () {

        $scope.versions = null;
        $scope.resource = UrlService.getParam('resource');

        $scope.isLoading = true;
        $scope.isError = false;
        $scope.isEmpty = false;
        $scope.content = null;

        NetworkService.useApi('lex', 'lex/act-version-text', [$scope.resource], function (data) {
            console.log(data);
            $scope.content = self.prepareVersion(data);
            $scope.isLoading = false;
        }, function error(data, status) {
            $scope.isError = true;
        });
    };

    this.init();

    $scope.$listen(LocationParamsChangedEvent.getName(), function() {
        self.init();
    });
}

