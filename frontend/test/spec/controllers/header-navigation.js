'use strict';

describe('Controller: HeaderNavigation', function () {

  // load the controller's module
  beforeEach(module('nasaraCandyBasketApp'));

  var HeaderNavigation,
      scope,
      location,
      stateTrackerMock;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    location = $location;
    stateTrackerMock = {'switcherView': 'candy-list-timeline'};
    HeaderNavigation = $controller('HeaderNavigation', {
      $scope: scope,
      $location: location,
      stateTracker: stateTrackerMock
    });
  }));

  it('should default to timeline view', function () {
    expect(scope.switcher.view).toEqual('candy-list-timeline');
  });

  it('should return whether active or not based on $location.path()', function () {
    expect(scope.isActive('/candy-list-timeline')).toBe(false);
    location.path('/candy-list-timeline');
    expect(scope.isActive('/candy-list-timeline')).toBe(true);
  });

  it('should change location when switcher changes (simulate button press)', function () {
    expect(scope.switcher.view).toEqual('candy-list-timeline');
    location.path('/candy-list-timeline');
    expect(scope.isActive('/candy-list-timeline')).toBe(true);
    scope.switcher.view = 'candy-list-table';
    scope.$digest();
    expect(scope.switcher.view).toEqual('candy-list-table');
    expect(location.path()).toEqual('/candy-list-table');
  });

  it('should change switcher when location changes (simulate browsing)', function() {
    location.path('/candy-list-timeline');
    expect(scope.loc.path()).toEqual('/candy-list-timeline');
    scope.$digest();
    expect(scope.isActive('/candy-list-timeline')).toBe(true);
    expect(scope.switcher.view).toEqual('candy-list-timeline');

    location.path('/candy-list-table');
    scope.$digest();
    expect(scope.isActive('/candy-list-table')).toBe(true);
    expect(scope.switcher.view).toEqual('candy-list-table');

  });

  it('should keep track of view state (simulate browsing)', function() {
    location.path('/candy-list-timeline');
    scope.$digest();
    location.path('/candy-list-table');
    scope.$digest();
    expect(scope.switcher.view).toEqual('candy-list-table');
    expect(stateTrackerMock.switcherView).toEqual('candy-list-table');
  });

  it('should keep track of view state outside of home and back (simulate browsing)', function() {
    location.path('/candy-list-timeline');
    scope.$digest();
    // switch to table view
    scope.switcher.view = 'candy-list-table';
    scope.$digest();
    expect(stateTrackerMock.switcherView).toEqual('candy-list-table');
    location.path('/about');
    scope.$digest();
    expect(stateTrackerMock.switcherView).toEqual('candy-list-table');
    location.path('/');
    scope.$digest();
    expect(location.path()).toEqual('/candy-list-table');
    expect(scope.switcher.view).toEqual('candy-list-table');

    // switch to timeline view
    scope.switcher.view = 'candy-list-timeline';
    scope.$digest();
    expect(stateTrackerMock.switcherView).toEqual('candy-list-timeline');
    location.path('/about');
    scope.$digest();
    expect(stateTrackerMock.switcherView).toEqual('candy-list-timeline');
    location.path('/');
    scope.$digest();
    expect(location.path()).toEqual('/candy-list-timeline');
    expect(scope.switcher.view).toEqual('candy-list-timeline');
  });

});
