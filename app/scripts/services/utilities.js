'use strict';

/**
 * @ngdoc service
 * @name nasaraCandyBasketApp.utilities
 * @description
 * # utilities
 * Factory in the nasaraCandyBasketApp.
 */
angular.module('nasaraCandyBasketApp')
  .factory('utilities', function () {

    // Public API here
    return {
      compareByDates: function (a, b) {
        if (a.date < b.date) {
          return -1;
        }
        if (a.date > b.date) {
          return 1;
        }
        return 0;
      }
    };
  });
