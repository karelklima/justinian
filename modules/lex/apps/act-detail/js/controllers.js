(function() {
    angular.module('appControllers')
        .controller('LexActDetailController', ['$scope', '$sce', '$log', '$q', 'NetworkService', 'AppService', 'UrlService', function ($scope, $sce, $log, $q, NetworkService, AppService, UrlService) {

            $scope.actDetail = undefined;
            $scope.actText = undefined;

            $scope.isLoading = function () {
                return angular.isUndefined($scope.actDetail);
            };

            $scope.isEmpty = function () {
                return angular.isDefined($scope.actDetail) && $scope.actDetail.length === 0;
            };

            $scope.isTextLoading = function () {
                return angular.isUndefined($scope.actText);
            };

            $scope.isTextEmpty = function () {
                return angular.isDefined($scope.actText) && $scope.actText.length === 0;
            };


            this.update = function (changes) {

                //if (angular.isDefined(changes.version) && angular.isUndefined(changes.version.old))
                //    return; // this can only happen when

                $log.debug("LexActDetailController.update: running update");

                var updateVersion = function () {
                    var deferred = $q.defer();
                    if (!angular.isDefined($scope.version)) {
                        $log.debug("LexActDetailController.update: retrieving latest act version");
                        NetworkService.getData('lex', 'act-detail', {resource: $scope.resource})
                            .then(function (actDetail) {
                                if (actDetail["@graph"].length > 0) {
                                    var version = actDetail["@graph"][0]["lastVersion"];
                                    UrlService.setParam("version", version, true);
                                } else {
                                    $scope.actDetail = {}; // empty result indicator
                                }
                            });
                        deferred.reject();
                    }
                    deferred.resolve();
                    return deferred.promise;
                };

                var updateData = function () {

                    var deferred = $q.defer();

                    var getDetailPromise = NetworkService.getData('lex', 'act-detail', {'resource': $scope.resource});
                    getDetailPromise.then(function (actDetail) {
                        if (actDetail["@graph"].length > 0)
                            $scope.actDetail = actDetail["@graph"][0];
                        else $scope.actDetail = {};
                    });
                    var getTextPromise = NetworkService.getData('lex', 'act-text', {'resource': $scope.version});
                    getTextPromise.then(function (actText) {
                        if (actText["@graph"].length > 0) {
                            var doc = angular.element("<div>" + actText["@graph"][0]["htmlValue"] + "</div>");
                            $scope.actText = $sce.trustAsHtml(doc.html());
                        }
                        else $scope.actText = "";
                    });

                    $q.all([getDetailPromise, getTextPromise])
                        .then(function () {
                            deferred.resolve();
                            $log.debug("LexActDetailController.update: updateData resolved");
                        });

                    return deferred.promise;
                };


                if (!angular.isDefined($scope.version)) {
                    updateVersion();
                } else {
                    updateData()
                        .then(function () {
                            $log.debug("LexActDetailController.update: updateData after resolve");
                            $scope.$broadcast('anchor-scroll', {target: 'section[resource="' + $scope.section + '"]'});

                        });
                }

            };

            AppService.init($scope, ['resource', 'version', 'section'], this.update);

        }]);

})();

