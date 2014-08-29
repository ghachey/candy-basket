'use strict';

describe('Filter: dateFromNow', function () {

  // load the filter's module
  beforeEach(module('nasaraCandyBasketApp'));

  // initialize a new instance of the filter before each test
  var dateFromNow;
  beforeEach(inject(function ($filter) {
    dateFromNow = $filter('dateFromNow');
  }));

  it('should return user friendly from now date', function () {
    var d1 = JSON.stringify(moment().subtract(1, 'days'));
    var d2 = JSON.stringify(moment().subtract(2, 'minutes'));
    var d3 = JSON.stringify(moment().subtract(3, 'months'));
    var d4 = JSON.stringify(moment().subtract(1, 'years'));
    var d5 = JSON.stringify(moment().subtract(45, 'seconds'));

    expect(dateFromNow(d1)).toBe('a day ago');
    expect(dateFromNow(d2)).toBe('2 minutes ago');
    expect(dateFromNow(d3)).toBe('3 months ago');
    expect(dateFromNow(d4)).toBe('a year ago');
    expect(dateFromNow(d5)).toBe('a minute ago');
  });

});
