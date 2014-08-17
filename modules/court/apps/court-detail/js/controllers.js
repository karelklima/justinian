(function(angular) {
    angular.module('appControllers')
        .controller('CourtDetailController', ['$scope', '$sce', 'AppService', function ($scope, $sce, AppService) {
            $scope.courtDetail = undefined;

            $scope.isEmpty = function() {
                return angular.isDefined($scope.courtDetail) && $scope.courtDetail.length === 0;
            };
            $scope.isLocationAvailable = function(){
                if(angular.isUndefined($scope.courtDetail)) return false;
                return angular.isDefined($scope.courtDetail["streetAddress"]) && angular.isDefined($scope.courtDetail["locality"]);
            }
             $scope.isLoading = function() {
                return angular.isUndefined($scope.courtDetail);
            };

            this.update = function(){
                AppService.getData($scope, 'court', 'court-detail', {'resource': $scope.resource})
                    .then(function(data){
                        console.log(data);
                        if(data["@graph"].length>0){
                            $scope.courtDetail = data["@graph"][0];
                            AppService.setTitle($scope.courtDetail.title);
                            if($scope.isLocationAvailable()){
                                var google_maps_url = "https://www.google.cz/maps/embed/v1/search?key=AIzaSyBI6JFokjlnevxRI3FXFwdIwTWXXfw4OPs&q="+
                                ($scope.courtDetail["streetAddress"]+" "+
                                (angular.isDefined($scope.courtDetail["postalCode"])?($scope.courtDetail["postalCode"]+" "):"")+
                                $scope.courtDetail["locality"]).replace(" ","+");
                                document.getElementById("google_maps_window").src = google_maps_url;
                            }
                        }
                        else {
                            $scope.courtDetail = {};
                            AppService.setTitle("Soud nenalezen");
                        }
                    });
            }

            AppService.init($scope,['resource'], this.update);
        }]);
})(angular);