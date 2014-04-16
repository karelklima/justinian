/**
 * Created by Fantomaus on 31. 3. 2014.
 */

function LexSearchController($scope, NetworkService, UrlService){
    $scope.results = [];
    $scope.searching = false;
    $scope.search = function(){
        var query = $scope.query;
        if(query === undefined || query == null || query.length == 0)
            return;
        $scope.searching = true;
        NetworkService.useApi('lex','act-search','query='+query,function success(data, status){
//            console.log(data);
//            console.log(status);
            if(data.length > 10){
                data = data.slice(0,10);
            }
            $scope.results = data;
            $scope.searching = false;
            $scope.$digest();
        },function error(data, status){
//            console.log(status);
            $scope.results = [];
            $scope.searching = false;
            $scope.$digest();
        });
    }
    //decode escaped unicode characters to normal form
    $scope.print = function(item){
        var x = item['http://purl.org/dc/terms/title'][0]['@value'];
        var r = /\\u([\d\w]{4})/gi;
        x = x.replace(r, function (match, grp) {
            return String.fromCharCode(parseInt(grp, 16)); } );
        x = unescape(x);
        return x;
    }

    $scope.open = function(item){
        UrlService.setParam('resource',item["@id"]);
        UrlService.setPath('lex','act-detail');
    }
}