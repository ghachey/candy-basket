/* global _ */

'use strict';

/**
 * @ngdoc filter
 * @name nasaraCandyBasketApp.filter:candiesByTags
 * @function
 * @description
 * # candiesByTags
 * Filter in the nasaraCandyBasketApp. A filter used to reduce an array of candies
 * based on a given set of tags
 * 
 * @param {Array} input of candy objects
 * @param {Array} tags of tags used in filtering
 * @return {Array} inputFiltered of candy objects containing tags
 */
angular.module('nasaraCandyBasketApp')
  .filter('candiesByTags', function (utilities) {
    return function (input, tags) {
      var inputFiltered = []; // to be returned based on tags

      // TODO - De-couple this sorting functionality to make it more flexible
      // That way we can sort on candies retrieval once, and not here
      // Every time and candies list is filtered (e.g. on every tag search)
      var sortTags = function(a, b) {

        if (a === 'surprise' || a === 'challenge' || a === 'confirm'){
	  return -1;
        }
        if (b === 'surprise' || b === 'challenge' || b === 'confirm'){
	  return 1;
        }
        
        if (a < b){
	  return -1;
        }
        if (a === b){
	  return 0;
        }
        
        return 1;
      };

      if (!tags) { // If the tag list is not yet defined, make it an empty one
        tags = [];
      }

      if (input && utilities.isArray(input)){ // Not an array causes errors (no tags)
        input.forEach(
	  function(candy) {
	    if (candy.tags){
	      candy.tags.sort(sortTags);
	      if (_.isEqual(_.intersection(tags, candy.tags), tags)) {
		inputFiltered.push(candy);
	      }
	    }
	  });
      } else {
        //console.log('Not an array: ', input);
      }

      return inputFiltered;
    };
  });
