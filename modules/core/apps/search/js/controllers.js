/**
 * Created by Fantomaus on 31. 3. 2014.
 */

/*function LexSearchController($scope, NetworkService, UrlService, UtilService, $rootScope, AppService){
    $scope.results = [];
    $scope.searching = false;

    $scope.searchIteration = 0; //many search requests in short time interval -> we need to show only last one.
    $scope.search = function(){
        var query = $scope.query;
        if(!angular.isDefined(query) || query.length == 0)
            return;
        $scope.searching = true;
        $scope.searchIteration++;
        var currentIteration = $scope.searchIteration;

        NetworkService.getData('core', 'act-search', {'query': query, 'limit':5, 'offset':0})
            .then(function (data) {
                if($scope.searchIteration != currentIteration) return;
                $scope.results = data["@graph"];
                $scope.searching = false;
            });
    }

    AppService.init($scope, ['query'], $scope.search);
}*/

(function() {

    angular.module('appControllers')
        .controller('CoreSearchController', ['$scope', 'NetworkService', 'AppService', 'UrlService', function ($scope, NetworkService, AppService, UrlService) {

            AppService.init($scope, ['query']);

            $scope.loading = true;

            $scope.datasource = {

                get: function (index, count, success) {
                    index = index - 1;
                    if (index < 0) {
                        count = count + index;
                        index = 0;
                    }
                    NetworkService.getData('core', 'search', {'query': $scope.query, "limit": count, "offset": index})
                        .then(function (data) {
                            success(data["@graph"]);
                        });

                },

                loading: function(val) {
                    $scope.loading = val;
                }

            };


        }]);

})();