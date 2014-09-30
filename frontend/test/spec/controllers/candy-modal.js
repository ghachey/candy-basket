'use strict';

// TODO - Below is not the strongest set of unit tests though it is a
// start. It's a little hard to test due to interaction with several
// external dependencies, modal instance controllers and lots of
// private variable. It will improve

// For now it test that the correct calls to open a modal can be made,
// that once opened the modal_open state flag switches to true and
// there is a starting slide index. Further testing could involved
// mocking the modalInstances, mocking the CandyResource service and
// simulating full CRUD cycles

describe('Controller: CandyModal', function () {

  var mockedStateTrackerData = {
    timelineValues: {
      index: 0,
      modal_open: false
    }
  };

  // load the controller's module
  beforeEach(module('nasaraCandyBasketApp'));

  var CandyModal,
      $scope,
      $timeout,
      stateTrackerMock;

  // Initialize the controller, mock scope, mock dependant services... 
  beforeEach(function() {

    stateTrackerMock = jasmine.createSpyObj('stateTracker', ['state']);

    inject(function ($controller, $rootScope,
                     $q, _$timeout_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;
      stateTrackerMock.state.andReturn($q.when(mockedStateTrackerData));

      CandyModal = $controller('CandyModal', {
        $scope: $scope,
        stateTracker: stateTrackerMock
      });
    });

  });

  it('should have an open function defined', function () {
    expect($scope.open).toBeDefined();
  });

  it('should be able to create new candy', function () {
    $timeout.flush();
    $timeout(function() { 
      expect(stateTrackerMock.state.timelineValues.modal_open).toBe(false); 
      $scope.open('create');
      expect(stateTrackerMock.state.timelineValues.modal_open).toBe(true); 
    }, 1);
  });

  it('should be able to update a candy in table view mode', function () {
    $timeout.flush();
    $timeout(function() { 
      expect(stateTrackerMock.state.timelineValues.modal_open).toBe(false); 
      $scope.open('edit', '03c0b670e5c56bfb461a76dcf70091c7');
      expect(stateTrackerMock.state.timelineValues.modal_open).toBe(true); 
    }, 1);
  });

  it('should be able to update a candy in timeline view mode', function () {
    $timeout.flush();
    $timeout(function() { 
      expect(stateTrackerMock.state.timelineValues.index).toBe(0); 
      expect(stateTrackerMock.state.timelineValues.modal_open).toBe(false); 
      $scope.open('edit');
      expect(stateTrackerMock.state.timelineValues.modal_open).toBe(true); 
    }, 1);
  });

  it('should be able to delete a candy in table view mode', function () {
    $timeout.flush();
    $timeout(function() { 
      expect(stateTrackerMock.state.timelineValues.modal_open).toBe(false); 
      $scope.open('delete', '03c0b670e5c56bfb461a76dcf70091c7');
      expect(stateTrackerMock.state.timelineValues.modal_open).toBe(true); 
    }, 1);
  });

  it('should be able to delete a candy in timeline view mode', function () {
    $timeout.flush();
    $timeout(function() { 
      expect(stateTrackerMock.state.timelineValues.index).toBe(0); 
      expect(stateTrackerMock.state.timelineValues.modal_open).toBe(false); 
      $scope.open('delete');
      expect(stateTrackerMock.state.timelineValues.modal_open).toBe(true); 
    }, 1);
  });

});
