/*global moment */

'use strict';

/**
 * @ngdoc filter
 * @name nasaraCandyBasketApp.filter:dateFromNow
 * @function
 * @description
 * # dateFromNow
 * Filter in the nasaraCandyBasketApp. Used to display more user friendly 
 * date format (1 second ago, 2 days ago...).
 */
angular.module('nasaraCandyBasketApp')
  .filter('dateFromNow', function () {
    return function(dtString) {
      return moment(dtString,'YYYY-MM-DDThh:mm:ssZ').fromNow();
    };
  });
