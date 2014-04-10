var appControllers;

appControllers = angular.module('appControllers', [
    'appServices'
]);

appControllers.controller('MainController', function ($scope, configurationService, urlService) {

    // pokud mame url ve tvaru /?type=xxx&resource=yyy najdeme defaultni aplikaci pro zadany typ
    if (!urlService.isParam('module') && !urlService.isParam('application')
        && urlService.isParam('type') && urlService.isParam('resource')) {
        var path = configurationService.getDefaultModuleApplication(urlService.getParam('type'));
        urlService.setPath(path.module, path.application);
        urlService.setParam('type', null);
        return;
    }

    // pokud neexistuje aplikace, kterou mame zobrazit jdeme na homepage
    if (!configurationService.isModuleApplication(urlService.getParam('module'), urlService.getParam('application'))) {
        urlService.setUrlHome();
        return;
    }

    $scope.module = urlService.getParam('module');
    $scope.application = urlService.getParam('application');
    $scope.type = configurationService.getType($scope.module, $scope.application);
    $scope.url = urlService;

    this.infoTemplateUrl = home.module + '/info/partials/info.html';
    this.logoTemplateUrl = home.module + '/logo/partials/logo.html';
    this.mainTemplateUrl = $scope.module + '/' + $scope.application + '/partials/main.html';
    this.menuTemplateUrl = home.module + '/menu/partials/menu.html';
    this.searchTemplateUrl = home.module + '/searchbar/partials/searchbar.html';
    this.sidebarTemplateUrls = configurationService.getSidebarTemplates($scope.type, $scope.module, $scope.application);

});