var appControllers;

appControllers = angular.module('appControllers', [
    'appServices'
]);

appControllers.controller('MainController', function ($scope, ConfigurationService, UrlService, UtilService) {

    // pokud mame url ve tvaru /?type=xxx&resource=yyy najdeme defaultni aplikaci pro zadany typ
    if (!UrlService.isParam('module') && !UrlService.isParam('application')
        && UrlService.isParam('type') && UrlService.isParam('resource')) {
        var path = ConfigurationService.getDefaultModuleApplication(UrlService.getParam('type'));
        UrlService.setPath(path.module, path.application);
        UrlService.setParam('type', null);
        return;
    }

    // pokud neexistuje aplikace, kterou mame zobrazit jdeme na errorpage
    if (!ConfigurationService.isModuleApplication(UrlService.getParam('module'), UrlService.getParam('application'))) {
        UrlService.setUrlError();
        return;
    }

    $scope.module = UrlService.getParam('module');
    $scope.application = UrlService.getParam('application');
    $scope.types = ConfigurationService.getTypes($scope.module, $scope.application);
    $scope.url = UrlService;

    this.infoTemplateUrl = ConfigurationService.getTemplate('info');
    this.logoTemplateUrl = ConfigurationService.getTemplate('logo');
    this.mainTemplateUrl = UtilService.getTemplateUrl($scope.module, $scope.application, 'main');
    this.menuTemplateUrl = ConfigurationService.getTemplate('menu');
    this.searchTemplateUrl = ConfigurationService.getTemplate('searchbar');
    this.sidebarTemplateUrls = ConfigurationService.getSidebarTemplates($scope.types, $scope.module, $scope.application);
    this.showSidebar = (this.sidebarTemplateUrls.length > 0);

});

appControllers.controller('TitleController', function ($scope, TitleService) {
    $scope.title = TitleService.getTitle();
});