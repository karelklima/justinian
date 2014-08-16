(function() {
    angular.module('appControllers')
        .controller('CoiCheckactionsController', ['$scope', '$filter', 'AppService', function ($scope, $filter, AppService) {

            var filters = [];
            $scope.filterParams = {};

            $scope.checkactions = undefined;
            $scope.checkactionsLimit = "10";
            $scope.checkactionsOffset = "0";

            $scope.isEmpty = function() {
                return !$scope.isLoading && angular.isDefined($scope.checkactions) && $scope.checkactions.length === 0;
            };

            $scope.removeFilter = function(filter) {
                AppService.setParam(filter, undefined);
            };

            $scope.datasource = {
                get: function(offset, limit, callback) {

                    var params = {'limit': limit, 'offset': offset};

                    angular.extend(params, $scope.filterParams);

                    AppService.getData($scope, 'coi', 'checkactions', params)
                        .then(function (checkactions) {
                            callback(angular.isArray(checkactions["@graph"]) ? checkactions["@graph"] : []);
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
                            case "creator":
                                break;
                            case "subject":
                                break;
                            case "minDate":
                                prefix = "od ";
                                title = $filter('date')(title, "dd. MM. yyyy");
                                break;
                            case "maxDate":
                                prefix = "do ";
                                title = $filter('date')(title, "dd. MM. yyyy");
                                break;
                            case "query":
                                prefix = "text ";
                                break;
                            case 'kind':
                                break;
                            case 'category':
                                prefix = "kategorie ";
                                break;
                            case 'identifier':
                                break;
                            case 'hasText':
                                title = "judikáty s dostupným textem";
                                break;
                        } // FIXME

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