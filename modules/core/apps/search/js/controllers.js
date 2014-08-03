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

                loading: function (val) {
                    $scope.loading = val;
                },

                revision: function() {
                    return $scope.query;
                }
            };



        }]);

})();