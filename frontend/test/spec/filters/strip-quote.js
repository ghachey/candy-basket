'use strict';

describe('Filter: stripQuote', function () {

  // load the filter's module
  beforeEach(module('nasaraCandyBasketApp'));

  // initialize a new instance of the filter before each test
  var stripQuote;
  beforeEach(inject(function ($filter) {
    stripQuote = $filter('stripQuote');
  }));

  it('should return string without single quotes', function () {
    var tag1 = 'confirm';
    var tag2 = 'o\'neil';
    expect(stripQuote(tag1)).toBe('confirm');
    expect(stripQuote(tag2)).toBe('oneil');
  });

});
