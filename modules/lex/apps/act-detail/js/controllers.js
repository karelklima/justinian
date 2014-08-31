(function() {
    angular.module('appControllers')
        .controller('LexActDetailController', ['$scope', '$log', '$q', 'AppService', 'LexActService', function ($scope, $log, $q, AppService, LexActService) {

            $scope.actDetail = undefined;
            $scope.actVersions = undefined;
            $scope.actVersion = undefined;
            $scope.actText = undefined;

            $scope.isEmpty = function () {
                return $scope.actDetail === null;
            };

            $scope.isTextLoading = function () {
                return angular.isUndefined($scope.actText);
            };

            $scope.isTextEmpty = function () {
                return $scope.actText === null;
            };

            this.update = function (changes) {
                if (angular.isUndefined($scope.resource) || $scope.resource.length == 0) {
                    AppService.pageNotFound();
                    return;
                }
                $log.debug("LexActDetailController.update: running update");

                var updateResource = function() {

                    $scope.actDetail = undefined;
                    $scope.actVersions = undefined;

                    var getDetailPromise = AppService.getData($scope, 'lex', 'act-detail', {'resource': $scope.resource});
                    getDetailPromise.then(function (actDetail) {
                        if (actDetail["@graph"].length > 0) {
                            $scope.actDetail = actDetail["@graph"][0];
                            AppService.setTitle("Předpis č. " + $scope.actDetail["identifier"]);
                        }
                        else {
                            $scope.actDetail = null;
                            AppService.setTitle("Předpis nenalezen");
                        }
                    });

                    var getVersionsPromise = AppService.getData($scope, 'lex', 'act-versions', {'resource': $scope.resource})
                    getVersionsPromise.then(function (actVersions) {
                        $scope.actVersion = undefined;
                        angular.forEach(actVersions["@graph"], function (version, key) {
                            $scope.actVersions = actVersions["@graph"];
                        });
                    });

                    return $q.all([getDetailPromise, getVersionsPromise])
                };

                var updateVersion = function() {

                    $scope.actText = undefined;

                    var getTextPromise = AppService.getData($scope, 'lex', 'act-text', {'resource': $scope.version});
                    getTextPromise.then(function (actText) {
                        if (actText["@graph"].length > 0) {
                            var doc = angular.element("<div>" + actText["@graph"][0]["htmlValue"] + "</div>");
                            doc = LexActService.fixSectionsInActText(doc);
                            doc = LexActService.addLinksToActText(doc, $scope.resource, $scope.version);
                            doc = LexActService.addConceptAnnotationsToActText(doc, $scope.resource, $scope.version);
                            $scope.actText = doc.html();
                        }
                        else $scope.actText = null;
                    });
                    return $q.all([getTextPromise]);
                };

                var resourceLoaded = $q.defer();
                if (angular.isDefined(changes.resource)) {
                    updateResource()
                        .then(function() {
                            if (angular.isUndefined($scope.version) && angular.isDefined($scope.actDetail["lastVersion"])) {
                                $log.debug("LexActDetailController.update: setting version parameter");
                                AppService.setParam("version", $scope.actDetail["lastVersion"], true);
                            }
                            resourceLoaded.resolve();
                        });
                } else {
                    resourceLoaded.resolve();
                }

                var versionLoaded = $q.defer();
                resourceLoaded.promise.then(function() {
                    if (angular.isDefined($scope.resource) && angular.isDefined(changes.version)) {

                        $scope.actVersion = undefined;
                        angular.forEach($scope.actVersions, function (version, key) {
                            console.log(version);
                            if (version['@id'] == $scope.version) {
                                $scope.actVersion = version;
                            }
                        });

                        updateVersion()
                            .then(function () {
                                versionLoaded.resolve();
                            });
                    } else {
                        versionLoaded.resolve();
                    }
                });

                versionLoaded.promise.then(function() {
                    $log.debug("LexActDetailController.update: update complete");
                    if (angular.isDefined(changes.section)) {
                        $scope.$broadcast('anchor-scroll', {target: 'section[resource="' + $scope.section + '"]'});
                    }
                });

            };

            AppService.init($scope, ['resource', 'version', 'section'], this.update);

        }]);

})();

(function(){
    angular.module("appControllers")
        .controller('LexActDetailPopOverController', ['$scope', '$log', '$q', 'AppService', 'LexActService', function ($scope, $log, $q, AppService, LexActService) {
            $scope.actDetail = undefined;
            $scope.isLoading = true;

            $scope.isEmpty = function(){
                return angular.isDefined($scope.actDetail) && $scope.actDetail.length == 0;
            };

            AppService.getData($scope, 'lex', 'act-detail', {'resource': $scope.resource})
                    .then(function (actDetail) {
                        $scope.isLoading = false;
                        if (actDetail["@graph"].length > 0) {
                            $scope.actDetail = actDetail["@graph"][0];
                            $scope.heading = "Předpis č. " + $scope.actDetail["identifier"];
                            console.log($scope.actDetail);
                        }
                        else {
                            $scope.actDetail = {};
                            $scope.$parent.popOverTitle = "Předpis nenalezen";
                        }
                    });
        }]);
})();

