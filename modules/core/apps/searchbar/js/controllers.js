function SearchBarController($scope, $rootScope, NetworkService, UrlService, UtilService, AppService){
    AppService.init($scope, ['query']);

    $scope.search = function () {
        $scope.query = document.getElementById('inputSearchBar').value;
        UrlService.setUrl('core','search', {'query':$scope.query});
    }

    $('#inputSearchBar').typeahead({
        source: function(query, process){
            if(query && query.length>0){
                NetworkService.getData('core', 'act-search', {'query': query, "limit":5, "offset":0})
                .then(function (data) {
                    var results = [];
                    for(var i =0;i<data["@graph"].length;i++){
                        var item = data["@graph"][i];
                        results.push(item['title']);
                    }
                    if(results.length < 2)
                        results = [];
                    process(results);
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
