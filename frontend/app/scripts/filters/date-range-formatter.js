/* global moment */

'use strict';

/**
 * @ngdoc filter
 * @name nasaraCandyBasketApp.filter:dateRangeFormatter
 * @function
 * @description
 * # dateRangeFormatter
 * Filter in the nasaraCandyBasketApp that simply take an range array of unix
 * milliseconds dates and returns a user friendly date range.
 */
angular.module('nasaraCandyBasketApp')
  .filter('dateRangeFormatter', function () {
    return function (input) {
      if (input) {
        var oldest = moment.unix(input[0]);
        var newest = moment.unix(input[1]);
        return oldest.format('Do MMMM YYYY') + ' and ' + 
          newest.format('Do MMMM YYYY');
      } else {
        return 'loading range...';
      }
    };
  });
