var appControllers;

appControllers = angular.module('appControllers', [
    'appServices'
]);

appControllers.controller('RootController', ['$scope', 'ConfigurationService', 'UrlService', 'PageService', '$log', function ($scope, ConfigurationService, UrlService, PageService, $log) {

    // pokud mame url ve tvaru /#?type=xxx&resource=yyy najdeme defaultni aplikaci pro zadany typ
    if (!UrlService.isParam('module') && !UrlService.isParam('application')
        && UrlService.isParam('type') && UrlService.isParam('resource')) {
        var path = ConfigurationService.getDefaultModuleApplication(UrlService.getParam('type'));
        if (angular.isDefined(path)) {
            UrlService.setUrl(path.module, path.application, ['resource']);
        } else {
            UrlService.setUrl(configuration.application.home.module, configuration.application.home.application);
        }
        return;
    }

    // if there are not any params - need to open default application
    if(!UrlService.isParam('module') && !UrlService.isParam('application')
               && !UrlService.isParam('type') && !UrlService.isParam('resource')){
        UrlService.setUrl(configuration.application.home.module, configuration.application.home.application);
        return;
    }
    // pokud neexistuje aplikace, kterou mame zobrazit jdeme na errorpage
    if (!ConfigurationService.isModuleApplication(UrlService.getParam('module'), UrlService.getParam('application'))) {
        UrlService.setUrlError();
        return;
    }

    PageService.setTitle(ConfigurationService.getDefaultTitle());

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
