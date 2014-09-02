(function () {


    /**
     * Controllers module
     */
    angular.module('appControllers', [
        'appServices'
    ])

    /**
     * Root controller - main application controller - process basic url parameters to choose main application and load applications to other content boxes
     */
        .controller('RootController', ['$scope', 'ConfigurationService', 'UrlService', 'AppService', '$log', function ($scope, ConfigurationService, UrlService, AppService, $log) {

            // url format /#?type=xxx&resource=yyy - need to find default application for defined type
            if (!UrlService.isParam('module') && !UrlService.isParam('application')
                && UrlService.isParam('type') && UrlService.isParam('resource')) {

                var path = ConfigurationService.getDefaultModuleApplication(UrlService.getParam('type'));

                // select application to load in main view
                var params = UrlService.getAllParams();
                if (angular.isDefined(path)) {
                    delete params["type"];
                    angular.extend(params, path)
                } else {
                    params = ConfigurationService.getPageNotFoundApplication();
                }

                UrlService.setUrl(params, true);
                return;
            }

            //  there are not any params - need to open default home application
            if (!UrlService.isParam('module') && !UrlService.isParam('application')
                && !UrlService.isParam('type') && !UrlService.isParam('resource')) {
                UrlService.setUrl(configuration.application.home);
                return;
            }

            $scope.mainTemplateUrl = ConfigurationService.getMainTemplate();

            // requested application or its main view does not exist
            if (angular.isUndefined($scope.mainTemplateUrl)) {
                AppService.pageNotFound();
                return;
            }

            AppService.setTitle(ConfigurationService.getModuleApplicationTitle(UrlService.getParam('module'), UrlService.getParam('application')));

            // load templates for content boxes from configuration
            $scope.sidebarTemplates = ConfigurationService.getTemplates('sidebar');
            $scope.logoTemplates = ConfigurationService.getTemplates('logo');
            $scope.headerLeftTemplates = ConfigurationService.getTemplates('header-left');
            $scope.headerRightTemplates = ConfigurationService.getTemplates('header-right');
            $scope.contentTopTemplates = ConfigurationService.getTemplates('content-top');
            $scope.contentBottomTemplates = ConfigurationService.getTemplates('content-bottom');
            $scope.footerTopTemplates = ConfigurationService.getTemplates('footer-top');
            $scope.footerBottomTemplates = ConfigurationService.getTemplates('footer-bottom');

        }]);

})();