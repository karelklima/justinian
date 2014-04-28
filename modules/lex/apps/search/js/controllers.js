/**
 * Created by Fantomaus on 31. 3. 2014.
 */

function LexSearchController($scope, NetworkService, UrlService, UtilService){
    $scope.results = [];
    $scope.searching = false;
    $scope.query = UrlService.getParam('query');
    $scope.search = function(){
        var query = $scope.query;
        if(query === undefined || query == null || query.length == 0)
            return;
        $scope.searching = true;
        NetworkService.useApi('lex','act-search','query='+query,function success(data, status){
//            console.log(data);
//            console.log(status);
            UrlService.setParam('query',query);
            if(!(data instanceof Array)) data = [];
            if(data.length > 10){
                data = data.slice(0,10);
            }
            $scope.results = data;
            $scope.searching = false;
            $scope.$$phase || $scope.$apply();
        },function error(data, status){
//            console.log(status);
            $scope.results = [];
            $scope.searching = false;
            $scope.$$phase || $scope.$apply();
        });
    }
    //decode escaped unicode characters to normal form
    $scope.print = function(item){
        var value = item['http://purl.org/dc/terms/title'][0]['@value'];
        return UtilService.decodeUnicodeString(value);
    }

    $scope.open = function(item){
        UrlService.setParam('resource',item["@id"]);
        UrlService.setPath('lex','act-detail');
    }

    if($scope.query!=null)
        $scope.search();
}