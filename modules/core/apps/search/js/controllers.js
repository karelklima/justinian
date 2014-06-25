/**
 * Created by Fantomaus on 31. 3. 2014.
 */

function LexSearchController($scope, NetworkService, UrlService, UtilService, $rootScope){
    $scope.results = [];
    $scope.searching = false;
    $scope.query = UrlService.getParam('query');
    $scope.searchIteration = 0; //many search requests in short time interval -> we need to show only last one.
    $scope.search = function(request){
        $scope.searchIteration++;
        var currentIteration = $scope.searchIteration;
        if(angular.isDefined(request)){
            $scope.query = request;
        }
        var query = $scope.query;
        if(!angular.isDefined(query) || query.length == 0)
            return;
        $scope.searching = true;
        NetworkService.useApi('core','core/act-search',[query,0,20],function success(data, status){
            if($scope.searchIteration != currentIteration) return;
            if(!(data instanceof Array)) data = [];
            if(data.length > 10){
                data = data.slice(0,10);
            }
            $scope.results = data;
            $scope.searching = false;
            $scope.$$phase || $scope.$apply();
        },function error(data, status){
            if($scope.searchIteration != currentIteration) return;
            $scope.results = [];
            $scope.searching = false;
            $scope.$$phase || $scope.$apply();
        });
    }
    //decode escaped unicode characters to normal form
    $scope.print = function(item){
        var value = item['http://purl.org/dc/terms/title'][0]['@value'];
        return UtilService.decodeUnicodeString(value);
    }

    $rootScope.$on(LocationParamsChangedEvent.getName(), function(event, eventObject){
        $scope.search(UrlService.getParam('query'));
    });

    if($scope.query!=null)
        $scope.search();
}