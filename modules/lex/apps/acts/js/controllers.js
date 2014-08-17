(function() {
    angular.module('appControllers')
        .controller('LexActsController', ['$scope', '$filter', 'AppService', function ($scope, $filter, AppService) {

            var filters = [];
            $scope.filterParams = {};

            $scope.acts = undefined;
            $scope.actsLimit = "10";
            $scope.actsOffset = "0";

            $scope.isEmpty = function() {
                return !$scope.isLoading && angular.isDefined($scope.acts) && $scope.acts.length === 0;
            };

            $scope.removeFilter = function(filter) {
                AppService.setParam(filter, undefined);
            };

            $scope.datasource = {
                get: function(offset, limit, callback) {

                    var params = {'limit': limit, 'offset': offset};

                    angular.extend(params, $scope.filterParams);

                    AppService.getData($scope, 'lex', 'acts', params)
                        .then(function (acts) {
                            callback(angular.isArray(acts["@graph"]) ? acts["@graph"] : []);
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

                        var prefix = "";
                        var title = $scope[filter];

                        switch (filter) {
                            case "region":
                                break;
                            case "minDateIso":
                                prefix = "od ";
                                title = $filter('date')(title, "dd. MM. yyyy");
                                break;
                            case "maxDateIso":
                                prefix = "do ";
                                title = $filter('date')(title, "dd. MM. yyyy");
                                break;
                        }

                        $scope.filters.push({
                            prefix: prefix,
                            title: title,
                            filter: filter
                        });
                    }
                });

                $scope.datasource.revision = $scope.datasource.revision + 1;
            };

            AppService.init($scope, filters, this.update);

        }]);

})();