'use strict';

describe('Controller: CandyListTimeline', function () {

  // load the controller's module
  beforeEach(module('nasaraCandyBasketApp'));

  var CandyListTimeline,
      $scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    CandyListTimeline = $controller('CandyListTimeline', {
      $scope: $scope
    });
  }));

  it('TODO - write some tests', function () {
    expect(true).toBe(false);
  });

});
