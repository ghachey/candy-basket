'use strict';

// TODO - Below is not the strongest set of unit tests though it is a
// start. It's a little hard to test due to interaction with several
// external dependencies, modal instance controllers and lots of
// private variable. It will improve

// For now its testing that the correct calls to open a modal can be
// made, that it was properly defined, that before that once called
// (opened) the modal_open state flag switches to true (from false)
// and there is a starting slide index.

// I've started mocking the the Candy Resources but a few more things
// would need to be mocked to fully unit test the full CRUD cycles and
// other auxiliary operations here. Next things would be the mock the
// $filter('candiesByTags') and $filter('orderBy') filters so it won't
// use the real ones. How about testing the broadcasting and the use
// of rootScope?

describe('Controller: CandyModal', function () {

  var CandyModal,
      $scope,
      $timeout,
      stateTrackerMock;


  var CandyResourceMock = jasmine.createSpyObj('CandyResource', 
                                               ['create', 'read', 
                                                'update', 'remove', 
                                                'query']);


  var candies = [
    {
      '_id': '03c0b670e5c56bfb461a76dcf70091c7',
      'source': 'https://getsyme.com/#',
      'title': 'SYME - encrypted social network',
      'description': '<p>Kind of like Policy Circles, and soon to be open.</p>',
      'tags': [
        'social media',
        'internet',
        'surveillance',
        'security',
        'ict',
        'dan',
        'surprise'
      ],
      'date': '2013-11-30T22:51:41Z',
      'private': false
    },
    {
      '_id': '03c0b670e5c56bfb461a76dcf7009b61',
      'source': 'https://medium.com/the-physics-arxiv-blog/863c05238a41',
      'title': 'Capitalisation -not domestic spending- can get countries out of',
      'description': '<p>Note especially the strong link between healthy</p>',
      'tags': [
        'health',
        'economics',
        'poverty',
        'dan',
        'confirm'
      ],
      'date': '2013-11-30T23:02:40Z',
      'private': false
    },
    {
      '_id': '03c0b670e5c56bfb461a76dcf700a467',
      'source': 'http://thediplomat.com/2013/12/maritime-rules-of-the-road/',
      'title': 'Time for US and China to Establish Maritime Rules',
      'description': '<p>So far, there\'s been no repeat of the 2001 collision.</p>',
      'tags': [
        'confirm',
        'trevz',
        'geopolitics',
        'china',
        'usa'
      ],
      'date': '2013-12-04T19:53:45Z',
      'private': false
    }
  ];


  // load the controller's module
  beforeEach(module('nasaraCandyBasketApp'));

  // Initialize the controller, mock scope, mock dependant services... 
  beforeEach(function() {

    stateTrackerMock = {
      state: {
        timelineValues: {
          index: 0,
          modal_open: false
        }
      }
    };

    inject(function ($controller, $rootScope,
                     $q, _$timeout_) {
      $scope = $rootScope.$new();
      $timeout = _$timeout_;

      CandyResourceMock.read.and.callFake(function(candyId) { 
        return { $promise: $q.when(candies[candyId]) }; 
      });
      
      var candie1 = CandyResourceMock.read('03c0b670e5c56bfb461a76dcf70091c7');
      var candie2 = CandyResourceMock.read('03c0b670e5c56bfb461a76dcf7009b61');
      var candie3 = CandyResourceMock.read('03c0b670e5c56bfb461a76dcf700a467');

      $scope.candies = [candie1, candie2, candie3];
      $scope.tags = [];

      CandyModal = $controller('CandyModal', {
        $scope: $scope,
        stateTracker: stateTrackerMock
      });
    });

  });

  it('should have an open function defined but not called', function () {
    spyOn($scope, 'open').and.callThrough();
    expect($scope.open).toBeDefined();
    expect($scope.open).not.toHaveBeenCalled();
  });

  it('should be able to call the open function', function () {
    spyOn($scope, 'open').and.callThrough();
    expect(stateTrackerMock.state).toBeDefined();
    $scope.open('create');
    expect($scope.open).toHaveBeenCalled();
  });

  it('should be able to create new candy', function () {
    spyOn($scope, 'open').and.callThrough();
    expect($scope.open).not.toHaveBeenCalled();
    expect(stateTrackerMock.state.timelineValues.modal_open).toBe(false); 
    $scope.open('create');
    expect(stateTrackerMock.state.timelineValues.modal_open).toBe(true); 
  });

  it('should be able to update a candy in table view mode', function () {
    expect(stateTrackerMock.state.timelineValues.modal_open).toBe(false); 
    $scope.open('edit', '03c0b670e5c56bfb461a76dcf70091c7');
    expect(stateTrackerMock.state.timelineValues.modal_open).toBe(true); 
  });

  // it('should be able to update a candy in timeline view mode', function () {
  //   expect(stateTrackerMock.state.timelineValues.index).toBe(0); 
  //   expect(stateTrackerMock.state.timelineValues.modal_open).toBe(false); 
  //   $scope.open('edit');
  //   expect(stateTrackerMock.state.timelineValues.modal_open).toBe(true); 
  // });

  it('should be able to delete a candy in table view mode', function () {
    expect(stateTrackerMock.state.timelineValues.modal_open).toBe(false); 
    $scope.open('delete', '03c0b670e5c56bfb461a76dcf70091c7');
    expect(stateTrackerMock.state.timelineValues.modal_open).toBe(true); 
  });

  // it('should be able to delete a candy in timeline view mode', function () {
  //   expect(stateTrackerMock.state.timelineValues.index).toBe(0); 
  //   expect(stateTrackerMock.state.timelineValues.modal_open).toBe(false); 
  //   $scope.open('delete');
  //   expect(stateTrackerMock.state.timelineValues.modal_open).toBe(true); 
  // });

});
