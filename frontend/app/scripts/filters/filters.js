'use strict';

/* Filters */

var filters = angular.module('nasaraCandyBasketApp');

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
