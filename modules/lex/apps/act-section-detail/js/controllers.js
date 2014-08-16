(function() {
    angular.module('appControllers')
        .controller('LexActSectionDetailController', ['$scope', '$log', '$q', 'AppService', 'LexActService', function ($scope, $log, $q, AppService, LexActService) {

            $scope.actSectionDetail = undefined;
            $scope.actDetail = undefined;
            $scope.actVersion = undefined;
            $scope.actText = undefined;

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
                if (angular.isUndefined($scope.resource) || $scope.resource.length == 0) {
                    AppService.pageNotFound();
                    return;
                }
                $log.debug("LexActSectionDetailController.update: running update");
                var updateVersion = function () {
                    $log.debug("LexActSectionDetailController.update: retrieving latest act section version");
                    var actDetailPromise = AppService.getData($scope, 'lex', 'act-section-detail', {resource: $scope.resource});
                    actDetailPromise.then(function (actSectionDetail) {
                        if (actSectionDetail["@graph"].length > 0) {
                            var version = actSectionDetail["@graph"][0]["expression"];
                            $log.debug("LexActDetailController.update: setting version parameter");
                            AppService.setParam("version", version, true);
                        } else {
                            $scope.actSectionDetail = {}; // empty result indicator
                        }
                    });
                    return actDetailPromise;
                };

                var updateData = function () {

                    var deferred = $q.defer();

                    var getDetailPromise = AppService.getData($scope, 'lex', 'act-section-detail', {'resource': $scope.resource});
                    getDetailPromise.then(function (actDetail) {
                        if (actDetail["@graph"].length > 0) {
                            $scope.actDetail = actDetail["@graph"][0];
                            AppService.setTitle("Předpis č. " + $scope.actDetail["identifier"]);
                        }
                        else $scope.actDetail = {};
                    });

                    var getVersionsPromise = AppService.getData($scope, 'lex', 'act-versions', {'resource': $scope.resource})
                    getVersionsPromise.then(function(actVersions) {
                        $scope.actVersion = undefined;
                        angular.forEach(actVersions["@graph"], function(version, key) {
                            if (version["@id"] == $scope.version) {
                                $scope.actVersion = version;
                            }
                        });
                    });

                    var getTextPromise = AppService.getData($scope, 'lex', 'act-text', {'resource': $scope.version});
                    getTextPromise.then(function (actText) {
                        if (actText["@graph"].length > 0) {
                            var doc = angular.element("<div>" + actText["@graph"][0]["htmlValue"] + "</div>");
                            doc = LexActService.fixSectionsInActText(doc);
                            doc = LexActService.addLinksToActText(doc, $scope.resource);
                            $scope.actText = doc.html();
                        }
                        else $scope.actText = "";
                    });

                    $q.all([getDetailPromise, getVersionsPromise, getTextPromise])
                        .then(function () {
                            deferred.resolve();
                            $log.debug("LexActDetailController.update: updateData resolved");
                        });

                    return deferred.promise;
                };


                if (!angular.isDefined($scope.version)) {
                    updateVersion();
                } else {
                    $log.debug("LexActDetailController.update: updateData starting");
                    $scope.actText = undefined;
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

