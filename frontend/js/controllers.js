var appControllers;

appControllers = angular.module('appControllers', [
    'appServices'
]);

appControllers.controller('RootController', ['$scope', 'ConfigurationService', 'UrlService', function ($scope, ConfigurationService, UrlService) {

    // pokud mame url ve tvaru /?type=xxx&resource=yyy najdeme defaultni aplikaci pro zadany typ
    if (!UrlService.isParam('module') && !UrlService.isParam('application')
        && UrlService.isParam('type') && UrlService.isParam('resource')) {
        var path = ConfigurationService.getDefaultModuleApplication(UrlService.getParam('type'));
        UrlService.setUrl(path.module, path.application, ['resource']);
        return;
    }

    // pokud neexistuje aplikace, kterou mame zobrazit jdeme na errorpage
    if (!ConfigurationService.isModuleApplication(UrlService.getParam('module'), UrlService.getParam('application'))) {
        UrlService.setUrlError();
        return;
    }

    this.mainTemplateUrl = ConfigurationService.getMainTemplate();
    this.sidebarTemplateUrls = ConfigurationService.getTemplates('sidebar');
    this.logoTemplateUrls = ConfigurationService.getTemplates('logo');
    this.headerLeftTemplateUrls = ConfigurationService.getTemplates('header-left');
    this.headerRightTemplateUrls = ConfigurationService.getTemplates('header-right');
    this.contentTopTemplateUrls = ConfigurationService.getTemplates('content-top');
    this.contentBottomTemplateUrls = ConfigurationService.getTemplates('content-bottom');
    this.footerTopTemplateUrls = ConfigurationService.getTemplates('footer-top');
    this.footerBottomTemplateUrls = ConfigurationService.getTemplates('footer-bottom');

    $scope.url = UrlService;

}]);

appControllers.controller('TitleController', ['PageService', function (PageService) {
    this.value = PageService.getTitle();
}]);