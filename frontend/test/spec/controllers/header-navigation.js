'use strict';

describe('Controller: HeaderNavigation', function () {

  // load the controller's module
  beforeEach(module('nasaraCandyBasketApp'));

  var HeaderNavigation,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    var locationMock = {};
    locationMock.path = function() {
      return '/candy-list-timeline';
    };
    HeaderNavigation = $controller('HeaderNavigation', {
      $scope: scope,
      $location: locationMock
    });
  }));

  it('should return whether active or not based on $location.path()', function () {
    expect(scope.isActive('/candy-list-timeline')).toBe(true);
  });
});
