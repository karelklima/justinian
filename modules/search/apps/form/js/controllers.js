(function() {

    angular.module('appControllers')
        .controller('SearchFormController', ['$scope', 'AppService', 'UrlService', function ($scope, AppService, UrlService) {

        AppService.init($scope, ['query']);

        $scope.getResults = function (viewValue) {
            if (angular.isUndefined(viewValue) || viewValue.length < 3) {
                return [];
            }
            if (viewValue.length > 3)
                viewValue = viewValue + '*'; // Virtuoso limit
            return AppService.getData($scope, 'search', 'search', {'query': viewValue, "limit": 5, "offset": 0})
                .then(function (data) {
                    return data["@graph"];
                });
        };

        $scope.search = function () {
            UrlService.setUrl({
                module: 'search',
                application: 'results',
                query: $scope.query
            });
        };

        $scope.selected = function (item) {
            UrlService.setUrl({ "resource": item["@id"], "type": item["@type"] });
        };

    }]);

})();
