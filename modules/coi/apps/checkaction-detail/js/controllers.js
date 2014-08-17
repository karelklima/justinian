(function() {
    angular.module('appControllers')
        .controller('CoiCheckactionDetailController', ['$scope', '$log', 'AppService',  function ($scope, $log, AppService) {

            $scope.data = undefined;

            $scope.isEmpty = function () {
                return !$scope.isLoading && angular.isDefined($scope.data) && $scope.data.length === 0;
            };

            $scope.isLocationAvailable = function(){
                if(angular.isUndefined($scope.data)) return false;
                return angular.isDefined($scope.data["street"]) && angular.isDefined($scope.data["locality"]);
            };

            this.update = function() {

                AppService.getData($scope, 'coi', 'checkaction-detail', {'resource': $scope.resource})
                    .then(function(data) {
                        $scope.data = data["@graph"][0];
                        if($scope.isLocationAvailable()){

                            var locationParam = $scope.data["street"]+", "+
                                (angular.isDefined($scope.data["zipcode"])?($scope.data["zipcode"]+" "):"");

                            locationParam = locationParam + $scope.data["locality"].replace(/[0-9]+$/, "");

                            locationParam = locationParam.replace(/ /g,"+");

                            var google_maps_url = "https://www.google.cz/maps/embed/v1/search?key=AIzaSyBI6JFokjlnevxRI3FXFwdIwTWXXfw4OPs&q="+
                                locationParam;
                            console.log(google_maps_url);
                            document.getElementById("google_maps_window").src = google_maps_url;
                        }
                    });
            };

            AppService.init($scope, ['resource'], this.update);

        }]);
})();
