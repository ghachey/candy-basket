'use strict';

/* Filters */

var filters = angular.module('nasaraCandyBasketApp');

// strip single quote which was causing errors when checking for
// 'challenge', 'surprise', 'confirm'
filters.filter("strip", function() {
  return function(tag) {
    return tag.replace("'","");
  };
});
