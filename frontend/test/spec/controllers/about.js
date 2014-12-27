'use strict';

describe('Controller: About', function () {

  var mockedMetaData = {'name':'Candy Basket','version':0.3};

  // load the controller's module
  beforeEach(module('nasaraCandyBasketApp'));

  var About,
      $scope,
      $timeout,
      $location,
      metaMock;

  // Initialize the controller and a mock scope
  beforeEach(function() {

    metaMock = jasmine.createSpyObj('meta', ['getMeta']);

    inject(function ($controller, $rootScope, $q, _$timeout_, _$location_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      $location = _$location_;
      metaMock.getMeta.and.returnValue($q.when(mockedMetaData));

      About = $controller('About', {
        $scope: $scope,
        meta: metaMock
      });
    });

  });

  it('should contain getStarted function on the scope redirecting url', function () {
    expect($scope.getStarted).toBeDefined();
    $scope.getStarted();
    expect($location.url()).toEqual('/candy-list-timeline');
  });

  it('should retrieve the backend API service meta information', function () {
    expect(metaMock.getMeta).toHaveBeenCalled();
    $timeout.flush();
    $timeout(function() { 
      expect($scope.info).toEqual(mockedMetaData); 
    }, 1);
  });

});
