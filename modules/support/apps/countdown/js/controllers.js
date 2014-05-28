/**
 * Created by Karel on 22. 4. 2014.
 */

function LexCountdownController($scope, $timeout){

    $scope.counter = 0;

    var recalculate = function()
    {
        var endMillis = new Date(1406844000000); // 1.8.2014
        var millis = endMillis - new Date();

        var seconds = Math.floor((millis / 1000) % 60);
        var minutes = Math.floor(((millis / (60000)) % 60));
        var hours = Math.floor(((millis / (3600000)) % 24));
        var days = Math.floor(((millis / (3600000)) / 24));

        //add leading zero if number is smaller than 10
        $scope.seconds = seconds < 10 ? '0' + seconds : seconds;
        $scope.minutes = minutes < 10 ? '0' + minutes : minutes;
        $scope.hours =  hours < 10 ? '0' + hours : hours;
        $scope.days =  days < 10 ? '0' + days : days;
    }

    $scope.onTimeout = function(){
        recalculate();
        mytimeout = $timeout($scope.onTimeout,1000);
    };
    var mytimeout = $timeout($scope.onTimeout,0);
}