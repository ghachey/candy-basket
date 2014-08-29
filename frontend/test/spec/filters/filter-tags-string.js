'use strict';

describe('Filter: filterTagsString', function () {

  // load the filter's module
  beforeEach(module('nasaraCandyBasketApp'));

  // initialize a new instance of the filter before each test
  var filterTagsString;
  beforeEach(inject(function ($filter) {
    filterTagsString = $filter('filterTagsString');
  }));

  it('DEPRECATED filter to be removed, no tests are written. ', function () {
  });

});
