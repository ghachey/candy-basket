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
    var d1 = moment().subtract(1, 'days').format('YYYY-MM-DDThh:mm:ss');
    var d2 = moment().subtract(2, 'minutes').format('YYYY-MM-DDThh:mm:ss');
    var d3 = moment().subtract(3, 'months').format('YYYY-MM-DDThh:mm:ss');
    var d4 = moment().subtract(1, 'years').format('YYYY-MM-DDThh:mm:ss');
    var d5 = moment().subtract(45, 'seconds').format('YYYY-MM-DDThh:mm:ss');
    expect(dateFromNow(d1)).toBe('a day ago');
    expect(dateFromNow(d2)).toBe('2 minutes ago');
    expect(dateFromNow(d3)).toBe('3 months ago');
    expect(dateFromNow(d4)).toBe('a year ago');
    expect(dateFromNow(d5)).toBe('a minute ago');
  });

});
