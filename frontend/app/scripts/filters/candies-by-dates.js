/* global moment */

'use strict';

/**
 * @ngdoc filter
 * @name nasaraCandyBasketApp.filter:candiesByDates
 * @function
 * @description
 *
 * # candiesByDates Filter in the nasaraCandyBasketApp that reduces a
 * list of candies between a start and an end date. A second is
 * subtracted from the start date and added to the end date to make
 * sure that in the very unlikely event in which the start date or end
 * date is exactly the same as the candy created date the candy should
 * be included. This function uses ECMASCRIPT 5.1's filter function on
 * arrays and requires fairly recent browsers to work (see {@link
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter}
 * for details).
 *
 * @param {Array} candies is an array of Candy objects
 * @param {Date} start a date used as start threshold in seconds since
 * Unix Epoch. Defaults to 0 (beginning of Unix epoch) when undefined
 * @param {Date} end a date used as end threshold in seconds since
 * Unix Epoch. Defaults to now when undefined.
 * @return {Array} resultSet of candies between start and end dates
 */
angular.module('nasaraCandyBasketApp')
  .filter('candiesByDates', function () {
    return function (candies, start, end) {
      var startDate = start ? moment.unix(start).subtract(1, 'seconds') : 
            moment(0);
      var endDate = end ? moment.unix(end).add(1, 'seconds') : 
            moment(); 
      return candies.filter(function(candy) {
        var created = moment(candy.date);
        return created.isAfter(startDate) && created.isBefore(endDate);
      });
    };
  });
