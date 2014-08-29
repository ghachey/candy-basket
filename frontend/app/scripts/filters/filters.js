'use strict';

/* Filters */

var filters = angular.module('nasaraCandyBasketApp');

/**
 * Custom angular filter that takes a array of tags and a predicate
 * function.
 *
 * This is used with the custom taglist element used for searching
 * tags with nice auto-completion and tag formatting.
 **/
filters.filter("filterTagsArray", function(utilities) {
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

    if (input && utilities.isArray(input)){ // Not an array causes errors (no tags)
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
