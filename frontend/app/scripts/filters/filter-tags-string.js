'use strict';

/**
 * @ngdoc filter
 * @name nasaraCandyBasketApp.filter:filterTagsString
 * @function
 * @description
 * # filterTagsString
 * Filter in the nasaraCandyBasketApp.
 *
 * DEPRECATED - to be removed
 * 
 * This is only used with a plain input box for testing. Another
 * filter is used to filter the custom taglist element.
 * 
 * @see nasaraCandyBasketApp.filter:filterTagsArray
 *
 * Also, this filter does not work with spaces between tags, but it is
 * good enough to test and get started on the real tags filter.
 */
angular.module('nasaraCandyBasketApp')
  .filter('filterTagsString', function (utilities) {
    return function(input, tagsSearchedString, cutoff) {

      var tags = null; // entered tags used to filter
      var input_filtered = []; // to be returned based on tags
      cutoff = typeof cutoff !== 'undefined' ? cutoff : 0;

      // no search or search started without a full tag yet...
      // return unfiltered input
      if (!tagsSearchedString || !utilities.contains(tagsSearchedString, ",")) {
        return input;
      } else {
        // at least one search tag provided
        // Strip off trailing chars and only keep completed tags
        if (utilities.endsWith(tagsSearchedString, ",")) {
	  tags = utilities.removeTrailingEmpty(tagsSearchedString.split(','));
        } else {
	  tags = tagsSearchedString.split(',');
	  tags.pop();
        }

        // should strip off leading and trailing spaces from tags,
        // but it depends how data will come once I connect with
        // Angular model, not sure yet. for now, I just test with
        // no spaces between tags.

        // Check every candy and keep those with all matching searched tags
        input.forEach(function(elem) {
	  // Filter for dates first.
	  var comp_date = new Date(Date.parse(elem.date));
	  if (comp_date >= cutoff){
	    console.debug('COMP: ', comp_date, ' CUTOFF: ', cutoff);

	    if (_.isEqual(_.intersection(tags,elem.tags), tags)) {
	      input_filtered.push(elem);
	    }
	  }
        });
      }

      return input_filtered;
      
    };
  });
