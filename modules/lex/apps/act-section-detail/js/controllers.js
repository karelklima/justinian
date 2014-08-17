(function() {
    angular.module('appControllers')
        .controller('LexActSectionDetailController', ['$scope', '$log', '$q', 'AppService', 'LexActService', function ($scope, $log, $q, AppService, LexActService) {

            $scope.actSectionDetail = undefined;
            $scope.actDetail = undefined;
            $scope.actSectionVersions = undefined;
            $scope.actSectionVersion = undefined;
            $scope.actSectionText = undefined;

            $scope.isEmpty = function () {
                return $scope.actSectionDetail === null;
            };

            $scope.isTextLoading = function () {
                return angular.isUndefined($scope.actSectionText);
            };

            $scope.isTextEmpty = function () {
                return $scope.actSectionText === null;
            };

            this.update = function (changes) {
                if (angular.isUndefined($scope.resource) || $scope.resource.length == 0) {
                    AppService.pageNotFound();
                    return;
                }
                $log.debug("LexActDetailController.update: running update");

                var updateResource = function() {

                    $scope.actSectionDetail = undefined;
                    $scope.actDetail = undefined;
                    $scope.actSectionVersions = undefined;
                    $scope.actSectionVersion = undefined;
                    $scope.actSectionText = undefined;

                    var getDetailPromise = AppService.getData($scope, 'lex', 'act-section-detail', {'resource': $scope.resource});
                    getDetailPromise.then(function (actDetail) {
                        if (actDetail["@graph"].length > 0) {
                            $scope.actSectionDetail = actDetail["@graph"][0];
                            $scope.actDetail = $scope.actSectionDetail["act"][0];
                            AppService.setTitle("Předpis č. " + $scope.actDetail["actId"] + ", " + $scope.actSectionDetail["title"]);
                        }
                        else {
                            $scope.actSectionDetail = null;
                            $scope.actDetail = null;
                            AppService.setTitle("Předpis nenalezen");
                        }
                    });

                    var getVersionsPromise = AppService.getData($scope, 'lex', 'act-section-versions', {'resource': $scope.resource})
                    getVersionsPromise.then(function (actVersions) {
                        $scope.actSectionVersions = actVersions["@graph"];
                    });

                    return $q.all([getDetailPromise, getVersionsPromise])
                };

                var updateVersion = function() {

                    $scope.actSectionText = undefined;

                    var getTextPromise = AppService.getData($scope, 'lex', 'act-section-text', {'resource': $scope.version});
                    getTextPromise.then(function (actSectionText) {
                        if (actSectionText["@graph"].length > 0) {
                            var doc = angular.element("<div>" + actSectionText["@graph"][0]["htmlValue"] + "</div>");
                            var sectionUriPartLength = $scope.resource.length - $scope.actDetail["@id"].length;
                            doc = LexActService.fixSectionsInActText(doc);
                            doc = LexActService.addLinksToActText(doc, $scope.actDetail["@id"], $scope.version.substring(0, $scope.version.length - sectionUriPartLength));
                            $scope.actSectionText = doc.html();
                        }
                        else $scope.actSectionText = null;
                    });
                    return $q.all([getTextPromise]);
                };

                var resourceLoaded = $q.defer();
                if (angular.isDefined(changes.resource)) {
                    updateResource()
                        .then(function() {
                            if (angular.isUndefined($scope.version) && angular.isDefined($scope.actSectionDetail)) {
                                $log.debug("LexActDetailController.update: setting version parameter");
                                AppService.setParam("version", $scope.actSectionDetail["expression"], true);
                            }
                            resourceLoaded.resolve();
                        });
                } else {
                    resourceLoaded.resolve();
                }

                var versionLoaded = $q.defer();
                resourceLoaded.promise.then(function() {
                    if (angular.isDefined($scope.resource) && angular.isDefined(changes.version)) {

                        $scope.actSectionVersion = undefined;
                        angular.forEach($scope.actSectionVersions, function (version, key) {
                            if (version['@id'] == $scope.version) {
                                $scope.actSectionVersion = version;
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

