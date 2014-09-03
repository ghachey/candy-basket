'use strict';

/**
 * @ngdoc filter
 * @name nasaraCandyBasketApp.filter:stripQuote
 * @function
 * @description
 * # stripQuote
 * Filter in the nasaraCandyBasketApp. Strip single quote which was causing 
 * errors when checking for 'challenge', 'surprise', 'confirm' in
 * candy-list-table.html view. I have notice the same bug
 * samewhere in timeline view but left it as I was working on something else
 * 
 * @param {String} input a single tag to remove single quotes from.
 * also works on any string.
 * @return {String} output the same string without the single quote
 */
angular.module('nasaraCandyBasketApp')
  .filter('stripQuote', function () {
    return function(input) {
      return input.replace('\'','');
    };
  });
