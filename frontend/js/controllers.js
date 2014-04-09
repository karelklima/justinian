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

    if (urlService.isParam('type')) {

        // TODO
    }

    $scope.type = urlService.getParam('type');

    this.logoTemplateUrl = 'partials/logo.' + home.module + '.html';
    this.applicationTemplateUrl = $scope.module + '/' + $scope.application + '/partials/main.html';
    this.sidebarTemplateUrl = 'partials/sidebar.html';
    this.sidebarTemplates = configurationService.getSidebarTemplates($scope.type, $scope.module, $scope.application);

    $scope.url = urlService;
});