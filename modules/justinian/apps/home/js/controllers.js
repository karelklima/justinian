(function() {
    angular.module('appControllers')
        .controller('JustinianHomeController', ['$scope', '$sce', 'NetworkService', 'AppService', function ($scope, $sce, NetworkService, AppService) {

            $scope.predpisy = [
                {
                    title: "Autorský zákon",
                    resource: "legislation:act/2000/121-2000"
                },
                {
                    title: "Daňový řád",
                    resource: "legislation:act/2009/280-2009"
                },
                {
                    title: "Exekuční řád",
                    resource: "legislation:act/2001/120-2001"
                },
                {
                    title: "Insolvenční zákon",
                    resource: "legislation:act/2006/182-2006"
                },
                {
                    title: "Katastrální zákon",
                    resource: "legislation:act/1992/344-1992"
                },
                {
                    title: "Občanský soudní řád",
                    resource: "legislation:act/1963/99-1963"
                },
                {
                    title: "Občanský zákoník",
                    resource: "legislation:act/2012/89-2012"
                },
                {
                    title: "Občanský zákoník (starý)",
                    resource: "legislation:act/1964/40-1964"
                },
                {
                    title: "Soudní řád správní",
                    resource: "legislation:act/2002/150-2002"
                },
                {
                    title: "Správní řád",
                    resource: "legislation:act/2004/500-2004"
                },
                {
                    title: "Stavební zákon",
                    resource: "legislation:act/2006/183-2006"
                },
                {
                    title: "Trestní řád",
                    resource: "legislation:act/1961/141-1961"
                },
                {
                    title: "Trestní zákoník",
                    resource: "legislation:act/2009/40-2009"
                },
                {
                    title: "Ústava České republiky",
                    resource: "legislation:act/1993/1-1993"
                },
                {
                    title: "Zákon o dani z přidané hodnoty",
                    resource: "legislation:act/2004/235-2004"
                },
                {
                    title: "Zákon o daních z příjmů",
                    resource: "legislation:act/1992/586-1992"
                },
                {
                    title: "Zákon o obchodních korporacích",
                    resource: "legislation:act/2012/90-2012"
                },
                {
                    title: "Zákon o rodině",
                    resource: "legislation:act/1963/94-1963"
                },
                {
                    title: "Zákon o účetnictví",
                    resource: "legislation:act/1991/563-1991"
                },
                {
                    title: "Zákoník práce",
                    resource: "legislation:act/2006/262-2006"
                },
                {
                    title: "Živnostenský zákon",
                    resource: "legislation:act/1991/455-1991"
                }
            ];


        }]);

})();

