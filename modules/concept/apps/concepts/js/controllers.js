(function() {
    angular.module('appControllers')
        .controller('ConceptConceptsController', ['$scope', '$filter', 'AppService', function ($scope, $filter, AppService) {

//            $scope.resource = UrlService.getParam('resource');

            var filters = ['label', 'definition', 'expression'];
            $scope.filterParams = {};

            $scope.concepts = [];

            $scope.removeFilter = function(filter) {
                AppService.setParam(filter, undefined);
            };

            $scope.datasource = {
                get: function(offset, limit, callback) {

                    var params = {'limit': limit, 'offset': offset};

                    angular.extend(params, $scope.filterParams);

                    AppService.getData($scope, 'concept', 'concepts', params)
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

                        var prefix = "";
                        var title = $scope[filter];

                        switch (filter) {
                            case "definition":
                                prefix = "definice ";
                                break;
                            case "label":
                                prefix = "pojem ";
                                break;
                            case "expression":
                                title = "vybraný předpis";
                                break;
                        }

                        $scope.filters.push({
                            prefix: prefix,
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