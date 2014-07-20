(function() {

    angular.module('appControllers')
        .controller('CoreSearchBarController', ['$scope', 'NetworkService', 'AppService', 'UrlService', function ($scope, NetworkService, AppService, UrlService) {

        AppService.init($scope, ['query']);

        $scope.getResults = function (viewValue) {
            return NetworkService.getData('core', 'search', {'query': viewValue, "limit": 5, "offset": 0})
                .then(function (data) {
                    return data["@graph"];
                });
        };

        $scope.search = function () {
            UrlService.setUrl('core', 'search', {'query': $scope.query});
        };

        $scope.selected = function (item) {
            console.log(item);
            UrlService.setUrl(undefined, undefined, { "resource": item["@id"], "type": item["@type"] });
        };

    }]);

})();
