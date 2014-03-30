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

    $scope.url = urlService;
});

appControllers.controller('LogoController', function ($scope) {
    this.templateUrl = 'partials/logo.' + $scope.module + '.html';
});

appControllers.controller('ApplicationController', function ($scope) {
    this.templateUrl = 'partials/application.' + $scope.module + '.' + $scope.application + '.html';
});

appControllers.controller('SidebarController', function ($scope) {
    this.templateUrl = 'partials/sidebar.html';
});