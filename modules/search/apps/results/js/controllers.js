(function() {

    angular.module('appControllers')
        .controller('SearchResultsController', ['$scope', 'AppService', function ($scope, AppService) {

            $scope.datasource = {
                get: function(offset, limit, callback) {

                    AppService.getData($scope, 'search', 'search', {'query': $scope.query, "limit": limit, "offset": offset})
                        .then(function (data) {
                            callback(data["@graph"]);
                        }, function() {
                            callback([]);
                        });
                },
                revision: 0
            };

            this.update = function() {
                $scope.datasource.revision++;
            };

            AppService.init($scope, ['query'], this.update);

        }]);

})();