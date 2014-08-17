(function(angular) {
    angular.module('appControllers')
        .controller('CourtDetailController', ['$scope', 'AppService', function ($scope, AppService) {

            $scope.courtDetail = undefined;

            $scope.isEmpty = function() {
                return angular.isDefined($scope.courtDetail) && $scope.courtDetail == null;
            };

            $scope.isLocationAvailable = function(){
                if(angular.isUndefined($scope.courtDetail)) return false;
                return angular.isDefined($scope.courtDetail["streetAddress"]) && angular.isDefined($scope.courtDetail["locality"]);
            };

            this.update = function(){

                $scope.courtDetail = undefined;

                AppService.getData($scope, 'court', 'court-detail', {'resource': $scope.resource})
                    .then(function(data){
                        if(data["@graph"].length > 0){
                            $scope.courtDetail = data["@graph"][0];
                            AppService.setTitle($scope.courtDetail.title);
                            if($scope.isLocationAvailable()){

                                var locationParam = $scope.courtDetail["streetAddress"]+", "+
                                    (angular.isDefined($scope.courtDetail["postalCode"])?($scope.courtDetail["postalCode"]+" "):"");

                                locationParam = locationParam + $scope.courtDetail["locality"].replace(/[0-9]+$/, "");

                                locationParam = locationParam.replace(/ /g,"+");

                                var google_maps_url = "https://www.google.cz/maps/embed/v1/search?key=AIzaSyBI6JFokjlnevxRI3FXFwdIwTWXXfw4OPs&q="+
                                    locationParam;
                                console.log(google_maps_url);
                                document.getElementById("google_maps_window").src = google_maps_url;
                            }
                        }
                        else {
                            $scope.courtDetail = null;
                            AppService.setTitle("Soud nenalezen");
                        }
                    });
            };

            AppService.init($scope,['resource'], this.update);
        }]);
})(angular);