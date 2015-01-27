'use strict';

describe('Controller: HeaderNavigation', function () {

  // load the controller's module
  beforeEach(module('nasaraCandyBasketApp'));

  var HeaderNavigation,
      scope,
      location;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location) {
    scope = $rootScope.$new();
    location = $location;
    HeaderNavigation = $controller('HeaderNavigation', {
      $scope: scope,
      $location: location
    });
  }));

  it('should default to timeline view', function () {
    expect(scope.switcher).toEqual('candy-list-timeline');
  });

  it('should return whether active or not based on $location.path()', function () {
    expect(scope.isActive('/candy-list-timeline')).toBe(false);
    location.path('/candy-list-timeline');
    expect(scope.isActive('/candy-list-timeline')).toBe(true);
  });

  it('should change location when switcher changes', function () {
    expect(scope.switcher).toEqual('candy-list-timeline');
    location.path('/candy-list-timeline');
    expect(scope.isActive('/candy-list-timeline')).toBe(true);
    scope.switcher = 'candy-list-table';
    scope.$digest();
    expect(scope.switcher).toEqual('candy-list-table');
    expect(location.path()).toEqual('/candy-list-table');
  });

});
