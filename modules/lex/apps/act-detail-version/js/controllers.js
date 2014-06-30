function LexDetailVersionController($scope, $rootScope, UrlService, NetworkService, UtilService, AppService) {
    this.cache = {};

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
    $scope.updateIteration = 0; //need to catch situation, when we need to process many requests in short time, but we should to show only last one

    this.update = function () {

        $scope.versions = null;
//        $scope.resource = UrlService.getParam('resource');
        $scope.isLoading = true;
        $scope.isError = false;
        $scope.isEmpty = false;
        $scope.content = null;
        $scope.updateIteration++;
        var currentUpdateIteration = $scope.updateIteration;
        if(self.cache[$scope.resource]){
            $scope.content = self.cache[$scope.resource];
            $scope.isLoading = false;
        } else {
            NetworkService.useApi('lex', 'lex/act-version-text', [$scope.resource], function (data) {
                self.cache[$scope.resource] = self.prepareVersion(data);
                if(currentUpdateIteration == $scope.updateIteration){
                    $scope.content = self.cache[$scope.resource];
                    $scope.isLoading = false;
                }
            }, function error(data, status) {
                if(currentUpdateIteration == $scope.updateIteration){
                    $scope.isError = true;
                }
            });
        }
    };

//    this.init();
//
//    $scope.$listen(LocationParamsChangedEvent.getName(), function() {
//        self.init();
//    });

    AppService.init($scope, ['resource'], this.update);
}

