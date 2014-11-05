'use strict';

describe('Filter: dateRangeFormatter', function () {

  // load the filter's module
  beforeEach(module('nasaraCandyBasketApp'));

  // initialize a new instance of the filter before each test
  var dateRangeFormatter;
  beforeEach(inject(function ($filter) {
    dateRangeFormatter = $filter('dateRangeFormatter');
  }));

  it('should return a nicely formatted date range', function () {
    var mockedInput = [1384773417,1386860422];
    var formattedRange =  'From 18th November 2013<br /> to <br />12th December 2013';
    expect(dateRangeFormatter(mockedInput)).toBe(formattedRange);
  });

});
