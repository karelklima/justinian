function SearchBarController($scope, NetworkService, UrlService, UtilService){
    $scope.query = UrlService.getParam('query');

    $scope.search = function () {
        $scope.query = document.getElementById('inputSearchBar').value;
        UrlService.setUrl('core','search', {'query':$scope.query});
    }

    $('#inputSearchBar').typeahead({
        source: function(query, process){
            if(query && query.length>0){
                NetworkService.useApi('core','core/act-search',[query, 1, 5],function success(data, status){
                    UrlService.setParam('query',query);
                    if(!(data instanceof Array)) data = [];
                    if(data.length > 5){
                        data = data.slice(0,5);
                    }
                    if(data.length < 2){
                        data = [];
                    }
                    var results = [];
                    for(var i =0;i<data.length;i++){
                        var item = data[i];
                        results.push(UtilService.decodeUnicodeString(item['http://purl.org/dc/terms/title'][0]['@value']));
                    }
                    process(results);
                },function error(data, status){
                    process([]);
                });
            } else {
                process([]);
            }
        },
        minLength: 1,
        items: 5,
        autoSelect: false
    });
}
