(function() {
    angular.module('appControllers')
        .controller('CourtDecisionsController', ['$scope', '$filter', 'AppService', function ($scope, $filter, AppService) {

//            $scope.resource = UrlService.getParam('resource');

            var filters = ['creator', 'subject', 'minDate', 'maxDate'];
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