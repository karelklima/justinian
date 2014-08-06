(function() {
    angular.module('appControllers')
        .controller('CourtDecisionsController', ['$scope', 'NetworkService', 'UrlService', 'AppService', function ($scope, NetworkService, UrlService, AppService) {

//            $scope.resource = UrlService.getParam('resource');

            var filters = ['creator', 'subject'];
            $scope.filterParams = {};

            $scope.decisions = [];
            $scope.courtDecisionsLimit = "10";
            $scope.courtDecisionsOffset = 0;


            $scope.increase = function() {
                $scope.datasource.revision = $scope.datasource.revision + 1;
            };

            $scope.removeFilter = function(filter) {
                AppService.setParam(filter, undefined);
            };

            $scope.datasource = {
                get: function(offset, limit, callback) {

                    var params = {'limit': limit, 'offset': offset};

                    angular.extend(params, $scope.filterParams);

                    AppService.getData($scope, 'court', 'decisions', params)
                        .then(function (decisions) {
                            callback(angular.isArray(decisions["@graph"]) ? decisions["@graph"] : []);
                        }, function(error) {
                            callback([]);
                        });
                },
                revision: 0
            };

            this.update = function () {
                $scope.filterParams = {};
                $scope.filters = [];
                angular.forEach(filters, function(filter) {
                    if (angular.isDefined($scope[filter])) {
                        $scope.filterParams[filter] = $scope[filter];

                        var label = "Parametr";
                        var title = $scope[filter];

                        switch (filter) {
                            case "creator":
                                label = "Soud";
                                break;
                            case "subject":
                                label = "Předmět";
                                break;
                        }

                        $scope.filters.push({
                            label: label,
                            title: title,
                            filter: filter
                        });
                    }
                });
                $scope.datasource.revision = $scope.datasource.revision + 1; // invalidate datasource

            };

            AppService.init($scope, filters, this.update);

        }]);

})();