var appControllers;

appControllers = angular.module('appControllers', [
    'appServices'
]);

appControllers.controller('MainController', function ($scope, configurationService, urlService) {
    $scope.module = urlService.getParam('module');
    $scope.application = urlService.getParam('application');

    if (!configurationService.isModuleApplication($scope.module, $scope.application)) {
        urlService.setPathHome();
    }

    $scope.types = configurationService.getTypes($scope.module, $scope.application);
    $scope.views = configurationService.getViews($scope.module, $scope.application);

    this.logoTemplateUrl = 'partials/logo.' + home.module + '.html';
    this.sidebarTemplateUrl = 'partials/sidebar.html';
    this.applicationTemplateUrl = $scope.module + '/' + $scope.application + '/partials/main.html';

    if (urlService.isParam('type')) {
        this.sidebarTemplates = configurationService.getSidebarApplicationsTemplates(urlService.getParam('type'), $scope.module, $scope.application);
    } else {
        this.sidebarTemplates = [];
    }

    $scope.url = urlService;
});