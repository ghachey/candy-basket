'use strict';

describe('Service: utilities', function () {

  // load the service's module
  beforeEach(module('nasaraCandyBasketApp'));

  // instantiate service
  var utilities;
  beforeEach(inject(function (_utilities_) {
    utilities = _utilities_;
  }));

  it('should compare object date fields returning -1, 0 or 1', function () {
    var obj1 = {'title': 'Some title', 'date': new Date("1995-12-17T03:24:01")};
    var obj2 = {'title': 'Some title', 'date': new Date("1995-12-17T03:24:00")};
    var obj3 = {'title': 'Some title', 'date': new Date("1996-12-17T03:24:00")};
    var obj4 = {'title': 'Some title', 'date': new Date("1997-12-17T03:24:00")};
    var obj5 = {'title': 'Some title', 'date': new Date("1995-12-17T03:23:01")};
    expect(utilities.compareByDates(obj1, obj2)).toBe(1);
    expect(utilities.compareByDates(obj2, obj3)).toBe(-1);
    expect(utilities.compareByDates(obj2, obj2)).toBe(0);
    expect(utilities.compareByDates(obj4, obj5)).toBe(1);
    expect(utilities.compareByDates(obj5, obj4)).toBe(-1);
    expect(utilities.compareByDates(obj2, obj5)).toBe(1);
    expect(utilities.compareByDates(obj5, obj2)).toBe(-1);
  });

});
