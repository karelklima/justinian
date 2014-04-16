/**
 * Created by Fantomaus on 31. 3. 2014.
 */
 function LexDetailController($scope, UrlService, NetworkService){
    $scope.object = null;
    $scope.resource = UrlService.getParam('resource');
//    NetworkService.useApi('lex','act-detail','id='+$scope.resource,function success(data, status){
//                console.log(data);
//                if(data.length > 10){
//                    data = data.slice(0,10);
//                }
//                $scope.object = data;
//                $scope.$digest();
//            },function error(data, status){
//                $scope.object = null;
//                $scope.$digest();
//            });
 }
