'use strict';

describe('Controller: CandyListTimeline', function () {

  // load the controller's module
  beforeEach(module('nasaraCandyBasketApp'));

  var CandyListTimeline,
      $scope,
      CandyResourceMock,
      tagsViewsMock,
      stateTrackerMock;

  // Setup mocked service spies
  beforeEach(function() {
    stateTrackerMock = jasmine.createSpyObj('stateTracker', ['state']);
    CandyResourceMock = jasmine.createSpyObj('CandyResource', ['state']);
    tagsViewsMock = jasmine.createSpyObj('tagsViews', ['getTagsByCandies']);
  });

  // Initialize the controller, mock scope and mocked service responses
  beforeEach(inject(function ($controller, $rootScope, $q, $timeout) {
    $scope = $rootScope.$new();

    stateTrackerMock.state.andReturn({
      timelineValues: {
        index: 0,
        /* jshint ignore:start */
        modal_open: false
        /* jshint ignore:end */
      }
    });

    tagsViewsMock.getTagsByCandies.andReturn($q.when(
      {
        'tagsByCandies': [
          {
            'candy_id': 'bd79168f4137232c9714102a08000591',
            'date': '2013-10-09T11:59:57Z',
            'tag': ['Ghislain', 'Hachey', 'Website', 'challenge']
          },
          {
            'candy_id': 'bd79168f4137232c9714102a0800094d',
            'date': '2013-10-10T11:59:08Z',
            'tag': ['Dan', 'McGarry', 'Website', 'surprise']
          }
        ]}
    ));

    CandyListTimeline = $controller('CandyListTimeline', {
      $scope: $scope,
      stateTracker: stateTrackerMock
    });
  }));

  it('should start with default initialized variables on the scope', function () {
    expect($scope.candies).toEqual([]);
    expect($scope.tags).toEqual([]);
    expect($scope.tagsData).toEqual([]);
    expect(stateTrackerMock.state).toHaveBeenCalled() ;
    expect($scope.timelineValues.index).toBe(0);
    expect($scope.timelineValues.modal_open).toBe(false);
  });

  // TODO - Write test for all logic

  it('should fetch data and assign it on scope', function () {
    expect(true).toBe(false);
  });

  it('should correctly update scope data on model-update', function () {
    expect(true).toBe(false);    
  });

  it('should correctly update scope data on tags collection change', function () {
    expect(true).toBe(false);    
  });

  it('should correctly update scope data on date slider change', function () {
    expect(true).toBe(false);    
  });

  it('should be able to change slide index', function () {
    expect(true).toBe(false);    
  });

  it('should be able to tags from cloud', function () {
    expect(true).toBe(false);    
  });

  it('should be able to tags from candy list', function () {
    expect(true).toBe(false);    
  });

});
