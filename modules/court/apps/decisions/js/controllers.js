(function() {
    angular.module('appControllers')
        .controller('CourtDecisionsController', ['$scope', '$filter', 'AppService', function ($scope, $filter, AppService) {

//            $scope.resource = UrlService.getParam('resource');

            var filters = ['creator', 'subject', 'minDate', 'maxDate', 'identifier', 'query', 'kind', 'category', 'hasText'];
            $scope.filterParams = {};

            $scope.decisions = [];
            $scope.courtDecisionsLimit = "10";
            $scope.courtDecisionsOffset = 0;

            $scope.isEmpty = function() {
                return !$scope.isLoading && angular.isDefined($scope.decisions) && $scope.decisions.length == 0;
            };

            $scope.removeFilter = function(filter) {
                AppService.setParam(filter, undefined);
            };

            $scope.datasource = {
                get: function(offset, limit, callback) {

                    var params = {'limit': limit, 'offset': offset};

                    angular.extend(params, $scope.filterParams);

                    console.log(params.haveText);

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