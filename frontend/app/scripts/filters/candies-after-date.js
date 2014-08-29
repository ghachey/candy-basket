'use strict';

/**
 * @ngdoc filter
 * @name nasaraCandyBasketApp.filter:candiesAfterDate
 * @function
 * @description
 * # candiesAfterDate
 * Filter in the nasaraCandyBasketApp. Takes a list of candies and input and 
 * keeps those with a date larger than the given date. This is
 * not yet used but meant to be used when adding back the ui-slider.
 * It could easily be made a little more performant if needed.
 * 
 * @param {Array} candies is an array of Candy object with a date property
 * @param {Date} cutoff a cutoff Date object
 * @return {Array} resultSet of candies with dates after cutoff date
 */
angular.module('nasaraCandyBasketApp')
  .filter('candiesAfterDate', function () {
    return function(candies, cutoff){
      var resultSet = [];

      candies.forEach(function(candy) {
        var compDate = new Date(Date.parse(candy.date));
        if (compDate >= cutoff){
	  resultSet.push(candy);
        }
      });

      return resultSet;
    };
  });
