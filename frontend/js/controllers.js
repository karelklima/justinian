var appControllers;

appControllers = angular.module('appControllers', [
    'appServices'
]);

appControllers.controller('RootController', ['$scope', 'ConfigurationService', 'UrlService', 'AppService', '$log', function ($scope, ConfigurationService, UrlService, AppService, $log) {

    // pokud mame url ve tvaru /#?type=xxx&resource=yyy najdeme defaultni aplikaci pro zadany typ
    if (!UrlService.isParam('module') && !UrlService.isParam('application')
        && UrlService.isParam('type') && UrlService.isParam('resource')) {
        var path = ConfigurationService.getDefaultModuleApplication(UrlService.getParam('type'));
        if (angular.isDefined(path)) {
            path.resource = UrlService.getParam('resource');
            delete path.priority;
            UrlService.setUrl(path, true);
        } else {
            UrlService.setUrl(configuration.application.home, true);
        }
        return;
    }

    // if there are not any params - need to open default application
    if(!UrlService.isParam('module') && !UrlService.isParam('application')
               && !UrlService.isParam('type') && !UrlService.isParam('resource')){
        UrlService.setUrl(configuration.application.home);
        return;
    }
    // pokud neexistuje aplikace, kterou mame zobrazit jdeme na errorpage
    if (!ConfigurationService.isModuleApplication(UrlService.getParam('module'), UrlService.getParam('application'))) {
        UrlService.setUrlError();
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
