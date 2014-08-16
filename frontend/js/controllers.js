var appControllers;

appControllers = angular.module('appControllers', [
    'appServices'
]);

appControllers.controller('RootController', ['$scope', 'ConfigurationService', 'UrlService', 'AppService', '$log', function ($scope, ConfigurationService, UrlService, AppService, $log) {

    // pokud mame url ve tvaru /#?type=xxx&resource=yyy najdeme defaultni aplikaci pro zadany typ
    if (!UrlService.isParam('module') && !UrlService.isParam('application')
        && UrlService.isParam('type') && UrlService.isParam('resource')) {

        var path = ConfigurationService.getDefaultModuleApplication(UrlService.getParam('type'));

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

    // if there are not any params - need to open default application
    if(!UrlService.isParam('module') && !UrlService.isParam('application')
               && !UrlService.isParam('type') && !UrlService.isParam('resource')){
        UrlService.setUrl(configuration.application.home);
        return;
    }

    // requested application or its main view does not exist
    if (angular.isUndefined(ConfigurationService.getMainTemplate())) {
        AppService.pageNotFound();
        return;
    }

    AppService.setTitle(ConfigurationService.getModuleApplicationTitle(UrlService.getParam('module'), UrlService.getParam('application')));

    $scope.mainTemplateUrl = ConfigurationService.getMainTemplate();
    $scope.sidebarTemplates = ConfigurationService.getTemplates('sidebar');
    $scope.logoTemplates = ConfigurationService.getTemplates('logo');
    $scope.headerLeftTemplates = ConfigurationService.getTemplates('header-left');
    $scope.headerRightTemplates = ConfigurationService.getTemplates('header-right');
    $scope.contentTopTemplates = ConfigurationService.getTemplates('content-top');
    $scope.contentBottomTemplates = ConfigurationService.getTemplates('content-bottom');
    $scope.footerTopTemplates = ConfigurationService.getTemplates('footer-top');
    $scope.footerBottomTemplates = ConfigurationService.getTemplates('footer-bottom');

}]);
