'use strict';

describe('Service: stateTracker', function () {

  // load the service's module
  beforeEach(module('nasaraCandyBasketApp'));

  // instantiate service
  var stateTracker;
  beforeEach(inject(function (_stateTracker_) {
    stateTracker = _stateTracker_;
  }));

  it('should return known default values', function () {
    expect(stateTracker.state.timelineValues.index).toBe(0);
    expect(stateTracker.state.timelineValues.modal_open).toBe(false);
  });

  it('should mutate in prediactable way', function () {
    stateTracker.state.timelineValues.index =  10;
    stateTracker.state.timelineValues.modal_open = true;
    expect(stateTracker.state.timelineValues.index).toBe(10);
    expect(stateTracker.state.timelineValues.modal_open).toBe(true);
  });

});
