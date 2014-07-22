(function() {
    angular.module('appControllers')
        .controller('JustinianSidebarTestController', ['$scope', 'NetworkService', 'AppService', function ($scope, NetworkService, AppService) {

            $scope.message = "Funguje to!";

        }]);
})();