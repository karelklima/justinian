(function () {
    angular.module('appFilters')

        /**
        * Formátování datumu do šablony d. M. yyyy
        * @param Datum
        * @return Datum ve formatu d. M. yyyy
        */
        .filter('formatDate', ['$filter', function ($filter) {
            return function (date) {
                return $filter('date')(date, 'd. M. yyyy'); // TODO do konfigurace?
            }
        }])

        /**
        * Jestliže číslo je nula, tak vrátit prázdný řetěz.
        * @param {(string|number)} number - Číslo
        * @return {(string|number)} - Číslo nebo prázdný řetěz.
        */
        .filter('formatZero', [function () {
            return function (number) {
                return (number == 0) ? "" : number; // it can be string "0" or number 0, do not use ===
            }
        }])

        /**
        * Nahradit pomlčky mezerami.
        * @param {string} Text
        * @return {string} Text bez pomlček
        */
        .filter('formatDash', function () {
            return function (text) {
                return text.replace(/\-/g, ' ');
            }
        })

        /**
        * Vybrat jednu stránku z pole výsledků
        * @param {array} input - Všechny výsledky.
        * @param {number} page - Index stránky. Index se začíná od 1.
        * @param {number} limit - Množství výsledků pro jednu stránku
        * @return {array} - Vybrané výsledky.
        */
        .filter('select', function () {
            return function (input, page, limit) {
                var start = (page - 1) * limit;
                var end = page * limit;
                return angular.isDefined(input) ? input.slice(start, end) : undefined;
            }
        })

        /**
        * Spojit všechny elementy vstupu do jednoho řetězce
        * @param {array} input - Elementy pro spojení
        * @param {string} [joinString=", "] - Spojovací řetězec
        * @return {string} - Výstupní řetězec.
        */
        .filter('join', function() {
            return function(input, joinString) {
                joinString = angular.isDefined(joinString) ? joinString : ", ";
                return angular.isArray(input) ? input.join(joinString) : input;
            }
        })
})();
