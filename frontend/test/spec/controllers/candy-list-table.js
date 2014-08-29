'use strict';

describe('Controller: CandyListTable', function () {

  // load the controller's module
  beforeEach(module('nasaraCandyBasketApp'));

  var CandyListTable,
      $scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    $scope = $rootScope.$new();
    CandyListTable = $controller('CandyListTable', {
      $scope: $scope
    });
  }));

  it('TODO - write some tests', function () {
    expect(true).toBe(false);
  });

});
