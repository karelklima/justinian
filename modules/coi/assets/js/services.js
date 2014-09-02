(function () {

    angular.module('appServices')

        .service('CoiUtilService', ['$filter', function ($filter) {

            /**
             * transforms the names of Czech regions to their standard abbreviations
             * @param {string} region
             * @return {string}
             */
            this.abbreviateRegion = function (region) {
                var regions = {
                    "Hlavní město Praha": "PHA",
                    "Středočeský kraj": "STČ",
                    "Jihočeský kraj": "JHČ",
                    "Plzeňský kraj": "PLK",
                    "Karlovarský kraj": "KVK",
                    "Ústecký kraj": "ULK",
                    "Liberecký kraj": "LBK",
                    "Královéhradecký kraj": "HKK",
                    "Pardubický kraj": "PAK",
                    "Kraj Vysočina": "VYS",
                    "Jihomoravský kraj": "JHM",
                    "Olomoucký kraj": "OLK",
                    "Zlínský kraj": "ZLK",
                    "Moravskoslezský kraj": "MSK"
                };
                return regions[region];
            };

        }]);

})();