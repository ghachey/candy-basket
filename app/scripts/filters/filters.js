'use strict';

/* Filters */

var filters = angular.module('nasaraCandyBasketApp');

/**
 * Custom angular filter that takes a string of comma separated list
 * of tags and a predicate function.
 *
 * This is only used with a plain input box for testing. Another
 * filter is used below to filter the custom taglist element.
 *
 * Also, this filter does not work with spaces between tags, but it is
 * good enough to test and get started on the real tags filter.
 **/
filters.filter("filterTagsString", function() {
  return function(input, tagsSearchedString, cutoff) {

    var tags = null; // entered tags used to filter
    var input_filtered = []; // to be returned based on tags
    cutoff = typeof cutoff !== 'undefined' ? cutoff : 0;

    // no search or search started without a full tag yet...
    // return unfiltered input
    if (!tagsSearchedString || !tagsSearchedString.contains(",")) {
      return input;
    } else {
      // at least one search tag provided
      // Strip off trailing chars and only keep completed tags
      if (tagsSearchedString.endsWith(",")) {
	tags = removeTrailingEmpty(tagsSearchedString.split(','));
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

filters.filter("filterCandiesByDate", function(){
  return function(candies, cutoff){
    var result_set = [];

    $.each(candies, function(index, this_candy){
      var comp_date = new Date(Date.parse(this_candy['date']));
      if (comp_date >= cutoff){
	result_set.push(this_candy);
      }
    });

    return result_set;

  };
});

/**
 * Custom angular filter that takes a array of tags and a predicate
 * function.
 *
 * This is used with the custom taglist element used for searching
 * tags with nice auto-completion and tag formatting.
 **/
filters.filter("filterTagsArray", function() {
  return function(input, tags, cutoff) {

    var sort_tags = function(a,b){

      if (a === 'surprise' || a === 'challenge' || a === 'confirm'){
	return -1;
      }
      if (b === 'surprise' || b === 'challenge' || b === 'confirm'){
	return 1;
      }
      
      if (a < b){
	return -1;
      }
      if (a == b){
	return 0;
      }
      
      return 1;
    };

    var input_filtered = []; // to be returned based on tags

    if (!tags) { // If the tag list is not yet defined, make it an empty one
      tags = [];
    }

    if (input && isArray(input)){ // Not an array causes errors (no tags)
      input.forEach(
	function(elem) {
	  // Filter by date first - it's less expensive
	  cutoff = typeof cutoff !== 'undefined' ? cutoff : 0;
	  var comp_date = new Date(Date.parse(elem['date']));
	  if (comp_date >= cutoff){
	    if (elem.tags){
	      elem.tags.sort(sort_tags);
	      if (_.isEqual(_.intersection(tags,elem.tags), tags)) {
		input_filtered.push(elem);
	      }
	    }
	  }
	});
    } else {
      //console.log("Not an array: ", input);
    }

    return input_filtered;

  };
});


filters.filter("fromNow", function() {
  return function(dtString) {
    return moment(dtString,"YYYY-MM-DDThh:mm:ss").fromNow();
  };
});

// strip single quote which was causing errors when checking for
// 'challenge', 'surprise', 'confirm'
filters.filter("strip", function() {
  return function(tag) {
    return tag.replace("'","");
  };
});
