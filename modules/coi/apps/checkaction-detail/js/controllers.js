(function() {
    angular.module('appControllers')
        .controller('CoiCheckactionDetailController', ['$scope', '$log', 'AppService',  function ($scope, $log, AppService) {

            $scope.data = undefined;

            this.update = function() {

                AppService.getData($scope, 'coi', 'checkaction-detail', {'resource': $scope.resource})
                    .then(function(data) {
                        $scope.data = data["@graph"][0];
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);
})();
